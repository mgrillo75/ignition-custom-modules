package com.miguelgrillo.ignition.isometric.common.comp;

import com.inductiveautomation.ignition.common.jsonschema.JsonSchema;
import com.inductiveautomation.perspective.common.api.ComponentDescriptor;
import com.inductiveautomation.perspective.common.api.ComponentDescriptorImpl;
import com.miguelgrillo.ignition.isometric.common.IsometricComponents;

public final class IsometricValve {

    public static final String COMPONENT_ID = "com.miguelgrillo.isometric.valve";

    public static final JsonSchema SCHEMA =
        JsonSchema.parse(IsometricComponents.class.getResourceAsStream("/isometric-valve.props.json"));

    public static final ComponentDescriptor DESCRIPTOR = ComponentDescriptorImpl.ComponentBuilder.newBuilder()
        .setPaletteCategory(IsometricComponents.COMPONENT_CATEGORY_ISOMETRIC)
        .setId(COMPONENT_ID)
        .setModuleId(IsometricComponents.MODULE_ID)
        .setSchema(SCHEMA)
        .setName("Isometric Valve")
        .addPaletteEntry("", "Valve (Iso)", "Isometric valve SVG with bindable properties.", null, null)
        .setDefaultMetaName("isoValve")
        .setResources(IsometricComponents.BROWSER_RESOURCES)
        .build();

    private IsometricValve() {
    }
}
