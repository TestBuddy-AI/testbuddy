CREATE TABLE UnitTestFile
(
    id INT PRIMARY KEY IDENTITY(1,1),
    fileName NVARCHAR(255) NOT NULL,
    sessionId NVARCHAR(255) NOT NULL,
    fileLang NVARCHAR(255) NULL,
    imports NVARCHAR(MAX) NULL,
    importsHash NVARCHAR(MAX) NULL
);

CREATE TABLE UnitTestFunction
(
    id INT PRIMARY KEY IDENTITY(1,1),
    hash NVARCHAR(MAX) NOT NULL,
    code NVARCHAR(MAX) NOT NULL,
    unitTests NVARCHAR(MAX) NOT NULL,
    unitTestFileId INT,
    FOREIGN KEY (unitTestFileId) REFERENCES UnitTestFile(id) ON DELETE CASCADE
);

DROP TABLE UnitTestFunction;
DROP TABLE UnitTestFile;


ALTER TABLE UnitTestFile 
ADD importsHash VARCHAR(MAX) NOT NULL;




