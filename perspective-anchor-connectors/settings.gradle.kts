pluginManagement {
    repositories {
        gradlePluginPortal()
        mavenCentral()
        mavenLocal()
        // Add the IA repo to pull in the module-signer artifact.
        maven {
            url = uri("https://nexus.inductiveautomation.com/repository/public/")
        }
    }
}

dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.PREFER_SETTINGS)

    repositories {
        mavenLocal()
        maven {
            url = uri("https://nexus.inductiveautomation.com/repository/public/")
        }
        maven {
            url = uri("https://nexus.inductiveautomation.com/repository/inductiveautomation-beta/")
        }
        ivy {
            name = "Node.js"
            setUrl("https://nodejs.org/dist/")
            patternLayout {
                artifact("v[revision]/[artifact](-v[revision]-[classifier]).[ext]")
            }
            metadataSources {
                artifact()
            }
            content {
                includeModule("org.nodejs", "node")
            }
        }
    }
}

enableFeaturePreview("TYPESAFE_PROJECT_ACCESSORS")

// this file configures settings for the Gradle build tools, as well as the project structure.
rootProject.name = "perspective-anchor-connectors"

include(":gateway", ":common", ":designer", ":web")
