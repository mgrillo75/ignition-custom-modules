package com.miguelgrillo.ignition.isometric.common.comp;

import com.inductiveautomation.ignition.common.jsonschema.JsonSchema;
import com.inductiveautomation.perspective.common.api.ComponentDescriptor;
import com.inductiveautomation.perspective.common.api.ComponentDescriptorImpl;
import com.miguelgrillo.ignition.isometric.common.IsometricComponents;

public final class Custom2DBusbarHTeeDown {

    public static final String COMPONENT_ID = "com.miguelgrillo.custom2d.busbar_h_tee_down";

    public static final JsonSchema SCHEMA =
        JsonSchema.parse(IsometricComponents.class.getResourceAsStream("/custom2d-svg.props.json"));

    public static final ComponentDescriptor DESCRIPTOR = ComponentDescriptorImpl.ComponentBuilder.newBuilder()
        .setPaletteCategory(IsometricComponents.COMPONENT_CATEGORY_CUSTOM_2D)
        .setId(COMPONENT_ID)
        .setModuleId(IsometricComponents.MODULE_ID)
        .setSchema(SCHEMA)
        .setName("Busbar H Tee Down")
        .addPaletteEntry("", "Busbar H Tee Down", "Horizontal-style busbar tee connector (down).", null, null)
        .setDefaultMetaName("busbarHTeeDown2d")
        .setResources(IsometricComponents.BROWSER_RESOURCES)
        .build();

    private Custom2DBusbarHTeeDown() {
    }
}