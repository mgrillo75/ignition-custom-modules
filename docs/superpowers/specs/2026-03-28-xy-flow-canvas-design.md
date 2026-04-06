# XY Flow Canvas Design

**Date:** 2026-03-28

## Goal

Build a completely new Ignition 8.3 Perspective module that uses XYFlow as the core interaction framework for a self-contained diagram editor. The module must let users:

- place one or more `XY Flow Canvas` components on a view
- add custom SVG-backed nodes from an in-canvas toolbox
- add loose connector lines that exist before they are attached
- drag either connector endpoint onto visible connection points on nodes
- move nodes and keep attached lines snapped automatically

The previous `PerspectiveAnchorConnectors` runtime and property-driven snapping model are explicitly out of scope.

## Module Shape

- New sibling module directory: `perspective-xyflow-canvas`
- New unsigned module artifact: `PerspectiveXYFlowCanvas.unsigned.modl`
- One Perspective palette component: `XY Flow Canvas`
- All node and line authoring happens inside the canvas

## Authoring Model

Each `XY Flow Canvas` instance is an independent embedded graph editor. Multiple canvases may exist on the same Perspective view, but they do not share nodes, edges, or connections.

Inside the canvas:

- a toolbox adds custom SVG node types and loose connector lines
- nodes are draggable
- node connection points become visible on hover/selection
- loose lines can be dropped first, then attached later
- attached lines can be reconnected by dragging either end

## Binding Model

The top-level Perspective object is still one component, but it exposes structured nested data for nodes and edges.

The binding surface should prioritize stable IDs rather than index-only array access wherever practical. The module will still need XYFlow arrays internally, but the component model should preserve stable node/edge identities.

Meaningful render/data properties must be bindable:

- node labels and status values
- node colors and glow intensity
- node-specific visual state
- edge stroke, width, label, marker, animation, glow

Transient interaction state is not part of the binding surface:

- hover state
- selected handle
- drag preview
- snap radius internals
- temporary connection preview state

## XYFlow Modeling

XYFlow does not support a connector with a null source or null target. To preserve the “drop loose line first, connect later” workflow, a connector will be modeled as:

- one visible XYFlow edge
- zero, one, or two tiny internal endpoint anchor nodes for endpoints that are still free

Endpoint state:

- `free`: endpoint is backed by an internal anchor node positioned on the canvas
- `attached`: endpoint resolves to a real node handle

This preserves the PowerPoint-like workflow without abandoning XYFlow’s reconnect and snapping behavior.

## Custom Node Set For V1

V1 supports the existing custom SVG families only:

- breaker
- genset panel variants
- modern valve control variants
- modern tank variants
- modern line variants

Each node type defines explicit handle positions aligned to its intended connection points.

True external/native Perspective components on the surrounding view are out of scope for V1.

## Scope Boundaries

### In Scope

- new module with new module id/name
- single `XY Flow Canvas` Perspective component
- in-canvas toolbox
- XYFlow-based drag/drop and reconnect behavior
- custom SVG nodes from existing asset set
- loose connector lines via internal endpoint anchor nodes
- unsigned `.modl` build

### Out of Scope

- reusing the old anchor-connectors runtime
- property-driven line snapping as the primary workflow
- connecting to normal external Perspective components outside the canvas
- cross-canvas connections

## Verification Targets

V1 is successful when:

- the module builds to a fresh `.modl`
- `XY Flow Canvas` appears in the Perspective palette
- a user can place multiple canvases on one page
- nodes can be added from the canvas toolbox
- a loose connector line can be added, left unattached, and later attached by dragging its ends
- attached lines stay snapped when nodes move
