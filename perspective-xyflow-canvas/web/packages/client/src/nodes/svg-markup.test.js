const assert = require("node:assert/strict");

const { normalizeSvgMarkup } = require("./svg-markup");

{
    const markup = [
        '<svg xmlns="http://www.w3.org/2000/svg" width="220" height="120" viewBox="0 0 220 120" aria-labelledby="panel-title panel-desc">',
        '  <title id="panel-title">Panel</title>',
        '  <desc id="panel-desc">Accessible panel</desc>',
        '  <defs><filter id="panel-glow"><feDropShadow dx="0" dy="0" stdDeviation="4"/></filter></defs>',
        '  <rect width="220" height="120" rx="12" fill="#0f172a" stroke="#1e293b" filter="url(#panel-glow)"/>',
        '  <text x="28" y="36" fill="#f1f5f9">G01</text>',
        '  <text x="28" y="72" fill="#e2e8f0">52I</text>',
        '  <path d="M 12 108 L 208 108" stroke="#10b981"/>',
        "</svg>"
    ].join("");

    const normalized = normalizeSvgMarkup(markup, "canvas 1/node&1__", {
        title: 'G<01" Alpha',
        label: "52<&",
        accentColor: 'red" onload="alert(1)',
        panelColor: "#112233",
        borderColor: "rgba(255, 0, 0, 0.5)",
        textColor: "currentColor"
    });

    assert.match(normalized, /id="canvas_1_node_1__panel-glow"/);
    assert.match(normalized, /id="canvas_1_node_1__panel-title"/);
    assert.match(normalized, /id="canvas_1_node_1__panel-desc"/);
    assert.match(normalized, /aria-labelledby="canvas_1_node_1__panel-title canvas_1_node_1__panel-desc"/);
    assert.match(normalized, /url\(#canvas_1_node_1__panel-glow\)/);
    assert.match(normalized, /width="100%"/);
    assert.match(normalized, /height="100%"/);
    assert.match(normalized, />G&lt;01&quot; Alpha</);
    assert.match(normalized, />52&lt;&amp;</);
    assert.doesNotMatch(normalized, /stroke="red" onload="alert\(1\)"/);
    assert.match(normalized, /stroke="#10b981"/);
    assert.match(normalized, /fill="#112233"/);
    assert.match(normalized, /stroke="rgba\(255, 0, 0, 0.5\)"/);
    assert.match(normalized, /fill="currentColor"/);
}
