# Orchestrator Memory

## Workspace Map

- `isometric-perspective-components`
  - Primary custom Ignition Perspective module in active use.
  - Multi-project Gradle build with `common`, `gateway`, and `designer`.
  - Uses static mounted browser JS instead of a Node/web subproject.
- `perspective-anchor-connectors`
  - Separate scaffold/MVP module for anchor/canvas connectors.
  - Not the module used for imported SVG Perspective components.
- `inkscape-master/vg-images`
  - Source SVG library used to seed imported component assets.
- `stand-alone`
  - Loose prototypes and source assets, including `custom-component-additions`.
- `sdk-examples-upstream`, `ignition-sdk-examples-ignition-8.3`, `ignition-sdk-documentation`, `ignition-module-tools-master`
  - Reference docs/examples/tooling, not production module code.

## Active Module Architecture

Module: `isometric-perspective-components`

- Root build: `build.gradle.kts`
  - Module ID: `com.miguelgrillo.ignition.isometric`
  - Module filename: `IsometricPerspectiveComponents`
  - Requires Ignition `8.3.0`
  - Perspective dependency in scopes `GD`
  - Unsigned module build is enabled
- `common`
  - Shared Java component descriptors and JSON schemas
  - One Java descriptor class per Perspective component
- `gateway`
  - Registers component descriptors with Perspective gateway registry
  - Hosts mounted resources under `/res/isometric-components/...`
  - Main browser runtime file: `gateway/src/main/resources/mounted/js/isometric-components.js`
- `designer`
  - Registers component descriptors in the Perspective Designer palette

## Current Patterns / Conventions

- New components require changes in three layers:
  1. Java descriptor in `common/.../comp`
  2. Registration in gateway/designer hooks
  3. Browser `ComponentMeta` registration in `isometric-components.js`
- Existing imported SVG components live in the `Custom 2D Images` palette.
- Mounted SVG resources are served from `gateway/src/main/resources/mounted/svg`.
- Source assets are also mirrored under `assets/source-svgs`.
- Generic imported-SVG behavior already supports:
  - `colorOverrides`
  - `textOverrides`
  - `globalFillColor` / `applyGlobalFill`
  - `globalStrokeColor` / `applyGlobalStroke`
  - `svgOpacity`
  - `preserveAspectRatio`
  - `showLabel`, `label`, `labelColor`, `style`
- For richer UX, prefer explicit bindable props in schema files over forcing users to populate raw override maps.

## Fragile Areas

- No meaningful automated tests exist; validation is build + install + Designer/runtime manual verification.
- `gateway/src/main/resources/mounted/js/isometric-components.js` is monolithic and easy to break.
- Registration symmetry matters: if a component is added in one registry but not the others, Designer/runtime drift occurs.
- The generic SVG transform pipeline only mutates SVG markup. It cannot recolor pixels inside embedded raster images.

## Decisions Made

- Reuse `isometric-perspective-components`; do not create a new module for imported SVGs.
- Keep the static mounted-JS approach rather than adding a web/Node build.
- Expose component-specific props when the asset supports it.
- Represent raster-backed assets honestly: support overlays and feasible props, but do not pretend full vector-style recoloring is available.

## Current State

Added two new custom Perspective components from `stand-alone/custom-component-additions`:

1. `com.miguelgrillo.custom2d.lv_breaker_screen_full_page`
   - Name: `LV Breaker Screen (Full Page)`
   - Asset is an SVG wrapper around an embedded opaque PNG.
   - Supports generic Custom2D props plus bindable overlay text/styling props.
   - Limitation: internal screenshot pixels are not directly recolorable or text-bindable.

2. `com.miguelgrillo.custom2d.modern_genset_panel_v7_full_panel`
   - Name: `Modern Genset Panel V7 (Full Panel)`
   - True SVG with explicit bindable text/color props.
   - Supports runtime text binding for unit/status strings and color customization for accent/states.

## Verification

- `.\gradlew.bat build --console=plain --no-daemon` in `isometric-perspective-components`
- Result: `BUILD SUCCESSFUL`

## Local Skills

- Local Codex skill available at `C:\Users\MiguelGrillo\.codex\skills\ignition-perspective-svg-module-builder`
  - Purpose: take one or more SVGs, update `isometric-perspective-components`, run a fresh build, and report the resulting `.modl` artifact path.
