module.exports.path_func = new function () {
    this.srcPath = "src";
    this.frontendPath = `${this.srcPath}/app`;
    this.backendPath = `${this.srcPath}/webvowl`;
    this.testPath = `test`;
    this.deployPath = "target/deploy";
    this.deployZipPath = `${this.deployPath}/compressed`
    this.nodeModulePath = "node_modules";
};