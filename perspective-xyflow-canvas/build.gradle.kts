plugins {
    base
    id("io.ia.sdk.modl") version("0.1.1")
}

allprojects {
    version = "0.1.2-SNAPSHOT"
    group = "com.miguelgrillo.ignition.xyflowcanvas"
}

ignitionModule {
    fileName.set("PerspectiveXYFlowCanvas")
    name.set("Perspective XY Flow Canvas")
    id.set("com.miguelgrillo.ignition.xyflowcanvas")
    moduleVersion.set("${project.version}")
    moduleDescription.set("Adds an XYFlow-based canvas component to Perspective.")
    requiredIgnitionVersion.set("8.3.0")
    requiredFrameworkVersion.set("8")
    freeModule.set(true)
    license.set("license.html")

    moduleDependencies.putAll(
        mapOf(
            "com.inductiveautomation.perspective" to "GD"
        )
    )

    projectScopes.putAll(
        mapOf(
            ":gateway" to "G",
            ":common" to "DG",
            ":designer" to "D",
            ":web" to "G"
        )
    )

    hooks.putAll(
        mapOf(
            "com.miguelgrillo.ignition.xyflowcanvas.gateway.XYFlowCanvasGatewayHook" to "G",
            "com.miguelgrillo.ignition.xyflowcanvas.designer.XYFlowCanvasDesignerHook" to "D"
        )
    )
    skipModlSigning.set(true)
}

val deepClean by tasks.registering {
    dependsOn(allprojects.map { "${it.path}:clean" })
    description = "Executes clean tasks and removes Gradle cache in the module root."
    doLast {
        delete(file(".gradle"))
    }
}
