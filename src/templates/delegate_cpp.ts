export const templateDelegateCpp = `#include "$SqlType$EntityInclude.h"
$EntityHeaders$
#include "DbLoader.h"
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