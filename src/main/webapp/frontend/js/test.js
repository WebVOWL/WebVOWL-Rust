window.addEventListener("load", () => {
    import('./pkg').then((module) => {
        module.run()
    })
})