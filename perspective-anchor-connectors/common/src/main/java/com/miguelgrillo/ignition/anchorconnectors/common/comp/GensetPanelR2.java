package com.miguelgrillo.ignition.anchorconnectors.common.comp;

import com.inductiveautomation.ignition.common.jsonschema.JsonSchema;
import com.inductiveautomation.perspective.common.api.ComponentDescriptor;

public final class GensetPanelR2 {

    public static final String COMPONENT_ID = "com.miguelgrillo.anchorconnectors.genset_panel_r2";

    public static final JsonSchema SCHEMA = AnchorConnectorDescriptorFactory.loadSchema("/genset-panel-r2.props.json");

    public static final ComponentDescriptor DESCRIPTOR = AnchorConnectorDescriptorFactory.buildDescriptor(
        COMPONENT_ID,
        "Genset Panel R2",
        "Updated genset panel with bindable title, breaker labels, runtime values, colors, glow, and anchor points.",
        "gensetPanelR2",
        "/genset-panel-r2.props.json"
    );

    private GensetPanelR2() {
    }
}
