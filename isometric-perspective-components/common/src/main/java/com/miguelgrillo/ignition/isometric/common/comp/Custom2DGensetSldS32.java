package com.miguelgrillo.ignition.isometric.common.comp;

import com.inductiveautomation.ignition.common.jsonschema.JsonSchema;
import com.inductiveautomation.perspective.common.api.ComponentDescriptor;
import com.inductiveautomation.perspective.common.api.ComponentDescriptorImpl;
import com.miguelgrillo.ignition.isometric.common.IsometricComponents;

public final class Custom2DGensetSldS32 {

    public static final String COMPONENT_ID = "com.miguelgrillo.custom2d.genset_sld_s32";

    public static final JsonSchema SCHEMA =
        JsonSchema.parse(IsometricComponents.class.getResourceAsStream("/custom2d-genset-sld-s32.props.json"));

    public static final ComponentDescriptor DESCRIPTOR = ComponentDescriptorImpl.ComponentBuilder.newBuilder()
        .setPaletteCategory(IsometricComponents.COMPONENT_CATEGORY_CUSTOM_2D)
        .setId(COMPONENT_ID)
        .setModuleId(IsometricComponents.MODULE_ID)
        .setSchema(SCHEMA)
        .setName("Genset SLD S32")
        .addPaletteEntry("", "Genset SLD S32", "S32 single-line genset SVG with bindable line, section color, and glow controls.", null, null)
        .setDefaultMetaName("gensetSldS322d")
        .setResources(IsometricComponents.BROWSER_RESOURCES)
        .build();

    private Custom2DGensetSldS32() {
    }
}
