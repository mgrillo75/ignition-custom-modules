# Add a Function _ Ignition SDK Programmer's Guide

---
*[Image on page 1]*


*[Image on page 1]*

### Tutorial - Simple Scripting Module Add a Function

# **Version:** 8.3 Add a Function
```
In the initial example, the multiply() function is defined under the AbstractScriptModule class. Let's add a simple function after
```
line 27:

AbstractScriptModule.java

That's it! We're ready to test it out. Build the module, install it, launch the designer, open the Script Console and try calling the

function:

Our new function!

# Adding Descriptions
```
public String helloWorld(){
return "Hi there!";
}
print system.example.helloWorld()
```
12/17/25, 3:06 PM Add a Function | Ignition SDK Programmer's Guide

https://www.sdk-docs.inductiveautomation.com/docs/8.3/simple-scripting/add-function 1/3

*[Image on page 2]*


*[Image on page 2]*
```
We can use the @ScriptFunction annotation to denote where the descriptions for our function should be. We can add the annotation
to our helloWorld() function:
```
AbstractScriptModule.java
```
In this case, the docBundlePrefix argument states that the AbstractScriptModule properties file (also located under common ) has
```
the descriptions that should be used in conjunction with this function.
```
Next we need to actually write the descriptions. Open the AbstractScriptModule.properties file. You'll see the descriptions for the
multiply() function:
```
AbstractScriptModule.properties

The notation here is the following:
```
desc is the description of the function
param.%argName% is the description for a particular argument
returns is the description for the return value
@ScriptFunction(docBundlePrefix = "AbstractScriptModule")
public String helloWorld(){
return "Hi there!";
}
multiply.desc=Multiple two integers and return the result.
multiply.param.arg0=The first operand.
multiply.param.arg1=The second operand.
multiply.returns=Returns the first operand multiplied by the second.
```
12/17/25, 3:06 PM Add a Function | Ignition SDK Programmer's Guide

https://www.sdk-docs.inductiveautomation.com/docs/8.3/simple-scripting/add-function 2/3

*[Image on page 3]*
```
Our function does not accept any arguments, so we only have two entries to add to helloWorld() :
```
AbstractScriptModule.properties

Build the module, upgrade the module on the Gateway, relaunch the Designer, and check the autocomplete popup. You should see

your new descriptions.

### Last updated on Oct 23, 2023 by root
```
helloWorld.desc=Returns a friendly greeting
helloWorld.returns=The string "Hi There!"
```
12/17/25, 3:06 PM Add a Function | Ignition SDK Programmer's Guide

https://www.sdk-docs.inductiveautomation.com/docs/8.3/simple-scripting/add-function 3/3
