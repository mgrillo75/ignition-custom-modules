package com.miguelgrillo.ignition.anchorconnectors.common.comp;

import com.inductiveautomation.ignition.common.jsonschema.JsonSchema;
import com.inductiveautomation.perspective.common.api.ComponentDescriptor;

public final class ModernTank {

    public static final String COMPONENT_ID = "com.miguelgrillo.anchorconnectors.modern_tank";

    public static final JsonSchema SCHEMA = AnchorConnectorDescriptorFactory.loadSchema("/modern-tank.props.json");

    public static final ComponentDescriptor DESCRIPTOR = AnchorConnectorDescriptorFactory.buildDescriptor(
        COMPONENT_ID,
        "Modern Tank",
        "Modern tank symbol with bindable colors, glow, and multiple anchor points.",
        "modernTank",
        "/modern-tank.props.json"
    );

    private ModernTank() {
    }
}
