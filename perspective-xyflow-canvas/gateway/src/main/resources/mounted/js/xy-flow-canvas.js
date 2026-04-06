(function initXYFlowCanvasRegistration() {
function registerXYFlowCanvas(PerspectiveClient) {
    const { Component, ComponentRegistry } = PerspectiveClient;

    const COMPONENT_TYPE = "com.miguelgrillo.ignition.xyflowcanvas.canvas";

    function deepClone(value) {
        return JSON.parse(JSON.stringify(value));
    }

    function inlineStyle(styleProp) {
        if (!styleProp || typeof styleProp !== "object") {
            return {};
        }
        const copy = Object.assign({}, styleProp);
        delete copy.classes;
        return copy;
    }

    function splitClasses(styleProp) {
        if (!styleProp || typeof styleProp.classes !== "string") {
            return [];
        }
        return styleProp.classes.trim().split(/\s+/).filter(Boolean);
    }

    function readObject(tree, key, fallback) {
        const value = tree.read(key, fallback);
        if (value && typeof value === "object") {
            return value;
        }
        return deepClone(fallback);
    }

    class XYFlowCanvasMeta {
        getComponentType() {
            return COMPONENT_TYPE;
        }

        getViewComponent() {
            return XYFlowCanvas;
        }

        getDefaultSize() {
            return {
                width: 900,
                height: 600
            };
        }

        getPropsReducer(tree) {
            return {
                document: readObject(tree, "document", { nodes: [], edges: [] }),
                viewport: readObject(tree, "viewport", { x: 0, y: 0, zoom: 1 }),
                settings: readObject(tree, "settings", {
                    showGrid: true,
                    snapToGrid: true,
                    gridSize: 16,
                    snapDistance: 18,
                    readOnly: false
                }),
                toolbox: readObject(tree, "toolbox", {
                    visible: true,
                    items: []
                }),
                selection: readObject(tree, "selection", {
                    nodeIds: [],
                    edgeIds: []
                }),
                style: tree.read("style", {})
            };
        }
    }

    class XYFlowCanvas extends Component {
        render() {
            const { props, emit } = this.props;
            const rootStyle = Object.assign(
                {
                    width: "100%",
                    height: "100%",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#0f172a",
                    color: "#e2e8f0",
                    fontFamily: "Segoe UI, Arial, sans-serif"
                },
                inlineStyle(props.style)
            );

            return React.createElement(
                "div",
                emit({
                    classes: ["xy-flow-canvas-placeholder"].concat(splitClasses(props.style)),
                    style: rootStyle
                }),
                React.createElement(
                    "div",
                    {
                        style: {
                            padding: "12px 16px",
                            border: "1px solid rgba(148, 163, 184, 0.35)",
                            borderRadius: "10px",
                            background: "rgba(15, 23, 42, 0.82)"
                        }
                    },
                    "XY Flow Canvas placeholder"
                )
            );
        }
    }

    if (window.__xyFlowCanvasRegistered) {
        return;
    }

    ComponentRegistry.register(new XYFlowCanvasMeta());
    window.__xyFlowCanvasRegistered = true;
}

function tryBootstrapRegistration() {
    if (!window.PerspectiveClient || !window.PerspectiveClient.ComponentRegistry || !window.PerspectiveClient.Component) {
        return false;
    }
    try {
        registerXYFlowCanvas(window.PerspectiveClient);
        return true;
    } catch (error) {
        if (window.console && typeof window.console.error === "function") {
            window.console.error("Failed to register XY Flow Canvas.", error);
        }
        return true;
    }
}

if (tryBootstrapRegistration()) {
    return;
}

let attempts = 0;
const maxAttempts = 200;
const interval = window.setInterval(() => {
    attempts += 1;
    if (tryBootstrapRegistration() || attempts >= maxAttempts) {
        window.clearInterval(interval);
    }
}, 50);
})();
