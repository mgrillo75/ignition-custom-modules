plugins {
    base
    // the ignition module plugin: https://github.com/inductiveautomation/ignition-module-tools
    id("io.ia.sdk.modl") version("0.1.1")
}

allprojects {
    version = "0.1.6-SNAPSHOT"
    group = "com.miguelgrillo.ignition.isometric"
}

ignitionModule {
    // name of the .modl file to build
    fileName.set("IsometricPerspectiveComponents")

    // module xml configuration
    name.set("Isometric Perspective Components")
    id.set("com.miguelgrillo.ignition.isometric")
    moduleVersion.set("${project.version}")
    moduleDescription.set("Adds isometric SVG components to Perspective with bindable appearance and status properties.")
    requiredIgnitionVersion.set("8.3.0")
    requiredFrameworkVersion.set("8")
    // says 'this module is free, does not require licensing'.  Defaults to false, delete for commercial modules.
    freeModule.set(true)
    license.set("license.html")

    // If we depend on other module being loaded/available, then we specify IDs of the module we depend on,
    // and specify the Ignition Scope(s) that apply. "G" for gateway, "D" for designer, "C" for VISION client
    // (this module does not run in the scope of a Vision client, so we don't need a "C" entry here)
    moduleDependencies.putAll(
        mapOf(
            "com.inductiveautomation.perspective" to "GD"
        )
    )

    // map of 'Gradle Project Path' to Ignition Scope in which the project is relevant.  This is is combined with
    // the dependency declarations within the subproject's build.gradle.kts in order to determine which
    // dependencies need to be bundled with the module and added to the module.xml.
    projectScopes.putAll(
        mapOf(
            ":gateway" to "G",
            ":common" to "DG",
            ":designer" to "D"
        )
    )

    // 'hook classes' are the things that Ignition loads and runs when your module is installed.  This map tells
    // Ignition which classes should be loaded in a given scope.
    hooks.putAll(
        mapOf(
            "com.miguelgrillo.ignition.isometric.gateway.IsometricGatewayHook" to "G",
            "com.miguelgrillo.ignition.isometric.designer.IsometricDesignerHook" to "D"
        )
    )
    skipModlSigning.set(true)
}


val deepClean by tasks.registering {
    dependsOn(allprojects.map { "${it.path}:clean" })
    description = "Executes clean tasks and remove node plugin caches."
    doLast {
        delete(file(".gradle"))
    }
}
