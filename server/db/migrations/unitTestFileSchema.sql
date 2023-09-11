CREATE TABLE UnitTestFile
(
    id INT PRIMARY KEY IDENTITY(1,1),
    fileName NVARCHAR(255) NOT NULL,
    sessionId NVARCHAR(255) NOT NULL
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

DROP TABLE UnitTestFile;
DROP TABLE UnitTestFunction;




