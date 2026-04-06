const path = require("node:path");

const testFiles = [
    "../state/document-model.test.js",
    "../nodes/svg-markup.test.js",
    "../components/canvas-render-state.test.js",
    "./webpack-config.test.js"
];

let failures = 0;

for (const relativePath of testFiles) {
    const absolutePath = path.resolve(__dirname, relativePath);
    try {
        require(absolutePath);
        console.log(`PASS ${relativePath}`);
    } catch (error) {
        failures += 1;
        console.error(`FAIL ${relativePath}`);
        console.error(error && error.stack ? error.stack : error);
    }
}

if (failures > 0) {
    process.exitCode = 1;
}
