export const templateSqlite = `/*This file is auto generated by vscode-qtdao*/
#pragma once

#include <qobject.h>
#include <qvariant.h>
#include <qdatetime.h>
#include <qjsonobject.h>

#include "condition/entityfield.h"

class $ClassName$ {
    $PropertyDeclare$
private:
$Members$
    QVariantMap __extra;

public:$Construct$

public:
    class Fields {
    public:$FieldDeclare$

    protected:
        void reset(const QString& tbName) {$FieldDeclareReset$
        }
    };

    struct Info {
        enum {
            Attach = 1
        };

        static int fieldSize() {
            return $FieldSize$;
        }

        static QString getTableName() {
            return QStringLiteral("$TbName$");
        }

        static QString getSourceName() {
            return getTableName();
        }

        static QStringList getFields() {
            return QStringList()$Fields$;
        }

        static QStringList getFieldsWithoutAutoIncrement() {
            return QStringList()$FieldsWithoutAuto$;
        }

        static QStringList getFieldsType() {
            return QStringList() $FieldType$;
        }

        static QStringList getPrimaryKeys() {
            return QStringList()$PrimaryKey$;
        }

        static QList<QStringList> getIndexFields() {
            return QList<QStringList>()$FieldIndex$;
        }

        static QList<QStringList> getUniqueIndexFields() {
            return QList<QStringList>()$UniqueFieldIndex$;
        }

        static bool isAutoIncrement(const QString& name) {
            $CheckNameIncrement$;
        }
    };

    struct Tool {
        static QVariantList getValueWithoutAutoIncrement(const $ClassName$& entity) {
            $ValuesWithAuto$;
        }

        static QVariant getValueByName(const $ClassName$& entity, const QString& target) {
            $GetValueByName$
        }

        static void bindAutoIncrementId($ClassName$& entity, const QVariant& id) {
            $BindAutoIncrementId$
        }

        static void bindValue($ClassName$& entity, const QString& target, QVariant value) {
            $BindValues$
        }

        static $ClassName$ fromJson(const QJsonObject& object) {
            $ClassName$ entity;$JsonToEntity$
            return entity;
        }

        static QJsonObject toJson(const $ClassName$& entity, QStringList excludeKeys = QStringList()) {
            QJsonObject object;$EntityToJson$

            for (const auto& key : excludeKeys) {
                object.remove(key);
            }
            return object;
        }
    };

    bool operator==(const $ClassName$& other) const {
        return $OperatorEqual$;
    }

public:$MemberGetterSetter$
    //set temp data
    inline void __putExtra(const QString& key, const QVariant& extra) {this->__extra.insert(key, extra);}
    //get function select result, like get "as" field result
    inline QVariant __getExtra(const QString& key) const {return __extra.value(key);}
};
typedef QList<$ClassName$> $ClassName$List;
$DECLARE_META_TYPE$`;