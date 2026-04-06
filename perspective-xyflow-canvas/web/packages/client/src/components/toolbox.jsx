import React from "react";

export function Toolbox(props) {
    if (props.hidden) {
        return null;
    }

    return React.createElement(
        "div",
        {
            className: "xyfc__toolbox"
        },
        React.createElement(
            "div",
            {
                className: "xyfc__toolbox-heading"
            },
            "Toolbox"
        ),
        React.createElement(
            "div",
            {
                className: "xyfc__toolbox-items"
            },
            props.items.map((item) =>
                React.createElement(
                    "button",
                    {
                        key: item.id,
                        type: "button",
                        className: `xyfc__toolbox-item ${props.pendingToolId === item.id ? "xyfc__toolbox-item--active" : ""}`,
                        onClick: () => props.onSelect(item),
                        disabled: props.readOnly
                    },
                    item.label
                )
            )
        ),
        props.onInsertSample
            ? React.createElement(
                "button",
                {
                    type: "button",
                    className: "xyfc__toolbox-action",
                    onClick: props.onInsertSample,
                    disabled: props.readOnly
                },
                props.sampleLabel || "Insert Sample Layout"
            )
            : null,
        props.pendingToolLabel
            ? React.createElement(
                "div",
                {
                    className: "xyfc__toolbox-note"
                },
                `Click the canvas to place ${props.pendingToolLabel}.`
            )
            : React.createElement(
                "div",
                {
                    className: "xyfc__toolbox-note"
                },
                props.isCanvasEmpty
                    ? "Start with a blank canvas, or insert the sample layout explicitly."
                    : "Hover or select nodes to reveal connection points."
            )
    );
}
