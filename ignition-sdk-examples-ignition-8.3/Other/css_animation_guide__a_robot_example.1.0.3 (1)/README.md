# CSS Animation Guide: A Robot Example - Version 1.0.3

This resource provides a detailed guide on how to perform basic animations in the Ignition Perspective module using CSS. The guide covers how to create smooth motion, pause and resume animations, and synchronize two robots using a state machine. The project starts with basic animations and then demonstrates how to create more complex movements. Three UDTs were used to ensure that multiple robots animate in the proper sequence.

## Installation

### Common Instructions

**Project (.zip/.proj)**  
Project backup and restoring from a project backup is referred to as Project Export and Import. Projects are exported individually, and only include project-specific elements visible in the Project Browser in the Ignition Designer. They do not include Gateway resources, like database connections, Tag Providers, Tags, and images. The exported file (.zip or .proj) is used to restore / import a project.

.zip = Ignition 8+
.proj = Ignition 7+

There are two primary ways to export and import a project:

Gateway Webpage - exports and imports the entire project.
Designer -  exports and imports only those resources that are selected.

When you restore / import a project from an exported file in the Gateway Webpage, it will be merged into your existing Gateway.

The import is located in:
Ignition Gateway > Configuration > System > Projects > Import Project Link

If there is a naming collision, you have the option of renaming the project or overwriting the project. Project exports can also be restored / imported in the Designer. Once the Designer is opened you can choose File > Import from the menu. This will even allow you to select which parts of the project import you want to include and will merge them into the currently open project.

**Tags (.json/.xml/.csv)**  
Ignition can export and import Tag configurations to and from the JSON (JavaScript Object Notation) file format. You can import XML (Extensible Markup Language) or CSV (Comma Separated Value) file formats as well, but Ignition will convert them to JSON format. Tag exports are imported in the Designer. Once the Designer is opened you can click on the import button in the Tag Browser panel.

### Requirements

## Release Notes
Bug fix

## Authors and Acknowledgment
Built for the [Ignition Exchange](https://inductiveautomation.com/exchange) by Mike Bordyukov

## Support
View [CSS Animation Guide: A Robot Example](https://inductiveautomation.com/exchange/2516) for more information, and other [versions](https://inductiveautomation.com/exchange/2516/versions)

## License
+ [MIT](https://choosealicense.com/licenses/mit/)
+ [Terms & Conditions](https://inductiveautomation.com/exchange/terms)
+ [Acceptable Use](https://inductiveautomation.com/exchange/use)
