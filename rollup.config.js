export default {
  input: "main.js",
  output: {
    file: "bundle.cjs",
    format: "cjs",
    exports: "auto",
    generatedCode: {
      constBindings: true,
    },
  },
  external: [/^node:/],
};
