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

function readCustom2DGensetSymbolProps(tree, defaultLabel, defaults) {
    const base = readCustom2DSvgProps(tree, defaultLabel);
    const lineColor = tree.readString("lineColor", defaults.lineColor || "#10b981");
    const topLineColor = tree.readString("topLineColor", defaults.topLineColor || lineColor);
    const breakerColor = tree.readString("breakerColor", defaults.breakerColor || defaults.symbolFillColor || lineColor);
    const lowerLineColor = tree.readString("lowerLineColor", defaults.lowerLineColor || lineColor);
    const generatorColor = tree.readString("generatorColor", defaults.generatorColor || defaults.generatorFillColor || lineColor);
    const symbolFillColor = tree.readString("symbolFillColor", defaults.symbolFillColor || breakerColor);
    const symbolFillOpacity = tree.readNumber("symbolFillOpacity", defaults.symbolFillOpacity);
    const generatorFillColor = tree.readString("generatorFillColor", defaults.generatorFillColor || generatorColor);
    const glowColor = tree.readString("glowColor", defaults.glowColor || generatorColor || lineColor);
    const glowIntensity = tree.readNumber("glowIntensity", defaults.glowIntensity || 1.0);
    const explicitColorOverrides = {
        "#10b981": lineColor,
        "rgba(16, 185, 129, 0.02)": colorToRgbaString(symbolFillColor, symbolFillOpacity, lineColor),
        "rgba(16,185,129,0.02)": colorToRgbaString(symbolFillColor, symbolFillOpacity, lineColor)
    };

    return Object.assign({}, base, {
        colorOverrides: mergeOverrideMaps(explicitColorOverrides, base.colorOverrides),
        lineColor: lineColor,
        topLineColor: topLineColor,
        breakerColor: breakerColor,
        lowerLineColor: lowerLineColor,
        generatorColor: generatorColor,
        symbolFillColor: symbolFillColor,
        symbolFillOpacity: symbolFillOpacity,
        generatorFillColor: generatorFillColor,
        generatorFillOpacity: tree.readNumber("generatorFillOpacity", defaults.generatorFillOpacity),
        glowColor: glowColor,
        glowIntensity: glowIntensity,
        chainGlowPrimaryBlur: tree.readNumber("chainGlowPrimaryBlur", defaults.chainGlowPrimaryBlur),
        chainGlowSecondaryBlur: tree.readNumber("chainGlowSecondaryBlur", defaults.chainGlowSecondaryBlur),
        chainGlowTertiaryBlur: tree.readNumber("chainGlowTertiaryBlur", defaults.chainGlowTertiaryBlur),
        chainGlowPrimaryOpacity: tree.readNumber("chainGlowPrimaryOpacity", defaults.chainGlowPrimaryOpacity),
        chainGlowSecondaryOpacity: tree.readNumber("chainGlowSecondaryOpacity", defaults.chainGlowSecondaryOpacity),
        chainGlowTertiaryOpacity: tree.readNumber("chainGlowTertiaryOpacity", defaults.chainGlowTertiaryOpacity),
        circleGlowPrimaryBlur: tree.readNumber("circleGlowPrimaryBlur", defaults.circleGlowPrimaryBlur),
        circleGlowSecondaryBlur: tree.readNumber("circleGlowSecondaryBlur", defaults.circleGlowSecondaryBlur),
        circleGlowTertiaryBlur: tree.readNumber("circleGlowTertiaryBlur", defaults.circleGlowTertiaryBlur),
        circleGlowPrimaryOpacity: tree.readNumber("circleGlowPrimaryOpacity", defaults.circleGlowPrimaryOpacity),
        circleGlowSecondaryOpacity: tree.readNumber("circleGlowSecondaryOpacity", defaults.circleGlowSecondaryOpacity),
        circleGlowTertiaryOpacity: tree.readNumber("circleGlowTertiaryOpacity", defaults.circleGlowTertiaryOpacity)
    });
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

function readCustom2DValveProps(tree, defaultLabel) {
    const base = readCustom2DSvgProps(tree, defaultLabel || "Valve");
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

function readCustom2DBreakerStandaloneProps(tree, defaultLabel) {
    const base = readCustom2DSvgProps(tree, defaultLabel || "Breaker Standalone");
    const strokeColor = tree.readString("strokeColor", "#56c89b");
    const textColor = tree.readString("textColor", "#eef2f7");
    const glowColor = tree.readString("glowColor", strokeColor);
    const explicitColorOverrides = {
        "#56c89b": strokeColor,
        "#eef2f7": textColor
    };
    const explicitTextOverrides = {
        "52I": tree.readString("displayText", "52I")
    };

    return Object.assign({}, base, {
        colorOverrides: mergeOverrideMaps(explicitColorOverrides, base.colorOverrides),
        textOverrides: mergeOverrideMaps(explicitTextOverrides, base.textOverrides),
        strokeColor: strokeColor,
        textColor: textColor,
        glowColor: glowColor,
        glowOpacity: tree.readNumber("glowOpacity", 0.18),
        glowBlur: tree.readNumber("glowBlur", 6.0),
        textFontSize: tree.readNumber("textFontSize", 40.0),
        fontFamily: tree.readString("fontFamily", "Segoe UI, sans-serif")
    });
}

function readCustom2DDosingValveGaugeProps(tree) {
    return {
        value: tree.readNumber("value", 59.0),
        minValue: tree.readNumber("minValue", 0.0),
        maxValue: tree.readNumber("maxValue", 100.0),
        valueText: tree.readString("valueText", ""),
        valueDecimals: tree.readNumber("valueDecimals", 0),
        unitText: tree.readString("unitText", "%"),
        titleLine1Text: tree.readString("titleLine1Text", "DOSING VALVE"),
        titleLine2Text: tree.readString("titleLine2Text", "POSITION"),
        startAngle: tree.readNumber("startAngle", 135.0),
        endAngle: tree.readNumber("endAngle", 405.0),
        majorStep: tree.readNumber("majorStep", 10.0),
        minorDivisions: tree.readNumber("minorDivisions", 5),
        dangerThreshold: tree.readNumber("dangerThreshold", 90.0),
        showTrackArc: !!tree.read("showTrackArc", true),
        showProgressArc: !!tree.read("showProgressArc", true),
        showNeedle: !!tree.read("showNeedle", true),
        showDangerZoneTint: !!tree.read("showDangerZoneTint", true),
        showMajorTicks: !!tree.read("showMajorTicks", true),
        showMinorTicks: !!tree.read("showMinorTicks", true),
        showOuterLabels: !!tree.read("showOuterLabels", true),
        showCenterValue: !!tree.read("showCenterValue", true),
        showCenterUnit: !!tree.read("showCenterUnit", true),
        showTitleText: !!tree.read("showTitleText", true),
        preserveAspectRatio: tree.readString("preserveAspectRatio", "xMidYMid meet"),
        fontFamily: tree.readString("fontFamily", "Rajdhani, Segoe UI, sans-serif"),
        outerLabelFontSize: tree.readNumber("outerLabelFontSize", 22.0),
        valueFontSize: tree.readNumber("valueFontSize", 80.0),
        unitFontSize: tree.readNumber("unitFontSize", 34.0),
        titleFontSize: tree.readNumber("titleFontSize", 17.0),
        titleLetterSpacing: tree.readNumber("titleLetterSpacing", 5.0),
        bezelInnerColor: tree.readString("bezelInnerColor", "#2a3545"),
        bezelMidColor: tree.readString("bezelMidColor", "#4a5a6a"),
        bezelOuterColor: tree.readString("bezelOuterColor", "#1e2a38"),
        faceInnerColor: tree.readString("faceInnerColor", "#1e2e3e"),
        faceMidColor: tree.readString("faceMidColor", "#162535"),
        faceOuterColor: tree.readString("faceOuterColor", "#0e1a28"),
        innerRingColor: tree.readString("innerRingColor", "#507896"),
        innerRingOpacity: tree.readNumber("innerRingOpacity", 0.2),
        separatorColor: tree.readString("separatorColor", "#3c5a78"),
        separatorOpacity: tree.readNumber("separatorOpacity", 0.18),
        trackColor: tree.readString("trackColor", "#3c6482"),
        trackOpacity: tree.readNumber("trackOpacity", 0.1),
        progressColor: tree.readString("progressColor", "#1ed2ff"),
        progressOpacity: tree.readNumber("progressOpacity", 0.85),
        progressHaloColor: tree.readString("progressHaloColor", "#32dcff"),
        progressHaloOpacity: tree.readNumber("progressHaloOpacity", 0.2),
        progressTipColor: tree.readString("progressTipColor", "#78f5ff"),
        progressTipOpacity: tree.readNumber("progressTipOpacity", 0.5),
        progressStrokeWidth: tree.readNumber("progressStrokeWidth", 7.0),
        progressHaloWidth: tree.readNumber("progressHaloWidth", 22.0),
        progressTipWidth: tree.readNumber("progressTipWidth", 16.0),
        majorTickColor: tree.readString("majorTickColor", "#c8dcf0"),
        majorTickOpacity: tree.readNumber("majorTickOpacity", 0.65),
        majorDangerTickColor: tree.readString("majorDangerTickColor", "#ff503c"),
        majorDangerTickOpacity: tree.readNumber("majorDangerTickOpacity", 0.85),
        minorTickColor: tree.readString("minorTickColor", "#c8dcf0"),
        minorTickOpacity: tree.readNumber("minorTickOpacity", 0.3),
        minorDangerTickColor: tree.readString("minorDangerTickColor", "#ff503c"),
        minorDangerTickOpacity: tree.readNumber("minorDangerTickOpacity", 0.5),
        outerLabelColor: tree.readString("outerLabelColor", "#c8dcf0"),
        outerLabelOpacity: tree.readNumber("outerLabelOpacity", 0.7),
        dangerLabelColor: tree.readString("dangerLabelColor", "#ff6450"),
        dangerLabelOpacity: tree.readNumber("dangerLabelOpacity", 0.85),
        valueColor: tree.readString("valueColor", "#e6f0fa"),
        valueOpacity: tree.readNumber("valueOpacity", 0.95),
        unitColor: tree.readString("unitColor", "#b4c8dc"),
        unitOpacity: tree.readNumber("unitOpacity", 0.55),
        titleColor: tree.readString("titleColor", "#b4c8dc"),
        titleOpacity: tree.readNumber("titleOpacity", 0.45),
        needleBaseColor: tree.readString("needleBaseColor", "#dc4628"),
        needleMidColor: tree.readString("needleMidColor", "#ff6432"),
        needleTipColor: tree.readString("needleTipColor", "#ffb478"),
        needleHighlightColor: tree.readString("needleHighlightColor", "#ff9650"),
        needleHighlightOpacity: tree.readNumber("needleHighlightOpacity", 0.45),
        hubCenterColor: tree.readString("hubCenterColor", "#3a4a5c"),
        hubMidColor: tree.readString("hubMidColor", "#2a3a4c"),
        hubOuterColor: tree.readString("hubOuterColor", "#1a2a3c"),
        hubStrokeColor: tree.readString("hubStrokeColor", "#64a0c8"),
        hubStrokeOpacity: tree.readNumber("hubStrokeOpacity", 0.25),
        dangerZoneColor: tree.readString("dangerZoneColor", "#c8281e"),
        dangerZoneOpacity: tree.readNumber("dangerZoneOpacity", 0.05),
        showLabel: !!tree.read("showLabel", false),
        label: tree.readString("label", "Dosing Valve Gauge"),
        labelColor: tree.readString("labelColor", "#1f2937"),
        style: tree.read("style", {})
    };
}

function readCustom2DDosingValveHalfGaugeProps(tree) {
    const base = readCustom2DSvgProps(tree, "Dosing Valve Half Gauge");
    return Object.assign({}, base, {
        showOverlay: !!tree.read("showOverlay", true),
        showValue: !!tree.read("showValue", true),
        showUnit: !!tree.read("showUnit", true),
        showTitleText: !!tree.read("showTitleText", true),
        value: tree.readNumber("value", 74.0),
        valueText: tree.readString("valueText", ""),
        valueDecimals: tree.readNumber("valueDecimals", 0),
        unitText: tree.readString("unitText", "%"),
        titleLine1Text: tree.readString("titleLine1Text", "DOSING VALVE"),
        titleLine2Text: tree.readString("titleLine2Text", "POSITION"),
        fontFamily: tree.readString("fontFamily", "Rajdhani, Segoe UI, sans-serif"),
        valueFontSize: tree.readNumber("valueFontSize", 80.0),
        unitFontSize: tree.readNumber("unitFontSize", 34.0),
        titleFontSize: tree.readNumber("titleFontSize", 17.0),
        titleLetterSpacing: tree.readNumber("titleLetterSpacing", 5.0),
        valueGap: tree.readNumber("valueGap", 6.0),
        valueRowOffsetX: tree.readNumber("valueRowOffsetX", 18.0),
        overlayBottomOffset: tree.readNumber("overlayBottomOffset", 38.0),
        overlayHorizontalOffset: tree.readNumber("overlayHorizontalOffset", 0.0),
        overlayMaskColor: tree.readString("overlayMaskColor", "rgba(14,26,40,0.96)"),
        overlayMaskWidth: tree.readNumber("overlayMaskWidth", 260.0),
        overlayMaskHeight: tree.readNumber("overlayMaskHeight", 122.0),
        overlayMaskRadius: tree.readNumber("overlayMaskRadius", 110.0),
        overlayMaskBlur: tree.readNumber("overlayMaskBlur", 24.0),
        valueColor: tree.readString("valueColor", "#e6f0fa"),
        valueOpacity: tree.readNumber("valueOpacity", 0.95),
        unitColor: tree.readString("unitColor", "#b4c8dc"),
        unitOpacity: tree.readNumber("unitOpacity", 0.55),
        titleColor: tree.readString("titleColor", "#b4c8dc"),
        titleOpacity: tree.readNumber("titleOpacity", 0.45)
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

function parseColorChannels(color) {
    if (typeof color !== "string") {
        return null;
    }
    const value = color.trim();
    const hexMatch = value.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
    if (hexMatch) {
        const hex = hexMatch[1];
        if (hex.length === 3) {
            return {
                r: parseInt(hex[0] + hex[0], 16),
                g: parseInt(hex[1] + hex[1], 16),
                b: parseInt(hex[2] + hex[2], 16)
            };
        }
        return {
            r: parseInt(hex.slice(0, 2), 16),
            g: parseInt(hex.slice(2, 4), 16),
            b: parseInt(hex.slice(4, 6), 16)
        };
    }

    const rgbMatch = value.match(/^rgba?\(([^)]+)\)$/i);
    if (!rgbMatch) {
        return null;
    }

    const channels = rgbMatch[1].split(",").map((entry) => Number(entry.trim()));
    if (channels.length < 3 || channels.slice(0, 3).some((entry) => Number.isNaN(entry))) {
        return null;
    }

    return {
        r: clampNumber(channels[0], 0, 255, 16),
        g: clampNumber(channels[1], 0, 255, 185),
        b: clampNumber(channels[2], 0, 255, 129)
    };
}

function colorToRgbaString(color, opacity, fallbackColor) {
    const channels = parseColorChannels(color) || parseColorChannels(fallbackColor) || { r: 16, g: 185, b: 129 };
    return `rgba(${channels.r},${channels.g},${channels.b},${clampOpacity(opacity)})`;
}

function toRadians(degrees) {
    return Number(degrees || 0) * Math.PI / 180;
}

function polarPoint(cx, cy, radius, degrees) {
    const radians = toRadians(degrees);
    return {
        x: cx + radius * Math.cos(radians),
        y: cy + radius * Math.sin(radians)
    };
}

function describeArc(cx, cy, radius, startDegrees, endDegrees) {
    const start = polarPoint(cx, cy, radius, startDegrees);
    const end = polarPoint(cx, cy, radius, endDegrees);
    const largeArc = Math.abs(endDegrees - startDegrees) > 180 ? 1 : 0;
    const sweep = endDegrees >= startDegrees ? 1 : 0;
    return `M ${start.x.toFixed(3)} ${start.y.toFixed(3)} A ${radius.toFixed(3)} ${radius.toFixed(3)} 0 ${largeArc} ${sweep} ${end.x.toFixed(3)} ${end.y.toFixed(3)}`;
}

function describeSector(cx, cy, radius, startDegrees, endDegrees) {
    const start = polarPoint(cx, cy, radius, startDegrees);
    const end = polarPoint(cx, cy, radius, endDegrees);
    const largeArc = Math.abs(endDegrees - startDegrees) > 180 ? 1 : 0;
    const sweep = endDegrees >= startDegrees ? 1 : 0;
    return `M ${cx.toFixed(3)} ${cy.toFixed(3)} L ${start.x.toFixed(3)} ${start.y.toFixed(3)} A ${radius.toFixed(3)} ${radius.toFixed(3)} 0 ${largeArc} ${sweep} ${end.x.toFixed(3)} ${end.y.toFixed(3)} Z`;
}

function formatGaugeValue(value, decimals) {
    const safeValue = Number.isFinite(Number(value)) ? Number(value) : 0;
    const safeDecimals = Math.round(clampNumber(decimals, 0, 3, 0));
    return safeValue.toFixed(safeDecimals);
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

function replaceFilterBlock(markup, filterId, blurValues, opacityValues, glowColor) {
    const blockRegex = new RegExp(`<filter\\b[^>]*id="${escapeRegExp(filterId)}"[^>]*>[\\s\\S]*?</filter>`, "i");
    const blockMatch = markup.match(blockRegex);
    if (!blockMatch || !blockMatch[0]) {
        return markup;
    }

    let dropShadowIndex = 0;
    const updatedBlock = blockMatch[0].replace(/<feDropShadow\b[^>]*\/>/gi, (shadowMarkup) => {
        const index = Math.min(dropShadowIndex, blurValues.length - 1);
        dropShadowIndex += 1;
        let updated = replaceOrInsertAttribute(shadowMarkup, "stdDeviation", clampNumber(blurValues[index], 0, 160, blurValues[index]));
        updated = replaceOrInsertAttribute(updated, "flood-color", glowColor);
        updated = replaceOrInsertAttribute(updated, "flood-opacity", clampOpacity(opacityValues[index]));
        return updated;
    });

    return markup.replace(blockMatch[0], updatedBlock);
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

class Custom2DGensetSymbol extends Custom2DSourceSvg {
    transformSvg(rawSvg, props, scopeKey) {
        let output = transformCustom2DSvg(rawSvg, props, scopeKey);

        const glowIntensity = clampNumber(props.glowIntensity, 0, 4, 1);
        const scaleBlur = (value, fallback) => clampNumber(value, 0, 160, fallback) * glowIntensity;
        const scaleOpacity = (value) => clampOpacity(value) * glowIntensity;
        const symbolFillRgba = colorToRgbaString(props.symbolFillColor, props.symbolFillOpacity, props.lineColor);
        const chainGlowRgbaPrimary = colorToRgbaString(props.glowColor, scaleOpacity(props.chainGlowPrimaryOpacity), props.lineColor);
        const chainGlowRgbaSecondary = colorToRgbaString(props.glowColor, scaleOpacity(props.chainGlowSecondaryOpacity), props.lineColor);
        const chainGlowRgbaTertiary = colorToRgbaString(props.glowColor, scaleOpacity(props.chainGlowTertiaryOpacity), props.lineColor);
        const circleGlowRgbaPrimary = colorToRgbaString(props.glowColor, scaleOpacity(props.circleGlowPrimaryOpacity), props.lineColor);
        const circleGlowRgbaSecondary = colorToRgbaString(props.glowColor, scaleOpacity(props.circleGlowSecondaryOpacity), props.lineColor);
        const circleGlowRgbaTertiary = colorToRgbaString(props.glowColor, scaleOpacity(props.circleGlowTertiaryOpacity), props.lineColor);
        const noGlowFilter = glowIntensity <= 0 ? "filter: none;" : null;

        output = output.replace(/fill:\s*rgba\(16,\s*185,\s*129,\s*0\.02\)/gi, `fill: ${symbolFillRgba}`);
        output = output.replace(/fill="rgba\(16,\s*185,\s*129,\s*0\.02\)"/gi, `fill="${symbolFillRgba}"`);
        output = output.replace(/(\.chain-stroke\s*\{[\s\S]*?stroke:\s*)#[0-9a-f]{3,8}/i, `$1${props.topLineColor}`);
        output = output.replace(/(\.chain-fill\s*\{[\s\S]*?fill:\s*)[^;\n]+/i, `$1${symbolFillRgba}`);
        output = output.replace(/(\.chain-fill\s*\{[\s\S]*?stroke:\s*)#[0-9a-f]{3,8}/i, `$1${props.breakerColor}`);
        output = output.replace(/(\.gen-line\s*\{[\s\S]*?stroke:\s*)#[0-9a-f]{3,8}/i, `$1${props.lowerLineColor}`);
        output = output.replace(/(\.gen-circle(?:-el)?\s*\{[\s\S]*?stroke:\s*)#[0-9a-f]{3,8}/i, `$1${props.generatorColor}`);
        output = output.replace(/(\.sine-wave\s*\{[\s\S]*?stroke:\s*)#[0-9a-f]{3,8}/i, `$1${props.generatorColor}`);
        output = output.replace(/(<g\b[^>]*filter="url\(#tx3-genset2-chain-glow\)"[^>]*\bstroke=")[^"]*(")/i, `$1${props.topLineColor}$2`);
        output = output.replace(/(<g\b[^>]*filter="url\(#tx3-genset2-chain-glow\)"[^>]*\bfill=")[^"]*(")/i, `$1${symbolFillRgba}$2`);
        output = output.replace(/(<g\b[^>]*filter="url\(#tx3-genset2-chain-glow\)"\s+fill=")[^"]*("[^>]*>\s*<rect\b)/i, `$1${props.lowerLineColor}$2`);
        output = output.replace(/(<circle\b[^>]*\bstroke=")[^"]*("[^>]*filter="url\(#tx3-genset2-circle-glow\)")/i, `$1${props.generatorColor}$2`);
        output = output.replace(/(<path\b[^>]*\bstroke=")[^"]*("[^>]*filter="url\(#tx3-genset2-circle-glow\)")/i, `$1${props.generatorColor}$2`);
        if (noGlowFilter) {
            output = output.replace(/filter:\s*drop-shadow\([^;]+;/gi, noGlowFilter);
            output = output.replace(/\sfilter="url\(#tx3-genset2-(?:chain|circle)-glow\)"/gi, "");
        }

        output = output.replace(
            /drop-shadow\(0 0 15px rgba\(16,185,129,0\.8\)\)/gi,
            `drop-shadow(0 0 ${scaleBlur(props.chainGlowPrimaryBlur, 15)}px ${chainGlowRgbaPrimary})`
        );
        output = output.replace(
            /drop-shadow\(0 0 30px rgba\(16,185,129,0\.6\)\)/gi,
            `drop-shadow(0 0 ${scaleBlur(props.chainGlowSecondaryBlur, 30)}px ${chainGlowRgbaSecondary})`
        );
        output = output.replace(
            /drop-shadow\(0 0 60px rgba\(16,185,129,0\.4\)\)/gi,
            `drop-shadow(0 0 ${scaleBlur(props.chainGlowTertiaryBlur, 60)}px ${chainGlowRgbaTertiary})`
        );
        output = output.replace(
            /drop-shadow\(0 0 8px\s+rgba\(16,185,129,0\.5\)\)/gi,
            `drop-shadow(0 0 ${scaleBlur(props.circleGlowPrimaryBlur, 8)}px ${circleGlowRgbaPrimary})`
        );
        output = output.replace(
            /drop-shadow\(0 0 15px rgba\(16,185,129,0\.3\)\)/gi,
            `drop-shadow(0 0 ${scaleBlur(props.circleGlowSecondaryBlur, 15)}px ${circleGlowRgbaSecondary})`
        );
        output = output.replace(
            /drop-shadow\(0 0 30px rgba\(16,185,129,0\.15\)\)/gi,
            `drop-shadow(0 0 ${scaleBlur(props.circleGlowTertiaryBlur, 30)}px ${circleGlowRgbaTertiary})`
        );

        output = replaceFilterBlock(output, "tx3-genset2-chain-glow", [
            scaleBlur(props.chainGlowPrimaryBlur, 2.5),
            scaleBlur(props.chainGlowSecondaryBlur, 5),
            scaleBlur(props.chainGlowTertiaryBlur, 10)
        ], [
            scaleOpacity(props.chainGlowPrimaryOpacity),
            scaleOpacity(props.chainGlowSecondaryOpacity),
            scaleOpacity(props.chainGlowTertiaryOpacity)
        ], props.glowColor);

        output = replaceFilterBlock(output, "tx3-genset2-circle-glow", [
            scaleBlur(props.circleGlowPrimaryBlur, 1.5),
            scaleBlur(props.circleGlowSecondaryBlur, 3),
            scaleBlur(props.circleGlowTertiaryBlur, 6)
        ], [
            scaleOpacity(props.circleGlowPrimaryOpacity),
            scaleOpacity(props.circleGlowSecondaryOpacity),
            scaleOpacity(props.circleGlowTertiaryOpacity)
        ], props.glowColor);

        output = output.replace(
            /(<radialGradient\b[\s\S]*?<stop\b[^>]*\bstop-color=")[^"]*(")/i,
            `$1${props.generatorFillColor}$2`
        );
        output = output.replace(
            /(<radialGradient\b[\s\S]*?<stop\b[^>]*\bstop-opacity=")[^"]*(")/i,
            (full, start, end) => `${start}${clampOpacity(props.generatorFillOpacity)}${end}`
        );
        output = output.replace(
            /(<radialGradient\b[\s\S]*?<stop\b[^>]*\/>\s*<stop\b[^>]*\bstop-color=")[^"]*(")/i,
            `$1${props.generatorFillColor}$2`
        );

        return output;
    }
}
Custom2DGensetSymbol.SVG_FILE = "genset-sld.svg";

class Custom2DGensetSld extends Custom2DGensetSymbol {}
Custom2DGensetSld.SVG_FILE = "genset-sld.svg";

class Custom2DGenset2 extends Custom2DGensetSymbol {}
Custom2DGenset2.SVG_FILE = "genset_2.svg";

class Custom2DGensetSldS32 extends Custom2DGensetSymbol {}
Custom2DGensetSldS32.SVG_FILE = "genset-sld-s32.svg";

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

class Custom2DThreeWayControlValveRev2 extends Custom2DValve {}
Custom2DThreeWayControlValveRev2.SVG_FILE = "3-way-control-valve-rev2.svg";

class Custom2DBreakerStandalone extends Custom2DSourceSvg {
    transformSvg(rawSvg, props, scopeKey) {
        let output = transformCustom2DSvg(rawSvg, props, scopeKey);

        output = output.replace(/(<feDropShadow\b[^>]*\bstdDeviation=")[^"]*(")/i, (full, start, end) => {
            return `${start}${clampNumber(props.glowBlur, 0, 24, 6)}${end}`;
        });
        output = output.replace(/(<feDropShadow\b[^>]*\bflood-color=")[^"]*(")/i, `$1${props.glowColor}$2`);
        output = output.replace(/(<feDropShadow\b[^>]*\bflood-opacity=")[^"]*(")/i, (full, start, end) => {
            return `${start}${clampOpacity(props.glowOpacity)}${end}`;
        });
        output = output.replace(/(font-size:\s*)[0-9.]+px(?=\s*;)/i, (full, start) => {
            return `${start}${clampNumber(props.textFontSize, 8, 96, 40)}px`;
        });
        output = output.replace(/(font-family:\s*)[^;]+(?=\s*;)/i, `$1${props.fontFamily}`);

        return output;
    }
}
Custom2DBreakerStandalone.SVG_FILE = "breaker-standalone.svg";

class Custom2DPump extends Custom2DValve {}
Custom2DPump.SVG_FILE = "pump.svg";

class Custom2DTransformer extends Custom2DValve {}
Custom2DTransformer.SVG_FILE = "transformer.svg";

class Custom2DDosingValveGauge extends Component {
    render() {
        const { props, emit, store } = this.props;
        const viewBoxSize = 520;
        const cx = 260;
        const cy = 260;
        const outerRadius = 240;
        const faceRadius = 224;
        const separatorInnerRadius = 95;
        const separatorOuterRadius = 200;
        const arcRadius = 217.5;
        const tickOuterRadius = 209;
        const majorTickLength = 16;
        const minorTickLength = 8;
        const labelRadius = 243;
        const needleLength = 170;
        const needleTailLength = 27.5;

        const minValue = Number.isFinite(Number(props.minValue)) ? Number(props.minValue) : 0;
        let maxValue = Number.isFinite(Number(props.maxValue)) ? Number(props.maxValue) : 100;
        if (maxValue <= minValue) {
            maxValue = minValue + 1;
        }
        const value = clampNumber(props.value, minValue, maxValue, minValue);
        const startAngle = Number.isFinite(Number(props.startAngle)) ? Number(props.startAngle) : 135;
        const endAngle = Number.isFinite(Number(props.endAngle)) ? Number(props.endAngle) : 405;
        const majorStep = Math.max(1, Number(props.majorStep) || 10);
        const minorDivisions = Math.max(1, Math.round(Number(props.minorDivisions) || 5));
        const dangerThreshold = clampNumber(props.dangerThreshold, minValue, maxValue, maxValue);

        const valueToAngle = (inputValue) => {
            const ratio = (inputValue - minValue) / (maxValue - minValue);
            return startAngle + ratio * (endAngle - startAngle);
        };

        const currentAngle = valueToAngle(value);
        const dangerStartAngle = valueToAngle(dangerThreshold);
        const displayValue = props.valueText && String(props.valueText).length
            ? String(props.valueText)
            : formatGaugeValue(value, props.valueDecimals);

        const majorValues = [];
        for (let tickValue = minValue, guard = 0; tickValue <= maxValue + 0.0001 && guard < 200; tickValue += majorStep, guard += 1) {
            majorValues.push(Math.min(tickValue, maxValue));
        }
        if (!majorValues.length || Math.abs(majorValues[majorValues.length - 1] - maxValue) > 0.0001) {
            majorValues.push(maxValue);
        }

        const separatorLines = majorValues.map((tickValue, index) => {
            const angle = valueToAngle(tickValue);
            const innerPoint = polarPoint(cx, cy, separatorInnerRadius, angle);
            const outerPoint = polarPoint(cx, cy, separatorOuterRadius, angle);
            return React.createElement("line", {
                key: `separator-${index}`,
                x1: innerPoint.x,
                y1: innerPoint.y,
                x2: outerPoint.x,
                y2: outerPoint.y,
                stroke: props.separatorColor,
                strokeOpacity: clampOpacity(props.separatorOpacity),
                strokeWidth: 1.5
            });
        });

        const tickElements = [];
        const labelElements = [];
        majorValues.forEach((tickValue, index) => {
            const angle = valueToAngle(tickValue);
            const isDanger = tickValue >= dangerThreshold;
            const majorTickStart = polarPoint(cx, cy, tickOuterRadius, angle);
            const majorTickEnd = polarPoint(cx, cy, tickOuterRadius - majorTickLength, angle);

            if (props.showMajorTicks) {
                tickElements.push(React.createElement("line", {
                    key: `major-tick-${index}`,
                    x1: majorTickStart.x,
                    y1: majorTickStart.y,
                    x2: majorTickEnd.x,
                    y2: majorTickEnd.y,
                    stroke: isDanger ? props.majorDangerTickColor : props.majorTickColor,
                    strokeOpacity: isDanger ? clampOpacity(props.majorDangerTickOpacity) : clampOpacity(props.majorTickOpacity),
                    strokeWidth: isDanger ? 3 : 2.5,
                    strokeLinecap: "round"
                }));
            }

            if (props.showOuterLabels) {
                const labelPoint = polarPoint(cx, cy, labelRadius, angle);
                labelElements.push(React.createElement("text", {
                    key: `outer-label-${index}`,
                    x: labelPoint.x,
                    y: labelPoint.y,
                    textAnchor: "middle",
                    dominantBaseline: "middle",
                    fontFamily: props.fontFamily,
                    fontSize: clampNumber(props.outerLabelFontSize, 8, 48, 22),
                    fontWeight: 600,
                    fill: isDanger ? props.dangerLabelColor : props.outerLabelColor,
                    fillOpacity: isDanger ? clampOpacity(props.dangerLabelOpacity) : clampOpacity(props.outerLabelOpacity)
                }, Math.round(tickValue).toString()));
            }

            if (!props.showMinorTicks || index >= majorValues.length - 1) {
                return;
            }

            const nextTickValue = majorValues[index + 1];
            for (let division = 1; division < minorDivisions; division += 1) {
                const minorValue = tickValue + ((nextTickValue - tickValue) * division / minorDivisions);
                if (minorValue >= maxValue) {
                    break;
                }
                const minorAngle = valueToAngle(minorValue);
                const isMinorDanger = minorValue >= dangerThreshold;
                const minorTickStart = polarPoint(cx, cy, tickOuterRadius, minorAngle);
                const minorTickEnd = polarPoint(cx, cy, tickOuterRadius - minorTickLength, minorAngle);
                tickElements.push(React.createElement("line", {
                    key: `minor-tick-${index}-${division}`,
                    x1: minorTickStart.x,
                    y1: minorTickStart.y,
                    x2: minorTickEnd.x,
                    y2: minorTickEnd.y,
                    stroke: isMinorDanger ? props.minorDangerTickColor : props.minorTickColor,
                    strokeOpacity: isMinorDanger ? clampOpacity(props.minorDangerTickOpacity) : clampOpacity(props.minorTickOpacity),
                    strokeWidth: isMinorDanger ? 1.8 : 1.2,
                    strokeLinecap: "round"
                }));
            }
        });

        const scopeSeed = store && store.path ? String(store.path) : "dosing_valve_gauge";
        const scopeKey = scopeSeed.replace(/[^A-Za-z0-9_]/g, "_");
        const bezelGradientId = `${scopeKey}_dvg_bezel`;
        const faceGradientId = `${scopeKey}_dvg_face`;
        const hubGradientId = `${scopeKey}_dvg_hub`;
        const needleGradientId = `${scopeKey}_dvg_needle`;

        const defs = React.createElement("defs", { key: "defs" }, [
            React.createElement("radialGradient", {
                key: bezelGradientId,
                id: bezelGradientId,
                cx: "50%",
                cy: "50%",
                r: "50%"
            }, [
                React.createElement("stop", { key: "b1", offset: "0%", stopColor: props.bezelInnerColor }),
                React.createElement("stop", { key: "b2", offset: "50%", stopColor: props.bezelMidColor }),
                React.createElement("stop", { key: "b3", offset: "100%", stopColor: props.bezelOuterColor })
            ]),
            React.createElement("radialGradient", {
                key: faceGradientId,
                id: faceGradientId,
                cx: "50%",
                cy: "50%",
                r: "50%",
                fx: "50%",
                fy: "35%"
            }, [
                React.createElement("stop", { key: "f1", offset: "0%", stopColor: props.faceInnerColor }),
                React.createElement("stop", { key: "f2", offset: "55%", stopColor: props.faceMidColor }),
                React.createElement("stop", { key: "f3", offset: "100%", stopColor: props.faceOuterColor })
            ]),
            React.createElement("radialGradient", {
                key: hubGradientId,
                id: hubGradientId,
                cx: "50%",
                cy: "50%",
                r: "50%"
            }, [
                React.createElement("stop", { key: "h1", offset: "0%", stopColor: props.hubCenterColor }),
                React.createElement("stop", { key: "h2", offset: "60%", stopColor: props.hubMidColor }),
                React.createElement("stop", { key: "h3", offset: "100%", stopColor: props.hubOuterColor })
            ]),
            React.createElement("linearGradient", {
                key: needleGradientId,
                id: needleGradientId,
                x1: "0%",
                y1: "0%",
                x2: "100%",
                y2: "0%"
            }, [
                React.createElement("stop", { key: "n1", offset: "0%", stopColor: props.needleBaseColor, stopOpacity: 0.35 }),
                React.createElement("stop", { key: "n2", offset: "30%", stopColor: props.needleBaseColor, stopOpacity: 0.8 }),
                React.createElement("stop", { key: "n3", offset: "60%", stopColor: props.needleMidColor, stopOpacity: 0.95 }),
                React.createElement("stop", { key: "n4", offset: "100%", stopColor: props.needleTipColor, stopOpacity: 1.0 })
            ])
        ]);

        const needleRotation = `rotate(${currentAngle} ${cx} ${cy})`;
        const needleElements = props.showNeedle ? React.createElement("g", {
            key: "needle-group",
            transform: needleRotation
        }, [
            React.createElement("line", {
                key: "needle-shadow",
                x1: cx - needleTailLength,
                y1: cy,
                x2: cx + needleLength,
                y2: cy,
                stroke: "#000000",
                strokeOpacity: 0.3,
                strokeWidth: 8,
                strokeLinecap: "round"
            }),
            React.createElement("path", {
                key: "needle-body",
                d: [
                    `M ${(cx - needleTailLength).toFixed(3)} ${(cy + 3.5).toFixed(3)}`,
                    `L ${(cx + needleLength - 50).toFixed(3)} ${(cy + 2).toFixed(3)}`,
                    `L ${(cx + needleLength).toFixed(3)} ${cy.toFixed(3)}`,
                    `L ${(cx + needleLength - 50).toFixed(3)} ${(cy - 2).toFixed(3)}`,
                    `L ${(cx - needleTailLength).toFixed(3)} ${(cy - 3.5).toFixed(3)}`,
                    "Z"
                ].join(" "),
                fill: `url(#${needleGradientId})`
            }),
            React.createElement("line", {
                key: "needle-highlight",
                x1: cx + needleLength * 0.5,
                y1: cy,
                x2: cx + needleLength,
                y2: cy,
                stroke: props.needleHighlightColor,
                strokeOpacity: clampOpacity(props.needleHighlightOpacity),
                strokeWidth: 6,
                strokeLinecap: "round"
            }),
            React.createElement("circle", {
                key: "needle-tip-bloom",
                cx: cx + needleLength - 20,
                cy: cy,
                r: 20,
                fill: props.needleHighlightColor,
                fillOpacity: clampOpacity(props.needleHighlightOpacity) * 0.22
            })
        ]) : null;

        const svgChildren = [
            defs,
            React.createElement("circle", {
                key: "bezel",
                cx,
                cy,
                r: outerRadius,
                fill: `url(#${bezelGradientId})`
            }),
            React.createElement("circle", {
                key: "face",
                cx,
                cy,
                r: faceRadius,
                fill: `url(#${faceGradientId})`
            }),
            React.createElement("circle", {
                key: "face-ring",
                cx,
                cy,
                r: faceRadius,
                fill: "none",
                stroke: props.innerRingColor,
                strokeOpacity: clampOpacity(props.innerRingOpacity),
                strokeWidth: 1.5
            })
        ].concat(separatorLines);

        if (props.showDangerZoneTint && value >= dangerThreshold) {
            svgChildren.push(React.createElement("path", {
                key: "danger-tint",
                d: describeSector(cx, cy, 200, dangerStartAngle, currentAngle),
                fill: props.dangerZoneColor,
                fillOpacity: clampOpacity(props.dangerZoneOpacity)
            }));
        }

        if (props.showTrackArc) {
            svgChildren.push(React.createElement("path", {
                key: "track-arc",
                d: describeArc(cx, cy, arcRadius, startAngle, endAngle),
                fill: "none",
                stroke: props.trackColor,
                strokeOpacity: clampOpacity(props.trackOpacity),
                strokeWidth: 8,
                strokeLinecap: "round"
            }));
        }

        if (props.showProgressArc && value > minValue) {
            svgChildren.push(React.createElement("path", {
                key: "progress-halo",
                d: describeArc(cx, cy, arcRadius, startAngle, currentAngle),
                fill: "none",
                stroke: props.progressHaloColor,
                strokeOpacity: clampOpacity(props.progressHaloOpacity),
                strokeWidth: clampNumber(props.progressHaloWidth, 0, 48, 22),
                strokeLinecap: "round"
            }));
            svgChildren.push(React.createElement("path", {
                key: "progress-arc",
                d: describeArc(cx, cy, arcRadius, startAngle, currentAngle),
                fill: "none",
                stroke: props.progressColor,
                strokeOpacity: clampOpacity(props.progressOpacity),
                strokeWidth: clampNumber(props.progressStrokeWidth, 1, 32, 7),
                strokeLinecap: "round"
            }));
            svgChildren.push(React.createElement("path", {
                key: "progress-tip",
                d: describeArc(cx, cy, arcRadius, Math.max(startAngle, currentAngle - 12), currentAngle),
                fill: "none",
                stroke: props.progressTipColor,
                strokeOpacity: clampOpacity(props.progressTipOpacity),
                strokeWidth: clampNumber(props.progressTipWidth, 0, 48, 16),
                strokeLinecap: "round"
            }));
        }

        svgChildren.push.apply(svgChildren, tickElements);
        svgChildren.push.apply(svgChildren, labelElements);

        if (needleElements) {
            svgChildren.push(needleElements);
        }

        svgChildren.push(
            React.createElement("circle", {
                key: "hub",
                cx,
                cy,
                r: 11,
                fill: `url(#${hubGradientId})`,
                stroke: props.hubStrokeColor,
                strokeOpacity: clampOpacity(props.hubStrokeOpacity),
                strokeWidth: 1.5
            })
        );

        const valueFontSize = clampNumber(props.valueFontSize, 12, 140, 80);
        const unitFontSize = clampNumber(props.unitFontSize, 8, 72, 34);
        const centerValueBlockX = cx + ((props.showCenterUnit && props.unitText) ? unitFontSize * 0.4 : 0);

        if (props.showCenterValue || props.showCenterUnit) {
            const centerValueChildren = [];
            if (props.showCenterValue) {
                centerValueChildren.push(React.createElement("tspan", {
                    key: "center-value-number"
                }, displayValue));
            }
            if (props.showCenterUnit) {
                centerValueChildren.push(React.createElement("tspan", {
                    key: "center-value-unit",
                    dx: props.showCenterValue ? "0.10em" : "0",
                    dy: props.showCenterValue ? "0.10em" : "0",
                    fontSize: unitFontSize,
                    fontWeight: 400,
                    letterSpacing: 2,
                    fill: props.unitColor,
                    fillOpacity: clampOpacity(props.unitOpacity)
                }, props.unitText));
            }

            svgChildren.push(React.createElement("text", {
                key: "center-value-block",
                x: centerValueBlockX,
                y: 352,
                textAnchor: "middle",
                dominantBaseline: "middle",
                fontFamily: props.fontFamily,
                fontSize: valueFontSize,
                fontWeight: props.showCenterValue ? 600 : 400,
                letterSpacing: props.showCenterValue ? -2 : 2,
                fill: props.showCenterValue ? props.valueColor : props.unitColor,
                fillOpacity: props.showCenterValue ? clampOpacity(props.valueOpacity) : clampOpacity(props.unitOpacity)
            }, centerValueChildren));
        }

        if (props.showTitleText) {
            svgChildren.push(React.createElement("text", {
                key: "title-line-1",
                x: cx,
                y: 434,
                textAnchor: "middle",
                dominantBaseline: "middle",
                fontFamily: props.fontFamily,
                fontSize: clampNumber(props.titleFontSize, 8, 48, 17),
                fontWeight: 500,
                letterSpacing: clampNumber(props.titleLetterSpacing, 0, 16, 5),
                fill: props.titleColor,
                fillOpacity: clampOpacity(props.titleOpacity)
            }, props.titleLine1Text));
            svgChildren.push(React.createElement("text", {
                key: "title-line-2",
                x: cx,
                y: 460,
                textAnchor: "middle",
                dominantBaseline: "middle",
                fontFamily: props.fontFamily,
                fontSize: clampNumber(props.titleFontSize, 8, 48, 17),
                fontWeight: 500,
                letterSpacing: clampNumber(props.titleLetterSpacing, 0, 16, 5),
                fill: props.titleColor,
                fillOpacity: clampOpacity(props.titleOpacity)
            }, props.titleLine2Text));
        }

        const svg = React.createElement("svg", {
            viewBox: `0 0 ${viewBoxSize} ${viewBoxSize}`,
            preserveAspectRatio: props.preserveAspectRatio || "xMidYMid meet",
            style: { width: "100%", height: "100%" }
        }, svgChildren);

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
                    fontFamily: props.fontFamily
                }
            }, props.label));
        }

        return React.createElement("div", Object.assign({}, rootEmit(emit, props.style)), children);
    }
}

class Custom2DDosingValveHalfGauge extends Custom2DSourceSvg {
    renderOverlay(props) {
        if (!props.showOverlay) {
            return null;
        }

        const displayValue = props.valueText && String(props.valueText).length
            ? String(props.valueText)
            : formatGaugeValue(props.value, props.valueDecimals);
        const maskBlur = clampNumber(props.overlayMaskBlur, 0, 64, 24);
        const overlayChildren = [
            React.createElement("div", {
                key: "center-overlay-mask",
                style: {
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    width: clampNumber(props.overlayMaskWidth, 60, 420, 260),
                    height: clampNumber(props.overlayMaskHeight, 40, 260, 122),
                    transform: "translate(-50%, -50%)",
                    borderRadius: clampNumber(props.overlayMaskRadius, 0, 220, 110),
                    background: props.overlayMaskColor,
                    boxShadow: `0 0 ${maskBlur}px ${props.overlayMaskColor}`
                }
            })
        ];

        const valueRowChildren = [];
        if (props.showValue) {
            valueRowChildren.push(React.createElement("span", {
                key: "center-value-number",
                style: {
                    fontFamily: props.fontFamily,
                    fontSize: clampNumber(props.valueFontSize, 12, 140, 80),
                    fontWeight: 600,
                    lineHeight: 1,
                    letterSpacing: "-2px",
                    color: props.valueColor,
                    opacity: clampOpacity(props.valueOpacity),
                    textShadow: "0 0 20px rgba(100, 200, 240, 0.15)"
                }
            }, displayValue));
        }
        if (props.showUnit && props.unitText) {
            valueRowChildren.push(React.createElement("span", {
                key: "center-value-unit",
                style: {
                    fontFamily: props.fontFamily,
                    fontSize: clampNumber(props.unitFontSize, 8, 72, 34),
                    fontWeight: 400,
                    lineHeight: 1,
                    letterSpacing: "2px",
                    color: props.unitColor,
                    opacity: clampOpacity(props.unitOpacity)
                }
            }, props.unitText));
        }

        const contentChildren = [];
        if (valueRowChildren.length) {
            contentChildren.push(React.createElement("div", {
                key: "center-value-block",
                style: {
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "center",
                    gap: clampNumber(props.valueGap, 0, 32, 6),
                    transform: `translateX(${clampNumber(props.valueRowOffsetX, -100, 100, 18)}px)`
                }
            }, valueRowChildren));
        }
        if (props.showTitleText && props.titleLine1Text) {
            contentChildren.push(React.createElement("div", {
                key: "center-title-line-1",
                style: {
                    fontFamily: props.fontFamily,
                    fontSize: clampNumber(props.titleFontSize, 8, 48, 17),
                    fontWeight: 500,
                    lineHeight: 1.15,
                    letterSpacing: `${clampNumber(props.titleLetterSpacing, 0, 16, 5)}px`,
                    color: props.titleColor,
                    opacity: clampOpacity(props.titleOpacity),
                    textTransform: "uppercase"
                }
            }, props.titleLine1Text));
        }
        if (props.showTitleText && props.titleLine2Text) {
            contentChildren.push(React.createElement("div", {
                key: "center-title-line-2",
                style: {
                    fontFamily: props.fontFamily,
                    fontSize: clampNumber(props.titleFontSize, 8, 48, 17),
                    fontWeight: 500,
                    lineHeight: 1.15,
                    letterSpacing: `${clampNumber(props.titleLetterSpacing, 0, 16, 5)}px`,
                    color: props.titleColor,
                    opacity: clampOpacity(props.titleOpacity),
                    textTransform: "uppercase"
                }
            }, props.titleLine2Text));
        }

        overlayChildren.push(React.createElement("div", {
            key: "center-overlay-content",
            style: {
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                pointerEvents: "none"
            }
        }, contentChildren));

        return React.createElement("div", {
            key: "center-overlay",
            style: {
                position: "absolute",
                left: `calc(50% + ${clampNumber(props.overlayHorizontalOffset, -180, 180, 0)}px)`,
                bottom: clampNumber(props.overlayBottomOffset, 0, 180, 38),
                transform: "translateX(-50%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: clampNumber(props.overlayMaskWidth, 60, 420, 260),
                minHeight: clampNumber(props.overlayMaskHeight, 40, 260, 122)
            }
        }, overlayChildren);
    }
}
Custom2DDosingValveHalfGauge.SVG_FILE = "half-gauge.svg";

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

class Custom2DValveLikeMeta {
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
        return readCustom2DValveProps(tree, this.defaultLabel);
    }
}

class Custom2DBreakerStandaloneMeta {
    getComponentType() {
        return "com.miguelgrillo.custom2d.breaker_standalone";
    }

    getViewComponent() {
        return Custom2DBreakerStandalone;
    }

    getDefaultSize() {
        return {
            width: 114,
            height: 114
        };
    }

    getPropsReducer(tree) {
        return readCustom2DBreakerStandaloneProps(tree, "Breaker Standalone");
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

class Custom2DGensetSymbolMeta {
    constructor(componentType, viewComponent, defaultSize, defaultLabel, defaults) {
        this.componentType = componentType;
        this.viewComponent = viewComponent;
        this.defaultSize = defaultSize;
        this.defaultLabel = defaultLabel;
        this.defaults = defaults;
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
        return readCustom2DGensetSymbolProps(tree, this.defaultLabel, this.defaults);
    }
}

class Custom2DDosingValveGaugeMeta {
    getComponentType() {
        return "com.miguelgrillo.custom2d.dosing_valve_gauge";
    }

    getViewComponent() {
        return Custom2DDosingValveGauge;
    }

    getDefaultSize() {
        return {
            width: 520,
            height: 520
        };
    }

    getPropsReducer(tree) {
        return readCustom2DDosingValveGaugeProps(tree);
    }
}

class Custom2DDosingValveHalfGaugeMeta {
    getComponentType() {
        return "com.miguelgrillo.custom2d.dosing_valve_half_gauge";
    }

    getViewComponent() {
        return Custom2DDosingValveHalfGauge;
    }

    getDefaultSize() {
        return {
            width: 520,
            height: 290
        };
    }

    getPropsReducer(tree) {
        return readCustom2DDosingValveHalfGaugeProps(tree);
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
ComponentRegistry.register(new Custom2DGensetSymbolMeta(
    "com.miguelgrillo.custom2d.genset_sld",
    Custom2DGensetSld,
    { width: 200, height: 416 },
    "Genset SLD",
    {
        lineColor: "#10b981",
        topLineColor: "#10b981",
        breakerColor: "#10b981",
        lowerLineColor: "#10b981",
        generatorColor: "#10b981",
        symbolFillColor: "#10b981",
        symbolFillOpacity: 0.02,
        generatorFillColor: "#10b981",
        generatorFillOpacity: 0.15,
        glowColor: "#10b981",
        glowIntensity: 1.0,
        chainGlowPrimaryBlur: 15.0,
        chainGlowSecondaryBlur: 30.0,
        chainGlowTertiaryBlur: 60.0,
        chainGlowPrimaryOpacity: 0.8,
        chainGlowSecondaryOpacity: 0.6,
        chainGlowTertiaryOpacity: 0.4,
        circleGlowPrimaryBlur: 8.0,
        circleGlowSecondaryBlur: 15.0,
        circleGlowTertiaryBlur: 30.0,
        circleGlowPrimaryOpacity: 0.5,
        circleGlowSecondaryOpacity: 0.3,
        circleGlowTertiaryOpacity: 0.15
    }
));
ComponentRegistry.register(new Custom2DGensetSymbolMeta(
    "com.miguelgrillo.custom2d.genset_2",
    Custom2DGenset2,
    { width: 115, height: 331 },
    "Genset 2",
    {
        lineColor: "#10b981",
        topLineColor: "#10b981",
        breakerColor: "#10b981",
        lowerLineColor: "#10b981",
        generatorColor: "#10b981",
        symbolFillColor: "#10b981",
        symbolFillOpacity: 0.02,
        generatorFillColor: "#10b981",
        generatorFillOpacity: 0.15,
        glowColor: "#10b981",
        glowIntensity: 1.0,
        chainGlowPrimaryBlur: 2.5,
        chainGlowSecondaryBlur: 5.0,
        chainGlowTertiaryBlur: 10.0,
        chainGlowPrimaryOpacity: 0.8,
        chainGlowSecondaryOpacity: 0.6,
        chainGlowTertiaryOpacity: 0.4,
        circleGlowPrimaryBlur: 1.5,
        circleGlowSecondaryBlur: 3.0,
        circleGlowTertiaryBlur: 6.0,
        circleGlowPrimaryOpacity: 0.5,
        circleGlowSecondaryOpacity: 0.3,
        circleGlowTertiaryOpacity: 0.15
    }
));
ComponentRegistry.register(new Custom2DGensetSymbolMeta(
    "com.miguelgrillo.custom2d.genset_sld_s32",
    Custom2DGensetSldS32,
    { width: 80, height: 328 },
    "Genset SLD S32",
    {
        lineColor: "#10b981",
        topLineColor: "#10b981",
        breakerColor: "#10b981",
        lowerLineColor: "#10b981",
        generatorColor: "#10b981",
        symbolFillColor: "#10b981",
        symbolFillOpacity: 0.02,
        generatorFillColor: "#10b981",
        generatorFillOpacity: 0.15,
        glowColor: "#10b981",
        glowIntensity: 1.0,
        chainGlowPrimaryBlur: 15.0,
        chainGlowSecondaryBlur: 30.0,
        chainGlowTertiaryBlur: 60.0,
        chainGlowPrimaryOpacity: 0.8,
        chainGlowSecondaryOpacity: 0.6,
        chainGlowTertiaryOpacity: 0.4,
        circleGlowPrimaryBlur: 8.0,
        circleGlowSecondaryBlur: 15.0,
        circleGlowTertiaryBlur: 30.0,
        circleGlowPrimaryOpacity: 0.5,
        circleGlowSecondaryOpacity: 0.3,
        circleGlowTertiaryOpacity: 0.15
    }
));
ComponentRegistry.register(new Custom2DDosingValveGaugeMeta());
ComponentRegistry.register(new Custom2DDosingValveHalfGaugeMeta());
ComponentRegistry.register(new Custom2DValveMeta());
ComponentRegistry.register(new Custom2DValveLikeMeta(
    "com.miguelgrillo.custom2d.three_way_control_valve_rev2",
    Custom2DThreeWayControlValveRev2,
    { width: 144, height: 190 },
    "3-Way Control Valve Rev2"
));
ComponentRegistry.register(new Custom2DBreakerStandaloneMeta());
ComponentRegistry.register(new Custom2DValveLikeMeta(
    "com.miguelgrillo.custom2d.pump",
    Custom2DPump,
    { width: 184, height: 168 },
    "Pump"
));
ComponentRegistry.register(new Custom2DValveLikeMeta(
    "com.miguelgrillo.custom2d.transformer",
    Custom2DTransformer,
    { width: 144, height: 168 },
    "Transformer"
));
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
