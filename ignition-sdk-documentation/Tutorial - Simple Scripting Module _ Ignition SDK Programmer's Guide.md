# Tutorial - Simple Scripting Module _ Ignition SDK Programmer's Guide

---
Tutorial - Simple Scripting Module

# **Version:** 8.3 Tutorial - Simple Scripting Module


*[Image on page 1]*

# Overview
```
This module ( scripting-function-g ) provides a basic example of a scripting function that executes through a remote procedure call
(RPC). In a Client scope, the function delegates to the module's RPC handler, which then calls multiply on the Gateway and
```
12/17/25, 3:05 PM Tutorial - Simple Scripting Module | Ignition SDK Programmer's Guide

https://www.sdk-docs.inductiveautomation.com/docs/8.3/simple-scripting/ 1/3

*[Image on page 2]*


*[Image on page 2]*


returns the result.

In this tutorial, you'll examine some of the classes that make this function work before installing the example module onto your own
```
Gateway. Next, you'll add your own function to the AbstractScriptModule class provided by the example.
```
# Prerequisites

Set up your development environment. Since this example uses Gradle, follow the steps to install Gradle.
```
Configure Ignition to allow unsigned modules. Open the ignition.conf file in the data/ directory, then in the
wrapper.java.additional section add a line like:
```
# Getting Started

Once you have configured your developer Gateway, make sure git is installed and clone this repo to a directory of your choice:
```
Using your IDE of choice, you should be able open the included scripting-function-g module through the settings.gradle.kts
```
file located in the root directory.

Upon importing this project into your IDE, it should download (if auto-import is on) necessary dependencies from the Inductive

Automation artifact repository. Dependencies are managed through Maven and are cached to your local environment after they are

downloaded.
```
wrapper.java.additional.[index]=-Dignition.allowunsignedmodules=true
git clone https://github.com/inductiveautomation/ignition-sdk-training.git
```
12/17/25, 3:05 PM Tutorial - Simple Scripting Module | Ignition SDK Programmer's Guide

https://www.sdk-docs.inductiveautomation.com/docs/8.3/simple-scripting/ 2/3

### Last updated on Jun 13, 2024 by ia-sshamgar

12/17/25, 3:05 PM Tutorial - Simple Scripting Module | Ignition SDK Programmer's Guide

https://www.sdk-docs.inductiveautomation.com/docs/8.3/simple-scripting/ 3/3
