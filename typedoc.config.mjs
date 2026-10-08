module.exports = {
    entryPoints: ["ts/src/**/*.ts"],
    out: "docs/typedoc",
    sort: "source-order",
    plugin: ["./out/src/tools/typedoc-plugins/typedoc-wavedrom-plugin/typedoc-wavedrom-plugin.js"]
};