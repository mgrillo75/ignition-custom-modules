package com.miguelgrillo.ignition.isometric.common.comp;

import com.inductiveautomation.ignition.common.jsonschema.JsonSchema;
import com.inductiveautomation.perspective.common.api.ComponentDescriptor;
import com.inductiveautomation.perspective.common.api.ComponentDescriptorImpl;
import com.miguelgrillo.ignition.isometric.common.IsometricComponents;

public final class IsometricTestSvg {

    public static final String COMPONENT_ID = "com.miguelgrillo.isometric.testsvg";

    public static final JsonSchema SCHEMA =
        JsonSchema.parse(IsometricComponents.class.getResourceAsStream("/isometric-testsvg.props.json"));

    public static final ComponentDescriptor DESCRIPTOR = ComponentDescriptorImpl.ComponentBuilder.newBuilder()
        .setPaletteCategory(IsometricComponents.COMPONENT_CATEGORY_ISOMETRIC)
        .setId(COMPONENT_ID)
        .setModuleId(IsometricComponents.MODULE_ID)
        .setSchema(SCHEMA)
        .setName("Isometric Test SVG")
        .addPaletteEntry("", "Test SVG (Iso)", "Minimal test SVG for validating Perspective bindings.", null, null)
        .setDefaultMetaName("isoTestSvg")
        .setResources(IsometricComponents.BROWSER_RESOURCES)
        .build();

    private IsometricTestSvg() {
    }
}
