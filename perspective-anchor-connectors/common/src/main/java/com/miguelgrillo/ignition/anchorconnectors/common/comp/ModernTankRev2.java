package com.miguelgrillo.ignition.anchorconnectors.common.comp;

import com.inductiveautomation.ignition.common.jsonschema.JsonSchema;
import com.inductiveautomation.perspective.common.api.ComponentDescriptor;

public final class ModernTankRev2 {

    public static final String COMPONENT_ID = "com.miguelgrillo.anchorconnectors.modern_tank_rev2";

    public static final JsonSchema SCHEMA = AnchorConnectorDescriptorFactory.loadSchema("/modern-tank-rev2.props.json");

    public static final ComponentDescriptor DESCRIPTOR = AnchorConnectorDescriptorFactory.buildDescriptor(
        COMPONENT_ID,
        "Modern Tank Rev2",
        "Transparent modern tank symbol with bindable colors, glow, and multiple anchor points.",
        "modernTankRev2",
        "/modern-tank-rev2.props.json"
    );

    private ModernTankRev2() {
    }
}
