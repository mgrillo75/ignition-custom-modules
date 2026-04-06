package com.miguelgrillo.ignition.isometric.common.comp;

import com.inductiveautomation.ignition.common.jsonschema.JsonSchema;
import com.inductiveautomation.perspective.common.api.ComponentDescriptor;
import com.inductiveautomation.perspective.common.api.ComponentDescriptorImpl;
import com.miguelgrillo.ignition.isometric.common.IsometricComponents;

public final class Custom2DMvGensetScreenMain {

    public static final String COMPONENT_ID = "com.miguelgrillo.custom2d.mv_genset_screen_main";

    public static final JsonSchema SCHEMA =
        JsonSchema.parse(IsometricComponents.class.getResourceAsStream("/custom2d-mv-genset-screen-main.props.json"));

    public static final ComponentDescriptor DESCRIPTOR = ComponentDescriptorImpl.ComponentBuilder.newBuilder()
        .setPaletteCategory(IsometricComponents.COMPONENT_CATEGORY_CUSTOM_2D)
        .setId(COMPONENT_ID)
        .setModuleId(IsometricComponents.MODULE_ID)
        .setSchema(SCHEMA)
        .setName("MV Genset Screen (Main)")
        .addPaletteEntry("", "MV Genset Screen (Main)", "MV genset screen SVG wrapper with bindable overlay text.", null, null)
        .setDefaultMetaName("mvGensetScreenMain2d")
        .setResources(IsometricComponents.BROWSER_RESOURCES)
        .build();

    private Custom2DMvGensetScreenMain() {
    }
}
