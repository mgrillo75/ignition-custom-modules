package com.miguelgrillo.ignition.xyflowcanvas.common.comp;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.inductiveautomation.ignition.common.gson.JsonElement;
import com.inductiveautomation.ignition.common.gson.JsonObject;
import com.inductiveautomation.ignition.common.gson.JsonParser;
import com.miguelgrillo.ignition.xyflowcanvas.common.XYFlowCanvasComponents;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import org.junit.jupiter.api.Test;

class XYFlowCanvasSchemaTest {

    @Test
    void schemaModelsPersistedDocumentShapeWithBoundedNodeAndEdgeItems() throws Exception {
        JsonObject schema = loadSchema();
        JsonObject document = getObject(schema, "properties", "document", "properties");
        JsonObject nodes = getObject(document, "nodes");
        JsonObject nodeItems = getObject(nodes, "items");
        JsonObject nodeProperties = getObject(nodeItems, "properties");
        JsonObject edges = getObject(document, "edges");
        JsonObject edgeItems = getObject(edges, "items");
        JsonObject edgeProperties = getObject(edgeItems, "properties");

        assertTrue(nodeItems.has("additionalProperties"), "document.nodes.items must declare additionalProperties");
        assertFalse(nodeItems.get("additionalProperties").getAsBoolean(), "document.nodes.items must remain bounded");
        assertTrue(edgeItems.has("additionalProperties"), "document.edges.items must declare additionalProperties");
        assertFalse(edgeItems.get("additionalProperties").getAsBoolean(), "document.edges.items must remain bounded");

        assertTrue(nodeProperties.has("origin"), "free endpoint nodes need origin");
        JsonObject origin = getObject(nodeProperties, "origin");
        assertEquals("array", origin.get("type").getAsString());
        JsonObject originItems = getObject(origin, "items");
        assertEquals("number", originItems.get("type").getAsString());
        assertEquals(2, origin.get("minItems").getAsInt());
        assertEquals(2, origin.get("maxItems").getAsInt());

        assertBooleanProperty(nodeProperties, "draggable");
        assertBooleanProperty(nodeProperties, "selectable");
        assertBooleanProperty(nodeProperties, "connectable");

        assertBooleanProperty(edgeProperties, "reconnectable");
    }

    private static void assertBooleanProperty(JsonObject properties, String key) {
        JsonObject property = getObject(properties, key);
        assertEquals("boolean", property.get("type").getAsString(), key + " must be boolean");
    }

    private static JsonObject loadSchema() throws IOException {
        try (InputStream input = XYFlowCanvasComponents.class.getResourceAsStream("/xy-flow-canvas.props.json")) {
            if (input == null) {
                throw new AssertionError("Missing schema resource");
            }
            JsonParser parser = new JsonParser();
            JsonElement element = parser.parse(new InputStreamReader(input, StandardCharsets.UTF_8));
            return element.getAsJsonObject();
        }
    }

    private static JsonObject getObject(JsonObject parent, String key) {
        JsonElement child = parent.get(key);
        if (child == null || !child.isJsonObject()) {
            throw new AssertionError("Expected object property: " + key);
        }
        return child.getAsJsonObject();
    }

    private static JsonObject getObject(JsonObject parent, String firstKey, String secondKey, String thirdKey) {
        return getObject(getObject(getObject(parent, firstKey), secondKey), thirdKey);
    }
}
