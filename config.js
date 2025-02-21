module.exports.path_func = new function () {
    // General stuff
    this.srcPath = "src/main";

    // Deploy
    this.deployPath = "target/deploy";
    this.deployZipPath = `${this.deployPath}/compressed`

    // Rust
    this.rustPath = `${this.srcPath}/rust`;
    this.pgkPath = `${this.deployPath}/pgk`

    // JS/CSS/HTML
    this.webappPath = `${this.srcPath}/webapp`;
    this.frontendPath = `${this.webappPath}/frontend`;
    this.backendPath = `${this.webappPath}/backend`;
    this.testPath = `${this.srcPath}/test/frontend`;
    this.nodeModulePath = "node_modules";
};