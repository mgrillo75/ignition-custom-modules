# Perspective Anchor Connectors (Ignition 8.3)

This module scaffold targets an MVP that adds a single Perspective component:

- `Anchor Connector Canvas`

The intended runtime architecture is a single rendered canvas component that owns:

- symbols
- anchors
- orthogonal connectors

The module uses the same simple static mounted-JS approach as the current isometric module:

- browser resources are mounted from gateway resources
- no TypeScript/Node/web subproject in this iteration

## Build

From this folder:

```powershell
.\gradlew.bat build
```

The generated module file will be created under:

`build\PerspectiveAnchorConnectors.unsigned.modl`

Install in Gateway Web UI: `Config -> Modules`.

## Project Layout

- `common`: shared constants and component descriptors
- `gateway`: gateway hook and mounted browser resources
- `designer`: designer hook and palette registration

This scaffold intentionally leaves implementation source files to follow-up workers.
