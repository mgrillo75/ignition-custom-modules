const {
    CONNECTOR_EDGE_TYPE,
    FREE_ENDPOINT_NODE_TYPE,
    FREE_SOURCE_HANDLE_ID,
    FREE_TARGET_HANDLE_ID,
    getNodeDefinition
} = require("../nodes/node-definitions");
const {
    canonicalizeHandleId,
    getDefaultHandleId
} = require("../nodes/handle-ids");

function deepClone(value) {
    return JSON.parse(JSON.stringify(value));
}

function asObject(value, fallback) {
    return value && typeof value === "object" ? value : fallback;
}

function asArray(value) {
    return Array.isArray(value) ? value : [];
}

function toNumber(value, fallback) {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : fallback;
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function createEmptyDocument() {
    return {
        nodes: [],
        edges: []
    };
}

function makeAnchorNodeId(connectorId, endpoint) {
    return `${connectorId}__${endpoint}-anchor`;
}

function buildFreeEndpoint(connectorId, endpoint, position) {
    return {
        kind: "free",
        x: toNumber(position.x, 0),
        y: toNumber(position.y, 0),
        anchorNodeId: makeAnchorNodeId(connectorId, endpoint)
    };
}

function buildAttachedEndpoint(nodeId, handleId, endpoint) {
    return {
        kind: "attached",
        nodeId: String(nodeId || ""),
        handleId: canonicalizeHandleId(handleId, endpoint)
    };
}

function buildAnchorNode(connectorId, endpoint, position) {
    return {
        id: makeAnchorNodeId(connectorId, endpoint),
        type: FREE_ENDPOINT_NODE_TYPE,
        position: {
            x: toNumber(position.x, 0),
            y: toNumber(position.y, 0)
        },
        origin: [0.5, 0.5],
        draggable: false,
        selectable: false,
        connectable: false,
        data: {
            connectorId,
            endpoint
        },
        style: {
            width: 14,
            height: 14
        }
    };
}

function normalizeNode(node, index) {
    if (node && node.type === FREE_ENDPOINT_NODE_TYPE) {
        return {
            id: String(node.id || `anchor-${index + 1}`),
            type: FREE_ENDPOINT_NODE_TYPE,
            position: {
                x: toNumber(node.position && node.position.x, 0),
                y: toNumber(node.position && node.position.y, 0)
            },
            origin: Array.isArray(node.origin) ? node.origin : [0.5, 0.5],
            draggable: false,
            selectable: false,
            connectable: false,
            data: asObject(node.data, {}),
            style: Object.assign({ width: 14, height: 14 }, asObject(node.style, {}))
        };
    }

    const requestedType = String((node && node.type) || "unknown-node");
    const definition = getNodeDefinition(requestedType);

    if (!definition) {
        return {
            id: String((node && node.id) || `unknown-node-${index + 1}`),
            type: requestedType,
            position: {
                x: toNumber(node && node.position && node.position.x, index * 60),
                y: toNumber(node && node.position && node.position.y, index * 40)
            },
            data: Object.assign(
                {
                    __xyfcUnknownType: requestedType
                },
                asObject(node && node.data, {})
            ),
            style: Object.assign(
                {
                    width: toNumber(node && node.style && node.style.width, 168),
                    height: toNumber(node && node.style && node.style.height, 96)
                },
                asObject(node && node.style, {})
            )
        };
    }

    return {
        id: String((node && node.id) || `${requestedType}-${index + 1}`),
        type: definition.type,
        position: {
            x: toNumber(node && node.position && node.position.x, index * 60),
            y: toNumber(node && node.position && node.position.y, index * 40)
        },
        data: Object.assign({}, deepClone(definition.dataDefaults || {}), asObject(node && node.data, {})),
        style: Object.assign(
            {
                width: definition.width,
                height: definition.height
            },
            asObject(node && node.style, {})
        )
    };
}

function normalizeEdge(edge, nodesById, index) {
    const baseStyle = Object.assign(
        {
            stroke: "#38bdf8",
            strokeWidth: 3,
            glowIntensity: 0.55,
            animated: false,
            route: "orthogonal",
            markerEnd: "arrow"
        },
        asObject(edge && edge.style, {})
    );

    const metadata = asObject(baseStyle.__xyflowCanvas, {});
    const connectorId = String((edge && edge.id) || `connector-${index + 1}`);
    const sourceNode = nodesById.get(edge && edge.source);
    const targetNode = nodesById.get(edge && edge.target);

    const sourceEndpoint = metadata.sourceEndpoint
        ? normalizeEndpointState(metadata.sourceEndpoint, connectorId, "source")
        : inferEndpointState(sourceNode, edge && edge.source, edge && edge.sourceHandle, connectorId, "source");

    const targetEndpoint = metadata.targetEndpoint
        ? normalizeEndpointState(metadata.targetEndpoint, connectorId, "target")
        : inferEndpointState(targetNode, edge && edge.target, edge && edge.targetHandle, connectorId, "target");

    baseStyle.__xyflowCanvas = {
        sourceEndpoint,
        targetEndpoint
    };

    return {
        id: connectorId,
        source: sourceEndpoint.kind === "free" ? sourceEndpoint.anchorNodeId : sourceEndpoint.nodeId,
        sourceHandle: sourceEndpoint.kind === "free" ? FREE_SOURCE_HANDLE_ID : sourceEndpoint.handleId,
        target: targetEndpoint.kind === "free" ? targetEndpoint.anchorNodeId : targetEndpoint.nodeId,
        targetHandle: targetEndpoint.kind === "free" ? FREE_TARGET_HANDLE_ID : targetEndpoint.handleId,
        type: edge && edge.type ? edge.type : CONNECTOR_EDGE_TYPE,
        label: typeof (edge && edge.label) === "string" ? edge.label : "",
        style: baseStyle,
        reconnectable: true
    };
}

function inferEndpointState(node, nodeId, handleId, connectorId, endpoint) {
    if (node && node.type === FREE_ENDPOINT_NODE_TYPE) {
        return buildFreeEndpoint(connectorId, endpoint, node.position || { x: 0, y: 0 });
    }
    return buildAttachedEndpoint(nodeId, handleId || getDefaultHandleId(endpoint), endpoint);
}

function normalizeEndpointState(endpointState, connectorId, endpoint) {
    if (endpointState && endpointState.kind === "attached") {
        return buildAttachedEndpoint(endpointState.nodeId, endpointState.handleId, endpoint);
    }
    return buildFreeEndpoint(connectorId, endpoint, {
        x: toNumber(endpointState && endpointState.x, 0),
        y: toNumber(endpointState && endpointState.y, 0)
    });
}

function ensureFreeEndpointNode(nodesById, nodes, endpointState, connectorId, endpoint) {
    if (endpointState.kind !== "free") {
        return;
    }

    const anchorId = endpointState.anchorNodeId || makeAnchorNodeId(connectorId, endpoint);
    endpointState.anchorNodeId = anchorId;
    const anchorNode = buildAnchorNode(connectorId, endpoint, endpointState);
    nodesById.set(anchorId, anchorNode);
    const existingIndex = nodes.findIndex((node) => node.id === anchorId);
    if (existingIndex >= 0) {
        nodes[existingIndex] = anchorNode;
    } else {
        nodes.push(anchorNode);
    }
}

function normalizeDocument(document) {
    const rawDocument = asObject(document, { nodes: [], edges: [] });
    const nodes = asArray(rawDocument.nodes).map(normalizeNode);
    const nodesById = new Map(nodes.map((node) => [node.id, node]));
    const edges = asArray(rawDocument.edges).map((edge, index) => normalizeEdge(edge, nodesById, index));

    for (const edge of edges) {
        const metadata = edge.style.__xyflowCanvas;
        ensureFreeEndpointNode(nodesById, nodes, metadata.sourceEndpoint, edge.id, "source");
        ensureFreeEndpointNode(nodesById, nodes, metadata.targetEndpoint, edge.id, "target");
    }

    return { nodes, edges };
}

function createDiagramNode(nodeType, nodeId, position, dataOverrides) {
    const definition = getNodeDefinition(nodeType);
    if (!definition) {
        throw new Error(`Unknown XY Flow node type: ${nodeType}`);
    }

    return {
        id: String(nodeId),
        type: definition.type,
        position: {
            x: toNumber(position.x, 0),
            y: toNumber(position.y, 0)
        },
        data: Object.assign({}, deepClone(definition.dataDefaults || {}), asObject(dataOverrides, {})),
        style: {
            width: definition.width,
            height: definition.height
        }
    };
}

function createLooseConnector(document, options) {
    const workingDocument = normalizeDocument(document);
    const connectorId = String(options && options.connectorId ? options.connectorId : `connector-${workingDocument.edges.length + 1}`);
    const center = {
        x: toNumber(options && options.position && options.position.x, 0),
        y: toNumber(options && options.position && options.position.y, 0)
    };
    const sourceEndpoint = buildFreeEndpoint(connectorId, "source", { x: center.x - 80, y: center.y });
    const targetEndpoint = buildFreeEndpoint(connectorId, "target", { x: center.x + 80, y: center.y });

    const nextDocument = {
        nodes: workingDocument.nodes.filter((node) => node.id !== sourceEndpoint.anchorNodeId && node.id !== targetEndpoint.anchorNodeId),
        edges: workingDocument.edges.slice()
    };

    nextDocument.nodes.push(buildAnchorNode(connectorId, "source", sourceEndpoint));
    nextDocument.nodes.push(buildAnchorNode(connectorId, "target", targetEndpoint));
    nextDocument.edges.push({
        id: connectorId,
        source: sourceEndpoint.anchorNodeId,
        sourceHandle: FREE_SOURCE_HANDLE_ID,
        target: targetEndpoint.anchorNodeId,
        targetHandle: FREE_TARGET_HANDLE_ID,
        type: CONNECTOR_EDGE_TYPE,
        label: "",
        reconnectable: true,
        style: {
            stroke: "#38bdf8",
            strokeWidth: 3,
            glowIntensity: 0.55,
            route: "orthogonal",
            markerEnd: "arrow",
            __xyflowCanvas: {
                sourceEndpoint,
                targetEndpoint
            }
        }
    });

    return nextDocument;
}

function snapCoordinateToGrid(value, gridSize, snapDistance) {
    const snappedValue = Math.round(value / gridSize) * gridSize;
    return Math.abs(snappedValue - value) <= snapDistance ? snappedValue : value;
}

function snapCanvasPosition(position, options) {
    const rawPosition = {
        x: toNumber(position && position.x, 0),
        y: toNumber(position && position.y, 0)
    };

    if (!options || !options.snapToGrid) {
        return rawPosition;
    }

    const gridSize = Math.max(1, toNumber(options.gridSize, 16));
    const snapDistance = Math.max(0, toNumber(options.snapDistance, gridSize));

    return {
        x: snapCoordinateToGrid(rawPosition.x, gridSize, snapDistance),
        y: snapCoordinateToGrid(rawPosition.y, gridSize, snapDistance)
    };
}

function reconnectConnectorEndpoint(document, options) {
    const workingDocument = normalizeDocument(document);
    const connectorId = String(options.connectorId);
    const endpoint = options.endpoint === "target" ? "target" : "source";
    const anchorNodeId = makeAnchorNodeId(connectorId, endpoint);
    const edgeIndex = workingDocument.edges.findIndex((edge) => edge.id === connectorId);

    if (edgeIndex < 0) {
        return workingDocument;
    }

    const edge = deepClone(workingDocument.edges[edgeIndex]);
    const metadata = edge.style.__xyflowCanvas || {};
    const remainingNodes = workingDocument.nodes.filter((node) => node.id !== anchorNodeId);
    const drop = asObject(options.drop, {});

    let nextEndpointState;
    if (drop.kind === "attached") {
        const targetNode = workingDocument.nodes.find((node) => node.id === String(drop.nodeId));
        if (targetNode && targetNode.type === FREE_ENDPOINT_NODE_TYPE) {
            nextEndpointState = buildFreeEndpoint(connectorId, endpoint, targetNode.position || {});
            remainingNodes.push(buildAnchorNode(connectorId, endpoint, nextEndpointState));
        } else {
            nextEndpointState = buildAttachedEndpoint(drop.nodeId, drop.handleId, endpoint);
        }
    } else {
        nextEndpointState = buildFreeEndpoint(connectorId, endpoint, drop.position || {});
        remainingNodes.push(buildAnchorNode(connectorId, endpoint, nextEndpointState));
    }

    metadata[`${endpoint}Endpoint`] = nextEndpointState;
    edge.style.__xyflowCanvas = metadata;

    if (endpoint === "source") {
        edge.source = nextEndpointState.kind === "free" ? nextEndpointState.anchorNodeId : nextEndpointState.nodeId;
        edge.sourceHandle = nextEndpointState.kind === "free" ? FREE_SOURCE_HANDLE_ID : nextEndpointState.handleId;
    } else {
        edge.target = nextEndpointState.kind === "free" ? nextEndpointState.anchorNodeId : nextEndpointState.nodeId;
        edge.targetHandle = nextEndpointState.kind === "free" ? FREE_TARGET_HANDLE_ID : nextEndpointState.handleId;
    }

    const nextEdges = workingDocument.edges.slice();
    nextEdges[edgeIndex] = edge;
    return {
        nodes: remainingNodes,
        edges: nextEdges
    };
}

function moveDiagramNode(document, options) {
    const workingDocument = normalizeDocument(document);
    const nodeId = String(options && options.nodeId ? options.nodeId : "");
    const nextPosition = snapCanvasPosition(options && options.position, options);

    return {
        nodes: workingDocument.nodes.map((node) => {
            if (node.id !== nodeId || node.type === FREE_ENDPOINT_NODE_TYPE) {
                return node;
            }

            return Object.assign({}, node, {
                position: nextPosition
            });
        }),
        edges: workingDocument.edges
    };
}

function createSampleDocument() {
    let document = {
        nodes: [
            createDiagramNode("breaker", "sample-breaker-1", { x: 80, y: 170 }, { label: "52I", state: "active" }),
            createDiagramNode("genset-panel-r2", "sample-genset-1", { x: 260, y: 48 }, { title: "G01" }),
            createDiagramNode("modern-valve-control-rev2", "sample-valve-1", { x: 620, y: 110 }, { state: "warning" }),
            createDiagramNode("modern-tank", "sample-tank-1", { x: 620, y: 316 }, { state: "alarm" })
        ],
        edges: []
    };

    document = createLooseConnector(document, {
        connectorId: "sample-connector-1",
        position: { x: 240, y: 215 }
    });
    document = reconnectConnectorEndpoint(document, {
        connectorId: "sample-connector-1",
        endpoint: "source",
        drop: { kind: "attached", nodeId: "sample-breaker-1", handleId: "right-source" }
    });
    document = reconnectConnectorEndpoint(document, {
        connectorId: "sample-connector-1",
        endpoint: "target",
        drop: { kind: "attached", nodeId: "sample-genset-1", handleId: "left-target" }
    });
    document = createLooseConnector(document, {
        connectorId: "sample-connector-2",
        position: { x: 520, y: 300 }
    });

    document.edges = document.edges.map((edge) => Object.assign({}, edge, {
        style: Object.assign({}, edge.style, {
            animated: edge.id === "sample-connector-1"
        })
    }));

    return normalizeDocument(document);
}

function getSelectionFromElements(selection) {
    const safeSelection = asObject(selection, { nodeIds: [], edgeIds: [] });
    return {
        nodeIds: asArray(safeSelection.nodeIds).map((value) => String(value)),
        edgeIds: asArray(safeSelection.edgeIds).map((value) => String(value))
    };
}

function sanitizeViewport(viewport) {
    const safeViewport = asObject(viewport, {});
    return {
        x: toNumber(safeViewport.x, 0),
        y: toNumber(safeViewport.y, 0),
        zoom: clamp(toNumber(safeViewport.zoom, 1), 0.2, 2.5)
    };
}

module.exports = {
    CONNECTOR_EDGE_TYPE,
    FREE_ENDPOINT_NODE_TYPE,
    FREE_SOURCE_HANDLE_ID,
    FREE_TARGET_HANDLE_ID,
    createEmptyDocument,
    createDiagramNode,
    createLooseConnector,
    createSampleDocument,
    getSelectionFromElements,
    moveDiagramNode,
    normalizeDocument,
    reconnectConnectorEndpoint,
    snapCanvasPosition,
    sanitizeViewport
};
