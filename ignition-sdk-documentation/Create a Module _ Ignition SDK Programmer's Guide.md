# Create a Module _ Ignition SDK Programmer's Guide

---
*[Image on page 1]*

### Getting Started Create a Module

# **Version:** 8.3 Create a Module

Creating a basic module from scratch is not difficult, but we've tried to minimize startup friction by offering you some tools to help get

started. Whether you use Gradle or Maven, you can utilize the provided build tools to generate a new project with a framework that

includes the basic structure necessary for your module.

# Pull Tools Repository

The tools repository you choose will depend on your build system. Before pulling a repository, make sure you have Git installed.

### Gradle Maven

Once you have the module tools in hand you can generate a new project through the command line.

# Create a New Project

### Gradle Maven
```
git clone https://github.com/inductiveautomation/ignition-module-tools
```
12/17/25, 3:06 PM Create a Module | Ignition SDK Programmer's Guide

https://www.sdk-docs.inductiveautomation.com/docs/8.3/getting-started/create-a-module/ 1/5

*[Image on page 2]*


*[Image on page 2]*
```
1. Open the directory containing ignition-module-tools .
2. Navigate one level down into generator .
```
3. Open a command prompt in this directory and run the following:
4. Create a new project:
5. Fill in the following information when prompted:

### Prompt Description Example

Enter scopes

The scopes your module will require, including
```
Gateway ( G ), Client ( C ), and Designer ( D ).
```
Note that these values are case sensitive.
```
GCD
```
Human readable

name
```
A name for your new project.
New SDK Project
```
Root package

A reverse domain name specific to your

organization and project.
```
com.inductiveautomation.ignition.newsdkproject
gradlew.bat clean build
gradlew.bat runCli -–console plain
```
12/17/25, 3:06 PM Create a Module | Ignition SDK Programmer's Guide

https://www.sdk-docs.inductiveautomation.com/docs/8.3/getting-started/create-a-module/ 2/5

### Prompt Description Example

Language

Language for gradle buildscripts. Possible
```
values are kotlin and groovy . Default:
kotlin .
kotlin
```
This will create a new project structure for you with seperate directories for each of the Gateway, Designer and Client scopes, as well
```
as a Common and Build directory. If you receive a BUILD SUCCESSFUL message, you can close the command prompt and open your
```
new project in your preferred IDE:

12/17/25, 3:06 PM Create a Module | Ignition SDK Programmer's Guide

https://www.sdk-docs.inductiveautomation.com/docs/8.3/getting-started/create-a-module/ 3/5

*[Image on page 4]*


12/17/25, 3:06 PM Create a Module | Ignition SDK Programmer's Guide

https://www.sdk-docs.inductiveautomation.com/docs/8.3/getting-started/create-a-module/ 4/5

### Last updated on Oct 23, 2023 by root

12/17/25, 3:06 PM Create a Module | Ignition SDK Programmer's Guide

https://www.sdk-docs.inductiveautomation.com/docs/8.3/getting-started/create-a-module/ 5/5
