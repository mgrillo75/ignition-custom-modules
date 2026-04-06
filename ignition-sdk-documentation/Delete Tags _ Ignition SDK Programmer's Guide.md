# Delete Tags _ Ignition SDK Programmer's Guide

---
*[Image on page 1]*

### Appendix Tag Examples Delete Tags

# **Version:** 8.3 Delete Tags
```
// This code example is Gateway scoped and assumes the `GatewayContext` object is available.
private void deleteTags() throws Exception {
IgnitionGateway context = IgnitionGateway.get();
GatewayTagManager tagManager = context.getTagManager();
TagProvider provider = tagManager.getTagProvider("default"); // Change tag provider name here as needed
List<TagPath> toDelete = new ArrayList<>();
TagPath levelOne_FolderA = TagPathParser.parse("LevelOne_FolderA");
toDelete.add(levelOne_FolderA);
TagPath tinyUdtOverrideInstance = TagPathParser.parse("TinyUdt_OverrideInstance");
toDelete.add(tinyUdtOverrideInstance);
List<QualityCode> results = provider.removeTagConfigsAsync(toDelete)
.get(30, TimeUnit.SECONDS);
for (int i = 0; i < results.size(); i++) {
QualityCode result = results.get(i);
if (result.isNotGood()) {
TagPath tagPath = toDelete.get(i);
throw new Exception(String.format("Delete tag operation for tag '%s' returned bad result '%s'",
tagPath.toStringFull(), result.toString()));
}
}
}
```
12/17/25, 3:12 PM Delete Tags | Ignition SDK Programmer's Guide

https://www.sdk-docs.inductiveautomation.com/docs/8.3/appendix/tag-examples/delete-tags 1/2

### Last updated on Oct 23, 2023 by root

12/17/25, 3:12 PM Delete Tags | Ignition SDK Programmer's Guide

https://www.sdk-docs.inductiveautomation.com/docs/8.3/appendix/tag-examples/delete-tags 2/2
