const assert = require("node:assert/strict");
const path = require("node:path");

const createWebpackConfig = require(path.resolve(__dirname, "../../webpack.config.js"));

{
    const productionConfig = createWebpackConfig({}, { mode: "production" });
    assert.equal(productionConfig.mode, "production");
    assert.equal(productionConfig.devtool, false);
    assert.equal(productionConfig.output.clean, true);
}

{
    const developmentConfig = createWebpackConfig({}, { mode: "development" });
    assert.equal(developmentConfig.mode, "development");
    assert.equal(developmentConfig.devtool, "source-map");
}
