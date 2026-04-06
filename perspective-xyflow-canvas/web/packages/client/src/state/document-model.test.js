const assert = require("node:assert/strict");

const {
    FREE_ENDPOINT_NODE_TYPE,
    createEmptyDocument,
    createLooseConnector,
    createSampleDocument,
    moveDiagramNode,
    normalizeDocument,
    reconnectConnectorEndpoint
} = require("./document-model");

function createBaseDocument() {
    return {
        nodes: [
            {
                id: "node-breaker",
                type: "breaker",
                position: { x: 120, y: 80 },
                data: {},
                style: {}
            }
        ],
        edges: []
    };
}

{
    const document = createEmptyDocument();
    assert.deepEqual(document, { nodes: [], edges: [] }, "empty canvases should start blank");
}

{
    const document = createLooseConnector(createBaseDocument(), {
        connectorId: "connector-1",
        position: { x: 320, y: 220 }
    });

    assert.equal(document.edges.length, 1, "expected one visible connector edge");
    assert.equal(document.edges[0].id, "connector-1");
    assert.equal(document.edges[0].source, "connector-1__source-anchor");
    assert.equal(document.edges[0].target, "connector-1__target-anchor");
    assert.deepEqual(document.edges[0].style.__xyflowCanvas.sourceEndpoint, {
        kind: "free",
        x: 240,
        y: 220,
        anchorNodeId: "connector-1__source-anchor"
    });
    assert.deepEqual(document.edges[0].style.__xyflowCanvas.targetEndpoint, {
        kind: "free",
        x: 400,
        y: 220,
        anchorNodeId: "connector-1__target-anchor"
    });

    const anchorIds = document.nodes
        .filter((node) => node.type === FREE_ENDPOINT_NODE_TYPE)
        .map((node) => node.id)
        .sort();

    assert.deepEqual(anchorIds, [
        "connector-1__source-anchor",
        "connector-1__target-anchor"
    ]);
}

{
    const looseDocument = createLooseConnector(createBaseDocument(), {
        connectorId: "connector-2",
        position: { x: 300, y: 180 }
    });

    const attachedDocument = reconnectConnectorEndpoint(looseDocument, {
        connectorId: "connector-2",
        endpoint: "source",
        drop: {
            kind: "attached",
            nodeId: "node-breaker",
            handleId: "right"
        }
    });

    const connector = attachedDocument.edges[0];
    assert.equal(connector.id, "connector-2", "connector ids must remain stable");
    assert.equal(connector.source, "node-breaker");
    assert.equal(connector.sourceHandle, "right-source");
    assert.deepEqual(connector.style.__xyflowCanvas.sourceEndpoint, {
        kind: "attached",
        nodeId: "node-breaker",
        handleId: "right-source"
    });

    const remainingFreeAnchors = attachedDocument.nodes
        .filter((node) => node.type === FREE_ENDPOINT_NODE_TYPE)
        .map((node) => node.id)
        .sort();

    assert.deepEqual(remainingFreeAnchors, ["connector-2__target-anchor"]);
}

{
    const looseDocument = createLooseConnector(createBaseDocument(), {
        connectorId: "connector-3",
        position: { x: 280, y: 160 }
    });

    const movedDocument = reconnectConnectorEndpoint(looseDocument, {
        connectorId: "connector-3",
        endpoint: "target",
        drop: {
            kind: "free",
            position: { x: 520, y: 260 }
        }
    });

    const connector = movedDocument.edges[0];
    assert.equal(connector.id, "connector-3");
    assert.equal(connector.target, "connector-3__target-anchor");
    assert.deepEqual(connector.style.__xyflowCanvas.targetEndpoint, {
        kind: "free",
        x: 520,
        y: 260,
        anchorNodeId: "connector-3__target-anchor"
    });

    const movedAnchor = movedDocument.nodes.find((node) => node.id === "connector-3__target-anchor");
    assert.deepEqual(movedAnchor.position, { x: 520, y: 260 });
}

{
    const looseDocument = createLooseConnector(createBaseDocument(), {
        connectorId: "connector-4",
        position: { x: 260, y: 140 }
    });
    const attachedDocument = reconnectConnectorEndpoint(looseDocument, {
        connectorId: "connector-4",
        endpoint: "source",
        drop: {
            kind: "attached",
            nodeId: "node-breaker",
            handleId: "right"
        }
    });
    const movedDocument = moveDiagramNode(attachedDocument, {
        nodeId: "node-breaker",
        position: { x: 67, y: 35 },
        snapToGrid: true,
        gridSize: 20,
        snapDistance: 8
    });

    const movedNode = movedDocument.nodes.find((node) => node.id === "node-breaker");
    assert.deepEqual(movedNode.position, { x: 60, y: 40 });
    assert.equal(movedDocument.edges[0].source, "node-breaker");
    assert.equal(movedDocument.edges[0].sourceHandle, "right-source");
    assert.deepEqual(movedDocument.edges[0].style.__xyflowCanvas.sourceEndpoint, {
        kind: "attached",
        nodeId: "node-breaker",
        handleId: "right-source"
    });
}

{
    const movedDocument = moveDiagramNode(createBaseDocument(), {
        nodeId: "node-breaker",
        position: { x: 67, y: 35 },
        snapToGrid: true,
        gridSize: 20,
        snapDistance: 4
    });
    const movedNode = movedDocument.nodes.find((node) => node.id === "node-breaker");
    assert.deepEqual(movedNode.position, { x: 67, y: 35 }, "snap distance should gate grid snapping");
}

{
    const sampleDocument = createSampleDocument();
    assert.ok(sampleDocument.nodes.length > 0, "sample document should be explicit content, not blank");
    assert.ok(sampleDocument.edges.length > 0, "sample document should include loose connector examples");
}

{
    const looseDocument = createLooseConnector(createBaseDocument(), {
        connectorId: "connector-5",
        position: { x: 240, y: 180 }
    });

    const invalidAttachmentDocument = reconnectConnectorEndpoint(looseDocument, {
        connectorId: "connector-5",
        endpoint: "source",
        drop: {
            kind: "attached",
            nodeId: "connector-5__target-anchor",
            handleId: "free-target"
        }
    });

    assert.deepEqual(invalidAttachmentDocument.edges[0].style.__xyflowCanvas.sourceEndpoint, {
        kind: "free",
        x: 320,
        y: 180,
        anchorNodeId: "connector-5__source-anchor"
    }, "anchor nodes should not become valid attachment targets");
}

{
    const normalizedDocument = normalizeDocument({
        nodes: [
            {
                id: "node-breaker",
                type: "breaker",
                position: { x: 120, y: 80 },
                data: {},
                style: {}
            }
        ],
        edges: [
            {
                id: "legacy-edge-1",
                source: "node-breaker",
                sourceHandle: "right",
                target: "node-breaker",
                targetHandle: "left",
                style: {
                    __xyflowCanvas: {
                        sourceEndpoint: {
                            kind: "attached",
                            nodeId: "node-breaker",
                            handleId: "right"
                        },
                        targetEndpoint: {
                            kind: "attached",
                            nodeId: "node-breaker",
                            handleId: "left"
                        }
                    }
                }
            }
        ]
    });

    assert.equal(normalizedDocument.edges[0].sourceHandle, "right-source");
    assert.equal(normalizedDocument.edges[0].targetHandle, "left-target");
    assert.equal(normalizedDocument.edges[0].style.__xyflowCanvas.sourceEndpoint.handleId, "right-source");
    assert.equal(normalizedDocument.edges[0].style.__xyflowCanvas.targetEndpoint.handleId, "left-target");
}

{
    const normalizedDocument = normalizeDocument({
        nodes: [
            {
                id: "legacy-node-1",
                type: "mystery-widget",
                position: { x: 12, y: 34 },
                data: { label: "legacy" },
                style: { width: 88, height: 44 }
            }
        ],
        edges: []
    });

    assert.equal(normalizedDocument.nodes[0].type, "mystery-widget");
    assert.equal(normalizedDocument.nodes[0].data.__xyfcUnknownType, "mystery-widget");
    assert.deepEqual(normalizedDocument.nodes[0].position, { x: 12, y: 34 });
}
