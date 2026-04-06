import com.github.gradle.node.yarn.task.YarnTask
import org.gradle.api.tasks.Copy
import org.gradle.api.tasks.Delete
import org.gradle.language.jvm.tasks.ProcessResources

plugins {
    java
    id("com.github.node-gradle.node") version("3.2.1")
}

val generatedResourcesDir = layout.buildDirectory.dir("generated-resources")
val gatewayRuntimeSource = project(":gateway").layout.projectDirectory.file("src/main/resources/mounted/js/xy-flow-canvas.js")
val clientBundle = layout.projectDirectory.file("packages/client/dist/xy-flow-canvas.js")
val generatedMountedBundle = generatedResourcesDir.map { it.file("mounted/js/xy-flow-canvas.js") }

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
        file("packages/client/node_modules")
    )
    dependsOn("${project.path}:yarn", ":web:npmSetup")
}

val webBuild by tasks.registering(YarnTask::class) {
    group = "Ignition Module"
    description = "Runs the workspace build script for the web package."
    args.set(listOf("build"))
    dependsOn(yarnInstall)
    inputs.files(
        project.fileTree("packages").matching {
            exclude("**/node_modules/**", "**/dist/**", "**/.awcache/**", "**/yarn-error.log")
        }.toList()
    )
    inputs.file(gatewayRuntimeSource)
    outputs.file(clientBundle)
}

val copyClientBundle by tasks.registering(Copy::class) {
    dependsOn(webBuild)
    from(clientBundle)
    into(generatedResourcesDir.map { it.dir("mounted/js") })
    rename { "xy-flow-canvas.js" }
    inputs.file(clientBundle)
    outputs.file(generatedMountedBundle)
}

tasks.named<ProcessResources>("processResources") {
    dependsOn(copyClientBundle)
}

val deleteDistFolders by tasks.registering(Delete::class) {
    delete(file("node_modules"))
    delete(file("packages/client/dist"))
    delete(file("packages/client/node_modules"))
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
