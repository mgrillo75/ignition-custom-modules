package com.miguelgrillo.ignition.anchorconnectors.common.comp;

import com.inductiveautomation.ignition.common.jsonschema.JsonSchema;
import com.inductiveautomation.perspective.common.api.ComponentDescriptor;
import com.inductiveautomation.perspective.common.api.ComponentDescriptorImpl;
import com.miguelgrillo.ignition.anchorconnectors.common.AnchorConnectorComponents;

public final class ConnectorLine {

    public static final String COMPONENT_ID = "com.miguelgrillo.anchorconnectors.connector_line";

    public static final JsonSchema SCHEMA =
        JsonSchema.parse(AnchorConnectorComponents.class.getResourceAsStream("/connector-line.props.json"));

    public static final ComponentDescriptor DESCRIPTOR = ComponentDescriptorImpl.ComponentBuilder.newBuilder()
        .setPaletteCategory(AnchorConnectorComponents.COMPONENT_CATEGORY)
        .setId(COMPONENT_ID)
        .setModuleId(AnchorConnectorComponents.MODULE_ID)
        .setSchema(SCHEMA)
        .setName("Connector Line")
        .addPaletteEntry("", "Connector Line", "Standalone snap-aware line with bindable endpoints, generalized anchor ids, line anchors, and routing properties.", null, null)
        .setDefaultMetaName("connectorLine")
        .setResources(AnchorConnectorComponents.BROWSER_RESOURCES)
        .build();

    private ConnectorLine() {
    }
}
