# Examine the Example _ Ignition SDK Programmer's Guide

---
*[Image on page 1]*

### Tutorial - Simple Scripting Module Examine the Example

# **Version:** 8.3 Examine the Example

Let's examine some pieces of the example module to see how they interact to create a scripting function.

### NOTE

This is not an exhaustive list of every file or class required to make this example work. We encourage you to examine the other

directories included in this example project to see how they all fit together.

# common
```
The common directory defines the interface and abstract class that all the implementing functions must adhere to, regardless of scope.
```
This directory contains the files that define the function itself:
```
AbstractScriptModule.java
MathBlackBox.java
```
## AbstractScriptModule
```
The AbstractScriptModule class defines the function and its arguments:
```
12/17/25, 3:06 PM Examine the Example | Ignition SDK Programmer's Guide

https://www.sdk-docs.inductiveautomation.com/docs/8.3/simple-scripting/examine-example 1/4

*[Image on page 2]*


*[Image on page 2]*


AbstractScriptModule.java

## MathBlackBox
```
The AbstractScriptModule implements the abstract class MathBlackBox to provide the math behind the multiply() scripting
```
function:

MathBlackBox.java

# ClientScriptModule
```
@ScriptFunction(docBundlePrefix = "AbstractScriptModule")
public int multiply(@ScriptArg("arg0") int arg0,
@ScriptArg("arg1") int arg1) {
return multiplyImpl(arg0, arg1);
}
package com.inductiveautomation.ignition.examples.scripting.common;
public interface MathBlackBox {
public int multiply(int arg0, int arg1);
}
```
12/17/25, 3:06 PM Examine the Example | Ignition SDK Programmer's Guide

https://www.sdk-docs.inductiveautomation.com/docs/8.3/simple-scripting/examine-example 2/4

*[Image on page 3]*


*[Image on page 3]*
```
An instance of ClientScriptModule is used in the Designer and Client scope to provide details about the function. The
ClientScriptModule class creates the actual RPC handler, using the API's ModuleRPCFactory.create() method:
```
/src/main/java/com/inductiveautomation/ignition/examples/scripting/client/ClientScriptModule.java
```
The ModuleRPCFactory handles passing values back and forth between scopes.
```
# GatewayScriptModule
```
When executed, the ModuleRPCFactory will automatically call the GatewayHook 's getRPCHandler method, which returns the
GatewayScriptModule with the actual implementation of MathBlackBox :
```
gateway/src/main/java/com/inductiveautomation/ignition/examples/scripting/GatewayScriptModule.java
```
public ClientScriptModule() {
rpc = ModuleRPCFactory.create(
"com.inductiveautomation.ignition.examples.scripting.ScriptingFunctionG",
MathBlackBox.class
);
}
package com.inductiveautomation.ignition.examples.scripting.gateway;
import com.inductiveautomation.ignition.examples.scripting.common.AbstractScriptModule;
public class GatewayScriptModule extends AbstractScriptModule {
@Override
```
12/17/25, 3:06 PM Examine the Example | Ignition SDK Programmer's Guide

https://www.sdk-docs.inductiveautomation.com/docs/8.3/simple-scripting/examine-example 3/4

*[Image on page 4]*

### Last updated on Oct 23, 2023 by root
```
protected int multiplyImpl(int arg0, int arg1) {
return arg0 * arg1;
}
}
```
12/17/25, 3:06 PM Examine the Example | Ignition SDK Programmer's Guide

https://www.sdk-docs.inductiveautomation.com/docs/8.3/simple-scripting/examine-example 4/4
