package com.miguelgrillo.ignition.isometric.common.comp;

import com.inductiveautomation.ignition.common.jsonschema.JsonSchema;
import com.inductiveautomation.perspective.common.api.ComponentDescriptor;
import com.inductiveautomation.perspective.common.api.ComponentDescriptorImpl;
import com.miguelgrillo.ignition.isometric.common.IsometricComponents;

public final class Custom2DBreakerOpen {

    public static final String COMPONENT_ID = "com.miguelgrillo.custom2d.breaker_open";

    public static final JsonSchema SCHEMA =
        JsonSchema.parse(IsometricComponents.class.getResourceAsStream("/custom2d-svg.props.json"));

    public static final ComponentDescriptor DESCRIPTOR = ComponentDescriptorImpl.ComponentBuilder.newBuilder()
        .setPaletteCategory(IsometricComponents.COMPONENT_CATEGORY_CUSTOM_2D)
        .setId(COMPONENT_ID)
        .setModuleId(IsometricComponents.MODULE_ID)
        .setSchema(SCHEMA)
        .setName("Breaker Open")
        .addPaletteEntry("", "Breaker Open", "Open breaker SVG with bindable color/text overrides.", null, null)
        .setDefaultMetaName("breakerOpen2d")
        .setResources(IsometricComponents.BROWSER_RESOURCES)
        .build();

    private Custom2DBreakerOpen() {
    }
}
