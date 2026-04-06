package com.miguelgrillo.ignition.anchorconnectors.common.comp;

import java.util.Objects;

import com.inductiveautomation.ignition.common.jsonschema.JsonSchema;
import com.inductiveautomation.perspective.common.api.ComponentDescriptor;
import com.inductiveautomation.perspective.common.api.ComponentDescriptorImpl;
import com.miguelgrillo.ignition.anchorconnectors.common.AnchorConnectorComponents;

final class AnchorConnectorDescriptorFactory {

    static JsonSchema loadSchema(String resourceName) {
        return JsonSchema.parse(Objects.requireNonNull(
            AnchorConnectorComponents.class.getResourceAsStream(resourceName),
            "Missing schema resource: " + resourceName
        ));
    }

    static ComponentDescriptor buildDescriptor(String componentId, String displayName, String paletteDescription, String defaultMetaName, String schemaResourceName) {
        return ComponentDescriptorImpl.ComponentBuilder.newBuilder()
            .setPaletteCategory(AnchorConnectorComponents.COMPONENT_CATEGORY)
            .setId(componentId)
            .setModuleId(AnchorConnectorComponents.MODULE_ID)
            .setSchema(loadSchema(schemaResourceName))
            .setName(displayName)
            .addPaletteEntry("", displayName, paletteDescription, null, null)
            .setDefaultMetaName(defaultMetaName)
            .setResources(AnchorConnectorComponents.BROWSER_RESOURCES)
            .build();
    }

    private AnchorConnectorDescriptorFactory() {
    }
}
