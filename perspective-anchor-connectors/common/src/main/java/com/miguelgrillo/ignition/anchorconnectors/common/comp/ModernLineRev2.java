package com.miguelgrillo.ignition.anchorconnectors.common.comp;

import com.inductiveautomation.ignition.common.jsonschema.JsonSchema;
import com.inductiveautomation.perspective.common.api.ComponentDescriptor;

public final class ModernLineRev2 {

    public static final String COMPONENT_ID = "com.miguelgrillo.anchorconnectors.modern_line_rev2";

    public static final JsonSchema SCHEMA = AnchorConnectorDescriptorFactory.loadSchema("/modern-line-rev2.props.json");

    public static final ComponentDescriptor DESCRIPTOR = AnchorConnectorDescriptorFactory.buildDescriptor(
        COMPONENT_ID,
        "Modern Line Rev2",
        "Transparent modern line symbol with bindable color, glow, and multiple anchor points.",
        "modernLineRev2",
        "/modern-line-rev2.props.json"
    );

    private ModernLineRev2() {
    }
}
