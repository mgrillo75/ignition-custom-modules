package com.miguelgrillo.ignition.anchorconnectors.common.comp;

import com.inductiveautomation.ignition.common.jsonschema.JsonSchema;
import com.inductiveautomation.perspective.common.api.ComponentDescriptor;

public final class ModernLine {

    public static final String COMPONENT_ID = "com.miguelgrillo.anchorconnectors.modern_line";

    public static final JsonSchema SCHEMA = AnchorConnectorDescriptorFactory.loadSchema("/modern-line.props.json");

    public static final ComponentDescriptor DESCRIPTOR = AnchorConnectorDescriptorFactory.buildDescriptor(
        COMPONENT_ID,
        "Modern Line",
        "Modern line symbol with bindable color, background, glow, and multiple anchor points.",
        "modernLine",
        "/modern-line.props.json"
    );

    private ModernLine() {
    }
}
