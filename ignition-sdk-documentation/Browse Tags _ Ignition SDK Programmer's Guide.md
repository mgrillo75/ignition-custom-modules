# Browse Tags _ Ignition SDK Programmer's Guide

---
*[Image on page 1]*

### Appendix Tag Examples Browse Tags

# **Version:** 8.3 Browse Tags
```
// This code example is Gateway scoped and assumes the `GatewayContext` object is available.
private void browseTags() throws Exception {
IgnitionGateway context = IgnitionGateway.get();
GatewayTagManager tagManager = context.getTagManager();
TagProvider provider = tagManager.getTagProvider("default"); // Change tag provider name here as needed
TagPath root = TagPathParser.parse("");
browseNode(provider, root);
}
private void browseNode(TagProvider provider, TagPath parentPath) throws Exception {
Results<NodeDescription> results = provider.browseAsync(parentPath, BrowseFilter.NONE).get(30,
TimeUnit.SECONDS);
if(results.getResultQuality().isNotGood()) {
throw new Exception("Bad quality results: "+ results.getResultQuality().toString());
}
Collection<NodeDescription> nodes = results.getResults();
StringBuilder structure = new StringBuilder();
for(int i = 0; i<parentPath.getPathLength(); i++) {
structure.append("\t");
}
String formatted = structure.toString() + "[%s] objectType=%s, dataType=%s, subTypeId=%s,
```
12/17/25, 3:12 PM Browse Tags | Ignition SDK Programmer's Guide

https://www.sdk-docs.inductiveautomation.com/docs/8.3/appendix/tag-examples/browse-tags 1/2

*[Image on page 2]*

### Last updated on Oct 23, 2023 by root
```
currentValue=%s, displayFormat=%s, attributes=%s, hasChildren=%s";
for(NodeDescription node: nodes) {
String currentValue = node.getCurrentValue().getValue() != null ?
node.getCurrentValue().getValue().toString(): "null";
String descr = String.format(formatted, node.getName(),
node.getObjectType(),
node.getDataType(),
node.getSubTypeId(),
currentValue,
node.getDisplayFormat(),
node.getAttributes().toString(),
node.hasChildren());
// logger.info(descr);
// Browse child nodes, but not Document nodes such as UDT parameters
if(node.hasChildren() && DataType.Document != node.getDataType()) {
TagPath childPath = parentPath.getChildPath(node.getName());
browseNode(provider, childPath);
}
}
}
```
12/17/25, 3:12 PM Browse Tags | Ignition SDK Programmer's Guide

https://www.sdk-docs.inductiveautomation.com/docs/8.3/appendix/tag-examples/browse-tags 2/2
