const KNOWN_HANDLE_KEYS = ["top", "right", "bottom", "left"];

function normalizeEndpoint(endpoint) {
    return endpoint === "target" ? "target" : "source";
}

function asHandleId(handleId) {
    return String(handleId || "").trim();
}

function getHandleKey(handleId) {
    const value = asHandleId(handleId);
    const match = /^(top|right|bottom|left)(?:-(source|target))?$/.exec(value);
    return match ? match[1] : "";
}

function buildNodeHandleId(handleKey, endpoint) {
    return `${handleKey}-${normalizeEndpoint(endpoint)}`;
}

function canonicalizeHandleId(handleId, endpoint) {
    const handleKey = getHandleKey(handleId);
    if (!handleKey) {
        return asHandleId(handleId);
    }
    return buildNodeHandleId(handleKey, endpoint);
}

function getDefaultHandleId(endpoint) {
    return normalizeEndpoint(endpoint) === "target" ? "left-target" : "right-source";
}

function getHandleType(handleId) {
    const value = asHandleId(handleId);
    if (value.endsWith("-target")) {
        return "target";
    }
    if (value.endsWith("-source")) {
        return "source";
    }
    return "";
}

module.exports = {
    KNOWN_HANDLE_KEYS,
    buildNodeHandleId,
    canonicalizeHandleId,
    getDefaultHandleId,
    getHandleKey,
    getHandleType
};
