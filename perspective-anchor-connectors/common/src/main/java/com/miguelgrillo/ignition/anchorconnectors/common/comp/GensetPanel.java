package com.miguelgrillo.ignition.anchorconnectors.common.comp;

import com.inductiveautomation.ignition.common.jsonschema.JsonSchema;
import com.inductiveautomation.perspective.common.api.ComponentDescriptor;

public final class GensetPanel {

    public static final String COMPONENT_ID = "com.miguelgrillo.anchorconnectors.genset_panel";

    public static final JsonSchema SCHEMA = AnchorConnectorDescriptorFactory.loadSchema("/genset-panel.props.json");

    public static final ComponentDescriptor DESCRIPTOR = AnchorConnectorDescriptorFactory.buildDescriptor(
        COMPONENT_ID,
        "Genset Panel",
        "Bind the genset title, breaker labels, runtime values, colors, glow, and anchor points.",
        "gensetPanel",
        "/genset-panel.props.json"
    );

    private GensetPanel() {
    }
}
