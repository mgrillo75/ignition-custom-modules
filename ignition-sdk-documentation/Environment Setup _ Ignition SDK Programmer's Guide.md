# Environment Setup _ Ignition SDK Programmer's Guide

---
### Getting Started Environment Setup

# **Version:** 8.3 Environment Setup

# Prerequisites

Regardless of the Development environment you prefer, there are some common prerequisites:

## Java JDK

You will need a Java JDK installed. Be mindful of which version you install:

Ignition platform 7 requires a Java 1.8 JDK

Ignition platform 8 requires a Java 11 JDK

You have several options for JDKs. Popular options are:

### Azul JDK Downloads

### Java JDK Downloads

## Build System

You will need to choose and install a build system. Recommended build systems include Gradle and Maven.

### To install Gradle:

12/17/25, 3:06 PM Environment Setup | Ignition SDK Programmer's Guide

https://www.sdk-docs.inductiveautomation.com/docs/8.3/getting-started/environment-setup/ 1/3

### Linux OSX Windows

### 1. Download the latest Gradle distribution.
```
2. Create a new directory C:\Gradle with File Explorer.
```
3. Open a second File Explorer window and go to the directory where the Gradle distribution was downloaded. Double-click the ZIP

archive to expose the content.
```
4. Drag the content folder gradle-8.1.1 to your newly created C:\Gradle folder.
```
5. In File Explorer right-click on the This PC (or Computer) icon, then click Properties -> Advanced System Settings ->

### Environmental Variables.
```
6. Under System Variables select Path, then click Edit. Add an entry for C:\Gradle\gradle-8.1.1\bin .
```
### 7. Click OK to save.

### To install Maven:

### Linux OSX Windows
```
Windows users can install via Chocolatey ( choco install maven ) or by downloading the installer at the Maven downloads page.
```
# Download IDE and Set Up Your Workspace

### Eclipse IntelliJ

### Download Eclipse IDE for Java Developers from http://www.eclipse.org/

12/17/25, 3:06 PM Environment Setup | Ignition SDK Programmer's Guide

https://www.sdk-docs.inductiveautomation.com/docs/8.3/getting-started/environment-setup/ 2/3

When you first start Eclipse, you will be asked what workspace you want to work in. A workspace is a folder on your hard drive that

holds a collection of projects. You can have multiple workspaces. If you're already an Eclipse user, you'll want to create a new

workspace.

To make a workspace, create a folder to be your workspace or choose a path through Eclipse when you start the IDE. For example:
```
C:\development\IgnitionSDK_Workspace . The SDK dependencies will be configured inside the IDE.
```
### Last updated on Oct 23, 2023 by root

12/17/25, 3:06 PM Environment Setup | Ignition SDK Programmer's Guide

https://www.sdk-docs.inductiveautomation.com/docs/8.3/getting-started/environment-setup/ 3/3
