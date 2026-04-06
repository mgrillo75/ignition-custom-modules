import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    applyEdgeChanges,
    applyNodeChanges,
    Background,
    Controls,
    ReactFlow,
    ReactFlowProvider
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { Toolbox } from "./toolbox";
const {
    decorateEdgesForRender,
    decorateNodesForRender,
    viewportNeedsSync
} = require("./canvas-render-state");
import { ConnectorEdge } from "../edges/connector-edge";
import { FreeEndpointAnchorNode } from "../nodes/free-endpoint-anchor-node";
import { SvgNode } from "../nodes/svg-node";
import { UnknownNode } from "../nodes/unknown-node";
import "../styles/xy-flow-canvas.css";

const {
    CONNECTOR_EDGE_TYPE,
    DEFAULT_TOOLBOX_ITEMS,
    FREE_ENDPOINT_NODE_TYPE,
    NODE_LIBRARY,
    UNKNOWN_NODE_RENDER_TYPE,
    getNodeDefinition
} = require("../nodes/node-definitions");
const {
    createDiagramNode,
    createEmptyDocument,
    createLooseConnector,
    createSampleDocument,
    getSelectionFromElements,
    moveDiagramNode,
    normalizeDocument,
    reconnectConnectorEndpoint,
    sanitizeViewport,
    snapCanvasPosition
} = require("../state/document-model");
const { resolvePropWriter, writeCanvasProps } = require("../state/prop-writer");

const nodeTypes = Object.assign(
    Object.fromEntries(Object.keys(NODE_LIBRARY).map((nodeType) => [nodeType, SvgNode])),
    {
        [FREE_ENDPOINT_NODE_TYPE]: FreeEndpointAnchorNode,
        [UNKNOWN_NODE_RENDER_TYPE]: UnknownNode
    }
);

const edgeTypes = {
    [CONNECTOR_EDGE_TYPE]: ConnectorEdge
};

function asArray(value) {
    return Array.isArray(value) ? value : [];
}

function hasUserDocument(document) {
    return !!document && (asArray(document.nodes).length > 0 || asArray(document.edges).length > 0);
}

function buildInitialDocument(document) {
    return hasUserDocument(document) ? normalizeDocument(document) : createEmptyDocument();
}

function resolveCanvasSettings(settings) {
    const safeSettings = settings && typeof settings === "object" ? settings : {};
    const gridSize = Number(safeSettings.gridSize);
    const snapDistance = Number(safeSettings.snapDistance);

    return {
        showGrid: safeSettings.showGrid !== false,
        snapToGrid: safeSettings.snapToGrid !== false,
        gridSize: Number.isFinite(gridSize) && gridSize > 0 ? gridSize : 16,
        snapDistance: Number.isFinite(snapDistance) && snapDistance >= 0 ? snapDistance : 18,
        readOnly: !!safeSettings.readOnly
    };
}

function createSnapshot(document, viewport, selection) {
    return JSON.stringify({
        document,
        viewport,
        selection
    });
}

function buildToolboxItems(toolboxProps) {
    const rawItems = toolboxProps && Array.isArray(toolboxProps.items) ? toolboxProps.items : [];
    if (!rawItems.length) {
        return DEFAULT_TOOLBOX_ITEMS.slice();
    }

    return rawItems
        .filter((item) => {
            if (!item || (item.kind !== "node" && item.kind !== "edge")) {
                return false;
            }

            if (item.kind === "node") {
                return !!getNodeDefinition(item.nodeType);
            }

            return true;
        })
        .map((item) => ({
            id: String(item.id),
            kind: item.kind,
            label: String(item.label || item.id),
            nodeType: item.nodeType ? String(item.nodeType) : undefined
        }));
}

function nextNumericId(collection, prefix) {
    const values = collection
        .map((item) => String(item.id || ""))
        .filter((value) => value.startsWith(`${prefix}-`))
        .map((value) => Number(value.slice(prefix.length + 1)))
        .filter((value) => Number.isFinite(value));
    const maxValue = values.length ? Math.max(...values) : 0;
    return `${prefix}-${maxValue + 1}`;
}

function buildCanvasNode(document, nodeType, position) {
    const definition = getNodeDefinition(nodeType);
    if (!definition) {
        return null;
    }
    return createDiagramNode(
        nodeType,
        nextNumericId(document.nodes.filter((node) => node.type !== FREE_ENDPOINT_NODE_TYPE), nodeType),
        {
            x: position.x - definition.width / 2,
            y: position.y - definition.height / 2
        }
    );
}

function getClientPoint(event) {
    if (typeof event.clientX === "number" && typeof event.clientY === "number") {
        return {
            x: event.clientX,
            y: event.clientY
        };
    }

    const touch = event.changedTouches && event.changedTouches[0];
    if (touch) {
        return {
            x: touch.clientX,
            y: touch.clientY
        };
    }

    return null;
}

function CanvasEditor(props) {
    const writer = useMemo(() => resolvePropWriter(props.store), [props.store]);
    const canvasSettings = useMemo(() => resolveCanvasSettings(props.perspectiveProps.settings), [props.perspectiveProps.settings]);
    const readOnly = canvasSettings.readOnly;
    const toolboxItems = useMemo(() => buildToolboxItems(props.perspectiveProps.toolbox), [props.perspectiveProps.toolbox]);
    const [documentState, setDocumentState] = useState(() => buildInitialDocument(props.perspectiveProps.document));
    const [viewport, setViewport] = useState(() => sanitizeViewport(props.perspectiveProps.viewport));
    const [selection, setSelection] = useState(() => getSelectionFromElements(props.perspectiveProps.selection));
    const [pendingToolId, setPendingToolId] = useState(null);
    const flowRef = useRef(null);
    const documentRef = useRef(documentState);
    const viewportRef = useRef(viewport);
    const selectionRef = useRef(selection);
    const lastWrittenSnapshotRef = useRef(null);
    const pendingReconnectRef = useRef(null);
    const reconnectCompletedRef = useRef(false);

    const persistState = useCallback((nextDocument, nextViewport, nextSelection) => {
        const snapshot = createSnapshot(nextDocument, nextViewport, nextSelection);
        lastWrittenSnapshotRef.current = snapshot;
        writeCanvasProps(writer, {
            document: nextDocument,
            viewport: nextViewport,
            selection: nextSelection
        });
    }, [writer]);

    const updateDocument = useCallback((updater, persistImmediately) => {
        setDocumentState((previousDocument) => {
            const nextDocument = normalizeDocument(typeof updater === "function" ? updater(previousDocument) : updater);
            documentRef.current = nextDocument;
            if (persistImmediately) {
                persistState(nextDocument, viewportRef.current, selectionRef.current);
            }
            return nextDocument;
        });
    }, [persistState]);

    useEffect(() => {
        const nextDocument = buildInitialDocument(props.perspectiveProps.document);
        const nextViewport = sanitizeViewport(props.perspectiveProps.viewport);
        const nextSelection = getSelectionFromElements(props.perspectiveProps.selection);
        const nextSnapshot = createSnapshot(nextDocument, nextViewport, nextSelection);
        const previousViewport = viewportRef.current;

        if (lastWrittenSnapshotRef.current === nextSnapshot) {
            return;
        }

        documentRef.current = nextDocument;
        viewportRef.current = nextViewport;
        selectionRef.current = nextSelection;
        setDocumentState(nextDocument);
        setViewport(nextViewport);
        setSelection(nextSelection);

        if (flowRef.current && viewportNeedsSync(previousViewport, nextViewport)) {
            flowRef.current.setViewport(nextViewport, { duration: 0 });
        }
    }, [props.instanceId, props.perspectiveProps.document, props.perspectiveProps.selection, props.perspectiveProps.viewport]);

    const pendingTool = toolboxItems.find((item) => item.id === pendingToolId) || null;
    const isCanvasEmpty = !hasUserDocument(documentState);
    const renderedNodes = useMemo(
        () => decorateNodesForRender(documentState.nodes, selection, props.instanceId, documentState.edges),
        [documentState.edges, documentState.nodes, props.instanceId, selection]
    );
    const renderedEdges = useMemo(
        () => decorateEdgesForRender(documentState.edges, selection, props.instanceId),
        [documentState.edges, props.instanceId, selection]
    );

    const handleSelectTool = useCallback((toolItem) => {
        setPendingToolId((currentValue) => (currentValue === toolItem.id ? null : toolItem.id));
    }, []);

    const handleInsertSample = useCallback(() => {
        if (readOnly) {
            return;
        }

        const nextDocument = createSampleDocument();
        const nextSelection = {
            nodeIds: [],
            edgeIds: []
        };

        documentRef.current = nextDocument;
        selectionRef.current = nextSelection;
        setDocumentState(nextDocument);
        setSelection(nextSelection);
        persistState(nextDocument, viewportRef.current, nextSelection);
    }, [persistState, readOnly]);

    const handlePaneClick = useCallback((event) => {
        if (!pendingTool || readOnly || !flowRef.current) {
            return;
        }

        const clientPoint = getClientPoint(event);
        if (!clientPoint) {
            return;
        }

        const flowPosition = snapCanvasPosition(
            flowRef.current.screenToFlowPosition(clientPoint),
            canvasSettings
        );

        if (pendingTool.kind === "node" && pendingTool.nodeType) {
            updateDocument((previousDocument) => {
                const nextNode = buildCanvasNode(previousDocument, pendingTool.nodeType, flowPosition);
                if (!nextNode) {
                    return previousDocument;
                }

                return {
                    nodes: previousDocument.nodes.concat(nextNode),
                    edges: previousDocument.edges
                };
            }, true);
        } else if (pendingTool.kind === "edge") {
            updateDocument((previousDocument) => createLooseConnector(previousDocument, {
                connectorId: nextNumericId(previousDocument.edges, "connector"),
                position: flowPosition
            }), true);
        }

        setPendingToolId(null);
    }, [canvasSettings, pendingTool, readOnly, updateDocument]);

    const handleNodesChange = useCallback((changes) => {
        updateDocument((previousDocument) => ({
            nodes: applyNodeChanges(changes, previousDocument.nodes),
            edges: previousDocument.edges
        }));
    }, [updateDocument]);

    const handleEdgesChange = useCallback((changes) => {
        updateDocument((previousDocument) => ({
            nodes: previousDocument.nodes,
            edges: applyEdgeChanges(changes, previousDocument.edges)
        }));
    }, [updateDocument]);

    const handleSelectionChange = useCallback((currentSelection) => {
        const nextSelection = {
            nodeIds: (currentSelection.nodes || []).filter((node) => node.type !== FREE_ENDPOINT_NODE_TYPE).map((node) => node.id),
            edgeIds: (currentSelection.edges || []).map((edge) => edge.id)
        };
        selectionRef.current = nextSelection;
        setSelection(nextSelection);
        persistState(documentRef.current, viewportRef.current, nextSelection);
    }, [persistState]);

    const handleMoveEnd = useCallback((_, currentViewport) => {
        const nextViewport = sanitizeViewport(currentViewport);
        viewportRef.current = nextViewport;
        setViewport(nextViewport);
        persistState(documentRef.current, nextViewport, selectionRef.current);
    }, [persistState]);

    const handleReconnectStart = useCallback((_, edge, handleType) => {
        pendingReconnectRef.current = {
            connectorId: edge.id,
            endpoint: handleType === "target" ? "target" : "source"
        };
        reconnectCompletedRef.current = false;
    }, []);

    const handleReconnect = useCallback((oldEdge, connection) => {
        const endpoint = pendingReconnectRef.current && pendingReconnectRef.current.endpoint === "target" ? "target" : "source";
        const nodeId = endpoint === "source" ? connection.source : connection.target;
        const handleId = endpoint === "source" ? connection.sourceHandle : connection.targetHandle;

        reconnectCompletedRef.current = true;
        updateDocument((previousDocument) => reconnectConnectorEndpoint(previousDocument, {
            connectorId: oldEdge.id,
            endpoint,
            drop: {
                kind: "attached",
                nodeId,
                handleId
            }
        }), true);
    }, [updateDocument]);

    const handleReconnectEnd = useCallback((event, _, __, connectionState) => {
        if (!pendingReconnectRef.current || reconnectCompletedRef.current || (connectionState && connectionState.isValid) || !flowRef.current || readOnly) {
            pendingReconnectRef.current = null;
            return;
        }

        const clientPoint = getClientPoint(event);
        if (!clientPoint) {
            pendingReconnectRef.current = null;
            return;
        }

        const flowPosition = snapCanvasPosition(
            flowRef.current.screenToFlowPosition(clientPoint),
            canvasSettings
        );

        updateDocument((previousDocument) => reconnectConnectorEndpoint(previousDocument, {
            connectorId: pendingReconnectRef.current.connectorId,
            endpoint: pendingReconnectRef.current.endpoint,
            drop: {
                kind: "free",
                position: flowPosition
            }
        }), true);

        pendingReconnectRef.current = null;
    }, [canvasSettings, readOnly, updateDocument]);

    const handleNodeDragStop = useCallback((_, node) => {
        if (!node || readOnly) {
            persistState(documentRef.current, viewportRef.current, selectionRef.current);
            return;
        }

        updateDocument((previousDocument) => moveDiagramNode(previousDocument, {
            nodeId: node.id,
            position: node.position,
            snapToGrid: canvasSettings.snapToGrid,
            gridSize: canvasSettings.gridSize,
            snapDistance: canvasSettings.snapDistance
        }), true);
    }, [canvasSettings.gridSize, canvasSettings.snapDistance, canvasSettings.snapToGrid, persistState, readOnly, updateDocument]);

    const stopDesignerIntercept = useCallback((e) => {
        e.stopPropagation();
    }, []);

    return React.createElement(
        "div",
        {
            className: "xyfc__canvas-shell",
            onMouseDown: stopDesignerIntercept,
            onPointerDown: stopDesignerIntercept,
            onDoubleClick: stopDesignerIntercept,
            onContextMenu: stopDesignerIntercept
        },
        React.createElement(Toolbox, {
            hidden: props.perspectiveProps.toolbox && props.perspectiveProps.toolbox.visible === false,
            items: toolboxItems,
            pendingToolId,
            pendingToolLabel: pendingTool ? pendingTool.label : null,
            onSelect: handleSelectTool,
            onInsertSample: handleInsertSample,
            isCanvasEmpty,
            readOnly
        }),
        React.createElement(
            "div",
            {
                className: `xyfc__canvas-stage ${pendingTool ? "xyfc__canvas-stage--placement" : ""}`
            },
            React.createElement(ReactFlow, {
                id: props.instanceId,
                nodes: renderedNodes,
                edges: renderedEdges,
                nodeTypes,
                edgeTypes,
                onInit: (instance) => {
                    flowRef.current = instance;
                    instance.setViewport(viewportRef.current, { duration: 0 });
                },
                onPaneClick: handlePaneClick,
                onNodesChange: handleNodesChange,
                onEdgesChange: handleEdgesChange,
                onReconnectStart: handleReconnectStart,
                onReconnect: handleReconnect,
                onReconnectEnd: handleReconnectEnd,
                onSelectionChange: handleSelectionChange,
                onMoveEnd: handleMoveEnd,
                onNodeDragStop: handleNodeDragStop,
                nodesConnectable: !readOnly,
                nodesDraggable: !readOnly,
                elementsSelectable: true,
                edgesReconnectable: !readOnly,
                deleteKeyCode: null,
                fitView: false,
                minZoom: 0.3,
                maxZoom: 2.5,
                snapToGrid: canvasSettings.snapToGrid,
                snapGrid: [canvasSettings.gridSize, canvasSettings.gridSize],
                className: "xyfc__react-flow"
            },
            canvasSettings.showGrid
                ? React.createElement(Background, {
                    id: `${props.instanceId}__grid`,
                    gap: canvasSettings.gridSize,
                    color: "rgba(148, 163, 184, 0.18)"
                })
                : null,
            React.createElement(Controls, {
                showInteractive: false,
                className: "xyfc__controls"
            })
            )
        )
    );
}

export function XYFlowCanvasApp(props) {
    return React.createElement(
        ReactFlowProvider,
        null,
        React.createElement(CanvasEditor, props)
    );
}
