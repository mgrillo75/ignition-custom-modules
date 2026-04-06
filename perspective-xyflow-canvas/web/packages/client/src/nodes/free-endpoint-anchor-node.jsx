import React from "react";
import { Handle, Position } from "@xyflow/react";

const { FREE_SOURCE_HANDLE_ID, FREE_TARGET_HANDLE_ID } = require("./node-definitions");

const handleStyle = {
    width: 12,
    height: 12,
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    borderRadius: 999,
    border: "2px solid #f8fafc",
    background: "#38bdf8",
    boxShadow: "0 0 0 5px rgba(56, 189, 248, 0.18)"
};

export function FreeEndpointAnchorNode() {
    return React.createElement(
        "div",
        {
            className: "xyfc__free-endpoint-anchor"
        },
        React.createElement(Handle, {
            type: "source",
            id: FREE_SOURCE_HANDLE_ID,
            position: Position.Top,
            isConnectable: false,
            style: handleStyle
        }),
        React.createElement(Handle, {
            type: "target",
            id: FREE_TARGET_HANDLE_ID,
            position: Position.Top,
            isConnectable: false,
            style: handleStyle
        })
    );
}
