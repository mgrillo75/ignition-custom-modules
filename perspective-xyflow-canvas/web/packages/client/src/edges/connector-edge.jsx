import React from "react";
import { BaseEdge, EdgeLabelRenderer } from "@xyflow/react";

const { joinDomIdSegments } = require("../lib/dom-id");

function midpoint(sourceX, sourceY, targetX, targetY) {
    return {
        x: sourceX + (targetX - sourceX) / 2,
        y: sourceY + (targetY - sourceY) / 2
    };
}

function buildOrthogonalPath(sourceX, sourceY, targetX, targetY) {
    if (Math.abs(sourceX - targetX) < 1 || Math.abs(sourceY - targetY) < 1) {
        return `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`;
    }

    const horizontalMidpoint = sourceX + (targetX - sourceX) / 2;
    return [
        `M ${sourceX} ${sourceY}`,
        `L ${horizontalMidpoint} ${sourceY}`,
        `L ${horizontalMidpoint} ${targetY}`,
        `L ${targetX} ${targetY}`
    ].join(" ");
}

function toAnimationDuration(value) {
    if (typeof value === "number" && Number.isFinite(value)) {
        return `${value}s`;
    }
    if (typeof value === "string" && value.trim()) {
        return value.trim();
    }
    return "1.35s";
}

export function ConnectorEdge(props) {
    const edgeStyle = props.style || {};
    const stroke = edgeStyle.stroke || "#38bdf8";
    const strokeWidth = edgeStyle.strokeWidth || 3;
    const path = buildOrthogonalPath(props.sourceX, props.sourceY, props.targetX, props.targetY);
    const domIdBase = joinDomIdSegments(
        props.data && props.data.__xyfcInstanceId,
        props.id
    );
    const markerId = `${domIdBase}__marker`;
    const glowId = `${domIdBase}__glow`;
    const labelPoint = midpoint(props.sourceX, props.sourceY, props.targetX, props.targetY);
    const showMarker = edgeStyle.markerEnd !== "none";
    const glowIntensity = typeof edgeStyle.glowIntensity === "number" ? edgeStyle.glowIntensity : 0.5;
    const animated = edgeStyle.animated === true || edgeStyle.animation === "flow";
    const animationDuration = toAnimationDuration(edgeStyle.animationDuration);
    const animationDasharray = edgeStyle.animationDasharray || "12 10";

    return React.createElement(
        React.Fragment,
        null,
        React.createElement(
            "defs",
            null,
            showMarker
                ? React.createElement(
                    "marker",
                    {
                        id: markerId,
                        markerWidth: 9,
                        markerHeight: 9,
                        refX: 8,
                        refY: 4.5,
                        orient: "auto-start-reverse",
                        viewBox: "0 0 9 9"
                    },
                    React.createElement("path", {
                        d: "M 0 0 L 9 4.5 L 0 9 z",
                        fill: stroke
                    })
                )
                : null,
            React.createElement(
                "filter",
                {
                    id: glowId,
                    x: "-160%",
                    y: "-160%",
                    width: "420%",
                    height: "420%",
                    colorInterpolationFilters: "sRGB"
                },
                React.createElement("feDropShadow", {
                    dx: 0,
                    dy: 0,
                    stdDeviation: 2.2,
                    floodColor: stroke,
                    floodOpacity: 0.45 * glowIntensity
                }),
                React.createElement("feDropShadow", {
                    dx: 0,
                    dy: 0,
                    stdDeviation: 6.5,
                    floodColor: stroke,
                    floodOpacity: 0.22 * glowIntensity
                })
            )
        ),
        React.createElement(BaseEdge, {
            id: props.id,
            path,
            markerEnd: showMarker ? `url(#${markerId})` : undefined,
            style: Object.assign({}, edgeStyle, {
                stroke,
                strokeWidth,
                filter: `url(#${glowId})`
            })
        }),
        animated
            ? React.createElement("path", {
                d: path,
                fill: "none",
                stroke,
                strokeWidth: Math.max(1.25, strokeWidth - 0.25),
                strokeDasharray: animationDasharray,
                className: "xyfc__edge-animated-stroke",
                style: {
                    animationDuration
                }
            })
            : null,
        React.createElement("circle", {
            className: "xyfc__edge-endpoint",
            cx: props.sourceX,
            cy: props.sourceY,
            r: props.selected ? 7 : 5,
            fill: "#ffffff",
            stroke,
            strokeWidth: 2
        }),
        React.createElement("circle", {
            className: "xyfc__edge-endpoint",
            cx: props.targetX,
            cy: props.targetY,
            r: props.selected ? 7 : 5,
            fill: "#ffffff",
            stroke,
            strokeWidth: 2
        }),
        props.label
            ? React.createElement(
                EdgeLabelRenderer,
                null,
                React.createElement(
                    "div",
                    {
                        className: "xyfc__edge-label",
                        style: {
                            transform: `translate(-50%, -50%) translate(${labelPoint.x}px, ${labelPoint.y}px)`
                        }
                    },
                    props.label
                )
            )
            : null
    );
}
