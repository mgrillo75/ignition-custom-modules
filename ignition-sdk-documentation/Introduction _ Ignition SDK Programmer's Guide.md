# Introduction _ Ignition SDK Programmer's Guide

---
*[Image on page 1]*


*[Image on page 1]*


Introduction

# **Version:** 8.3 Introduction

### IGNITION 8.3 CHANGES

Ignition 8.3 is a major update across all subsystems and modules, and therefore areas of this guide have been impacted. While

documentation for this version is still in progress and subject to change, the Upgrade Guide has the most up-to-date information

about changes module developers need to know.

Ignition was designed to be a powerful industrial application platform, built from the ground up to support extensibility through a

modular architecture. In fact, nearly all of the commercial pieces associated with Ignition, such as SQLBridge, Vision, and OPC-UA,

are modules built with the same SDK that you have in your hands.

This document is a reference guide to the platform and provides all of the information you need to get started with the SDK. This guide

does not cover every aspect of the SDK, but what is not covered by this guide is represented in the Java API docs. We encourage

you to contact us with ideas on how to improve this guide, preferably through the Module SDK Forum on our website.

### INFO

Custom module development is intended for use with Standard Ignition. If custom modules are needed for other editions of

Ignition, such as Ignition Cloud Edition, Ignition Edge, or Ignition Maker Edition, customers can reach out to Inductive

### Automation to discuss exceptions on a case-by-case basis.

12/17/25, 3:05 PM Introduction | Ignition SDK Programmer's Guide

https://www.sdk-docs.inductiveautomation.com/docs/8.3/intro 1/4

# SDK Structure

The Ignition SDK consists of a collection of APIs that are provided as hosted Artifacts by the Inductive Automation Maven repository. If

you are familiar with Maven Central, then using the Ignition SDK will feel very familiar.

The interfaces and resources that define the API are resolved by your build when it's time to compile your code into a module. If you

are using a modern IDE or Text Editor with "Auto Import" abilities, your dependencies will be available just as if you had the jars

locally. Note that the initial depedency resolution from the Inductive Automation Nexus repo will require an internet connection to

download the Artifacts.

# What Can You Do?

The scope of an Ignition module is extremely broad - from adding something minor to complement the framework or leverage the

framework to create an entirely new product. Modules can even add new functionality to other modules!

Here are some ideas, in no particular order, to help spur creativity:

Write an ethernet driver for a PLC or other device.

Add a visual component to the Vision module.

Incorporate an existing 3rd party Java library to include some new technology

Insert new useful functions into the scripting system

Create a new authentication profile type

Add some sort of industry-specific suite of functionality

# Prerequisite Knowledge

12/17/25, 3:05 PM Introduction | Ignition SDK Programmer's Guide

https://www.sdk-docs.inductiveautomation.com/docs/8.3/intro 2/4

*[Image on page 3]*


To be successful with the Ignition Module SDK, you'll want to become acquainted with the following technologies and concepts before

you get started.

## Java SE

Java is the language that Ignition is written in, and the language that modules must also be written in. Therefore, to even get started

with the SDK, you'll need to have a decent foundation in the Java language and framework. Concepts such as package management,

classpaths, and JAR files are frequently used in the development of Ignition modules. Ignition is built against Java 8.

### See also: Oracle's Java Developer Portal

## Build Systems

Current versions of the Ignition SDK use Gradle. Gradle is often easier for Java developers to understand, but you can use any Java

### build tools you are comfortable with. See the Gradle Homepage for more information.

Maven is the predominant dependency management tool utilized in Java, and is also one of the most popular build systems. Its

'convention over configuration' approach has laid the foundation for how modern Java applications are structured. If you use our
```
Ignition Maven Plugin, you will need to be familiar with pom.xml files and the Maven build cycle. See the Maven Homepage for more
```
information.

### ANT (LEGACY SDK)

Ant is the build file system used by past versions of Ignition's SDK. While not strictly necessary for module development,

understanding and using Ant for those versions will make things much easier. Each example project in the legacy SDK (which
```
includes SDK versions up through Ignition 7.7.6) includes an Ant build file build.xml which can be modified and adapted as
```
### necessary. See the Apache Ant Homepage.

12/17/25, 3:05 PM Introduction | Ignition SDK Programmer's Guide

https://www.sdk-docs.inductiveautomation.com/docs/8.3/intro 3/4

## Ignition

Of course, to build an Ignition module, it's helpful to have good background in working with Ignition itself. You should have a good

understanding of how many of the platform services work and are configured through the gateway, such as database connections,

authentication profiles, SQLTags providers, OPC connections, and projects. For some targeted project types, such as a device driver

for OPC-UA, a wide knowledge of the platform isn't necessary, but you should still be acquainted with how the existing drivers are

configured and used.

# Getting Help

This guide will get you started as an Ignition Module developer, but it isn't a comprehensive manual. If you run into a problem with the

SDK or aren't sure how to accomplish something, check the module SDK forum. Since the IA support staff scope of assistance is

limited to Ignition itself, the SDK forum will provide the best source of information when troubleshooting. The forum is visited by a wide

range of users who have experience building modules, and is frequently checked by the IA development team.

For more general questions with Java, Python, Ant, etc., the internet has a wealth of resources. StackOverflow.com is a particularly

good place to ask questions, though you generally can't go wrong typing nearly anything into Google.

# Inductive Automation SDK License

The Inductive Automation SDK License Agreement may be found at https://inductiveautomation.com/ignition/sdk-license

### Last updated on Oct 7, 2025 by Susan Shamgar

12/17/25, 3:05 PM Introduction | Ignition SDK Programmer's Guide

https://www.sdk-docs.inductiveautomation.com/docs/8.3/intro 4/4
