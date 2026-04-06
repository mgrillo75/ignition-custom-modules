package com.miguelgrillo.ignition.anchorconnectors.common.comp;

import com.inductiveautomation.ignition.common.jsonschema.JsonSchema;
import com.inductiveautomation.perspective.common.api.ComponentDescriptor;
import com.inductiveautomation.perspective.common.api.ComponentDescriptorImpl;
import com.miguelgrillo.ignition.anchorconnectors.common.AnchorConnectorComponents;

public final class AnchorBreaker {

    public static final String COMPONENT_ID = "com.miguelgrillo.anchorconnectors.breaker";

    public static final JsonSchema SCHEMA =
        JsonSchema.parse(AnchorConnectorComponents.class.getResourceAsStream("/anchor-breaker.props.json"));

    public static final ComponentDescriptor DESCRIPTOR = ComponentDescriptorImpl.ComponentBuilder.newBuilder()
        .setPaletteCategory(AnchorConnectorComponents.COMPONENT_CATEGORY)
        .setId(COMPONENT_ID)
        .setModuleId(AnchorConnectorComponents.MODULE_ID)
        .setSchema(SCHEMA)
        .setName("Anchor Breaker")
        .addPaletteEntry("", "Anchor Breaker", "Snap target component with four anchor points.", null, null)
        .setDefaultMetaName("anchorBreaker")
        .setResources(AnchorConnectorComponents.BROWSER_RESOURCES)
        .build();

    private AnchorBreaker() {
    }
}
