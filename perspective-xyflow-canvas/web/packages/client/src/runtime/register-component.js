import React from "react";
import { Component, ComponentRegistry } from "@inductiveautomation/perspective-client";

import { XYFlowCanvasApp } from "../components/xy-flow-canvas-app";

const COMPONENT_TYPE = "com.miguelgrillo.ignition.xyflowcanvas.canvas";
const REGISTRATION_FLAG = "__xyFlowCanvasRegistered";

let instanceCounter = 0;

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

function buildDefaultProps() {
    return {
        document: { nodes: [], edges: [] },
        viewport: { x: 0, y: 0, zoom: 1 },
        settings: {
            showGrid: true,
            snapToGrid: true,
            gridSize: 16,
            snapDistance: 18,
            readOnly: false
        },
        toolbox: {
            visible: true,
            items: []
        },
        selection: {
            nodeIds: [],
            edgeIds: []
        },
        style: {}
    };
}

class PerspectiveXYFlowCanvas extends Component {
    constructor(props) {
        super(props);
        instanceCounter += 1;
        this.instanceId = `xyfc-instance-${instanceCounter}`;
    }

    render() {
        const { props, emit, store } = this.props;
        const rootStyle = Object.assign(
            {
                width: "100%",
                height: "100%",
                position: "relative",
                overflow: "hidden",
                background: "radial-gradient(circle at top, #162033, #050b14 72%)",
                color: "#e2e8f0"
            },
            inlineStyle(props.style)
        );

        return React.createElement(
            "div",
            emit({
                classes: ["xy-flow-canvas-root"].concat(splitClasses(props.style)),
                style: rootStyle
            }),
            React.createElement(XYFlowCanvasApp, {
                instanceId: this.instanceId,
                perspectiveProps: props,
                store
            })
        );
    }
}

class XYFlowCanvasMeta {
    getComponentType() {
        return COMPONENT_TYPE;
    }

    getViewComponent() {
        return PerspectiveXYFlowCanvas;
    }

    getDefaultSize() {
        return {
            width: 980,
            height: 640
        };
    }

    getPropsReducer(tree) {
        const defaults = buildDefaultProps();
        return {
            document: readObject(tree, "document", defaults.document),
            viewport: readObject(tree, "viewport", defaults.viewport),
            settings: readObject(tree, "settings", defaults.settings),
            toolbox: readObject(tree, "toolbox", defaults.toolbox),
            selection: readObject(tree, "selection", defaults.selection),
            style: tree.read("style", {})
        };
    }
}

const scope = typeof window !== "undefined" ? window : globalThis;

if (!scope[REGISTRATION_FLAG]) {
    ComponentRegistry.register(new XYFlowCanvasMeta());
    scope[REGISTRATION_FLAG] = true;
}
