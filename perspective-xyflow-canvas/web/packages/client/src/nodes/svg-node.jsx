import React, { useMemo, useState } from "react";
import { Handle, Position } from "@xyflow/react";

import { SVG_ASSETS } from "../assets/svg-assets";

const { getNodeDefinition } = require("./node-definitions");
const { buildNodeHandleId } = require("./handle-ids");
const { createSvgIdPrefix, normalizeSvgMarkup, sanitizeColor } = require("./svg-markup");

const HANDLE_POSITION_MAP = {
    top: Position.Top,
    right: Position.Right,
    bottom: Position.Bottom,
    left: Position.Left
};

const NODE_STATE_ACCENTS = {
    active: "#38bdf8",
    warning: "#f59e0b",
    alarm: "#ef4444",
    disabled: "#64748b"
};

function clamp(value, min, max, fallback) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
        return fallback;
    }
    return Math.max(min, Math.min(max, numeric));
}

function normalizeNodeState(value) {
    const state = String(value || "default").trim().toLowerCase();
    if (state === "active" || state === "warning" || state === "alarm" || state === "disabled") {
        return state;
    }
    return "default";
}

function buildNodeVisualState(data) {
    const state = normalizeNodeState(data && data.state);
    const stateAccent = NODE_STATE_ACCENTS[state] || "#38bdf8";

    return {
        accentColor: sanitizeColor(data && (data.glowColor || data.accentColor), stateAccent),
        glowIntensity: clamp(data && data.glowIntensity, 0, 1.4, 0.55),
        state
    };
}

function buildNodeStyle(definition, visualState, hovered, selected) {
    const shadowLayers = [];

    if (visualState.state !== "default" || hovered) {
        shadowLayers.push(`0 0 ${Math.max(10, Math.round(26 * visualState.glowIntensity))}px ${visualState.accentColor}`);
    }
    if (selected) {
        shadowLayers.push(`0 0 0 2px ${visualState.accentColor}`);
    }
    if (visualState.state === "warning") {
        shadowLayers.push("0 0 0 1px rgba(245, 158, 11, 0.65)");
    }
    if (visualState.state === "alarm") {
        shadowLayers.push("0 0 0 1px rgba(239, 68, 68, 0.72)");
    }

    return {
        width: definition.width,
        height: definition.height,
        boxShadow: shadowLayers.length ? shadowLayers.join(", ") : "none",
        opacity: visualState.state === "disabled" ? 0.58 : 1
    };
}

function buildHandleStyle(handle, visible) {
    return {
        left: `${handle.x * 100}%`,
        top: `${handle.y * 100}%`,
        transform: "translate(-50%, -50%)",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "all" : "none"
    };
}

function renderDualHandle(nodeId, handle, visible) {
    return React.createElement(
        React.Fragment,
        {
            key: `${nodeId}-${handle.id}`
        },
        React.createElement(Handle, {
            type: "source",
            id: buildNodeHandleId(handle.id, "source"),
            position: HANDLE_POSITION_MAP[handle.id] || Position.Top,
            className: "xyfc__handle",
            style: buildHandleStyle(handle, visible)
        }),
        React.createElement(Handle, {
            type: "target",
            id: buildNodeHandleId(handle.id, "target"),
            position: HANDLE_POSITION_MAP[handle.id] || Position.Top,
            className: "xyfc__handle",
            style: buildHandleStyle(handle, visible)
        })
    );
}

export function SvgNode(props) {
    const [hovered, setHovered] = useState(false);
    const definition = getNodeDefinition(props.type);
    const visibleHandles = hovered || props.selected;
    const visualState = useMemo(() => buildNodeVisualState(props.data || {}), [props.data]);

    const svgMarkup = useMemo(() => {
        const sourceMarkup = SVG_ASSETS[definition.svgKey];
        return normalizeSvgMarkup(
            sourceMarkup,
            createSvgIdPrefix(props.data && props.data.__xyfcInstanceId, props.id),
            props.data || {}
        );
    }, [definition.svgKey, props.data, props.id]);

    return React.createElement(
        "div",
        {
            className: `xyfc__svg-node xyfc__svg-node--state-${visualState.state} ${hovered ? "xyfc__svg-node--hovered" : ""} ${props.selected ? "xyfc__svg-node--selected" : ""}`,
            style: buildNodeStyle(definition, visualState, hovered, props.selected),
            onMouseEnter: () => setHovered(true),
            onMouseLeave: () => setHovered(false)
        },
        React.createElement("div", {
            className: "xyfc__svg-node-asset",
            dangerouslySetInnerHTML: {
                __html: svgMarkup
            }
        }),
        definition.handles.map((handle) => renderDualHandle(props.id, handle, visibleHandles))
    );
}
