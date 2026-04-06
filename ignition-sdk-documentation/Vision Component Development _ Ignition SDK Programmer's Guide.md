# Vision Component Development _ Ignition SDK Programmer's Guide

---
*[Image on page 1]*

### Vision Development Vision Component Development

# **Version:** 8.3 Vision Component Development

One of the easiest types of modules to write is a module that adds a new component to the Vision module. Vision components are

written in Java Swing and are modeled after the JavaBeans specification. If you've never used Swing before, consult The Swing

### Tutorial before getting started.

A basic module that adds components to the Vision module will need two projects: one for the Client scope and one for the Designer

scope. You do not need a project for the Gateway scope unless your components are part of a larger module that requires Gateway-

scoped resources.

# Client Scope

In your Client scope project you'll have all of your components defined. You don't strictly need a Client module hook class at all. Your
```
components will get compiled into a .jar file that will be marked in your module.xml file as "DC" for Designer and Client scoped:
```
### Gradle Maven

build.gradle.kts
```
projectScopes.putAll(
mapOf(
":client" to "CD",
```
12/17/25, 3:11 PM Vision Component Development | Ignition SDK Programmer's Guide

https://www.sdk-docs.inductiveautomation.com/docs/8.3/vision-development/vision-component-development/ 1/2

*[Image on page 2]*


*[Image on page 2]*

# Designer Scope

In your Designer scope project you'll have a hook class and your BeanInfo classes. The hook will be responsible for adding your

components to the Vision Module's palette. The BeanInfo classes are used to describe the components to the Vision module. Make

sure to mark the designer's hook with a dependency on the Vision module:

### Gradle Maven

build.gradle.kts

### Last updated on Jun 13, 2024 by ia-sshamgar
```
":designer" to "D",
)
)
moduleDependencies.put("com.inductiveautomation.vision", "DC")
```
12/17/25, 3:11 PM Vision Component Development | Ignition SDK Programmer's Guide

https://www.sdk-docs.inductiveautomation.com/docs/8.3/vision-development/vision-component-development/ 2/2
