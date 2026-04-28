from __future__ import annotations

import json
from pathlib import Path


MODULE_ROOT = Path(__file__).resolve().parent
COMMON_RESOURCES = MODULE_ROOT / "common" / "src" / "main" / "resources"
COMMON_COMP = MODULE_ROOT / "common" / "src" / "main" / "java" / "com" / "miguelgrillo" / "ignition" / "isometric" / "common" / "comp"
GATEWAY_HOOK = MODULE_ROOT / "gateway" / "src" / "main" / "java" / "com" / "miguelgrillo" / "ignition" / "isometric" / "gateway" / "IsometricGatewayHook.java"
DESIGNER_HOOK = MODULE_ROOT / "designer" / "src" / "main" / "java" / "com" / "miguelgrillo" / "ignition" / "isometric" / "designer" / "IsometricDesignerHook.java"
RUNTIME_JS = MODULE_ROOT / "gateway" / "src" / "main" / "resources" / "mounted" / "js" / "isometric-components.js"
SOURCE_SVG = MODULE_ROOT / "assets" / "source-svgs" / "dosing-valve-gauge.svg"
MOUNTED_SVG = MODULE_ROOT / "gateway" / "src" / "main" / "resources" / "mounted" / "svg" / "dosing-valve-gauge.svg"
COMPONENT_ID = "com.miguelgrillo.custom2d.dosing_valve_gauge"
DESCRIPTOR_NAME = "Custom2DDosingValveGauge.java"
SCHEMA_NAME = "custom2d-dosing-valve-gauge.props.json"


def require(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def main() -> None:
    require(SOURCE_SVG.exists(), f"Missing source asset: {SOURCE_SVG}")
    require(MOUNTED_SVG.exists(), f"Missing mounted asset: {MOUNTED_SVG}")
    require((COMMON_COMP / DESCRIPTOR_NAME).exists(), f"Missing descriptor: {DESCRIPTOR_NAME}")
    require((COMMON_RESOURCES / SCHEMA_NAME).exists(), f"Missing schema: {SCHEMA_NAME}")

    schema = json.loads((COMMON_RESOURCES / SCHEMA_NAME).read_text(encoding="utf-8"))
    props = schema.get("properties", {})
    for prop_name in (
        "value",
        "minValue",
        "maxValue",
        "valueText",
        "unitText",
        "titleLine1Text",
        "titleLine2Text",
        "progressColor",
        "trackColor",
        "majorTickColor",
        "needleTipColor",
    ):
        require(prop_name in props, f"Schema missing bindable prop: {prop_name}")

    descriptor_text = (COMMON_COMP / DESCRIPTOR_NAME).read_text(encoding="utf-8")
    require(COMPONENT_ID in descriptor_text, f"Descriptor missing component id: {COMPONENT_ID}")

    gateway_text = GATEWAY_HOOK.read_text(encoding="utf-8")
    require("Custom2DDosingValveGauge" in gateway_text, "Gateway hook missing dosing valve gauge registration")

    designer_text = DESIGNER_HOOK.read_text(encoding="utf-8")
    require("Custom2DDosingValveGauge" in designer_text, "Designer hook missing dosing valve gauge registration")

    runtime_text = RUNTIME_JS.read_text(encoding="utf-8")
    require("class Custom2DDosingValveGauge extends Component" in runtime_text, "Runtime JS missing component class")
    require("class Custom2DDosingValveGaugeMeta" in runtime_text, "Runtime JS missing component meta")
    require(COMPONENT_ID in runtime_text, f"Runtime JS missing component id: {COMPONENT_ID}")
    require('key: "center-value-block"' in runtime_text, "Runtime JS missing centered center-value text block")
    require('key: "center-value-unit"' in runtime_text, "Runtime JS missing inline unit tspan for centered value block")
    require('key: "center-unit"' not in runtime_text, "Runtime JS still uses a separate center-unit text node")

    print("OK: dosing valve gauge component remains registered with centered value/unit rendering.")


if __name__ == "__main__":
    main()
