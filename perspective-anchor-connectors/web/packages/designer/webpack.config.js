const path = require("path");

module.exports = () => ({
    entry: path.join(__dirname, "src/index.js"),
    output: {
        path: path.join(__dirname, "dist"),
        filename: "designer.js",
        libraryTarget: "umd",
        umdNamedDefine: true
    },
    devtool: "source-map",
    resolve: {
        extensions: [".js"]
    }
});
