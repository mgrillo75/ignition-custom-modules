# Build and Install _ Ignition SDK Programmer's Guide

---
*[Image on page 1]*

### Tutorial - Simple Scripting Module Build and Install

# **Version:** 8.3 Build and Install

Now that we've examined some pieces of this example project, let's build and install our new module to see how it works in the

Designer.

# Build the .modl
```
Since this example uses Gradle as its build system, you can build a .modl file using the following command:
You'll find a new .modl file, Scripting-Function-G.unsigned.modl , in your project's build directory.
```
# Install and Test

### 1. On your Gateway, navigate to Config > System > Modules.

### 2. Click Install or Upgrade a Module.

### 3. Click Choose File and select the Scripting-Function-G.unsigned.modl file.

### 4. Click Install.

This scripting module will now appear at the bottom of your Modules page, under the Unsigned Modules heading.
```
gradlew.bat clean build
```
12/17/25, 3:06 PM Build and Install | Ignition SDK Programmer's Guide

https://www.sdk-docs.inductiveautomation.com/docs/8.3/simple-scripting/build-install 1/2

*[Image on page 2]*


You can now launch a Designer and test out the scripting function we added. Open a Script Console and enter the following:

Multiply function example

Congratulations, you've just added a simple scripting function to Ignition!

### Last updated on Oct 23, 2023 by root
```
print system.example.multiply(6, 7)
```
12/17/25, 3:06 PM Build and Install | Ignition SDK Programmer's Guide

https://www.sdk-docs.inductiveautomation.com/docs/8.3/simple-scripting/build-install 2/2
