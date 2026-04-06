package com.miguelgrillo.ignition.anchorconnectors.common.comp;

import com.inductiveautomation.ignition.common.jsonschema.JsonSchema;
import com.inductiveautomation.perspective.common.api.ComponentDescriptor;

public final class GensetPanelTransparent {

    public static final String COMPONENT_ID = "com.miguelgrillo.anchorconnectors.genset_panel_transparent";

    public static final JsonSchema SCHEMA = AnchorConnectorDescriptorFactory.loadSchema("/genset-panel-transparent.props.json");

    public static final ComponentDescriptor DESCRIPTOR = AnchorConnectorDescriptorFactory.buildDescriptor(
        COMPONENT_ID,
        "Genset Panel Transparent",
        "Transparent genset panel with bindable title, breaker labels, runtime values, colors, glow, and anchor points.",
        "gensetPanelTransparent",
        "/genset-panel-transparent.props.json"
    );

    private GensetPanelTransparent() {
    }
}
