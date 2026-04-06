(function initAnchorConnectorRegistration() {
function registerAnchorConnectorComponent(PerspectiveClient) {
const { Component, ComponentRegistry } = PerspectiveClient;

const COMPONENT_TYPE = "com.miguelgrillo.anchorconnectors.canvas";
const LINE_COMPONENT_TYPE = "com.miguelgrillo.anchorconnectors.connector_line";

function normalizeNumber(value, fallback) {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : fallback;
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

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

function rootEmit(emit, styleProp, backgroundColor) {
    const style = Object.assign({
        width: "100%",
        height: "100%",
        overflow: "hidden",
        position: "relative",
        backgroundColor: backgroundColor
    }, inlineStyle(styleProp));

    const classes = ["anchor-connector-canvas"].concat(splitClasses(styleProp));
    return emit({ classes, style });
}

function defaultSymbols() {
    return [
        {
            id: "source_panel",
            x: 100,
            y: 80,
            width: 140,
            height: 90,
            svgPath: "M 12 14 H 128 V 76 H 12 Z M 20 24 H 120 V 66 H 20 Z M 36 37 H 56 M 68 37 H 104 M 36 50 H 104",
            label: "Source Panel",
            styleClasses: "",
            anchors: [
                { id: "right", x: 140, y: 45, side: "right", snapRadius: 24 },
                { id: "bottom", x: 70, y: 90, side: "bottom", snapRadius: 24 }
            ]
        },
        {
            id: "load_breaker",
            x: 520,
            y: 260,
            width: 120,
            height: 120,
            svgPath: "M 30 14 H 90 V 36 H 30 Z M 60 36 V 96 M 44 70 H 76 M 24 96 H 96 V 108 H 24 Z",
            label: "Load Breaker",
            styleClasses: "",
            anchors: [
                { id: "left", x: 0, y: 60, side: "left", snapRadius: 24 },
                { id: "top", x: 60, y: 0, side: "top", snapRadius: 24 }
            ]
        }
    ];
}

function defaultConnectors() {
    return [
        {
            id: "feeder_1",
            fromSymbolId: "source_panel",
            fromAnchorId: "right",
            toSymbolId: "load_breaker",
            toAnchorId: "left",
            stroke: "#0b5d88",
            strokeWidth: 3,
            cornerRadius: 12,
            markerEnd: "arrow",
            label: "Feeder"
        }
    ];
}

function isUrlLikeSvgPath(svgPath) {
    if (typeof svgPath !== "string") {
        return false;
    }
    const trimmed = svgPath.trim();
    if (!trimmed) {
        return false;
    }
    return /^(https?:\/\/|data:image\/|\/|\.{1,2}\/|.*\.svg(\?.*)?$)/i.test(trimmed);
}

function distance(a, b) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function normalizeAnchor(anchor, index, symbolWidth, symbolHeight) {
    const side = typeof anchor.side === "string" ? anchor.side : "custom";
    const id = anchor && anchor.id ? String(anchor.id) : `${side}_${index}`;
    return {
        id,
        x: normalizeNumber(anchor && anchor.x, symbolWidth / 2),
        y: normalizeNumber(anchor && anchor.y, symbolHeight / 2),
        side,
        snapRadius: clamp(normalizeNumber(anchor && anchor.snapRadius, 20), 0, 120)
    };
}

function buildDefaultAnchors(width, height) {
    return [
        { id: "left", x: 0, y: height / 2, side: "left", snapRadius: 20 },
        { id: "right", x: width, y: height / 2, side: "right", snapRadius: 20 },
        { id: "top", x: width / 2, y: 0, side: "top", snapRadius: 20 },
        { id: "bottom", x: width / 2, y: height, side: "bottom", snapRadius: 20 }
    ];
}

function normalizeSymbol(rawSymbol, index) {
    const width = Math.max(40, normalizeNumber(rawSymbol && rawSymbol.width, 120));
    const height = Math.max(30, normalizeNumber(rawSymbol && rawSymbol.height, 90));

    const symbol = {
        id: rawSymbol && rawSymbol.id ? String(rawSymbol.id) : `symbol_${index + 1}`,
        x: normalizeNumber(rawSymbol && rawSymbol.x, index * 180 + 80),
        y: normalizeNumber(rawSymbol && rawSymbol.y, 120),
        width,
        height,
        svgPath: rawSymbol && typeof rawSymbol.svgPath === "string" ? rawSymbol.svgPath : "",
        label: rawSymbol && rawSymbol.label ? String(rawSymbol.label) : `Symbol ${index + 1}`,
        styleClasses: rawSymbol && rawSymbol.styleClasses ? String(rawSymbol.styleClasses) : "",
        fill: rawSymbol && typeof rawSymbol.fill === "string" ? rawSymbol.fill : "#e2e8f0",
        stroke: rawSymbol && typeof rawSymbol.stroke === "string" ? rawSymbol.stroke : "#1f2937",
        anchors: []
    };

    if (Array.isArray(rawSymbol && rawSymbol.anchors) && rawSymbol.anchors.length > 0) {
        symbol.anchors = rawSymbol.anchors.map((anchor, anchorIndex) =>
            normalizeAnchor(anchor, anchorIndex, width, height)
        );
    } else {
        symbol.anchors = buildDefaultAnchors(width, height);
    }

    symbol.absoluteAnchors = symbol.anchors.map((anchor) => ({
        id: anchor.id,
        x: symbol.x + anchor.x,
        y: symbol.y + anchor.y,
        side: anchor.side,
        snapRadius: anchor.snapRadius
    }));

    return symbol;
}

function normalizeConnector(rawConnector, index) {
    const markerEndRaw = rawConnector ? rawConnector.markerEnd : "none";
    const markerEnd = markerEndRaw === true || markerEndRaw === "arrow";

    return {
        id: rawConnector && rawConnector.id ? String(rawConnector.id) : `connector_${index + 1}`,
        fromSymbolId: rawConnector && rawConnector.fromSymbolId ? String(rawConnector.fromSymbolId) : "",
        fromAnchorId: rawConnector && rawConnector.fromAnchorId ? String(rawConnector.fromAnchorId) : "",
        toSymbolId: rawConnector && rawConnector.toSymbolId ? String(rawConnector.toSymbolId) : "",
        toAnchorId: rawConnector && rawConnector.toAnchorId ? String(rawConnector.toAnchorId) : "",
        stroke: rawConnector && typeof rawConnector.stroke === "string" ? rawConnector.stroke : "#0b5d88",
        strokeWidth: clamp(normalizeNumber(rawConnector && rawConnector.strokeWidth, 3), 1, 24),
        cornerRadius: clamp(normalizeNumber(rawConnector && rawConnector.cornerRadius, 10), 0, 48),
        markerEnd: markerEnd,
        label: rawConnector && rawConnector.label ? String(rawConnector.label) : ""
    };
}

function centerPoint(symbol) {
    return {
        x: symbol.x + symbol.width / 2,
        y: symbol.y + symbol.height / 2
    };
}

function resolveAnchorPoint(symbol, requestedAnchorId, towardPoint, snapDistance) {
    if (!symbol) {
        return null;
    }
    const anchors = symbol.absoluteAnchors || [];
    if (!anchors.length) {
        return centerPoint(symbol);
    }

    if (requestedAnchorId) {
        const exact = anchors.find((anchor) => anchor.id === requestedAnchorId);
        if (exact) {
            return exact;
        }
    }

    if (!towardPoint) {
        return anchors[0];
    }

    let nearest = anchors[0];
    let nearestDistance = distance(nearest, towardPoint);
    for (let i = 1; i < anchors.length; i += 1) {
        const currentDistance = distance(anchors[i], towardPoint);
        if (currentDistance < nearestDistance) {
            nearest = anchors[i];
            nearestDistance = currentDistance;
        }
    }

    const effectiveSnap = Math.max(snapDistance, nearest.snapRadius || 0);
    if (nearestDistance <= effectiveSnap) {
        return nearest;
    }

    return nearest;
}

function buildOrthogonalPoints(fromPoint, toPoint, orthogonal) {
    if (!orthogonal) {
        return [fromPoint, toPoint];
    }

    if (Math.abs(fromPoint.x - toPoint.x) < 1 || Math.abs(fromPoint.y - toPoint.y) < 1) {
        return [fromPoint, toPoint];
    }

    const deltaX = Math.abs(toPoint.x - fromPoint.x);
    const deltaY = Math.abs(toPoint.y - fromPoint.y);

    if (deltaX >= deltaY) {
        const midX = fromPoint.x + (toPoint.x - fromPoint.x) / 2;
        return [
            fromPoint,
            { x: midX, y: fromPoint.y },
            { x: midX, y: toPoint.y },
            toPoint
        ];
    }

    const midY = fromPoint.y + (toPoint.y - fromPoint.y) / 2;
    return [
        fromPoint,
        { x: fromPoint.x, y: midY },
        { x: toPoint.x, y: midY },
        toPoint
    ];
}

function polylinePath(points) {
    if (!Array.isArray(points) || !points.length) {
        return "";
    }
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i += 1) {
        path += ` L ${points[i].x} ${points[i].y}`;
    }
    return path;
}

function pointAlongPolyline(points, position) {
    if (!Array.isArray(points) || !points.length) {
        return { x: 0, y: 0 };
    }
    if (points.length === 1) {
        return points[0];
    }

    const clampedPosition = clamp(normalizeNumber(position, 0), 0, 1);
    const segments = [];
    let totalLength = 0;
    for (let i = 1; i < points.length; i += 1) {
        const length = distance(points[i - 1], points[i]);
        segments.push(length);
        totalLength += length;
    }

    if (totalLength < 0.001) {
        return points[0];
    }

    let remaining = totalLength * clampedPosition;
    for (let i = 1; i < points.length; i += 1) {
        const length = segments[i - 1];
        if (remaining <= length || i === points.length - 1) {
            const ratio = length < 0.001 ? 0 : remaining / length;
            return {
                x: points[i - 1].x + (points[i].x - points[i - 1].x) * ratio,
                y: points[i - 1].y + (points[i].y - points[i - 1].y) * ratio
            };
        }
        remaining -= length;
    }

    return points[points.length - 1];
}

function roundedPath(points, radius) {
    if (!Array.isArray(points) || points.length < 2) {
        return "";
    }
    if (points.length < 3 || radius <= 0) {
        return polylinePath(points);
    }

    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length - 1; i += 1) {
        const previous = points[i - 1];
        const current = points[i];
        const next = points[i + 1];
        const incomingLength = distance(previous, current);
        const outgoingLength = distance(current, next);

        if (incomingLength < 0.001 || outgoingLength < 0.001) {
            path += ` L ${current.x} ${current.y}`;
            continue;
        }

        const corner = Math.min(radius, incomingLength / 2, outgoingLength / 2);
        if (corner < 0.001) {
            path += ` L ${current.x} ${current.y}`;
            continue;
        }

        const inPoint = {
            x: current.x + ((previous.x - current.x) * corner) / incomingLength,
            y: current.y + ((previous.y - current.y) * corner) / incomingLength
        };
        const outPoint = {
            x: current.x + ((next.x - current.x) * corner) / outgoingLength,
            y: current.y + ((next.y - current.y) * corner) / outgoingLength
        };

        path += ` L ${inPoint.x} ${inPoint.y} Q ${current.x} ${current.y} ${outPoint.x} ${outPoint.y}`;
    }

    const last = points[points.length - 1];
    path += ` L ${last.x} ${last.y}`;
    return path;
}

function midpointForLabel(points) {
    if (!Array.isArray(points) || !points.length) {
        return { x: 0, y: 0 };
    }
    if (points.length === 2) {
        return {
            x: (points[0].x + points[1].x) / 2,
            y: (points[0].y + points[1].y) / 2
        };
    }
    const middleSegment = Math.floor((points.length - 1) / 2);
    return {
        x: (points[middleSegment].x + points[middleSegment + 1].x) / 2,
        y: (points[middleSegment].y + points[middleSegment + 1].y) / 2
    };
}

function totalPolylineLength(points) {
    if (!Array.isArray(points) || points.length < 2) {
        return 0;
    }
    let total = 0;
    for (let i = 1; i < points.length; i += 1) {
        total += distance(points[i - 1], points[i]);
    }
    return total;
}

function pointAlongPolyline(points, position) {
    if (!Array.isArray(points) || !points.length) {
        return { x: 0, y: 0 };
    }
    if (points.length === 1) {
        return points[0];
    }

    const targetPosition = clamp(normalizeNumber(position, 0.5), 0, 1);
    const totalLength = totalPolylineLength(points);
    if (totalLength < 0.001) {
        return points[0];
    }

    const desiredLength = totalLength * targetPosition;
    let traversed = 0;
    for (let i = 1; i < points.length; i += 1) {
        const startPoint = points[i - 1];
        const endPoint = points[i];
        const segmentLength = distance(startPoint, endPoint);
        if (traversed + segmentLength >= desiredLength) {
            const remaining = desiredLength - traversed;
            const ratio = segmentLength < 0.001 ? 0 : remaining / segmentLength;
            return {
                x: startPoint.x + (endPoint.x - startPoint.x) * ratio,
                y: startPoint.y + (endPoint.y - startPoint.y) * ratio
            };
        }
        traversed += segmentLength;
    }

    return points[points.length - 1];
}

function createGlowFilter(filterId, color, intensity, deviations) {
    const normalizedIntensity = clamp(normalizeNumber(intensity, 0), 0, 1);
    if (normalizedIntensity <= 0.001) {
        return null;
    }

    const shadowSteps = Array.isArray(deviations) && deviations.length ? deviations : [
        { stdDeviation: 2.2, opacity: 0.8 },
        { stdDeviation: 5.5, opacity: 0.6 },
        { stdDeviation: 10.5, opacity: 0.4 }
    ];
    return React.createElement("filter", {
        id: filterId,
        x: "-180%",
        y: "-180%",
        width: "460%",
        height: "460%",
        colorInterpolationFilters: "sRGB"
    }, shadowSteps.map((step, index) =>
        React.createElement("feDropShadow", {
            key: `${filterId}_${index}`,
            dx: 0,
            dy: 0,
            stdDeviation: step.stdDeviation,
            floodColor: color,
            floodOpacity: clamp(step.opacity * normalizedIntensity, 0, 1)
        })
    ));
}

function createArrowMarker(markerId, stroke) {
    return React.createElement("marker", {
        key: markerId,
        id: markerId,
        viewBox: "0 0 10 10",
        refX: 9,
        refY: 5,
        markerWidth: 7,
        markerHeight: 7,
        orient: "auto-start-reverse"
    }, React.createElement("path", {
        d: "M 0 0 L 10 5 L 0 10 z",
        fill: stroke
    }));
}

function normalizeRelativeAnchor(anchor, index, fallbackAnchor) {
    const fallback = fallbackAnchor || {};
    return {
        id: normalizeAnchorRef(anchor && anchor.id, normalizeAnchorRef(fallback.id, `anchor_${index + 1}`)),
        label: anchor && anchor.label ? String(anchor.label) : (fallback.label || ""),
        x: clamp(normalizeNumber(anchor && anchor.x, normalizeNumber(fallback.x, 0.5)), 0, 1),
        y: clamp(normalizeNumber(anchor && anchor.y, normalizeNumber(fallback.y, 0.5)), 0, 1),
        snapRadius: clamp(normalizeNumber(anchor && anchor.snapRadius, normalizeNumber(fallback.snapRadius, 16)), 0, 240)
    };
}

function normalizeRelativeAnchorSet(rawAnchors, defaultAnchors) {
    const source = Array.isArray(rawAnchors) && rawAnchors.length ? rawAnchors : defaultAnchors;
    return source.map((anchor, index) =>
        normalizeRelativeAnchor(anchor, index, defaultAnchors[index] || defaultAnchors[0] || {})
    );
}

function normalizeLineAnchor(anchor, index, fallbackAnchor) {
    const fallback = fallbackAnchor || {};
    return {
        id: normalizeAnchorRef(anchor && anchor.id, normalizeAnchorRef(fallback.id, `anchor_${index + 1}`)),
        label: anchor && anchor.label ? String(anchor.label) : (fallback.label || ""),
        position: clamp(normalizeNumber(anchor && anchor.position, normalizeNumber(fallback.position, 0.5)), 0, 1),
        snapRadius: clamp(normalizeNumber(anchor && anchor.snapRadius, normalizeNumber(fallback.snapRadius, 16)), 0, 240)
    };
}

function normalizeLineAnchorSet(rawAnchors) {
    const source = Array.isArray(rawAnchors) && rawAnchors.length ? rawAnchors : CONNECTOR_LINE_DEFAULT_ANCHORS;
    const normalized = source.map((anchor, index) =>
        normalizeLineAnchor(anchor, index, CONNECTOR_LINE_DEFAULT_ANCHORS[index] || CONNECTOR_LINE_DEFAULT_ANCHORS[0])
    );
    if (!normalized.some((anchor) => anchor.id === "start")) {
        normalized.unshift(deepClone(CONNECTOR_LINE_DEFAULT_ANCHORS[0]));
    }
    if (!normalized.some((anchor) => anchor.id === "end")) {
        normalized.push(deepClone(CONNECTOR_LINE_DEFAULT_ANCHORS[CONNECTOR_LINE_DEFAULT_ANCHORS.length - 1]));
    }
    return normalized;
}

function mapRelativeAnchorsToViewbox(anchorPoints, viewBoxWidth, viewBoxHeight) {
    return anchorPoints.map((anchor) => ({
        id: anchor.id,
        label: anchor.label,
        x: anchor.x * viewBoxWidth,
        y: anchor.y * viewBoxHeight,
        snapRadius: anchor.snapRadius
    }));
}

function buildLinePublishedAnchors(anchorPoints, polylinePoints) {
    return anchorPoints.map((anchor) => {
        const point = pointAlongPolyline(polylinePoints, anchor.position);
        return {
            id: anchor.id,
            label: anchor.label,
            x: point.x,
            y: point.y,
            snapRadius: anchor.snapRadius
        };
    });
}

function publishAnchors(rootProps, targetId, anchors, options) {
    if (!targetId) {
        return rootProps;
    }

    const settings = options || {};
    rootProps["data-anchor-target-id"] = targetId;
    rootProps["data-anchor-coord-mode"] = settings.coordMode || "viewbox";
    if (settings.coordMode === "viewbox") {
        rootProps["data-anchor-viewbox-width"] = String(settings.viewBoxWidth);
        rootProps["data-anchor-viewbox-height"] = String(settings.viewBoxHeight);
    }
    rootProps["data-anchor-points"] = JSON.stringify(anchors || []);
    (anchors || []).forEach((anchor) => {
        const attrId = String(anchor.id).replace(/[^A-Za-z0-9_-]/g, "_");
        rootProps[`data-anchor-${attrId}-x`] = String(anchor.x);
        rootProps[`data-anchor-${attrId}-y`] = String(anchor.y);
    });
    return rootProps;
}

function renderAnchorDebugNodes(anchors, showAnchorPoints, color) {
    if (!showAnchorPoints) {
        return null;
    }
    return anchors.map((anchor) =>
        React.createElement("g", { key: `debug_${anchor.id}` }, [
            React.createElement("circle", {
                key: "marker",
                cx: anchor.x,
                cy: anchor.y,
                r: 5,
                fill: color || "#ef4444",
                stroke: "#ffffff",
                strokeWidth: 1.5
            }),
            React.createElement("text", {
                key: "label",
                x: anchor.x + 8,
                y: anchor.y - 6,
                fill: color || "#ef4444",
                fontSize: 9,
                fontFamily: "Segoe UI, Arial, sans-serif"
            }, anchor.label || anchor.id)
        ])
    );
}

class AnchorConnectorCanvas extends Component {
    constructor(props) {
        super(props);
        this.state = {
            failedSymbols: {}
        };
    }

    handleSymbolLoadError(symbolId) {
        if (this.state.failedSymbols[symbolId]) {
            return;
        }
        this.setState((previousState) => ({
            failedSymbols: Object.assign({}, previousState.failedSymbols, { [symbolId]: true })
        }));
    }

    renderSymbolGraphic(symbol, showFallback) {
        const padding = 4;
        const innerWidth = Math.max(2, symbol.width - padding * 2);
        const innerHeight = Math.max(2, symbol.height - padding * 2);
        const isUrlPath = isUrlLikeSvgPath(symbol.svgPath);

        if (!showFallback && isUrlPath) {
            return React.createElement("image", {
                key: `img-${symbol.id}`,
                href: symbol.svgPath,
                x: padding,
                y: padding,
                width: innerWidth,
                height: innerHeight,
                preserveAspectRatio: "xMidYMid meet",
                onError: () => this.handleSymbolLoadError(symbol.id)
            });
        }

        if (!showFallback && symbol.svgPath && !isUrlPath) {
            return React.createElement("path", {
                key: `path-${symbol.id}`,
                d: symbol.svgPath,
                fill: symbol.fill,
                stroke: symbol.stroke,
                strokeWidth: 2,
                strokeLinecap: "round",
                strokeLinejoin: "round",
                vectorEffect: "non-scaling-stroke"
            });
        }

        return React.createElement("g", { key: `fallback-${symbol.id}` }, [
            React.createElement("rect", {
                key: "fallback-bg",
                x: padding,
                y: padding,
                width: innerWidth,
                height: innerHeight,
                rx: 4,
                ry: 4,
                fill: "#f8fafc",
                stroke: "#94a3b8",
                strokeWidth: 1.5,
                strokeDasharray: "5 3"
            }),
            React.createElement("text", {
                key: "fallback-text",
                x: symbol.width / 2,
                y: symbol.height / 2,
                textAnchor: "middle",
                dominantBaseline: "middle",
                fill: "#64748b",
                fontSize: 11,
                fontFamily: "Segoe UI, sans-serif"
            }, "SVG unavailable")
        ]);
    }

    render() {
        const { props, emit, store } = this.props;

        const symbols = (Array.isArray(props.symbols) ? props.symbols : []).map(normalizeSymbol);
        const connectors = (Array.isArray(props.connectors) ? props.connectors : []).map(normalizeConnector);
        const symbolsById = {};
        symbols.forEach((symbol) => {
            symbolsById[symbol.id] = symbol;
        });

        const canvasWidth = Math.max(200, normalizeNumber(props.canvasWidth, 860));
        const canvasHeight = Math.max(140, normalizeNumber(props.canvasHeight, 520));
        const markerIdSeed = store && store.path ? String(store.path).replace(/[^A-Za-z0-9_]/g, "_") : "anchorCanvas";
        const arrowMarkerId = `anchorConnectorArrow_${markerIdSeed}`;

        const defs = React.createElement("defs", { key: "defs" }, [
            React.createElement("marker", {
                key: "arrowMarker",
                id: arrowMarkerId,
                viewBox: "0 0 10 10",
                refX: 9,
                refY: 5,
                markerWidth: 7,
                markerHeight: 7,
                orient: "auto-start-reverse"
            }, React.createElement("path", {
                d: "M 0 0 L 10 5 L 0 10 z",
                fill: "#0b5d88"
            }))
        ]);

        const connectorNodes = connectors.map((connector) => {
            const fromSymbol = symbolsById[connector.fromSymbolId];
            const toSymbol = symbolsById[connector.toSymbolId];
            if (!fromSymbol || !toSymbol) {
                return null;
            }

            const fromHint = centerPoint(toSymbol);
            const fromPoint = resolveAnchorPoint(fromSymbol, connector.fromAnchorId, fromHint, props.snapDistance);
            const toPoint = resolveAnchorPoint(toSymbol, connector.toAnchorId, fromPoint, props.snapDistance);
            if (!fromPoint || !toPoint) {
                return null;
            }

            const elbowPoints = buildOrthogonalPoints(fromPoint, toPoint, props.orthogonal);
            const pathData = roundedPath(elbowPoints, connector.cornerRadius);
            const labelPoint = midpointForLabel(elbowPoints);

            const connectorChildren = [
                React.createElement("path", {
                    key: `${connector.id}-path`,
                    d: pathData,
                    fill: "none",
                    stroke: connector.stroke,
                    strokeWidth: connector.strokeWidth,
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    markerEnd: connector.markerEnd ? `url(#${arrowMarkerId})` : undefined
                })
            ];

            if (props.showLabels && connector.label) {
                connectorChildren.push(React.createElement("text", {
                    key: `${connector.id}-label`,
                    x: labelPoint.x,
                    y: labelPoint.y - 8,
                    fill: "#0f172a",
                    fontSize: 12,
                    textAnchor: "middle",
                    fontFamily: "Segoe UI, sans-serif"
                }, connector.label));
            }

            return React.createElement("g", { key: connector.id }, connectorChildren);
        });

        const symbolNodes = symbols.map((symbol) => {
            const localAnchors = symbol.anchors.map((anchor) =>
                React.createElement("circle", {
                    key: `${symbol.id}-anchor-${anchor.id}`,
                    cx: anchor.x,
                    cy: anchor.y,
                    r: 5,
                    fill: "#2e7d32",
                    stroke: "#ffffff",
                    strokeWidth: 2
                })
            );

            const symbolLabel = props.showLabels
                ? React.createElement("text", {
                    key: `${symbol.id}-label`,
                    x: symbol.width / 2,
                    y: symbol.height + 16,
                    textAnchor: "middle",
                    fill: "#0f172a",
                    fontSize: 12,
                    fontFamily: "Segoe UI, sans-serif"
                }, symbol.label)
                : null;

            const showFallback = !!this.state.failedSymbols[symbol.id];

            return React.createElement("g", {
                key: symbol.id,
                transform: `translate(${symbol.x}, ${symbol.y})`
            }, [
                React.createElement("rect", {
                    key: `${symbol.id}-frame`,
                    x: 0,
                    y: 0,
                    width: symbol.width,
                    height: symbol.height,
                    rx: 6,
                    ry: 6,
                    fill: "rgba(255,255,255,0.01)",
                    stroke: "#cbd5e1",
                    strokeWidth: 1
                }),
                this.renderSymbolGraphic(symbol, showFallback),
                props.showAnchors ? localAnchors : null,
                symbolLabel
            ]);
        });

        const svgRoot = React.createElement("svg", {
            viewBox: `0 0 ${canvasWidth} ${canvasHeight}`,
            preserveAspectRatio: "none",
            style: { width: "100%", height: "100%" }
        }, [
            defs,
            React.createElement("rect", {
                key: "canvas-bg",
                x: 0,
                y: 0,
                width: canvasWidth,
                height: canvasHeight,
                fill: props.backgroundColor
            }),
            connectorNodes,
            symbolNodes
        ]);

        return React.createElement("div", Object.assign({}, rootEmit(emit, props.style, props.backgroundColor)), svgRoot);
    }
}

class AnchorConnectorCanvasMeta {
    getComponentType() {
        return COMPONENT_TYPE;
    }

    getViewComponent() {
        return AnchorConnectorCanvas;
    }

    getDefaultSize() {
        return {
            width: 860,
            height: 520
        };
    }

    getPropsReducer(tree) {
        const symbols = tree.read("symbols", deepClone(defaultSymbols()));
        const connectors = tree.read("connectors", deepClone(defaultConnectors()));
        return {
            symbols: Array.isArray(symbols) ? symbols : deepClone(defaultSymbols()),
            connectors: Array.isArray(connectors) ? connectors : deepClone(defaultConnectors()),
            showAnchors: !!tree.read("showAnchors", true),
            showLabels: !!tree.read("showLabels", true),
            orthogonal: !!tree.read("orthogonal", true),
            snapDistance: clamp(normalizeNumber(tree.read("snapDistance", 20), 20), 0, 120),
            gridSize: Math.max(1, normalizeNumber(tree.read("gridSize", 10), 10)),
            backgroundColor: tree.readString("backgroundColor", "#f1f5f9"),
            canvasWidth: Math.max(200, normalizeNumber(tree.read("canvasWidth", 860), 860)),
            canvasHeight: Math.max(140, normalizeNumber(tree.read("canvasHeight", 520), 520)),
            style: tree.read("style", {})
        };
    }
}

if (window.__anchorConnectorCanvasRegistered) {
    return;
}
ComponentRegistry.register(new AnchorConnectorCanvasMeta());
window.__anchorConnectorCanvasRegistered = true;
}

function tryBootstrapRegistration() {
    if (!window.PerspectiveClient || !window.PerspectiveClient.ComponentRegistry || !window.PerspectiveClient.Component) {
        return false;
    }
    try {
        registerAnchorConnectorComponent(window.PerspectiveClient);
        return true;
    } catch (error) {
        if (window.console && typeof window.console.error === "function") {
            window.console.error("Failed to register Anchor Connector Canvas component.", error);
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

(function initAnchorConnectorTargetAndOverlayRegistration() {
function registerAnchorConnectorTargetAndOverlay(PerspectiveClient) {
const { Component, ComponentRegistry } = PerspectiveClient;

const BREAKER_COMPONENT_TYPE = "com.miguelgrillo.anchorconnectors.breaker";
const OVERLAY_COMPONENT_TYPE = "com.miguelgrillo.anchorconnectors.connector_overlay";
const LINE_COMPONENT_TYPE = "com.miguelgrillo.anchorconnectors.connector_line";
const GENSET_PANEL_COMPONENT_TYPE = "com.miguelgrillo.anchorconnectors.genset_panel";
const GENSET_PANEL_TRANSPARENT_COMPONENT_TYPE = "com.miguelgrillo.anchorconnectors.genset_panel_transparent";
const GENSET_PANEL_R2_COMPONENT_TYPE = "com.miguelgrillo.anchorconnectors.genset_panel_r2";
const GENSET_PANEL_R2_TRANSPARENT_COMPONENT_TYPE = "com.miguelgrillo.anchorconnectors.genset_panel_r2_transparent";
const MODERN_LINE_COMPONENT_TYPE = "com.miguelgrillo.anchorconnectors.modern_line";
const MODERN_LINE_REV2_COMPONENT_TYPE = "com.miguelgrillo.anchorconnectors.modern_line_rev2";
const MODERN_TANK_COMPONENT_TYPE = "com.miguelgrillo.anchorconnectors.modern_tank";
const MODERN_TANK_REV2_COMPONENT_TYPE = "com.miguelgrillo.anchorconnectors.modern_tank_rev2";
const MODERN_VALVE_CONTROL_COMPONENT_TYPE = "com.miguelgrillo.anchorconnectors.modern_valve_control";
const MODERN_VALVE_CONTROL_REV2_COMPONENT_TYPE = "com.miguelgrillo.anchorconnectors.modern_valve_control_rev2";
const VALID_SIDES = ["top", "right", "bottom", "left"];

const BREAKER_ANCHOR_POINTS = [
    { id: "top", label: "Top", x: 81, y: 24, snapRadius: 16 },
    { id: "right", label: "Right", x: 138, y: 81, snapRadius: 16 },
    { id: "bottom", label: "Bottom", x: 81, y: 138, snapRadius: 16 },
    { id: "left", label: "Left", x: 24, y: 81, snapRadius: 16 }
];

const GENSET_DEFAULT_ANCHORS = [
    { id: "breaker_top", label: "Breaker Top", x: 0.5, y: 0.06, snapRadius: 16 },
    { id: "breaker_bottom", label: "Breaker Bottom", x: 0.5, y: 0.23, snapRadius: 16 },
    { id: "generator_top", label: "Generator Top", x: 0.5, y: 0.41, snapRadius: 16 },
    { id: "generator_left", label: "Generator Left", x: 0.28, y: 0.5, snapRadius: 16 },
    { id: "generator_right", label: "Generator Right", x: 0.72, y: 0.5, snapRadius: 16 },
    { id: "status_top", label: "Status Top", x: 0.5, y: 0.58, snapRadius: 16 },
    { id: "status_left", label: "Status Left", x: 0.18, y: 0.82, snapRadius: 16 },
    { id: "status_right", label: "Status Right", x: 0.82, y: 0.82, snapRadius: 16 },
    { id: "status_bottom", label: "Status Bottom", x: 0.5, y: 0.98, snapRadius: 16 }
];

const MODERN_LINE_DEFAULT_ANCHORS = [
    { id: "start", label: "Start", x: 0.05, y: 0.5, snapRadius: 16 },
    { id: "quarter_1", label: "Quarter 1", x: 0.25, y: 0.5, snapRadius: 16 },
    { id: "middle", label: "Middle", x: 0.5, y: 0.5, snapRadius: 16 },
    { id: "quarter_3", label: "Quarter 3", x: 0.75, y: 0.5, snapRadius: 16 },
    { id: "end", label: "End", x: 0.95, y: 0.5, snapRadius: 16 }
];

const MODERN_TANK_DEFAULT_ANCHORS = [
    { id: "top", label: "Top", x: 0.5, y: 0.06, snapRadius: 16 },
    { id: "upper_left", label: "Upper Left", x: 0.18, y: 0.2, snapRadius: 16 },
    { id: "upper_right", label: "Upper Right", x: 0.82, y: 0.2, snapRadius: 16 },
    { id: "left", label: "Left", x: 0.05, y: 0.5, snapRadius: 16 },
    { id: "center", label: "Center", x: 0.5, y: 0.55, snapRadius: 16 },
    { id: "right", label: "Right", x: 0.95, y: 0.5, snapRadius: 16 },
    { id: "bottom", label: "Bottom", x: 0.5, y: 0.95, snapRadius: 16 }
];

const MODERN_VALVE_DEFAULT_ANCHORS = [
    { id: "left", label: "Left", x: 0.05, y: 0.5, snapRadius: 16 },
    { id: "center_left", label: "Center Left", x: 0.33, y: 0.5, snapRadius: 16 },
    { id: "center", label: "Center", x: 0.5, y: 0.5, snapRadius: 16 },
    { id: "center_right", label: "Center Right", x: 0.67, y: 0.5, snapRadius: 16 },
    { id: "right", label: "Right", x: 0.95, y: 0.5, snapRadius: 16 },
    { id: "top", label: "Top", x: 0.5, y: 0.12, snapRadius: 16 },
    { id: "bottom", label: "Bottom", x: 0.5, y: 0.88, snapRadius: 16 }
];

const CONNECTOR_LINE_DEFAULT_ANCHORS = [
    { id: "start", label: "Start", position: 0, snapRadius: 16 },
    { id: "quarter_1", label: "Quarter 1", position: 0.25, snapRadius: 16 },
    { id: "middle", label: "Middle", position: 0.5, snapRadius: 16 },
    { id: "quarter_3", label: "Quarter 3", position: 0.75, snapRadius: 16 },
    { id: "end", label: "End", position: 1, snapRadius: 16 }
];

function normalizeNumber(value, fallback) {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : fallback;
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

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

function readString(tree, key, fallback) {
    if (tree && typeof tree.readString === "function") {
        const value = tree.readString(key, fallback);
        return typeof value === "string" ? value : fallback;
    }
    const value = tree.read(key, fallback);
    return typeof value === "string" ? value : fallback;
}

function emitRoot(emit, baseClassName, styleProp, baseStyle) {
    const style = Object.assign({}, baseStyle || {}, inlineStyle(styleProp));
    const classes = [baseClassName].concat(splitClasses(styleProp));
    return emit({ classes, style });
}

function buildIdSeed(store, fallback) {
    return store && store.path ? String(store.path).replace(/[^A-Za-z0-9_]/g, "_") : fallback;
}

function normalizeAnchorRef(rawValue, fallback) {
    const value = rawValue === undefined || rawValue === null ? fallback : String(rawValue).trim();
    if (!value) {
        return fallback;
    }
    const lowerValue = value.toLowerCase();
    return VALID_SIDES.includes(lowerValue) ? lowerValue : value;
}

function normalizeRelativeAnchor(anchor, index, fallbackAnchor) {
    const fallback = fallbackAnchor || {};
    return {
        id: normalizeAnchorRef(anchor && anchor.id, normalizeAnchorRef(fallback.id, `anchor_${index + 1}`)),
        label: anchor && anchor.label ? String(anchor.label) : (fallback.label || ""),
        x: clamp(normalizeNumber(anchor && anchor.x, normalizeNumber(fallback.x, 0.5)), 0, 1),
        y: clamp(normalizeNumber(anchor && anchor.y, normalizeNumber(fallback.y, 0.5)), 0, 1),
        snapRadius: clamp(normalizeNumber(anchor && anchor.snapRadius, normalizeNumber(fallback.snapRadius, 16)), 0, 240)
    };
}

function normalizeRelativeAnchorSet(rawAnchors, defaultAnchors) {
    const source = Array.isArray(rawAnchors) && rawAnchors.length ? rawAnchors : defaultAnchors;
    return source.map((anchor, index) =>
        normalizeRelativeAnchor(anchor, index, defaultAnchors[index] || defaultAnchors[0] || {})
    );
}

function normalizeLineAnchor(anchor, index, fallbackAnchor) {
    const fallback = fallbackAnchor || {};
    return {
        id: normalizeAnchorRef(anchor && anchor.id, normalizeAnchorRef(fallback.id, `anchor_${index + 1}`)),
        label: anchor && anchor.label ? String(anchor.label) : (fallback.label || ""),
        position: clamp(normalizeNumber(anchor && anchor.position, normalizeNumber(fallback.position, 0.5)), 0, 1),
        snapRadius: clamp(normalizeNumber(anchor && anchor.snapRadius, normalizeNumber(fallback.snapRadius, 16)), 0, 240)
    };
}

function normalizeLineAnchorSet(rawAnchors) {
    const source = Array.isArray(rawAnchors) && rawAnchors.length ? rawAnchors : CONNECTOR_LINE_DEFAULT_ANCHORS;
    const normalized = source.map((anchor, index) =>
        normalizeLineAnchor(anchor, index, CONNECTOR_LINE_DEFAULT_ANCHORS[index] || CONNECTOR_LINE_DEFAULT_ANCHORS[0])
    );
    if (!normalized.some((anchor) => anchor.id === "start")) {
        normalized.unshift(deepClone(CONNECTOR_LINE_DEFAULT_ANCHORS[0]));
    }
    if (!normalized.some((anchor) => anchor.id === "end")) {
        normalized.push(deepClone(CONNECTOR_LINE_DEFAULT_ANCHORS[CONNECTOR_LINE_DEFAULT_ANCHORS.length - 1]));
    }
    return normalized;
}

function mapRelativeAnchorsToViewbox(anchorPoints, viewBoxWidth, viewBoxHeight) {
    return anchorPoints.map((anchor) => ({
        id: anchor.id,
        label: anchor.label,
        x: anchor.x * viewBoxWidth,
        y: anchor.y * viewBoxHeight,
        snapRadius: anchor.snapRadius
    }));
}

function createGlowFilter(filterId, color, intensity, deviations) {
    const normalizedIntensity = clamp(normalizeNumber(intensity, 0), 0, 1);
    if (normalizedIntensity <= 0.001) {
        return null;
    }

    const shadowSteps = Array.isArray(deviations) && deviations.length ? deviations : [
        { stdDeviation: 2.2, opacity: 0.8 },
        { stdDeviation: 5.5, opacity: 0.6 },
        { stdDeviation: 10.5, opacity: 0.4 }
    ];
    return React.createElement("filter", {
        id: filterId,
        x: "-180%",
        y: "-180%",
        width: "460%",
        height: "460%",
        colorInterpolationFilters: "sRGB"
    }, shadowSteps.map((step, index) =>
        React.createElement("feDropShadow", {
            key: `${filterId}_${index}`,
            dx: 0,
            dy: 0,
            stdDeviation: step.stdDeviation,
            floodColor: color,
            floodOpacity: clamp(step.opacity * normalizedIntensity, 0, 1)
        })
    ));
}

function createArrowMarker(markerId, stroke) {
    return React.createElement("marker", {
        key: markerId,
        id: markerId,
        viewBox: "0 0 10 10",
        refX: 9,
        refY: 5,
        markerWidth: 7,
        markerHeight: 7,
        orient: "auto-start-reverse"
    }, React.createElement("path", {
        d: "M 0 0 L 10 5 L 0 10 z",
        fill: stroke
    }));
}

function pointAlongConnectorPolyline(points, position) {
    if (!Array.isArray(points) || !points.length) {
        return { x: 0, y: 0 };
    }
    if (points.length === 1) {
        return points[0];
    }

    const targetPosition = clamp(normalizeNumber(position, 0.5), 0, 1);
    let totalLength = 0;
    const segments = [];
    for (let i = 1; i < points.length; i += 1) {
        const length = distance(points[i - 1], points[i]);
        segments.push(length);
        totalLength += length;
    }

    if (totalLength < 0.001) {
        return points[0];
    }

    let remaining = totalLength * targetPosition;
    for (let i = 1; i < points.length; i += 1) {
        const segmentLength = segments[i - 1];
        if (remaining <= segmentLength || i === points.length - 1) {
            const ratio = segmentLength < 0.001 ? 0 : remaining / segmentLength;
            return {
                x: points[i - 1].x + (points[i].x - points[i - 1].x) * ratio,
                y: points[i - 1].y + (points[i].y - points[i - 1].y) * ratio
            };
        }
        remaining -= segmentLength;
    }

    return points[points.length - 1];
}

function buildLinePublishedAnchors(anchorPoints, polylinePoints) {
    return anchorPoints.map((anchor) => {
        const point = pointAlongConnectorPolyline(polylinePoints, anchor.position);
        return {
            id: anchor.id,
            label: anchor.label,
            x: point.x,
            y: point.y,
            snapRadius: anchor.snapRadius
        };
    });
}

function publishAnchors(rootProps, targetId, anchors, options) {
    if (!targetId) {
        return rootProps;
    }

    const settings = options || {};
    rootProps["data-anchor-target-id"] = targetId;
    rootProps["data-anchor-coord-mode"] = settings.coordMode || "viewbox";
    if (settings.coordMode === "viewbox") {
        rootProps["data-anchor-viewbox-width"] = String(settings.viewBoxWidth);
        rootProps["data-anchor-viewbox-height"] = String(settings.viewBoxHeight);
    }
    rootProps["data-anchor-points"] = JSON.stringify(anchors || []);
    (anchors || []).forEach((anchor) => {
        const attrId = String(anchor.id).replace(/[^A-Za-z0-9_-]/g, "_");
        rootProps[`data-anchor-${attrId}-x`] = String(anchor.x);
        rootProps[`data-anchor-${attrId}-y`] = String(anchor.y);
    });
    return rootProps;
}

function renderAnchorDebugNodes(anchors, showAnchorPoints, color) {
    if (!showAnchorPoints) {
        return null;
    }
    return anchors.map((anchor) =>
        React.createElement("g", { key: `debug_${anchor.id}` }, [
            React.createElement("circle", {
                key: "marker",
                cx: anchor.x,
                cy: anchor.y,
                r: 5,
                fill: color || "#ef4444",
                stroke: "#ffffff",
                strokeWidth: 1.5
            }),
            React.createElement("text", {
                key: "label",
                x: anchor.x + 8,
                y: anchor.y - 6,
                fill: color || "#ef4444",
                fontSize: 9,
                fontFamily: "Segoe UI, Arial, sans-serif"
            }, anchor.label || anchor.id)
        ])
    );
}

function distance(a, b) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function buildOrthogonalPoints(fromPoint, toPoint, orthogonal) {
    if (!orthogonal) {
        return [fromPoint, toPoint];
    }
    if (Math.abs(fromPoint.x - toPoint.x) < 1 || Math.abs(fromPoint.y - toPoint.y) < 1) {
        return [fromPoint, toPoint];
    }

    const deltaX = Math.abs(toPoint.x - fromPoint.x);
    const deltaY = Math.abs(toPoint.y - fromPoint.y);
    if (deltaX >= deltaY) {
        const midX = fromPoint.x + (toPoint.x - fromPoint.x) / 2;
        return [
            fromPoint,
            { x: midX, y: fromPoint.y },
            { x: midX, y: toPoint.y },
            toPoint
        ];
    }

    const midY = fromPoint.y + (toPoint.y - fromPoint.y) / 2;
    return [
        fromPoint,
        { x: fromPoint.x, y: midY },
        { x: toPoint.x, y: midY },
        toPoint
    ];
}

function polylinePath(points) {
    if (!Array.isArray(points) || !points.length) {
        return "";
    }
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i += 1) {
        path += ` L ${points[i].x} ${points[i].y}`;
    }
    return path;
}

function roundedPath(points, radius) {
    if (!Array.isArray(points) || points.length < 2) {
        return "";
    }
    if (points.length < 3 || radius <= 0) {
        return polylinePath(points);
    }

    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length - 1; i += 1) {
        const previous = points[i - 1];
        const current = points[i];
        const next = points[i + 1];
        const incomingLength = distance(previous, current);
        const outgoingLength = distance(current, next);

        if (incomingLength < 0.001 || outgoingLength < 0.001) {
            path += ` L ${current.x} ${current.y}`;
            continue;
        }

        const corner = Math.min(radius, incomingLength / 2, outgoingLength / 2);
        if (corner < 0.001) {
            path += ` L ${current.x} ${current.y}`;
            continue;
        }

        const inPoint = {
            x: current.x + ((previous.x - current.x) * corner) / incomingLength,
            y: current.y + ((previous.y - current.y) * corner) / incomingLength
        };
        const outPoint = {
            x: current.x + ((next.x - current.x) * corner) / outgoingLength,
            y: current.y + ((next.y - current.y) * corner) / outgoingLength
        };

        path += ` L ${inPoint.x} ${inPoint.y} Q ${current.x} ${current.y} ${outPoint.x} ${outPoint.y}`;
    }

    const last = points[points.length - 1];
    path += ` L ${last.x} ${last.y}`;
    return path;
}

function midpointForLabel(points) {
    if (!Array.isArray(points) || !points.length) {
        return { x: 0, y: 0 };
    }
    if (points.length === 2) {
        return {
            x: (points[0].x + points[1].x) / 2,
            y: (points[0].y + points[1].y) / 2
        };
    }
    const middleSegment = Math.floor((points.length - 1) / 2);
    return {
        x: (points[middleSegment].x + points[middleSegment + 1].x) / 2,
        y: (points[middleSegment].y + points[middleSegment + 1].y) / 2
    };
}

function defaultOverlayConnections() {
    return [
        {
            id: "overlay_1",
            fromTargetId: "breakerA",
            fromAnchor: "right",
            toTargetId: "breakerB",
            toAnchor: "left",
            stroke: "#156082",
            strokeWidth: 2.5,
            cornerRadius: 8,
            markerEnd: "none",
            label: "Feeder"
        }
    ];
}

const DEFAULT_LINE_START = {
    mode: "free",
    x: 120,
    y: 120,
    targetId: "",
    anchorId: ""
};

const DEFAULT_LINE_END = {
    mode: "free",
    x: 520,
    y: 320,
    targetId: "",
    anchorId: ""
};

function normalizeOverlayConnection(rawConnector, index) {
    const markerEndValue = rawConnector && typeof rawConnector.markerEnd === "string"
        ? rawConnector.markerEnd
        : "";
    const showArrowValue = rawConnector && rawConnector.showArrow !== undefined ? !!rawConnector.showArrow : undefined;
    const markerEnd = markerEndValue === "arrow"
        ? "arrow"
        : markerEndValue === "none"
            ? "none"
            : showArrowValue === true
                ? "arrow"
                : "none";

    return {
        id: rawConnector && rawConnector.id ? String(rawConnector.id) : `connection_${index + 1}`,
        fromTargetId: rawConnector && rawConnector.fromTargetId ? String(rawConnector.fromTargetId) : "",
        toTargetId: rawConnector && rawConnector.toTargetId ? String(rawConnector.toTargetId) : "",
        fromAnchor: normalizeAnchorRef(rawConnector && rawConnector.fromAnchor, "right"),
        toAnchor: normalizeAnchorRef(rawConnector && rawConnector.toAnchor, "left"),
        stroke: rawConnector && typeof rawConnector.stroke === "string" ? rawConnector.stroke : "#156082",
        strokeWidth: clamp(normalizeNumber(rawConnector && rawConnector.strokeWidth, 2.5), 0.1, 24),
        cornerRadius: clamp(normalizeNumber(rawConnector && rawConnector.cornerRadius, 8), 0, 64),
        showArrow: markerEnd === "arrow",
        markerEnd,
        label: rawConnector && rawConnector.label ? String(rawConnector.label) : "",
        labelColor: rawConnector && typeof rawConnector.labelColor === "string" ? rawConnector.labelColor : "#0f172a"
    };
}

function normalizeEndpointState(rawEndpoint, fallback) {
    const base = fallback && typeof fallback === "object" ? fallback : DEFAULT_LINE_START;
    const requestedMode = rawEndpoint && typeof rawEndpoint.mode === "string"
        ? rawEndpoint.mode.toLowerCase()
        : "";
    const fallbackMode = base.mode === "snapped" ? "snapped" : "free";
    const mode = requestedMode === "snapped" || requestedMode === "free"
        ? requestedMode
        : fallbackMode;

    return {
        mode,
        x: normalizeNumber(rawEndpoint && rawEndpoint.x, normalizeNumber(base.x, 0)),
        y: normalizeNumber(rawEndpoint && rawEndpoint.y, normalizeNumber(base.y, 0)),
        targetId: rawEndpoint && rawEndpoint.targetId ? String(rawEndpoint.targetId) : (base.targetId ? String(base.targetId) : ""),
        anchorId: normalizeAnchorRef(rawEndpoint && rawEndpoint.anchorId, normalizeAnchorRef(base.anchorId, ""))
    };
}

function buildLegacyEndpoint(rawTargetId, rawAnchorId, fallback) {
    const hasTarget = rawTargetId !== undefined && rawTargetId !== null && String(rawTargetId).trim() !== "";
    return normalizeEndpointState({
        mode: hasTarget ? "snapped" : undefined,
        targetId: hasTarget ? String(rawTargetId) : undefined,
        anchorId: rawAnchorId
    }, fallback);
}

function isDefaultLineEndpoint(rawEndpoint, fallback) {
    if (!rawEndpoint || typeof rawEndpoint !== "object") {
        return false;
    }

    const normalizedEndpoint = normalizeEndpointState(rawEndpoint, fallback);
    const normalizedFallback = normalizeEndpointState(fallback, fallback);
    return normalizedEndpoint.mode === normalizedFallback.mode
        && normalizedEndpoint.x === normalizedFallback.x
        && normalizedEndpoint.y === normalizedFallback.y
        && normalizedEndpoint.targetId === normalizedFallback.targetId
        && normalizedEndpoint.anchorId === normalizedFallback.anchorId;
}

function normalizeLineEndpoint(rawEndpoint, legacyTargetId, legacyAnchorId, fallback) {
    if (rawEndpoint !== undefined) {
        const normalizedEndpoint = normalizeEndpointState(rawEndpoint, fallback);
        if (isDefaultLineEndpoint(rawEndpoint, fallback) && legacyTargetId) {
            return buildLegacyEndpoint(legacyTargetId, legacyAnchorId, fallback);
        }
        return normalizedEndpoint;
    }

    return buildLegacyEndpoint(legacyTargetId, legacyAnchorId, fallback);
}

function resolveEndpointPoint(endpoint, rootRect, ownerDocument, legacyTargetId, legacyAnchorId) {
    if (!endpoint || !rootRect) {
        return null;
    }

    const normalizedEndpoint = normalizeEndpointState(
        endpoint,
        buildLegacyEndpoint(legacyTargetId, legacyAnchorId, endpoint)
    );
    if (normalizedEndpoint.mode === "free") {
        return {
            x: normalizedEndpoint.x,
            y: normalizedEndpoint.y
        };
    }

    const fallbackPoint = {
        x: normalizedEndpoint.x,
        y: normalizedEndpoint.y
    };

    const targetElement = findTargetElementById(ownerDocument, normalizedEndpoint.targetId);
    if (!targetElement) {
        return fallbackPoint;
    }

    const rect = targetElement.getBoundingClientRect();
    if (!rect.width || !rect.height) {
        return fallbackPoint;
    }

    const viewportPoint = resolveTargetAnchorPoint(
        targetElement,
        rect,
        normalizedEndpoint.anchorId,
        targetCenter(rect)
    );
    if (!viewportPoint) {
        return fallbackPoint;
    }

    return {
        x: viewportPoint.x - rootRect.left,
        y: viewportPoint.y - rootRect.top
    };
}

function normalizeLineConnection(rawProps) {
    const markerEndValue = rawProps && typeof rawProps.markerEnd === "string"
        ? rawProps.markerEnd
        : "";
    const showArrowValue = rawProps && rawProps.showArrow !== undefined ? !!rawProps.showArrow : undefined;
    const markerEnd = markerEndValue === "arrow"
        ? "arrow"
        : markerEndValue === "none"
            ? "none"
            : showArrowValue === true
                ? "arrow"
                : "none";
    const start = rawProps && rawProps.start !== undefined
        ? normalizeEndpointState(rawProps.start, DEFAULT_LINE_START)
        : buildLegacyEndpoint(rawProps && rawProps.fromTargetId, rawProps && rawProps.fromAnchor, DEFAULT_LINE_START);
    const end = rawProps && rawProps.end !== undefined
        ? normalizeEndpointState(rawProps.end, DEFAULT_LINE_END)
        : buildLegacyEndpoint(rawProps && rawProps.toTargetId, rawProps && rawProps.toAnchor, DEFAULT_LINE_END);

    return {
        id: "connector_line",
        targetId: rawProps && rawProps.targetId ? String(rawProps.targetId) : "",
        start,
        end,
        fromTargetId: rawProps && rawProps.fromTargetId
            ? String(rawProps.fromTargetId)
            : (start.mode === "snapped" ? start.targetId : ""),
        toTargetId: rawProps && rawProps.toTargetId
            ? String(rawProps.toTargetId)
            : (end.mode === "snapped" ? end.targetId : ""),
        fromAnchor: normalizeAnchorRef(rawProps && rawProps.fromAnchor, start.mode === "snapped" ? start.anchorId : "right"),
        toAnchor: normalizeAnchorRef(rawProps && rawProps.toAnchor, end.mode === "snapped" ? end.anchorId : "left"),
        stroke: rawProps && typeof rawProps.stroke === "string" ? rawProps.stroke : "#0e7490",
        strokeWidth: clamp(normalizeNumber(rawProps && rawProps.strokeWidth, 2), 0.1, 24),
        cornerRadius: clamp(normalizeNumber(rawProps && rawProps.cornerRadius, 8), 0, 64),
        glowIntensity: clamp(normalizeNumber(rawProps && rawProps.glowIntensity, 0.65), 0, 1),
        anchorPoints: normalizeLineAnchorSet(rawProps && rawProps.anchorPoints),
        showArrow: markerEnd === "arrow",
        markerEnd,
        label: rawProps && rawProps.label ? String(rawProps.label) : "",
        labelColor: "#0f172a"
    };
}

class AnchorBreaker extends Component {
    render() {
        const { props, emit, store } = this.props;
        const ringOpacity = clamp(normalizeNumber(props.ringOpacity, 0.3), 0, 1);
        const ringRadius = clamp(normalizeNumber(props.ringRadius, 12), 4, 28);
        const lineWidth = clamp(normalizeNumber(props.lineWidth, 2), 1, 12);
        const showAnchorRings = !!props.showAnchorRings;
        const fillColor = typeof props.backgroundColor === "string"
            ? props.backgroundColor
            : (typeof props.fillColor === "string" ? props.fillColor : "#111a2d");
        const strokeColor = typeof props.strokeColor === "string" ? props.strokeColor : "#56c89b";
        const textColor = typeof props.textColor === "string" ? props.textColor : "#eef2f7";
        const markerIdSeed = buildIdSeed(store, "anchorBreaker");
        const fillGradientId = `anchorBreakerFill_${markerIdSeed}`;

        const rings = showAnchorRings ? BREAKER_ANCHOR_POINTS.map((anchor) =>
            React.createElement("g", { key: `ring-${anchor.id}` }, [
                React.createElement("circle", {
                    key: "r1",
                    cx: anchor.x,
                    cy: anchor.y,
                    r: ringRadius * 0.42,
                    fill: "none",
                    stroke: props.ringColor,
                    strokeOpacity: ringOpacity,
                    strokeWidth: 1.25
                }),
                React.createElement("circle", {
                    key: "r2",
                    cx: anchor.x,
                    cy: anchor.y,
                    r: ringRadius * 0.7,
                    fill: "none",
                    stroke: props.ringColor,
                    strokeOpacity: ringOpacity * 0.75,
                    strokeWidth: 1
                }),
                React.createElement("circle", {
                    key: "r3",
                    cx: anchor.x,
                    cy: anchor.y,
                    r: ringRadius,
                    fill: "none",
                    stroke: props.ringColor,
                    strokeOpacity: ringOpacity * 0.48,
                    strokeWidth: 0.9
                })
            ])
        ) : null;

        const svgRoot = React.createElement("svg", {
            viewBox: "0 0 162 162",
            preserveAspectRatio: "xMidYMid meet",
            style: { width: "100%", height: "100%", overflow: "visible" }
        }, [
            React.createElement("defs", { key: "breaker-defs" }, [
                React.createElement("linearGradient", {
                    key: "breaker-fill",
                    id: fillGradientId,
                    x1: "0%",
                    y1: "0%",
                    x2: "0%",
                    y2: "100%"
                }, [
                    React.createElement("stop", {
                        key: "breaker-fill-top",
                        offset: "0%",
                        stopColor: "#162038"
                    }),
                    React.createElement("stop", {
                        key: "breaker-fill-bottom",
                        offset: "100%",
                        stopColor: "#101829"
                    })
                ])
            ]),
            React.createElement("rect", {
                key: "breaker-body",
                x: 24,
                y: 24,
                width: 114,
                height: 114,
                fill: fillColor === "transparent" ? `url(#${fillGradientId})` : fillColor,
                stroke: strokeColor,
                strokeWidth: lineWidth
            }),
            React.createElement("rect", {
                key: "breaker-inner-glow",
                x: 25,
                y: 25,
                width: 112,
                height: 112,
                fill: "none",
                stroke: "rgba(255,255,255,0.06)",
                strokeWidth: 1
            }),
            React.createElement("text", {
                key: "breaker-label",
                x: 81,
                y: 86,
                fill: textColor,
                fontSize: 40,
                fontWeight: 400,
                letterSpacing: "-0.03em",
                textAnchor: "middle",
                dominantBaseline: "central",
                fontFamily: "Segoe UI, Arial, sans-serif"
            }, props.label),
            rings
        ]);

        return renderTargetComponentRoot(
            emit,
            props,
            "anchor-breaker",
            props.targetId,
            BREAKER_ANCHOR_POINTS,
            svgRoot,
            { viewBoxWidth: 162, viewBoxHeight: 162 }
        );
    }
}

function parsePublishedAnchors(targetElement, rect) {
    if (!targetElement || !rect) {
        return [];
    }

    const rawJson = targetElement.getAttribute("data-anchor-points");
    if (!rawJson) {
        return [];
    }

    let parsedAnchors;
    try {
        parsedAnchors = JSON.parse(rawJson);
    } catch (error) {
        return [];
    }

    if (!Array.isArray(parsedAnchors)) {
        return [];
    }

    const coordMode = targetElement.getAttribute("data-anchor-coord-mode");
    const viewBoxWidth = Number(targetElement.getAttribute("data-anchor-viewbox-width"));
    const viewBoxHeight = Number(targetElement.getAttribute("data-anchor-viewbox-height"));
    return parsedAnchors
        .map((anchor, index) => {
            const x = normalizeNumber(anchor && anchor.x, NaN);
            const y = normalizeNumber(anchor && anchor.y, NaN);
            if (!Number.isFinite(x) || !Number.isFinite(y)) {
                return null;
            }

            if (coordMode === "viewbox" && Number.isFinite(viewBoxWidth) && viewBoxWidth > 0 && Number.isFinite(viewBoxHeight) && viewBoxHeight > 0) {
                const scale = Math.min(rect.width / viewBoxWidth, rect.height / viewBoxHeight);
                const offsetX = (rect.width - viewBoxWidth * scale) / 2;
                const offsetY = (rect.height - viewBoxHeight * scale) / 2;
                return {
                    id: normalizeAnchorRef(anchor && anchor.id, `anchor_${index + 1}`),
                    label: anchor && anchor.label ? String(anchor.label) : "",
                    x: rect.left + offsetX + x * scale,
                    y: rect.top + offsetY + y * scale,
                    snapRadius: clamp(normalizeNumber(anchor && anchor.snapRadius, 16), 0, 240)
                };
            }

            if (coordMode === "normalized") {
                return {
                    id: normalizeAnchorRef(anchor && anchor.id, `anchor_${index + 1}`),
                    label: anchor && anchor.label ? String(anchor.label) : "",
                    x: rect.left + x * rect.width,
                    y: rect.top + y * rect.height,
                    snapRadius: clamp(normalizeNumber(anchor && anchor.snapRadius, 16), 0, 240)
                };
            }

            return {
                id: normalizeAnchorRef(anchor && anchor.id, `anchor_${index + 1}`),
                label: anchor && anchor.label ? String(anchor.label) : "",
                x: rect.left + x,
                y: rect.top + y,
                snapRadius: clamp(normalizeNumber(anchor && anchor.snapRadius, 16), 0, 240)
            };
        })
        .filter(Boolean);
}

function parseExplicitAnchorPoint(targetElement, rect, anchorId) {
    if (!targetElement || !rect) {
        return null;
    }
    const requestedId = normalizeAnchorRef(anchorId, "");
    if (!requestedId) {
        return null;
    }
    const xAttr = targetElement.getAttribute(`data-anchor-${requestedId}-x`);
    const yAttr = targetElement.getAttribute(`data-anchor-${requestedId}-y`);
    const rawX = Number(xAttr);
    const rawY = Number(yAttr);
    if (!Number.isFinite(rawX) || !Number.isFinite(rawY)) {
        return null;
    }

    const coordMode = targetElement.getAttribute("data-anchor-coord-mode");
    if (coordMode === "viewbox") {
        const viewBoxWidth = Number(targetElement.getAttribute("data-anchor-viewbox-width"));
        const viewBoxHeight = Number(targetElement.getAttribute("data-anchor-viewbox-height"));
        if (Number.isFinite(viewBoxWidth) && viewBoxWidth > 0 && Number.isFinite(viewBoxHeight) && viewBoxHeight > 0) {
            const scale = Math.min(rect.width / viewBoxWidth, rect.height / viewBoxHeight);
            const offsetX = (rect.width - viewBoxWidth * scale) / 2;
            const offsetY = (rect.height - viewBoxHeight * scale) / 2;
            return {
                x: rect.left + offsetX + rawX * scale,
                y: rect.top + offsetY + rawY * scale
            };
        }
    }

    if (coordMode === "normalized" || (rawX >= 0 && rawX <= 1 && rawY >= 0 && rawY <= 1)) {
        return {
            x: rect.left + rawX * rect.width,
            y: rect.top + rawY * rect.height
        };
    }

    return {
        x: rect.left + rawX,
        y: rect.top + rawY
    };
}

function sidePointForRect(rect, side) {
    switch (normalizeAnchorRef(side, "right")) {
    case "top":
        return { x: rect.left + rect.width / 2, y: rect.top };
    case "right":
        return { x: rect.right, y: rect.top + rect.height / 2 };
    case "bottom":
        return { x: rect.left + rect.width / 2, y: rect.bottom };
    case "left":
    default:
        return { x: rect.left, y: rect.top + rect.height / 2 };
    }
}

function nearestAnchorPoint(anchors, towardViewportPoint) {
    if (!Array.isArray(anchors) || !anchors.length) {
        return null;
    }
    if (!towardViewportPoint) {
        return anchors[0];
    }

    let nearest = anchors[0];
    let nearestDistance = distance(nearest, towardViewportPoint);
    for (let i = 1; i < anchors.length; i += 1) {
        const currentDistance = distance(anchors[i], towardViewportPoint);
        if (currentDistance < nearestDistance) {
            nearest = anchors[i];
            nearestDistance = currentDistance;
        }
    }
    return nearest;
}

function resolveTargetAnchorPoint(targetElement, rect, requestedAnchorId, towardViewportPoint) {
    const requestedId = normalizeAnchorRef(requestedAnchorId, "");
    const publishedAnchors = parsePublishedAnchors(targetElement, rect);
    if (requestedId) {
        const exactMatch = publishedAnchors.find((anchor) => anchor.id === requestedId);
        if (exactMatch) {
            return exactMatch;
        }

        const explicitAnchor = parseExplicitAnchorPoint(targetElement, rect, requestedId);
        if (explicitAnchor) {
            return explicitAnchor;
        }

        if (VALID_SIDES.includes(requestedId)) {
            return sidePointForRect(rect, requestedId);
        }
    }

    const nearestPublished = nearestAnchorPoint(publishedAnchors, towardViewportPoint);
    if (nearestPublished) {
        return nearestPublished;
    }
    return sidePointForRect(rect, requestedId || "right");
}

function targetCenter(rect) {
    return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
    };
}

function findTargetElementById(ownerDocument, targetId) {
    if (!ownerDocument || !targetId) {
        return null;
    }

    const allTargets = ownerDocument.querySelectorAll("[data-anchor-target-id]");
    for (let i = 0; i < allTargets.length; i += 1) {
        const value = allTargets[i].getAttribute("data-anchor-target-id");
        if (value === targetId) {
            return allTargets[i];
        }
    }
    return null;
}

function resolveConnectorLayoutFromPoints(connection, fromPoint, toPoint, orthogonal) {
    if (!fromPoint || !toPoint) {
        return null;
    }

    const elbowPoints = buildOrthogonalPoints(fromPoint, toPoint, orthogonal);
    return {
        id: connection.id,
        stroke: connection.stroke,
        strokeWidth: connection.strokeWidth,
        cornerRadius: connection.cornerRadius,
        showArrow: connection.showArrow,
        label: connection.label,
        labelColor: connection.labelColor,
        points: elbowPoints,
        labelPoint: midpointForLabel(elbowPoints),
        pathData: roundedPath(elbowPoints, connection.cornerRadius)
    };
}

function resolveConnectorLayout(connection, rootRect, ownerDocument, orthogonal) {
    const fromElement = findTargetElementById(ownerDocument, connection.fromTargetId);
    const toElement = findTargetElementById(ownerDocument, connection.toTargetId);
    if (!fromElement || !toElement) {
        return null;
    }

    const fromRect = fromElement.getBoundingClientRect();
    const toRect = toElement.getBoundingClientRect();
    if (!fromRect.width || !fromRect.height || !toRect.width || !toRect.height) {
        return null;
    }

    const toHint = targetCenter(toRect);
    const fromViewport = resolveTargetAnchorPoint(fromElement, fromRect, connection.fromAnchor, toHint);
    const fromHint = fromViewport || targetCenter(fromRect);
    const toViewport = resolveTargetAnchorPoint(toElement, toRect, connection.toAnchor, fromHint);
    if (!fromViewport || !toViewport) {
        return null;
    }

    const fromPoint = {
        x: fromViewport.x - rootRect.left,
        y: fromViewport.y - rootRect.top
    };
    const toPoint = {
        x: toViewport.x - rootRect.left,
        y: toViewport.y - rootRect.top
    };
    return resolveConnectorLayoutFromPoints(connection, fromPoint, toPoint, orthogonal);
}

function createConnectorChildren(layout, markerUrl, glowFilterId, showLabel) {
    if (!layout) {
        return [];
    }

    const children = [];
    if (glowFilterId) {
        children.push(React.createElement("path", {
            key: `${layout.id}_glow`,
            d: layout.pathData,
            fill: "none",
            stroke: layout.stroke,
            strokeWidth: layout.strokeWidth,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            markerEnd: markerUrl,
            filter: `url(#${glowFilterId})`,
            opacity: 0.98
        }));
    }

    children.push(React.createElement("path", {
        key: `${layout.id}_path`,
        d: layout.pathData,
        fill: "none",
        stroke: layout.stroke,
        strokeWidth: layout.strokeWidth,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        markerEnd: markerUrl
    }));

    if (showLabel && layout.label) {
        children.push(React.createElement("text", {
            key: `${layout.id}_label`,
            x: layout.labelPoint.x,
            y: layout.labelPoint.y - 8,
            fill: layout.labelColor,
            fontSize: 12,
            textAnchor: "middle",
            fontFamily: "Segoe UI, Arial, sans-serif"
        }, layout.label));
    }

    return children;
}

function renderTargetComponentRoot(emit, props, className, targetId, anchorPoints, svgRoot, options) {
    const config = options || {};
    const rootProps = emitRoot(emit, className, props.style, {
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "visible",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "transparent"
    });
    publishAnchors(rootProps, targetId, anchorPoints, {
        coordMode: "viewbox",
        viewBoxWidth: config.viewBoxWidth,
        viewBoxHeight: config.viewBoxHeight
    });
    return React.createElement("div", rootProps, svgRoot);
}

function renderStatusRows(props, config) {
    const rows = [
        { label: props.runLabel, value: props.runValue },
        { label: props.localLabel, value: props.localValue },
        { label: props.modeLabel, value: props.modeValue },
        { label: props.kwLabel, value: props.kwValue },
        { label: props.kvarLabel, value: props.kvarValue },
        { label: props.kvaLabel, value: props.kvaValue },
        { label: props.kvLabel, value: props.kvValue },
        { label: props.ampsLabel, value: props.ampsValue },
        { label: props.hzLabel, value: props.hzValue }
    ];

    return rows.map((row, index) => {
        const labelY = config.startY + index * 16;
        const fieldY = config.fieldStartY + index * 16;
        return React.createElement("g", { key: `status_row_${index}` }, [
            React.createElement("text", {
                key: "label",
                x: 9,
                y: labelY,
                fill: props.textColor,
                fillOpacity: 0.88,
                fontSize: props.statusLabelFontSize,
                letterSpacing: "0.02em",
                dominantBaseline: "middle",
                fontFamily: "Segoe UI, Arial, sans-serif"
            }, row.label),
            React.createElement("rect", {
                key: "field",
                x: 83,
                y: fieldY,
                width: 58,
                height: 12,
                fill: props.fieldFillColor,
                fillOpacity: config.fieldFillOpacity,
                stroke: props.fieldBorderColor,
                strokeOpacity: 0.58
            }),
            React.createElement("text", {
                key: "value",
                x: 112,
                y: fieldY + 6.5,
                fill: props.textColor,
                fontSize: props.statusValueFontSize,
                textAnchor: "middle",
                dominantBaseline: "middle",
                fontFamily: "Segoe UI, Arial, sans-serif"
            }, row.value || "")
        ]);
    });
}

function renderGensetPanelSvg(props, store, options) {
    const config = options || {};
    const viewBoxWidth = 440;
    const viewBoxHeight = config.rev2 ? 648 : 640;
    const markerIdSeed = buildIdSeed(store, config.rev2 ? "gensetPanelR2" : "gensetPanel");
    const anchorPoints = mapRelativeAnchorsToViewbox(
        normalizeRelativeAnchorSet(props.anchorPoints, GENSET_DEFAULT_ANCHORS),
        viewBoxWidth,
        viewBoxHeight
    );
    const glowSteps = config.rev2
        ? [
            { stdDeviation: 3, opacity: 0.8 },
            { stdDeviation: 6, opacity: 0.6 },
            { stdDeviation: 12, opacity: 0.4 }
        ]
        : [
            { stdDeviation: 5.5, opacity: 0.2 }
        ];
    const accentGlowId = `gensetAccentGlow_${markerIdSeed}`;
    const circleGlowId = `gensetCircleGlow_${markerIdSeed}`;
    const pagePatternId = `gensetGrid_${markerIdSeed}`;
    const shellGradientId = `gensetShell_${markerIdSeed}`;
    const generatorFillId = `gensetGeneratorFill_${markerIdSeed}`;
    const shellShadowId = `gensetShellShadow_${markerIdSeed}`;
    const showShell = !config.transparent;
    const fieldFillOpacity = config.transparent ? 0 : 0.01;
    const statusBoxHeight = config.rev2 ? 183 : 175;
    const titleBoxHeight = config.rev2 ? 28 : 20;
    const titleY = config.rev2 ? 19 : 15;
    const rowLabelStartY = config.rev2 ? 41.5 : 35.5;
    const rowFieldStartY = config.rev2 ? 35 : 29;
    const defsChildren = [
        React.createElement("radialGradient", {
            key: "generator-fill",
            id: generatorFillId,
            cx: "50%",
            cy: "50%",
            r: "70%"
        }, [
            React.createElement("stop", {
                key: "generator-fill-start",
                offset: "0%",
                stopColor: props.accentColor,
                stopOpacity: clamp(0.15 + props.glowIntensity * 0.05, 0, 0.35)
            }),
            React.createElement("stop", {
                key: "generator-fill-end",
                offset: "70%",
                stopColor: props.accentColor,
                stopOpacity: 0
            })
        ]),
        createGlowFilter(accentGlowId, props.accentColor, props.glowIntensity, glowSteps),
        createGlowFilter(circleGlowId, props.accentColor, props.glowIntensity, [
            { stdDeviation: config.rev2 ? 1.6 : 2.2, opacity: 0.5 },
            { stdDeviation: config.rev2 ? 3 : 5.5, opacity: 0.3 },
            { stdDeviation: config.rev2 ? 6 : 10.5, opacity: 0.15 }
        ])
    ];

    if (showShell) {
        defsChildren.push(React.createElement("linearGradient", {
            key: "shell-gradient",
            id: shellGradientId,
            x1: "107",
            y1: "0",
            x2: "107",
            y2: config.rev2 ? "551.8" : "543.8",
            gradientUnits: "userSpaceOnUse"
        }, [
            React.createElement("stop", {
                key: "shell-gradient-start",
                offset: "0%",
                stopColor: props.shellFillColor,
                stopOpacity: 0.98
            }),
            React.createElement("stop", {
                key: "shell-gradient-end",
                offset: "100%",
                stopColor: props.shellFillColor,
                stopOpacity: 0.9
            })
        ]));
        defsChildren.push(React.createElement("filter", {
            key: "shell-shadow",
            id: shellShadowId,
            x: "-30%",
            y: "-8%",
            width: "160%",
            height: "150%",
            colorInterpolationFilters: "sRGB"
        }, React.createElement("feDropShadow", {
            dx: 0,
            dy: 20,
            stdDeviation: 20,
            floodColor: "#000000",
            floodOpacity: 0.28
        })));
    }

    if (!!props.showBackground) {
        defsChildren.push(React.createElement("pattern", {
            key: "page-grid",
            id: pagePatternId,
            width: 20,
            height: 20,
            patternUnits: "userSpaceOnUse"
        }, React.createElement("path", {
            d: "M20 0H0V20",
            fill: "none",
            stroke: "#94a3b8",
            strokeOpacity: 0.09,
            strokeWidth: 1
        })));
    }

    const children = [
        React.createElement("defs", { key: "defs" }, defsChildren.filter(Boolean))
    ];

    if (!!props.showBackground) {
        children.push(React.createElement("rect", {
            key: "page-bg",
            width: viewBoxWidth,
            height: viewBoxHeight,
            fill: props.backgroundColor
        }));
        children.push(React.createElement("rect", {
            key: "page-grid",
            width: viewBoxWidth,
            height: viewBoxHeight,
            fill: `url(#${pagePatternId})`
        }));
    }

    children.push(React.createElement("g", {
        key: "content-root",
        transform: "translate(113 47.6)",
        fontFamily: "Segoe UI, Arial, sans-serif"
    }, [
        showShell ? React.createElement("g", { key: "shell-group" }, [
            React.createElement("rect", {
                key: "shell",
                x: 0.5,
                y: 0.5,
                width: 213,
                height: config.rev2 ? 551.8 : 543.8,
                rx: 12,
                fill: `url(#${shellGradientId})`,
                stroke: props.shellStrokeColor,
                filter: `url(#${shellShadowId})`
            }),
            React.createElement("path", {
                key: "shell-highlight",
                d: "M12.5 1.5H201.5",
                stroke: "#ffffff",
                strokeOpacity: 0.03,
                strokeLinecap: "round"
            })
        ]) : null,
        React.createElement("g", {
            key: "breaker-chain",
            transform: "translate(90 17)"
        }, [
            React.createElement("g", {
                key: "breaker-lines",
                filter: `url(#${accentGlowId})`
            }, [
                React.createElement("line", { key: "line-1", x1: 17, y1: 0, x2: 17, y2: 18, stroke: props.accentColor, strokeWidth: 2, strokeLinecap: "square", strokeLinejoin: "round" }),
                React.createElement("rect", { key: "rect-1", x: 1, y: 18, width: 32, height: 32, fill: props.accentColor, fillOpacity: 0.02, stroke: props.accentColor, strokeWidth: 2 }),
                React.createElement("line", { key: "line-2", x1: 17, y1: 50, x2: 17, y2: 71, stroke: props.accentColor, strokeWidth: 2, strokeLinecap: "square", strokeLinejoin: "round" }),
                React.createElement("line", { key: "line-3", x1: 17, y1: 71, x2: 17, y2: 79, stroke: props.accentColor, strokeWidth: 2, strokeLinecap: "square", strokeLinejoin: "round" }),
                React.createElement("circle", { key: "circle-1", cx: 17, cy: 92, r: 13, fill: props.accentColor, fillOpacity: 0.02, stroke: props.accentColor, strokeWidth: 2 }),
                React.createElement("circle", { key: "circle-2", cx: 17, cy: 102, r: 13, fill: props.accentColor, fillOpacity: 0.02, stroke: props.accentColor, strokeWidth: 2 }),
                React.createElement("line", { key: "line-4", x1: 17, y1: 115, x2: 17, y2: 136, stroke: props.accentColor, strokeWidth: 2, strokeLinecap: "square", strokeLinejoin: "round" }),
                React.createElement("rect", { key: "rect-2", x: 1, y: 136, width: 32, height: 32, fill: props.accentColor, fillOpacity: 0.02, stroke: props.accentColor, strokeWidth: 2 })
            ]),
            React.createElement("text", { key: "breaker-top-label", x: 17, y: 34, fill: props.textColor, fontSize: props.breakerLabelFontSize, letterSpacing: "0.02em", textAnchor: "middle", dominantBaseline: "middle" }, props.breakerTopLabel),
            React.createElement("text", { key: "breaker-bottom-label", x: 17, y: 152, fill: props.textColor, fontSize: props.breakerLabelFontSize, letterSpacing: "0.02em", textAnchor: "middle", dominantBaseline: "middle" }, props.breakerBottomLabel)
        ]),
        React.createElement("g", { key: "generator" }, [
            React.createElement("rect", { key: "generator-post", x: 106, y: 185, width: 2, height: 48, fill: props.accentColor, filter: `url(#${accentGlowId})` }),
            React.createElement("g", { key: "generator-circle", filter: `url(#${circleGlowId})` }, [
                React.createElement("circle", { key: "generator-ring", cx: 107, cy: 288, r: 54, fill: `url(#${generatorFillId})`, stroke: props.accentColor, strokeWidth: 2 }),
                React.createElement("path", { key: "generator-wave", d: "M91 288 Q99 276 107 288 T123 288", fill: "none", stroke: props.accentColor, strokeWidth: 3, strokeLinecap: "round", strokeLinejoin: "round" })
            ])
        ]),
        React.createElement("g", { key: "status-panel", transform: "translate(33 351)" }, [
            React.createElement("rect", {
                key: "status-body",
                x: 0.5,
                y: 0.5,
                width: 147,
                height: statusBoxHeight,
                rx: 8,
                fill: config.transparent ? "none" : "#070c14",
                fillOpacity: config.transparent ? 0 : 0.92,
                stroke: props.fieldBorderColor,
                strokeOpacity: 0.58
            }),
            !config.transparent ? React.createElement("path", {
                key: "status-highlight",
                d: "M8.5 1.5H139.5",
                stroke: "#ffffff",
                strokeOpacity: 0.02,
                strokeLinecap: "round"
            }) : null,
            React.createElement("rect", { key: "title-box", x: 7, y: 5, width: 134, height: titleBoxHeight, rx: 4, fill: "none", stroke: props.fieldBorderColor, strokeOpacity: 0.58 }),
            React.createElement("text", { key: "title", x: 74, y: titleY, fill: props.textColor, fontSize: props.generatorTitleFontSize, fontWeight: 500, letterSpacing: "0.04em", textAnchor: "middle", dominantBaseline: "middle" }, props.generatorTitle),
            renderStatusRows(props, { startY: rowLabelStartY, fieldStartY: rowFieldStartY, fieldFillOpacity })
        ]),
        renderAnchorDebugNodes(anchorPoints, props.showAnchorPoints, "#ef4444")
    ]));

    return {
        viewBoxWidth,
        viewBoxHeight,
        anchorPoints,
        svgRoot: React.createElement("svg", {
            viewBox: `0 0 ${viewBoxWidth} ${viewBoxHeight}`,
            preserveAspectRatio: "xMidYMid meet",
            style: { width: "100%", height: "100%", overflow: "visible" }
        }, children)
    };
}

function renderModernLineSvg(props, store, options) {
    const config = options || {};
    const viewBoxWidth = 380;
    const viewBoxHeight = 60;
    const markerIdSeed = buildIdSeed(store, config.rev2 ? "modernLineRev2" : "modernLine");
    const filterId = `modernLineGlow_${markerIdSeed}`;
    const anchorPoints = mapRelativeAnchorsToViewbox(
        normalizeRelativeAnchorSet(props.anchorPoints, MODERN_LINE_DEFAULT_ANCHORS),
        viewBoxWidth,
        viewBoxHeight
    );
    const lineHeight = clamp(normalizeNumber(props.lineThickness, 2), 0.25, 24);
    const lineY = 30 - lineHeight / 2;
    const children = [
        React.createElement("defs", { key: "defs" }, [
            createGlowFilter(filterId, props.lineColor, props.glowIntensity)
        ].filter(Boolean))
    ];

    if (!!props.showBackground) {
        children.push(React.createElement("rect", {
            key: "panel",
            x: 0.5,
            y: 0.5,
            width: 379,
            height: 59,
            rx: clamp(normalizeNumber(props.panelCornerRadius, 8), 0, 30),
            fill: props.backgroundColor,
            stroke: props.panelStrokeColor
        }));
    }

    if (props.glowIntensity > 0.001) {
        children.push(React.createElement("rect", {
            key: "line-glow",
            x: 17,
            y: lineY,
            width: 346,
            height: lineHeight,
            rx: Math.max(1, lineHeight / 2),
            fill: props.lineColor,
            filter: `url(#${filterId})`
        }));
    }
    children.push(React.createElement("rect", {
        key: "line",
        x: 17,
        y: lineY,
        width: 346,
        height: lineHeight,
        rx: Math.max(1, lineHeight / 2),
        fill: props.lineColor
    }));
    children.push(renderAnchorDebugNodes(anchorPoints, props.showAnchorPoints, props.lineColor));

    return {
        viewBoxWidth,
        viewBoxHeight,
        anchorPoints,
        svgRoot: React.createElement("svg", {
            viewBox: `0 0 ${viewBoxWidth} ${viewBoxHeight}`,
            preserveAspectRatio: "xMidYMid meet",
            style: { width: "100%", height: "100%", overflow: "visible" }
        }, children)
    };
}

function renderModernTankSvg(props, store, options) {
    const config = options || {};
    const viewBoxWidth = 144;
    const viewBoxHeight = 150;
    const markerIdSeed = buildIdSeed(store, config.rev2 ? "modernTankRev2" : "modernTank");
    const filterId = `modernTankGlow_${markerIdSeed}`;
    const gradientId = `modernTankFill_${markerIdSeed}`;
    const anchorPoints = mapRelativeAnchorsToViewbox(
        normalizeRelativeAnchorSet(props.anchorPoints, MODERN_TANK_DEFAULT_ANCHORS),
        viewBoxWidth,
        viewBoxHeight
    );
    const defsChildren = [
        React.createElement("radialGradient", {
            key: "tank-fill",
            id: gradientId,
            cx: "50%",
            cy: "55%",
            r: "65%"
        }, [
            React.createElement("stop", {
                key: "tank-fill-start",
                offset: "0%",
                stopColor: props.accentColor,
                stopOpacity: clamp(0.16 + props.glowIntensity * 0.05, 0, 0.35)
            }),
            React.createElement("stop", {
                key: "tank-fill-end",
                offset: "70%",
                stopColor: props.accentColor,
                stopOpacity: 0
            })
        ]),
        createGlowFilter(filterId, props.accentColor, props.glowIntensity)
    ];
    const children = [React.createElement("defs", { key: "defs" }, defsChildren.filter(Boolean))];

    if (!!props.showBackground) {
        children.push(React.createElement("rect", {
            key: "panel",
            x: 0.5,
            y: 0.5,
            width: 143,
            height: 149,
            rx: 10,
            fill: props.backgroundColor,
            stroke: props.panelStrokeColor
        }));
    }

    children.push(React.createElement("g", {
        key: "tank-shape",
        transform: "translate(17 15)",
        filter: props.glowIntensity > 0.001 ? `url(#${filterId})` : undefined
    }, [
        React.createElement("path", {
            key: "tank-fill",
            fill: `url(#${gradientId})`,
            d: "M1 119 L1 25 L109 25 Q55 1 1 25 L109 25 L109 119 L1 119 Z"
        }),
        React.createElement("path", {
            key: "tank-stroke",
            fill: "none",
            stroke: props.accentColor,
            strokeWidth: 2,
            strokeLinejoin: "miter",
            strokeLinecap: "butt",
            d: "M1 119 L1 25 L109 25 Q55 1 1 25 L109 25 L109 119 L1 119 Z"
        })
    ]));
    children.push(renderAnchorDebugNodes(anchorPoints, props.showAnchorPoints, props.accentColor));

    return {
        viewBoxWidth,
        viewBoxHeight,
        anchorPoints,
        svgRoot: React.createElement("svg", {
            viewBox: `0 0 ${viewBoxWidth} ${viewBoxHeight}`,
            preserveAspectRatio: "xMidYMid meet",
            style: { width: "100%", height: "100%", overflow: "visible" }
        }, children)
    };
}

function renderModernValveSvg(props, store, options) {
    const config = options || {};
    const viewBoxWidth = 144;
    const viewBoxHeight = 153;
    const markerIdSeed = buildIdSeed(store, config.rev2 ? "modernValveRev2" : "modernValve");
    const filterId = `modernValveGlow_${markerIdSeed}`;
    const gradientId = `modernValveFill_${markerIdSeed}`;
    const anchorPoints = mapRelativeAnchorsToViewbox(
        normalizeRelativeAnchorSet(props.anchorPoints, MODERN_VALVE_DEFAULT_ANCHORS),
        viewBoxWidth,
        viewBoxHeight
    );
    const defsChildren = [
        React.createElement("radialGradient", {
            key: "valve-fill",
            id: gradientId,
            cx: "50%",
            cy: "50%",
            r: "70%"
        }, [
            React.createElement("stop", {
                key: "valve-fill-start",
                offset: "0%",
                stopColor: props.accentColor,
                stopOpacity: clamp(0.15 + props.glowIntensity * 0.05, 0, 0.35)
            }),
            React.createElement("stop", {
                key: "valve-fill-end",
                offset: "70%",
                stopColor: props.accentColor,
                stopOpacity: 0
            })
        ]),
        createGlowFilter(filterId, props.accentColor, props.glowIntensity)
    ];
    const children = [React.createElement("defs", { key: "defs" }, defsChildren.filter(Boolean))];

    if (!!props.showBackground) {
        children.push(React.createElement("rect", {
            key: "panel",
            x: 0.5,
            y: 0.5,
            width: 143,
            height: 152,
            rx: 8,
            fill: props.backgroundColor,
            stroke: props.panelStrokeColor
        }));
    }

    children.push(React.createElement("g", {
        key: "valve-shape",
        transform: "translate(17 29)",
        filter: props.glowIntensity > 0.001 ? `url(#${filterId})` : undefined
    }, [
        React.createElement("path", {
            key: "valve-fill",
            fill: `url(#${gradientId})`,
            d: "M1 41 L55 67.5 L1 94 Z M109 41 L55 67.5 L109 94 Z"
        }),
        React.createElement("path", {
            key: "valve-stroke",
            fill: "none",
            stroke: props.accentColor,
            strokeWidth: 2,
            strokeLinejoin: "miter",
            strokeLinecap: "butt",
            d: "M1 41 L55 67.5 L1 94 Z M109 41 L55 67.5 L109 94 Z"
        }),
        React.createElement("path", {
            key: "valve-stem",
            fill: "none",
            stroke: props.accentColor,
            strokeWidth: 2,
            strokeLinejoin: "miter",
            strokeLinecap: "butt",
            d: "M55 67.5 L55 25 M35 25 L75 25 A20 20 0 0 0 35 25 Z"
        })
    ]));
    children.push(renderAnchorDebugNodes(anchorPoints, props.showAnchorPoints, props.accentColor));

    return {
        viewBoxWidth,
        viewBoxHeight,
        anchorPoints,
        svgRoot: React.createElement("svg", {
            viewBox: `0 0 ${viewBoxWidth} ${viewBoxHeight}`,
            preserveAspectRatio: "xMidYMid meet",
            style: { width: "100%", height: "100%", overflow: "visible" }
        }, children)
    };
}

class GensetPanelComponent extends Component {
    render() {
        const { props, emit, store } = this.props;
        const rendered = renderGensetPanelSvg(props, store, { transparent: false, rev2: false });
        return renderTargetComponentRoot(
            emit,
            props,
            "anchor-genset-panel",
            props.targetId,
            rendered.anchorPoints,
            rendered.svgRoot,
            rendered
        );
    }
}

class GensetPanelTransparentComponent extends Component {
    render() {
        const { props, emit, store } = this.props;
        const rendered = renderGensetPanelSvg(props, store, { transparent: true, rev2: false });
        return renderTargetComponentRoot(
            emit,
            props,
            "anchor-genset-panel-transparent",
            props.targetId,
            rendered.anchorPoints,
            rendered.svgRoot,
            rendered
        );
    }
}

class GensetPanelR2Component extends Component {
    render() {
        const { props, emit, store } = this.props;
        const rendered = renderGensetPanelSvg(props, store, { transparent: false, rev2: true });
        return renderTargetComponentRoot(
            emit,
            props,
            "anchor-genset-panel-r2",
            props.targetId,
            rendered.anchorPoints,
            rendered.svgRoot,
            rendered
        );
    }
}

class GensetPanelR2TransparentComponent extends Component {
    render() {
        const { props, emit, store } = this.props;
        const rendered = renderGensetPanelSvg(props, store, { transparent: true, rev2: true });
        return renderTargetComponentRoot(
            emit,
            props,
            "anchor-genset-panel-r2-transparent",
            props.targetId,
            rendered.anchorPoints,
            rendered.svgRoot,
            rendered
        );
    }
}

class ModernLineComponent extends Component {
    render() {
        const { props, emit, store } = this.props;
        const rendered = renderModernLineSvg(props, store, { rev2: false });
        return renderTargetComponentRoot(
            emit,
            props,
            "anchor-modern-line",
            props.targetId,
            rendered.anchorPoints,
            rendered.svgRoot,
            rendered
        );
    }
}

class ModernLineRev2Component extends Component {
    render() {
        const { props, emit, store } = this.props;
        const rendered = renderModernLineSvg(props, store, { rev2: true });
        return renderTargetComponentRoot(
            emit,
            props,
            "anchor-modern-line-rev2",
            props.targetId,
            rendered.anchorPoints,
            rendered.svgRoot,
            rendered
        );
    }
}

class ModernTankComponent extends Component {
    render() {
        const { props, emit, store } = this.props;
        const rendered = renderModernTankSvg(props, store, { rev2: false });
        return renderTargetComponentRoot(
            emit,
            props,
            "anchor-modern-tank",
            props.targetId,
            rendered.anchorPoints,
            rendered.svgRoot,
            rendered
        );
    }
}

class ModernTankRev2Component extends Component {
    render() {
        const { props, emit, store } = this.props;
        const rendered = renderModernTankSvg(props, store, { rev2: true });
        return renderTargetComponentRoot(
            emit,
            props,
            "anchor-modern-tank-rev2",
            props.targetId,
            rendered.anchorPoints,
            rendered.svgRoot,
            rendered
        );
    }
}

class ModernValveControlComponent extends Component {
    render() {
        const { props, emit, store } = this.props;
        const rendered = renderModernValveSvg(props, store, { rev2: false });
        return renderTargetComponentRoot(
            emit,
            props,
            "anchor-modern-valve-control",
            props.targetId,
            rendered.anchorPoints,
            rendered.svgRoot,
            rendered
        );
    }
}

class ModernValveControlRev2Component extends Component {
    render() {
        const { props, emit, store } = this.props;
        const rendered = renderModernValveSvg(props, store, { rev2: true });
        return renderTargetComponentRoot(
            emit,
            props,
            "anchor-modern-valve-control-rev2",
            props.targetId,
            rendered.anchorPoints,
            rendered.svgRoot,
            rendered
        );
    }
}

class ConnectorOverlay extends Component {
    constructor(props) {
        super(props);
        this.rootElement = null;
        this.pollHandle = null;
        this.state = { pollTick: 0 };
    }

    componentDidMount() {
        this.restartPolling();
    }

    componentDidUpdate(prevProps) {
        const previousInterval = normalizeNumber(prevProps.props && prevProps.props.pollIntervalMs, 200);
        const currentInterval = normalizeNumber(this.props.props && this.props.props.pollIntervalMs, 200);
        if (previousInterval !== currentInterval) {
            this.restartPolling();
        }
    }

    componentWillUnmount() {
        this.stopPolling();
    }

    stopPolling() {
        if (this.pollHandle) {
            window.clearInterval(this.pollHandle);
            this.pollHandle = null;
        }
    }

    restartPolling() {
        this.stopPolling();
        const pollIntervalMs = clamp(normalizeNumber(this.props.props.pollIntervalMs, 200), 50, 5000);
        this.pollHandle = window.setInterval(() => {
            this.setState((previousState) => ({ pollTick: previousState.pollTick + 1 }));
        }, pollIntervalMs);
    }

    render() {
        const { props, emit, store } = this.props;
        const overlayConnections = (Array.isArray(props.connections) ? props.connections : []).map(normalizeOverlayConnection);
        const orthogonal = !!props.orthogonal;
        const showLabels = !!props.showLabels;
        const rootRect = this.rootElement ? this.rootElement.getBoundingClientRect() : null;
        const width = rootRect && rootRect.width > 0 ? rootRect.width : 1000;
        const height = rootRect && rootRect.height > 0 ? rootRect.height : 600;
        const ownerDocument = this.rootElement ? this.rootElement.ownerDocument : null;
        const markerIdSeed = buildIdSeed(store, "connectorOverlay");
        const connectorLayouts = (rootRect && ownerDocument)
            ? overlayConnections
                .map((connection) => resolveConnectorLayout(connection, rootRect, ownerDocument, orthogonal))
                .filter(Boolean)
            : [];

        const markerDefs = connectorLayouts
            .filter((layout) => layout.showArrow)
            .map((layout, index) => {
                const markerId = `anchorConnectorOverlayArrow_${markerIdSeed}_${index}`;
                layout.markerId = markerId;
                return createArrowMarker(markerId, layout.stroke);
            });

        const connectorNodes = connectorLayouts.map((layout) =>
            React.createElement("g", { key: layout.id }, createConnectorChildren(
                layout,
                layout.showArrow && layout.markerId ? `url(#${layout.markerId})` : undefined,
                null,
                showLabels
            ))
        );

        const svgRoot = React.createElement("svg", {
            viewBox: `0 0 ${width} ${height}`,
            preserveAspectRatio: "none",
            style: {
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                overflow: "visible"
            }
        }, [
            React.createElement("defs", { key: "overlay-defs" }, markerDefs),
            connectorNodes
        ]);

        const rootProps = emitRoot(emit, "connector-overlay", props.style, {
            width: "100%",
            height: "100%",
            position: "relative",
            overflow: "visible",
            pointerEvents: "none"
        });
        rootProps.ref = (element) => {
            this.rootElement = element;
        };
        return React.createElement("div", rootProps, svgRoot);
    }
}

class ConnectorLine extends Component {
    constructor(props) {
        super(props);
        this.rootElement = null;
        this.pollHandle = null;
        this.dragListenerDocument = null;
        this.dragListenerWindow = null;
        this.onPointerMove = this.onPointerMove.bind(this);
        this.onPointerUp = this.onPointerUp.bind(this);
        this.onPointerCancel = this.onPointerCancel.bind(this);
        this.onWindowBlur = this.onWindowBlur.bind(this);
        this.state = {
            pollTick: 0,
            dragState: null,
            hoverAnchor: null,
            handleHoverKey: null,
            interactionActive: false
        };
    }

    componentDidMount() {
        this.restartPolling();
    }

    componentDidUpdate(prevProps) {
        const previousInterval = normalizeNumber(prevProps.props && prevProps.props.pollIntervalMs, 200);
        const currentInterval = normalizeNumber(this.props.props && this.props.props.pollIntervalMs, 200);
        if (previousInterval !== currentInterval) {
            this.restartPolling();
        }
    }

    componentWillUnmount() {
        this.stopPolling();
        this.teardownDragListeners();
    }

    stopPolling() {
        if (this.pollHandle) {
            window.clearInterval(this.pollHandle);
            this.pollHandle = null;
        }
    }

    restartPolling() {
        this.stopPolling();
        const pollIntervalMs = clamp(normalizeNumber(this.props.props.pollIntervalMs, 200), 50, 5000);
        this.pollHandle = window.setInterval(() => {
            this.setState((previousState) => ({ pollTick: previousState.pollTick + 1 }));
        }, pollIntervalMs);
    }

    isDesignerSurface() {
        return typeof window !== "undefined" && !!window.PerspectiveDesigner;
    }

    resolvePropWriter() {
        const store = this.props && this.props.store;
        if (store && store.props && typeof store.props.write === "function") {
            return store.props.write.bind(store.props);
        }
        if (store && typeof store.write === "function") {
            return store.write.bind(store);
        }
        throw new Error("ConnectorLine requires store.props.write(path, value) or store.write(path, value).");
    }

    writeEndpoint(endpointKey, endpointValue) {
        const normalizedEndpoint = normalizeEndpointState(
            endpointValue,
            endpointKey === "end" ? DEFAULT_LINE_END : DEFAULT_LINE_START
        );
        const write = this.resolvePropWriter();
        write(endpointKey, normalizedEndpoint);

        if (endpointKey === "start") {
            write("fromTargetId", normalizedEndpoint.mode === "snapped" ? normalizedEndpoint.targetId : "");
            write("fromAnchor", normalizedEndpoint.mode === "snapped" ? normalizedEndpoint.anchorId : "");
            return;
        }

        write("toTargetId", normalizedEndpoint.mode === "snapped" ? normalizedEndpoint.targetId : "");
        write("toAnchor", normalizedEndpoint.mode === "snapped" ? normalizedEndpoint.anchorId : "");
    }

    beginEndpointDrag(endpointKey, endpointValue, event, point, lineConnection) {
        if (event && typeof event.preventDefault === "function") {
            event.preventDefault();
        }
        if (event && typeof event.stopPropagation === "function") {
            event.stopPropagation();
        }
        if (!this.isDesignerSurface()) {
            return;
        }
        this.teardownDragListeners();
        const rootRect = this.rootElement ? this.rootElement.getBoundingClientRect() : null;
        const ownerDocument = this.rootElement ? this.rootElement.ownerDocument : null;
        const normalizedEndpoint = normalizeEndpointState(
            endpointValue,
            endpointKey === "end" ? DEFAULT_LINE_END : DEFAULT_LINE_START
        );
        const resolvedPoint = point || (
            rootRect
                ? resolveEndpointPoint(
                    normalizedEndpoint,
                    rootRect,
                    ownerDocument,
                    endpointKey === "start" && lineConnection
                        ? lineConnection.fromTargetId
                        : (endpointKey === "end" && lineConnection ? lineConnection.toTargetId : ""),
                    endpointKey === "start" && lineConnection
                        ? lineConnection.fromAnchor
                        : (endpointKey === "end" && lineConnection ? lineConnection.toAnchor : "")
                )
                : null
        ) || {
            x: normalizedEndpoint.x,
            y: normalizedEndpoint.y
        };
        if (ownerDocument && typeof ownerDocument.addEventListener === "function") {
            ownerDocument.addEventListener("pointermove", this.onPointerMove, true);
            ownerDocument.addEventListener("pointerup", this.onPointerUp, true);
            ownerDocument.addEventListener("pointercancel", this.onPointerCancel, true);
            this.dragListenerDocument = ownerDocument;
        }
        this.dragListenerWindow = ownerDocument && ownerDocument.defaultView ? ownerDocument.defaultView : (
            typeof window !== "undefined" ? window : null
        );
        if (this.dragListenerWindow && typeof this.dragListenerWindow.addEventListener === "function") {
            this.dragListenerWindow.addEventListener("blur", this.onWindowBlur, true);
        }
        this.setState({
            dragState: {
                endpointKey,
                endpoint: normalizedEndpoint,
                previewPoint: resolvedPoint,
                pointerId: event && event.pointerId !== undefined ? event.pointerId : null
            },
            hoverAnchor: this.findNearestPublishedAnchor(resolvedPoint),
            handleHoverKey: null,
            interactionActive: true
        });
    }

    onPointerMove(event) {
        if (!this.isDesignerSurface() || !this.state.dragState) {
            return;
        }
        if (
            this.state.dragState.pointerId !== null
            && event
            && event.pointerId !== undefined
            && event.pointerId !== this.state.dragState.pointerId
        ) {
            return;
        }
        const localPoint = this.toLocalPoint(event && event.clientX, event && event.clientY);
        if (!localPoint) {
            return;
        }
        this.setState((previousState) => ({
            dragState: previousState.dragState
                ? Object.assign({}, previousState.dragState, { previewPoint: localPoint })
                : previousState.dragState,
            hoverAnchor: this.findNearestPublishedAnchor(localPoint)
        }));
    }

    onPointerUp(event) {
        this.finishEndpointDrag(event, true);
    }

    onPointerCancel(event) {
        this.finishEndpointDrag(event, false);
    }

    onWindowBlur() {
        this.finishEndpointDrag(null, false);
    }

    finishEndpointDrag(event, shouldCommit) {
        if (!this.state.dragState) {
            this.teardownDragListeners();
            return;
        }
        if (
            this.state.dragState.pointerId !== null
            && event
            && event.pointerId !== undefined
            && event.pointerId !== this.state.dragState.pointerId
        ) {
            return;
        }
        if (event && shouldCommit && typeof event.preventDefault === "function") {
            event.preventDefault();
        }
        if (event && shouldCommit && typeof event.stopPropagation === "function") {
            event.stopPropagation();
        }

        try {
            if (shouldCommit && this.isDesignerSurface()) {
                const localPoint = this.toLocalPoint(event && event.clientX, event && event.clientY)
                    || this.state.dragState.previewPoint
                    || {
                        x: this.state.dragState.endpoint.x,
                        y: this.state.dragState.endpoint.y
                    };
                const hoveredAnchor = this.findNearestPublishedAnchor(localPoint) || this.state.hoverAnchor;
                const committedEndpoint = hoveredAnchor
                    ? {
                        mode: "snapped",
                        x: hoveredAnchor.point.x,
                        y: hoveredAnchor.point.y,
                        targetId: hoveredAnchor.targetId,
                        anchorId: hoveredAnchor.anchorId
                    }
                    : {
                        mode: "free",
                        x: localPoint.x,
                        y: localPoint.y,
                        targetId: "",
                        anchorId: ""
                    };
                this.writeEndpoint(this.state.dragState.endpointKey, committedEndpoint);
            }
        } finally {
            this.teardownDragListeners();
            this.setState({
                dragState: null,
                hoverAnchor: null,
                handleHoverKey: null,
                interactionActive: false
            });
        }
    }

    toLocalPoint(clientX, clientY) {
        const rootRect = this.rootElement ? this.rootElement.getBoundingClientRect() : null;
        if (!rootRect || !Number.isFinite(clientX) || !Number.isFinite(clientY)) {
            return null;
        }
        return {
            x: clientX - rootRect.left,
            y: clientY - rootRect.top
        };
    }

    findNearestPublishedAnchor(localPoint) {
        const rootRect = this.rootElement ? this.rootElement.getBoundingClientRect() : null;
        const ownerDocument = this.rootElement ? this.rootElement.ownerDocument : null;
        if (!rootRect || !ownerDocument || !localPoint) {
            return null;
        }

        const viewportPoint = {
            x: rootRect.left + localPoint.x,
            y: rootRect.top + localPoint.y
        };
        const allTargets = ownerDocument.querySelectorAll("[data-anchor-target-id]");
        const currentTargetId = this.props && this.props.props ? this.props.props.targetId : "";
        const maxSnapRadius = clamp(normalizeNumber(this.props.props.snapRadius, 22), 8, 64);
        let nearest = null;

        for (let i = 0; i < allTargets.length; i += 1) {
            const targetElement = allTargets[i];
            if (!targetElement || targetElement === this.rootElement) {
                continue;
            }
            const targetId = targetElement.getAttribute("data-anchor-target-id");
            if (!targetId || (currentTargetId && targetId === currentTargetId)) {
                continue;
            }

            const rect = targetElement.getBoundingClientRect();
            if (!rect || !rect.width || !rect.height) {
                continue;
            }

            const anchors = parsePublishedAnchors(targetElement, rect);
            for (let anchorIndex = 0; anchorIndex < anchors.length; anchorIndex += 1) {
                const anchor = anchors[anchorIndex];
                const localAnchorPoint = {
                    x: anchor.x - rootRect.left,
                    y: anchor.y - rootRect.top
                };
                const anchorDistance = distance(viewportPoint, anchor);
                const effectiveSnapRadius = Math.max(maxSnapRadius, clamp(normalizeNumber(anchor.snapRadius, 0), 0, 240));
                if (anchorDistance > effectiveSnapRadius) {
                    continue;
                }
                if (!nearest || anchorDistance < nearest.distance) {
                    nearest = {
                        targetId,
                        anchorId: anchor.id,
                        point: localAnchorPoint,
                        distance: anchorDistance
                    };
                }
            }
        }

        return nearest;
    }

    teardownDragListeners() {
        if (!this.dragListenerDocument) {
            if (this.dragListenerWindow && typeof this.dragListenerWindow.removeEventListener === "function") {
                this.dragListenerWindow.removeEventListener("blur", this.onWindowBlur, true);
            }
            this.dragListenerWindow = null;
            return;
        }
        if (typeof this.dragListenerDocument.removeEventListener === "function") {
            this.dragListenerDocument.removeEventListener("pointermove", this.onPointerMove, true);
            this.dragListenerDocument.removeEventListener("pointerup", this.onPointerUp, true);
            this.dragListenerDocument.removeEventListener("pointercancel", this.onPointerCancel, true);
        }
        if (this.dragListenerWindow && typeof this.dragListenerWindow.removeEventListener === "function") {
            this.dragListenerWindow.removeEventListener("blur", this.onWindowBlur, true);
        }
        this.dragListenerDocument = null;
        this.dragListenerWindow = null;
    }

    renderEndpointHandle(endpointKey, endpointValue, resolvedPoint, lineConnection) {
        if (!resolvedPoint) {
            return null;
        }

        const normalizedEndpoint = normalizeEndpointState(
            endpointValue,
            endpointKey === "end" ? DEFAULT_LINE_END : DEFAULT_LINE_START
        );
        const radius = clamp(normalizeNumber(this.props.props.designerHandleRadius, 8), 4, 24);
        const snapRadius = clamp(normalizeNumber(this.props.props.snapRadius, 22), 8, 64);
        const isHovered = this.state.handleHoverKey === endpointKey;
        const strokeColor = lineConnection && lineConnection.stroke ? lineConnection.stroke : "#0e7490";
        const fillColor = normalizedEndpoint.mode === "snapped" ? "#ffffff" : strokeColor;
        const isDragging = this.state.dragState && this.state.dragState.endpointKey === endpointKey;

        return React.createElement("circle", {
            key: `endpoint-handle-${endpointKey}`,
            cx: resolvedPoint.x,
            cy: resolvedPoint.y,
            r: radius,
            fill: fillColor,
            stroke: strokeColor,
            strokeWidth: isHovered ? 3 : 2,
            opacity: 0.95,
            "data-endpoint-key": endpointKey,
            "data-snap-radius": snapRadius,
            style: {
                cursor: isDragging ? "grabbing" : "grab",
                pointerEvents: "all"
            },
            onPointerDown: (event) => this.beginEndpointDrag(endpointKey, normalizedEndpoint, event, resolvedPoint, lineConnection),
            onPointerEnter: () => this.setState({
                handleHoverKey: endpointKey,
                interactionActive: true
            }),
            onPointerLeave: () => this.setState((previousState) => ({
                handleHoverKey: previousState.handleHoverKey === endpointKey ? null : previousState.handleHoverKey
            }))
        });
    }

    render() {
        const { props, emit, store } = this.props;
        const lineConnection = normalizeLineConnection(props);
        const orthogonal = !!props.orthogonal;
        const showLabel = !!props.showLabel;
        const surfacePointerEvents = this.isDesignerSurface() ? "auto" : "none";
        const rootRect = this.rootElement ? this.rootElement.getBoundingClientRect() : null;
        const width = rootRect && rootRect.width > 0 ? rootRect.width : 1000;
        const height = rootRect && rootRect.height > 0 ? rootRect.height : 600;
        const ownerDocument = this.rootElement ? this.rootElement.ownerDocument : null;
        const markerIdSeed = buildIdSeed(store, "connectorLine");
        const startPoint = rootRect
            ? resolveEndpointPoint(
                lineConnection.start,
                rootRect,
                ownerDocument,
                lineConnection.fromTargetId,
                lineConnection.fromAnchor
            )
            : null;
        const endPoint = rootRect
            ? resolveEndpointPoint(
                lineConnection.end,
                rootRect,
                ownerDocument,
                lineConnection.toTargetId,
                lineConnection.toAnchor
            )
            : null;
        const activeDrag = this.isDesignerSurface() ? this.state.dragState : null;
        const hoverAnchor = activeDrag && this.state.hoverAnchor && this.state.hoverAnchor.point
            ? this.state.hoverAnchor
            : null;
        const dragPreviewPoint = activeDrag
            ? (hoverAnchor ? hoverAnchor.point : activeDrag.previewPoint)
            : null;
        const previewStartPoint = activeDrag && activeDrag.endpointKey === "start" && dragPreviewPoint
            ? dragPreviewPoint
            : startPoint;
        const previewEndPoint = activeDrag && activeDrag.endpointKey === "end" && dragPreviewPoint
            ? dragPreviewPoint
            : endPoint;
        const layout = resolveConnectorLayoutFromPoints(lineConnection, previewStartPoint, previewEndPoint, orthogonal);
        const glowFilterId = layout && lineConnection.glowIntensity > 0.001 ? `anchorConnectorLineGlow_${markerIdSeed}` : null;
        const shouldShowHandles = this.isDesignerSurface() && !!layout && (
            !!activeDrag || this.state.interactionActive || !!this.state.handleHoverKey
        );
        const lineHitArea = shouldShowHandles || (this.isDesignerSurface() && layout)
            ? React.createElement("path", {
                key: "connector-line-hit-area",
                d: layout ? layout.pathData : "",
                fill: "none",
                stroke: "rgba(0,0,0,0)",
                strokeWidth: Math.max(
                    lineConnection.strokeWidth + 14,
                    clamp(normalizeNumber(this.props.props.designerHandleRadius, 8), 4, 24) * 3
                ),
                strokeLinecap: "round",
                strokeLinejoin: "round",
                pointerEvents: "stroke",
                cursor: activeDrag ? "grabbing" : "grab",
                "data-line-hit-area": "true",
                onPointerEnter: () => this.setState({ interactionActive: true }),
                onPointerLeave: () => this.setState((previousState) => ({
                    interactionActive: previousState.dragState || previousState.handleHoverKey ? true : false
                }))
            })
            : null;

        const markerDefs = [];
        if (layout && layout.showArrow) {
            markerDefs.push(createArrowMarker(`anchorConnectorLineArrow_${markerIdSeed}`, layout.stroke));
        }
        if (layout && glowFilterId) {
            markerDefs.push(createGlowFilter(glowFilterId, layout.stroke, lineConnection.glowIntensity));
        }

        const lineNode = layout ? React.createElement("g", { key: "connector-line" }, createConnectorChildren(
            layout,
            layout.showArrow ? `url(#anchorConnectorLineArrow_${markerIdSeed})` : undefined,
            glowFilterId,
            showLabel
        )) : null;
        const hoverIndicator = hoverAnchor
            ? React.createElement("circle", {
                key: "connector-line-hover-anchor",
                cx: hoverAnchor.point.x,
                cy: hoverAnchor.point.y,
                r: clamp(normalizeNumber(this.props.props.designerHandleRadius, 8), 4, 24) + 4,
                fill: "rgba(255,255,255,0.22)",
                stroke: lineConnection.stroke,
                strokeWidth: 2,
                opacity: 0.95,
                "data-hover-anchor": "true",
                style: {
                    pointerEvents: "none"
                }
            })
            : null;
        const endpointHandles = shouldShowHandles ? [
            this.renderEndpointHandle("start", lineConnection.start, previewStartPoint, lineConnection),
            this.renderEndpointHandle("end", lineConnection.end, previewEndPoint, lineConnection)
        ] : null;
        const publishedAnchors = layout
            ? buildLinePublishedAnchors(lineConnection.anchorPoints, layout.points)
            : [];

        const svgRoot = React.createElement("svg", {
            viewBox: `0 0 ${width} ${height}`,
            preserveAspectRatio: "none",
            style: {
                width: "100%",
                height: "100%",
                pointerEvents: surfacePointerEvents,
                overflow: "visible"
            }
        }, [
            React.createElement("defs", { key: "line-defs" }, markerDefs),
            lineNode,
            lineHitArea,
            hoverIndicator,
            endpointHandles
        ]);

        const rootProps = emitRoot(emit, "connector-line", props.style, {
            width: "100%",
            height: "100%",
            position: "relative",
            overflow: "visible",
            pointerEvents: surfacePointerEvents
        });
        publishAnchors(rootProps, lineConnection.targetId, publishedAnchors, { coordMode: "local" });
        rootProps.ref = (element) => {
            this.rootElement = element;
        };
        return React.createElement("div", rootProps, svgRoot);
    }
}

function readAnchorArray(tree, key, fallback) {
    const value = tree.read(key, deepClone(fallback));
    return Array.isArray(value) ? value : deepClone(fallback);
}

function buildGensetReducer(tree, defaults) {
    return {
        targetId: readString(tree, "targetId", defaults.targetId),
        showBackground: !!tree.read("showBackground", defaults.showBackground),
        backgroundColor: readString(tree, "backgroundColor", "#050b14"),
        shellFillColor: readString(tree, "shellFillColor", "#0f172a"),
        shellStrokeColor: readString(tree, "shellStrokeColor", "#1e293b"),
        accentColor: readString(tree, "accentColor", "#10b981"),
        textColor: readString(tree, "textColor", "#f1f5f9"),
        fieldBorderColor: readString(tree, "fieldBorderColor", "#f1f5f9"),
        fieldFillColor: readString(tree, "fieldFillColor", "#ffffff"),
        glowIntensity: clamp(normalizeNumber(tree.read("glowIntensity", defaults.glowIntensity), defaults.glowIntensity), 0, 1),
        showAnchorPoints: !!tree.read("showAnchorPoints", false),
        anchorPoints: readAnchorArray(tree, "anchorPoints", GENSET_DEFAULT_ANCHORS),
        generatorTitle: readString(tree, "generatorTitle", "G01"),
        generatorTitleFontSize: Math.max(6, normalizeNumber(tree.read("generatorTitleFontSize", defaults.generatorTitleFontSize), defaults.generatorTitleFontSize)),
        breakerTopLabel: readString(tree, "breakerTopLabel", "52I"),
        breakerBottomLabel: readString(tree, "breakerBottomLabel", "52G"),
        breakerLabelFontSize: Math.max(6, normalizeNumber(tree.read("breakerLabelFontSize", 10.5), 10.5)),
        runLabel: readString(tree, "runLabel", "RUN :"),
        localLabel: readString(tree, "localLabel", "LOCAL :"),
        modeLabel: readString(tree, "modeLabel", "MODE :"),
        kwLabel: readString(tree, "kwLabel", "KW :"),
        kvarLabel: readString(tree, "kvarLabel", "KVAR :"),
        kvaLabel: readString(tree, "kvaLabel", "KVA :"),
        kvLabel: readString(tree, "kvLabel", "KV :"),
        ampsLabel: readString(tree, "ampsLabel", "A :"),
        hzLabel: readString(tree, "hzLabel", "HZ :"),
        runValue: readString(tree, "runValue", ""),
        localValue: readString(tree, "localValue", ""),
        modeValue: readString(tree, "modeValue", ""),
        kwValue: readString(tree, "kwValue", ""),
        kvarValue: readString(tree, "kvarValue", ""),
        kvaValue: readString(tree, "kvaValue", ""),
        kvValue: readString(tree, "kvValue", ""),
        ampsValue: readString(tree, "ampsValue", ""),
        hzValue: readString(tree, "hzValue", ""),
        statusLabelFontSize: Math.max(6, normalizeNumber(tree.read("statusLabelFontSize", 11), 11)),
        statusValueFontSize: Math.max(6, normalizeNumber(tree.read("statusValueFontSize", 11), 11)),
        style: tree.read("style", {})
    };
}

function buildModernLineReducer(tree, defaults) {
    return {
        targetId: readString(tree, "targetId", defaults.targetId),
        showBackground: !!tree.read("showBackground", defaults.showBackground),
        backgroundColor: readString(tree, "backgroundColor", "#0f172a"),
        panelStrokeColor: readString(tree, "panelStrokeColor", "#1e293b"),
        lineColor: readString(tree, "lineColor", "#10b981"),
        lineThickness: Math.max(0.25, normalizeNumber(tree.read("lineThickness", 2), 2)),
        panelCornerRadius: Math.max(0, normalizeNumber(tree.read("panelCornerRadius", 8), 8)),
        glowIntensity: clamp(normalizeNumber(tree.read("glowIntensity", 0.75), 0.75), 0, 1),
        showAnchorPoints: !!tree.read("showAnchorPoints", false),
        anchorPoints: readAnchorArray(tree, "anchorPoints", MODERN_LINE_DEFAULT_ANCHORS),
        style: tree.read("style", {})
    };
}

function buildModernTankReducer(tree, defaults) {
    return {
        targetId: readString(tree, "targetId", defaults.targetId),
        showBackground: !!tree.read("showBackground", defaults.showBackground),
        backgroundColor: readString(tree, "backgroundColor", "#0f172a"),
        panelStrokeColor: readString(tree, "panelStrokeColor", "#1e293b"),
        accentColor: readString(tree, "accentColor", "#10b981"),
        glowIntensity: clamp(normalizeNumber(tree.read("glowIntensity", 0.7), 0.7), 0, 1),
        showAnchorPoints: !!tree.read("showAnchorPoints", false),
        anchorPoints: readAnchorArray(tree, "anchorPoints", MODERN_TANK_DEFAULT_ANCHORS),
        style: tree.read("style", {})
    };
}

function buildModernValveReducer(tree, defaults) {
    return {
        targetId: readString(tree, "targetId", defaults.targetId),
        showBackground: !!tree.read("showBackground", defaults.showBackground),
        backgroundColor: readString(tree, "backgroundColor", "#0f172a"),
        panelStrokeColor: readString(tree, "panelStrokeColor", "#1e293b"),
        accentColor: readString(tree, "accentColor", "#10b981"),
        glowIntensity: clamp(normalizeNumber(tree.read("glowIntensity", 0.7), 0.7), 0, 1),
        showAnchorPoints: !!tree.read("showAnchorPoints", false),
        anchorPoints: readAnchorArray(tree, "anchorPoints", MODERN_VALVE_DEFAULT_ANCHORS),
        style: tree.read("style", {})
    };
}

class AnchorBreakerMeta {
    getComponentType() {
        return BREAKER_COMPONENT_TYPE;
    }

    getViewComponent() {
        return AnchorBreaker;
    }

    getDefaultSize() {
        return {
            width: 162,
            height: 162
        };
    }

    getPropsReducer(tree) {
        return {
            targetId: readString(tree, "targetId", "breakerA"),
            label: readString(tree, "label", "52I"),
            strokeColor: readString(tree, "strokeColor", "#56c89b"),
            textColor: readString(tree, "textColor", "#eef2f7"),
            backgroundColor: readString(tree, "backgroundColor", "#111a2d"),
            fillColor: readString(tree, "fillColor", readString(tree, "backgroundColor", "#111a2d")),
            lineWidth: clamp(normalizeNumber(tree.read("lineWidth", 2), 2), 1, 12),
            showAnchorRings: !!tree.read("showAnchorRings", false),
            ringColor: readString(tree, "ringColor", "#d1d5db"),
            ringOpacity: clamp(normalizeNumber(tree.read("ringOpacity", 0.3), 0.3), 0, 1),
            ringRadius: clamp(normalizeNumber(tree.read("ringRadius", 12), 12), 4, 28),
            style: tree.read("style", {})
        };
    }
}

class GensetPanelMeta {
    getComponentType() {
        return GENSET_PANEL_COMPONENT_TYPE;
    }

    getViewComponent() {
        return GensetPanelComponent;
    }

    getDefaultSize() {
        return { width: 220, height: 320 };
    }

    getPropsReducer(tree) {
        return buildGensetReducer(tree, {
            targetId: "gensetPanel",
            showBackground: true,
            glowIntensity: 0.2,
            generatorTitleFontSize: 13
        });
    }
}

class GensetPanelTransparentMeta {
    getComponentType() {
        return GENSET_PANEL_TRANSPARENT_COMPONENT_TYPE;
    }

    getViewComponent() {
        return GensetPanelTransparentComponent;
    }

    getDefaultSize() {
        return { width: 220, height: 320 };
    }

    getPropsReducer(tree) {
        return buildGensetReducer(tree, {
            targetId: "gensetPanelTransparent",
            showBackground: false,
            glowIntensity: 0.2,
            generatorTitleFontSize: 13
        });
    }
}

class GensetPanelR2Meta {
    getComponentType() {
        return GENSET_PANEL_R2_COMPONENT_TYPE;
    }

    getViewComponent() {
        return GensetPanelR2Component;
    }

    getDefaultSize() {
        return { width: 220, height: 324 };
    }

    getPropsReducer(tree) {
        return buildGensetReducer(tree, {
            targetId: "gensetPanelR2",
            showBackground: true,
            glowIntensity: 0.24,
            generatorTitleFontSize: 19.5
        });
    }
}

class GensetPanelR2TransparentMeta {
    getComponentType() {
        return GENSET_PANEL_R2_TRANSPARENT_COMPONENT_TYPE;
    }

    getViewComponent() {
        return GensetPanelR2TransparentComponent;
    }

    getDefaultSize() {
        return { width: 220, height: 324 };
    }

    getPropsReducer(tree) {
        return buildGensetReducer(tree, {
            targetId: "gensetPanelR2Transparent",
            showBackground: false,
            glowIntensity: 0.24,
            generatorTitleFontSize: 19.5
        });
    }
}

class ModernLineMeta {
    getComponentType() {
        return MODERN_LINE_COMPONENT_TYPE;
    }

    getViewComponent() {
        return ModernLineComponent;
    }

    getDefaultSize() {
        return { width: 380, height: 60 };
    }

    getPropsReducer(tree) {
        return buildModernLineReducer(tree, {
            targetId: "modernLine",
            showBackground: true
        });
    }
}

class ModernLineRev2Meta {
    getComponentType() {
        return MODERN_LINE_REV2_COMPONENT_TYPE;
    }

    getViewComponent() {
        return ModernLineRev2Component;
    }

    getDefaultSize() {
        return { width: 380, height: 60 };
    }

    getPropsReducer(tree) {
        return buildModernLineReducer(tree, {
            targetId: "modernLineRev2",
            showBackground: false
        });
    }
}

class ModernTankMeta {
    getComponentType() {
        return MODERN_TANK_COMPONENT_TYPE;
    }

    getViewComponent() {
        return ModernTankComponent;
    }

    getDefaultSize() {
        return { width: 144, height: 150 };
    }

    getPropsReducer(tree) {
        return buildModernTankReducer(tree, {
            targetId: "modernTank",
            showBackground: true
        });
    }
}

class ModernTankRev2Meta {
    getComponentType() {
        return MODERN_TANK_REV2_COMPONENT_TYPE;
    }

    getViewComponent() {
        return ModernTankRev2Component;
    }

    getDefaultSize() {
        return { width: 144, height: 150 };
    }

    getPropsReducer(tree) {
        return buildModernTankReducer(tree, {
            targetId: "modernTankRev2",
            showBackground: false
        });
    }
}

class ModernValveControlMeta {
    getComponentType() {
        return MODERN_VALVE_CONTROL_COMPONENT_TYPE;
    }

    getViewComponent() {
        return ModernValveControlComponent;
    }

    getDefaultSize() {
        return { width: 144, height: 153 };
    }

    getPropsReducer(tree) {
        return buildModernValveReducer(tree, {
            targetId: "modernValveControl",
            showBackground: true
        });
    }
}

class ModernValveControlRev2Meta {
    getComponentType() {
        return MODERN_VALVE_CONTROL_REV2_COMPONENT_TYPE;
    }

    getViewComponent() {
        return ModernValveControlRev2Component;
    }

    getDefaultSize() {
        return { width: 144, height: 153 };
    }

    getPropsReducer(tree) {
        return buildModernValveReducer(tree, {
            targetId: "modernValveControlRev2",
            showBackground: false
        });
    }
}

class ConnectorOverlayMeta {
    getComponentType() {
        return OVERLAY_COMPONENT_TYPE;
    }

    getViewComponent() {
        return ConnectorOverlay;
    }

    getDefaultSize() {
        return {
            width: 900,
            height: 600
        };
    }

    getPropsReducer(tree) {
        const rawConnections = tree.read("connections", deepClone(defaultOverlayConnections()));
        return {
            connections: Array.isArray(rawConnections) ? rawConnections : deepClone(defaultOverlayConnections()),
            orthogonal: !!tree.read("orthogonal", true),
            pollIntervalMs: clamp(normalizeNumber(tree.read("pollIntervalMs", 200), 200), 50, 5000),
            showLabels: !!tree.read("showLabels", false),
            style: tree.read("style", {})
        };
    }
}

class ConnectorLineMeta {
    getComponentType() {
        return LINE_COMPONENT_TYPE;
    }

    getViewComponent() {
        return ConnectorLine;
    }

    getDefaultSize() {
        return {
            width: 900,
            height: 600
        };
    }

    getPropsReducer(tree) {
        const rawFromTargetId = tree.read("fromTargetId", undefined);
        const rawFromAnchor = tree.read("fromAnchor", undefined);
        const rawToTargetId = tree.read("toTargetId", undefined);
        const rawToAnchor = tree.read("toAnchor", undefined);
        const rawStart = tree.read("start", undefined);
        const rawEnd = tree.read("end", undefined);
        const start = normalizeLineEndpoint(rawStart, rawFromTargetId, rawFromAnchor, DEFAULT_LINE_START);
        const end = normalizeLineEndpoint(rawEnd, rawToTargetId, rawToAnchor, DEFAULT_LINE_END);

        return {
            targetId: readString(tree, "targetId", "connectorLine"),
            start,
            end,
            fromTargetId: rawFromTargetId !== undefined
                ? readString(tree, "fromTargetId", "breakerA")
                : (start.mode === "snapped" ? start.targetId : "breakerA"),
            fromAnchor: rawFromAnchor !== undefined
                ? normalizeAnchorRef(rawFromAnchor, "right")
                : normalizeAnchorRef(start.mode === "snapped" ? start.anchorId : "right", "right"),
            toTargetId: rawToTargetId !== undefined
                ? readString(tree, "toTargetId", "breakerB")
                : (end.mode === "snapped" ? end.targetId : "breakerB"),
            toAnchor: rawToAnchor !== undefined
                ? normalizeAnchorRef(rawToAnchor, "left")
                : normalizeAnchorRef(end.mode === "snapped" ? end.anchorId : "left", "left"),
            stroke: readString(tree, "stroke", "#0e7490"),
            strokeWidth: clamp(normalizeNumber(tree.read("strokeWidth", 2), 2), 0.1, 24),
            cornerRadius: clamp(normalizeNumber(tree.read("cornerRadius", 8), 8), 0, 64),
            markerEnd: readString(tree, "markerEnd", "none"),
            label: readString(tree, "label", ""),
            orthogonal: !!tree.read("orthogonal", true),
            pollIntervalMs: clamp(normalizeNumber(tree.read("pollIntervalMs", 200), 200), 50, 5000),
            showLabel: !!tree.read("showLabel", false),
            glowIntensity: clamp(normalizeNumber(tree.read("glowIntensity", 0.65), 0.65), 0, 1),
            designerHandleRadius: clamp(normalizeNumber(tree.read("designerHandleRadius", 8), 8), 4, 24),
            snapRadius: clamp(normalizeNumber(tree.read("snapRadius", 22), 22), 8, 64),
            anchorPoints: readAnchorArray(tree, "anchorPoints", CONNECTOR_LINE_DEFAULT_ANCHORS),
            style: tree.read("style", {})
        };
    }
}

if (window.__anchorConnectorTargetAndOverlayRegistered) {
    return;
}
ComponentRegistry.register(new AnchorBreakerMeta());
ComponentRegistry.register(new GensetPanelMeta());
ComponentRegistry.register(new GensetPanelTransparentMeta());
ComponentRegistry.register(new GensetPanelR2Meta());
ComponentRegistry.register(new GensetPanelR2TransparentMeta());
ComponentRegistry.register(new ModernLineMeta());
ComponentRegistry.register(new ModernLineRev2Meta());
ComponentRegistry.register(new ModernTankMeta());
ComponentRegistry.register(new ModernTankRev2Meta());
ComponentRegistry.register(new ModernValveControlMeta());
ComponentRegistry.register(new ModernValveControlRev2Meta());
ComponentRegistry.register(new ConnectorOverlayMeta());
ComponentRegistry.register(new ConnectorLineMeta());
window.__anchorConnectorTargetAndOverlayRegistered = true;
}

function tryBootstrapRegistration() {
    if (!window.PerspectiveClient || !window.PerspectiveClient.ComponentRegistry || !window.PerspectiveClient.Component) {
        return false;
    }
    try {
        registerAnchorConnectorTargetAndOverlay(window.PerspectiveClient);
        return true;
    } catch (error) {
        if (window.console && typeof window.console.error === "function") {
            window.console.error("Failed to register anchor connector target/overlay components.", error);
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
