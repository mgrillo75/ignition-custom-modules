# Projects and Project Resources _ Ignition SDK Programmer's Guide

---
### Programming for the Gateway Projects and Project Resources

# **Version:** 8.3 Projects and Project Resources

Beyond system-wide configuration data, the most common data used by modules is project-based resource data. Project resources

are usually created through the Designer and are identified by their resource type and module id. When a module defines a new

project resource, it will define the resource type.

Most commonly, modules will want to load specific types of resources at a time. This can be accomplished with the
```
Project.getResourcesOfType() function.
Once the project resource is retrieved, the data can be accessed through ProjectResource. getData() . When deserializing, it is
important to use the deserializer created by GatewayContext.createDeserializer() . Do not create your own XMLDeserializer.
Modules can add a ProjectListener to the ProjectManager in order to be notified when a project is added, removed, or modified.
You can use the CompletableFuture<> requestScan() public method to the ProjectManagerBase to request that the project
```
directory is scanned immediately for project and resource updates.

It's important to realize that the Project class serves a variety of purposes. It can be a fully loaded project, but can also represent a

subset of a project, or simply the structure, without resource data actually present.

### Last updated on Oct 23, 2023 by root

12/17/25, 3:08 PM Projects and Project Resources | Ignition SDK Programmer's Guide

https://www.sdk-docs.inductiveautomation.com/docs/8.3/programming-for-the-gateway/projects-and-project-resources 1/1
