const {
    FREE_ENDPOINT_NODE_TYPE,
    UNKNOWN_NODE_RENDER_TYPE,
    getNodeDefinition
} = require("../nodes/node-definitions");

function asObject(value, fallback) {
    return value && typeof value === "object" ? value : fallback;
}

function getSelectionSets(selection) {
    const safeSelection = asObject(selection, {});
    return {
        nodeIds: new Set(Array.isArray(safeSelection.nodeIds) ? safeSelection.nodeIds.map((value) => String(value)) : []),
        edgeIds: new Set(Array.isArray(safeSelection.edgeIds) ? safeSelection.edgeIds.map((value) => String(value)) : [])
    };
}

function collectReferencedHandles(edges) {
    const handlesByNodeId = new Map();

    for (const edge of Array.isArray(edges) ? edges : []) {
        const sourceId = edge && edge.source ? String(edge.source) : "";
        const targetId = edge && edge.target ? String(edge.target) : "";
        const sourceHandle = edge && edge.sourceHandle ? String(edge.sourceHandle) : "";
        const targetHandle = edge && edge.targetHandle ? String(edge.targetHandle) : "";

        if (sourceId && sourceHandle) {
            if (!handlesByNodeId.has(sourceId)) {
                handlesByNodeId.set(sourceId, new Set());
            }
            handlesByNodeId.get(sourceId).add(sourceHandle);
        }

        if (targetId && targetHandle) {
            if (!handlesByNodeId.has(targetId)) {
                handlesByNodeId.set(targetId, new Set());
            }
            handlesByNodeId.get(targetId).add(targetHandle);
        }
    }

    return handlesByNodeId;
}

function decorateNodesForRender(nodes, selection, instanceId, edges) {
    const selectionSets = getSelectionSets(selection);
    const handlesByNodeId = collectReferencedHandles(edges);

    return (Array.isArray(nodes) ? nodes : []).map((node) => {
        if (node.type === FREE_ENDPOINT_NODE_TYPE) {
            return Object.assign({}, node, {
                selected: false
            });
        }

        const definition = getNodeDefinition(node.type);
        const data = Object.assign({}, node.data, {
            __xyfcInstanceId: instanceId
        });

        if (!definition) {
            data.__xyfcOriginalType = String(node.type || "unknown-node");
            data.__xyfcLegacyHandles = Array.from(handlesByNodeId.get(node.id) || []);
        }

        return Object.assign({}, node, {
            type: definition ? node.type : UNKNOWN_NODE_RENDER_TYPE,
            selected: selectionSets.nodeIds.has(node.id),
            data
        });
    });
}

function decorateEdgesForRender(edges, selection, instanceId) {
    const selectionSets = getSelectionSets(selection);

    return (Array.isArray(edges) ? edges : []).map((edge) => Object.assign({}, edge, {
        selected: selectionSets.edgeIds.has(edge.id),
        data: Object.assign({}, edge.data, {
            __xyfcInstanceId: instanceId
        })
    }));
}

function viewportNeedsSync(currentViewport, nextViewport) {
    if (!currentViewport || !nextViewport) {
        return false;
    }

    return (
        Number(currentViewport.x) !== Number(nextViewport.x) ||
        Number(currentViewport.y) !== Number(nextViewport.y) ||
        Number(currentViewport.zoom) !== Number(nextViewport.zoom)
    );
}

module.exports = {
    decorateEdgesForRender,
    decorateNodesForRender,
    UNKNOWN_NODE_RENDER_TYPE,
    viewportNeedsSync
};
