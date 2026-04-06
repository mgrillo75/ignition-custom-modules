const FREE_ENDPOINT_NODE_TYPE = "free-endpoint-anchor";
const CONNECTOR_EDGE_TYPE = "xyflow-connector";
const FREE_SOURCE_HANDLE_ID = "free-source";
const FREE_TARGET_HANDLE_ID = "free-target";
const UNKNOWN_NODE_RENDER_TYPE = "xyflow-unknown-node";
const NODE_VISUAL_DEFAULTS = {
    glowIntensity: 0.55,
    state: "default"
};

const NODE_LIBRARY = {
    breaker: {
        type: "breaker",
        label: "Breaker",
        width: 156,
        height: 156,
        svgKey: "breaker",
        handles: [
            { id: "top", x: 0.5, y: 0 },
            { id: "right", x: 1, y: 0.5 },
            { id: "bottom", x: 0.5, y: 1 },
            { id: "left", x: 0, y: 0.5 }
        ],
        dataDefaults: Object.assign({}, NODE_VISUAL_DEFAULTS, {
            label: "52I",
            accentColor: "#34d399",
            textColor: "#e2e8f0",
            panelColor: "#0f172a",
            borderColor: "#1e293b"
        })
    },
    "genset-panel": {
        type: "genset-panel",
        label: "Genset Panel",
        width: 220,
        height: 320,
        svgKey: "genset-panel",
        handles: [
            { id: "top", x: 0.5, y: 0 },
            { id: "right", x: 1, y: 0.5 },
            { id: "bottom", x: 0.5, y: 1 },
            { id: "left", x: 0, y: 0.5 }
        ],
        dataDefaults: Object.assign({}, NODE_VISUAL_DEFAULTS, {
            title: "G01",
            accentColor: "#10b981"
        })
    },
    "genset-panel-transparent": {
        type: "genset-panel-transparent",
        label: "Genset Panel Transparent",
        width: 220,
        height: 320,
        svgKey: "genset-panel-transparent",
        handles: [
            { id: "top", x: 0.5, y: 0 },
            { id: "right", x: 1, y: 0.5 },
            { id: "bottom", x: 0.5, y: 1 },
            { id: "left", x: 0, y: 0.5 }
        ],
        dataDefaults: Object.assign({}, NODE_VISUAL_DEFAULTS, {
            title: "G01",
            accentColor: "#10b981"
        })
    },
    "genset-panel-r2": {
        type: "genset-panel-r2",
        label: "Genset Panel R2",
        width: 220,
        height: 324,
        svgKey: "genset-panel-r2",
        handles: [
            { id: "top", x: 0.5, y: 0 },
            { id: "right", x: 1, y: 0.5 },
            { id: "bottom", x: 0.5, y: 1 },
            { id: "left", x: 0, y: 0.5 }
        ],
        dataDefaults: Object.assign({}, NODE_VISUAL_DEFAULTS, {
            title: "G01",
            accentColor: "#10b981"
        })
    },
    "genset-panel-r2-transparent": {
        type: "genset-panel-r2-transparent",
        label: "Genset Panel R2 Transparent",
        width: 220,
        height: 324,
        svgKey: "genset-panel-r2-transparent",
        handles: [
            { id: "top", x: 0.5, y: 0 },
            { id: "right", x: 1, y: 0.5 },
            { id: "bottom", x: 0.5, y: 1 },
            { id: "left", x: 0, y: 0.5 }
        ],
        dataDefaults: Object.assign({}, NODE_VISUAL_DEFAULTS, {
            title: "G01",
            accentColor: "#10b981"
        })
    },
    "modern-line": {
        type: "modern-line",
        label: "Modern Line",
        width: 380,
        height: 60,
        svgKey: "modern-line",
        handles: [
            { id: "left", x: 0, y: 0.5 },
            { id: "right", x: 1, y: 0.5 }
        ],
        dataDefaults: Object.assign({}, NODE_VISUAL_DEFAULTS, {
            accentColor: "#10b981"
        })
    },
    "modern-line-rev2": {
        type: "modern-line-rev2",
        label: "Modern Line Rev2",
        width: 380,
        height: 60,
        svgKey: "modern-line-rev2",
        handles: [
            { id: "left", x: 0, y: 0.5 },
            { id: "right", x: 1, y: 0.5 }
        ],
        dataDefaults: Object.assign({}, NODE_VISUAL_DEFAULTS, {
            accentColor: "#10b981"
        })
    },
    "modern-tank": {
        type: "modern-tank",
        label: "Modern Tank",
        width: 144,
        height: 150,
        svgKey: "modern-tank",
        handles: [
            { id: "top", x: 0.5, y: 0 },
            { id: "right", x: 1, y: 0.5 },
            { id: "bottom", x: 0.5, y: 1 },
            { id: "left", x: 0, y: 0.5 }
        ],
        dataDefaults: Object.assign({}, NODE_VISUAL_DEFAULTS, {
            accentColor: "#10b981"
        })
    },
    "modern-tank-rev2": {
        type: "modern-tank-rev2",
        label: "Modern Tank Rev2",
        width: 144,
        height: 150,
        svgKey: "modern-tank-rev2",
        handles: [
            { id: "top", x: 0.5, y: 0 },
            { id: "right", x: 1, y: 0.5 },
            { id: "bottom", x: 0.5, y: 1 },
            { id: "left", x: 0, y: 0.5 }
        ],
        dataDefaults: Object.assign({}, NODE_VISUAL_DEFAULTS, {
            accentColor: "#10b981"
        })
    },
    "modern-valve-control": {
        type: "modern-valve-control",
        label: "Modern Valve Control",
        width: 144,
        height: 153,
        svgKey: "modern-valve-control",
        handles: [
            { id: "top", x: 0.5, y: 0 },
            { id: "right", x: 1, y: 0.5 },
            { id: "bottom", x: 0.5, y: 1 },
            { id: "left", x: 0, y: 0.5 }
        ],
        dataDefaults: Object.assign({}, NODE_VISUAL_DEFAULTS, {
            accentColor: "#10b981"
        })
    },
    "modern-valve-control-rev2": {
        type: "modern-valve-control-rev2",
        label: "Modern Valve Control Rev2",
        width: 144,
        height: 153,
        svgKey: "modern-valve-control-rev2",
        handles: [
            { id: "top", x: 0.5, y: 0 },
            { id: "right", x: 1, y: 0.5 },
            { id: "bottom", x: 0.5, y: 1 },
            { id: "left", x: 0, y: 0.5 }
        ],
        dataDefaults: Object.assign({}, NODE_VISUAL_DEFAULTS, {
            accentColor: "#10b981"
        })
    }
};

const DEFAULT_TOOLBOX_ITEMS = [
    { id: "breaker", kind: "node", nodeType: "breaker", label: "Breaker" },
    { id: "genset-panel-r2", kind: "node", nodeType: "genset-panel-r2", label: "Genset Panel R2" },
    { id: "genset-panel-r2-transparent", kind: "node", nodeType: "genset-panel-r2-transparent", label: "Genset R2 Transparent" },
    { id: "modern-line", kind: "node", nodeType: "modern-line", label: "Modern Line" },
    { id: "modern-line-rev2", kind: "node", nodeType: "modern-line-rev2", label: "Line Transparent" },
    { id: "modern-tank", kind: "node", nodeType: "modern-tank", label: "Modern Tank" },
    { id: "modern-tank-rev2", kind: "node", nodeType: "modern-tank-rev2", label: "Tank Transparent" },
    { id: "modern-valve-control", kind: "node", nodeType: "modern-valve-control", label: "Valve Control" },
    { id: "modern-valve-control-rev2", kind: "node", nodeType: "modern-valve-control-rev2", label: "Valve Transparent" },
    { id: "loose-connector", kind: "edge", label: "Loose Connector" }
];

function getNodeDefinition(nodeType) {
    return NODE_LIBRARY[nodeType] || null;
}

module.exports = {
    CONNECTOR_EDGE_TYPE,
    DEFAULT_TOOLBOX_ITEMS,
    FREE_ENDPOINT_NODE_TYPE,
    FREE_SOURCE_HANDLE_ID,
    FREE_TARGET_HANDLE_ID,
    NODE_LIBRARY,
    UNKNOWN_NODE_RENDER_TYPE,
    getNodeDefinition
};
