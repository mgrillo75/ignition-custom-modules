function resolvePropWriter(store) {
    if (store && store.props && typeof store.props.write === "function") {
        return store.props.write.bind(store.props);
    }
    if (store && typeof store.write === "function") {
        return store.write.bind(store);
    }
    return null;
}

function writeCanvasProps(writer, payload) {
    if (typeof writer !== "function" || !payload) {
        return;
    }

    if (payload.document) {
        writer("document", payload.document);
    }
    if (payload.viewport) {
        writer("viewport", payload.viewport);
    }
    if (payload.selection) {
        writer("selection", payload.selection);
    }
}

module.exports = {
    resolvePropWriter,
    writeCanvasProps
};
