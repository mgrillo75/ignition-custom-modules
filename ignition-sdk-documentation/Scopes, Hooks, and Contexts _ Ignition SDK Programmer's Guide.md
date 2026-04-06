# Scopes, Hooks, and Contexts _ Ignition SDK Programmer's Guide

---
*[Image on page 1]*

### Getting Started Anatomy of a Module Scopes, Hooks, and Contexts

# **Version:** 8.3 Scopes, Hooks, and Contexts

# Scopes

Ignition defines three different scopes: the gateway, the designer, and the client. A module may include pieces for multiple scopes,

and resources in a module can be assigned to multiple scopes at once.

For each scope that your module will run in, it will define a module hook. This is the entry point for the module in that scope, and

provides several lifecycle functions. Each scope provides a context to the hook, which can be used to access all of the platform

services of that scope.

# Module Hooks

There are three interfaces that define the hooks that correspond to the scopes:
```
GatewayModuleHook
DesignerModuleHook
ClientModuleHook
```
### Each module hook must be defined in the module descriptor file.

### TIP

12/17/25, 3:07 PM Scopes, Hooks, and Contexts | Ignition SDK Programmer's Guide

https://www.sdk-docs.inductiveautomation.com/docs/8.3/getting-started/anatomy-of-a-module/scopes-hooks-contexts 1/3

*[Image on page 2]*


*[Image on page 2]*


You don't need to create these hooks from scratch if you generate your project from the Ignition plugins for Gradle or Maven.

### Refer back to Create a Module and follow the prompts to define your scopes.
```
In practice, it is best to extend from the Abstract implementations of these hooks (for example, AbstractGatewayModuleHook ) instead
```
of implementing the interfaces yourself. An Abstract class provides empty implementations of the functions, allowing you to implement

only what you need. Subclasses extending from the Abstract class define the specific and relevant functions you need. For example,
```
in our tutorial example we extended from the AbstractGatewayModuleHook in order to access the initializeScriptManager()
```
method:

GatewayHook.java

Each hook also provides up to three lifecycle functions:

## setup()
```
public class GatewayHook extends AbstractGatewayModuleHook {
...
@Override
public void initializeScriptManager(ScriptManager manager) {
super.initializeScriptManager(manager);
manager.addScriptModule(
"system.example",
scriptModule,
new PropertiesFileDocProvider());
}
}
```
12/17/25, 3:07 PM Scopes, Hooks, and Contexts | Ignition SDK Programmer's Guide

https://www.sdk-docs.inductiveautomation.com/docs/8.3/getting-started/anatomy-of-a-module/scopes-hooks-contexts 2/3

Called before startup. This is the chance for the module to add its extension points and update persistent records and schemas. None

of the managers will be started up at this point, but the extension point managers will accept extension point types.

## startup()

The main entrypoint for the module hook. This will only be called once for a given project. If another project is ever opened,
```
shutdown() will be called and a new hook will be instantiated
```
## shutdown()

Called when the module is shut down.

# Contexts

The context for the given scope will be passed to the setup or startup method of the associated hook. The available contexts will vary

depending on the scope of the associated hook. The modules should hold on to these contexts and pass them to subsystems that

they define as it is the primary way to access the services provided by the Ignition platform.

### Last updated on Jun 13, 2024 by ia-sshamgar

12/17/25, 3:07 PM Scopes, Hooks, and Contexts | Ignition SDK Programmer's Guide

https://www.sdk-docs.inductiveautomation.com/docs/8.3/getting-started/anatomy-of-a-module/scopes-hooks-contexts 3/3
