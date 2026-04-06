# Extension Points _ Ignition SDK Programmer's Guide

---
### Getting Started Key Design Concepts Extension Points

# **Version:** 8.3 Extension Points

The Extension Point system is a single, unified interface for extending various parts of the Ignition platform. Modules can provide new

implementations of various abstract concepts with extension points. The Extension Point system is closely tied to the persistence and

web interface system, reducing the amount of work required to expose and store configuration data.

# Current Extension Point Types

The following systems expose themselves as extension points, meaning that modules can provide new implementations of them:

User Schedules

Alarm Notification

Audit logging

Email providers

OPC connections

Tag history providers

Tag providers

User sources

OPC UA module device

To get started building an extension point implementation, see Extending Ignition with Extension Points.

12/17/25, 3:07 PM Extension Points | Ignition SDK Programmer's Guide

https://www.sdk-docs.inductiveautomation.com/docs/8.3/getting-started/key-design-concepts/extension-points 1/2

### Last updated on Jun 13, 2024 by ia-sshamgar

12/17/25, 3:07 PM Extension Points | Ignition SDK Programmer's Guide

https://www.sdk-docs.inductiveautomation.com/docs/8.3/getting-started/key-design-concepts/extension-points 2/2
