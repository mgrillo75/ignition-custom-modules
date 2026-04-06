# Connector Line Drag/Drop Design

Date: 2026-03-27
Project: `perspective-anchor-connectors`
Status: Approved design, pending implementation plan

## Summary

Implement PowerPoint-style line authoring for the `Connector Line` Perspective component in the Ignition Designer.

The first release will make `Connector Line` the primary authoring surface:

1. Drop object A.
2. Drop object B.
3. Drop `Connector Line`.
4. Select the line.
5. Drag one endpoint onto an anchor of object A.
6. Drag the other endpoint onto an anchor of object B.
7. The line snaps, persists the connection automatically, and stays attached when connected objects move.

`Connector Overlay` remains in the module, but it is not the primary workflow for this feature.

## Goals

- Eliminate manual text/property editing for normal connector authoring.
- Make `Connector Line` behave like a normal drawable object with draggable endpoints.
- Snap line endpoints to anchor-aware components already published by the module.
- Persist snapped endpoint state into the component props automatically.
- Keep existing runtime rendering and bindable line properties intact.
- Restrict authoring handles and drag behavior to the Designer only.

## Non-Goals

- No direct "drag from shape to create a new line" in this first release.
- No full diagram-editor feature set such as bend-point editing, midpoint handles, or arbitrary elbow handle manipulation.
- No requirement to make `Connector Overlay` the main authoring UX in this release.
- No attempt to replace all existing connection workflows on day one.

## User Workflow

### Primary Workflow

- User places two anchor-aware components in a view.
- User places a `Connector Line` component in the same container.
- When the line is selected, the line renders visible `start` and `end` drag handles in Designer.
- Dragging a handle near valid anchors highlights candidate snap targets.
- Dropping on a valid anchor writes the endpoint as a snapped endpoint.
- Dropping in empty space writes the endpoint as a free endpoint.

### Editing Behavior

- A selected line shows endpoint handles only in Designer.
- Snapped endpoints show their connected state visually while selected.
- If a connected component moves, the line reroutes and remains attached.
- Free endpoints remain at explicit local coordinates until snapped again.

## Component Model

### Connector Line Endpoint State

Each endpoint will support two persisted states:

- Free endpoint
  - Stored as local line-space coordinates.
- Snapped endpoint
  - Stored as `targetId` plus `anchorId`.

The line component will continue to expose bindable visual props such as:

- `stroke`
- `strokeWidth`
- `cornerRadius`
- `markerEnd`
- `label`
- `glowIntensity`

### Line Bounds

The line component will remain a normal Perspective component with standard bounds, but its internal geometry should auto-fit around its effective endpoints during authoring so the user does not need constant manual resizing after every drag.

This keeps the component model compatible with Perspective while making the edit behavior feel shape-like rather than property-driven.

## Anchor Discovery Model

The existing anchor-aware component contract remains the source of truth:

- Components publish hidden named anchors in the DOM.
- `Connector Line` resolves candidate anchors by scanning anchor-aware targets in the same document/container context.
- The line snaps to the nearest valid anchor under the current drag operation.

Existing named-anchor support remains valid:

- Legacy side anchors such as `top`, `right`, `bottom`, `left`
- Explicit named anchors such as `generator_top`, `status_left`, `middle`, `quarter_1`

## Designer Interaction Architecture

### Minimum Viable Interaction

- `Connector Line` selection enables drag handles.
- Pointer down on `start` or `end` enters endpoint-drag mode.
- While dragging:
  - nearby anchor targets become visible
  - nearest eligible anchor is highlighted
  - the line preview updates live
- Pointer up commits either:
  - snapped endpoint reference, or
  - free endpoint coordinates

### Separation of Responsibilities

- Runtime rendering remains in the component/browser layer.
- Designer-only handle rendering and drag interaction are added without affecting runtime sessions.
- Existing line routing stays responsible for orthogonal path generation and visual rendering.
- New authoring state is limited to endpoint drag state and hover/snap highlighting.

## Persistence Model

The underlying persisted props should remain explicit and bindable even when authored by drag/drop.

Recommended persisted shape:

- `start`
  - `mode`: `free` or `snapped`
  - `x`, `y` when free
  - `targetId`, `anchorId` when snapped
- `end`
  - `mode`: `free` or `snapped`
  - `x`, `y` when free
  - `targetId`, `anchorId` when snapped

Compatibility note:

- Existing `fromTargetId`, `fromAnchor`, `toTargetId`, `toAnchor` must continue to work during migration.
- Implementation may initially store both shapes or derive one from the other, but the final reducer/runtime contract should stay coherent and not force users back into manual editing.

## Error Handling

- If a referenced target disappears, the line should not crash.
- Missing snapped targets should degrade to a visible disconnected/free state or a safe fallback render.
- Invalid anchor ids should fall back gracefully without breaking the component.
- Designer drag state must clean up on cancel, deselect, or component removal.

## Testing Strategy

### Automated

- Extend the node regression harness to cover:
  - `Connector Line` reducer shape
  - free endpoint render path
  - snapped endpoint render path
  - no-throw render behavior for anchor-aware components and line variants

### Manual Designer Verification

- Drop two anchor-aware components and one `Connector Line`.
- Drag line start handle to component A anchor.
- Drag line end handle to component B anchor.
- Move component A and verify the line remains attached.
- Move component B and verify the line remains attached.
- Drop an endpoint into empty space and verify it becomes free.
- Reopen Designer and confirm the authored line persists.

## Risks

- Ignition Designer interaction APIs may limit how natural endpoint dragging feels.
- Pointer/selection interaction may conflict with normal Perspective component selection if not scoped carefully.
- Auto-fitting line geometry must not create surprising position jumps in the Designer.
- Backward compatibility between old line props and new endpoint state must be handled deliberately.

## Recommended Delivery Sequence

1. Add explicit endpoint data model for `Connector Line`.
2. Preserve old line rendering behavior while teaching runtime to resolve the new endpoint state.
3. Add Designer-only endpoint handles and drag state.
4. Add anchor hover/highlight and snap-on-drop.
5. Verify persistence and motion behavior when connected targets move.
6. Leave `Connector Overlay` untouched except where shared helper logic must be reused safely.

## Acceptance Criteria

- A user can place two anchor-aware components and one `Connector Line`.
- A user can drag each endpoint of the line onto component anchors.
- The line snaps without manual text/property editing.
- The line stays attached when connected components move.
- Existing visual/bindable line props continue to function.
- Runtime sessions show the finished line without Designer edit handles.
