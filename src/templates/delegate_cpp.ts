export const templateDelegateCpp = `/********************************************************************************
** This file is auto generated by vscode-qtdao.
** Don't modify this file!
********************************************************************************/
#include "$DelegateHeader$"
$EntityHeaders$
#include "dao.h"

QTDAO_USING_NAMESPACE

namespace Dao$SqlType$ {
    void $SqlType$EntityDelegate::createEntityTables() {
$TableCreate$
    }

    void $SqlType$EntityDelegate::entityTablesUpgrade(int oldVer, int newVer) {
$TableUpgrade$
    }

    const int entity$SqlType$DelegateId = qRegisterMetaType<$SqlType$EntityDelegate*>();
}

`;