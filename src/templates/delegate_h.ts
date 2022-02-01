export const templateDelegateHpp = `#pragma once

#include <qobject.h>

namespace Dao$SqlType$ {
    class $SqlType$EntityDelegate : public QObject {
        Q_OBJECT

    public:
        Q_INVOKABLE explicit $SqlType$EntityDelegate() {}

        Q_INVOKABLE void createEntityTables();

        Q_INVOKABLE void entityTablesUpgrade();
    };
}
Q_DECLARE_METATYPE(Dao$SqlType$::$SqlType$EntityDelegate*);`;