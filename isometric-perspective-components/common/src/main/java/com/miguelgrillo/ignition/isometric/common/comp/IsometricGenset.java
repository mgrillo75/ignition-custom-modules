package com.miguelgrillo.ignition.isometric.common.comp;

import com.inductiveautomation.ignition.common.jsonschema.JsonSchema;
import com.inductiveautomation.perspective.common.api.ComponentDescriptor;
import com.inductiveautomation.perspective.common.api.ComponentDescriptorImpl;
import com.miguelgrillo.ignition.isometric.common.IsometricComponents;

public final class IsometricGenset {

    public static final String COMPONENT_ID = "com.miguelgrillo.isometric.genset";

    public static final JsonSchema SCHEMA =
        JsonSchema.parse(IsometricComponents.class.getResourceAsStream("/isometric-genset.props.json"));

    public static final ComponentDescriptor DESCRIPTOR = ComponentDescriptorImpl.ComponentBuilder.newBuilder()
        .setPaletteCategory(IsometricComponents.COMPONENT_CATEGORY_ISOMETRIC)
        .setId(COMPONENT_ID)
        .setModuleId(IsometricComponents.MODULE_ID)
        .setSchema(SCHEMA)
        .setName("Isometric Genset")
        .addPaletteEntry("", "Genset (Iso)", "Isometric generator set SVG with bindable properties.", null, null)
        .setDefaultMetaName("isoGenset")
        .setResources(IsometricComponents.BROWSER_RESOURCES)
        .build();

    private IsometricGenset() {
    }
}
