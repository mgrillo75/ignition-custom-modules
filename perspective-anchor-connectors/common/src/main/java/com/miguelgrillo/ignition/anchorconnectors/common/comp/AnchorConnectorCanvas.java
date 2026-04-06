package com.miguelgrillo.ignition.anchorconnectors.common.comp;

import com.inductiveautomation.ignition.common.jsonschema.JsonSchema;
import com.inductiveautomation.perspective.common.api.ComponentDescriptor;
import com.inductiveautomation.perspective.common.api.ComponentDescriptorImpl;
import com.miguelgrillo.ignition.anchorconnectors.common.AnchorConnectorComponents;

public final class AnchorConnectorCanvas {

    public static final String COMPONENT_ID = "com.miguelgrillo.anchorconnectors.canvas";

    public static final JsonSchema SCHEMA =
        JsonSchema.parse(AnchorConnectorComponents.class.getResourceAsStream("/anchor-connector-canvas.props.json"));

    public static final ComponentDescriptor DESCRIPTOR = ComponentDescriptorImpl.ComponentBuilder.newBuilder()
        .setPaletteCategory(AnchorConnectorComponents.COMPONENT_CATEGORY)
        .setId(COMPONENT_ID)
        .setModuleId(AnchorConnectorComponents.MODULE_ID)
        .setSchema(SCHEMA)
        .setName("Anchor Connector Canvas (Legacy Demo)")
        .addPaletteEntry("", "Anchor Connector Canvas (Legacy Demo)", "Legacy demo canvas for testing anchor-based orthogonal connectors.", null, null)
        .setDefaultMetaName("anchorConnectorCanvas")
        .setResources(AnchorConnectorComponents.BROWSER_RESOURCES)
        .build();

    private AnchorConnectorCanvas() {
    }
}
