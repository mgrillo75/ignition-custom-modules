package com.miguelgrillo.ignition.anchorconnectors.common.comp;

import com.inductiveautomation.ignition.common.jsonschema.JsonSchema;
import com.inductiveautomation.perspective.common.api.ComponentDescriptor;

public final class ModernValveControl {

    public static final String COMPONENT_ID = "com.miguelgrillo.anchorconnectors.modern_valve_control";

    public static final JsonSchema SCHEMA = AnchorConnectorDescriptorFactory.loadSchema("/modern-valve-control.props.json");

    public static final ComponentDescriptor DESCRIPTOR = AnchorConnectorDescriptorFactory.buildDescriptor(
        COMPONENT_ID,
        "Modern Valve Control",
        "Modern valve control symbol with bindable colors, glow, and multiple anchor points.",
        "modernValveControl",
        "/modern-valve-control.props.json"
    );

    private ModernValveControl() {
    }
}
