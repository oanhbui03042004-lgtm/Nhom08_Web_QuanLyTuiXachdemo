/* ============================================================================
   BAGSTORE DATABASE - FINAL VERSION
   SQL Server 2022 / SSMS
   Purpose: E-commerce website for bags, wallets and fashion accessories
   ============================================================================ */

IF DB_ID('BagStoreDB') IS NOT NULL
BEGIN
    ALTER DATABASE BagStoreDB SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE BagStoreDB;
END
GO

CREATE DATABASE BagStoreDB;
GO
USE BagStoreDB;
GO

/* ============================================================================
   1. ROLE / MEMBERSHIP / ACCOUNT
   ============================================================================ */
CREATE TABLE ROLE (
    RoleID INT IDENTITY(1,1) PRIMARY KEY,
    RoleName NVARCHAR(50) NOT NULL,
    Description NVARCHAR(255) NULL,
    CONSTRAINT UQ_ROLE_Name UNIQUE(RoleName)
);
GO

INSERT INTO ROLE(RoleName, Description) VALUES
(N'Admin', N'Quản trị toàn hệ thống'),
(N'Manager', N'Quản lý cửa hàng và vận hành'),
(N'Staff', N'Nhân viên bán hàng và xử lý đơn'),
(N'Customer', N'Khách hàng mua sắm');
GO

CREATE TABLE MEMBERSHIP_RANK (
    RankID INT IDENTITY(1,1) PRIMARY KEY,
    RankName NVARCHAR(50) NOT NULL,
    MinPoints INT NOT NULL DEFAULT 0,
    DiscountPercent DECIMAL(5,2) NOT NULL DEFAULT 0,
    CONSTRAINT UQ_RANK_Name UNIQUE(RankName),
    CONSTRAINT CK_RANK_MinPoints CHECK(MinPoints >= 0),
    CONSTRAINT CK_RANK_Discount CHECK(DiscountPercent BETWEEN 0 AND 100)
);
GO

INSERT INTO MEMBERSHIP_RANK(RankName, MinPoints, DiscountPercent) VALUES
(N'Thành viên mới (Bronze)', 0, 0),
(N'Bạc (Silver)', 1000, 2),
(N'Vàng (Gold)', 5000, 5),
(N'Kim cương (Diamond)', 15000, 10);
GO

CREATE TABLE ACCOUNT (
    AccountID INT IDENTITY(1,1) PRIMARY KEY,
    FullName NVARCHAR(100) NOT NULL,
    Email NVARCHAR(150) NOT NULL,
    PasswordHash NVARCHAR(255) NOT NULL,
    Phone VARCHAR(20) NULL,
    Address NVARCHAR(255) NULL,
    Avatar NVARCHAR(500) NULL,
    Gender NVARCHAR(10) NULL,
    DateOfBirth DATE NULL,
    RoleID INT NOT NULL,
    RankID INT NULL,
    LoyaltyPoints INT NOT NULL DEFAULT 0,
    TotalSpent DECIMAL(18,2) NOT NULL DEFAULT 0,
    Status NVARCHAR(20) NOT NULL DEFAULT N'ACTIVE',
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT UQ_ACCOUNT_Email UNIQUE(Email),
    CONSTRAINT FK_ACCOUNT_Role FOREIGN KEY(RoleID) REFERENCES ROLE(RoleID),
    CONSTRAINT FK_ACCOUNT_Rank FOREIGN KEY(RankID) REFERENCES MEMBERSHIP_RANK(RankID),
    CONSTRAINT CK_ACCOUNT_Status CHECK(Status IN(N'ACTIVE',N'LOCKED',N'INACTIVE')),
    CONSTRAINT CK_ACCOUNT_Gender CHECK(Gender IS NULL OR Gender IN(N'Nam',N'Nữ',N'Khác')),
    CONSTRAINT CK_ACCOUNT_LoyaltyPoints CHECK(LoyaltyPoints >= 0),
    CONSTRAINT CK_ACCOUNT_TotalSpent CHECK(TotalSpent >= 0)
);
GO
CREATE INDEX IX_ACCOUNT_RoleID ON ACCOUNT(RoleID);
CREATE INDEX IX_ACCOUNT_RankID ON ACCOUNT(RankID);
GO

/* ============================================================================
   2. CATEGORY
   ============================================================================ */
CREATE TABLE CATEGORY (
    CategoryID INT IDENTITY(1,1) PRIMARY KEY,
    CategoryName NVARCHAR(100) NOT NULL,
    ParentCategoryID INT NULL,
    Description NVARCHAR(255) NULL,
    Status NVARCHAR(20) NOT NULL DEFAULT N'ACTIVE',
    CONSTRAINT UQ_CATEGORY_Name UNIQUE(CategoryName),
    CONSTRAINT FK_CATEGORY_Parent FOREIGN KEY(ParentCategoryID) REFERENCES CATEGORY(CategoryID),
    CONSTRAINT CK_CATEGORY_Status CHECK(Status IN(N'ACTIVE',N'INACTIVE'))
);
GO

-- 5 nhóm chính + 12 danh mục con
INSERT INTO CATEGORY(CategoryName, ParentCategoryID, Description) VALUES
(N'Túi nữ', NULL, N'Các dòng túi thời trang dành cho nữ'),
(N'Túi nam', NULL, N'Túi thời trang và công sở dành cho nam'),
(N'Balo', NULL, N'Balo học tập, công sở và du lịch'),
(N'Ví - Clutch', NULL, N'Ví, clutch và túi cầm tay nhỏ'),
(N'Phụ kiện', NULL, N'Phụ kiện thời trang đi kèm');
GO

DECLARE @CatWomen INT = (SELECT CategoryID FROM CATEGORY WHERE CategoryName=N'Túi nữ');
DECLARE @CatMen INT = (SELECT CategoryID FROM CATEGORY WHERE CategoryName=N'Túi nam');
DECLARE @CatBackpack INT = (SELECT CategoryID FROM CATEGORY WHERE CategoryName=N'Balo');
DECLARE @CatWallet INT = (SELECT CategoryID FROM CATEGORY WHERE CategoryName=N'Ví - Clutch');
DECLARE @CatAccessory INT = (SELECT CategoryID FROM CATEGORY WHERE CategoryName=N'Phụ kiện');

INSERT INTO CATEGORY(CategoryName, ParentCategoryID, Description) VALUES
(N'Tote Bag', @CatWomen, N'Túi tote nữ'),
(N'Túi đeo chéo nữ', @CatWomen, N'Túi crossbody và shoulder bag nữ'),
(N'Túi công sở nữ', @CatWomen, N'Túi đi làm, đựng laptop'),
(N'Túi dự tiệc nữ', @CatWomen, N'Clutch và túi nhỏ dự tiệc'),
(N'Túi đeo chéo nam', @CatMen, N'Túi crossbody nam'),
(N'Túi công sở nam', @CatMen, N'Túi laptop và briefcase nam'),
(N'Balo laptop', @CatBackpack, N'Balo có ngăn laptop'),
(N'Balo du lịch', @CatBackpack, N'Balo du lịch và dã ngoại'),
(N'Ví nam', @CatWallet, N'Ví da và ví nam'),
(N'Ví nữ', @CatWallet, N'Ví nữ'),
(N'Clutch', @CatWallet, N'Clutch thời trang'),
(N'Phụ kiện túi', @CatAccessory, N'Phụ kiện chăm sóc và trang trí túi');
GO

/* ============================================================================
   3. PRODUCT / PRODUCT IMAGE
   ============================================================================ */
CREATE TABLE PRODUCT (
    ProductID INT IDENTITY(1,1) PRIMARY KEY,
    ProductCode VARCHAR(50) NOT NULL,
    ProductName NVARCHAR(200) NOT NULL,
    CategoryID INT NOT NULL,
    Brand NVARCHAR(100) NULL,
    Material NVARCHAR(100) NULL,
    Color NVARCHAR(50) NULL,
    Description NVARCHAR(MAX) NULL,
    Price DECIMAL(18,2) NOT NULL,
    DiscountPrice DECIMAL(18,2) NULL,
    StockQuantity INT NOT NULL DEFAULT 0,
    SoldQuantity INT NOT NULL DEFAULT 0,
    Status NVARCHAR(20) NOT NULL DEFAULT N'ACTIVE',
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT UQ_PRODUCT_Code UNIQUE(ProductCode),
    CONSTRAINT FK_PRODUCT_Category FOREIGN KEY(CategoryID) REFERENCES CATEGORY(CategoryID),
    CONSTRAINT CK_PRODUCT_Price CHECK(Price > 0),
    CONSTRAINT CK_PRODUCT_DiscountPrice CHECK(DiscountPrice IS NULL OR(DiscountPrice > 0 AND DiscountPrice <= Price)),
    CONSTRAINT CK_PRODUCT_Stock CHECK(StockQuantity >= 0),
    CONSTRAINT CK_PRODUCT_Sold CHECK(SoldQuantity >= 0),
    CONSTRAINT CK_PRODUCT_Status CHECK(Status IN(N'ACTIVE',N'INACTIVE',N'OUT_OF_STOCK'))
);
GO
CREATE INDEX IX_PRODUCT_CategoryID ON PRODUCT(CategoryID);
CREATE INDEX IX_PRODUCT_Name ON PRODUCT(ProductName);
CREATE INDEX IX_PRODUCT_Brand ON PRODUCT(Brand);
GO

CREATE TABLE PRODUCT_IMAGE (
    ImageID INT IDENTITY(1,1) PRIMARY KEY,
    ProductID INT NOT NULL,
    ImageURL NVARCHAR(500) NOT NULL,
    IsMain BIT NOT NULL DEFAULT 0,
    SortOrder INT NOT NULL DEFAULT 0,
    CONSTRAINT FK_PRODUCT_IMAGE_Product FOREIGN KEY(ProductID) REFERENCES PRODUCT(ProductID) ON DELETE CASCADE,
    CONSTRAINT CK_PRODUCT_IMAGE_SortOrder CHECK(SortOrder >= 0)
);
GO
CREATE INDEX IX_PRODUCT_IMAGE_ProductID ON PRODUCT_IMAGE(ProductID);
-- Chỉ một ảnh chính cho mỗi sản phẩm.
CREATE UNIQUE INDEX UX_PRODUCT_IMAGE_Main ON PRODUCT_IMAGE(ProductID) WHERE IsMain=1;
GO

/* ============================================================================
   4. VOUCHER
   ============================================================================ */
CREATE TABLE VOUCHER (
    VoucherID INT IDENTITY(1,1) PRIMARY KEY,
    VoucherCode VARCHAR(50) NOT NULL,
    VoucherName NVARCHAR(200) NULL,
    DiscountType NVARCHAR(20) NOT NULL,
    DiscountValue DECIMAL(18,2) NOT NULL,
    MaxDiscountAmount DECIMAL(18,2) NULL,
    MinOrderValue DECIMAL(18,2) NOT NULL DEFAULT 0,
    QuantityAvailable INT NOT NULL DEFAULT 0,
    UsedCount INT NOT NULL DEFAULT 0,
    StartDate DATETIME2 NOT NULL,
    EndDate DATETIME2 NOT NULL,
    Status NVARCHAR(20) NOT NULL DEFAULT N'ACTIVE',
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT UQ_VOUCHER_Code UNIQUE(VoucherCode),
    CONSTRAINT CK_VOUCHER_Type CHECK(DiscountType IN(N'PERCENT',N'FIXED')),
    CONSTRAINT CK_VOUCHER_Value CHECK((DiscountType=N'PERCENT' AND DiscountValue>0 AND DiscountValue<=100) OR(DiscountType=N'FIXED' AND DiscountValue>0)),
    CONSTRAINT CK_VOUCHER_MaxDiscount CHECK(MaxDiscountAmount IS NULL OR MaxDiscountAmount>=0),
    CONSTRAINT CK_VOUCHER_MinOrder CHECK(MinOrderValue>=0),
    CONSTRAINT CK_VOUCHER_Quantity CHECK(QuantityAvailable>=0 AND UsedCount>=0 AND UsedCount<=QuantityAvailable),
    CONSTRAINT CK_VOUCHER_Date CHECK(EndDate>StartDate),
    CONSTRAINT CK_VOUCHER_Status CHECK(Status IN(N'ACTIVE',N'INACTIVE',N'EXPIRED'))
);
GO
CREATE INDEX IX_VOUCHER_Code ON VOUCHER(VoucherCode);
GO

/* Optional voucher scope: apply to selected products/categories */
CREATE TABLE VOUCHER_PRODUCT (
    VoucherID INT NOT NULL,
    ProductID INT NOT NULL,
    PRIMARY KEY(VoucherID, ProductID),
    CONSTRAINT FK_VOUCHER_PRODUCT_Voucher FOREIGN KEY(VoucherID) REFERENCES VOUCHER(VoucherID) ON DELETE CASCADE,
    CONSTRAINT FK_VOUCHER_PRODUCT_Product FOREIGN KEY(ProductID) REFERENCES PRODUCT(ProductID) ON DELETE CASCADE
);
GO

CREATE TABLE VOUCHER_CATEGORY (
    VoucherID INT NOT NULL,
    CategoryID INT NOT NULL,
    PRIMARY KEY(VoucherID, CategoryID),
    CONSTRAINT FK_VOUCHER_CATEGORY_Voucher FOREIGN KEY(VoucherID) REFERENCES VOUCHER(VoucherID) ON DELETE CASCADE,
    CONSTRAINT FK_VOUCHER_CATEGORY_Category FOREIGN KEY(CategoryID) REFERENCES CATEGORY(CategoryID) ON DELETE CASCADE
);
GO

/* ============================================================================
   5. CART
   ============================================================================ */
CREATE TABLE CART (
    CartID INT IDENTITY(1,1) PRIMARY KEY,
    AccountID INT NOT NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT UQ_CART_Account UNIQUE(AccountID),
    CONSTRAINT FK_CART_Account FOREIGN KEY(AccountID) REFERENCES ACCOUNT(AccountID) ON DELETE CASCADE
);
GO

CREATE TABLE CART_ITEM (
    CartItemID INT IDENTITY(1,1) PRIMARY KEY,
    CartID INT NOT NULL,
    ProductID INT NOT NULL,
    Quantity INT NOT NULL DEFAULT 1,
    AddedAt DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT UQ_CART_ITEM UNIQUE(CartID, ProductID),
    CONSTRAINT FK_CART_ITEM_Cart FOREIGN KEY(CartID) REFERENCES CART(CartID) ON DELETE CASCADE,
    CONSTRAINT FK_CART_ITEM_Product FOREIGN KEY(ProductID) REFERENCES PRODUCT(ProductID),
    CONSTRAINT CK_CART_ITEM_Quantity CHECK(Quantity>0)
);
GO
CREATE INDEX IX_CART_ITEM_ProductID ON CART_ITEM(ProductID);
GO

/* ============================================================================
   6. ORDERS / ORDER_DETAIL / PAYMENT
   ============================================================================ */
CREATE TABLE ORDERS (
    OrderID INT IDENTITY(1,1) PRIMARY KEY,
    OrderCode VARCHAR(30) NOT NULL,
    AccountID INT NOT NULL,
    StaffID INT NULL,
    VoucherID INT NULL,
    OrderDate DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    Status NVARCHAR(20) NOT NULL DEFAULT N'PENDING',
    ReceiverName NVARCHAR(100) NOT NULL,
    ReceiverPhone VARCHAR(20) NOT NULL,
    ShippingAddress NVARCHAR(255) NOT NULL,
    ShippingFee DECIMAL(18,2) NOT NULL DEFAULT 0,
    SubTotal DECIMAL(18,2) NOT NULL DEFAULT 0,
    DiscountAmount DECIMAL(18,2) NOT NULL DEFAULT 0,
    TotalAmount DECIMAL(18,2) NOT NULL DEFAULT 0,
    PaymentMethod NVARCHAR(30) NOT NULL DEFAULT N'COD',
    Note NVARCHAR(500) NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT UQ_ORDERS_Code UNIQUE(OrderCode),
    CONSTRAINT UQ_ORDERS_Order_Account UNIQUE(OrderID, AccountID),
    CONSTRAINT FK_ORDERS_Account FOREIGN KEY(AccountID) REFERENCES ACCOUNT(AccountID),
    CONSTRAINT FK_ORDERS_Staff FOREIGN KEY(StaffID) REFERENCES ACCOUNT(AccountID),
    CONSTRAINT FK_ORDERS_Voucher FOREIGN KEY(VoucherID) REFERENCES VOUCHER(VoucherID),
    CONSTRAINT CK_ORDERS_Status CHECK(Status IN(N'PENDING',N'CONFIRMED',N'SHIPPING',N'DONE',N'CANCELLED',N'RETURNING')),
    CONSTRAINT CK_ORDERS_PaymentMethod CHECK(PaymentMethod IN(N'COD',N'BANK_TRANSFER',N'QR_CODE',N'CREDIT_CARD',N'E_WALLET')),
    CONSTRAINT CK_ORDERS_Amounts CHECK(SubTotal>=0 AND DiscountAmount>=0 AND ShippingFee>=0 AND TotalAmount>=0 AND DiscountAmount<=SubTotal),
    CONSTRAINT CK_ORDERS_Total CHECK(TotalAmount = SubTotal - DiscountAmount + ShippingFee)
);
GO
CREATE INDEX IX_ORDERS_AccountID ON ORDERS(AccountID);
CREATE INDEX IX_ORDERS_StaffID ON ORDERS(StaffID);
CREATE INDEX IX_ORDERS_VoucherID ON ORDERS(VoucherID);
CREATE INDEX IX_ORDERS_Status ON ORDERS(Status);
CREATE INDEX IX_ORDERS_OrderDate ON ORDERS(OrderDate);
GO

CREATE TABLE ORDER_DETAIL (
    OrderDetailID INT IDENTITY(1,1) PRIMARY KEY,
    OrderID INT NOT NULL,
    ProductID INT NOT NULL,
    Quantity INT NOT NULL,
    UnitPrice DECIMAL(18,2) NOT NULL,
    Subtotal AS(Quantity*UnitPrice) PERSISTED,
    CONSTRAINT UQ_ORDER_DETAIL_Order_Product UNIQUE(OrderID, ProductID),
    CONSTRAINT UQ_ORDER_DETAIL_ID_ORDER_PRODUCT UNIQUE(OrderDetailID, OrderID, ProductID),
    CONSTRAINT FK_ORDER_DETAIL_Order FOREIGN KEY(OrderID) REFERENCES ORDERS(OrderID) ON DELETE CASCADE,
    CONSTRAINT FK_ORDER_DETAIL_Product FOREIGN KEY(ProductID) REFERENCES PRODUCT(ProductID),
    CONSTRAINT CK_ORDER_DETAIL_Quantity CHECK(Quantity>0),
    CONSTRAINT CK_ORDER_DETAIL_Price CHECK(UnitPrice>0)
);
GO
CREATE INDEX IX_ORDER_DETAIL_OrderID ON ORDER_DETAIL(OrderID);
CREATE INDEX IX_ORDER_DETAIL_ProductID ON ORDER_DETAIL(ProductID);
GO

CREATE TABLE PAYMENT (
    PaymentID INT IDENTITY(1,1) PRIMARY KEY,
    OrderID INT NOT NULL,
    PaymentMethod NVARCHAR(30) NOT NULL,
    Amount DECIMAL(18,2) NOT NULL,
    TransactionID VARCHAR(100) NULL,
    QRInfo NVARCHAR(MAX) NULL,
    PaymentStatus NVARCHAR(20) NOT NULL DEFAULT N'PENDING',
    PaidAt DATETIME2 NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_PAYMENT_Order FOREIGN KEY(OrderID) REFERENCES ORDERS(OrderID) ON DELETE CASCADE,
    CONSTRAINT CK_PAYMENT_Method CHECK(PaymentMethod IN(N'COD',N'BANK_TRANSFER',N'QR_CODE',N'CREDIT_CARD',N'E_WALLET')),
    CONSTRAINT CK_PAYMENT_Status CHECK(PaymentStatus IN(N'PENDING',N'SUCCESS',N'FAILED',N'REFUNDED')),
    CONSTRAINT CK_PAYMENT_Amount CHECK(Amount>=0)
);
GO
CREATE INDEX IX_PAYMENT_OrderID ON PAYMENT(OrderID);
GO

/* ============================================================================
   7. RETURNS
   ============================================================================ */
CREATE TABLE RETURN_ORDER (
    ReturnID INT IDENTITY(1,1) PRIMARY KEY,
    OrderID INT NOT NULL,
    OrderDetailID INT NULL,
    AccountID INT NOT NULL,
    ReturnQuantity INT NULL,
    Reason NVARCHAR(500) NOT NULL,
    Status NVARCHAR(20) NOT NULL DEFAULT N'PENDING',
    RefundAmount DECIMAL(18,2) NULL,
    RequestDate DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    ProcessedDate DATETIME2 NULL,
    ProcessedBy INT NULL,
    CONSTRAINT FK_RETURN_Order FOREIGN KEY(OrderID) REFERENCES ORDERS(OrderID),
    CONSTRAINT FK_RETURN_OrderAccount FOREIGN KEY(OrderID, AccountID) REFERENCES ORDERS(OrderID, AccountID),
    CONSTRAINT FK_RETURN_OrderDetail FOREIGN KEY(OrderDetailID, OrderID) REFERENCES ORDER_DETAIL(OrderDetailID, OrderID),
    CONSTRAINT FK_RETURN_ProcessedBy FOREIGN KEY(ProcessedBy) REFERENCES ACCOUNT(AccountID),
    CONSTRAINT CK_RETURN_Quantity CHECK(ReturnQuantity IS NULL OR ReturnQuantity>0),
    CONSTRAINT CK_RETURN_Status CHECK(Status IN(N'PENDING',N'APPROVED',N'REJECTED',N'COMPLETED')),
    CONSTRAINT CK_RETURN_RefundAmount CHECK(RefundAmount IS NULL OR RefundAmount>=0),
    CONSTRAINT CK_RETURN_DetailQuantity CHECK((OrderDetailID IS NULL AND ReturnQuantity IS NULL) OR(OrderDetailID IS NOT NULL AND ReturnQuantity IS NOT NULL))
);
GO
CREATE INDEX IX_RETURN_OrderID ON RETURN_ORDER(OrderID);
CREATE INDEX IX_RETURN_AccountID ON RETURN_ORDER(AccountID);
GO

CREATE TABLE RETURN_ORDER_IMAGE (
    ImageID INT IDENTITY(1,1) PRIMARY KEY,
    ReturnID INT NOT NULL,
    ImageURL NVARCHAR(500) NOT NULL,
    CONSTRAINT FK_RETURN_IMAGE_Return FOREIGN KEY(ReturnID) REFERENCES RETURN_ORDER(ReturnID) ON DELETE CASCADE
);
GO
CREATE INDEX IX_RETURN_IMAGE_ReturnID ON RETURN_ORDER_IMAGE(ReturnID);
GO

/* ============================================================================
   8. REVIEW - enforce product/account/order consistency
   ============================================================================ */
CREATE TABLE REVIEW (
    ReviewID INT IDENTITY(1,1) PRIMARY KEY,
    ProductID INT NOT NULL,
    AccountID INT NOT NULL,
    OrderID INT NOT NULL,
    OrderDetailID INT NOT NULL,
    Rating TINYINT NOT NULL,
    Comment NVARCHAR(1000) NULL,
    Status NVARCHAR(20) NOT NULL DEFAULT N'APPROVED',
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT UQ_REVIEW_OrderDetail UNIQUE(OrderDetailID),
    CONSTRAINT FK_REVIEW_OrderAccount FOREIGN KEY(OrderID, AccountID) REFERENCES ORDERS(OrderID, AccountID),
    CONSTRAINT FK_REVIEW_OrderDetailProduct FOREIGN KEY(OrderDetailID, OrderID, ProductID) REFERENCES ORDER_DETAIL(OrderDetailID, OrderID, ProductID),
    CONSTRAINT CK_REVIEW_Rating CHECK(Rating BETWEEN 1 AND 5),
    CONSTRAINT CK_REVIEW_Status CHECK(Status IN(N'APPROVED',N'PENDING',N'HIDDEN'))
);
GO
CREATE INDEX IX_REVIEW_ProductID ON REVIEW(ProductID);
CREATE INDEX IX_REVIEW_AccountID ON REVIEW(AccountID);
GO

/* ============================================================================
   9. LOYALTY TRANSACTION
   ============================================================================ */
CREATE TABLE LOYALTY_TRANSACTION (
    LoyaltyTransactionID INT IDENTITY(1,1) PRIMARY KEY,
    AccountID INT NOT NULL,
    OrderID INT NULL,
    Points INT NOT NULL,
    TransactionType NVARCHAR(20) NOT NULL,
    Description NVARCHAR(255) NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_LOYALTY_Account FOREIGN KEY(AccountID) REFERENCES ACCOUNT(AccountID),
    CONSTRAINT FK_LOYALTY_Order FOREIGN KEY(OrderID) REFERENCES ORDERS(OrderID),
    CONSTRAINT CK_LOYALTY_Points CHECK(Points<>0),
    CONSTRAINT CK_LOYALTY_Type CHECK(TransactionType IN(N'EARN',N'REDEEM',N'ADJUST'))
);
GO
CREATE INDEX IX_LOYALTY_AccountID ON LOYALTY_TRANSACTION(AccountID);
CREATE INDEX IX_LOYALTY_OrderID ON LOYALTY_TRANSACTION(OrderID);
GO

/* ============================================================================
   10. INVENTORY TRANSACTION
   ============================================================================ */
CREATE TABLE INVENTORY_TRANSACTION (
    InventoryTransactionID INT IDENTITY(1,1) PRIMARY KEY,
    ProductID INT NOT NULL,
    TransactionType NVARCHAR(20) NOT NULL,
    Quantity INT NOT NULL,
    ReferenceType NVARCHAR(30) NULL,
    ReferenceID INT NULL,
    Note NVARCHAR(255) NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CreatedBy INT NULL,
    CONSTRAINT FK_INVENTORY_Product FOREIGN KEY(ProductID) REFERENCES PRODUCT(ProductID),
    CONSTRAINT FK_INVENTORY_CreatedBy FOREIGN KEY(CreatedBy) REFERENCES ACCOUNT(AccountID),
    CONSTRAINT CK_INVENTORY_Type CHECK(TransactionType IN(N'IMPORT',N'SALE',N'RETURN',N'ADJUSTMENT')), 
    CONSTRAINT CK_INVENTORY_Quantity CHECK(Quantity>0)
);
GO
CREATE INDEX IX_INVENTORY_ProductID ON INVENTORY_TRANSACTION(ProductID);
CREATE INDEX IX_INVENTORY_CreatedAt ON INVENTORY_TRANSACTION(CreatedAt);
GO

/* ============================================================================
   11. SAMPLE ACCOUNTS
   PasswordHash values are placeholders for development/testing only.
   ============================================================================ */
INSERT INTO ACCOUNT(FullName,Email,PasswordHash,Phone,Address,Gender,RoleID,RankID,LoyaltyPoints,TotalSpent,Status) VALUES
(N'System Admin','admin@bagstore.vn','CHANGE_ME_HASH','0900000001',N'TP. Hồ Chí Minh',N'Khác',1,NULL,0,0,N'ACTIVE'),
(N'Nguyễn Văn Quản','manager@bagstore.vn','CHANGE_ME_HASH','0900000002',N'TP. Hồ Chí Minh',N'Nam',2,NULL,0,0,N'ACTIVE'),
(N'Lê Thị Nhân Viên','staff@bagstore.vn','CHANGE_ME_HASH','0900000003',N'TP. Hồ Chí Minh',N'Nữ',3,NULL,0,0,N'ACTIVE'),
(N'Nguyễn Minh Anh','customer1@gmail.com','CHANGE_ME_HASH','0911000001',N'Quận 1, TP. Hồ Chí Minh',N'Nữ',4,1,350,4500000,N'ACTIVE'),
(N'Trần Gia Huy','customer2@gmail.com','CHANGE_ME_HASH','0911000002',N'Quận 3, TP. Hồ Chí Minh',N'Nam',4,2,1800,7200000,N'ACTIVE'),
(N'Phạm Ngọc Linh','customer3@gmail.com','CHANGE_ME_HASH','0911000003',N'Quận 7, TP. Hồ Chí Minh',N'Nữ',4,3,6200,12800000,N'ACTIVE');
GO

/* ============================================================================
   12. 50 SAMPLE PRODUCTS
   ============================================================================ */
INSERT INTO PRODUCT(ProductCode,ProductName,CategoryID,Brand,Material,Color,Description,Price,DiscountPrice,StockQuantity,SoldQuantity)
SELECT V.ProductCode,V.ProductName,C.CategoryID,V.Brand,V.Material,V.Color,V.Description,V.Price,V.DiscountPrice,V.StockQuantity,V.SoldQuantity
FROM (VALUES
('BG001',N'Tote Daily Canvas',N'Tote Bag',N'LAVIE',N'Canvas',N'Kem',N'Túi tote canvas đơn giản cho đi học và đi làm',590000,499000,35,18),
('BG002',N'Tote Classic Leather',N'Tote Bag',N'ELLA',N'Da PU',N'Nâu',N'Túi tote da phong cách thanh lịch',890000,799000,28,24),
('BG003',N'Tote Minimal Black',N'Tote Bag',N'MONO',N'Da PU',N'Đen',N'Tote đen tối giản, dễ phối đồ',750000,NULL,32,15),
('BG004',N'Tote Office Large',N'Tote Bag',N'ELLA',N'Da tổng hợp',N'Be',N'Tote cỡ lớn phù hợp công sở',1090000,949000,20,31),
('BG005',N'Tote Soft Pastel',N'Tote Bag',N'LAVIE',N'Canvas',N'Hồng pastel',N'Tote màu pastel trẻ trung',650000,559000,25,12),
('BG006',N'Crossbody Luna',N'Túi đeo chéo nữ',N'LAVIE',N'Da PU',N'Đen',N'Túi đeo chéo nhỏ gọn hàng ngày',690000,599000,40,28),
('BG007',N'Crossbody Daisy',N'Túi đeo chéo nữ',N'ELLA',N'Da PU',N'Trắng',N'Túi nữ thiết kế hoa văn nhẹ nhàng',790000,NULL,22,19),
('BG008',N'Shoulder Classic',N'Túi đeo chéo nữ',N'MONO',N'Da tổng hợp',N'Đỏ rượu',N'Túi shoulder sang trọng',990000,849000,18,14),
('BG009',N'Crossbody Mini',N'Túi đeo chéo nữ',N'LAVIE',N'Da PU',N'Xanh navy',N'Túi mini tiện dụng cho dạo phố',550000,469000,45,35),
('BG010',N'Crossbody Urban',N'Túi đeo chéo nữ',N'URBAN',N'Nylon',N'Xám',N'Túi đeo chéo phong cách urban',720000,NULL,30,21),
('BG011',N'Office Lady 13',N'Túi công sở nữ',N'ELLA',N'Da PU',N'Đen',N'Túi công sở có ngăn laptop 13 inch',1290000,1090000,16,22),
('BG012',N'Office Lady 15',N'Túi công sở nữ',N'ELLA',N'Da tổng hợp',N'Nâu',N'Túi công sở có ngăn laptop 15 inch',1490000,1290000,14,17),
('BG013',N'Business Soft',N'Túi công sở nữ',N'MONO',N'Da PU',N'Be',N'Túi công sở nữ kiểu dáng hiện đại',1390000,NULL,18,11),
('BG014',N'Lady Work Tote',N'Túi công sở nữ',N'LAVIE',N'Canvas phủ chống nước',N'Xám',N'Túi đi làm nhiều ngăn',1190000,999000,20,26),
('BG015',N'Office Classic',N'Túi công sở nữ',N'ELLA',N'Da PU',N'Xanh đậm',N'Túi công sở thanh lịch',1590000,1390000,12,9),
('BG016',N'Party Pearl Clutch',N'Túi dự tiệc nữ',N'ELLA',N'Vải satin',N'Đen',N'Clutch đính hạt ngọc trai',850000,729000,18,16),
('BG017',N'Crystal Evening Bag',N'Túi dự tiệc nữ',N'LAVIE',N'Satin',N'Bạc',N'Túi dự tiệc ánh kim',990000,849000,15,13),
('BG018',N'Velvet Mini Bag',N'Túi dự tiệc nữ',N'MONO',N'Nhung',N'Xanh emerald',N'Túi mini nhung sang trọng',790000,NULL,20,10),
('BG019',N'Golden Chain Bag',N'Túi dự tiệc nữ',N'ELLA',N'Da PU',N'Vàng champagne',N'Túi dây xích dự tiệc',1090000,929000,13,18),
('BG020',N'Satin Bow Clutch',N'Túi dự tiệc nữ',N'LAVIE',N'Satin',N'Hồng',N'Clutch nơ nữ tính',690000,599000,22,8),
('BG021',N'Metro Crossbody',N'Túi đeo chéo nam',N'URBAN',N'Canvas',N'Đen',N'Túi đeo chéo nam phong cách thành thị',690000,599000,35,29),
('BG022',N'Men Compact Bag',N'Túi đeo chéo nam',N'URBAN',N'Nylon',N'Xám',N'Túi nam nhỏ gọn nhiều ngăn',590000,NULL,40,22),
('BG023',N'Leather Crossbody M',N'Túi đeo chéo nam',N'GENT',N'Da bò',N'Nâu',N'Túi da nam cao cấp',1490000,1290000,12,17),
('BG024',N'Urban Sling Bag',N'Túi đeo chéo nam',N'URBAN',N'Nylon chống nước',N'Xanh đen',N'Túi sling năng động',720000,629000,28,34),
('BG025',N'Classic Messenger',N'Túi đeo chéo nam',N'GENT',N'Da PU',N'Đen',N'Túi messenger nam cổ điển',990000,849000,20,15),
('BG026',N'Business Briefcase',N'Túi công sở nam',N'GENT',N'Da PU',N'Đen',N'Cặp công sở nam',1690000,1490000,14,19),
('BG027',N'Executive Leather Bag',N'Túi công sở nam',N'GENT',N'Da bò',N'Nâu',N'Túi công sở da cao cấp',2590000,2290000,8,11),
('BG028',N'Laptop Business 15',N'Túi công sở nam',N'URBAN',N'Polyester',N'Xám',N'Túi laptop công sở 15.6 inch',1190000,999000,25,27),
('BG029',N'Business Slim',N'Túi công sở nam',N'GENT',N'Da PU',N'Xanh navy',N'Túi công sở dáng slim',1390000,NULL,17,13),
('BG030',N'Office Messenger Pro',N'Túi công sở nam',N'URBAN',N'Canvas',N'Đen',N'Messenger có ngăn tài liệu',1090000,899000,22,16),
('BG031',N'Laptop Backpack 15',N'Balo laptop',N'URBAN',N'Polyester chống nước',N'Đen',N'Balo laptop 15.6 inch',990000,849000,40,42),
('BG032',N'Laptop Backpack Pro',N'Balo laptop',N'URBAN',N'Nylon',N'Xám',N'Balo công sở nhiều ngăn',1290000,1090000,30,36),
('BG033',N'Campus Backpack',N'Balo laptop',N'LAVIE',N'Canvas',N'Xanh navy',N'Balo đi học có ngăn laptop',790000,679000,45,39),
('BG034',N'Tech Backpack',N'Balo laptop',N'URBAN',N'Polyester',N'Xám đậm',N'Balo công nghệ chống sốc',1490000,NULL,24,20),
('BG035',N'Business Backpack',N'Balo laptop',N'GENT',N'Polyester',N'Đen',N'Balo công sở cao cấp',1590000,1390000,18,25),
('BG036',N'Travel Backpack 30L',N'Balo du lịch',N'URBAN',N'Nylon chống nước',N'Đen',N'Balo du lịch 30L',1390000,1190000,20,24),
('BG037',N'Adventure Backpack 40L',N'Balo du lịch',N'URBAN',N'Nylon',N'Xanh rêu',N'Balo trekking 40L',1790000,1590000,15,18),
('BG038',N'Weekend Travel Bag',N'Balo du lịch',N'LAVIE',N'Canvas',N'Be',N'Balo/túi du lịch cuối tuần',1190000,999000,25,14),
('BG039',N'Light Travel Pack',N'Balo du lịch',N'URBAN',N'Polyester',N'Xám',N'Balo du lịch nhẹ',990000,NULL,28,12),
('BG040',N'City Travel Backpack',N'Balo du lịch',N'GENT',N'Nylon',N'Đen',N'Balo du lịch đô thị',1490000,1290000,19,21),
('BG041',N'Ví Da Nam Classic',N'Ví nam',N'GENT',N'Da bò',N'Nâu',N'Ví nam da bò kiểu cổ điển',690000,599000,35,40),
('BG042',N'Ví Da Nam Slim',N'Ví nam',N'GENT',N'Da bò',N'Đen',N'Ví nam dáng mỏng',590000,NULL,45,31),
('BG043',N'Ví Card Holder',N'Ví nam',N'GENT',N'Da PU',N'Xanh navy',N'Ví đựng thẻ nhỏ gọn',390000,329000,50,28),
('BG044',N'Ví Nữ Mini',N'Ví nữ',N'LAVIE',N'Da PU',N'Hồng',N'Ví nữ mini nhiều ngăn',490000,419000,40,36),
('BG045',N'Ví Nữ Classic',N'Ví nữ',N'ELLA',N'Da PU',N'Đỏ rượu',N'Ví nữ dáng dài',690000,579000,32,27),
('BG046',N'Clutch Elegant',N'Clutch',N'ELLA',N'Da PU',N'Đen',N'Clutch thanh lịch',790000,679000,25,22),
('BG047',N'Clutch Gold Party',N'Clutch',N'ELLA',N'Satin',N'Vàng',N'Clutch dự tiệc sang trọng',890000,759000,20,15),
('BG048',N'Bag Charm Flower',N'Phụ kiện túi',N'LAVIE',N'Hợp kim + vải',N'Hồng',N'Móc trang trí túi hình hoa',190000,159000,60,44),
('BG049',N'Bag Strap Premium',N'Phụ kiện túi',N'LAVIE',N'Canvas + da',N'Nâu',N'Dây đeo túi thay thế cao cấp',290000,249000,55,30),
('BG050',N'Leather Care Kit',N'Phụ kiện túi',N'GENT',N'Dung dịch + vải',N'Đen',N'Bộ vệ sinh và bảo dưỡng túi da',350000,299000,45,17)
) V(ProductCode,ProductName,CategoryName,Brand,Material,Color,Description,Price,DiscountPrice,StockQuantity,SoldQuantity)
JOIN CATEGORY C ON C.CategoryName=V.CategoryName;
GO

-- 1 ảnh đại diện cho mỗi sản phẩm; có thể thay URL bằng ảnh thật trong project.
INSERT INTO PRODUCT_IMAGE(ProductID,ImageURL,IsMain,SortOrder)
SELECT ProductID, CONCAT(N'/images/products/', ProductCode, N'.jpg'), 1, 0
FROM PRODUCT;
GO

/* ============================================================================
   13. SAMPLE VOUCHERS
   ============================================================================ */
INSERT INTO VOUCHER(VoucherCode,VoucherName,DiscountType,DiscountValue,MaxDiscountAmount,MinOrderValue,QuantityAvailable,UsedCount,StartDate,EndDate,Status) VALUES
('WELCOME50',N'Giảm 50K cho đơn đầu tiên',N'FIXED',50000,NULL,500000,500,0,'2026-01-01','2027-12-31',N'ACTIVE'),
('BAG10',N'Giảm 10% toàn đơn',N'PERCENT',10,200000,1000000,300,0,'2026-01-01','2027-12-31',N'ACTIVE'),
('VIP15',N'Ưu đãi khách hàng VIP',N'PERCENT',15,300000,2000000,100,0,'2026-01-01','2027-12-31',N'ACTIVE'),
('FREESHIP',N'Ưu đãi vận chuyển',N'FIXED',30000,NULL,700000,1000,0,'2026-01-01','2027-12-31',N'ACTIVE');
GO

/* ============================================================================
   14. SAMPLE CARTS
   ============================================================================ */
INSERT INTO CART(AccountID) VALUES(4),(5),(6);
GO
INSERT INTO CART_ITEM(CartID,ProductID,Quantity) VALUES
(1,1,1),(1,9,2),(2,23,1),(2,31,1),(3,12,1),(3,45,2);
GO

/* ============================================================================
   15. SAMPLE INVENTORY HISTORY
   ============================================================================ */
INSERT INTO INVENTORY_TRANSACTION(ProductID,TransactionType,Quantity,ReferenceType,Note,CreatedBy)
SELECT ProductID,N'IMPORT',StockQuantity+SoldQuantity,N'SEED',N'Tồn kho khởi tạo dữ liệu mẫu',2
FROM PRODUCT;
GO

/* ============================================================================
   16. SAMPLE ORDERS / ORDER DETAILS / PAYMENTS
   ============================================================================ */
INSERT INTO ORDERS(OrderCode,AccountID,StaffID,OrderDate,Status,ReceiverName,ReceiverPhone,ShippingAddress,ShippingFee,SubTotal,DiscountAmount,TotalAmount,PaymentMethod,Note)
VALUES
('BS260001',4,3,'2026-09-20',N'DONE',N'Nguyễn Minh Anh','0911000001',N'Quận 1, TP. Hồ Chí Minh',30000,1770000,50000,1750000,N'COD',N'Giao giờ hành chính'),
('BS260002',5,3,'2026-09-22',N'DONE',N'Trần Gia Huy','0911000002',N'Quận 3, TP. Hồ Chí Minh',30000,3170000,0,3200000,N'BANK_TRANSFER',NULL),
('BS260003',6,3,'2026-09-25',N'SHIPPING',N'Phạm Ngọc Linh','0911000003',N'Quận 7, TP. Hồ Chí Minh',0,1490000,100000,1390000,N'QR_CODE',N'Khách yêu cầu giao nhanh');
GO

INSERT INTO ORDER_DETAIL(OrderID,ProductID,Quantity,UnitPrice) VALUES
(1,1,1,590000),(1,6,1,690000),(1,44,1,490000),(2,23,1,1490000),(2,31,1,990000),(2,41,1,690000),(3,12,1,1490000);
GO

INSERT INTO PAYMENT(OrderID,PaymentMethod,Amount,TransactionID,PaymentStatus,PaidAt) VALUES
(1,N'COD',1750000,NULL,N'SUCCESS','2026-09-20'),
(2,N'BANK_TRANSFER',3200000,'BANK-BS260002',N'SUCCESS','2026-09-22'),
(3,N'QR_CODE',1390000,'QR-BS260003',N'SUCCESS','2026-09-25');
GO

/* Loyalty sample transactions */
INSERT INTO LOYALTY_TRANSACTION(AccountID,OrderID,Points,TransactionType,Description) VALUES
(4,1,1578,N'EARN',N'Tích điểm từ đơn hàng BS260001'),
(5,2,2620,N'EARN',N'Tích điểm từ đơn hàng BS260002'),
(6,3,1390,N'EARN',N'Tích điểm từ đơn hàng BS260003');
GO

/* Reviews must reference the exact product/order/customer combination. */
INSERT INTO REVIEW(ProductID,AccountID,OrderID,OrderDetailID,Rating,Comment,Status) VALUES
(1,4,1,1,5,N'Túi đẹp, chất lượng tốt và giao hàng nhanh.',N'APPROVED'),
(6,4,1,2,4,N'Túi nhỏ gọn, màu đẹp.',N'APPROVED'),
(23,5,2,4,5,N'Da đẹp, form túi chắc chắn.',N'APPROVED'),
(31,5,2,5,5,N'Balo đựng laptop rất tiện.',N'APPROVED');
GO

/* ============================================================================
   17. USEFUL VIEWS FOR THE FINAL PROJECT
   ============================================================================ */
CREATE VIEW VW_PRODUCT_CATALOG AS
SELECT
    P.ProductID,
    P.ProductCode,
    P.ProductName,
    C.CategoryName,
    PC.CategoryName AS ParentCategoryName,
    P.Brand,
    P.Material,
    P.Color,
    P.Price,
    P.DiscountPrice,
    COALESCE(P.DiscountPrice,P.Price) AS SellingPrice,
    P.StockQuantity,
    P.SoldQuantity,
    P.Status,
    PI.ImageURL AS MainImage
FROM PRODUCT P
JOIN CATEGORY C ON C.CategoryID=P.CategoryID
LEFT JOIN CATEGORY PC ON PC.CategoryID=C.ParentCategoryID
LEFT JOIN PRODUCT_IMAGE PI ON PI.ProductID=P.ProductID AND PI.IsMain=1;
GO

CREATE VIEW VW_ORDER_SUMMARY AS
SELECT
    O.OrderID,
    O.OrderCode,
    O.OrderDate,
    O.AccountID,
    A.FullName AS CustomerName,
    O.Status,
    O.SubTotal,
    O.DiscountAmount,
    O.ShippingFee,
    O.TotalAmount,
    O.PaymentMethod,
    COUNT(OD.OrderDetailID) AS ProductLineCount,
    SUM(OD.Quantity) AS TotalItems
FROM ORDERS O
JOIN ACCOUNT A ON A.AccountID=O.AccountID
LEFT JOIN ORDER_DETAIL OD ON OD.OrderID=O.OrderID
GROUP BY O.OrderID,O.OrderCode,O.OrderDate,O.AccountID,A.FullName,O.Status,O.SubTotal,O.DiscountAmount,O.ShippingFee,O.TotalAmount,O.PaymentMethod;
GO

CREATE VIEW VW_PRODUCT_REVIEW_RATING AS
SELECT
    P.ProductID,
    P.ProductCode,
    P.ProductName,
    COUNT(R.ReviewID) AS ReviewCount,
    CAST(AVG(CAST(R.Rating AS DECIMAL(4,2))) AS DECIMAL(4,2)) AS AverageRating
FROM PRODUCT P
LEFT JOIN REVIEW R ON R.ProductID=P.ProductID AND R.Status=N'APPROVED'
GROUP BY P.ProductID,P.ProductCode,P.ProductName;
GO

/* ============================================================================
   18. BASIC DATA VALIDATION
   ============================================================================ */
IF (SELECT COUNT(*) FROM PRODUCT) <> 50
    THROW 50001, 'Product seed error: expected exactly 50 products.', 1;

IF (SELECT COUNT(*) FROM PRODUCT_IMAGE) <> 50
    THROW 50002, 'Product image seed error: expected 50 main images.', 1;
GO

PRINT N'============================================================';
PRINT N'BagStoreDB FINAL đã tạo thành công.';
PRINT N'- 5 nhóm danh mục chính + danh mục con';
PRINT N'- 50 sản phẩm mẫu';
PRINT N'- 50 ảnh sản phẩm mẫu';
PRINT N'- Voucher, Cart, Order, Payment';
PRINT N'- Return theo số lượng';
PRINT N'- Review được ràng buộc đúng Order/Customer/Product';
PRINT N'- Loyalty Transaction';
PRINT N'- Inventory Transaction';
PRINT N'- 3 View hỗ trợ website và báo cáo';
PRINT N'============================================================';
GO
