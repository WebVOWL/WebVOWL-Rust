module.exports.path_func = new function () {
    this.srcPath = "src/main";
    this.webappPath = `${this.srcPath}/webapp`;
    this.frontendPath = `${this.webappPath}/frontend`;
    this.backendPath = `${this.webappPath}/backend`;
    this.testPath = `${this.srcPath}/test/frontend`;
    this.deployPath = "target/deploy";
    this.deployZipPath = `${this.deployPath}/compressed`
    this.nodeModulePath = "node_modules";
};