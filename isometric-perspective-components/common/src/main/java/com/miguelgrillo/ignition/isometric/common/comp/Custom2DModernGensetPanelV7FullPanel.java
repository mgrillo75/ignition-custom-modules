package com.miguelgrillo.ignition.isometric.common.comp;

import com.inductiveautomation.ignition.common.jsonschema.JsonSchema;
import com.inductiveautomation.perspective.common.api.ComponentDescriptor;
import com.inductiveautomation.perspective.common.api.ComponentDescriptorImpl;
import com.miguelgrillo.ignition.isometric.common.IsometricComponents;

public final class Custom2DModernGensetPanelV7FullPanel {

    public static final String COMPONENT_ID = "com.miguelgrillo.custom2d.modern_genset_panel_v7_full_panel";

    public static final JsonSchema SCHEMA =
        JsonSchema.parse(IsometricComponents.class.getResourceAsStream("/custom2d-modern-genset-panel.props.json"));

    public static final ComponentDescriptor DESCRIPTOR = ComponentDescriptorImpl.ComponentBuilder.newBuilder()
        .setPaletteCategory(IsometricComponents.COMPONENT_CATEGORY_CUSTOM_2D)
        .setId(COMPONENT_ID)
        .setModuleId(IsometricComponents.MODULE_ID)
        .setSchema(SCHEMA)
        .setName("Modern Genset Panel V7 (Full Panel)")
        .addPaletteEntry("", "Modern Genset Panel V7 (Full Panel)", "Genset panel SVG with bindable state text and accent colors.", null, null)
        .setDefaultMetaName("modernGensetPanelV7FullPanel2d")
        .setResources(IsometricComponents.BROWSER_RESOURCES)
        .build();

    private Custom2DModernGensetPanelV7FullPanel() {
    }
}
