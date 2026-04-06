plugins {
    base
    // the ignition module plugin: https://github.com/inductiveautomation/ignition-module-tools
    id("io.ia.sdk.modl") version("0.1.1")
}

allprojects {
    version = "0.1.5-SNAPSHOT"
    group = "com.miguelgrillo.ignition.anchorconnectors"
}

ignitionModule {
    // name of the .modl file to build
    fileName.set("PerspectiveAnchorConnectors")

    // module xml configuration
    name.set("Perspective Anchor Connectors")
    id.set("com.miguelgrillo.ignition.anchorconnectors")
    moduleVersion.set("${project.version}")
    moduleDescription.set("Adds a rendered anchor-aware connector canvas component to Perspective.")
    requiredIgnitionVersion.set("8.3.0")
    requiredFrameworkVersion.set("8")
    freeModule.set(true)
    license.set("license.html")

    // Perspective is required in gateway/designer scopes.
    moduleDependencies.putAll(
        mapOf(
            "com.inductiveautomation.perspective" to "GD"
        )
    )

    // map of subproject path to module scope
    projectScopes.putAll(
        mapOf(
            ":gateway" to "G",
            ":common" to "DG",
            ":designer" to "D",
            ":web" to "G"
        )
    )

    // scope hook classes
    hooks.putAll(
        mapOf(
            "com.miguelgrillo.ignition.anchorconnectors.gateway.AnchorConnectorsGatewayHook" to "G",
            "com.miguelgrillo.ignition.anchorconnectors.designer.AnchorConnectorsDesignerHook" to "D"
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
