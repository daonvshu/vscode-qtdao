const serializableTypes = { //copy from https://doc.qt.io/qt-5/datastreamformat.html
    "baseType": [
        "bool",
        "qint8",
        "qint16",
        "qint32",
        "qint64",
        "quint8",
        "quint16",
        "quint32",
        "quint64",
        "float",
        "double",
        //"const char*",
        "QByteArray",
        "QString",
        "QVariant",
    ],
    "supportType": [
        "QBitArray",
        "QBrush",
        "QColor",
        "QCursor",
        "QDate",
        "QDateTime",
        "QEasingCurve",
        "QFont",
        "QGenericMatrix",
        "QIcon",
        "QImage",
        "QKeySequence",
        "QMargins",
        "QMatrix4x4",
        "QPalette",
        "QPen",
        "QPicture",
        "QPixmap",
        "QPoint",
        "QQuaternion",
        "QRect",
        "QRegExp",
        "QRegularExpression",
        "QRegion",
        "QSize",
        "QTime",
        "QTransform",
        "QUrl",
        "QVector2D",
        "QVector3D",
        "QVector4D",
    ],
    "collectionType1": [
        "QLinkedList",
        "QList",
        "QVector",
    ],
    "collectionType2": [
        "QHash",
        "QMap",
        "QPair",
    ],
};

export function findSerializableTypeHeaderName(type: string): string[] {
    if (serializableTypes["baseType"].contains(type)) {
        return [];
    }
    if (serializableTypes["supportType"].contains(type)) {
        return [type];
    }
    //handle collection type
    for (let e of serializableTypes["collectionType1"]) {
        if (type.startsWith(e)) {
            let left = type.indexOf("<");
            let right = type.indexOf(">");
            let subType = type.substring(left + 1, right);
            return [e].concat(findSerializableTypeHeaderName(subType));
        }
    }

    for (let e of serializableTypes["collectionType2"]) {
        if (type.startsWith(e)) {
            let left = type.indexOf("<");
            let right = type.lastIndexOf(">");
            let subType = type.substring(left + 1, right).trim();
            
            let mk = 0;
            let i = 0;
            for (let c of subType) {
                if (c === '<') {
                    mk++;
                } else if (c === '>') {
                    mk--;
                } else if (c === ',') {
                    if (mk === 0) {
                        break;
                    }
                }
                i++;
            }
            return [e]
                .concat(findSerializableTypeHeaderName(subType.substring(0, i).trim()))
                .concat(findSerializableTypeHeaderName(subType.substring(i + 1).trim()))
                ;
        }
    }

    return [`${type.toLowerCase()}.h`];
}