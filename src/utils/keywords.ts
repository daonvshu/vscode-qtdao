export const keywordsOrReservedWords = {
    "sqlite": [ //copy from https://www.sqlite.org/lang_keywords.html
        "ABORT",
        "ACTION",
        "ADD",
        "AFTER",
        "ALL",
        "ALTER",
        "ALWAYS",
        "ANALYZE",
        "AND",
        "AS",
        "ASC",
        "ATTACH",
        "AUTOINCREMENT",
        "BEFORE",
        "BEGIN",
        "BETWEEN",
        "BY",
        "CASCADE",
        "CASE",
        "CAST",
        "CHECK",
        "COLLATE",
        "COLUMN",
        "COMMIT",
        "CONFLICT",
        "CONSTRAINT",
        "CREATE",
        "CROSS",
        "CURRENT",
        "CURRENT_DATE",
        "CURRENT_TIME",
        "CURRENT_TIMESTAMP",
        "DATABASE",
        "DEFAULT",
        "DEFERRABLE",
        "DEFERRED",
        "DELETE",
        "DESC",
        "DETACH",
        "DISTINCT",
        "DO",
        "DROP",
        "EACH",
        "ELSE",
        "END",
        "ESCAPE",
        "EXCEPT",
        "EXCLUDE",
        "EXCLUSIVE",
        "EXISTS",
        "EXPLAIN",
        "FAIL",
        "FILTER",
        "FIRST",
        "FOLLOWING",
        "FOR",
        "FOREIGN",
        "FROM",
        "FULL",
        "GENERATED",
        "GLOB",
        "GROUP",
        "GROUPS",
        "HAVING",
        "IF",
        "IGNORE",
        "IMMEDIATE",
        "IN",
        "INDEX",
        "INDEXED",
        "INITIALLY",
        "INNER",
        "INSERT",
        "INSTEAD",
        "INTERSECT",
        "INTO",
        "IS",
        "ISNULL",
        "JOIN",
        "KEY",
        "LAST",
        "LEFT",
        "LIKE",
        "LIMIT",
        "MATCH",
        "MATERIALIZED",
        "NATURAL",
        "NO",
        "NOT",
        "NOTHING",
        "NOTNULL",
        "NULL",
        "NULLS",
        "OF",
        "OFFSET",
        "ON",
        "OR",
        "ORDER",
        "OTHERS",
        "OUTER",
        "OVER",
        "PARTITION",
        "PLAN",
        "PRAGMA",
        "PRECEDING",
        "PRIMARY",
        "QUERY",
        "RAISE",
        "RANGE",
        "RECURSIVE",
        "REFERENCES",
        "REGEXP",
        "REINDEX",
        "RELEASE",
        "RENAME",
        "REPLACE",
        "RESTRICT",
        "RETURNING",
        "RIGHT",
        "ROLLBACK",
        "ROW",
        "ROWS",
        "SAVEPOINT",
        "SELECT",
        "SET",
        "TABLE",
        "TEMP",
        "TEMPORARY",
        "THEN",
        "TIES",
        "TO",
        "TRANSACTION",
        "TRIGGER",
        "UNBOUNDED",
        "UNION",
        "UNIQUE",
        "UPDATE",
        "USING",
        "VACUUM",
        "VALUES",
        "VIEW",
        "VIRTUAL",
        "WHEN",
        "WHERE",
        "WINDOW",
        "WITH",
        "WITHOUT",
    ],
    "mysql": [ //copy from https://dev.mysql.com/doc/refman/8.0/en/keywords.html
        "ACCESSIBLE",
        "ACCOUNT",
        "ACTION",
        "ACTIVE",
        "ADD",
        "ADMIN",
        "AFTER",
        "AGAINST",
        "AGGREGATE",
        "ALGORITHM",
        "ALL",
        "ALTER",
        "ALWAYS",
        "ANALYSE",
        "ANALYZE",
        "AND",
        "ANY",
        "ARRAY",
        "AS",
        "ASC",
        "ASCII",
        "ASENSITIVE",
        "AT",
        "ATTRIBUTE",
        "AUTHENTICATION",
        "AUTOEXTEND_SIZE",
        "AUTO_INCREMENT",
        "AVG",
        "AVG_ROW_LENGTH",
        "BACKUP",
        "BEFORE",
        "BEGIN",
        "BETWEEN",
        "BIGINT",
        "BINARY",
        "BINLOG",
        "BIT",
        "BLOB",
        "BLOCK",
        "BOOL",
        "BOOLEAN",
        "BOTH",
        "BTREE",
        "BUCKETS",
        "BULK",
        "BY",
        "BYTE",
        "CACHE",
        "CALL",
        "CASCADE",
        "CASCADED",
        "CASE",
        "CATALOG_NAME",
        "CHAIN",
        "CHALLENGE_RESPONSE",
        "CHANGE",
        "CHANGED",
        "CHANNEL",
        "CHAR",
        "CHARACTER",
        "CHARSET",
        "CHECK",
        "CHECKSUM",
        "CIPHER",
        "CLASS_ORIGIN",
        "CLIENT",
        "CLONE",
        "CLOSE",
        "COALESCE",
        "CODE",
        "COLLATE",
        "COLLATION",
        "COLUMN",
        "COLUMNS",
        "COLUMN_FORMAT",
        "COLUMN_NAME",
        "COMMENT",
        "COMMIT",
        "COMMITTED",
        "COMPACT",
        "COMPLETION",
        "COMPONENT",
        "COMPRESSED",
        "COMPRESSION",
        "CONCURRENT",
        "CONDITION",
        "CONNECTION",
        "CONSISTENT",
        "CONSTRAINT",
        "CONSTRAINT_CATALOG",
        "CONSTRAINT_NAME",
        "CONSTRAINT_SCHEMA",
        "CONTAINS",
        "CONTEXT",
        "CONTINUE",
        "CONVERT",
        "CPU",
        "CREATE",
        "CROSS",
        "CUBE",
        "CUME_DIST",
        "CURRENT",
        "CURRENT_DATE",
        "CURRENT_TIME",
        "CURRENT_TIMESTAMP",
        "CURRENT_USER",
        "CURSOR",
        "CURSOR_NAME",
        "DATA",
        "DATABASE",
        "DATABASES",
        "DATAFILE",
        "DATE",
        "DATETIME",
        "DAY",
        "DAY_HOUR",
        "DAY_MICROSECOND",
        "DAY_MINUTE",
        "DAY_SECOND",
        "DEALLOCATE",
        "DEC",
        "DECIMAL",
        "DECLARE",
        "DEFAULT",
        "DEFAULT_AUTH",
        "DEFINER",
        "DEFINITION",
        "DELAYED",
        "DELAY_KEY_WRITE",
        "DELETE",
        "DENSE_RANK",
        "DESC",
        "DESCRIBE",
        "DESCRIPTION",
        "DES_KEY_FILE",
        "DETERMINISTIC",
        "DIAGNOSTICS",
        "DIRECTORY",
        "DISABLE",
        "DISCARD",
        "DISK",
        "DISTINCT",
        "DISTINCTROW",
        "DIV",
        "DO",
        "DOUBLE",
        "DROP",
        "DUAL",
        "DUMPFILE",
        "DUPLICATE",
        "DYNAMIC",
        "EACH",
        "ELSE",
        "ELSEIF",
        "EMPTY",
        "ENABLE",
        "ENCLOSED",
        "ENCRYPTION",
        "END",
        "ENDS",
        "ENFORCED",
        "ENGINE",
        "ENGINES",
        "ENGINE_ATTRIBUTE",
        "ENUM",
        "ERROR",
        "ERRORS",
        "ESCAPE",
        "ESCAPED",
        "EVENT",
        "EVENTS",
        "EVERY",
        "EXCEPT",
        "EXCHANGE",
        "EXCLUDE",
        "EXECUTE",
        "EXISTS",
        "EXIT",
        "EXPANSION",
        "EXPIRE",
        "EXPLAIN",
        "EXPORT",
        "EXTENDED",
        "EXTENT_SIZE",
        "FACTOR",
        "FAILED_LOGIN_ATTEMPTS",
        "FALSE",
        "FAST",
        "FAULTS",
        "FETCH",
        "FIELDS",
        "FILE",
        "FILE_BLOCK_SIZE",
        "FILTER",
        "FINISH",
        "FIRST",
        "FIRST_VALUE",
        "FIXED",
        "FLOAT",
        "FLOAT4",
        "FLOAT8",
        "FLUSH",
        "FOLLOWING",
        "FOLLOWS",
        "FOR",
        "FORCE",
        "FOREIGN",
        "FORMAT",
        "FOUND",
        "FROM",
        "FULL",
        "FULLTEXT",
        "FUNCTION",
        "GENERAL",
        "GENERATE",
        "GENERATED",
        "GEOMCOLLECTION",
        "GEOMETRY",
        "GEOMETRYCOLLECTION",
        "GET",
        "GET_FORMAT",
        "GET_MASTER_PUBLIC_KEY",
        "GET_SOURCE_PUBLIC_KEY",
        "GLOBAL",
        "GRANT",
        "GRANTS",
        "GROUP",
        "GROUPING",
        "GROUPS",
        "GROUP_REPLICATION",
        "GTID_ONLY",
        "HANDLER",
        "HASH",
        "HAVING",
        "HELP",
        "HIGH_PRIORITY",
        "HISTOGRAM",
        "HISTORY",
        "HOST",
        "HOSTS",
        "HOUR",
        "HOUR_MICROSECOND",
        "HOUR_MINUTE",
        "HOUR_SECOND",
        "IDENTIFIED",
        "IF",
        "IGNORE",
        "IGNORE_SERVER_IDS",
        "IMPORT",
        "IN",
        "INACTIVE",
        "INDEX",
        "INDEXES",
        "INFILE",
        "INITIAL",
        "INITIAL_SIZE",
        "INITIATE",
        "INNER",
        "INOUT",
        "INSENSITIVE",
        "INSERT",
        "INSERT_METHOD",
        "INSTALL",
        "INSTANCE",
        "INT",
        "INT1",
        "INT2",
        "INT3",
        "INT4",
        "INT8",
        "INTEGER",
        "INTERSECT",
        "INTERVAL",
        "INTO",
        "INVISIBLE",
        "INVOKER",
        "IO",
        "IO_AFTER_GTIDS",
        "IO_BEFORE_GTIDS",
        "IO_THREAD",
        "IPC",
        "IS",
        "ISOLATION",
        "ISSUER",
        "ITERATE",
        "JOIN",
        "JSON",
        "JSON_TABLE",
        "JSON_VALUE",
        "KEY",
        "KEYRING",
        "KEYS",
        "KEY_BLOCK_SIZE",
        "KILL",
        "LAG",
        "LANGUAGE",
        "LAST",
        "LAST_VALUE",
        "LATERAL",
        "LEAD",
        "LEADING",
        "LEAVE",
        "LEAVES",
        "LEFT",
        "LESS",
        "LEVEL",
        "LIKE",
        "LIMIT",
        "LINEAR",
        "LINES",
        "LINESTRING",
        "LIST",
        "LOAD",
        "LOCAL",
        "LOCALTIME",
        "LOCALTIMESTAMP",
        "LOCK",
        "LOCKED",
        "LOCKS",
        "LOGFILE",
        "LOGS",
        "LONG",
        "LONGBLOB",
        "LONGTEXT",
        "LOOP",
        "LOW_PRIORITY",
        "MASTER",
        "MASTER_AUTO_POSITION",
        "MASTER_BIND",
        "MASTER_COMPRESSION_ALGORITHMS",
        "MASTER_CONNECT_RETRY",
        "MASTER_DELAY",
        "MASTER_HEARTBEAT_PERIOD",
        "MASTER_HOST",
        "MASTER_LOG_FILE",
        "MASTER_LOG_POS",
        "MASTER_PASSWORD",
        "MASTER_PORT",
        "MASTER_PUBLIC_KEY_PATH",
        "MASTER_RETRY_COUNT",
        "MASTER_SERVER_ID",
        "MASTER_SSL",
        "MASTER_SSL_CA",
        "MASTER_SSL_CAPATH",
        "MASTER_SSL_CERT",
        "MASTER_SSL_CIPHER",
        "MASTER_SSL_CRL",
        "MASTER_SSL_CRLPATH",
        "MASTER_SSL_KEY",
        "MASTER_SSL_VERIFY_SERVER_CERT",
        "MASTER_TLS_CIPHERSUITES",
        "MASTER_TLS_VERSION",
        "MASTER_USER",
        "MASTER_ZSTD_COMPRESSION_LEVEL",
        "MATCH",
        "MAXVALUE",
        "MAX_CONNECTIONS_PER_HOUR",
        "MAX_QUERIES_PER_HOUR",
        "MAX_ROWS",
        "MAX_SIZE",
        "MAX_UPDATES_PER_HOUR",
        "MAX_USER_CONNECTIONS",
        "MEDIUM",
        "MEDIUMBLOB",
        "MEDIUMINT",
        "MEDIUMTEXT",
        "MEMBER",
        "MEMORY",
        "MERGE",
        "MESSAGE_TEXT",
        "MICROSECOND",
        "MIDDLEINT",
        "MIGRATE",
        "MINUTE",
        "MINUTE_MICROSECOND",
        "MINUTE_SECOND",
        "MIN_ROWS",
        "MOD",
        "MODE",
        "MODIFIES",
        "MODIFY",
        "MONTH",
        "MULTILINESTRING",
        "MULTIPOINT",
        "MULTIPOLYGON",
        "MUTEX",
        "MYSQL_ERRNO",
        "NAME",
        "NAMES",
        "NATIONAL",
        "NATURAL",
        "NCHAR",
        "NDB",
        "NDBCLUSTER",
        "NESTED",
        "NETWORK_NAMESPACE",
        "NEVER",
        "NEW",
        "NEXT",
        "NO",
        "NODEGROUP",
        "NONE",
        "NOT",
        "NOWAIT",
        "NO_WAIT",
        "NO_WRITE_TO_BINLOG",
        "NTH_VALUE",
        "NTILE",
        "NULL",
        "NULLS",
        "NUMBER",
        "NUMERIC",
        "NVARCHAR",
        "OF",
        "OFF",
        "OFFSET",
        "OJ",
        "OLD",
        "ON",
        "ONE",
        "ONLY",
        "OPEN",
        "OPTIMIZE",
        "OPTIMIZER_COSTS",
        "OPTION",
        "OPTIONAL",
        "OPTIONALLY",
        "OPTIONS",
        "OR",
        "ORDER",
        "ORDINALITY",
        "ORGANIZATION",
        "OTHERS",
        "OUT",
        "OUTER",
        "OUTFILE",
        "OVER",
        "OWNER",
        "PACK_KEYS",
        "PAGE",
        "PARSER",
        "PARTIAL",
        "PARTITION",
        "PARTITIONING",
        "PARTITIONS",
        "PASSWORD",
        "PASSWORD_LOCK_TIME",
        "PATH",
        "PERCENT_RANK",
        "PERSIST",
        "PERSIST_ONLY",
        "PHASE",
        "PLUGIN",
        "PLUGINS",
        "PLUGIN_DIR",
        "POINT",
        "POLYGON",
        "PORT",
        "PRECEDES",
        "PRECEDING",
        "PRECISION",
        "PREPARE",
        "PRESERVE",
        "PREV",
        "PRIMARY",
        "PRIVILEGES",
        "PRIVILEGE_CHECKS_USER",
        "PROCEDURE",
        "PROCESS",
        "PROCESSLIST",
        "PROFILE",
        "PROFILES",
        "PROXY",
        "PURGE",
        "QUARTER",
        "QUERY",
        "QUICK",
        "RANDOM",
        "RANGE",
        "RANK",
        "READ",
        "READS",
        "READ_ONLY",
        "READ_WRITE",
        "REAL",
        "REBUILD",
        "RECOVER",
        "RECURSIVE",
        "REDOFILE",
        "REDO_BUFFER_SIZE",
        "REDUNDANT",
        "REFERENCE",
        "REFERENCES",
        "REGEXP",
        "REGISTRATION",
        "RELAY",
        "RELAYLOG",
        "RELAY_LOG_FILE",
        "RELAY_LOG_POS",
        "RELAY_THREAD",
        "RELEASE",
        "RELOAD",
        "REMOTE",
        "REMOVE",
        "RENAME",
        "REORGANIZE",
        "REPAIR",
        "REPEAT",
        "REPEATABLE",
        "REPLACE",
        "REPLICA",
        "REPLICAS",
        "REPLICATE_DO_DB",
        "REPLICATE_DO_TABLE",
        "REPLICATE_IGNORE_DB",
        "REPLICATE_IGNORE_TABLE",
        "REPLICATE_REWRITE_DB",
        "REPLICATE_WILD_DO_TABLE",
        "REPLICATE_WILD_IGNORE_TABLE",
        "REPLICATION",
        "REQUIRE",
        "REQUIRE_ROW_FORMAT",
        "RESET",
        "RESIGNAL",
        "RESOURCE",
        "RESPECT",
        "RESTART",
        "RESTORE",
        "RESTRICT",
        "RESUME",
        "RETAIN",
        "RETURN",
        "RETURNED_SQLSTATE",
        "RETURNING",
        "RETURNS",
        "REUSE",
        "REVERSE",
        "REVOKE",
        "RIGHT",
        "RLIKE",
        "ROLE",
        "ROLLBACK",
        "ROLLUP",
        "ROTATE",
        "ROUTINE",
        "ROW",
        "ROWS",
        "ROW_COUNT",
        "ROW_FORMAT",
        "ROW_NUMBER",
        "RTREE",
        "SAVEPOINT",
        "SCHEDULE",
        "SCHEMA",
        "SCHEMAS",
        "SCHEMA_NAME",
        "SECOND",
        "SECONDARY",
        "SECONDARY_ENGINE",
        "SECONDARY_ENGINE_ATTRIBUTE",
        "SECONDARY_LOAD",
        "SECONDARY_UNLOAD",
        "SECOND_MICROSECOND",
        "SECURITY",
        "SELECT",
        "SENSITIVE",
        "SEPARATOR",
        "SERIAL",
        "SERIALIZABLE",
        "SERVER",
        "SESSION",
        "SET",
        "SHARE",
        "SHOW",
        "SHUTDOWN",
        "SIGNAL",
        "SIGNED",
        "SIMPLE",
        "SKIP",
        "SLAVE",
        "SLOW",
        "SMALLINT",
        "SNAPSHOT",
        "SOCKET",
        "SOME",
        "SONAME",
        "SOUNDS",
        "SOURCE",
        "SOURCE_AUTO_POSITION",
        "SOURCE_BIND",
        "SOURCE_COMPRESSION_ALGORITHMS",
        "SOURCE_CONNECT_RETRY",
        "SOURCE_DELAY",
        "SOURCE_HEARTBEAT_PERIOD",
        "SOURCE_HOST",
        "SOURCE_LOG_FILE",
        "SOURCE_LOG_POS",
        "SOURCE_PASSWORD",
        "SOURCE_PORT",
        "SOURCE_PUBLIC_KEY_PATH",
        "SOURCE_RETRY_COUNT",
        "SOURCE_SSL",
        "SOURCE_SSL_CA",
        "SOURCE_SSL_CAPATH",
        "SOURCE_SSL_CERT",
        "SOURCE_SSL_CIPHER",
        "SOURCE_SSL_CRL",
        "SOURCE_SSL_CRLPATH",
        "SOURCE_SSL_KEY",
        "SOURCE_SSL_VERIFY_SERVER_CERT",
        "SOURCE_TLS_CIPHERSUITES",
        "SOURCE_TLS_VERSION",
        "SOURCE_USER",
        "SOURCE_ZSTD_COMPRESSION_LEVEL",
        "SPATIAL",
        "SPECIFIC",
        "SQL",
        "SQLEXCEPTION",
        "SQLSTATE",
        "SQLWARNING",
        "SQL_AFTER_GTIDS",
        "SQL_AFTER_MTS_GAPS",
        "SQL_BEFORE_GTIDS",
        "SQL_BIG_RESULT",
        "SQL_BUFFER_RESULT",
        "SQL_CACHE",
        "SQL_CALC_FOUND_ROWS",
        "SQL_NO_CACHE",
        "SQL_SMALL_RESULT",
        "SQL_THREAD",
        "SQL_TSI_DAY",
        "SQL_TSI_HOUR",
        "SQL_TSI_MINUTE",
        "SQL_TSI_MONTH",
        "SQL_TSI_QUARTER",
        "SQL_TSI_SECOND",
        "SQL_TSI_WEEK",
        "SQL_TSI_YEAR",
        "SRID",
        "SSL",
        "STACKED",
        "START",
        "STARTING",
        "STARTS",
        "STATS_AUTO_RECALC",
        "STATS_PERSISTENT",
        "STATS_SAMPLE_PAGES",
        "STATUS",
        "STOP",
        "STORAGE",
        "STORED",
        "STRAIGHT_JOIN",
        "STREAM",
        "STRING",
        "SUBCLASS_ORIGIN",
        "SUBJECT",
        "SUBPARTITION",
        "SUBPARTITIONS",
        "SUPER",
        "SUSPEND",
        "SWAPS",
        "SWITCHES",
        "SYSTEM",
        "TABLE",
        "TABLES",
        "TABLESPACE",
        "TABLE_CHECKSUM",
        "TABLE_NAME",
        "TEMPORARY",
        "TEMPTABLE",
        "TERMINATED",
        "TEXT",
        "THAN",
        "THEN",
        "THREAD_PRIORITY",
        "TIES",
        "TIME",
        "TIMESTAMP",
        "TIMESTAMPADD",
        "TIMESTAMPDIFF",
        "TINYBLOB",
        "TINYINT",
        "TINYTEXT",
        "TLS",
        "TO",
        "TRAILING",
        "TRANSACTION",
        "TRIGGER",
        "TRIGGERS",
        "TRUE",
        "TRUNCATE",
        "TYPE",
        "TYPES",
        "UNBOUNDED",
        "UNCOMMITTED",
        "UNDEFINED",
        "UNDO",
        "UNDOFILE",
        "UNDO_BUFFER_SIZE",
        "UNICODE",
        "UNINSTALL",
        "UNION",
        "UNIQUE",
        "UNKNOWN",
        "UNLOCK",
        "UNREGISTER",
        "UNSIGNED",
        "UNTIL",
        "UPDATE",
        "UPGRADE",
        "URL",
        "USAGE",
        "USE",
        "USER",
        "USER_RESOURCES",
        "USE_FRM",
        "USING",
        "UTC_DATE",
        "UTC_TIME",
        "UTC_TIMESTAMP",
        "VALIDATION",
        "VALUE",
        "VALUES",
        "VARBINARY",
        "VARCHAR",
        "VARCHARACTER",
        "VARIABLES",
        "VARYING",
        "VCPU",
        "VIEW",
        "VIRTUAL",
        "VISIBLE",
        "WAIT",
        "WARNINGS",
        "WEEK",
        "WEIGHT_STRING",
        "WHEN",
        "WHERE",
        "WHILE",
        "WINDOW",
        "WITH",
        "WITHOUT",
        "WORK",
        "WRAPPER",
        "WRITE",
        "X509",
        "XA",
        "XID",
        "XML",
        "XOR",
        "YEAR",
        "YEAR_MONTH",
        "ZEROFILL",
        "ZONE",
    ],
    "sqlserver": [ //copy from https://learn.microsoft.com/zh-cn/sql/t-sql/language-elements/reserved-keywords-transact-sql?view=sql-server-ver16
        "ADD",
        "EXTERNAL",
        "PROCEDURE",
        "ALL",
        "FETCH",
        "PUBLIC",
        "ALTER",
        "FILE",
        "RAISERROR",
        "AND",
        "FILLFACTOR",
        "READ",
        "ANY",
        "FOR",
        "READTEXT",
        "AS",
        "FOREIGN",
        "RECONFIGURE",
        "ASC",
        "FREETEXT",
        "REFERENCES",
        "AUTHORIZATION",
        "FREETEXTTABLE",
        "复制",
        "BACKUP",
        "FROM",
        "RESTORE",
        "BEGIN",
        "FULL",
        "RESTRICT",
        "BETWEEN",
        "FUNCTION",
        "RETURN",
        "BREAK",
        "GOTO",
        "REVERT",
        "BROWSE",
        "GRANT",
        "REVOKE",
        "BULK",
        "GROUP",
        "RIGHT",
        "BY",
        "HAVING",
        "ROLLBACK",
        "CASCADE",
        "HOLDLOCK",
        "ROWCOUNT",
        "CASE",
        "IDENTITY",
        "ROWGUIDCOL",
        "CHECK",
        "IDENTITY_INSERT",
        "RULE",
        "CHECKPOINT",
        "IDENTITYCOL",
        "SAVE",
        "CLOSE",
        "IF",
        "SCHEMA",
        "CLUSTERED",
        "IN",
        "SECURITYAUDIT",
        "COALESCE",
        "INDEX",
        "SELECT",
        "COLLATE",
        "INNER",
        "SEMANTICKEYPHRASETABLE",
        "COLUMN",
        "INSERT",
        "SEMANTICSIMILARITYDETAILSTABLE",
        "COMMIT",
        "INTERSECT",
        "SEMANTICSIMILARITYTABLE",
        "COMPUTE",
        "INTO",
        "SESSION_USER",
        "CONSTRAINT",
        "IS",
        "SET",
        "CONTAINS",
        "JOIN",
        "SETUSER",
        "CONTAINSTABLE",
        "KEY",
        "SHUTDOWN",
        "CONTINUE",
        "KILL",
        "SOME",
        "CONVERT",
        "LEFT",
        "STATISTICS",
        "CREATE",
        "LIKE",
        "SYSTEM_USER",
        "CROSS",
        "LINENO",
        "TABLE",
        "CURRENT",
        "LOAD",
        "TABLESAMPLE",
        "CURRENT_DATE",
        "MERGE",
        "TEXTSIZE",
        "CURRENT_TIME",
        "NATIONAL",
        "THEN",
        "CURRENT_TIMESTAMP",
        "NOCHECK",
        "TO",
        "CURRENT_USER",
        "NONCLUSTERED",
        "TOP",
        "CURSOR",
        "NOT",
        "TRAN",
        "DATABASE",
        "Null",
        "TRANSACTION",
        "DBCC",
        "NULLIF",
        "TRIGGER",
        "DEALLOCATE",
        "OF",
        "TRUNCATE",
        "DECLARE",
        "OFF",
        "TRY_CONVERT",
        "DEFAULT",
        "OFFSETS",
        "TSEQUAL",
        "DELETE",
        "ON",
        "UNION",
        "DENY",
        "OPEN",
        "UNIQUE",
        "DESC",
        "OPENDATASOURCE",
        "UNPIVOT",
        "DISK",
        "OPENQUERY",
        "UPDATE",
        "DISTINCT",
        "OPENROWSET",
        "UPDATETEXT",
        "DISTRIBUTED",
        "OPENXML",
        "USE",
        "DOUBLE",
        "OPTION",
        "USER",
        "DROP",
        "OR",
        "VALUES",
        "DUMP",
        "ORDER",
        "VARYING",
        "ELSE",
        "OUTER",
        "VIEW",
        "End",
        "OVER",
        "WAITFOR",
        "ERRLVL",
        "PERCENT",
        "WHEN",
        "ESCAPE",
        "PIVOT",
        "WHERE",
        "EXCEPT",
        "PLAN",
        "WHILE",
        "EXEC",
        "PRECISION",
        "WITH",
        "EXECUTE",
        "PRIMARY",
        "WITHIN GROUP",
        "EXISTS",
        "PRINT",
        "WRITETEXT",
        "EXIT",
        "PROC",
        "ABSOLUTE",
        "EXEC",
        "OVERLAPS",
        "ACTION",
        "EXECUTE",
        "PAD",
        "ADA",
        "EXISTS",
        "PARTIAL",
        "添加",
        "EXTERNAL",
        "PASCAL",
        "ALL",
        "EXTRACT",
        "POSITION",
        "ALLOCATE",
        "FALSE",
        "PRECISION",
        "ALTER",
        "FETCH",
        "PREPARE",
        "AND",
        "FIRST",
        "PRESERVE",
        "ANY",
        "FLOAT",
        "PRIMARY",
        "ARE",
        "FOR",
        "PRIOR",
        "AS",
        "FOREIGN",
        "PRIVILEGES",
        "ASC",
        "FORTRAN",
        "PROCEDURE",
        "ASSERTION",
        "FOUND",
        "PUBLIC",
        "AT",
        "FROM",
        "READ",
        "AUTHORIZATION",
        "FULL",
        "REAL",
        "AVG",
        "GET",
        "REFERENCES",
        "BEGIN",
        "GLOBAL",
        "RELATIVE",
        "BETWEEN",
        "GO",
        "RESTRICT",
        "BIT",
        "GOTO",
        "REVOKE",
        "BIT_LENGTH",
        "GRANT",
        "RIGHT",
        "BOTH",
        "GROUP",
        "ROLLBACK",
        "BY",
        "HAVING",
        "ROWS",
        "CASCADE",
        "HOUR",
        "SCHEMA",
        "CASCADED",
        "IDENTITY",
        "SCROLL",
        "CASE",
        "IMMEDIATE",
        "SECOND",
        "CAST",
        "IN",
        "SECTION",
        "CATALOG",
        "INCLUDE",
        "SELECT",
        "CHAR",
        "INDEX",
        "SESSION",
        "CHAR_LENGTH",
        "INDICATOR",
        "SESSION_USER",
        "CHARACTER",
        "INITIALLY",
        "SET",
        "CHARACTER_LENGTH",
        "INNER",
        "SIZE",
        "CHECK",
        "INPUT",
        "SMALLINT",
        "CLOSE",
        "INSENSITIVE",
        "SOME",
        "COALESCE",
        "INSERT",
        "SPACE",
        "COLLATE",
        "INT",
        "SQL",
        "COLLATION",
        "INTEGER",
        "SQLCA",
        "COLUMN",
        "INTERSECT",
        "SQLCODE",
        "COMMIT",
        "INTERVAL",
        "SQLERROR",
        "CONNECT",
        "INTO",
        "SQLSTATE",
        "CONNECTION",
        "IS",
        "SQLWARNING",
        "CONSTRAINT",
        "ISOLATION",
        "SUBSTRING",
        "CONSTRAINTS",
        "JOIN",
        "SUM",
        "CONTINUE",
        "KEY",
        "SYSTEM_USER",
        "CONVERT",
        "LANGUAGE",
        "TABLE",
        "CORRESPONDING",
        "LAST",
        "TEMPORARY",
        "COUNT",
        "LEADING",
        "THEN",
        "CREATE",
        "LEFT",
        "TIME",
        "CROSS",
        "LEVEL",
        "TIMESTAMP",
        "CURRENT",
        "LIKE",
        "TIMEZONE_HOUR",
        "CURRENT_DATE",
        "LOCAL",
        "TIMEZONE_MINUTE",
        "CURRENT_TIME",
        "LOWER",
        "TO",
        "CURRENT_TIMESTAMP",
        "MATCH",
        "TRAILING",
        "CURRENT_USER",
        "MAX",
        "TRANSACTION",
        "CURSOR",
        "MIN",
        "TRANSLATE",
        "DATE",
        "MINUTE",
        "TRANSLATION",
        "DAY",
        "MODULE",
        "TRIM",
        "DEALLOCATE",
        "MONTH",
        "TRUE",
        "DEC",
        "NAMES",
        "UNION",
        "DECIMAL",
        "NATIONAL",
        "UNIQUE",
        "DECLARE",
        "NATURAL",
        "未知",
        "DEFAULT",
        "NCHAR",
        "UPDATE",
        "DEFERRABLE",
        "NEXT",
        "UPPER",
        "DEFERRED",
        "NO",
        "USAGE",
        "DELETE",
        "NONE",
        "USER",
        "DESC",
        "NOT",
        "USING",
        "DESCRIBE",
        "NULL",
        "VALUE",
        "DESCRIPTOR",
        "NULLIF",
        "VALUES",
        "DIAGNOSTICS",
        "NUMERIC",
        "VARCHAR",
        "DISCONNECT",
        "OCTET_LENGTH",
        "VARYING",
        "DISTINCT",
        "OF",
        "VIEW",
        "DOMAIN",
        "ON",
        "WHEN",
        "DOUBLE",
        "ONLY",
        "WHENEVER",
        "DROP",
        "OPEN",
        "WHERE",
        "ELSE",
        "OPTION",
        "WITH",
        "END",
        "OR",
        "WORK",
        "END-EXEC",
        "ORDER",
        "WRITE",
        "ESCAPE",
        "OUTER",
        "YEAR",
        "EXCEPT",
        "OUTPUT",
        "ZONE",
        "EXCEPTION",
        "ABSOLUTE",
        "HOST",
        "RELATIVE",
        "ACTION",
        "HOUR",
        "RELEASE",
        "ADMIN",
        "IGNORE",
        "RESULT",
        "AFTER",
        "IMMEDIATE",
        "RETURNS",
        "AGGREGATE",
        "INDICATOR",
        "ROLE",
        "ALIAS",
        "INITIALIZE",
        "ROLLUP",
        "ALLOCATE",
        "INITIALLY",
        "ROUTINE",
        "ARE",
        "INOUT",
        "ROW",
        "ARRAY",
        "INPUT",
        "ROWS",
        "ASENSITIVE",
        "INT",
        "SAVEPOINT",
        "ASSERTION",
        "INTEGER",
        "SCROLL",
        "ASYMMETRIC",
        "INTERSECTION",
        "SCOPE",
        "AT",
        "INTERVAL",
        "SEARCH",
        "ATOMIC",
        "ISOLATION",
        "SECOND",
        "BEFORE",
        "ITERATE",
        "SECTION",
        "BINARY",
        "LANGUAGE",
        "SENSITIVE",
        "BIT",
        "LARGE",
        "SEQUENCE",
        "BLOB",
        "LAST",
        "SESSION",
        "BOOLEAN",
        "LATERAL",
        "SETS",
        "BOTH",
        "LEADING",
        "SIMILAR",
        "BREADTH",
        "LESS",
        "SIZE",
        "CALL",
        "LEVEL",
        "SMALLINT",
        "CALLED",
        "LIKE_REGEX",
        "SPACE",
        "CARDINALITY",
        "LIMIT",
        "SPECIFIC",
        "CASCADED",
        "LN",
        "SPECIFICTYPE",
        "CAST",
        "LOCAL",
        "SQL",
        "CATALOG",
        "LOCALTIME",
        "SQLEXCEPTION",
        "CHAR",
        "LOCALTIMESTAMP",
        "SQLSTATE",
        "CHARACTER",
        "LOCATOR",
        "SQLWARNING",
        "CLASS",
        "MAP",
        "START",
        "CLOB",
        "MATCH",
        "状态",
        "COLLATION",
        "MEMBER",
        "STATEMENT",
        "COLLECT",
        "METHOD",
        "STATIC",
        "COMPLETION",
        "MINUTE",
        "STDDEV_POP",
        "CONDITION",
        "MOD",
        "STDDEV_SAMP",
        "CONNECT",
        "MODIFIES",
        "STRUCTURE",
        "CONNECTION",
        "MODIFY",
        "SUBMULTISET",
        "CONSTRAINTS",
        "MODULE",
        "SUBSTRING_REGEX",
        "CONSTRUCTOR",
        "月",
        "SYMMETRIC",
        "CORR",
        "MULTISET",
        "SYSTEM",
        "CORRESPONDING",
        "NAMES",
        "TEMPORARY",
        "COVAR_POP",
        "NATURAL",
        "TERMINATE",
        "COVAR_SAMP",
        "NCHAR",
        "THAN",
        "CUBE",
        "NCLOB",
        "TIME",
        "CUME_DIST",
        "新增功能",
        "TIMESTAMP",
        "CURRENT_CATALOG",
        "NEXT",
        "TIMEZONE_HOUR",
        "CURRENT_DEFAULT_TRANSFORM_GROUP",
        "是",
        "TIMEZONE_MINUTE",
        "CURRENT_PATH",
        "无",
        "TRAILING",
        "CURRENT_ROLE",
        "NORMALIZE",
        "TRANSLATE_REGEX",
        "CURRENT_SCHEMA",
        "NUMERIC",
        "TRANSLATION",
        "CURRENT_TRANSFORM_GROUP_FOR_TYPE",
        "OBJECT",
        "TREAT",
        "CYCLE",
        "OCCURRENCES_REGEX",
        "true",
        "DATA",
        "OLD",
        "UESCAPE",
        "DATE",
        "ONLY",
        "UNDER",
        "DAY",
        "OPERATION",
        "UNKNOWN",
        "DEC",
        "ORDINALITY",
        "UNNEST",
        "DECIMAL",
        "OUT",
        "USAGE",
        "DEFERRABLE",
        "OVERLAY",
        "USING",
        "DEFERRED",
        "OUTPUT",
        "值",
        "DEPTH",
        "PAD",
        "VAR_POP",
        "DEREF",
        "参数",
        "VAR_SAMP",
        "DESCRIBE",
        "PARAMETERS",
        "VARCHAR",
        "DESCRIPTOR",
        "PARTIAL",
        "VARIABLE",
        "DESTROY",
        "PARTITION",
        "WHENEVER",
        "DESTRUCTOR",
        "PATH",
        "WIDTH_BUCKET",
        "DETERMINISTIC",
        "POSTFIX",
        "WITHOUT",
        "DICTIONARY",
        "PREFIX",
        "WINDOW",
        "DIAGNOSTICS",
        "PREORDER",
        "WITHIN",
        "DISCONNECT",
        "PREPARE",
        "WORK",
        "DOMAIN",
        "PERCENT_RANK",
        "WRITE",
        "DYNAMIC",
        "PERCENTILE_CONT",
        "XMLAGG",
        "EACH",
        "PERCENTILE_DISC",
        "XMLATTRIBUTES",
        "ELEMENT",
        "POSITION_REGEX",
        "XMLBINARY",
        "END-EXEC",
        "PRESERVE",
        "XMLCAST",
        "EQUALS",
        "PRIOR",
        "XMLCOMMENT",
        "EVERY",
        "PRIVILEGES",
        "XMLCONCAT",
        "EXCEPTION",
        "RANGE",
        "XMLDOCUMENT",
        "false",
        "READS",
        "XMLELEMENT",
        "FILTER",
        "REAL",
        "XMLEXISTS",
        "FIRST",
        "RECURSIVE",
        "XMLFOREST",
        "FLOAT",
        "REF",
        "XMLITERATE",
        "FOUND",
        "REFERENCING",
        "XMLNAMESPACES",
        "FREE",
        "REGR_AVGX",
        "XMLPARSE",
        "FULLTEXTTABLE",
        "REGR_AVGY",
        "XMLPI",
        "FUSION",
        "REGR_COUNT",
        "XMLQUERY",
        "GENERAL",
        "REGR_INTERCEPT",
        "XMLSERIALIZE",
        "GET",
        "REGR_R2",
        "XMLTABLE",
        "GLOBAL",
        "REGR_SLOPE",
        "XMLTEXT",
        "GO",
        "REGR_SXX",
        "XMLVALIDATE",
        "GROUPING",
        "REGR_SXY",
        "年",
        "HOLD",
        "REGR_SYY",
        "ZONE",
    ],
    "psql": [ //copy from https://www.postgresql.org/docs/16/sql-keywords-appendix.html
        "ALL",
        "ANALYSE",
        "ANALYZE",
        "AND",
        "ANY",
        "ARRAY",
        "AS",
        "ASC",
        "ASYMMETRIC",
        "AUTHORIZATION",
        "BINARY",
        "BOTH",
        "CASE",
        "CAST",
        "CHECK",
        "COLLATE",
        "COLLATION",
        "COLUMN",
        "CONCURRENTLY",
        "CONSTRAINT",
        "CREATE",
        "CROSS",
        "CURRENT_CATALOG",
        "CURRENT_DATE",
        "CURRENT_ROLE",
        "CURRENT_SCHEMA",
        "CURRENT_TIME",
        "CURRENT_TIMESTAMP",
        "CURRENT_USER",
        "DEFAULT",
        "DEFERRABLE",
        "DESC",
        "DISTINCT",
        "DO",
        "ELSE",
        "END",
        "EXCEPT",
        "FALSE",
        "FETCH",
        "FOR",
        "FOREIGN",
        "FREEZE",
        "FROM",
        "FULL",
        "GRANT",
        "GROUP",
        "HAVING",
        "ILIKE",
        "IN",
        "INITIALLY",
        "INNER",
        "INTERSECT",
        "INTO",
        "IS",
        "ISNULL",
        "JOIN",
        "LATERAL",
        "LEADING",
        "LEFT",
        "LIKE",
        "LIMIT",
        "LOCALTIME",
        "LOCALTIMESTAMP",
        "NATURAL",
        "NOT",
        "NOTNULL",
        "NULL",
        "OFFSET",
        "ON",
        "ONLY",
        "OR",
        "ORDER",
        "OUTER",
        "OVER",
        "OVERLAPS",
        "PLACING",
        "PRIMARY",
        "REFERENCES",
        "RETURNING",
        "RIGHT",
        "SELECT",
        "SESSION_USER",
        "SIMILAR",
        "SOME",
        "SYMMETRIC",
        "TABLE",
        "THEN",
        "TO",
        "TRAILING",
        "TRUE",
        "UNION",
        "UNIQUE",
        "USER",
        "USING",
        "VARIADIC",
        "VERBOSE",
        "WHEN",
        "WHERE",
        "WINDOW",
        "WITH",
    ],
};