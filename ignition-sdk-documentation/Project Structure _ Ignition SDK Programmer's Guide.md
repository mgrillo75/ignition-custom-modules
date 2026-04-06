# Project Structure _ Ignition SDK Programmer's Guide

---
### Getting Started Anatomy of a Module Project Structure

# **Version:** 8.3 Project Structure

Ultimately, the structure of your module project (or projects, as most modules will consist of multiple sub-projects) is up to you.

However, there are a few common structures that are used in most module scenarios. Primarily, breaking the projects up by scope,

with another "common" project, is useful.

Each project usually represents a JAR in the build process, and the common jar can be marked as applying to all scopes. Of course,

this can also be accomplished through package structure and handled in the build process. The important point is that the resulting

JAR files should be carefully tailored to their scopes, to reduce the amount of code unnecessarily loaded into scopes which don't use

### it. For information about scopes, continue on to the next chapter.

# Localization Support

All string data that might be presented to the user should be held in external "resource bundle" files. There are several schemes for

managing these files, but the easiest is to have a single file for each scope in the root package of your module and to load it into the
```
BundleUtil in the hook. The section on Localization has more information about how this system works.
```
# Design Best Practice

Strings that represent identifiers or names, such as the "module id", should be defined in a single place in the common project,

instead of repeatedly in code. For example:

12/17/25, 3:07 PM Project Structure | Ignition SDK Programmer's Guide

https://www.sdk-docs.inductiveautomation.com/docs/8.3/getting-started/anatomy-of-a-module/project-structure 1/2

*[Image on page 2]*


Common Module Code

Now, all parts of your module can access the static values, and you don't have to worry about mistyping an identifier.

### Last updated on Jun 13, 2024 by ia-sshamgar
```
package com.mycompany.mymodule.metainfo;
public class ModuleMeta {
public final static String MODULE_ID = "com.mycompany.mymodule";
}
```
12/17/25, 3:07 PM Project Structure | Ignition SDK Programmer's Guide

https://www.sdk-docs.inductiveautomation.com/docs/8.3/getting-started/anatomy-of-a-module/project-structure 2/2
