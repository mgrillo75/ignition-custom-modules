# Example Modules _ Ignition SDK Programmer's Guide

---
*[Image on page 1]*


*[Image on page 1]*


Example Modules

# **Version:** 8.3 Example Modules

Inductive Automation provides a variety of example SDK modules on our ignition-sdk-examples GitHub repository. This repository

demonstrates some of the ways you can extend Ignition with the Ignition SDK. Examples include components, an expression function,

an OPC UA Device, and more. Use the following command to clone the repository for your personal use:

Clone the repository

This repository demonstrates some of the possible ways you can extend Ignition with the Ignition SDK. Examples include

components, an expression function, an OPC UA Device, and more.

Open an example in your IDE of choice to explore a project's structure, or try your hand at modifying an example with your own code.

### TIP

### If you prefer a simpler, guided example, head to the Tutorial example first.

# Prerequisites

These requirements and recommendations generally apply to both Gradle and Maven build tools:
```
git clone https://github.com/inductiveautomation/ignition-sdk-examples
```
12/17/25, 3:06 PM Example Modules | Ignition SDK Programmer's Guide

https://www.sdk-docs.inductiveautomation.com/docs/8.3/example-modules/ 1/2

*[Image on page 2]*


Java Development Kit (JDK) 11 installed. You can download it on the Java SDK Downloads page. Licensed/TCK tested JDK

vendors such as Adoptium, Azul Zulu, etc, are generally suitable JDKs as well.

A running, 8.0+ version of Ignition to test your module in. If you don't already have Ignition installed head to the Inductive

Automation downloads page, download the correct package for your system and follow the installation instructions to get a

gateway up and running.
```
For development convenience, you may want to allow unsigned modules. Open the ignition.conf file in the data/ directory,
then in the wrapper.java.additional section add the following line:
```
### Last updated on Jun 13, 2024 by ia-sshamgar
```
wrapper.java.additional.[index]=-Dignition.allowunsignedmodules=true
```
12/17/25, 3:06 PM Example Modules | Ignition SDK Programmer's Guide

https://www.sdk-docs.inductiveautomation.com/docs/8.3/example-modules/ 2/2
