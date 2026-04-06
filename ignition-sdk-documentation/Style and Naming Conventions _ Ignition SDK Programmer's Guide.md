# Style and Naming Conventions _ Ignition SDK Programmer's Guide

---
### Getting Started Key Design Concepts Style and Naming Conventions

# **Version:** 8.3 Style and Naming Conventions

In general, the Ignition platform follows the recommendations of the Oracle Code Conventions for the Java Programming Language.

Most of the interfaces and classes in the Ignition platform are named using the standard casing. Some items, however, have names

that are products of their history, which may make them a bit confusing. The following list tries to identify inconsistent or legacy

naming schemes that module writers are likely to encounter:

### factorysql or factorypmi packages, or the abbreviations "fsql" and "fpmi" in identifiers.

These products were the predecessors to the SQL Bridge and Vision modules respectively, and these names still show up in

code fairly regularly.

### "SR*" naming convention.

During early development, Ignition was referred to as "ScadaRail". This led to many classes being named with the initial

### abbreviation SR, a practice that has been abandoned, but not completely reversed.

### Last updated on Oct 23, 2023 by root

12/17/25, 3:08 PM Style and Naming Conventions | Ignition SDK Programmer's Guide

https://www.sdk-docs.inductiveautomation.com/docs/8.3/getting-started/key-design-concepts/style-and-naming 1/1
