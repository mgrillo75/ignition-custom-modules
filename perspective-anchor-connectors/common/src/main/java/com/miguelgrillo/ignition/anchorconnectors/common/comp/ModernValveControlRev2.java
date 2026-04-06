package com.miguelgrillo.ignition.anchorconnectors.common.comp;

import com.inductiveautomation.ignition.common.jsonschema.JsonSchema;
import com.inductiveautomation.perspective.common.api.ComponentDescriptor;

public final class ModernValveControlRev2 {

    public static final String COMPONENT_ID = "com.miguelgrillo.anchorconnectors.modern_valve_control_rev2";

    public static final JsonSchema SCHEMA = AnchorConnectorDescriptorFactory.loadSchema("/modern-valve-control-rev2.props.json");

    public static final ComponentDescriptor DESCRIPTOR = AnchorConnectorDescriptorFactory.buildDescriptor(
        COMPONENT_ID,
        "Modern Valve Control Rev2",
        "Transparent modern valve control symbol with bindable colors, glow, and multiple anchor points.",
        "modernValveControlRev2",
        "/modern-valve-control-rev2.props.json"
    );

    private ModernValveControlRev2() {
    }
}
