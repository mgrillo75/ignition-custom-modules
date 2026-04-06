# Isometric Perspective Components (Ignition 8.3)

This module adds custom **isometric SVG components** to the Ignition Perspective component palette as individual entries:

- `Pump (Iso)`
- `Valve (Iso)`
- `Tank (Iso)`
- `Genset (Iso)`
- `Test SVG (Iso)` (minimal property-binding validation component)
- `Busbar H Horizontal` (in **Custom 2D Images** palette section)
- `Busbar V Vertical` (in **Custom 2D Images** palette section)
- `Busbar Segment Horizontal` (in **Custom 2D Images** palette section)
- `Busbar Segment Vertical` (in **Custom 2D Images** palette section)
- `Breaker Closed`
- `Breaker Open`
- `Circuit Breaker Modern`
- `Control Valve Modern`
- `Genset Closed`
- `Genset Open`
- `Genset Sync`
- `Telemetry Panel`

Each component exposes bindable props (colors, status, label/value text, visibility flags, style), so you can bind them directly to tags in the Perspective Property Editor.

## What this gives you

- New Perspective palette categories:
  - **Isometric SVG**
  - **Custom 2D Images**
- Per-component bindable properties:
  - `bodyColor`, `accentColor`, `strokeColor`
  - `status` (`off`, `running`, `fault`) + state colors
  - `label`, `value`
  - `showLabel`, `showValue`, `showStatus`
  - `labelColor`, `valueColor`
  - `style`
- Runtime rendering from mounted JS (`/res/isometric-components/js/isometric-components.js`)

## Build

From this folder:

```powershell
.\gradlew.bat build
```

The generated module file is created under:

`build\IsometricPerspectiveComponents.unsigned.modl`

Install that file in Gateway Web UI: `Config -> Modules`.

## Use in Perspective

1. Open Designer.
2. In the Perspective component palette, find **Isometric SVG** or **Custom 2D Images**.
3. Drag `Pump (Iso)`, `Valve (Iso)`, `Tank (Iso)`, `Genset (Iso)`, `Test SVG (Iso)`, or any `Custom 2D Images` busbar component into a view.
4. In the Property Editor, bind properties such as:
   - `props.status` to a string/memory tag (`off|running|fault`)
   - `props.bodyColor` to an expression/transform output color
   - `props.value` to a formatted process-value tag
   - `props.fillColor` on `Test SVG (Iso)` for a quick binding validation
   - `props.energized` and `props.energizedTopColor` on `Busbar H Horizontal`
   - `props.energized` and `props.energizedLeftColor` on `Busbar V Vertical`
   - `props.markerCount` and `props.markerColor` on `Busbar Segment Horizontal` / `Busbar Segment Vertical`
   - `props.colorOverrides`, `props.textOverrides`, `props.globalFillColor`, and `props.globalStrokeColor` on the new imported Custom 2D SVG components

## SVG authoring workflow (Inkscape -> component)

Use Inkscape to create/modify shapes, then map those paths into the JS component file:

1. Draw/edit in Inkscape.
2. Export as **Plain SVG**.
3. Copy relevant `path`, `polygon`, `rect`, `ellipse`, `line` data.
4. Add/update the corresponding React SVG nodes in:
   - `gateway/src/main/resources/mounted/js/isometric-components.js`
5. Expose any new dynamic properties in the schema file(s):
   - `common/src/main/resources/isometric-pump.props.json`
   - `common/src/main/resources/isometric-valve.props.json`
   - `common/src/main/resources/isometric-tank.props.json`
   - `common/src/main/resources/isometric-genset.props.json`
   - `common/src/main/resources/isometric-testsvg.props.json`
   - `common/src/main/resources/custom2d-busbar-h-energized.props.json`
   - `common/src/main/resources/custom2d-busbar-v-energized.props.json`
   - `common/src/main/resources/custom2d-busbar-segment.props.json`
   - `common/src/main/resources/custom2d-busbar-segment-vertical.props.json`
   - `common/src/main/resources/custom2d-svg.props.json`
6. If creating a brand-new component type, add:
   - a new Java descriptor in `common/.../comp/`
   - registration in gateway/designer hooks
   - a client-side `ComponentMeta` registration in `isometric-components.js`

## Key files

- Module metadata: `build.gradle.kts`
- Common constants/resources: `common/src/main/java/com/miguelgrillo/ignition/isometric/common/IsometricComponents.java`
- Component descriptors:
  - `common/src/main/java/com/miguelgrillo/ignition/isometric/common/comp/IsometricPump.java`
  - `common/src/main/java/com/miguelgrillo/ignition/isometric/common/comp/IsometricValve.java`
  - `common/src/main/java/com/miguelgrillo/ignition/isometric/common/comp/IsometricTank.java`
  - `common/src/main/java/com/miguelgrillo/ignition/isometric/common/comp/IsometricGenset.java`
  - `common/src/main/java/com/miguelgrillo/ignition/isometric/common/comp/IsometricTestSvg.java`
  - `common/src/main/java/com/miguelgrillo/ignition/isometric/common/comp/Custom2DBusbarHEnergized.java`
  - `common/src/main/java/com/miguelgrillo/ignition/isometric/common/comp/Custom2DBusbarVEnergized.java`
  - `common/src/main/java/com/miguelgrillo/ignition/isometric/common/comp/Custom2DBusbarSegment.java`
  - `common/src/main/java/com/miguelgrillo/ignition/isometric/common/comp/Custom2DBusbarSegmentVertical.java`
  - `common/src/main/java/com/miguelgrillo/ignition/isometric/common/comp/Custom2DBreakerClosed.java`
  - `common/src/main/java/com/miguelgrillo/ignition/isometric/common/comp/Custom2DBreakerOpen.java`
  - `common/src/main/java/com/miguelgrillo/ignition/isometric/common/comp/Custom2DCircuitBreakerModern.java`
  - `common/src/main/java/com/miguelgrillo/ignition/isometric/common/comp/Custom2DControlValveModern.java`
  - `common/src/main/java/com/miguelgrillo/ignition/isometric/common/comp/Custom2DGensetClosed.java`
  - `common/src/main/java/com/miguelgrillo/ignition/isometric/common/comp/Custom2DGensetOpen.java`
  - `common/src/main/java/com/miguelgrillo/ignition/isometric/common/comp/Custom2DGensetSync.java`
  - `common/src/main/java/com/miguelgrillo/ignition/isometric/common/comp/Custom2DTelemetryPanel.java`
- Gateway hook: `gateway/src/main/java/com/miguelgrillo/ignition/isometric/gateway/IsometricGatewayHook.java`
- Designer hook: `designer/src/main/java/com/miguelgrillo/ignition/isometric/designer/IsometricDesignerHook.java`
- Browser component implementations: `gateway/src/main/resources/mounted/js/isometric-components.js`
