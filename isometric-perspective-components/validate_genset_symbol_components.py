from __future__ import annotations

import json
from pathlib import Path


MODULE_ROOT = Path(__file__).resolve().parent
COMMON_RESOURCES = MODULE_ROOT / "common" / "src" / "main" / "resources"
COMMON_COMP = MODULE_ROOT / "common" / "src" / "main" / "java" / "com" / "miguelgrillo" / "ignition" / "isometric" / "common" / "comp"
GATEWAY_HOOK = MODULE_ROOT / "gateway" / "src" / "main" / "java" / "com" / "miguelgrillo" / "ignition" / "isometric" / "gateway" / "IsometricGatewayHook.java"
DESIGNER_HOOK = MODULE_ROOT / "designer" / "src" / "main" / "java" / "com" / "miguelgrillo" / "ignition" / "isometric" / "designer" / "IsometricDesignerHook.java"
RUNTIME_JS = MODULE_ROOT / "gateway" / "src" / "main" / "resources" / "mounted" / "js" / "isometric-components.js"
SOURCE_SVG_DIR = MODULE_ROOT / "assets" / "source-svgs"
MOUNTED_SVG_DIR = MODULE_ROOT / "gateway" / "src" / "main" / "resources" / "mounted" / "svg"

COMPONENTS = (
    {
        "asset_name": "genset-sld.svg",
        "descriptor_name": "Custom2DGensetSld.java",
        "class_name": "Custom2DGensetSld",
        "component_id": "com.miguelgrillo.custom2d.genset_sld",
        "palette_name": "Genset SLD",
        "schema_name": "custom2d-genset-sld.props.json",
    },
    {
        "asset_name": "genset_2.svg",
        "descriptor_name": "Custom2DGenset2.java",
        "class_name": "Custom2DGenset2",
        "component_id": "com.miguelgrillo.custom2d.genset_2",
        "palette_name": "Genset 2",
        "schema_name": "custom2d-genset-symbol.props.json",
    },
    {
        "asset_name": "genset-sld-s32.svg",
        "descriptor_name": "Custom2DGensetSldS32.java",
        "class_name": "Custom2DGensetSldS32",
        "component_id": "com.miguelgrillo.custom2d.genset_sld_s32",
        "palette_name": "Genset SLD S32",
        "schema_name": "custom2d-genset-sld-s32.props.json",
    },
)


def require(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def main() -> None:
    gateway_text = GATEWAY_HOOK.read_text(encoding="utf-8")
    designer_text = DESIGNER_HOOK.read_text(encoding="utf-8")
    runtime_text = RUNTIME_JS.read_text(encoding="utf-8")

    require("function readCustom2DGensetSymbolProps(tree, defaultLabel, defaults)" in runtime_text, "Runtime JS missing genset symbol props reader")
    require("class Custom2DGensetSymbol extends Custom2DSourceSvg" in runtime_text, "Runtime JS missing genset symbol base class")
    require("class Custom2DGensetSymbolMeta" in runtime_text, "Runtime JS missing genset symbol meta helper")
    require("function replaceFilterBlock" in runtime_text, "Runtime JS missing filter block helper")
    require("function colorToRgbaString" in runtime_text, "Runtime JS missing RGBA color helper")
    for token in ("glowIntensity", "topLineColor", "breakerColor", "lowerLineColor", "generatorColor"):
        require(token in runtime_text, f"Runtime JS missing required prop usage: {token}")

    for component in COMPONENTS:
        schema_path = COMMON_RESOURCES / component["schema_name"]
        require(schema_path.exists(), f"Missing schema: {schema_path}")
        schema = json.loads(schema_path.read_text(encoding="utf-8"))
        props = schema.get("properties", {})
        for prop_name in (
            "lineColor",
            "topLineColor",
            "breakerColor",
            "lowerLineColor",
            "generatorColor",
            "symbolFillColor",
            "symbolFillOpacity",
            "generatorFillColor",
            "generatorFillOpacity",
            "glowColor",
            "glowIntensity",
            "chainGlowPrimaryOpacity",
            "chainGlowSecondaryOpacity",
            "chainGlowTertiaryOpacity",
            "circleGlowPrimaryBlur",
            "circleGlowSecondaryBlur",
            "circleGlowTertiaryBlur",
            "circleGlowPrimaryOpacity",
            "circleGlowSecondaryOpacity",
            "circleGlowTertiaryOpacity",
            "svgOpacity",
            "preserveAspectRatio",
        ):
            require(prop_name in props, f"{component['schema_name']} missing bindable prop: {prop_name}")

        source_svg = SOURCE_SVG_DIR / component["asset_name"]
        mounted_svg = MOUNTED_SVG_DIR / component["asset_name"]
        descriptor_path = COMMON_COMP / component["descriptor_name"]

        require(source_svg.exists(), f"Missing source asset: {source_svg}")
        require(mounted_svg.exists(), f"Missing mounted asset: {mounted_svg}")
        require(descriptor_path.exists(), f"Missing descriptor: {descriptor_path}")

        descriptor_text = descriptor_path.read_text(encoding="utf-8")
        require(component["component_id"] in descriptor_text, f"Descriptor missing component id: {component['component_id']}")
        require(component["palette_name"] in descriptor_text, f"Descriptor missing palette name: {component['palette_name']}")

        require(component["class_name"] in gateway_text, f"Gateway hook missing class: {component['class_name']}")
        require(f"{component['class_name']}.COMPONENT_ID" in gateway_text, f"Gateway hook missing component removal for {component['class_name']}")
        require(component["class_name"] in designer_text, f"Designer hook missing class: {component['class_name']}")
        require(f"{component['class_name']}.COMPONENT_ID" in designer_text, f"Designer hook missing component removal for {component['class_name']}")
        require(component["class_name"] in runtime_text, f"Runtime JS missing component class: {component['class_name']}")
        require(component["component_id"] in runtime_text, f"Runtime JS missing component id: {component['component_id']}")
        require(f'{component["class_name"]}.SVG_FILE = "{component["asset_name"]}"' in runtime_text, f"Runtime JS missing SVG mapping for {component['asset_name']}")

    print("OK: genset symbol components are registered with mirrored SVG assets and glow/fill bindings.")


if __name__ == "__main__":
    main()
