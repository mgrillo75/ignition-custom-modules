# Storing Data with PersistentRecords _ Ignition SDK Programmer's Guide

---
### Programming for the Gateway Storing Data with PersistentRecords

# **Version:** 8.3 Storing Data with PersistentRecords

The PersistentRecord class is your entrypoint to storing and retrieving data in the internal database system. As described in the Key

Design Concepts > Storing Configuration Data, you don’t need to worry about replicating data to redundant nodes, writing raw

SQL queries, or maintaining tables. Additionally, the PersistentRecord offers convenient methods for listening to record changes.

The persistence interface is used to store any data that should be replicated through redundancy, and offers facilities for working both

with single rows (such as module settings) and many rows (such as associated objects). It should not be used directly for project data

since the project resource system offers richer facilities for that.

# Using PersistentRecords


1. Define the data by creating a class that extends from PersistentRecord, and defining your own fields that extend from

SFieldMeta, such as StringField, LongField, and IntField.
```
2. Register the record and verify the table by calling GatewayContext.getSchemaUpdater().updatePersistentRecords.
```
3. Use the methods on the PersistenceInterface to create, read, update, and delete persistent records.
4. Optional: Listen for changes to your record by adding an IRecordListener to its META object.

# Defining a PersistentRecord

12/17/25, 3:08 PM Storing Data with PersistentRecords | Ignition SDK Programmer's Guide

https://www.sdk-docs.inductiveautomation.com/docs/8.3/programming-for-the-gateway/storing-data-with-persistantrecords 1/7

A custom PersistentRecord type starts by extending that class. Then, define a series of public, static fields and a public static META

field.

## RecordMeta Object

RecordMeta is used to create new instances, identify records, and more. It’s common to declare this as a public, static field in your

custom record because of how frequently it is used.

## Field Definitions

Fields are defined using special classes that represent different data types and are declared as public, static variables. The full list of

data types can be found in the JavaDocs, but some of the most common are: IntField, DoubleField, DateField, StringField,

BooleanField, and EnumField. The fields are defined with a name and support common operations such as setting a default value or

setting a not-null constraint. Additional aspects are defined by the SFieldFlags, such as whether the field is a key. See the JavaDocs

for that enum for more information.

## Identity Fields

Another important field type is the IdentityField. This field translates to a unique, automatically assigned long value. It also defines

itself as the primary key, or identifier, for the record. In most cases, it's convenient to use the IdentityField as the unique element in a
```
record. However, it's possible to declare any field as the primary key using the SFieldFlags.SPRIMARY_KEY field flag.
```
## References to Related Records

Often records will be related to other records. By defining that relation, it's easy to navigate them when querying. To define a

relationship to another record, two field definitions are required:

A field that represents the primary key of the other record

12/17/25, 3:08 PM Storing Data with PersistentRecords | Ignition SDK Programmer's Guide

https://www.sdk-docs.inductiveautomation.com/docs/8.3/programming-for-the-gateway/storing-data-with-persistantrecords 2/7

*[Image on page 3]*


*[Image on page 3]*


*[Image on page 3]*


A ReferenceField that uses the first field to connect the two

For example, internal SQLTags have TagRecords and TagPropertyRecords. Each tag can have many properties. The

TagPropertyRecord relates back to the tag record using the tag's Long id. This is in the TagPropertyRecord:

TagPropertyRecord Example

As another example, you could add the following two fields if you wanted to put a reference in your own record that pointed to a

database connection.

TagPropertyRecord Example Continued

## Setting and Retrieving Values of Fields

Each field type has associated get and set functions defined for it in the PersistentRecord base class. For example, to get the value of
```
a string field called "Name", you would use getString(Name) . Often, for code clarity, it is better to define standard getters and setters
```
in the record that delegate to these functions. The example below illustrates this technique:

Setting and Retrieving Values Example
```
public static final LongField TagId = new LongField(META, "TagId");
public static final ReferenceField<TagRecord> Tag = new ReferenceField<TagRecord> (META, TagRecord.META,
"Tag", TagId);
public static final LongField ConnectionId = new LongField(META, "ConnectionId"); public static final
ReferenceField<DatasourceRecord> Connection =
new ReferenceField<DatasourceRecord>(META, DatasourceRecord.META, "Connection", ConnectionId);
```
12/17/25, 3:08 PM Storing Data with PersistentRecords | Ignition SDK Programmer's Guide

https://www.sdk-docs.inductiveautomation.com/docs/8.3/programming-for-the-gateway/storing-data-with-persistantrecords 3/7

*[Image on page 4]*

# Registering the PersistentRecord
```
public class MySettingsRecord extends PersistentRecord {
public static final RecordMeta<MySettingsRecord> META = new RecordMeta<MySettingsRecord>
(MySettingsRecord.class,"MySettings");
public static final IdentityField Id = new IdentityField(META);
public static final StringField Name = new StringField(META, "Name", SFieldFlags.SMANDATORY,
SFieldFlags.SDESCRIPTIVE);
public static final BooleanField TurboEnabled = new BooleanField(META, "TurboEnabled",
SFieldFlags.SDESCRIPTIVE).setDefault(true);
public static final IntField CommunicationTimeout = new IntField(META,
"CommunicationTimeout").setDefault(5000);
public Long getId(){
return getLong(Id);
}
public String getName(){
return getString(Name);
}
public void setName(String name){
setString(Name,name);
}
...
}
```
12/17/25, 3:08 PM Storing Data with PersistentRecords | Ignition SDK Programmer's Guide

https://www.sdk-docs.inductiveautomation.com/docs/8.3/programming-for-the-gateway/storing-data-with-persistantrecords 4/7

*[Image on page 5]*


*[Image on page 5]*


In order to store and retrieve your persistent record, it must be registered with the persistence interface so that the table can be

created. This is done using the SchemaUpdater provided by the GatewayContext, and is normally done in the setup function of the

module or class that uses the record.

SchemaUpdater Example

The SchemaUpdater has additional functions for ensuring that only a single instance of a record exists. This is useful to hold any

‘singleton’ settings that will always be unique across a Gateway, such as Gateway security settings, or the ‘Live Event Limit’ for

alarming.

# Using the Persistence Interface

## Creating and Saving Record Instances

All CRUD operations for a PersistentRecord are executed through the PersistenceInterface. The JavaDocs for that interface outline all
```
of the available functions, but to create a basic record and save it you can use the createNew() and save() functions.
```
Example
```
public void setup(GatewayContext context) {
context.getSchemaUpdater().updatePersistentRecords(MySettingsRecord.META);
}
MySettingsRecord r = context.getPersistenceInterface().createNew(MySettingsRecord. META);
r.setName("Test");
```
12/17/25, 3:08 PM Storing Data with PersistentRecords | Ignition SDK Programmer's Guide

https://www.sdk-docs.inductiveautomation.com/docs/8.3/programming-for-the-gateway/storing-data-with-persistantrecords 5/7

*[Image on page 6]*


*[Image on page 6]*
```
Modified data in a record is not stored to the database until save() is called. Although more advanced methods for saving records
```
exist, this function is the most convenient method for single records.

## Querying Records
```
Records are also retrieved through the PersistenceInterface. Retrieval is accomplished via the query() and find() functions. The
```
query function allows you to build complex search queries and specify additional properties, such as ordering. Queries are built using

the SQuery object, which is a fluent builder supporting chained calls.

The find function differs in that it takes primary key values to find a specific tag.

Query example to find instances with of MySettingsRecord with turbo enabled

## Aggregating Operations using Sessions

When performing any operation, the persistence interface uses sessions and datasets to execute commands. In the examples above,

sessions are created automatically and closed after the command is executed. For performance and data consistency, it is often

useful when performing multiple operations together to create your own session, modify its dataset, and commit it when finished.
```
A PersistenceSession object is generated by calling getSession() on the persistence interface. After retrieving a session, you can
get its dataset with getDataSet() . The dataset can be used to modify rows. When finished, commit the modified dataset through
r.setCommunicationTimeout(1000); context.getPersistenceInterface().save(r);
SQuery<MySettingsRecord> query = new SQuery<MySettingsRecord>
(MySettingsRecord.META).isTrue(MySettingsRecord.TurboEnabled) List<MySettingsRecord> results;
results = this.getGatewayContext().getPersistenceInterface().query(query);
```
12/17/25, 3:08 PM Storing Data with PersistentRecords | Ignition SDK Programmer's Guide

https://www.sdk-docs.inductiveautomation.com/docs/8.3/programming-for-the-gateway/storing-data-with-persistantrecords 6/7

*[Image on page 7]*
```
session.commit() . If an error occurs, all changes can be reversed with session.rollback() .
```
# Listening for Changes to Records

Often, you'll want to be notified when a type of record you're interested in changes. This can be accomplished by implementing an

IRecordListener and registering it on a record's META. This interface defines functions that will be called any time a record of the

specified type is added, removed, or modified. If you're only interested in one or two of these operations, it is easier to extend the

RecordListenerAdapter class and override the functions you want.

For example, making sure you’re notified when your MySettingsRecord is modified could look like the following:

Declare an anonymous subclass

In this example block, we're using the ability to declare an anonymous subclass inline in order to extend RecordListenerAdapter and

provide our own implementation of recordUpdated. When it's called, we simply call a different function that should update our module

with the new settings.

### Last updated on Oct 23, 2023 by root
```
MySettingsRecord.META.addRecordListener(new RecordListenerAdapter<MySettingsRecord> () {
@Override
public void recordUpdated(MySettingsRecord record) {
applyNewSettings(record);
}
});
```
12/17/25, 3:08 PM Storing Data with PersistentRecords | Ignition SDK Programmer's Guide

https://www.sdk-docs.inductiveautomation.com/docs/8.3/programming-for-the-gateway/storing-data-with-persistantrecords 7/7
