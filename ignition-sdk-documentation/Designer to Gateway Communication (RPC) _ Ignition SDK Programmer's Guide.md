# Designer to Gateway Communication (RPC) _ Ignition SDK Programmer's Guide

---
### Programming for the Designer Designer to Gateway Communication (RPC)

# **Version:** 8.3 Designer to Gateway Communication (RPC)

When building a module with both Designer and Gateway components, it is often necessary to provide some sort of communication

link between them. The project management system handles notifying the Gateway of resource changes, but for more dynamic

communication, the RPC (remote procedure call) system is available.

The RPC system is easy to use, and works as follows:
```
1. In the Designer, the module uses GatewayConnectionManager.getInstance().getGatewayInterface().moduleInvoke(...) to send an
```
invocation call to the Gateway for the provided module ID, with the given function name and parameters.

2. On the Gateway, the system looks up the module ID provided, and calls getRPCHandler on its module hook.
3. The Gateway then reflectively locates the desired function, executes it, and returns the result.

# Design Best Practice
```
Instead of calling GatewayInterface.moduleInvoke() yourself, you can use the class ModuleRPCFactory in conjunction with an
interface that you define to create a dynamic proxy automatically. Defining your functionality in an interface that is implemented by
```
your RPC handler is a good idea in general, as you will have a single definition of what RPC functions are available.

12/17/25, 3:09 PM Designer to Gateway Communication (RPC) | Ignition SDK Programmer's Guide

https://www.sdk-docs.inductiveautomation.com/docs/8.3/programming-for-the-designer/designer-to-gateway-communication-rpc 1/3

*[Image on page 2]*


*[Image on page 2]*


*[Image on page 2]*


*[Image on page 2]*


This paradigm is demonstrated below, with a simple function that sends someone’s name from the Designer to the Gateway to

retrieve a greeting for them.

### The RPC Interface - in the Common Package

### The Gateway Implementation - in the Gateway Scope

### In the GatewayModuleHook

### Using the RPC Class - in the Client Scope
```
public interface ModuleRPC {
String getGreeting(String firstName);
}
public class ModuleRPCImpl implements ModuleRPC {
public String getGreeting(String firstName){
return "Hello, " + firstName;
}
}
public Object getRPCHandler(ClientReqSession session, String projectId) {
return new ModuleRPCImple();
}
ModuleRPC rpc = ModuleRPCFactory.create(ModuleMeta.MODULE_ID, ModuleRPC.class);
```
12/17/25, 3:09 PM Designer to Gateway Communication (RPC) | Ignition SDK Programmer's Guide

https://www.sdk-docs.inductiveautomation.com/docs/8.3/programming-for-the-designer/designer-to-gateway-communication-rpc 2/3

*[Image on page 3]*

### Last updated on Oct 23, 2023 by root
```
System.out.println(rpc.getGreeting("Bill"));
```
12/17/25, 3:09 PM Designer to Gateway Communication (RPC) | Ignition SDK Programmer's Guide

https://www.sdk-docs.inductiveautomation.com/docs/8.3/programming-for-the-designer/designer-to-gateway-communication-rpc 3/3
