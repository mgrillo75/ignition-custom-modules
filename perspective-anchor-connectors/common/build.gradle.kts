plugins {
    `java-library`
}

java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(17))
    }
}

dependencies {
    // compileOnly is the gradle equivalent to "provided" scope.
    compileOnly(libs.ignition.common)
    compileOnly(libs.ignition.perspective.common)
    compileOnly(libs.google.guava)
    compileOnly(libs.ia.gson)
}
