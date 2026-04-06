const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const SOURCE_PATH = path.resolve(
    __dirname,
    "..",
    "gateway",
    "src",
    "main",
    "resources",
    "mounted",
    "js",
    "anchor-connectors.js"
);

const EXPECTED_COMPONENT_TYPES = [
    "com.miguelgrillo.anchorconnectors.genset_panel",
    "com.miguelgrillo.anchorconnectors.genset_panel_transparent",
    "com.miguelgrillo.anchorconnectors.genset_panel_r2",
    "com.miguelgrillo.anchorconnectors.genset_panel_r2_transparent",
    "com.miguelgrillo.anchorconnectors.modern_line",
    "com.miguelgrillo.anchorconnectors.modern_line_rev2",
    "com.miguelgrillo.anchorconnectors.modern_tank",
    "com.miguelgrillo.anchorconnectors.modern_tank_rev2",
    "com.miguelgrillo.anchorconnectors.modern_valve_control",
    "com.miguelgrillo.anchorconnectors.modern_valve_control_rev2",
    "com.miguelgrillo.anchorconnectors.connector_line"
];

class StubComponent {
    constructor(props) {
        this.props = props;
        this.state = {};
    }

    setState(update) {
        const nextState = typeof update === "function" ? update(this.state, this.props) : update;
        this.state = Object.assign({}, this.state, nextState);
    }
}

function createReactStub() {
    return {
        createElement(type, props, ...children) {
            return {
                type,
                props: props || {},
                children
            };
        }
    };
}

function createTreeStub(values) {
    const data = values || {};
    return {
        read(key, fallback) {
            return Object.prototype.hasOwnProperty.call(data, key) ? data[key] : fallback;
        },
        readString(key, fallback) {
            const value = Object.prototype.hasOwnProperty.call(data, key) ? data[key] : fallback;
            return typeof value === "string" ? value : fallback;
        }
    };
}

function createRect(left, top, width, height) {
    return {
        left,
        top,
        width,
        height,
        right: left + width,
        bottom: top + height
    };
}

function createTargetElement(targetId, rect, anchors) {
    const attributes = new Map();
    const publishedAnchors = Array.isArray(anchors) ? anchors : [];
    attributes.set("data-anchor-target-id", targetId);
    attributes.set("data-anchor-coord-mode", "local");
    attributes.set("data-anchor-points", JSON.stringify(publishedAnchors));
    for (const anchor of publishedAnchors) {
        attributes.set(`data-anchor-${anchor.id}-x`, String(anchor.x));
        attributes.set(`data-anchor-${anchor.id}-y`, String(anchor.y));
    }

    return {
        getAttribute(name) {
            return attributes.has(name) ? attributes.get(name) : null;
        },
        getBoundingClientRect() {
            return rect;
        }
    };
}

function createOwnerDocument(targetElements, tracker) {
    const targets = Array.isArray(targetElements) ? targetElements : [];
    const listeners = new Map();
    const windowListeners = new Map();
    const defaultView = {
        addEventListener(type, listener, options) {
            const capture = options === true || !!(options && options.capture);
            windowListeners.set(`${type}:${capture}`, listener);
            if (tracker) {
                tracker.windowAddedListeners = tracker.windowAddedListeners || [];
                tracker.windowAddedListeners.push({ type, capture });
            }
        },
        removeEventListener(type, listener, options) {
            const capture = options === true || !!(options && options.capture);
            const key = `${type}:${capture}`;
            if (windowListeners.get(key) === listener) {
                windowListeners.delete(key);
            }
            if (tracker) {
                tracker.windowRemovedListeners = tracker.windowRemovedListeners || [];
                tracker.windowRemovedListeners.push({ type, capture });
            }
        },
        getListener(type, capture) {
            return windowListeners.get(`${type}:${!!capture}`) || null;
        }
    };
    return {
        defaultView,
        querySelectorAll(selector) {
            if (tracker) {
                tracker.querySelectorAllCalls += 1;
                tracker.lastSelector = selector;
            }
            return selector === "[data-anchor-target-id]" ? targets : [];
        },
        addEventListener(type, listener, options) {
            const capture = options === true || !!(options && options.capture);
            listeners.set(`${type}:${capture}`, listener);
            if (tracker) {
                tracker.addedListeners = tracker.addedListeners || [];
                tracker.addedListeners.push({ type, capture });
            }
        },
        removeEventListener(type, listener, options) {
            const capture = options === true || !!(options && options.capture);
            const key = `${type}:${capture}`;
            if (listeners.get(key) === listener) {
                listeners.delete(key);
            }
            if (tracker) {
                tracker.removedListeners = tracker.removedListeners || [];
                tracker.removedListeners.push({ type, capture });
            }
        },
        getListener(type, capture) {
            return listeners.get(`${type}:${!!capture}`) || null;
        }
    };
}

function collectNodesByType(node, type, matches) {
    if (!node) {
        return matches;
    }

    if (Array.isArray(node)) {
        for (const child of node) {
            collectNodesByType(child, type, matches);
        }
        return matches;
    }

    if (node.type === type) {
        matches.push(node);
    }

    if (Array.isArray(node.children)) {
        for (const child of node.children) {
            collectNodesByType(child, type, matches);
        }
    }
    return matches;
}

function collectNodes(node, predicate, matches) {
    if (!node) {
        return matches;
    }

    if (Array.isArray(node)) {
        for (const child of node) {
            collectNodes(child, predicate, matches);
        }
        return matches;
    }

    if (predicate(node)) {
        matches.push(node);
    }

    if (Array.isArray(node.children)) {
        for (const child of node.children) {
            collectNodes(child, predicate, matches);
        }
    }
    return matches;
}

function normalizeForAssertion(value) {
    return JSON.parse(JSON.stringify(value));
}

function loadRuntime() {
    const source = fs.readFileSync(SOURCE_PATH, "utf8");
    const registrations = [];
    const runtimeErrors = [];
    const intervals = new Map();
    let nextIntervalId = 1;
    const React = createReactStub();
    const PerspectiveClient = {
        Component: StubComponent,
        ComponentRegistry: {
            register(meta) {
                registrations.push(meta);
            }
        }
    };

    const context = {
        React,
        console,
        window: {
            React,
            PerspectiveClient,
            console: {
                error(...args) {
                    runtimeErrors.push(args.map((value) => String(value)).join(" "));
                }
            },
            setInterval(callback) {
                const intervalId = nextIntervalId;
                nextIntervalId += 1;
                intervals.set(intervalId, callback);
                return intervalId;
            },
            clearInterval(intervalId) {
                intervals.delete(intervalId);
            }
        },
        setInterval(callback) {
            return context.window.setInterval(callback);
        },
        clearInterval(intervalId) {
            return context.window.clearInterval(intervalId);
        }
    };
    context.global = context;
    context.globalThis = context;

    vm.createContext(context);
    vm.runInContext(source, context, { filename: SOURCE_PATH });

    assert.equal(runtimeErrors.length, 0, `bootstrap logged errors:\n${runtimeErrors.join("\n")}`);
    return {
        registrations,
        context
    };
}

function exerciseMeta(meta) {
    const componentType = meta.getComponentType();
    const reducedProps = meta.getPropsReducer(createTreeStub());
    assert.equal(typeof reducedProps, "object", `${componentType} reducer did not return props`);

    const ViewComponent = meta.getViewComponent();
    const instance = new ViewComponent({
        props: reducedProps,
        emit(payload) {
            return payload;
        },
        store: {
            path: componentType
        }
    });

    if (componentType === "com.miguelgrillo.anchorconnectors.connector_line") {
        assertConnectorLineDefaults(reducedProps);
        assertConnectorLinePropWriter(meta, reducedProps);
        renderConnectorLine(meta, {
            start: { mode: "free", x: 40, y: 60, targetId: "", anchorId: "" },
            end: { mode: "free", x: 240, y: 160, targetId: "", anchorId: "" }
        });
        renderConnectorLine(meta, {
            start: { mode: "snapped", x: 0, y: 0, targetId: "breakerA", anchorId: "right" },
            end: { mode: "snapped", x: 0, y: 0, targetId: "breakerB", anchorId: "left" }
        });
        renderConnectorLine(meta, {
            fromTargetId: "breakerA",
            fromAnchor: "right",
            toTargetId: "breakerB",
            toAnchor: "left"
        });
        renderConnectorLine(meta, {
            start: { mode: "free", x: 120, y: 120, targetId: "", anchorId: "" },
            end: { mode: "free", x: 520, y: 320, targetId: "", anchorId: "" },
            fromTargetId: "breakerA",
            fromAnchor: "right",
            toTargetId: "breakerB",
            toAnchor: "left"
        }, {
            expectLegacyTargetRouting: true
        });
        renderConnectorLine(meta, {
            start: { mode: "snapped", x: 70, y: 90, targetId: "missingA", anchorId: "right" },
            end: { mode: "snapped", x: 260, y: 190, targetId: "breakerB", anchorId: "left" }
        }, {
            targetElements: [
                createTargetElement("breakerB", createRect(220, 110, 100, 100), [
                    { id: "left", x: 0, y: 50, snapRadius: 24 },
                    { id: "right", x: 100, y: 50, snapRadius: 24 }
                ])
            ]
        });
    }

    instance.render();
}

function assertConnectorLinePropWriter(meta, reducedProps) {
    const ViewComponent = meta.getViewComponent();
    const instance = new ViewComponent({
        props: reducedProps,
        emit(payload) {
            return payload;
        },
        store: {
            path: meta.getComponentType(),
            props: {
                write() {}
            }
        }
    });

    assert.equal(typeof instance.resolvePropWriter, "function");
    assert.equal(typeof instance.resolvePropWriter(), "function");
}

function assertConnectorLineWriteEndpoint(meta, reducedProps) {
    const writes = [];
    const ViewComponent = meta.getViewComponent();
    const instance = new ViewComponent({
        props: reducedProps,
        emit(payload) {
            return payload;
        },
        store: {
            path: meta.getComponentType(),
            props: {
                write(path, value) {
                    writes.push([path, value]);
                }
            }
        }
    });

    const startValue = {
        mode: "snapped",
        x: 120,
        y: 120,
        targetId: "breakerA",
        anchorId: "right"
    };
    instance.writeEndpoint("start", startValue);
    assert.deepEqual(normalizeForAssertion(writes), [
        ["start", startValue],
        ["fromTargetId", "breakerA"],
        ["fromAnchor", "right"]
    ]);

    writes.length = 0;
    const endValue = {
        mode: "free",
        x: 520,
        y: 320,
        targetId: "breakerB",
        anchorId: "left"
    };
    instance.writeEndpoint("end", endValue);
    assert.deepEqual(normalizeForAssertion(writes), [
        ["end", endValue],
        ["toTargetId", ""],
        ["toAnchor", ""]
    ]);
}

function assertConnectorLineDefaults(reducedProps) {
    assert.equal(reducedProps.start.mode, "free");
    assert.equal(reducedProps.start.x, 120);
    assert.equal(reducedProps.start.y, 120);
    assert.equal(reducedProps.end.mode, "free");
    assert.equal(reducedProps.end.x, 520);
    assert.equal(reducedProps.end.y, 320);
    assert.equal(reducedProps.fromTargetId, "breakerA");
    assert.equal(reducedProps.toTargetId, "breakerB");
}

function renderConnectorLine(meta, values, options) {
    const reducedProps = meta.getPropsReducer(createTreeStub(values));
    const ViewComponent = meta.getViewComponent();
    const tracker = {
        querySelectorAllCalls: 0,
        lastSelector: null
    };
    const config = options || {};
    const rootRect = createRect(0, 0, 320, 240);
    const ownerDocument = createOwnerDocument(config.targetElements || [
        createTargetElement("breakerA", createRect(20, 30, 100, 100), [
            { id: "right", x: 100, y: 50, snapRadius: 24 },
            { id: "left", x: 0, y: 50, snapRadius: 24 }
        ]),
        createTargetElement("breakerB", createRect(220, 110, 100, 100), [
            { id: "left", x: 0, y: 50, snapRadius: 24 },
            { id: "right", x: 100, y: 50, snapRadius: 24 }
        ])
    ], tracker);
    const instance = new ViewComponent({
        props: reducedProps,
        emit(payload) {
            return payload;
        },
        store: {
            path: meta.getComponentType(),
            element: null,
            props: {
                write() {}
            }
        }
    });
    instance.rootElement = {
        ownerDocument,
        getBoundingClientRect() {
            return rootRect;
        }
    };

    const rendered = instance.render();
    const pathNodes = collectNodesByType(rendered, "path", []);
    assert.ok(pathNodes.length > 0, "connector line render did not produce any path nodes");
    const pathNode = pathNodes.find((node) => typeof node.props.d === "string" && node.props.d.length > 0);
    assert.ok(pathNode, "connector line render did not produce a routed path");
    const pathData = pathNode.props.d;

    if (values.start && values.start.mode === "free" && !config.expectLegacyTargetRouting) {
        assert.equal(tracker.querySelectorAllCalls, 0, "free endpoint render should not query published anchor targets");
        assert.equal(
            pathData,
            "M 40 60 L 132 60 Q 140 60 140 68 L 140 152 Q 140 160 148 160 L 240 160",
            `free endpoint path did not match explicit point routing: ${pathData}`
        );
    }

    if (config.expectLegacyTargetRouting) {
        assert.ok(tracker.querySelectorAllCalls > 0, "legacy endpoint render should query published anchor targets");
        assert.equal(tracker.lastSelector, "[data-anchor-target-id]");
        assert.equal(
            pathData,
            "M 120 80 L 162 80 Q 170 80 170 88 L 170 152 Q 170 160 178 160 L 220 160",
            `legacy endpoint path did not match compatibility routing: ${pathData}`
        );
    }

    if (values.start && values.start.mode === "snapped") {
        assert.ok(tracker.querySelectorAllCalls > 0, "snapped endpoint render did not query published anchor targets");
        assert.equal(tracker.lastSelector, "[data-anchor-target-id]");
        if (values.start.targetId === "missingA") {
            assert.equal(
                pathData,
                "M 70 90 L 137 90 Q 145 90 145 98 L 145 152 Q 145 160 153 160 L 220 160",
                `missing-target snapped endpoint path did not fall back to persisted coordinates: ${pathData}`
            );
        } else {
            assert.equal(
                pathData,
                "M 120 80 L 162 80 Q 170 80 170 88 L 170 152 Q 170 160 178 160 L 220 160",
                `snapped endpoint path did not match resolved published-anchor routing: ${pathData}`
            );
        }
    }

    if (!values.start && values.fromTargetId) {
        assert.ok(tracker.querySelectorAllCalls > 0, "legacy endpoint render did not query published anchor targets");
        assert.equal(
            pathData,
            "M 120 80 L 162 80 Q 170 80 170 88 L 170 152 Q 170 160 178 160 L 220 160",
            `legacy endpoint path did not match compatibility routing: ${pathData}`
        );
    }

    return rendered;
}

function assertConnectorLineDragPreviewAndCommit(meta, runtimeContext) {
    const writes = [];
    const tracker = {
        querySelectorAllCalls: 0,
        lastSelector: null,
        addedListeners: [],
        removedListeners: []
    };
    const ownerDocument = createOwnerDocument([
        createTargetElement("breakerA", createRect(20, 30, 100, 100), [
            { id: "right", x: 100, y: 50, snapRadius: 24 },
            { id: "left", x: 0, y: 50, snapRadius: 24 }
        ]),
        createTargetElement("breakerB", createRect(220, 110, 100, 100), [
            { id: "left", x: 0, y: 50, snapRadius: 24 },
            { id: "right", x: 100, y: 50, snapRadius: 24 }
        ])
    ], tracker);
    const rootRect = createRect(0, 0, 320, 240);
    const reducedProps = meta.getPropsReducer(createTreeStub({
        start: { mode: "free", x: 40, y: 60, targetId: "", anchorId: "" },
        end: { mode: "free", x: 240, y: 160, targetId: "", anchorId: "" },
        snapRadius: 30
    }));
    const ViewComponent = meta.getViewComponent();
    const previousDesigner = runtimeContext.window.PerspectiveDesigner;
    runtimeContext.window.PerspectiveDesigner = {};

    try {
        const instance = new ViewComponent({
            props: reducedProps,
            emit(payload) {
                return payload;
            },
            store: {
                path: meta.getComponentType(),
                props: {
                    write(path, value) {
                        writes.push([path, value]);
                    }
                }
            }
        });
        instance.rootElement = {
            ownerDocument,
            getBoundingClientRect() {
                return rootRect;
            }
        };

        instance.beginEndpointDrag("start", reducedProps.start, {
            clientX: 40,
            clientY: 60,
            pointerId: 9,
            preventDefault() {},
            stopPropagation() {}
        });

        assert.equal(typeof ownerDocument.getListener("pointermove", true), "function", "drag should register capture-phase pointermove listener");
        assert.equal(typeof ownerDocument.getListener("pointerup", true), "function", "drag should register capture-phase pointerup listener");
        assert.equal(typeof ownerDocument.getListener("pointercancel", true), "function", "drag should register capture-phase pointercancel listener");
        assert.equal(typeof ownerDocument.defaultView.getListener("blur", true), "function", "drag should register capture-phase blur listener");
        assert.equal(instance.state.dragState.endpointKey, "start");
        assert.deepEqual(normalizeForAssertion(instance.state.dragState.previewPoint), { x: 40, y: 60 });

        ownerDocument.getListener("pointermove", true)({
            clientX: 222,
            clientY: 161,
            pointerId: 9
        });

        assert.deepEqual(
            normalizeForAssertion(instance.state.dragState.previewPoint),
            { x: 222, y: 161 },
            "pointermove should update local preview coordinates"
        );
        assert.deepEqual(
            normalizeForAssertion(instance.state.hoverAnchor),
            {
                targetId: "breakerB",
                anchorId: "left",
                point: { x: 220, y: 160 },
                distance: Math.sqrt(5)
            },
            "pointermove should store nearest eligible published anchor"
        );

        const renderedWhileDragging = instance.render();
        const hoverIndicators = collectNodes(
            renderedWhileDragging,
            (node) => node.type === "circle" && node.props && node.props["data-hover-anchor"] === "true",
            []
        );
        assert.equal(hoverIndicators.length, 1, "render should expose one snap hover indicator during drag");
        assert.equal(hoverIndicators[0].props.cx, 220);
        assert.equal(hoverIndicators[0].props.cy, 160);

        ownerDocument.getListener("pointerup", true)({
            clientX: 222,
            clientY: 161,
            pointerId: 9
        });

        assert.deepEqual(normalizeForAssertion(writes), [
            ["start", { mode: "snapped", x: 220, y: 160, targetId: "breakerB", anchorId: "left" }],
            ["fromTargetId", "breakerB"],
            ["fromAnchor", "left"]
        ]);
        assert.equal(instance.state.dragState, null, "pointerup should clear dragState");
        assert.equal(instance.state.hoverAnchor, null, "pointerup should clear hoverAnchor");
        assert.equal(ownerDocument.getListener("pointermove", true), null, "pointerup should remove pointermove listener");
        assert.equal(ownerDocument.getListener("pointerup", true), null, "pointerup should remove pointerup listener");
        assert.equal(ownerDocument.getListener("pointercancel", true), null, "pointerup should remove pointercancel listener");
        assert.equal(ownerDocument.defaultView.getListener("blur", true), null, "pointerup should remove blur listener");

        writes.length = 0;
        instance.beginEndpointDrag("end", reducedProps.end, {
            clientX: 240,
            clientY: 160,
            pointerId: 10,
            preventDefault() {},
            stopPropagation() {}
        });
        ownerDocument.getListener("pointermove", true)({
            clientX: 180,
            clientY: 110,
            pointerId: 10
        });
        assert.deepEqual(
            normalizeForAssertion(instance.state.dragState.previewPoint),
            { x: 180, y: 110 },
            "free drag should still track preview point"
        );
        assert.equal(instance.state.hoverAnchor, null, "move outside snap radius should clear hoverAnchor");
        ownerDocument.getListener("pointerup", true)({
            clientX: 180,
            clientY: 110,
            pointerId: 10
        });

        assert.deepEqual(normalizeForAssertion(writes), [
            ["end", { mode: "free", x: 180, y: 110, targetId: "", anchorId: "" }],
            ["toTargetId", ""],
            ["toAnchor", ""]
        ]);

        instance.beginEndpointDrag("start", reducedProps.start, {
            clientX: 40,
            clientY: 60,
            pointerId: 11,
            preventDefault() {},
            stopPropagation() {}
        });
        assert.equal(typeof ownerDocument.getListener("pointermove", true), "function", "drag should re-register listeners");
        instance.componentWillUnmount();
        assert.equal(ownerDocument.getListener("pointermove", true), null, "unmount should teardown drag listeners");
        assert.equal(ownerDocument.getListener("pointerup", true), null, "unmount should teardown pointerup listener");
        assert.equal(ownerDocument.getListener("pointercancel", true), null, "unmount should teardown pointercancel listener");
        assert.equal(ownerDocument.defaultView.getListener("blur", true), null, "unmount should teardown blur listener");

        writes.length = 0;
        instance.beginEndpointDrag("start", reducedProps.start, {
            clientX: 40,
            clientY: 60,
            pointerId: 12,
            preventDefault() {},
            stopPropagation() {}
        });
        ownerDocument.getListener("pointercancel", true)({
            clientX: 90,
            clientY: 95,
            pointerId: 12
        });
        assert.deepEqual(normalizeForAssertion(writes), [], "pointercancel should not commit endpoint writes");
        assert.equal(instance.state.dragState, null, "pointercancel should clear dragState");
        assert.equal(instance.state.hoverAnchor, null, "pointercancel should clear hoverAnchor");

        instance.beginEndpointDrag("start", reducedProps.start, {
            clientX: 40,
            clientY: 60,
            pointerId: 13,
            preventDefault() {},
            stopPropagation() {}
        });
        ownerDocument.defaultView.getListener("blur", true)();
        assert.deepEqual(normalizeForAssertion(writes), [], "blur cleanup should not commit endpoint writes");
        assert.equal(instance.state.dragState, null, "blur cleanup should clear dragState");
    } finally {
        runtimeContext.window.PerspectiveDesigner = previousDesigner;
    }
}

function assertDesignerHandles(meta, runtimeContext) {
    const reducedProps = meta.getPropsReducer(createTreeStub({
        start: { mode: "free", x: 40, y: 60, targetId: "", anchorId: "" },
        end: { mode: "free", x: 240, y: 160, targetId: "", anchorId: "" }
    }));
    const ViewComponent = meta.getViewComponent();
    const previousDesigner = runtimeContext.window.PerspectiveDesigner;
    runtimeContext.window.PerspectiveDesigner = {};

    try {
        const instance = new ViewComponent({
            props: reducedProps,
            emit(payload) {
                return payload;
            },
            store: {
                path: meta.getComponentType(),
                props: {
                    write() {}
                }
            }
        });
        instance.rootElement = {
            ownerDocument: createOwnerDocument([], null),
            getBoundingClientRect() {
                return createRect(0, 0, 320, 240);
            }
        };

        const rendered = instance.render();
        const svgNodes = collectNodesByType(rendered, "svg", []);
        const hitAreaNodes = collectNodes(rendered, (node) =>
            node.type === "path" && node.props && node.props["data-line-hit-area"] === "true", []
        );
        const handleNodes = collectNodes(rendered, (node) =>
            node.type === "circle" && node.props && node.props["data-endpoint-key"], []
        );

        assert.equal(rendered.props.style.pointerEvents, "auto", "designer root should allow pointer interaction");
        assert.equal(svgNodes.length, 1, "designer render should expose a single svg surface");
        assert.equal(svgNodes[0].props.style.pointerEvents, "auto", "designer svg surface should allow pointer interaction");
        assert.equal(hitAreaNodes.length, 1, "designer render should expose a dedicated line hit area");
        assert.equal(hitAreaNodes[0].props.pointerEvents, "stroke");
        assert.equal(typeof hitAreaNodes[0].props.onPointerEnter, "function");
        assert.equal(typeof hitAreaNodes[0].props.onPointerLeave, "function");
        assert.equal(handleNodes.length, 0, "designer render should not expose endpoint handles until the line is active");

        hitAreaNodes[0].props.onPointerEnter();
        const hoveredRender = instance.render();
        const hoveredHandles = collectNodes(hoveredRender, (node) =>
            node.type === "circle" && node.props && node.props["data-endpoint-key"], []
        );
        assert.equal(hoveredHandles.length, 2, "hovering the line should expose two endpoint handles");
        for (const handleNode of hoveredHandles) {
            assert.equal(handleNode.props.style.pointerEvents, "all");
            assert.equal(typeof handleNode.props.onPointerDown, "function");
        }

        hitAreaNodes[0].props.onPointerLeave();
        const postLeaveRender = instance.render();
        const postLeaveHandles = collectNodes(postLeaveRender, (node) =>
            node.type === "circle" && node.props && node.props["data-endpoint-key"], []
        );
        assert.equal(postLeaveHandles.length, 0, "line leave should hide endpoint handles when not dragging");
    } finally {
        runtimeContext.window.PerspectiveDesigner = previousDesigner;
    }
}

function assertBeginEndpointDragStopsPropagation(meta, reducedProps) {
    const ViewComponent = meta.getViewComponent();
    const instance = new ViewComponent({
        props: reducedProps,
        emit(payload) {
            return payload;
        },
        store: {
            path: meta.getComponentType(),
            props: {
                write() {}
            }
        }
    });

    let prevented = false;
    let stopped = false;
    instance.beginEndpointDrag("start", reducedProps.start, {
        pointerId: 7,
        preventDefault() {
            prevented = true;
        },
        stopPropagation() {
            stopped = true;
        }
    });

    assert.equal(prevented, true, "beginEndpointDrag should prevent default");
    assert.equal(stopped, true, "beginEndpointDrag should stop propagation");
}

function main() {
    const { registrations, context } = loadRuntime();
    const metaByType = new Map(
        registrations.map((meta) => [meta.getComponentType(), meta])
    );
    const failures = [];

    for (const componentType of EXPECTED_COMPONENT_TYPES) {
        const meta = metaByType.get(componentType);
        if (!meta) {
            failures.push(`missing registration for ${componentType}`);
            continue;
        }

        try {
            exerciseMeta(meta);
            if (componentType === "com.miguelgrillo.anchorconnectors.connector_line") {
                const reducedProps = meta.getPropsReducer(createTreeStub());
                assertConnectorLineWriteEndpoint(meta, reducedProps);
                assertDesignerHandles(meta, context);
                assertBeginEndpointDragStopsPropagation(meta, reducedProps);
                assertConnectorLineDragPreviewAndCommit(meta, context);
            }
        } catch (error) {
            failures.push(`${componentType}: ${error && error.stack ? error.stack : error}`);
        }
    }

    if (failures.length > 0) {
        console.error("Anchor connectors regression harness failed.");
        for (const failure of failures) {
            console.error(`- ${failure}`);
        }
        process.exit(1);
    }

    console.log(
        `Anchor connectors regression harness passed for ${EXPECTED_COMPONENT_TYPES.length} component metas.`
    );
}

main();
