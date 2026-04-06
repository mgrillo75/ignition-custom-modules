import React, { useMemo, useState } from "react";
import { Handle, Position } from "@xyflow/react";

const {
    KNOWN_HANDLE_KEYS,
    buildNodeHandleId,
    getHandleKey,
    getHandleType
} = require("./handle-ids");

const HANDLE_POSITION_MAP = {
    top: Position.Top,
    right: Position.Right,
    bottom: Position.Bottom,
    left: Position.Left
};

function buildHandleStyle(position, visible) {
    const style = {
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "all" : "none"
    };

    if (position === "top") {
        style.top = "0%";
    } else if (position === "right") {
        style.left = "100%";
    } else if (position === "bottom") {
        style.top = "100%";
    } else if (position === "left") {
        style.left = "0%";
    }

    return style;
}

function buildHandleDescriptors(data) {
    const legacyHandles = Array.isArray(data && data.__xyfcLegacyHandles)
        ? data.__xyfcLegacyHandles.filter(Boolean)
        : [];
    const descriptors = [];
    const seen = new Set();

    for (const handleKey of KNOWN_HANDLE_KEYS) {
        descriptors.push({
            id: buildNodeHandleId(handleKey, "source"),
            position: HANDLE_POSITION_MAP[handleKey] || Position.Top,
            type: "source"
        });
        descriptors.push({
            id: buildNodeHandleId(handleKey, "target"),
            position: HANDLE_POSITION_MAP[handleKey] || Position.Top,
            type: "target"
        });
        seen.add(buildNodeHandleId(handleKey, "source"));
        seen.add(buildNodeHandleId(handleKey, "target"));
    }

    for (const handleId of legacyHandles) {
        const type = getHandleType(handleId);
        if (!type || seen.has(handleId)) {
            continue;
        }

        descriptors.push({
            id: handleId,
            position: HANDLE_POSITION_MAP[getHandleKey(handleId)] || Position.Top,
            type
        });
        seen.add(handleId);
    }

    return descriptors;
}

export function UnknownNode(props) {
    const [hovered, setHovered] = useState(false);
    const visibleHandles = hovered || props.selected;
    const handles = useMemo(() => buildHandleDescriptors(props.data), [props.data]);
    const label = props.data && props.data.__xyfcOriginalType
        ? `Unknown node: ${props.data.__xyfcOriginalType}`
        : "Unknown node";

    return React.createElement(
        "div",
        {
            className: `xyfc__unknown-node ${props.selected ? "xyfc__unknown-node--selected" : ""}`,
            style: {
                width: props.style && props.style.width ? props.style.width : 168,
                height: props.style && props.style.height ? props.style.height : 96
            },
            onMouseEnter: () => setHovered(true),
            onMouseLeave: () => setHovered(false)
        },
        React.createElement(
            "div",
            {
                className: "xyfc__unknown-node-label"
            },
            label
        ),
        handles.map((handle) => React.createElement(Handle, {
            key: `${handle.id}-${handle.type}`,
            type: handle.type,
            id: handle.id,
            position: handle.position,
            className: "xyfc__handle",
            style: buildHandleStyle(getHandleKey(handle.id), visibleHandles)
        }))
    );
}
