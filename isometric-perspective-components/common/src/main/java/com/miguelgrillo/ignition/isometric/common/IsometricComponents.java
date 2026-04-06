package com.miguelgrillo.ignition.isometric.common;

import java.util.Set;
import com.inductiveautomation.perspective.common.api.BrowserResource;

/**
 * Centralized constants and browser resource definitions for the module.
 */
public final class IsometricComponents {

    public static final String MODULE_ID = "com.miguelgrillo.ignition.isometric";
    public static final String URL_ALIAS = "isometric-components";
    public static final String COMPONENT_CATEGORY_ISOMETRIC = "Isometric SVG";
    public static final String COMPONENT_CATEGORY_CUSTOM_2D = "Custom 2D Images";

    public static final Set<BrowserResource> BROWSER_RESOURCES =
        Set.of(
            new BrowserResource(
                "isometric-components-js",
                String.format("/res/%s/js/isometric-components.js", URL_ALIAS),
                BrowserResource.ResourceType.JS
            )
        );

    private IsometricComponents() {
    }
}
