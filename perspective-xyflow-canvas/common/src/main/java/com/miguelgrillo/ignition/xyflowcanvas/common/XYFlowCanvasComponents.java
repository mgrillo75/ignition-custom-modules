package com.miguelgrillo.ignition.xyflowcanvas.common;

import java.util.Set;
import com.inductiveautomation.perspective.common.api.BrowserResource;

/**
 * Centralized constants and browser resource definitions for the module.
 */
public final class XYFlowCanvasComponents {

    public static final String MODULE_ID = "com.miguelgrillo.ignition.xyflowcanvas";
    public static final String URL_ALIAS = "xy-flow-canvas";
    public static final String COMPONENT_CATEGORY = "XY Flow Canvas";

    public static final Set<BrowserResource> BROWSER_RESOURCES =
        Set.of(
            new BrowserResource(
                "xy-flow-canvas-js",
                String.format("/res/%s/js/xy-flow-canvas.js", URL_ALIAS),
                BrowserResource.ResourceType.JS
            )
        );

    private XYFlowCanvasComponents() {
    }
}
