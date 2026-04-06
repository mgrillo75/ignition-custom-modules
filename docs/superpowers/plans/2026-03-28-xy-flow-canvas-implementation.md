# XY Flow Canvas Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a brand-new Ignition 8.3 module named `perspective-xyflow-canvas` that packages a self-contained XYFlow-based Perspective component supporting custom SVG nodes, loose connector lines, and endpoint snapping.

**Architecture:** Reuse only the Ignition module/build skeleton from the old module, but replace the runtime with a React XYFlow client bundle. The single Perspective component owns all graph state and interaction. Loose lines are modeled as XYFlow edges plus temporary endpoint anchor nodes.

**Tech Stack:** Ignition 8.3 SDK, Gradle module tools, Java 17, React 18, webpack, XYFlow (`@xyflow/react`), custom SVG assets.

---

### Task 1: Create The New Module Skeleton

**Files:**
- Create: `perspective-xyflow-canvas/**`
- Reuse as source only: `perspective-anchor-connectors/build.gradle.kts`
- Reuse as source only: `perspective-anchor-connectors/settings.gradle.kts`
- Reuse as source only: `perspective-anchor-connectors/common/**`
- Reuse as source only: `perspective-anchor-connectors/gateway/**`
- Reuse as source only: `perspective-anchor-connectors/designer/**`
- Reuse as source only: `perspective-anchor-connectors/web/**`

- [ ] **Step 1: Copy only the module/build skeleton into a new sibling directory**

Copy the minimal module structure into `perspective-xyflow-canvas`, excluding generated folders and old runtime files:

```powershell
New-Item -ItemType Directory -Force perspective-xyflow-canvas
```

- [ ] **Step 2: Rename module metadata**

Update the new module to use fresh ids/names:

- root project name: `perspective-xyflow-canvas`
- module file: `PerspectiveXYFlowCanvas`
- module id: `com.miguelgrillo.ignition.xyflowcanvas`
- Java package root: `com.miguelgrillo.ignition.xyflowcanvas`

- [ ] **Step 3: Reduce the module to one Perspective component**

Keep one component descriptor, one gateway hook, and one designer hook. Remove all old component registrations from the copied skeleton.

- [ ] **Step 4: Run a structural build smoke test**

Run: `.\gradlew.bat clean build`

Expected: the new module structure configures successfully, even if the client runtime is still incomplete.

### Task 2: Define The Canvas Component Contract

**Files:**
- Create: `perspective-xyflow-canvas/common/src/main/java/.../common/XYFlowCanvasComponents.java`
- Create: `perspective-xyflow-canvas/common/src/main/java/.../common/comp/XYFlowCanvas.java`
- Create: `perspective-xyflow-canvas/common/src/main/resources/xy-flow-canvas.props.json`

- [ ] **Step 1: Write a failing schema/runtime expectation**

Define the desired top-level props for the single component:

- `document`
- `viewport`
- `settings`
- `toolbox`
- `selection`
- `style`

- [ ] **Step 2: Implement the descriptor/constants classes**

Create the constants/browser-resource class and one `ComponentDescriptor` for `XY Flow Canvas`.

- [ ] **Step 3: Implement the JSON schema**

Include at minimum:

- document nodes/edges collections
- toolbox visibility/settings
- grid/snap settings
- style

- [ ] **Step 4: Register the component in gateway/designer**

Run: `.\gradlew.bat clean build`

Expected: the module builds with one registered component and one schema.

### Task 3: Build The XYFlow Client Bundle

**Files:**
- Create: `perspective-xyflow-canvas/web/package.json`
- Create: `perspective-xyflow-canvas/web/build.gradle.kts`
- Create: `perspective-xyflow-canvas/web/packages/client/package.json`
- Create: `perspective-xyflow-canvas/web/packages/client/webpack.config.js`
- Create: `perspective-xyflow-canvas/web/packages/client/src/index.jsx`
- Create: `perspective-xyflow-canvas/web/packages/client/src/xy-flow-canvas.jsx`
- Create: `perspective-xyflow-canvas/web/packages/client/src/state/**`
- Create: `perspective-xyflow-canvas/web/packages/client/src/components/**`

- [ ] **Step 1: Add XYFlow as the core client dependency**

Use `@xyflow/react` directly in the client package. The bundle must import XYFlow CSS and register the Perspective component.

- [ ] **Step 2: Build a minimal render-only canvas**

Render a mounted ReactFlow surface inside the Perspective component with empty/default document state.

- [ ] **Step 3: Verify the bundle packages into the module**

Run: `.\gradlew.bat clean build`

Expected: the generated mounted JS exists and the module includes the web jar.

### Task 4: Add Custom SVG Node Types

**Files:**
- Create: `perspective-xyflow-canvas/web/packages/client/src/nodes/**`
- Create: `perspective-xyflow-canvas/web/packages/client/src/assets/**`
- Source assets: `custom-components-anchor-connectors/*.svg`

- [ ] **Step 1: Import the SVG families into the new module**

Copy the required SVG assets into the new module client assets.

- [ ] **Step 2: Implement XYFlow custom node renderers**

Create renderers for the V1 node set:

- breaker
- genset panel variants
- modern valve control variants
- modern tank variants
- modern line variants

- [ ] **Step 3: Add explicit handle placement**

Each custom node renderer must expose visible/hoverable handles at intended connection points.

- [ ] **Step 4: Verify node rendering**

Run: `.\gradlew.bat clean build`

Expected: the component bundle builds with the custom nodes wired in.

### Task 5: Implement Loose Connector Lines

**Files:**
- Create: `perspective-xyflow-canvas/web/packages/client/src/connectors/**`
- Modify: `perspective-xyflow-canvas/web/packages/client/src/xy-flow-canvas.jsx`
- Modify: `perspective-xyflow-canvas/web/packages/client/src/state/**`

- [ ] **Step 1: Write a failing connector-state test or harness**

Cover the model:

- dropping a new loose line creates two free endpoints
- attaching an endpoint to a node handle converts that endpoint from free to attached
- moving a snapped node keeps the connector attached

- [ ] **Step 2: Implement the connector model**

Use:

- one visible XYFlow edge
- zero/one/two internal endpoint anchor nodes for free ends

- [ ] **Step 3: Implement reconnect/drop behavior**

Use XYFlow reconnect events to:

- attach to real handles
- keep free endpoints free when dropped on empty canvas
- preserve stable connector ids

- [ ] **Step 4: Implement orthogonal/custom connector visuals**

Use a custom edge type so the line appearance matches the intended diagram style.

- [ ] **Step 5: Verify loose-line behavior**

Run: `.\gradlew.bat clean build`

Expected: the bundle builds and the connector model is stable under reconnect.

### Task 6: Build The In-Canvas Toolbox

**Files:**
- Create: `perspective-xyflow-canvas/web/packages/client/src/toolbox/**`
- Modify: `perspective-xyflow-canvas/web/packages/client/src/xy-flow-canvas.jsx`

- [ ] **Step 1: Implement toolbox UI**

Include tools for:

- custom SVG nodes
- loose connector line

- [ ] **Step 2: Implement drag/drop or pointer-drop insertion**

Users must be able to add nodes and lines without editing raw component props.

- [ ] **Step 3: Verify authoring workflow**

Run: `.\gradlew.bat clean build`

Expected: the canvas bundle still packages cleanly with toolbox code included.

### Task 7: Final Build And Delivery

**Files:**
- Verify: `perspective-xyflow-canvas/build/PerspectiveXYFlowCanvas.unsigned.modl`
- Verify: `perspective-xyflow-canvas/build/buildResult.json`

- [ ] **Step 1: Run full build**

Run: `.\gradlew.bat clean build`

Expected: `BUILD SUCCESSFUL`

- [ ] **Step 2: Confirm artifact**

Expected file:

`perspective-xyflow-canvas/build/PerspectiveXYFlowCanvas.unsigned.modl`

- [ ] **Step 3: Confirm module metadata**

Check `build/buildResult.json` for the final module id/version/file name.
