# Build a Module _ Ignition SDK Programmer's Guide

---
*[Image on page 1]*

### Getting Started Create a Module Build a Module

# **Version:** 8.3 Build a Module

An Ignition Module consists of an xml manifest, jar files, and additional resources and meta-information. When you create a module
```
from an existing gradlew.bat or Maven Archetype, your project will have a build directory with the basic tools necessary to compile
and build a .modl file. Depending on your build system, you may want to further edit the files in your build directory to declare
```
dependencies, update signing settings, or configure tasks. See the Plugins section for configuration settings specific to your build

system.

# Compile and Build
```
When you are ready to build your .modl file, open a command prompt in your project's root directory and run the following command:
```
### Gradle Maven
```
You now have a .modl file that is ready to install on an Ignition Gateway.
```
Your IDE may also provide a GUI interface to compile and build your project, if you prefer. See the documentation for your preferred

IDE:
```
gradlew.bat clean build
```
12/17/25, 3:06 PM Build a Module | Ignition SDK Programmer's Guide

https://www.sdk-docs.inductiveautomation.com/docs/8.3/getting-started/create-a-module/build-a-module 1/2

*[Image on page 2]*

### IntelliJ IDEA

### Eclipse

### TIP

If you have not yet signed your module, you will need to either sign it or configure your Gateway to allow unsigned modules.

### Last updated on Jun 13, 2024 by ia-sshamgar

12/17/25, 3:06 PM Build a Module | Ignition SDK Programmer's Guide

https://www.sdk-docs.inductiveautomation.com/docs/8.3/getting-started/create-a-module/build-a-module 2/2
