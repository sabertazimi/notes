---
sidebar_position: 1
tags: [CS, Database, Data, XML, JSON]
---

# Data

## XML

- single root element
- matched tags with proper nesting
- unique attributes within elements

### DTD

Document Type Definition:

- similar grammar to regular expression(`*?`)
- ID/IDRef should be unique
- CDATA: character data
- (#PCDATA): parsed character data (plain text between tags)

```xml
<?xml version="1.0" encoding="utf-8"?>

<!DOCTYPE Bookstore [
    <!ELEMENT Bookstore (Book)*>
    <!ELEMENT Book (Title, Authors, Remark?)>
    <!ATTLIST Book  ISBN ID #REQUIRED
                    Price CDATA #REQUIRED
                    Authors IDREFS #REQUIRED>
    <!ELEMENT Title (#PCDATA)>
    <!ELEMENT Remark (#PCDATA | BookRef)*>
    <!ELEMENT BookRef EMPTY>
    <!ATTLIST BookRef book IDREF #REQUIRED>
    <!ELEMENT Authors (Author)*>
    <!ELEMENT Author (First_Name, Last_Name)>
    <!ATTLIST Author Ident ID #REQUIRED>
    <!ELEMENT First_Name (#PCDATA)>
    <!ELEMENT Last_Name (#PCDATA)>
]>

<Bookstore>
    <Book ISBN="ISBN-0-23-23333-233" Price="233" Authors="Sabertazimi">
        <Title>Kind of sword</Title>
        <Authors>
            <Author Ident="Sabertazimi">
                <First_Name>Yilong</First_Name>
                <Last_Name>Liu</Last_Name>
            </Author>
        </Authors>
    </Book>
</Bookstore>
```

Tools: XML Copy Editor, XML Linter:

```bash
xmllint --valid --noout Bookstore.xml
```

### XSD

XML Schema Definition:

```bash
xmllint -schema Bookstore.xsd -noout Bookstore.xml
```

## JSON

JavaScript Object Notation:

- serializing data objects in files
- human-readable data
- semi-structured data
- number/boolean/string/array/object(empty or key-value pair) recursive constructs
