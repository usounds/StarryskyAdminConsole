DROP TABLE IF EXISTS conditions;
CREATE TABLE IF NOT EXISTS conditions (
    serverUrl TEXT NOT NULL,
    key TEXT NOT NULL,
    recordName TEXT,
    query TEXT,
    inputRegex TEXT,
    invertRegex TEXT,
    refresh number,
    lang TEXT,
    labelDisable TEXT,
    replyDisable TEXT,
    imageOnly TEXT,
    includeAltText TEXT,
    initPost number,
    pinnedPost TEXT,
    feedName TEXT,
    feedDescription TEXT,
    feedAvatar TEXT,
    limitCount number,
    privateFeed TEXT,
    PRIMARY KEY(serverUrl,key)
    );
