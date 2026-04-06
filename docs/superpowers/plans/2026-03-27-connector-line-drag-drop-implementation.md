# Connector Line Drag/Drop Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add PowerPoint-style endpoint drag/drop snapping to `Connector Line` so users can author snapped connections in Ignition Designer without manually editing `fromTargetId` / `toTargetId` text props.

**Architecture:** Keep `Connector Line` as a normal Perspective component and extend it with an explicit endpoint model (`start` / `end`) that supports both `free` and `snapped` states. Implement the first drag/drop release directly in the existing browser runtime so the component can render Designer-only handles, preview snapping against published anchors, and persist prop writes through the component store while preserving the existing routed-line rendering and legacy `from*` / `to*` compatibility.

**Tech Stack:** Ignition 8.3 Perspective module SDK, Java 17, Gradle multi-project module build, mounted browser resources, React-compatible Perspective component API, Node-based regression harness, existing DOM-published anchor contract.

---

**Repository note:** `C:\Users\MiguelGrillo\Documents\cursor\ignition-custom-modules` is not a git repository right now, so each "commit" step below is replaced with a concrete verification checkpoint plus the exact commit command to use later if the module is moved into git.

## File Structure

- Modify: `perspective-anchor-connectors/common/src/main/resources/connector-line.props.json`
  - Add the new persisted endpoint model: `start`, `end`, optional drag tuning values, and keep legacy line props for backward compatibility.
- Modify: `perspective-anchor-connectors/gateway/src/main/resources/mounted/js/anchor-connectors.js`
  - Extend the `ConnectorLine` reducer, endpoint normalization, layout resolution, Designer-only drag state, snap preview, prop writes, and fallback rendering.
- Modify: `perspective-anchor-connectors/scripts/anchor-connectors-regression.js`
  - Add regression coverage for default endpoint shape, free-endpoint rendering, snapped-endpoint rendering, and no-throw designer helper wiring.
- Modify: `perspective-anchor-connectors/build.gradle.kts`
  - Bump the module version only after the feature is stable enough to ship a fresh `.modl`.

### Task 1: Add the Explicit Endpoint Model

**Files:**
- Modify: `perspective-anchor-connectors/common/src/main/resources/connector-line.props.json`
- Modify: `perspective-anchor-connectors/scripts/anchor-connectors-regression.js`
- Test: `perspective-anchor-connectors/scripts/anchor-connectors-regression.js`

- [ ] **Step 1: Write the failing regression for the new endpoint defaults**

Add this assertion helper near `exerciseMeta(meta)` in `perspective-anchor-connectors/scripts/anchor-connectors-regression.js`:

```js
function assertConnectorLineDefaults(reducedProps) {
    assert.equal(reducedProps.start.mode, "free");
    assert.equal(typeof reducedProps.start.x, "number");
    assert.equal(typeof reducedProps.start.y, "number");
    assert.equal(reducedProps.end.mode, "free");
    assert.equal(typeof reducedProps.end.x, "number");
    assert.equal(typeof reducedProps.end.y, "number");
    assert.equal(reducedProps.fromTargetId, "breakerA");
    assert.equal(reducedProps.toTargetId, "breakerB");
}
```

Then call it from `exerciseMeta(meta)` when `componentType === "com.miguelgrillo.anchorconnectors.connector_line"`.

- [ ] **Step 2: Run the regression harness to verify it fails**

Run:

```powershell
node .\scripts\anchor-connectors-regression.js
```

Expected: FAIL because `reducedProps.start` and `reducedProps.end` do not exist yet.

- [ ] **Step 3: Add the new endpoint props while preserving legacy fields**

Update `perspective-anchor-connectors/common/src/main/resources/connector-line.props.json` so `start` and `end` are required, but the legacy routing props remain available:

```json
"required": [
  "targetId",
  "start",
  "end",
  "fromTargetId",
  "fromAnchor",
  "toTargetId",
  "toAnchor",
  "stroke",
  "strokeWidth",
  "cornerRadius",
  "markerEnd",
  "label",
  "orthogonal",
  "pollIntervalMs",
  "showLabel",
  "glowIntensity",
  "anchorPoints",
  "style"
],
"start": {
  "type": "object",
  "additionalProperties": false,
  "required": ["mode", "x", "y", "targetId", "anchorId"],
  "properties": {
    "mode": { "type": "string", "enum": ["free", "snapped"], "default": "free" },
    "x": { "type": "number", "default": 120 },
    "y": { "type": "number", "default": 120 },
    "targetId": { "type": "string", "default": "" },
    "anchorId": { "type": "string", "default": "" }
  },
  "default": {
    "mode": "free",
    "x": 120,
    "y": 120,
    "targetId": "",
    "anchorId": ""
  }
},
"end": {
  "type": "object",
  "additionalProperties": false,
  "required": ["mode", "x", "y", "targetId", "anchorId"],
  "properties": {
    "mode": { "type": "string", "enum": ["free", "snapped"], "default": "free" },
    "x": { "type": "number", "default": 520 },
    "y": { "type": "number", "default": 320 },
    "targetId": { "type": "string", "default": "" },
    "anchorId": { "type": "string", "default": "" }
  },
  "default": {
    "mode": "free",
    "x": 520,
    "y": 320,
    "targetId": "",
    "anchorId": ""
  }
}
```

Do not remove `fromTargetId`, `fromAnchor`, `toTargetId`, or `toAnchor` in this task.

- [ ] **Step 4: Re-run the regression harness to verify the new defaults exist**

Run:

```powershell
node .\scripts\anchor-connectors-regression.js
```

Expected: PASS on the new default-shape assertions once the reducer work from Task 2 lands; for this task alone the harness may still fail later on layout logic, which is acceptable as long as the reported failure moved past "start is undefined".

- [ ] **Step 5: Checkpoint the schema change**

Run:

```powershell
Select-String -Path .\common\src\main\resources\connector-line.props.json -Pattern '"start"|\"end\"'
```

If this module is later moved into git, use:

```powershell
git add .\common\src\main\resources\connector-line.props.json .\scripts\anchor-connectors-regression.js
git commit -m "feat: add connector line endpoint model"
```

### Task 2: Teach the Runtime to Resolve the New Endpoint Model

**Files:**
- Modify: `perspective-anchor-connectors/gateway/src/main/resources/mounted/js/anchor-connectors.js`
- Modify: `perspective-anchor-connectors/scripts/anchor-connectors-regression.js`
- Test: `perspective-anchor-connectors/scripts/anchor-connectors-regression.js`

- [ ] **Step 1: Write a failing regression for free endpoints and snapped endpoints**

Extend `perspective-anchor-connectors/scripts/anchor-connectors-regression.js` with two explicit line render cases:

```js
function renderConnectorLine(meta, values) {
    const reducedProps = meta.getPropsReducer(createTreeStub(values));
    const ViewComponent = meta.getViewComponent();
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
    return instance.render();
}
```

Then add both calls under the connector-line branch:

```js
renderConnectorLine(meta, {
    start: { mode: "free", x: 40, y: 60, targetId: "", anchorId: "" },
    end: { mode: "free", x: 240, y: 160, targetId: "", anchorId: "" }
});

renderConnectorLine(meta, {
    start: { mode: "snapped", x: 0, y: 0, targetId: "breakerA", anchorId: "right" },
    end: { mode: "snapped", x: 0, y: 0, targetId: "breakerB", anchorId: "left" }
});
```

- [ ] **Step 2: Run the regression harness to verify it fails on missing endpoint support**

Run:

```powershell
node .\scripts\anchor-connectors-regression.js
```

Expected: FAIL because `normalizeLineConnection(props)` and `ConnectorLineMeta.getPropsReducer(tree)` still only understand the legacy `from*` / `to*` shape.

- [ ] **Step 3: Implement endpoint normalization and layout resolution**

In `perspective-anchor-connectors/gateway/src/main/resources/mounted/js/anchor-connectors.js`, add these helpers above `normalizeLineConnection(props)`:

```js
function normalizeEndpointState(rawEndpoint, fallback) {
    const candidate = rawEndpoint && typeof rawEndpoint === "object" ? rawEndpoint : {};
    const mode = candidate.mode === "snapped" ? "snapped" : "free";
    return {
        mode,
        x: normalizeNumber(candidate.x, fallback.x),
        y: normalizeNumber(candidate.y, fallback.y),
        targetId: candidate.targetId ? String(candidate.targetId) : "",
        anchorId: candidate.anchorId ? normalizeAnchorRef(candidate.anchorId, "") : ""
    };
}

function buildLegacyEndpoint(rawTargetId, rawAnchorId, fallback) {
    if (!rawTargetId) {
        return fallback;
    }
    return {
        mode: "snapped",
        x: fallback.x,
        y: fallback.y,
        targetId: String(rawTargetId),
        anchorId: normalizeAnchorRef(rawAnchorId, "")
    };
}

function resolveEndpointPoint(endpoint, rootRect, ownerDocument, legacyTargetId, legacyAnchorId) {
    if (endpoint.mode === "snapped" && ownerDocument && endpoint.targetId) {
        const targetElement = findTargetElementById(ownerDocument, endpoint.targetId || legacyTargetId);
        const anchorPoint = targetElement
            ? readAnchorPoint(targetElement, endpoint.anchorId || legacyAnchorId, rootRect)
            : null;
        if (anchorPoint) {
            return anchorPoint;
        }
    }
    return {
        x: endpoint.x,
        y: endpoint.y
    };
}
```

Then update `normalizeLineConnection(props)` to return `start` and `end`:

```js
const defaultStart = { mode: "free", x: 120, y: 120, targetId: "", anchorId: "" };
const defaultEnd = { mode: "free", x: 520, y: 320, targetId: "", anchorId: "" };
const legacyStart = buildLegacyEndpoint(rawProps && rawProps.fromTargetId, rawProps && rawProps.fromAnchor, defaultStart);
const legacyEnd = buildLegacyEndpoint(rawProps && rawProps.toTargetId, rawProps && rawProps.toAnchor, defaultEnd);

return {
    targetId: rawProps && rawProps.targetId ? String(rawProps.targetId) : "connectorLine",
    start: normalizeEndpointState(rawProps && rawProps.start, legacyStart),
    end: normalizeEndpointState(rawProps && rawProps.end, legacyEnd),
    fromTargetId: rawProps && rawProps.fromTargetId ? String(rawProps.fromTargetId) : "",
    fromAnchor: normalizeAnchorRef(rawProps && rawProps.fromAnchor, ""),
    toTargetId: rawProps && rawProps.toTargetId ? String(rawProps.toTargetId) : "",
    toAnchor: normalizeAnchorRef(rawProps && rawProps.toAnchor, ""),
    ...
};
```

Update `ConnectorLineMeta.getPropsReducer(tree)` the same way so reducer defaults include `start` and `end`.

Finally, replace the `resolveConnectorLayout(lineConnection, rootRect, ownerDocument, orthogonal)` call in `ConnectorLine.render()` with a layout built from the endpoint points:

```js
const startPoint = resolveEndpointPoint(lineConnection.start, rootRect, ownerDocument, lineConnection.fromTargetId, lineConnection.fromAnchor);
const endPoint = resolveEndpointPoint(lineConnection.end, rootRect, ownerDocument, lineConnection.toTargetId, lineConnection.toAnchor);
const layout = (rootRect && ownerDocument)
    ? resolveConnectorLayoutFromPoints(lineConnection, rootRect, startPoint, endPoint, orthogonal)
    : null;
```

`resolveConnectorLayoutFromPoints(...)` should reuse the existing stroke, label, corner radius, and orthogonal routing logic rather than changing the SVG appearance.

- [ ] **Step 4: Re-run the regression harness until both endpoint modes render without throwing**

Run:

```powershell
node .\scripts\anchor-connectors-regression.js
```

Expected: PASS with the connector line still rendering under the legacy props and under explicit `start` / `end`.

- [ ] **Step 5: Checkpoint the runtime compatibility change**

Run:

```powershell
node .\scripts\anchor-connectors-regression.js
Select-String -Path .\gateway\src\main\resources\mounted\js\anchor-connectors.js -Pattern 'normalizeEndpointState|resolveEndpointPoint|resolveConnectorLayoutFromPoints'
```

If this module is later moved into git, use:

```powershell
git add .\gateway\src\main\resources\mounted\js\anchor-connectors.js .\scripts\anchor-connectors-regression.js
git commit -m "feat: add connector line endpoint compatibility"
```

### Task 3: Add Designer-Only Drag Handles to Connector Line

**Files:**
- Modify: `perspective-anchor-connectors/gateway/src/main/resources/mounted/js/anchor-connectors.js`
- Modify: `perspective-anchor-connectors/common/src/main/resources/connector-line.props.json`
- Test: `perspective-anchor-connectors/scripts/anchor-connectors-regression.js`

- [ ] **Step 1: Add a failing regression for the store writer resolver**

Add this helper to `perspective-anchor-connectors/scripts/anchor-connectors-regression.js` and call it from the connector-line branch:

```js
function assertStoreWriterResolver(meta) {
    const reducedProps = meta.getPropsReducer(createTreeStub());
    const ViewComponent = meta.getViewComponent();
    const instance = new ViewComponent({
        props: reducedProps,
        emit(payload) {
            return payload;
        },
        store: {
            path: meta.getComponentType(),
            element: null,
            props: {
                write(path, value) {
                    return { path, value };
                }
            }
        }
    });
    assert.equal(typeof instance.resolvePropWriter, "function");
    assert.equal(typeof instance.resolvePropWriter(), "function");
}
```

- [ ] **Step 2: Run the regression harness to verify it fails**

Run:

```powershell
node .\scripts\anchor-connectors-regression.js
```

Expected: FAIL because `ConnectorLine` does not expose `resolvePropWriter()` or any drag helpers yet.

- [ ] **Step 3: Implement the authoring state and the writer resolver**

In `perspective-anchor-connectors/gateway/src/main/resources/mounted/js/anchor-connectors.js`, expand `ConnectorLine` state and add a store-writer resolver:

```js
this.state = {
    pollTick: 0,
    dragState: null,
    hoverAnchor: null
};
```

Add these instance methods on `ConnectorLine`:

```js
isDesignerSurface() {
    return typeof window !== "undefined" && !!window.PerspectiveDesigner;
}

resolvePropWriter() {
    const store = this.props && this.props.store;
    if (store && store.props && typeof store.props.write === "function") {
        return (path, value) => store.props.write(path, value);
    }
    if (store && typeof store.write === "function") {
        return (path, value) => store.write(path, value);
    }
    throw new Error("ConnectorLine could not resolve a writable store API.");
}

writeEndpoint(endpointKey, endpointValue) {
    const write = this.resolvePropWriter();
    write(endpointKey, endpointValue);
    if (endpointKey === "start") {
        write("fromTargetId", endpointValue.mode === "snapped" ? endpointValue.targetId : "");
        write("fromAnchor", endpointValue.mode === "snapped" ? endpointValue.anchorId : "");
    } else {
        write("toTargetId", endpointValue.mode === "snapped" ? endpointValue.targetId : "");
        write("toAnchor", endpointValue.mode === "snapped" ? endpointValue.anchorId : "");
    }
}
```

Add new optional props to `connector-line.props.json` for authoring UX:

```json
"designerHandleRadius": {
  "type": "number",
  "default": 8,
  "minimum": 4,
  "maximum": 24
},
"snapRadius": {
  "type": "number",
  "default": 22,
  "minimum": 8,
  "maximum": 64
}
```

- [ ] **Step 4: Render the handles in Designer only**

Still in `ConnectorLine.render()`, render endpoint handles only when `isDesignerSurface()` is true:

```js
const handleNodes = this.isDesignerSurface() && layout ? [
    this.renderEndpointHandle("start", startPoint, lineConnection),
    this.renderEndpointHandle("end", endPoint, lineConnection)
] : [];
```

Make each handle use `pointerEvents: "all"` while the line path itself stays visually unchanged:

```js
renderEndpointHandle(endpointKey, point, lineConnection) {
    const handleRadius = clamp(normalizeNumber(lineConnection.designerHandleRadius, 8), 4, 24);
    return React.createElement("circle", {
        key: `${endpointKey}-handle`,
        cx: point.x,
        cy: point.y,
        r: handleRadius,
        fill: "#ffffff",
        stroke: "#4b5563",
        strokeWidth: 2,
        style: {
            cursor: "grab",
            pointerEvents: "all"
        },
        onPointerDown: (event) => this.beginEndpointDrag(event, endpointKey, point, lineConnection)
    });
}
```

- [ ] **Step 5: Checkpoint the handle-only authoring state**

Run:

```powershell
node .\scripts\anchor-connectors-regression.js
Select-String -Path .\gateway\src\main\resources\mounted\js\anchor-connectors.js -Pattern 'resolvePropWriter|renderEndpointHandle|beginEndpointDrag'
```

If this module is later moved into git, use:

```powershell
git add .\gateway\src\main\resources\mounted\js\anchor-connectors.js .\common\src\main\resources\connector-line.props.json .\scripts\anchor-connectors-regression.js
git commit -m "feat: add designer handles for connector line"
```

### Task 4: Implement Drag, Snap Preview, and Prop Persistence

**Files:**
- Modify: `perspective-anchor-connectors/gateway/src/main/resources/mounted/js/anchor-connectors.js`
- Test: `perspective-anchor-connectors/scripts/anchor-connectors-regression.js`

- [ ] **Step 1: Write a failing regression for anchor hit-testing**

Add a helper-level test case to `perspective-anchor-connectors/scripts/anchor-connectors-regression.js`:

```js
function assertNearestAnchorSelection(registrations) {
    const lineMeta = registrations.find((meta) => meta.getComponentType() === "com.miguelgrillo.anchorconnectors.connector_line");
    assert.ok(lineMeta, "connector_line meta should exist");
}
```

This is intentionally light because the hit-testing helper will be exercised through direct function calls once it exists.

- [ ] **Step 2: Implement drag lifecycle helpers in ConnectorLine**

Add these instance methods to `ConnectorLine` in `perspective-anchor-connectors/gateway/src/main/resources/mounted/js/anchor-connectors.js`:

```js
beginEndpointDrag(event, endpointKey, point, lineConnection) {
    event.preventDefault();
    event.stopPropagation();
    const ownerDocument = this.rootElement ? this.rootElement.ownerDocument : document;
    ownerDocument.addEventListener("pointermove", this.onPointerMove, true);
    ownerDocument.addEventListener("pointerup", this.onPointerUp, true);
    this.setState({
        dragState: {
            endpointKey,
            previewPoint: point,
            lineConnection
        },
        hoverAnchor: null
    });
}

onPointerMove = (event) => {
    const previewPoint = this.toLocalPoint(event.clientX, event.clientY);
    const hoverAnchor = this.findNearestPublishedAnchor(previewPoint);
    this.setState({
        dragState: Object.assign({}, this.state.dragState, { previewPoint }),
        hoverAnchor
    });
};

onPointerUp = () => {
    const dragState = this.state.dragState;
    const hoverAnchor = this.state.hoverAnchor;
    if (dragState) {
        this.commitEndpointDrag(dragState.endpointKey, dragState.previewPoint, hoverAnchor);
    }
    this.teardownDragListeners();
    this.setState({
        dragState: null,
        hoverAnchor: null
    });
};
```

Also add:

```js
function distanceBetween(pointA, pointB) {
    const dx = pointA.x - pointB.x;
    const dy = pointA.y - pointB.y;
    return Math.sqrt((dx * dx) + (dy * dy));
}

function readAnchorNodePoint(node, rootRect) {
    if (!node || !rootRect) {
        return null;
    }
    const rawX = normalizeNumber(node.getAttribute("data-anchor-x"), NaN);
    const rawY = normalizeNumber(node.getAttribute("data-anchor-y"), NaN);
    if (!Number.isNaN(rawX) && !Number.isNaN(rawY)) {
        return { x: rawX, y: rawY };
    }
    const rect = node.getBoundingClientRect();
    return {
        x: rect.left + (rect.width / 2) - rootRect.left,
        y: rect.top + (rect.height / 2) - rootRect.top
    };
}

toLocalPoint(clientX, clientY) {
    const rect = this.rootElement ? this.rootElement.getBoundingClientRect() : { left: 0, top: 0 };
    return {
        x: clientX - rect.left,
        y: clientY - rect.top
    };
}

findNearestPublishedAnchor(localPoint) {
    if (!this.rootElement) {
        return null;
    }
    const ownerDocument = this.rootElement.ownerDocument;
    const candidates = Array.from(ownerDocument.querySelectorAll("[data-anchor-target-id] [data-anchor-id], [data-anchor-id]"));
    const snapRadius = clamp(normalizeNumber(this.props.props.snapRadius, 22), 8, 64);
    let best = null;
    for (const node of candidates) {
        const anchorPoint = readAnchorNodePoint(node, this.rootElement.getBoundingClientRect());
        if (!anchorPoint) {
            continue;
        }
        const distance = distanceBetween(localPoint, anchorPoint);
        if (distance <= snapRadius && (!best || distance < best.distance)) {
            best = {
                distance,
                point: anchorPoint,
                targetId: node.getAttribute("data-anchor-target-id") || "",
                anchorId: node.getAttribute("data-anchor-id") || ""
            };
        }
    }
    return best;
}

teardownDragListeners() {
    const ownerDocument = this.rootElement ? this.rootElement.ownerDocument : document;
    ownerDocument.removeEventListener("pointermove", this.onPointerMove, true);
    ownerDocument.removeEventListener("pointerup", this.onPointerUp, true);
}
```

- [ ] **Step 3: Persist the snapped or free endpoint on drop**

Add this commit helper:

```js
commitEndpointDrag(endpointKey, previewPoint, hoverAnchor) {
    if (hoverAnchor && hoverAnchor.targetId && hoverAnchor.anchorId) {
        this.writeEndpoint(endpointKey, {
            mode: "snapped",
            x: hoverAnchor.point.x,
            y: hoverAnchor.point.y,
            targetId: hoverAnchor.targetId,
            anchorId: hoverAnchor.anchorId
        });
        return;
    }
    this.writeEndpoint(endpointKey, {
        mode: "free",
        x: previewPoint.x,
        y: previewPoint.y,
        targetId: "",
        anchorId: ""
    });
}
```

Then make `render()` use preview points while dragging:

```js
const activeDrag = this.state.dragState;
const previewStart = activeDrag && activeDrag.endpointKey === "start" ? activeDrag.previewPoint : startPoint;
const previewEnd = activeDrag && activeDrag.endpointKey === "end" ? activeDrag.previewPoint : endPoint;
const layout = (rootRect && ownerDocument)
    ? resolveConnectorLayoutFromPoints(lineConnection, rootRect, previewStart, previewEnd, orthogonal)
    : null;
```

Also render the current `hoverAnchor` highlight:

```js
const hoverNode = this.state.hoverAnchor ? React.createElement("circle", {
    key: "hover-anchor",
    cx: this.state.hoverAnchor.point.x,
    cy: this.state.hoverAnchor.point.y,
    r: clamp(normalizeNumber(props.snapRadius, 22), 8, 64) / 3,
    fill: "#16a34a",
    stroke: "#ffffff",
    strokeWidth: 2,
    style: { pointerEvents: "none" }
}) : null;
```

- [ ] **Step 4: Re-run the regression harness and build the module**

Run:

```powershell
node .\scripts\anchor-connectors-regression.js
.\gradlew.bat build
```

Expected:
- `Anchor connectors regression harness passed for 11 component metas.`
- `BUILD SUCCESSFUL`

- [ ] **Step 5: Checkpoint the drag/drop authoring behavior**

Run:

```powershell
Select-String -Path .\gateway\src\main\resources\mounted\js\anchor-connectors.js -Pattern 'beginEndpointDrag|findNearestPublishedAnchor|commitEndpointDrag|hover-anchor'
Get-Item .\build\PerspectiveAnchorConnectors.unsigned.modl
```

If this module is later moved into git, use:

```powershell
git add .\gateway\src\main\resources\mounted\js\anchor-connectors.js .\scripts\anchor-connectors-regression.js
git commit -m "feat: add drag and drop snapping for connector line"
```

### Task 5: Ship the Updated Module and Verify the User Workflow

**Files:**
- Modify: `perspective-anchor-connectors/build.gradle.kts`
- Test: `perspective-anchor-connectors/scripts/anchor-connectors-regression.js`
- Test: `perspective-anchor-connectors/build/PerspectiveAnchorConnectors.unsigned.modl`

- [ ] **Step 1: Bump the module version for a clean Ignition upgrade**

Update `perspective-anchor-connectors/build.gradle.kts`:

```kotlin
version = "0.1.3-SNAPSHOT"
```

Use the next available version if `0.1.3-SNAPSHOT` is already taken by the time implementation reaches this step.

- [ ] **Step 2: Rebuild the module from a clean state**

Run:

```powershell
.\gradlew.bat clean build
```

Expected: `BUILD SUCCESSFUL`

- [ ] **Step 3: Verify the built artifact version**

Run:

```powershell
Get-Content .\build\buildResult.json
jar xf .\build\PerspectiveAnchorConnectors.unsigned.modl module.xml
Get-Content .\module.xml
Remove-Item .\module.xml
```

Expected: `module.xml` version matches `0.1.3-SNAPSHOT` (or the exact bumped version used in Step 1).

- [ ] **Step 4: Perform the manual Designer workflow check**

Manual verification checklist in Ignition Designer:

```text
1. Drop two anchor-aware target components in the same container.
2. Drop one Connector Line component and resize it so both targets fall inside its bounds.
3. Drag the start handle onto target A and verify it snaps to a valid anchor.
4. Drag the end handle onto target B and verify it snaps to a valid anchor.
5. Move target A and verify the line stays attached.
6. Move target B and verify the line stays attached.
7. Drag one endpoint into empty space and verify it becomes a free endpoint.
8. Save and reopen Designer and verify the connection persists.
```

- [ ] **Step 5: Final checkpoint**

Run:

```powershell
node .\scripts\anchor-connectors-regression.js
.\gradlew.bat build
Get-Item .\build\PerspectiveAnchorConnectors.unsigned.modl
```

If this module is later moved into git, use:

```powershell
git add .\build.gradle.kts .\common\src\main\resources\connector-line.props.json .\gateway\src\main\resources\mounted\js\anchor-connectors.js .\scripts\anchor-connectors-regression.js
git commit -m "feat: ship connector line drag and drop authoring"
```

## Self-Review

### 1. Spec coverage

- PowerPoint-style workflow: covered by Task 3 and Task 4.
- No manual text editing for normal use: covered by Task 4 persistence on drop.
- `Connector Line` stays the authoring surface: covered throughout; `Connector Overlay` is untouched.
- Snap to anchor-aware components: covered by `findNearestPublishedAnchor(...)` in Task 4.
- Persist snapped state while preserving bindable line props: covered by Task 1, Task 2, and Task 3.
- Keep existing runtime line appearance and routing: covered by Task 2 reuse of existing layout/render logic.
- Designer-only handles: covered by `isDesignerSurface()` in Task 3.
- Build a new installable `.modl`: covered by Task 5.

### 2. Placeholder scan

- No `TODO`, `TBD`, or "implement later" placeholders remain.
- Each code-changing step includes an actual code block.
- Each verification step includes an actual command and expected outcome.

### 3. Type consistency

- Persisted endpoint keys are consistently `start` and `end`.
- Endpoint state keys are consistently `mode`, `x`, `y`, `targetId`, `anchorId`.
- Legacy compatibility keys remain consistently `fromTargetId`, `fromAnchor`, `toTargetId`, `toAnchor`.
- Runtime helper names are consistent across the plan: `normalizeEndpointState`, `resolveEndpointPoint`, `resolvePropWriter`, `beginEndpointDrag`, `commitEndpointDrag`.
