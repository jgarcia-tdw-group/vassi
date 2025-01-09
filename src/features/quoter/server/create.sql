BEGIN TRY BEGIN TRANSACTION;

-- Create schema if it doesn't exist
IF NOT EXISTS (
    SELECT
        *
    FROM
        sys.schemas
    WHERE
        name = 'quoter'
) BEGIN EXEC ('CREATE SCHEMA quoter');

END;

-- Drop tables if they exist
DROP TABLE IF EXISTS quoter.quotes;

DROP TABLE IF EXISTS quoter.productsCvrPrices;

DROP TABLE IF EXISTS quoter.productsMaterialPrices;

DROP TABLE IF EXISTS quoter.productsCtnPrices;

DROP TABLE IF EXISTS quoter.products;

DROP TABLE IF EXISTS quoter.printPrices;

DROP TABLE IF EXISTS quoter.printColors;

DROP TABLE IF EXISTS quoter.styles;

DROP TABLE IF EXISTS quoter.materials;

DROP TABLE IF EXISTS quoter.materialFamilies;

DROP TABLE IF EXISTS quoter.uom;

-- Table: uom
CREATE TABLE
    quoter.uom (
        id INT IDENTITY (1, 1) PRIMARY KEY,
        code NVARCHAR (50) UNIQUE NOT NULL,
        description NVARCHAR (255) NOT NULL,
        numberOfPieces INT NOT NULL
    );

-- Table: materialFamilies
CREATE TABLE
    quoter.materialFamilies (
        id INT IDENTITY (1, 1) PRIMARY KEY,
        code NVARCHAR (50) UNIQUE NOT NULL,
        category NVARCHAR (255) NOT NULL
    );

-- Table: materials
CREATE TABLE
    quoter.materials (
        id INT IDENTITY (1, 1) PRIMARY KEY,
        code NVARCHAR (50) UNIQUE NOT NULL,
        description NVARCHAR (255) NOT NULL,
        standardPackaging BIT NOT NULL,
        cartonSuitable BIT NOT NULL,
        family NVARCHAR (50) NOT NULL, -- Changed to NVARCHAR to match code type
        CONSTRAINT FK_Materials_MaterialFamily FOREIGN KEY (family) REFERENCES quoter.materialFamilies (code)
    );

-- Table: styles
CREATE TABLE
    quoter.styles (
        id INT IDENTITY (1, 1) PRIMARY KEY,
        code NVARCHAR (50) UNIQUE NOT NULL,
        description NVARCHAR (255) NOT NULL
    );

-- Table: printColors
CREATE TABLE
    quoter.printColors (
        id INT IDENTITY (1, 1) PRIMARY KEY,
        code NVARCHAR (50) UNIQUE NOT NULL,
        description NVARCHAR (255) NOT NULL,
        price FLOAT NOT NULL
    );

-- Table: products
CREATE TABLE
    quoter.products (
        id INT IDENTITY (1, 1) PRIMARY KEY,
        code NVARCHAR (50) UNIQUE NOT NULL,
        description NVARCHAR (255) NOT NULL,
        uom NVARCHAR (50) NOT NULL, -- Changed to NVARCHAR to match code type
        minOrder INT NOT NULL,
        ctnAvailable BIT NOT NULL,
        cvrAvailable BIT NOT NULL,
        btpAvailable BIT NOT NULL,
        tcsAvailable BIT NOT NULL,
        ctnUpCharge FLOAT NOT NULL,
        CONSTRAINT FK_Products_UoM FOREIGN KEY (uom) REFERENCES quoter.uom (code)
    );

-- Table: productsCtnPrices
CREATE TABLE
    quoter.productsCtnPrices (
        id INT IDENTITY (1, 1) PRIMARY KEY,
        productCode NVARCHAR (50) NOT NULL, -- Changed to NVARCHAR to match code type
        materialFamilyCode NVARCHAR (50) NOT NULL, -- Changed to NVARCHAR to match code type
        styleCode NVARCHAR (50) NOT NULL, -- Changed to NVARCHAR to match code type
        price FLOAT NOT NULL,
        CONSTRAINT FK_ProductsCtnPrices_ProductCode FOREIGN KEY (productCode) REFERENCES quoter.products (code),
        CONSTRAINT FK_ProductsCtnPrices_materialFamilyCode FOREIGN KEY (materialFamilyCode) REFERENCES quoter.materialFamilies (code),
        CONSTRAINT FK_ProductsCtnPrices_StyleCode FOREIGN KEY (styleCode) REFERENCES quoter.styles (code)
    );

-- Table: productsMaterialPrices
CREATE TABLE
    quoter.productsMaterialPrices (
        id INT IDENTITY (1, 1) PRIMARY KEY,
        productCode NVARCHAR (50) NOT NULL,
        materialFamilyCode NVARCHAR (50) NOT NULL,
        btpPrice FLOAT NOT NULL,
        tcsPrice FLOAT NOT NULL,
        CONSTRAINT FK_ProductsMaterialPrices_ProductCode FOREIGN KEY (productCode) REFERENCES quoter.products (code),
        CONSTRAINT FK_ProductsMaterialPrices_materialFamilyCode FOREIGN KEY (materialFamilyCode) REFERENCES quoter.materialFamilies (code)
    );

-- Table: productsCvrPrices
CREATE TABLE
    quoter.productsCvrPrices (
        id INT IDENTITY (1, 1) PRIMARY KEY,
        productCode NVARCHAR (50) NOT NULL, -- Changed to NVARCHAR to match code type
        materialFamilyCode NVARCHAR (50) NOT NULL, -- Changed to NVARCHAR to match code type
        price FLOAT NOT NULL,
        CONSTRAINT FK_ProductsCvrPrices_ProductCode FOREIGN KEY (productCode) REFERENCES quoter.products (code),
        CONSTRAINT FK_ProductsCvrPrices_materialFamilyCode FOREIGN KEY (materialFamilyCode) REFERENCES quoter.materialFamilies (code)
    );

-- Table: printPrices
CREATE TABLE
    quoter.printPrices (
        id INT IDENTITY (1, 1) PRIMARY KEY,
        category NVARCHAR (255) UNIQUE NOT NULL,
        price FLOAT NOT NULL
    );

-- Table: quotes
CREATE TABLE
    quoter.quotes (
        id INT IDENTITY (1, 1) PRIMARY KEY,
        quantity INT NOT NULL,
        productCode NVARCHAR (50) NOT NULL,
        ctnMaterialCode NVARCHAR (50) NOT NULL,
        ctnStyleCode NVARCHAR (50) NOT NULL,
        btpMaterialCode NVARCHAR (50) NOT NULL,
        tcsMaterialCode NVARCHAR (50) NOT NULL,
        cvrMaterialCode NVARCHAR (50) NOT NULL,
        itemPrintCode NVARCHAR (50) NOT NULL,
        cartonPrintCode NVARCHAR (50) NOT NULL,
        CONSTRAINT FK_Quotes_ProductCode FOREIGN KEY (productCode) REFERENCES quoter.products (code),
        CONSTRAINT FK_Quotes_CtnMaterialCode FOREIGN KEY (ctnMaterialCode) REFERENCES quoter.materials (code),
        CONSTRAINT FK_Quotes_CtnStyleCode FOREIGN KEY (ctnStyleCode) REFERENCES quoter.styles (code),
        CONSTRAINT FK_Quotes_BtpMaterialCode FOREIGN KEY (btpMaterialCode) REFERENCES quoter.materials (code),
        CONSTRAINT FK_Quotes_TcsMaterialCode FOREIGN KEY (tcsMaterialCode) REFERENCES quoter.materials (code),
        CONSTRAINT FK_Quotes_CvrMaterialCode FOREIGN KEY (cvrMaterialCode) REFERENCES quoter.materials (code),
        CONSTRAINT FK_Quotes_ItemPrintCode FOREIGN KEY (itemPrintCode) REFERENCES quoter.printColors (code),
        CONSTRAINT FK_Quotes_CartonPrintCode FOREIGN KEY (cartonPrintCode) REFERENCES quoter.printColors (code)
    );

COMMIT TRANSACTION;

PRINT 'All tables created successfully in the quoter schema.';

END TRY BEGIN CATCH ROLLBACK TRANSACTION;

PRINT 'An error occurred. All changes have been rolled back.';

PRINT 'Error Message: ' + ERROR_MESSAGE ();

END CATCH;