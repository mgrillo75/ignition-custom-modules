# Copy, Move, and Rename Tags _ Ignition SDK Programmer's Guide

---
*[Image on page 1]*

### Appendix Tag Examples Copy, Move, and Rename Tags

# **Version:** 8.3 Copy, Move, and Rename Tags
```
// This code example is Gateway scoped and assumes the `GatewayContext` object is available.
private void copyMoveRenameTag() throws Exception {
IgnitionGateway context = IgnitionGateway.get();
GatewayTagManager tagManager = context.getTagManager();
// We are going through the GatewayTagManager rather than a specific tag provider, so we must add the
provider name
// to the front of the path.
TagPath memoryTag1 = TagPathParser.parse("[default]LevelOne_FolderA/MemoryTag1");
TagPath destination = TagPathParser.parse("[default]LevelOne_FolderA");
// Make a copy of LevelOne_FolderA/MemoryTag1
List<QualityCode> results = tagManager.moveTagsAsync(Arrays.asList(memoryTag1), destination, true,
CollisionPolicy.Rename).get(30, TimeUnit.SECONDS);
QualityCode qc = results.get(0);
if (qc.isNotGood()) {
throw new Exception(String.format("Copy operation returned bad result '%s'", qc.toString()));
}
// Now move the newly copied tag to the root
TagPath memoryTag2 = TagPathParser.parse("[default]LevelOne_FolderA/MemoryTag2");
destination = TagPathParser.parse("[default]");
results = tagManager.moveTagsAsync(Arrays.asList(memoryTag2), destination, false,
```
12/17/25, 3:12 PM Copy, Move, and Rename Tags | Ignition SDK Programmer's Guide

https://www.sdk-docs.inductiveautomation.com/docs/8.3/appendix/tag-examples/copy-move-rename-tags 1/2

*[Image on page 2]*

### Last updated on Oct 23, 2023 by root
```
CollisionPolicy.Abort).get(30, TimeUnit.SECONDS);
qc = results.get(0);
if (qc.isNotGood()) {
throw new Exception(String.format("Move operation returned bad result '%s'", qc.toString()));
}
// Finally, rename MemoryTag2 to RootMemoryTag1
memoryTag2 = TagPathParser.parse("[default]MemoryTag2");
results = tagManager.renameTag(memoryTag2, "RootMemoryTag1", CollisionPolicy.Abort)
.get(30, TimeUnit.SECONDS);
qc = results.get(0);
if (qc.isNotGood()) {
throw new Exception(String.format("Rename operation returned bad result '%s'", qc.toString()));
}
}
```
12/17/25, 3:12 PM Copy, Move, and Rename Tags | Ignition SDK Programmer's Guide

https://www.sdk-docs.inductiveautomation.com/docs/8.3/appendix/tag-examples/copy-move-rename-tags 2/2
