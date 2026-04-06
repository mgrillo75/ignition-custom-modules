# Plugins Reference _ Ignition SDK Programmer's Guide

---
### Appendix Plugins Reference

# **Version:** 8.3 Plugins Reference

This section details configuration settings for the Gradle and Maven Ignition SDK plugins. If you created your project using a plugin,

most of these settings will already be configured for you.

### Gradle Maven

The Ignition Module Plugin for Gradle lets module developers use the Gradle build tool to create and sign functional modules through

a convenient DSL-based configuration model.

This plugin is applied to a single project (the 'root' of the module) that may or may not have child projects. When the plugin is applied,
```
it will attempt to identify if the root or any subprojects apply the java-library plugin. For each that does, it will add the modlApi and
modlImplementation configurations so that they may be used in the project's dependency settings. In addition, it will create the asset
collection tasks and bind them to the _ assemble_ lifecycle tasks, and ultimately establish task dependencies for the 'root-specific'
```
tasks that create the module xml, copy files into the appropriate structure, zip the folder into an unsigned modl file, sign it, and report

the result.

## Usage

To apply the plugin to an existing project, follow the instructions on the plugin's Gradle Plugin Repo Page, and then configure as

described below.

### Apply the plugin

12/17/25, 3:12 PM Plugins Reference | Ignition SDK Programmer's Guide

https://www.sdk-docs.inductiveautomation.com/docs/8.3/appendix/plugins 1/8

*[Image on page 2]*


*[Image on page 2]*


*[Image on page 2]*
```
Apply the plugin to a build.gradle or build.gradle.kts file. In the case of a multi-project build, apply to the root or parent project.
```
### NOTE

You should only apply the plugin to a single parent project in a multi-scope structure (e.g., one where you have separate source
```
directories for gateway and designer code, for instance). If you have questions about structure, use the module generator to
```
create well-structured examples.
```
For current versions of gradle, add to your build.gradle.kts :
```
Or for Groovy DSL buildscripts:

### Configure the module
```
Configure your module through the ignitionModule configuration DSL. See DSL properties section below for details.
```
Choosing which Configuration to apply may have important but subtle impacts on your module, as well as your development/build

environment. In general, the following rule of thumb is a good starting point:
```
// build.gradle.kts
plugins {
id("io.ia.sdk.modl") version("0.1.1")
}
// build.gradle
plugins {
id 'io.ia.sdk.modl' version '0.1.1'
}
```
12/17/25, 3:12 PM Plugins Reference | Ignition SDK Programmer's Guide

https://www.sdk-docs.inductiveautomation.com/docs/8.3/appendix/plugins 2/8

### Configuration Usage Suggestion

### Included in

### Module?

### Includes Transitive

### Dependencies In

### Module?

### Exposes Transitive

### Dependencies to

### Artifact Consumers?

compileOnly

Use for 'compile time only'

dependencies, including ignition

sdk dependencies. Similar to

maven 'provided'.

No No No

compileOnlyApi

Use for 'compile time only'

dependencies, including ignition

sdk dependencies. Similar to

maven 'provided'.

No No No

api

Project dependencies that do not

explicitly get registered in the

module DSL project scopes.

No No Yes

implementation

Project dependencies that do not

explicitly get registered in the

module DSL project scopes.

No No No

modlImplementation

Dependencies that are used in a

module project's implementation,

but are not part of a public API.

Yes Yes No

12/17/25, 3:12 PM Plugins Reference | Ignition SDK Programmer's Guide

https://www.sdk-docs.inductiveautomation.com/docs/8.3/appendix/plugins 3/8

*[Image on page 4]*


*[Image on page 4]*

### Configuration Usage Suggestion

### Included in

### Module?

### Includes Transitive

### Dependencies In

### Module?

### Exposes Transitive

### Dependencies to

### Artifact Consumers?

modlApi

Dependencies that are used in a

module project and are exposed to

dependents.

Yes Yes Yes

### ignitionModule DSL Properties
```
Configuration for a module occurs through the ignitionModule extension DSL. See the source code ModuleSettings.kt for all
```
options and descriptions. Example configuration in a groovy buildscript:
```
Configuring in a kotlin buildscript is similar, except that you'll want to use the appropriate set() methods. Here is an example:
```
### Configure signing settings
```
Configure your signing settings, either in a gradle.properties file, or as commandline flags. The required properties are defined in
```
constants.kt, and used in the SignModule task. You may mix and match flags and properties (and flags will override properties), as

long as all required values are configured. The only requirement is that option flags must follow the gradle command to which they

apply, which is the 'signModule' task in this case. The flags/properties are as follows, with usage examples:

Groovy example

Kotlin example

12/17/25, 3:12 PM Plugins Reference | Ignition SDK Programmer's Guide

https://www.sdk-docs.inductiveautomation.com/docs/8.3/appendix/plugins 4/8

*[Image on page 5]*

### NOTE
```
Builds prior to v0.1.0-SNAPSHOT-6 used a separate property file called signing.properties . Builds after that use
gradle.properties files instead.
```
### Flag Usage gradle.properties entry

certAlias gradlew signModule --certAlias=someAlias ignition.signing.certAlias=someAlias

certFile gradlew signModule --certFile=/path/to/cert ignition.signing.certFile=/path/to/cert

certPassword gradlew signModule --certPassword=mysecret ignition.signing.certFile=mysecret

keystoreFile gradlew signModule --keystoreFile=/path/to/keystore ignition.signing.keystoreFile=/path/to/keystore

keystorePassword gradlew signModule --keystorePassword=mysecret ignition.signing.keystoreFile=mysecret

### Specify dependencies
```
When depending on artifacts (dependencies) from the Ignition SDK, they should be specified as compileOnly or compileOnlyApi
dependencies as they will be provided by the Ignition platform at runtime. Dependencies that are applied with either the modlApi or
modlImplementation Configuration in any subproject of your module will be collected and included in the final .modl file, including
```
transitive dependencies.
```
In general, behaviors of the _modl_ configuration follow those documented by the Gradle java-library plugin (e.g. - publishing, artifact
uploading, transitive dependency handling, etc). Test-only dependencies should NOT be marked with any modl configuration. Test
and Compile-time dependencies should be specified in accordance with the best practices described in Gradle's java-library
```
### plugin documentation.

12/17/25, 3:12 PM Plugins Reference | Ignition SDK Programmer's Guide

https://www.sdk-docs.inductiveautomation.com/docs/8.3/appendix/plugins 5/8

*[Image on page 6]*

## Tasks

### TIP
```
To see all tasks provided by the plugin, run the tasks gradle command, or tasks --all to see all possible tasks.
```
The module plugin exposes a number of tasks that may be run on their own, and some which are bound to lifecycle tasks provided by

Gradle's Base Plugin. Some tasks apply only to the root project (the project which is applying the plugin), while others are applied to

one or more subprojects. The following table is a brief reference:

### Task Scope Description

collectModlDependencies root and child projects

Resolves and collects dependencies from
```
projects with the java-library plugin that
```
marked with 'modlApi/modlImplementation'

configuration

assembleModlStructure

aggregates assets, dependencies and

assembled project jars created by the

'collectModlDependencies' task into the

module staging directory

writeModuleXml root project Writes the module.xml file to the staging directory

zipModule root project

Compresses the staged module contents into an

unsigned zip archive with a .modl file extension

12/17/25, 3:12 PM Plugins Reference | Ignition SDK Programmer's Guide

https://www.sdk-docs.inductiveautomation.com/docs/8.3/appendix/plugins 6/8

*[Image on page 7]*

### Task Scope Description

checksumModl root project

Generates a checksum for the signed module,

and writes the result to a json file

moduleAssemblyReport root project

Writes a json file containing meta information

about the module's assembly

signModl root project

signs the unsigned modl using credentials/certs

noted above

deployModl root project

deploys the built module file to an ignition

gateway running in developer module upload

mode ˟

### Developer mode
```
To enable the developer mode, add -Dia.developer.moduleupload=true to the 'Java Additional Parameters' in the ignition.conf
```
file and restart the gateway.

### WARNING

This should only be done on secure development gateways, as it opens a significant security risk on production gateways, in

addition to instabilities that may result from your in-development module.

## Task Configuration

12/17/25, 3:12 PM Plugins Reference | Ignition SDK Programmer's Guide

https://www.sdk-docs.inductiveautomation.com/docs/8.3/appendix/plugins 7/8

*[Image on page 8]*


*[Image on page 8]*


To configure properties of a task that are not directly exposed by the plugin configuration extension, you can use one of the

### withType() methods, which are nicely documented here.

For example, to set the host url for the development gateway being targeted by the "deployModl" task (which is of task class type
```
Deploy ):
```
In groovy based buildscripts, the syntax is different, but the result is the same:

### Last updated on Jun 13, 2024 by ia-sshamgar
```
// in the build.gradle.kts file where the module plugin is applied
tasks {
withType<io.ia.sdk.gradle.modl.task.Deploy> {
this.hostGateway.set("https://some.gateway.com:8099")
}
}
tasks.withType(io.ia.sdk.gradle.modl.task.Deploy).configureEach {
hostGateway = "https://some.gateway.net:8033"
}
```
12/17/25, 3:12 PM Plugins Reference | Ignition SDK Programmer's Guide

https://www.sdk-docs.inductiveautomation.com/docs/8.3/appendix/plugins 8/8
