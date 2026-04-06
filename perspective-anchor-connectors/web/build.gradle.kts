import com.github.gradle.node.yarn.task.YarnTask
import org.gradle.api.tasks.Copy
import org.gradle.api.tasks.Delete
import org.gradle.language.jvm.tasks.ProcessResources

plugins {
    java
    id("com.github.node-gradle.node") version("3.2.1")
}

val generatedResourcesDir = layout.buildDirectory.dir("generated-resources")
val gatewayRuntimeSource = project(":gateway").layout.projectDirectory.file("src/main/resources/mounted/js/anchor-connectors.js")
val clientBundle = layout.projectDirectory.file("packages/client/dist/anchor-connectors.js")
val generatedMountedBundle = generatedResourcesDir.map { it.file("mounted/js/anchor-connectors.js") }

node {
    version.set("16.15.0")
    yarnVersion.set("1.22.18")
    npmVersion.set("8.5.5")
    download.set(true)
    nodeProjectDir.set(project.projectDir)
}

val yarnInstall by tasks.registering(YarnTask::class) {
    description = "Installs the web workspace dependencies."
    args.set(listOf("install", "--verbose"))
    inputs.files(
        fileTree(project.projectDir).matching {
            include("**/package.json", "**/yarn.lock", "**/.npmrc", "**/.yarnrc", "**/lerna.json")
        }
    )
    outputs.dirs(
        file("node_modules"),
        file("packages/client/node_modules"),
        file("packages/designer/node_modules")
    )
    dependsOn("${project.path}:yarn", ":web:npmSetup")
}

val webBuild by tasks.registering(YarnTask::class) {
    group = "Ignition Module"
    description = "Runs the workspace build scripts for the web packages."
    args.set(listOf("build"))
    dependsOn(yarnInstall)
    inputs.files(project.fileTree("packages").matching {
        exclude("**/node_modules/**", "**/dist/**", "**/.awcache/**", "**/yarn-error.log")
    }.toList())
    inputs.file(gatewayRuntimeSource)
    outputs.file(clientBundle)
}

val copyClientBundle by tasks.registering(Copy::class) {
    dependsOn(webBuild)
    from(clientBundle)
    into(generatedResourcesDir.map { it.dir("mounted/js") })
    rename { "anchor-connectors.js" }
    inputs.file(clientBundle)
    outputs.file(generatedMountedBundle)
}

val verifyMountedBundleCurrent by tasks.registering {
    group = "verification"
    description = "Verifies the generated mounted bundle contains current drag interaction symbols."
    dependsOn(copyClientBundle)
    inputs.file(gatewayRuntimeSource)
    inputs.file(generatedMountedBundle)

    doLast {
        val bundleFile = generatedMountedBundle.get().asFile
        require(bundleFile.isFile) {
            "Generated mounted bundle was not created at ${bundleFile.absolutePath}"
        }
        val bundleText = bundleFile.readText()
        val expectedSymbol = "beginEndpointDrag"
        if (!bundleText.contains(expectedSymbol)) {
            throw GradleException(
                "Generated mounted bundle ${bundleFile.absolutePath} does not contain required symbol '$expectedSymbol'."
            )
        }
        logger.lifecycle("Verified mounted bundle {} contains '{}'.", bundleFile.absolutePath, expectedSymbol)
    }
}

tasks.named<ProcessResources>("processResources") {
    dependsOn(verifyMountedBundleCurrent)
}

val deleteDistFolders by tasks.registering(Delete::class) {
    delete(file("packages/client/dist"))
    delete(file("packages/client/node_modules"))
    delete(file("packages/designer/dist"))
    delete(file("packages/designer/node_modules"))
    delete(generatedResourcesDir)
}

tasks.named("clean") {
    dependsOn(deleteDistFolders)
}

sourceSets {
    main {
        output.dir(generatedResourcesDir, "builtBy" to listOf(copyClientBundle))
    }
}
