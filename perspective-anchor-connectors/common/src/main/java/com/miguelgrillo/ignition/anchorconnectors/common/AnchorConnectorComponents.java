package com.miguelgrillo.ignition.anchorconnectors.common;

import java.util.Set;
import com.inductiveautomation.perspective.common.api.BrowserResource;

/**
 * Centralized constants and browser resource definitions for the module.
 */
public final class AnchorConnectorComponents {

    public static final String MODULE_ID = "com.miguelgrillo.ignition.anchorconnectors";
    public static final String URL_ALIAS = "anchor-connectors";
    public static final String COMPONENT_CATEGORY = "Anchor Connectors";

    public static final Set<BrowserResource> BROWSER_RESOURCES =
        Set.of(
            new BrowserResource(
                "anchor-connectors-js",
                String.format("/res/%s/js/anchor-connectors.js", URL_ALIAS),
                BrowserResource.ResourceType.JS
            )
        );

    private AnchorConnectorComponents() {
    }
}
