const path = require("path");

module.exports = (_, argv = {}) => {
    const isProduction = argv.mode === "production";

    return {
        mode: isProduction ? "production" : "development",
        entry: path.join(__dirname, "src/index.js"),
        output: {
            path: path.join(__dirname, "dist"),
            filename: "xy-flow-canvas.js",
            clean: true,
            libraryTarget: "umd",
            umdNamedDefine: true
        },
        devtool: isProduction ? false : "source-map",
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/i,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            presets: [
                                [
                                    "@babel/preset-env",
                                    {
                                        targets: "defaults"
                                    }
                                ],
                                [
                                    "@babel/preset-react",
                                    {
                                        runtime: "classic"
                                    }
                                ]
                            ]
                        }
                    }
                },
                {
                    test: /\.css$/i,
                    use: ["style-loader", "css-loader"]
                },
                {
                    test: /\.svg$/i,
                    type: "asset/source"
                }
            ]
        },
        resolve: {
            alias: {
                "react/jsx-runtime": path.join(__dirname, "src/runtime/react-jsx-runtime-shim.js"),
                "react/jsx-dev-runtime": path.join(__dirname, "src/runtime/react-jsx-runtime-shim.js")
            },
            extensions: [".js", ".jsx"]
        },
        externals: {
            react: "React",
            "react-dom": "ReactDOM",
            "@inductiveautomation/perspective-client": "PerspectiveClient"
        }
    };
};
