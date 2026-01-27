---
sidebar_position: 16
tags: [Web, Security, XML, Vulnerability]
---

# XML

## Attack

Inline document type definition in XML
led to dangerous macros:

- XML bombs.
- XML external entities.

## Protection

- Disable DTD (Document Type Definitions) parse in XML parser:
  `xml2js`, `parse-xml`, `node-xml`.
- Least privilege principle.
