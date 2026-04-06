package com.miguelgrillo.ignition.anchorconnectors.common.comp;

import com.inductiveautomation.ignition.common.jsonschema.JsonSchema;
import com.inductiveautomation.perspective.common.api.ComponentDescriptor;
import com.inductiveautomation.perspective.common.api.ComponentDescriptorImpl;
import com.miguelgrillo.ignition.anchorconnectors.common.AnchorConnectorComponents;

public final class ConnectorOverlay {

    public static final String COMPONENT_ID = "com.miguelgrillo.anchorconnectors.connector_overlay";

    public static final JsonSchema SCHEMA =
        JsonSchema.parse(AnchorConnectorComponents.class.getResourceAsStream("/connector-overlay.props.json"));

    public static final ComponentDescriptor DESCRIPTOR = ComponentDescriptorImpl.ComponentBuilder.newBuilder()
        .setPaletteCategory(AnchorConnectorComponents.COMPONENT_CATEGORY)
        .setId(COMPONENT_ID)
        .setModuleId(AnchorConnectorComponents.MODULE_ID)
        .setSchema(SCHEMA)
        .setName("Connector Overlay")
        .addPaletteEntry("", "Connector Overlay", "Connector layer that snaps between anchor targets using generalized string anchor ids.", null, null)
        .setDefaultMetaName("connectorOverlay")
        .setResources(AnchorConnectorComponents.BROWSER_RESOURCES)
        .build();

    private ConnectorOverlay() {
    }
}
