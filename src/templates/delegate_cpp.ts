export const templateDelegateCpp = `#include "$DelegateHeader$"
$EntityHeaders$
#include "dbloader.h"

QTDAO_USING_NAMESPACE

namespace Dao$SqlType$ {
    void $SqlType$EntityDelegate::createEntityTables() {
        DbLoader::getClient().createTables<$SqlClientType$, $EntityList$>();
    }

    void $SqlType$EntityDelegate::entityTablesUpgrade() {
        DbLoader::getClient().tablesUpgrade<$SqlClientType$, $EntityList$>();
    }

    const int entity$SqlType$DelegateId = qRegisterMetaType<$SqlType$EntityDelegate*>();
}

`;