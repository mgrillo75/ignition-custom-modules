package com.miguelgrillo.ignition.xyflowcanvas.common.comp;

import java.util.Objects;
import com.inductiveautomation.ignition.common.jsonschema.JsonSchema;
import com.inductiveautomation.perspective.common.api.ComponentDescriptor;
import com.inductiveautomation.perspective.common.api.ComponentDescriptorImpl;
import com.miguelgrillo.ignition.xyflowcanvas.common.XYFlowCanvasComponents;

public final class XYFlowCanvas {

    public static final String COMPONENT_ID = "com.miguelgrillo.ignition.xyflowcanvas.canvas";

    public static final JsonSchema SCHEMA = JsonSchema.parse(Objects.requireNonNull(
        XYFlowCanvasComponents.class.getResourceAsStream("/xy-flow-canvas.props.json"),
        "Missing schema resource: /xy-flow-canvas.props.json"
    ));

    public static final ComponentDescriptor DESCRIPTOR = ComponentDescriptorImpl.ComponentBuilder.newBuilder()
        .setPaletteCategory(XYFlowCanvasComponents.COMPONENT_CATEGORY)
        .setId(COMPONENT_ID)
        .setModuleId(XYFlowCanvasComponents.MODULE_ID)
        .setSchema(SCHEMA)
        .setName("XY Flow Canvas")
        .addPaletteEntry(
            "",
            "XY Flow Canvas",
            "An XYFlow-based canvas component for Perspective document editing.",
            null,
            null
        )
        .setDefaultMetaName("xyFlowCanvas")
        .setResources(XYFlowCanvasComponents.BROWSER_RESOURCES)
        .build();

    private XYFlowCanvas() {
    }
}
