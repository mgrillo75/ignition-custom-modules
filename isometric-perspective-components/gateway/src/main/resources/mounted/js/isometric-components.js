const { Component, ComponentRegistry } = window.PerspectiveClient;

function resolveStatusColor(props) {
    switch (props.status) {
        case "running":
            return props.statusRunningColor;
        case "fault":
            return props.statusFaultColor;
        case "off":
        default:
            return props.statusOffColor;
    }
}

function splitClasses(styleProp) {
    if (!styleProp || typeof styleProp.classes !== "string") {
        return [];
    }
    return styleProp.classes.trim().split(/\s+/).filter(Boolean);
}

function inlineStyle(styleProp) {
    if (!styleProp || typeof styleProp !== "object") {
        return {};
    }
    const copy = Object.assign({}, styleProp);
    delete copy.classes;
    return copy;
}

function readSharedProps(tree, defaults) {
    return {
        bodyColor: tree.readString("bodyColor", defaults.bodyColor),
        accentColor: tree.readString("accentColor", defaults.accentColor),
        strokeColor: tree.readString("strokeColor", defaults.strokeColor),
        status: tree.readString("status", "off"),
        statusOffColor: tree.readString("statusOffColor", "#A0AEC0"),
        statusRunningColor: tree.readString("statusRunningColor", "#22C55E"),
        statusFaultColor: tree.readString("statusFaultColor", "#EF4444"),
        label: tree.readString("label", defaults.label),
        value: tree.readString("value", defaults.value),
        showLabel: !!tree.read("showLabel", true),
        showValue: !!tree.read("showValue", true),
        showStatus: !!tree.read("showStatus", true),
        labelColor: tree.readString("labelColor", "#1F2937"),
        valueColor: tree.readString("valueColor", "#0F766E"),
        style: tree.read("style", {})
    };
}

function readGensetProps(tree) {
    const shared = readSharedProps(tree, {
        bodyColor: "#879BFF",
        accentColor: "#6E82EE",
        strokeColor: "#4C5B76",
        label: "Genset-401",
        value: "Standby"
    });

    shared.frameColor = tree.readString("frameColor", "#26324B");
    shared.cabinetColor = tree.readString("cabinetColor", "#1D2943");
    shared.engineBlockColor = tree.readString("engineBlockColor", "#D8DFEA");
    shared.flywheelColor = tree.readString("flywheelColor", "#6072D9");
    shared.exhaustColor = tree.readString("exhaustColor", "#C8924A");
    shared.shadowOpacity = tree.readNumber("shadowOpacity", 0.18);

    return shared;
}

function readTestSvgProps(tree) {
    return {
        fillColor: tree.readString("fillColor", "#22C55E"),
        strokeColor: tree.readString("strokeColor", "#1F2937"),
        indicatorOn: !!tree.read("indicatorOn", false),
        label: tree.readString("label", "Test SVG"),
        labelColor: tree.readString("labelColor", "#1F2937"),
        style: tree.read("style", {})
    };
}

function readBusbarHEnergizedProps(tree) {
    return {
        energized: !!tree.read("energized", true),
        energizedTopColor: tree.readString("energizedTopColor", "#ef4444"),
        energizedBottomColor: tree.readString("energizedBottomColor", "#dc2626"),
        deenergizedTopColor: tree.readString("deenergizedTopColor", "#94a3b8"),
        deenergizedBottomColor: tree.readString("deenergizedBottomColor", "#64748b"),
        strokeColor: tree.readString("strokeColor", "#f87171"),
        deenergizedStrokeColor: tree.readString("deenergizedStrokeColor", "#cbd5e1"),
        glowColor: tree.readString("glowColor", "#ef4444"),
        glowOpacity: tree.readNumber("glowOpacity", 0.5),
        highlightColor: tree.readString("highlightColor", "#ffffff"),
        highlightOpacity: tree.readNumber("highlightOpacity", 0.12),
        barLength: tree.readNumber("barLength", 300),
        barHeight: tree.readNumber("barHeight", 10),
        showLabel: !!tree.read("showLabel", false),
        label: tree.readString("label", "Busbar H Horizontal"),
        labelColor: tree.readString("labelColor", "#1f2937"),
        style: tree.read("style", {})
    };
}

function readBusbarVEnergizedProps(tree) {
    return {
        energized: !!tree.read("energized", true),
        energizedLeftColor: tree.readString("energizedLeftColor", "#ef4444"),
        energizedRightColor: tree.readString("energizedRightColor", "#dc2626"),
        deenergizedLeftColor: tree.readString("deenergizedLeftColor", "#94a3b8"),
        deenergizedRightColor: tree.readString("deenergizedRightColor", "#64748b"),
        strokeColor: tree.readString("strokeColor", "#f87171"),
        deenergizedStrokeColor: tree.readString("deenergizedStrokeColor", "#cbd5e1"),
        glowColor: tree.readString("glowColor", "#ef4444"),
        glowOpacity: tree.readNumber("glowOpacity", 0.5),
        highlightColor: tree.readString("highlightColor", "#ffffff"),
        highlightOpacity: tree.readNumber("highlightOpacity", 0.12),
        barLength: tree.readNumber("barLength", 300),
        barWidth: tree.readNumber("barWidth", 10),
        showLabel: !!tree.read("showLabel", false),
        label: tree.readString("label", "Busbar V Vertical"),
        labelColor: tree.readString("labelColor", "#1f2937"),
        style: tree.read("style", {})
    };
}

function readBusbarSegmentProps(tree) {
    return {
        energized: !!tree.read("energized", true),
        energizedTopColor: tree.readString("energizedTopColor", "#ff8f00"),
        energizedBottomColor: tree.readString("energizedBottomColor", "#e65100"),
        deenergizedTopColor: tree.readString("deenergizedTopColor", "#94a3b8"),
        deenergizedBottomColor: tree.readString("deenergizedBottomColor", "#64748b"),
        strokeColor: tree.readString("strokeColor", "#ffb74d"),
        deenergizedStrokeColor: tree.readString("deenergizedStrokeColor", "#cbd5e1"),
        glowColor: tree.readString("glowColor", "#ff8f00"),
        glowOpacity: tree.readNumber("glowOpacity", 0.45),
        markerColor: tree.readString("markerColor", "#ffb74d"),
        markerOpacity: tree.readNumber("markerOpacity", 0.6),
        markerCount: tree.readNumber("markerCount", 5),
        barLength: tree.readNumber("barLength", 300),
        barHeight: tree.readNumber("barHeight", 10),
        showLabel: !!tree.read("showLabel", false),
        label: tree.readString("label", "Busbar Segment Horizontal"),
        labelColor: tree.readString("labelColor", "#1f2937"),
        style: tree.read("style", {})
    };
}

function readBusbarSegmentVerticalProps(tree) {
    return {
        energized: !!tree.read("energized", true),
        energizedLeftColor: tree.readString("energizedLeftColor", "#d32f2f"),
        energizedRightColor: tree.readString("energizedRightColor", "#f44336"),
        deenergizedLeftColor: tree.readString("deenergizedLeftColor", "#94a3b8"),
        deenergizedRightColor: tree.readString("deenergizedRightColor", "#64748b"),
        strokeColor: tree.readString("strokeColor", "#ef5350"),
        deenergizedStrokeColor: tree.readString("deenergizedStrokeColor", "#cbd5e1"),
        glowColor: tree.readString("glowColor", "#ef4444"),
        glowOpacity: tree.readNumber("glowOpacity", 0.45),
        markerColor: tree.readString("markerColor", "#ef9a9a"),
        markerOpacity: tree.readNumber("markerOpacity", 0.6),
        markerCount: tree.readNumber("markerCount", 5),
        barLength: tree.readNumber("barLength", 300),
        barWidth: tree.readNumber("barWidth", 10),
        showLabel: !!tree.read("showLabel", false),
        label: tree.readString("label", "Busbar Segment Vertical"),
        labelColor: tree.readString("labelColor", "#1f2937"),
        style: tree.read("style", {})
    };
}

function readCustom2DSvgProps(tree, defaultLabel) {
    return {
        colorOverrides: tree.read("colorOverrides", {}),
        textOverrides: tree.read("textOverrides", {}),
        applyGlobalFill: !!tree.read("applyGlobalFill", false),
        globalFillColor: tree.readString("globalFillColor", "#64748b"),
        applyGlobalStroke: !!tree.read("applyGlobalStroke", false),
        globalStrokeColor: tree.readString("globalStrokeColor", "#334155"),
        svgOpacity: tree.readNumber("svgOpacity", 1.0),
        preserveAspectRatio: tree.readString("preserveAspectRatio", "xMidYMid meet"),
        showLabel: !!tree.read("showLabel", false),
        label: tree.readString("label", defaultLabel),
        labelColor: tree.readString("labelColor", "#1f2937"),
        style: tree.read("style", {})
    };
}

function mergeOverrideMaps(explicitMap, userMap) {
    const merged = Object.assign({}, explicitMap || {});
    if (!userMap || typeof userMap !== "object") {
        return merged;
    }
    Object.keys(userMap).forEach((key) => {
        const value = userMap[key];
        if (typeof value === "string") {
            merged[key] = value;
        }
    });
    return merged;
}

function readCustom2DModernGensetPanelProps(tree) {
    const base = readCustom2DSvgProps(tree, "Modern Genset Panel V7");
    const accentColor = tree.readString("accentColor", "#10b981");
    const accentStrongColor = tree.readString("accentStrongColor", "#34d399");
    const inactiveTextColor = tree.readString("inactiveTextColor", "#64748b");
    const frameStrokeColor = tree.readString("frameStrokeColor", "#1e293b");
    const dividerColor = tree.readString("dividerColor", "rgba(255,255,255,0.35)");
    const unitChipFillColor = tree.readString("unitChipFillColor", "rgba(16,185,129,0.1)");
    const unitChipStrokeColor = tree.readString("unitChipStrokeColor", "rgba(16,185,129,0.2)");
    const unitIconColor = tree.readString("unitIconColor", "#34d399");
    const statusInactiveFillColor = tree.readString("statusInactiveFillColor", "rgba(16,185,129,0.04)");
    const statusInactiveStrokeColor = tree.readString("statusInactiveStrokeColor", "rgba(16,185,129,0.08)");
    const statusActiveFillColor = tree.readString("statusActiveFillColor", "rgba(16,185,129,0.1)");
    const statusActiveStrokeColor = tree.readString("statusActiveStrokeColor", "rgba(16,185,129,0.25)");

    const explicitColorOverrides = {
        "#1e293b": frameStrokeColor,
        "#10b981": accentColor,
        "#34d399": accentStrongColor,
        "#64748b": inactiveTextColor,
        "rgba(255,255,255,0.35)": dividerColor,
        "rgba(16,185,129,0.1)": unitChipFillColor,
        "rgba(16,185,129,0.2)": unitChipStrokeColor,
        "rgba(16,185,129,0.04)": statusInactiveFillColor,
        "rgba(16,185,129,0.08)": statusInactiveStrokeColor,
        "rgba(16,185,129,0.25)": statusActiveStrokeColor
    };

    const explicitTextOverrides = {
        "G5": tree.readString("unitText", "G5"),
        "RUNNING": tree.readString("runningText", "RUNNING"),
        "STARTING": tree.readString("startingText", "STARTING"),
        "STOPPING": tree.readString("stoppingText", "STOPPING"),
        "STOPPED": tree.readString("stoppedText", "STOPPED"),
        "REMOTE": tree.readString("remoteText", "REMOTE"),
        "LOCAL": tree.readString("localText", "LOCAL")
    };

    return Object.assign({}, base, {
        colorOverrides: mergeOverrideMaps(explicitColorOverrides, base.colorOverrides),
        textOverrides: mergeOverrideMaps(explicitTextOverrides, base.textOverrides),
        glowBlurStdDeviation: tree.readNumber("glowBlurStdDeviation", 4.0),
        stoppedIndicatorVisible: !!tree.read("stoppedIndicatorVisible", true),
        localIndicatorVisible: !!tree.read("localIndicatorVisible", true),
        statusActiveFillColor: statusActiveFillColor,
        unitIconColor: unitIconColor
    });
}

function readCustom2DLvBreakerScreenProps(tree) {
    const base = readCustom2DSvgProps(tree, "LV Breaker Screen (Full Page)");
    return Object.assign({}, base, {
        showOverlay: !!tree.read("showOverlay", true),
        overlayTitleText: tree.readString("overlayTitleText", "LV Breaker"),
        overlayValueText: tree.readString("overlayValueText", "0.0 kW"),
        overlayStatusText: tree.readString("overlayStatusText", "Closed"),
        overlayXPercent: tree.readNumber("overlayXPercent", 50.0),
        overlayYPercent: tree.readNumber("overlayYPercent", 50.0),
        overlayAnchor: tree.readString("overlayAnchor", "middle"),
        overlayBackgroundColor: tree.readString("overlayBackgroundColor", "rgba(15,23,42,0.55)"),
        overlayBorderColor: tree.readString("overlayBorderColor", "rgba(148,163,184,0.45)"),
        overlayBorderWidth: tree.readNumber("overlayBorderWidth", 1.0),
        overlayBorderRadius: tree.readNumber("overlayBorderRadius", 8.0),
        overlayPadding: tree.readNumber("overlayPadding", 10.0),
        overlayTitleColor: tree.readString("overlayTitleColor", "#e2e8f0"),
        overlayValueColor: tree.readString("overlayValueColor", "#f8fafc"),
        overlayStatusColor: tree.readString("overlayStatusColor", "#22c55e"),
        overlayTitleSize: tree.readNumber("overlayTitleSize", 12.0),
        overlayValueSize: tree.readNumber("overlayValueSize", 20.0),
        overlayStatusSize: tree.readNumber("overlayStatusSize", 12.0),
        overlayFontFamily: tree.readString("overlayFontFamily", "Segoe UI, sans-serif")
    });
}

function readCustom2DMvGensetScreenMainProps(tree) {
    const base = readCustom2DSvgProps(tree, "MV Genset Screen");
    return Object.assign({}, base, {
        showOverlay: !!tree.read("showOverlay", true),
        overlayTitleText: tree.readString("overlayTitleText", "MV Genset"),
        overlayValueText: tree.readString("overlayValueText", "Standby"),
        overlayStatusText: tree.readString("overlayStatusText", "Ready"),
        overlayXPercent: tree.readNumber("overlayXPercent", 50.0),
        overlayYPercent: tree.readNumber("overlayYPercent", 50.0),
        overlayAnchor: tree.readString("overlayAnchor", "middle"),
        overlayBackgroundColor: tree.readString("overlayBackgroundColor", "rgba(15,23,42,0.55)"),
        overlayBorderColor: tree.readString("overlayBorderColor", "rgba(148,163,184,0.45)"),
        overlayBorderWidth: tree.readNumber("overlayBorderWidth", 1.0),
        overlayBorderRadius: tree.readNumber("overlayBorderRadius", 8.0),
        overlayPadding: tree.readNumber("overlayPadding", 10.0),
        overlayTitleColor: tree.readString("overlayTitleColor", "#e2e8f0"),
        overlayValueColor: tree.readString("overlayValueColor", "#f8fafc"),
        overlayStatusColor: tree.readString("overlayStatusColor", "#22c55e"),
        overlayTitleSize: tree.readNumber("overlayTitleSize", 12.0),
        overlayValueSize: tree.readNumber("overlayValueSize", 20.0),
        overlayStatusSize: tree.readNumber("overlayStatusSize", 12.0),
        overlayFontFamily: tree.readString("overlayFontFamily", "Segoe UI, sans-serif")
    });
}

function readCustom2DValveProps(tree) {
    const base = readCustom2DSvgProps(tree, "Valve");
    const lineColor = tree.readString("lineColor", "#10b981");
    const glowColor = tree.readString("glowColor", "#10b981");
    const explicitColorOverrides = {
        "#10b981": lineColor
    };

    return Object.assign({}, base, {
        colorOverrides: mergeOverrideMaps(explicitColorOverrides, base.colorOverrides),
        lineColor: lineColor,
        glowColor: glowColor,
        coreGlowOpacity: tree.readNumber("coreGlowOpacity", 0.15),
        glowPrimaryOpacity: tree.readNumber("glowPrimaryOpacity", 0.8),
        glowSecondaryOpacity: tree.readNumber("glowSecondaryOpacity", 0.6),
        glowTertiaryOpacity: tree.readNumber("glowTertiaryOpacity", 0.4),
        glowPrimaryBlur: tree.readNumber("glowPrimaryBlur", 2.2),
        glowSecondaryBlur: tree.readNumber("glowSecondaryBlur", 5.5),
        glowTertiaryBlur: tree.readNumber("glowTertiaryBlur", 10.5)
    });
}

function escapeRegExp(value) {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function clampOpacity(value) {
    const numeric = Number(value);
    if (Number.isNaN(numeric)) {
        return 1;
    }
    return Math.max(0, Math.min(1, numeric));
}

function clampNumber(value, min, max, fallback) {
    const numeric = Number(value);
    if (Number.isNaN(numeric)) {
        return fallback;
    }
    return Math.max(min, Math.min(max, numeric));
}

function applyColorOverrides(markup, overrides) {
    if (!overrides || typeof overrides !== "object") {
        return markup;
    }
    let output = markup;
    Object.keys(overrides).forEach((key) => {
        const replacement = overrides[key];
        if (typeof replacement !== "string" || !replacement.trim()) {
            return;
        }
        const source = String(key || "").trim();
        if (!source) {
            return;
        }
        const token = /^(#|rgb|hsl|var\(|currentColor|none)/i.test(source) ? source : `#${source}`;
        output = output.replace(new RegExp(escapeRegExp(token), "gi"), replacement);
    });
    return output;
}

function applyTextOverrides(markup, overrides) {
    if (!overrides || typeof overrides !== "object") {
        return markup;
    }
    let output = markup;
    Object.keys(overrides).forEach((key) => {
        const replacement = overrides[key];
        if (typeof replacement !== "string") {
            return;
        }
        const token = String(key || "");
        if (!token) {
            return;
        }
        output = output.split(token).join(replacement);
    });
    return output;
}

function applyGlobalColor(markup, attributeName, colorValue) {
    if (typeof colorValue !== "string" || !colorValue.trim()) {
        return markup;
    }
    const attrRegex = new RegExp(`\\b${attributeName}=\"(?!none|url\\()[^\"]*\"`, "gi");
    return markup.replace(attrRegex, `${attributeName}="${colorValue}"`);
}

function scopeSvgIds(markup, scopePrefix) {
    const idRegex = /\bid=\"([^\"]+)\"/g;
    const ids = [];
    let match;
    while ((match = idRegex.exec(markup)) !== null) {
        ids.push(match[1]);
    }
    if (!ids.length) {
        return markup;
    }

    const idMap = {};
    ids.forEach((oldId) => {
        idMap[oldId] = `${scopePrefix}_${oldId}`;
    });

    let output = markup.replace(/\bid=\"([^\"]+)\"/g, (full, oldId) => `id="${idMap[oldId] || oldId}"`);
    ids.forEach((oldId) => {
        const scopedId = idMap[oldId];
        const escapedOld = escapeRegExp(oldId);
        output = output.replace(new RegExp(`url\\(#${escapedOld}\\)`, "g"), `url(#${scopedId})`);
        output = output.replace(new RegExp(`(href|xlink:href)=([\"'])#${escapedOld}\\2`, "g"), `$1=$2#${scopedId}$2`);
    });
    return output;
}

function normalizeSvgRoot(markup, preserveAspectRatio, opacity) {
    return markup.replace(/<svg\b([^>]*)>/i, (full, attrs) => {
        let cleanedAttrs = attrs;
        let styleValue = "";
        const styleMatch = cleanedAttrs.match(/\sstyle=\"([^\"]*)\"/i);
        if (styleMatch) {
            styleValue = styleMatch[1];
            cleanedAttrs = cleanedAttrs.replace(/\sstyle=\"[^\"]*\"/i, "");
        }
        cleanedAttrs = cleanedAttrs.replace(/\s(width|height)\=\"[^\"]*\"/gi, "");
        cleanedAttrs = cleanedAttrs.replace(/\spreserveAspectRatio=\"[^\"]*\"/i, "");
        if (styleValue && !styleValue.trim().endsWith(";")) {
            styleValue += ";";
        }
        styleValue += `width:100%;height:100%;opacity:${opacity};`;
        return `<svg${cleanedAttrs} preserveAspectRatio="${preserveAspectRatio}" style="${styleValue}">`;
    });
}

function transformCustom2DSvg(rawMarkup, props, scopePrefix) {
    let output = String(rawMarkup || "").replace(/<\?xml[\s\S]*?\?>\s*/i, "").trim();
    output = scopeSvgIds(output, scopePrefix);
    output = applyColorOverrides(output, props.colorOverrides);
    if (props.applyGlobalFill) {
        output = applyGlobalColor(output, "fill", props.globalFillColor);
    }
    if (props.applyGlobalStroke) {
        output = applyGlobalColor(output, "stroke", props.globalStrokeColor);
    }
    output = applyTextOverrides(output, props.textOverrides);
    output = normalizeSvgRoot(output, props.preserveAspectRatio || "xMidYMid meet", clampOpacity(props.svgOpacity));
    return output;
}

const custom2dSvgCache = {};

function loadCustom2DSvg(svgFileName) {
    if (!svgFileName) {
        return Promise.reject(new Error("Missing svg file name."));
    }
    const cacheEntry = custom2dSvgCache[svgFileName];
    if (cacheEntry && cacheEntry.text) {
        return Promise.resolve(cacheEntry.text);
    }
    if (cacheEntry && cacheEntry.promise) {
        return cacheEntry.promise;
    }

    const requestUrl = `/res/isometric-components/svg/${svgFileName}`;
    const request = fetch(requestUrl, { cache: "no-store" })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to load ${svgFileName}: ${response.status}`);
            }
            return response.text();
        })
        .then((text) => {
            custom2dSvgCache[svgFileName] = { text };
            return text;
        })
        .catch((error) => {
            delete custom2dSvgCache[svgFileName];
            throw error;
        });

    custom2dSvgCache[svgFileName] = { promise: request };
    return request;
}

function renderFooter(props) {
    const children = [];
    if (props.showLabel) {
        children.push(React.createElement("div", {
            key: "label",
            style: {
                color: props.labelColor,
                fontSize: 12,
                fontWeight: 600
            }
        }, props.label));
    }
    if (props.showValue) {
        children.push(React.createElement("div", {
            key: "value",
            style: {
                color: props.valueColor,
                fontSize: 12
            }
        }, props.value));
    }

    if (!children.length) {
        return null;
    }

    return React.createElement("div", {
        style: {
            width: "100%",
            textAlign: "center",
            lineHeight: 1.1,
            fontFamily: "Segoe UI, sans-serif"
        }
    }, children);
}

function renderStatus(props, cx, cy) {
    if (!props.showStatus) {
        return null;
    }
    return React.createElement("circle", {
        key: "status-indicator",
        cx,
        cy,
        r: 7,
        fill: resolveStatusColor(props),
        stroke: props.strokeColor,
        strokeWidth: 2
    });
}

function rootEmit(emit, styleProp) {
    const combinedStyle = Object.assign({
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        padding: 2,
        overflow: "hidden"
    }, inlineStyle(styleProp));

    const classes = ["isometric-component"].concat(splitClasses(styleProp));
    return emit({ classes, style: combinedStyle });
}

class IsometricPump extends Component {
    render() {
        const { props, emit } = this.props;
        const svg = React.createElement("svg", {
            viewBox: "0 0 180 120",
            preserveAspectRatio: "xMidYMid meet",
            style: { width: "100%", height: "100%" }
        }, [
            React.createElement("polygon", {
                key: "shadow",
                points: "30,102 136,102 163,114 58,114",
                fill: "#0F172A",
                opacity: 0.18
            }),
            React.createElement("polygon", {
                key: "pump-front",
                points: "48,40 74,54 74,84 48,70",
                fill: props.bodyColor,
                fillOpacity: 0.72,
                stroke: props.strokeColor,
                strokeWidth: 2
            }),
            React.createElement("polygon", {
                key: "pump-top",
                points: "48,40 114,40 140,54 74,54",
                fill: props.bodyColor,
                stroke: props.strokeColor,
                strokeWidth: 2
            }),
            React.createElement("polygon", {
                key: "pump-side",
                points: "74,54 140,54 140,84 74,84",
                fill: props.accentColor,
                fillOpacity: 0.82,
                stroke: props.strokeColor,
                strokeWidth: 2
            }),
            React.createElement("rect", {
                key: "motor-block",
                x: 18,
                y: 46,
                width: 34,
                height: 30,
                rx: 3,
                fill: props.accentColor,
                stroke: props.strokeColor,
                strokeWidth: 2
            }),
            React.createElement("rect", {
                key: "pipe",
                x: 138,
                y: 62,
                width: 22,
                height: 12,
                fill: props.strokeColor,
                opacity: 0.75
            }),
            React.createElement("path", {
                key: "stand",
                d: "M64,84 L64,96 L121,96 L121,84",
                stroke: props.strokeColor,
                strokeWidth: 4,
                fill: "none",
                strokeLinecap: "round"
            }),
            renderStatus(props, 152, 30)
        ]);

        return React.createElement("div", Object.assign({}, rootEmit(emit, props.style)), [
            React.createElement("div", {
                key: "svg-wrap",
                style: { width: "100%", flex: "1 1 auto", minHeight: 0 }
            }, svg),
            renderFooter(props)
        ]);
    }
}

class IsometricValve extends Component {
    render() {
        const { props, emit } = this.props;
        const svg = React.createElement("svg", {
            viewBox: "0 0 180 120",
            preserveAspectRatio: "xMidYMid meet",
            style: { width: "100%", height: "100%" }
        }, [
            React.createElement("polygon", {
                key: "shadow",
                points: "34,99 145,99 165,112 54,112",
                fill: "#0F172A",
                opacity: 0.16
            }),
            React.createElement("polygon", {
                key: "pipe-top",
                points: "18,53 104,53 126,66 40,66",
                fill: props.bodyColor,
                stroke: props.strokeColor,
                strokeWidth: 2
            }),
            React.createElement("polygon", {
                key: "pipe-side",
                points: "40,66 126,66 126,83 40,83",
                fill: props.accentColor,
                fillOpacity: 0.8,
                stroke: props.strokeColor,
                strokeWidth: 2
            }),
            React.createElement("polygon", {
                key: "valve-body-top",
                points: "76,32 105,46 76,60 47,46",
                fill: props.accentColor,
                stroke: props.strokeColor,
                strokeWidth: 2
            }),
            React.createElement("polygon", {
                key: "valve-body-left",
                points: "47,46 76,60 76,82 47,68",
                fill: props.bodyColor,
                fillOpacity: 0.75,
                stroke: props.strokeColor,
                strokeWidth: 2
            }),
            React.createElement("polygon", {
                key: "valve-body-right",
                points: "76,60 105,46 105,68 76,82",
                fill: props.accentColor,
                fillOpacity: 0.72,
                stroke: props.strokeColor,
                strokeWidth: 2
            }),
            React.createElement("line", {
                key: "handle-stem",
                x1: 76,
                y1: 32,
                x2: 76,
                y2: 16,
                stroke: props.strokeColor,
                strokeWidth: 3
            }),
            React.createElement("line", {
                key: "handle-bar",
                x1: 59,
                y1: 16,
                x2: 93,
                y2: 16,
                stroke: props.strokeColor,
                strokeWidth: 4,
                strokeLinecap: "round"
            }),
            renderStatus(props, 151, 31)
        ]);

        return React.createElement("div", Object.assign({}, rootEmit(emit, props.style)), [
            React.createElement("div", {
                key: "svg-wrap",
                style: { width: "100%", flex: "1 1 auto", minHeight: 0 }
            }, svg),
            renderFooter(props)
        ]);
    }
}

class IsometricTank extends Component {
    render() {
        const { props, emit } = this.props;
        const svg = React.createElement("svg", {
            viewBox: "0 0 180 130",
            preserveAspectRatio: "xMidYMid meet",
            style: { width: "100%", height: "100%" }
        }, [
            React.createElement("polygon", {
                key: "shadow",
                points: "44,108 130,108 154,121 68,121",
                fill: "#0F172A",
                opacity: 0.16
            }),
            React.createElement("ellipse", {
                key: "tank-top",
                cx: 88,
                cy: 35,
                rx: 34,
                ry: 12,
                fill: props.bodyColor,
                stroke: props.strokeColor,
                strokeWidth: 2
            }),
            React.createElement("rect", {
                key: "tank-body",
                x: 54,
                y: 35,
                width: 68,
                height: 52,
                fill: props.bodyColor,
                fillOpacity: 0.85,
                stroke: props.strokeColor,
                strokeWidth: 2
            }),
            React.createElement("ellipse", {
                key: "tank-bottom",
                cx: 88,
                cy: 87,
                rx: 34,
                ry: 12,
                fill: props.accentColor,
                fillOpacity: 0.82,
                stroke: props.strokeColor,
                strokeWidth: 2
            }),
            React.createElement("rect", {
                key: "tank-level",
                x: 58,
                y: 63,
                width: 60,
                height: 20,
                fill: props.accentColor,
                opacity: 0.55
            }),
            React.createElement("line", {
                key: "inlet",
                x1: 88,
                y1: 12,
                x2: 88,
                y2: 23,
                stroke: props.strokeColor,
                strokeWidth: 4
            }),
            React.createElement("line", {
                key: "outlet",
                x1: 122,
                y1: 64,
                x2: 154,
                y2: 64,
                stroke: props.strokeColor,
                strokeWidth: 4
            }),
            renderStatus(props, 153, 28)
        ]);

        return React.createElement("div", Object.assign({}, rootEmit(emit, props.style)), [
            React.createElement("div", {
                key: "svg-wrap",
                style: { width: "100%", flex: "1 1 auto", minHeight: 0 }
            }, svg),
            renderFooter(props)
        ]);
    }
}

class IsometricGenset extends Component {
    render() {
        const { props, emit } = this.props;
        const shadowOpacity = Math.min(1, Math.max(0, props.shadowOpacity));

        const svg = React.createElement("svg", {
            viewBox: "0 0 230 150",
            preserveAspectRatio: "xMidYMid meet",
            style: { width: "100%", height: "100%" }
        }, [
            React.createElement("polygon", {
                key: "shadow",
                points: "36,136 176,136 212,151 72,151",
                fill: "#0F172A",
                opacity: shadowOpacity
            }),

            React.createElement("polygon", {
                key: "skid-lower-top",
                points: "46,107 183,107 211,121 74,121",
                fill: props.frameColor,
                stroke: props.strokeColor,
                strokeWidth: 1.8
            }),
            React.createElement("polygon", {
                key: "skid-lower-front",
                points: "74,121 211,121 211,135 74,135",
                fill: props.frameColor,
                fillOpacity: 0.78,
                stroke: props.strokeColor,
                strokeWidth: 1.8
            }),
            React.createElement("polygon", {
                key: "skid-lower-left",
                points: "46,107 74,121 74,135 46,121",
                fill: props.frameColor,
                fillOpacity: 0.68,
                stroke: props.strokeColor,
                strokeWidth: 1.8
            }),
            React.createElement("polygon", {
                key: "skid-foot-left",
                points: "55,121 64,125 64,139 55,135",
                fill: props.frameColor,
                stroke: props.strokeColor,
                strokeWidth: 1.6
            }),
            React.createElement("polygon", {
                key: "skid-foot-mid",
                points: "126,121 134,125 134,139 126,135",
                fill: props.frameColor,
                stroke: props.strokeColor,
                strokeWidth: 1.6
            }),
            React.createElement("polygon", {
                key: "skid-upper-top",
                points: "52,97 176,97 203,111 79,111",
                fill: props.frameColor,
                fillOpacity: 0.92,
                stroke: props.strokeColor,
                strokeWidth: 1.8
            }),
            React.createElement("polygon", {
                key: "skid-upper-front",
                points: "79,111 203,111 203,119 79,119",
                fill: props.frameColor,
                fillOpacity: 0.78,
                stroke: props.strokeColor,
                strokeWidth: 1.8
            }),
            React.createElement("polygon", {
                key: "skid-upper-left",
                points: "52,97 79,111 79,119 52,105",
                fill: props.frameColor,
                fillOpacity: 0.66,
                stroke: props.strokeColor,
                strokeWidth: 1.8
            }),

            React.createElement("polygon", {
                key: "rear-cabinet-front",
                points: "170,30 199,44 199,94 170,80",
                fill: props.cabinetColor,
                fillOpacity: 0.9,
                stroke: props.strokeColor,
                strokeWidth: 1.8
            }),
            React.createElement("polygon", {
                key: "rear-cabinet-side",
                points: "199,44 216,35 216,85 199,94",
                fill: props.cabinetColor,
                stroke: props.strokeColor,
                strokeWidth: 1.8
            }),
            React.createElement("polygon", {
                key: "rear-cabinet-top",
                points: "170,30 187,21 216,35 199,44",
                fill: props.cabinetColor,
                fillOpacity: 0.74,
                stroke: props.strokeColor,
                strokeWidth: 1.8
            }),
            React.createElement("line", {
                key: "rear-cabinet-grill-a",
                x1: 176,
                y1: 35,
                x2: 176,
                y2: 76,
                stroke: "#2D3752",
                strokeWidth: 1.2
            }),
            React.createElement("line", {
                key: "rear-cabinet-grill-b",
                x1: 184,
                y1: 39,
                x2: 184,
                y2: 80,
                stroke: "#2D3752",
                strokeWidth: 1.2
            }),
            React.createElement("line", {
                key: "rear-cabinet-grill-c",
                x1: 192,
                y1: 43,
                x2: 192,
                y2: 84,
                stroke: "#2D3752",
                strokeWidth: 1.2
            }),

            React.createElement("ellipse", {
                key: "rotor-ring",
                cx: 164,
                cy: 66,
                rx: 17,
                ry: 21,
                fill: "#E9EEF9",
                stroke: props.strokeColor,
                strokeWidth: 1.8
            }),
            React.createElement("ellipse", {
                key: "rotor-inner",
                cx: 164,
                cy: 66,
                rx: 9,
                ry: 12,
                fill: "#8C9AB0",
                stroke: props.strokeColor,
                strokeWidth: 1.4
            }),

            React.createElement("polygon", {
                key: "body-top",
                points: "86,42 140,42 169,58 115,58",
                fill: props.bodyColor,
                stroke: props.strokeColor,
                strokeWidth: 1.8
            }),
            React.createElement("polygon", {
                key: "body-left",
                points: "86,42 115,58 115,98 86,82",
                fill: props.accentColor,
                fillOpacity: 0.86,
                stroke: props.strokeColor,
                strokeWidth: 1.8
            }),
            React.createElement("polygon", {
                key: "body-right",
                points: "115,58 169,58 169,98 115,98",
                fill: props.bodyColor,
                fillOpacity: 0.96,
                stroke: props.strokeColor,
                strokeWidth: 1.8
            }),
            React.createElement("polygon", {
                key: "body-highlight",
                points: "128,45 152,58 152,90 128,77",
                fill: "#FFFFFF",
                opacity: 0.18
            }),

            React.createElement("polygon", {
                key: "front-block-top",
                points: "40,54 86,54 111,68 64,68",
                fill: props.engineBlockColor,
                stroke: props.strokeColor,
                strokeWidth: 1.8
            }),
            React.createElement("polygon", {
                key: "front-block-left",
                points: "40,54 64,68 64,92 40,78",
                fill: props.engineBlockColor,
                fillOpacity: 0.82,
                stroke: props.strokeColor,
                strokeWidth: 1.8
            }),
            React.createElement("polygon", {
                key: "front-block-right",
                points: "64,68 111,68 111,92 64,92",
                fill: props.engineBlockColor,
                fillOpacity: 0.95,
                stroke: props.strokeColor,
                strokeWidth: 1.8
            }),

            React.createElement("circle", {
                key: "flywheel-outer",
                cx: 74,
                cy: 87,
                r: 23,
                fill: props.flywheelColor,
                stroke: props.strokeColor,
                strokeWidth: 2
            }),
            React.createElement("circle", {
                key: "flywheel-inner",
                cx: 74,
                cy: 87,
                r: 12,
                fill: "#121A2D",
                stroke: props.strokeColor,
                strokeWidth: 1.6
            }),
            React.createElement("line", {
                key: "flywheel-spoke-a",
                x1: 74,
                y1: 64,
                x2: 74,
                y2: 110,
                stroke: "#2F3A5A",
                strokeWidth: 2.2
            }),
            React.createElement("line", {
                key: "flywheel-spoke-b",
                x1: 51,
                y1: 87,
                x2: 97,
                y2: 87,
                stroke: "#2F3A5A",
                strokeWidth: 2.2
            }),
            React.createElement("line", {
                key: "flywheel-spoke-c",
                x1: 58,
                y1: 71,
                x2: 90,
                y2: 103,
                stroke: "#2F3A5A",
                strokeWidth: 2.2
            }),
            React.createElement("line", {
                key: "flywheel-spoke-d",
                x1: 90,
                y1: 71,
                x2: 58,
                y2: 103,
                stroke: "#2F3A5A",
                strokeWidth: 2.2
            }),
            React.createElement("line", {
                key: "flywheel-spoke-e",
                x1: 61,
                y1: 78,
                x2: 87,
                y2: 96,
                stroke: "#2F3A5A",
                strokeWidth: 2
            }),
            React.createElement("line", {
                key: "flywheel-spoke-f",
                x1: 87,
                y1: 78,
                x2: 61,
                y2: 96,
                stroke: "#2F3A5A",
                strokeWidth: 2
            }),

            React.createElement("ellipse", {
                key: "exhaust-1-top",
                cx: 104,
                cy: 39,
                rx: 7,
                ry: 5,
                fill: props.exhaustColor,
                stroke: props.strokeColor,
                strokeWidth: 1.4
            }),
            React.createElement("rect", {
                key: "exhaust-1-body",
                x: 97,
                y: 39,
                width: 14,
                height: 15,
                fill: props.exhaustColor,
                stroke: props.strokeColor,
                strokeWidth: 1.4
            }),
            React.createElement("ellipse", {
                key: "exhaust-1-bottom",
                cx: 104,
                cy: 54,
                rx: 7,
                ry: 5,
                fill: props.exhaustColor,
                fillOpacity: 0.9,
                stroke: props.strokeColor,
                strokeWidth: 1.4
            }),

            React.createElement("ellipse", {
                key: "exhaust-2-top",
                cx: 126,
                cy: 46,
                rx: 7,
                ry: 5,
                fill: props.exhaustColor,
                stroke: props.strokeColor,
                strokeWidth: 1.4
            }),
            React.createElement("rect", {
                key: "exhaust-2-body",
                x: 119,
                y: 46,
                width: 14,
                height: 15,
                fill: props.exhaustColor,
                stroke: props.strokeColor,
                strokeWidth: 1.4
            }),
            React.createElement("ellipse", {
                key: "exhaust-2-bottom",
                cx: 126,
                cy: 61,
                rx: 7,
                ry: 5,
                fill: props.exhaustColor,
                fillOpacity: 0.9,
                stroke: props.strokeColor,
                strokeWidth: 1.4
            }),
            React.createElement("path", {
                key: "exhaust-link-1",
                d: "M111 54 C116 50 120 50 124 55",
                fill: "none",
                stroke: "#2E3A59",
                strokeWidth: 3,
                strokeLinecap: "round"
            }),
            React.createElement("path", {
                key: "exhaust-link-2",
                d: "M133 61 C138 57 142 57 146 62",
                fill: "none",
                stroke: "#2E3A59",
                strokeWidth: 3,
                strokeLinecap: "round"
            }),

            React.createElement("polygon", {
                key: "mount-1",
                points: "99,90 114,90 121,99 106,99",
                fill: "#E8EEF9",
                stroke: "#7B879B",
                strokeWidth: 1.3
            }),
            React.createElement("polygon", {
                key: "mount-1-side",
                points: "106,99 121,99 121,108 106,108",
                fill: "#DAE3F3",
                stroke: "#7B879B",
                strokeWidth: 1.3
            }),
            React.createElement("polygon", {
                key: "mount-2",
                points: "128,87 143,87 150,96 135,96",
                fill: "#E8EEF9",
                stroke: "#7B879B",
                strokeWidth: 1.3
            }),
            React.createElement("polygon", {
                key: "mount-2-side",
                points: "135,96 150,96 150,105 135,105",
                fill: "#DAE3F3",
                stroke: "#7B879B",
                strokeWidth: 1.3
            }),

            renderStatus(props, 211, 24)
        ]);

        return React.createElement("div", Object.assign({}, rootEmit(emit, props.style)), [
            React.createElement("div", {
                key: "svg-wrap",
                style: { width: "100%", flex: "1 1 auto", minHeight: 0 }
            }, svg),
            renderFooter(props)
        ]);
    }
}

class IsometricTestSvg extends Component {
    render() {
        const { props, emit } = this.props;

        const indicatorColor = props.indicatorOn ? "#22C55E" : "#94A3B8";
        const svg = React.createElement("svg", {
            viewBox: "0 0 170 120",
            preserveAspectRatio: "xMidYMid meet",
            style: { width: "100%", height: "100%" }
        }, [
            React.createElement("polygon", {
                key: "face-top",
                points: "32,32 98,32 126,48 60,48",
                fill: props.fillColor,
                stroke: props.strokeColor,
                strokeWidth: 2
            }),
            React.createElement("polygon", {
                key: "face-left",
                points: "32,32 60,48 60,86 32,70",
                fill: props.fillColor,
                fillOpacity: 0.75,
                stroke: props.strokeColor,
                strokeWidth: 2
            }),
            React.createElement("polygon", {
                key: "face-right",
                points: "60,48 126,48 126,86 60,86",
                fill: props.fillColor,
                fillOpacity: 0.9,
                stroke: props.strokeColor,
                strokeWidth: 2
            }),
            React.createElement("line", {
                key: "diag-1",
                x1: 40,
                y1: 54,
                x2: 118,
                y2: 54,
                stroke: props.strokeColor,
                strokeWidth: 2,
                opacity: 0.6
            }),
            React.createElement("line", {
                key: "diag-2",
                x1: 40,
                y1: 64,
                x2: 118,
                y2: 64,
                stroke: props.strokeColor,
                strokeWidth: 2,
                opacity: 0.6
            }),
            React.createElement("circle", {
                key: "indicator",
                cx: 136,
                cy: 26,
                r: 8,
                fill: indicatorColor,
                stroke: props.strokeColor,
                strokeWidth: 2
            })
        ]);

        const labelEl = React.createElement("div", {
            key: "label",
            style: {
                color: props.labelColor,
                fontSize: 12,
                fontWeight: 600,
                textAlign: "center",
                width: "100%",
                fontFamily: "Segoe UI, sans-serif"
            }
        }, props.label);

        return React.createElement("div", Object.assign({}, rootEmit(emit, props.style)), [
            React.createElement("div", {
                key: "svg-wrap",
                style: { width: "100%", flex: "1 1 auto", minHeight: 0 }
            }, svg),
            labelEl
        ]);
    }
}

class Custom2DBusbarHEnergized extends Component {
    render() {
        const { props, emit, store } = this.props;

        const pathKey = store && store.path ? String(store.path).replace(/[^A-Za-z0-9_]/g, "_") : "default";
        const gradientId = `busbarHGradient_${pathKey}`;

        const energized = !!props.energized;
        const topColor = energized ? props.energizedTopColor : props.deenergizedTopColor;
        const bottomColor = energized ? props.energizedBottomColor : props.deenergizedBottomColor;
        const strokeColor = energized ? props.strokeColor : props.deenergizedStrokeColor;

        const barLength = Math.max(20, props.barLength);
        const barHeight = Math.max(2, props.barHeight);
        const bodyY = 3;
        const viewHeight = bodyY + barHeight + 3;
        const glowOpacity = Math.max(0, Math.min(1, props.glowOpacity));
        const highlightOpacity = Math.max(0, Math.min(1, props.highlightOpacity));
        const corner = Math.max(1, Math.min(3, barHeight / 3));

        const defs = React.createElement("defs", { key: "defs" }, [
            React.createElement("linearGradient", {
                id: gradientId,
                key: "gradient",
                x1: "0%",
                y1: "0%",
                x2: "0%",
                y2: "100%"
            }, [
                React.createElement("stop", { key: "stop-top", offset: "0%", style: { stopColor: topColor } }),
                React.createElement("stop", { key: "stop-bottom", offset: "100%", style: { stopColor: bottomColor } })
            ])
        ]);

        const glowRect = energized ? React.createElement("rect", {
            key: "glow",
            x: 0,
            y: bodyY,
            width: barLength,
            height: barHeight,
            rx: corner,
            ry: corner,
            fill: props.glowColor,
            opacity: glowOpacity * 0.55,
            style: { filter: "blur(4px)" }
        }) : null;

        const bodyRect = React.createElement("rect", {
            key: "body",
            x: 0,
            y: bodyY,
            width: barLength,
            height: barHeight,
            rx: corner,
            ry: corner,
            fill: `url(#${gradientId})`,
            stroke: strokeColor,
            strokeWidth: 0.6
        });

        const highlightRect = React.createElement("rect", {
            key: "highlight",
            x: 0,
            y: bodyY,
            width: barLength,
            height: Math.max(1, barHeight * 0.22),
            rx: corner,
            ry: corner,
            fill: props.highlightColor,
            opacity: highlightOpacity
        });

        const svg = React.createElement("svg", {
            key: "svg",
            viewBox: `0 0 ${barLength} ${viewHeight}`,
            preserveAspectRatio: "none",
            style: { width: "100%", height: "100%" }
        }, [defs, glowRect, bodyRect, highlightRect]);

        const children = [
            React.createElement("div", {
                key: "svg-wrap",
                style: { width: "100%", flex: "1 1 auto", minHeight: 0 }
            }, svg)
        ];

        if (props.showLabel) {
            children.push(React.createElement("div", {
                key: "label",
                style: {
                    width: "100%",
                    textAlign: "center",
                    fontSize: 12,
                    color: props.labelColor,
                    fontFamily: "Segoe UI, sans-serif"
                }
            }, props.label));
        }

        return React.createElement("div", Object.assign({}, rootEmit(emit, props.style)), children);
    }
}

class Custom2DBusbarVEnergized extends Component {
    render() {
        const { props, emit, store } = this.props;

        const pathKey = store && store.path ? String(store.path).replace(/[^A-Za-z0-9_]/g, "_") : "default";
        const gradientId = `busbarVGradient_${pathKey}`;

        const energized = !!props.energized;
        const leftColor = energized ? props.energizedLeftColor : props.deenergizedLeftColor;
        const rightColor = energized ? props.energizedRightColor : props.deenergizedRightColor;
        const strokeColor = energized ? props.strokeColor : props.deenergizedStrokeColor;

        const barLength = Math.max(20, props.barLength);
        const barWidth = Math.max(2, props.barWidth);
        const bodyX = Math.max(2, Math.round(barWidth * 0.3));
        const viewWidth = bodyX + barWidth + bodyX;
        const highlightWidth = Math.max(1, Math.round(barWidth * 0.2));
        const corner = Math.max(1, Math.min(3, barWidth / 3));
        const glowOpacity = Math.max(0, Math.min(1, props.glowOpacity));
        const highlightOpacity = Math.max(0, Math.min(1, props.highlightOpacity));

        const defs = React.createElement("defs", { key: "defs" }, [
            React.createElement("linearGradient", {
                id: gradientId,
                key: "gradient",
                x1: "0%",
                y1: "0%",
                x2: "100%",
                y2: "0%"
            }, [
                React.createElement("stop", { key: "stop-left", offset: "0%", style: { stopColor: leftColor } }),
                React.createElement("stop", { key: "stop-right", offset: "100%", style: { stopColor: rightColor } })
            ])
        ]);

        const glowRect = energized ? React.createElement("rect", {
            key: "glow",
            x: bodyX,
            y: 0,
            width: barWidth,
            height: barLength,
            rx: corner,
            ry: corner,
            fill: props.glowColor,
            opacity: glowOpacity,
            style: { filter: "blur(4px)" }
        }) : null;

        const bodyRect = React.createElement("rect", {
            key: "body",
            x: bodyX,
            y: 0,
            width: barWidth,
            height: barLength,
            rx: corner,
            ry: corner,
            fill: `url(#${gradientId})`,
            stroke: strokeColor,
            strokeWidth: 0.5
        });

        const highlightRect = React.createElement("rect", {
            key: "highlight",
            x: bodyX,
            y: 0,
            width: highlightWidth,
            height: barLength,
            rx: Math.max(1, corner - 1),
            ry: Math.max(1, corner - 1),
            fill: props.highlightColor,
            opacity: highlightOpacity
        });

        const svg = React.createElement("svg", {
            key: "svg",
            viewBox: `0 0 ${viewWidth} ${barLength}`,
            preserveAspectRatio: "none",
            style: { width: "100%", height: "100%" }
        }, [defs, glowRect, bodyRect, highlightRect]);

        const children = [
            React.createElement("div", {
                key: "svg-wrap",
                style: { width: "100%", flex: "1 1 auto", minHeight: 0 }
            }, svg)
        ];

        if (props.showLabel) {
            children.push(React.createElement("div", {
                key: "label",
                style: {
                    width: "100%",
                    textAlign: "center",
                    fontSize: 12,
                    color: props.labelColor,
                    fontFamily: "Segoe UI, sans-serif"
                }
            }, props.label));
        }

        return React.createElement("div", Object.assign({}, rootEmit(emit, props.style)), children);
    }
}

class Custom2DBusbarSegment extends Component {
    render() {
        const { props, emit, store } = this.props;

        const pathKey = store && store.path ? String(store.path).replace(/[^A-Za-z0-9_]/g, "_") : "default";
        const gradientId = `busbarSegmentGradient_${pathKey}`;

        const energized = !!props.energized;
        const topColor = energized ? props.energizedTopColor : props.deenergizedTopColor;
        const bottomColor = energized ? props.energizedBottomColor : props.deenergizedBottomColor;
        const strokeColor = energized ? props.strokeColor : props.deenergizedStrokeColor;

        const barLength = Math.max(20, props.barLength);
        const barHeight = Math.max(2, props.barHeight);
        const markerCount = Math.max(2, Math.round(props.markerCount));
        const markerOpacity = Math.max(0, Math.min(1, props.markerOpacity));
        const glowOpacity = Math.max(0, Math.min(1, props.glowOpacity));
        const bodyY = Math.max(2, Math.round(barHeight * 0.7));
        const viewHeight = bodyY + barHeight + Math.max(2, Math.round(barHeight * 0.7));
        const markerTop = Math.max(0, bodyY - 3);
        const markerBottom = Math.min(viewHeight, bodyY + barHeight + 3);
        const corner = Math.max(1, Math.min(3, barHeight / 3));

        const defs = React.createElement("defs", { key: "defs" }, [
            React.createElement("linearGradient", {
                id: gradientId,
                key: "gradient",
                x1: "0%",
                y1: "0%",
                x2: "0%",
                y2: "100%"
            }, [
                React.createElement("stop", { key: "stop-top", offset: "0%", style: { stopColor: topColor } }),
                React.createElement("stop", { key: "stop-bottom", offset: "100%", style: { stopColor: bottomColor } })
            ])
        ]);

        const glowRect = energized ? React.createElement("rect", {
            key: "glow",
            x: 0,
            y: bodyY,
            width: barLength,
            height: barHeight,
            rx: corner,
            ry: corner,
            fill: props.glowColor,
            opacity: glowOpacity,
            style: { filter: "blur(3px)" }
        }) : null;

        const bodyRect = React.createElement("rect", {
            key: "body",
            x: 0,
            y: bodyY,
            width: barLength,
            height: barHeight,
            rx: corner,
            ry: corner,
            fill: `url(#${gradientId})`,
            stroke: strokeColor,
            strokeWidth: 0.5
        });

        const markers = [];
        for (let i = 0; i < markerCount; i += 1) {
            const x = markerCount === 1 ? 0 : (i * (barLength - 1)) / (markerCount - 1);
            markers.push(React.createElement("line", {
                key: `marker-${i}`,
                x1: x,
                y1: markerTop,
                x2: x,
                y2: markerBottom,
                stroke: props.markerColor,
                strokeWidth: 1.5,
                strokeLinecap: "round",
                opacity: markerOpacity
            }));
        }

        const svg = React.createElement("svg", {
            key: "svg",
            viewBox: `0 0 ${barLength} ${viewHeight}`,
            preserveAspectRatio: "none",
            style: { width: "100%", height: "100%" }
        }, [defs, glowRect, bodyRect].concat(markers));

        const children = [
            React.createElement("div", {
                key: "svg-wrap",
                style: { width: "100%", flex: "1 1 auto", minHeight: 0 }
            }, svg)
        ];

        if (props.showLabel) {
            children.push(React.createElement("div", {
                key: "label",
                style: {
                    width: "100%",
                    textAlign: "center",
                    fontSize: 12,
                    color: props.labelColor,
                    fontFamily: "Segoe UI, sans-serif"
                }
            }, props.label));
        }

        return React.createElement("div", Object.assign({}, rootEmit(emit, props.style)), children);
    }
}

class Custom2DBusbarSegmentVertical extends Component {
    render() {
        const { props, emit, store } = this.props;

        const pathKey = store && store.path ? String(store.path).replace(/[^A-Za-z0-9_]/g, "_") : "default";
        const gradientId = `busbarSegmentVerticalGradient_${pathKey}`;

        const energized = !!props.energized;
        const leftColor = energized ? props.energizedLeftColor : props.deenergizedLeftColor;
        const rightColor = energized ? props.energizedRightColor : props.deenergizedRightColor;
        const strokeColor = energized ? props.strokeColor : props.deenergizedStrokeColor;

        const barLength = Math.max(20, props.barLength);
        const barWidth = Math.max(2, props.barWidth);
        const markerCount = Math.max(2, Math.round(props.markerCount));
        const markerOpacity = Math.max(0, Math.min(1, props.markerOpacity));
        const glowOpacity = Math.max(0, Math.min(1, props.glowOpacity));
        const bodyX = Math.max(2, Math.round(barWidth * 0.7));
        const viewWidth = bodyX + barWidth + Math.max(2, Math.round(barWidth * 0.7));
        const markerLeft = Math.max(0, bodyX - 3);
        const markerRight = Math.min(viewWidth, bodyX + barWidth + 3);
        const corner = Math.max(1, Math.min(3, barWidth / 3));

        const defs = React.createElement("defs", { key: "defs" }, [
            React.createElement("linearGradient", {
                id: gradientId,
                key: "gradient",
                x1: "0%",
                y1: "0%",
                x2: "100%",
                y2: "0%"
            }, [
                React.createElement("stop", { key: "stop-left", offset: "0%", style: { stopColor: leftColor } }),
                React.createElement("stop", { key: "stop-right", offset: "100%", style: { stopColor: rightColor } })
            ])
        ]);

        const glowRect = energized ? React.createElement("rect", {
            key: "glow",
            x: bodyX,
            y: 0,
            width: barWidth,
            height: barLength,
            rx: corner,
            ry: corner,
            fill: props.glowColor,
            opacity: glowOpacity,
            style: { filter: "blur(3px)" }
        }) : null;

        const bodyRect = React.createElement("rect", {
            key: "body",
            x: bodyX,
            y: 0,
            width: barWidth,
            height: barLength,
            rx: corner,
            ry: corner,
            fill: `url(#${gradientId})`,
            stroke: strokeColor,
            strokeWidth: 0.5
        });

        const markers = [];
        for (let i = 0; i < markerCount; i += 1) {
            const y = markerCount === 1 ? 0 : (i * (barLength - 1)) / (markerCount - 1);
            markers.push(React.createElement("line", {
                key: `marker-${i}`,
                x1: markerLeft,
                y1: y,
                x2: markerRight,
                y2: y,
                stroke: props.markerColor,
                strokeWidth: 1.5,
                strokeLinecap: "round",
                opacity: markerOpacity
            }));
        }

        const svg = React.createElement("svg", {
            key: "svg",
            viewBox: `0 0 ${viewWidth} ${barLength}`,
            preserveAspectRatio: "none",
            style: { width: "100%", height: "100%" }
        }, [defs, glowRect, bodyRect].concat(markers));

        const children = [
            React.createElement("div", {
                key: "svg-wrap",
                style: { width: "100%", flex: "1 1 auto", minHeight: 0 }
            }, svg)
        ];

        if (props.showLabel) {
            children.push(React.createElement("div", {
                key: "label",
                style: {
                    width: "100%",
                    textAlign: "center",
                    fontSize: 12,
                    color: props.labelColor,
                    fontFamily: "Segoe UI, sans-serif"
                }
            }, props.label));
        }

        return React.createElement("div", Object.assign({}, rootEmit(emit, props.style)), children);
    }
}

class Custom2DSourceSvg extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rawSvg: null,
            loadError: null
        };
    }

    componentDidMount() {
        this.ensureSvgLoaded();
    }

    ensureSvgLoaded() {
        const svgFileName = this.constructor.SVG_FILE;
        if (!svgFileName || this.state.rawSvg) {
            return;
        }
        loadCustom2DSvg(svgFileName)
            .then((rawSvg) => {
                this.setState({
                    rawSvg,
                    loadError: null
                });
            })
            .catch((error) => {
                const message = error && error.message ? error.message : `Failed to load ${svgFileName}`;
                this.setState({
                    loadError: message
                });
            });
    }

    transformSvg(rawSvg, props, scopeKey) {
        return transformCustom2DSvg(rawSvg, props, scopeKey);
    }

    renderOverlay() {
        return null;
    }

    render() {
        const { props, emit, store } = this.props;
        const { rawSvg, loadError } = this.state;

        const scopeSeed = store && store.path ? String(store.path) : (this.constructor.SVG_FILE || "custom2d");
        const scopeKey = scopeSeed.replace(/[^A-Za-z0-9_]/g, "_");

        let svgInner = null;
        if (rawSvg) {
            const transformedSvg = this.transformSvg(rawSvg, props, scopeKey);
            svgInner = React.createElement("div", {
                key: "svg-raw",
                style: { width: "100%", height: "100%" },
                dangerouslySetInnerHTML: { __html: transformedSvg }
            });
        } else {
            const placeholderText = loadError || "Loading SVG...";
            svgInner = React.createElement("div", {
                key: "svg-placeholder",
                style: {
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#64748b",
                    fontSize: 11,
                    fontFamily: "Segoe UI, sans-serif",
                    textAlign: "center",
                    padding: "0 6px"
                }
            }, placeholderText);
        }

        const overlayNode = this.renderOverlay(props);
        const svgWrapChildren = [
            React.createElement("div", {
                key: "svg-content",
                style: { width: "100%", height: "100%" }
            }, svgInner)
        ];
        if (overlayNode) {
            svgWrapChildren.push(overlayNode);
        }

        const children = [
            React.createElement("div", {
                key: "svg-wrap",
                style: { width: "100%", flex: "1 1 auto", minHeight: 0, position: "relative" }
            }, svgWrapChildren)
        ];

        if (props.showLabel) {
            children.push(React.createElement("div", {
                key: "label",
                style: {
                    width: "100%",
                    textAlign: "center",
                    fontSize: 12,
                    color: props.labelColor,
                    fontFamily: "Segoe UI, sans-serif"
                }
            }, props.label));
        }

        return React.createElement("div", Object.assign({}, rootEmit(emit, props.style)), children);
    }
}

function replaceOrInsertAttribute(elementMarkup, attributeName, attributeValue) {
    const attrRegex = new RegExp(`\\b${attributeName}="[^"]*"`, "i");
    if (attrRegex.test(elementMarkup)) {
        return elementMarkup.replace(attrRegex, `${attributeName}="${attributeValue}"`);
    }
    const closeIndex = elementMarkup.lastIndexOf("/>");
    if (closeIndex >= 0) {
        return `${elementMarkup.slice(0, closeIndex)} ${attributeName}="${attributeValue}"${elementMarkup.slice(closeIndex)}`;
    }
    const gtIndex = elementMarkup.lastIndexOf(">");
    if (gtIndex >= 0) {
        return `${elementMarkup.slice(0, gtIndex)} ${attributeName}="${attributeValue}"${elementMarkup.slice(gtIndex)}`;
    }
    return elementMarkup;
}

function replaceRectAtY(markup, yValue, fillColor, strokeColor) {
    const escapedY = escapeRegExp(String(yValue));
    const rectRegex = new RegExp(`<rect\\b[^>]*\\by="${escapedY}"[^>]*/>`, "i");
    const match = markup.match(rectRegex);
    if (!match || !match[0]) {
        return markup;
    }
    let updated = match[0];
    updated = replaceOrInsertAttribute(updated, "fill", fillColor);
    updated = replaceOrInsertAttribute(updated, "stroke", strokeColor);
    return markup.replace(match[0], updated);
}

function replacePathWithTransform(markup, transformFragment, fillColor) {
    const escapedFragment = escapeRegExp(transformFragment);
    const pathRegex = new RegExp(`<path\\b[^>]*\\btransform="[^"]*${escapedFragment}[^"]*"[^>]*/>`, "i");
    const match = markup.match(pathRegex);
    if (!match || !match[0]) {
        return markup;
    }
    const updated = replaceOrInsertAttribute(match[0], "fill", fillColor);
    return markup.replace(match[0], updated);
}

function setCircleOpacityByCoordinates(markup, cxValue, cyValue, visible) {
    const escapedCx = escapeRegExp(String(cxValue));
    const escapedCy = escapeRegExp(String(cyValue));
    const circleRegex = new RegExp(`<circle\\b[^>]*\\bcx="${escapedCx}"[^>]*\\bcy="${escapedCy}"[^>]*/>`, "i");
    const match = markup.match(circleRegex);
    if (!match || !match[0]) {
        return markup;
    }
    const updated = replaceOrInsertAttribute(match[0], "opacity", visible ? "1" : "0");
    return markup.replace(match[0], updated);
}

class Custom2DModernGensetPanelV7FullPanel extends Custom2DSourceSvg {
    transformSvg(rawSvg, props, scopeKey) {
        let output = transformCustom2DSvg(rawSvg, props, scopeKey);

        output = output.replace(/(<feGaussianBlur\b[^>]*\bstdDeviation=")[^"]*(")/i, (full, start, end) => {
            return `${start}${clampNumber(props.glowBlurStdDeviation, 0, 24, 4)}${end}`;
        });

        output = replaceRectAtY(output, 202.0, props.unitChipFillColor, props.unitChipStrokeColor);
        output = replaceRectAtY(output, 338.36, props.statusActiveFillColor, props.statusActiveStrokeColor);
        output = replaceRectAtY(output, 412.20000000000005, props.statusActiveFillColor, props.statusActiveStrokeColor);
        output = replacePathWithTransform(output, "translate(50.441874999999996 212.3)", props.unitIconColor);

        output = setCircleOpacityByCoordinates(output, 43.840375, 350.32, props.stoppedIndicatorVisible);
        output = setCircleOpacityByCoordinates(output, 51.350875, 424.16, props.localIndicatorVisible);

        return output;
    }
}
Custom2DModernGensetPanelV7FullPanel.SVG_FILE = "modern-genset-panel-v7_full_panel.svg";

class Custom2DLvBreakerScreenFullPage extends Custom2DSourceSvg {
    renderOverlay(props) {
        if (!props.showOverlay) {
            return null;
        }

        const anchor = props.overlayAnchor === "start" || props.overlayAnchor === "end" ? props.overlayAnchor : "middle";
        const transformByAnchor = {
            start: "translate(0, -50%)",
            middle: "translate(-50%, -50%)",
            end: "translate(-100%, -50%)"
        };
        const textAlignByAnchor = {
            start: "left",
            middle: "center",
            end: "right"
        };

        const panelChildren = [];
        if (props.overlayTitleText) {
            panelChildren.push(React.createElement("div", {
                key: "overlay-title",
                style: {
                    color: props.overlayTitleColor,
                    fontSize: props.overlayTitleSize,
                    fontWeight: 600,
                    lineHeight: 1.2
                }
            }, props.overlayTitleText));
        }
        if (props.overlayValueText) {
            panelChildren.push(React.createElement("div", {
                key: "overlay-value",
                style: {
                    color: props.overlayValueColor,
                    fontSize: props.overlayValueSize,
                    fontWeight: 700,
                    lineHeight: 1.2,
                    marginTop: 2
                }
            }, props.overlayValueText));
        }
        if (props.overlayStatusText) {
            panelChildren.push(React.createElement("div", {
                key: "overlay-status",
                style: {
                    color: props.overlayStatusColor,
                    fontSize: props.overlayStatusSize,
                    fontWeight: 600,
                    lineHeight: 1.2,
                    marginTop: 2
                }
            }, props.overlayStatusText));
        }

        if (!panelChildren.length) {
            return null;
        }

        return React.createElement("div", {
            key: "overlay",
            style: {
                position: "absolute",
                left: `${clampNumber(props.overlayXPercent, 0, 100, 50)}%`,
                top: `${clampNumber(props.overlayYPercent, 0, 100, 50)}%`,
                transform: transformByAnchor[anchor],
                pointerEvents: "none"
            }
        }, React.createElement("div", {
            style: {
                background: props.overlayBackgroundColor,
                border: `${clampNumber(props.overlayBorderWidth, 0, 8, 1)}px solid ${props.overlayBorderColor}`,
                borderRadius: clampNumber(props.overlayBorderRadius, 0, 64, 8),
                padding: clampNumber(props.overlayPadding, 0, 48, 10),
                textAlign: textAlignByAnchor[anchor],
                color: props.overlayTitleColor,
                fontFamily: props.overlayFontFamily,
                boxShadow: "0 2px 12px rgba(2, 6, 23, 0.25)",
                minWidth: 140
            }
        }, panelChildren));
    }
}
Custom2DLvBreakerScreenFullPage.SVG_FILE = "lv-breaker-screen_full_page.svg";

class Custom2DMvGensetScreenMain extends Custom2DSourceSvg {
    renderOverlay(props) {
        if (!props.showOverlay) {
            return null;
        }

        const anchor = props.overlayAnchor === "start" || props.overlayAnchor === "end" ? props.overlayAnchor : "middle";
        const transformByAnchor = {
            start: "translate(0, -50%)",
            middle: "translate(-50%, -50%)",
            end: "translate(-100%, -50%)"
        };
        const textAlignByAnchor = {
            start: "left",
            middle: "center",
            end: "right"
        };

        const panelChildren = [];
        if (props.overlayTitleText) {
            panelChildren.push(React.createElement("div", {
                key: "overlay-title",
                style: {
                    color: props.overlayTitleColor,
                    fontSize: props.overlayTitleSize,
                    fontWeight: 600,
                    lineHeight: 1.2
                }
            }, props.overlayTitleText));
        }
        if (props.overlayValueText) {
            panelChildren.push(React.createElement("div", {
                key: "overlay-value",
                style: {
                    color: props.overlayValueColor,
                    fontSize: props.overlayValueSize,
                    fontWeight: 700,
                    lineHeight: 1.2,
                    marginTop: 2
                }
            }, props.overlayValueText));
        }
        if (props.overlayStatusText) {
            panelChildren.push(React.createElement("div", {
                key: "overlay-status",
                style: {
                    color: props.overlayStatusColor,
                    fontSize: props.overlayStatusSize,
                    fontWeight: 600,
                    lineHeight: 1.2,
                    marginTop: 2
                }
            }, props.overlayStatusText));
        }

        if (!panelChildren.length) {
            return null;
        }

        return React.createElement("div", {
            key: "overlay",
            style: {
                position: "absolute",
                left: `${clampNumber(props.overlayXPercent, 0, 100, 50)}%`,
                top: `${clampNumber(props.overlayYPercent, 0, 100, 50)}%`,
                transform: transformByAnchor[anchor],
                pointerEvents: "none"
            }
        }, React.createElement("div", {
            style: {
                background: props.overlayBackgroundColor,
                border: `${clampNumber(props.overlayBorderWidth, 0, 8, 1)}px solid ${props.overlayBorderColor}`,
                borderRadius: clampNumber(props.overlayBorderRadius, 0, 64, 8),
                padding: clampNumber(props.overlayPadding, 0, 48, 10),
                textAlign: textAlignByAnchor[anchor],
                color: props.overlayTitleColor,
                fontFamily: props.overlayFontFamily,
                boxShadow: "0 2px 12px rgba(2, 6, 23, 0.25)",
                minWidth: 140
            }
        }, panelChildren));
    }
}
Custom2DMvGensetScreenMain.SVG_FILE = "mv-genset-screen-main.svg";

class Custom2DValve extends Custom2DSourceSvg {
    transformSvg(rawSvg, props, scopeKey) {
        let output = transformCustom2DSvg(rawSvg, props, scopeKey);

        output = output.replace(/(<stop\b[^>]*offset="0%"[^>]*stop-color=")[^"]*(")/i, `$1${props.glowColor}$2`);
        output = output.replace(/(<stop\b[^>]*offset="0%"[^>]*stop-opacity=")[^"]*(")/i, (full, start, end) => {
            return `${start}${clampOpacity(props.coreGlowOpacity)}${end}`;
        });
        output = output.replace(/(<stop\b[^>]*offset="70%"[^>]*stop-color=")[^"]*(")/i, `$1${props.glowColor}$2`);

        let dropShadowIndex = 0;
        output = output.replace(/<feDropShadow\b[^>]*\/>/gi, (match) => {
            const blurValues = [
                clampNumber(props.glowPrimaryBlur, 0, 24, 2.2),
                clampNumber(props.glowSecondaryBlur, 0, 24, 5.5),
                clampNumber(props.glowTertiaryBlur, 0, 32, 10.5)
            ];
            const opacityValues = [
                clampOpacity(props.glowPrimaryOpacity),
                clampOpacity(props.glowSecondaryOpacity),
                clampOpacity(props.glowTertiaryOpacity)
            ];
            const index = Math.min(dropShadowIndex, blurValues.length - 1);
            dropShadowIndex += 1;
            let updated = replaceOrInsertAttribute(match, "stdDeviation", blurValues[index]);
            updated = replaceOrInsertAttribute(updated, "flood-color", props.glowColor);
            updated = replaceOrInsertAttribute(updated, "flood-opacity", opacityValues[index]);
            return updated;
        });

        return output;
    }
}
Custom2DValve.SVG_FILE = "valve.svg";

class Custom2DBreakerClosed extends Custom2DSourceSvg {}
Custom2DBreakerClosed.SVG_FILE = "breaker_closed.svg";

class Custom2DBreakerOpen extends Custom2DSourceSvg {}
Custom2DBreakerOpen.SVG_FILE = "breaker_open.svg";

class Custom2DCircuitBreakerModern extends Custom2DSourceSvg {}
Custom2DCircuitBreakerModern.SVG_FILE = "circuit_breaker_modern.svg";

class Custom2DControlValveModern extends Custom2DSourceSvg {}
Custom2DControlValveModern.SVG_FILE = "control_valve_modern.svg";

class Custom2DGensetClosed extends Custom2DSourceSvg {}
Custom2DGensetClosed.SVG_FILE = "genset_closed.svg";

class Custom2DGensetOpen extends Custom2DSourceSvg {}
Custom2DGensetOpen.SVG_FILE = "genset_open.svg";

class Custom2DGensetSync extends Custom2DSourceSvg {}
Custom2DGensetSync.SVG_FILE = "genset_sync.svg";

class Custom2DTelemetryPanel extends Custom2DSourceSvg {}
Custom2DTelemetryPanel.SVG_FILE = "telemetry_panel.svg";

class Custom2DValveMeta {
    getComponentType() {
        return "com.miguelgrillo.custom2d.valve";
    }

    getViewComponent() {
        return Custom2DValve;
    }

    getDefaultSize() {
        return {
            width: 144,
            height: 89
        };
    }

    getPropsReducer(tree) {
        return readCustom2DValveProps(tree);
    }
}

class Custom2DBusbarHTeeDown extends Custom2DSourceSvg {}
Custom2DBusbarHTeeDown.SVG_FILE = "busbar_h_tee_down.svg";

class Custom2DBusbarHTeeRight extends Custom2DSourceSvg {}
Custom2DBusbarHTeeRight.SVG_FILE = "busbar_h_tee_right.svg";

class Custom2DBusbarHTeeUp extends Custom2DSourceSvg {}
Custom2DBusbarHTeeUp.SVG_FILE = "busbar_h_tee_up.svg";

class Custom2DBusbarHTeeLeft extends Custom2DSourceSvg {}
Custom2DBusbarHTeeLeft.SVG_FILE = "busbar_h_tee_left.svg";

class Custom2DBusbarHIntersection extends Custom2DSourceSvg {}
Custom2DBusbarHIntersection.SVG_FILE = "busbar_h_intersection.svg";

class Custom2DBusbarSVTeeDown extends Custom2DSourceSvg {}
Custom2DBusbarSVTeeDown.SVG_FILE = "busbar_sv_tee_down.svg";

class Custom2DBusbarSVTeeRight extends Custom2DSourceSvg {}
Custom2DBusbarSVTeeRight.SVG_FILE = "busbar_sv_tee_right.svg";

class Custom2DBusbarSVTeeUp extends Custom2DSourceSvg {}
Custom2DBusbarSVTeeUp.SVG_FILE = "busbar_sv_tee_up.svg";

class Custom2DBusbarSVTeeLeft extends Custom2DSourceSvg {}
Custom2DBusbarSVTeeLeft.SVG_FILE = "busbar_sv_tee_left.svg";

class Custom2DBusbarSVIntersection extends Custom2DSourceSvg {}
Custom2DBusbarSVIntersection.SVG_FILE = "busbar_sv_intersection.svg";

class IsometricPumpMeta {
    getComponentType() {
        return "com.miguelgrillo.isometric.pump";
    }

    getViewComponent() {
        return IsometricPump;
    }

    getDefaultSize() {
        return {
            width: 170,
            height: 160
        };
    }

    getPropsReducer(tree) {
        return readSharedProps(tree, {
            bodyColor: "#8FA6BF",
            accentColor: "#25C4B8",
            strokeColor: "#415A70",
            label: "Pump-101",
            value: "0%"
        });
    }
}

class IsometricValveMeta {
    getComponentType() {
        return "com.miguelgrillo.isometric.valve";
    }

    getViewComponent() {
        return IsometricValve;
    }

    getDefaultSize() {
        return {
            width: 170,
            height: 155
        };
    }

    getPropsReducer(tree) {
        return readSharedProps(tree, {
            bodyColor: "#9AABC0",
            accentColor: "#F59E0B",
            strokeColor: "#42556A",
            label: "Valve-201",
            value: "Closed"
        });
    }
}

class IsometricTankMeta {
    getComponentType() {
        return "com.miguelgrillo.isometric.tank";
    }

    getViewComponent() {
        return IsometricTank;
    }

    getDefaultSize() {
        return {
            width: 170,
            height: 175
        };
    }

    getPropsReducer(tree) {
        return readSharedProps(tree, {
            bodyColor: "#AFC0CE",
            accentColor: "#38BDF8",
            strokeColor: "#4A5F73",
            label: "Tank-301",
            value: "65%"
        });
    }
}

class IsometricGensetMeta {
    getComponentType() {
        return "com.miguelgrillo.isometric.genset";
    }

    getViewComponent() {
        return IsometricGenset;
    }

    getDefaultSize() {
        return {
            width: 220,
            height: 180
        };
    }

    getPropsReducer(tree) {
        return readGensetProps(tree);
    }
}

class IsometricTestSvgMeta {
    getComponentType() {
        return "com.miguelgrillo.isometric.testsvg";
    }

    getViewComponent() {
        return IsometricTestSvg;
    }

    getDefaultSize() {
        return {
            width: 165,
            height: 145
        };
    }

    getPropsReducer(tree) {
        return readTestSvgProps(tree);
    }
}

class Custom2DBusbarHEnergizedMeta {
    getComponentType() {
        return "com.miguelgrillo.custom2d.busbar_h_energized";
    }

    getViewComponent() {
        return Custom2DBusbarHEnergized;
    }

    getDefaultSize() {
        return {
            width: 300,
            height: 36
        };
    }

    getPropsReducer(tree) {
        return readBusbarHEnergizedProps(tree);
    }
}

class Custom2DBusbarVEnergizedMeta {
    getComponentType() {
        return "com.miguelgrillo.custom2d.busbar_v_energized";
    }

    getViewComponent() {
        return Custom2DBusbarVEnergized;
    }

    getDefaultSize() {
        return {
            width: 36,
            height: 300
        };
    }

    getPropsReducer(tree) {
        return readBusbarVEnergizedProps(tree);
    }
}

class Custom2DBusbarSegmentMeta {
    getComponentType() {
        return "com.miguelgrillo.custom2d.busbar_segment";
    }

    getViewComponent() {
        return Custom2DBusbarSegment;
    }

    getDefaultSize() {
        return {
            width: 300,
            height: 40
        };
    }

    getPropsReducer(tree) {
        return readBusbarSegmentProps(tree);
    }
}

class Custom2DBusbarSegmentVerticalMeta {
    getComponentType() {
        return "com.miguelgrillo.custom2d.busbar_segment_vertical";
    }

    getViewComponent() {
        return Custom2DBusbarSegmentVertical;
    }

    getDefaultSize() {
        return {
            width: 40,
            height: 300
        };
    }

    getPropsReducer(tree) {
        return readBusbarSegmentVerticalProps(tree);
    }
}

class Custom2DSvgMeta {
    constructor(componentType, viewComponent, defaultSize, defaultLabel) {
        this.componentType = componentType;
        this.viewComponent = viewComponent;
        this.defaultSize = defaultSize;
        this.defaultLabel = defaultLabel;
    }

    getComponentType() {
        return this.componentType;
    }

    getViewComponent() {
        return this.viewComponent;
    }

    getDefaultSize() {
        return this.defaultSize;
    }

    getPropsReducer(tree) {
        return readCustom2DSvgProps(tree, this.defaultLabel);
    }
}

class Custom2DModernGensetPanelV7FullPanelMeta {
    getComponentType() {
        return "com.miguelgrillo.custom2d.modern_genset_panel_v7_full_panel";
    }

    getViewComponent() {
        return Custom2DModernGensetPanelV7FullPanel;
    }

    getDefaultSize() {
        return {
            width: 144,
            height: 453
        };
    }

    getPropsReducer(tree) {
        return readCustom2DModernGensetPanelProps(tree);
    }
}

class Custom2DLvBreakerScreenFullPageMeta {
    getComponentType() {
        return "com.miguelgrillo.custom2d.lv_breaker_screen_full_page";
    }

    getViewComponent() {
        return Custom2DLvBreakerScreenFullPage;
    }

    getDefaultSize() {
        return {
            width: 480,
            height: 300
        };
    }

    getPropsReducer(tree) {
        return readCustom2DLvBreakerScreenProps(tree);
    }
}

class Custom2DMvGensetScreenMainMeta {
    getComponentType() {
        return "com.miguelgrillo.custom2d.mv_genset_screen_main";
    }

    getViewComponent() {
        return Custom2DMvGensetScreenMain;
    }

    getDefaultSize() {
        return {
            width: 480,
            height: 241
        };
    }

    getPropsReducer(tree) {
        return readCustom2DMvGensetScreenMainProps(tree);
    }
}

ComponentRegistry.register(new IsometricPumpMeta());
ComponentRegistry.register(new IsometricValveMeta());
ComponentRegistry.register(new IsometricTankMeta());
ComponentRegistry.register(new IsometricGensetMeta());
ComponentRegistry.register(new IsometricTestSvgMeta());
ComponentRegistry.register(new Custom2DBusbarHEnergizedMeta());
ComponentRegistry.register(new Custom2DBusbarVEnergizedMeta());
ComponentRegistry.register(new Custom2DBusbarSegmentMeta());
ComponentRegistry.register(new Custom2DBusbarSegmentVerticalMeta());
ComponentRegistry.register(new Custom2DModernGensetPanelV7FullPanelMeta());
ComponentRegistry.register(new Custom2DLvBreakerScreenFullPageMeta());
ComponentRegistry.register(new Custom2DMvGensetScreenMainMeta());
ComponentRegistry.register(new Custom2DValveMeta());
ComponentRegistry.register(new Custom2DSvgMeta(
    "com.miguelgrillo.custom2d.breaker_closed",
    Custom2DBreakerClosed,
    { width: 80, height: 120 },
    "Breaker Closed"
));
ComponentRegistry.register(new Custom2DSvgMeta(
    "com.miguelgrillo.custom2d.breaker_open",
    Custom2DBreakerOpen,
    { width: 80, height: 120 },
    "Breaker Open"
));
ComponentRegistry.register(new Custom2DSvgMeta(
    "com.miguelgrillo.custom2d.circuit_breaker_modern",
    Custom2DCircuitBreakerModern,
    { width: 190, height: 250 },
    "Circuit Breaker Modern"
));
ComponentRegistry.register(new Custom2DSvgMeta(
    "com.miguelgrillo.custom2d.control_valve_modern",
    Custom2DControlValveModern,
    { width: 180, height: 280 },
    "Control Valve Modern"
));
ComponentRegistry.register(new Custom2DSvgMeta(
    "com.miguelgrillo.custom2d.genset_closed",
    Custom2DGensetClosed,
    { width: 96, height: 96 },
    "Genset Closed"
));
ComponentRegistry.register(new Custom2DSvgMeta(
    "com.miguelgrillo.custom2d.genset_open",
    Custom2DGensetOpen,
    { width: 96, height: 96 },
    "Genset Open"
));
ComponentRegistry.register(new Custom2DSvgMeta(
    "com.miguelgrillo.custom2d.genset_sync",
    Custom2DGensetSync,
    { width: 96, height: 96 },
    "Genset Sync"
));
ComponentRegistry.register(new Custom2DSvgMeta(
    "com.miguelgrillo.custom2d.telemetry_panel",
    Custom2DTelemetryPanel,
    { width: 200, height: 150 },
    "Telemetry Panel"
));
ComponentRegistry.register(new Custom2DSvgMeta(
    "com.miguelgrillo.custom2d.busbar_h_tee_down",
    Custom2DBusbarHTeeDown,
    { width: 96, height: 96 },
    "Busbar H Tee Down"
));
ComponentRegistry.register(new Custom2DSvgMeta(
    "com.miguelgrillo.custom2d.busbar_h_tee_right",
    Custom2DBusbarHTeeRight,
    { width: 96, height: 96 },
    "Busbar H Tee Right"
));
ComponentRegistry.register(new Custom2DSvgMeta(
    "com.miguelgrillo.custom2d.busbar_h_tee_up",
    Custom2DBusbarHTeeUp,
    { width: 96, height: 96 },
    "Busbar H Tee Up"
));
ComponentRegistry.register(new Custom2DSvgMeta(
    "com.miguelgrillo.custom2d.busbar_h_tee_left",
    Custom2DBusbarHTeeLeft,
    { width: 96, height: 96 },
    "Busbar H Tee Left"
));
ComponentRegistry.register(new Custom2DSvgMeta(
    "com.miguelgrillo.custom2d.busbar_h_intersection",
    Custom2DBusbarHIntersection,
    { width: 96, height: 96 },
    "Busbar H Intersection"
));
ComponentRegistry.register(new Custom2DSvgMeta(
    "com.miguelgrillo.custom2d.busbar_sv_tee_down",
    Custom2DBusbarSVTeeDown,
    { width: 96, height: 96 },
    "Busbar SV Tee Down"
));
ComponentRegistry.register(new Custom2DSvgMeta(
    "com.miguelgrillo.custom2d.busbar_sv_tee_right",
    Custom2DBusbarSVTeeRight,
    { width: 96, height: 96 },
    "Busbar SV Tee Right"
));
ComponentRegistry.register(new Custom2DSvgMeta(
    "com.miguelgrillo.custom2d.busbar_sv_tee_up",
    Custom2DBusbarSVTeeUp,
    { width: 96, height: 96 },
    "Busbar SV Tee Up"
));
ComponentRegistry.register(new Custom2DSvgMeta(
    "com.miguelgrillo.custom2d.busbar_sv_tee_left",
    Custom2DBusbarSVTeeLeft,
    { width: 96, height: 96 },
    "Busbar SV Tee Left"
));
ComponentRegistry.register(new Custom2DSvgMeta(
    "com.miguelgrillo.custom2d.busbar_sv_intersection",
    Custom2DBusbarSVIntersection,
    { width: 96, height: 96 },
    "Busbar SV Intersection"
));
