import org.gradle.language.jvm.tasks.ProcessResources

plugins {
    `java-library`
}

java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(17))
    }
}

dependencies {
    implementation(projects.common)
    modlImplementation(projects.web)
    // declare our dependencies on ignition sdk elements from gradle/libs.versions.toml
    compileOnly(libs.ignition.common)
    compileOnly(libs.ignition.gateway.api)
    compileOnly(libs.ignition.perspective.gateway)
    compileOnly(libs.ignition.perspective.common)
    compileOnly(libs.ia.gson)
}

tasks.named<ProcessResources>("processResources") {
    exclude("mounted/js/anchor-connectors.js")
}
