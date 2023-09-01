CREATE TABLE UnitTestFiles
(
    id INT PRIMARY KEY IDENTITY(1,1),
    fileName NVARCHAR(255) NOT NULL,
    fileHash NVARCHAR(255) NOT NULL,
    sessionId NVARCHAR(255) NOT NULL,
    unitTests NVARCHAR(MAX) NOT NULL,
    prompt_tokens INT,
    completion_tokens INT,
    requestTime INT,
    fileLang NVARCHAR(50)
);
