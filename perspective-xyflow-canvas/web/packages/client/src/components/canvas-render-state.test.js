const assert = require("node:assert/strict");

const {
    UNKNOWN_NODE_RENDER_TYPE,
    decorateEdgesForRender,
    decorateNodesForRender,
    viewportNeedsSync
} = require("./canvas-render-state");

{
    const renderedNodes = decorateNodesForRender([
        {
            id: "unknown-1",
            type: "mystery-widget",
            position: { x: 10, y: 20 },
            data: { label: "legacy" },
            style: {}
        },
        {
            id: "connector-1__source-anchor",
            type: "free-endpoint-anchor",
            position: { x: 0, y: 0 },
            data: {},
            style: {}
        }
    ], {
        nodeIds: ["unknown-1", "connector-1__source-anchor"],
        edgeIds: []
    }, "instance-1");

    assert.equal(renderedNodes[0].type, UNKNOWN_NODE_RENDER_TYPE);
    assert.equal(renderedNodes[0].data.__xyfcOriginalType, "mystery-widget");
    assert.equal(renderedNodes[0].selected, true);
    assert.equal(renderedNodes[1].selected, false);
}

{
    const renderedEdges = decorateEdgesForRender([
        {
            id: "edge-1",
            source: "a",
            target: "b",
            style: {}
        }
    ], {
        nodeIds: [],
        edgeIds: ["edge-1"]
    }, "instance-2");

    assert.equal(renderedEdges[0].selected, true);
    assert.equal(renderedEdges[0].data.__xyfcInstanceId, "instance-2");
}

{
    assert.equal(viewportNeedsSync(
        { x: 10, y: 12, zoom: 1 },
        { x: 10, y: 12, zoom: 1 }
    ), false);
    assert.equal(viewportNeedsSync(
        { x: 10, y: 12, zoom: 1 },
        { x: 10, y: 18, zoom: 1 }
    ), true);
}
