from __future__ import annotations

import json
from pathlib import Path


MODULE_ROOT = Path(__file__).resolve().parent
COMMON_RESOURCES = MODULE_ROOT / "common" / "src" / "main" / "resources"
COMMON_COMP = MODULE_ROOT / "common" / "src" / "main" / "java" / "com" / "miguelgrillo" / "ignition" / "isometric" / "common" / "comp"
GATEWAY_HOOK = MODULE_ROOT / "gateway" / "src" / "main" / "java" / "com" / "miguelgrillo" / "ignition" / "isometric" / "gateway" / "IsometricGatewayHook.java"
DESIGNER_HOOK = MODULE_ROOT / "designer" / "src" / "main" / "java" / "com" / "miguelgrillo" / "ignition" / "isometric" / "designer" / "IsometricDesignerHook.java"
RUNTIME_JS = MODULE_ROOT / "gateway" / "src" / "main" / "resources" / "mounted" / "js" / "isometric-components.js"
SOURCE_SVG = MODULE_ROOT / "assets" / "source-svgs" / "half-gauge.svg"
MOUNTED_SVG = MODULE_ROOT / "gateway" / "src" / "main" / "resources" / "mounted" / "svg" / "half-gauge.svg"
SOURCE_PNG = MODULE_ROOT / "assets" / "source-svgs" / "half-gauge-source.png"
MOUNTED_PNG = MODULE_ROOT / "gateway" / "src" / "main" / "resources" / "mounted" / "svg" / "half-gauge-source.png"

COMPONENT_ID = "com.miguelgrillo.custom2d.dosing_valve_half_gauge"
DESCRIPTOR_NAME = "Custom2DDosingValveHalfGauge.java"
SCHEMA_NAME = "custom2d-dosing-valve-half-gauge.props.json"


def require(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def main() -> None:
    require(SOURCE_SVG.exists(), f"Missing source asset: {SOURCE_SVG}")
    require(MOUNTED_SVG.exists(), f"Missing mounted asset: {MOUNTED_SVG}")
    require(SOURCE_PNG.exists(), f"Missing source png: {SOURCE_PNG}")
    require(MOUNTED_PNG.exists(), f"Missing mounted png: {MOUNTED_PNG}")
    require((COMMON_COMP / DESCRIPTOR_NAME).exists(), f"Missing descriptor: {DESCRIPTOR_NAME}")
    require((COMMON_RESOURCES / SCHEMA_NAME).exists(), f"Missing schema: {SCHEMA_NAME}")

    source_svg_text = SOURCE_SVG.read_text(encoding="utf-8")
    mounted_svg_text = MOUNTED_SVG.read_text(encoding="utf-8")
    require("half-gauge-source.png" in source_svg_text, "Source SVG should reference half-gauge-source.png")
    require("half-gauge-source.png" in mounted_svg_text, "Mounted SVG should reference half-gauge-source.png")

    schema = json.loads((COMMON_RESOURCES / SCHEMA_NAME).read_text(encoding="utf-8"))
    props = schema.get("properties", {})
    for prop_name in (
        "showOverlay",
        "value",
        "valueText",
        "valueDecimals",
        "unitText",
        "titleLine1Text",
        "titleLine2Text",
        "overlayMaskColor",
        "overlayMaskWidth",
        "overlayMaskHeight",
        "fontFamily",
        "valueColor",
        "unitColor",
        "titleColor",
        "svgOpacity",
        "preserveAspectRatio",
    ):
        require(prop_name in props, f"Schema missing bindable prop: {prop_name}")

    descriptor_text = (COMMON_COMP / DESCRIPTOR_NAME).read_text(encoding="utf-8")
    require(COMPONENT_ID in descriptor_text, f"Descriptor missing component id: {COMPONENT_ID}")
    require("Dosing Valve Half Gauge" in descriptor_text, "Descriptor missing palette name")

    gateway_text = GATEWAY_HOOK.read_text(encoding="utf-8")
    require("Custom2DDosingValveHalfGauge" in gateway_text, "Gateway hook missing half gauge registration")
    require("Custom2DDosingValveHalfGauge.COMPONENT_ID" in gateway_text, "Gateway hook missing half gauge component removal")

    designer_text = DESIGNER_HOOK.read_text(encoding="utf-8")
    require("Custom2DDosingValveHalfGauge" in designer_text, "Designer hook missing half gauge registration")
    require("Custom2DDosingValveHalfGauge.COMPONENT_ID" in designer_text, "Designer hook missing half gauge component removal")

    runtime_text = RUNTIME_JS.read_text(encoding="utf-8")
    require("function readCustom2DDosingValveHalfGaugeProps(tree)" in runtime_text, "Runtime JS missing props reader")
    require("class Custom2DDosingValveHalfGauge extends Custom2DSourceSvg" in runtime_text, "Runtime JS missing component class")
    require("class Custom2DDosingValveHalfGaugeMeta" in runtime_text, "Runtime JS missing component meta")
    require(COMPONENT_ID in runtime_text, f"Runtime JS missing component id: {COMPONENT_ID}")
    require('Custom2DDosingValveHalfGauge.SVG_FILE = "half-gauge.svg"' in runtime_text, "Runtime JS missing SVG file mapping")
    require('key: "center-value-block"' in runtime_text, "Runtime JS missing centered value block")
    require('key: "center-value-unit"' in runtime_text, "Runtime JS missing inline unit block")
    require('key: "center-title-line-1"' in runtime_text, "Runtime JS missing first title line")
    require('key: "center-title-line-2"' in runtime_text, "Runtime JS missing second title line")

    print("OK: dosing valve half gauge component is registered with raster-backed overlay bindings.")


if __name__ == "__main__":
    main()
