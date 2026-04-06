const { joinDomIdSegments } = require("../lib/dom-id");

const HEX_COLOR_PATTERN = /^#(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
const RGB_COLOR_PATTERN = /^rgba?\(\s*(?:\d{1,3}%?\s*,\s*){2}\d{1,3}%?(?:\s*,\s*(?:0|1|0?\.\d+))?\s*\)$/i;
const HSL_COLOR_PATTERN = /^hsla?\(\s*\d+(?:\.\d+)?(?:deg|rad|turn)?\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%(?:\s*,\s*(?:0|1|0?\.\d+))?\s*\)$/i;
const CSS_VAR_PATTERN = /^var\(--[A-Za-z0-9_-]+\)$/;
const NAMED_COLOR_PATTERN = /^[A-Za-z]+$/;
const SAFE_COLOR_KEYWORDS = new Set(["currentColor", "transparent", "inherit", "initial", "unset"]);

function escapeRegExp(value) {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function escapeXmlText(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function sanitizeColor(value, fallback) {
    if (value === undefined || value === null || value === "") {
        return fallback;
    }

    const stringValue = String(value).trim();
    if (
        HEX_COLOR_PATTERN.test(stringValue) ||
        RGB_COLOR_PATTERN.test(stringValue) ||
        HSL_COLOR_PATTERN.test(stringValue) ||
        CSS_VAR_PATTERN.test(stringValue) ||
        NAMED_COLOR_PATTERN.test(stringValue) ||
        SAFE_COLOR_KEYWORDS.has(stringValue)
    ) {
        return stringValue;
    }

    return fallback;
}

function prefixSvgIds(markup, prefix) {
    const safePrefix = String(prefix || "")
        .trim()
        .replace(/[^A-Za-z0-9_-]+/g, "_") || "xyfc__";
    const idMatches = [];
    let nextMarkup = markup.replace(/\sid="([^"]+)"/g, (match, id) => {
        idMatches.push(id);
        return ` id="${safePrefix}${id}"`;
    });

    for (const id of idMatches) {
        const escapedId = escapeRegExp(id);
        nextMarkup = nextMarkup
            .replace(new RegExp(`url\\(#${escapedId}\\)`, "g"), `url(#${safePrefix}${id})`)
            .replace(new RegExp(`="#${escapedId}"`, "g"), `="#${safePrefix}${id}"`);
    }

    return nextMarkup;
}

function rewriteIdReferenceAttributes(markup, prefix) {
    const safePrefix = String(prefix || "")
        .trim()
        .replace(/[^A-Za-z0-9_-]+/g, "_") || "xyfc__";

    return markup.replace(/\s(aria-labelledby|aria-describedby)="([^"]+)"/g, (match, attributeName, value) => {
        const nextValue = String(value)
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .map((id) => `${safePrefix}${id}`)
            .join(" ");

        return ` ${attributeName}="${nextValue}"`;
    });
}

function applyDataOverrides(markup, data) {
    let nextMarkup = markup;
    const accentColor = sanitizeColor(data && data.accentColor, null);
    const panelColor = sanitizeColor(data && data.panelColor, null);
    const borderColor = sanitizeColor(data && data.borderColor, null);
    const textColor = sanitizeColor(data && data.textColor, null);

    if (accentColor) {
        nextMarkup = nextMarkup.replace(/#10b981/gi, accentColor).replace(/#34d399/gi, accentColor);
    }
    if (panelColor) {
        nextMarkup = nextMarkup.replace(/#0f172a/gi, panelColor).replace(/#050b14/gi, panelColor);
    }
    if (borderColor) {
        nextMarkup = nextMarkup.replace(/#1e293b/gi, borderColor);
    }
    if (textColor) {
        nextMarkup = nextMarkup.replace(/#f1f5f9/gi, textColor).replace(/#e2e8f0/gi, textColor);
    }
    if (data && data.title !== undefined) {
        nextMarkup = nextMarkup.replace(/>G01</, `>${escapeXmlText(data.title)}<`);
    }
    if (data && data.label !== undefined) {
        nextMarkup = nextMarkup.replace(/>52I</, `>${escapeXmlText(data.label)}<`);
    }

    return nextMarkup;
}

function createSvgIdPrefix(instanceId, nodeId) {
    return `${joinDomIdSegments(instanceId, nodeId)}__`;
}

function normalizeSvgMarkup(markup, prefix, data) {
    return applyDataOverrides(
        rewriteIdReferenceAttributes(
            prefixSvgIds(
                markup
                .replace(/\swidth="[^"]*"/i, ' width="100%"')
                .replace(/\sheight="[^"]*"/i, ' height="100%"'),
                prefix
            ),
            prefix
        ),
        data
    );
}

module.exports = {
    createSvgIdPrefix,
    normalizeSvgMarkup,
    sanitizeColor
};
