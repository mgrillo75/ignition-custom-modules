package com.miguelgrillo.ignition.isometric.common.comp;

import com.inductiveautomation.ignition.common.jsonschema.JsonSchema;
import com.inductiveautomation.perspective.common.api.ComponentDescriptor;
import com.inductiveautomation.perspective.common.api.ComponentDescriptorImpl;
import com.miguelgrillo.ignition.isometric.common.IsometricComponents;

public final class Custom2DGenset2 {

    public static final String COMPONENT_ID = "com.miguelgrillo.custom2d.genset_2";

    public static final JsonSchema SCHEMA =
        JsonSchema.parse(IsometricComponents.class.getResourceAsStream("/custom2d-genset-symbol.props.json"));

    public static final ComponentDescriptor DESCRIPTOR = ComponentDescriptorImpl.ComponentBuilder.newBuilder()
        .setPaletteCategory(IsometricComponents.COMPONENT_CATEGORY_CUSTOM_2D)
        .setId(COMPONENT_ID)
        .setModuleId(IsometricComponents.MODULE_ID)
        .setSchema(SCHEMA)
        .setName("Genset 2")
        .addPaletteEntry("", "Genset 2", "Compact genset symbol with bindable stroke, fill, and glow controls.", null, null)
        .setDefaultMetaName("genset2d")
        .setResources(IsometricComponents.BROWSER_RESOURCES)
        .build();

    private Custom2DGenset2() {
    }
}
