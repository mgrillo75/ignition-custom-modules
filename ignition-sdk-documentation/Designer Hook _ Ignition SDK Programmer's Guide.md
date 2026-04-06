# Designer Hook _ Ignition SDK Programmer's Guide

---
*[Image on page 1]*

### Vision Development Vision Component Development Designer Hook

# **Version:** 8.3 Designer Hook

The Designer hook class of a module that adds Vision module properties has two main functions:

Add the BeanInfo search path.

Add the components themselves into the Vision Palette.
```
To get the Palette, you'll need to implement the Vision module's VisionDesignerInterface . You can do this through the
DesignerContext . Once you have the VisionDesignerInterface , you can get the palette and make your own PaletteItemGroup .
```
You'll add all of your components to this item group.

MyModuleDesignerHook.java
```
public class MyModuleDesignerHook extends AbstractDesignerModuleHook {
public void startup(DesignerContext context, LicenseState activationState) throws Exception {
// Add the BeanInfo package to the search path:
context.addBeanInfoSearchPath("com.example.mymodule.beaninfos");
// Add the component to its own palette:
VisionDesignerInterface sdk = (VisionDesignerInterface)
context.getModule(VisionDesignerInterface.VISION_MODULE_ID);
if (sdk != null) {
Palette palette = sdk.getPalette();
PaletteItemGroup group = palette.addGroup("MyModule");
group.addPaletteItem(new JavaBeanPaletteItem(MyGreatChart.class));
```
12/17/25, 3:11 PM Designer Hook | Ignition SDK Programmer's Guide

https://www.sdk-docs.inductiveautomation.com/docs/8.3/vision-development/vision-component-development/designer-hook 1/2

*[Image on page 2]*

### Last updated on Oct 23, 2023 by root
```
group.addPaletteItem(new JavaBeanPaletteItem(SomeOtherComponent.class));
}
}
}
```
12/17/25, 3:11 PM Designer Hook | Ignition SDK Programmer's Guide

https://www.sdk-docs.inductiveautomation.com/docs/8.3/vision-development/vision-component-development/designer-hook 2/2
