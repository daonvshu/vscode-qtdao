# qtdao entity XML format

Root element `dao`; everything is lowercase. A `<dao>` must contain at least
one `tb` element, and every `tb`/`item` needs a non-empty `name` — nameless
elements and missing structural children are rejected with the table/item
position in the error message.

| dao attribute | meaning |
| --- | --- |
| `db` | required, one of `sqlite`, `mysql`, `sqlserver`, `psql` |
| `prefix` | database table name prefix |
| `namespace` | C++ namespace wrapping the generated classes |
| `alias` | suffix appended to the delegate registration key |

## tb (table)

| attribute | meaning |
| --- | --- |
| `name` | class name and table name basis; required, non-empty |
| `declaremetatype` | `1`/`true` emits `Q_GADGET` and `Q_PROPERTY` members |
| `engine` | mysql storage engine, e.g. `InnoDB` |
| `createmanual` | `1`/`true` keeps the table out of `entity.pri`/`entity.cmake` and the delegate table list |

Children: one or more `item` (required), any number of `index`,
`foreignkey`, `constructor`.

## item (field)

| attribute | meaning |
| --- | --- |
| `name` | member name; required, non-empty |
| `type` | database type; defaults to `int`, per-db values below |
| `customtype` | with `type="custom"`: C++ serializable class name; headers resolved from Qt serializable types, otherwise `<type>.h` |
| `note` | comment text; mysql also emits it as a `comment` clause |
| `constraints` | `primary key`, `not null` or `unique` |
| `default` | `null`, `empty`, `now` (date/time types), a literal, or a quoted expression such as `"QDateTime::currentDateTime()"` |
| `autoincrement` | `1`/`true`; psql also sets it implicitly for `smallserial`/`serial`/`bigserial` |
| `transient` | `1`/`true` excludes the field from database columns, JSON, streams and constructors |
| `jsonkey` | JSON key override; default is the snake_case of `name` |
| `jsontimeformat` | `QDate`/`QTime`/`QDateTime` JSON format string |
| `reftb` + `refitem` | field-level foreign key; `refitem` must be declared `unique` or `primary key` in `reftb` |
| `refonupdate` / `refondelete` | foreign key action: `no_action`, `restrict`, `set_null`, `set_default`, `cascade`; anything else means NotSet |
| `deferrable`, `refvirtual` | `1`/`true` foreign key flags |
| `bitsize` | appends `(N)` to the database type (varchar length, mysql datetime precision, sqlserver decimal precision) |
| `decimal-d` | decimal digits; with `bitsize` yields `(N, D)` on `decimal`, alone yields `(0, D)` |

Type values per `db`:

- sqlite: `int`, `long`, `real`, `text`, `blob`, `variant`
- mysql: `tinyint`, `smallint`, `mediumint`, `int`, `bigint`, `float`, `double`, `decimal`, `date`, `time`, `datetime`, `timestamp`, `char`, `varchar`, `tinytext`, `text`, `mediumtext`, `longtext`, `tinyblob`, `blob`, `mediumblob`, `longblob`
- sqlserver: `tinyint`, `smallint`, `int`, `bigint`, `float`, `double`, `decimal`, `numeric`, `real`, `date`, `time`, `datetime`, `datetime2`, `datetimeoffset`, `timestamp`, `char`, `varchar`, `varchar(max)`, `nchar`, `nvarchar`, `nvarchar(max)`, `text`, `ntext`, `bit`, `binary`, `varbinary`, `varbinary(max)`, `sql_variant`, `uniqueidentifier`, `xml`
- psql: `bit`, `smallint`, `smallserial`, `integer`, `serial`, `bigint`, `bigserial`, `decimal`, `numeric`, `double precision`, `real`, `boolean`, `date`, `time`, `timestamp`, `interval`, `char`, `varchar`, `text`, `bytea`

## index

Attribute `type`: default `index`, `unique index` elsewhere; sqlserver uses
`nonclustered` (default), `clustered`, `unique clustered`,
`unique nonclustered` plus optional `ignore_dup_key`, `allow_row_locks`,
`allow_page_locks`, `data_compression`. Each child `field` holds the column
name as text and may carry `seq` (`asc`/`desc`).

## foreignkey

Attributes `reftb`, `refonupdate`, `refondelete`, `deferrable`, `refvirtual`
(same values as the field-level equivalents). Each child `field` requires
`name` (column in this table) and `refitem` (column in `reftb`); referenced
columns must be unique or primary key, or match a unique composite index.

## constructor

Child `field` elements contain a member name as text; each `constructor`
adds a constructor taking exactly those fields in the given order.

## Example

```xml
<?xml version="1.0" encoding="utf-8"?>
<dao db="mysql">
  <tb name="User" declaremetatype="true">
    <item name="id" type="bigint" default="-1" constraints="primary key" autoincrement="true"/>
    <item name="name" type="varchar" bitsize="100" constraints="not null" note="display name"/>
    <item name="group_id" type="bigint" reftb="Group" refitem="id"/>
  </tb>
</dao>
```

The `testentity/` directory holds three complete fixtures covering every
attribute and database type.
