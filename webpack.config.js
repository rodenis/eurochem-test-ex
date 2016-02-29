module.exports = {
    context: __dirname + "/client",
    entry: "./main",
    output: {
        path: __dirname + "/static",
        filename: "bundle.js"
    }
};