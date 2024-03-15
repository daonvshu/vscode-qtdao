# Changelog

### 0.1.4
- Added virtual foreign key references.
- Added more function utilities for operating on tables related by foreign key references.

### 0.1.3
- Added support for foreign keys and functions to retrieve child table data lists. Requires QtDao v2.1.1+.
- Entity class 'get/set' functions have been marked DEPRECATED, use member variable access instead.
- Introduced direct CRUD operations for entities with a single auto-incrementing field.

### 0.1.2
- Removed the 'getFieldsWithoutTimestamp' function in the entity class when using SQLServer.
- Updated the entity delegate. This update requires QtDao v2.1.0 or higher.
- Added a '.gitignore' file in the generated directory to ignore all generated files.

### 0.1.1
- Update entity fields initialize

### 0.1.0
- Fix keyword field operations in index/bindValue/json

### 0.0.9
- Add custom type serialization operations

### 0.0.8
- Fix lowercase name creator
- Change attribute 'prefix' optional
- Check field and escape the keywords

### 0.0.7
- Provide function 'operator==()' implementation

### 0.0.6
- Fix check mysql 'timestamp' field of default value
- Update 'entity delegate' classes

### 0.0.5
- Output file names use lowercase
- Add namespace 'dao' for classes in the library

### 0.0.4
- Change '__extra' type to QVariantMap
- Add field property declarations to support the QML type system

### 0.0.3
- Fix check file content changed

### 0.0.2
- Add generated finish message

### 0.0.1
- Create pri script for qtcreator
- Create cmake script for cmake project