function sanitizeDomIdSegment(value) {
    const sanitized = String(value || "")
        .trim()
        .replace(/[^A-Za-z0-9_-]+/g, "_")
        .replace(/^_+|_+$/g, "");

    return sanitized || "xyfc";
}

function joinDomIdSegments() {
    return Array.from(arguments).map(sanitizeDomIdSegment).join("__");
}

module.exports = {
    joinDomIdSegments,
    sanitizeDomIdSegment
};
