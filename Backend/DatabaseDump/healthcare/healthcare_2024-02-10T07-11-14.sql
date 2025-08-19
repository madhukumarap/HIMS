/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: allsubstitutes
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `allsubstitutes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `medicineName` longtext,
  `medicineId` int DEFAULT NULL,
  `medicine_Id` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 14 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: backupconfigs
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `backupconfigs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `period` varchar(255) DEFAULT NULL,
  `day` varchar(255) DEFAULT NULL,
  `time` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 22 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: backupdata
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `backupdata` (
  `id` int NOT NULL AUTO_INCREMENT,
  `filename` varchar(255) DEFAULT NULL,
  `path` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `user` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT 'not-restored',
  `restoredBy` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 48 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: bedshospitalrooms
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `bedshospitalrooms` (
  `id` int NOT NULL AUTO_INCREMENT,
  `BedNumber` varchar(255) DEFAULT NULL,
  `BedType` varchar(255) DEFAULT NULL,
  `BedPrice` int DEFAULT NULL,
  `HospitalRoomID` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `HospitalRoomNumber` int DEFAULT NULL,
  `Currency` varchar(255) NOT NULL,
  `BedStatus` varchar(255) DEFAULT NULL,
  `OccupiedCheckInTime` varchar(255) DEFAULT NULL,
  `OccupiedCheckOutTime` varchar(255) DEFAULT NULL,
  `OccupiedAdmissionID` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `HospitalRoomID` (`HospitalRoomID`),
  CONSTRAINT `bedshospitalrooms_ibfk_1` FOREIGN KEY (`HospitalRoomID`) REFERENCES `hospitalrooms` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `bedshospitalrooms_ibfk_2` FOREIGN KEY (`HospitalRoomID`) REFERENCES `hospitalrooms` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 24 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: bhkjhbresultmodels
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `bhkjhbresultmodels` (
  `id` int NOT NULL AUTO_INCREMENT,
  `PatientID` int NOT NULL,
  `TestManagementID` int NOT NULL,
  `Comment` longtext,
  `PatientTestBookingID` int NOT NULL,
  `new` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: bloodsugarforfastingmodels
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `bloodsugarforfastingmodels` (
  `id` int NOT NULL AUTO_INCREMENT,
  `PatientID` int NOT NULL,
  `TestManagementID` int NOT NULL,
  `PatientTestBookingID` int NOT NULL,
  `Urine_Sugar` varchar(255) NOT NULL,
  `Urine_Acetone` varchar(255) NOT NULL,
  `Post_Lunch_Blood_Sugar` varchar(255) NOT NULL,
  `resultDate` varchar(255) DEFAULT NULL,
  `Remarks` longtext,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: bloodsugarforfastingresultmodels
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `bloodsugarforfastingresultmodels` (
  `id` int NOT NULL AUTO_INCREMENT,
  `PatientID` int NOT NULL,
  `TestManagementID` int NOT NULL,
  `PatientTestBookingID` int NOT NULL,
  `Urine_Sugar` varchar(255) DEFAULT NULL,
  `Urine_Acetone` varchar(255) DEFAULT NULL,
  `Post_Lunch_Blood_Sugar` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `Remarks` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 8 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: bloodsugarforppresultmodels
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `bloodsugarforppresultmodels` (
  `id` int NOT NULL AUTO_INCREMENT,
  `PatientID` int NOT NULL,
  `TestManagementID` int NOT NULL,
  `PatientTestBookingID` int NOT NULL,
  `Chloride` varchar(255) DEFAULT NULL,
  `Appearance` varchar(255) DEFAULT NULL,
  `Coagulum` varchar(255) DEFAULT NULL,
  `Blood` varchar(255) DEFAULT NULL,
  `Proteins` varchar(255) DEFAULT NULL,
  `Polymorphs` varchar(255) DEFAULT NULL,
  `Lymphocytes` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `Sugar` varchar(255) DEFAULT NULL,
  `Sugar_Level` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 5 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: bloodsugarforzzresultmodels
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `bloodsugarforzzresultmodels` (
  `id` int NOT NULL AUTO_INCREMENT,
  `PatientID` int NOT NULL,
  `TestManagementID` int NOT NULL,
  `selectedTestName` varchar(255) DEFAULT NULL,
  `PatientTestBookingID` int NOT NULL,
  `Sugar_Level` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: bloodsugerforpps
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `bloodsugerforpps` (
  `id` int NOT NULL AUTO_INCREMENT,
  `PatientID` int NOT NULL,
  `TestManagementID` int NOT NULL,
  `PatientTestBookingID` int NOT NULL,
  `Chloride` varchar(255) NOT NULL,
  `Colour` varchar(255) NOT NULL,
  `Quantity` varchar(255) NOT NULL,
  `Appearance` varchar(255) NOT NULL,
  `Coagulum` varchar(255) NOT NULL,
  `Blood` varchar(255) NOT NULL,
  `Proteins` varchar(255) NOT NULL,
  `Total_W_B_C_Count` varchar(255) NOT NULL,
  `Polymorphs` varchar(255) NOT NULL,
  `Lymphocytes` varchar(255) NOT NULL,
  `RBC_S` varchar(255) NOT NULL,
  `Z_N_Stain` varchar(255) NOT NULL,
  `Cram_s_Smear` varchar(255) NOT NULL,
  `Sugar` varchar(255) NOT NULL,
  `resultDate` varchar(255) DEFAULT NULL,
  `Remarks` longtext,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: brainmriscanresultmodeldiagnostics
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `brainmriscanresultmodeldiagnostics` (
  `id` int NOT NULL AUTO_INCREMENT,
  `PatientID` int NOT NULL,
  `TestManagementID` int NOT NULL,
  `Comment` longtext,
  `PatientTestBookingID` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: calciumresultmodeldiagnostics
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `calciumresultmodeldiagnostics` (
  `id` int NOT NULL AUTO_INCREMENT,
  `PatientID` int NOT NULL,
  `TestManagementID` int NOT NULL,
  `PatientTestBookingID` int NOT NULL,
  `jhjhjh` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `Comment` longtext,
  `om` longtext,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 4 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: commissioncodedata
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `commissioncodedata` (
  `id` int NOT NULL AUTO_INCREMENT,
  `codeType` varchar(255) NOT NULL,
  `value` varchar(255) NOT NULL,
  `description` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 9 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: companyitems
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `companyitems` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `contactNo` bigint NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `logo` longblob,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 3 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: companyregistrations
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `companyregistrations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `companyName` varchar(255) NOT NULL,
  `industryType` varchar(255) NOT NULL,
  `Address` varchar(255) NOT NULL,
  `registrationNo` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `website` varchar(255) DEFAULT NULL,
  `logo` longblob,
  `PAN_TAN` varchar(255) DEFAULT NULL,
  `phone` bigint DEFAULT NULL,
  `landline` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 4 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: corporatepatientlistpackages
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `corporatepatientlistpackages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `packageName` varchar(255) NOT NULL,
  `MRPOfPackage` int NOT NULL,
  `discount` int DEFAULT NULL,
  `finalPrice` decimal(10, 2) NOT NULL,
  `PackageID` int NOT NULL,
  `PatientID` int NOT NULL,
  `PatientPhone` bigint NOT NULL,
  `PatientName` varchar(255) NOT NULL,
  `PatientCorporateID` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 7 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: createvaccinationpatients
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `createvaccinationpatients` (
  `id` int NOT NULL AUTO_INCREMENT,
  `motherName` varchar(255) DEFAULT NULL,
  `babyName` varchar(255) NOT NULL,
  `age` int DEFAULT NULL,
  `gender` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `vaccinationRegNo` varchar(255) NOT NULL,
  `fatherName` varchar(255) NOT NULL,
  `phoneNumber` bigint DEFAULT NULL,
  `ageOption` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `vaccinationRegNo` (`vaccinationRegNo`),
  UNIQUE KEY `vaccinationRegNo_2` (`vaccinationRegNo`),
  UNIQUE KEY `vaccinationRegNo_3` (`vaccinationRegNo`),
  UNIQUE KEY `vaccinationRegNo_4` (`vaccinationRegNo`),
  UNIQUE KEY `vaccinationRegNo_5` (`vaccinationRegNo`),
  UNIQUE KEY `vaccinationRegNo_6` (`vaccinationRegNo`),
  UNIQUE KEY `vaccinationRegNo_7` (`vaccinationRegNo`),
  UNIQUE KEY `vaccinationRegNo_8` (`vaccinationRegNo`),
  UNIQUE KEY `vaccinationRegNo_9` (`vaccinationRegNo`),
  UNIQUE KEY `vaccinationRegNo_10` (`vaccinationRegNo`),
  UNIQUE KEY `vaccinationRegNo_11` (`vaccinationRegNo`),
  UNIQUE KEY `vaccinationRegNo_12` (`vaccinationRegNo`),
  UNIQUE KEY `vaccinationRegNo_13` (`vaccinationRegNo`),
  UNIQUE KEY `vaccinationRegNo_14` (`vaccinationRegNo`),
  UNIQUE KEY `vaccinationRegNo_15` (`vaccinationRegNo`),
  UNIQUE KEY `vaccinationRegNo_16` (`vaccinationRegNo`),
  UNIQUE KEY `vaccinationRegNo_17` (`vaccinationRegNo`),
  UNIQUE KEY `vaccinationRegNo_18` (`vaccinationRegNo`),
  UNIQUE KEY `vaccinationRegNo_19` (`vaccinationRegNo`),
  UNIQUE KEY `vaccinationRegNo_20` (`vaccinationRegNo`),
  UNIQUE KEY `vaccinationRegNo_21` (`vaccinationRegNo`),
  UNIQUE KEY `vaccinationRegNo_22` (`vaccinationRegNo`),
  UNIQUE KEY `vaccinationRegNo_23` (`vaccinationRegNo`),
  UNIQUE KEY `vaccinationRegNo_24` (`vaccinationRegNo`),
  UNIQUE KEY `vaccinationRegNo_25` (`vaccinationRegNo`),
  UNIQUE KEY `vaccinationRegNo_26` (`vaccinationRegNo`),
  UNIQUE KEY `vaccinationRegNo_27` (`vaccinationRegNo`),
  UNIQUE KEY `vaccinationRegNo_28` (`vaccinationRegNo`),
  UNIQUE KEY `vaccinationRegNo_29` (`vaccinationRegNo`),
  UNIQUE KEY `vaccinationRegNo_30` (`vaccinationRegNo`),
  UNIQUE KEY `vaccinationRegNo_31` (`vaccinationRegNo`),
  UNIQUE KEY `vaccinationRegNo_32` (`vaccinationRegNo`),
  UNIQUE KEY `vaccinationRegNo_33` (`vaccinationRegNo`),
  UNIQUE KEY `vaccinationRegNo_34` (`vaccinationRegNo`),
  UNIQUE KEY `vaccinationRegNo_35` (`vaccinationRegNo`),
  UNIQUE KEY `vaccinationRegNo_36` (`vaccinationRegNo`),
  UNIQUE KEY `vaccinationRegNo_37` (`vaccinationRegNo`),
  UNIQUE KEY `vaccinationRegNo_38` (`vaccinationRegNo`)
) ENGINE = InnoDB AUTO_INCREMENT = 15 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: creatinineresultmodeldiagnostics
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `creatinineresultmodeldiagnostics` (
  `id` int NOT NULL AUTO_INCREMENT,
  `PatientID` int NOT NULL,
  `TestManagementID` int NOT NULL,
  `Comment` longtext,
  `PatientTestBookingID` int NOT NULL,
  `kujh` longtext,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: currencyrates
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `currencyrates` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Currency` varchar(255) NOT NULL,
  `CurrencyResponse` json NOT NULL,
  `Date` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 27 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: diagnostics_packages
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `diagnostics_packages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `packageName` varchar(255) NOT NULL,
  `MRPOfPackage` int NOT NULL,
  `discount` int DEFAULT NULL,
  `finalPrice` decimal(10, 2) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `Currency` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 4 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: diagnosticsbookings
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `diagnosticsbookings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `PatientName` varchar(255) NOT NULL,
  `PatientID` int NOT NULL,
  `doctorId` int DEFAULT NULL,
  `PaymentStatus` varchar(255) NOT NULL,
  `PaymentDate` date DEFAULT NULL,
  `DoctorPhone` bigint DEFAULT NULL,
  `DoctorEmail` varchar(255) DEFAULT NULL,
  `DoctorName` varchar(255) DEFAULT NULL,
  `commissionType` varchar(255) DEFAULT NULL,
  `commissionValue` varchar(255) DEFAULT NULL,
  `TestManagementID` int NOT NULL,
  `TestManagementIDs` varchar(255) DEFAULT NULL,
  `Address` varchar(255) NOT NULL,
  `PatientPhoneNo` bigint NOT NULL,
  `status` varchar(255) NOT NULL,
  `lapName` varchar(255) DEFAULT NULL,
  `selectedTests` varchar(255) NOT NULL,
  `remarks` text,
  `instrumentsUsed` text,
  `testFees` decimal(10, 2) NOT NULL,
  `results` longtext,
  `Authorization` varchar(255) DEFAULT 'Pending',
  `feedback` longtext,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL,
  `CorporateID` varchar(255) DEFAULT NULL,
  `selectedPackageID` int DEFAULT NULL,
  `TotalFees` decimal(10, 2) DEFAULT NULL,
  `Currency` varchar(255) DEFAULT NULL,
  `admissionID` int DEFAULT '0',
  `procedure` varchar(255) DEFAULT 'Diagnostic',
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 38 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: diagnostictestlists
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `diagnostictestlists` (
  `id` int NOT NULL AUTO_INCREMENT,
  `testName` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `description` text,
  `category` varchar(255) NOT NULL,
  `testPrice` int NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL,
  `LabCategoryName` varchar(255) NOT NULL,
  `LabCategoryNameID` int NOT NULL,
  `SpecimenName` varchar(255) NOT NULL,
  `SpecimenNameID` int NOT NULL,
  `Currency` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  UNIQUE KEY `code_2` (`code`),
  UNIQUE KEY `code_3` (`code`),
  UNIQUE KEY `code_4` (`code`),
  UNIQUE KEY `code_5` (`code`),
  UNIQUE KEY `code_6` (`code`),
  UNIQUE KEY `code_7` (`code`),
  UNIQUE KEY `code_8` (`code`),
  UNIQUE KEY `code_9` (`code`),
  UNIQUE KEY `code_10` (`code`),
  UNIQUE KEY `code_11` (`code`),
  UNIQUE KEY `code_12` (`code`),
  UNIQUE KEY `code_13` (`code`),
  UNIQUE KEY `code_14` (`code`),
  UNIQUE KEY `code_15` (`code`),
  UNIQUE KEY `code_16` (`code`),
  UNIQUE KEY `code_17` (`code`),
  UNIQUE KEY `code_18` (`code`),
  UNIQUE KEY `code_19` (`code`),
  UNIQUE KEY `code_20` (`code`),
  UNIQUE KEY `code_21` (`code`),
  UNIQUE KEY `code_22` (`code`),
  UNIQUE KEY `code_23` (`code`),
  UNIQUE KEY `code_24` (`code`),
  UNIQUE KEY `code_25` (`code`),
  UNIQUE KEY `code_26` (`code`),
  UNIQUE KEY `code_27` (`code`),
  UNIQUE KEY `code_28` (`code`),
  UNIQUE KEY `code_29` (`code`),
  UNIQUE KEY `code_30` (`code`),
  UNIQUE KEY `code_31` (`code`),
  UNIQUE KEY `code_32` (`code`),
  UNIQUE KEY `code_33` (`code`),
  UNIQUE KEY `code_34` (`code`),
  UNIQUE KEY `code_35` (`code`),
  UNIQUE KEY `code_36` (`code`),
  UNIQUE KEY `code_37` (`code`),
  UNIQUE KEY `code_38` (`code`),
  UNIQUE KEY `code_39` (`code`),
  UNIQUE KEY `code_40` (`code`),
  UNIQUE KEY `code_41` (`code`),
  UNIQUE KEY `code_42` (`code`),
  UNIQUE KEY `code_43` (`code`),
  UNIQUE KEY `code_44` (`code`),
  UNIQUE KEY `code_45` (`code`),
  UNIQUE KEY `code_46` (`code`),
  UNIQUE KEY `code_47` (`code`),
  UNIQUE KEY `code_48` (`code`),
  UNIQUE KEY `code_49` (`code`),
  UNIQUE KEY `code_50` (`code`),
  UNIQUE KEY `code_51` (`code`),
  UNIQUE KEY `code_52` (`code`),
  UNIQUE KEY `code_53` (`code`),
  UNIQUE KEY `code_54` (`code`),
  UNIQUE KEY `code_55` (`code`),
  UNIQUE KEY `code_56` (`code`),
  UNIQUE KEY `code_57` (`code`),
  UNIQUE KEY `code_58` (`code`),
  UNIQUE KEY `code_59` (`code`),
  UNIQUE KEY `code_60` (`code`),
  UNIQUE KEY `code_61` (`code`),
  UNIQUE KEY `code_62` (`code`),
  UNIQUE KEY `code_63` (`code`)
) ENGINE = InnoDB AUTO_INCREMENT = 23 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: diagnostictestresultimages
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `diagnostictestresultimages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `testBookingID` varchar(255) NOT NULL,
  `testName` varchar(255) NOT NULL,
  `testType` varchar(255) NOT NULL,
  `imagePath` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 29 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: diagonosticselectedtestforpackagemodels
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `diagonosticselectedtestforpackagemodels` (
  `id` int NOT NULL AUTO_INCREMENT,
  `TestName` varchar(255) NOT NULL,
  `testType` varchar(255) NOT NULL,
  `category` varchar(255) NOT NULL,
  `TestId` int NOT NULL,
  `TestPackageID` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 21 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: dispensedmedicines
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `dispensedmedicines` (
  `id` int NOT NULL AUTO_INCREMENT,
  `PatientName` varchar(255) NOT NULL,
  `patient_Id` int NOT NULL,
  `prescription_Id` int NOT NULL,
  `DispenseID` varchar(255) NOT NULL,
  `DispenseTableID` int NOT NULL,
  `MedicineName` varchar(255) NOT NULL,
  `BatchNumber` varchar(255) NOT NULL,
  `ExpiryDate` datetime NOT NULL,
  `UnitPrice` float(5, 2) DEFAULT NULL,
  `Quantity` int NOT NULL,
  `EachmedicineCost` float(5, 2) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `EachMedicineCurrency` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `DispenseTableID` (`DispenseTableID`),
  CONSTRAINT `dispensedmedicines_ibfk_1` FOREIGN KEY (`DispenseTableID`) REFERENCES `dispensedreports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dispensedmedicines_ibfk_10` FOREIGN KEY (`DispenseTableID`) REFERENCES `dispensedreports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dispensedmedicines_ibfk_11` FOREIGN KEY (`DispenseTableID`) REFERENCES `dispensedreports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dispensedmedicines_ibfk_12` FOREIGN KEY (`DispenseTableID`) REFERENCES `dispensedreports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dispensedmedicines_ibfk_13` FOREIGN KEY (`DispenseTableID`) REFERENCES `dispensedreports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dispensedmedicines_ibfk_14` FOREIGN KEY (`DispenseTableID`) REFERENCES `dispensedreports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dispensedmedicines_ibfk_15` FOREIGN KEY (`DispenseTableID`) REFERENCES `dispensedreports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dispensedmedicines_ibfk_16` FOREIGN KEY (`DispenseTableID`) REFERENCES `dispensedreports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dispensedmedicines_ibfk_17` FOREIGN KEY (`DispenseTableID`) REFERENCES `dispensedreports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dispensedmedicines_ibfk_18` FOREIGN KEY (`DispenseTableID`) REFERENCES `dispensedreports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dispensedmedicines_ibfk_19` FOREIGN KEY (`DispenseTableID`) REFERENCES `dispensedreports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dispensedmedicines_ibfk_2` FOREIGN KEY (`DispenseTableID`) REFERENCES `dispensedreports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dispensedmedicines_ibfk_20` FOREIGN KEY (`DispenseTableID`) REFERENCES `dispensedreports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dispensedmedicines_ibfk_21` FOREIGN KEY (`DispenseTableID`) REFERENCES `dispensedreports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dispensedmedicines_ibfk_22` FOREIGN KEY (`DispenseTableID`) REFERENCES `dispensedreports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dispensedmedicines_ibfk_23` FOREIGN KEY (`DispenseTableID`) REFERENCES `dispensedreports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dispensedmedicines_ibfk_24` FOREIGN KEY (`DispenseTableID`) REFERENCES `dispensedreports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dispensedmedicines_ibfk_25` FOREIGN KEY (`DispenseTableID`) REFERENCES `dispensedreports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dispensedmedicines_ibfk_26` FOREIGN KEY (`DispenseTableID`) REFERENCES `dispensedreports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dispensedmedicines_ibfk_27` FOREIGN KEY (`DispenseTableID`) REFERENCES `dispensedreports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dispensedmedicines_ibfk_28` FOREIGN KEY (`DispenseTableID`) REFERENCES `dispensedreports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dispensedmedicines_ibfk_29` FOREIGN KEY (`DispenseTableID`) REFERENCES `dispensedreports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dispensedmedicines_ibfk_3` FOREIGN KEY (`DispenseTableID`) REFERENCES `dispensedreports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dispensedmedicines_ibfk_30` FOREIGN KEY (`DispenseTableID`) REFERENCES `dispensedreports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dispensedmedicines_ibfk_31` FOREIGN KEY (`DispenseTableID`) REFERENCES `dispensedreports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dispensedmedicines_ibfk_32` FOREIGN KEY (`DispenseTableID`) REFERENCES `dispensedreports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dispensedmedicines_ibfk_33` FOREIGN KEY (`DispenseTableID`) REFERENCES `dispensedreports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dispensedmedicines_ibfk_34` FOREIGN KEY (`DispenseTableID`) REFERENCES `dispensedreports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dispensedmedicines_ibfk_35` FOREIGN KEY (`DispenseTableID`) REFERENCES `dispensedreports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dispensedmedicines_ibfk_36` FOREIGN KEY (`DispenseTableID`) REFERENCES `dispensedreports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dispensedmedicines_ibfk_37` FOREIGN KEY (`DispenseTableID`) REFERENCES `dispensedreports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dispensedmedicines_ibfk_38` FOREIGN KEY (`DispenseTableID`) REFERENCES `dispensedreports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dispensedmedicines_ibfk_39` FOREIGN KEY (`DispenseTableID`) REFERENCES `dispensedreports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dispensedmedicines_ibfk_4` FOREIGN KEY (`DispenseTableID`) REFERENCES `dispensedreports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dispensedmedicines_ibfk_40` FOREIGN KEY (`DispenseTableID`) REFERENCES `dispensedreports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dispensedmedicines_ibfk_41` FOREIGN KEY (`DispenseTableID`) REFERENCES `dispensedreports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dispensedmedicines_ibfk_42` FOREIGN KEY (`DispenseTableID`) REFERENCES `dispensedreports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dispensedmedicines_ibfk_43` FOREIGN KEY (`DispenseTableID`) REFERENCES `dispensedreports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dispensedmedicines_ibfk_44` FOREIGN KEY (`DispenseTableID`) REFERENCES `dispensedreports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dispensedmedicines_ibfk_45` FOREIGN KEY (`DispenseTableID`) REFERENCES `dispensedreports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dispensedmedicines_ibfk_46` FOREIGN KEY (`DispenseTableID`) REFERENCES `dispensedreports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dispensedmedicines_ibfk_47` FOREIGN KEY (`DispenseTableID`) REFERENCES `dispensedreports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dispensedmedicines_ibfk_48` FOREIGN KEY (`DispenseTableID`) REFERENCES `dispensedreports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dispensedmedicines_ibfk_49` FOREIGN KEY (`DispenseTableID`) REFERENCES `dispensedreports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dispensedmedicines_ibfk_5` FOREIGN KEY (`DispenseTableID`) REFERENCES `dispensedreports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dispensedmedicines_ibfk_50` FOREIGN KEY (`DispenseTableID`) REFERENCES `dispensedreports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dispensedmedicines_ibfk_51` FOREIGN KEY (`DispenseTableID`) REFERENCES `dispensedreports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dispensedmedicines_ibfk_52` FOREIGN KEY (`DispenseTableID`) REFERENCES `dispensedreports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dispensedmedicines_ibfk_53` FOREIGN KEY (`DispenseTableID`) REFERENCES `dispensedreports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dispensedmedicines_ibfk_54` FOREIGN KEY (`DispenseTableID`) REFERENCES `dispensedreports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dispensedmedicines_ibfk_55` FOREIGN KEY (`DispenseTableID`) REFERENCES `dispensedreports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dispensedmedicines_ibfk_56` FOREIGN KEY (`DispenseTableID`) REFERENCES `dispensedreports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dispensedmedicines_ibfk_57` FOREIGN KEY (`DispenseTableID`) REFERENCES `dispensedreports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dispensedmedicines_ibfk_58` FOREIGN KEY (`DispenseTableID`) REFERENCES `dispensedreports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dispensedmedicines_ibfk_59` FOREIGN KEY (`DispenseTableID`) REFERENCES `dispensedreports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dispensedmedicines_ibfk_6` FOREIGN KEY (`DispenseTableID`) REFERENCES `dispensedreports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dispensedmedicines_ibfk_60` FOREIGN KEY (`DispenseTableID`) REFERENCES `dispensedreports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dispensedmedicines_ibfk_61` FOREIGN KEY (`DispenseTableID`) REFERENCES `dispensedreports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dispensedmedicines_ibfk_62` FOREIGN KEY (`DispenseTableID`) REFERENCES `dispensedreports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dispensedmedicines_ibfk_63` FOREIGN KEY (`DispenseTableID`) REFERENCES `dispensedreports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dispensedmedicines_ibfk_64` FOREIGN KEY (`DispenseTableID`) REFERENCES `dispensedreports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dispensedmedicines_ibfk_7` FOREIGN KEY (`DispenseTableID`) REFERENCES `dispensedreports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dispensedmedicines_ibfk_8` FOREIGN KEY (`DispenseTableID`) REFERENCES `dispensedreports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dispensedmedicines_ibfk_9` FOREIGN KEY (`DispenseTableID`) REFERENCES `dispensedreports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 19 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: dispensedreports
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `dispensedreports` (
  `id` int NOT NULL AUTO_INCREMENT,
  `PatientName` varchar(255) NOT NULL,
  `patient_Id` int NOT NULL,
  `doctor_Id` int NOT NULL,
  `DispenseID` varchar(255) NOT NULL,
  `prescription_Id` int NOT NULL,
  `PrescriptionID` varchar(255) NOT NULL,
  `PrescriptionDate` datetime NOT NULL,
  `PriscribedDoctor` varchar(255) NOT NULL,
  `PrescriptionType` varchar(255) DEFAULT NULL,
  `prescriptionImage` longblob,
  `DoctorRegNo` varchar(255) NOT NULL,
  `totalMedicineAmount` float(5, 2) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `TotalFees` decimal(10, 2) DEFAULT NULL,
  `Currency` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 22 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: doctors
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `doctors` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Dr` varchar(255) DEFAULT 'DR',
  `username` varchar(255) DEFAULT NULL,
  `FirstName` varchar(255) NOT NULL,
  `MiddleName` varchar(255) DEFAULT NULL,
  `LastName` varchar(255) NOT NULL,
  `registrationNo` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `phoneNo` bigint NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `signatureImage` longblob,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `email_2` (`email`),
  UNIQUE KEY `email_3` (`email`),
  UNIQUE KEY `email_4` (`email`),
  UNIQUE KEY `email_5` (`email`),
  UNIQUE KEY `email_7` (`email`),
  UNIQUE KEY `email_8` (`email`),
  UNIQUE KEY `email_9` (`email`),
  UNIQUE KEY `email_10` (`email`),
  UNIQUE KEY `email_11` (`email`),
  UNIQUE KEY `email_12` (`email`),
  UNIQUE KEY `email_13` (`email`),
  UNIQUE KEY `email_14` (`email`),
  UNIQUE KEY `email_15` (`email`),
  UNIQUE KEY `email_16` (`email`),
  UNIQUE KEY `email_17` (`email`),
  UNIQUE KEY `email_18` (`email`),
  UNIQUE KEY `email_19` (`email`),
  UNIQUE KEY `email_20` (`email`),
  UNIQUE KEY `email_21` (`email`),
  UNIQUE KEY `email_22` (`email`),
  UNIQUE KEY `email_23` (`email`),
  UNIQUE KEY `email_24` (`email`),
  UNIQUE KEY `email_25` (`email`),
  UNIQUE KEY `email_26` (`email`),
  UNIQUE KEY `email_27` (`email`),
  UNIQUE KEY `email_28` (`email`),
  UNIQUE KEY `email_29` (`email`),
  UNIQUE KEY `email_30` (`email`),
  UNIQUE KEY `email_31` (`email`),
  UNIQUE KEY `email_32` (`email`),
  UNIQUE KEY `email_6` (`email`),
  UNIQUE KEY `phoneNo` (`phoneNo`),
  UNIQUE KEY `phoneNo_2` (`phoneNo`),
  UNIQUE KEY `phoneNo_3` (`phoneNo`),
  UNIQUE KEY `phoneNo_4` (`phoneNo`),
  UNIQUE KEY `phoneNo_5` (`phoneNo`),
  UNIQUE KEY `phoneNo_6` (`phoneNo`),
  UNIQUE KEY `phoneNo_7` (`phoneNo`),
  UNIQUE KEY `phoneNo_8` (`phoneNo`),
  UNIQUE KEY `phoneNo_9` (`phoneNo`),
  UNIQUE KEY `phoneNo_10` (`phoneNo`),
  UNIQUE KEY `phoneNo_11` (`phoneNo`),
  UNIQUE KEY `phoneNo_12` (`phoneNo`),
  UNIQUE KEY `phoneNo_13` (`phoneNo`),
  UNIQUE KEY `phoneNo_14` (`phoneNo`),
  UNIQUE KEY `phoneNo_15` (`phoneNo`),
  UNIQUE KEY `phoneNo_16` (`phoneNo`),
  UNIQUE KEY `phoneNo_17` (`phoneNo`),
  UNIQUE KEY `phoneNo_18` (`phoneNo`),
  UNIQUE KEY `phoneNo_19` (`phoneNo`),
  UNIQUE KEY `phoneNo_20` (`phoneNo`),
  UNIQUE KEY `phoneNo_21` (`phoneNo`),
  UNIQUE KEY `phoneNo_22` (`phoneNo`),
  UNIQUE KEY `phoneNo_23` (`phoneNo`),
  UNIQUE KEY `phoneNo_24` (`phoneNo`),
  UNIQUE KEY `phoneNo_25` (`phoneNo`),
  UNIQUE KEY `phoneNo_26` (`phoneNo`),
  UNIQUE KEY `phoneNo_27` (`phoneNo`),
  UNIQUE KEY `phoneNo_28` (`phoneNo`),
  UNIQUE KEY `phoneNo_29` (`phoneNo`),
  UNIQUE KEY `phoneNo_30` (`phoneNo`),
  UNIQUE KEY `phoneNo_31` (`phoneNo`)
) ENGINE = InnoDB AUTO_INCREMENT = 3 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: doctorsappointments
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `doctorsappointments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `doctorId` int NOT NULL,
  `patientId` int NOT NULL,
  `PatientName` varchar(255) NOT NULL,
  `PatientPhone` bigint NOT NULL,
  `DoctorPhone` bigint NOT NULL,
  `DoctorName` varchar(255) NOT NULL,
  `bookingStartDate` varchar(255) NOT NULL,
  `remarks` text,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL,
  `DoctorEmail` varchar(255) NOT NULL,
  `paymentStatus` varchar(255) NOT NULL,
  `paymentDateTime` varchar(255) DEFAULT NULL,
  `amount` int DEFAULT '0',
  `bookingEndDate` varchar(255) NOT NULL,
  `image` longtext,
  `CorporateID` varchar(255) DEFAULT NULL,
  `BookingStatus` varchar(255) DEFAULT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `visitType` varchar(255) DEFAULT NULL,
  `Currency` varchar(255) DEFAULT NULL,
  `admissionID` int DEFAULT '0',
  `procedure` varchar(255) DEFAULT 'Doctor Visit',
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 65 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: drugdatabases
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `drugdatabases` (
  `id` int NOT NULL AUTO_INCREMENT,
  `medicineName` longtext,
  `manufacturer` longtext,
  `saltComposition` longtext,
  `packaging` longtext,
  `price` float(5, 2) DEFAULT NULL,
  `storage` varchar(255) DEFAULT NULL,
  `overview` longtext,
  `usesBenefits` longtext,
  `sideEffects` longtext,
  `howToUse` longtext,
  `drugWorks` longtext,
  `safetyAdvice` longtext,
  `missedDose` longtext,
  `quickTips` longtext,
  `interactionDrugs` longtext,
  `patientConcerns` longtext,
  `userFeedback` longtext,
  `faqs` longtext,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `Currency` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 20 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: healthtestpackagemodels
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `healthtestpackagemodels` (
  `id` int NOT NULL AUTO_INCREMENT,
  `packageName` varchar(255) NOT NULL,
  `MRPOfPackage` int NOT NULL,
  `discount` int DEFAULT NULL,
  `finalPrice` decimal(10, 2) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `Currency` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 3 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: hospitaladminregistrations
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `hospitaladminregistrations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) DEFAULT NULL,
  `firstName` varchar(255) NOT NULL,
  `middleName` varchar(255) DEFAULT NULL,
  `lastName` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `phoneNo` bigint NOT NULL,
  `email` varchar(255) NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL,
  `hospitalId` int DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `phoneNo` (`phoneNo`),
  UNIQUE KEY `phoneNo_2` (`phoneNo`),
  UNIQUE KEY `phoneNo_3` (`phoneNo`),
  UNIQUE KEY `phoneNo_4` (`phoneNo`),
  UNIQUE KEY `phoneNo_5` (`phoneNo`),
  UNIQUE KEY `phoneNo_6` (`phoneNo`),
  UNIQUE KEY `phoneNo_7` (`phoneNo`),
  UNIQUE KEY `phoneNo_8` (`phoneNo`),
  UNIQUE KEY `phoneNo_9` (`phoneNo`),
  UNIQUE KEY `phoneNo_10` (`phoneNo`),
  UNIQUE KEY `phoneNo_11` (`phoneNo`),
  UNIQUE KEY `phoneNo_12` (`phoneNo`),
  UNIQUE KEY `phoneNo_13` (`phoneNo`),
  UNIQUE KEY `phoneNo_14` (`phoneNo`),
  UNIQUE KEY `phoneNo_15` (`phoneNo`),
  UNIQUE KEY `phoneNo_16` (`phoneNo`),
  UNIQUE KEY `phoneNo_17` (`phoneNo`),
  UNIQUE KEY `phoneNo_18` (`phoneNo`),
  UNIQUE KEY `phoneNo_19` (`phoneNo`),
  UNIQUE KEY `phoneNo_20` (`phoneNo`),
  UNIQUE KEY `phoneNo_21` (`phoneNo`),
  UNIQUE KEY `phoneNo_22` (`phoneNo`),
  UNIQUE KEY `phoneNo_23` (`phoneNo`),
  UNIQUE KEY `phoneNo_24` (`phoneNo`),
  UNIQUE KEY `phoneNo_25` (`phoneNo`),
  UNIQUE KEY `phoneNo_26` (`phoneNo`),
  UNIQUE KEY `phoneNo_27` (`phoneNo`),
  UNIQUE KEY `phoneNo_28` (`phoneNo`),
  UNIQUE KEY `phoneNo_29` (`phoneNo`),
  UNIQUE KEY `phoneNo_30` (`phoneNo`),
  UNIQUE KEY `phoneNo_31` (`phoneNo`),
  UNIQUE KEY `phoneNo_32` (`phoneNo`),
  UNIQUE KEY `phoneNo_33` (`phoneNo`),
  UNIQUE KEY `phoneNo_34` (`phoneNo`),
  UNIQUE KEY `phoneNo_35` (`phoneNo`),
  UNIQUE KEY `phoneNo_36` (`phoneNo`),
  UNIQUE KEY `phoneNo_37` (`phoneNo`),
  UNIQUE KEY `phoneNo_38` (`phoneNo`),
  UNIQUE KEY `phoneNo_39` (`phoneNo`),
  UNIQUE KEY `phoneNo_40` (`phoneNo`),
  UNIQUE KEY `phoneNo_41` (`phoneNo`),
  UNIQUE KEY `phoneNo_42` (`phoneNo`),
  UNIQUE KEY `phoneNo_43` (`phoneNo`),
  UNIQUE KEY `phoneNo_44` (`phoneNo`),
  UNIQUE KEY `phoneNo_45` (`phoneNo`),
  UNIQUE KEY `phoneNo_46` (`phoneNo`),
  UNIQUE KEY `phoneNo_47` (`phoneNo`),
  UNIQUE KEY `phoneNo_48` (`phoneNo`),
  UNIQUE KEY `phoneNo_49` (`phoneNo`),
  UNIQUE KEY `phoneNo_50` (`phoneNo`),
  UNIQUE KEY `phoneNo_51` (`phoneNo`),
  UNIQUE KEY `phoneNo_52` (`phoneNo`),
  UNIQUE KEY `phoneNo_53` (`phoneNo`),
  UNIQUE KEY `phoneNo_54` (`phoneNo`),
  UNIQUE KEY `phoneNo_55` (`phoneNo`),
  UNIQUE KEY `phoneNo_56` (`phoneNo`),
  UNIQUE KEY `phoneNo_57` (`phoneNo`),
  UNIQUE KEY `phoneNo_58` (`phoneNo`),
  UNIQUE KEY `phoneNo_59` (`phoneNo`),
  UNIQUE KEY `phoneNo_60` (`phoneNo`),
  UNIQUE KEY `phoneNo_61` (`phoneNo`),
  UNIQUE KEY `phoneNo_62` (`phoneNo`),
  UNIQUE KEY `phoneNo_63` (`phoneNo`)
) ENGINE = InnoDB AUTO_INCREMENT = 10 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: hospitaladmissions
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `hospitaladmissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `PatientName` varchar(255) NOT NULL,
  `PatientID` int NOT NULL,
  `AdmissionDate` varchar(255) NOT NULL,
  `PatientPhoneNo` bigint NOT NULL,
  `AdmittingPhysician` varchar(255) NOT NULL,
  `AdmittingPhysicianPhone` bigint NOT NULL,
  `AdmittingPhysicianID` varchar(255) NOT NULL,
  `ReferringPhysician` varchar(255) NOT NULL,
  `ReferringPhysicianPhone` bigint NOT NULL,
  `ReferringPhysicianID` int NOT NULL,
  `ReasonForAdmission` varchar(255) NOT NULL,
  `AdvanceAmount` int NOT NULL,
  `PaymentOption` varchar(255) NOT NULL,
  `PaymentDate` varchar(255) NOT NULL,
  `PreviousHospitalizations` varchar(255) NOT NULL,
  `ChronicConditions` varchar(255) NOT NULL,
  `Medications` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `RoomNumber` int NOT NULL,
  `BedNumber` int NOT NULL,
  `BedType` varchar(255) NOT NULL,
  `CheckInTime` varchar(255) NOT NULL,
  `CheckOutTime` varchar(255) NOT NULL,
  `Currency` varchar(255) NOT NULL,
  `PaymentStatus` varchar(255) NOT NULL,
  `AdmissionType` varchar(255) NOT NULL,
  `TreatmentPlan` longtext NOT NULL,
  `patientCondition` longtext,
  `BillingInformation` longtext,
  `InsuranceClaimDetails` longtext,
  `PaymentStatusDischarge` longtext,
  `nursingNotes` longtext,
  `physicianNotes` longtext,
  `DischargeDate` varchar(255) DEFAULT NULL,
  `DischargeInstruction` longtext,
  `FollowUpAppointments` varchar(255) DEFAULT NULL,
  `summaryOfTreatment` longtext,
  `postDischargeCare` longtext,
  `transferInformation` longtext,
  `transferFacility` longtext,
  `transferDateTime` longtext,
  `PatientSignature` varchar(255) DEFAULT 'NA',
  `AuthorizedConsent` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 5 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: hospitalmains
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `hospitalmains` (
  `id` int NOT NULL AUTO_INCREMENT,
  `hospitalName` varchar(255) DEFAULT NULL,
  `hospitalURL` varchar(255) DEFAULT NULL,
  `HospitalGUID` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `databaseName` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `hospitalName` (`hospitalName`),
  UNIQUE KEY `HospitalGUID` (`HospitalGUID`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `databaseName` (`databaseName`),
  UNIQUE KEY `hospitalName_2` (`hospitalName`),
  UNIQUE KEY `HospitalGUID_2` (`HospitalGUID`),
  UNIQUE KEY `name_2` (`name`),
  UNIQUE KEY `databaseName_2` (`databaseName`),
  UNIQUE KEY `hospitalName_3` (`hospitalName`),
  UNIQUE KEY `HospitalGUID_3` (`HospitalGUID`),
  UNIQUE KEY `name_3` (`name`),
  UNIQUE KEY `databaseName_3` (`databaseName`),
  UNIQUE KEY `hospitalName_4` (`hospitalName`),
  UNIQUE KEY `HospitalGUID_4` (`HospitalGUID`),
  UNIQUE KEY `name_4` (`name`),
  UNIQUE KEY `databaseName_4` (`databaseName`),
  UNIQUE KEY `hospitalName_5` (`hospitalName`),
  UNIQUE KEY `HospitalGUID_5` (`HospitalGUID`),
  UNIQUE KEY `name_5` (`name`),
  UNIQUE KEY `databaseName_5` (`databaseName`),
  UNIQUE KEY `hospitalName_6` (`hospitalName`),
  UNIQUE KEY `HospitalGUID_6` (`HospitalGUID`),
  UNIQUE KEY `name_6` (`name`),
  UNIQUE KEY `databaseName_6` (`databaseName`),
  UNIQUE KEY `hospitalName_7` (`hospitalName`),
  UNIQUE KEY `HospitalGUID_7` (`HospitalGUID`),
  UNIQUE KEY `name_7` (`name`),
  UNIQUE KEY `databaseName_7` (`databaseName`),
  UNIQUE KEY `hospitalName_8` (`hospitalName`),
  UNIQUE KEY `HospitalGUID_8` (`HospitalGUID`),
  UNIQUE KEY `name_8` (`name`),
  UNIQUE KEY `databaseName_8` (`databaseName`),
  UNIQUE KEY `hospitalName_9` (`hospitalName`),
  UNIQUE KEY `HospitalGUID_9` (`HospitalGUID`),
  UNIQUE KEY `name_9` (`name`),
  UNIQUE KEY `databaseName_9` (`databaseName`),
  UNIQUE KEY `hospitalName_10` (`hospitalName`),
  UNIQUE KEY `HospitalGUID_10` (`HospitalGUID`),
  UNIQUE KEY `name_10` (`name`),
  UNIQUE KEY `databaseName_10` (`databaseName`),
  UNIQUE KEY `hospitalName_11` (`hospitalName`),
  UNIQUE KEY `HospitalGUID_11` (`HospitalGUID`),
  UNIQUE KEY `name_11` (`name`),
  UNIQUE KEY `databaseName_11` (`databaseName`),
  UNIQUE KEY `hospitalName_12` (`hospitalName`),
  UNIQUE KEY `HospitalGUID_12` (`HospitalGUID`),
  UNIQUE KEY `name_12` (`name`),
  UNIQUE KEY `databaseName_12` (`databaseName`),
  UNIQUE KEY `hospitalName_13` (`hospitalName`),
  UNIQUE KEY `HospitalGUID_13` (`HospitalGUID`),
  UNIQUE KEY `name_13` (`name`),
  UNIQUE KEY `databaseName_13` (`databaseName`),
  UNIQUE KEY `hospitalName_14` (`hospitalName`),
  UNIQUE KEY `HospitalGUID_14` (`HospitalGUID`),
  UNIQUE KEY `name_14` (`name`),
  UNIQUE KEY `databaseName_14` (`databaseName`),
  UNIQUE KEY `hospitalName_15` (`hospitalName`),
  UNIQUE KEY `HospitalGUID_15` (`HospitalGUID`),
  UNIQUE KEY `name_15` (`name`),
  UNIQUE KEY `databaseName_15` (`databaseName`),
  UNIQUE KEY `hospitalName_16` (`hospitalName`),
  UNIQUE KEY `HospitalGUID_16` (`HospitalGUID`),
  UNIQUE KEY `name_16` (`name`)
) ENGINE = InnoDB AUTO_INCREMENT = 5 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: hospitalrooms
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `hospitalrooms` (
  `id` int NOT NULL AUTO_INCREMENT,
  `department` longtext,
  `name` longtext,
  `type` longtext,
  `number` int DEFAULT NULL,
  `number_of_beds` int DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `totalCost` int DEFAULT NULL,
  `currency` varchar(255) DEFAULT NULL,
  `bedCost` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 8 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: hospitals
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `hospitals` (
  `id` int NOT NULL AUTO_INCREMENT,
  `hospitalName` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `pincode` varchar(255) DEFAULT NULL,
  `registrationNo` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `hospitalAdminEmail` varchar(255) DEFAULT NULL,
  `phone` bigint DEFAULT NULL,
  `landline` varchar(255) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `HospitalUserName` varchar(255) DEFAULT NULL,
  `HospitalID_MainDatabase` int DEFAULT NULL,
  `HospitalGUID` varchar(255) DEFAULT NULL,
  `baseCurrency` varchar(255) DEFAULT NULL,
  `OptionalCurrency` json NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `HospitalUserName` (`HospitalUserName`),
  UNIQUE KEY `HospitalID_MainDatabase` (`HospitalID_MainDatabase`),
  UNIQUE KEY `HospitalGUID` (`HospitalGUID`),
  UNIQUE KEY `HospitalUserName_2` (`HospitalUserName`),
  UNIQUE KEY `HospitalID_MainDatabase_2` (`HospitalID_MainDatabase`),
  UNIQUE KEY `HospitalGUID_2` (`HospitalGUID`),
  UNIQUE KEY `HospitalUserName_3` (`HospitalUserName`),
  UNIQUE KEY `HospitalID_MainDatabase_3` (`HospitalID_MainDatabase`),
  UNIQUE KEY `HospitalGUID_3` (`HospitalGUID`),
  UNIQUE KEY `HospitalUserName_4` (`HospitalUserName`),
  UNIQUE KEY `HospitalID_MainDatabase_4` (`HospitalID_MainDatabase`),
  UNIQUE KEY `HospitalGUID_4` (`HospitalGUID`),
  UNIQUE KEY `HospitalUserName_5` (`HospitalUserName`),
  UNIQUE KEY `HospitalID_MainDatabase_5` (`HospitalID_MainDatabase`),
  UNIQUE KEY `HospitalGUID_5` (`HospitalGUID`),
  UNIQUE KEY `HospitalUserName_6` (`HospitalUserName`),
  UNIQUE KEY `HospitalID_MainDatabase_6` (`HospitalID_MainDatabase`),
  UNIQUE KEY `HospitalGUID_6` (`HospitalGUID`),
  UNIQUE KEY `HospitalUserName_7` (`HospitalUserName`),
  UNIQUE KEY `HospitalID_MainDatabase_7` (`HospitalID_MainDatabase`),
  UNIQUE KEY `HospitalGUID_7` (`HospitalGUID`),
  UNIQUE KEY `HospitalUserName_8` (`HospitalUserName`),
  UNIQUE KEY `HospitalID_MainDatabase_8` (`HospitalID_MainDatabase`),
  UNIQUE KEY `HospitalGUID_8` (`HospitalGUID`),
  UNIQUE KEY `HospitalUserName_9` (`HospitalUserName`),
  UNIQUE KEY `HospitalID_MainDatabase_9` (`HospitalID_MainDatabase`),
  UNIQUE KEY `HospitalGUID_9` (`HospitalGUID`),
  UNIQUE KEY `HospitalUserName_10` (`HospitalUserName`),
  UNIQUE KEY `HospitalID_MainDatabase_10` (`HospitalID_MainDatabase`),
  UNIQUE KEY `HospitalGUID_10` (`HospitalGUID`),
  UNIQUE KEY `HospitalUserName_11` (`HospitalUserName`),
  UNIQUE KEY `HospitalID_MainDatabase_11` (`HospitalID_MainDatabase`),
  UNIQUE KEY `HospitalGUID_11` (`HospitalGUID`),
  UNIQUE KEY `HospitalUserName_12` (`HospitalUserName`),
  UNIQUE KEY `HospitalID_MainDatabase_12` (`HospitalID_MainDatabase`),
  UNIQUE KEY `HospitalGUID_12` (`HospitalGUID`),
  UNIQUE KEY `HospitalUserName_13` (`HospitalUserName`),
  UNIQUE KEY `HospitalID_MainDatabase_13` (`HospitalID_MainDatabase`),
  UNIQUE KEY `HospitalGUID_13` (`HospitalGUID`),
  UNIQUE KEY `HospitalUserName_14` (`HospitalUserName`),
  UNIQUE KEY `HospitalID_MainDatabase_14` (`HospitalID_MainDatabase`),
  UNIQUE KEY `HospitalGUID_14` (`HospitalGUID`),
  UNIQUE KEY `HospitalUserName_15` (`HospitalUserName`),
  UNIQUE KEY `HospitalID_MainDatabase_15` (`HospitalID_MainDatabase`),
  UNIQUE KEY `HospitalGUID_15` (`HospitalGUID`),
  UNIQUE KEY `HospitalUserName_16` (`HospitalUserName`),
  UNIQUE KEY `HospitalID_MainDatabase_16` (`HospitalID_MainDatabase`),
  UNIQUE KEY `HospitalGUID_16` (`HospitalGUID`),
  UNIQUE KEY `HospitalUserName_17` (`HospitalUserName`),
  UNIQUE KEY `HospitalID_MainDatabase_17` (`HospitalID_MainDatabase`),
  UNIQUE KEY `HospitalGUID_17` (`HospitalGUID`)
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: inventries
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `inventries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `SKU` varchar(255) DEFAULT NULL,
  `itemName` varchar(255) DEFAULT NULL,
  `composition` longtext,
  `description` longtext,
  `unitPrice` float(5, 2) DEFAULT NULL,
  `batchNo` varchar(255) DEFAULT NULL,
  `expiryDate` date DEFAULT NULL,
  `unit` varchar(255) DEFAULT NULL,
  `dateIn` date DEFAULT NULL,
  `quantityIn` int DEFAULT NULL,
  `dateOut` date DEFAULT NULL,
  `quantityOut` int DEFAULT NULL,
  `balanceQuantity` bigint DEFAULT NULL,
  `AverageMonthlyQuantityOut` int DEFAULT '0',
  `AverageWeeklyQuantityOut` int DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `Currency` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 47 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: jhnew27resultmodels
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `jhnew27resultmodels` (
  `id` int NOT NULL AUTO_INCREMENT,
  `PatientID` int NOT NULL,
  `TestManagementID` int NOT NULL,
  `Comment` longtext,
  `PatientTestBookingID` int NOT NULL,
  `NA27` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `jj` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: labcategorylists
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `labcategorylists` (
  `id` int NOT NULL AUTO_INCREMENT,
  `CategoryName` varchar(255) DEFAULT NULL,
  `LabCode` varchar(255) NOT NULL,
  `Status` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 5 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: lipidprofilemodels
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `lipidprofilemodels` (
  `id` int NOT NULL AUTO_INCREMENT,
  `PatientID` int NOT NULL,
  `TestManagementID` int NOT NULL,
  `PatientTestBookingID` int NOT NULL,
  `Sr_Cholesterol` varchar(255) NOT NULL,
  `HDL_Cholesterol` varchar(255) NOT NULL,
  `Sr_Triglycerides` varchar(255) NOT NULL,
  `LDL_Cholesterol` varchar(255) NOT NULL,
  `VLDL` varchar(255) NOT NULL,
  `Cholesterol_HDL` varchar(255) NOT NULL,
  `LDL_HDL` varchar(255) NOT NULL,
  `resultDate` varchar(255) DEFAULT NULL,
  `Remarks` longtext,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: lipidprofileresultmodels
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `lipidprofileresultmodels` (
  `id` int NOT NULL AUTO_INCREMENT,
  `PatientID` int NOT NULL,
  `TestManagementID` int NOT NULL,
  `PatientTestBookingID` int NOT NULL,
  `Sr_Cholesterol` varchar(255) DEFAULT NULL,
  `HDL_Cholesterol` varchar(255) DEFAULT NULL,
  `Sr_Triglycerides` varchar(255) DEFAULT NULL,
  `LDL_Cholesterol` varchar(255) DEFAULT NULL,
  `VLDL` varchar(255) DEFAULT NULL,
  `Cholesterol_HDL` varchar(255) DEFAULT NULL,
  `LDL_HDL` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `Comment` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 13 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: medicationdays
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `medicationdays` (
  `id` int NOT NULL AUTO_INCREMENT,
  `PatientId` int DEFAULT NULL,
  `PrescriptionId` int DEFAULT NULL,
  `medicineId` int DEFAULT NULL,
  `medicineName` varchar(255) DEFAULT NULL,
  `dosageAmount` varchar(255) DEFAULT NULL,
  `food` varchar(255) DEFAULT NULL,
  `morningTime` time DEFAULT NULL,
  `afternoonTime` time DEFAULT NULL,
  `eveningTime` time DEFAULT NULL,
  `nightTime` time DEFAULT NULL,
  `date` date DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `PrescriptionId` (`PrescriptionId`),
  CONSTRAINT `medicationdays_ibfk_1` FOREIGN KEY (`PrescriptionId`) REFERENCES `patientprecriptions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `medicationdays_ibfk_10` FOREIGN KEY (`PrescriptionId`) REFERENCES `patientprecriptions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `medicationdays_ibfk_11` FOREIGN KEY (`PrescriptionId`) REFERENCES `patientprecriptions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `medicationdays_ibfk_12` FOREIGN KEY (`PrescriptionId`) REFERENCES `patientprecriptions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `medicationdays_ibfk_13` FOREIGN KEY (`PrescriptionId`) REFERENCES `patientprecriptions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `medicationdays_ibfk_14` FOREIGN KEY (`PrescriptionId`) REFERENCES `patientprecriptions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `medicationdays_ibfk_15` FOREIGN KEY (`PrescriptionId`) REFERENCES `patientprecriptions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `medicationdays_ibfk_16` FOREIGN KEY (`PrescriptionId`) REFERENCES `patientprecriptions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `medicationdays_ibfk_17` FOREIGN KEY (`PrescriptionId`) REFERENCES `patientprecriptions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `medicationdays_ibfk_18` FOREIGN KEY (`PrescriptionId`) REFERENCES `patientprecriptions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `medicationdays_ibfk_19` FOREIGN KEY (`PrescriptionId`) REFERENCES `patientprecriptions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `medicationdays_ibfk_2` FOREIGN KEY (`PrescriptionId`) REFERENCES `patientprecriptions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `medicationdays_ibfk_20` FOREIGN KEY (`PrescriptionId`) REFERENCES `patientprecriptions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `medicationdays_ibfk_21` FOREIGN KEY (`PrescriptionId`) REFERENCES `patientprecriptions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `medicationdays_ibfk_22` FOREIGN KEY (`PrescriptionId`) REFERENCES `patientprecriptions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `medicationdays_ibfk_23` FOREIGN KEY (`PrescriptionId`) REFERENCES `patientprecriptions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `medicationdays_ibfk_3` FOREIGN KEY (`PrescriptionId`) REFERENCES `patientprecriptions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `medicationdays_ibfk_4` FOREIGN KEY (`PrescriptionId`) REFERENCES `patientprecriptions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `medicationdays_ibfk_5` FOREIGN KEY (`PrescriptionId`) REFERENCES `patientprecriptions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `medicationdays_ibfk_6` FOREIGN KEY (`PrescriptionId`) REFERENCES `patientprecriptions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `medicationdays_ibfk_7` FOREIGN KEY (`PrescriptionId`) REFERENCES `patientprecriptions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `medicationdays_ibfk_8` FOREIGN KEY (`PrescriptionId`) REFERENCES `patientprecriptions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `medicationdays_ibfk_9` FOREIGN KEY (`PrescriptionId`) REFERENCES `patientprecriptions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: medicineadministrationreports
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `medicineadministrationreports` (
  `id` int NOT NULL AUTO_INCREMENT,
  `DispeningId` varchar(255) NOT NULL,
  `DispensationDate` date NOT NULL,
  `MedicineName` varchar(255) NOT NULL,
  `PatientId` int DEFAULT NULL,
  `Quantity` int NOT NULL,
  `Unit` varchar(255) NOT NULL,
  `PrescriptionId` varchar(255) NOT NULL,
  `PrescriptionDate` date NOT NULL,
  `PrescribedDoctor` varchar(255) NOT NULL,
  `PatientName` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: medicines
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `medicines` (
  `id` int NOT NULL AUTO_INCREMENT,
  `prescriptionId` varchar(255) DEFAULT NULL,
  `prescription_Id` int DEFAULT NULL,
  `patient_Id` int DEFAULT NULL,
  `InventoryitemNameID` int DEFAULT '0',
  `medicineName` varchar(255) NOT NULL,
  `quantity` int DEFAULT NULL,
  `dosageAmount` varchar(255) NOT NULL,
  `startDate` date NOT NULL,
  `food` varchar(255) NOT NULL,
  `weekly` varchar(255) NOT NULL,
  `timing` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `prescription_Id` (`prescription_Id`),
  CONSTRAINT `medicines_ibfk_1` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_10` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_100` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_101` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_11` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_12` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_13` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_14` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_15` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_16` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_17` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_18` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_19` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_2` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_20` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_21` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_22` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_23` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_24` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_25` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_26` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_27` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_28` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_29` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_3` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_30` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_31` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_32` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_33` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_34` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_35` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_36` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_37` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_38` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_39` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_4` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_40` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_41` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_42` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_43` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_44` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_45` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_46` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_47` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_48` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_49` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_5` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_50` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_51` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_52` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_53` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_54` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_55` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_56` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_57` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_58` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_59` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_6` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_60` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_61` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_62` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_63` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_64` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_65` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_66` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_67` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_68` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_69` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_7` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_70` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_71` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_72` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_73` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_74` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_75` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_76` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_77` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_78` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_79` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_8` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_80` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_81` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_82` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_83` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_84` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_85` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_86` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_87` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_88` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_89` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_9` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_90` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_91` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_92` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_93` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_94` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_95` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_96` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_97` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_98` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_99` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 9 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: nanresultmodeldiagnostics
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `nanresultmodeldiagnostics` (
  `id` int NOT NULL AUTO_INCREMENT,
  `PatientID` int NOT NULL,
  `TestManagementID` int NOT NULL,
  `Comment` longtext,
  `PatientTestBookingID` int NOT NULL,
  `New` longtext,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: new101resultmodels
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `new101resultmodels` (
  `id` int NOT NULL AUTO_INCREMENT,
  `PatientID` int NOT NULL,
  `TestManagementID` int NOT NULL,
  `Comment` longtext,
  `PatientTestBookingID` int NOT NULL,
  `jb` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: new19resultmodeldiagnostics
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `new19resultmodeldiagnostics` (
  `id` int NOT NULL AUTO_INCREMENT,
  `PatientID` int NOT NULL,
  `TestManagementID` int NOT NULL,
  `Comment` longtext,
  `PatientTestBookingID` int NOT NULL,
  `lab19` longtext,
  `lqb1919` longtext,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: new25testresultmodels
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `new25testresultmodels` (
  `id` int NOT NULL AUTO_INCREMENT,
  `PatientID` int NOT NULL,
  `TestManagementID` int NOT NULL,
  `Comment` longtext,
  `PatientTestBookingID` int NOT NULL,
  `test26` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: newtest26resultmodels
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `newtest26resultmodels` (
  `id` int NOT NULL AUTO_INCREMENT,
  `PatientID` int NOT NULL,
  `TestManagementID` int NOT NULL,
  `Comment` longtext,
  `PatientTestBookingID` int NOT NULL,
  `new26` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `jn` varchar(255) DEFAULT NULL,
  `jh` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: newtestresultmodeldiagnostics
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `newtestresultmodeldiagnostics` (
  `id` int NOT NULL AUTO_INCREMENT,
  `PatientID` int NOT NULL,
  `TestManagementID` int NOT NULL,
  `Comment` longtext,
  `PatientTestBookingID` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: newtestresultmodels
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `newtestresultmodels` (
  `id` int NOT NULL AUTO_INCREMENT,
  `PatientID` int NOT NULL,
  `TestManagementID` int NOT NULL,
  `PatientTestBookingID` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `newone` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: nurses
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `nurses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) DEFAULT NULL,
  `FirstName` varchar(255) NOT NULL,
  `MiddleName` varchar(255) DEFAULT NULL,
  `LastName` varchar(255) NOT NULL,
  `Address` varchar(255) NOT NULL,
  `phoneNo` bigint NOT NULL,
  `email` varchar(255) NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `phoneNo` (`phoneNo`),
  UNIQUE KEY `phoneNo_2` (`phoneNo`),
  UNIQUE KEY `phoneNo_3` (`phoneNo`),
  UNIQUE KEY `phoneNo_4` (`phoneNo`),
  UNIQUE KEY `phoneNo_5` (`phoneNo`),
  UNIQUE KEY `phoneNo_6` (`phoneNo`),
  UNIQUE KEY `phoneNo_7` (`phoneNo`),
  UNIQUE KEY `phoneNo_8` (`phoneNo`),
  UNIQUE KEY `phoneNo_9` (`phoneNo`),
  UNIQUE KEY `phoneNo_10` (`phoneNo`),
  UNIQUE KEY `phoneNo_11` (`phoneNo`),
  UNIQUE KEY `phoneNo_12` (`phoneNo`),
  UNIQUE KEY `phoneNo_13` (`phoneNo`),
  UNIQUE KEY `phoneNo_14` (`phoneNo`),
  UNIQUE KEY `phoneNo_15` (`phoneNo`),
  UNIQUE KEY `phoneNo_16` (`phoneNo`),
  UNIQUE KEY `phoneNo_17` (`phoneNo`),
  UNIQUE KEY `phoneNo_18` (`phoneNo`),
  UNIQUE KEY `phoneNo_19` (`phoneNo`),
  UNIQUE KEY `phoneNo_20` (`phoneNo`),
  UNIQUE KEY `phoneNo_21` (`phoneNo`),
  UNIQUE KEY `phoneNo_22` (`phoneNo`),
  UNIQUE KEY `phoneNo_23` (`phoneNo`),
  UNIQUE KEY `phoneNo_24` (`phoneNo`),
  UNIQUE KEY `phoneNo_25` (`phoneNo`),
  UNIQUE KEY `phoneNo_26` (`phoneNo`),
  UNIQUE KEY `phoneNo_27` (`phoneNo`),
  UNIQUE KEY `phoneNo_28` (`phoneNo`),
  UNIQUE KEY `phoneNo_29` (`phoneNo`),
  UNIQUE KEY `phoneNo_30` (`phoneNo`),
  UNIQUE KEY `phoneNo_31` (`phoneNo`),
  UNIQUE KEY `phoneNo_32` (`phoneNo`),
  UNIQUE KEY `phoneNo_33` (`phoneNo`),
  UNIQUE KEY `phoneNo_34` (`phoneNo`),
  UNIQUE KEY `phoneNo_35` (`phoneNo`),
  UNIQUE KEY `phoneNo_36` (`phoneNo`),
  UNIQUE KEY `phoneNo_37` (`phoneNo`),
  UNIQUE KEY `phoneNo_38` (`phoneNo`),
  UNIQUE KEY `phoneNo_39` (`phoneNo`),
  UNIQUE KEY `phoneNo_40` (`phoneNo`),
  UNIQUE KEY `phoneNo_41` (`phoneNo`),
  UNIQUE KEY `phoneNo_42` (`phoneNo`),
  UNIQUE KEY `phoneNo_43` (`phoneNo`),
  UNIQUE KEY `phoneNo_44` (`phoneNo`),
  UNIQUE KEY `phoneNo_45` (`phoneNo`),
  UNIQUE KEY `phoneNo_46` (`phoneNo`),
  UNIQUE KEY `phoneNo_47` (`phoneNo`),
  UNIQUE KEY `phoneNo_48` (`phoneNo`),
  UNIQUE KEY `phoneNo_49` (`phoneNo`),
  UNIQUE KEY `phoneNo_50` (`phoneNo`),
  UNIQUE KEY `phoneNo_51` (`phoneNo`),
  UNIQUE KEY `phoneNo_52` (`phoneNo`),
  UNIQUE KEY `phoneNo_53` (`phoneNo`),
  UNIQUE KEY `phoneNo_54` (`phoneNo`),
  UNIQUE KEY `phoneNo_55` (`phoneNo`),
  UNIQUE KEY `phoneNo_56` (`phoneNo`),
  UNIQUE KEY `phoneNo_57` (`phoneNo`),
  UNIQUE KEY `phoneNo_58` (`phoneNo`),
  UNIQUE KEY `phoneNo_59` (`phoneNo`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: nw31resultmodels
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `nw31resultmodels` (
  `id` int NOT NULL AUTO_INCREMENT,
  `PatientID` int NOT NULL,
  `TestManagementID` int NOT NULL,
  `Comment` longtext,
  `PatientTestBookingID` int NOT NULL,
  `new100` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: otnameandnumbers
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `otnameandnumbers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `OTName` varchar(255) DEFAULT NULL,
  `OTNumber` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 4 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: otschedulepatients
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `otschedulepatients` (
  `id` int NOT NULL AUTO_INCREMENT,
  `otDateTime` varchar(255) DEFAULT NULL,
  `UpToOtTime` varchar(255) DEFAULT NULL,
  `patientName` varchar(255) DEFAULT NULL,
  `patientId` int DEFAULT NULL,
  `patientContactNumber` bigint DEFAULT NULL,
  `guardianName` varchar(255) DEFAULT NULL,
  `guardianContactNo` bigint DEFAULT NULL,
  `diagnosis` longtext,
  `typeOfSurgery` longtext,
  `surgeonName` varchar(255) DEFAULT NULL,
  `surgeonEmail` varchar(255) DEFAULT NULL,
  `external` varchar(255) DEFAULT NULL,
  `OTName` varchar(255) DEFAULT NULL,
  `anesthetistAssistantName` varchar(255) DEFAULT NULL,
  `anesthesia` varchar(255) DEFAULT NULL,
  `scrubNurseName` varchar(255) DEFAULT NULL,
  `remarks` longtext,
  `otAssistantName` varchar(255) DEFAULT NULL,
  `procedure` longtext,
  `anesthetistDoctorName` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `admissionID` int DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `otDateTime` (`otDateTime`),
  UNIQUE KEY `otDateTime_2` (`otDateTime`),
  UNIQUE KEY `otDateTime_3` (`otDateTime`),
  UNIQUE KEY `otDateTime_4` (`otDateTime`),
  UNIQUE KEY `otDateTime_5` (`otDateTime`),
  UNIQUE KEY `otDateTime_6` (`otDateTime`),
  UNIQUE KEY `otDateTime_7` (`otDateTime`),
  UNIQUE KEY `otDateTime_8` (`otDateTime`),
  UNIQUE KEY `otDateTime_9` (`otDateTime`),
  UNIQUE KEY `otDateTime_10` (`otDateTime`),
  UNIQUE KEY `otDateTime_11` (`otDateTime`),
  UNIQUE KEY `otDateTime_12` (`otDateTime`),
  UNIQUE KEY `otDateTime_13` (`otDateTime`),
  UNIQUE KEY `otDateTime_14` (`otDateTime`),
  UNIQUE KEY `otDateTime_15` (`otDateTime`)
) ENGINE = InnoDB AUTO_INCREMENT = 4 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: pathologisttestbookingappointments
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `pathologisttestbookingappointments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `patientId` int NOT NULL,
  `PatientName` varchar(255) NOT NULL,
  `PatientPhone` bigint NOT NULL,
  `testManagementID` varchar(255) NOT NULL,
  `remarks` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: pathologytestmanages
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `pathologytestmanages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `testName` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `description` text,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL,
  `category` varchar(255) NOT NULL,
  `testPrice` int NOT NULL,
  `LabCategoryName` varchar(255) NOT NULL,
  `LabCategoryNameID` int NOT NULL,
  `SpecimenName` varchar(255) NOT NULL,
  `SpecimenNameID` int NOT NULL,
  `Currency` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  UNIQUE KEY `code_2` (`code`),
  UNIQUE KEY `code_3` (`code`),
  UNIQUE KEY `code_4` (`code`),
  UNIQUE KEY `code_5` (`code`),
  UNIQUE KEY `code_6` (`code`),
  UNIQUE KEY `code_7` (`code`),
  UNIQUE KEY `code_8` (`code`),
  UNIQUE KEY `code_9` (`code`),
  UNIQUE KEY `code_10` (`code`),
  UNIQUE KEY `code_11` (`code`),
  UNIQUE KEY `code_12` (`code`),
  UNIQUE KEY `code_13` (`code`),
  UNIQUE KEY `code_14` (`code`),
  UNIQUE KEY `code_15` (`code`),
  UNIQUE KEY `code_16` (`code`),
  UNIQUE KEY `code_17` (`code`),
  UNIQUE KEY `code_18` (`code`),
  UNIQUE KEY `code_19` (`code`),
  UNIQUE KEY `code_20` (`code`),
  UNIQUE KEY `code_21` (`code`),
  UNIQUE KEY `code_22` (`code`),
  UNIQUE KEY `code_23` (`code`),
  UNIQUE KEY `code_24` (`code`),
  UNIQUE KEY `code_25` (`code`),
  UNIQUE KEY `code_26` (`code`),
  UNIQUE KEY `code_27` (`code`),
  UNIQUE KEY `code_28` (`code`),
  UNIQUE KEY `code_29` (`code`),
  UNIQUE KEY `code_30` (`code`),
  UNIQUE KEY `code_31` (`code`),
  UNIQUE KEY `code_32` (`code`),
  UNIQUE KEY `code_33` (`code`),
  UNIQUE KEY `code_34` (`code`),
  UNIQUE KEY `code_35` (`code`),
  UNIQUE KEY `code_36` (`code`),
  UNIQUE KEY `code_37` (`code`),
  UNIQUE KEY `code_38` (`code`),
  UNIQUE KEY `code_39` (`code`),
  UNIQUE KEY `code_40` (`code`),
  UNIQUE KEY `code_41` (`code`),
  UNIQUE KEY `code_42` (`code`),
  UNIQUE KEY `code_43` (`code`),
  UNIQUE KEY `code_44` (`code`),
  UNIQUE KEY `code_45` (`code`),
  UNIQUE KEY `code_46` (`code`),
  UNIQUE KEY `code_47` (`code`),
  UNIQUE KEY `code_48` (`code`),
  UNIQUE KEY `code_49` (`code`),
  UNIQUE KEY `code_50` (`code`),
  UNIQUE KEY `code_51` (`code`),
  UNIQUE KEY `code_52` (`code`),
  UNIQUE KEY `code_53` (`code`),
  UNIQUE KEY `code_54` (`code`),
  UNIQUE KEY `code_55` (`code`),
  UNIQUE KEY `code_56` (`code`),
  UNIQUE KEY `code_57` (`code`),
  UNIQUE KEY `code_58` (`code`),
  UNIQUE KEY `code_59` (`code`),
  UNIQUE KEY `code_60` (`code`),
  UNIQUE KEY `code_61` (`code`),
  UNIQUE KEY `code_62` (`code`),
  UNIQUE KEY `code_63` (`code`)
) ENGINE = InnoDB AUTO_INCREMENT = 32 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: pathologytestreferrals
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `pathologytestreferrals` (
  `id` int NOT NULL AUTO_INCREMENT,
  `doctorId` int NOT NULL,
  `patientId` int NOT NULL,
  `commissionType` varchar(255) DEFAULT NULL,
  `commissionValue` varchar(255) DEFAULT NULL,
  `PatientName` varchar(255) NOT NULL,
  `PatientPhone` bigint NOT NULL,
  `DoctorPhone` bigint NOT NULL,
  `DoctorName` varchar(255) NOT NULL,
  `bookingDate` date NOT NULL,
  `bookingTime` time NOT NULL,
  `remarks` text,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: pathologytests
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `pathologytests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `PatientName` varchar(255) NOT NULL,
  `Address` varchar(255) NOT NULL,
  `PatientPhoneNo` bigint NOT NULL,
  `status` varchar(255) NOT NULL,
  `lapName` varchar(255) DEFAULT NULL,
  `remarks` text,
  `instrumentsUsed` text,
  `testFees` decimal(10, 2) NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL,
  `PatientID` int NOT NULL,
  `results` longtext,
  `selectedTests` varchar(255) NOT NULL,
  `TestManagementID` int NOT NULL,
  `doctorId` int DEFAULT NULL,
  `DoctorPhone` bigint DEFAULT NULL,
  `DoctorName` varchar(255) DEFAULT NULL,
  `commissionType` varchar(255) DEFAULT NULL,
  `commissionValue` varchar(255) DEFAULT NULL,
  `PaymentStatus` varchar(255) NOT NULL,
  `PaymentDate` date DEFAULT NULL,
  `TestManagementIDs` varchar(255) DEFAULT NULL,
  `DoctorEmail` varchar(255) DEFAULT NULL,
  `Authorization` varchar(255) DEFAULT 'Pending',
  `feedback` longtext,
  `selectedPackageID` int DEFAULT NULL,
  `CorporateID` varchar(255) DEFAULT NULL,
  `PackageName` varchar(255) DEFAULT 'NA',
  `PackagePrice` int DEFAULT '0',
  `TotalFees` decimal(10, 2) DEFAULT NULL,
  `Currency` varchar(255) DEFAULT NULL,
  `admissionID` int DEFAULT '0',
  `procedure` varchar(255) DEFAULT 'Pathology',
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 122 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: patientprecriptions
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `patientprecriptions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `prescriptionId` varchar(255) NOT NULL,
  `patient_Id` int NOT NULL,
  `doctor_Id` int NOT NULL,
  `PatientName` varchar(255) NOT NULL,
  `phoneNumberP` bigint DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `PrescribedDoctor` varchar(255) NOT NULL,
  `RegistrationNo` varchar(255) NOT NULL,
  `PhoneNo` bigint DEFAULT NULL,
  `DoctorEmail` varchar(255) NOT NULL,
  `AppointBookingID` int DEFAULT NULL,
  `socialLifestyle` varchar(255) NOT NULL,
  `foodHabits` varchar(255) NOT NULL,
  `medicalHistory` varchar(255) NOT NULL,
  `allergies` varchar(255) NOT NULL,
  `clinicalDiagnosis` varchar(255) NOT NULL,
  `prescribeMedicineQuantity` int DEFAULT NULL,
  `status` varchar(255) DEFAULT '0',
  `DispensedMedicineQuantity` int DEFAULT '0',
  `pharmacistRemark` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `bloodPressure` varchar(255) DEFAULT NULL,
  `respiratoryRate` varchar(255) DEFAULT NULL,
  `heartRate` varchar(255) DEFAULT NULL,
  `temperature` varchar(255) DEFAULT NULL,
  `familyDetails` varchar(255) DEFAULT NULL,
  `revisitDate` varchar(255) DEFAULT NULL,
  `emailSentStatus` varchar(255) DEFAULT NULL,
  `revisit` varchar(255) DEFAULT NULL,
  `emailSentDetails` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `patient_Id` (`patient_Id`),
  CONSTRAINT `patientprecriptions_ibfk_1` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_10` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_100` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_101` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_102` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_103` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_104` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_105` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_106` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_107` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_108` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_109` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_11` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_110` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_111` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_112` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_113` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_114` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_115` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_116` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_117` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_118` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_119` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_12` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_13` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_14` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_15` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_16` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_17` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_18` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_19` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_2` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_20` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_21` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_22` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_23` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_24` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_25` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_26` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_27` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_28` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_29` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_3` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_30` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_31` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_32` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_33` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_34` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_35` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_36` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_37` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_38` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_39` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_4` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_40` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_41` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_42` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_43` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_44` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_45` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_46` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_47` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_48` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_49` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_5` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_50` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_51` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_52` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_53` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_54` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_55` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_56` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_57` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_58` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_59` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_6` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_60` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_61` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_62` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_63` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_64` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_65` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_66` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_67` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_68` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_69` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_7` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_70` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_71` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_72` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_73` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_74` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_75` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_76` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_77` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_78` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_79` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_8` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_80` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_81` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_82` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_83` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_84` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_85` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_86` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_87` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_88` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_89` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_9` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_90` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_91` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_92` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_93` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_94` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_95` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_96` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_97` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_98` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_99` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 9 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: patientregistrations
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `patientregistrations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `mr` varchar(255) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `middleName` varchar(255) DEFAULT NULL,
  `lastName` varchar(255) NOT NULL,
  `phoneNumberP` bigint NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `age` int NOT NULL,
  `gender` varchar(255) NOT NULL,
  `height` int DEFAULT NULL,
  `weight` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `PatientAadharID` varchar(13) DEFAULT NULL,
  `HealthNationalID` varchar(17) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `pincode` varchar(6) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `countryCode` varchar(4) DEFAULT NULL,
  `hospitalId` int DEFAULT NULL,
  `CorporateID` varchar(255) DEFAULT NULL,
  `PackageID` int DEFAULT NULL,
  `PackageName` varchar(255) DEFAULT NULL,
  `registrationFees` int DEFAULT NULL,
  `paymentStatus` enum('Paid', 'Not-Paid') DEFAULT NULL,
  `paymentDate` datetime DEFAULT NULL,
  `CompanyName` varchar(255) DEFAULT NULL,
  `CompanyID` int DEFAULT NULL,
  `maritalStatus` varchar(255) DEFAULT NULL,
  `bloodGroup` varchar(255) DEFAULT NULL,
  `ageOption` varchar(255) DEFAULT NULL,
  `Currency` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 43 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: pharmacists
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `pharmacists` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) DEFAULT NULL,
  `FirstName` varchar(255) NOT NULL,
  `MiddleName` varchar(255) DEFAULT NULL,
  `LastName` varchar(255) NOT NULL,
  `Address` varchar(255) NOT NULL,
  `phoneNo` bigint NOT NULL,
  `email` varchar(255) NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `phoneNo` (`phoneNo`),
  UNIQUE KEY `phoneNo_2` (`phoneNo`),
  UNIQUE KEY `phoneNo_3` (`phoneNo`),
  UNIQUE KEY `phoneNo_4` (`phoneNo`),
  UNIQUE KEY `phoneNo_5` (`phoneNo`),
  UNIQUE KEY `phoneNo_6` (`phoneNo`),
  UNIQUE KEY `phoneNo_7` (`phoneNo`),
  UNIQUE KEY `phoneNo_8` (`phoneNo`),
  UNIQUE KEY `phoneNo_9` (`phoneNo`),
  UNIQUE KEY `phoneNo_10` (`phoneNo`),
  UNIQUE KEY `phoneNo_11` (`phoneNo`),
  UNIQUE KEY `phoneNo_12` (`phoneNo`),
  UNIQUE KEY `phoneNo_13` (`phoneNo`),
  UNIQUE KEY `phoneNo_14` (`phoneNo`),
  UNIQUE KEY `phoneNo_15` (`phoneNo`),
  UNIQUE KEY `phoneNo_16` (`phoneNo`),
  UNIQUE KEY `phoneNo_17` (`phoneNo`),
  UNIQUE KEY `phoneNo_18` (`phoneNo`),
  UNIQUE KEY `phoneNo_19` (`phoneNo`),
  UNIQUE KEY `phoneNo_20` (`phoneNo`),
  UNIQUE KEY `phoneNo_21` (`phoneNo`),
  UNIQUE KEY `phoneNo_22` (`phoneNo`),
  UNIQUE KEY `phoneNo_23` (`phoneNo`),
  UNIQUE KEY `phoneNo_24` (`phoneNo`),
  UNIQUE KEY `phoneNo_25` (`phoneNo`),
  UNIQUE KEY `phoneNo_26` (`phoneNo`),
  UNIQUE KEY `phoneNo_27` (`phoneNo`),
  UNIQUE KEY `phoneNo_28` (`phoneNo`),
  UNIQUE KEY `phoneNo_29` (`phoneNo`),
  UNIQUE KEY `phoneNo_30` (`phoneNo`),
  UNIQUE KEY `phoneNo_31` (`phoneNo`),
  UNIQUE KEY `phoneNo_32` (`phoneNo`),
  UNIQUE KEY `phoneNo_33` (`phoneNo`),
  UNIQUE KEY `phoneNo_34` (`phoneNo`),
  UNIQUE KEY `phoneNo_35` (`phoneNo`),
  UNIQUE KEY `phoneNo_36` (`phoneNo`),
  UNIQUE KEY `phoneNo_37` (`phoneNo`),
  UNIQUE KEY `phoneNo_38` (`phoneNo`),
  UNIQUE KEY `phoneNo_39` (`phoneNo`),
  UNIQUE KEY `phoneNo_40` (`phoneNo`),
  UNIQUE KEY `phoneNo_41` (`phoneNo`),
  UNIQUE KEY `phoneNo_42` (`phoneNo`),
  UNIQUE KEY `phoneNo_43` (`phoneNo`),
  UNIQUE KEY `phoneNo_44` (`phoneNo`),
  UNIQUE KEY `phoneNo_45` (`phoneNo`),
  UNIQUE KEY `phoneNo_46` (`phoneNo`),
  UNIQUE KEY `phoneNo_47` (`phoneNo`),
  UNIQUE KEY `phoneNo_48` (`phoneNo`),
  UNIQUE KEY `phoneNo_49` (`phoneNo`),
  UNIQUE KEY `phoneNo_50` (`phoneNo`),
  UNIQUE KEY `phoneNo_51` (`phoneNo`),
  UNIQUE KEY `phoneNo_52` (`phoneNo`),
  UNIQUE KEY `phoneNo_53` (`phoneNo`),
  UNIQUE KEY `phoneNo_54` (`phoneNo`),
  UNIQUE KEY `phoneNo_55` (`phoneNo`),
  UNIQUE KEY `phoneNo_56` (`phoneNo`),
  UNIQUE KEY `phoneNo_57` (`phoneNo`),
  UNIQUE KEY `phoneNo_58` (`phoneNo`),
  UNIQUE KEY `phoneNo_59` (`phoneNo`),
  UNIQUE KEY `phoneNo_60` (`phoneNo`),
  UNIQUE KEY `phoneNo_61` (`phoneNo`),
  UNIQUE KEY `phoneNo_62` (`phoneNo`),
  UNIQUE KEY `phoneNo_63` (`phoneNo`)
) ENGINE = InnoDB AUTO_INCREMENT = 3 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: phosphorousresultmodeldiagnostics
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `phosphorousresultmodeldiagnostics` (
  `id` int NOT NULL AUTO_INCREMENT,
  `PatientID` int NOT NULL,
  `TestManagementID` int NOT NULL,
  `PatientTestBookingID` int NOT NULL,
  `hjb` varchar(255) DEFAULT NULL,
  `kujyhku` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `kjhbskq_hjbdkwdhdbowqbjhdboquhbdqhdwbquwdbqdwbqw` longtext,
  `Comment` longtext,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 4 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: plateletcountresultmodels
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `plateletcountresultmodels` (
  `id` int NOT NULL AUTO_INCREMENT,
  `PatientID` int NOT NULL,
  `TestManagementID` int NOT NULL,
  `PatientTestBookingID` int NOT NULL,
  `Platelet_Count` varchar(255) DEFAULT NULL,
  `Smear_Examination` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `Blood` varchar(255) DEFAULT NULL,
  `Comment` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 25 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: plateletcounttestmodels
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `plateletcounttestmodels` (
  `id` int NOT NULL AUTO_INCREMENT,
  `PatientID` int NOT NULL,
  `TestManagementID` int NOT NULL,
  `PatientTestBookingID` int NOT NULL,
  `Platelet_Count` varchar(255) NOT NULL,
  `Smear_Examination` varchar(255) NOT NULL,
  `resultDate` varchar(255) DEFAULT NULL,
  `Remarks` longtext,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: quantityoutreports
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `quantityoutreports` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ItemName` varchar(255) NOT NULL,
  `BatchNumber` varchar(255) NOT NULL,
  `ExpiryDate` datetime NOT NULL,
  `UnitPrice` float(5, 2) DEFAULT NULL,
  `Quantity` int NOT NULL,
  `dateOut` date DEFAULT NULL,
  `AverageMonthlyQuantityOut` int DEFAULT NULL,
  `AverageWeeklyQuantityOut` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 12 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: roles
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 15 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: samplecollections
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `samplecollections` (
  `id` int NOT NULL AUTO_INCREMENT,
  `PatientName` varchar(255) NOT NULL,
  `PatientID` int NOT NULL,
  `Address` varchar(255) DEFAULT NULL,
  `PatientPhoneNo` bigint NOT NULL,
  `BarcodeValuesAllSelectedTest` varchar(255) DEFAULT NULL,
  `sampleName` varchar(255) NOT NULL,
  `sampleDate` date NOT NULL,
  `sampleTime` varchar(255) NOT NULL,
  `sampleLocation` varchar(255) NOT NULL,
  `reCollection` varchar(255) NOT NULL DEFAULT 'No',
  `reCollectionDate` date DEFAULT NULL,
  `reCollectionTime` varchar(255) DEFAULT NULL,
  `sampleTakerName` varchar(255) DEFAULT NULL,
  `testType` varchar(255) NOT NULL,
  `remarks` text,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL,
  `PathologyTestBookingId` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `BarcodeValuesAllSelectedTest` (`BarcodeValuesAllSelectedTest`),
  UNIQUE KEY `BarcodeValuesAllSelectedTest_2` (`BarcodeValuesAllSelectedTest`),
  UNIQUE KEY `BarcodeValuesAllSelectedTest_3` (`BarcodeValuesAllSelectedTest`),
  UNIQUE KEY `BarcodeValuesAllSelectedTest_4` (`BarcodeValuesAllSelectedTest`),
  UNIQUE KEY `BarcodeValuesAllSelectedTest_5` (`BarcodeValuesAllSelectedTest`),
  UNIQUE KEY `BarcodeValuesAllSelectedTest_6` (`BarcodeValuesAllSelectedTest`),
  UNIQUE KEY `BarcodeValuesAllSelectedTest_7` (`BarcodeValuesAllSelectedTest`),
  UNIQUE KEY `BarcodeValuesAllSelectedTest_8` (`BarcodeValuesAllSelectedTest`),
  UNIQUE KEY `BarcodeValuesAllSelectedTest_9` (`BarcodeValuesAllSelectedTest`),
  UNIQUE KEY `BarcodeValuesAllSelectedTest_10` (`BarcodeValuesAllSelectedTest`),
  UNIQUE KEY `BarcodeValuesAllSelectedTest_11` (`BarcodeValuesAllSelectedTest`),
  UNIQUE KEY `BarcodeValuesAllSelectedTest_12` (`BarcodeValuesAllSelectedTest`),
  UNIQUE KEY `BarcodeValuesAllSelectedTest_13` (`BarcodeValuesAllSelectedTest`),
  UNIQUE KEY `BarcodeValuesAllSelectedTest_14` (`BarcodeValuesAllSelectedTest`),
  UNIQUE KEY `BarcodeValuesAllSelectedTest_15` (`BarcodeValuesAllSelectedTest`),
  UNIQUE KEY `BarcodeValuesAllSelectedTest_16` (`BarcodeValuesAllSelectedTest`),
  UNIQUE KEY `BarcodeValuesAllSelectedTest_17` (`BarcodeValuesAllSelectedTest`),
  UNIQUE KEY `BarcodeValuesAllSelectedTest_18` (`BarcodeValuesAllSelectedTest`),
  UNIQUE KEY `BarcodeValuesAllSelectedTest_19` (`BarcodeValuesAllSelectedTest`),
  UNIQUE KEY `BarcodeValuesAllSelectedTest_20` (`BarcodeValuesAllSelectedTest`),
  UNIQUE KEY `BarcodeValuesAllSelectedTest_21` (`BarcodeValuesAllSelectedTest`),
  UNIQUE KEY `BarcodeValuesAllSelectedTest_22` (`BarcodeValuesAllSelectedTest`),
  UNIQUE KEY `BarcodeValuesAllSelectedTest_23` (`BarcodeValuesAllSelectedTest`),
  UNIQUE KEY `BarcodeValuesAllSelectedTest_24` (`BarcodeValuesAllSelectedTest`),
  UNIQUE KEY `BarcodeValuesAllSelectedTest_25` (`BarcodeValuesAllSelectedTest`),
  UNIQUE KEY `BarcodeValuesAllSelectedTest_26` (`BarcodeValuesAllSelectedTest`),
  UNIQUE KEY `BarcodeValuesAllSelectedTest_27` (`BarcodeValuesAllSelectedTest`),
  UNIQUE KEY `BarcodeValuesAllSelectedTest_28` (`BarcodeValuesAllSelectedTest`),
  UNIQUE KEY `BarcodeValuesAllSelectedTest_29` (`BarcodeValuesAllSelectedTest`),
  UNIQUE KEY `BarcodeValuesAllSelectedTest_30` (`BarcodeValuesAllSelectedTest`),
  UNIQUE KEY `BarcodeValuesAllSelectedTest_31` (`BarcodeValuesAllSelectedTest`),
  UNIQUE KEY `BarcodeValuesAllSelectedTest_32` (`BarcodeValuesAllSelectedTest`),
  UNIQUE KEY `BarcodeValuesAllSelectedTest_33` (`BarcodeValuesAllSelectedTest`),
  UNIQUE KEY `BarcodeValuesAllSelectedTest_34` (`BarcodeValuesAllSelectedTest`),
  UNIQUE KEY `BarcodeValuesAllSelectedTest_35` (`BarcodeValuesAllSelectedTest`),
  UNIQUE KEY `BarcodeValuesAllSelectedTest_36` (`BarcodeValuesAllSelectedTest`),
  UNIQUE KEY `BarcodeValuesAllSelectedTest_37` (`BarcodeValuesAllSelectedTest`),
  UNIQUE KEY `BarcodeValuesAllSelectedTest_38` (`BarcodeValuesAllSelectedTest`),
  UNIQUE KEY `BarcodeValuesAllSelectedTest_39` (`BarcodeValuesAllSelectedTest`),
  UNIQUE KEY `BarcodeValuesAllSelectedTest_40` (`BarcodeValuesAllSelectedTest`),
  UNIQUE KEY `BarcodeValuesAllSelectedTest_41` (`BarcodeValuesAllSelectedTest`),
  UNIQUE KEY `BarcodeValuesAllSelectedTest_42` (`BarcodeValuesAllSelectedTest`),
  UNIQUE KEY `BarcodeValuesAllSelectedTest_43` (`BarcodeValuesAllSelectedTest`),
  UNIQUE KEY `BarcodeValuesAllSelectedTest_44` (`BarcodeValuesAllSelectedTest`),
  UNIQUE KEY `BarcodeValuesAllSelectedTest_45` (`BarcodeValuesAllSelectedTest`),
  UNIQUE KEY `BarcodeValuesAllSelectedTest_46` (`BarcodeValuesAllSelectedTest`),
  UNIQUE KEY `BarcodeValuesAllSelectedTest_47` (`BarcodeValuesAllSelectedTest`),
  UNIQUE KEY `BarcodeValuesAllSelectedTest_48` (`BarcodeValuesAllSelectedTest`),
  UNIQUE KEY `BarcodeValuesAllSelectedTest_49` (`BarcodeValuesAllSelectedTest`),
  UNIQUE KEY `BarcodeValuesAllSelectedTest_50` (`BarcodeValuesAllSelectedTest`),
  UNIQUE KEY `BarcodeValuesAllSelectedTest_51` (`BarcodeValuesAllSelectedTest`),
  UNIQUE KEY `BarcodeValuesAllSelectedTest_52` (`BarcodeValuesAllSelectedTest`),
  UNIQUE KEY `BarcodeValuesAllSelectedTest_53` (`BarcodeValuesAllSelectedTest`),
  UNIQUE KEY `BarcodeValuesAllSelectedTest_54` (`BarcodeValuesAllSelectedTest`),
  UNIQUE KEY `BarcodeValuesAllSelectedTest_55` (`BarcodeValuesAllSelectedTest`),
  UNIQUE KEY `BarcodeValuesAllSelectedTest_56` (`BarcodeValuesAllSelectedTest`),
  UNIQUE KEY `BarcodeValuesAllSelectedTest_57` (`BarcodeValuesAllSelectedTest`),
  UNIQUE KEY `BarcodeValuesAllSelectedTest_58` (`BarcodeValuesAllSelectedTest`),
  UNIQUE KEY `BarcodeValuesAllSelectedTest_59` (`BarcodeValuesAllSelectedTest`),
  UNIQUE KEY `BarcodeValuesAllSelectedTest_60` (`BarcodeValuesAllSelectedTest`),
  UNIQUE KEY `BarcodeValuesAllSelectedTest_61` (`BarcodeValuesAllSelectedTest`),
  UNIQUE KEY `BarcodeValuesAllSelectedTest_62` (`BarcodeValuesAllSelectedTest`),
  UNIQUE KEY `BarcodeValuesAllSelectedTest_63` (`BarcodeValuesAllSelectedTest`)
) ENGINE = InnoDB AUTO_INCREMENT = 55 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: samplehomecollections
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `samplehomecollections` (
  `id` int NOT NULL AUTO_INCREMENT,
  `PatientName` varchar(255) NOT NULL,
  `PatientID` int NOT NULL,
  `Address` varchar(255) DEFAULT NULL,
  `PatientPhoneNo` bigint NOT NULL,
  `sampleName` varchar(255) NOT NULL,
  `sampleDate` date NOT NULL,
  `sampleTime` varchar(255) NOT NULL,
  `reCollection` varchar(255) NOT NULL DEFAULT 'No',
  `reCollectionDate` date DEFAULT NULL,
  `reCollectionTime` varchar(255) DEFAULT NULL,
  `sampleTakerName` varchar(255) DEFAULT NULL,
  `testType` varchar(255) NOT NULL,
  `remarks` text,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 3 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: selectedtestforhealthpackagemodels
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `selectedtestforhealthpackagemodels` (
  `id` int NOT NULL AUTO_INCREMENT,
  `TestName` varchar(255) NOT NULL,
  `testType` varchar(255) NOT NULL,
  `category` varchar(255) NOT NULL,
  `TestId` int NOT NULL,
  `TestPackageID` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 31 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: selectedtestforpackagemodels
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `selectedtestforpackagemodels` (
  `id` int NOT NULL AUTO_INCREMENT,
  `TestName` varchar(255) NOT NULL,
  `TestId` int NOT NULL,
  `TestPackageID` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `testType` varchar(255) NOT NULL,
  `category` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `TestPackageID` (`TestPackageID`),
  CONSTRAINT `selectedtestforpackagemodels_ibfk_1` FOREIGN KEY (`TestPackageID`) REFERENCES `testpackagemodels` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 417 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: specimenlists
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `specimenlists` (
  `id` int NOT NULL AUTO_INCREMENT,
  `SpecimenName` varchar(255) DEFAULT NULL,
  `SpecimenCode` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 5 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: statusofdiagnostictestsfortestbookings
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `statusofdiagnostictestsfortestbookings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `testName` varchar(255) NOT NULL,
  `TestStatus` varchar(255) NOT NULL,
  `PatientID` int NOT NULL,
  `DiagnosticTestBookingId` int NOT NULL,
  `TestID` int NOT NULL,
  `TestRegisteredDateTime` datetime DEFAULT NULL,
  `TestCompletedDateTime` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `admissionID` int DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 43 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: statusofpathologytestsfortestbookings
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `statusofpathologytestsfortestbookings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `testName` varchar(255) NOT NULL,
  `TestStatus` varchar(255) NOT NULL,
  `PatientID` int NOT NULL,
  `PathologyTestBookingId` int NOT NULL,
  `TestID` int NOT NULL,
  `TestRegisteredDateTime` datetime DEFAULT NULL,
  `TestSamplecollectedDateTime` datetime DEFAULT NULL,
  `TestCompletedDateTime` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `admissionID` int DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 88 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: t3t4tshpathologytests
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `t3t4tshpathologytests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `PatientID` int NOT NULL,
  `TestManagementID` int NOT NULL,
  `PatientTestBookingID` int NOT NULL,
  `T3_Tri_iodothyronine` varchar(255) NOT NULL,
  `T4_Thyroxine` varchar(255) NOT NULL,
  `TSH_Thyroid_Stimulating_Hormone` varchar(255) NOT NULL,
  `Remarks` longtext,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL,
  `resultDate` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 7 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: t3t4tshresultmodels
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `t3t4tshresultmodels` (
  `id` int NOT NULL AUTO_INCREMENT,
  `PatientID` int NOT NULL,
  `TestManagementID` int NOT NULL,
  `PatientTestBookingID` int NOT NULL,
  `T4_Thyroxine` varchar(255) DEFAULT NULL,
  `TSH_Thyroid_Stimulating_Hormone` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `T3_Tri_iodothyronine` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 11 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: testdemoresultmodels
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `testdemoresultmodels` (
  `id` int NOT NULL AUTO_INCREMENT,
  `PatientID` int NOT NULL,
  `TestManagementID` int NOT NULL,
  `Comment` longtext,
  `PatientTestBookingID` int NOT NULL,
  `newOne` varchar(255) DEFAULT NULL,
  `two` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: testmanagementnormalvalues
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `testmanagementnormalvalues` (
  `id` int NOT NULL AUTO_INCREMENT,
  `testManagementID` int DEFAULT NULL,
  `fieldName` varchar(255) DEFAULT NULL,
  `minimumRange` varchar(255) DEFAULT NULL,
  `maximumRange` varchar(255) DEFAULT NULL,
  `unitOfMeasurements` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_key_name` (`testManagementID`, `fieldName`)
) ENGINE = InnoDB AUTO_INCREMENT = 100 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: testpackagemodels
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `testpackagemodels` (
  `id` int NOT NULL AUTO_INCREMENT,
  `packageName` varchar(255) NOT NULL,
  `MRPOfPackage` int NOT NULL,
  `discount` int DEFAULT NULL,
  `finalPrice` decimal(10, 2) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `Currency` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 21 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: testsresultmodeldiagnostics
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `testsresultmodeldiagnostics` (
  `id` int NOT NULL AUTO_INCREMENT,
  `PatientID` int NOT NULL,
  `TestManagementID` int NOT NULL,
  `PatientTestBookingID` int NOT NULL,
  `newfield` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `newOne` longtext,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: ultrasoundabdomenresultmodeldiagnostics
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `ultrasoundabdomenresultmodeldiagnostics` (
  `id` int NOT NULL AUTO_INCREMENT,
  `PatientID` int NOT NULL,
  `TestManagementID` int NOT NULL,
  `Comment` longtext,
  `PatientTestBookingID` int NOT NULL,
  `LIVER` longtext,
  `GALL_BLADDER` longtext,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `PANCREAS` longtext,
  `RIGHT_KIDNEY` longtext,
  `LEFT_KIDNEY` longtext,
  `BLADDER` longtext,
  `PROSTATE` longtext,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: urearesultmodeldiagnostics
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `urearesultmodeldiagnostics` (
  `id` int NOT NULL AUTO_INCREMENT,
  `PatientID` int NOT NULL,
  `TestManagementID` int NOT NULL,
  `Comment` longtext,
  `PatientTestBookingID` int NOT NULL,
  `hiuijkbn` longtext,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: user_roles
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `user_roles` (
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `roleId` int NOT NULL,
  `userId` int NOT NULL,
  PRIMARY KEY (`roleId`, `userId`),
  KEY `userId` (`userId`),
  CONSTRAINT `user_roles_ibfk_1` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_roles_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: users
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phoneNumber` bigint DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `hospitalId` int DEFAULT '0',
  `language` varchar(255) DEFAULT 'en',
  `status` varchar(255) DEFAULT 'active',
  `loggedInStatus` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `phoneNumber` (`phoneNumber`),
  UNIQUE KEY `username_2` (`username`),
  UNIQUE KEY `email_2` (`email`),
  UNIQUE KEY `phoneNumber_2` (`phoneNumber`)
) ENGINE = InnoDB AUTO_INCREMENT = 92 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: userstb
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `userstb` (
  `userid` int NOT NULL AUTO_INCREMENT,
  `username` varchar(20) NOT NULL,
  `password` varchar(20) NOT NULL,
  `lname` varchar(20) NOT NULL,
  `fname` varchar(20) NOT NULL,
  PRIMARY KEY (`userid`)
) ENGINE = InnoDB AUTO_INCREMENT = 12 DEFAULT CHARSET = latin1;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: vendors
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `vendors` (
  `id` int NOT NULL AUTO_INCREMENT,
  `vendorName` varchar(255) NOT NULL,
  `contactAddress` varchar(255) NOT NULL,
  `contactNumber` bigint NOT NULL,
  `panNumber` varchar(255) NOT NULL,
  `bankDetails` varchar(255) DEFAULT NULL,
  `contactPerson` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `govtRegDate` datetime NOT NULL,
  `isActive` tinyint(1) DEFAULT '1',
  `receiveDonation` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 4 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: vitamindresultmodeldiagnostics
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `vitamindresultmodeldiagnostics` (
  `id` int NOT NULL AUTO_INCREMENT,
  `PatientID` int NOT NULL,
  `TestManagementID` int NOT NULL,
  `Comment` longtext,
  `PatientTestBookingID` int NOT NULL,
  `VitaminD` longtext,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 3 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: allsubstitutes
# ------------------------------------------------------------

INSERT INTO
  `allsubstitutes` (
    `id`,
    `medicineName`,
    `medicineId`,
    `medicine_Id`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    1,
    'lhbluhbkhb',
    1,
    1,
    '2023-09-06 16:29:37',
    '2023-09-06 16:29:37'
  );
INSERT INTO
  `allsubstitutes` (
    `id`,
    `medicineName`,
    `medicineId`,
    `medicine_Id`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    2,
    'hjb',
    3,
    2,
    '2023-09-07 16:52:49',
    '2023-09-07 16:52:49'
  );
INSERT INTO
  `allsubstitutes` (
    `id`,
    `medicineName`,
    `medicineId`,
    `medicine_Id`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    3,
    'hjb',
    2,
    2,
    '2023-09-07 17:20:00',
    '2023-09-07 17:20:00'
  );
INSERT INTO
  `allsubstitutes` (
    `id`,
    `medicineName`,
    `medicineId`,
    `medicine_Id`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    4,
    'medicine2',
    2,
    3,
    '2023-09-07 17:20:00',
    '2023-09-07 17:20:00'
  );
INSERT INTO
  `allsubstitutes` (
    `id`,
    `medicineName`,
    `medicineId`,
    `medicine_Id`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    7,
    'medicine2',
    5,
    3,
    '2023-10-14 05:39:38',
    '2023-10-14 05:39:38'
  );
INSERT INTO
  `allsubstitutes` (
    `id`,
    `medicineName`,
    `medicineId`,
    `medicine_Id`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    8,
    'Zinetac 150mg Tablet',
    6,
    4,
    '2023-10-14 05:41:34',
    '2023-10-14 05:41:34'
  );
INSERT INTO
  `allsubstitutes` (
    `id`,
    `medicineName`,
    `medicineId`,
    `medicine_Id`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    9,
    'Zinetac 150mg Tablet',
    7,
    4,
    '2023-10-14 05:45:43',
    '2023-10-14 05:45:43'
  );
INSERT INTO
  `allsubstitutes` (
    `id`,
    `medicineName`,
    `medicineId`,
    `medicine_Id`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    10,
    'Zinetac 150mg Tablet',
    8,
    4,
    '2023-10-14 05:48:54',
    '2023-10-14 05:48:54'
  );
INSERT INTO
  `allsubstitutes` (
    `id`,
    `medicineName`,
    `medicineId`,
    `medicine_Id`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    11,
    'Zinetac 150mg Tablet',
    9,
    4,
    '2023-10-14 05:52:05',
    '2023-10-14 05:52:05'
  );
INSERT INTO
  `allsubstitutes` (
    `id`,
    `medicineName`,
    `medicineId`,
    `medicine_Id`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    12,
    'Zinetac 150mg Tablet',
    4,
    4,
    '2024-01-11 02:43:44',
    '2024-01-11 02:43:44'
  );
INSERT INTO
  `allsubstitutes` (
    `id`,
    `medicineName`,
    `medicineId`,
    `medicine_Id`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    13,
    'hjb',
    3,
    2,
    '2024-01-31 16:03:44',
    '2024-01-31 16:03:44'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: backupconfigs
# ------------------------------------------------------------

INSERT INTO
  `backupconfigs` (
    `id`,
    `period`,
    `day`,
    `time`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    8,
    'daily',
    '*',
    '10:10',
    '2024-01-29 14:40:37',
    '2024-01-29 14:40:37'
  );
INSERT INTO
  `backupconfigs` (
    `id`,
    `period`,
    `day`,
    `time`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    9,
    'daily',
    '',
    '21:55',
    '2024-01-31 16:23:08',
    '2024-01-31 16:23:08'
  );
INSERT INTO
  `backupconfigs` (
    `id`,
    `period`,
    `day`,
    `time`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    10,
    'daily',
    '',
    '11:00',
    '2024-02-02 05:27:31',
    '2024-02-02 05:27:31'
  );
INSERT INTO
  `backupconfigs` (
    `id`,
    `period`,
    `day`,
    `time`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    11,
    'daily',
    '',
    '12:00',
    '2024-02-02 05:42:19',
    '2024-02-02 05:42:19'
  );
INSERT INTO
  `backupconfigs` (
    `id`,
    `period`,
    `day`,
    `time`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    12,
    'daily',
    '',
    '11:30',
    '2024-02-02 05:43:33',
    '2024-02-02 05:43:33'
  );
INSERT INTO
  `backupconfigs` (
    `id`,
    `period`,
    `day`,
    `time`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    13,
    'daily',
    '',
    '11:11',
    '2024-02-02 05:46:00',
    '2024-02-02 05:46:00'
  );
INSERT INTO
  `backupconfigs` (
    `id`,
    `period`,
    `day`,
    `time`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    14,
    'daily',
    '',
    '11:30',
    '2024-02-02 05:48:12',
    '2024-02-02 05:48:12'
  );
INSERT INTO
  `backupconfigs` (
    `id`,
    `period`,
    `day`,
    `time`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    15,
    'weekly',
    '5',
    '11:35',
    '2024-02-02 05:55:28',
    '2024-02-02 05:55:28'
  );
INSERT INTO
  `backupconfigs` (
    `id`,
    `period`,
    `day`,
    `time`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    16,
    'weekly',
    '1',
    '11:35',
    '2024-02-02 05:55:56',
    '2024-02-02 05:55:56'
  );
INSERT INTO
  `backupconfigs` (
    `id`,
    `period`,
    `day`,
    `time`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    17,
    'daily',
    '',
    '11:35',
    '2024-02-02 05:56:16',
    '2024-02-02 05:56:16'
  );
INSERT INTO
  `backupconfigs` (
    `id`,
    `period`,
    `day`,
    `time`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    18,
    'daily',
    '',
    '11:37',
    '2024-02-02 06:06:16',
    '2024-02-02 06:06:16'
  );
INSERT INTO
  `backupconfigs` (
    `id`,
    `period`,
    `day`,
    `time`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    19,
    'daily',
    '',
    '13:59',
    '2024-02-02 08:27:00',
    '2024-02-02 08:27:00'
  );
INSERT INTO
  `backupconfigs` (
    `id`,
    `period`,
    `day`,
    `time`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    20,
    'daily',
    '',
    '13:24',
    '2024-02-05 07:51:06',
    '2024-02-05 07:51:06'
  );
INSERT INTO
  `backupconfigs` (
    `id`,
    `period`,
    `day`,
    `time`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    21,
    'daily',
    '',
    '12:49',
    '2024-02-06 02:18:00',
    '2024-02-06 02:18:00'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: backupdata
# ------------------------------------------------------------

INSERT INTO
  `backupdata` (
    `id`,
    `filename`,
    `path`,
    `createdAt`,
    `updatedAt`,
    `user`,
    `status`,
    `restoredBy`
  )
VALUES
  (
    21,
    'healthcare_2024-01-30T11-31-42.sql',
    'C:\\Users\\Asus\\Desktop\\pharmacymanagement\\HIMS\\Backend\\DatabaseDump\\healthcare\\healthcare_2024-01-30T11-31-42.sql',
    '2024-01-30 11:31:45',
    '2024-01-30 11:31:45',
    NULL,
    'not-restored',
    NULL
  );
INSERT INTO
  `backupdata` (
    `id`,
    `filename`,
    `path`,
    `createdAt`,
    `updatedAt`,
    `user`,
    `status`,
    `restoredBy`
  )
VALUES
  (
    22,
    'healthcare_2024-01-30T16-04-13.sql',
    'C:\\Users\\Asus\\Desktop\\pharmacymanagement\\HIMS\\Backend\\DatabaseDump\\healthcare\\healthcare_2024-01-30T16-04-13.sql',
    '2024-01-30 16:04:17',
    '2024-01-30 16:04:17',
    'Nitesh Giri',
    'not-restored',
    NULL
  );
INSERT INTO
  `backupdata` (
    `id`,
    `filename`,
    `path`,
    `createdAt`,
    `updatedAt`,
    `user`,
    `status`,
    `restoredBy`
  )
VALUES
  (
    23,
    'healthcare_2024-01-30T16-04-28.sql',
    'C:\\Users\\Asus\\Desktop\\pharmacymanagement\\HIMS\\Backend\\DatabaseDump\\healthcare\\healthcare_2024-01-30T16-04-28.sql',
    '2024-01-30 16:04:29',
    '2024-01-30 16:04:29',
    'Nitesh Giri',
    'not-restored',
    NULL
  );
INSERT INTO
  `backupdata` (
    `id`,
    `filename`,
    `path`,
    `createdAt`,
    `updatedAt`,
    `user`,
    `status`,
    `restoredBy`
  )
VALUES
  (
    24,
    'healthcare_2024-01-30T16-04-31.sql',
    'C:\\Users\\Asus\\Desktop\\pharmacymanagement\\HIMS\\Backend\\DatabaseDump\\healthcare\\healthcare_2024-01-30T16-04-31.sql',
    '2024-01-30 16:04:32',
    '2024-01-30 16:04:32',
    'Nitesh Giri',
    'not-restored',
    NULL
  );
INSERT INTO
  `backupdata` (
    `id`,
    `filename`,
    `path`,
    `createdAt`,
    `updatedAt`,
    `user`,
    `status`,
    `restoredBy`
  )
VALUES
  (
    25,
    'healthcare_2024-01-30T16-04-33.sql',
    'C:\\Users\\Asus\\Desktop\\pharmacymanagement\\HIMS\\Backend\\DatabaseDump\\healthcare\\healthcare_2024-01-30T16-04-33.sql',
    '2024-01-30 16:04:34',
    '2024-01-30 16:04:34',
    'Nitesh Giri',
    'not-restored',
    NULL
  );
INSERT INTO
  `backupdata` (
    `id`,
    `filename`,
    `path`,
    `createdAt`,
    `updatedAt`,
    `user`,
    `status`,
    `restoredBy`
  )
VALUES
  (
    26,
    'healthcare_2024-01-30T16-04-35.sql',
    'C:\\Users\\Asus\\Desktop\\pharmacymanagement\\HIMS\\Backend\\DatabaseDump\\healthcare\\healthcare_2024-01-30T16-04-35.sql',
    '2024-01-30 16:04:36',
    '2024-01-30 16:04:36',
    'Nitesh Giri',
    'not-restored',
    NULL
  );
INSERT INTO
  `backupdata` (
    `id`,
    `filename`,
    `path`,
    `createdAt`,
    `updatedAt`,
    `user`,
    `status`,
    `restoredBy`
  )
VALUES
  (
    27,
    'healthcare_2024-01-30T16-04-37.sql',
    'C:\\Users\\Asus\\Desktop\\pharmacymanagement\\HIMS\\Backend\\DatabaseDump\\healthcare\\healthcare_2024-01-30T16-04-37.sql',
    '2024-01-30 16:04:38',
    '2024-02-01 04:14:39',
    'Nitesh Giri',
    'restored',
    NULL
  );
INSERT INTO
  `backupdata` (
    `id`,
    `filename`,
    `path`,
    `createdAt`,
    `updatedAt`,
    `user`,
    `status`,
    `restoredBy`
  )
VALUES
  (
    28,
    'healthcare_2024-01-30T16-04-38.sql',
    'C:\\Users\\Asus\\Desktop\\pharmacymanagement\\HIMS\\Backend\\DatabaseDump\\healthcare\\healthcare_2024-01-30T16-04-38.sql',
    '2024-01-30 16:04:39',
    '2024-02-01 04:17:38',
    'Nitesh Giri',
    'restored',
    NULL
  );
INSERT INTO
  `backupdata` (
    `id`,
    `filename`,
    `path`,
    `createdAt`,
    `updatedAt`,
    `user`,
    `status`,
    `restoredBy`
  )
VALUES
  (
    29,
    'healthcare_2024-01-30T16-04-43.sql',
    'C:\\Users\\Asus\\Desktop\\pharmacymanagement\\HIMS\\Backend\\DatabaseDump\\healthcare\\healthcare_2024-01-30T16-04-43.sql',
    '2024-01-30 16:04:44',
    '2024-02-01 04:15:26',
    'Nitesh Giri',
    'restored',
    NULL
  );
INSERT INTO
  `backupdata` (
    `id`,
    `filename`,
    `path`,
    `createdAt`,
    `updatedAt`,
    `user`,
    `status`,
    `restoredBy`
  )
VALUES
  (
    30,
    'healthcare_2024-01-30T16-04-43.sql',
    'C:\\Users\\Asus\\Desktop\\pharmacymanagement\\HIMS\\Backend\\DatabaseDump\\healthcare\\healthcare_2024-01-30T16-04-43.sql',
    '2024-01-30 16:04:44',
    '2024-02-01 04:17:07',
    'Nitesh Giri',
    'restored',
    NULL
  );
INSERT INTO
  `backupdata` (
    `id`,
    `filename`,
    `path`,
    `createdAt`,
    `updatedAt`,
    `user`,
    `status`,
    `restoredBy`
  )
VALUES
  (
    31,
    'healthcare_2024-01-30T16-04-48.sql',
    'C:\\Users\\Asus\\Desktop\\pharmacymanagement\\HIMS\\Backend\\DatabaseDump\\healthcare\\healthcare_2024-01-30T16-04-48.sql',
    '2024-01-30 16:04:49',
    '2024-01-30 16:09:25',
    'Nitesh Giri',
    'restored',
    NULL
  );
INSERT INTO
  `backupdata` (
    `id`,
    `filename`,
    `path`,
    `createdAt`,
    `updatedAt`,
    `user`,
    `status`,
    `restoredBy`
  )
VALUES
  (
    32,
    'healthcare_2024-02-01T04-15-46.sql',
    'C:\\Users\\Asus\\Desktop\\pharmacymanagement\\HIMS\\Backend\\DatabaseDump\\healthcare\\healthcare_2024-02-01T04-15-46.sql',
    '2024-02-01 04:15:48',
    '2024-02-01 04:16:12',
    'Nitesh Giri',
    'restored',
    NULL
  );
INSERT INTO
  `backupdata` (
    `id`,
    `filename`,
    `path`,
    `createdAt`,
    `updatedAt`,
    `user`,
    `status`,
    `restoredBy`
  )
VALUES
  (
    33,
    'healthcare_2024-02-01T04-18-09.sql',
    'C:\\Users\\Asus\\Desktop\\pharmacymanagement\\HIMS\\Backend\\DatabaseDump\\healthcare\\healthcare_2024-02-01T04-18-09.sql',
    '2024-02-01 04:18:10',
    '2024-02-01 04:18:33',
    'Nitesh Giri',
    'restored',
    NULL
  );
INSERT INTO
  `backupdata` (
    `id`,
    `filename`,
    `path`,
    `createdAt`,
    `updatedAt`,
    `user`,
    `status`,
    `restoredBy`
  )
VALUES
  (
    34,
    'healthcare_2024-02-01T16-00-11.sql',
    'C:\\Users\\Asus\\Desktop\\pharmacymanagement\\HIMS\\Backend\\DatabaseDump\\healthcare\\healthcare_2024-02-01T16-00-11.sql',
    '2024-02-01 16:00:16',
    '2024-02-01 16:00:16',
    'Nitesh Giri',
    'not-restored',
    NULL
  );
INSERT INTO
  `backupdata` (
    `id`,
    `filename`,
    `path`,
    `createdAt`,
    `updatedAt`,
    `user`,
    `status`,
    `restoredBy`
  )
VALUES
  (
    35,
    'healthcare_2024-02-01T16-01-08.sql',
    'C:\\Users\\Asus\\Desktop\\pharmacymanagement\\HIMS\\Backend\\DatabaseDump\\healthcare\\healthcare_2024-02-01T16-01-08.sql',
    '2024-02-01 16:01:09',
    '2024-02-01 16:01:09',
    'Nitesh Giri',
    'not-restored',
    NULL
  );
INSERT INTO
  `backupdata` (
    `id`,
    `filename`,
    `path`,
    `createdAt`,
    `updatedAt`,
    `user`,
    `status`,
    `restoredBy`
  )
VALUES
  (
    36,
    'healthcare_2024-02-01T16-18-23.sql',
    'C:\\Users\\Asus\\Desktop\\pharmacymanagement\\HIMS\\Backend\\DatabaseDump\\healthcare\\healthcare_2024-02-01T16-18-23.sql',
    '2024-02-01 16:18:37',
    '2024-02-01 16:18:37',
    'Nitesh Giri',
    'not-restored',
    NULL
  );
INSERT INTO
  `backupdata` (
    `id`,
    `filename`,
    `path`,
    `createdAt`,
    `updatedAt`,
    `user`,
    `status`,
    `restoredBy`
  )
VALUES
  (
    37,
    'healthcare_2024-02-01T16-29-48.sql',
    'C:\\Users\\Asus\\Desktop\\pharmacymanagement\\HIMS\\Backend\\DatabaseDump\\healthcare\\healthcare_2024-02-01T16-29-48.sql',
    '2024-02-01 16:29:51',
    '2024-02-01 16:29:51',
    'Nitesh Giri',
    'not-restored',
    NULL
  );
INSERT INTO
  `backupdata` (
    `id`,
    `filename`,
    `path`,
    `createdAt`,
    `updatedAt`,
    `user`,
    `status`,
    `restoredBy`
  )
VALUES
  (
    38,
    'healthcare_2024-02-01T16-44-57.sql',
    'C:\\Users\\Asus\\Desktop\\pharmacymanagement\\HIMS\\Backend\\DatabaseDump\\healthcare\\healthcare_2024-02-01T16-44-57.sql',
    '2024-02-01 16:45:10',
    '2024-02-01 17:17:11',
    'Nitesh Giri',
    'restored',
    NULL
  );
INSERT INTO
  `backupdata` (
    `id`,
    `filename`,
    `path`,
    `createdAt`,
    `updatedAt`,
    `user`,
    `status`,
    `restoredBy`
  )
VALUES
  (
    39,
    'healthcare_2024-02-01T16-46-02.sql',
    'C:\\Users\\Asus\\Desktop\\pharmacymanagement\\HIMS\\Backend\\DatabaseDump\\healthcare\\healthcare_2024-02-01T16-46-02.sql',
    '2024-02-01 16:46:06',
    '2024-02-01 16:58:46',
    'Nitesh Giri',
    'restored',
    NULL
  );
INSERT INTO
  `backupdata` (
    `id`,
    `filename`,
    `path`,
    `createdAt`,
    `updatedAt`,
    `user`,
    `status`,
    `restoredBy`
  )
VALUES
  (
    40,
    'healthcare_2024-02-01T16-50-12.sql',
    'C:\\Users\\Asus\\Desktop\\pharmacymanagement\\HIMS\\Backend\\DatabaseDump\\healthcare\\healthcare_2024-02-01T16-50-12.sql',
    '2024-02-01 16:50:13',
    '2024-02-01 16:54:15',
    'Nitesh Giri',
    'restored',
    NULL
  );
INSERT INTO
  `backupdata` (
    `id`,
    `filename`,
    `path`,
    `createdAt`,
    `updatedAt`,
    `user`,
    `status`,
    `restoredBy`
  )
VALUES
  (
    41,
    'healthcare_2024-02-01T16-52-25.sql',
    'C:\\Users\\Asus\\Desktop\\pharmacymanagement\\HIMS\\Backend\\DatabaseDump\\healthcare\\healthcare_2024-02-01T16-52-25.sql',
    '2024-02-01 16:52:27',
    '2024-02-01 16:52:37',
    'Nitesh Giri',
    'restored',
    NULL
  );
INSERT INTO
  `backupdata` (
    `id`,
    `filename`,
    `path`,
    `createdAt`,
    `updatedAt`,
    `user`,
    `status`,
    `restoredBy`
  )
VALUES
  (
    42,
    'healthcare_2024-02-02T08-49-41.sql',
    'C:\\Users\\Asus\\Desktop\\pharmacymanagement\\HIMS\\Backend\\DatabaseDump\\healthcare\\healthcare_2024-02-02T08-49-41.sql',
    '2024-02-02 08:49:52',
    '2024-02-03 14:34:28',
    'Nitesh Giri',
    'restored',
    NULL
  );
INSERT INTO
  `backupdata` (
    `id`,
    `filename`,
    `path`,
    `createdAt`,
    `updatedAt`,
    `user`,
    `status`,
    `restoredBy`
  )
VALUES
  (
    47,
    'healthcare_2024-02-06T15-48-51.sql',
    'C:\\Users\\Asus\\Desktop\\pharmacymanagement\\HIMS\\Backend\\DatabaseDump\\healthcare\\healthcare_2024-02-06T15-48-51.sql',
    '2024-02-06 15:49:23',
    '2024-02-06 15:49:34',
    'Nitesh Giri',
    'restored',
    'Nitesh Giri'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: bedshospitalrooms
# ------------------------------------------------------------

INSERT INTO
  `bedshospitalrooms` (
    `id`,
    `BedNumber`,
    `BedType`,
    `BedPrice`,
    `HospitalRoomID`,
    `createdAt`,
    `updatedAt`,
    `HospitalRoomNumber`,
    `Currency`,
    `BedStatus`,
    `OccupiedCheckInTime`,
    `OccupiedCheckOutTime`,
    `OccupiedAdmissionID`
  )
VALUES
  (
    22,
    '101',
    'ICU',
    200,
    7,
    '2024-01-27 07:15:40',
    '2024-01-27 07:15:40',
    101,
    'USD',
    'Active',
    NULL,
    NULL,
    NULL
  );
INSERT INTO
  `bedshospitalrooms` (
    `id`,
    `BedNumber`,
    `BedType`,
    `BedPrice`,
    `HospitalRoomID`,
    `createdAt`,
    `updatedAt`,
    `HospitalRoomNumber`,
    `Currency`,
    `BedStatus`,
    `OccupiedCheckInTime`,
    `OccupiedCheckOutTime`,
    `OccupiedAdmissionID`
  )
VALUES
  (
    23,
    '102',
    'Semi-Private Bed',
    100,
    7,
    '2024-01-27 07:15:40',
    '2024-01-27 07:15:40',
    101,
    'USD',
    'Active',
    NULL,
    NULL,
    NULL
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: bhkjhbresultmodels
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: bloodsugarforfastingmodels
# ------------------------------------------------------------

INSERT INTO
  `bloodsugarforfastingmodels` (
    `id`,
    `PatientID`,
    `TestManagementID`,
    `PatientTestBookingID`,
    `Urine_Sugar`,
    `Urine_Acetone`,
    `Post_Lunch_Blood_Sugar`,
    `resultDate`,
    `Remarks`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    1,
    1,
    11,
    9,
    'Absent',
    'No sample',
    '85',
    '2023-09-03T13:19:22.201Z',
    'Urine Sugar Interpretation:\nTrace : 0.1 g/dl\n+ : 0.25 g/dl\n++ : 0.5 g/dl\n+++ : 1.0 g/dl\n++++ : 2.0 g/dl',
    '2023-09-03 13:21:45',
    '2023-09-03 13:21:45'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: bloodsugarforfastingresultmodels
# ------------------------------------------------------------

INSERT INTO
  `bloodsugarforfastingresultmodels` (
    `id`,
    `PatientID`,
    `TestManagementID`,
    `PatientTestBookingID`,
    `Urine_Sugar`,
    `Urine_Acetone`,
    `Post_Lunch_Blood_Sugar`,
    `createdAt`,
    `updatedAt`,
    `Remarks`
  )
VALUES
  (
    1,
    1,
    11,
    9,
    'Urine_Sugar',
    'Urine_Acetone',
    'Post_Lunch_Blood_Sugar',
    '2023-09-04 21:56:49',
    '2023-09-04 21:56:49',
    NULL
  );
INSERT INTO
  `bloodsugarforfastingresultmodels` (
    `id`,
    `PatientID`,
    `TestManagementID`,
    `PatientTestBookingID`,
    `Urine_Sugar`,
    `Urine_Acetone`,
    `Post_Lunch_Blood_Sugar`,
    `createdAt`,
    `updatedAt`,
    `Remarks`
  )
VALUES
  (
    2,
    1,
    11,
    9,
    'kjhbulhjj',
    'jkhbl',
    'jblibh',
    '2023-09-04 22:01:27',
    '2023-09-04 22:01:27',
    NULL
  );
INSERT INTO
  `bloodsugarforfastingresultmodels` (
    `id`,
    `PatientID`,
    `TestManagementID`,
    `PatientTestBookingID`,
    `Urine_Sugar`,
    `Urine_Acetone`,
    `Post_Lunch_Blood_Sugar`,
    `createdAt`,
    `updatedAt`,
    `Remarks`
  )
VALUES
  (
    3,
    1,
    11,
    9,
    'Absent',
    'No sample',
    '85',
    '2023-09-05 08:29:53',
    '2023-09-05 08:29:53',
    'NA'
  );
INSERT INTO
  `bloodsugarforfastingresultmodels` (
    `id`,
    `PatientID`,
    `TestManagementID`,
    `PatientTestBookingID`,
    `Urine_Sugar`,
    `Urine_Acetone`,
    `Post_Lunch_Blood_Sugar`,
    `createdAt`,
    `updatedAt`,
    `Remarks`
  )
VALUES
  (
    4,
    15,
    12,
    38,
    'fdgfhgjhj2k',
    NULL,
    NULL,
    '2023-09-18 10:43:33',
    '2023-09-18 10:43:33',
    NULL
  );
INSERT INTO
  `bloodsugarforfastingresultmodels` (
    `id`,
    `PatientID`,
    `TestManagementID`,
    `PatientTestBookingID`,
    `Urine_Sugar`,
    `Urine_Acetone`,
    `Post_Lunch_Blood_Sugar`,
    `createdAt`,
    `updatedAt`,
    `Remarks`
  )
VALUES
  (
    5,
    15,
    11,
    39,
    '100',
    '1000',
    '10',
    '2023-09-18 15:45:37',
    '2023-09-18 15:45:37',
    'na'
  );
INSERT INTO
  `bloodsugarforfastingresultmodels` (
    `id`,
    `PatientID`,
    `TestManagementID`,
    `PatientTestBookingID`,
    `Urine_Sugar`,
    `Urine_Acetone`,
    `Post_Lunch_Blood_Sugar`,
    `createdAt`,
    `updatedAt`,
    `Remarks`
  )
VALUES
  (
    6,
    14,
    11,
    43,
    '66',
    '0.9',
    NULL,
    '2023-09-23 08:48:06',
    '2023-09-23 08:48:06',
    NULL
  );
INSERT INTO
  `bloodsugarforfastingresultmodels` (
    `id`,
    `PatientID`,
    `TestManagementID`,
    `PatientTestBookingID`,
    `Urine_Sugar`,
    `Urine_Acetone`,
    `Post_Lunch_Blood_Sugar`,
    `createdAt`,
    `updatedAt`,
    `Remarks`
  )
VALUES
  (
    7,
    37,
    11,
    102,
    '1234',
    '3',
    NULL,
    '2023-10-25 18:37:28',
    '2023-10-25 18:37:28',
    NULL
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: bloodsugarforppresultmodels
# ------------------------------------------------------------

INSERT INTO
  `bloodsugarforppresultmodels` (
    `id`,
    `PatientID`,
    `TestManagementID`,
    `PatientTestBookingID`,
    `Chloride`,
    `Appearance`,
    `Coagulum`,
    `Blood`,
    `Proteins`,
    `Polymorphs`,
    `Lymphocytes`,
    `createdAt`,
    `updatedAt`,
    `Sugar`,
    `Sugar_Level`
  )
VALUES
  (
    1,
    1,
    12,
    4,
    '99.4',
    'Clear',
    'Absent',
    'Absent',
    '22.6',
    'Absent',
    'Absent',
    '2023-09-05 08:31:50',
    '2023-09-05 08:31:50',
    NULL,
    NULL
  );
INSERT INTO
  `bloodsugarforppresultmodels` (
    `id`,
    `PatientID`,
    `TestManagementID`,
    `PatientTestBookingID`,
    `Chloride`,
    `Appearance`,
    `Coagulum`,
    `Blood`,
    `Proteins`,
    `Polymorphs`,
    `Lymphocytes`,
    `createdAt`,
    `updatedAt`,
    `Sugar`,
    `Sugar_Level`
  )
VALUES
  (
    2,
    15,
    9,
    37,
    '123456',
    '12345',
    '111111111111111111111111111111',
    '22222222222222222222222',
    '222222222222',
    NULL,
    NULL,
    '2023-09-18 10:40:33',
    '2023-09-18 10:40:33',
    NULL,
    NULL
  );
INSERT INTO
  `bloodsugarforppresultmodels` (
    `id`,
    `PatientID`,
    `TestManagementID`,
    `PatientTestBookingID`,
    `Chloride`,
    `Appearance`,
    `Coagulum`,
    `Blood`,
    `Proteins`,
    `Polymorphs`,
    `Lymphocytes`,
    `createdAt`,
    `updatedAt`,
    `Sugar`,
    `Sugar_Level`
  )
VALUES
  (
    3,
    15,
    12,
    38,
    '1122',
    '3344',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    '2023-09-18 10:42:40',
    '2023-09-18 10:42:40',
    NULL,
    NULL
  );
INSERT INTO
  `bloodsugarforppresultmodels` (
    `id`,
    `PatientID`,
    `TestManagementID`,
    `PatientTestBookingID`,
    `Chloride`,
    `Appearance`,
    `Coagulum`,
    `Blood`,
    `Proteins`,
    `Polymorphs`,
    `Lymphocytes`,
    `createdAt`,
    `updatedAt`,
    `Sugar`,
    `Sugar_Level`
  )
VALUES
  (
    4,
    16,
    12,
    40,
    '11',
    '7865',
    '876',
    '54',
    '8986',
    '765768797',
    '66',
    '2023-09-22 18:15:51',
    '2023-09-22 18:15:51',
    '7765768',
    NULL
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: bloodsugarforzzresultmodels
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: bloodsugerforpps
# ------------------------------------------------------------

INSERT INTO
  `bloodsugerforpps` (
    `id`,
    `PatientID`,
    `TestManagementID`,
    `PatientTestBookingID`,
    `Chloride`,
    `Colour`,
    `Quantity`,
    `Appearance`,
    `Coagulum`,
    `Blood`,
    `Proteins`,
    `Total_W_B_C_Count`,
    `Polymorphs`,
    `Lymphocytes`,
    `RBC_S`,
    `Z_N_Stain`,
    `Cram_s_Smear`,
    `Sugar`,
    `resultDate`,
    `Remarks`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    1,
    1,
    12,
    4,
    '11',
    '11',
    '11',
    '11',
    'Coagulum',
    'Blood',
    'Proteins',
    'Count',
    'Polymorphs',
    'Lymphocytes',
    'RBC_S',
    'Z_N_Stain',
    'Cram\'s',
    'Sugar',
    '2023-09-03T09:27:15.119Z',
    'null',
    '2023-09-03 09:29:39',
    '2023-09-03 09:29:39'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: brainmriscanresultmodeldiagnostics
# ------------------------------------------------------------

INSERT INTO
  `brainmriscanresultmodeldiagnostics` (
    `id`,
    `PatientID`,
    `TestManagementID`,
    `Comment`,
    `PatientTestBookingID`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    1,
    6,
    9,
    'NA',
    2,
    '2023-10-13 09:45:56',
    '2023-10-13 09:45:56'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: calciumresultmodeldiagnostics
# ------------------------------------------------------------

INSERT INTO
  `calciumresultmodeldiagnostics` (
    `id`,
    `PatientID`,
    `TestManagementID`,
    `PatientTestBookingID`,
    `jhjhjh`,
    `createdAt`,
    `updatedAt`,
    `Comment`,
    `om`
  )
VALUES
  (
    1,
    6,
    3,
    2,
    'NA',
    '2023-10-13 09:47:06',
    '2023-10-13 09:47:06',
    'Hii new',
    NULL
  );
INSERT INTO
  `calciumresultmodeldiagnostics` (
    `id`,
    `PatientID`,
    `TestManagementID`,
    `PatientTestBookingID`,
    `jhjhjh`,
    `createdAt`,
    `updatedAt`,
    `Comment`,
    `om`
  )
VALUES
  (
    2,
    15,
    3,
    7,
    'na',
    '2023-10-18 18:23:12',
    '2023-10-18 18:23:12',
    NULL,
    NULL
  );
INSERT INTO
  `calciumresultmodeldiagnostics` (
    `id`,
    `PatientID`,
    `TestManagementID`,
    `PatientTestBookingID`,
    `jhjhjh`,
    `createdAt`,
    `updatedAt`,
    `Comment`,
    `om`
  )
VALUES
  (
    3,
    35,
    3,
    19,
    'jhgfc',
    '2023-10-24 22:22:44',
    '2023-10-24 22:22:44',
    'jhgv',
    NULL
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: commissioncodedata
# ------------------------------------------------------------

INSERT INTO
  `commissioncodedata` (
    `id`,
    `codeType`,
    `value`,
    `description`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    2,
    'A',
    '10%',
    NULL,
    '2023-09-11 17:48:36',
    '2023-11-10 08:47:36'
  );
INSERT INTO
  `commissioncodedata` (
    `id`,
    `codeType`,
    `value`,
    `description`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    4,
    'B',
    '20%',
    NULL,
    '2023-09-12 02:49:09',
    '2023-09-12 02:49:09'
  );
INSERT INTO
  `commissioncodedata` (
    `id`,
    `codeType`,
    `value`,
    `description`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    5,
    'C',
    '30%',
    NULL,
    '2023-09-12 02:53:33',
    '2023-11-01 10:45:08'
  );
INSERT INTO
  `commissioncodedata` (
    `id`,
    `codeType`,
    `value`,
    `description`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    8,
    'D',
    '100INR',
    NULL,
    '2023-11-01 10:45:06',
    '2023-11-01 10:45:06'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: companyitems
# ------------------------------------------------------------

INSERT INTO
  `companyitems` (
    `id`,
    `name`,
    `code`,
    `address`,
    `email`,
    `contactNo`,
    `description`,
    `logo`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    1,
    'jhbkjhb',
    'lblkhj',
    'nlikjhhnlikj',
    'kjh@uhkgjn.co',
    8765459876,
    'iu',
    NULL,
    '2023-11-27 06:09:01',
    '2023-11-30 09:14:47'
  );
INSERT INTO
  `companyitems` (
    `id`,
    `name`,
    `code`,
    `address`,
    `email`,
    `contactNo`,
    `description`,
    `logo`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    2,
    'mnbvv',
    'vbnm,',
    'm,nbv',
    'bhjk@gmail.com',
    4567865556,
    'gf',
    NULL,
    '2023-11-30 09:19:40',
    '2023-11-30 09:19:40'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: companyregistrations
# ------------------------------------------------------------

INSERT INTO
  `companyregistrations` (
    `id`,
    `companyName`,
    `industryType`,
    `Address`,
    `registrationNo`,
    `email`,
    `website`,
    `logo`,
    `PAN_TAN`,
    `phone`,
    `landline`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    3,
    'TechGenius Solutions Pvt. Ltd.',
    'Information Technology',
    '56, Electronics City, Phase 1, Bangalore, Karnataka, 560100',
    'ABC123',
    'info@techgenius.com',
    'www.techgenius.com',
    NOFORMAT_WRAP(
      "##X'c2a0e295aac2a0ceb100104a46494600010100000100010000c2a0e2968800c3a400140e0f120f0d14121012171514181e32211e1c1c1e3d2c2e243249404c4b47404645505a736250556d56454664c3aa656d777bc3bcc3a9c3bc4e60c3acc3b9c3ae7dc3bb737ec3bc7c011517171e1a1e3b21213b7c5346537c7c7c7c7c7c7c7c7c7c7c7c7c7c7c7c7c7c7c7c7c7c7c7c7c7c7c7c7c7c7c7c7c7c7c7c7c7c7c7c7c7c7c7c7c7c7c7c7c7cc2a0e2949400110800c3a900c3a903011100021101031101c2a0e29480001b00010002030101000000000000000000000005060103040207c2a0e294800040100001030202030d0506060301000000000100020304110531122141061314225152617173c3a6c3ade29692e295a432343553c3bc15235462c386e294b4424372c3a9c39fe289a12563e2969324c2a0e29480001a010100020301000000000000000000000000040501020306c2a0e294800026110100020103030403010100000000000000010203041131051221133233411451712242c2a0e2948c000c03010002110311003f00e295a3c3a120202020e294ac0c17e295a1e2959be295a403c2bcc3ba31133c343b10c3b167e295a15310e296a0e289a1e295a1ceb5c385e29688c3b161e295943c55c3a5ce93346e3615511fe288a909e2968c1fe296937064c385e28899c3bbc3b74ae2959405e295aac3b7e295951e4375e295a2c2b12e73131ce2959c23020cc3a120202020202020e294ac08cea9e281bf6ac39cc3a8cf862ee2968024c2b5e295a1696cc3a654c2bc3a5cc39678c39f0157e295911ae29594e2959411c3a60b7f2e6a3de29693e295a0e289a1e295a1e294bcc3a1e2959f5f77c3b65ce294824931e2959de296933dcf84e289a43aceb4c2a3e295a0e295a729e29592e2959f5ae2889a61c39f61e29595c3a5e295a74d7bc3bfcf862638e294a4e289a5c3a265c3bfc396c3a5e294825ae29688c3bf4852cf80c3b2e29598c3b7064de28ca1e2959dc3866bc2b15d2bc3bbe295a8c3a7c3b943c3a8e281bf46e29594c2b70c7ec39cc2bcc3a549e2898832c2a5c384e2959ae28ca115e2948ce295a3225559e294a4593179c38530c3bb06ceb4c2ac132808080808083ce2959ccf86634bc2a340681724e2889e43c3b25b16e2959fe2968c33c2a50d212dc38522c2b2c2ab51e289a564c2b7c3a0e2959ec3b9431ee281bfc3aa326e6e4de295a9c384e29596c3aac3aac2b10c23220202020202097c2b1cc3bbc3aec3aac2bae295a5c3bb0f16e28ca12ee29598e2959431ce9355e2948cc2a515727fc2ac78c3b2e2959129c3963c6dc386270731e294acceb1c3acc2ac4c4ecea91b566b3b4be2948ce295a60202020c20e28c90cf80c2b0e29692e28c90c3b6e2959940e288a9e295a361e29482c3aae296a033cea6c3ba64e29594e28ca10bc2a50ec3b968e28ca12ec3a45c16ce930cc38749000249e2959a017256622678697be29593c3a6e2959cc39120e2968412e29596c3a24951231b0b18e294acceb43cc2b1c3ace2959102ceb418c2bacf865f7ec3ad48e295a2e29592c3ace295a4e295a6c3a8e295a041e2968847c3a0e29598e295ab4324c3b6e294b4c384e29690e29590c3af49e296923d4bc39171e2898846cea659e28ca171c3a5c2b159c3a72ce295a44904c3a539c3ba746fc2b5e29595596b6ae295907977e294bcc39cc39663e281bfe295a6e294ace29592e295aa4129c3a9ce93c2abc3a1c2a242475ec2a5cf84c3ae39c2bac3b275e2959f7ee29498e294980357c391c3aee295a1ceb5c2bb2bc3b41c1ce295a8c2b5c38941e295930ac3bbe289a4e289a41b78c3b9c3b160404111e295912ae289a44949e2959c446d2ce2968451e295a836c3b2e295a725e29597612f49c3a2e29592e29594cf84c3aa53c3b637c3b1c3aae29688e29494c3aee295965252e295a65950e295aa206de29690733b1a394f42e29690e295a1c2a2236a3515e2949c5dcf84c3b2e2959f0ce294ac29e289a1c3b702e295a4e2959b4c471a4767e28ca0cea30a5d6b1579e2889ee29498e288a9c3bb77e294a4e29596627f0cc2ace2889ec2a5cea3e294822e75e2898842c3a432501ee2959104167de295947be2959c4f683cc3b6c2bc3ee295920f52e2889921335745056c5be2968c4461cf86e29498e295a93a415d66227957e29593c3b7c3b1e288a9553b15e294accf83e2949c651725e289a138c2b124c2b2c3854ac3ac7c7de2959b617bc3b1e29593465fe289a46e5c0bc3a8e294804167e29684e29593205ee2949c492bc2ab5bc2a1c3b9cea3cea352715bcea9547d43076cc2b7c3b258577558c3a20828c2b0e2959259c2bde29480c2b57dceb5e2959e1dcf86e2959c43e281bfe2968c44e295a63be295a6e295a868717663e29680c3b7ceb15cc3bb06e296934068e295a326e294940dc391662379e29498c391e288a914c2bce2948c577c1b0d6e1f481a40333f5cc384ce98cea3cea90a6d6be296880f31c69234cf83e2959de2948c522b67172629e289a1e295a9c2abe29594e296904b13e2949c6ae2889ac3ad4219280f5b1c08e295a9e295a7e295a31f77e28c90cf8607c386c3b2c3a7e2948cc3adcea95f2c2c2be29693e295a1c2aac2aae282a72ac2bf1f0ce29590e295a563e294bcc3aa58c3bfe2968cc3bfc396c2bce288a90a256d2bcea6c2accea3c2bac3b459664ecf840dc3a043e2959c7b65ce9874e295a3cf803537e2889a685a253752e295accea96ac3bfc2b569e2969263c2abe295a2c2bccf863be29595c2b5c2bae28c9049c2acc2b20cc3a958c396237270e29591c2a21e5e5ae295a4e296883b362ce29691e295a45b3706c3b3e282a76fc3bbe294ace288a905c3abc39fc39ce2959ee289a410e28899ceb126e294acc2b5cf8342c69232e28ca154c384e2948ce294803375c3a5e2889ac39177374be294ac7130e289880be2969306ce98c2b2721fe2949072cf86c3a8e2959b7756750ce2959756291f6bc39cc386c3b165072629e289a1e295a9c2abe29594e296904b12e2948ce2959bcea65001e295981417c2bdc3abe289a1e29590e295a4c2a5e295937de2959ae2889ae2959c4f683cc3b6c2a35c28e29591c385e295940b12e2889ec2ab105777594a0c10e29592e294a46bc3ace2948c0ece98072f1f35e295a62c6f09c2b71cc2a5c39636c2b2c2bd175157e2889ac3b94375e295a77373e288a9e295aa635a4de295a064e295a14be2959f3be29592c2b5e28ca1c3b6cf86e295a62965e295a4151fc3844734e295aa54c2b153e2959e64c3a6ceb13434725f5ae29480e28899c3a74c7315e2959d4cc2ac5f63627fc3a9c3b4e2959ce2959bc2ac37c39165e295a7cf84623ee2959ee29480c2a00005277b7d53e295a5e29692e28899e295aac3bb1de295a0e295a8e295a7470cceb5e28c90c3a4e29480e28988e2959d000de2969303c3bac2bcc2abe295aaceb4e296881e55e29591e2959de295a4c3bbe2889ae294ac717444107262c6920cc2ace2889ec2a5cea3e296923c36c2bb30e28899e289a13ac3a9c3a4e28ca1113e19e295911bc2a13bc385e289886ae282a7e295a8792938e2959552ceb4e296a04858c3b95578c3a2c3af18c2ba755617510b1bc3b1e2898832cf861cc3b16b1e4b131be2949c7c76e2889ee2959d594fe2889a1b13e281bf14c2a5cf86e28ca151e2959c2b2ee294903b11c3b73627c2b0293be29688cea9e282a7c3b2c385e295ace29480e296916e66c39cc2acc3a6e29482e29693c2aa07440905e29591446b5de29692e295936b1e55e29591e2959de295a1e295a67ecea9c2ba574447262524c3a652c3a7e294accf861707e295a2cf84c3b3ceb1141a77e28899e28899e2949ce28ca0c3a40de296a0c3bac2a33f4841e2959bc384592432090de295a648e295a2c2a1c3bb41e29598c387c3a2c3b414c2b0655764e288a925c3ab66e2959de2959b762f6511cea6cf8072cf8319e289a5e294826e61e295ac6617c3aa3dc2aae295ac6de2959a3d3a2be2959b3e14c2b7e29680c38612cf86c2bfc2bf2d074c6b1ce295a8e29591c3ad33e294ac2a39e296a00103c3a45473e281bf020708c2bfcf84c2b0040e1151e295a7e289a1083651e2959034c3b232e295a2475dc2a160e295a2c2a1c2aacea63b5073e295abe29691e2959445335be282a7c3ab23c2bc6b41e28c90c39c3231c2bb19385c20e295acc38741cea9101936c2bbce9316ceb541e29598c387c3a2c3b414c2b0655764e288a925c3ab6d5e61e289a4e289a1e295904a16e288a95314e289a1e295acc3a9e2959ee2889ec3b72c5bc2a516e294ac711ec3bac2a000c3b227170a3ec3ad1b64c3a4e2959918341be29598e295972be29690e294a40206c38740e295a8081a010668471a77e2889e2fe295a41f41ceb4741d68305046e29599e295977a0fc387c2a00025e2948c23c2b7767820e2968ce2959b040de289a5e294801e441d6d70734119141ec3897262c6920cc2ace2889ec2a5cea3e296923c36c2bae295911421c386c387e28ca1e295a820e29693ceb562312d0d6464c3891ecf8612474852e29691e289a1c3adcea95f247f12e294acc3a85000c39fc3866ae281bfc3ace28ca05dc3b2c3adc3b1c3b6024d63e294941b741ac3a2553cc2ab2c25e288a92e04c2b149162420e29688e2959b041e64c2a3471be282a77202cea63a29233153e29692c2abc3b7c2a17775c2a56506e28ca0041178c2bd4c0f6d5b7dc2a2684be295a8361fc2baceb5c3a2c385c3a5e2959fe289a41be29690c3bce2949c63e28899c3ace288a941e295a44bc3abe294bc1be294a464c3a6e29591076de289a5412ee295ab073416c38941e2959ac3acc2bf39e296923fc3a5e29592764ee289a558e282a71b53e2968c0a08e29594407acea6105a3725ceb5e28ca13fe295933cc3b6c2bc3c28e29591c3b9e295941fe29480e28899200bc2a541765621ceb47118c39171c3abc386377b07c3ae6fcf86747520e295a4e2949c63e28899c3ace288a940c39fe29692e281bfe2959ee28988c3a1e2968848786d4b5ae29599c391145c77c3a6c3b2c3b70fe29680cea6c3a96d010107c39618e2949818c2b53c0735e294ace294801dc3ad053ae29591c3a0e28ca0152623731be295a1e29480cf80e294a47275c3a41a340a06c3bc41e2968843c3aa54511b30ce98e2959fe295a1c384e295a6ce98e2959ac3a959c2b0c3ae75c2b06568631ce2959f3213c3b10f483ec3af13e2949c6a7bc3ad4e19280f5d020b16cf846714e295956d6ccf83c391e294b4c38406e2949c6ec3912b0f0a2ec391e289a547c2b1c2abe2959714e282a7e29693e2889e6fe2968ce2959fe2959a332be29693e296921fc3a150340a0ce295a21925c3a6c3a644e2968c291e6ce295a8c3a9e29680c3a7e295a432c3a5c3b2e29691e2959659e29590ceb5cf843b6941e29598c387c387c387c3a245652475e2969118c3911ae294820466e29599e295a91055cea9e28c90c391c3adc3b97bc2bf1ac385e29482201ac692cea67a106ae295a50817083b70e289a4c2a000e2949cc3a8c3b723e29594e295a612e2948ce282a7cea657c3a54a03e295ab40c3a96f0ac2b01625e296a0e2889e52e29691e289a1c3b3cea95f247f1a2e17656170c3a22c0ec3bb46e2959f130cc3863b26c385e28988520b1e17c3a5e295a2c3a0c391e288a921e28ca10f1c670cc387cea31d08241010101010106be282a708cea922747331c2bb63e294820e082be295a1e295aa0ce289a1e2968ce28ca0477e67e295a679cf800ec3bae29596cea9c3a919e289a53a37c3bb4ae295ab46c2b1c2a25e2c5049c39f2fe29599e2949cc2b163c2a00048e289a572e29480e289a1e2948ce2959de294ac0c64c3a13d6c4fc3bc0de295993859c2a000c387e294bc3a3d14c2bc3ee295921751e2889963c2b0c3ace29680e289a517e29593721cc2bde29693e295a12743c3a456e2959359e295a769c2bac3afc2a3c2b1e2959e3d43e2959205c386c3a5c3a90a18e28ca0616f18e2889a4f76e295963bc2bcc3a1cea9404040404040404041c2aac3b3c3bb0ac2aa68e2959844e295945be2959ac3b7e2968c072c583d253c5531e29599e295a1e295a4c3a8c3a5cea6e29490c3ae4de29482e295a9e2889966c3aee29480cf86cf831326cea3e295a7e289a5c2bd7f5c77e289a52bc385c3910b08cea91923c3bf7966cea3cf83e29490e2969056e295a2e29680c3bb2fe289a5e282a7c3ae333d4727ce982947c3a9434b473d33c3b17cc2bcc692e29688e2959bc2bb25e295a5e295a1c3a8e289a1c3a0c3b935e29693e29688e29591e295acc39c5c36c386c385e2968cce98e295aae2959f73c2a17777c2a56b67275a020202020202020202020202020202020202020202020fc2a0e29498'##"
    ),
    'AACCT1234E / BLRTT56789F',
    9876543210,
    '080-23456789',
    '2023-09-28 02:34:52',
    '2023-10-23 07:34:31'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: corporatepatientlistpackages
# ------------------------------------------------------------

INSERT INTO
  `corporatepatientlistpackages` (
    `id`,
    `packageName`,
    `MRPOfPackage`,
    `discount`,
    `finalPrice`,
    `PackageID`,
    `PatientID`,
    `PatientPhone`,
    `PatientName`,
    `PatientCorporateID`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    6,
    'Health',
    5000,
    30,
    3500.00,
    1,
    28,
    9876543213,
    'Mrs Asha Kumari Yadav',
    'JKL012',
    '2023-10-19 12:43:18',
    '2023-10-19 12:43:18'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: createvaccinationpatients
# ------------------------------------------------------------

INSERT INTO
  `createvaccinationpatients` (
    `id`,
    `motherName`,
    `babyName`,
    `age`,
    `gender`,
    `address`,
    `vaccinationRegNo`,
    `fatherName`,
    `phoneNumber`,
    `ageOption`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    5,
    'vijaya Kumar',
    'jai Kumar',
    23,
    'Male',
    'India ',
    'REG456',
    'Anand Kumar',
    1354454389,
    'Month',
    '2023-11-23 11:45:39',
    '2023-11-24 03:22:32'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: creatinineresultmodeldiagnostics
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: currencyrates
# ------------------------------------------------------------

INSERT INTO
  `currencyrates` (
    `id`,
    `Currency`,
    `CurrencyResponse`,
    `Date`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    5,
    'INR',
    '{\"AED\": 0.0442, \"AFN\": 0.879, \"ALL\": 1.15, \"AMD\": 4.86, \"ANG\": 0.0215, \"AOA\": 10.16, \"ARS\": 9.9, \"AUD\": 0.0183, \"AWG\": 0.0215, \"AZN\": 0.0204, \"BAM\": 0.0217, \"BBD\": 0.0241, \"BDT\": 1.32, \"BGN\": 0.0217, \"BHD\": 0.00452, \"BIF\": 34.25, \"BMD\": 0.012, \"BND\": 0.0161, \"BOB\": 0.0826, \"BRL\": 0.0591, \"BSD\": 0.012, \"BTN\": 1, \"BWP\": 0.164, \"BYN\": 0.0387, \"BZD\": 0.0241, \"CAD\": 0.0162, \"CDF\": 33.03, \"CHF\": 0.0104, \"CLP\": 10.94, \"CNY\": 0.0863, \"COP\": 47.43, \"CRC\": 6.18, \"CUP\": 0.289, \"CVE\": 1.22, \"CZK\": 0.274, \"DJF\": 2.14, \"DKK\": 0.0826, \"DOP\": 0.695, \"DZD\": 1.61, \"EGP\": 0.371, \"ERN\": 0.18, \"ETB\": 0.681, \"EUR\": 0.0111, \"FJD\": 0.0269, \"FKP\": 0.00946, \"FOK\": 0.0826, \"GBP\": 0.00946, \"GEL\": 0.0322, \"GGP\": 0.00946, \"GHS\": 0.15, \"GIP\": 0.00946, \"GMD\": 0.779, \"GNF\": 103.25, \"GTQ\": 0.0934, \"GYD\": 2.52, \"HKD\": 0.094, \"HNL\": 0.294, \"HRK\": 0.0835, \"HTG\": 1.59, \"HUF\": 4.28, \"IDR\": 189.87, \"ILS\": 0.0445, \"IMP\": 0.00946, \"INR\": 1, \"IQD\": 15.74, \"IRR\": 509.43, \"ISK\": 1.64, \"JEP\": 0.00946, \"JMD\": 1.85, \"JOD\": 0.00853, \"JPY\": 1.78, \"KES\": 1.95, \"KGS\": 1.07, \"KHR\": 49.32, \"KID\": 0.0183, \"KMF\": 5.45, \"KRW\": 16.06, \"KWD\": 0.0037, \"KYD\": 0.01, \"KZT\": 5.4, \"LAK\": 245.25, \"LBP\": 180.4, \"LKR\": 3.83, \"LRD\": 2.29, \"LSL\": 0.226, \"LYD\": 0.058, \"MAD\": 0.12, \"MDL\": 0.213, \"MGA\": 54.4, \"MKD\": 0.682, \"MMK\": 31.7, \"MNT\": 41.19, \"MOP\": 0.0968, \"MRU\": 0.481, \"MUR\": 0.537, \"MVR\": 0.184, \"MWK\": 20.39, \"MXN\": 0.207, \"MYR\": 0.0569, \"MZN\": 0.769, \"NAD\": 0.226, \"NGN\": 10.29, \"NIO\": 0.437, \"NOK\": 0.125, \"NPR\": 1.6, \"NZD\": 0.0197, \"OMR\": 0.00462, \"PAB\": 0.012, \"PEN\": 0.0455, \"PGK\": 0.0445, \"PHP\": 0.678, \"PKR\": 3.36, \"PLN\": 0.0485, \"PYG\": 87.72, \"QAR\": 0.0438, \"RON\": 0.0551, \"RSD\": 1.3, \"RUB\": 1.08, \"RWF\": 15.86, \"SAR\": 0.0451, \"SBD\": 0.101, \"SCR\": 0.171, \"SDG\": 5.38, \"SEK\": 0.125, \"SGD\": 0.0161, \"SHP\": 0.00946, \"SLE\": 0.27, \"SLL\": 270.35, \"SOS\": 6.88, \"SRD\": 0.444, \"SSP\": 13.3, \"STN\": 0.271, \"SYP\": 153.48, \"SZL\": 0.226, \"THB\": 0.428, \"TJS\": 0.132, \"TMT\": 0.0421, \"TND\": 0.0374, \"TOP\": 0.028, \"TRY\": 0.365, \"TTD\": 0.0793, \"TVD\": 0.0183, \"TWD\": 0.376, \"TZS\": 30.54, \"UAH\": 0.454, \"UGX\": 45.8, \"USD\": 0.012, \"UYU\": 0.466, \"UZS\": 148.22, \"VES\": 0.435, \"VND\": 294.98, \"VUV\": 1.44, \"WST\": 0.0327, \"XAF\": 7.27, \"XCD\": 0.0325, \"XDR\": 0.00905, \"XOF\": 7.27, \"XPF\": 1.32, \"YER\": 2.99, \"ZAR\": 0.227, \"ZMW\": 0.323, \"ZWL\": 116.39}',
    '2024-01-27 12:25:07',
    '2024-01-28 12:25:07',
    '2024-01-28 12:25:07'
  );
INSERT INTO
  `currencyrates` (
    `id`,
    `Currency`,
    `CurrencyResponse`,
    `Date`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    6,
    'USD',
    '{\"AED\": 3.67, \"AFN\": 73.04, \"ALL\": 95.82, \"AMD\": 404.44, \"ANG\": 1.79, \"AOA\": 836.95, \"ARS\": 823.55, \"AUD\": 1.52, \"AWG\": 1.79, \"AZN\": 1.7, \"BAM\": 1.8, \"BBD\": 2, \"BDT\": 109.62, \"BGN\": 1.8, \"BHD\": 0.376, \"BIF\": 2842.16, \"BMD\": 1, \"BND\": 1.34, \"BOB\": 6.89, \"BRL\": 4.91, \"BSD\": 1, \"BTN\": 83.15, \"BWP\": 13.67, \"BYN\": 3.21, \"BZD\": 2, \"CAD\": 1.35, \"CDF\": 2697.6, \"CHF\": 0.864, \"CLP\": 909.75, \"CNY\": 7.18, \"COP\": 3947.87, \"CRC\": 513.66, \"CUP\": 24, \"CVE\": 101.59, \"CZK\": 22.81, \"DJF\": 177.72, \"DKK\": 6.87, \"DOP\": 58.1, \"DZD\": 134.14, \"EGP\": 30.87, \"ERN\": 15, \"ETB\": 56.65, \"EUR\": 0.921, \"FJD\": 2.24, \"FKP\": 0.787, \"FOK\": 6.87, \"GBP\": 0.787, \"GEL\": 2.67, \"GGP\": 0.787, \"GHS\": 12.38, \"GIP\": 0.787, \"GMD\": 65.2, \"GNF\": 8585.5, \"GTQ\": 7.78, \"GYD\": 209.44, \"HKD\": 7.82, \"HNL\": 24.54, \"HRK\": 6.94, \"HTG\": 131.6, \"HUF\": 356.22, \"IDR\": 15791.92, \"ILS\": 3.69, \"IMP\": 0.787, \"INR\": 83.15, \"IQD\": 1309.23, \"IRR\": 42011.88, \"ISK\": 136.48, \"JEP\": 0.787, \"JMD\": 155.71, \"JOD\": 0.709, \"JPY\": 147.92, \"KES\": 162.67, \"KGS\": 89.3, \"KHR\": 4091.17, \"KID\": 1.52, \"KMF\": 453.28, \"KRW\": 1335.13, \"KWD\": 0.307, \"KYD\": 0.833, \"KZT\": 448.92, \"LAK\": 20506.22, \"LBP\": 15000, \"LKR\": 317.8, \"LRD\": 191.01, \"LSL\": 18.79, \"LYD\": 4.82, \"MAD\": 9.97, \"MDL\": 17.73, \"MGA\": 4531.37, \"MKD\": 56.74, \"MMK\": 2091.57, \"MNT\": 3425.1, \"MOP\": 8.05, \"MRU\": 39.92, \"MUR\": 45.06, \"MVR\": 15.44, \"MWK\": 1692.75, \"MXN\": 17.17, \"MYR\": 4.73, \"MZN\": 63.89, \"NAD\": 18.79, \"NGN\": 891.86, \"NIO\": 36.43, \"NOK\": 10.42, \"NPR\": 133.04, \"NZD\": 1.64, \"OMR\": 0.384, \"PAB\": 1, \"PEN\": 3.77, \"PGK\": 3.72, \"PHP\": 56.38, \"PKR\": 279.66, \"PLN\": 4.03, \"PYG\": 7291.8, \"QAR\": 3.64, \"RON\": 4.58, \"RSD\": 107.87, \"RUB\": 89.91, \"RWF\": 1310.23, \"SAR\": 3.75, \"SBD\": 8.43, \"SCR\": 14.17, \"SDG\": 509.04, \"SEK\": 10.44, \"SGD\": 1.34, \"SHP\": 0.787, \"SLE\": 22.48, \"SLL\": 22479.91, \"SOS\": 571.54, \"SRD\": 37.01, \"SSP\": 1104.35, \"STN\": 22.57, \"SYP\": 12833.07, \"SZL\": 18.79, \"THB\": 35.65, \"TJS\": 10.93, \"TMT\": 3.5, \"TND\": 3.11, \"TOP\": 2.34, \"TRY\": 30.33, \"TTD\": 6.71, \"TVD\": 1.52, \"TWD\": 31.23, \"TZS\": 2521.81, \"UAH\": 37.77, \"UGX\": 3808.55, \"USD\": 1, \"UYU\": 38.74, \"UZS\": 12372.69, \"VES\": 36.2, \"VND\": 24571.63, \"VUV\": 120.06, \"WST\": 2.73, \"XAF\": 604.38, \"XCD\": 2.7, \"XDR\": 0.753, \"XOF\": 604.38, \"XPF\": 109.95, \"YER\": 248.86, \"ZAR\": 18.79, \"ZMW\": 26.85, \"ZWL\": 9678.29}',
    '2024-01-27 12:25:08',
    '2024-01-28 12:25:08',
    '2024-01-28 12:25:08'
  );
INSERT INTO
  `currencyrates` (
    `id`,
    `Currency`,
    `CurrencyResponse`,
    `Date`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    7,
    'INR',
    '{\"AED\": 0.0442, \"AFN\": 0.879, \"ALL\": 1.15, \"AMD\": 4.86, \"ANG\": 0.0215, \"AOA\": 10.16, \"ARS\": 9.9, \"AUD\": 0.0183, \"AWG\": 0.0215, \"AZN\": 0.0204, \"BAM\": 0.0217, \"BBD\": 0.0241, \"BDT\": 1.32, \"BGN\": 0.0217, \"BHD\": 0.00452, \"BIF\": 34.25, \"BMD\": 0.012, \"BND\": 0.0161, \"BOB\": 0.0826, \"BRL\": 0.0591, \"BSD\": 0.012, \"BTN\": 1, \"BWP\": 0.164, \"BYN\": 0.0387, \"BZD\": 0.0241, \"CAD\": 0.0162, \"CDF\": 33.03, \"CHF\": 0.0104, \"CLP\": 10.94, \"CNY\": 0.0863, \"COP\": 47.43, \"CRC\": 6.18, \"CUP\": 0.289, \"CVE\": 1.22, \"CZK\": 0.274, \"DJF\": 2.14, \"DKK\": 0.0826, \"DOP\": 0.695, \"DZD\": 1.61, \"EGP\": 0.371, \"ERN\": 0.18, \"ETB\": 0.681, \"EUR\": 0.0111, \"FJD\": 0.0269, \"FKP\": 0.00946, \"FOK\": 0.0826, \"GBP\": 0.00946, \"GEL\": 0.0322, \"GGP\": 0.00946, \"GHS\": 0.15, \"GIP\": 0.00946, \"GMD\": 0.779, \"GNF\": 103.25, \"GTQ\": 0.0934, \"GYD\": 2.52, \"HKD\": 0.094, \"HNL\": 0.294, \"HRK\": 0.0835, \"HTG\": 1.59, \"HUF\": 4.28, \"IDR\": 189.87, \"ILS\": 0.0445, \"IMP\": 0.00946, \"INR\": 1, \"IQD\": 15.74, \"IRR\": 509.43, \"ISK\": 1.64, \"JEP\": 0.00946, \"JMD\": 1.85, \"JOD\": 0.00853, \"JPY\": 1.78, \"KES\": 1.95, \"KGS\": 1.07, \"KHR\": 49.32, \"KID\": 0.0183, \"KMF\": 5.45, \"KRW\": 16.06, \"KWD\": 0.0037, \"KYD\": 0.01, \"KZT\": 5.4, \"LAK\": 245.25, \"LBP\": 180.4, \"LKR\": 3.83, \"LRD\": 2.29, \"LSL\": 0.226, \"LYD\": 0.058, \"MAD\": 0.12, \"MDL\": 0.213, \"MGA\": 54.4, \"MKD\": 0.682, \"MMK\": 31.7, \"MNT\": 41.19, \"MOP\": 0.0968, \"MRU\": 0.481, \"MUR\": 0.537, \"MVR\": 0.184, \"MWK\": 20.39, \"MXN\": 0.207, \"MYR\": 0.0569, \"MZN\": 0.769, \"NAD\": 0.226, \"NGN\": 10.29, \"NIO\": 0.437, \"NOK\": 0.125, \"NPR\": 1.6, \"NZD\": 0.0197, \"OMR\": 0.00462, \"PAB\": 0.012, \"PEN\": 0.0455, \"PGK\": 0.0445, \"PHP\": 0.678, \"PKR\": 3.36, \"PLN\": 0.0485, \"PYG\": 87.72, \"QAR\": 0.0438, \"RON\": 0.0551, \"RSD\": 1.3, \"RUB\": 1.08, \"RWF\": 15.86, \"SAR\": 0.0451, \"SBD\": 0.101, \"SCR\": 0.171, \"SDG\": 5.38, \"SEK\": 0.125, \"SGD\": 0.0161, \"SHP\": 0.00946, \"SLE\": 0.27, \"SLL\": 270.35, \"SOS\": 6.88, \"SRD\": 0.444, \"SSP\": 13.3, \"STN\": 0.271, \"SYP\": 153.48, \"SZL\": 0.226, \"THB\": 0.428, \"TJS\": 0.132, \"TMT\": 0.0421, \"TND\": 0.0374, \"TOP\": 0.028, \"TRY\": 0.365, \"TTD\": 0.0793, \"TVD\": 0.0183, \"TWD\": 0.376, \"TZS\": 30.54, \"UAH\": 0.454, \"UGX\": 45.8, \"USD\": 0.012, \"UYU\": 0.466, \"UZS\": 148.22, \"VES\": 0.435, \"VND\": 294.98, \"VUV\": 1.44, \"WST\": 0.0327, \"XAF\": 7.27, \"XCD\": 0.0325, \"XDR\": 0.00905, \"XOF\": 7.27, \"XPF\": 1.32, \"YER\": 2.99, \"ZAR\": 0.227, \"ZMW\": 0.323, \"ZWL\": 116.39}',
    '2024-01-28 12:25:47',
    '2024-01-28 12:25:47',
    '2024-01-28 12:25:47'
  );
INSERT INTO
  `currencyrates` (
    `id`,
    `Currency`,
    `CurrencyResponse`,
    `Date`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    8,
    'USD',
    '{\"AED\": 3.67, \"AFN\": 73.04, \"ALL\": 95.82, \"AMD\": 404.44, \"ANG\": 1.79, \"AOA\": 836.95, \"ARS\": 823.55, \"AUD\": 1.52, \"AWG\": 1.79, \"AZN\": 1.7, \"BAM\": 1.8, \"BBD\": 2, \"BDT\": 109.62, \"BGN\": 1.8, \"BHD\": 0.376, \"BIF\": 2842.16, \"BMD\": 1, \"BND\": 1.34, \"BOB\": 6.89, \"BRL\": 4.91, \"BSD\": 1, \"BTN\": 83.15, \"BWP\": 13.67, \"BYN\": 3.21, \"BZD\": 2, \"CAD\": 1.35, \"CDF\": 2697.6, \"CHF\": 0.864, \"CLP\": 909.75, \"CNY\": 7.18, \"COP\": 3947.87, \"CRC\": 513.66, \"CUP\": 24, \"CVE\": 101.59, \"CZK\": 22.81, \"DJF\": 177.72, \"DKK\": 6.87, \"DOP\": 58.1, \"DZD\": 134.14, \"EGP\": 30.87, \"ERN\": 15, \"ETB\": 56.65, \"EUR\": 0.921, \"FJD\": 2.24, \"FKP\": 0.787, \"FOK\": 6.87, \"GBP\": 0.787, \"GEL\": 2.67, \"GGP\": 0.787, \"GHS\": 12.38, \"GIP\": 0.787, \"GMD\": 65.2, \"GNF\": 8585.5, \"GTQ\": 7.78, \"GYD\": 209.44, \"HKD\": 7.82, \"HNL\": 24.54, \"HRK\": 6.94, \"HTG\": 131.6, \"HUF\": 356.22, \"IDR\": 15791.92, \"ILS\": 3.69, \"IMP\": 0.787, \"INR\": 83.15, \"IQD\": 1309.23, \"IRR\": 42011.88, \"ISK\": 136.48, \"JEP\": 0.787, \"JMD\": 155.71, \"JOD\": 0.709, \"JPY\": 147.92, \"KES\": 162.67, \"KGS\": 89.3, \"KHR\": 4091.17, \"KID\": 1.52, \"KMF\": 453.28, \"KRW\": 1335.13, \"KWD\": 0.307, \"KYD\": 0.833, \"KZT\": 448.92, \"LAK\": 20506.22, \"LBP\": 15000, \"LKR\": 317.8, \"LRD\": 191.01, \"LSL\": 18.79, \"LYD\": 4.82, \"MAD\": 9.97, \"MDL\": 17.73, \"MGA\": 4531.37, \"MKD\": 56.74, \"MMK\": 2091.57, \"MNT\": 3425.1, \"MOP\": 8.05, \"MRU\": 39.92, \"MUR\": 45.06, \"MVR\": 15.44, \"MWK\": 1692.75, \"MXN\": 17.17, \"MYR\": 4.73, \"MZN\": 63.89, \"NAD\": 18.79, \"NGN\": 891.86, \"NIO\": 36.43, \"NOK\": 10.42, \"NPR\": 133.04, \"NZD\": 1.64, \"OMR\": 0.384, \"PAB\": 1, \"PEN\": 3.77, \"PGK\": 3.72, \"PHP\": 56.38, \"PKR\": 279.66, \"PLN\": 4.03, \"PYG\": 7291.8, \"QAR\": 3.64, \"RON\": 4.58, \"RSD\": 107.87, \"RUB\": 89.91, \"RWF\": 1310.23, \"SAR\": 3.75, \"SBD\": 8.43, \"SCR\": 14.17, \"SDG\": 509.04, \"SEK\": 10.44, \"SGD\": 1.34, \"SHP\": 0.787, \"SLE\": 22.48, \"SLL\": 22479.91, \"SOS\": 571.54, \"SRD\": 37.01, \"SSP\": 1104.35, \"STN\": 22.57, \"SYP\": 12833.07, \"SZL\": 18.79, \"THB\": 35.65, \"TJS\": 10.93, \"TMT\": 3.5, \"TND\": 3.11, \"TOP\": 2.34, \"TRY\": 30.33, \"TTD\": 6.71, \"TVD\": 1.52, \"TWD\": 31.23, \"TZS\": 2521.81, \"UAH\": 37.77, \"UGX\": 3808.55, \"USD\": 1, \"UYU\": 38.74, \"UZS\": 12372.69, \"VES\": 36.2, \"VND\": 24571.63, \"VUV\": 120.06, \"WST\": 2.73, \"XAF\": 604.38, \"XCD\": 2.7, \"XDR\": 0.753, \"XOF\": 604.38, \"XPF\": 109.95, \"YER\": 248.86, \"ZAR\": 18.79, \"ZMW\": 26.85, \"ZWL\": 9678.29}',
    '2024-01-28 12:25:47',
    '2024-01-28 12:25:47',
    '2024-01-28 12:25:47'
  );
INSERT INTO
  `currencyrates` (
    `id`,
    `Currency`,
    `CurrencyResponse`,
    `Date`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    9,
    'INR',
    '{\"AED\": 0.0442, \"AFN\": 0.881, \"ALL\": 1.16, \"AMD\": 4.85, \"ANG\": 0.0215, \"AOA\": 10.18, \"ARS\": 9.92, \"AUD\": 0.0182, \"AWG\": 0.0215, \"AZN\": 0.0203, \"BAM\": 0.0217, \"BBD\": 0.0241, \"BDT\": 1.32, \"BGN\": 0.0217, \"BHD\": 0.00452, \"BIF\": 34.25, \"BMD\": 0.012, \"BND\": 0.0161, \"BOB\": 0.0823, \"BRL\": 0.0591, \"BSD\": 0.012, \"BTN\": 1, \"BWP\": 0.163, \"BYN\": 0.0384, \"BZD\": 0.0241, \"CAD\": 0.0162, \"CDF\": 33.03, \"CHF\": 0.0104, \"CLP\": 11.06, \"CNY\": 0.0864, \"COP\": 48.01, \"CRC\": 6.2, \"CUP\": 0.289, \"CVE\": 1.23, \"CZK\": 0.276, \"DJF\": 2.14, \"DKK\": 0.0828, \"DOP\": 0.69, \"DZD\": 1.61, \"EGP\": 0.372, \"ERN\": 0.18, \"ETB\": 0.681, \"EUR\": 0.0111, \"FJD\": 0.0269, \"FKP\": 0.00947, \"FOK\": 0.0829, \"GBP\": 0.00947, \"GEL\": 0.0321, \"GGP\": 0.00947, \"GHS\": 0.149, \"GIP\": 0.00947, \"GMD\": 0.786, \"GNF\": 103.12, \"GTQ\": 0.0931, \"GYD\": 2.52, \"HKD\": 0.094, \"HNL\": 0.294, \"HRK\": 0.0837, \"HTG\": 1.59, \"HUF\": 4.33, \"IDR\": 190.26, \"ILS\": 0.0442, \"IMP\": 0.00947, \"INR\": 1, \"IQD\": 15.74, \"IRR\": 511.96, \"ISK\": 1.65, \"JEP\": 0.00947, \"JMD\": 1.85, \"JOD\": 0.00853, \"JPY\": 1.78, \"KES\": 1.95, \"KGS\": 1.07, \"KHR\": 49.32, \"KID\": 0.0182, \"KMF\": 5.47, \"KRW\": 16.04, \"KWD\": 0.00369, \"KYD\": 0.01, \"KZT\": 5.42, \"LAK\": 245.06, \"LBP\": 180.38, \"LKR\": 3.83, \"LRD\": 2.28, \"LSL\": 0.226, \"LYD\": 0.0579, \"MAD\": 0.121, \"MDL\": 0.213, \"MGA\": 54.4, \"MKD\": 0.682, \"MMK\": 30.34, \"MNT\": 41.12, \"MOP\": 0.0968, \"MRU\": 0.476, \"MUR\": 0.537, \"MVR\": 0.184, \"MWK\": 20.34, \"MXN\": 0.207, \"MYR\": 0.0569, \"MZN\": 0.768, \"NAD\": 0.226, \"NGN\": 9.94, \"NIO\": 0.436, \"NOK\": 0.126, \"NPR\": 1.6, \"NZD\": 0.0197, \"OMR\": 0.00462, \"PAB\": 0.012, \"PEN\": 0.0457, \"PGK\": 0.0443, \"PHP\": 0.678, \"PKR\": 3.34, \"PLN\": 0.0485, \"PYG\": 87.73, \"QAR\": 0.0438, \"RON\": 0.0553, \"RSD\": 1.3, \"RUB\": 1.09, \"RWF\": 15.73, \"SAR\": 0.0451, \"SBD\": 0.102, \"SCR\": 0.162, \"SDG\": 5.38, \"SEK\": 0.126, \"SGD\": 0.0161, \"SHP\": 0.00947, \"SLE\": 0.27, \"SLL\": 270.32, \"SOS\": 6.88, \"SRD\": 0.444, \"SSP\": 13.29, \"STN\": 0.272, \"SYP\": 153.49, \"SZL\": 0.226, \"THB\": 0.427, \"TJS\": 0.131, \"TMT\": 0.0421, \"TND\": 0.0375, \"TOP\": 0.0281, \"TRY\": 0.365, \"TTD\": 0.0798, \"TVD\": 0.0182, \"TWD\": 0.375, \"TZS\": 30.6, \"UAH\": 0.456, \"UGX\": 45.79, \"USD\": 0.012, \"UYU\": 0.469, \"UZS\": 148.12, \"VES\": 0.435, \"VND\": 294.44, \"VUV\": 1.44, \"WST\": 0.0327, \"XAF\": 7.29, \"XCD\": 0.0325, \"XDR\": 0.00906, \"XOF\": 7.29, \"XPF\": 1.33, \"YER\": 2.98, \"ZAR\": 0.226, \"ZMW\": 0.325, \"ZWL\": 117.91}',
    '2024-01-30 11:31:30',
    '2024-01-30 11:31:30',
    '2024-01-30 11:31:30'
  );
INSERT INTO
  `currencyrates` (
    `id`,
    `Currency`,
    `CurrencyResponse`,
    `Date`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    10,
    'USD',
    '{\"AED\": 3.67, \"AFN\": 73.26, \"ALL\": 96.8, \"AMD\": 403.32, \"ANG\": 1.79, \"AOA\": 837.12, \"ARS\": 825.25, \"AUD\": 1.51, \"AWG\": 1.79, \"AZN\": 1.7, \"BAM\": 1.81, \"BBD\": 2, \"BDT\": 109.61, \"BGN\": 1.81, \"BHD\": 0.376, \"BIF\": 2847.31, \"BMD\": 1, \"BND\": 1.34, \"BOB\": 6.85, \"BRL\": 4.91, \"BSD\": 1, \"BTN\": 83.16, \"BWP\": 13.68, \"BYN\": 3.19, \"BZD\": 2, \"CAD\": 1.34, \"CDF\": 2725.82, \"CHF\": 0.862, \"CLP\": 919.55, \"CNY\": 7.18, \"COP\": 3990.82, \"CRC\": 515.2, \"CUP\": 24, \"CVE\": 101.84, \"CZK\": 22.9, \"DJF\": 177.72, \"DKK\": 6.89, \"DOP\": 57.38, \"DZD\": 134.15, \"EGP\": 30.89, \"ERN\": 15, \"ETB\": 56.56, \"EUR\": 0.923, \"FJD\": 2.23, \"FKP\": 0.787, \"FOK\": 6.89, \"GBP\": 0.787, \"GEL\": 2.67, \"GGP\": 0.787, \"GHS\": 12.36, \"GIP\": 0.787, \"GMD\": 65.41, \"GNF\": 8575.07, \"GTQ\": 7.74, \"GYD\": 209.36, \"HKD\": 7.81, \"HNL\": 24.42, \"HRK\": 6.96, \"HTG\": 131.79, \"HUF\": 359.57, \"IDR\": 15824.06, \"ILS\": 3.67, \"IMP\": 0.787, \"INR\": 83.16, \"IQD\": 1308.81, \"IRR\": 42028.41, \"ISK\": 137.21, \"JEP\": 0.787, \"JMD\": 155.36, \"JOD\": 0.709, \"JPY\": 147.62, \"KES\": 162.16, \"KGS\": 89.34, \"KHR\": 4099.65, \"KID\": 1.51, \"KMF\": 454.37, \"KRW\": 1334.5, \"KWD\": 0.306, \"KYD\": 0.833, \"KZT\": 450.14, \"LAK\": 20383.02, \"LBP\": 15000, \"LKR\": 317.87, \"LRD\": 189.23, \"LSL\": 18.79, \"LYD\": 4.82, \"MAD\": 10.01, \"MDL\": 17.74, \"MGA\": 4529.38, \"MKD\": 56.72, \"MMK\": 2081.49, \"MNT\": 3418.96, \"MOP\": 8.05, \"MRU\": 39.58, \"MUR\": 44.95, \"MVR\": 15.42, \"MWK\": 1691.43, \"MXN\": 17.21, \"MYR\": 4.73, \"MZN\": 63.88, \"NAD\": 18.79, \"NGN\": 893.07, \"NIO\": 36.23, \"NOK\": 10.43, \"NPR\": 133.06, \"NZD\": 1.63, \"OMR\": 0.384, \"PAB\": 1, \"PEN\": 3.8, \"PGK\": 3.69, \"PHP\": 56.4, \"PKR\": 278.65, \"PLN\": 4.03, \"PYG\": 7293.82, \"QAR\": 3.64, \"RON\": 4.6, \"RSD\": 108.33, \"RUB\": 90.33, \"RWF\": 1307.23, \"SAR\": 3.75, \"SBD\": 8.51, \"SCR\": 13.52, \"SDG\": 454.25, \"SEK\": 10.46, \"SGD\": 1.34, \"SHP\": 0.787, \"SLE\": 22.48, \"SLL\": 22479.91, \"SOS\": 571.65, \"SRD\": 36.9, \"SSP\": 1105.2, \"STN\": 22.63, \"SYP\": 12766.51, \"SZL\": 18.79, \"THB\": 35.5, \"TJS\": 10.93, \"TMT\": 3.5, \"TND\": 3.12, \"TOP\": 2.34, \"TRY\": 30.36, \"TTD\": 6.71, \"TVD\": 1.51, \"TWD\": 31.16, \"TZS\": 2543.75, \"UAH\": 37.88, \"UGX\": 3807.1, \"USD\": 1, \"UYU\": 38.99, \"UZS\": 12354.7, \"VES\": 36.14, \"VND\": 24482.79, \"VUV\": 119.85, \"WST\": 2.74, \"XAF\": 605.83, \"XCD\": 2.7, \"XDR\": 0.753, \"XOF\": 605.83, \"XPF\": 110.21, \"YER\": 247.63, \"ZAR\": 18.8, \"ZMW\": 27.02, \"ZWL\": 9805.27}',
    '2024-01-30 11:31:31',
    '2024-01-30 11:31:31',
    '2024-01-30 11:31:31'
  );
INSERT INTO
  `currencyrates` (
    `id`,
    `Currency`,
    `CurrencyResponse`,
    `Date`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    11,
    'INR',
    '{\"AED\": 0.0442, \"AFN\": 0.883, \"ALL\": 1.17, \"AMD\": 4.86, \"ANG\": 0.0215, \"AOA\": 10.17, \"ARS\": 9.93, \"AUD\": 0.0182, \"AWG\": 0.0215, \"AZN\": 0.0203, \"BAM\": 0.0217, \"BBD\": 0.0241, \"BDT\": 1.32, \"BGN\": 0.0217, \"BHD\": 0.00452, \"BIF\": 34.25, \"BMD\": 0.012, \"BND\": 0.0161, \"BOB\": 0.0823, \"BRL\": 0.0596, \"BSD\": 0.012, \"BTN\": 1, \"BWP\": 0.163, \"BYN\": 0.0388, \"BZD\": 0.0241, \"CAD\": 0.0161, \"CDF\": 33.03, \"CHF\": 0.0104, \"CLP\": 11.11, \"CNY\": 0.0864, \"COP\": 48.28, \"CRC\": 6.2, \"CUP\": 0.289, \"CVE\": 1.22, \"CZK\": 0.275, \"DJF\": 2.14, \"DKK\": 0.0828, \"DOP\": 0.689, \"DZD\": 1.61, \"EGP\": 0.372, \"ERN\": 0.18, \"ETB\": 0.681, \"EUR\": 0.0111, \"FJD\": 0.0268, \"FKP\": 0.00949, \"FOK\": 0.0828, \"GBP\": 0.00949, \"GEL\": 0.0323, \"GGP\": 0.00949, \"GHS\": 0.149, \"GIP\": 0.00949, \"GMD\": 0.79, \"GNF\": 103.14, \"GTQ\": 0.093, \"GYD\": 2.52, \"HKD\": 0.094, \"HNL\": 0.293, \"HRK\": 0.0836, \"HTG\": 1.58, \"HUF\": 4.3, \"IDR\": 189.89, \"ILS\": 0.0439, \"IMP\": 0.00949, \"INR\": 1, \"IQD\": 15.74, \"IRR\": 512.08, \"ISK\": 1.65, \"JEP\": 0.00949, \"JMD\": 1.84, \"JOD\": 0.00853, \"JPY\": 1.77, \"KES\": 1.95, \"KGS\": 1.07, \"KHR\": 49.32, \"KID\": 0.0182, \"KMF\": 5.46, \"KRW\": 15.99, \"KWD\": 0.00369, \"KYD\": 0.01, \"KZT\": 5.4, \"LAK\": 244.81, \"LBP\": 180.42, \"LKR\": 3.82, \"LRD\": 2.27, \"LSL\": 0.227, \"LYD\": 0.058, \"MAD\": 0.12, \"MDL\": 0.213, \"MGA\": 54.4, \"MKD\": 0.686, \"MMK\": 30.32, \"MNT\": 41.04, \"MOP\": 0.0969, \"MRU\": 0.485, \"MUR\": 0.538, \"MVR\": 0.184, \"MWK\": 20.35, \"MXN\": 0.207, \"MYR\": 0.0569, \"MZN\": 0.768, \"NAD\": 0.227, \"NGN\": 9.89, \"NIO\": 0.435, \"NOK\": 0.126, \"NPR\": 1.6, \"NZD\": 0.0196, \"OMR\": 0.00462, \"PAB\": 0.012, \"PEN\": 0.0458, \"PGK\": 0.0443, \"PHP\": 0.678, \"PKR\": 3.35, \"PLN\": 0.0484, \"PYG\": 87.65, \"QAR\": 0.0438, \"RON\": 0.0552, \"RSD\": 1.3, \"RUB\": 1.08, \"RWF\": 15.75, \"SAR\": 0.0451, \"SBD\": 0.101, \"SCR\": 0.163, \"SDG\": 5.38, \"SEK\": 0.125, \"SGD\": 0.0161, \"SHP\": 0.00949, \"SLE\": 0.27, \"SLL\": 270.39, \"SOS\": 6.88, \"SRD\": 0.443, \"SSP\": 13.3, \"STN\": 0.272, \"SYP\": 153.34, \"SZL\": 0.227, \"THB\": 0.426, \"TJS\": 0.131, \"TMT\": 0.0421, \"TND\": 0.0375, \"TOP\": 0.0282, \"TRY\": 0.365, \"TTD\": 0.0797, \"TVD\": 0.0182, \"TWD\": 0.374, \"TZS\": 30.6, \"UAH\": 0.456, \"UGX\": 45.8, \"USD\": 0.012, \"UYU\": 0.469, \"UZS\": 148.25, \"VES\": 0.435, \"VND\": 292.78, \"VUV\": 1.44, \"WST\": 0.0326, \"XAF\": 7.28, \"XCD\": 0.0325, \"XDR\": 0.00905, \"XOF\": 7.28, \"XPF\": 1.32, \"YER\": 2.97, \"ZAR\": 0.227, \"ZMW\": 0.326, \"ZWL\": 119.89}',
    '2024-01-31 15:52:06',
    '2024-01-31 15:52:06',
    '2024-01-31 15:52:06'
  );
INSERT INTO
  `currencyrates` (
    `id`,
    `Currency`,
    `CurrencyResponse`,
    `Date`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    12,
    'USD',
    '{\"AED\": 3.67, \"AFN\": 73.42, \"ALL\": 96.85, \"AMD\": 404.74, \"ANG\": 1.79, \"AOA\": 839.62, \"ARS\": 825.75, \"AUD\": 1.52, \"AWG\": 1.79, \"AZN\": 1.7, \"BAM\": 1.8, \"BBD\": 2, \"BDT\": 109.63, \"BGN\": 1.8, \"BHD\": 0.376, \"BIF\": 2842.76, \"BMD\": 1, \"BND\": 1.34, \"BOB\": 6.84, \"BRL\": 4.95, \"BSD\": 1, \"BTN\": 83.14, \"BWP\": 13.69, \"BYN\": 3.22, \"BZD\": 2, \"CAD\": 1.34, \"CDF\": 2707.68, \"CHF\": 0.862, \"CLP\": 923.33, \"CNY\": 7.18, \"COP\": 4013.1, \"CRC\": 515.59, \"CUP\": 24, \"CVE\": 101.71, \"CZK\": 22.88, \"DJF\": 177.72, \"DKK\": 6.88, \"DOP\": 57.31, \"DZD\": 134.12, \"EGP\": 30.94, \"ERN\": 15, \"ETB\": 56.64, \"EUR\": 0.922, \"FJD\": 2.23, \"FKP\": 0.788, \"FOK\": 6.88, \"GBP\": 0.788, \"GEL\": 2.68, \"GGP\": 0.788, \"GHS\": 12.36, \"GIP\": 0.788, \"GMD\": 65.66, \"GNF\": 8574.57, \"GTQ\": 7.73, \"GYD\": 209.36, \"HKD\": 7.82, \"HNL\": 24.4, \"HRK\": 6.95, \"HTG\": 131.67, \"HUF\": 356.65, \"IDR\": 15788.15, \"ILS\": 3.65, \"IMP\": 0.788, \"INR\": 83.14, \"IQD\": 1308.75, \"IRR\": 42040.1, \"ISK\": 136.86, \"JEP\": 0.788, \"JMD\": 155.49, \"JOD\": 0.709, \"JPY\": 147.52, \"KES\": 161.82, \"KGS\": 89.34, \"KHR\": 4100.33, \"KID\": 1.52, \"KMF\": 453.79, \"KRW\": 1328.95, \"KWD\": 0.307, \"KYD\": 0.833, \"KZT\": 449.1, \"LAK\": 20355.86, \"LBP\": 15000, \"LKR\": 317.16, \"LRD\": 188.99, \"LSL\": 18.8, \"LYD\": 4.82, \"MAD\": 10.01, \"MDL\": 17.73, \"MGA\": 4529.05, \"MKD\": 57, \"MMK\": 2079.07, \"MNT\": 3410.28, \"MOP\": 8.05, \"MRU\": 40.3, \"MUR\": 44.56, \"MVR\": 15.44, \"MWK\": 1691.5, \"MXN\": 17.17, \"MYR\": 4.73, \"MZN\": 63.88, \"NAD\": 18.8, \"NGN\": 896.05, \"NIO\": 36.19, \"NOK\": 10.44, \"NPR\": 133.02, \"NZD\": 1.63, \"OMR\": 0.384, \"PAB\": 1, \"PEN\": 3.81, \"PGK\": 3.68, \"PHP\": 56.4, \"PKR\": 279.93, \"PLN\": 4.02, \"PYG\": 7286.48, \"QAR\": 3.64, \"RON\": 4.59, \"RSD\": 108.11, \"RUB\": 89.69, \"RWF\": 1309.29, \"SAR\": 3.75, \"SBD\": 8.31, \"SCR\": 13.19, \"SDG\": 449.42, \"SEK\": 10.41, \"SGD\": 1.34, \"SHP\": 0.788, \"SLE\": 22.48, \"SLL\": 22479.91, \"SOS\": 571.65, \"SRD\": 36.86, \"SSP\": 1105.32, \"STN\": 22.6, \"SYP\": 12749.95, \"SZL\": 18.8, \"THB\": 35.37, \"TJS\": 10.91, \"TMT\": 3.5, \"TND\": 3.11, \"TOP\": 2.34, \"TRY\": 30.36, \"TTD\": 6.7, \"TVD\": 1.52, \"TWD\": 31.12, \"TZS\": 2537.21, \"UAH\": 37.88, \"UGX\": 3808.06, \"USD\": 1, \"UYU\": 38.97, \"UZS\": 12368.69, \"VES\": 36.2, \"VND\": 24334.05, \"VUV\": 119.76, \"WST\": 2.73, \"XAF\": 605.06, \"XCD\": 2.7, \"XDR\": 0.752, \"XOF\": 605.06, \"XPF\": 110.07, \"YER\": 247.34, \"ZAR\": 18.8, \"ZMW\": 27.1, \"ZWL\": 9967.52}',
    '2024-01-31 15:52:07',
    '2024-01-31 15:52:07',
    '2024-01-31 15:52:07'
  );
INSERT INTO
  `currencyrates` (
    `id`,
    `Currency`,
    `CurrencyResponse`,
    `Date`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    13,
    'INR',
    '{\"AED\": 0.0442, \"AFN\": 0.888, \"ALL\": 1.17, \"AMD\": 4.86, \"ANG\": 0.0215, \"AOA\": 10.18, \"ARS\": 9.94, \"AUD\": 0.0183, \"AWG\": 0.0215, \"AZN\": 0.0203, \"BAM\": 0.0217, \"BBD\": 0.0241, \"BDT\": 1.32, \"BGN\": 0.0217, \"BHD\": 0.00453, \"BIF\": 34.26, \"BMD\": 0.012, \"BND\": 0.0161, \"BOB\": 0.0823, \"BRL\": 0.0596, \"BSD\": 0.012, \"BTN\": 1, \"BWP\": 0.163, \"BYN\": 0.0388, \"BZD\": 0.0241, \"CAD\": 0.0162, \"CDF\": 33.04, \"CHF\": 0.0104, \"CLP\": 11.12, \"CNY\": 0.0864, \"COP\": 48.01, \"CRC\": 6.21, \"CUP\": 0.289, \"CVE\": 1.23, \"CZK\": 0.276, \"DJF\": 2.14, \"DKK\": 0.0829, \"DOP\": 0.69, \"DZD\": 1.62, \"EGP\": 0.372, \"ERN\": 0.181, \"ETB\": 0.681, \"EUR\": 0.0111, \"FJD\": 0.0269, \"FKP\": 0.00949, \"FOK\": 0.0829, \"GBP\": 0.00949, \"GEL\": 0.0322, \"GGP\": 0.00949, \"GHS\": 0.149, \"GIP\": 0.00949, \"GMD\": 0.784, \"GNF\": 103.22, \"GTQ\": 0.093, \"GYD\": 2.52, \"HKD\": 0.0941, \"HNL\": 0.294, \"HRK\": 0.0837, \"HTG\": 1.59, \"HUF\": 4.27, \"IDR\": 189.74, \"ILS\": 0.0438, \"IMP\": 0.00949, \"INR\": 1, \"IQD\": 15.74, \"IRR\": 512.24, \"ISK\": 1.65, \"JEP\": 0.00949, \"JMD\": 1.85, \"JOD\": 0.00853, \"JPY\": 1.78, \"KES\": 1.95, \"KGS\": 1.08, \"KHR\": 49.33, \"KID\": 0.0183, \"KMF\": 5.47, \"KRW\": 16.04, \"KWD\": 0.0037, \"KYD\": 0.01, \"KZT\": 5.41, \"LAK\": 245.01, \"LBP\": 180.53, \"LKR\": 3.81, \"LRD\": 2.27, \"LSL\": 0.225, \"LYD\": 0.058, \"MAD\": 0.121, \"MDL\": 0.213, \"MGA\": 54.41, \"MKD\": 0.685, \"MMK\": 30.36, \"MNT\": 41.19, \"MOP\": 0.0969, \"MRU\": 0.476, \"MUR\": 0.54, \"MVR\": 0.184, \"MWK\": 20.36, \"MXN\": 0.207, \"MYR\": 0.0569, \"MZN\": 0.769, \"NAD\": 0.225, \"NGN\": 11.2, \"NIO\": 0.436, \"NOK\": 0.126, \"NPR\": 1.6, \"NZD\": 0.0197, \"OMR\": 0.00463, \"PAB\": 0.012, \"PEN\": 0.0458, \"PGK\": 0.0443, \"PHP\": 0.677, \"PKR\": 3.35, \"PLN\": 0.0482, \"PYG\": 87.69, \"QAR\": 0.0438, \"RON\": 0.0553, \"RSD\": 1.3, \"RUB\": 1.08, \"RWF\": 15.76, \"SAR\": 0.0451, \"SBD\": 0.102, \"SCR\": 0.163, \"SDG\": 5.38, \"SEK\": 0.125, \"SGD\": 0.0161, \"SHP\": 0.00949, \"SLE\": 0.271, \"SLL\": 271.37, \"SOS\": 6.88, \"SRD\": 0.439, \"SSP\": 13.31, \"STN\": 0.272, \"SYP\": 153.47, \"SZL\": 0.225, \"THB\": 0.427, \"TJS\": 0.132, \"TMT\": 0.0421, \"TND\": 0.0375, \"TOP\": 0.0282, \"TRY\": 0.366, \"TTD\": 0.0798, \"TVD\": 0.0183, \"TWD\": 0.376, \"TZS\": 30.62, \"UAH\": 0.452, \"UGX\": 45.89, \"USD\": 0.012, \"UYU\": 0.47, \"UZS\": 148.31, \"VES\": 0.436, \"VND\": 293.03, \"VUV\": 1.45, \"WST\": 0.0326, \"XAF\": 7.29, \"XCD\": 0.0325, \"XDR\": 0.00906, \"XOF\": 7.29, \"XPF\": 1.33, \"YER\": 2.98, \"ZAR\": 0.225, \"ZMW\": 0.327, \"ZWL\": 122.26}',
    '2024-02-01 04:20:10',
    '2024-02-01 04:20:10',
    '2024-02-01 04:20:10'
  );
INSERT INTO
  `currencyrates` (
    `id`,
    `Currency`,
    `CurrencyResponse`,
    `Date`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    14,
    'USD',
    '{\"AED\": 3.67, \"AFN\": 74.09, \"ALL\": 96.43, \"AMD\": 404.93, \"ANG\": 1.79, \"AOA\": 846.09, \"ARS\": 826.25, \"AUD\": 1.52, \"AWG\": 1.79, \"AZN\": 1.7, \"BAM\": 1.81, \"BBD\": 2, \"BDT\": 109.65, \"BGN\": 1.81, \"BHD\": 0.376, \"BIF\": 2848.96, \"BMD\": 1, \"BND\": 1.34, \"BOB\": 6.88, \"BRL\": 4.95, \"BSD\": 1, \"BTN\": 83.09, \"BWP\": 13.62, \"BYN\": 3.22, \"BZD\": 2, \"CAD\": 1.34, \"CDF\": 2723.06, \"CHF\": 0.862, \"CLP\": 923.64, \"CNY\": 7.18, \"COP\": 3954.13, \"CRC\": 514.29, \"CUP\": 24, \"CVE\": 101.84, \"CZK\": 22.94, \"DJF\": 177.72, \"DKK\": 6.89, \"DOP\": 58.08, \"DZD\": 134.52, \"EGP\": 30.87, \"ERN\": 15, \"ETB\": 56.63, \"EUR\": 0.924, \"FJD\": 2.24, \"FKP\": 0.788, \"FOK\": 6.89, \"GBP\": 0.788, \"GEL\": 2.68, \"GGP\": 0.788, \"GHS\": 12.36, \"GIP\": 0.788, \"GMD\": 66.19, \"GNF\": 8583.34, \"GTQ\": 7.76, \"GYD\": 209.18, \"HKD\": 7.82, \"HNL\": 24.52, \"HRK\": 6.96, \"HTG\": 131.67, \"HUF\": 354.74, \"IDR\": 15766.24, \"ILS\": 3.64, \"IMP\": 0.788, \"INR\": 83.09, \"IQD\": 1309.17, \"IRR\": 41938.98, \"ISK\": 136.94, \"JEP\": 0.788, \"JMD\": 155.57, \"JOD\": 0.709, \"JPY\": 146.95, \"KES\": 161.26, \"KGS\": 89.35, \"KHR\": 4089.34, \"KID\": 1.52, \"KMF\": 454.4, \"KRW\": 1332.65, \"KWD\": 0.307, \"KYD\": 0.833, \"KZT\": 449.01, \"LAK\": 20515, \"LBP\": 15000, \"LKR\": 315.42, \"LRD\": 190.44, \"LSL\": 18.68, \"LYD\": 4.83, \"MAD\": 10.01, \"MDL\": 17.76, \"MGA\": 4528.26, \"MKD\": 56.91, \"MMK\": 2088.77, \"MNT\": 3422.65, \"MOP\": 8.05, \"MRU\": 40.23, \"MUR\": 44.79, \"MVR\": 15.44, \"MWK\": 1687.82, \"MXN\": 17.2, \"MYR\": 4.73, \"MZN\": 63.89, \"NAD\": 18.68, \"NGN\": 1043.68, \"NIO\": 36.4, \"NOK\": 10.49, \"NPR\": 132.94, \"NZD\": 1.63, \"OMR\": 0.384, \"PAB\": 1, \"PEN\": 3.81, \"PGK\": 3.74, \"PHP\": 56.28, \"PKR\": 278.86, \"PLN\": 4, \"PYG\": 7278.86, \"QAR\": 3.64, \"RON\": 4.59, \"RSD\": 108.24, \"RUB\": 89.92, \"RWF\": 1281.71, \"SAR\": 3.75, \"SBD\": 8.48, \"SCR\": 13.24, \"SDG\": 544.19, \"SEK\": 10.4, \"SGD\": 1.34, \"SHP\": 0.788, \"SLE\": 22.55, \"SLL\": 22547.28, \"SOS\": 571.43, \"SRD\": 36.52, \"SSP\": 1104.88, \"STN\": 22.63, \"SYP\": 12864.4, \"SZL\": 18.68, \"THB\": 35.52, \"TJS\": 10.92, \"TMT\": 3.5, \"TND\": 3.12, \"TOP\": 2.34, \"TRY\": 30.39, \"TTD\": 6.72, \"TVD\": 1.52, \"TWD\": 31.22, \"TZS\": 2528.49, \"UAH\": 37.58, \"UGX\": 3813.32, \"USD\": 1, \"UYU\": 39.03, \"UZS\": 12360.94, \"VES\": 36.26, \"VND\": 24361.72, \"VUV\": 120.2, \"WST\": 2.73, \"XAF\": 605.86, \"XCD\": 2.7, \"XDR\": 0.753, \"XOF\": 605.86, \"XPF\": 110.22, \"YER\": 248.71, \"ZAR\": 18.68, \"ZMW\": 27.11, \"ZWL\": 10158.26}',
    '2024-02-01 04:20:11',
    '2024-02-01 04:20:11',
    '2024-02-01 04:20:11'
  );
INSERT INTO
  `currencyrates` (
    `id`,
    `Currency`,
    `CurrencyResponse`,
    `Date`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    15,
    'INR',
    '{\"AED\": 0.0443, \"AFN\": 0.896, \"ALL\": 1.16, \"AMD\": 4.87, \"ANG\": 0.0216, \"AOA\": 10.19, \"ARS\": 9.97, \"AUD\": 0.0184, \"AWG\": 0.0216, \"AZN\": 0.0205, \"BAM\": 0.0218, \"BBD\": 0.0241, \"BDT\": 1.32, \"BGN\": 0.0218, \"BHD\": 0.00453, \"BIF\": 34.31, \"BMD\": 0.0121, \"BND\": 0.0161, \"BOB\": 0.0834, \"BRL\": 0.0597, \"BSD\": 0.0121, \"BTN\": 1, \"BWP\": 0.164, \"BYN\": 0.0391, \"BZD\": 0.0241, \"CAD\": 0.0162, \"CDF\": 33.09, \"CHF\": 0.0104, \"CLP\": 11.21, \"CNY\": 0.0866, \"COP\": 47.05, \"CRC\": 6.19, \"CUP\": 0.289, \"CVE\": 1.23, \"CZK\": 0.277, \"DJF\": 2.14, \"DKK\": 0.0829, \"DOP\": 0.709, \"DZD\": 1.62, \"EGP\": 0.373, \"ERN\": 0.181, \"ETB\": 0.682, \"EUR\": 0.0111, \"FJD\": 0.027, \"FKP\": 0.0095, \"FOK\": 0.0829, \"GBP\": 0.0095, \"GEL\": 0.0322, \"GGP\": 0.0095, \"GHS\": 0.149, \"GIP\": 0.0095, \"GMD\": 0.786, \"GNF\": 103.34, \"GTQ\": 0.0942, \"GYD\": 2.52, \"HKD\": 0.0943, \"HNL\": 0.297, \"HRK\": 0.0838, \"HTG\": 1.59, \"HUF\": 4.27, \"IDR\": 189.9, \"ILS\": 0.044, \"IMP\": 0.0095, \"INR\": 1, \"IQD\": 15.77, \"IRR\": 513.02, \"ISK\": 1.65, \"JEP\": 0.0095, \"JMD\": 1.87, \"JOD\": 0.00855, \"JPY\": 1.77, \"KES\": 1.94, \"KGS\": 1.08, \"KHR\": 49.41, \"KID\": 0.0184, \"KMF\": 5.47, \"KRW\": 16.03, \"KWD\": 0.00371, \"KYD\": 0.01, \"KZT\": 5.42, \"LAK\": 248.46, \"LBP\": 180.79, \"LKR\": 3.79, \"LRD\": 2.31, \"LSL\": 0.225, \"LYD\": 0.0582, \"MAD\": 0.121, \"MDL\": 0.214, \"MGA\": 54.5, \"MKD\": 0.686, \"MMK\": 30.58, \"MNT\": 41.14, \"MOP\": 0.0971, \"MRU\": 0.477, \"MUR\": 0.544, \"MVR\": 0.186, \"MWK\": 20.38, \"MXN\": 0.207, \"MYR\": 0.057, \"MZN\": 0.77, \"NAD\": 0.225, \"NGN\": 12.68, \"NIO\": 0.442, \"NOK\": 0.126, \"NPR\": 1.6, \"NZD\": 0.0197, \"OMR\": 0.00463, \"PAB\": 0.0121, \"PEN\": 0.0459, \"PGK\": 0.0451, \"PHP\": 0.676, \"PKR\": 3.36, \"PLN\": 0.0483, \"PYG\": 87.98, \"QAR\": 0.0439, \"RON\": 0.0555, \"RSD\": 1.31, \"RUB\": 1.09, \"RWF\": 15.78, \"SAR\": 0.0452, \"SBD\": 0.102, \"SCR\": 0.159, \"SDG\": 5.39, \"SEK\": 0.126, \"SGD\": 0.0161, \"SHP\": 0.0095, \"SLE\": 0.272, \"SLL\": 271.75, \"SOS\": 6.89, \"SRD\": 0.445, \"SSP\": 13.32, \"STN\": 0.273, \"SYP\": 155.51, \"SZL\": 0.225, \"THB\": 0.427, \"TJS\": 0.132, \"TMT\": 0.0422, \"TND\": 0.0376, \"TOP\": 0.0283, \"TRY\": 0.366, \"TTD\": 0.0817, \"TVD\": 0.0184, \"TWD\": 0.377, \"TZS\": 30.66, \"UAH\": 0.453, \"UGX\": 45.92, \"USD\": 0.0121, \"UYU\": 0.471, \"UZS\": 148.51, \"VES\": 0.437, \"VND\": 294.65, \"VUV\": 1.45, \"WST\": 0.0327, \"XAF\": 7.3, \"XCD\": 0.0325, \"XDR\": 0.00908, \"XOF\": 7.3, \"XPF\": 1.33, \"YER\": 3.02, \"ZAR\": 0.225, \"ZMW\": 0.328, \"ZWL\": 123.36}',
    '2024-02-02 04:59:28',
    '2024-02-02 04:59:28',
    '2024-02-02 04:59:28'
  );
INSERT INTO
  `currencyrates` (
    `id`,
    `Currency`,
    `CurrencyResponse`,
    `Date`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    16,
    'USD',
    '{\"AED\": 3.67, \"AFN\": 74.39, \"ALL\": 96.1, \"AMD\": 404.86, \"ANG\": 1.79, \"AOA\": 844.91, \"ARS\": 826.85, \"AUD\": 1.52, \"AWG\": 1.79, \"AZN\": 1.7, \"BAM\": 1.8, \"BBD\": 2, \"BDT\": 109.75, \"BGN\": 1.8, \"BHD\": 0.376, \"BIF\": 2845.45, \"BMD\": 1, \"BND\": 1.34, \"BOB\": 6.92, \"BRL\": 4.95, \"BSD\": 1, \"BTN\": 82.97, \"BWP\": 13.58, \"BYN\": 3.24, \"BZD\": 2, \"CAD\": 1.34, \"CDF\": 2713.26, \"CHF\": 0.86, \"CLP\": 930.33, \"CNY\": 7.18, \"COP\": 3907.48, \"CRC\": 513.6, \"CUP\": 24, \"CVE\": 101.6, \"CZK\": 22.94, \"DJF\": 177.72, \"DKK\": 6.87, \"DOP\": 58.85, \"DZD\": 134.8, \"EGP\": 30.9, \"ERN\": 15, \"ETB\": 56.64, \"EUR\": 0.921, \"FJD\": 2.23, \"FKP\": 0.786, \"FOK\": 6.87, \"GBP\": 0.786, \"GEL\": 2.68, \"GGP\": 0.786, \"GHS\": 12.37, \"GIP\": 0.786, \"GMD\": 65.79, \"GNF\": 8579.74, \"GTQ\": 7.81, \"GYD\": 209.27, \"HKD\": 7.82, \"HNL\": 24.67, \"HRK\": 6.94, \"HTG\": 131.68, \"HUF\": 353.15, \"IDR\": 15755.25, \"ILS\": 3.65, \"IMP\": 0.786, \"INR\": 82.97, \"IQD\": 1309.02, \"IRR\": 41985.37, \"ISK\": 137.19, \"JEP\": 0.786, \"JMD\": 155.55, \"JOD\": 0.709, \"JPY\": 146.48, \"KES\": 160.46, \"KGS\": 89.36, \"KHR\": 4093.14, \"KID\": 1.52, \"KMF\": 453.31, \"KRW\": 1331.13, \"KWD\": 0.308, \"KYD\": 0.833, \"KZT\": 449.37, \"LAK\": 20638.02, \"LBP\": 15000, \"LKR\": 313.46, \"LRD\": 191.81, \"LSL\": 18.6, \"LYD\": 4.83, \"MAD\": 10.02, \"MDL\": 17.79, \"MGA\": 4527.21, \"MKD\": 56.93, \"MMK\": 2102.5, \"MNT\": 3412.66, \"MOP\": 8.05, \"MRU\": 40.01, \"MUR\": 44.96, \"MVR\": 15.44, \"MWK\": 1689.45, \"MXN\": 17.14, \"MYR\": 4.73, \"MZN\": 63.88, \"NAD\": 18.6, \"NGN\": 1132.48, \"NIO\": 36.63, \"NOK\": 10.46, \"NPR\": 132.75, \"NZD\": 1.63, \"OMR\": 0.384, \"PAB\": 1, \"PEN\": 3.81, \"PGK\": 3.76, \"PHP\": 56.07, \"PKR\": 276.47, \"PLN\": 3.99, \"PYG\": 7292.92, \"QAR\": 3.64, \"RON\": 4.6, \"RSD\": 108.38, \"RUB\": 90.36, \"RWF\": 1278.11, \"SAR\": 3.75, \"SBD\": 8.47, \"SCR\": 13.24, \"SDG\": 511.61, \"SEK\": 10.4, \"SGD\": 1.34, \"SHP\": 0.786, \"SLE\": 22.55, \"SLL\": 22547.28, \"SOS\": 571.51, \"SRD\": 36.74, \"SSP\": 1105.14, \"STN\": 22.57, \"SYP\": 12928.31, \"SZL\": 18.6, \"THB\": 35.39, \"TJS\": 10.93, \"TMT\": 3.5, \"TND\": 3.12, \"TOP\": 2.34, \"TRY\": 30.4, \"TTD\": 6.76, \"TVD\": 1.52, \"TWD\": 31.24, \"TZS\": 2527.44, \"UAH\": 37.59, \"UGX\": 3811.85, \"USD\": 1, \"UYU\": 39.07, \"UZS\": 12362.79, \"VES\": 36.24, \"VND\": 24410.02, \"VUV\": 119.9, \"WST\": 2.74, \"XAF\": 604.41, \"XCD\": 2.7, \"XDR\": 0.754, \"XOF\": 604.41, \"XPF\": 109.95, \"YER\": 250.22, \"ZAR\": 18.6, \"ZMW\": 27.17, \"ZWL\": 10235.01}',
    '2024-02-02 04:59:30',
    '2024-02-02 04:59:30',
    '2024-02-02 04:59:30'
  );
INSERT INTO
  `currencyrates` (
    `id`,
    `Currency`,
    `CurrencyResponse`,
    `Date`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    17,
    'INR',
    '{\"AED\": 0.0443, \"AFN\": 0.898, \"ALL\": 1.16, \"AMD\": 4.87, \"ANG\": 0.0216, \"AOA\": 10.16, \"ARS\": 9.97, \"AUD\": 0.0184, \"AWG\": 0.0216, \"AZN\": 0.0205, \"BAM\": 0.0218, \"BBD\": 0.0241, \"BDT\": 1.32, \"BGN\": 0.0218, \"BHD\": 0.00453, \"BIF\": 34.31, \"BMD\": 0.0121, \"BND\": 0.0162, \"BOB\": 0.0835, \"BRL\": 0.0593, \"BSD\": 0.0121, \"BTN\": 1, \"BWP\": 0.164, \"BYN\": 0.0391, \"BZD\": 0.0241, \"CAD\": 0.0162, \"CDF\": 33.09, \"CHF\": 0.0104, \"CLP\": 11.24, \"CNY\": 0.0866, \"COP\": 46.99, \"CRC\": 6.19, \"CUP\": 0.289, \"CVE\": 1.23, \"CZK\": 0.276, \"DJF\": 2.14, \"DKK\": 0.0831, \"DOP\": 0.708, \"DZD\": 1.62, \"EGP\": 0.373, \"ERN\": 0.181, \"ETB\": 0.682, \"EUR\": 0.0111, \"FJD\": 0.027, \"FKP\": 0.00951, \"FOK\": 0.0831, \"GBP\": 0.00951, \"GEL\": 0.0322, \"GGP\": 0.00951, \"GHS\": 0.149, \"GIP\": 0.00951, \"GMD\": 0.782, \"GNF\": 103.44, \"GTQ\": 0.0942, \"GYD\": 2.52, \"HKD\": 0.0943, \"HNL\": 0.297, \"HRK\": 0.0839, \"HTG\": 1.59, \"HUF\": 4.25, \"IDR\": 189.03, \"ILS\": 0.0441, \"IMP\": 0.00951, \"INR\": 1, \"IQD\": 15.77, \"IRR\": 510.46, \"ISK\": 1.64, \"JEP\": 0.00951, \"JMD\": 1.87, \"JOD\": 0.00854, \"JPY\": 1.78, \"KES\": 1.94, \"KGS\": 1.08, \"KHR\": 49.41, \"KID\": 0.0185, \"KMF\": 5.48, \"KRW\": 16.06, \"KWD\": 0.00371, \"KYD\": 0.01, \"KZT\": 5.42, \"LAK\": 247.87, \"LBP\": 180.76, \"LKR\": 3.77, \"LRD\": 2.31, \"LSL\": 0.225, \"LYD\": 0.0582, \"MAD\": 0.121, \"MDL\": 0.214, \"MGA\": 54.5, \"MKD\": 0.687, \"MMK\": 35.27, \"MNT\": 41.37, \"MOP\": 0.0971, \"MRU\": 0.477, \"MUR\": 0.544, \"MVR\": 0.186, \"MWK\": 20.43, \"MXN\": 0.206, \"MYR\": 0.057, \"MZN\": 0.77, \"NAD\": 0.225, \"NGN\": 13.39, \"NIO\": 0.441, \"NOK\": 0.127, \"NPR\": 1.6, \"NZD\": 0.0198, \"OMR\": 0.00463, \"PAB\": 0.0121, \"PEN\": 0.0461, \"PGK\": 0.0451, \"PHP\": 0.675, \"PKR\": 3.36, \"PLN\": 0.048, \"PYG\": 88.09, \"QAR\": 0.0439, \"RON\": 0.0552, \"RSD\": 1.31, \"RUB\": 1.1, \"RWF\": 15.94, \"SAR\": 0.0452, \"SBD\": 0.102, \"SCR\": 0.161, \"SDG\": 5.39, \"SEK\": 0.126, \"SGD\": 0.0162, \"SHP\": 0.00951, \"SLE\": 0.272, \"SLL\": 271.71, \"SOS\": 6.89, \"SRD\": 0.445, \"SSP\": 13.32, \"STN\": 0.273, \"SYP\": 155.05, \"SZL\": 0.225, \"THB\": 0.427, \"TJS\": 0.132, \"TMT\": 0.0422, \"TND\": 0.0376, \"TOP\": 0.0283, \"TRY\": 0.367, \"TTD\": 0.0817, \"TVD\": 0.0185, \"TWD\": 0.377, \"TZS\": 30.66, \"UAH\": 0.453, \"UGX\": 45.96, \"USD\": 0.0121, \"UYU\": 0.471, \"UZS\": 148.77, \"VES\": 0.437, \"VND\": 294.35, \"VUV\": 1.45, \"WST\": 0.0327, \"XAF\": 7.31, \"XCD\": 0.0325, \"XDR\": 0.00904, \"XOF\": 7.31, \"XPF\": 1.33, \"YER\": 3.02, \"ZAR\": 0.225, \"ZMW\": 0.328, \"ZWL\": 125.29}',
    '2024-02-03 14:33:21',
    '2024-02-03 14:33:21',
    '2024-02-03 14:33:21'
  );
INSERT INTO
  `currencyrates` (
    `id`,
    `Currency`,
    `CurrencyResponse`,
    `Date`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    18,
    'USD',
    '{\"AED\": 3.67, \"AFN\": 74.5, \"ALL\": 96.11, \"AMD\": 404.57, \"ANG\": 1.79, \"AOA\": 843.01, \"ARS\": 827.35, \"AUD\": 1.53, \"AWG\": 1.79, \"AZN\": 1.7, \"BAM\": 1.81, \"BBD\": 2, \"BDT\": 109.73, \"BGN\": 1.81, \"BHD\": 0.376, \"BIF\": 2843.05, \"BMD\": 1, \"BND\": 1.34, \"BOB\": 6.93, \"BRL\": 4.92, \"BSD\": 1, \"BTN\": 82.98, \"BWP\": 13.63, \"BYN\": 3.24, \"BZD\": 2, \"CAD\": 1.34, \"CDF\": 2717.78, \"CHF\": 0.865, \"CLP\": 932, \"CNY\": 7.19, \"COP\": 3905.01, \"CRC\": 513.14, \"CUP\": 24, \"CVE\": 102, \"CZK\": 22.96, \"DJF\": 177.72, \"DKK\": 6.9, \"DOP\": 58.81, \"DZD\": 134.79, \"EGP\": 30.9, \"ERN\": 15, \"ETB\": 56.68, \"EUR\": 0.925, \"FJD\": 2.23, \"FKP\": 0.79, \"FOK\": 6.9, \"GBP\": 0.79, \"GEL\": 2.67, \"GGP\": 0.79, \"GHS\": 12.38, \"GIP\": 0.79, \"GMD\": 65.28, \"GNF\": 8586.53, \"GTQ\": 7.81, \"GYD\": 209.27, \"HKD\": 7.82, \"HNL\": 24.67, \"HRK\": 6.97, \"HTG\": 131.61, \"HUF\": 353.93, \"IDR\": 15687.53, \"ILS\": 3.66, \"IMP\": 0.79, \"INR\": 82.98, \"IQD\": 1309.02, \"IRR\": 42018.2, \"ISK\": 136.21, \"JEP\": 0.79, \"JMD\": 155.55, \"JOD\": 0.709, \"JPY\": 147.66, \"KES\": 160.31, \"KGS\": 89.38, \"KHR\": 4093.26, \"KID\": 1.53, \"KMF\": 455.08, \"KRW\": 1331.41, \"KWD\": 0.308, \"KYD\": 0.833, \"KZT\": 449.59, \"LAK\": 20610.08, \"LBP\": 15000, \"LKR\": 312.76, \"LRD\": 192.03, \"LSL\": 18.8, \"LYD\": 4.83, \"MAD\": 10, \"MDL\": 17.81, \"MGA\": 4526.01, \"MKD\": 57.02, \"MMK\": 2102.95, \"MNT\": 3430.35, \"MOP\": 8.06, \"MRU\": 40, \"MUR\": 45.47, \"MVR\": 15.45, \"MWK\": 1693.37, \"MXN\": 17.14, \"MYR\": 4.73, \"MZN\": 63.89, \"NAD\": 18.8, \"NGN\": 1310.78, \"NIO\": 36.63, \"NOK\": 10.6, \"NPR\": 132.77, \"NZD\": 1.65, \"OMR\": 0.384, \"PAB\": 1, \"PEN\": 3.81, \"PGK\": 3.76, \"PHP\": 56.06, \"PKR\": 276.56, \"PLN\": 3.99, \"PYG\": 7296.89, \"QAR\": 3.64, \"RON\": 4.59, \"RSD\": 108.54, \"RUB\": 91.13, \"RWF\": 1288.44, \"SAR\": 3.75, \"SBD\": 8.45, \"SCR\": 13.25, \"SDG\": 510.59, \"SEK\": 10.49, \"SGD\": 1.34, \"SHP\": 0.79, \"SLE\": 22.55, \"SLL\": 22547.28, \"SOS\": 571.51, \"SRD\": 36.74, \"SSP\": 1105.26, \"STN\": 22.66, \"SYP\": 12908.24, \"SZL\": 18.8, \"THB\": 35.57, \"TJS\": 10.95, \"TMT\": 3.5, \"TND\": 3.12, \"TOP\": 2.34, \"TRY\": 30.49, \"TTD\": 6.76, \"TVD\": 1.53, \"TWD\": 31.3, \"TZS\": 2524.55, \"UAH\": 37.58, \"UGX\": 3814.79, \"USD\": 1, \"UYU\": 39.08, \"UZS\": 12388.19, \"VES\": 36.29, \"VND\": 24369.83, \"VUV\": 120.06, \"WST\": 2.73, \"XAF\": 606.77, \"XCD\": 2.7, \"XDR\": 0.749, \"XOF\": 606.77, \"XPF\": 110.38, \"YER\": 250.21, \"ZAR\": 18.8, \"ZMW\": 27.2, \"ZWL\": 10396.42}',
    '2024-02-03 14:33:23',
    '2024-02-03 14:33:23',
    '2024-02-03 14:33:23'
  );
INSERT INTO
  `currencyrates` (
    `id`,
    `Currency`,
    `CurrencyResponse`,
    `Date`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    19,
    'INR',
    '{\"AED\": 0.0442, \"AFN\": 0.898, \"ALL\": 1.16, \"AMD\": 4.87, \"ANG\": 0.0216, \"AOA\": 10.23, \"ARS\": 9.97, \"AUD\": 0.0185, \"AWG\": 0.0216, \"AZN\": 0.0206, \"BAM\": 0.0218, \"BBD\": 0.0241, \"BDT\": 1.32, \"BGN\": 0.0218, \"BHD\": 0.00453, \"BIF\": 34.33, \"BMD\": 0.012, \"BND\": 0.0162, \"BOB\": 0.0834, \"BRL\": 0.0594, \"BSD\": 0.012, \"BTN\": 1, \"BWP\": 0.164, \"BYN\": 0.0393, \"BZD\": 0.0241, \"CAD\": 0.0162, \"CDF\": 31.97, \"CHF\": 0.0104, \"CLP\": 11.32, \"CNY\": 0.0867, \"COP\": 47.27, \"CRC\": 6.22, \"CUP\": 0.289, \"CVE\": 1.23, \"CZK\": 0.277, \"DJF\": 2.14, \"DKK\": 0.0833, \"DOP\": 0.706, \"DZD\": 1.62, \"EGP\": 0.372, \"ERN\": 0.181, \"ETB\": 0.682, \"EUR\": 0.0112, \"FJD\": 0.0271, \"FKP\": 0.00952, \"FOK\": 0.0833, \"GBP\": 0.00954, \"GEL\": 0.0321, \"GGP\": 0.00952, \"GHS\": 0.149, \"GIP\": 0.00952, \"GMD\": 0.808, \"GNF\": 103.09, \"GTQ\": 0.0942, \"GYD\": 2.52, \"HKD\": 0.0943, \"HNL\": 0.297, \"HRK\": 0.0841, \"HTG\": 1.59, \"HUF\": 4.28, \"IDR\": 189.09, \"ILS\": 0.0441, \"IMP\": 0.00952, \"INR\": 1, \"IQD\": 15.78, \"IRR\": 523.77, \"ISK\": 1.64, \"JEP\": 0.00952, \"JMD\": 1.88, \"JOD\": 0.00854, \"JPY\": 1.79, \"KES\": 1.93, \"KGS\": 1.08, \"KHR\": 49.44, \"KID\": 0.0185, \"KMF\": 5.49, \"KRW\": 16.09, \"KWD\": 0.00371, \"KYD\": 0.01, \"KZT\": 5.45, \"LAK\": 248.04, \"LBP\": 180.69, \"LKR\": 3.76, \"LRD\": 2.31, \"LSL\": 0.227, \"LYD\": 0.0582, \"MAD\": 0.121, \"MDL\": 0.214, \"MGA\": 54.53, \"MKD\": 0.683, \"MMK\": 30.61, \"MNT\": 41.33, \"MOP\": 0.0971, \"MRU\": 0.477, \"MUR\": 0.555, \"MVR\": 0.186, \"MWK\": 20.3, \"MXN\": 0.207, \"MYR\": 0.0568, \"MZN\": 0.769, \"NAD\": 0.227, \"NGN\": 15.78, \"NIO\": 0.443, \"NOK\": 0.127, \"NPR\": 1.6, \"NZD\": 0.0198, \"OMR\": 0.00463, \"PAB\": 0.012, \"PEN\": 0.0461, \"PGK\": 0.0452, \"PHP\": 0.675, \"PKR\": 3.35, \"PLN\": 0.0482, \"PYG\": 87.95, \"QAR\": 0.0438, \"RON\": 0.0551, \"RSD\": 1.31, \"RUB\": 1.1, \"RWF\": 15.45, \"SAR\": 0.0452, \"SBD\": 0.102, \"SCR\": 0.167, \"SDG\": 5.39, \"SEK\": 0.126, \"SGD\": 0.0162, \"SHP\": 0.00952, \"SLE\": 0.272, \"SLL\": 271.61, \"SOS\": 6.89, \"SRD\": 0.444, \"SSP\": 13.32, \"STN\": 0.273, \"SYP\": 155.63, \"SZL\": 0.227, \"THB\": 0.428, \"TJS\": 0.132, \"TMT\": 0.0422, \"TND\": 0.0376, \"TOP\": 0.0282, \"TRY\": 0.368, \"TTD\": 0.0817, \"TVD\": 0.0185, \"TWD\": 0.377, \"TZS\": 30.44, \"UAH\": 0.454, \"UGX\": 45.82, \"USD\": 0.012, \"UYU\": 0.47, \"UZS\": 148.46, \"VES\": 0.437, \"VND\": 293.36, \"VUV\": 1.45, \"WST\": 0.0327, \"XAF\": 7.32, \"XCD\": 0.0325, \"XDR\": 0.00904, \"XOF\": 7.32, \"XPF\": 1.33, \"YER\": 3.02, \"ZAR\": 0.227, \"ZMW\": 0.328, \"ZWL\": 124.78}',
    '2024-02-05 08:27:25',
    '2024-02-05 08:27:25',
    '2024-02-05 08:27:25'
  );
INSERT INTO
  `currencyrates` (
    `id`,
    `Currency`,
    `CurrencyResponse`,
    `Date`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    20,
    'USD',
    '{\"AED\": 3.67, \"AFN\": 74.52, \"ALL\": 96.07, \"AMD\": 403.81, \"ANG\": 1.79, \"AOA\": 847.87, \"ARS\": 827.35, \"AUD\": 1.54, \"AWG\": 1.79, \"AZN\": 1.7, \"BAM\": 1.81, \"BBD\": 2, \"BDT\": 109.67, \"BGN\": 1.81, \"BHD\": 0.376, \"BIF\": 2848.19, \"BMD\": 1, \"BND\": 1.34, \"BOB\": 6.92, \"BRL\": 4.92, \"BSD\": 1, \"BTN\": 83.01, \"BWP\": 13.58, \"BYN\": 3.26, \"BZD\": 2, \"CAD\": 1.35, \"CDF\": 2669.24, \"CHF\": 0.866, \"CLP\": 939.01, \"CNY\": 7.21, \"COP\": 3920.86, \"CRC\": 515.85, \"CUP\": 24, \"CVE\": 102.18, \"CZK\": 23.05, \"DJF\": 177.72, \"DKK\": 6.92, \"DOP\": 58.61, \"DZD\": 134.53, \"EGP\": 30.9, \"ERN\": 15, \"ETB\": 56.63, \"EUR\": 0.927, \"FJD\": 2.24, \"FKP\": 0.792, \"FOK\": 6.92, \"GBP\": 0.792, \"GEL\": 2.67, \"GGP\": 0.792, \"GHS\": 12.35, \"GIP\": 0.792, \"GMD\": 67.08, \"GNF\": 8558.83, \"GTQ\": 7.81, \"GYD\": 209.21, \"HKD\": 7.82, \"HNL\": 24.61, \"HRK\": 6.98, \"HTG\": 131.7, \"HUF\": 355.38, \"IDR\": 15698.66, \"ILS\": 3.66, \"IMP\": 0.792, \"INR\": 83.01, \"IQD\": 1309.56, \"IRR\": 41998.59, \"ISK\": 136.3, \"JEP\": 0.792, \"JMD\": 155.85, \"JOD\": 0.709, \"JPY\": 148.37, \"KES\": 160.34, \"KGS\": 89.36, \"KHR\": 4101.77, \"KID\": 1.54, \"KMF\": 455.89, \"KRW\": 1332.5, \"KWD\": 0.308, \"KYD\": 0.833, \"KZT\": 452.1, \"LAK\": 20581.76, \"LBP\": 15000, \"LKR\": 311.48, \"LRD\": 191.74, \"LSL\": 18.87, \"LYD\": 4.83, \"MAD\": 10.01, \"MDL\": 17.81, \"MGA\": 4525.98, \"MKD\": 56.73, \"MMK\": 2103.91, \"MNT\": 3430.03, \"MOP\": 8.06, \"MRU\": 39.64, \"MUR\": 45.94, \"MVR\": 15.44, \"MWK\": 1684.4, \"MXN\": 17.17, \"MYR\": 4.72, \"MZN\": 63.85, \"NAD\": 18.87, \"NGN\": 1334.18, \"NIO\": 36.76, \"NOK\": 10.62, \"NPR\": 132.82, \"NZD\": 1.65, \"OMR\": 0.384, \"PAB\": 1, \"PEN\": 3.83, \"PGK\": 3.75, \"PHP\": 56.03, \"PKR\": 277.76, \"PLN\": 4, \"PYG\": 7295.35, \"QAR\": 3.64, \"RON\": 4.58, \"RSD\": 108.1, \"RUB\": 90.92, \"RWF\": 1276.79, \"SAR\": 3.75, \"SBD\": 8.5, \"SCR\": 13.38, \"SDG\": 458.96, \"SEK\": 10.51, \"SGD\": 1.34, \"SHP\": 0.792, \"SLE\": 22.55, \"SLL\": 22547.28, \"SOS\": 571.97, \"SRD\": 36.79, \"SSP\": 1105.17, \"STN\": 22.7, \"SYP\": 12914.46, \"SZL\": 18.87, \"THB\": 35.59, \"TJS\": 10.95, \"TMT\": 3.5, \"TND\": 3.12, \"TOP\": 2.34, \"TRY\": 30.53, \"TTD\": 6.77, \"TVD\": 1.54, \"TWD\": 31.35, \"TZS\": 2522.45, \"UAH\": 37.56, \"UGX\": 3803.45, \"USD\": 1, \"UYU\": 39.01, \"UZS\": 12329.13, \"VES\": 36.29, \"VND\": 24340.32, \"VUV\": 119.74, \"WST\": 2.74, \"XAF\": 607.86, \"XCD\": 2.7, \"XDR\": 0.749, \"XOF\": 607.86, \"XPF\": 110.58, \"YER\": 250.31, \"ZAR\": 18.87, \"ZMW\": 27.21, \"ZWL\": 10358.42}',
    '2024-02-05 08:27:27',
    '2024-02-05 08:27:27',
    '2024-02-05 08:27:27'
  );
INSERT INTO
  `currencyrates` (
    `id`,
    `Currency`,
    `CurrencyResponse`,
    `Date`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    21,
    'INR',
    '{\"AED\": 0.0442, \"AFN\": 0.904, \"ALL\": 1.16, \"AMD\": 4.87, \"ANG\": 0.0215, \"AOA\": 10.17, \"ARS\": 9.98, \"AUD\": 0.0186, \"AWG\": 0.0215, \"AZN\": 0.0205, \"BAM\": 0.0219, \"BBD\": 0.0241, \"BDT\": 1.32, \"BGN\": 0.0219, \"BHD\": 0.00453, \"BIF\": 34.64, \"BMD\": 0.012, \"BND\": 0.0162, \"BOB\": 0.0837, \"BRL\": 0.06, \"BSD\": 0.012, \"BTN\": 1, \"BWP\": 0.165, \"BYN\": 0.0391, \"BZD\": 0.0241, \"CAD\": 0.0163, \"CDF\": 33.09, \"CHF\": 0.0105, \"CLP\": 11.39, \"CNY\": 0.0867, \"COP\": 47.49, \"CRC\": 6.23, \"CUP\": 0.289, \"CVE\": 1.24, \"CZK\": 0.28, \"DJF\": 2.14, \"DKK\": 0.0836, \"DOP\": 0.711, \"DZD\": 1.62, \"EGP\": 0.372, \"ERN\": 0.181, \"ETB\": 0.682, \"EUR\": 0.0112, \"FJD\": 0.0271, \"FKP\": 0.00959, \"FOK\": 0.0836, \"GBP\": 0.00959, \"GEL\": 0.032, \"GGP\": 0.00959, \"GHS\": 0.15, \"GIP\": 0.00959, \"GMD\": 0.794, \"GNF\": 103.26, \"GTQ\": 0.0944, \"GYD\": 2.52, \"HKD\": 0.0942, \"HNL\": 0.298, \"HRK\": 0.0845, \"HTG\": 1.59, \"HUF\": 4.32, \"IDR\": 189.47, \"ILS\": 0.0441, \"IMP\": 0.00959, \"INR\": 1, \"IQD\": 15.77, \"IRR\": 512.79, \"ISK\": 1.66, \"JEP\": 0.00959, \"JMD\": 1.89, \"JOD\": 0.00854, \"JPY\": 1.79, \"KES\": 1.94, \"KGS\": 1.08, \"KHR\": 49.41, \"KID\": 0.0186, \"KMF\": 5.51, \"KRW\": 16.05, \"KWD\": 0.00371, \"KYD\": 0.01, \"KZT\": 5.47, \"LAK\": 248.22, \"LBP\": 180.58, \"LKR\": 3.76, \"LRD\": 2.31, \"LSL\": 0.229, \"LYD\": 0.0581, \"MAD\": 0.121, \"MDL\": 0.215, \"MGA\": 52.94, \"MKD\": 0.683, \"MMK\": 30.75, \"MNT\": 41.2, \"MOP\": 0.097, \"MRU\": 0.476, \"MUR\": 0.546, \"MVR\": 0.186, \"MWK\": 20.37, \"MXN\": 0.207, \"MYR\": 0.0572, \"MZN\": 0.769, \"NAD\": 0.229, \"NGN\": 15.64, \"NIO\": 0.443, \"NOK\": 0.129, \"NPR\": 1.6, \"NZD\": 0.0199, \"OMR\": 0.00463, \"PAB\": 0.012, \"PEN\": 0.0464, \"PGK\": 0.0451, \"PHP\": 0.678, \"PKR\": 3.34, \"PLN\": 0.0486, \"PYG\": 87.89, \"QAR\": 0.0438, \"RON\": 0.0557, \"RSD\": 1.31, \"RUB\": 1.1, \"RWF\": 15.8, \"SAR\": 0.0451, \"SBD\": 0.102, \"SCR\": 0.164, \"SDG\": 5.39, \"SEK\": 0.128, \"SGD\": 0.0162, \"SHP\": 0.00959, \"SLE\": 0.271, \"SLL\": 271.45, \"SOS\": 6.89, \"SRD\": 0.443, \"SSP\": 13.31, \"STN\": 0.275, \"SYP\": 155.49, \"SZL\": 0.229, \"THB\": 0.431, \"TJS\": 0.132, \"TMT\": 0.0421, \"TND\": 0.0377, \"TOP\": 0.0283, \"TRY\": 0.368, \"TTD\": 0.0816, \"TVD\": 0.0186, \"TWD\": 0.378, \"TZS\": 30.53, \"UAH\": 0.452, \"UGX\": 45.91, \"USD\": 0.012, \"UYU\": 0.473, \"UZS\": 150.22, \"VES\": 0.436, \"VND\": 293.95, \"VUV\": 1.46, \"WST\": 0.0328, \"XAF\": 7.35, \"XCD\": 0.0325, \"XDR\": 0.0091, \"XOF\": 7.35, \"XPF\": 1.34, \"YER\": 3.01, \"ZAR\": 0.229, \"ZMW\": 0.328, \"ZWL\": 128.45}',
    '2024-02-06 02:41:09',
    '2024-02-06 02:41:09',
    '2024-02-06 02:41:09'
  );
INSERT INTO
  `currencyrates` (
    `id`,
    `Currency`,
    `CurrencyResponse`,
    `Date`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    22,
    'USD',
    '{\"AED\": 3.67, \"AFN\": 75.07, \"ALL\": 96.63, \"AMD\": 404.9, \"ANG\": 1.79, \"AOA\": 843.29, \"ARS\": 829.05, \"AUD\": 1.54, \"AWG\": 1.79, \"AZN\": 1.7, \"BAM\": 1.82, \"BBD\": 2, \"BDT\": 109.86, \"BGN\": 1.82, \"BHD\": 0.376, \"BIF\": 2872.84, \"BMD\": 1, \"BND\": 1.35, \"BOB\": 6.95, \"BRL\": 4.99, \"BSD\": 1, \"BTN\": 83.06, \"BWP\": 13.69, \"BYN\": 3.25, \"BZD\": 2, \"CAD\": 1.35, \"CDF\": 2718.67, \"CHF\": 0.87, \"CLP\": 946.06, \"CNY\": 7.21, \"COP\": 3942.97, \"CRC\": 517.41, \"CUP\": 24, \"CVE\": 102.62, \"CZK\": 23.22, \"DJF\": 177.72, \"DKK\": 6.94, \"DOP\": 59.06, \"DZD\": 134.69, \"EGP\": 30.91, \"ERN\": 15, \"ETB\": 56.67, \"EUR\": 0.931, \"FJD\": 2.25, \"FKP\": 0.797, \"FOK\": 6.94, \"GBP\": 0.797, \"GEL\": 2.66, \"GGP\": 0.797, \"GHS\": 12.42, \"GIP\": 0.797, \"GMD\": 65.97, \"GNF\": 8576.94, \"GTQ\": 7.84, \"GYD\": 209.21, \"HKD\": 7.82, \"HNL\": 24.78, \"HRK\": 7.01, \"HTG\": 131.72, \"HUF\": 359.19, \"IDR\": 15739.48, \"ILS\": 3.67, \"IMP\": 0.797, \"INR\": 83.06, \"IQD\": 1309.57, \"IRR\": 42037.94, \"ISK\": 137.88, \"JEP\": 0.797, \"JMD\": 156.1, \"JOD\": 0.709, \"JPY\": 148.61, \"KES\": 160.82, \"KGS\": 89.37, \"KHR\": 4102.37, \"KID\": 1.54, \"KMF\": 457.87, \"KRW\": 1333.98, \"KWD\": 0.308, \"KYD\": 0.833, \"KZT\": 454.13, \"LAK\": 20615.92, \"LBP\": 15000, \"LKR\": 312.23, \"LRD\": 191.65, \"LSL\": 19.05, \"LYD\": 4.83, \"MAD\": 10.06, \"MDL\": 17.77, \"MGA\": 4526.98, \"MKD\": 56.74, \"MMK\": 2111.61, \"MNT\": 3421.46, \"MOP\": 8.06, \"MRU\": 39.61, \"MUR\": 45.22, \"MVR\": 15.44, \"MWK\": 1691.86, \"MXN\": 17.14, \"MYR\": 4.75, \"MZN\": 63.88, \"NAD\": 19.05, \"NGN\": 1375.69, \"NIO\": 36.78, \"NOK\": 10.68, \"NPR\": 132.9, \"NZD\": 1.65, \"OMR\": 0.384, \"PAB\": 1, \"PEN\": 3.85, \"PGK\": 3.75, \"PHP\": 56.34, \"PKR\": 276.89, \"PLN\": 4.04, \"PYG\": 7298.11, \"QAR\": 3.64, \"RON\": 4.63, \"RSD\": 108.99, \"RUB\": 91.54, \"RWF\": 1288.77, \"SAR\": 3.75, \"SBD\": 8.48, \"SCR\": 13.59, \"SDG\": 454.52, \"SEK\": 10.6, \"SGD\": 1.35, \"SHP\": 0.797, \"SLE\": 22.55, \"SLL\": 22547.28, \"SOS\": 571.99, \"SRD\": 36.8, \"SSP\": 1105.35, \"STN\": 22.8, \"SYP\": 12915.08, \"SZL\": 19.05, \"THB\": 35.79, \"TJS\": 10.95, \"TMT\": 3.5, \"TND\": 3.13, \"TOP\": 2.35, \"TRY\": 30.55, \"TTD\": 6.75, \"TVD\": 1.54, \"TWD\": 31.37, \"TZS\": 2523.12, \"UAH\": 37.54, \"UGX\": 3813.68, \"USD\": 1, \"UYU\": 39.31, \"UZS\": 12383.55, \"VES\": 36.25, \"VND\": 24385.64, \"VUV\": 120.62, \"WST\": 2.75, \"XAF\": 610.49, \"XCD\": 2.7, \"XDR\": 0.756, \"XOF\": 610.49, \"XPF\": 111.06, \"YER\": 250.34, \"ZAR\": 19.05, \"ZMW\": 27.21, \"ZWL\": 10669.72}',
    '2024-02-06 02:41:10',
    '2024-02-06 02:41:10',
    '2024-02-06 02:41:10'
  );
INSERT INTO
  `currencyrates` (
    `id`,
    `Currency`,
    `CurrencyResponse`,
    `Date`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    23,
    'INR',
    '{\"AED\": 0.0442, \"AFN\": 0.894, \"ALL\": 1.17, \"AMD\": 4.87, \"ANG\": 0.0215, \"AOA\": 10.17, \"ARS\": 9.99, \"AUD\": 0.0185, \"AWG\": 0.0215, \"AZN\": 0.0205, \"BAM\": 0.0219, \"BBD\": 0.0241, \"BDT\": 1.32, \"BGN\": 0.0219, \"BHD\": 0.00453, \"BIF\": 34.33, \"BMD\": 0.012, \"BND\": 0.0162, \"BOB\": 0.0833, \"BRL\": 0.0598, \"BSD\": 0.012, \"BTN\": 1, \"BWP\": 0.165, \"BYN\": 0.0391, \"BZD\": 0.0241, \"CAD\": 0.0163, \"CDF\": 33.11, \"CHF\": 0.0105, \"CLP\": 11.48, \"CNY\": 0.0866, \"COP\": 47.53, \"CRC\": 6.22, \"CUP\": 0.289, \"CVE\": 1.24, \"CZK\": 0.28, \"DJF\": 2.14, \"DKK\": 0.0836, \"DOP\": 0.708, \"DZD\": 1.62, \"EGP\": 0.372, \"ERN\": 0.181, \"ETB\": 0.682, \"EUR\": 0.0112, \"FJD\": 0.0271, \"FKP\": 0.00958, \"FOK\": 0.0836, \"GBP\": 0.00958, \"GEL\": 0.032, \"GGP\": 0.00958, \"GHS\": 0.15, \"GIP\": 0.00958, \"GMD\": 0.793, \"GNF\": 103.29, \"GTQ\": 0.0941, \"GYD\": 2.52, \"HKD\": 0.0942, \"HNL\": 0.297, \"HRK\": 0.0845, \"HTG\": 1.58, \"HUF\": 4.34, \"IDR\": 189.36, \"ILS\": 0.0439, \"IMP\": 0.00958, \"INR\": 1, \"IQD\": 15.78, \"IRR\": 512.89, \"ISK\": 1.66, \"JEP\": 0.00958, \"JMD\": 1.88, \"JOD\": 0.00853, \"JPY\": 1.79, \"KES\": 1.93, \"KGS\": 1.08, \"KHR\": 49.44, \"KID\": 0.0185, \"KMF\": 5.52, \"KRW\": 15.97, \"KWD\": 0.00371, \"KYD\": 0.01, \"KZT\": 5.46, \"LAK\": 248.58, \"LBP\": 180.56, \"LKR\": 3.77, \"LRD\": 2.31, \"LSL\": 0.227, \"LYD\": 0.0582, \"MAD\": 0.121, \"MDL\": 0.214, \"MGA\": 52.97, \"MKD\": 0.691, \"MMK\": 30.61, \"MNT\": 41.01, \"MOP\": 0.097, \"MRU\": 0.476, \"MUR\": 0.548, \"MVR\": 0.186, \"MWK\": 20.38, \"MXN\": 0.205, \"MYR\": 0.0574, \"MZN\": 0.769, \"NAD\": 0.227, \"NGN\": 16.57, \"NIO\": 0.441, \"NOK\": 0.128, \"NPR\": 1.6, \"NZD\": 0.0198, \"OMR\": 0.00463, \"PAB\": 0.012, \"PEN\": 0.0465, \"PGK\": 0.0451, \"PHP\": 0.676, \"PKR\": 3.37, \"PLN\": 0.0487, \"PYG\": 88.25, \"QAR\": 0.0438, \"RON\": 0.0558, \"RSD\": 1.31, \"RUB\": 1.09, \"RWF\": 15.78, \"SAR\": 0.0451, \"SBD\": 0.102, \"SCR\": 0.16, \"SDG\": 5.38, \"SEK\": 0.127, \"SGD\": 0.0162, \"SHP\": 0.00958, \"SLE\": 0.271, \"SLL\": 271.41, \"SOS\": 6.88, \"SRD\": 0.441, \"SSP\": 13.43, \"STN\": 0.275, \"SYP\": 155.38, \"SZL\": 0.227, \"THB\": 0.429, \"TJS\": 0.132, \"TMT\": 0.0421, \"TND\": 0.0377, \"TOP\": 0.0285, \"TRY\": 0.368, \"TTD\": 0.0817, \"TVD\": 0.0185, \"TWD\": 0.377, \"TZS\": 30.54, \"UAH\": 0.453, \"UGX\": 45.94, \"USD\": 0.012, \"UYU\": 0.47, \"UZS\": 150.34, \"VES\": 0.436, \"VND\": 293.47, \"VUV\": 1.46, \"WST\": 0.0329, \"XAF\": 7.36, \"XCD\": 0.0325, \"XDR\": 0.0091, \"XOF\": 7.36, \"XPF\": 1.34, \"YER\": 3.01, \"ZAR\": 0.228, \"ZMW\": 0.326, \"ZWL\": 131.33}',
    '2024-02-07 04:08:20',
    '2024-02-07 04:08:20',
    '2024-02-07 04:08:20'
  );
INSERT INTO
  `currencyrates` (
    `id`,
    `Currency`,
    `CurrencyResponse`,
    `Date`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    24,
    'USD',
    '{\"AED\": 3.67, \"AFN\": 74.25, \"ALL\": 96.86, \"AMD\": 405.09, \"ANG\": 1.79, \"AOA\": 843.33, \"ARS\": 829.55, \"AUD\": 1.53, \"AWG\": 1.79, \"AZN\": 1.7, \"BAM\": 1.82, \"BBD\": 2, \"BDT\": 109.72, \"BGN\": 1.82, \"BHD\": 0.376, \"BIF\": 2844.76, \"BMD\": 1, \"BND\": 1.34, \"BOB\": 6.92, \"BRL\": 4.97, \"BSD\": 1, \"BTN\": 83.08, \"BWP\": 13.76, \"BYN\": 3.25, \"BZD\": 2, \"CAD\": 1.35, \"CDF\": 2718.85, \"CHF\": 0.871, \"CLP\": 953.49, \"CNY\": 7.2, \"COP\": 3946.65, \"CRC\": 516.79, \"CUP\": 24, \"CVE\": 102.59, \"CZK\": 23.2, \"DJF\": 177.72, \"DKK\": 6.94, \"DOP\": 58.84, \"DZD\": 134.82, \"EGP\": 30.9, \"ERN\": 15, \"ETB\": 56.69, \"EUR\": 0.93, \"FJD\": 2.25, \"FKP\": 0.795, \"FOK\": 6.94, \"GBP\": 0.794, \"GEL\": 2.66, \"GGP\": 0.795, \"GHS\": 12.43, \"GIP\": 0.795, \"GMD\": 65.86, \"GNF\": 8578.68, \"GTQ\": 7.81, \"GYD\": 209.17, \"HKD\": 7.82, \"HNL\": 24.69, \"HRK\": 7.01, \"HTG\": 131.63, \"HUF\": 359.77, \"IDR\": 15733.89, \"ILS\": 3.65, \"IMP\": 0.795, \"INR\": 83.08, \"IQD\": 1310.2, \"IRR\": 42050.91, \"ISK\": 137.96, \"JEP\": 0.795, \"JMD\": 156.27, \"JOD\": 0.709, \"JPY\": 148.07, \"KES\": 160.32, \"KGS\": 89.44, \"KHR\": 4104.98, \"KID\": 1.53, \"KMF\": 457.75, \"KRW\": 1327.53, \"KWD\": 0.308, \"KYD\": 0.833, \"KZT\": 453.38, \"LAK\": 20643.86, \"LBP\": 15000, \"LKR\": 313.18, \"LRD\": 191.71, \"LSL\": 18.85, \"LYD\": 4.84, \"MAD\": 10.08, \"MDL\": 17.81, \"MGA\": 4530.43, \"MKD\": 57.4, \"MMK\": 2097.76, \"MNT\": 3406.56, \"MOP\": 8.06, \"MRU\": 39.58, \"MUR\": 45.69, \"MVR\": 15.44, \"MWK\": 1692.32, \"MXN\": 17.05, \"MYR\": 4.77, \"MZN\": 63.88, \"NAD\": 18.85, \"NGN\": 1404.96, \"NIO\": 36.64, \"NOK\": 10.64, \"NPR\": 132.92, \"NZD\": 1.64, \"OMR\": 0.384, \"PAB\": 1, \"PEN\": 3.86, \"PGK\": 3.74, \"PHP\": 56.19, \"PKR\": 279.52, \"PLN\": 4.04, \"PYG\": 7328.13, \"QAR\": 3.64, \"RON\": 4.63, \"RSD\": 109.03, \"RUB\": 90.68, \"RWF\": 1289.88, \"SAR\": 3.75, \"SBD\": 8.48, \"SCR\": 13.32, \"SDG\": 449.28, \"SEK\": 10.54, \"SGD\": 1.34, \"SHP\": 0.795, \"SLE\": 22.55, \"SLL\": 22547.28, \"SOS\": 571.24, \"SRD\": 36.64, \"SSP\": 1115.3, \"STN\": 22.8, \"SYP\": 12904.01, \"SZL\": 18.85, \"THB\": 35.59, \"TJS\": 10.96, \"TMT\": 3.5, \"TND\": 3.14, \"TOP\": 2.36, \"TRY\": 30.57, \"TTD\": 6.76, \"TVD\": 1.53, \"TWD\": 31.29, \"TZS\": 2529.4, \"UAH\": 37.61, \"UGX\": 3815.55, \"USD\": 1, \"UYU\": 39.07, \"UZS\": 12399.46, \"VES\": 36.26, \"VND\": 24361.21, \"VUV\": 120.63, \"WST\": 2.75, \"XAF\": 610.33, \"XCD\": 2.7, \"XDR\": 0.756, \"XOF\": 610.33, \"XPF\": 111.03, \"YER\": 250.17, \"ZAR\": 18.85, \"ZMW\": 27.08, \"ZWL\": 10910.1}',
    '2024-02-07 04:08:22',
    '2024-02-07 04:08:22',
    '2024-02-07 04:08:22'
  );
INSERT INTO
  `currencyrates` (
    `id`,
    `Currency`,
    `CurrencyResponse`,
    `Date`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    25,
    'INR',
    '{\"AED\": 0.0442, \"AFN\": 0.89, \"ALL\": 1.17, \"AMD\": 4.87, \"ANG\": 0.0216, \"AOA\": 10.16, \"ARS\": 10.01, \"AUD\": 0.0186, \"AWG\": 0.0216, \"AZN\": 0.0205, \"BAM\": 0.0219, \"BBD\": 0.0241, \"BDT\": 1.32, \"BGN\": 0.0219, \"BHD\": 0.00453, \"BIF\": 34.34, \"BMD\": 0.012, \"BND\": 0.0162, \"BOB\": 0.0835, \"BRL\": 0.0599, \"BSD\": 0.012, \"BTN\": 1, \"BWP\": 0.165, \"BYN\": 0.0392, \"BZD\": 0.0241, \"CAD\": 0.0162, \"CDF\": 33.12, \"CHF\": 0.0105, \"CLP\": 11.5, \"CNY\": 0.0867, \"COP\": 47.71, \"CRC\": 6.25, \"CUP\": 0.289, \"CVE\": 1.23, \"CZK\": 0.279, \"DJF\": 2.14, \"DKK\": 0.0835, \"DOP\": 0.707, \"DZD\": 1.63, \"EGP\": 0.373, \"ERN\": 0.181, \"ETB\": 0.682, \"EUR\": 0.0112, \"FJD\": 0.0271, \"FKP\": 0.00955, \"FOK\": 0.0835, \"GBP\": 0.00956, \"GEL\": 0.032, \"GGP\": 0.00955, \"GHS\": 0.15, \"GIP\": 0.00955, \"GMD\": 0.787, \"GNF\": 103.45, \"GTQ\": 0.0943, \"GYD\": 2.52, \"HKD\": 0.0942, \"HNL\": 0.298, \"HRK\": 0.0843, \"HTG\": 1.59, \"HUF\": 4.34, \"IDR\": 188.57, \"ILS\": 0.0444, \"IMP\": 0.00955, \"INR\": 1, \"IQD\": 15.78, \"IRR\": 509.96, \"ISK\": 1.67, \"JEP\": 0.00955, \"JMD\": 1.88, \"JOD\": 0.00854, \"JPY\": 1.8, \"KES\": 1.93, \"KGS\": 1.08, \"KHR\": 49.45, \"KID\": 0.0186, \"KMF\": 5.51, \"KRW\": 16.04, \"KWD\": 0.00371, \"KYD\": 0.01, \"KZT\": 5.43, \"LAK\": 250.1, \"LBP\": 180.71, \"LKR\": 3.78, \"LRD\": 2.31, \"LSL\": 0.228, \"LYD\": 0.0584, \"MAD\": 0.121, \"MDL\": 0.215, \"MGA\": 54.54, \"MKD\": 0.69, \"MMK\": 31.88, \"MNT\": 41.21, \"MOP\": 0.0971, \"MRU\": 0.477, \"MUR\": 0.548, \"MVR\": 0.186, \"MWK\": 20.43, \"MXN\": 0.206, \"MYR\": 0.0574, \"MZN\": 0.77, \"NAD\": 0.228, \"NGN\": 17.05, \"NIO\": 0.442, \"NOK\": 0.128, \"NPR\": 1.6, \"NZD\": 0.0198, \"OMR\": 0.00463, \"PAB\": 0.012, \"PEN\": 0.0464, \"PGK\": 0.0453, \"PHP\": 0.674, \"PKR\": 3.37, \"PLN\": 0.0486, \"PYG\": 88.07, \"QAR\": 0.0439, \"RON\": 0.0557, \"RSD\": 1.31, \"RUB\": 1.11, \"RWF\": 15.94, \"SAR\": 0.0452, \"SBD\": 0.102, \"SCR\": 0.162, \"SDG\": 5.38, \"SEK\": 0.126, \"SGD\": 0.0162, \"SHP\": 0.00955, \"SLE\": 0.272, \"SLL\": 272.12, \"SOS\": 6.88, \"SRD\": 0.441, \"SSP\": 13.44, \"STN\": 0.274, \"SYP\": 156.27, \"SZL\": 0.228, \"THB\": 0.432, \"TJS\": 0.132, \"TMT\": 0.0422, \"TND\": 0.0378, \"TOP\": 0.0283, \"TRY\": 0.369, \"TTD\": 0.0819, \"TVD\": 0.0186, \"TWD\": 0.378, \"TZS\": 30.67, \"UAH\": 0.453, \"UGX\": 46.17, \"USD\": 0.012, \"UYU\": 0.473, \"UZS\": 150.82, \"VES\": 0.437, \"VND\": 293.57, \"VUV\": 1.46, \"WST\": 0.0328, \"XAF\": 7.34, \"XCD\": 0.0325, \"XDR\": 0.00908, \"XOF\": 7.34, \"XPF\": 1.34, \"YER\": 3.02, \"ZAR\": 0.228, \"ZMW\": 0.325, \"ZWL\": 132.34}',
    '2024-02-09 02:14:28',
    '2024-02-09 02:14:28',
    '2024-02-09 02:14:28'
  );
INSERT INTO
  `currencyrates` (
    `id`,
    `Currency`,
    `CurrencyResponse`,
    `Date`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    26,
    'USD',
    '{\"AED\": 3.67, \"AFN\": 73.84, \"ALL\": 96.87, \"AMD\": 405.49, \"ANG\": 1.79, \"AOA\": 837.92, \"ARS\": 830.65, \"AUD\": 1.54, \"AWG\": 1.79, \"AZN\": 1.7, \"BAM\": 1.82, \"BBD\": 2, \"BDT\": 109.79, \"BGN\": 1.82, \"BHD\": 0.376, \"BIF\": 2847.35, \"BMD\": 1, \"BND\": 1.35, \"BOB\": 6.93, \"BRL\": 4.97, \"BSD\": 1, \"BTN\": 83.01, \"BWP\": 13.71, \"BYN\": 3.25, \"BZD\": 2, \"CAD\": 1.35, \"CDF\": 2717.62, \"CHF\": 0.874, \"CLP\": 954.03, \"CNY\": 7.2, \"COP\": 3959.45, \"CRC\": 518.28, \"CUP\": 24, \"CVE\": 102.37, \"CZK\": 23.26, \"DJF\": 177.72, \"DKK\": 6.93, \"DOP\": 58.63, \"DZD\": 134.83, \"EGP\": 30.92, \"ERN\": 15, \"ETB\": 56.73, \"EUR\": 0.928, \"FJD\": 2.25, \"FKP\": 0.793, \"FOK\": 6.93, \"GBP\": 0.793, \"GEL\": 2.66, \"GGP\": 0.793, \"GHS\": 12.45, \"GIP\": 0.793, \"GMD\": 66.02, \"GNF\": 8591.55, \"GTQ\": 7.82, \"GYD\": 209.54, \"HKD\": 7.82, \"HNL\": 24.7, \"HRK\": 7, \"HTG\": 131.99, \"HUF\": 360.24, \"IDR\": 15653.11, \"ILS\": 3.69, \"IMP\": 0.793, \"INR\": 83.01, \"IQD\": 1310.85, \"IRR\": 42076.59, \"ISK\": 138.29, \"JEP\": 0.793, \"JMD\": 156.38, \"JOD\": 0.709, \"JPY\": 149.15, \"KES\": 160.24, \"KGS\": 89.34, \"KHR\": 4091.29, \"KID\": 1.54, \"KMF\": 456.76, \"KRW\": 1330.68, \"KWD\": 0.308, \"KYD\": 0.833, \"KZT\": 452.59, \"LAK\": 20785.88, \"LBP\": 15000, \"LKR\": 312.7, \"LRD\": 192, \"LSL\": 18.96, \"LYD\": 4.84, \"MAD\": 10.07, \"MDL\": 17.83, \"MGA\": 4536.91, \"MKD\": 57.25, \"MMK\": 2100.81, \"MNT\": 3420.26, \"MOP\": 8.06, \"MRU\": 39.58, \"MUR\": 45.33, \"MVR\": 15.46, \"MWK\": 1692.55, \"MXN\": 17.12, \"MYR\": 4.77, \"MZN\": 63.91, \"NAD\": 18.96, \"NGN\": 1399.46, \"NIO\": 36.7, \"NOK\": 10.62, \"NPR\": 132.81, \"NZD\": 1.64, \"OMR\": 0.384, \"PAB\": 1, \"PEN\": 3.87, \"PGK\": 3.76, \"PHP\": 55.93, \"PKR\": 279.6, \"PLN\": 4.02, \"PYG\": 7304.84, \"QAR\": 3.64, \"RON\": 4.62, \"RSD\": 108.79, \"RUB\": 91.82, \"RWF\": 1282.14, \"SAR\": 3.75, \"SBD\": 8.5, \"SCR\": 13.27, \"SDG\": 545.08, \"SEK\": 10.48, \"SGD\": 1.35, \"SHP\": 0.793, \"SLE\": 22.59, \"SLL\": 22587.69, \"SOS\": 571.79, \"SRD\": 36.61, \"SSP\": 1107.34, \"STN\": 22.75, \"SYP\": 12979.83, \"SZL\": 18.96, \"THB\": 35.85, \"TJS\": 10.95, \"TMT\": 3.5, \"TND\": 3.13, \"TOP\": 2.35, \"TRY\": 30.64, \"TTD\": 6.77, \"TVD\": 1.54, \"TWD\": 31.35, \"TZS\": 2532.56, \"UAH\": 37.59, \"UGX\": 3827.65, \"USD\": 1, \"UYU\": 39.22, \"UZS\": 12408.74, \"VES\": 36.29, \"VND\": 24375.37, \"VUV\": 120.8, \"WST\": 2.75, \"XAF\": 609.01, \"XCD\": 2.7, \"XDR\": 0.754, \"XOF\": 609.01, \"XPF\": 110.79, \"YER\": 250.6, \"ZAR\": 18.96, \"ZMW\": 26.99, \"ZWL\": 10985.12}',
    '2024-02-09 02:14:29',
    '2024-02-09 02:14:29',
    '2024-02-09 02:14:29'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: diagnostics_packages
# ------------------------------------------------------------

INSERT INTO
  `diagnostics_packages` (
    `id`,
    `packageName`,
    `MRPOfPackage`,
    `discount`,
    `finalPrice`,
    `createdAt`,
    `updatedAt`,
    `Currency`
  )
VALUES
  (
    1,
    'jhjbn',
    100,
    10,
    90.00,
    '2023-10-12 08:02:50',
    '2024-01-15 17:19:51',
    'USD'
  );
INSERT INTO
  `diagnostics_packages` (
    `id`,
    `packageName`,
    `MRPOfPackage`,
    `discount`,
    `finalPrice`,
    `createdAt`,
    `updatedAt`,
    `Currency`
  )
VALUES
  (
    2,
    'new',
    1000,
    10,
    900.00,
    '2023-10-15 16:01:46',
    '2023-10-15 16:01:46',
    NULL
  );
INSERT INTO
  `diagnostics_packages` (
    `id`,
    `packageName`,
    `MRPOfPackage`,
    `discount`,
    `finalPrice`,
    `createdAt`,
    `updatedAt`,
    `Currency`
  )
VALUES
  (
    3,
    'Diagnostic Package',
    6000,
    40,
    3600.00,
    '2023-10-19 17:37:29',
    '2024-02-03 17:30:20',
    'USD'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: diagnosticsbookings
# ------------------------------------------------------------

INSERT INTO
  `diagnosticsbookings` (
    `id`,
    `PatientName`,
    `PatientID`,
    `doctorId`,
    `PaymentStatus`,
    `PaymentDate`,
    `DoctorPhone`,
    `DoctorEmail`,
    `DoctorName`,
    `commissionType`,
    `commissionValue`,
    `TestManagementID`,
    `TestManagementIDs`,
    `Address`,
    `PatientPhoneNo`,
    `status`,
    `lapName`,
    `selectedTests`,
    `remarks`,
    `instrumentsUsed`,
    `testFees`,
    `results`,
    `Authorization`,
    `feedback`,
    `createdAt`,
    `updatedAt`,
    `CorporateID`,
    `selectedPackageID`,
    `TotalFees`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    1,
    'Admin two Patient',
    18,
    1,
    'Paid',
    '2023-10-21',
    8765678976,
    'rajesh02@gmail.com',
    'Rajesh NA Kumar',
    '2',
    'A',
    8,
    NULL,
    'Null',
    7654356788,
    'Completed',
    'NA',
    'Ultrasound Abdomen',
    'NA',
    '',
    101.00,
    'pending',
    'Pending',
    NULL,
    '2023-09-27 07:58:05',
    '2023-10-17 17:29:34',
    NULL,
    NULL,
    NULL,
    NULL,
    0,
    'Diagnostic'
  );
INSERT INTO
  `diagnosticsbookings` (
    `id`,
    `PatientName`,
    `PatientID`,
    `doctorId`,
    `PaymentStatus`,
    `PaymentDate`,
    `DoctorPhone`,
    `DoctorEmail`,
    `DoctorName`,
    `commissionType`,
    `commissionValue`,
    `TestManagementID`,
    `TestManagementIDs`,
    `Address`,
    `PatientPhoneNo`,
    `status`,
    `lapName`,
    `selectedTests`,
    `remarks`,
    `instrumentsUsed`,
    `testFees`,
    `results`,
    `Authorization`,
    `feedback`,
    `createdAt`,
    `updatedAt`,
    `CorporateID`,
    `selectedPackageID`,
    `TotalFees`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    2,
    'Vaibhav  Pande',
    6,
    2,
    'Paid',
    '2023-11-04',
    0,
    'anand@gmail.com',
    'NA NA NA',
    '4',
    'B',
    9,
    NULL,
    'Null',
    8976545678,
    'Completed',
    'NA',
    'Calcium, Vitamin D, Brain MRI Scan',
    'NA',
    '',
    1000.00,
    'pending',
    'Pending',
    NULL,
    '2023-10-12 05:28:22',
    '2023-10-17 12:20:21',
    NULL,
    NULL,
    NULL,
    NULL,
    0,
    'Diagnostic'
  );
INSERT INTO
  `diagnosticsbookings` (
    `id`,
    `PatientName`,
    `PatientID`,
    `doctorId`,
    `PaymentStatus`,
    `PaymentDate`,
    `DoctorPhone`,
    `DoctorEmail`,
    `DoctorName`,
    `commissionType`,
    `commissionValue`,
    `TestManagementID`,
    `TestManagementIDs`,
    `Address`,
    `PatientPhoneNo`,
    `status`,
    `lapName`,
    `selectedTests`,
    `remarks`,
    `instrumentsUsed`,
    `testFees`,
    `results`,
    `Authorization`,
    `feedback`,
    `createdAt`,
    `updatedAt`,
    `CorporateID`,
    `selectedPackageID`,
    `TotalFees`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    4,
    'Vijay  Kumar',
    29,
    1,
    'Paid',
    '2023-10-17',
    8765678976,
    'rajesh02@gmail.com',
    'Rajesh NA Kumar',
    '2',
    'A',
    4,
    NULL,
    'Null',
    8676654575,
    'Completed',
    'NA',
    'Tests, Phosphorous',
    'NA',
    '',
    100.00,
    'pending',
    'Pending',
    NULL,
    '2023-10-17 12:40:52',
    '2023-10-17 15:13:50',
    NULL,
    NULL,
    NULL,
    NULL,
    0,
    'Diagnostic'
  );
INSERT INTO
  `diagnosticsbookings` (
    `id`,
    `PatientName`,
    `PatientID`,
    `doctorId`,
    `PaymentStatus`,
    `PaymentDate`,
    `DoctorPhone`,
    `DoctorEmail`,
    `DoctorName`,
    `commissionType`,
    `commissionValue`,
    `TestManagementID`,
    `TestManagementIDs`,
    `Address`,
    `PatientPhoneNo`,
    `status`,
    `lapName`,
    `selectedTests`,
    `remarks`,
    `instrumentsUsed`,
    `testFees`,
    `results`,
    `Authorization`,
    `feedback`,
    `createdAt`,
    `updatedAt`,
    `CorporateID`,
    `selectedPackageID`,
    `TotalFees`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    5,
    'Vijay  Kumar',
    29,
    1,
    'Paid',
    '2023-10-17',
    8765678976,
    'rajesh02@gmail.com',
    'Rajesh NA Kumar',
    '2',
    'A',
    3,
    NULL,
    'Null',
    8676654575,
    'Registered',
    'NA',
    'Calcium',
    'NA',
    '',
    100.00,
    'pending',
    'Pending',
    NULL,
    '2023-10-17 12:50:18',
    '2023-10-17 12:50:18',
    NULL,
    2,
    NULL,
    NULL,
    0,
    'Diagnostic'
  );
INSERT INTO
  `diagnosticsbookings` (
    `id`,
    `PatientName`,
    `PatientID`,
    `doctorId`,
    `PaymentStatus`,
    `PaymentDate`,
    `DoctorPhone`,
    `DoctorEmail`,
    `DoctorName`,
    `commissionType`,
    `commissionValue`,
    `TestManagementID`,
    `TestManagementIDs`,
    `Address`,
    `PatientPhoneNo`,
    `status`,
    `lapName`,
    `selectedTests`,
    `remarks`,
    `instrumentsUsed`,
    `testFees`,
    `results`,
    `Authorization`,
    `feedback`,
    `createdAt`,
    `updatedAt`,
    `CorporateID`,
    `selectedPackageID`,
    `TotalFees`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    6,
    'Vijay  Kumar',
    29,
    1,
    'Paid',
    '2023-10-25',
    8765678976,
    'rajesh@gmail.com',
    'Rajesh Kumar',
    '2',
    'A',
    2,
    NULL,
    'Null',
    8676654575,
    'Completed',
    'NA',
    'Tests, Phosphorous',
    'NA',
    '',
    2200.00,
    'pending',
    'Approved',
    'NA hh',
    '2023-10-18 04:58:45',
    '2023-10-19 09:37:16',
    NULL,
    1,
    NULL,
    NULL,
    0,
    'Diagnostic'
  );
INSERT INTO
  `diagnosticsbookings` (
    `id`,
    `PatientName`,
    `PatientID`,
    `doctorId`,
    `PaymentStatus`,
    `PaymentDate`,
    `DoctorPhone`,
    `DoctorEmail`,
    `DoctorName`,
    `commissionType`,
    `commissionValue`,
    `TestManagementID`,
    `TestManagementIDs`,
    `Address`,
    `PatientPhoneNo`,
    `status`,
    `lapName`,
    `selectedTests`,
    `remarks`,
    `instrumentsUsed`,
    `testFees`,
    `results`,
    `Authorization`,
    `feedback`,
    `createdAt`,
    `updatedAt`,
    `CorporateID`,
    `selectedPackageID`,
    `TotalFees`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    7,
    'Gangesh  Kumar',
    15,
    1,
    'Paid',
    '2023-10-18',
    8765678976,
    'rajesh@gmail.com',
    'Rajesh NA Kumar',
    '4',
    'B',
    16,
    NULL,
    'Null',
    6543245675,
    'Completed',
    'NA',
    'Calcium, Ultrasound Abdomen',
    'NA',
    '',
    1100.00,
    'pending',
    'Pending',
    NULL,
    '2023-10-18 12:29:47',
    '2023-10-18 12:53:12',
    NULL,
    2,
    NULL,
    NULL,
    0,
    'Diagnostic'
  );
INSERT INTO
  `diagnosticsbookings` (
    `id`,
    `PatientName`,
    `PatientID`,
    `doctorId`,
    `PaymentStatus`,
    `PaymentDate`,
    `DoctorPhone`,
    `DoctorEmail`,
    `DoctorName`,
    `commissionType`,
    `commissionValue`,
    `TestManagementID`,
    `TestManagementIDs`,
    `Address`,
    `PatientPhoneNo`,
    `status`,
    `lapName`,
    `selectedTests`,
    `remarks`,
    `instrumentsUsed`,
    `testFees`,
    `results`,
    `Authorization`,
    `feedback`,
    `createdAt`,
    `updatedAt`,
    `CorporateID`,
    `selectedPackageID`,
    `TotalFees`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    8,
    'Vijay  Kumar',
    29,
    1,
    'Paid',
    '2023-10-18',
    8765678976,
    'rajesh@gmail.com',
    'Rajesh NA Kumar',
    '0',
    'NA',
    5,
    NULL,
    'Null',
    8676654575,
    'Registered',
    '',
    'Calcium, Vitamin D',
    'NA',
    '',
    200.00,
    'pending',
    'Pending',
    NULL,
    '2023-10-18 12:30:41',
    '2023-10-18 13:20:45',
    NULL,
    2,
    NULL,
    NULL,
    0,
    'Diagnostic'
  );
INSERT INTO
  `diagnosticsbookings` (
    `id`,
    `PatientName`,
    `PatientID`,
    `doctorId`,
    `PaymentStatus`,
    `PaymentDate`,
    `DoctorPhone`,
    `DoctorEmail`,
    `DoctorName`,
    `commissionType`,
    `commissionValue`,
    `TestManagementID`,
    `TestManagementIDs`,
    `Address`,
    `PatientPhoneNo`,
    `status`,
    `lapName`,
    `selectedTests`,
    `remarks`,
    `instrumentsUsed`,
    `testFees`,
    `results`,
    `Authorization`,
    `feedback`,
    `createdAt`,
    `updatedAt`,
    `CorporateID`,
    `selectedPackageID`,
    `TotalFees`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    9,
    'hgvb khgjb hb',
    30,
    1,
    'Paid',
    '2023-10-20',
    8765678976,
    'rajesh@gmail.com',
    'Rajesh Kumar',
    '2',
    'A',
    2,
    NULL,
    'Null',
    7654567765,
    'Registered',
    'NA',
    'Tests',
    'NA',
    '',
    2000.00,
    'pending',
    'Pending',
    NULL,
    '2023-10-19 03:57:23',
    '2023-10-19 09:37:08',
    NULL,
    2,
    NULL,
    NULL,
    0,
    'Diagnostic'
  );
INSERT INTO
  `diagnosticsbookings` (
    `id`,
    `PatientName`,
    `PatientID`,
    `doctorId`,
    `PaymentStatus`,
    `PaymentDate`,
    `DoctorPhone`,
    `DoctorEmail`,
    `DoctorName`,
    `commissionType`,
    `commissionValue`,
    `TestManagementID`,
    `TestManagementIDs`,
    `Address`,
    `PatientPhoneNo`,
    `status`,
    `lapName`,
    `selectedTests`,
    `remarks`,
    `instrumentsUsed`,
    `testFees`,
    `results`,
    `Authorization`,
    `feedback`,
    `createdAt`,
    `updatedAt`,
    `CorporateID`,
    `selectedPackageID`,
    `TotalFees`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    10,
    'hgvb khgjb hb',
    30,
    1,
    'Paid',
    '2023-10-19',
    8765678976,
    'rajesh@gmail.com',
    'Rajesh NA Kumar',
    '2',
    'A',
    2,
    NULL,
    'Null',
    7654567765,
    'Registered',
    'NA',
    'Tests',
    'NA',
    '',
    2000.00,
    'pending',
    'Pending',
    NULL,
    '2023-10-19 03:58:04',
    '2023-10-19 03:58:04',
    NULL,
    2,
    NULL,
    NULL,
    0,
    'Diagnostic'
  );
INSERT INTO
  `diagnosticsbookings` (
    `id`,
    `PatientName`,
    `PatientID`,
    `doctorId`,
    `PaymentStatus`,
    `PaymentDate`,
    `DoctorPhone`,
    `DoctorEmail`,
    `DoctorName`,
    `commissionType`,
    `commissionValue`,
    `TestManagementID`,
    `TestManagementIDs`,
    `Address`,
    `PatientPhoneNo`,
    `status`,
    `lapName`,
    `selectedTests`,
    `remarks`,
    `instrumentsUsed`,
    `testFees`,
    `results`,
    `Authorization`,
    `feedback`,
    `createdAt`,
    `updatedAt`,
    `CorporateID`,
    `selectedPackageID`,
    `TotalFees`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    13,
    'Priya  Patel',
    21,
    1,
    'Not-Paid',
    NULL,
    8765678976,
    'rajesh@gmail.com',
    'Rajesh Kumar',
    '4',
    'B',
    3,
    NULL,
    'Null',
    9876543211,
    'Registered',
    'NA',
    'Calcium',
    'NA',
    '',
    100.00,
    'pending',
    'Pending',
    NULL,
    '2023-10-19 05:31:42',
    '2023-10-19 09:36:47',
    'DEF456',
    2,
    NULL,
    NULL,
    0,
    'Diagnostic'
  );
INSERT INTO
  `diagnosticsbookings` (
    `id`,
    `PatientName`,
    `PatientID`,
    `doctorId`,
    `PaymentStatus`,
    `PaymentDate`,
    `DoctorPhone`,
    `DoctorEmail`,
    `DoctorName`,
    `commissionType`,
    `commissionValue`,
    `TestManagementID`,
    `TestManagementIDs`,
    `Address`,
    `PatientPhoneNo`,
    `status`,
    `lapName`,
    `selectedTests`,
    `remarks`,
    `instrumentsUsed`,
    `testFees`,
    `results`,
    `Authorization`,
    `feedback`,
    `createdAt`,
    `updatedAt`,
    `CorporateID`,
    `selectedPackageID`,
    `TotalFees`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    15,
    'Vijay  Kumar',
    29,
    1,
    'Not-Paid',
    NULL,
    8765678976,
    'rajesh@gmail.com',
    'Rajesh Kumar',
    '5',
    'C',
    3,
    NULL,
    'Null',
    8676654575,
    'Registered',
    'NA',
    'Calcium, Phosphorous, Tests',
    'NA',
    '',
    100.00,
    'pending',
    'Pending',
    NULL,
    '2023-10-19 05:32:57',
    '2023-10-19 09:36:38',
    NULL,
    2,
    NULL,
    NULL,
    0,
    'Diagnostic'
  );
INSERT INTO
  `diagnosticsbookings` (
    `id`,
    `PatientName`,
    `PatientID`,
    `doctorId`,
    `PaymentStatus`,
    `PaymentDate`,
    `DoctorPhone`,
    `DoctorEmail`,
    `DoctorName`,
    `commissionType`,
    `commissionValue`,
    `TestManagementID`,
    `TestManagementIDs`,
    `Address`,
    `PatientPhoneNo`,
    `status`,
    `lapName`,
    `selectedTests`,
    `remarks`,
    `instrumentsUsed`,
    `testFees`,
    `results`,
    `Authorization`,
    `feedback`,
    `createdAt`,
    `updatedAt`,
    `CorporateID`,
    `selectedPackageID`,
    `TotalFees`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    16,
    'jhbjh bjhb jh',
    31,
    1,
    'Paid',
    '2023-10-20',
    8765678976,
    'rajesh@gmail.com',
    'Rajesh Kumar',
    '2',
    'A',
    2,
    NULL,
    'Null',
    8756787656,
    'Registered',
    'NA',
    'Tests, Phosphorous, Tests',
    'NA',
    '',
    2900.00,
    'pending',
    'Pending',
    NULL,
    '2023-10-19 06:03:07',
    '2023-10-19 09:36:35',
    NULL,
    2,
    NULL,
    NULL,
    0,
    'Diagnostic'
  );
INSERT INTO
  `diagnosticsbookings` (
    `id`,
    `PatientName`,
    `PatientID`,
    `doctorId`,
    `PaymentStatus`,
    `PaymentDate`,
    `DoctorPhone`,
    `DoctorEmail`,
    `DoctorName`,
    `commissionType`,
    `commissionValue`,
    `TestManagementID`,
    `TestManagementIDs`,
    `Address`,
    `PatientPhoneNo`,
    `status`,
    `lapName`,
    `selectedTests`,
    `remarks`,
    `instrumentsUsed`,
    `testFees`,
    `results`,
    `Authorization`,
    `feedback`,
    `createdAt`,
    `updatedAt`,
    `CorporateID`,
    `selectedPackageID`,
    `TotalFees`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    17,
    'MR Rajesh Kumar Sharma',
    34,
    1,
    'Paid',
    '2023-10-23',
    8765678976,
    'rajesh@gmail.com',
    'Rajesh Kumar',
    '4',
    'B',
    0,
    NULL,
    'Null',
    9876543210,
    'Registered',
    'NA',
    'Uric Acid, Ultrasound Abdomen',
    'NA',
    '',
    1200.00,
    'pending',
    'Pending',
    NULL,
    '2023-10-23 09:17:09',
    '2023-10-23 09:17:09',
    'ABC123',
    NULL,
    NULL,
    NULL,
    0,
    'Diagnostic'
  );
INSERT INTO
  `diagnosticsbookings` (
    `id`,
    `PatientName`,
    `PatientID`,
    `doctorId`,
    `PaymentStatus`,
    `PaymentDate`,
    `DoctorPhone`,
    `DoctorEmail`,
    `DoctorName`,
    `commissionType`,
    `commissionValue`,
    `TestManagementID`,
    `TestManagementIDs`,
    `Address`,
    `PatientPhoneNo`,
    `status`,
    `lapName`,
    `selectedTests`,
    `remarks`,
    `instrumentsUsed`,
    `testFees`,
    `results`,
    `Authorization`,
    `feedback`,
    `createdAt`,
    `updatedAt`,
    `CorporateID`,
    `selectedPackageID`,
    `TotalFees`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    18,
    'Mrs Priya  Patel',
    35,
    1,
    'Paid',
    '2023-10-25',
    8765678976,
    'rajesh@gmail.com',
    'Rajesh Kumar',
    '4',
    'B',
    0,
    NULL,
    'Null',
    9876543211,
    'Registered',
    'NA',
    'Calcium, Vitamin D',
    'NA',
    '',
    200.00,
    'pending',
    'Pending',
    NULL,
    '2023-10-24 16:14:39',
    '2023-10-24 16:14:39',
    'DEF456',
    NULL,
    NULL,
    NULL,
    0,
    'Diagnostic'
  );
INSERT INTO
  `diagnosticsbookings` (
    `id`,
    `PatientName`,
    `PatientID`,
    `doctorId`,
    `PaymentStatus`,
    `PaymentDate`,
    `DoctorPhone`,
    `DoctorEmail`,
    `DoctorName`,
    `commissionType`,
    `commissionValue`,
    `TestManagementID`,
    `TestManagementIDs`,
    `Address`,
    `PatientPhoneNo`,
    `status`,
    `lapName`,
    `selectedTests`,
    `remarks`,
    `instrumentsUsed`,
    `testFees`,
    `results`,
    `Authorization`,
    `feedback`,
    `createdAt`,
    `updatedAt`,
    `CorporateID`,
    `selectedPackageID`,
    `TotalFees`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    19,
    'Mrs Priya  Patel',
    35,
    1,
    'Paid',
    '2023-10-25',
    8765678976,
    'rajesh@gmail.com',
    'Rajesh Kumar',
    '4',
    'B',
    0,
    NULL,
    'Null',
    9876543211,
    'Completed',
    'NA',
    'Calcium, Vitamin D',
    'NA',
    '',
    200.00,
    'pending',
    'Pending',
    NULL,
    '2023-10-24 16:19:03',
    '2023-10-24 16:51:23',
    'DEF456',
    0,
    NULL,
    NULL,
    0,
    'Diagnostic'
  );
INSERT INTO
  `diagnosticsbookings` (
    `id`,
    `PatientName`,
    `PatientID`,
    `doctorId`,
    `PaymentStatus`,
    `PaymentDate`,
    `DoctorPhone`,
    `DoctorEmail`,
    `DoctorName`,
    `commissionType`,
    `commissionValue`,
    `TestManagementID`,
    `TestManagementIDs`,
    `Address`,
    `PatientPhoneNo`,
    `status`,
    `lapName`,
    `selectedTests`,
    `remarks`,
    `instrumentsUsed`,
    `testFees`,
    `results`,
    `Authorization`,
    `feedback`,
    `createdAt`,
    `updatedAt`,
    `CorporateID`,
    `selectedPackageID`,
    `TotalFees`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    20,
    'Mr Deepak  Singh',
    36,
    1,
    'Paid',
    '2023-10-30',
    8765678976,
    'rajesh@gmail.com',
    'Rajesh Kumar',
    '4',
    'B',
    3,
    NULL,
    'Null',
    9876543212,
    'Registered',
    'NA',
    'Calcium',
    'NA',
    '',
    4600.00,
    'pending',
    'Pending',
    NULL,
    '2023-10-30 09:04:15',
    '2023-10-30 11:33:24',
    'GHI789',
    3,
    NULL,
    NULL,
    0,
    'Diagnostic'
  );
INSERT INTO
  `diagnosticsbookings` (
    `id`,
    `PatientName`,
    `PatientID`,
    `doctorId`,
    `PaymentStatus`,
    `PaymentDate`,
    `DoctorPhone`,
    `DoctorEmail`,
    `DoctorName`,
    `commissionType`,
    `commissionValue`,
    `TestManagementID`,
    `TestManagementIDs`,
    `Address`,
    `PatientPhoneNo`,
    `status`,
    `lapName`,
    `selectedTests`,
    `remarks`,
    `instrumentsUsed`,
    `testFees`,
    `results`,
    `Authorization`,
    `feedback`,
    `createdAt`,
    `updatedAt`,
    `CorporateID`,
    `selectedPackageID`,
    `TotalFees`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    21,
    'Mr Deepak  Singh',
    36,
    0,
    'Paid',
    '2023-11-06',
    0,
    NULL,
    'NA NA',
    '2',
    'A',
    5,
    NULL,
    'Null',
    9876543212,
    'Registered',
    'NA',
    'Vitamin D, Creatinine, Brain MRI Scan, Brain CT Scan, Chest CT Scan, Ultrasound Abdomen',
    'NA',
    '',
    3700.00,
    'pending',
    'Pending',
    NULL,
    '2023-11-06 12:45:22',
    '2023-11-06 12:45:22',
    'GHI789',
    3,
    NULL,
    NULL,
    0,
    'Diagnostic'
  );
INSERT INTO
  `diagnosticsbookings` (
    `id`,
    `PatientName`,
    `PatientID`,
    `doctorId`,
    `PaymentStatus`,
    `PaymentDate`,
    `DoctorPhone`,
    `DoctorEmail`,
    `DoctorName`,
    `commissionType`,
    `commissionValue`,
    `TestManagementID`,
    `TestManagementIDs`,
    `Address`,
    `PatientPhoneNo`,
    `status`,
    `lapName`,
    `selectedTests`,
    `remarks`,
    `instrumentsUsed`,
    `testFees`,
    `results`,
    `Authorization`,
    `feedback`,
    `createdAt`,
    `updatedAt`,
    `CorporateID`,
    `selectedPackageID`,
    `TotalFees`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    22,
    'Mrs Priya  Patel',
    35,
    1,
    'Not-Paid',
    '2000-01-01',
    8765678976,
    'rajesh@gmail.com',
    'Rajesh Kumar',
    '2',
    'A',
    5,
    NULL,
    'Null',
    9876543211,
    'Registered',
    '',
    'Vitamin D, Creatinine, Brain MRI Scan, Brain CT Scan, Chest CT Scan, Ultrasound Abdomen',
    'NA',
    '',
    3600.00,
    'pending',
    'Pending',
    NULL,
    '2023-11-06 12:46:10',
    '2023-11-06 12:46:10',
    'DEF456',
    3,
    NULL,
    NULL,
    0,
    'Diagnostic'
  );
INSERT INTO
  `diagnosticsbookings` (
    `id`,
    `PatientName`,
    `PatientID`,
    `doctorId`,
    `PaymentStatus`,
    `PaymentDate`,
    `DoctorPhone`,
    `DoctorEmail`,
    `DoctorName`,
    `commissionType`,
    `commissionValue`,
    `TestManagementID`,
    `TestManagementIDs`,
    `Address`,
    `PatientPhoneNo`,
    `status`,
    `lapName`,
    `selectedTests`,
    `remarks`,
    `instrumentsUsed`,
    `testFees`,
    `results`,
    `Authorization`,
    `feedback`,
    `createdAt`,
    `updatedAt`,
    `CorporateID`,
    `selectedPackageID`,
    `TotalFees`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    23,
    'Mr Deepak  Singh',
    36,
    1,
    'Not-Paid',
    '2000-01-01',
    8765678976,
    'rajesh@gmail.com',
    'Rajesh Kumar',
    '2',
    'A',
    4,
    NULL,
    'Null',
    9876543212,
    'Registered',
    '',
    'Phosphorous',
    'hjhbhhj',
    '',
    200.00,
    'pending',
    'Pending',
    NULL,
    '2023-11-06 13:07:20',
    '2023-11-06 13:07:20',
    'GHI789',
    0,
    NULL,
    NULL,
    0,
    'Diagnostic'
  );
INSERT INTO
  `diagnosticsbookings` (
    `id`,
    `PatientName`,
    `PatientID`,
    `doctorId`,
    `PaymentStatus`,
    `PaymentDate`,
    `DoctorPhone`,
    `DoctorEmail`,
    `DoctorName`,
    `commissionType`,
    `commissionValue`,
    `TestManagementID`,
    `TestManagementIDs`,
    `Address`,
    `PatientPhoneNo`,
    `status`,
    `lapName`,
    `selectedTests`,
    `remarks`,
    `instrumentsUsed`,
    `testFees`,
    `results`,
    `Authorization`,
    `feedback`,
    `createdAt`,
    `updatedAt`,
    `CorporateID`,
    `selectedPackageID`,
    `TotalFees`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    24,
    'Mr Deepak  Singh',
    36,
    1,
    'Paid',
    '2023-11-07',
    8765678976,
    'rajesh@gmail.com',
    'Rajesh Kumar',
    '4',
    'B',
    3,
    NULL,
    'Null',
    9876543212,
    'Registered',
    'NA',
    'Calcium, Creatinine, Brain MRI Scan, Brain CT Scan, Chest CT Scan, Ultrasound Abdomen',
    'NA',
    '',
    4600.00,
    'pending',
    'Pending',
    NULL,
    '2023-11-07 06:18:23',
    '2023-11-07 06:18:23',
    'GHI789',
    3,
    NULL,
    NULL,
    0,
    'Diagnostic'
  );
INSERT INTO
  `diagnosticsbookings` (
    `id`,
    `PatientName`,
    `PatientID`,
    `doctorId`,
    `PaymentStatus`,
    `PaymentDate`,
    `DoctorPhone`,
    `DoctorEmail`,
    `DoctorName`,
    `commissionType`,
    `commissionValue`,
    `TestManagementID`,
    `TestManagementIDs`,
    `Address`,
    `PatientPhoneNo`,
    `status`,
    `lapName`,
    `selectedTests`,
    `remarks`,
    `instrumentsUsed`,
    `testFees`,
    `results`,
    `Authorization`,
    `feedback`,
    `createdAt`,
    `updatedAt`,
    `CorporateID`,
    `selectedPackageID`,
    `TotalFees`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    25,
    'Mr Nitesh D Giri',
    40,
    1,
    'Paid',
    '2024-02-03',
    8765678976,
    'rajesh@gmail.com',
    'Rajesh Kumar',
    '2',
    'A',
    4,
    NULL,
    'Null',
    7876598397,
    'Registered',
    'NA',
    'Phosphorous, Urea',
    'NA',
    '',
    290.00,
    'pending',
    'Pending',
    NULL,
    '2024-01-10 16:59:33',
    '2024-01-10 16:59:33',
    NULL,
    1,
    NULL,
    NULL,
    0,
    'Diagnostic'
  );
INSERT INTO
  `diagnosticsbookings` (
    `id`,
    `PatientName`,
    `PatientID`,
    `doctorId`,
    `PaymentStatus`,
    `PaymentDate`,
    `DoctorPhone`,
    `DoctorEmail`,
    `DoctorName`,
    `commissionType`,
    `commissionValue`,
    `TestManagementID`,
    `TestManagementIDs`,
    `Address`,
    `PatientPhoneNo`,
    `status`,
    `lapName`,
    `selectedTests`,
    `remarks`,
    `instrumentsUsed`,
    `testFees`,
    `results`,
    `Authorization`,
    `feedback`,
    `createdAt`,
    `updatedAt`,
    `CorporateID`,
    `selectedPackageID`,
    `TotalFees`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    26,
    'Mrs Jai D Kumar',
    39,
    2,
    'Paid',
    '2024-01-13',
    8774447568,
    'sandeep02@gmail.com',
    'Sandeep Sharma',
    '2',
    'A',
    4,
    NULL,
    'Null',
    9394687462,
    'Completed',
    'NA',
    'Phosphorous',
    'NA',
    '',
    200.00,
    'pending',
    'Pending',
    NULL,
    '2024-01-13 10:18:39',
    '2024-01-14 12:02:04',
    NULL,
    0,
    16582.00,
    'INR',
    0,
    'Diagnostic'
  );
INSERT INTO
  `diagnosticsbookings` (
    `id`,
    `PatientName`,
    `PatientID`,
    `doctorId`,
    `PaymentStatus`,
    `PaymentDate`,
    `DoctorPhone`,
    `DoctorEmail`,
    `DoctorName`,
    `commissionType`,
    `commissionValue`,
    `TestManagementID`,
    `TestManagementIDs`,
    `Address`,
    `PatientPhoneNo`,
    `status`,
    `lapName`,
    `selectedTests`,
    `remarks`,
    `instrumentsUsed`,
    `testFees`,
    `results`,
    `Authorization`,
    `feedback`,
    `createdAt`,
    `updatedAt`,
    `CorporateID`,
    `selectedPackageID`,
    `TotalFees`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    29,
    'Mrs Jai D Kumar',
    39,
    2,
    'Not-Paid',
    '2000-01-01',
    8774447568,
    'sandeep02@gmail.com',
    'Sandeep Sharma',
    '2',
    'A',
    4,
    NULL,
    'Null',
    9394687462,
    'Registered',
    '',
    'Phosphorous',
    'NA',
    '',
    200.00,
    'pending',
    'Pending',
    NULL,
    '2024-01-13 10:22:58',
    '2024-01-13 10:22:58',
    NULL,
    NULL,
    1.00,
    'USD',
    0,
    'Diagnostic'
  );
INSERT INTO
  `diagnosticsbookings` (
    `id`,
    `PatientName`,
    `PatientID`,
    `doctorId`,
    `PaymentStatus`,
    `PaymentDate`,
    `DoctorPhone`,
    `DoctorEmail`,
    `DoctorName`,
    `commissionType`,
    `commissionValue`,
    `TestManagementID`,
    `TestManagementIDs`,
    `Address`,
    `PatientPhoneNo`,
    `status`,
    `lapName`,
    `selectedTests`,
    `remarks`,
    `instrumentsUsed`,
    `testFees`,
    `results`,
    `Authorization`,
    `feedback`,
    `createdAt`,
    `updatedAt`,
    `CorporateID`,
    `selectedPackageID`,
    `TotalFees`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    30,
    'Mrs Nitesh D Giri',
    38,
    2,
    'Paid',
    '2024-01-13',
    8774447568,
    'sandeep02@gmail.com',
    'Sandeep Sharma',
    '2',
    'A',
    5,
    NULL,
    'Null',
    9394687467,
    'Registered',
    'NA',
    'Vitamin D',
    'NA',
    '',
    100.00,
    'pending',
    'Approved',
    'NA',
    '2024-01-13 10:24:05',
    '2024-01-14 16:59:16',
    NULL,
    NULL,
    8291.00,
    'INR',
    0,
    'Diagnostic'
  );
INSERT INTO
  `diagnosticsbookings` (
    `id`,
    `PatientName`,
    `PatientID`,
    `doctorId`,
    `PaymentStatus`,
    `PaymentDate`,
    `DoctorPhone`,
    `DoctorEmail`,
    `DoctorName`,
    `commissionType`,
    `commissionValue`,
    `TestManagementID`,
    `TestManagementIDs`,
    `Address`,
    `PatientPhoneNo`,
    `status`,
    `lapName`,
    `selectedTests`,
    `remarks`,
    `instrumentsUsed`,
    `testFees`,
    `results`,
    `Authorization`,
    `feedback`,
    `createdAt`,
    `updatedAt`,
    `CorporateID`,
    `selectedPackageID`,
    `TotalFees`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    31,
    'Mr Deepak  Singh',
    36,
    1,
    'Paid',
    '2024-01-28',
    8765678976,
    'rajesh@gmail.com',
    'Rajesh Kumar',
    '2',
    'A',
    5,
    NULL,
    'Null',
    9876543212,
    'Completed',
    'NA',
    'Vitamin D',
    'NA',
    '',
    100.00,
    'pending',
    'Approved',
    'fdht',
    '2024-01-14 18:33:54',
    '2024-01-28 13:18:05',
    'GHI789',
    NULL,
    100.00,
    'USD',
    0,
    'Diagnostic'
  );
INSERT INTO
  `diagnosticsbookings` (
    `id`,
    `PatientName`,
    `PatientID`,
    `doctorId`,
    `PaymentStatus`,
    `PaymentDate`,
    `DoctorPhone`,
    `DoctorEmail`,
    `DoctorName`,
    `commissionType`,
    `commissionValue`,
    `TestManagementID`,
    `TestManagementIDs`,
    `Address`,
    `PatientPhoneNo`,
    `status`,
    `lapName`,
    `selectedTests`,
    `remarks`,
    `instrumentsUsed`,
    `testFees`,
    `results`,
    `Authorization`,
    `feedback`,
    `createdAt`,
    `updatedAt`,
    `CorporateID`,
    `selectedPackageID`,
    `TotalFees`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    32,
    'Mr Deepak  Singh',
    36,
    2,
    'Paid',
    '2024-01-15',
    8774447568,
    'sandeep02@gmail.com',
    'Sandeep Sharma',
    '2',
    'A',
    4,
    NULL,
    'Null',
    9876543212,
    'Registered',
    'NA',
    'Phosphorous',
    'NA',
    '',
    200.00,
    'pending',
    'Pending',
    NULL,
    '2024-01-15 03:25:17',
    '2024-01-15 03:25:17',
    'GHI789',
    NULL,
    182.60,
    'EUR',
    0,
    'Diagnostic'
  );
INSERT INTO
  `diagnosticsbookings` (
    `id`,
    `PatientName`,
    `PatientID`,
    `doctorId`,
    `PaymentStatus`,
    `PaymentDate`,
    `DoctorPhone`,
    `DoctorEmail`,
    `DoctorName`,
    `commissionType`,
    `commissionValue`,
    `TestManagementID`,
    `TestManagementIDs`,
    `Address`,
    `PatientPhoneNo`,
    `status`,
    `lapName`,
    `selectedTests`,
    `remarks`,
    `instrumentsUsed`,
    `testFees`,
    `results`,
    `Authorization`,
    `feedback`,
    `createdAt`,
    `updatedAt`,
    `CorporateID`,
    `selectedPackageID`,
    `TotalFees`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    33,
    'Mrs Vijaya  Kumari',
    41,
    2,
    'Paid',
    '2024-01-28',
    8774447568,
    'sandeep02@gmail.com',
    'Sandeep Sharma',
    '2',
    'A',
    5,
    NULL,
    'Null',
    7684659836,
    'Registered',
    '',
    'Vitamin D',
    'NA',
    '',
    100.00,
    'pending',
    'Pending',
    NULL,
    '2024-01-28 04:36:16',
    '2024-01-28 04:36:16',
    NULL,
    NULL,
    100.00,
    'USD',
    3,
    'Diagnostic'
  );
INSERT INTO
  `diagnosticsbookings` (
    `id`,
    `PatientName`,
    `PatientID`,
    `doctorId`,
    `PaymentStatus`,
    `PaymentDate`,
    `DoctorPhone`,
    `DoctorEmail`,
    `DoctorName`,
    `commissionType`,
    `commissionValue`,
    `TestManagementID`,
    `TestManagementIDs`,
    `Address`,
    `PatientPhoneNo`,
    `status`,
    `lapName`,
    `selectedTests`,
    `remarks`,
    `instrumentsUsed`,
    `testFees`,
    `results`,
    `Authorization`,
    `feedback`,
    `createdAt`,
    `updatedAt`,
    `CorporateID`,
    `selectedPackageID`,
    `TotalFees`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    37,
    'Mrs Jai D Kumar',
    39,
    1,
    'Paid',
    '2024-02-03',
    8765678976,
    'rajesh@gmail.com',
    'Rajesh Kumar',
    '2',
    'A',
    0,
    NULL,
    'Null',
    9394687462,
    'Registered',
    'NA',
    'Creatinine, Brain MRI Scan, Brain CT Scan, Chest CT Scan, Ultrasound Abdomen',
    'NA',
    '',
    0.00,
    'pending',
    'Pending',
    NULL,
    '2024-02-03 17:31:14',
    '2024-02-03 17:31:14',
    NULL,
    3,
    3330.00,
    'EUR',
    0,
    'Diagnostic'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: diagnostictestlists
# ------------------------------------------------------------

INSERT INTO
  `diagnostictestlists` (
    `id`,
    `testName`,
    `code`,
    `description`,
    `category`,
    `testPrice`,
    `createdAt`,
    `updatedAt`,
    `LabCategoryName`,
    `LabCategoryNameID`,
    `SpecimenName`,
    `SpecimenNameID`,
    `Currency`
  )
VALUES
  (
    3,
    'Calcium',
    'CAL01',
    'Calcium test',
    'Bone',
    1000,
    '2023-10-03 10:13:45',
    '2023-10-26 17:08:57',
    '',
    0,
    '',
    0,
    'NA'
  );
INSERT INTO
  `diagnostictestlists` (
    `id`,
    `testName`,
    `code`,
    `description`,
    `category`,
    `testPrice`,
    `createdAt`,
    `updatedAt`,
    `LabCategoryName`,
    `LabCategoryNameID`,
    `SpecimenName`,
    `SpecimenNameID`,
    `Currency`
  )
VALUES
  (
    4,
    'Phosphorous',
    'PS01',
    'Phosphorous Test',
    'Bone',
    200,
    '2023-10-03 10:14:23',
    '2023-10-03 10:14:23',
    '',
    0,
    '',
    0,
    'NA'
  );
INSERT INTO
  `diagnostictestlists` (
    `id`,
    `testName`,
    `code`,
    `description`,
    `category`,
    `testPrice`,
    `createdAt`,
    `updatedAt`,
    `LabCategoryName`,
    `LabCategoryNameID`,
    `SpecimenName`,
    `SpecimenNameID`,
    `Currency`
  )
VALUES
  (
    5,
    'Vitamin D',
    'VT01',
    'Vitamin D',
    'Vitamin',
    100,
    '2023-10-03 10:22:41',
    '2023-10-03 10:22:41',
    '',
    0,
    '',
    0,
    'NA'
  );
INSERT INTO
  `diagnostictestlists` (
    `id`,
    `testName`,
    `code`,
    `description`,
    `category`,
    `testPrice`,
    `createdAt`,
    `updatedAt`,
    `LabCategoryName`,
    `LabCategoryNameID`,
    `SpecimenName`,
    `SpecimenNameID`,
    `Currency`
  )
VALUES
  (
    6,
    'Creatinine',
    'CR01',
    'Creatinine Test',
    'Kidney',
    200,
    '2023-10-03 10:23:17',
    '2023-10-03 10:23:17',
    '',
    0,
    '',
    0,
    'NA'
  );
INSERT INTO
  `diagnostictestlists` (
    `id`,
    `testName`,
    `code`,
    `description`,
    `category`,
    `testPrice`,
    `createdAt`,
    `updatedAt`,
    `LabCategoryName`,
    `LabCategoryNameID`,
    `SpecimenName`,
    `SpecimenNameID`,
    `Currency`
  )
VALUES
  (
    7,
    'Uric Acid',
    'UA01',
    'Uric Acid Test',
    'Kidney',
    200,
    '2023-10-03 10:23:53',
    '2023-10-03 10:23:53',
    '',
    0,
    '',
    0,
    'NA'
  );
INSERT INTO
  `diagnostictestlists` (
    `id`,
    `testName`,
    `code`,
    `description`,
    `category`,
    `testPrice`,
    `createdAt`,
    `updatedAt`,
    `LabCategoryName`,
    `LabCategoryNameID`,
    `SpecimenName`,
    `SpecimenNameID`,
    `Currency`
  )
VALUES
  (
    8,
    'Urea',
    'UR02',
    'Urea Test',
    'Vitals',
    151,
    '2023-10-03 10:24:26',
    '2023-10-04 12:22:36',
    '',
    0,
    '',
    0,
    'NA'
  );
INSERT INTO
  `diagnostictestlists` (
    `id`,
    `testName`,
    `code`,
    `description`,
    `category`,
    `testPrice`,
    `createdAt`,
    `updatedAt`,
    `LabCategoryName`,
    `LabCategoryNameID`,
    `SpecimenName`,
    `SpecimenNameID`,
    `Currency`
  )
VALUES
  (
    9,
    'Brain MRI Scan',
    'BS',
    ' Brain MRI Scan',
    'Scan',
    200,
    '2023-10-04 06:41:07',
    '2023-10-12 05:29:22',
    '',
    0,
    '',
    0,
    'NA'
  );
INSERT INTO
  `diagnostictestlists` (
    `id`,
    `testName`,
    `code`,
    `description`,
    `category`,
    `testPrice`,
    `createdAt`,
    `updatedAt`,
    `LabCategoryName`,
    `LabCategoryNameID`,
    `SpecimenName`,
    `SpecimenNameID`,
    `Currency`
  )
VALUES
  (
    15,
    'Chest CT Scan',
    'CT02',
    'Chest CT Scan',
    'Scan',
    200,
    '2023-10-04 06:43:02',
    '2023-10-04 06:43:02',
    '',
    0,
    '',
    0,
    'NA'
  );
INSERT INTO
  `diagnostictestlists` (
    `id`,
    `testName`,
    `code`,
    `description`,
    `category`,
    `testPrice`,
    `createdAt`,
    `updatedAt`,
    `LabCategoryName`,
    `LabCategoryNameID`,
    `SpecimenName`,
    `SpecimenNameID`,
    `Currency`
  )
VALUES
  (
    16,
    'Ultrasound Abdomen',
    'USG01',
    'NA',
    'Abdomen',
    1000,
    '2023-10-10 03:43:00',
    '2023-10-10 03:43:00',
    '',
    0,
    '',
    0,
    'NA'
  );
INSERT INTO
  `diagnostictestlists` (
    `id`,
    `testName`,
    `code`,
    `description`,
    `category`,
    `testPrice`,
    `createdAt`,
    `updatedAt`,
    `LabCategoryName`,
    `LabCategoryNameID`,
    `SpecimenName`,
    `SpecimenNameID`,
    `Currency`
  )
VALUES
  (
    17,
    'newTest',
    'TS',
    'NA',
    'Vitals',
    100,
    '2023-10-12 09:58:55',
    '2023-11-09 08:43:12',
    'Hematology',
    4,
    'Blood',
    1,
    'NA'
  );
INSERT INTO
  `diagnostictestlists` (
    `id`,
    `testName`,
    `code`,
    `description`,
    `category`,
    `testPrice`,
    `createdAt`,
    `updatedAt`,
    `LabCategoryName`,
    `LabCategoryNameID`,
    `SpecimenName`,
    `SpecimenNameID`,
    `Currency`
  )
VALUES
  (
    18,
    'new11',
    'new11',
    'NA',
    'Scan',
    1000,
    '2023-11-09 08:31:47',
    '2023-11-09 08:31:47',
    'Biochemistry',
    1,
    'Blood',
    1,
    'NA'
  );
INSERT INTO
  `diagnostictestlists` (
    `id`,
    `testName`,
    `code`,
    `description`,
    `category`,
    `testPrice`,
    `createdAt`,
    `updatedAt`,
    `LabCategoryName`,
    `LabCategoryNameID`,
    `SpecimenName`,
    `SpecimenNameID`,
    `Currency`
  )
VALUES
  (
    19,
    'NEw19',
    'newq19',
    'NA',
    'Vitals',
    1000,
    '2023-11-09 08:38:53',
    '2024-01-28 03:31:39',
    'Biochemistry',
    1,
    'Blood',
    1,
    'USD'
  );
INSERT INTO
  `diagnostictestlists` (
    `id`,
    `testName`,
    `code`,
    `description`,
    `category`,
    `testPrice`,
    `createdAt`,
    `updatedAt`,
    `LabCategoryName`,
    `LabCategoryNameID`,
    `SpecimenName`,
    `SpecimenNameID`,
    `Currency`
  )
VALUES
  (
    20,
    'NAn',
    'hjbhjb',
    'NA',
    'Vitals',
    190,
    '2024-01-13 08:13:18',
    '2024-01-13 08:13:17',
    'Hematology',
    4,
    'Biopsy',
    3,
    'USD'
  );
INSERT INTO
  `diagnostictestlists` (
    `id`,
    `testName`,
    `code`,
    `description`,
    `category`,
    `testPrice`,
    `createdAt`,
    `updatedAt`,
    `LabCategoryName`,
    `LabCategoryNameID`,
    `SpecimenName`,
    `SpecimenNameID`,
    `Currency`
  )
VALUES
  (
    21,
    'calcium',
    'ts10',
    'NA',
    'Pancreas',
    100,
    '2024-01-31 16:18:27',
    '2024-01-31 16:18:27',
    'Biochemistry',
    1,
    'NA',
    0,
    'USD'
  );
INSERT INTO
  `diagnostictestlists` (
    `id`,
    `testName`,
    `code`,
    `description`,
    `category`,
    `testPrice`,
    `createdAt`,
    `updatedAt`,
    `LabCategoryName`,
    `LabCategoryNameID`,
    `SpecimenName`,
    `SpecimenNameID`,
    `Currency`
  )
VALUES
  (
    22,
    'Calcium',
    'nbm',
    'NA',
    'Thyroid',
    100,
    '2024-01-31 16:19:08',
    '2024-01-31 16:19:08',
    'Biochemistry',
    1,
    'NA',
    0,
    'USD'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: diagnostictestresultimages
# ------------------------------------------------------------

INSERT INTO
  `diagnostictestresultimages` (
    `id`,
    `testBookingID`,
    `testName`,
    `testType`,
    `imagePath`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    5,
    '11',
    'testName',
    'testType',
    'uploads\\images-1696927997281-698571532.jfif',
    '2023-10-10 08:53:17',
    '2023-10-10 08:53:17'
  );
INSERT INTO
  `diagnostictestresultimages` (
    `id`,
    `testBookingID`,
    `testName`,
    `testType`,
    `imagePath`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    6,
    '11',
    'testName',
    'testType',
    'uploads\\images-1696927997285-431658264.jpg',
    '2023-10-10 08:53:17',
    '2023-10-10 08:53:17'
  );
INSERT INTO
  `diagnostictestresultimages` (
    `id`,
    `testBookingID`,
    `testName`,
    `testType`,
    `imagePath`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    7,
    '11',
    'testName',
    'testType',
    'uploads\\images-1696928111286-980960268.png',
    '2023-10-10 08:55:11',
    '2023-10-10 08:55:11'
  );
INSERT INTO
  `diagnostictestresultimages` (
    `id`,
    `testBookingID`,
    `testName`,
    `testType`,
    `imagePath`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    8,
    '11',
    'testName',
    'testType',
    'uploads\\images-1696928111286-85314810.jpg',
    '2023-10-10 08:55:11',
    '2023-10-10 08:55:11'
  );
INSERT INTO
  `diagnostictestresultimages` (
    `id`,
    `testBookingID`,
    `testName`,
    `testType`,
    `imagePath`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    9,
    '11',
    'testName',
    'testType',
    'uploads\\images-1696930873824-825951727.jfif',
    '2023-10-10 09:41:13',
    '2023-10-10 09:41:13'
  );
INSERT INTO
  `diagnostictestresultimages` (
    `id`,
    `testBookingID`,
    `testName`,
    `testType`,
    `imagePath`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    12,
    '1',
    ' Tests',
    'testType',
    'uploads\\images-1697044222666-66262775.png',
    '2023-10-11 17:10:22',
    '2023-10-11 17:10:22'
  );
INSERT INTO
  `diagnostictestresultimages` (
    `id`,
    `testBookingID`,
    `testName`,
    `testType`,
    `imagePath`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    14,
    '1',
    ' Tests',
    'testType',
    'uploads\\images-1697045370288-527542047.png',
    '2023-10-11 17:29:30',
    '2023-10-11 17:29:30'
  );
INSERT INTO
  `diagnostictestresultimages` (
    `id`,
    `testBookingID`,
    `testName`,
    `testType`,
    `imagePath`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    15,
    '1',
    ' Tests',
    'testType',
    'uploads\\images-1697045675314-232098373.jfif',
    '2023-10-11 17:34:35',
    '2023-10-11 17:34:35'
  );
INSERT INTO
  `diagnostictestresultimages` (
    `id`,
    `testBookingID`,
    `testName`,
    `testType`,
    `imagePath`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    16,
    '1',
    ' Vitamin D',
    'testType',
    'uploads\\images-1697080217604-70265449.jpg',
    '2023-10-12 03:10:17',
    '2023-10-12 03:10:17'
  );
INSERT INTO
  `diagnostictestresultimages` (
    `id`,
    `testBookingID`,
    `testName`,
    `testType`,
    `imagePath`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    17,
    '1',
    ' Vitamin D',
    'testType',
    'uploads\\images-1697080217608-75429733.jpg',
    '2023-10-12 03:10:17',
    '2023-10-12 03:10:17'
  );
INSERT INTO
  `diagnostictestresultimages` (
    `id`,
    `testBookingID`,
    `testName`,
    `testType`,
    `imagePath`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    18,
    '1',
    ' Urea',
    'testType',
    'uploads\\images-1697081563096-919302901.jpg',
    '2023-10-12 03:32:43',
    '2023-10-12 03:32:43'
  );
INSERT INTO
  `diagnostictestresultimages` (
    `id`,
    `testBookingID`,
    `testName`,
    `testType`,
    `imagePath`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    19,
    '1',
    ' Urea',
    'testType',
    'uploads\\images-1697081628575-170547621.jpg',
    '2023-10-12 03:33:48',
    '2023-10-12 03:33:48'
  );
INSERT INTO
  `diagnostictestresultimages` (
    `id`,
    `testBookingID`,
    `testName`,
    `testType`,
    `imagePath`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    20,
    '1',
    'Ultrasound Abdomen',
    'testType',
    'uploads\\images-1697081665857-447235191.png',
    '2023-10-12 03:34:25',
    '2023-10-12 03:34:25'
  );
INSERT INTO
  `diagnostictestresultimages` (
    `id`,
    `testBookingID`,
    `testName`,
    `testType`,
    `imagePath`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    21,
    '2',
    'Calcium',
    'testType',
    'uploads\\images-1697088744891-256498734.jpg',
    '2023-10-12 05:32:24',
    '2023-10-12 05:32:24'
  );
INSERT INTO
  `diagnostictestresultimages` (
    `id`,
    `testBookingID`,
    `testName`,
    `testType`,
    `imagePath`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    22,
    '2',
    ' Vitamin D',
    'testType',
    'uploads\\images-1697088773637-423985348.jfif',
    '2023-10-12 05:32:53',
    '2023-10-12 05:32:53'
  );
INSERT INTO
  `diagnostictestresultimages` (
    `id`,
    `testBookingID`,
    `testName`,
    `testType`,
    `imagePath`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    23,
    '2',
    'Vitamin D',
    'testType',
    'uploads\\images-1697089291801-683019461.png',
    '2023-10-12 05:41:31',
    '2023-10-12 05:41:31'
  );
INSERT INTO
  `diagnostictestresultimages` (
    `id`,
    `testBookingID`,
    `testName`,
    `testType`,
    `imagePath`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    24,
    '2',
    'Vitamin D',
    'testType',
    'uploads\\images-1697089291801-863740578.jfif',
    '2023-10-12 05:41:31',
    '2023-10-12 05:41:31'
  );
INSERT INTO
  `diagnostictestresultimages` (
    `id`,
    `testBookingID`,
    `testName`,
    `testType`,
    `imagePath`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    25,
    '2',
    'Vitamin D',
    'testType',
    'uploads\\images-1697090907240-660874230.png',
    '2023-10-12 06:08:27',
    '2023-10-12 06:08:27'
  );
INSERT INTO
  `diagnostictestresultimages` (
    `id`,
    `testBookingID`,
    `testName`,
    `testType`,
    `imagePath`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    26,
    '1',
    'Ultrasound Abdomen',
    'testType',
    'uploads\\images-1697109051244-633271006.png',
    '2023-10-12 11:10:51',
    '2023-10-12 11:10:51'
  );
INSERT INTO
  `diagnostictestresultimages` (
    `id`,
    `testBookingID`,
    `testName`,
    `testType`,
    `imagePath`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    27,
    '2',
    'Calcium',
    'testType',
    'uploads\\images-1697280640354-291789902.png',
    '2023-10-14 10:50:40',
    '2023-10-14 10:50:40'
  );
INSERT INTO
  `diagnostictestresultimages` (
    `id`,
    `testBookingID`,
    `testName`,
    `testType`,
    `imagePath`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    28,
    '25',
    'Phosphorous',
    'testType',
    'uploads\\images-1704978015275-450065587.png',
    '2024-01-11 13:00:15',
    '2024-01-11 13:00:15'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: diagonosticselectedtestforpackagemodels
# ------------------------------------------------------------

INSERT INTO
  `diagonosticselectedtestforpackagemodels` (
    `id`,
    `TestName`,
    `testType`,
    `category`,
    `TestId`,
    `TestPackageID`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    5,
    'Phosphorous',
    'Pathology',
    'Bone',
    4,
    2,
    '2023-10-15 16:02:20',
    '2023-10-15 16:02:20'
  );
INSERT INTO
  `diagonosticselectedtestforpackagemodels` (
    `id`,
    `TestName`,
    `testType`,
    `category`,
    `TestId`,
    `TestPackageID`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    6,
    'Tests',
    'Pathology',
    'Bone',
    2,
    2,
    '2023-10-15 16:02:20',
    '2023-10-15 16:02:20'
  );
INSERT INTO
  `diagonosticselectedtestforpackagemodels` (
    `id`,
    `TestName`,
    `testType`,
    `category`,
    `TestId`,
    `TestPackageID`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    18,
    'Urea',
    'Pathology',
    'Vitals',
    8,
    1,
    '2024-01-15 17:19:51',
    '2024-01-15 17:19:51'
  );
INSERT INTO
  `diagonosticselectedtestforpackagemodels` (
    `id`,
    `TestName`,
    `testType`,
    `category`,
    `TestId`,
    `TestPackageID`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    19,
    'Calcium',
    'Pathology',
    'Bone',
    3,
    3,
    '2024-02-03 17:30:20',
    '2024-02-03 17:30:20'
  );
INSERT INTO
  `diagonosticselectedtestforpackagemodels` (
    `id`,
    `TestName`,
    `testType`,
    `category`,
    `TestId`,
    `TestPackageID`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    20,
    'Vitamin D',
    'Pathology',
    'Vitamin',
    5,
    3,
    '2024-02-03 17:30:20',
    '2024-02-03 17:30:20'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: dispensedmedicines
# ------------------------------------------------------------

INSERT INTO
  `dispensedmedicines` (
    `id`,
    `PatientName`,
    `patient_Id`,
    `prescription_Id`,
    `DispenseID`,
    `DispenseTableID`,
    `MedicineName`,
    `BatchNumber`,
    `ExpiryDate`,
    `UnitPrice`,
    `Quantity`,
    `EachmedicineCost`,
    `createdAt`,
    `updatedAt`,
    `EachMedicineCurrency`
  )
VALUES
  (
    1,
    'Nitesh Giri',
    0,
    0,
    '20230912133821',
    9,
    'sumo cold',
    'Batch01',
    '2024-10-10 00:00:00',
    5.00,
    10,
    50.00,
    '2023-09-12 08:08:27',
    '2023-09-12 08:08:27',
    NULL
  );
INSERT INTO
  `dispensedmedicines` (
    `id`,
    `PatientName`,
    `patient_Id`,
    `prescription_Id`,
    `DispenseID`,
    `DispenseTableID`,
    `MedicineName`,
    `BatchNumber`,
    `ExpiryDate`,
    `UnitPrice`,
    `Quantity`,
    `EachmedicineCost`,
    `createdAt`,
    `updatedAt`,
    `EachMedicineCurrency`
  )
VALUES
  (
    2,
    'Nitesh Giri',
    0,
    0,
    '20230912133821',
    9,
    'Insulin',
    'BT01',
    '2023-10-08 00:00:00',
    5.00,
    5,
    25.00,
    '2023-09-12 08:08:27',
    '2023-09-12 08:08:27',
    NULL
  );
INSERT INTO
  `dispensedmedicines` (
    `id`,
    `PatientName`,
    `patient_Id`,
    `prescription_Id`,
    `DispenseID`,
    `DispenseTableID`,
    `MedicineName`,
    `BatchNumber`,
    `ExpiryDate`,
    `UnitPrice`,
    `Quantity`,
    `EachmedicineCost`,
    `createdAt`,
    `updatedAt`,
    `EachMedicineCurrency`
  )
VALUES
  (
    3,
    'Nitesh Giri',
    0,
    0,
    '20230912134505',
    10,
    'sumo cold',
    'Batch01',
    '2024-10-10 00:00:00',
    5.00,
    10,
    50.00,
    '2023-09-12 08:15:07',
    '2023-09-12 08:15:07',
    NULL
  );
INSERT INTO
  `dispensedmedicines` (
    `id`,
    `PatientName`,
    `patient_Id`,
    `prescription_Id`,
    `DispenseID`,
    `DispenseTableID`,
    `MedicineName`,
    `BatchNumber`,
    `ExpiryDate`,
    `UnitPrice`,
    `Quantity`,
    `EachmedicineCost`,
    `createdAt`,
    `updatedAt`,
    `EachMedicineCurrency`
  )
VALUES
  (
    4,
    'Nitesh Giri',
    0,
    0,
    '20230912134505',
    10,
    'Insulin',
    'BT01',
    '2023-10-08 00:00:00',
    5.00,
    10,
    50.00,
    '2023-09-12 08:15:07',
    '2023-09-12 08:15:07',
    NULL
  );
INSERT INTO
  `dispensedmedicines` (
    `id`,
    `PatientName`,
    `patient_Id`,
    `prescription_Id`,
    `DispenseID`,
    `DispenseTableID`,
    `MedicineName`,
    `BatchNumber`,
    `ExpiryDate`,
    `UnitPrice`,
    `Quantity`,
    `EachmedicineCost`,
    `createdAt`,
    `updatedAt`,
    `EachMedicineCurrency`
  )
VALUES
  (
    5,
    'nitesh',
    0,
    0,
    '20230912144030',
    11,
    'sumo cold',
    'Batch01',
    '2024-10-10 00:00:00',
    5.00,
    1,
    5.00,
    '2023-09-12 09:10:32',
    '2023-09-12 09:10:32',
    NULL
  );
INSERT INTO
  `dispensedmedicines` (
    `id`,
    `PatientName`,
    `patient_Id`,
    `prescription_Id`,
    `DispenseID`,
    `DispenseTableID`,
    `MedicineName`,
    `BatchNumber`,
    `ExpiryDate`,
    `UnitPrice`,
    `Quantity`,
    `EachmedicineCost`,
    `createdAt`,
    `updatedAt`,
    `EachMedicineCurrency`
  )
VALUES
  (
    6,
    'Mr Vaibhav  Pande',
    6,
    7,
    'P6/20230910/08415420230912144409',
    12,
    'sumo cold',
    'Batch01',
    '2024-10-10 00:00:00',
    5.00,
    1,
    5.00,
    '2023-09-12 09:14:11',
    '2023-09-12 09:14:11',
    NULL
  );
INSERT INTO
  `dispensedmedicines` (
    `id`,
    `PatientName`,
    `patient_Id`,
    `prescription_Id`,
    `DispenseID`,
    `DispenseTableID`,
    `MedicineName`,
    `BatchNumber`,
    `ExpiryDate`,
    `UnitPrice`,
    `Quantity`,
    `EachmedicineCost`,
    `createdAt`,
    `updatedAt`,
    `EachMedicineCurrency`
  )
VALUES
  (
    7,
    'Nitesh Giri',
    0,
    0,
    'DID20230912152041',
    13,
    'sumo cold',
    'Batch01',
    '2024-10-10 00:00:00',
    5.00,
    1,
    5.00,
    '2023-09-12 09:50:43',
    '2023-09-12 09:50:43',
    NULL
  );
INSERT INTO
  `dispensedmedicines` (
    `id`,
    `PatientName`,
    `patient_Id`,
    `prescription_Id`,
    `DispenseID`,
    `DispenseTableID`,
    `MedicineName`,
    `BatchNumber`,
    `ExpiryDate`,
    `UnitPrice`,
    `Quantity`,
    `EachmedicineCost`,
    `createdAt`,
    `updatedAt`,
    `EachMedicineCurrency`
  )
VALUES
  (
    8,
    'Mr Deepak  Singh',
    22,
    2,
    'P22/20231017/13343420231017142251',
    14,
    'Ibuprofen',
    'BT789',
    '2023-12-31 00:00:00',
    15.25,
    1,
    15.25,
    '2023-10-17 08:52:54',
    '2023-10-17 08:52:54',
    NULL
  );
INSERT INTO
  `dispensedmedicines` (
    `id`,
    `PatientName`,
    `patient_Id`,
    `prescription_Id`,
    `DispenseID`,
    `DispenseTableID`,
    `MedicineName`,
    `BatchNumber`,
    `ExpiryDate`,
    `UnitPrice`,
    `Quantity`,
    `EachmedicineCost`,
    `createdAt`,
    `updatedAt`,
    `EachMedicineCurrency`
  )
VALUES
  (
    9,
    'Mrs Asha Kumari Yadav',
    37,
    6,
    'P37/20231024/14242220240110161417',
    15,
    'Sumo Cold',
    'B754653485',
    '2024-03-01 00:00:00',
    6.00,
    10,
    60.00,
    '2024-01-10 10:44:23',
    '2024-01-10 10:44:23',
    NULL
  );
INSERT INTO
  `dispensedmedicines` (
    `id`,
    `PatientName`,
    `patient_Id`,
    `prescription_Id`,
    `DispenseID`,
    `DispenseTableID`,
    `MedicineName`,
    `BatchNumber`,
    `ExpiryDate`,
    `UnitPrice`,
    `Quantity`,
    `EachmedicineCost`,
    `createdAt`,
    `updatedAt`,
    `EachMedicineCurrency`
  )
VALUES
  (
    10,
    'Mrs Asha Kumari Yadav',
    37,
    5,
    'P37/20231024/14222120240110161503',
    16,
    'Sumo Cold',
    'B754653485',
    '2024-03-01 00:00:00',
    6.00,
    6,
    36.00,
    '2024-01-10 10:45:07',
    '2024-01-10 10:45:07',
    NULL
  );
INSERT INTO
  `dispensedmedicines` (
    `id`,
    `PatientName`,
    `patient_Id`,
    `prescription_Id`,
    `DispenseID`,
    `DispenseTableID`,
    `MedicineName`,
    `BatchNumber`,
    `ExpiryDate`,
    `UnitPrice`,
    `Quantity`,
    `EachmedicineCost`,
    `createdAt`,
    `updatedAt`,
    `EachMedicineCurrency`
  )
VALUES
  (
    11,
    'Mrs Asha Kumari Yadav',
    37,
    6,
    'P37/20231024/14242220240114113254',
    17,
    'Tramadol',
    'BT010',
    '2024-06-30 00:00:00',
    22.00,
    1,
    22.00,
    '2024-01-14 06:02:59',
    '2024-01-14 06:02:59',
    NULL
  );
INSERT INTO
  `dispensedmedicines` (
    `id`,
    `PatientName`,
    `patient_Id`,
    `prescription_Id`,
    `DispenseID`,
    `DispenseTableID`,
    `MedicineName`,
    `BatchNumber`,
    `ExpiryDate`,
    `UnitPrice`,
    `Quantity`,
    `EachmedicineCost`,
    `createdAt`,
    `updatedAt`,
    `EachMedicineCurrency`
  )
VALUES
  (
    12,
    'Mr Nitesh D Giri',
    40,
    8,
    'P40/20240112/08445820240114115212',
    18,
    'Tramadol',
    'BT010',
    '2024-06-30 00:00:00',
    22.00,
    1,
    22.00,
    '2024-01-14 06:22:26',
    '2024-01-14 06:22:26',
    NULL
  );
INSERT INTO
  `dispensedmedicines` (
    `id`,
    `PatientName`,
    `patient_Id`,
    `prescription_Id`,
    `DispenseID`,
    `DispenseTableID`,
    `MedicineName`,
    `BatchNumber`,
    `ExpiryDate`,
    `UnitPrice`,
    `Quantity`,
    `EachmedicineCost`,
    `createdAt`,
    `updatedAt`,
    `EachMedicineCurrency`
  )
VALUES
  (
    13,
    'jai ',
    0,
    0,
    'DID20240114122040',
    19,
    'Tramadol',
    'BT010',
    '2024-06-30 00:00:00',
    22.00,
    1,
    22.00,
    '2024-01-14 06:50:42',
    '2024-01-14 06:50:42',
    NULL
  );
INSERT INTO
  `dispensedmedicines` (
    `id`,
    `PatientName`,
    `patient_Id`,
    `prescription_Id`,
    `DispenseID`,
    `DispenseTableID`,
    `MedicineName`,
    `BatchNumber`,
    `ExpiryDate`,
    `UnitPrice`,
    `Quantity`,
    `EachmedicineCost`,
    `createdAt`,
    `updatedAt`,
    `EachMedicineCurrency`
  )
VALUES
  (
    14,
    'jai ',
    0,
    0,
    'DID20240114122040',
    19,
    'Escitalopram',
    'BT232',
    '2024-03-31 00:00:00',
    9.75,
    1,
    9.75,
    '2024-01-14 06:50:42',
    '2024-01-14 06:50:42',
    NULL
  );
INSERT INTO
  `dispensedmedicines` (
    `id`,
    `PatientName`,
    `patient_Id`,
    `prescription_Id`,
    `DispenseID`,
    `DispenseTableID`,
    `MedicineName`,
    `BatchNumber`,
    `ExpiryDate`,
    `UnitPrice`,
    `Quantity`,
    `EachmedicineCost`,
    `createdAt`,
    `updatedAt`,
    `EachMedicineCurrency`
  )
VALUES
  (
    15,
    'Mr Nitesh D Giri',
    40,
    8,
    'P40/20240112/08445820240128165140',
    20,
    'Tylenol',
    'BT0101',
    '2024-05-18 00:00:00',
    20.00,
    1,
    20.00,
    '2024-01-28 11:21:47',
    '2024-01-28 11:21:47',
    NULL
  );
INSERT INTO
  `dispensedmedicines` (
    `id`,
    `PatientName`,
    `patient_Id`,
    `prescription_Id`,
    `DispenseID`,
    `DispenseTableID`,
    `MedicineName`,
    `BatchNumber`,
    `ExpiryDate`,
    `UnitPrice`,
    `Quantity`,
    `EachmedicineCost`,
    `createdAt`,
    `updatedAt`,
    `EachMedicineCurrency`
  )
VALUES
  (
    16,
    'Mr Nitesh D Giri',
    40,
    8,
    'P40/20240112/08445820240128165140',
    20,
    'Zinetac 150mg Tablet',
    'BT01',
    '2025-10-21 00:00:00',
    100.00,
    1,
    100.00,
    '2024-01-28 11:21:47',
    '2024-01-28 11:21:47',
    NULL
  );
INSERT INTO
  `dispensedmedicines` (
    `id`,
    `PatientName`,
    `patient_Id`,
    `prescription_Id`,
    `DispenseID`,
    `DispenseTableID`,
    `MedicineName`,
    `BatchNumber`,
    `ExpiryDate`,
    `UnitPrice`,
    `Quantity`,
    `EachmedicineCost`,
    `createdAt`,
    `updatedAt`,
    `EachMedicineCurrency`
  )
VALUES
  (
    17,
    'Mr Nitesh D Giri',
    40,
    8,
    'P40/20240112/08445820240128170412',
    21,
    'Tylenol',
    'BT0101',
    '2024-05-18 00:00:00',
    20.00,
    1,
    20.00,
    '2024-01-28 11:34:15',
    '2024-01-28 11:34:15',
    'USD'
  );
INSERT INTO
  `dispensedmedicines` (
    `id`,
    `PatientName`,
    `patient_Id`,
    `prescription_Id`,
    `DispenseID`,
    `DispenseTableID`,
    `MedicineName`,
    `BatchNumber`,
    `ExpiryDate`,
    `UnitPrice`,
    `Quantity`,
    `EachmedicineCost`,
    `createdAt`,
    `updatedAt`,
    `EachMedicineCurrency`
  )
VALUES
  (
    18,
    'Mr Nitesh D Giri',
    40,
    8,
    'P40/20240112/08445820240128170412',
    21,
    'Zinetac 150mg Tablet',
    'BT01',
    '2025-10-21 00:00:00',
    100.00,
    1,
    100.00,
    '2024-01-28 11:34:15',
    '2024-01-28 11:34:15',
    'EUR'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: dispensedreports
# ------------------------------------------------------------

INSERT INTO
  `dispensedreports` (
    `id`,
    `PatientName`,
    `patient_Id`,
    `doctor_Id`,
    `DispenseID`,
    `prescription_Id`,
    `PrescriptionID`,
    `PrescriptionDate`,
    `PriscribedDoctor`,
    `PrescriptionType`,
    `prescriptionImage`,
    `DoctorRegNo`,
    `totalMedicineAmount`,
    `createdAt`,
    `updatedAt`,
    `TotalFees`,
    `Currency`
  )
VALUES
  (
    1,
    'nitesh giri',
    0,
    0,
    '20230912131204',
    0,
    '0',
    '2023-09-13 00:00:00',
    'Dr anand kumar',
    'Outside Prescription',
    NOFORMAT_WRAP(
      "##X'c3ab504e470d0a1a0a0000000d494844520000012c0000012c0806000000797dc384750000000467414d410000e29692c3850be281bf6105000000206348524d00007a260000c387c3a40000c2b7000000c387cea6000075300000cea96000003ac3bf00001770c2a3e29591513c00000006624b4744000000000000e2889943e295977f0000000970485973000000600000006000e289a16b42e295a7000005c3bc4944415478e2948ccf86e2968c41c384524118465130ceb5c3a9e29494e296a0e295abe294bcc3876d3c07461375e295a5c3a056e289a45f3c676c3ae294bc6bc2b7c2aa067e79cf84cf8038c3841340e29494c3b9571f00ceb1c3ba040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232e2959be2959bc2b7003f5c2ec3b9e29599cf80c2b178e28ca13152c384cf80c2b0e289a1e294903dc692e295a72f3fe2949cc3a8c3b2e289a4c2abc2a3e294b4e289886ce2968cc2abe29680c2b133e29684e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232e2959e4c7356e29684e288a9e28988e29599e28ca17a7de28ca131e295a2e295aa351dc39630cf80e28c90c2b13dc2a2e2959f0d0be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c202339e295905931616632c39fc2a123e29597e2969042e29482ceb4cf84e29593c2b0e282a77d0e372c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c387c3aee29596c692c2b5e29691c3b9190fc692e295940d0be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c20e2949c34c3a73fe2889e7a03c3aee295a30d7fe295a60d0be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c20cf80cf86c2ba39c2b520e29680790e7b79e2959bc692e2949c0d0be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c202339e29590e295a3e2968c6ec2bb3e42e295ace295a9c2a270566626e295a1c692e29597e294ace289886c1e372c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c387c3aee289a4c39f751fe281bf666516e29482e294ac57c3ace29490cf83c3a505640816c389215840c3a5600119c3a905640816c389215840c3a5600119c3a905640816c38931c2b5c2a139e29597c2b520e29597e2889ec39cc396e29598e296904233c39fe2898836c39f0d3b13e282a7e2949cc3a4e288a9e2949c6e6e5840c3a5600119c3a905640816c389215840c3a5600119c3a905640816c389215840c3a560011963c2aa39e295974cc3bf62c2bcc2a361e294ace2959d62e294ac6ccf80c2a5e295a73061e2959e53cf83c3a505640816c389215840c3a5600119c3a905640816c389215840c3a5600119c3a905640816c3893166c39c3361e2948c30613231c39fe294824d7a4be295a9e29490e296a06c13e295ac50c2a2124dce93c3a505640816c389215840c3a5600119c3a905640816c389215840c3a5600119c3a905640816c3893166c39ce2948262e294acc3ae67e294ac675b61e289a533cf840c3ce295a70d0be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c20cf807ce295aa2ae281bf54c2a2c2b1e2959de294825de289a4c2bde2948ce28ca06945cf86c3963de2949c0d0be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2023e28899e29593c2a35d264d10e296a0e295a15de2959911e295a76cc2b2394cc3bfe294bc547f6f6e5840c3a5600119c3a905640816c389215840c3a5600119c3a905640816c389215840c3a560011963c2aa39c3b9e295a6cf83e28ca0783c5e7dc3aec3b6c3b279e294bcc2abce98e2959ac3a4c396e29594c3a80973c2a2e2948c67c2a2e294800d0be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2063e295a03467e294bcc2b27e3f5dc2bbe295ab571f63c3af0913c3910933e282a7c39c0933e282a7e2948cc2a27be282a7c39fc3a505640816c389215840c3a5600119c3a905640816c389215840c3a5600119c3a905640816c389c3a6c2a3c2b5c2bcc3bf3007c396346dc2b0c3aa777e66133e1be295a773e2949c0232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a78e2889a690ee296804dc3bfc3b14cc3bfe2968838e2949ce2969033e2889ec2b5c3a505640816c389215840c3a5600119c3a905640816c389215840c3a5600119c3a905640816c38961c39ce2949c1f4c47c2b5e289a1e295a07ecf83c3a505640816c389215840c3a5600119c3a905640816c389215840c3a5600119c3a905640816c389c2b1c3b7e29599c2a3c2a061c2abe289a1c384764d52264c5d267ce295a215c3b4e296a0c3a5e29684e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232c386e29599c2a3e29688cf86c3b7cea923e2959de295a15d13c385096a33e282a709e295a76112372c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c387c3aee289a451c2b23fc2b7e294947fe2959f0d0be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c20cf801be295a6e2959f0f79e295a23e5b370000002574455874646174653a63726561746500323032332d30392d30345430373a35333a31392b30303a3030c3bce295964ee2959d0000002574455874646174653a6d6f6469667900323032332d30392d30345430373a35333a31392b30303a3030e289a1cea9c3b7000000000049454e44c2ab4260c3a9'##"
    ),
    'reg65434567I',
    50.00,
    '2023-09-12 07:42:06',
    '2023-09-12 07:42:06',
    NULL,
    NULL
  );
INSERT INTO
  `dispensedreports` (
    `id`,
    `PatientName`,
    `patient_Id`,
    `doctor_Id`,
    `DispenseID`,
    `prescription_Id`,
    `PrescriptionID`,
    `PrescriptionDate`,
    `PriscribedDoctor`,
    `PrescriptionType`,
    `prescriptionImage`,
    `DoctorRegNo`,
    `totalMedicineAmount`,
    `createdAt`,
    `updatedAt`,
    `TotalFees`,
    `Currency`
  )
VALUES
  (
    2,
    'Nitesh Giri',
    0,
    0,
    '20230912132501',
    0,
    '0',
    '2023-09-12 00:00:00',
    'Dr  Anil Kumar',
    'Outside Prescription',
    NOFORMAT_WRAP(
      "##X'c3ab504e470d0a1a0a0000000d494844520000012c0000012c0806000000797dc384750000000467414d410000e29692c3850be281bf6105000000206348524d00007a260000c387c3a40000c2b7000000c387cea6000075300000cea96000003ac3bf00001770c2a3e29591513c00000006624b4744000000000000e2889943e295977f0000000970485973000000600000006000e289a16b42e295a7000005c3bc4944415478e2948ccf86e2968c41c384524118465130ceb5c3a9e29494e296a0e295abe294bcc3876d3c07461375e295a5c3a056e289a45f3c676c3ae294bc6bc2b7c2aa067e79cf84cf8038c3841340e29494c3b9571f00ceb1c3ba040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232e2959be2959bc2b7003f5c2ec3b9e29599cf80c2b178e28ca13152c384cf80c2b0e289a1e294903dc692e295a72f3fe2949cc3a8c3b2e289a4c2abc2a3e294b4e289886ce2968cc2abe29680c2b133e29684e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232e2959e4c7356e29684e288a9e28988e29599e28ca17a7de28ca131e295a2e295aa351dc39630cf80e28c90c2b13dc2a2e2959f0d0be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c202339e295905931616632c39fc2a123e29597e2969042e29482ceb4cf84e29593c2b0e282a77d0e372c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c387c3aee29596c692c2b5e29691c3b9190fc692e295940d0be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c20e2949c34c3a73fe2889e7a03c3aee295a30d7fe295a60d0be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c20cf80cf86c2ba39c2b520e29680790e7b79e2959bc692e2949c0d0be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c202339e29590e295a3e2968c6ec2bb3e42e295ace295a9c2a270566626e295a1c692e29597e294ace289886c1e372c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c387c3aee289a4c39f751fe281bf666516e29482e294ac57c3ace29490cf83c3a505640816c389215840c3a5600119c3a905640816c389215840c3a5600119c3a905640816c38931c2b5c2a139e29597c2b520e29597e2889ec39cc396e29598e296904233c39fe2898836c39f0d3b13e282a7e2949cc3a4e288a9e2949c6e6e5840c3a5600119c3a905640816c389215840c3a5600119c3a905640816c389215840c3a560011963c2aa39e295974cc3bf62c2bcc2a361e294ace2959d62e294ac6ccf80c2a5e295a73061e2959e53cf83c3a505640816c389215840c3a5600119c3a905640816c389215840c3a5600119c3a905640816c3893166c39c3361e2948c30613231c39fe294824d7a4be295a9e29490e296a06c13e295ac50c2a2124dce93c3a505640816c389215840c3a5600119c3a905640816c389215840c3a5600119c3a905640816c3893166c39ce2948262e294acc3ae67e294ac675b61e289a533cf840c3ce295a70d0be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c20cf807ce295aa2ae281bf54c2a2c2b1e2959de294825de289a4c2bde2948ce28ca06945cf86c3963de2949c0d0be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2023e28899e29593c2a35d264d10e296a0e295a15de2959911e295a76cc2b2394cc3bfe294bc547f6f6e5840c3a5600119c3a905640816c389215840c3a5600119c3a905640816c389215840c3a560011963c2aa39c3b9e295a6cf83e28ca0783c5e7dc3aec3b6c3b279e294bcc2abce98e2959ac3a4c396e29594c3a80973c2a2e2948c67c2a2e294800d0be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2063e295a03467e294bcc2b27e3f5dc2bbe295ab571f63c3af0913c3910933e282a7c39c0933e282a7e2948cc2a27be282a7c39fc3a505640816c389215840c3a5600119c3a905640816c389215840c3a5600119c3a905640816c389c3a6c2a3c2b5c2bcc3bf3007c396346dc2b0c3aa777e66133e1be295a773e2949c0232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a78e2889a690ee296804dc3bfc3b14cc3bfe2968838e2949ce2969033e2889ec2b5c3a505640816c389215840c3a5600119c3a905640816c389215840c3a5600119c3a905640816c38961c39ce2949c1f4c47c2b5e289a1e295a07ecf83c3a505640816c389215840c3a5600119c3a905640816c389215840c3a5600119c3a905640816c389c2b1c3b7e29599c2a3c2a061c2abe289a1c384764d52264c5d267ce295a215c3b4e296a0c3a5e29684e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232c386e29599c2a3e29688cf86c3b7cea923e2959de295a15d13c385096a33e282a709e295a76112372c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c387c3aee289a451c2b23fc2b7e294947fe2959f0d0be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c20cf801be295a6e2959f0f79e295a23e5b370000002574455874646174653a63726561746500323032332d30392d30345430373a35333a31392b30303a3030c3bce295964ee2959d0000002574455874646174653a6d6f6469667900323032332d30392d30345430373a35333a31392b30303a3030e289a1cea9c3b7000000000049454e44c2ab4260c3a9'##"
    ),
    'Reg45678',
    75.00,
    '2023-09-12 07:55:03',
    '2023-09-12 07:55:03',
    NULL,
    NULL
  );
INSERT INTO
  `dispensedreports` (
    `id`,
    `PatientName`,
    `patient_Id`,
    `doctor_Id`,
    `DispenseID`,
    `prescription_Id`,
    `PrescriptionID`,
    `PrescriptionDate`,
    `PriscribedDoctor`,
    `PrescriptionType`,
    `prescriptionImage`,
    `DoctorRegNo`,
    `totalMedicineAmount`,
    `createdAt`,
    `updatedAt`,
    `TotalFees`,
    `Currency`
  )
VALUES
  (
    3,
    'Nitesh Giri',
    0,
    0,
    '20230912133109',
    0,
    '0',
    '2023-09-12 00:00:00',
    'Dr  Anil Kumar',
    'Outside Prescription',
    NOFORMAT_WRAP(
      "##X'c3ab504e470d0a1a0a0000000d494844520000012c0000012c0806000000797dc384750000000467414d410000e29692c3850be281bf6105000000206348524d00007a260000c387c3a40000c2b7000000c387cea6000075300000cea96000003ac3bf00001770c2a3e29591513c00000006624b4744000000000000e2889943e295977f0000000970485973000000600000006000e289a16b42e295a7000005c3bc4944415478e2948ccf86e2968c41c384524118465130ceb5c3a9e29494e296a0e295abe294bcc3876d3c07461375e295a5c3a056e289a45f3c676c3ae294bc6bc2b7c2aa067e79cf84cf8038c3841340e29494c3b9571f00ceb1c3ba040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232e2959be2959bc2b7003f5c2ec3b9e29599cf80c2b178e28ca13152c384cf80c2b0e289a1e294903dc692e295a72f3fe2949cc3a8c3b2e289a4c2abc2a3e294b4e289886ce2968cc2abe29680c2b133e29684e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232e2959e4c7356e29684e288a9e28988e29599e28ca17a7de28ca131e295a2e295aa351dc39630cf80e28c90c2b13dc2a2e2959f0d0be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c202339e295905931616632c39fc2a123e29597e2969042e29482ceb4cf84e29593c2b0e282a77d0e372c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c387c3aee29596c692c2b5e29691c3b9190fc692e295940d0be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c20e2949c34c3a73fe2889e7a03c3aee295a30d7fe295a60d0be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c20cf80cf86c2ba39c2b520e29680790e7b79e2959bc692e2949c0d0be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c202339e29590e295a3e2968c6ec2bb3e42e295ace295a9c2a270566626e295a1c692e29597e294ace289886c1e372c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c387c3aee289a4c39f751fe281bf666516e29482e294ac57c3ace29490cf83c3a505640816c389215840c3a5600119c3a905640816c389215840c3a5600119c3a905640816c38931c2b5c2a139e29597c2b520e29597e2889ec39cc396e29598e296904233c39fe2898836c39f0d3b13e282a7e2949cc3a4e288a9e2949c6e6e5840c3a5600119c3a905640816c389215840c3a5600119c3a905640816c389215840c3a560011963c2aa39e295974cc3bf62c2bcc2a361e294ace2959d62e294ac6ccf80c2a5e295a73061e2959e53cf83c3a505640816c389215840c3a5600119c3a905640816c389215840c3a5600119c3a905640816c3893166c39c3361e2948c30613231c39fe294824d7a4be295a9e29490e296a06c13e295ac50c2a2124dce93c3a505640816c389215840c3a5600119c3a905640816c389215840c3a5600119c3a905640816c3893166c39ce2948262e294acc3ae67e294ac675b61e289a533cf840c3ce295a70d0be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c20cf807ce295aa2ae281bf54c2a2c2b1e2959de294825de289a4c2bde2948ce28ca06945cf86c3963de2949c0d0be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2023e28899e29593c2a35d264d10e296a0e295a15de2959911e295a76cc2b2394cc3bfe294bc547f6f6e5840c3a5600119c3a905640816c389215840c3a5600119c3a905640816c389215840c3a560011963c2aa39c3b9e295a6cf83e28ca0783c5e7dc3aec3b6c3b279e294bcc2abce98e2959ac3a4c396e29594c3a80973c2a2e2948c67c2a2e294800d0be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2063e295a03467e294bcc2b27e3f5dc2bbe295ab571f63c3af0913c3910933e282a7c39c0933e282a7e2948cc2a27be282a7c39fc3a505640816c389215840c3a5600119c3a905640816c389215840c3a5600119c3a905640816c389c3a6c2a3c2b5c2bcc3bf3007c396346dc2b0c3aa777e66133e1be295a773e2949c0232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a78e2889a690ee296804dc3bfc3b14cc3bfe2968838e2949ce2969033e2889ec2b5c3a505640816c389215840c3a5600119c3a905640816c389215840c3a5600119c3a905640816c38961c39ce2949c1f4c47c2b5e289a1e295a07ecf83c3a505640816c389215840c3a5600119c3a905640816c389215840c3a5600119c3a905640816c389c2b1c3b7e29599c2a3c2a061c2abe289a1c384764d52264c5d267ce295a215c3b4e296a0c3a5e29684e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232c386e29599c2a3e29688cf86c3b7cea923e2959de295a15d13c385096a33e282a709e295a76112372c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c387c3aee289a451c2b23fc2b7e294947fe2959f0d0be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c20cf801be295a6e2959f0f79e295a23e5b370000002574455874646174653a63726561746500323032332d30392d30345430373a35333a31392b30303a3030c3bce295964ee2959d0000002574455874646174653a6d6f6469667900323032332d30392d30345430373a35333a31392b30303a3030e289a1cea9c3b7000000000049454e44c2ab4260c3a9'##"
    ),
    'Reg45678',
    75.00,
    '2023-09-12 08:01:11',
    '2023-09-12 08:01:11',
    NULL,
    NULL
  );
INSERT INTO
  `dispensedreports` (
    `id`,
    `PatientName`,
    `patient_Id`,
    `doctor_Id`,
    `DispenseID`,
    `prescription_Id`,
    `PrescriptionID`,
    `PrescriptionDate`,
    `PriscribedDoctor`,
    `PrescriptionType`,
    `prescriptionImage`,
    `DoctorRegNo`,
    `totalMedicineAmount`,
    `createdAt`,
    `updatedAt`,
    `TotalFees`,
    `Currency`
  )
VALUES
  (
    4,
    'Nitesh Giri',
    0,
    0,
    '20230912133302',
    0,
    '0',
    '2023-09-12 00:00:00',
    'Dr  Anil Kumar',
    'Outside Prescription',
    NOFORMAT_WRAP(
      "##X'c3ab504e470d0a1a0a0000000d494844520000012c0000012c0806000000797dc384750000000467414d410000e29692c3850be281bf6105000000206348524d00007a260000c387c3a40000c2b7000000c387cea6000075300000cea96000003ac3bf00001770c2a3e29591513c00000006624b4744000000000000e2889943e295977f0000000970485973000000600000006000e289a16b42e295a7000005c3bc4944415478e2948ccf86e2968c41c384524118465130ceb5c3a9e29494e296a0e295abe294bcc3876d3c07461375e295a5c3a056e289a45f3c676c3ae294bc6bc2b7c2aa067e79cf84cf8038c3841340e29494c3b9571f00ceb1c3ba040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232e2959be2959bc2b7003f5c2ec3b9e29599cf80c2b178e28ca13152c384cf80c2b0e289a1e294903dc692e295a72f3fe2949cc3a8c3b2e289a4c2abc2a3e294b4e289886ce2968cc2abe29680c2b133e29684e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232e2959e4c7356e29684e288a9e28988e29599e28ca17a7de28ca131e295a2e295aa351dc39630cf80e28c90c2b13dc2a2e2959f0d0be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c202339e295905931616632c39fc2a123e29597e2969042e29482ceb4cf84e29593c2b0e282a77d0e372c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c387c3aee29596c692c2b5e29691c3b9190fc692e295940d0be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c20e2949c34c3a73fe2889e7a03c3aee295a30d7fe295a60d0be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c20cf80cf86c2ba39c2b520e29680790e7b79e2959bc692e2949c0d0be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c202339e29590e295a3e2968c6ec2bb3e42e295ace295a9c2a270566626e295a1c692e29597e294ace289886c1e372c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c387c3aee289a4c39f751fe281bf666516e29482e294ac57c3ace29490cf83c3a505640816c389215840c3a5600119c3a905640816c389215840c3a5600119c3a905640816c38931c2b5c2a139e29597c2b520e29597e2889ec39cc396e29598e296904233c39fe2898836c39f0d3b13e282a7e2949cc3a4e288a9e2949c6e6e5840c3a5600119c3a905640816c389215840c3a5600119c3a905640816c389215840c3a560011963c2aa39e295974cc3bf62c2bcc2a361e294ace2959d62e294ac6ccf80c2a5e295a73061e2959e53cf83c3a505640816c389215840c3a5600119c3a905640816c389215840c3a5600119c3a905640816c3893166c39c3361e2948c30613231c39fe294824d7a4be295a9e29490e296a06c13e295ac50c2a2124dce93c3a505640816c389215840c3a5600119c3a905640816c389215840c3a5600119c3a905640816c3893166c39ce2948262e294acc3ae67e294ac675b61e289a533cf840c3ce295a70d0be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c20cf807ce295aa2ae281bf54c2a2c2b1e2959de294825de289a4c2bde2948ce28ca06945cf86c3963de2949c0d0be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2023e28899e29593c2a35d264d10e296a0e295a15de2959911e295a76cc2b2394cc3bfe294bc547f6f6e5840c3a5600119c3a905640816c389215840c3a5600119c3a905640816c389215840c3a560011963c2aa39c3b9e295a6cf83e28ca0783c5e7dc3aec3b6c3b279e294bcc2abce98e2959ac3a4c396e29594c3a80973c2a2e2948c67c2a2e294800d0be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2063e295a03467e294bcc2b27e3f5dc2bbe295ab571f63c3af0913c3910933e282a7c39c0933e282a7e2948cc2a27be282a7c39fc3a505640816c389215840c3a5600119c3a905640816c389215840c3a5600119c3a905640816c389c3a6c2a3c2b5c2bcc3bf3007c396346dc2b0c3aa777e66133e1be295a773e2949c0232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a78e2889a690ee296804dc3bfc3b14cc3bfe2968838e2949ce2969033e2889ec2b5c3a505640816c389215840c3a5600119c3a905640816c389215840c3a5600119c3a905640816c38961c39ce2949c1f4c47c2b5e289a1e295a07ecf83c3a505640816c389215840c3a5600119c3a905640816c389215840c3a5600119c3a905640816c389c2b1c3b7e29599c2a3c2a061c2abe289a1c384764d52264c5d267ce295a215c3b4e296a0c3a5e29684e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232c386e29599c2a3e29688cf86c3b7cea923e2959de295a15d13c385096a33e282a709e295a76112372c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c387c3aee289a451c2b23fc2b7e294947fe2959f0d0be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c20cf801be295a6e2959f0f79e295a23e5b370000002574455874646174653a63726561746500323032332d30392d30345430373a35333a31392b30303a3030c3bce295964ee2959d0000002574455874646174653a6d6f6469667900323032332d30392d30345430373a35333a31392b30303a3030e289a1cea9c3b7000000000049454e44c2ab4260c3a9'##"
    ),
    'Reg45678',
    75.00,
    '2023-09-12 08:03:04',
    '2023-09-12 08:03:04',
    NULL,
    NULL
  );
INSERT INTO
  `dispensedreports` (
    `id`,
    `PatientName`,
    `patient_Id`,
    `doctor_Id`,
    `DispenseID`,
    `prescription_Id`,
    `PrescriptionID`,
    `PrescriptionDate`,
    `PriscribedDoctor`,
    `PrescriptionType`,
    `prescriptionImage`,
    `DoctorRegNo`,
    `totalMedicineAmount`,
    `createdAt`,
    `updatedAt`,
    `TotalFees`,
    `Currency`
  )
VALUES
  (
    5,
    'Nitesh Giri',
    0,
    0,
    '20230912133315',
    0,
    '0',
    '2023-09-12 00:00:00',
    'Dr  Anil Kumar',
    'Outside Prescription',
    NOFORMAT_WRAP(
      "##X'c3ab504e470d0a1a0a0000000d494844520000012c0000012c0806000000797dc384750000000467414d410000e29692c3850be281bf6105000000206348524d00007a260000c387c3a40000c2b7000000c387cea6000075300000cea96000003ac3bf00001770c2a3e29591513c00000006624b4744000000000000e2889943e295977f0000000970485973000000600000006000e289a16b42e295a7000005c3bc4944415478e2948ccf86e2968c41c384524118465130ceb5c3a9e29494e296a0e295abe294bcc3876d3c07461375e295a5c3a056e289a45f3c676c3ae294bc6bc2b7c2aa067e79cf84cf8038c3841340e29494c3b9571f00ceb1c3ba040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232e2959be2959bc2b7003f5c2ec3b9e29599cf80c2b178e28ca13152c384cf80c2b0e289a1e294903dc692e295a72f3fe2949cc3a8c3b2e289a4c2abc2a3e294b4e289886ce2968cc2abe29680c2b133e29684e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232e2959e4c7356e29684e288a9e28988e29599e28ca17a7de28ca131e295a2e295aa351dc39630cf80e28c90c2b13dc2a2e2959f0d0be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c202339e295905931616632c39fc2a123e29597e2969042e29482ceb4cf84e29593c2b0e282a77d0e372c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c387c3aee29596c692c2b5e29691c3b9190fc692e295940d0be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c20e2949c34c3a73fe2889e7a03c3aee295a30d7fe295a60d0be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c20cf80cf86c2ba39c2b520e29680790e7b79e2959bc692e2949c0d0be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c202339e29590e295a3e2968c6ec2bb3e42e295ace295a9c2a270566626e295a1c692e29597e294ace289886c1e372c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c387c3aee289a4c39f751fe281bf666516e29482e294ac57c3ace29490cf83c3a505640816c389215840c3a5600119c3a905640816c389215840c3a5600119c3a905640816c38931c2b5c2a139e29597c2b520e29597e2889ec39cc396e29598e296904233c39fe2898836c39f0d3b13e282a7e2949cc3a4e288a9e2949c6e6e5840c3a5600119c3a905640816c389215840c3a5600119c3a905640816c389215840c3a560011963c2aa39e295974cc3bf62c2bcc2a361e294ace2959d62e294ac6ccf80c2a5e295a73061e2959e53cf83c3a505640816c389215840c3a5600119c3a905640816c389215840c3a5600119c3a905640816c3893166c39c3361e2948c30613231c39fe294824d7a4be295a9e29490e296a06c13e295ac50c2a2124dce93c3a505640816c389215840c3a5600119c3a905640816c389215840c3a5600119c3a905640816c3893166c39ce2948262e294acc3ae67e294ac675b61e289a533cf840c3ce295a70d0be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c20cf807ce295aa2ae281bf54c2a2c2b1e2959de294825de289a4c2bde2948ce28ca06945cf86c3963de2949c0d0be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2023e28899e29593c2a35d264d10e296a0e295a15de2959911e295a76cc2b2394cc3bfe294bc547f6f6e5840c3a5600119c3a905640816c389215840c3a5600119c3a905640816c389215840c3a560011963c2aa39c3b9e295a6cf83e28ca0783c5e7dc3aec3b6c3b279e294bcc2abce98e2959ac3a4c396e29594c3a80973c2a2e2948c67c2a2e294800d0be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2063e295a03467e294bcc2b27e3f5dc2bbe295ab571f63c3af0913c3910933e282a7c39c0933e282a7e2948cc2a27be282a7c39fc3a505640816c389215840c3a5600119c3a905640816c389215840c3a5600119c3a905640816c389c3a6c2a3c2b5c2bcc3bf3007c396346dc2b0c3aa777e66133e1be295a773e2949c0232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a78e2889a690ee296804dc3bfc3b14cc3bfe2968838e2949ce2969033e2889ec2b5c3a505640816c389215840c3a5600119c3a905640816c389215840c3a5600119c3a905640816c38961c39ce2949c1f4c47c2b5e289a1e295a07ecf83c3a505640816c389215840c3a5600119c3a905640816c389215840c3a5600119c3a905640816c389c2b1c3b7e29599c2a3c2a061c2abe289a1c384764d52264c5d267ce295a215c3b4e296a0c3a5e29684e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232c386e29599c2a3e29688cf86c3b7cea923e2959de295a15d13c385096a33e282a709e295a76112372c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c387c3aee289a451c2b23fc2b7e294947fe2959f0d0be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c20cf801be295a6e2959f0f79e295a23e5b370000002574455874646174653a63726561746500323032332d30392d30345430373a35333a31392b30303a3030c3bce295964ee2959d0000002574455874646174653a6d6f6469667900323032332d30392d30345430373a35333a31392b30303a3030e289a1cea9c3b7000000000049454e44c2ab4260c3a9'##"
    ),
    'Reg45678',
    75.00,
    '2023-09-12 08:03:16',
    '2023-09-12 08:03:16',
    NULL,
    NULL
  );
INSERT INTO
  `dispensedreports` (
    `id`,
    `PatientName`,
    `patient_Id`,
    `doctor_Id`,
    `DispenseID`,
    `prescription_Id`,
    `PrescriptionID`,
    `PrescriptionDate`,
    `PriscribedDoctor`,
    `PrescriptionType`,
    `prescriptionImage`,
    `DoctorRegNo`,
    `totalMedicineAmount`,
    `createdAt`,
    `updatedAt`,
    `TotalFees`,
    `Currency`
  )
VALUES
  (
    6,
    'Nitesh Giri',
    0,
    0,
    '20230912133334',
    0,
    '0',
    '2023-09-12 00:00:00',
    'Dr  Anil Kumar',
    'Outside Prescription',
    NOFORMAT_WRAP(
      "##X'c3ab504e470d0a1a0a0000000d494844520000012c0000012c0806000000797dc384750000000467414d410000e29692c3850be281bf6105000000206348524d00007a260000c387c3a40000c2b7000000c387cea6000075300000cea96000003ac3bf00001770c2a3e29591513c00000006624b4744000000000000e2889943e295977f0000000970485973000000600000006000e289a16b42e295a7000005c3bc4944415478e2948ccf86e2968c41c384524118465130ceb5c3a9e29494e296a0e295abe294bcc3876d3c07461375e295a5c3a056e289a45f3c676c3ae294bc6bc2b7c2aa067e79cf84cf8038c3841340e29494c3b9571f00ceb1c3ba040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232e2959be2959bc2b7003f5c2ec3b9e29599cf80c2b178e28ca13152c384cf80c2b0e289a1e294903dc692e295a72f3fe2949cc3a8c3b2e289a4c2abc2a3e294b4e289886ce2968cc2abe29680c2b133e29684e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232e2959e4c7356e29684e288a9e28988e29599e28ca17a7de28ca131e295a2e295aa351dc39630cf80e28c90c2b13dc2a2e2959f0d0be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c202339e295905931616632c39fc2a123e29597e2969042e29482ceb4cf84e29593c2b0e282a77d0e372c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c387c3aee29596c692c2b5e29691c3b9190fc692e295940d0be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c20e2949c34c3a73fe2889e7a03c3aee295a30d7fe295a60d0be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c20cf80cf86c2ba39c2b520e29680790e7b79e2959bc692e2949c0d0be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c202339e29590e295a3e2968c6ec2bb3e42e295ace295a9c2a270566626e295a1c692e29597e294ace289886c1e372c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c387c3aee289a4c39f751fe281bf666516e29482e294ac57c3ace29490cf83c3a505640816c389215840c3a5600119c3a905640816c389215840c3a5600119c3a905640816c38931c2b5c2a139e29597c2b520e29597e2889ec39cc396e29598e296904233c39fe2898836c39f0d3b13e282a7e2949cc3a4e288a9e2949c6e6e5840c3a5600119c3a905640816c389215840c3a5600119c3a905640816c389215840c3a560011963c2aa39e295974cc3bf62c2bcc2a361e294ace2959d62e294ac6ccf80c2a5e295a73061e2959e53cf83c3a505640816c389215840c3a5600119c3a905640816c389215840c3a5600119c3a905640816c3893166c39c3361e2948c30613231c39fe294824d7a4be295a9e29490e296a06c13e295ac50c2a2124dce93c3a505640816c389215840c3a5600119c3a905640816c389215840c3a5600119c3a905640816c3893166c39ce2948262e294acc3ae67e294ac675b61e289a533cf840c3ce295a70d0be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c20cf807ce295aa2ae281bf54c2a2c2b1e2959de294825de289a4c2bde2948ce28ca06945cf86c3963de2949c0d0be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2023e28899e29593c2a35d264d10e296a0e295a15de2959911e295a76cc2b2394cc3bfe294bc547f6f6e5840c3a5600119c3a905640816c389215840c3a5600119c3a905640816c389215840c3a560011963c2aa39c3b9e295a6cf83e28ca0783c5e7dc3aec3b6c3b279e294bcc2abce98e2959ac3a4c396e29594c3a80973c2a2e2948c67c2a2e294800d0be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2063e295a03467e294bcc2b27e3f5dc2bbe295ab571f63c3af0913c3910933e282a7c39c0933e282a7e2948cc2a27be282a7c39fc3a505640816c389215840c3a5600119c3a905640816c389215840c3a5600119c3a905640816c389c3a6c2a3c2b5c2bcc3bf3007c396346dc2b0c3aa777e66133e1be295a773e2949c0232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a78e2889a690ee296804dc3bfc3b14cc3bfe2968838e2949ce2969033e2889ec2b5c3a505640816c389215840c3a5600119c3a905640816c389215840c3a5600119c3a905640816c38961c39ce2949c1f4c47c2b5e289a1e295a07ecf83c3a505640816c389215840c3a5600119c3a905640816c389215840c3a5600119c3a905640816c389c2b1c3b7e29599c2a3c2a061c2abe289a1c384764d52264c5d267ce295a215c3b4e296a0c3a5e29684e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232c386e29599c2a3e29688cf86c3b7cea923e2959de295a15d13c385096a33e282a709e295a76112372c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c387c3aee289a451c2b23fc2b7e294947fe2959f0d0be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c20cf801be295a6e2959f0f79e295a23e5b370000002574455874646174653a63726561746500323032332d30392d30345430373a35333a31392b30303a3030c3bce295964ee2959d0000002574455874646174653a6d6f6469667900323032332d30392d30345430373a35333a31392b30303a3030e289a1cea9c3b7000000000049454e44c2ab4260c3a9'##"
    ),
    'Reg45678',
    75.00,
    '2023-09-12 08:03:36',
    '2023-09-12 08:03:36',
    NULL,
    NULL
  );
INSERT INTO
  `dispensedreports` (
    `id`,
    `PatientName`,
    `patient_Id`,
    `doctor_Id`,
    `DispenseID`,
    `prescription_Id`,
    `PrescriptionID`,
    `PrescriptionDate`,
    `PriscribedDoctor`,
    `PrescriptionType`,
    `prescriptionImage`,
    `DoctorRegNo`,
    `totalMedicineAmount`,
    `createdAt`,
    `updatedAt`,
    `TotalFees`,
    `Currency`
  )
VALUES
  (
    7,
    'Nitesh Giri',
    0,
    0,
    '20230912133512',
    0,
    '0',
    '2023-09-12 00:00:00',
    'Dr  Anil Kumar',
    'Outside Prescription',
    NOFORMAT_WRAP(
      "##X'c3ab504e470d0a1a0a0000000d494844520000012c0000012c0806000000797dc384750000000467414d410000e29692c3850be281bf6105000000206348524d00007a260000c387c3a40000c2b7000000c387cea6000075300000cea96000003ac3bf00001770c2a3e29591513c00000006624b4744000000000000e2889943e295977f0000000970485973000000600000006000e289a16b42e295a7000005c3bc4944415478e2948ccf86e2968c41c384524118465130ceb5c3a9e29494e296a0e295abe294bcc3876d3c07461375e295a5c3a056e289a45f3c676c3ae294bc6bc2b7c2aa067e79cf84cf8038c3841340e29494c3b9571f00ceb1c3ba040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232e2959be2959bc2b7003f5c2ec3b9e29599cf80c2b178e28ca13152c384cf80c2b0e289a1e294903dc692e295a72f3fe2949cc3a8c3b2e289a4c2abc2a3e294b4e289886ce2968cc2abe29680c2b133e29684e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232e2959e4c7356e29684e288a9e28988e29599e28ca17a7de28ca131e295a2e295aa351dc39630cf80e28c90c2b13dc2a2e2959f0d0be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c202339e295905931616632c39fc2a123e29597e2969042e29482ceb4cf84e29593c2b0e282a77d0e372c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c387c3aee29596c692c2b5e29691c3b9190fc692e295940d0be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c20e2949c34c3a73fe2889e7a03c3aee295a30d7fe295a60d0be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c20cf80cf86c2ba39c2b520e29680790e7b79e2959bc692e2949c0d0be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c202339e29590e295a3e2968c6ec2bb3e42e295ace295a9c2a270566626e295a1c692e29597e294ace289886c1e372c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c387c3aee289a4c39f751fe281bf666516e29482e294ac57c3ace29490cf83c3a505640816c389215840c3a5600119c3a905640816c389215840c3a5600119c3a905640816c38931c2b5c2a139e29597c2b520e29597e2889ec39cc396e29598e296904233c39fe2898836c39f0d3b13e282a7e2949cc3a4e288a9e2949c6e6e5840c3a5600119c3a905640816c389215840c3a5600119c3a905640816c389215840c3a560011963c2aa39e295974cc3bf62c2bcc2a361e294ace2959d62e294ac6ccf80c2a5e295a73061e2959e53cf83c3a505640816c389215840c3a5600119c3a905640816c389215840c3a5600119c3a905640816c3893166c39c3361e2948c30613231c39fe294824d7a4be295a9e29490e296a06c13e295ac50c2a2124dce93c3a505640816c389215840c3a5600119c3a905640816c389215840c3a5600119c3a905640816c3893166c39ce2948262e294acc3ae67e294ac675b61e289a533cf840c3ce295a70d0be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c20cf807ce295aa2ae281bf54c2a2c2b1e2959de294825de289a4c2bde2948ce28ca06945cf86c3963de2949c0d0be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2023e28899e29593c2a35d264d10e296a0e295a15de2959911e295a76cc2b2394cc3bfe294bc547f6f6e5840c3a5600119c3a905640816c389215840c3a5600119c3a905640816c389215840c3a560011963c2aa39c3b9e295a6cf83e28ca0783c5e7dc3aec3b6c3b279e294bcc2abce98e2959ac3a4c396e29594c3a80973c2a2e2948c67c2a2e294800d0be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2063e295a03467e294bcc2b27e3f5dc2bbe295ab571f63c3af0913c3910933e282a7c39c0933e282a7e2948cc2a27be282a7c39fc3a505640816c389215840c3a5600119c3a905640816c389215840c3a5600119c3a905640816c389c3a6c2a3c2b5c2bcc3bf3007c396346dc2b0c3aa777e66133e1be295a773e2949c0232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a78e2889a690ee296804dc3bfc3b14cc3bfe2968838e2949ce2969033e2889ec2b5c3a505640816c389215840c3a5600119c3a905640816c389215840c3a5600119c3a905640816c38961c39ce2949c1f4c47c2b5e289a1e295a07ecf83c3a505640816c389215840c3a5600119c3a905640816c389215840c3a5600119c3a905640816c389c2b1c3b7e29599c2a3c2a061c2abe289a1c384764d52264c5d267ce295a215c3b4e296a0c3a5e29684e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232c386e29599c2a3e29688cf86c3b7cea923e2959de295a15d13c385096a33e282a709e295a76112372c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c387c3aee289a451c2b23fc2b7e294947fe2959f0d0be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c20cf801be295a6e2959f0f79e295a23e5b370000002574455874646174653a63726561746500323032332d30392d30345430373a35333a31392b30303a3030c3bce295964ee2959d0000002574455874646174653a6d6f6469667900323032332d30392d30345430373a35333a31392b30303a3030e289a1cea9c3b7000000000049454e44c2ab4260c3a9'##"
    ),
    'Reg45678',
    75.00,
    '2023-09-12 08:05:13',
    '2023-09-12 08:05:13',
    NULL,
    NULL
  );
INSERT INTO
  `dispensedreports` (
    `id`,
    `PatientName`,
    `patient_Id`,
    `doctor_Id`,
    `DispenseID`,
    `prescription_Id`,
    `PrescriptionID`,
    `PrescriptionDate`,
    `PriscribedDoctor`,
    `PrescriptionType`,
    `prescriptionImage`,
    `DoctorRegNo`,
    `totalMedicineAmount`,
    `createdAt`,
    `updatedAt`,
    `TotalFees`,
    `Currency`
  )
VALUES
  (
    8,
    'Nitesh Giri',
    0,
    0,
    '20230912133735',
    0,
    '0',
    '2023-09-12 00:00:00',
    'Dr  Anil Kumar',
    'Outside Prescription',
    NOFORMAT_WRAP(
      "##X'c3ab504e470d0a1a0a0000000d494844520000012c0000012c0806000000797dc384750000000467414d410000e29692c3850be281bf6105000000206348524d00007a260000c387c3a40000c2b7000000c387cea6000075300000cea96000003ac3bf00001770c2a3e29591513c00000006624b4744000000000000e2889943e295977f0000000970485973000000600000006000e289a16b42e295a7000005c3bc4944415478e2948ccf86e2968c41c384524118465130ceb5c3a9e29494e296a0e295abe294bcc3876d3c07461375e295a5c3a056e289a45f3c676c3ae294bc6bc2b7c2aa067e79cf84cf8038c3841340e29494c3b9571f00ceb1c3ba040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232e2959be2959bc2b7003f5c2ec3b9e29599cf80c2b178e28ca13152c384cf80c2b0e289a1e294903dc692e295a72f3fe2949cc3a8c3b2e289a4c2abc2a3e294b4e289886ce2968cc2abe29680c2b133e29684e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232e2959e4c7356e29684e288a9e28988e29599e28ca17a7de28ca131e295a2e295aa351dc39630cf80e28c90c2b13dc2a2e2959f0d0be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c202339e295905931616632c39fc2a123e29597e2969042e29482ceb4cf84e29593c2b0e282a77d0e372c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c387c3aee29596c692c2b5e29691c3b9190fc692e295940d0be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c20e2949c34c3a73fe2889e7a03c3aee295a30d7fe295a60d0be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c20cf80cf86c2ba39c2b520e29680790e7b79e2959bc692e2949c0d0be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c202339e29590e295a3e2968c6ec2bb3e42e295ace295a9c2a270566626e295a1c692e29597e294ace289886c1e372c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c387c3aee289a4c39f751fe281bf666516e29482e294ac57c3ace29490cf83c3a505640816c389215840c3a5600119c3a905640816c389215840c3a5600119c3a905640816c38931c2b5c2a139e29597c2b520e29597e2889ec39cc396e29598e296904233c39fe2898836c39f0d3b13e282a7e2949cc3a4e288a9e2949c6e6e5840c3a5600119c3a905640816c389215840c3a5600119c3a905640816c389215840c3a560011963c2aa39e295974cc3bf62c2bcc2a361e294ace2959d62e294ac6ccf80c2a5e295a73061e2959e53cf83c3a505640816c389215840c3a5600119c3a905640816c389215840c3a5600119c3a905640816c3893166c39c3361e2948c30613231c39fe294824d7a4be295a9e29490e296a06c13e295ac50c2a2124dce93c3a505640816c389215840c3a5600119c3a905640816c389215840c3a5600119c3a905640816c3893166c39ce2948262e294acc3ae67e294ac675b61e289a533cf840c3ce295a70d0be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c20cf807ce295aa2ae281bf54c2a2c2b1e2959de294825de289a4c2bde2948ce28ca06945cf86c3963de2949c0d0be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2023e28899e29593c2a35d264d10e296a0e295a15de2959911e295a76cc2b2394cc3bfe294bc547f6f6e5840c3a5600119c3a905640816c389215840c3a5600119c3a905640816c389215840c3a560011963c2aa39c3b9e295a6cf83e28ca0783c5e7dc3aec3b6c3b279e294bcc2abce98e2959ac3a4c396e29594c3a80973c2a2e2948c67c2a2e294800d0be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2063e295a03467e294bcc2b27e3f5dc2bbe295ab571f63c3af0913c3910933e282a7c39c0933e282a7e2948cc2a27be282a7c39fc3a505640816c389215840c3a5600119c3a905640816c389215840c3a5600119c3a905640816c389c3a6c2a3c2b5c2bcc3bf3007c396346dc2b0c3aa777e66133e1be295a773e2949c0232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a78e2889a690ee296804dc3bfc3b14cc3bfe2968838e2949ce2969033e2889ec2b5c3a505640816c389215840c3a5600119c3a905640816c389215840c3a5600119c3a905640816c38961c39ce2949c1f4c47c2b5e289a1e295a07ecf83c3a505640816c389215840c3a5600119c3a905640816c389215840c3a5600119c3a905640816c389c2b1c3b7e29599c2a3c2a061c2abe289a1c384764d52264c5d267ce295a215c3b4e296a0c3a5e29684e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232c386e29599c2a3e29688cf86c3b7cea923e2959de295a15d13c385096a33e282a709e295a76112372c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c387c3aee289a451c2b23fc2b7e294947fe2959f0d0be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c20cf801be295a6e2959f0f79e295a23e5b370000002574455874646174653a63726561746500323032332d30392d30345430373a35333a31392b30303a3030c3bce295964ee2959d0000002574455874646174653a6d6f6469667900323032332d30392d30345430373a35333a31392b30303a3030e289a1cea9c3b7000000000049454e44c2ab4260c3a9'##"
    ),
    'Reg45678',
    75.00,
    '2023-09-12 08:07:36',
    '2023-09-12 08:07:36',
    NULL,
    NULL
  );
INSERT INTO
  `dispensedreports` (
    `id`,
    `PatientName`,
    `patient_Id`,
    `doctor_Id`,
    `DispenseID`,
    `prescription_Id`,
    `PrescriptionID`,
    `PrescriptionDate`,
    `PriscribedDoctor`,
    `PrescriptionType`,
    `prescriptionImage`,
    `DoctorRegNo`,
    `totalMedicineAmount`,
    `createdAt`,
    `updatedAt`,
    `TotalFees`,
    `Currency`
  )
VALUES
  (
    9,
    'Nitesh Giri',
    0,
    0,
    '20230912133821',
    0,
    '0',
    '2023-09-12 00:00:00',
    'Dr  Anil Kumar',
    'Outside Prescription',
    NOFORMAT_WRAP(
      "##X'c3ab504e470d0a1a0a0000000d494844520000012c0000012c0806000000797dc384750000000467414d410000e29692c3850be281bf6105000000206348524d00007a260000c387c3a40000c2b7000000c387cea6000075300000cea96000003ac3bf00001770c2a3e29591513c00000006624b4744000000000000e2889943e295977f0000000970485973000000600000006000e289a16b42e295a7000005c3bc4944415478e2948ccf86e2968c41c384524118465130ceb5c3a9e29494e296a0e295abe294bcc3876d3c07461375e295a5c3a056e289a45f3c676c3ae294bc6bc2b7c2aa067e79cf84cf8038c3841340e29494c3b9571f00ceb1c3ba040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232e2959be2959bc2b7003f5c2ec3b9e29599cf80c2b178e28ca13152c384cf80c2b0e289a1e294903dc692e295a72f3fe2949cc3a8c3b2e289a4c2abc2a3e294b4e289886ce2968cc2abe29680c2b133e29684e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232e2959e4c7356e29684e288a9e28988e29599e28ca17a7de28ca131e295a2e295aa351dc39630cf80e28c90c2b13dc2a2e2959f0d0be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c202339e295905931616632c39fc2a123e29597e2969042e29482ceb4cf84e29593c2b0e282a77d0e372c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c387c3aee29596c692c2b5e29691c3b9190fc692e295940d0be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c20e2949c34c3a73fe2889e7a03c3aee295a30d7fe295a60d0be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c20cf80cf86c2ba39c2b520e29680790e7b79e2959bc692e2949c0d0be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c202339e29590e295a3e2968c6ec2bb3e42e295ace295a9c2a270566626e295a1c692e29597e294ace289886c1e372c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c387c3aee289a4c39f751fe281bf666516e29482e294ac57c3ace29490cf83c3a505640816c389215840c3a5600119c3a905640816c389215840c3a5600119c3a905640816c38931c2b5c2a139e29597c2b520e29597e2889ec39cc396e29598e296904233c39fe2898836c39f0d3b13e282a7e2949cc3a4e288a9e2949c6e6e5840c3a5600119c3a905640816c389215840c3a5600119c3a905640816c389215840c3a560011963c2aa39e295974cc3bf62c2bcc2a361e294ace2959d62e294ac6ccf80c2a5e295a73061e2959e53cf83c3a505640816c389215840c3a5600119c3a905640816c389215840c3a5600119c3a905640816c3893166c39c3361e2948c30613231c39fe294824d7a4be295a9e29490e296a06c13e295ac50c2a2124dce93c3a505640816c389215840c3a5600119c3a905640816c389215840c3a5600119c3a905640816c3893166c39ce2948262e294acc3ae67e294ac675b61e289a533cf840c3ce295a70d0be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c20cf807ce295aa2ae281bf54c2a2c2b1e2959de294825de289a4c2bde2948ce28ca06945cf86c3963de2949c0d0be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2023e28899e29593c2a35d264d10e296a0e295a15de2959911e295a76cc2b2394cc3bfe294bc547f6f6e5840c3a5600119c3a905640816c389215840c3a5600119c3a905640816c389215840c3a560011963c2aa39c3b9e295a6cf83e28ca0783c5e7dc3aec3b6c3b279e294bcc2abce98e2959ac3a4c396e29594c3a80973c2a2e2948c67c2a2e294800d0be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2063e295a03467e294bcc2b27e3f5dc2bbe295ab571f63c3af0913c3910933e282a7c39c0933e282a7e2948cc2a27be282a7c39fc3a505640816c389215840c3a5600119c3a905640816c389215840c3a5600119c3a905640816c389c3a6c2a3c2b5c2bcc3bf3007c396346dc2b0c3aa777e66133e1be295a773e2949c0232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a78e2889a690ee296804dc3bfc3b14cc3bfe2968838e2949ce2969033e2889ec2b5c3a505640816c389215840c3a5600119c3a905640816c389215840c3a5600119c3a905640816c38961c39ce2949c1f4c47c2b5e289a1e295a07ecf83c3a505640816c389215840c3a5600119c3a905640816c389215840c3a5600119c3a905640816c389c2b1c3b7e29599c2a3c2a061c2abe289a1c384764d52264c5d267ce295a215c3b4e296a0c3a5e29684e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232c386e29599c2a3e29688cf86c3b7cea923e2959de295a15d13c385096a33e282a709e295a76112372c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c387c3aee289a451c2b23fc2b7e294947fe2959f0d0be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c20cf801be295a6e2959f0f79e295a23e5b370000002574455874646174653a63726561746500323032332d30392d30345430373a35333a31392b30303a3030c3bce295964ee2959d0000002574455874646174653a6d6f6469667900323032332d30392d30345430373a35333a31392b30303a3030e289a1cea9c3b7000000000049454e44c2ab4260c3a9'##"
    ),
    'Reg45678',
    75.00,
    '2023-09-12 08:08:27',
    '2023-09-12 08:08:27',
    NULL,
    NULL
  );
INSERT INTO
  `dispensedreports` (
    `id`,
    `PatientName`,
    `patient_Id`,
    `doctor_Id`,
    `DispenseID`,
    `prescription_Id`,
    `PrescriptionID`,
    `PrescriptionDate`,
    `PriscribedDoctor`,
    `PrescriptionType`,
    `prescriptionImage`,
    `DoctorRegNo`,
    `totalMedicineAmount`,
    `createdAt`,
    `updatedAt`,
    `TotalFees`,
    `Currency`
  )
VALUES
  (
    10,
    'Nitesh Giri',
    0,
    0,
    '20230912134505',
    0,
    '0',
    '2023-09-14 00:00:00',
    'Dr anil Kumar',
    'Outside Prescription',
    NOFORMAT_WRAP(
      "##X'c3ab504e470d0a1a0a0000000d494844520000012c0000012c0806000000797dc384750000000467414d410000e29692c3850be281bf6105000000206348524d00007a260000c387c3a40000c2b7000000c387cea6000075300000cea96000003ac3bf00001770c2a3e29591513c00000006624b4744000000000000e2889943e295977f0000000970485973000000600000006000e289a16b42e295a7000005c3bc4944415478e2948ccf86e2968c41c384524118465130ceb5c3a9e29494e296a0e295abe294bcc3876d3c07461375e295a5c3a056e289a45f3c676c3ae294bc6bc2b7c2aa067e79cf84cf8038c3841340e29494c3b9571f00ceb1c3ba040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232e2959be2959bc2b7003f5c2ec3b9e29599cf80c2b178e28ca13152c384cf80c2b0e289a1e294903dc692e295a72f3fe2949cc3a8c3b2e289a4c2abc2a3e294b4e289886ce2968cc2abe29680c2b133e29684e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232e2959e4c7356e29684e288a9e28988e29599e28ca17a7de28ca131e295a2e295aa351dc39630cf80e28c90c2b13dc2a2e2959f0d0be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c202339e295905931616632c39fc2a123e29597e2969042e29482ceb4cf84e29593c2b0e282a77d0e372c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c387c3aee29596c692c2b5e29691c3b9190fc692e295940d0be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c20e2949c34c3a73fe2889e7a03c3aee295a30d7fe295a60d0be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c20cf80cf86c2ba39c2b520e29680790e7b79e2959bc692e2949c0d0be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c202339e29590e295a3e2968c6ec2bb3e42e295ace295a9c2a270566626e295a1c692e29597e294ace289886c1e372c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c387c3aee289a4c39f751fe281bf666516e29482e294ac57c3ace29490cf83c3a505640816c389215840c3a5600119c3a905640816c389215840c3a5600119c3a905640816c38931c2b5c2a139e29597c2b520e29597e2889ec39cc396e29598e296904233c39fe2898836c39f0d3b13e282a7e2949cc3a4e288a9e2949c6e6e5840c3a5600119c3a905640816c389215840c3a5600119c3a905640816c389215840c3a560011963c2aa39e295974cc3bf62c2bcc2a361e294ace2959d62e294ac6ccf80c2a5e295a73061e2959e53cf83c3a505640816c389215840c3a5600119c3a905640816c389215840c3a5600119c3a905640816c3893166c39c3361e2948c30613231c39fe294824d7a4be295a9e29490e296a06c13e295ac50c2a2124dce93c3a505640816c389215840c3a5600119c3a905640816c389215840c3a5600119c3a905640816c3893166c39ce2948262e294acc3ae67e294ac675b61e289a533cf840c3ce295a70d0be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c20cf807ce295aa2ae281bf54c2a2c2b1e2959de294825de289a4c2bde2948ce28ca06945cf86c3963de2949c0d0be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2023e28899e29593c2a35d264d10e296a0e295a15de2959911e295a76cc2b2394cc3bfe294bc547f6f6e5840c3a5600119c3a905640816c389215840c3a5600119c3a905640816c389215840c3a560011963c2aa39c3b9e295a6cf83e28ca0783c5e7dc3aec3b6c3b279e294bcc2abce98e2959ac3a4c396e29594c3a80973c2a2e2948c67c2a2e294800d0be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2063e295a03467e294bcc2b27e3f5dc2bbe295ab571f63c3af0913c3910933e282a7c39c0933e282a7e2948cc2a27be282a7c39fc3a505640816c389215840c3a5600119c3a905640816c389215840c3a5600119c3a905640816c389c3a6c2a3c2b5c2bcc3bf3007c396346dc2b0c3aa777e66133e1be295a773e2949c0232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a78e2889a690ee296804dc3bfc3b14cc3bfe2968838e2949ce2969033e2889ec2b5c3a505640816c389215840c3a5600119c3a905640816c389215840c3a5600119c3a905640816c38961c39ce2949c1f4c47c2b5e289a1e295a07ecf83c3a505640816c389215840c3a5600119c3a905640816c389215840c3a5600119c3a905640816c389c2b1c3b7e29599c2a3c2a061c2abe289a1c384764d52264c5d267ce295a215c3b4e296a0c3a5e29684e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232c386e29599c2a3e29688cf86c3b7cea923e2959de295a15d13c385096a33e282a709e295a76112372c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c387c3aee289a451c2b23fc2b7e294947fe2959f0d0be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c2043e29691c3870ce294b40232040be2959a102c20cf801be295a6e2959f0f79e295a23e5b370000002574455874646174653a63726561746500323032332d30392d30345430373a35333a31392b30303a3030c3bce295964ee2959d0000002574455874646174653a6d6f6469667900323032332d30392d30345430373a35333a31392b30303a3030e289a1cea9c3b7000000000049454e44c2ab4260c3a9'##"
    ),
    'Reg87656',
    100.00,
    '2023-09-12 08:15:07',
    '2023-09-12 08:15:07',
    NULL,
    NULL
  );
INSERT INTO
  `dispensedreports` (
    `id`,
    `PatientName`,
    `patient_Id`,
    `doctor_Id`,
    `DispenseID`,
    `prescription_Id`,
    `PrescriptionID`,
    `PrescriptionDate`,
    `PriscribedDoctor`,
    `PrescriptionType`,
    `prescriptionImage`,
    `DoctorRegNo`,
    `totalMedicineAmount`,
    `createdAt`,
    `updatedAt`,
    `TotalFees`,
    `Currency`
  )
VALUES
  (
    11,
    'nitesh',
    0,
    0,
    '20230912144030',
    0,
    '0',
    '2023-09-12 00:00:00',
    'Dr NItesh Giri',
    'Outside Prescription',
    NULL,
    'REG123',
    5.00,
    '2023-09-12 09:10:32',
    '2023-09-12 09:10:32',
    NULL,
    NULL
  );
INSERT INTO
  `dispensedreports` (
    `id`,
    `PatientName`,
    `patient_Id`,
    `doctor_Id`,
    `DispenseID`,
    `prescription_Id`,
    `PrescriptionID`,
    `PrescriptionDate`,
    `PriscribedDoctor`,
    `PrescriptionType`,
    `prescriptionImage`,
    `DoctorRegNo`,
    `totalMedicineAmount`,
    `createdAt`,
    `updatedAt`,
    `TotalFees`,
    `Currency`
  )
VALUES
  (
    12,
    'Mr Vaibhav  Pande',
    6,
    2,
    'P6/20230910/08415420230912144409',
    7,
    'P6/20230910/084154',
    '2023-09-10 03:11:55',
    'Dr Rajesh  Kumar',
    NULL,
    NULL,
    'REG675437',
    5.00,
    '2023-09-12 09:14:11',
    '2023-09-12 09:14:11',
    NULL,
    NULL
  );
INSERT INTO
  `dispensedreports` (
    `id`,
    `PatientName`,
    `patient_Id`,
    `doctor_Id`,
    `DispenseID`,
    `prescription_Id`,
    `PrescriptionID`,
    `PrescriptionDate`,
    `PriscribedDoctor`,
    `PrescriptionType`,
    `prescriptionImage`,
    `DoctorRegNo`,
    `totalMedicineAmount`,
    `createdAt`,
    `updatedAt`,
    `TotalFees`,
    `Currency`
  )
VALUES
  (
    13,
    'Nitesh Giri',
    0,
    0,
    'DID20230912152041',
    0,
    '0',
    '2023-09-13 00:00:00',
    'Dr Anil Kumar',
    'Outside-Hospital',
    NULL,
    'REG45678',
    5.00,
    '2023-09-12 09:50:43',
    '2023-09-12 09:50:43',
    NULL,
    NULL
  );
INSERT INTO
  `dispensedreports` (
    `id`,
    `PatientName`,
    `patient_Id`,
    `doctor_Id`,
    `DispenseID`,
    `prescription_Id`,
    `PrescriptionID`,
    `PrescriptionDate`,
    `PriscribedDoctor`,
    `PrescriptionType`,
    `prescriptionImage`,
    `DoctorRegNo`,
    `totalMedicineAmount`,
    `createdAt`,
    `updatedAt`,
    `TotalFees`,
    `Currency`
  )
VALUES
  (
    14,
    'Mr Deepak  Singh',
    22,
    1,
    'P22/20231017/13343420231017142251',
    2,
    'P22/20231017/133434',
    '2023-10-17 08:04:35',
    'Dr Rajesh  Kumar',
    'In-Hospital',
    NULL,
    'REG767543',
    15.25,
    '2023-10-17 08:52:53',
    '2023-10-17 08:52:53',
    NULL,
    NULL
  );
INSERT INTO
  `dispensedreports` (
    `id`,
    `PatientName`,
    `patient_Id`,
    `doctor_Id`,
    `DispenseID`,
    `prescription_Id`,
    `PrescriptionID`,
    `PrescriptionDate`,
    `PriscribedDoctor`,
    `PrescriptionType`,
    `prescriptionImage`,
    `DoctorRegNo`,
    `totalMedicineAmount`,
    `createdAt`,
    `updatedAt`,
    `TotalFees`,
    `Currency`
  )
VALUES
  (
    15,
    'Mrs Asha Kumari Yadav',
    37,
    1,
    'P37/20231024/14242220240110161417',
    6,
    'P37/20231024/142422',
    '2023-10-24 08:54:23',
    'Dr Rajesh  Kumar',
    'In-Hospital',
    NULL,
    'REG767543',
    60.00,
    '2024-01-10 10:44:21',
    '2024-01-10 10:44:21',
    NULL,
    NULL
  );
INSERT INTO
  `dispensedreports` (
    `id`,
    `PatientName`,
    `patient_Id`,
    `doctor_Id`,
    `DispenseID`,
    `prescription_Id`,
    `PrescriptionID`,
    `PrescriptionDate`,
    `PriscribedDoctor`,
    `PrescriptionType`,
    `prescriptionImage`,
    `DoctorRegNo`,
    `totalMedicineAmount`,
    `createdAt`,
    `updatedAt`,
    `TotalFees`,
    `Currency`
  )
VALUES
  (
    16,
    'Mrs Asha Kumari Yadav',
    37,
    1,
    'P37/20231024/14222120240110161503',
    5,
    'P37/20231024/142221',
    '2023-10-24 08:52:22',
    'Dr Rajesh  Kumar',
    'In-Hospital',
    NULL,
    'REG767543',
    36.00,
    '2024-01-10 10:45:06',
    '2024-01-10 10:45:06',
    NULL,
    NULL
  );
INSERT INTO
  `dispensedreports` (
    `id`,
    `PatientName`,
    `patient_Id`,
    `doctor_Id`,
    `DispenseID`,
    `prescription_Id`,
    `PrescriptionID`,
    `PrescriptionDate`,
    `PriscribedDoctor`,
    `PrescriptionType`,
    `prescriptionImage`,
    `DoctorRegNo`,
    `totalMedicineAmount`,
    `createdAt`,
    `updatedAt`,
    `TotalFees`,
    `Currency`
  )
VALUES
  (
    17,
    'Mrs Asha Kumari Yadav',
    37,
    1,
    'P37/20231024/14242220240114113254',
    6,
    'P37/20231024/142422',
    '2023-10-24 08:54:23',
    'Dr Rajesh  Kumar',
    'In-Hospital',
    NULL,
    'REG767543',
    22.00,
    '2024-01-14 06:02:57',
    '2024-01-14 06:02:57',
    NULL,
    NULL
  );
INSERT INTO
  `dispensedreports` (
    `id`,
    `PatientName`,
    `patient_Id`,
    `doctor_Id`,
    `DispenseID`,
    `prescription_Id`,
    `PrescriptionID`,
    `PrescriptionDate`,
    `PriscribedDoctor`,
    `PrescriptionType`,
    `prescriptionImage`,
    `DoctorRegNo`,
    `totalMedicineAmount`,
    `createdAt`,
    `updatedAt`,
    `TotalFees`,
    `Currency`
  )
VALUES
  (
    18,
    'Mr Nitesh D Giri',
    40,
    1,
    'P40/20240112/08445820240114115212',
    8,
    'P40/20240112/084458',
    '2024-01-12 03:14:58',
    'Dr Rajesh  Kumar',
    'In-Hospital',
    NULL,
    'REG767543',
    22.00,
    '2024-01-14 06:22:26',
    '2024-01-14 06:22:26',
    1824.24,
    'INR'
  );
INSERT INTO
  `dispensedreports` (
    `id`,
    `PatientName`,
    `patient_Id`,
    `doctor_Id`,
    `DispenseID`,
    `prescription_Id`,
    `PrescriptionID`,
    `PrescriptionDate`,
    `PriscribedDoctor`,
    `PrescriptionType`,
    `prescriptionImage`,
    `DoctorRegNo`,
    `totalMedicineAmount`,
    `createdAt`,
    `updatedAt`,
    `TotalFees`,
    `Currency`
  )
VALUES
  (
    19,
    'jai ',
    0,
    0,
    'DID20240114122040',
    0,
    '0',
    '2024-01-14 00:00:00',
    'ljbj',
    'Outside-Hospital',
    NULL,
    'hjb',
    31.75,
    '2024-01-14 06:50:42',
    '2024-01-14 06:50:42',
    2632.71,
    'INR'
  );
INSERT INTO
  `dispensedreports` (
    `id`,
    `PatientName`,
    `patient_Id`,
    `doctor_Id`,
    `DispenseID`,
    `prescription_Id`,
    `PrescriptionID`,
    `PrescriptionDate`,
    `PriscribedDoctor`,
    `PrescriptionType`,
    `prescriptionImage`,
    `DoctorRegNo`,
    `totalMedicineAmount`,
    `createdAt`,
    `updatedAt`,
    `TotalFees`,
    `Currency`
  )
VALUES
  (
    20,
    'Mr Nitesh D Giri',
    40,
    1,
    'P40/20240112/08445820240128165140',
    8,
    'P40/20240112/084458',
    '2024-01-12 03:14:58',
    'Dr Rajesh  Kumar',
    'In-Hospital',
    NULL,
    'REG767543',
    120.00,
    '2024-01-28 11:21:43',
    '2024-01-28 11:21:43',
    10691.23,
    'INR'
  );
INSERT INTO
  `dispensedreports` (
    `id`,
    `PatientName`,
    `patient_Id`,
    `doctor_Id`,
    `DispenseID`,
    `prescription_Id`,
    `PrescriptionID`,
    `PrescriptionDate`,
    `PriscribedDoctor`,
    `PrescriptionType`,
    `prescriptionImage`,
    `DoctorRegNo`,
    `totalMedicineAmount`,
    `createdAt`,
    `updatedAt`,
    `TotalFees`,
    `Currency`
  )
VALUES
  (
    21,
    'Mr Nitesh D Giri',
    40,
    1,
    'P40/20240112/08445820240128170412',
    8,
    'P40/20240112/084458',
    '2024-01-12 03:14:58',
    'Dr Rajesh  Kumar',
    'In-Hospital',
    NULL,
    'REG767543',
    120.00,
    '2024-01-28 11:34:15',
    '2024-01-28 11:34:15',
    128.58,
    'USD'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: doctors
# ------------------------------------------------------------

INSERT INTO
  `doctors` (
    `id`,
    `Dr`,
    `username`,
    `FirstName`,
    `MiddleName`,
    `LastName`,
    `registrationNo`,
    `email`,
    `address`,
    `phoneNo`,
    `createdAt`,
    `signatureImage`,
    `updatedAt`
  )
VALUES
  (
    1,
    'DR',
    'Rajesh02',
    'Rajesh',
    '',
    'Kumar',
    'REG767543',
    'rajesh@gmail.com',
    'Pune',
    8765678976,
    '2023-10-12 08:17:31',
    NOFORMAT_WRAP(
      "##X'696d616765735c7369676e496d6167652e6a7067'##"
    ),
    '2023-10-18 12:19:17'
  );
INSERT INTO
  `doctors` (
    `id`,
    `Dr`,
    `username`,
    `FirstName`,
    `MiddleName`,
    `LastName`,
    `registrationNo`,
    `email`,
    `address`,
    `phoneNo`,
    `createdAt`,
    `signatureImage`,
    `updatedAt`
  )
VALUES
  (
    2,
    'DR',
    'Sandeep02',
    'Sandeep',
    '',
    'Sharma',
    'REGHG74567N',
    'sandeep02@gmail.com',
    'Pune,Maharashtra',
    8774447568,
    '2023-11-08 10:56:22',
    NULL,
    '2023-11-08 10:56:21'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: doctorsappointments
# ------------------------------------------------------------

INSERT INTO
  `doctorsappointments` (
    `id`,
    `doctorId`,
    `patientId`,
    `PatientName`,
    `PatientPhone`,
    `DoctorPhone`,
    `DoctorName`,
    `bookingStartDate`,
    `remarks`,
    `createdAt`,
    `updatedAt`,
    `DoctorEmail`,
    `paymentStatus`,
    `paymentDateTime`,
    `amount`,
    `bookingEndDate`,
    `image`,
    `CorporateID`,
    `BookingStatus`,
    `reason`,
    `visitType`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    13,
    1,
    6,
    'Mr Vaibhav  Pande',
    8976545678,
    8765456789,
    'Rajesh  Kumar',
    '09/09/2023, 06:00 PM',
    NULL,
    '2023-09-09 13:10:20',
    '2023-09-21 13:02:59',
    'rajesh@gmail.com',
    'paid',
    '09/11/2023, 09:00 PM',
    123,
    '09/09/2023, 06:30 PM',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    0,
    'Doctor Visit'
  );
INSERT INTO
  `doctorsappointments` (
    `id`,
    `doctorId`,
    `patientId`,
    `PatientName`,
    `PatientPhone`,
    `DoctorPhone`,
    `DoctorName`,
    `bookingStartDate`,
    `remarks`,
    `createdAt`,
    `updatedAt`,
    `DoctorEmail`,
    `paymentStatus`,
    `paymentDateTime`,
    `amount`,
    `bookingEndDate`,
    `image`,
    `CorporateID`,
    `BookingStatus`,
    `reason`,
    `visitType`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    22,
    1,
    15,
    'Mr Gangesh  Kumar',
    6543245675,
    8765456789,
    'Rajesh  Kumar',
    '09/15/2023, 02:15 PM',
    NULL,
    '2023-09-15 08:35:51',
    '2023-09-18 10:46:51',
    'rajesh@gmail.com',
    'paid',
    '09/15/2023, 03:00 PM',
    100,
    '09/15/2023, 02:45 PM',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    0,
    'Doctor Visit'
  );
INSERT INTO
  `doctorsappointments` (
    `id`,
    `doctorId`,
    `patientId`,
    `PatientName`,
    `PatientPhone`,
    `DoctorPhone`,
    `DoctorName`,
    `bookingStartDate`,
    `remarks`,
    `createdAt`,
    `updatedAt`,
    `DoctorEmail`,
    `paymentStatus`,
    `paymentDateTime`,
    `amount`,
    `bookingEndDate`,
    `image`,
    `CorporateID`,
    `BookingStatus`,
    `reason`,
    `visitType`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    24,
    4,
    15,
    'Mr Gangesh  Kumar',
    6543245675,
    7698567856,
    'Sanjay A Sachdeva',
    '09/19/2023, 12:30 PM',
    NULL,
    '2023-09-19 06:36:09',
    '2023-09-19 06:36:09',
    'sanjay987@gmail.com',
    'paid',
    '2023-09-19T07:30:00.199Z',
    100,
    '09/19/2023, 01:00 PM',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    0,
    'Doctor Visit'
  );
INSERT INTO
  `doctorsappointments` (
    `id`,
    `doctorId`,
    `patientId`,
    `PatientName`,
    `PatientPhone`,
    `DoctorPhone`,
    `DoctorName`,
    `bookingStartDate`,
    `remarks`,
    `createdAt`,
    `updatedAt`,
    `DoctorEmail`,
    `paymentStatus`,
    `paymentDateTime`,
    `amount`,
    `bookingEndDate`,
    `image`,
    `CorporateID`,
    `BookingStatus`,
    `reason`,
    `visitType`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    25,
    4,
    15,
    'Mr Gangesh  Kumar',
    6543245675,
    7698567856,
    'Sanjay A Sachdeva',
    '09/19/2023, 12:30 PM',
    NULL,
    '2023-09-19 06:40:08',
    '2023-09-19 06:40:08',
    'sanjay987@gmail.com',
    'paid',
    '09/19/2023, 01:00 PM',
    100,
    '09/19/2023, 01:00 PM',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    0,
    'Doctor Visit'
  );
INSERT INTO
  `doctorsappointments` (
    `id`,
    `doctorId`,
    `patientId`,
    `PatientName`,
    `PatientPhone`,
    `DoctorPhone`,
    `DoctorName`,
    `bookingStartDate`,
    `remarks`,
    `createdAt`,
    `updatedAt`,
    `DoctorEmail`,
    `paymentStatus`,
    `paymentDateTime`,
    `amount`,
    `bookingEndDate`,
    `image`,
    `CorporateID`,
    `BookingStatus`,
    `reason`,
    `visitType`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    26,
    5,
    18,
    'Mr Admin two Patient',
    7654356788,
    9749926784,
    'Mohit K Chourasia',
    '09/25/2023, 10:15 PM',
    NULL,
    '2023-09-25 16:29:16',
    '2023-09-25 16:29:16',
    'mohit@gmail.com',
    'paid',
    '09/25/2023, 10:30 PM',
    10,
    '09/25/2023, 10:45 PM',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    0,
    'Doctor Visit'
  );
INSERT INTO
  `doctorsappointments` (
    `id`,
    `doctorId`,
    `patientId`,
    `PatientName`,
    `PatientPhone`,
    `DoctorPhone`,
    `DoctorName`,
    `bookingStartDate`,
    `remarks`,
    `createdAt`,
    `updatedAt`,
    `DoctorEmail`,
    `paymentStatus`,
    `paymentDateTime`,
    `amount`,
    `bookingEndDate`,
    `image`,
    `CorporateID`,
    `BookingStatus`,
    `reason`,
    `visitType`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    44,
    1,
    28,
    'Mrs Asha Kumari Yadav',
    9876543213,
    8765678976,
    'Rajesh  Kumar',
    '10/16/2023, 07:00 PM',
    NULL,
    '2023-10-16 12:55:57',
    '2023-10-16 12:55:57',
    'rajesh02@gmail.com',
    'paid',
    '10/16/2023, 07:00 PM',
    100,
    '10/16/2023, 08:00 PM',
    '',
    'JKL012',
    NULL,
    NULL,
    NULL,
    NULL,
    0,
    'Doctor Visit'
  );
INSERT INTO
  `doctorsappointments` (
    `id`,
    `doctorId`,
    `patientId`,
    `PatientName`,
    `PatientPhone`,
    `DoctorPhone`,
    `DoctorName`,
    `bookingStartDate`,
    `remarks`,
    `createdAt`,
    `updatedAt`,
    `DoctorEmail`,
    `paymentStatus`,
    `paymentDateTime`,
    `amount`,
    `bookingEndDate`,
    `image`,
    `CorporateID`,
    `BookingStatus`,
    `reason`,
    `visitType`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    45,
    1,
    29,
    'Mr Vijay  Kumar',
    8676654575,
    8765678976,
    'Rajesh  Kumar',
    '10/16/2023, 08:30 PM',
    NULL,
    '2023-10-16 13:12:45',
    '2023-10-16 13:12:45',
    'rajesh02@gmail.com',
    'paid',
    '10/16/2023, 07:00 PM',
    100,
    '10/16/2023, 09:00 PM',
    'nn',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    0,
    'Doctor Visit'
  );
INSERT INTO
  `doctorsappointments` (
    `id`,
    `doctorId`,
    `patientId`,
    `PatientName`,
    `PatientPhone`,
    `DoctorPhone`,
    `DoctorName`,
    `bookingStartDate`,
    `remarks`,
    `createdAt`,
    `updatedAt`,
    `DoctorEmail`,
    `paymentStatus`,
    `paymentDateTime`,
    `amount`,
    `bookingEndDate`,
    `image`,
    `CorporateID`,
    `BookingStatus`,
    `reason`,
    `visitType`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    46,
    1,
    22,
    'Mr Deepak  Singh',
    9876543212,
    8765678976,
    'Rajesh  Kumar',
    '10/17/2023, 10:45 AM',
    NULL,
    '2023-10-17 04:48:01',
    '2023-10-17 04:48:01',
    'rajesh02@gmail.com',
    'paid',
    '10/17/2023, 11:00 AM',
    100,
    '10/17/2023, 11:15 AM',
    'images\\busimage.jfif',
    'GHI789',
    NULL,
    NULL,
    NULL,
    NULL,
    0,
    'Doctor Visit'
  );
INSERT INTO
  `doctorsappointments` (
    `id`,
    `doctorId`,
    `patientId`,
    `PatientName`,
    `PatientPhone`,
    `DoctorPhone`,
    `DoctorName`,
    `bookingStartDate`,
    `remarks`,
    `createdAt`,
    `updatedAt`,
    `DoctorEmail`,
    `paymentStatus`,
    `paymentDateTime`,
    `amount`,
    `bookingEndDate`,
    `image`,
    `CorporateID`,
    `BookingStatus`,
    `reason`,
    `visitType`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    47,
    1,
    29,
    'Mr Vijay  Kumar',
    8676654575,
    8765678976,
    'Rajesh  Kumar',
    '10/17/2023, 07:15 PM',
    NULL,
    '2023-10-17 13:56:16',
    '2023-10-17 13:56:16',
    'rajesh02@gmail.com',
    'paid',
    '10/17/2023, 07:30 PM',
    100,
    '10/17/2023, 07:45 PM',
    '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',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    0,
    'Doctor Visit'
  );
INSERT INTO
  `doctorsappointments` (
    `id`,
    `doctorId`,
    `patientId`,
    `PatientName`,
    `PatientPhone`,
    `DoctorPhone`,
    `DoctorName`,
    `bookingStartDate`,
    `remarks`,
    `createdAt`,
    `updatedAt`,
    `DoctorEmail`,
    `paymentStatus`,
    `paymentDateTime`,
    `amount`,
    `bookingEndDate`,
    `image`,
    `CorporateID`,
    `BookingStatus`,
    `reason`,
    `visitType`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    48,
    1,
    29,
    'Mr Vijay  Kumar',
    8676654575,
    8765678976,
    'Rajesh  Kumar',
    '10/17/2023, 10:30 PM',
    NULL,
    '2023-10-17 17:07:59',
    '2023-10-17 17:07:59',
    'rajesh02@gmail.com',
    'paid',
    '10/17/2023, 10:30 PM',
    100,
    '10/17/2023, 11:00 PM',
    '',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    0,
    'Doctor Visit'
  );
INSERT INTO
  `doctorsappointments` (
    `id`,
    `doctorId`,
    `patientId`,
    `PatientName`,
    `PatientPhone`,
    `DoctorPhone`,
    `DoctorName`,
    `bookingStartDate`,
    `remarks`,
    `createdAt`,
    `updatedAt`,
    `DoctorEmail`,
    `paymentStatus`,
    `paymentDateTime`,
    `amount`,
    `bookingEndDate`,
    `image`,
    `CorporateID`,
    `BookingStatus`,
    `reason`,
    `visitType`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    49,
    1,
    15,
    'Mr Gangesh Kumar',
    6543245675,
    8765678976,
    'Rajesh Kumar',
    '10/23/2023, 12:00 PM',
    NULL,
    '2023-10-23 05:59:21',
    '2023-10-23 05:59:21',
    'rajesh@gmail.com',
    'paid',
    '10/23/2023, 12:00 PM',
    100,
    '10/23/2023, 12:30 PM',
    '',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    0,
    'Doctor Visit'
  );
INSERT INTO
  `doctorsappointments` (
    `id`,
    `doctorId`,
    `patientId`,
    `PatientName`,
    `PatientPhone`,
    `DoctorPhone`,
    `DoctorName`,
    `bookingStartDate`,
    `remarks`,
    `createdAt`,
    `updatedAt`,
    `DoctorEmail`,
    `paymentStatus`,
    `paymentDateTime`,
    `amount`,
    `bookingEndDate`,
    `image`,
    `CorporateID`,
    `BookingStatus`,
    `reason`,
    `visitType`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    50,
    1,
    6,
    'Mr Vaibhav Pande',
    8976545678,
    8765678976,
    'Rajesh Kumar',
    '10/23/2023, 12:45 PM',
    NULL,
    '2023-10-23 06:13:09',
    '2023-10-23 06:13:09',
    'rajesh@gmail.com',
    'paid',
    '10/23/2023, 12:30 PM',
    100,
    '10/23/2023, 01:15 PM',
    '',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    0,
    'Doctor Visit'
  );
INSERT INTO
  `doctorsappointments` (
    `id`,
    `doctorId`,
    `patientId`,
    `PatientName`,
    `PatientPhone`,
    `DoctorPhone`,
    `DoctorName`,
    `bookingStartDate`,
    `remarks`,
    `createdAt`,
    `updatedAt`,
    `DoctorEmail`,
    `paymentStatus`,
    `paymentDateTime`,
    `amount`,
    `bookingEndDate`,
    `image`,
    `CorporateID`,
    `BookingStatus`,
    `reason`,
    `visitType`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    51,
    1,
    37,
    'Mrs Asha Yadav',
    9876543213,
    8765678976,
    'Rajesh Kumar',
    '10/23/2023, 04:00 PM',
    NULL,
    '2023-10-23 10:21:21',
    '2023-10-24 08:54:24',
    'rajesh@gmail.com',
    'paid',
    '10/23/2023, 05:00 PM',
    100,
    '10/23/2023, 04:30 PM',
    '',
    'ABC123',
    'Consultated',
    NULL,
    NULL,
    NULL,
    0,
    'Doctor Visit'
  );
INSERT INTO
  `doctorsappointments` (
    `id`,
    `doctorId`,
    `patientId`,
    `PatientName`,
    `PatientPhone`,
    `DoctorPhone`,
    `DoctorName`,
    `bookingStartDate`,
    `remarks`,
    `createdAt`,
    `updatedAt`,
    `DoctorEmail`,
    `paymentStatus`,
    `paymentDateTime`,
    `amount`,
    `bookingEndDate`,
    `image`,
    `CorporateID`,
    `BookingStatus`,
    `reason`,
    `visitType`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    52,
    1,
    35,
    'Mrs Priya Patel',
    9876543211,
    8765678976,
    'Rajesh Kumar',
    '10/24/2023, 03:00 PM',
    NULL,
    '2023-10-24 08:55:10',
    '2023-10-30 02:12:45',
    'rajesh@gmail.com',
    'notPaid',
    '10/24/2023, 03:00 PM',
    0,
    '10/24/2023, 03:30 PM',
    '',
    'DEF456',
    'Booked',
    NULL,
    NULL,
    NULL,
    0,
    'Doctor Visit'
  );
INSERT INTO
  `doctorsappointments` (
    `id`,
    `doctorId`,
    `patientId`,
    `PatientName`,
    `PatientPhone`,
    `DoctorPhone`,
    `DoctorName`,
    `bookingStartDate`,
    `remarks`,
    `createdAt`,
    `updatedAt`,
    `DoctorEmail`,
    `paymentStatus`,
    `paymentDateTime`,
    `amount`,
    `bookingEndDate`,
    `image`,
    `CorporateID`,
    `BookingStatus`,
    `reason`,
    `visitType`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    53,
    1,
    37,
    'Mrs Asha Yadav',
    9876543213,
    8765678976,
    'Rajesh Kumar',
    '10/31/2023, 11:30 AM',
    NULL,
    '2023-10-31 05:41:16',
    '2023-10-31 05:41:15',
    'rajesh@gmail.com',
    'paid',
    '10/31/2023, 12:00 PM',
    1000,
    '10/31/2023, 12:00 PM',
    '',
    'ABC123',
    'Booked',
    NULL,
    NULL,
    NULL,
    0,
    'Doctor Visit'
  );
INSERT INTO
  `doctorsappointments` (
    `id`,
    `doctorId`,
    `patientId`,
    `PatientName`,
    `PatientPhone`,
    `DoctorPhone`,
    `DoctorName`,
    `bookingStartDate`,
    `remarks`,
    `createdAt`,
    `updatedAt`,
    `DoctorEmail`,
    `paymentStatus`,
    `paymentDateTime`,
    `amount`,
    `bookingEndDate`,
    `image`,
    `CorporateID`,
    `BookingStatus`,
    `reason`,
    `visitType`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    54,
    1,
    37,
    'Mrs Asha Yadav',
    9876543213,
    8765678976,
    'Rajesh Kumar',
    '10/31/2023, 12:30 PM',
    NULL,
    '2023-10-31 05:42:04',
    '2023-10-31 05:42:04',
    'rajesh@gmail.com',
    'paid',
    '10/31/2023, 12:00 PM',
    1201,
    '10/31/2023, 01:00 PM',
    '',
    'ABC123',
    'Booked',
    NULL,
    NULL,
    NULL,
    0,
    'Doctor Visit'
  );
INSERT INTO
  `doctorsappointments` (
    `id`,
    `doctorId`,
    `patientId`,
    `PatientName`,
    `PatientPhone`,
    `DoctorPhone`,
    `DoctorName`,
    `bookingStartDate`,
    `remarks`,
    `createdAt`,
    `updatedAt`,
    `DoctorEmail`,
    `paymentStatus`,
    `paymentDateTime`,
    `amount`,
    `bookingEndDate`,
    `image`,
    `CorporateID`,
    `BookingStatus`,
    `reason`,
    `visitType`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    55,
    1,
    37,
    'Mrs Asha Yadav',
    9876543213,
    8765678976,
    'Rajesh Kumar',
    '11/07/2023, 09:00 AM',
    NULL,
    '2023-11-07 03:15:12',
    '2023-11-07 03:15:12',
    'rajesh@gmail.com',
    'paid',
    '11/07/2023, 09:30 AM',
    100,
    '11/07/2023, 09:30 AM',
    '',
    'ABC123',
    'Booked',
    NULL,
    NULL,
    NULL,
    0,
    'Doctor Visit'
  );
INSERT INTO
  `doctorsappointments` (
    `id`,
    `doctorId`,
    `patientId`,
    `PatientName`,
    `PatientPhone`,
    `DoctorPhone`,
    `DoctorName`,
    `bookingStartDate`,
    `remarks`,
    `createdAt`,
    `updatedAt`,
    `DoctorEmail`,
    `paymentStatus`,
    `paymentDateTime`,
    `amount`,
    `bookingEndDate`,
    `image`,
    `CorporateID`,
    `BookingStatus`,
    `reason`,
    `visitType`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    56,
    2,
    38,
    'Mrs Nitesh Giri',
    9394687467,
    8774447568,
    'Sandeep Sharma',
    '11/23/2023, 12:00 PM',
    NULL,
    '2023-11-23 06:26:23',
    '2023-11-23 06:42:37',
    'sandeep02@gmail.com',
    'paid',
    '11/23/2023, 12:30 PM',
    100,
    '11/23/2023, 12:30 PM',
    '',
    NULL,
    'Booked',
    'NA new update',
    'New Patient',
    NULL,
    0,
    'Doctor Visit'
  );
INSERT INTO
  `doctorsappointments` (
    `id`,
    `doctorId`,
    `patientId`,
    `PatientName`,
    `PatientPhone`,
    `DoctorPhone`,
    `DoctorName`,
    `bookingStartDate`,
    `remarks`,
    `createdAt`,
    `updatedAt`,
    `DoctorEmail`,
    `paymentStatus`,
    `paymentDateTime`,
    `amount`,
    `bookingEndDate`,
    `image`,
    `CorporateID`,
    `BookingStatus`,
    `reason`,
    `visitType`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    57,
    2,
    40,
    'Mr Nitesh Giri',
    7876598397,
    8774447568,
    'Sandeep Sharma',
    '01/08/2024, 07:15 PM',
    NULL,
    '2024-01-08 14:04:10',
    '2024-01-08 14:04:10',
    'sandeep02@gmail.com',
    'paid',
    '01/08/2024, 07:00 PM',
    100,
    '01/08/2024, 08:15 PM',
    '',
    NULL,
    'Booked',
    'Fever',
    'New Patient',
    NULL,
    0,
    'Doctor Visit'
  );
INSERT INTO
  `doctorsappointments` (
    `id`,
    `doctorId`,
    `patientId`,
    `PatientName`,
    `PatientPhone`,
    `DoctorPhone`,
    `DoctorName`,
    `bookingStartDate`,
    `remarks`,
    `createdAt`,
    `updatedAt`,
    `DoctorEmail`,
    `paymentStatus`,
    `paymentDateTime`,
    `amount`,
    `bookingEndDate`,
    `image`,
    `CorporateID`,
    `BookingStatus`,
    `reason`,
    `visitType`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    58,
    2,
    40,
    'Mr Nitesh Giri',
    7876598397,
    8774447568,
    'Sandeep Sharma',
    '01/09/2024, 07:00 PM',
    NULL,
    '2024-01-08 14:05:21',
    '2024-01-08 14:05:21',
    'sandeep02@gmail.com',
    'paid',
    '01/08/2024, 07:30 PM',
    100,
    '01/09/2024, 08:00 PM',
    '',
    NULL,
    'Booked',
    'Fever',
    'New Patient',
    NULL,
    0,
    'Doctor Visit'
  );
INSERT INTO
  `doctorsappointments` (
    `id`,
    `doctorId`,
    `patientId`,
    `PatientName`,
    `PatientPhone`,
    `DoctorPhone`,
    `DoctorName`,
    `bookingStartDate`,
    `remarks`,
    `createdAt`,
    `updatedAt`,
    `DoctorEmail`,
    `paymentStatus`,
    `paymentDateTime`,
    `amount`,
    `bookingEndDate`,
    `image`,
    `CorporateID`,
    `BookingStatus`,
    `reason`,
    `visitType`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    59,
    1,
    39,
    'Mrs Jai Kumar',
    9394687462,
    8765678976,
    'Rajesh Kumar',
    '01/11/2024, 02:45 PM',
    NULL,
    '2024-01-11 08:55:43',
    '2024-01-11 09:10:25',
    'rajesh@gmail.com',
    'paid',
    '01/11/2024, 02:00 PM',
    1000,
    '01/11/2024, 03:00 PM',
    '',
    NULL,
    'Consultated',
    'NA',
    'New Patient',
    NULL,
    0,
    'Doctor Visit'
  );
INSERT INTO
  `doctorsappointments` (
    `id`,
    `doctorId`,
    `patientId`,
    `PatientName`,
    `PatientPhone`,
    `DoctorPhone`,
    `DoctorName`,
    `bookingStartDate`,
    `remarks`,
    `createdAt`,
    `updatedAt`,
    `DoctorEmail`,
    `paymentStatus`,
    `paymentDateTime`,
    `amount`,
    `bookingEndDate`,
    `image`,
    `CorporateID`,
    `BookingStatus`,
    `reason`,
    `visitType`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    60,
    2,
    39,
    'Mrs Jai Kumar',
    9394687462,
    8774447568,
    'Sandeep Sharma',
    '01/11/2024, 02:15 PM',
    NULL,
    '2024-01-11 08:55:44',
    '2024-01-11 08:55:44',
    'sandeep02@gmail.com',
    'paid',
    '01/11/2024, 02:00 PM',
    1000,
    '01/11/2024, 02:45 PM',
    '',
    NULL,
    'Booked',
    'NA',
    'New Patient',
    NULL,
    0,
    'Doctor Visit'
  );
INSERT INTO
  `doctorsappointments` (
    `id`,
    `doctorId`,
    `patientId`,
    `PatientName`,
    `PatientPhone`,
    `DoctorPhone`,
    `DoctorName`,
    `bookingStartDate`,
    `remarks`,
    `createdAt`,
    `updatedAt`,
    `DoctorEmail`,
    `paymentStatus`,
    `paymentDateTime`,
    `amount`,
    `bookingEndDate`,
    `image`,
    `CorporateID`,
    `BookingStatus`,
    `reason`,
    `visitType`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    61,
    1,
    40,
    'Mr Nitesh Giri',
    7876598397,
    8765678976,
    'Rajesh Kumar',
    '01/11/2024, 01:30 PM',
    NULL,
    '2024-01-11 09:21:39',
    '2024-01-12 03:15:01',
    'rajesh@gmail.com',
    'paid',
    '01/11/2024, 02:30 PM',
    1000,
    '01/11/2024, 02:00 PM',
    '',
    NULL,
    'Consultated',
    'NA',
    'New Patient',
    NULL,
    0,
    'Doctor Visit'
  );
INSERT INTO
  `doctorsappointments` (
    `id`,
    `doctorId`,
    `patientId`,
    `PatientName`,
    `PatientPhone`,
    `DoctorPhone`,
    `DoctorName`,
    `bookingStartDate`,
    `remarks`,
    `createdAt`,
    `updatedAt`,
    `DoctorEmail`,
    `paymentStatus`,
    `paymentDateTime`,
    `amount`,
    `bookingEndDate`,
    `image`,
    `CorporateID`,
    `BookingStatus`,
    `reason`,
    `visitType`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    62,
    2,
    39,
    'Mrs Jai Kumar',
    9394687462,
    8774447568,
    'Sandeep Sharma',
    '01/14/2024, 01:30 PM',
    NULL,
    '2024-01-14 08:10:45',
    '2024-01-14 08:10:45',
    'sandeep02@gmail.com',
    'paid',
    '01/14/2024, 02:30 PM',
    100,
    '01/14/2024, 02:00 PM',
    '',
    NULL,
    'Booked',
    'NA',
    'New Patient',
    NULL,
    0,
    'Doctor Visit'
  );
INSERT INTO
  `doctorsappointments` (
    `id`,
    `doctorId`,
    `patientId`,
    `PatientName`,
    `PatientPhone`,
    `DoctorPhone`,
    `DoctorName`,
    `bookingStartDate`,
    `remarks`,
    `createdAt`,
    `updatedAt`,
    `DoctorEmail`,
    `paymentStatus`,
    `paymentDateTime`,
    `amount`,
    `bookingEndDate`,
    `image`,
    `CorporateID`,
    `BookingStatus`,
    `reason`,
    `visitType`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    63,
    2,
    16,
    'Mr Vijay Kumar',
    7896785674,
    8774447568,
    'Sandeep Sharma',
    '01/14/2024, 02:15 PM',
    NULL,
    '2024-01-14 08:14:19',
    '2024-01-14 08:14:19',
    'sandeep02@gmail.com',
    'paid',
    '01/14/2024, 02:00 PM',
    11,
    '01/14/2024, 02:45 PM',
    '',
    NULL,
    'Booked',
    'NA',
    'Follow-Up Patient',
    'USD',
    0,
    'Doctor Visit'
  );
INSERT INTO
  `doctorsappointments` (
    `id`,
    `doctorId`,
    `patientId`,
    `PatientName`,
    `PatientPhone`,
    `DoctorPhone`,
    `DoctorName`,
    `bookingStartDate`,
    `remarks`,
    `createdAt`,
    `updatedAt`,
    `DoctorEmail`,
    `paymentStatus`,
    `paymentDateTime`,
    `amount`,
    `bookingEndDate`,
    `image`,
    `CorporateID`,
    `BookingStatus`,
    `reason`,
    `visitType`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    64,
    2,
    36,
    'Mr Deepak Singh',
    9876543212,
    8774447568,
    'Sandeep Sharma',
    '01/15/2024, 12:45 AM',
    NULL,
    '2024-01-14 19:06:48',
    '2024-01-14 19:06:48',
    'sandeep02@gmail.com',
    'paid',
    '01/15/2024, 01:30 AM',
    11,
    '01/15/2024, 01:15 AM',
    '',
    'GHI789',
    'Booked',
    'AN',
    'New Patient',
    'EUR',
    0,
    'Doctor Visit'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: drugdatabases
# ------------------------------------------------------------

INSERT INTO
  `drugdatabases` (
    `id`,
    `medicineName`,
    `manufacturer`,
    `saltComposition`,
    `packaging`,
    `price`,
    `storage`,
    `overview`,
    `usesBenefits`,
    `sideEffects`,
    `howToUse`,
    `drugWorks`,
    `safetyAdvice`,
    `missedDose`,
    `quickTips`,
    `interactionDrugs`,
    `patientConcerns`,
    `userFeedback`,
    `faqs`,
    `createdAt`,
    `updatedAt`,
    `Currency`
  )
VALUES
  (
    3,
    'medicine2',
    'lhnui',
    'hbuoyhgbu',
    'gvyhgv7',
    76.00,
    'ghvbkhjb',
    'kjhvbk',
    'jhbk',
    'ujghb',
    'hbuk',
    'jhgb',
    'kuhjg',
    'buy',
    'kugj',
    'kjghuyh',
    '',
    NULL,
    NULL,
    '2023-09-07 16:52:49',
    '2023-10-14 06:25:24',
    NULL
  );
INSERT INTO
  `drugdatabases` (
    `id`,
    `medicineName`,
    `manufacturer`,
    `saltComposition`,
    `packaging`,
    `price`,
    `storage`,
    `overview`,
    `usesBenefits`,
    `sideEffects`,
    `howToUse`,
    `drugWorks`,
    `safetyAdvice`,
    `missedDose`,
    `quickTips`,
    `interactionDrugs`,
    `patientConcerns`,
    `userFeedback`,
    `faqs`,
    `createdAt`,
    `updatedAt`,
    `Currency`
  )
VALUES
  (
    4,
    'Zinetac 150mg Tablet',
    ' Glaxo SmithKline Pharmaceuticals Ltd',
    'Ranitidine (150mg)',
    '1 strip 15 tablets',
    100.00,
    'Store below 30┬░C',
    'Zinetac 150mg Tablet is a medicine that reduces the amount of acid your stomach makes. It is used to treat and prevent heartburn, indigestion, and other symptoms caused by too much acid in the stomach. It is also used to treat and prevent stomach ulcers, reflux disease, and some rarer conditions. Zinetac 150mg Tablet is also commonly prescribed to prevent stomach ulcers and heartburn seen with the use of painkillers. The medicine must be taken in dose and duration as prescribed by the doctor. How much you need, and how often you take it, will depend on what you are being treated for. Follow the advice of your doctor. This medicine should relieve indigestion and heartburn within a few hours and you may only need to take it for a short time when you have symptoms. If you are taking it to prevent ulcers and other conditions you may need to take it for longer. You should keep taking it regularly to prevent problems from happening in the future. You may be able to help improve your symptoms by eating smaller meals more often and avoiding spicy or fatty foods. Most people who take it do not have any side effects but the most common include headache, constipation, feeling drowsy or tired, and diarrhea. If you do get a side effect, it is usually mild and will go away when you stop taking this medicine or as you adjust to it. Consult your doctor if any of these side effects bother you or do not go away. Before taking it, you should tell your doctor if you have any kidney or liver problems. This may affect the dose or suitability of this medicine. Also tell your doctor what other medicines you are taking as some may affect, or be affected by, this medicine. This medicine is usually considered safe to take during pregnancy and breastfeeding if it has been prescribed by a doctor. Avoid drinking alcohol as this can increase the amount of acid in your stomach and make your symptoms worse',
    '1 strip 15 tablets',
    'Most side effects do not require any medical attention and disappear as your body adjusts to the medicine. Consult your doctor if they persist or if youΓÇÖre worried about them Common side effects of Zinetac Headache Diarrhea Gastrointestinal disturbance',
    'Most side effects do not require any medical attention and disappear as your body adjusts to the medicine. Consult your doctor if they persist or if youΓÇÖre worried about them Common side effects of Zinetac Headache Diarrhea Gastrointestinal disturbance',
    'Alcohol [UNSAFE] It is unsafe to consume alcohol with Zinetac 150mg Tablet. Pregnancy [SAFE IF PRESCRIBED] Zinetac 150mg Tablet is generally considered safe to use during pregnancy. Animal studies have shown low or no adverse effects to the developing baby; however, there are limited human studies. Breast feeding [SAFE IF PRESCRIBED] Zinetac 150mg Tablet is probably safe to use during breastfeeding. Limited human data suggests that the drug does not represent any significant risk to the baby. Driving [SAFE] Zinetac 150mg Tablet does not usually affect your ability to drive. Kidney [CAUTION] Zinetac 150mg Tablet should be used with caution in patients with kidney disease. Dose adjustment of Zinetac 150mg Tablet may be needed. Please consult your doctor. Liver [CAUTION] Zinetac 150mg Tablet should be used with caution in patients with liver disease. Dose adjustment of Zinetac 150mg Tablet may be needed. Please consult your doctor.',
    'Alcohol [UNSAFE] It is unsafe to consume alcohol with Zinetac 150mg Tablet. Pregnancy [SAFE IF PRESCRIBED] Zinetac 150mg Tablet is generally considered safe to use during pregnancy. Animal studies have shown low or no adverse effects to the developing baby; however, there are limited human studies. Breast feeding [SAFE IF PRESCRIBED] Zinetac 150mg Tablet is probably safe to use during breastfeeding. Limited human data suggests that the drug does not represent any significant risk to the baby. Driving [SAFE] Zinetac 150mg Tablet does not usually affect your ability to drive. Kidney [CAUTION] Zinetac 150mg Tablet should be used with caution in patients with kidney disease. Dose adjustment of Zinetac 150mg Tablet may be needed. Please consult your doctor. Liver [CAUTION] Zinetac 150mg Tablet should be used with caution in patients with liver disease. Dose adjustment of Zinetac 150mg Tablet may be needed. Please consult your doctor.',
    'If you miss a dose of Zinetac 150mg Tablet, take it as soon as possible. However, if it is almost time for your next dose, skip the missed dose and go back to your regular schedule. Do not double the dose.',
    'If you are also taking other medications to treat acidity (e.g., antacid), take them 2 hours before or after taking Zinetac 150mg Tablet. Avoid taking soft drinks, citrus fruits like orange and lemon, which can irritate the stomach and increase acid secretion. Inform your doctor if you do not feel better after taking Zinetac 150mg Tablet for 2 weeks as you may be suffering from some other problems. Inform your doctor if you have ever been diagnosed with kidney disease as dose of your medicine may need to be adjusted. Do not stop taking the medication without talking to your doctor.',
    'Efavirenz Brand(s): Evirenz, Estiva, Efamat Life-threatening Nevirapine Brand(s): Nevimune, Nevipan, Nevir',
    '',
    NULL,
    NULL,
    '2023-09-08 12:36:12',
    '2024-01-28 09:22:03',
    'INR'
  );
INSERT INTO
  `drugdatabases` (
    `id`,
    `medicineName`,
    `manufacturer`,
    `saltComposition`,
    `packaging`,
    `price`,
    `storage`,
    `overview`,
    `usesBenefits`,
    `sideEffects`,
    `howToUse`,
    `drugWorks`,
    `safetyAdvice`,
    `missedDose`,
    `quickTips`,
    `interactionDrugs`,
    `patientConcerns`,
    `userFeedback`,
    `faqs`,
    `createdAt`,
    `updatedAt`,
    `Currency`
  )
VALUES
  (
    5,
    'jhb',
    'jhbjhb',
    'jhb',
    'jhb',
    23.00,
    'jhb',
    'jhb',
    'jhb',
    'jhb',
    'b',
    'ljhb',
    'jhb',
    'ljh',
    'jh',
    'bljh',
    '',
    NULL,
    NULL,
    '2023-10-14 05:39:38',
    '2023-10-14 05:39:38',
    NULL
  );
INSERT INTO
  `drugdatabases` (
    `id`,
    `medicineName`,
    `manufacturer`,
    `saltComposition`,
    `packaging`,
    `price`,
    `storage`,
    `overview`,
    `usesBenefits`,
    `sideEffects`,
    `howToUse`,
    `drugWorks`,
    `safetyAdvice`,
    `missedDose`,
    `quickTips`,
    `interactionDrugs`,
    `patientConcerns`,
    `userFeedback`,
    `faqs`,
    `createdAt`,
    `updatedAt`,
    `Currency`
  )
VALUES
  (
    9,
    'khjbk New New 22',
    'hbk',
    'jhb',
    'kuuh',
    12.00,
    'kuh',
    'bkuh',
    'b',
    'kuh',
    'kuuhb',
    'ku',
    'hb',
    'bk',
    'b',
    'kjhbkuhhj',
    '',
    NULL,
    NULL,
    '2023-10-14 05:52:05',
    '2023-10-14 05:52:05',
    NULL
  );
INSERT INTO
  `drugdatabases` (
    `id`,
    `medicineName`,
    `manufacturer`,
    `saltComposition`,
    `packaging`,
    `price`,
    `storage`,
    `overview`,
    `usesBenefits`,
    `sideEffects`,
    `howToUse`,
    `drugWorks`,
    `safetyAdvice`,
    `missedDose`,
    `quickTips`,
    `interactionDrugs`,
    `patientConcerns`,
    `userFeedback`,
    `faqs`,
    `createdAt`,
    `updatedAt`,
    `Currency`
  )
VALUES
  (
    10,
    'iuhg',
    'ykug',
    'yug',
    'uyg',
    10.00,
    'g',
    'yug',
    'uyg',
    'yukg',
    'luyjg',
    'yu',
    'gjyu',
    'jg',
    'jy',
    'jguk',
    '',
    NULL,
    NULL,
    '2024-01-11 07:00:04',
    '2024-01-11 07:00:04',
    NULL
  );
INSERT INTO
  `drugdatabases` (
    `id`,
    `medicineName`,
    `manufacturer`,
    `saltComposition`,
    `packaging`,
    `price`,
    `storage`,
    `overview`,
    `usesBenefits`,
    `sideEffects`,
    `howToUse`,
    `drugWorks`,
    `safetyAdvice`,
    `missedDose`,
    `quickTips`,
    `interactionDrugs`,
    `patientConcerns`,
    `userFeedback`,
    `faqs`,
    `createdAt`,
    `updatedAt`,
    `Currency`
  )
VALUES
  (
    11,
    'lkjhlikjh',
    'lkblk',
    'bhlkblkb',
    'lkblkhb',
    12.00,
    'kjblkbj',
    'kbjlkbjn',
    'lkb',
    'lkj',
    'kb',
    'l',
    'khb',
    'l',
    'bl',
    'bkjb',
    '',
    NULL,
    NULL,
    '2024-01-28 09:22:25',
    '2024-01-28 09:22:25',
    'USD'
  );
INSERT INTO
  `drugdatabases` (
    `id`,
    `medicineName`,
    `manufacturer`,
    `saltComposition`,
    `packaging`,
    `price`,
    `storage`,
    `overview`,
    `usesBenefits`,
    `sideEffects`,
    `howToUse`,
    `drugWorks`,
    `safetyAdvice`,
    `missedDose`,
    `quickTips`,
    `interactionDrugs`,
    `patientConcerns`,
    `userFeedback`,
    `faqs`,
    `createdAt`,
    `updatedAt`,
    `Currency`
  )
VALUES
  (
    19,
    'Paracetamol',
    'ABC Pharmaceuticals',
    'Paracetamol 500mg tablets',
    'Box of 30 tablets',
    5.00,
    'Store in a cool, dry place',
    'Paracetamol is a common pain reliever',
    'Paracetamol is used to treat mild to moderate pain. Headache, fever, muscle aches, toothache, backache, arthritis, and cold/flu symptoms.',
    'Take 1 tablet every 4-6 hours as needed for pain. Paracetamol reduces fever and relieves pain by inhibiting the production of certain chemicals in the brain that cause pain and fever.',
    'Do not exceed the recommended dosage. Consult your doctor if symptoms persist.',
    'If you miss a dose, take it as soon as you remember. If it is near the time of your next dose, skip the missed dose and resume your usual dosing schedule.',
    'Drink plenty of fluids and get rest to help your body recover from illness.',
    'Tell your doctor about all the medicines you take, including prescription and non-prescription medicines, herbal supplements, and vitamins.',
    'Paracetamol may cause liver damage if taken in high doses or for a long time.',
    'Paracetamol may interact with other drugs, so inform your doctor if you are taking any other medications.',
    'Some patients may experience nausea, vomiting, or allergic reactions to Paracetamol.',
    NULL,
    NULL,
    '2024-02-06 09:01:55',
    '2024-02-06 09:01:55',
    'USD'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: healthtestpackagemodels
# ------------------------------------------------------------

INSERT INTO
  `healthtestpackagemodels` (
    `id`,
    `packageName`,
    `MRPOfPackage`,
    `discount`,
    `finalPrice`,
    `createdAt`,
    `updatedAt`,
    `Currency`
  )
VALUES
  (
    1,
    'Health',
    500,
    30,
    350.00,
    '2023-10-08 14:54:20',
    '2024-01-15 15:03:14',
    'USD'
  );
INSERT INTO
  `healthtestpackagemodels` (
    `id`,
    `packageName`,
    `MRPOfPackage`,
    `discount`,
    `finalPrice`,
    `createdAt`,
    `updatedAt`,
    `Currency`
  )
VALUES
  (
    2,
    'Health Plus',
    5000,
    30,
    3500.00,
    '2023-10-08 14:57:54',
    '2024-01-15 15:16:13',
    'USD'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: hospitaladminregistrations
# ------------------------------------------------------------

INSERT INTO
  `hospitaladminregistrations` (
    `id`,
    `username`,
    `firstName`,
    `middleName`,
    `lastName`,
    `address`,
    `phoneNo`,
    `email`,
    `createdAt`,
    `updatedAt`,
    `hospitalId`
  )
VALUES
  (
    7,
    'Admin01',
    'Admin',
    '',
    'One',
    'Pune',
    9456787654,
    'admin01@gmail.com',
    '2023-09-19 17:07:27',
    '2023-09-20 05:55:45',
    8
  );
INSERT INTO
  `hospitaladminregistrations` (
    `id`,
    `username`,
    `firstName`,
    `middleName`,
    `lastName`,
    `address`,
    `phoneNo`,
    `email`,
    `createdAt`,
    `updatedAt`,
    `hospitalId`
  )
VALUES
  (
    8,
    'Admin02',
    'Admin',
    '',
    'two',
    'Pune',
    8765467888,
    'admin02@gmail.com',
    '2023-09-19 17:08:23',
    '2023-09-19 17:08:23',
    9
  );
INSERT INTO
  `hospitaladminregistrations` (
    `id`,
    `username`,
    `firstName`,
    `middleName`,
    `lastName`,
    `address`,
    `phoneNo`,
    `email`,
    `createdAt`,
    `updatedAt`,
    `hospitalId`
  )
VALUES
  (
    9,
    'DrNowa',
    'Dr ',
    '',
    'Nowa',
    'NA',
    3842014150,
    'drnowam@gmail.com',
    '2024-01-15 06:02:32',
    '2024-01-15 06:02:30',
    1
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: hospitaladmissions
# ------------------------------------------------------------

INSERT INTO
  `hospitaladmissions` (
    `id`,
    `PatientName`,
    `PatientID`,
    `AdmissionDate`,
    `PatientPhoneNo`,
    `AdmittingPhysician`,
    `AdmittingPhysicianPhone`,
    `AdmittingPhysicianID`,
    `ReferringPhysician`,
    `ReferringPhysicianPhone`,
    `ReferringPhysicianID`,
    `ReasonForAdmission`,
    `AdvanceAmount`,
    `PaymentOption`,
    `PaymentDate`,
    `PreviousHospitalizations`,
    `ChronicConditions`,
    `Medications`,
    `createdAt`,
    `updatedAt`,
    `RoomNumber`,
    `BedNumber`,
    `BedType`,
    `CheckInTime`,
    `CheckOutTime`,
    `Currency`,
    `PaymentStatus`,
    `AdmissionType`,
    `TreatmentPlan`,
    `patientCondition`,
    `BillingInformation`,
    `InsuranceClaimDetails`,
    `PaymentStatusDischarge`,
    `nursingNotes`,
    `physicianNotes`,
    `DischargeDate`,
    `DischargeInstruction`,
    `FollowUpAppointments`,
    `summaryOfTreatment`,
    `postDischargeCare`,
    `transferInformation`,
    `transferFacility`,
    `transferDateTime`,
    `PatientSignature`,
    `AuthorizedConsent`
  )
VALUES
  (
    1,
    'Mr Nitesh Giri',
    40,
    '2024-01-16',
    7876598397,
    'Sandeep Sharma',
    8774447568,
    '2',
    'Sandeep Sharma',
    8774447568,
    2,
    'NA',
    100,
    'Cash',
    '2024-01-16T18:27',
    'na',
    'NA',
    'NA',
    '2024-01-16 13:07:10',
    '2024-01-16 13:07:10',
    101,
    102,
    'Semi-Private',
    '01/18/2024, 06:00 PM',
    '01/18/2024, 06:30 PM',
    '',
    '',
    '',
    '',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    'NA',
    NULL
  );
INSERT INTO
  `hospitaladmissions` (
    `id`,
    `PatientName`,
    `PatientID`,
    `AdmissionDate`,
    `PatientPhoneNo`,
    `AdmittingPhysician`,
    `AdmittingPhysicianPhone`,
    `AdmittingPhysicianID`,
    `ReferringPhysician`,
    `ReferringPhysicianPhone`,
    `ReferringPhysicianID`,
    `ReasonForAdmission`,
    `AdvanceAmount`,
    `PaymentOption`,
    `PaymentDate`,
    `PreviousHospitalizations`,
    `ChronicConditions`,
    `Medications`,
    `createdAt`,
    `updatedAt`,
    `RoomNumber`,
    `BedNumber`,
    `BedType`,
    `CheckInTime`,
    `CheckOutTime`,
    `Currency`,
    `PaymentStatus`,
    `AdmissionType`,
    `TreatmentPlan`,
    `patientCondition`,
    `BillingInformation`,
    `InsuranceClaimDetails`,
    `PaymentStatusDischarge`,
    `nursingNotes`,
    `physicianNotes`,
    `DischargeDate`,
    `DischargeInstruction`,
    `FollowUpAppointments`,
    `summaryOfTreatment`,
    `postDischargeCare`,
    `transferInformation`,
    `transferFacility`,
    `transferDateTime`,
    `PatientSignature`,
    `AuthorizedConsent`
  )
VALUES
  (
    3,
    'Mrs Vijaya Kumari',
    41,
    '2024-01-17',
    7684659836,
    'Sandeep Sharma',
    8774447568,
    '2',
    'Rajesh Kumar',
    8765678976,
    1,
    'Fever',
    100,
    'Cash',
    '2024-01-17T12:16',
    'NA',
    'NA',
    'NA',
    '2024-01-17 07:11:37',
    '2024-01-17 07:11:37',
    101,
    102,
    '102',
    '01/19/2024, 11:30 AM',
    '01/19/2024, 01:00 PM',
    '',
    '',
    '',
    '',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    'NA',
    NULL
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: hospitalmains
# ------------------------------------------------------------

INSERT INTO
  `hospitalmains` (
    `id`,
    `hospitalName`,
    `hospitalURL`,
    `HospitalGUID`,
    `name`,
    `databaseName`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    3,
    'more hospital',
    'http://localhost:3000/mediai/more.hospital',
    'c031d5e7-24ce-4808-afe7-5bf8379a34b3',
    'more.hospital',
    'more_hospital_c031d5e724ce4808afe75bf8379a34b3',
    '2024-01-29 06:52:23',
    '2024-01-29 06:52:23'
  );
INSERT INTO
  `hospitalmains` (
    `id`,
    `hospitalName`,
    `hospitalURL`,
    `HospitalGUID`,
    `name`,
    `databaseName`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    4,
    'global hospital',
    'http://localhost:3000/mediai/global.hospital',
    'cdf7a271-86cb-435c-9c9b-e417ecdc2111',
    'global.hospital',
    'global_hospital_cdf7a27186cb435c9c9be417ecdc2111',
    '2024-01-30 06:57:15',
    '2024-01-30 06:57:15'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: hospitalrooms
# ------------------------------------------------------------

INSERT INTO
  `hospitalrooms` (
    `id`,
    `department`,
    `name`,
    `type`,
    `number`,
    `number_of_beds`,
    `status`,
    `totalCost`,
    `currency`,
    `bedCost`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    7,
    'DP01',
    'Room01',
    'AC',
    101,
    2,
    'active',
    300,
    'USD',
    150,
    '2024-01-16 10:36:29',
    '2024-01-16 15:53:22'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: hospitals
# ------------------------------------------------------------

INSERT INTO
  `hospitals` (
    `id`,
    `hospitalName`,
    `address`,
    `city`,
    `pincode`,
    `registrationNo`,
    `email`,
    `hospitalAdminEmail`,
    `phone`,
    `landline`,
    `logo`,
    `createdAt`,
    `updatedAt`,
    `HospitalUserName`,
    `HospitalID_MainDatabase`,
    `HospitalGUID`,
    `baseCurrency`,
    `OptionalCurrency`
  )
VALUES
  (
    1,
    'Global Hospitals',
    '35, Dr Ernest Borges Rd, opp. Shirodkar High School\t',
    '',
    '400016',
    'REG4345678',
    'global.hospital@gmail.com',
    'global.hospital@gmail.com',
    8765356548,
    '022 6767 0101',
    'images\\image_2024_01_14T13_23_05_903Z.png',
    '2023-10-12 11:37:47',
    '2024-01-31 16:00:14',
    NULL,
    NULL,
    NULL,
    NULL,
    'null'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: inventries
# ------------------------------------------------------------

INSERT INTO
  `inventries` (
    `id`,
    `SKU`,
    `itemName`,
    `composition`,
    `description`,
    `unitPrice`,
    `batchNo`,
    `expiryDate`,
    `unit`,
    `dateIn`,
    `quantityIn`,
    `dateOut`,
    `quantityOut`,
    `balanceQuantity`,
    `AverageMonthlyQuantityOut`,
    `AverageWeeklyQuantityOut`,
    `createdAt`,
    `updatedAt`,
    `Currency`
  )
VALUES
  (
    1,
    'MED001',
    'Paracetamol',
    '500mg tablet',
    'For fever and pain relief',
    10.50,
    'BT123',
    '2023-09-19',
    'Each ',
    '2023-06-01',
    100,
    '0120-01-01',
    0,
    100,
    0,
    0,
    '2023-09-15 05:43:49',
    '2024-01-31 16:02:41',
    'NA'
  );
INSERT INTO
  `inventries` (
    `id`,
    `SKU`,
    `itemName`,
    `composition`,
    `description`,
    `unitPrice`,
    `batchNo`,
    `expiryDate`,
    `unit`,
    `dateIn`,
    `quantityIn`,
    `dateOut`,
    `quantityOut`,
    `balanceQuantity`,
    `AverageMonthlyQuantityOut`,
    `AverageWeeklyQuantityOut`,
    `createdAt`,
    `updatedAt`,
    `Currency`
  )
VALUES
  (
    2,
    'MED003',
    'Ibuprofen',
    '200mg capsule',
    'For pain relief and inflammation',
    15.25,
    'BT789',
    '2023-12-31',
    'Each',
    '2023-06-01',
    75,
    '2023-10-17',
    1,
    74,
    0,
    0,
    '2023-09-15 05:43:49',
    '2023-10-17 08:52:54',
    'NA'
  );
INSERT INTO
  `inventries` (
    `id`,
    `SKU`,
    `itemName`,
    `composition`,
    `description`,
    `unitPrice`,
    `batchNo`,
    `expiryDate`,
    `unit`,
    `dateIn`,
    `quantityIn`,
    `dateOut`,
    `quantityOut`,
    `balanceQuantity`,
    `AverageMonthlyQuantityOut`,
    `AverageWeeklyQuantityOut`,
    `createdAt`,
    `updatedAt`,
    `Currency`
  )
VALUES
  (
    3,
    'MED004',
    'Ciprofloxacin',
    '500mg tablet',
    'For bacterial infections',
    20.00,
    'BT101',
    '2023-10-31',
    'Each',
    '2023-06-01',
    30,
    '2000-01-01',
    0,
    30,
    0,
    0,
    '2023-09-15 05:43:50',
    '2023-09-15 05:43:50',
    'NA'
  );
INSERT INTO
  `inventries` (
    `id`,
    `SKU`,
    `itemName`,
    `composition`,
    `description`,
    `unitPrice`,
    `batchNo`,
    `expiryDate`,
    `unit`,
    `dateIn`,
    `quantityIn`,
    `dateOut`,
    `quantityOut`,
    `balanceQuantity`,
    `AverageMonthlyQuantityOut`,
    `AverageWeeklyQuantityOut`,
    `createdAt`,
    `updatedAt`,
    `Currency`
  )
VALUES
  (
    4,
    'MED013',
    'Tramadol',
    '50mg tablet',
    'For moderate to severe pain relief',
    22.00,
    'BT010',
    '2024-06-30',
    'Each',
    '2023-06-01',
    45,
    '2024-01-14',
    3,
    42,
    0,
    0,
    '2023-09-15 05:43:50',
    '2024-01-14 06:50:42',
    'NA'
  );
INSERT INTO
  `inventries` (
    `id`,
    `SKU`,
    `itemName`,
    `composition`,
    `description`,
    `unitPrice`,
    `batchNo`,
    `expiryDate`,
    `unit`,
    `dateIn`,
    `quantityIn`,
    `dateOut`,
    `quantityOut`,
    `balanceQuantity`,
    `AverageMonthlyQuantityOut`,
    `AverageWeeklyQuantityOut`,
    `createdAt`,
    `updatedAt`,
    `Currency`
  )
VALUES
  (
    5,
    'MED014',
    'Fluoxetine',
    '20mg capsule',
    'For depression and anxiety',
    11.50,
    'BT121',
    '2023-10-31',
    'Each',
    '2023-06-01',
    80,
    '2000-01-01',
    0,
    80,
    0,
    0,
    '2023-09-15 05:43:50',
    '2023-09-15 05:43:50',
    'NA'
  );
INSERT INTO
  `inventries` (
    `id`,
    `SKU`,
    `itemName`,
    `composition`,
    `description`,
    `unitPrice`,
    `batchNo`,
    `expiryDate`,
    `unit`,
    `dateIn`,
    `quantityIn`,
    `dateOut`,
    `quantityOut`,
    `balanceQuantity`,
    `AverageMonthlyQuantityOut`,
    `AverageWeeklyQuantityOut`,
    `createdAt`,
    `updatedAt`,
    `Currency`
  )
VALUES
  (
    6,
    'MED015',
    'Escitalopram',
    '10mg tablet',
    'For depression and anxiety',
    9.75,
    'BT232',
    '2024-03-31',
    'Each',
    '2023-06-01',
    65,
    '2024-01-14',
    1,
    64,
    0,
    0,
    '2023-09-15 05:43:50',
    '2024-01-14 06:50:42',
    'NA'
  );
INSERT INTO
  `inventries` (
    `id`,
    `SKU`,
    `itemName`,
    `composition`,
    `description`,
    `unitPrice`,
    `batchNo`,
    `expiryDate`,
    `unit`,
    `dateIn`,
    `quantityIn`,
    `dateOut`,
    `quantityOut`,
    `balanceQuantity`,
    `AverageMonthlyQuantityOut`,
    `AverageWeeklyQuantityOut`,
    `createdAt`,
    `updatedAt`,
    `Currency`
  )
VALUES
  (
    7,
    'MED016',
    'Alprazolam',
    '0.5mg tablet',
    'For anxiety and panic disorders',
    8.00,
    'BT343',
    '2024-07-31',
    'Each',
    '2023-06-01',
    95,
    '2000-01-01',
    0,
    95,
    0,
    0,
    '2023-09-15 05:43:50',
    '2023-09-15 05:43:50',
    'NA'
  );
INSERT INTO
  `inventries` (
    `id`,
    `SKU`,
    `itemName`,
    `composition`,
    `description`,
    `unitPrice`,
    `batchNo`,
    `expiryDate`,
    `unit`,
    `dateIn`,
    `quantityIn`,
    `dateOut`,
    `quantityOut`,
    `balanceQuantity`,
    `AverageMonthlyQuantityOut`,
    `AverageWeeklyQuantityOut`,
    `createdAt`,
    `updatedAt`,
    `Currency`
  )
VALUES
  (
    8,
    'MED024',
    'Warfarin',
    '5mg tablet',
    'For blood clot prevention',
    12.50,
    'BT222',
    '2023-08-31',
    'Each',
    '2023-06-01',
    40,
    '2000-01-01',
    0,
    40,
    0,
    0,
    '2023-09-15 05:43:50',
    '2023-09-15 05:43:50',
    'NA'
  );
INSERT INTO
  `inventries` (
    `id`,
    `SKU`,
    `itemName`,
    `composition`,
    `description`,
    `unitPrice`,
    `batchNo`,
    `expiryDate`,
    `unit`,
    `dateIn`,
    `quantityIn`,
    `dateOut`,
    `quantityOut`,
    `balanceQuantity`,
    `AverageMonthlyQuantityOut`,
    `AverageWeeklyQuantityOut`,
    `createdAt`,
    `updatedAt`,
    `Currency`
  )
VALUES
  (
    9,
    'MED033',
    'Tobramycin',
    '80mg injection',
    'For bacterial infections',
    55.00,
    'TO222',
    '2024-01-31',
    'Each',
    '2023-06-01',
    8,
    '2000-01-01',
    0,
    8,
    0,
    0,
    '2023-09-15 05:43:50',
    '2023-09-15 05:43:50',
    'NA'
  );
INSERT INTO
  `inventries` (
    `id`,
    `SKU`,
    `itemName`,
    `composition`,
    `description`,
    `unitPrice`,
    `batchNo`,
    `expiryDate`,
    `unit`,
    `dateIn`,
    `quantityIn`,
    `dateOut`,
    `quantityOut`,
    `balanceQuantity`,
    `AverageMonthlyQuantityOut`,
    `AverageWeeklyQuantityOut`,
    `createdAt`,
    `updatedAt`,
    `Currency`
  )
VALUES
  (
    10,
    'MED034',
    'Amikacin',
    '250mg injection',
    'For bacterial infections',
    60.00,
    'AM333',
    '2024-05-31',
    'Each',
    '2023-06-01',
    7,
    '2000-01-01',
    0,
    7,
    0,
    0,
    '2023-09-15 05:43:50',
    '2023-09-15 05:43:50',
    'NA'
  );
INSERT INTO
  `inventries` (
    `id`,
    `SKU`,
    `itemName`,
    `composition`,
    `description`,
    `unitPrice`,
    `batchNo`,
    `expiryDate`,
    `unit`,
    `dateIn`,
    `quantityIn`,
    `dateOut`,
    `quantityOut`,
    `balanceQuantity`,
    `AverageMonthlyQuantityOut`,
    `AverageWeeklyQuantityOut`,
    `createdAt`,
    `updatedAt`,
    `Currency`
  )
VALUES
  (
    11,
    'MED035',
    'Meropenem',
    '1g injection',
    'For bacterial infections',
    120.00,
    'ME444',
    '2023-09-30',
    'Each',
    '2023-06-01',
    3,
    '2000-01-01',
    0,
    3,
    0,
    0,
    '2023-09-15 05:43:50',
    '2023-09-15 05:43:50',
    'NA'
  );
INSERT INTO
  `inventries` (
    `id`,
    `SKU`,
    `itemName`,
    `composition`,
    `description`,
    `unitPrice`,
    `batchNo`,
    `expiryDate`,
    `unit`,
    `dateIn`,
    `quantityIn`,
    `dateOut`,
    `quantityOut`,
    `balanceQuantity`,
    `AverageMonthlyQuantityOut`,
    `AverageWeeklyQuantityOut`,
    `createdAt`,
    `updatedAt`,
    `Currency`
  )
VALUES
  (
    12,
    'MED040',
    'Fluconazole',
    '150mg capsule',
    'For fungal infections',
    25.00,
    'FL999',
    '2023-04-24',
    'Each',
    '2023-06-01',
    20,
    '2000-01-01',
    0,
    20,
    0,
    0,
    '2023-09-15 05:43:50',
    '2023-09-15 05:43:50',
    'NA'
  );
INSERT INTO
  `inventries` (
    `id`,
    `SKU`,
    `itemName`,
    `composition`,
    `description`,
    `unitPrice`,
    `batchNo`,
    `expiryDate`,
    `unit`,
    `dateIn`,
    `quantityIn`,
    `dateOut`,
    `quantityOut`,
    `balanceQuantity`,
    `AverageMonthlyQuantityOut`,
    `AverageWeeklyQuantityOut`,
    `createdAt`,
    `updatedAt`,
    `Currency`
  )
VALUES
  (
    13,
    'MED041',
    'Rifampin',
    '300mg capsule',
    'For tuberculosis and bacterial infections',
    30.00,
    'RI111',
    '2023-06-10',
    'Each',
    '2023-06-01',
    15,
    '2000-01-01',
    0,
    15,
    0,
    0,
    '2023-09-15 05:43:50',
    '2023-09-15 05:43:50',
    'NA'
  );
INSERT INTO
  `inventries` (
    `id`,
    `SKU`,
    `itemName`,
    `composition`,
    `description`,
    `unitPrice`,
    `batchNo`,
    `expiryDate`,
    `unit`,
    `dateIn`,
    `quantityIn`,
    `dateOut`,
    `quantityOut`,
    `balanceQuantity`,
    `AverageMonthlyQuantityOut`,
    `AverageWeeklyQuantityOut`,
    `createdAt`,
    `updatedAt`,
    `Currency`
  )
VALUES
  (
    14,
    'SKU3281',
    'Solvin Cough',
    'Cough',
    'Cold Cough',
    5.50,
    'B5432',
    '2024-02-29',
    'Each',
    '2023-06-17',
    100,
    '1974-01-01',
    0,
    100,
    0,
    0,
    '2023-09-15 05:43:50',
    '2023-09-15 05:43:50',
    'NA'
  );
INSERT INTO
  `inventries` (
    `id`,
    `SKU`,
    `itemName`,
    `composition`,
    `description`,
    `unitPrice`,
    `batchNo`,
    `expiryDate`,
    `unit`,
    `dateIn`,
    `quantityIn`,
    `dateOut`,
    `quantityOut`,
    `balanceQuantity`,
    `AverageMonthlyQuantityOut`,
    `AverageWeeklyQuantityOut`,
    `createdAt`,
    `updatedAt`,
    `Currency`
  )
VALUES
  (
    15,
    'B543223',
    'Sumo Cold',
    'Cold',
    'Cold',
    6.00,
    'B754653485',
    '2024-03-01',
    'Each',
    '2023-06-17',
    100,
    '2024-01-10',
    16,
    84,
    1,
    2,
    '2023-09-15 05:43:50',
    '2024-01-10 10:45:07',
    'NA'
  );
INSERT INTO
  `inventries` (
    `id`,
    `SKU`,
    `itemName`,
    `composition`,
    `description`,
    `unitPrice`,
    `batchNo`,
    `expiryDate`,
    `unit`,
    `dateIn`,
    `quantityIn`,
    `dateOut`,
    `quantityOut`,
    `balanceQuantity`,
    `AverageMonthlyQuantityOut`,
    `AverageWeeklyQuantityOut`,
    `createdAt`,
    `updatedAt`,
    `Currency`
  )
VALUES
  (
    16,
    'MED002',
    'Aspirin',
    '325mg tablet',
    'For pain relief and inflammation',
    8.75,
    'BT456',
    '2024-08-31',
    'Each',
    '2023-06-01',
    50,
    '2000-01-01',
    0,
    50,
    0,
    0,
    '2023-09-15 05:43:50',
    '2023-09-15 05:43:50',
    'NA'
  );
INSERT INTO
  `inventries` (
    `id`,
    `SKU`,
    `itemName`,
    `composition`,
    `description`,
    `unitPrice`,
    `batchNo`,
    `expiryDate`,
    `unit`,
    `dateIn`,
    `quantityIn`,
    `dateOut`,
    `quantityOut`,
    `balanceQuantity`,
    `AverageMonthlyQuantityOut`,
    `AverageWeeklyQuantityOut`,
    `createdAt`,
    `updatedAt`,
    `Currency`
  )
VALUES
  (
    17,
    'MED005',
    'Amoxicillin',
    '250mg capsule',
    'For bacterial infections',
    12.50,
    'BT202',
    '2024-04-30',
    'Each',
    '2023-06-01',
    40,
    '2000-01-01',
    0,
    40,
    0,
    0,
    '2023-09-15 05:43:50',
    '2023-09-15 05:43:50',
    'NA'
  );
INSERT INTO
  `inventries` (
    `id`,
    `SKU`,
    `itemName`,
    `composition`,
    `description`,
    `unitPrice`,
    `batchNo`,
    `expiryDate`,
    `unit`,
    `dateIn`,
    `quantityIn`,
    `dateOut`,
    `quantityOut`,
    `balanceQuantity`,
    `AverageMonthlyQuantityOut`,
    `AverageWeeklyQuantityOut`,
    `createdAt`,
    `updatedAt`,
    `Currency`
  )
VALUES
  (
    18,
    'MED006',
    'Atenolol',
    '50mg tablet',
    'For high blood pressure',
    9.25,
    'BT303',
    '2024-02-28',
    'Each',
    '2023-06-01',
    60,
    '2000-01-01',
    0,
    60,
    0,
    0,
    '2023-09-15 05:43:50',
    '2023-09-15 05:43:50',
    'NA'
  );
INSERT INTO
  `inventries` (
    `id`,
    `SKU`,
    `itemName`,
    `composition`,
    `description`,
    `unitPrice`,
    `batchNo`,
    `expiryDate`,
    `unit`,
    `dateIn`,
    `quantityIn`,
    `dateOut`,
    `quantityOut`,
    `balanceQuantity`,
    `AverageMonthlyQuantityOut`,
    `AverageWeeklyQuantityOut`,
    `createdAt`,
    `updatedAt`,
    `Currency`
  )
VALUES
  (
    19,
    'MED007',
    'Simvastatin',
    '20mg tablet',
    'For high cholesterol',
    18.50,
    'BT404',
    '2023-11-30',
    'Each',
    '2023-06-01',
    25,
    '2000-01-01',
    0,
    25,
    0,
    0,
    '2023-09-15 05:43:50',
    '2023-09-15 05:43:50',
    'NA'
  );
INSERT INTO
  `inventries` (
    `id`,
    `SKU`,
    `itemName`,
    `composition`,
    `description`,
    `unitPrice`,
    `batchNo`,
    `expiryDate`,
    `unit`,
    `dateIn`,
    `quantityIn`,
    `dateOut`,
    `quantityOut`,
    `balanceQuantity`,
    `AverageMonthlyQuantityOut`,
    `AverageWeeklyQuantityOut`,
    `createdAt`,
    `updatedAt`,
    `Currency`
  )
VALUES
  (
    20,
    'MED008',
    'Metformin',
    '500mg tablet',
    'For type 2 diabetes',
    7.75,
    'BT505',
    '2024-03-31',
    'Each',
    '2023-06-01',
    90,
    '2000-01-01',
    0,
    90,
    0,
    0,
    '2023-09-15 05:43:50',
    '2023-09-15 05:43:50',
    'NA'
  );
INSERT INTO
  `inventries` (
    `id`,
    `SKU`,
    `itemName`,
    `composition`,
    `description`,
    `unitPrice`,
    `batchNo`,
    `expiryDate`,
    `unit`,
    `dateIn`,
    `quantityIn`,
    `dateOut`,
    `quantityOut`,
    `balanceQuantity`,
    `AverageMonthlyQuantityOut`,
    `AverageWeeklyQuantityOut`,
    `createdAt`,
    `updatedAt`,
    `Currency`
  )
VALUES
  (
    21,
    'MED009',
    'Lisinopril',
    '10mg tablet',
    'For high blood pressure',
    8.25,
    'BT606',
    '2024-01-31',
    'Each',
    '2023-06-01',
    55,
    '2000-01-01',
    0,
    55,
    0,
    0,
    '2023-09-15 05:43:50',
    '2023-09-15 05:43:50',
    'NA'
  );
INSERT INTO
  `inventries` (
    `id`,
    `SKU`,
    `itemName`,
    `composition`,
    `description`,
    `unitPrice`,
    `batchNo`,
    `expiryDate`,
    `unit`,
    `dateIn`,
    `quantityIn`,
    `dateOut`,
    `quantityOut`,
    `balanceQuantity`,
    `AverageMonthlyQuantityOut`,
    `AverageWeeklyQuantityOut`,
    `createdAt`,
    `updatedAt`,
    `Currency`
  )
VALUES
  (
    22,
    'MED010',
    'Omeprazole',
    '20mg capsule',
    'For acid reflux',
    12.00,
    'BT707',
    '2024-05-31',
    'Each',
    '2023-06-01',
    70,
    '2000-01-01',
    0,
    70,
    0,
    0,
    '2023-09-15 05:43:50',
    '2023-09-15 05:43:50',
    'NA'
  );
INSERT INTO
  `inventries` (
    `id`,
    `SKU`,
    `itemName`,
    `composition`,
    `description`,
    `unitPrice`,
    `batchNo`,
    `expiryDate`,
    `unit`,
    `dateIn`,
    `quantityIn`,
    `dateOut`,
    `quantityOut`,
    `balanceQuantity`,
    `AverageMonthlyQuantityOut`,
    `AverageWeeklyQuantityOut`,
    `createdAt`,
    `updatedAt`,
    `Currency`
  )
VALUES
  (
    23,
    'MED011',
    'Morphine',
    '10mg tablet',
    'For severe pain relief',
    32.50,
    'BT808',
    '2023-09-30',
    'Each',
    '2023-06-01',
    20,
    '2000-01-01',
    0,
    20,
    0,
    0,
    '2023-09-15 05:43:50',
    '2023-09-15 05:43:50',
    'NA'
  );
INSERT INTO
  `inventries` (
    `id`,
    `SKU`,
    `itemName`,
    `composition`,
    `description`,
    `unitPrice`,
    `batchNo`,
    `expiryDate`,
    `unit`,
    `dateIn`,
    `quantityIn`,
    `dateOut`,
    `quantityOut`,
    `balanceQuantity`,
    `AverageMonthlyQuantityOut`,
    `AverageWeeklyQuantityOut`,
    `createdAt`,
    `updatedAt`,
    `Currency`
  )
VALUES
  (
    24,
    'MED012',
    'Codeine',
    '30mg tablet',
    'For mild to moderate pain relief',
    15.75,
    'BT909',
    '2023-12-31',
    'Each',
    '2023-06-01',
    35,
    '2000-01-01',
    0,
    35,
    0,
    0,
    '2023-09-15 05:43:50',
    '2023-09-15 05:43:50',
    'NA'
  );
INSERT INTO
  `inventries` (
    `id`,
    `SKU`,
    `itemName`,
    `composition`,
    `description`,
    `unitPrice`,
    `batchNo`,
    `expiryDate`,
    `unit`,
    `dateIn`,
    `quantityIn`,
    `dateOut`,
    `quantityOut`,
    `balanceQuantity`,
    `AverageMonthlyQuantityOut`,
    `AverageWeeklyQuantityOut`,
    `createdAt`,
    `updatedAt`,
    `Currency`
  )
VALUES
  (
    25,
    'MED017',
    'Haloperidol',
    '1mg tablet',
    'For schizophrenia',
    17.00,
    'BT454',
    '2023-11-30',
    'Each',
    '2023-06-01',
    30,
    '2000-01-01',
    0,
    30,
    0,
    0,
    '2023-09-15 05:43:50',
    '2023-09-15 05:43:50',
    'NA'
  );
INSERT INTO
  `inventries` (
    `id`,
    `SKU`,
    `itemName`,
    `composition`,
    `description`,
    `unitPrice`,
    `batchNo`,
    `expiryDate`,
    `unit`,
    `dateIn`,
    `quantityIn`,
    `dateOut`,
    `quantityOut`,
    `balanceQuantity`,
    `AverageMonthlyQuantityOut`,
    `AverageWeeklyQuantityOut`,
    `createdAt`,
    `updatedAt`,
    `Currency`
  )
VALUES
  (
    26,
    'MED018',
    'Quetiapine',
    '50mg tablet',
    'For bipolar disorder and schizophrenia',
    14.25,
    'BT565',
    '2024-02-28',
    'Each',
    '2023-06-01',
    50,
    '2000-01-01',
    0,
    50,
    0,
    0,
    '2023-09-15 05:43:50',
    '2023-09-15 05:43:50',
    'NA'
  );
INSERT INTO
  `inventries` (
    `id`,
    `SKU`,
    `itemName`,
    `composition`,
    `description`,
    `unitPrice`,
    `batchNo`,
    `expiryDate`,
    `unit`,
    `dateIn`,
    `quantityIn`,
    `dateOut`,
    `quantityOut`,
    `balanceQuantity`,
    `AverageMonthlyQuantityOut`,
    `AverageWeeklyQuantityOut`,
    `createdAt`,
    `updatedAt`,
    `Currency`
  )
VALUES
  (
    27,
    'MED019',
    'Risperidone',
    '2mg tablet',
    'For schizophrenia and bipolar disorder',
    16.50,
    'BT676',
    '2024-04-30',
    'Each',
    '2023-06-01',
    40,
    '2000-01-01',
    0,
    40,
    0,
    0,
    '2023-09-15 05:43:50',
    '2023-09-15 05:43:50',
    'NA'
  );
INSERT INTO
  `inventries` (
    `id`,
    `SKU`,
    `itemName`,
    `composition`,
    `description`,
    `unitPrice`,
    `batchNo`,
    `expiryDate`,
    `unit`,
    `dateIn`,
    `quantityIn`,
    `dateOut`,
    `quantityOut`,
    `balanceQuantity`,
    `AverageMonthlyQuantityOut`,
    `AverageWeeklyQuantityOut`,
    `createdAt`,
    `updatedAt`,
    `Currency`
  )
VALUES
  (
    28,
    'MED020',
    'Lorazepam',
    '1mg tablet',
    'For anxiety and panic disorders',
    10.25,
    'BT787',
    '2023-10-31',
    'Each',
    '2023-06-01',
    70,
    '2000-01-01',
    0,
    70,
    0,
    0,
    '2023-09-15 05:43:50',
    '2023-09-15 05:43:50',
    'NA'
  );
INSERT INTO
  `inventries` (
    `id`,
    `SKU`,
    `itemName`,
    `composition`,
    `description`,
    `unitPrice`,
    `batchNo`,
    `expiryDate`,
    `unit`,
    `dateIn`,
    `quantityIn`,
    `dateOut`,
    `quantityOut`,
    `balanceQuantity`,
    `AverageMonthlyQuantityOut`,
    `AverageWeeklyQuantityOut`,
    `createdAt`,
    `updatedAt`,
    `Currency`
  )
VALUES
  (
    29,
    'MED021',
    'Amitriptyline',
    '25mg tablet',
    'For depression',
    6.00,
    'BT898',
    '2023-12-31',
    'Each',
    '2023-06-01',
    120,
    '2000-01-01',
    0,
    120,
    0,
    0,
    '2023-09-15 05:43:50',
    '2023-09-15 05:43:50',
    'NA'
  );
INSERT INTO
  `inventries` (
    `id`,
    `SKU`,
    `itemName`,
    `composition`,
    `description`,
    `unitPrice`,
    `batchNo`,
    `expiryDate`,
    `unit`,
    `dateIn`,
    `quantityIn`,
    `dateOut`,
    `quantityOut`,
    `balanceQuantity`,
    `AverageMonthlyQuantityOut`,
    `AverageWeeklyQuantityOut`,
    `createdAt`,
    `updatedAt`,
    `Currency`
  )
VALUES
  (
    30,
    'MED022',
    'Trazodone',
    '50mg tablet',
    'For depression',
    7.50,
    'BT999',
    '2024-01-31',
    'Each',
    '2023-06-01',
    100,
    '2000-01-01',
    0,
    100,
    0,
    0,
    '2023-09-15 05:43:50',
    '2023-09-15 05:43:50',
    'NA'
  );
INSERT INTO
  `inventries` (
    `id`,
    `SKU`,
    `itemName`,
    `composition`,
    `description`,
    `unitPrice`,
    `batchNo`,
    `expiryDate`,
    `unit`,
    `dateIn`,
    `quantityIn`,
    `dateOut`,
    `quantityOut`,
    `balanceQuantity`,
    `AverageMonthlyQuantityOut`,
    `AverageWeeklyQuantityOut`,
    `createdAt`,
    `updatedAt`,
    `Currency`
  )
VALUES
  (
    31,
    'MED023',
    'Hydrochlorothiazide',
    '25mg tablet',
    'For high blood pressure',
    5.75,
    'BT111',
    '2024-05-31',
    'Each',
    '2023-06-01',
    150,
    '2000-01-01',
    0,
    150,
    0,
    0,
    '2023-09-15 05:43:50',
    '2023-09-15 05:43:50',
    'NA'
  );
INSERT INTO
  `inventries` (
    `id`,
    `SKU`,
    `itemName`,
    `composition`,
    `description`,
    `unitPrice`,
    `batchNo`,
    `expiryDate`,
    `unit`,
    `dateIn`,
    `quantityIn`,
    `dateOut`,
    `quantityOut`,
    `balanceQuantity`,
    `AverageMonthlyQuantityOut`,
    `AverageWeeklyQuantityOut`,
    `createdAt`,
    `updatedAt`,
    `Currency`
  )
VALUES
  (
    32,
    'MED025',
    'Heparin',
    '5000 IU injection',
    'For blood clot prevention',
    25.00,
    'HI333',
    '2023-11-30',
    'Each',
    '2023-06-01',
    15,
    '2000-01-01',
    0,
    15,
    0,
    0,
    '2023-09-15 05:43:50',
    '2023-09-15 05:43:50',
    'NA'
  );
INSERT INTO
  `inventries` (
    `id`,
    `SKU`,
    `itemName`,
    `composition`,
    `description`,
    `unitPrice`,
    `batchNo`,
    `expiryDate`,
    `unit`,
    `dateIn`,
    `quantityIn`,
    `dateOut`,
    `quantityOut`,
    `balanceQuantity`,
    `AverageMonthlyQuantityOut`,
    `AverageWeeklyQuantityOut`,
    `createdAt`,
    `updatedAt`,
    `Currency`
  )
VALUES
  (
    33,
    'MED026',
    'Insulin',
    '10mL vial',
    'For type 1 and type 2 diabetes',
    50.00,
    'IV444',
    '2024-06-30',
    'Each',
    '2023-06-01',
    100,
    '2001-02-01',
    0,
    100,
    0,
    0,
    '2023-09-15 05:43:50',
    '2023-09-15 05:43:50',
    'NA'
  );
INSERT INTO
  `inventries` (
    `id`,
    `SKU`,
    `itemName`,
    `composition`,
    `description`,
    `unitPrice`,
    `batchNo`,
    `expiryDate`,
    `unit`,
    `dateIn`,
    `quantityIn`,
    `dateOut`,
    `quantityOut`,
    `balanceQuantity`,
    `AverageMonthlyQuantityOut`,
    `AverageWeeklyQuantityOut`,
    `createdAt`,
    `updatedAt`,
    `Currency`
  )
VALUES
  (
    34,
    'MED027',
    'Epinephrine',
    '1mg injection',
    'For anaphylaxis',
    45.00,
    'IE555',
    '2023-12-31',
    'Each',
    '2023-06-01',
    5,
    '2000-01-01',
    0,
    5,
    0,
    0,
    '2023-09-15 05:43:50',
    '2023-09-15 05:43:50',
    'NA'
  );
INSERT INTO
  `inventries` (
    `id`,
    `SKU`,
    `itemName`,
    `composition`,
    `description`,
    `unitPrice`,
    `batchNo`,
    `expiryDate`,
    `unit`,
    `dateIn`,
    `quantityIn`,
    `dateOut`,
    `quantityOut`,
    `balanceQuantity`,
    `AverageMonthlyQuantityOut`,
    `AverageWeeklyQuantityOut`,
    `createdAt`,
    `updatedAt`,
    `Currency`
  )
VALUES
  (
    35,
    'MED028',
    'Atropine',
    '0.5mg injection',
    'For bradycardia',
    22.50,
    'IA666',
    '2023-10-31',
    'Each',
    '2023-06-01',
    20,
    '2000-01-01',
    0,
    20,
    0,
    0,
    '2023-09-15 05:43:50',
    '2023-09-15 05:43:50',
    'NA'
  );
INSERT INTO
  `inventries` (
    `id`,
    `SKU`,
    `itemName`,
    `composition`,
    `description`,
    `unitPrice`,
    `batchNo`,
    `expiryDate`,
    `unit`,
    `dateIn`,
    `quantityIn`,
    `dateOut`,
    `quantityOut`,
    `balanceQuantity`,
    `AverageMonthlyQuantityOut`,
    `AverageWeeklyQuantityOut`,
    `createdAt`,
    `updatedAt`,
    `Currency`
  )
VALUES
  (
    36,
    'MED029',
    'Naloxone',
    '0.4mg injection',
    'For opioid overdose',
    27.50,
    'IN777',
    '2024-02-28',
    'Each',
    '2023-06-01',
    25,
    '2000-01-01',
    0,
    25,
    0,
    0,
    '2023-09-15 05:43:50',
    '2023-09-15 05:43:50',
    'NA'
  );
INSERT INTO
  `inventries` (
    `id`,
    `SKU`,
    `itemName`,
    `composition`,
    `description`,
    `unitPrice`,
    `batchNo`,
    `expiryDate`,
    `unit`,
    `dateIn`,
    `quantityIn`,
    `dateOut`,
    `quantityOut`,
    `balanceQuantity`,
    `AverageMonthlyQuantityOut`,
    `AverageWeeklyQuantityOut`,
    `createdAt`,
    `updatedAt`,
    `Currency`
  )
VALUES
  (
    37,
    'MED030',
    'Midazolam',
    '5mg injection',
    'For sedation and anesthesia',
    35.00,
    'IM888',
    '2024-04-30',
    'Each',
    '2023-06-01',
    15,
    '2000-01-01',
    0,
    15,
    0,
    0,
    '2023-09-15 05:43:50',
    '2023-09-15 05:43:50',
    'NA'
  );
INSERT INTO
  `inventries` (
    `id`,
    `SKU`,
    `itemName`,
    `composition`,
    `description`,
    `unitPrice`,
    `batchNo`,
    `expiryDate`,
    `unit`,
    `dateIn`,
    `quantityIn`,
    `dateOut`,
    `quantityOut`,
    `balanceQuantity`,
    `AverageMonthlyQuantityOut`,
    `AverageWeeklyQuantityOut`,
    `createdAt`,
    `updatedAt`,
    `Currency`
  )
VALUES
  (
    38,
    'MED031',
    'Propofol',
    '50mg injection',
    'For sedation and anesthesia',
    75.00,
    'IP999',
    '2023-08-31',
    'Each',
    '2023-06-01',
    5,
    '2000-01-01',
    0,
    5,
    0,
    0,
    '2023-09-15 05:43:50',
    '2023-09-15 05:43:50',
    'NA'
  );
INSERT INTO
  `inventries` (
    `id`,
    `SKU`,
    `itemName`,
    `composition`,
    `description`,
    `unitPrice`,
    `batchNo`,
    `expiryDate`,
    `unit`,
    `dateIn`,
    `quantityIn`,
    `dateOut`,
    `quantityOut`,
    `balanceQuantity`,
    `AverageMonthlyQuantityOut`,
    `AverageWeeklyQuantityOut`,
    `createdAt`,
    `updatedAt`,
    `Currency`
  )
VALUES
  (
    39,
    'MED032',
    'Ceftriaxone',
    '1g injection',
    'For bacterial infections',
    40.00,
    'CE111',
    '2023-11-30',
    'Each',
    '2023-06-01',
    10,
    '2000-01-01',
    0,
    10,
    0,
    0,
    '2023-09-15 05:43:50',
    '2023-09-15 05:43:50',
    'NA'
  );
INSERT INTO
  `inventries` (
    `id`,
    `SKU`,
    `itemName`,
    `composition`,
    `description`,
    `unitPrice`,
    `batchNo`,
    `expiryDate`,
    `unit`,
    `dateIn`,
    `quantityIn`,
    `dateOut`,
    `quantityOut`,
    `balanceQuantity`,
    `AverageMonthlyQuantityOut`,
    `AverageWeeklyQuantityOut`,
    `createdAt`,
    `updatedAt`,
    `Currency`
  )
VALUES
  (
    40,
    'MED036',
    'Vancomycin',
    '500mg injection',
    'For bacterial infections',
    70.00,
    'VA555',
    '2023-12-31',
    'Each',
    '2023-06-01',
    15,
    '2000-01-01',
    0,
    15,
    0,
    0,
    '2023-09-15 05:43:50',
    '2023-09-15 05:43:50',
    'NA'
  );
INSERT INTO
  `inventries` (
    `id`,
    `SKU`,
    `itemName`,
    `composition`,
    `description`,
    `unitPrice`,
    `batchNo`,
    `expiryDate`,
    `unit`,
    `dateIn`,
    `quantityIn`,
    `dateOut`,
    `quantityOut`,
    `balanceQuantity`,
    `AverageMonthlyQuantityOut`,
    `AverageWeeklyQuantityOut`,
    `createdAt`,
    `updatedAt`,
    `Currency`
  )
VALUES
  (
    42,
    'MED037',
    'Azithromycin',
    '500mg tablet',
    'For bacterial infections',
    22.50,
    'AZ666',
    '2024-06-30',
    'Each',
    '2023-06-01',
    30,
    '2000-01-01',
    0,
    30,
    0,
    0,
    '2023-10-18 10:17:13',
    '2023-10-18 10:17:13',
    'NA'
  );
INSERT INTO
  `inventries` (
    `id`,
    `SKU`,
    `itemName`,
    `composition`,
    `description`,
    `unitPrice`,
    `batchNo`,
    `expiryDate`,
    `unit`,
    `dateIn`,
    `quantityIn`,
    `dateOut`,
    `quantityOut`,
    `balanceQuantity`,
    `AverageMonthlyQuantityOut`,
    `AverageWeeklyQuantityOut`,
    `createdAt`,
    `updatedAt`,
    `Currency`
  )
VALUES
  (
    43,
    'SKU0101',
    'Tylenol',
    'NA',
    'NA',
    20.00,
    'BT0101',
    '2024-05-18',
    'tablets',
    '2024-01-13',
    100,
    '2024-01-28',
    2,
    98,
    0,
    0,
    '2024-01-13 07:23:41',
    '2024-01-28 11:34:15',
    'USD'
  );
INSERT INTO
  `inventries` (
    `id`,
    `SKU`,
    `itemName`,
    `composition`,
    `description`,
    `unitPrice`,
    `batchNo`,
    `expiryDate`,
    `unit`,
    `dateIn`,
    `quantityIn`,
    `dateOut`,
    `quantityOut`,
    `balanceQuantity`,
    `AverageMonthlyQuantityOut`,
    `AverageWeeklyQuantityOut`,
    `createdAt`,
    `updatedAt`,
    `Currency`
  )
VALUES
  (
    44,
    'jbkhb',
    'medicine2',
    'hbuoyhgbu',
    'kjhvbk',
    10.00,
    'kjhbkj',
    '2024-01-29',
    'mhjghb',
    '2024-01-28',
    10,
    '2024-01-28',
    0,
    10,
    0,
    0,
    '2024-01-28 05:11:19',
    '2024-01-28 05:11:19',
    'USD'
  );
INSERT INTO
  `inventries` (
    `id`,
    `SKU`,
    `itemName`,
    `composition`,
    `description`,
    `unitPrice`,
    `batchNo`,
    `expiryDate`,
    `unit`,
    `dateIn`,
    `quantityIn`,
    `dateOut`,
    `quantityOut`,
    `balanceQuantity`,
    `AverageMonthlyQuantityOut`,
    `AverageWeeklyQuantityOut`,
    `createdAt`,
    `updatedAt`,
    `Currency`
  )
VALUES
  (
    45,
    'blbhlibh',
    'Zinetac 150mg Tablet',
    'Ranitidine (150mg)',
    'Zinetac 150mg Tablet is a medicine that reduces the amount of acid your stomach makes. It is used to treat and prevent heartburn, indigestion, and other symptoms caused by too much acid in the stomach. It is also used to treat and prevent stomach ulcers, reflux disease, and some rarer conditions. Zinetac 150mg Tablet is also commonly prescribed to prevent stomach ulcers and heartburn seen with the use of painkillers. The medicine must be taken in dose and duration as prescribed by the doctor. How much you need, and how often you take it, will depend on what you are being treated for. Follow the advice of your doctor. This medicine should relieve indigestion and heartburn within a few hours and you may only need to take it for a short time when you have symptoms. If you are taking it to prevent ulcers and other conditions you may need to take it for longer. You should keep taking it regularly to prevent problems from happening in the future. You may be able to help improve your symptoms by eating smaller meals more often and avoiding spicy or fatty foods. Most people who take it do not have any side effects but the most common include headache, constipation, feeling drowsy or tired, and diarrhea. If you do get a side effect, it is usually mild and will go away when you stop taking this medicine or as you adjust to it. Consult your doctor if any of these side effects bother you or do not go away. Before taking it, you should tell your doctor if you have any kidney or liver problems. This may affect the dose or suitability of this medicine. Also tell your doctor what other medicines you are taking as some may affect, or be affected by, this medicine. This medicine is usually considered safe to take during pregnancy and breastfeeding if it has been prescribed by a doctor. Avoid drinking alcohol as this can increase the amount of acid in your stomach and make your symptoms worse',
    100.00,
    'BT01',
    '2025-10-21',
    'NA',
    '2024-01-28',
    100,
    '2024-01-28',
    2,
    98,
    0,
    0,
    '2024-01-28 09:39:39',
    '2024-01-28 11:34:15',
    'EUR'
  );
INSERT INTO
  `inventries` (
    `id`,
    `SKU`,
    `itemName`,
    `composition`,
    `description`,
    `unitPrice`,
    `batchNo`,
    `expiryDate`,
    `unit`,
    `dateIn`,
    `quantityIn`,
    `dateOut`,
    `quantityOut`,
    `balanceQuantity`,
    `AverageMonthlyQuantityOut`,
    `AverageWeeklyQuantityOut`,
    `createdAt`,
    `updatedAt`,
    `Currency`
  )
VALUES
  (
    46,
    'SKU123',
    'sumo cold',
    'Cold',
    'cold',
    5.00,
    'Batch0011',
    '2024-10-10',
    'Tablet',
    '2023-08-26',
    100,
    '2023-12-09',
    0,
    100,
    0,
    0,
    '2024-02-06 10:13:32',
    '2024-02-06 10:13:32',
    'USD'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: jhnew27resultmodels
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: labcategorylists
# ------------------------------------------------------------

INSERT INTO
  `labcategorylists` (
    `id`,
    `CategoryName`,
    `LabCode`,
    `Status`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    1,
    'Biochemistry',
    'BC001',
    'In-Active',
    '2023-11-07 09:36:18',
    '2024-01-16 06:24:57'
  );
INSERT INTO
  `labcategorylists` (
    `id`,
    `CategoryName`,
    `LabCode`,
    `Status`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    4,
    'Hematology',
    'HT01',
    'Active',
    '2023-11-09 07:35:26',
    '2024-01-29 08:57:46'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: lipidprofilemodels
# ------------------------------------------------------------

INSERT INTO
  `lipidprofilemodels` (
    `id`,
    `PatientID`,
    `TestManagementID`,
    `PatientTestBookingID`,
    `Sr_Cholesterol`,
    `HDL_Cholesterol`,
    `Sr_Triglycerides`,
    `LDL_Cholesterol`,
    `VLDL`,
    `Cholesterol_HDL`,
    `LDL_HDL`,
    `resultDate`,
    `Remarks`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    1,
    2,
    9,
    13,
    '210.4',
    '38.7',
    '178',
    '136.10',
    '35.60',
    '5.44',
    '3.52',
    '2023-09-03T11:56:58.597Z',
    'NA',
    '2023-09-03 12:01:45',
    '2023-09-03 12:01:45'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: lipidprofileresultmodels
# ------------------------------------------------------------

INSERT INTO
  `lipidprofileresultmodels` (
    `id`,
    `PatientID`,
    `TestManagementID`,
    `PatientTestBookingID`,
    `Sr_Cholesterol`,
    `HDL_Cholesterol`,
    `Sr_Triglycerides`,
    `LDL_Cholesterol`,
    `VLDL`,
    `Cholesterol_HDL`,
    `LDL_HDL`,
    `createdAt`,
    `updatedAt`,
    `Comment`
  )
VALUES
  (
    1,
    2,
    9,
    13,
    '210.4',
    '38.7',
    '178',
    '136.10',
    '35.60',
    '5.44',
    '3.52',
    '2023-09-07 15:12:46',
    '2023-09-07 15:12:46',
    NULL
  );
INSERT INTO
  `lipidprofileresultmodels` (
    `id`,
    `PatientID`,
    `TestManagementID`,
    `PatientTestBookingID`,
    `Sr_Cholesterol`,
    `HDL_Cholesterol`,
    `Sr_Triglycerides`,
    `LDL_Cholesterol`,
    `VLDL`,
    `Cholesterol_HDL`,
    `LDL_HDL`,
    `createdAt`,
    `updatedAt`,
    `Comment`
  )
VALUES
  (
    2,
    15,
    9,
    30,
    '6789',
    '12345',
    'qaswdefrgthyj',
    '12345',
    NULL,
    NULL,
    NULL,
    '2023-09-18 10:08:08',
    '2023-09-18 10:08:08',
    NULL
  );
INSERT INTO
  `lipidprofileresultmodels` (
    `id`,
    `PatientID`,
    `TestManagementID`,
    `PatientTestBookingID`,
    `Sr_Cholesterol`,
    `HDL_Cholesterol`,
    `Sr_Triglycerides`,
    `LDL_Cholesterol`,
    `VLDL`,
    `Cholesterol_HDL`,
    `LDL_HDL`,
    `createdAt`,
    `updatedAt`,
    `Comment`
  )
VALUES
  (
    3,
    15,
    9,
    37,
    NULL,
    NULL,
    NULL,
    'dfcgvbhnjmkmjnh',
    'dcyfvuygbuhnj',
    'hgfdxdcfvgbh',
    'njbhgvfcdxsdc',
    '2023-09-18 10:45:22',
    '2023-09-18 10:45:22',
    NULL
  );
INSERT INTO
  `lipidprofileresultmodels` (
    `id`,
    `PatientID`,
    `TestManagementID`,
    `PatientTestBookingID`,
    `Sr_Cholesterol`,
    `HDL_Cholesterol`,
    `Sr_Triglycerides`,
    `LDL_Cholesterol`,
    `VLDL`,
    `Cholesterol_HDL`,
    `LDL_HDL`,
    `createdAt`,
    `updatedAt`,
    `Comment`
  )
VALUES
  (
    4,
    10,
    9,
    27,
    '11',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    '2023-09-21 22:38:49',
    '2023-09-21 22:38:49',
    NULL
  );
INSERT INTO
  `lipidprofileresultmodels` (
    `id`,
    `PatientID`,
    `TestManagementID`,
    `PatientTestBookingID`,
    `Sr_Cholesterol`,
    `HDL_Cholesterol`,
    `Sr_Triglycerides`,
    `LDL_Cholesterol`,
    `VLDL`,
    `Cholesterol_HDL`,
    `LDL_HDL`,
    `createdAt`,
    `updatedAt`,
    `Comment`
  )
VALUES
  (
    5,
    16,
    9,
    40,
    '7654567',
    '6578',
    '6567',
    '865',
    '76',
    '57',
    '657',
    '2023-09-22 18:16:23',
    '2023-09-22 18:16:23',
    NULL
  );
INSERT INTO
  `lipidprofileresultmodels` (
    `id`,
    `PatientID`,
    `TestManagementID`,
    `PatientTestBookingID`,
    `Sr_Cholesterol`,
    `HDL_Cholesterol`,
    `Sr_Triglycerides`,
    `LDL_Cholesterol`,
    `VLDL`,
    `Cholesterol_HDL`,
    `LDL_HDL`,
    `createdAt`,
    `updatedAt`,
    `Comment`
  )
VALUES
  (
    6,
    14,
    9,
    43,
    '12',
    '1234',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    '2023-09-23 08:47:39',
    '2023-09-23 08:47:39',
    NULL
  );
INSERT INTO
  `lipidprofileresultmodels` (
    `id`,
    `PatientID`,
    `TestManagementID`,
    `PatientTestBookingID`,
    `Sr_Cholesterol`,
    `HDL_Cholesterol`,
    `Sr_Triglycerides`,
    `LDL_Cholesterol`,
    `VLDL`,
    `Cholesterol_HDL`,
    `LDL_HDL`,
    `createdAt`,
    `updatedAt`,
    `Comment`
  )
VALUES
  (
    7,
    18,
    9,
    46,
    '12',
    '123',
    '2323',
    NULL,
    NULL,
    NULL,
    NULL,
    '2023-09-23 08:55:33',
    '2023-09-23 08:55:33',
    NULL
  );
INSERT INTO
  `lipidprofileresultmodels` (
    `id`,
    `PatientID`,
    `TestManagementID`,
    `PatientTestBookingID`,
    `Sr_Cholesterol`,
    `HDL_Cholesterol`,
    `Sr_Triglycerides`,
    `LDL_Cholesterol`,
    `VLDL`,
    `Cholesterol_HDL`,
    `LDL_HDL`,
    `createdAt`,
    `updatedAt`,
    `Comment`
  )
VALUES
  (
    8,
    28,
    1,
    54,
    'bl',
    'blj',
    'bl',
    'jbljh',
    'blj',
    'hb',
    'l',
    '2023-10-17 20:40:47',
    '2023-10-17 20:40:47',
    NULL
  );
INSERT INTO
  `lipidprofileresultmodels` (
    `id`,
    `PatientID`,
    `TestManagementID`,
    `PatientTestBookingID`,
    `Sr_Cholesterol`,
    `HDL_Cholesterol`,
    `Sr_Triglycerides`,
    `LDL_Cholesterol`,
    `VLDL`,
    `Cholesterol_HDL`,
    `LDL_HDL`,
    `createdAt`,
    `updatedAt`,
    `Comment`
  )
VALUES
  (
    9,
    29,
    1,
    55,
    'jbjhb',
    'jhb',
    'jh',
    'b',
    'lkb',
    'j',
    NULL,
    '2023-10-20 08:06:16',
    '2023-10-20 08:06:16',
    'hjbkj'
  );
INSERT INTO
  `lipidprofileresultmodels` (
    `id`,
    `PatientID`,
    `TestManagementID`,
    `PatientTestBookingID`,
    `Sr_Cholesterol`,
    `HDL_Cholesterol`,
    `Sr_Triglycerides`,
    `LDL_Cholesterol`,
    `VLDL`,
    `Cholesterol_HDL`,
    `LDL_HDL`,
    `createdAt`,
    `updatedAt`,
    `Comment`
  )
VALUES
  (
    10,
    37,
    1,
    97,
    '123',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    '2023-10-25 17:30:16',
    '2023-10-25 17:30:16',
    NULL
  );
INSERT INTO
  `lipidprofileresultmodels` (
    `id`,
    `PatientID`,
    `TestManagementID`,
    `PatientTestBookingID`,
    `Sr_Cholesterol`,
    `HDL_Cholesterol`,
    `Sr_Triglycerides`,
    `LDL_Cholesterol`,
    `VLDL`,
    `Cholesterol_HDL`,
    `LDL_HDL`,
    `createdAt`,
    `updatedAt`,
    `Comment`
  )
VALUES
  (
    11,
    37,
    1,
    98,
    '765',
    '123',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    '2023-10-25 17:35:28',
    '2023-10-25 17:35:28',
    NULL
  );
INSERT INTO
  `lipidprofileresultmodels` (
    `id`,
    `PatientID`,
    `TestManagementID`,
    `PatientTestBookingID`,
    `Sr_Cholesterol`,
    `HDL_Cholesterol`,
    `Sr_Triglycerides`,
    `LDL_Cholesterol`,
    `VLDL`,
    `Cholesterol_HDL`,
    `LDL_HDL`,
    `createdAt`,
    `updatedAt`,
    `Comment`
  )
VALUES
  (
    12,
    37,
    1,
    102,
    '12',
    '12',
    '12',
    NULL,
    NULL,
    NULL,
    NULL,
    '2023-10-25 18:36:21',
    '2023-10-25 18:36:21',
    NULL
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: medicationdays
# ------------------------------------------------------------

INSERT INTO
  `medicationdays` (
    `id`,
    `PatientId`,
    `PrescriptionId`,
    `medicineId`,
    `medicineName`,
    `dosageAmount`,
    `food`,
    `morningTime`,
    `afternoonTime`,
    `eveningTime`,
    `nightTime`,
    `date`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    1,
    6,
    1,
    1,
    'Sumo cold',
    '1M',
    'After Food',
    '10:00:00',
    '00:00:00',
    '00:00:00',
    '00:00:00',
    '2023-10-19',
    '2023-10-15 08:38:54',
    '2023-10-15 08:38:54'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: medicineadministrationreports
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: medicines
# ------------------------------------------------------------

INSERT INTO
  `medicines` (
    `id`,
    `prescriptionId`,
    `prescription_Id`,
    `patient_Id`,
    `InventoryitemNameID`,
    `medicineName`,
    `quantity`,
    `dosageAmount`,
    `startDate`,
    `food`,
    `weekly`,
    `timing`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    1,
    'P6/20231013/175219',
    1,
    6,
    0,
    'Sumo cold',
    1,
    '1M',
    '2023-10-13',
    'After Food',
    'NA',
    '',
    '2023-10-13 12:22:20',
    '2023-10-13 12:22:20'
  );
INSERT INTO
  `medicines` (
    `id`,
    `prescriptionId`,
    `prescription_Id`,
    `patient_Id`,
    `InventoryitemNameID`,
    `medicineName`,
    `quantity`,
    `dosageAmount`,
    `startDate`,
    `food`,
    `weekly`,
    `timing`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    2,
    'P22/20231017/133434',
    NULL,
    22,
    0,
    'Cold Cough',
    10,
    '1M',
    '2023-10-17',
    'NA',
    '10',
    '',
    '2023-10-17 08:04:35',
    '2023-10-17 08:04:35'
  );
INSERT INTO
  `medicines` (
    `id`,
    `prescriptionId`,
    `prescription_Id`,
    `patient_Id`,
    `InventoryitemNameID`,
    `medicineName`,
    `quantity`,
    `dosageAmount`,
    `startDate`,
    `food`,
    `weekly`,
    `timing`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    3,
    'P37/20231024/141742',
    3,
    37,
    0,
    'sumo cold',
    10,
    '1M',
    '2023-10-24',
    'After Food',
    '10',
    '',
    '2023-10-24 08:47:42',
    '2023-10-24 08:47:42'
  );
INSERT INTO
  `medicines` (
    `id`,
    `prescriptionId`,
    `prescription_Id`,
    `patient_Id`,
    `InventoryitemNameID`,
    `medicineName`,
    `quantity`,
    `dosageAmount`,
    `startDate`,
    `food`,
    `weekly`,
    `timing`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    4,
    'P37/20231024/141959',
    4,
    37,
    0,
    'sumo cold',
    10,
    '1M',
    '2023-10-24',
    'After Food',
    '10',
    '',
    '2023-10-24 08:49:59',
    '2023-10-24 08:49:59'
  );
INSERT INTO
  `medicines` (
    `id`,
    `prescriptionId`,
    `prescription_Id`,
    `patient_Id`,
    `InventoryitemNameID`,
    `medicineName`,
    `quantity`,
    `dosageAmount`,
    `startDate`,
    `food`,
    `weekly`,
    `timing`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    5,
    'P37/20231024/142221',
    5,
    37,
    0,
    'Sumo cold',
    11,
    '1M',
    '2023-10-24',
    'After food',
    '11',
    '',
    '2023-10-24 08:52:22',
    '2023-10-24 08:52:22'
  );
INSERT INTO
  `medicines` (
    `id`,
    `prescriptionId`,
    `prescription_Id`,
    `patient_Id`,
    `InventoryitemNameID`,
    `medicineName`,
    `quantity`,
    `dosageAmount`,
    `startDate`,
    `food`,
    `weekly`,
    `timing`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    6,
    'P37/20231024/142422',
    6,
    37,
    0,
    'sumo cold',
    10,
    '1M',
    '2023-10-24',
    'after food',
    '10',
    '',
    '2023-10-24 08:54:24',
    '2023-10-24 08:54:24'
  );
INSERT INTO
  `medicines` (
    `id`,
    `prescriptionId`,
    `prescription_Id`,
    `patient_Id`,
    `InventoryitemNameID`,
    `medicineName`,
    `quantity`,
    `dosageAmount`,
    `startDate`,
    `food`,
    `weekly`,
    `timing`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    7,
    'P39/20240111/144022',
    7,
    39,
    0,
    'sumo cold',
    10,
    '1M',
    '2024-01-11',
    'NA',
    '10',
    '',
    '2024-01-11 09:10:24',
    '2024-01-11 09:10:24'
  );
INSERT INTO
  `medicines` (
    `id`,
    `prescriptionId`,
    `prescription_Id`,
    `patient_Id`,
    `InventoryitemNameID`,
    `medicineName`,
    `quantity`,
    `dosageAmount`,
    `startDate`,
    `food`,
    `weekly`,
    `timing`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    8,
    'P40/20240112/084458',
    8,
    40,
    0,
    'Sumo cold',
    10,
    '1M',
    '2024-01-12',
    'NA',
    '10',
    '',
    '2024-01-12 03:15:00',
    '2024-01-15 16:44:52'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: nanresultmodeldiagnostics
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: new101resultmodels
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: new19resultmodeldiagnostics
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: new25testresultmodels
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: newtest26resultmodels
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: newtestresultmodeldiagnostics
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: newtestresultmodels
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: nurses
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: nw31resultmodels
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: otnameandnumbers
# ------------------------------------------------------------

INSERT INTO
  `otnameandnumbers` (`id`, `OTName`, `OTNumber`, `createdAt`, `updatedAt`)
VALUES
  (
    1,
    'OT01',
    1,
    '2023-08-31 04:18:58',
    '2023-09-08 03:14:26'
  );
INSERT INTO
  `otnameandnumbers` (`id`, `OTName`, `OTNumber`, `createdAt`, `updatedAt`)
VALUES
  (
    2,
    'OT022',
    2,
    '2023-08-31 04:19:12',
    '2023-11-10 07:31:53'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: otschedulepatients
# ------------------------------------------------------------

INSERT INTO
  `otschedulepatients` (
    `id`,
    `otDateTime`,
    `UpToOtTime`,
    `patientName`,
    `patientId`,
    `patientContactNumber`,
    `guardianName`,
    `guardianContactNo`,
    `diagnosis`,
    `typeOfSurgery`,
    `surgeonName`,
    `surgeonEmail`,
    `external`,
    `OTName`,
    `anesthetistAssistantName`,
    `anesthesia`,
    `scrubNurseName`,
    `remarks`,
    `otAssistantName`,
    `procedure`,
    `anesthetistDoctorName`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    1,
    '10/18/2023, 03:45 PM',
    '10/18/2023, 04:45 PM',
    'Asha Yadav',
    28,
    9876543213,
    'Jai Kumar',
    8976544567,
    'Na',
    'Na',
    'Rajesh  Kumar',
    'rajesh02@gmail.com',
    'no',
    'OT01',
    'NA',
    'N',
    'NA',
    'NA',
    'NA',
    'NA',
    'NA',
    '2023-10-18 10:57:41',
    '2023-10-18 10:57:46',
    0
  );
INSERT INTO
  `otschedulepatients` (
    `id`,
    `otDateTime`,
    `UpToOtTime`,
    `patientName`,
    `patientId`,
    `patientContactNumber`,
    `guardianName`,
    `guardianContactNo`,
    `diagnosis`,
    `typeOfSurgery`,
    `surgeonName`,
    `surgeonEmail`,
    `external`,
    `OTName`,
    `anesthetistAssistantName`,
    `anesthesia`,
    `scrubNurseName`,
    `remarks`,
    `otAssistantName`,
    `procedure`,
    `anesthetistDoctorName`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    2,
    '10/26/2023, 05:00 PM',
    '10/26/2023, 5:30 PM',
    'Deepak Singh',
    36,
    9876543212,
    'Deepak S',
    6655443764,
    'NA',
    'NA',
    'Rajesh  Kumar',
    'rajesh@gmail.com',
    'no',
    'OT02',
    'NA',
    'NA',
    'NA',
    'NA',
    '',
    'NA',
    'NA',
    '2023-10-26 11:27:31',
    '2023-10-26 11:27:31',
    0
  );
INSERT INTO
  `otschedulepatients` (
    `id`,
    `otDateTime`,
    `UpToOtTime`,
    `patientName`,
    `patientId`,
    `patientContactNumber`,
    `guardianName`,
    `guardianContactNo`,
    `diagnosis`,
    `typeOfSurgery`,
    `surgeonName`,
    `surgeonEmail`,
    `external`,
    `OTName`,
    `anesthetistAssistantName`,
    `anesthesia`,
    `scrubNurseName`,
    `remarks`,
    `otAssistantName`,
    `procedure`,
    `anesthetistDoctorName`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    3,
    '01/27/2024, 01:30 PM',
    '01/27/2024, 01:30 PM',
    'Mr Nitesh Giri',
    40,
    7876598397,
    'mjhbkjh',
    7646575675,
    'guuygkuyguyg',
    'yguyugujy',
    'kjbygjhb',
    'new@gmail.com',
    'yes',
    'OT01',
    'fvff',
    'jyfgjygfuk',
    'gfjuygjuyg',
    'juyygjuygf',
    '67yutgyugh',
    'ghgfjyfhv',
    'jufjuuyfjuyg',
    '2024-01-27 07:50:42',
    '2024-01-27 07:51:01',
    1
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: pathologisttestbookingappointments
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: pathologytestmanages
# ------------------------------------------------------------

INSERT INTO
  `pathologytestmanages` (
    `id`,
    `testName`,
    `code`,
    `description`,
    `createdAt`,
    `updatedAt`,
    `category`,
    `testPrice`,
    `LabCategoryName`,
    `LabCategoryNameID`,
    `SpecimenName`,
    `SpecimenNameID`,
    `Currency`
  )
VALUES
  (
    2,
    'T3 T4 TSH',
    'TSH01',
    'T3 T4 TSH',
    '2023-08-31 12:39:33',
    '2023-10-18 10:12:53',
    'Thyroid',
    100,
    '',
    0,
    '',
    0,
    'USD'
  );
INSERT INTO
  `pathologytestmanages` (
    `id`,
    `testName`,
    `code`,
    `description`,
    `createdAt`,
    `updatedAt`,
    `category`,
    `testPrice`,
    `LabCategoryName`,
    `LabCategoryNameID`,
    `SpecimenName`,
    `SpecimenNameID`,
    `Currency`
  )
VALUES
  (
    10,
    'Platelet Count',
    'PC01',
    'PLATELET COUNT',
    '2023-08-31 12:41:36',
    '2023-10-27 06:47:37',
    'Platelet Count',
    100,
    '',
    0,
    '',
    0,
    'USD'
  );
INSERT INTO
  `pathologytestmanages` (
    `id`,
    `testName`,
    `code`,
    `description`,
    `createdAt`,
    `updatedAt`,
    `category`,
    `testPrice`,
    `LabCategoryName`,
    `LabCategoryNameID`,
    `SpecimenName`,
    `SpecimenNameID`,
    `Currency`
  )
VALUES
  (
    11,
    'Blood Sugar For Fasting',
    'BSF01',
    'BLOOD SUGAR FOR FASTING',
    '2023-08-31 12:42:12',
    '2023-11-09 06:24:48',
    'Blood Sugar',
    180,
    'Biochemistry',
    1,
    'Blood',
    1,
    'USD'
  );
INSERT INTO
  `pathologytestmanages` (
    `id`,
    `testName`,
    `code`,
    `description`,
    `createdAt`,
    `updatedAt`,
    `category`,
    `testPrice`,
    `LabCategoryName`,
    `LabCategoryNameID`,
    `SpecimenName`,
    `SpecimenNameID`,
    `Currency`
  )
VALUES
  (
    12,
    'Blood Sugar For PP',
    'BS-PP',
    'BLOOD SUGAR FOR PP',
    '2023-08-31 12:42:33',
    '2023-11-09 06:24:58',
    'Blood Sugar',
    200,
    'Biochemistry',
    1,
    'Blood',
    1,
    'USD'
  );
INSERT INTO
  `pathologytestmanages` (
    `id`,
    `testName`,
    `code`,
    `description`,
    `createdAt`,
    `updatedAt`,
    `category`,
    `testPrice`,
    `LabCategoryName`,
    `LabCategoryNameID`,
    `SpecimenName`,
    `SpecimenNameID`,
    `Currency`
  )
VALUES
  (
    20,
    'NEW TEST',
    'NA01',
    'NA',
    '2023-11-09 06:03:01',
    '2023-11-09 06:03:01',
    'Vitals',
    1000,
    'Biochemistry',
    1,
    'Blood',
    1,
    'USD'
  );
INSERT INTO
  `pathologytestmanages` (
    `id`,
    `testName`,
    `code`,
    `description`,
    `createdAt`,
    `updatedAt`,
    `category`,
    `testPrice`,
    `LabCategoryName`,
    `LabCategoryNameID`,
    `SpecimenName`,
    `SpecimenNameID`,
    `Currency`
  )
VALUES
  (
    23,
    'Lipid Profile',
    'LP01',
    'NA',
    '2023-11-09 06:39:59',
    '2023-11-09 06:39:59',
    'Vitamin',
    1000,
    'Biochemistry',
    1,
    'Blood',
    1,
    'USD'
  );
INSERT INTO
  `pathologytestmanages` (
    `id`,
    `testName`,
    `code`,
    `description`,
    `createdAt`,
    `updatedAt`,
    `category`,
    `testPrice`,
    `LabCategoryName`,
    `LabCategoryNameID`,
    `SpecimenName`,
    `SpecimenNameID`,
    `Currency`
  )
VALUES
  (
    30,
    'bhkjhb',
    'kjbkjb',
    'kb k',
    '2024-01-13 08:47:29',
    '2024-01-13 08:47:28',
    'Vitals',
    99,
    'Biochemistry',
    1,
    'Blood',
    1,
    'USD'
  );
INSERT INTO
  `pathologytestmanages` (
    `id`,
    `testName`,
    `code`,
    `description`,
    `createdAt`,
    `updatedAt`,
    `category`,
    `testPrice`,
    `LabCategoryName`,
    `LabCategoryNameID`,
    `SpecimenName`,
    `SpecimenNameID`,
    `Currency`
  )
VALUES
  (
    31,
    'test demo',
    'TS01',
    'NA',
    '2024-01-28 03:27:04',
    '2024-01-28 03:27:04',
    'Blood',
    100,
    'Biochemistry',
    1,
    'Blood',
    1,
    'USD'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: pathologytestreferrals
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: pathologytests
# ------------------------------------------------------------

INSERT INTO
  `pathologytests` (
    `id`,
    `PatientName`,
    `Address`,
    `PatientPhoneNo`,
    `status`,
    `lapName`,
    `remarks`,
    `instrumentsUsed`,
    `testFees`,
    `createdAt`,
    `updatedAt`,
    `PatientID`,
    `results`,
    `selectedTests`,
    `TestManagementID`,
    `doctorId`,
    `DoctorPhone`,
    `DoctorName`,
    `commissionType`,
    `commissionValue`,
    `PaymentStatus`,
    `PaymentDate`,
    `TestManagementIDs`,
    `DoctorEmail`,
    `Authorization`,
    `feedback`,
    `selectedPackageID`,
    `CorporateID`,
    `PackageName`,
    `PackagePrice`,
    `TotalFees`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    27,
    'Amrut  B.',
    'Null',
    8765456789,
    'Completed',
    'NA',
    'NA',
    '',
    1000.00,
    '2023-09-13 02:49:30',
    '2023-10-19 09:37:56',
    10,
    'pending',
    'Lipid Profile, Platelet Count',
    9,
    1,
    8765678976,
    'Rajesh Kumar',
    '2',
    'A',
    'Not-Paid',
    NULL,
    NULL,
    'rajesh@gmail.com',
    'Pending',
    NULL,
    NULL,
    NULL,
    'NA',
    0,
    NULL,
    NULL,
    0,
    'Pathology'
  );
INSERT INTO
  `pathologytests` (
    `id`,
    `PatientName`,
    `Address`,
    `PatientPhoneNo`,
    `status`,
    `lapName`,
    `remarks`,
    `instrumentsUsed`,
    `testFees`,
    `createdAt`,
    `updatedAt`,
    `PatientID`,
    `results`,
    `selectedTests`,
    `TestManagementID`,
    `doctorId`,
    `DoctorPhone`,
    `DoctorName`,
    `commissionType`,
    `commissionValue`,
    `PaymentStatus`,
    `PaymentDate`,
    `TestManagementIDs`,
    `DoctorEmail`,
    `Authorization`,
    `feedback`,
    `selectedPackageID`,
    `CorporateID`,
    `PackageName`,
    `PackagePrice`,
    `TotalFees`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    39,
    'Gangesh  Kumar',
    'Null',
    6543245675,
    'Completed',
    'NA',
    'NA',
    '',
    1000.00,
    '2023-09-18 10:14:41',
    '2023-10-19 09:37:51',
    15,
    'pending',
    'Platelet Count, Blood Sugar For Fasting',
    11,
    1,
    8765678976,
    'Rajesh Kumar',
    '2',
    'A',
    'Paid',
    '2023-09-21',
    NULL,
    'rajesh@gmail.com',
    'Pending',
    NULL,
    NULL,
    NULL,
    'NA',
    0,
    NULL,
    NULL,
    0,
    'Pathology'
  );
INSERT INTO
  `pathologytests` (
    `id`,
    `PatientName`,
    `Address`,
    `PatientPhoneNo`,
    `status`,
    `lapName`,
    `remarks`,
    `instrumentsUsed`,
    `testFees`,
    `createdAt`,
    `updatedAt`,
    `PatientID`,
    `results`,
    `selectedTests`,
    `TestManagementID`,
    `doctorId`,
    `DoctorPhone`,
    `DoctorName`,
    `commissionType`,
    `commissionValue`,
    `PaymentStatus`,
    `PaymentDate`,
    `TestManagementIDs`,
    `DoctorEmail`,
    `Authorization`,
    `feedback`,
    `selectedPackageID`,
    `CorporateID`,
    `PackageName`,
    `PackagePrice`,
    `TotalFees`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    40,
    'Vijay  Kumar',
    'Null',
    7896785674,
    'Completed',
    ' ',
    'NA',
    NULL,
    100.00,
    '2023-09-18 16:46:34',
    '2023-09-22 17:43:53',
    16,
    'pending',
    'Lipid Profile, Platelet Count',
    9,
    1,
    8765456789,
    'Rajesh NA Kumar',
    '4',
    'B',
    'Paid',
    '2023-10-01',
    '9,10,12',
    'rajesh@gmail.com',
    'Approved',
    'NA',
    NULL,
    NULL,
    'NA',
    0,
    NULL,
    NULL,
    0,
    'Pathology'
  );
INSERT INTO
  `pathologytests` (
    `id`,
    `PatientName`,
    `Address`,
    `PatientPhoneNo`,
    `status`,
    `lapName`,
    `remarks`,
    `instrumentsUsed`,
    `testFees`,
    `createdAt`,
    `updatedAt`,
    `PatientID`,
    `results`,
    `selectedTests`,
    `TestManagementID`,
    `doctorId`,
    `DoctorPhone`,
    `DoctorName`,
    `commissionType`,
    `commissionValue`,
    `PaymentStatus`,
    `PaymentDate`,
    `TestManagementIDs`,
    `DoctorEmail`,
    `Authorization`,
    `feedback`,
    `selectedPackageID`,
    `CorporateID`,
    `PackageName`,
    `PackagePrice`,
    `TotalFees`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    41,
    'Admin two Patient',
    'Null',
    7654356788,
    'Completed',
    ' ',
    'NA',
    NULL,
    0.00,
    '2023-09-21 06:08:39',
    '2023-10-19 09:37:46',
    18,
    'pending',
    'Platelet Count, T3 T4 TSH',
    8,
    6,
    0,
    'NA NA',
    '4',
    'B',
    'Not-Paid',
    NULL,
    '8,10',
    'lucky@gmail.com',
    'Pending',
    NULL,
    NULL,
    NULL,
    'NA',
    0,
    NULL,
    NULL,
    0,
    'Pathology'
  );
INSERT INTO
  `pathologytests` (
    `id`,
    `PatientName`,
    `Address`,
    `PatientPhoneNo`,
    `status`,
    `lapName`,
    `remarks`,
    `instrumentsUsed`,
    `testFees`,
    `createdAt`,
    `updatedAt`,
    `PatientID`,
    `results`,
    `selectedTests`,
    `TestManagementID`,
    `doctorId`,
    `DoctorPhone`,
    `DoctorName`,
    `commissionType`,
    `commissionValue`,
    `PaymentStatus`,
    `PaymentDate`,
    `TestManagementIDs`,
    `DoctorEmail`,
    `Authorization`,
    `feedback`,
    `selectedPackageID`,
    `CorporateID`,
    `PackageName`,
    `PackagePrice`,
    `TotalFees`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    50,
    'Vaibhav  Pande',
    'Null',
    8976545678,
    'Registered',
    'NA',
    'NA',
    '',
    100.00,
    '2023-10-13 05:52:48',
    '2023-10-19 09:37:42',
    6,
    'pending',
    'Lipid Profile',
    1,
    1,
    8765678976,
    'Rajesh Kumar',
    '2',
    'A',
    'Paid',
    '2023-10-14',
    NULL,
    'rajesh@gmail.com',
    'Pending',
    NULL,
    4,
    NULL,
    'NA',
    0,
    NULL,
    NULL,
    0,
    'Pathology'
  );
INSERT INTO
  `pathologytests` (
    `id`,
    `PatientName`,
    `Address`,
    `PatientPhoneNo`,
    `status`,
    `lapName`,
    `remarks`,
    `instrumentsUsed`,
    `testFees`,
    `createdAt`,
    `updatedAt`,
    `PatientID`,
    `results`,
    `selectedTests`,
    `TestManagementID`,
    `doctorId`,
    `DoctorPhone`,
    `DoctorName`,
    `commissionType`,
    `commissionValue`,
    `PaymentStatus`,
    `PaymentDate`,
    `TestManagementIDs`,
    `DoctorEmail`,
    `Authorization`,
    `feedback`,
    `selectedPackageID`,
    `CorporateID`,
    `PackageName`,
    `PackagePrice`,
    `TotalFees`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    51,
    'Asha Kumari Yadav',
    'Null',
    9876543213,
    'Registered',
    'NA',
    'NA',
    '',
    100.00,
    '2023-10-16 05:31:14',
    '2023-10-19 09:37:36',
    28,
    'pending',
    'Lipid Profile',
    1,
    1,
    8765678976,
    'Rajesh Kumar',
    '2',
    'A',
    'Paid',
    '2023-10-12',
    NULL,
    'rajesh@gmail.com',
    'Pending',
    NULL,
    NULL,
    'JKL012',
    'NA',
    0,
    NULL,
    NULL,
    0,
    'Pathology'
  );
INSERT INTO
  `pathologytests` (
    `id`,
    `PatientName`,
    `Address`,
    `PatientPhoneNo`,
    `status`,
    `lapName`,
    `remarks`,
    `instrumentsUsed`,
    `testFees`,
    `createdAt`,
    `updatedAt`,
    `PatientID`,
    `results`,
    `selectedTests`,
    `TestManagementID`,
    `doctorId`,
    `DoctorPhone`,
    `DoctorName`,
    `commissionType`,
    `commissionValue`,
    `PaymentStatus`,
    `PaymentDate`,
    `TestManagementIDs`,
    `DoctorEmail`,
    `Authorization`,
    `feedback`,
    `selectedPackageID`,
    `CorporateID`,
    `PackageName`,
    `PackagePrice`,
    `TotalFees`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    52,
    'Rajesh Kumar Sharma',
    'Null',
    9876543210,
    'Registered',
    'NA',
    'NA',
    '',
    1000.00,
    '2023-10-16 09:58:46',
    '2023-10-19 09:37:33',
    20,
    'pending',
    'Lipid Profile, Platelet Count',
    10,
    1,
    8765678976,
    'Rajesh Kumar',
    '2',
    'A',
    'Paid',
    '2023-10-17',
    NULL,
    'rajesh@gmail.com',
    'Pending',
    NULL,
    NULL,
    'ABC123',
    'NA',
    0,
    NULL,
    NULL,
    0,
    'Pathology'
  );
INSERT INTO
  `pathologytests` (
    `id`,
    `PatientName`,
    `Address`,
    `PatientPhoneNo`,
    `status`,
    `lapName`,
    `remarks`,
    `instrumentsUsed`,
    `testFees`,
    `createdAt`,
    `updatedAt`,
    `PatientID`,
    `results`,
    `selectedTests`,
    `TestManagementID`,
    `doctorId`,
    `DoctorPhone`,
    `DoctorName`,
    `commissionType`,
    `commissionValue`,
    `PaymentStatus`,
    `PaymentDate`,
    `TestManagementIDs`,
    `DoctorEmail`,
    `Authorization`,
    `feedback`,
    `selectedPackageID`,
    `CorporateID`,
    `PackageName`,
    `PackagePrice`,
    `TotalFees`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    54,
    'Asha Kumari Yadav',
    'Null',
    9876543213,
    'Completed',
    'NA',
    'NA',
    '',
    100.00,
    '2023-10-17 12:14:14',
    '2023-10-19 09:37:30',
    28,
    'pending',
    'Lipid Profile, T3 T4 TSH',
    2,
    1,
    8765678976,
    'Rajesh Kumar',
    '2',
    'A',
    'Paid',
    '2023-10-13',
    NULL,
    'rajesh@gmail.com',
    'Pending',
    NULL,
    12,
    'JKL012',
    'NA',
    0,
    NULL,
    NULL,
    0,
    'Pathology'
  );
INSERT INTO
  `pathologytests` (
    `id`,
    `PatientName`,
    `Address`,
    `PatientPhoneNo`,
    `status`,
    `lapName`,
    `remarks`,
    `instrumentsUsed`,
    `testFees`,
    `createdAt`,
    `updatedAt`,
    `PatientID`,
    `results`,
    `selectedTests`,
    `TestManagementID`,
    `doctorId`,
    `DoctorPhone`,
    `DoctorName`,
    `commissionType`,
    `commissionValue`,
    `PaymentStatus`,
    `PaymentDate`,
    `TestManagementIDs`,
    `DoctorEmail`,
    `Authorization`,
    `feedback`,
    `selectedPackageID`,
    `CorporateID`,
    `PackageName`,
    `PackagePrice`,
    `TotalFees`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    55,
    'Vijay  Kumar',
    'Null',
    8676654575,
    'Completed',
    'NA',
    'NA',
    '',
    1000.00,
    '2023-10-18 05:04:26',
    '2023-10-20 02:36:16',
    29,
    'pending',
    'Lipid Profile',
    1,
    1,
    8765678976,
    'Rajesh Kumar',
    '4',
    'B',
    'Paid',
    '2023-10-20',
    NULL,
    'rajesh@gmail.com',
    'Pending',
    NULL,
    4,
    NULL,
    'NA',
    0,
    NULL,
    NULL,
    0,
    'Pathology'
  );
INSERT INTO
  `pathologytests` (
    `id`,
    `PatientName`,
    `Address`,
    `PatientPhoneNo`,
    `status`,
    `lapName`,
    `remarks`,
    `instrumentsUsed`,
    `testFees`,
    `createdAt`,
    `updatedAt`,
    `PatientID`,
    `results`,
    `selectedTests`,
    `TestManagementID`,
    `doctorId`,
    `DoctorPhone`,
    `DoctorName`,
    `commissionType`,
    `commissionValue`,
    `PaymentStatus`,
    `PaymentDate`,
    `TestManagementIDs`,
    `DoctorEmail`,
    `Authorization`,
    `feedback`,
    `selectedPackageID`,
    `CorporateID`,
    `PackageName`,
    `PackagePrice`,
    `TotalFees`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    62,
    'Mr Nitesh Giri',
    'Null',
    9876633333,
    'Registered',
    '',
    'NA',
    '',
    1450.00,
    '2023-10-20 09:20:32',
    '2023-10-20 09:20:32',
    32,
    'pending',
    'Lipid Profile, Platelet Count',
    1,
    1,
    8765678976,
    'Rajesh Kumar',
    '2',
    'A',
    'Paid',
    '2023-10-21',
    NULL,
    'rajesh@gmail.com',
    'Pending',
    NULL,
    4,
    NULL,
    'NA',
    0,
    NULL,
    NULL,
    0,
    'Pathology'
  );
INSERT INTO
  `pathologytests` (
    `id`,
    `PatientName`,
    `Address`,
    `PatientPhoneNo`,
    `status`,
    `lapName`,
    `remarks`,
    `instrumentsUsed`,
    `testFees`,
    `createdAt`,
    `updatedAt`,
    `PatientID`,
    `results`,
    `selectedTests`,
    `TestManagementID`,
    `doctorId`,
    `DoctorPhone`,
    `DoctorName`,
    `commissionType`,
    `commissionValue`,
    `PaymentStatus`,
    `PaymentDate`,
    `TestManagementIDs`,
    `DoctorEmail`,
    `Authorization`,
    `feedback`,
    `selectedPackageID`,
    `CorporateID`,
    `PackageName`,
    `PackagePrice`,
    `TotalFees`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    63,
    'Mr Vijay Kumar',
    'Null',
    8676654575,
    'Registered',
    'NA',
    'NA',
    '',
    3950.00,
    '2023-10-20 09:21:36',
    '2023-10-20 09:21:36',
    29,
    'pending',
    'T3 T4 TSH, Blood Sugar For Fasting',
    2,
    1,
    8765678976,
    'Rajesh Kumar',
    '2',
    'A',
    'Paid',
    '2023-10-21',
    NULL,
    'rajesh@gmail.com',
    'Pending',
    NULL,
    12,
    NULL,
    'NA',
    0,
    NULL,
    NULL,
    0,
    'Pathology'
  );
INSERT INTO
  `pathologytests` (
    `id`,
    `PatientName`,
    `Address`,
    `PatientPhoneNo`,
    `status`,
    `lapName`,
    `remarks`,
    `instrumentsUsed`,
    `testFees`,
    `createdAt`,
    `updatedAt`,
    `PatientID`,
    `results`,
    `selectedTests`,
    `TestManagementID`,
    `doctorId`,
    `DoctorPhone`,
    `DoctorName`,
    `commissionType`,
    `commissionValue`,
    `PaymentStatus`,
    `PaymentDate`,
    `TestManagementIDs`,
    `DoctorEmail`,
    `Authorization`,
    `feedback`,
    `selectedPackageID`,
    `CorporateID`,
    `PackageName`,
    `PackagePrice`,
    `TotalFees`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    67,
    'Mr Nitesh Giri',
    'NA',
    9876633333,
    'Registered',
    '',
    'NA',
    '',
    3950.00,
    '2023-10-20 09:58:09',
    '2023-10-20 09:58:09',
    32,
    'pending',
    'Lipid Profile, T3 T4 TSH, Blood Sugar For Fasting',
    1,
    1,
    8765678976,
    'Rajesh Kumar',
    '2',
    'A',
    'Not-Paid',
    '2000-01-01',
    NULL,
    'rajesh@gmail.com',
    'Pending',
    NULL,
    12,
    NULL,
    'NA',
    0,
    NULL,
    NULL,
    0,
    'Pathology'
  );
INSERT INTO
  `pathologytests` (
    `id`,
    `PatientName`,
    `Address`,
    `PatientPhoneNo`,
    `status`,
    `lapName`,
    `remarks`,
    `instrumentsUsed`,
    `testFees`,
    `createdAt`,
    `updatedAt`,
    `PatientID`,
    `results`,
    `selectedTests`,
    `TestManagementID`,
    `doctorId`,
    `DoctorPhone`,
    `DoctorName`,
    `commissionType`,
    `commissionValue`,
    `PaymentStatus`,
    `PaymentDate`,
    `TestManagementIDs`,
    `DoctorEmail`,
    `Authorization`,
    `feedback`,
    `selectedPackageID`,
    `CorporateID`,
    `PackageName`,
    `PackagePrice`,
    `TotalFees`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    68,
    'Mr Nitesh Giri',
    'NA',
    9876633333,
    'Registered',
    '',
    'NA',
    '',
    1450.00,
    '2023-10-20 10:00:55',
    '2023-10-20 10:46:29',
    32,
    'pending',
    'Lipid Profile, Platelet Count',
    1,
    1,
    8765678976,
    'Rajesh Kumar',
    '2',
    'A',
    'Paid',
    '2023-10-20',
    NULL,
    'rajesh@gmail.com',
    'Pending',
    NULL,
    4,
    NULL,
    'NA',
    0,
    NULL,
    NULL,
    0,
    'Pathology'
  );
INSERT INTO
  `pathologytests` (
    `id`,
    `PatientName`,
    `Address`,
    `PatientPhoneNo`,
    `status`,
    `lapName`,
    `remarks`,
    `instrumentsUsed`,
    `testFees`,
    `createdAt`,
    `updatedAt`,
    `PatientID`,
    `results`,
    `selectedTests`,
    `TestManagementID`,
    `doctorId`,
    `DoctorPhone`,
    `DoctorName`,
    `commissionType`,
    `commissionValue`,
    `PaymentStatus`,
    `PaymentDate`,
    `TestManagementIDs`,
    `DoctorEmail`,
    `Authorization`,
    `feedback`,
    `selectedPackageID`,
    `CorporateID`,
    `PackageName`,
    `PackagePrice`,
    `TotalFees`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    69,
    'Mr Nitesh Giri',
    'NA',
    9876633333,
    'Registered',
    '',
    'NA',
    '',
    3950.00,
    '2023-10-20 10:01:57',
    '2023-10-20 10:44:53',
    32,
    'pending',
    'Lipid Profile, T3 T4 TSH, Blood Sugar For Fasting',
    1,
    1,
    8765678976,
    'Rajesh Kumar',
    '2',
    'A',
    'Paid',
    '2023-10-20',
    NULL,
    'rajesh@gmail.com',
    'Pending',
    NULL,
    12,
    NULL,
    'NA',
    0,
    NULL,
    NULL,
    0,
    'Pathology'
  );
INSERT INTO
  `pathologytests` (
    `id`,
    `PatientName`,
    `Address`,
    `PatientPhoneNo`,
    `status`,
    `lapName`,
    `remarks`,
    `instrumentsUsed`,
    `testFees`,
    `createdAt`,
    `updatedAt`,
    `PatientID`,
    `results`,
    `selectedTests`,
    `TestManagementID`,
    `doctorId`,
    `DoctorPhone`,
    `DoctorName`,
    `commissionType`,
    `commissionValue`,
    `PaymentStatus`,
    `PaymentDate`,
    `TestManagementIDs`,
    `DoctorEmail`,
    `Authorization`,
    `feedback`,
    `selectedPackageID`,
    `CorporateID`,
    `PackageName`,
    `PackagePrice`,
    `TotalFees`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    73,
    'Mr Vaibhav Pande',
    'NA',
    8976545678,
    'Registered',
    'NA',
    'NA',
    '',
    200.00,
    '2023-10-20 11:24:02',
    '2023-10-20 11:24:02',
    6,
    'pending',
    'Platelet Count, Lipid Profile',
    0,
    1,
    8765678976,
    'Rajesh Kumar',
    '4',
    'B',
    'Paid',
    '2023-10-20',
    NULL,
    'rajesh@gmail.com',
    'Pending',
    NULL,
    NULL,
    NULL,
    'NA',
    0,
    NULL,
    NULL,
    0,
    'Pathology'
  );
INSERT INTO
  `pathologytests` (
    `id`,
    `PatientName`,
    `Address`,
    `PatientPhoneNo`,
    `status`,
    `lapName`,
    `remarks`,
    `instrumentsUsed`,
    `testFees`,
    `createdAt`,
    `updatedAt`,
    `PatientID`,
    `results`,
    `selectedTests`,
    `TestManagementID`,
    `doctorId`,
    `DoctorPhone`,
    `DoctorName`,
    `commissionType`,
    `commissionValue`,
    `PaymentStatus`,
    `PaymentDate`,
    `TestManagementIDs`,
    `DoctorEmail`,
    `Authorization`,
    `feedback`,
    `selectedPackageID`,
    `CorporateID`,
    `PackageName`,
    `PackagePrice`,
    `TotalFees`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    74,
    'Mr Nitesh Giri',
    'NA',
    9876633333,
    'Registered',
    'NA',
    'NA',
    '',
    280.00,
    '2023-10-20 12:06:09',
    '2023-10-20 12:14:02',
    32,
    'pending',
    'Lipid Profile, Blood Sugar For Fasting',
    0,
    1,
    8765678976,
    'Rajesh Kumar',
    '4',
    'B',
    'Paid',
    '2023-10-20',
    NULL,
    'rajesh@gmail.com',
    'Pending',
    NULL,
    NULL,
    NULL,
    'NA',
    0,
    NULL,
    NULL,
    0,
    'Pathology'
  );
INSERT INTO
  `pathologytests` (
    `id`,
    `PatientName`,
    `Address`,
    `PatientPhoneNo`,
    `status`,
    `lapName`,
    `remarks`,
    `instrumentsUsed`,
    `testFees`,
    `createdAt`,
    `updatedAt`,
    `PatientID`,
    `results`,
    `selectedTests`,
    `TestManagementID`,
    `doctorId`,
    `DoctorPhone`,
    `DoctorName`,
    `commissionType`,
    `commissionValue`,
    `PaymentStatus`,
    `PaymentDate`,
    `TestManagementIDs`,
    `DoctorEmail`,
    `Authorization`,
    `feedback`,
    `selectedPackageID`,
    `CorporateID`,
    `PackageName`,
    `PackagePrice`,
    `TotalFees`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    75,
    'Mr Nitesh Giri',
    'NA',
    9876633333,
    'Completed',
    '',
    'NA',
    '',
    1450.00,
    '2023-10-20 12:26:09',
    '2023-10-20 12:43:23',
    32,
    'pending',
    'Lipid Profile, Platelet Count',
    1,
    1,
    8765678976,
    'Rajesh Kumar',
    '2',
    'A',
    'Paid',
    '2023-10-20',
    NULL,
    'rajesh@gmail.com',
    'Pending',
    NULL,
    4,
    NULL,
    'NA',
    0,
    NULL,
    NULL,
    0,
    'Pathology'
  );
INSERT INTO
  `pathologytests` (
    `id`,
    `PatientName`,
    `Address`,
    `PatientPhoneNo`,
    `status`,
    `lapName`,
    `remarks`,
    `instrumentsUsed`,
    `testFees`,
    `createdAt`,
    `updatedAt`,
    `PatientID`,
    `results`,
    `selectedTests`,
    `TestManagementID`,
    `doctorId`,
    `DoctorPhone`,
    `DoctorName`,
    `commissionType`,
    `commissionValue`,
    `PaymentStatus`,
    `PaymentDate`,
    `TestManagementIDs`,
    `DoctorEmail`,
    `Authorization`,
    `feedback`,
    `selectedPackageID`,
    `CorporateID`,
    `PackageName`,
    `PackagePrice`,
    `TotalFees`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    76,
    'Mrs Priya Patel',
    'NA',
    9876543211,
    'Registered',
    'NA',
    'NA',
    '',
    4050.00,
    '2023-10-23 08:53:05',
    '2023-10-24 10:28:10',
    35,
    'pending',
    'T3 T4 TSH, Lipid Profile, Blood Sugar For Fasting',
    0,
    1,
    8765678976,
    'Rajesh Kumar',
    '2',
    'A',
    'Paid',
    '2023-10-24',
    NULL,
    'rajesh@gmail.com',
    'Pending',
    NULL,
    12,
    'DEF456',
    'NA',
    0,
    NULL,
    NULL,
    0,
    'Pathology'
  );
INSERT INTO
  `pathologytests` (
    `id`,
    `PatientName`,
    `Address`,
    `PatientPhoneNo`,
    `status`,
    `lapName`,
    `remarks`,
    `instrumentsUsed`,
    `testFees`,
    `createdAt`,
    `updatedAt`,
    `PatientID`,
    `results`,
    `selectedTests`,
    `TestManagementID`,
    `doctorId`,
    `DoctorPhone`,
    `DoctorName`,
    `commissionType`,
    `commissionValue`,
    `PaymentStatus`,
    `PaymentDate`,
    `TestManagementIDs`,
    `DoctorEmail`,
    `Authorization`,
    `feedback`,
    `selectedPackageID`,
    `CorporateID`,
    `PackageName`,
    `PackagePrice`,
    `TotalFees`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    78,
    'MR Rajesh Sharma',
    'NA',
    9876543210,
    'Registered',
    '',
    'NA',
    '',
    3950.00,
    '2023-10-23 09:01:50',
    '2023-10-24 10:28:24',
    34,
    'pending',
    'T3 T4 TSH, Blood Sugar For Fasting',
    2,
    1,
    8765678976,
    'Rajesh Kumar',
    '2',
    'A',
    'Paid',
    '2023-10-24',
    NULL,
    'rajesh@gmail.com',
    'Pending',
    NULL,
    12,
    'ABC123',
    'NA',
    0,
    NULL,
    NULL,
    0,
    'Pathology'
  );
INSERT INTO
  `pathologytests` (
    `id`,
    `PatientName`,
    `Address`,
    `PatientPhoneNo`,
    `status`,
    `lapName`,
    `remarks`,
    `instrumentsUsed`,
    `testFees`,
    `createdAt`,
    `updatedAt`,
    `PatientID`,
    `results`,
    `selectedTests`,
    `TestManagementID`,
    `doctorId`,
    `DoctorPhone`,
    `DoctorName`,
    `commissionType`,
    `commissionValue`,
    `PaymentStatus`,
    `PaymentDate`,
    `TestManagementIDs`,
    `DoctorEmail`,
    `Authorization`,
    `feedback`,
    `selectedPackageID`,
    `CorporateID`,
    `PackageName`,
    `PackagePrice`,
    `TotalFees`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    82,
    'Mr Nitesh Giri',
    'NA',
    9876633333,
    'Registered',
    'NA',
    'NA',
    '',
    1450.00,
    '2023-10-23 11:34:48',
    '2023-10-24 10:28:39',
    32,
    'pending',
    'Lipid Profile, Platelet Count',
    1,
    1,
    8765678976,
    'Rajesh Kumar',
    '2',
    'A',
    'Paid',
    '2023-10-24',
    NULL,
    'rajesh@gmail.com',
    'Pending',
    NULL,
    4,
    NULL,
    'NA',
    0,
    NULL,
    NULL,
    0,
    'Pathology'
  );
INSERT INTO
  `pathologytests` (
    `id`,
    `PatientName`,
    `Address`,
    `PatientPhoneNo`,
    `status`,
    `lapName`,
    `remarks`,
    `instrumentsUsed`,
    `testFees`,
    `createdAt`,
    `updatedAt`,
    `PatientID`,
    `results`,
    `selectedTests`,
    `TestManagementID`,
    `doctorId`,
    `DoctorPhone`,
    `DoctorName`,
    `commissionType`,
    `commissionValue`,
    `PaymentStatus`,
    `PaymentDate`,
    `TestManagementIDs`,
    `DoctorEmail`,
    `Authorization`,
    `feedback`,
    `selectedPackageID`,
    `CorporateID`,
    `PackageName`,
    `PackagePrice`,
    `TotalFees`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    83,
    'Mr Deepak Singh',
    'NA',
    9876543212,
    'Completed',
    'NA',
    'NA',
    '',
    100.00,
    '2023-10-24 05:47:36',
    '2023-10-24 05:50:01',
    36,
    'pending',
    'Platelet Count',
    10,
    1,
    8765678976,
    'Rajesh Kumar',
    '4',
    'B',
    'Paid',
    '2023-10-24',
    NULL,
    'rajesh@gmail.com',
    'Pending',
    NULL,
    NULL,
    'GHI789',
    'NA',
    0,
    NULL,
    NULL,
    0,
    'Pathology'
  );
INSERT INTO
  `pathologytests` (
    `id`,
    `PatientName`,
    `Address`,
    `PatientPhoneNo`,
    `status`,
    `lapName`,
    `remarks`,
    `instrumentsUsed`,
    `testFees`,
    `createdAt`,
    `updatedAt`,
    `PatientID`,
    `results`,
    `selectedTests`,
    `TestManagementID`,
    `doctorId`,
    `DoctorPhone`,
    `DoctorName`,
    `commissionType`,
    `commissionValue`,
    `PaymentStatus`,
    `PaymentDate`,
    `TestManagementIDs`,
    `DoctorEmail`,
    `Authorization`,
    `feedback`,
    `selectedPackageID`,
    `CorporateID`,
    `PackageName`,
    `PackagePrice`,
    `TotalFees`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    84,
    'Mr Deepak Singh',
    'NA',
    9876543212,
    'Completed',
    'NA',
    'NA',
    '',
    100.00,
    '2023-10-24 05:53:30',
    '2023-10-24 10:27:28',
    36,
    'pending',
    'Platelet Count',
    10,
    1,
    8765678976,
    'Rajesh Kumar',
    '2',
    'A',
    'Paid',
    '2023-10-24',
    NULL,
    'rajesh@gmail.com',
    'Pending',
    NULL,
    NULL,
    'GHI789',
    'NA',
    0,
    NULL,
    NULL,
    0,
    'Pathology'
  );
INSERT INTO
  `pathologytests` (
    `id`,
    `PatientName`,
    `Address`,
    `PatientPhoneNo`,
    `status`,
    `lapName`,
    `remarks`,
    `instrumentsUsed`,
    `testFees`,
    `createdAt`,
    `updatedAt`,
    `PatientID`,
    `results`,
    `selectedTests`,
    `TestManagementID`,
    `doctorId`,
    `DoctorPhone`,
    `DoctorName`,
    `commissionType`,
    `commissionValue`,
    `PaymentStatus`,
    `PaymentDate`,
    `TestManagementIDs`,
    `DoctorEmail`,
    `Authorization`,
    `feedback`,
    `selectedPackageID`,
    `CorporateID`,
    `PackageName`,
    `PackagePrice`,
    `TotalFees`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    85,
    'Mrs Priya Patel',
    'NA',
    9876543211,
    'Registered',
    'NA',
    'NA',
    '',
    3950.00,
    '2023-10-24 15:05:43',
    '2023-10-24 15:05:43',
    35,
    'pending',
    'T3 T4 TSH, Blood Sugar For Fasting',
    2,
    1,
    8765678976,
    'Rajesh Kumar',
    '5',
    'C',
    'Paid',
    '2023-10-25',
    NULL,
    'rajesh@gmail.com',
    'Pending',
    NULL,
    12,
    'DEF456',
    'NA',
    0,
    NULL,
    NULL,
    0,
    'Pathology'
  );
INSERT INTO
  `pathologytests` (
    `id`,
    `PatientName`,
    `Address`,
    `PatientPhoneNo`,
    `status`,
    `lapName`,
    `remarks`,
    `instrumentsUsed`,
    `testFees`,
    `createdAt`,
    `updatedAt`,
    `PatientID`,
    `results`,
    `selectedTests`,
    `TestManagementID`,
    `doctorId`,
    `DoctorPhone`,
    `DoctorName`,
    `commissionType`,
    `commissionValue`,
    `PaymentStatus`,
    `PaymentDate`,
    `TestManagementIDs`,
    `DoctorEmail`,
    `Authorization`,
    `feedback`,
    `selectedPackageID`,
    `CorporateID`,
    `PackageName`,
    `PackagePrice`,
    `TotalFees`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    86,
    'Mrs Priya Patel',
    'Null',
    9876543211,
    'Registered',
    ' ',
    'NA',
    NULL,
    100.00,
    '2023-10-24 16:06:56',
    '2023-10-24 16:06:56',
    35,
    'pending',
    'T3 T4 TSH',
    2,
    1,
    8765678976,
    'Rajesh Kumar',
    'NA',
    'NA',
    'Paid',
    '2023-10-24',
    '2',
    NULL,
    'Pending',
    NULL,
    NULL,
    'DEF456',
    'NA',
    0,
    NULL,
    NULL,
    0,
    'Pathology'
  );
INSERT INTO
  `pathologytests` (
    `id`,
    `PatientName`,
    `Address`,
    `PatientPhoneNo`,
    `status`,
    `lapName`,
    `remarks`,
    `instrumentsUsed`,
    `testFees`,
    `createdAt`,
    `updatedAt`,
    `PatientID`,
    `results`,
    `selectedTests`,
    `TestManagementID`,
    `doctorId`,
    `DoctorPhone`,
    `DoctorName`,
    `commissionType`,
    `commissionValue`,
    `PaymentStatus`,
    `PaymentDate`,
    `TestManagementIDs`,
    `DoctorEmail`,
    `Authorization`,
    `feedback`,
    `selectedPackageID`,
    `CorporateID`,
    `PackageName`,
    `PackagePrice`,
    `TotalFees`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    87,
    'Mrs Priya Patel',
    'Null',
    9876543211,
    'Registered',
    ' ',
    'NA',
    NULL,
    100.00,
    '2023-10-24 17:02:51',
    '2023-10-24 17:02:51',
    35,
    'pending',
    'Lipid Profile',
    1,
    1,
    8765678976,
    'Rajesh Kumar',
    'NA',
    'NA',
    'Not-Paid',
    '2023-10-24',
    '1',
    NULL,
    'Pending',
    NULL,
    NULL,
    'DEF456',
    'NA',
    0,
    NULL,
    NULL,
    0,
    'Pathology'
  );
INSERT INTO
  `pathologytests` (
    `id`,
    `PatientName`,
    `Address`,
    `PatientPhoneNo`,
    `status`,
    `lapName`,
    `remarks`,
    `instrumentsUsed`,
    `testFees`,
    `createdAt`,
    `updatedAt`,
    `PatientID`,
    `results`,
    `selectedTests`,
    `TestManagementID`,
    `doctorId`,
    `DoctorPhone`,
    `DoctorName`,
    `commissionType`,
    `commissionValue`,
    `PaymentStatus`,
    `PaymentDate`,
    `TestManagementIDs`,
    `DoctorEmail`,
    `Authorization`,
    `feedback`,
    `selectedPackageID`,
    `CorporateID`,
    `PackageName`,
    `PackagePrice`,
    `TotalFees`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    88,
    'Mrs Priya Patel',
    'Null',
    9876543211,
    'Registered',
    ' ',
    'NA',
    NULL,
    0.00,
    '2023-10-24 17:03:52',
    '2023-10-24 17:03:52',
    35,
    'pending',
    'Lipid Profile',
    1,
    1,
    8765678976,
    'Rajesh Kumar',
    'NA',
    'NA',
    'Not-Paid',
    '2023-10-24',
    '1',
    NULL,
    'Pending',
    NULL,
    NULL,
    'DEF456',
    'NA',
    0,
    NULL,
    NULL,
    0,
    'Pathology'
  );
INSERT INTO
  `pathologytests` (
    `id`,
    `PatientName`,
    `Address`,
    `PatientPhoneNo`,
    `status`,
    `lapName`,
    `remarks`,
    `instrumentsUsed`,
    `testFees`,
    `createdAt`,
    `updatedAt`,
    `PatientID`,
    `results`,
    `selectedTests`,
    `TestManagementID`,
    `doctorId`,
    `DoctorPhone`,
    `DoctorName`,
    `commissionType`,
    `commissionValue`,
    `PaymentStatus`,
    `PaymentDate`,
    `TestManagementIDs`,
    `DoctorEmail`,
    `Authorization`,
    `feedback`,
    `selectedPackageID`,
    `CorporateID`,
    `PackageName`,
    `PackagePrice`,
    `TotalFees`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    89,
    'Mrs Priya Patel',
    'Null',
    9876543211,
    'Registered',
    ' ',
    'NA',
    NULL,
    0.00,
    '2023-10-24 17:05:11',
    '2023-10-24 17:05:11',
    35,
    'pending',
    'Lipid Profile',
    1,
    1,
    8765678976,
    'Rajesh Kumar',
    'NA',
    'NA',
    'Not-Paid',
    '2023-10-24',
    '1',
    NULL,
    'Pending',
    NULL,
    NULL,
    'DEF456',
    'NA',
    0,
    NULL,
    NULL,
    0,
    'Pathology'
  );
INSERT INTO
  `pathologytests` (
    `id`,
    `PatientName`,
    `Address`,
    `PatientPhoneNo`,
    `status`,
    `lapName`,
    `remarks`,
    `instrumentsUsed`,
    `testFees`,
    `createdAt`,
    `updatedAt`,
    `PatientID`,
    `results`,
    `selectedTests`,
    `TestManagementID`,
    `doctorId`,
    `DoctorPhone`,
    `DoctorName`,
    `commissionType`,
    `commissionValue`,
    `PaymentStatus`,
    `PaymentDate`,
    `TestManagementIDs`,
    `DoctorEmail`,
    `Authorization`,
    `feedback`,
    `selectedPackageID`,
    `CorporateID`,
    `PackageName`,
    `PackagePrice`,
    `TotalFees`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    90,
    'Mrs Priya Patel',
    'Null',
    9876543211,
    'Registered',
    ' ',
    'NA',
    NULL,
    0.00,
    '2023-10-24 17:05:57',
    '2023-10-24 17:05:57',
    35,
    'pending',
    'Lipid Profile',
    1,
    1,
    8765678976,
    'Rajesh Kumar',
    'NA',
    'NA',
    'Not-Paid',
    '2023-10-24',
    '1',
    NULL,
    'Pending',
    NULL,
    NULL,
    'DEF456',
    'NA',
    0,
    NULL,
    NULL,
    0,
    'Pathology'
  );
INSERT INTO
  `pathologytests` (
    `id`,
    `PatientName`,
    `Address`,
    `PatientPhoneNo`,
    `status`,
    `lapName`,
    `remarks`,
    `instrumentsUsed`,
    `testFees`,
    `createdAt`,
    `updatedAt`,
    `PatientID`,
    `results`,
    `selectedTests`,
    `TestManagementID`,
    `doctorId`,
    `DoctorPhone`,
    `DoctorName`,
    `commissionType`,
    `commissionValue`,
    `PaymentStatus`,
    `PaymentDate`,
    `TestManagementIDs`,
    `DoctorEmail`,
    `Authorization`,
    `feedback`,
    `selectedPackageID`,
    `CorporateID`,
    `PackageName`,
    `PackagePrice`,
    `TotalFees`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    91,
    'Mrs Priya Patel',
    'Null',
    9876543211,
    'Registered',
    ' ',
    'NA',
    NULL,
    200.00,
    '2023-10-24 17:06:30',
    '2023-10-24 17:06:30',
    35,
    'pending',
    'Lipid Profile,Platelet Count',
    1,
    1,
    8765678976,
    'Rajesh Kumar',
    'NA',
    'NA',
    'Not-Paid',
    '2023-10-24',
    '1,10',
    NULL,
    'Pending',
    NULL,
    NULL,
    'DEF456',
    'NA',
    0,
    NULL,
    NULL,
    0,
    'Pathology'
  );
INSERT INTO
  `pathologytests` (
    `id`,
    `PatientName`,
    `Address`,
    `PatientPhoneNo`,
    `status`,
    `lapName`,
    `remarks`,
    `instrumentsUsed`,
    `testFees`,
    `createdAt`,
    `updatedAt`,
    `PatientID`,
    `results`,
    `selectedTests`,
    `TestManagementID`,
    `doctorId`,
    `DoctorPhone`,
    `DoctorName`,
    `commissionType`,
    `commissionValue`,
    `PaymentStatus`,
    `PaymentDate`,
    `TestManagementIDs`,
    `DoctorEmail`,
    `Authorization`,
    `feedback`,
    `selectedPackageID`,
    `CorporateID`,
    `PackageName`,
    `PackagePrice`,
    `TotalFees`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    92,
    'Mrs Priya Patel',
    'Null',
    9876543211,
    'Registered',
    ' ',
    'NA',
    NULL,
    200.00,
    '2023-10-24 17:08:19',
    '2023-10-25 11:52:07',
    35,
    'pending',
    'Lipid Profile, Platelet Count',
    1,
    1,
    8765678976,
    'Rajesh Kumar',
    '0',
    'NA',
    'Paid',
    '2023-10-24',
    '1,10',
    'rajesh@gmail.com',
    'Pending',
    NULL,
    NULL,
    'DEF456',
    'NA',
    0,
    NULL,
    NULL,
    0,
    'Pathology'
  );
INSERT INTO
  `pathologytests` (
    `id`,
    `PatientName`,
    `Address`,
    `PatientPhoneNo`,
    `status`,
    `lapName`,
    `remarks`,
    `instrumentsUsed`,
    `testFees`,
    `createdAt`,
    `updatedAt`,
    `PatientID`,
    `results`,
    `selectedTests`,
    `TestManagementID`,
    `doctorId`,
    `DoctorPhone`,
    `DoctorName`,
    `commissionType`,
    `commissionValue`,
    `PaymentStatus`,
    `PaymentDate`,
    `TestManagementIDs`,
    `DoctorEmail`,
    `Authorization`,
    `feedback`,
    `selectedPackageID`,
    `CorporateID`,
    `PackageName`,
    `PackagePrice`,
    `TotalFees`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    93,
    'Mrs Priya Patel',
    'NA',
    9876543211,
    'Registered',
    'NA',
    'NA',
    '',
    100.00,
    '2023-10-25 04:45:57',
    '2023-10-25 04:45:57',
    35,
    'pending',
    'Platelet Count',
    10,
    1,
    8765678976,
    'Rajesh Kumar',
    '2',
    'A',
    'Paid',
    '2023-10-25',
    NULL,
    'rajesh@gmail.com',
    'Pending',
    NULL,
    NULL,
    'DEF456',
    'NA',
    0,
    NULL,
    NULL,
    0,
    'Pathology'
  );
INSERT INTO
  `pathologytests` (
    `id`,
    `PatientName`,
    `Address`,
    `PatientPhoneNo`,
    `status`,
    `lapName`,
    `remarks`,
    `instrumentsUsed`,
    `testFees`,
    `createdAt`,
    `updatedAt`,
    `PatientID`,
    `results`,
    `selectedTests`,
    `TestManagementID`,
    `doctorId`,
    `DoctorPhone`,
    `DoctorName`,
    `commissionType`,
    `commissionValue`,
    `PaymentStatus`,
    `PaymentDate`,
    `TestManagementIDs`,
    `DoctorEmail`,
    `Authorization`,
    `feedback`,
    `selectedPackageID`,
    `CorporateID`,
    `PackageName`,
    `PackagePrice`,
    `TotalFees`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    94,
    'Mrs Priya Patel',
    'NA',
    9876543211,
    'Registered',
    '',
    'NA',
    '',
    100.00,
    '2023-10-25 04:46:25',
    '2023-10-25 04:46:25',
    35,
    'pending',
    'Platelet Count',
    10,
    1,
    8765678976,
    'Rajesh Kumar',
    '2',
    'A',
    'Paid',
    '2023-10-25',
    NULL,
    'rajesh@gmail.com',
    'Pending',
    NULL,
    NULL,
    'DEF456',
    'NA',
    0,
    NULL,
    NULL,
    0,
    'Pathology'
  );
INSERT INTO
  `pathologytests` (
    `id`,
    `PatientName`,
    `Address`,
    `PatientPhoneNo`,
    `status`,
    `lapName`,
    `remarks`,
    `instrumentsUsed`,
    `testFees`,
    `createdAt`,
    `updatedAt`,
    `PatientID`,
    `results`,
    `selectedTests`,
    `TestManagementID`,
    `doctorId`,
    `DoctorPhone`,
    `DoctorName`,
    `commissionType`,
    `commissionValue`,
    `PaymentStatus`,
    `PaymentDate`,
    `TestManagementIDs`,
    `DoctorEmail`,
    `Authorization`,
    `feedback`,
    `selectedPackageID`,
    `CorporateID`,
    `PackageName`,
    `PackagePrice`,
    `TotalFees`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    95,
    'Mr Deepak Singh',
    'NA',
    9876543212,
    'Completed',
    '',
    'NA',
    '',
    100.00,
    '2023-10-25 04:46:47',
    '2023-10-25 04:47:16',
    36,
    'pending',
    'Platelet Count',
    10,
    1,
    8765678976,
    'Rajesh Kumar',
    '2',
    'A',
    'Paid',
    '2023-10-25',
    NULL,
    'rajesh@gmail.com',
    'Pending',
    NULL,
    NULL,
    'GHI789',
    'NA',
    0,
    NULL,
    NULL,
    0,
    'Pathology'
  );
INSERT INTO
  `pathologytests` (
    `id`,
    `PatientName`,
    `Address`,
    `PatientPhoneNo`,
    `status`,
    `lapName`,
    `remarks`,
    `instrumentsUsed`,
    `testFees`,
    `createdAt`,
    `updatedAt`,
    `PatientID`,
    `results`,
    `selectedTests`,
    `TestManagementID`,
    `doctorId`,
    `DoctorPhone`,
    `DoctorName`,
    `commissionType`,
    `commissionValue`,
    `PaymentStatus`,
    `PaymentDate`,
    `TestManagementIDs`,
    `DoctorEmail`,
    `Authorization`,
    `feedback`,
    `selectedPackageID`,
    `CorporateID`,
    `PackageName`,
    `PackagePrice`,
    `TotalFees`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    101,
    'Mrs Priya Patel',
    'NA',
    9876543211,
    'Registered',
    '',
    'NA',
    '',
    1450.00,
    '2023-10-25 12:55:35',
    '2023-10-25 12:55:35',
    35,
    'pending',
    'Platelet Count, Lipid Profile',
    10,
    1,
    8765678976,
    'Rajesh Kumar',
    '2',
    'A',
    'Paid',
    '2023-10-25',
    NULL,
    'rajesh@gmail.com',
    'Pending',
    NULL,
    4,
    'DEF456',
    'NA',
    0,
    NULL,
    NULL,
    0,
    'Pathology'
  );
INSERT INTO
  `pathologytests` (
    `id`,
    `PatientName`,
    `Address`,
    `PatientPhoneNo`,
    `status`,
    `lapName`,
    `remarks`,
    `instrumentsUsed`,
    `testFees`,
    `createdAt`,
    `updatedAt`,
    `PatientID`,
    `results`,
    `selectedTests`,
    `TestManagementID`,
    `doctorId`,
    `DoctorPhone`,
    `DoctorName`,
    `commissionType`,
    `commissionValue`,
    `PaymentStatus`,
    `PaymentDate`,
    `TestManagementIDs`,
    `DoctorEmail`,
    `Authorization`,
    `feedback`,
    `selectedPackageID`,
    `CorporateID`,
    `PackageName`,
    `PackagePrice`,
    `TotalFees`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    102,
    'Mrs Asha Yadav',
    'NA',
    9876543213,
    'Completed',
    '',
    'NA',
    '',
    380.00,
    '2023-10-25 13:03:08',
    '2023-10-25 13:07:28',
    37,
    'pending',
    'Lipid Profile, T3 T4 TSH, Blood Sugar For Fasting',
    0,
    1,
    8765678976,
    'Rajesh Kumar',
    '4',
    'B',
    'Paid',
    '2023-10-25',
    NULL,
    'rajesh@gmail.com',
    'Pending',
    NULL,
    NULL,
    'ABC123',
    'NA',
    0,
    NULL,
    NULL,
    0,
    'Pathology'
  );
INSERT INTO
  `pathologytests` (
    `id`,
    `PatientName`,
    `Address`,
    `PatientPhoneNo`,
    `status`,
    `lapName`,
    `remarks`,
    `instrumentsUsed`,
    `testFees`,
    `createdAt`,
    `updatedAt`,
    `PatientID`,
    `results`,
    `selectedTests`,
    `TestManagementID`,
    `doctorId`,
    `DoctorPhone`,
    `DoctorName`,
    `commissionType`,
    `commissionValue`,
    `PaymentStatus`,
    `PaymentDate`,
    `TestManagementIDs`,
    `DoctorEmail`,
    `Authorization`,
    `feedback`,
    `selectedPackageID`,
    `CorporateID`,
    `PackageName`,
    `PackagePrice`,
    `TotalFees`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    103,
    'Mr Vijay Kumar',
    'NA',
    7896785674,
    'Registered',
    'NA',
    'NA',
    '',
    200.00,
    '2023-10-29 14:52:00',
    '2023-10-29 14:52:00',
    16,
    'pending',
    'Lipid Profile, T3 T4 TSH',
    0,
    1,
    8765678976,
    'Rajesh Kumar',
    '2',
    'A',
    'Paid',
    '2023-10-29',
    NULL,
    'rajesh@gmail.com',
    'Pending',
    NULL,
    NULL,
    NULL,
    'NA',
    0,
    NULL,
    NULL,
    0,
    'Pathology'
  );
INSERT INTO
  `pathologytests` (
    `id`,
    `PatientName`,
    `Address`,
    `PatientPhoneNo`,
    `status`,
    `lapName`,
    `remarks`,
    `instrumentsUsed`,
    `testFees`,
    `createdAt`,
    `updatedAt`,
    `PatientID`,
    `results`,
    `selectedTests`,
    `TestManagementID`,
    `doctorId`,
    `DoctorPhone`,
    `DoctorName`,
    `commissionType`,
    `commissionValue`,
    `PaymentStatus`,
    `PaymentDate`,
    `TestManagementIDs`,
    `DoctorEmail`,
    `Authorization`,
    `feedback`,
    `selectedPackageID`,
    `CorporateID`,
    `PackageName`,
    `PackagePrice`,
    `TotalFees`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    104,
    'Mr Deepak Singh',
    'Null',
    9876543212,
    'Registered',
    ' ',
    'NA',
    NULL,
    100.00,
    '2023-10-30 02:58:25',
    '2023-10-30 02:58:25',
    36,
    'pending',
    'Lipid Profile,Platelet Count',
    1,
    1,
    8765678976,
    'Rajesh Kumar',
    'NA',
    'NA',
    'Paid',
    '2023-10-30',
    '1,10',
    NULL,
    'Pending',
    NULL,
    NULL,
    'GHI789',
    'NA',
    0,
    NULL,
    NULL,
    0,
    'Pathology'
  );
INSERT INTO
  `pathologytests` (
    `id`,
    `PatientName`,
    `Address`,
    `PatientPhoneNo`,
    `status`,
    `lapName`,
    `remarks`,
    `instrumentsUsed`,
    `testFees`,
    `createdAt`,
    `updatedAt`,
    `PatientID`,
    `results`,
    `selectedTests`,
    `TestManagementID`,
    `doctorId`,
    `DoctorPhone`,
    `DoctorName`,
    `commissionType`,
    `commissionValue`,
    `PaymentStatus`,
    `PaymentDate`,
    `TestManagementIDs`,
    `DoctorEmail`,
    `Authorization`,
    `feedback`,
    `selectedPackageID`,
    `CorporateID`,
    `PackageName`,
    `PackagePrice`,
    `TotalFees`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    105,
    'Mrs Priya Patel',
    'Null',
    9876543211,
    'Registered',
    ' ',
    'NA',
    NULL,
    1450.00,
    '2023-10-30 03:00:56',
    '2023-10-30 03:00:56',
    35,
    'pending',
    'Lipid Profile,Platelet Count',
    10,
    1,
    8765678976,
    'Rajesh Kumar',
    'NA',
    'NA',
    'Not-Paid',
    NULL,
    '1,10',
    NULL,
    'Pending',
    NULL,
    4,
    'DEF456',
    'NA',
    0,
    NULL,
    NULL,
    0,
    'Pathology'
  );
INSERT INTO
  `pathologytests` (
    `id`,
    `PatientName`,
    `Address`,
    `PatientPhoneNo`,
    `status`,
    `lapName`,
    `remarks`,
    `instrumentsUsed`,
    `testFees`,
    `createdAt`,
    `updatedAt`,
    `PatientID`,
    `results`,
    `selectedTests`,
    `TestManagementID`,
    `doctorId`,
    `DoctorPhone`,
    `DoctorName`,
    `commissionType`,
    `commissionValue`,
    `PaymentStatus`,
    `PaymentDate`,
    `TestManagementIDs`,
    `DoctorEmail`,
    `Authorization`,
    `feedback`,
    `selectedPackageID`,
    `CorporateID`,
    `PackageName`,
    `PackagePrice`,
    `TotalFees`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    106,
    'Mrs Priya Patel',
    'NA',
    9876543211,
    'Registered',
    'NA',
    'NA',
    '',
    200.00,
    '2023-10-30 10:41:49',
    '2023-10-30 11:29:25',
    35,
    'pending',
    'Blood Sugar For PP',
    0,
    1,
    8765678976,
    'Rajesh Kumar',
    '4',
    'B',
    'Paid',
    '2023-10-30',
    NULL,
    'rajesh@gmail.com',
    'Pending',
    NULL,
    0,
    'DEF456',
    'NA',
    0,
    NULL,
    NULL,
    0,
    'Pathology'
  );
INSERT INTO
  `pathologytests` (
    `id`,
    `PatientName`,
    `Address`,
    `PatientPhoneNo`,
    `status`,
    `lapName`,
    `remarks`,
    `instrumentsUsed`,
    `testFees`,
    `createdAt`,
    `updatedAt`,
    `PatientID`,
    `results`,
    `selectedTests`,
    `TestManagementID`,
    `doctorId`,
    `DoctorPhone`,
    `DoctorName`,
    `commissionType`,
    `commissionValue`,
    `PaymentStatus`,
    `PaymentDate`,
    `TestManagementIDs`,
    `DoctorEmail`,
    `Authorization`,
    `feedback`,
    `selectedPackageID`,
    `CorporateID`,
    `PackageName`,
    `PackagePrice`,
    `TotalFees`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    107,
    'MR Rajesh Sharma',
    'NA',
    9876543210,
    'Registered',
    'NA',
    'NA',
    '',
    100.00,
    '2023-10-30 15:09:39',
    '2023-10-30 15:09:39',
    34,
    'pending',
    'Lipid Profile',
    1,
    1,
    8765678976,
    'Rajesh Kumar',
    '2',
    'A',
    'Paid',
    '2023-10-30',
    NULL,
    'rajesh@gmail.com',
    'Pending',
    NULL,
    NULL,
    'ABC123',
    'NA',
    0,
    NULL,
    NULL,
    0,
    'Pathology'
  );
INSERT INTO
  `pathologytests` (
    `id`,
    `PatientName`,
    `Address`,
    `PatientPhoneNo`,
    `status`,
    `lapName`,
    `remarks`,
    `instrumentsUsed`,
    `testFees`,
    `createdAt`,
    `updatedAt`,
    `PatientID`,
    `results`,
    `selectedTests`,
    `TestManagementID`,
    `doctorId`,
    `DoctorPhone`,
    `DoctorName`,
    `commissionType`,
    `commissionValue`,
    `PaymentStatus`,
    `PaymentDate`,
    `TestManagementIDs`,
    `DoctorEmail`,
    `Authorization`,
    `feedback`,
    `selectedPackageID`,
    `CorporateID`,
    `PackageName`,
    `PackagePrice`,
    `TotalFees`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    108,
    'MR Rajesh Sharma',
    'NA',
    9876543210,
    'Registered',
    '',
    'NA',
    '',
    100.00,
    '2023-10-30 15:23:39',
    '2023-10-30 15:40:27',
    34,
    'pending',
    'Lipid Profile',
    1,
    1,
    8765678976,
    'Rajesh Kumar',
    '2',
    'A',
    'Paid',
    '2023-10-30',
    NULL,
    'rajesh@gmail.com',
    'Pending',
    NULL,
    NULL,
    'ABC123',
    'NA',
    0,
    NULL,
    NULL,
    0,
    'Pathology'
  );
INSERT INTO
  `pathologytests` (
    `id`,
    `PatientName`,
    `Address`,
    `PatientPhoneNo`,
    `status`,
    `lapName`,
    `remarks`,
    `instrumentsUsed`,
    `testFees`,
    `createdAt`,
    `updatedAt`,
    `PatientID`,
    `results`,
    `selectedTests`,
    `TestManagementID`,
    `doctorId`,
    `DoctorPhone`,
    `DoctorName`,
    `commissionType`,
    `commissionValue`,
    `PaymentStatus`,
    `PaymentDate`,
    `TestManagementIDs`,
    `DoctorEmail`,
    `Authorization`,
    `feedback`,
    `selectedPackageID`,
    `CorporateID`,
    `PackageName`,
    `PackagePrice`,
    `TotalFees`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    109,
    'MR Rajesh Sharma',
    'NA',
    9876543210,
    'Registered',
    'NA',
    'NA',
    '',
    100.00,
    '2023-10-31 02:09:13',
    '2023-10-31 02:09:13',
    34,
    'pending',
    'T3 T4 TSH',
    2,
    1,
    8765678976,
    'Rajesh Kumar',
    '2',
    'A',
    'Paid',
    '2023-10-31',
    NULL,
    'rajesh@gmail.com',
    'Pending',
    NULL,
    NULL,
    'ABC123',
    'NA',
    0,
    NULL,
    NULL,
    0,
    'Pathology'
  );
INSERT INTO
  `pathologytests` (
    `id`,
    `PatientName`,
    `Address`,
    `PatientPhoneNo`,
    `status`,
    `lapName`,
    `remarks`,
    `instrumentsUsed`,
    `testFees`,
    `createdAt`,
    `updatedAt`,
    `PatientID`,
    `results`,
    `selectedTests`,
    `TestManagementID`,
    `doctorId`,
    `DoctorPhone`,
    `DoctorName`,
    `commissionType`,
    `commissionValue`,
    `PaymentStatus`,
    `PaymentDate`,
    `TestManagementIDs`,
    `DoctorEmail`,
    `Authorization`,
    `feedback`,
    `selectedPackageID`,
    `CorporateID`,
    `PackageName`,
    `PackagePrice`,
    `TotalFees`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    110,
    'Mrs Priya Patel',
    'NA',
    9876543211,
    'Registered',
    '',
    'NA',
    '',
    1450.00,
    '2023-11-06 09:12:51',
    '2023-11-06 09:12:51',
    35,
    'pending',
    'Lipid Profile, Platelet Count',
    1,
    1,
    8765678976,
    'Rajesh Kumar',
    '2',
    'A',
    'Paid',
    '2023-11-06',
    NULL,
    'rajesh@gmail.com',
    'Pending',
    NULL,
    4,
    'DEF456',
    'NA',
    0,
    NULL,
    NULL,
    0,
    'Pathology'
  );
INSERT INTO
  `pathologytests` (
    `id`,
    `PatientName`,
    `Address`,
    `PatientPhoneNo`,
    `status`,
    `lapName`,
    `remarks`,
    `instrumentsUsed`,
    `testFees`,
    `createdAt`,
    `updatedAt`,
    `PatientID`,
    `results`,
    `selectedTests`,
    `TestManagementID`,
    `doctorId`,
    `DoctorPhone`,
    `DoctorName`,
    `commissionType`,
    `commissionValue`,
    `PaymentStatus`,
    `PaymentDate`,
    `TestManagementIDs`,
    `DoctorEmail`,
    `Authorization`,
    `feedback`,
    `selectedPackageID`,
    `CorporateID`,
    `PackageName`,
    `PackagePrice`,
    `TotalFees`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    111,
    'Mrs Priya Patel',
    'NA',
    9876543211,
    'Registered',
    '',
    'NA',
    '',
    100.00,
    '2023-11-06 09:16:52',
    '2023-11-06 09:16:52',
    35,
    'pending',
    'Lipid Profile',
    1,
    0,
    0,
    'NA NA',
    '2',
    'A',
    'Not-Paid',
    '2000-01-01',
    NULL,
    NULL,
    'Pending',
    NULL,
    0,
    'DEF456',
    'NA',
    0,
    NULL,
    NULL,
    0,
    'Pathology'
  );
INSERT INTO
  `pathologytests` (
    `id`,
    `PatientName`,
    `Address`,
    `PatientPhoneNo`,
    `status`,
    `lapName`,
    `remarks`,
    `instrumentsUsed`,
    `testFees`,
    `createdAt`,
    `updatedAt`,
    `PatientID`,
    `results`,
    `selectedTests`,
    `TestManagementID`,
    `doctorId`,
    `DoctorPhone`,
    `DoctorName`,
    `commissionType`,
    `commissionValue`,
    `PaymentStatus`,
    `PaymentDate`,
    `TestManagementIDs`,
    `DoctorEmail`,
    `Authorization`,
    `feedback`,
    `selectedPackageID`,
    `CorporateID`,
    `PackageName`,
    `PackagePrice`,
    `TotalFees`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    112,
    'Mrs Priya Patel',
    'NA',
    9876543211,
    'Registered',
    'NA',
    'NA',
    '',
    1350.00,
    '2023-11-06 10:18:08',
    '2023-11-06 10:18:08',
    35,
    'pending',
    'Lipid Profile, Platelet Count',
    1,
    1,
    8765678976,
    'Rajesh Kumar',
    '2',
    'A',
    'Paid',
    '2023-11-06',
    NULL,
    'rajesh@gmail.com',
    'Pending',
    NULL,
    4,
    'DEF456',
    'NA',
    0,
    NULL,
    NULL,
    0,
    'Pathology'
  );
INSERT INTO
  `pathologytests` (
    `id`,
    `PatientName`,
    `Address`,
    `PatientPhoneNo`,
    `status`,
    `lapName`,
    `remarks`,
    `instrumentsUsed`,
    `testFees`,
    `createdAt`,
    `updatedAt`,
    `PatientID`,
    `results`,
    `selectedTests`,
    `TestManagementID`,
    `doctorId`,
    `DoctorPhone`,
    `DoctorName`,
    `commissionType`,
    `commissionValue`,
    `PaymentStatus`,
    `PaymentDate`,
    `TestManagementIDs`,
    `DoctorEmail`,
    `Authorization`,
    `feedback`,
    `selectedPackageID`,
    `CorporateID`,
    `PackageName`,
    `PackagePrice`,
    `TotalFees`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    113,
    'Mrs Priya Patel',
    'NA',
    9876543211,
    'Registered',
    '',
    'NA',
    '',
    1650.00,
    '2023-11-06 10:21:25',
    '2023-11-06 10:21:25',
    35,
    'pending',
    'Lipid Profile, Platelet Count, T3 T4 TSH',
    0,
    1,
    8765678976,
    'Rajesh Kumar',
    '2',
    'A',
    'Not-Paid',
    '2000-01-01',
    NULL,
    'rajesh@gmail.com',
    'Pending',
    NULL,
    4,
    'DEF456',
    'NA',
    0,
    NULL,
    NULL,
    0,
    'Pathology'
  );
INSERT INTO
  `pathologytests` (
    `id`,
    `PatientName`,
    `Address`,
    `PatientPhoneNo`,
    `status`,
    `lapName`,
    `remarks`,
    `instrumentsUsed`,
    `testFees`,
    `createdAt`,
    `updatedAt`,
    `PatientID`,
    `results`,
    `selectedTests`,
    `TestManagementID`,
    `doctorId`,
    `DoctorPhone`,
    `DoctorName`,
    `commissionType`,
    `commissionValue`,
    `PaymentStatus`,
    `PaymentDate`,
    `TestManagementIDs`,
    `DoctorEmail`,
    `Authorization`,
    `feedback`,
    `selectedPackageID`,
    `CorporateID`,
    `PackageName`,
    `PackagePrice`,
    `TotalFees`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    114,
    'Mrs Asha Yadav',
    'NA',
    9876543213,
    'Registered',
    'NA',
    'NA',
    '',
    1350.00,
    '2023-11-07 05:37:55',
    '2023-11-07 05:37:55',
    37,
    'pending',
    'Lipid Profile, Platelet Count',
    0,
    1,
    8765678976,
    'Rajesh Kumar',
    '2',
    'A',
    'Paid',
    '2023-11-07',
    NULL,
    'rajesh@gmail.com',
    'Pending',
    NULL,
    4,
    'ABC123',
    'NA',
    0,
    NULL,
    NULL,
    0,
    'Pathology'
  );
INSERT INTO
  `pathologytests` (
    `id`,
    `PatientName`,
    `Address`,
    `PatientPhoneNo`,
    `status`,
    `lapName`,
    `remarks`,
    `instrumentsUsed`,
    `testFees`,
    `createdAt`,
    `updatedAt`,
    `PatientID`,
    `results`,
    `selectedTests`,
    `TestManagementID`,
    `doctorId`,
    `DoctorPhone`,
    `DoctorName`,
    `commissionType`,
    `commissionValue`,
    `PaymentStatus`,
    `PaymentDate`,
    `TestManagementIDs`,
    `DoctorEmail`,
    `Authorization`,
    `feedback`,
    `selectedPackageID`,
    `CorporateID`,
    `PackageName`,
    `PackagePrice`,
    `TotalFees`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    115,
    'Mrs Priya Patel',
    'NA',
    9876543211,
    'Registered',
    'NA',
    'NA',
    '',
    1450.00,
    '2023-11-07 06:15:21',
    '2023-11-07 06:15:21',
    35,
    'pending',
    'T3 T4 TSH, Lipid Profile, Platelet Count',
    2,
    1,
    8765678976,
    'Rajesh Kumar',
    '2',
    'A',
    'Paid',
    '2023-11-07',
    NULL,
    'rajesh@gmail.com',
    'Pending',
    NULL,
    4,
    'DEF456',
    'NA',
    0,
    NULL,
    NULL,
    0,
    'Pathology'
  );
INSERT INTO
  `pathologytests` (
    `id`,
    `PatientName`,
    `Address`,
    `PatientPhoneNo`,
    `status`,
    `lapName`,
    `remarks`,
    `instrumentsUsed`,
    `testFees`,
    `createdAt`,
    `updatedAt`,
    `PatientID`,
    `results`,
    `selectedTests`,
    `TestManagementID`,
    `doctorId`,
    `DoctorPhone`,
    `DoctorName`,
    `commissionType`,
    `commissionValue`,
    `PaymentStatus`,
    `PaymentDate`,
    `TestManagementIDs`,
    `DoctorEmail`,
    `Authorization`,
    `feedback`,
    `selectedPackageID`,
    `CorporateID`,
    `PackageName`,
    `PackagePrice`,
    `TotalFees`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    116,
    'Mrs Priya Patel',
    'NA',
    9876543211,
    'Completed',
    'NA',
    'NA',
    '',
    1350.00,
    '2023-11-08 11:10:09',
    '2023-11-08 11:15:57',
    35,
    'pending',
    'Lipid Profile, Platelet Count',
    0,
    2,
    8774447568,
    'Sandeep Sharma',
    '2',
    'A',
    'Paid',
    '2023-11-08',
    NULL,
    'sandeep02@gmail.com',
    'Approved',
    'NA',
    4,
    'DEF456',
    'NA',
    0,
    NULL,
    NULL,
    0,
    'Pathology'
  );
INSERT INTO
  `pathologytests` (
    `id`,
    `PatientName`,
    `Address`,
    `PatientPhoneNo`,
    `status`,
    `lapName`,
    `remarks`,
    `instrumentsUsed`,
    `testFees`,
    `createdAt`,
    `updatedAt`,
    `PatientID`,
    `results`,
    `selectedTests`,
    `TestManagementID`,
    `doctorId`,
    `DoctorPhone`,
    `DoctorName`,
    `commissionType`,
    `commissionValue`,
    `PaymentStatus`,
    `PaymentDate`,
    `TestManagementIDs`,
    `DoctorEmail`,
    `Authorization`,
    `feedback`,
    `selectedPackageID`,
    `CorporateID`,
    `PackageName`,
    `PackagePrice`,
    `TotalFees`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    118,
    'Mr Deepak Singh',
    'NA',
    9876543212,
    'Completed',
    'NA',
    'NA',
    '',
    100.00,
    '2024-01-13 12:05:04',
    '2024-02-02 13:07:57',
    36,
    'pending',
    'Platelet Count',
    0,
    1,
    8765678976,
    'Rajesh Kumar',
    '2',
    'A',
    'Paid',
    '2024-01-13',
    NULL,
    'rajesh@gmail.com',
    'Approved',
    'kjn',
    NULL,
    'GHI789',
    'NA',
    0,
    8297.00,
    'INR',
    0,
    'Pathology'
  );
INSERT INTO
  `pathologytests` (
    `id`,
    `PatientName`,
    `Address`,
    `PatientPhoneNo`,
    `status`,
    `lapName`,
    `remarks`,
    `instrumentsUsed`,
    `testFees`,
    `createdAt`,
    `updatedAt`,
    `PatientID`,
    `results`,
    `selectedTests`,
    `TestManagementID`,
    `doctorId`,
    `DoctorPhone`,
    `DoctorName`,
    `commissionType`,
    `commissionValue`,
    `PaymentStatus`,
    `PaymentDate`,
    `TestManagementIDs`,
    `DoctorEmail`,
    `Authorization`,
    `feedback`,
    `selectedPackageID`,
    `CorporateID`,
    `PackageName`,
    `PackagePrice`,
    `TotalFees`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    119,
    'Mr Nitesh Giri',
    'NA',
    7876598397,
    'Completed',
    'NA',
    'NA',
    '',
    100.00,
    '2024-01-27 07:58:48',
    '2024-02-02 12:41:55',
    40,
    'pending',
    'Platelet Count',
    10,
    2,
    8774447568,
    'Sandeep Sharma',
    '2',
    'A',
    'Paid',
    '2024-01-27',
    NULL,
    'sandeep02@gmail.com',
    'Pending',
    NULL,
    NULL,
    NULL,
    'NA',
    0,
    8297.00,
    'INR',
    1,
    'Pathology'
  );
INSERT INTO
  `pathologytests` (
    `id`,
    `PatientName`,
    `Address`,
    `PatientPhoneNo`,
    `status`,
    `lapName`,
    `remarks`,
    `instrumentsUsed`,
    `testFees`,
    `createdAt`,
    `updatedAt`,
    `PatientID`,
    `results`,
    `selectedTests`,
    `TestManagementID`,
    `doctorId`,
    `DoctorPhone`,
    `DoctorName`,
    `commissionType`,
    `commissionValue`,
    `PaymentStatus`,
    `PaymentDate`,
    `TestManagementIDs`,
    `DoctorEmail`,
    `Authorization`,
    `feedback`,
    `selectedPackageID`,
    `CorporateID`,
    `PackageName`,
    `PackagePrice`,
    `TotalFees`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    120,
    'Mr Nitesh Giri',
    'NA',
    7876598397,
    'Completed',
    'NA',
    'NA',
    '',
    280.00,
    '2024-01-27 08:16:39',
    '2024-02-02 14:44:45',
    40,
    'pending',
    'Platelet Count, Blood Sugar For Fasting',
    10,
    1,
    8765678976,
    'Rajesh Kumar',
    '2',
    'A',
    'Paid',
    '2024-01-27',
    NULL,
    'rajesh@gmail.com',
    'Pending',
    NULL,
    NULL,
    NULL,
    'NA',
    0,
    280.00,
    'USD',
    1,
    'Pathology'
  );
INSERT INTO
  `pathologytests` (
    `id`,
    `PatientName`,
    `Address`,
    `PatientPhoneNo`,
    `status`,
    `lapName`,
    `remarks`,
    `instrumentsUsed`,
    `testFees`,
    `createdAt`,
    `updatedAt`,
    `PatientID`,
    `results`,
    `selectedTests`,
    `TestManagementID`,
    `doctorId`,
    `DoctorPhone`,
    `DoctorName`,
    `commissionType`,
    `commissionValue`,
    `PaymentStatus`,
    `PaymentDate`,
    `TestManagementIDs`,
    `DoctorEmail`,
    `Authorization`,
    `feedback`,
    `selectedPackageID`,
    `CorporateID`,
    `PackageName`,
    `PackagePrice`,
    `TotalFees`,
    `Currency`,
    `admissionID`,
    `procedure`
  )
VALUES
  (
    121,
    'Mrs Asha Yadav',
    'NA',
    9876543213,
    'Registered',
    'NA',
    'NA',
    '',
    100.00,
    '2024-02-03 17:00:02',
    '2024-02-03 17:00:01',
    37,
    'pending',
    'T3 T4 TSH, Lipid Profile, Platelet Count',
    2,
    2,
    8774447568,
    'Sandeep Sharma',
    '2',
    'A',
    'Paid',
    '2024-02-03',
    NULL,
    'sandeep02@gmail.com',
    'Pending',
    NULL,
    4,
    'ABC123',
    'NA',
    0,
    120321.00,
    'INR',
    3,
    'Pathology'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: patientprecriptions
# ------------------------------------------------------------

INSERT INTO
  `patientprecriptions` (
    `id`,
    `prescriptionId`,
    `patient_Id`,
    `doctor_Id`,
    `PatientName`,
    `phoneNumberP`,
    `image`,
    `PrescribedDoctor`,
    `RegistrationNo`,
    `PhoneNo`,
    `DoctorEmail`,
    `AppointBookingID`,
    `socialLifestyle`,
    `foodHabits`,
    `medicalHistory`,
    `allergies`,
    `clinicalDiagnosis`,
    `prescribeMedicineQuantity`,
    `status`,
    `DispensedMedicineQuantity`,
    `pharmacistRemark`,
    `createdAt`,
    `updatedAt`,
    `bloodPressure`,
    `respiratoryRate`,
    `heartRate`,
    `temperature`,
    `familyDetails`,
    `revisitDate`,
    `emailSentStatus`,
    `revisit`,
    `emailSentDetails`
  )
VALUES
  (
    1,
    'P6/20231013/175219',
    6,
    1,
    'Mr Vaibhav  Pande',
    8976545678,
    '',
    'Dr Rajesh  Kumar',
    'REG767543',
    8765678976,
    'rajesh02@gmail.com',
    40,
    'Non Smoker Non Alcoholic NA',
    'Vegetarian    NA',
    'NA',
    'NA',
    'Cold Cough',
    1,
    '0',
    0,
    NULL,
    '2023-10-13 12:22:20',
    '2023-10-13 12:22:20',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
  );
INSERT INTO
  `patientprecriptions` (
    `id`,
    `prescriptionId`,
    `patient_Id`,
    `doctor_Id`,
    `PatientName`,
    `phoneNumberP`,
    `image`,
    `PrescribedDoctor`,
    `RegistrationNo`,
    `PhoneNo`,
    `DoctorEmail`,
    `AppointBookingID`,
    `socialLifestyle`,
    `foodHabits`,
    `medicalHistory`,
    `allergies`,
    `clinicalDiagnosis`,
    `prescribeMedicineQuantity`,
    `status`,
    `DispensedMedicineQuantity`,
    `pharmacistRemark`,
    `createdAt`,
    `updatedAt`,
    `bloodPressure`,
    `respiratoryRate`,
    `heartRate`,
    `temperature`,
    `familyDetails`,
    `revisitDate`,
    `emailSentStatus`,
    `revisit`,
    `emailSentDetails`
  )
VALUES
  (
    3,
    'P37/20231024/141742',
    37,
    1,
    'Mrs Asha Kumari Yadav',
    9876543213,
    NULL,
    'Dr Rajesh  Kumar',
    'REG767543',
    8765678976,
    'rajesh@gmail.com',
    51,
    'Smoker Non Alcoholic NA',
    'Non Vegetarian    NA',
    'NA',
    'NA',
    'fever',
    10,
    '0',
    0,
    NULL,
    '2023-10-24 08:47:42',
    '2023-10-24 08:47:42',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
  );
INSERT INTO
  `patientprecriptions` (
    `id`,
    `prescriptionId`,
    `patient_Id`,
    `doctor_Id`,
    `PatientName`,
    `phoneNumberP`,
    `image`,
    `PrescribedDoctor`,
    `RegistrationNo`,
    `PhoneNo`,
    `DoctorEmail`,
    `AppointBookingID`,
    `socialLifestyle`,
    `foodHabits`,
    `medicalHistory`,
    `allergies`,
    `clinicalDiagnosis`,
    `prescribeMedicineQuantity`,
    `status`,
    `DispensedMedicineQuantity`,
    `pharmacistRemark`,
    `createdAt`,
    `updatedAt`,
    `bloodPressure`,
    `respiratoryRate`,
    `heartRate`,
    `temperature`,
    `familyDetails`,
    `revisitDate`,
    `emailSentStatus`,
    `revisit`,
    `emailSentDetails`
  )
VALUES
  (
    4,
    'P37/20231024/141959',
    37,
    1,
    'Mrs Asha Kumari Yadav',
    9876543213,
    NULL,
    'Dr Rajesh  Kumar',
    'REG767543',
    8765678976,
    'rajesh@gmail.com',
    51,
    'Non Smoker Non Alcoholic NA',
    'Non Vegetarian    NA',
    'NA',
    'NA',
    'fever since last 3 days',
    10,
    '0',
    0,
    NULL,
    '2023-10-24 08:49:59',
    '2023-10-24 08:49:59',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
  );
INSERT INTO
  `patientprecriptions` (
    `id`,
    `prescriptionId`,
    `patient_Id`,
    `doctor_Id`,
    `PatientName`,
    `phoneNumberP`,
    `image`,
    `PrescribedDoctor`,
    `RegistrationNo`,
    `PhoneNo`,
    `DoctorEmail`,
    `AppointBookingID`,
    `socialLifestyle`,
    `foodHabits`,
    `medicalHistory`,
    `allergies`,
    `clinicalDiagnosis`,
    `prescribeMedicineQuantity`,
    `status`,
    `DispensedMedicineQuantity`,
    `pharmacistRemark`,
    `createdAt`,
    `updatedAt`,
    `bloodPressure`,
    `respiratoryRate`,
    `heartRate`,
    `temperature`,
    `familyDetails`,
    `revisitDate`,
    `emailSentStatus`,
    `revisit`,
    `emailSentDetails`
  )
VALUES
  (
    5,
    'P37/20231024/142221',
    37,
    1,
    'Mrs Asha Kumari Yadav',
    9876543213,
    NULL,
    'Dr Rajesh  Kumar',
    'REG767543',
    8765678976,
    'rajesh@gmail.com',
    51,
    'Non Smoker Non Alcoholic NA',
    'Vegetarian    NA',
    'nNA',
    'NA',
    'NA',
    11,
    '1',
    6,
    NULL,
    '2023-10-24 08:52:22',
    '2024-01-10 10:45:07',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
  );
INSERT INTO
  `patientprecriptions` (
    `id`,
    `prescriptionId`,
    `patient_Id`,
    `doctor_Id`,
    `PatientName`,
    `phoneNumberP`,
    `image`,
    `PrescribedDoctor`,
    `RegistrationNo`,
    `PhoneNo`,
    `DoctorEmail`,
    `AppointBookingID`,
    `socialLifestyle`,
    `foodHabits`,
    `medicalHistory`,
    `allergies`,
    `clinicalDiagnosis`,
    `prescribeMedicineQuantity`,
    `status`,
    `DispensedMedicineQuantity`,
    `pharmacistRemark`,
    `createdAt`,
    `updatedAt`,
    `bloodPressure`,
    `respiratoryRate`,
    `heartRate`,
    `temperature`,
    `familyDetails`,
    `revisitDate`,
    `emailSentStatus`,
    `revisit`,
    `emailSentDetails`
  )
VALUES
  (
    6,
    'P37/20231024/142422',
    37,
    1,
    'Mrs Asha Kumari Yadav',
    9876543213,
    NULL,
    'Dr Rajesh  Kumar',
    'REG767543',
    8765678976,
    'rajesh@gmail.com',
    51,
    'Non Smoker Non Alcoholic NA',
    'Non Vegetarian    NA',
    'NA',
    'NA',
    'NA',
    10,
    '1',
    11,
    NULL,
    '2023-10-24 08:54:23',
    '2024-01-14 06:02:59',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
  );
INSERT INTO
  `patientprecriptions` (
    `id`,
    `prescriptionId`,
    `patient_Id`,
    `doctor_Id`,
    `PatientName`,
    `phoneNumberP`,
    `image`,
    `PrescribedDoctor`,
    `RegistrationNo`,
    `PhoneNo`,
    `DoctorEmail`,
    `AppointBookingID`,
    `socialLifestyle`,
    `foodHabits`,
    `medicalHistory`,
    `allergies`,
    `clinicalDiagnosis`,
    `prescribeMedicineQuantity`,
    `status`,
    `DispensedMedicineQuantity`,
    `pharmacistRemark`,
    `createdAt`,
    `updatedAt`,
    `bloodPressure`,
    `respiratoryRate`,
    `heartRate`,
    `temperature`,
    `familyDetails`,
    `revisitDate`,
    `emailSentStatus`,
    `revisit`,
    `emailSentDetails`
  )
VALUES
  (
    7,
    'P39/20240111/144022',
    39,
    1,
    'Mrs Jai D Kumar',
    9394687462,
    NULL,
    'Dr Rajesh  Kumar',
    'REG767543',
    8765678976,
    'rajesh@gmail.com',
    59,
    'Non Smoker Non Alcoholic NA',
    'Non Vegetarian    NA',
    'NA',
    'NA',
    'NA',
    10,
    '0',
    0,
    NULL,
    '2024-01-11 09:10:22',
    '2024-01-11 09:10:24',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
  );
INSERT INTO
  `patientprecriptions` (
    `id`,
    `prescriptionId`,
    `patient_Id`,
    `doctor_Id`,
    `PatientName`,
    `phoneNumberP`,
    `image`,
    `PrescribedDoctor`,
    `RegistrationNo`,
    `PhoneNo`,
    `DoctorEmail`,
    `AppointBookingID`,
    `socialLifestyle`,
    `foodHabits`,
    `medicalHistory`,
    `allergies`,
    `clinicalDiagnosis`,
    `prescribeMedicineQuantity`,
    `status`,
    `DispensedMedicineQuantity`,
    `pharmacistRemark`,
    `createdAt`,
    `updatedAt`,
    `bloodPressure`,
    `respiratoryRate`,
    `heartRate`,
    `temperature`,
    `familyDetails`,
    `revisitDate`,
    `emailSentStatus`,
    `revisit`,
    `emailSentDetails`
  )
VALUES
  (
    8,
    'P40/20240112/084458',
    40,
    1,
    'Mr Nitesh D Giri',
    7876598397,
    NULL,
    'Dr Rajesh  Kumar',
    'REG767543',
    8765678976,
    'rajesh@gmail.com',
    61,
    'Non Smoker Non Alcoholic bgfbxgf',
    'Non Vegetarian    retg',
    'grrdeg',
    'gdf',
    'fgdf',
    10,
    '1',
    5,
    NULL,
    '2024-01-12 03:14:58',
    '2024-01-28 11:34:15',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: patientregistrations
# ------------------------------------------------------------

INSERT INTO
  `patientregistrations` (
    `id`,
    `mr`,
    `firstName`,
    `middleName`,
    `lastName`,
    `phoneNumberP`,
    `email`,
    `age`,
    `gender`,
    `height`,
    `weight`,
    `createdAt`,
    `updatedAt`,
    `PatientAadharID`,
    `HealthNationalID`,
    `city`,
    `state`,
    `pincode`,
    `address`,
    `countryCode`,
    `hospitalId`,
    `CorporateID`,
    `PackageID`,
    `PackageName`,
    `registrationFees`,
    `paymentStatus`,
    `paymentDate`,
    `CompanyName`,
    `CompanyID`,
    `maritalStatus`,
    `bloodGroup`,
    `ageOption`,
    `Currency`
  )
VALUES
  (
    6,
    'Mr',
    'Vaibhav',
    '',
    'Pande',
    8976545678,
    'vaibhav@gmail.com',
    123,
    'male',
    123,
    123,
    '2023-09-09 13:09:29',
    '2023-09-09 13:09:29',
    '234567654321',
    '2345678765432134',
    'Pune',
    'Maharashtra',
    '411046',
    'pune',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    ''
  );
INSERT INTO
  `patientregistrations` (
    `id`,
    `mr`,
    `firstName`,
    `middleName`,
    `lastName`,
    `phoneNumberP`,
    `email`,
    `age`,
    `gender`,
    `height`,
    `weight`,
    `createdAt`,
    `updatedAt`,
    `PatientAadharID`,
    `HealthNationalID`,
    `city`,
    `state`,
    `pincode`,
    `address`,
    `countryCode`,
    `hospitalId`,
    `CorporateID`,
    `PackageID`,
    `PackageName`,
    `registrationFees`,
    `paymentStatus`,
    `paymentDate`,
    `CompanyName`,
    `CompanyID`,
    `maritalStatus`,
    `bloodGroup`,
    `ageOption`,
    `Currency`
  )
VALUES
  (
    14,
    'Mr',
    'jai',
    '',
    'Kumar',
    9876546789,
    'jai@gmail.com',
    123,
    'male',
    0,
    0,
    '2023-09-15 03:26:16',
    '2023-09-15 03:26:16',
    '',
    '',
    'Nanded',
    '',
    '',
    '',
    '+1',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    ''
  );
INSERT INTO
  `patientregistrations` (
    `id`,
    `mr`,
    `firstName`,
    `middleName`,
    `lastName`,
    `phoneNumberP`,
    `email`,
    `age`,
    `gender`,
    `height`,
    `weight`,
    `createdAt`,
    `updatedAt`,
    `PatientAadharID`,
    `HealthNationalID`,
    `city`,
    `state`,
    `pincode`,
    `address`,
    `countryCode`,
    `hospitalId`,
    `CorporateID`,
    `PackageID`,
    `PackageName`,
    `registrationFees`,
    `paymentStatus`,
    `paymentDate`,
    `CompanyName`,
    `CompanyID`,
    `maritalStatus`,
    `bloodGroup`,
    `ageOption`,
    `Currency`
  )
VALUES
  (
    15,
    'Mr',
    'Gangesh',
    '',
    'Kumar',
    6543245675,
    '',
    21,
    'male',
    0,
    0,
    '2023-09-15 03:51:36',
    '2023-09-15 03:51:36',
    '',
    '',
    '',
    '',
    '',
    'Pune',
    '+91',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    ''
  );
INSERT INTO
  `patientregistrations` (
    `id`,
    `mr`,
    `firstName`,
    `middleName`,
    `lastName`,
    `phoneNumberP`,
    `email`,
    `age`,
    `gender`,
    `height`,
    `weight`,
    `createdAt`,
    `updatedAt`,
    `PatientAadharID`,
    `HealthNationalID`,
    `city`,
    `state`,
    `pincode`,
    `address`,
    `countryCode`,
    `hospitalId`,
    `CorporateID`,
    `PackageID`,
    `PackageName`,
    `registrationFees`,
    `paymentStatus`,
    `paymentDate`,
    `CompanyName`,
    `CompanyID`,
    `maritalStatus`,
    `bloodGroup`,
    `ageOption`,
    `Currency`
  )
VALUES
  (
    16,
    'Mr',
    'Vijay',
    '',
    'Kumar',
    7896785674,
    'vijay@gmail.com',
    12,
    'male',
    155,
    55,
    '2023-09-18 16:42:04',
    '2023-09-18 16:42:04',
    '',
    '',
    '',
    '',
    '',
    'Pune',
    '+91',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    ''
  );
INSERT INTO
  `patientregistrations` (
    `id`,
    `mr`,
    `firstName`,
    `middleName`,
    `lastName`,
    `phoneNumberP`,
    `email`,
    `age`,
    `gender`,
    `height`,
    `weight`,
    `createdAt`,
    `updatedAt`,
    `PatientAadharID`,
    `HealthNationalID`,
    `city`,
    `state`,
    `pincode`,
    `address`,
    `countryCode`,
    `hospitalId`,
    `CorporateID`,
    `PackageID`,
    `PackageName`,
    `registrationFees`,
    `paymentStatus`,
    `paymentDate`,
    `CompanyName`,
    `CompanyID`,
    `maritalStatus`,
    `bloodGroup`,
    `ageOption`,
    `Currency`
  )
VALUES
  (
    17,
    'Mr',
    'Admin',
    'One',
    'Patient',
    8765467897,
    '',
    44,
    'male',
    0,
    0,
    '2023-09-19 17:10:57',
    '2023-09-19 17:10:57',
    '',
    '',
    '',
    '',
    '',
    'Pune',
    '+91',
    8,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    ''
  );
INSERT INTO
  `patientregistrations` (
    `id`,
    `mr`,
    `firstName`,
    `middleName`,
    `lastName`,
    `phoneNumberP`,
    `email`,
    `age`,
    `gender`,
    `height`,
    `weight`,
    `createdAt`,
    `updatedAt`,
    `PatientAadharID`,
    `HealthNationalID`,
    `city`,
    `state`,
    `pincode`,
    `address`,
    `countryCode`,
    `hospitalId`,
    `CorporateID`,
    `PackageID`,
    `PackageName`,
    `registrationFees`,
    `paymentStatus`,
    `paymentDate`,
    `CompanyName`,
    `CompanyID`,
    `maritalStatus`,
    `bloodGroup`,
    `ageOption`,
    `Currency`
  )
VALUES
  (
    29,
    'Mr',
    'Vijay',
    '',
    'Kumar',
    8676654575,
    'vijay01@gmail.com',
    50,
    'male',
    165,
    50,
    '2023-10-16 09:08:17',
    '2023-10-16 09:08:17',
    '',
    '',
    '',
    '',
    '',
    'Pune',
    '+91',
    0,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    ''
  );
INSERT INTO
  `patientregistrations` (
    `id`,
    `mr`,
    `firstName`,
    `middleName`,
    `lastName`,
    `phoneNumberP`,
    `email`,
    `age`,
    `gender`,
    `height`,
    `weight`,
    `createdAt`,
    `updatedAt`,
    `PatientAadharID`,
    `HealthNationalID`,
    `city`,
    `state`,
    `pincode`,
    `address`,
    `countryCode`,
    `hospitalId`,
    `CorporateID`,
    `PackageID`,
    `PackageName`,
    `registrationFees`,
    `paymentStatus`,
    `paymentDate`,
    `CompanyName`,
    `CompanyID`,
    `maritalStatus`,
    `bloodGroup`,
    `ageOption`,
    `Currency`
  )
VALUES
  (
    30,
    'Mr',
    'hgvb',
    'khgjb',
    'hb',
    7654567765,
    '',
    12,
    'male',
    0,
    0,
    '2023-10-18 11:24:29',
    '2023-10-19 12:05:14',
    '',
    '',
    'NA',
    '',
    '',
    '',
    '+91',
    0,
    NULL,
    NULL,
    NULL,
    11,
    'Not-Paid',
    '2023-10-19 00:00:00',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    ''
  );
INSERT INTO
  `patientregistrations` (
    `id`,
    `mr`,
    `firstName`,
    `middleName`,
    `lastName`,
    `phoneNumberP`,
    `email`,
    `age`,
    `gender`,
    `height`,
    `weight`,
    `createdAt`,
    `updatedAt`,
    `PatientAadharID`,
    `HealthNationalID`,
    `city`,
    `state`,
    `pincode`,
    `address`,
    `countryCode`,
    `hospitalId`,
    `CorporateID`,
    `PackageID`,
    `PackageName`,
    `registrationFees`,
    `paymentStatus`,
    `paymentDate`,
    `CompanyName`,
    `CompanyID`,
    `maritalStatus`,
    `bloodGroup`,
    `ageOption`,
    `Currency`
  )
VALUES
  (
    31,
    'Mr',
    'jhbjh',
    'bjhb',
    'jh',
    8756787656,
    '',
    11,
    'male',
    0,
    0,
    '2023-10-18 15:18:36',
    '2023-10-19 12:03:32',
    '',
    '',
    '',
    '',
    '345676',
    '',
    '+91',
    0,
    NULL,
    NULL,
    NULL,
    11,
    'Not-Paid',
    '2023-10-20 00:00:00',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    ''
  );
INSERT INTO
  `patientregistrations` (
    `id`,
    `mr`,
    `firstName`,
    `middleName`,
    `lastName`,
    `phoneNumberP`,
    `email`,
    `age`,
    `gender`,
    `height`,
    `weight`,
    `createdAt`,
    `updatedAt`,
    `PatientAadharID`,
    `HealthNationalID`,
    `city`,
    `state`,
    `pincode`,
    `address`,
    `countryCode`,
    `hospitalId`,
    `CorporateID`,
    `PackageID`,
    `PackageName`,
    `registrationFees`,
    `paymentStatus`,
    `paymentDate`,
    `CompanyName`,
    `CompanyID`,
    `maritalStatus`,
    `bloodGroup`,
    `ageOption`,
    `Currency`
  )
VALUES
  (
    32,
    'Mr',
    'Nitesh',
    '',
    'Giri',
    9876633333,
    '',
    11,
    'male',
    0,
    0,
    '2023-10-19 11:00:11',
    '2023-10-19 12:03:15',
    '',
    '',
    'Nanded',
    '',
    '',
    '',
    '+91',
    0,
    NULL,
    NULL,
    NULL,
    1227,
    'Paid',
    '2023-10-21 00:00:00',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    ''
  );
INSERT INTO
  `patientregistrations` (
    `id`,
    `mr`,
    `firstName`,
    `middleName`,
    `lastName`,
    `phoneNumberP`,
    `email`,
    `age`,
    `gender`,
    `height`,
    `weight`,
    `createdAt`,
    `updatedAt`,
    `PatientAadharID`,
    `HealthNationalID`,
    `city`,
    `state`,
    `pincode`,
    `address`,
    `countryCode`,
    `hospitalId`,
    `CorporateID`,
    `PackageID`,
    `PackageName`,
    `registrationFees`,
    `paymentStatus`,
    `paymentDate`,
    `CompanyName`,
    `CompanyID`,
    `maritalStatus`,
    `bloodGroup`,
    `ageOption`,
    `Currency`
  )
VALUES
  (
    34,
    'MR',
    'Rajesh',
    'Kumar',
    'Sharma',
    9876543210,
    'rajesh.sharma@gmail.com',
    30,
    'Male',
    170,
    70,
    '2023-10-23 07:40:39',
    '2023-10-23 07:40:39',
    '123456789012',
    '1234678901234567',
    'New Delhi',
    'Delhi',
    '110001',
    '123',
    '+91',
    0,
    'ABC123',
    NULL,
    NULL,
    NULL,
    NULL,
    '2023-10-23 07:40:39',
    'TechGenius Solutions Pvt. Ltd.',
    3,
    NULL,
    NULL,
    NULL,
    ''
  );
INSERT INTO
  `patientregistrations` (
    `id`,
    `mr`,
    `firstName`,
    `middleName`,
    `lastName`,
    `phoneNumberP`,
    `email`,
    `age`,
    `gender`,
    `height`,
    `weight`,
    `createdAt`,
    `updatedAt`,
    `PatientAadharID`,
    `HealthNationalID`,
    `city`,
    `state`,
    `pincode`,
    `address`,
    `countryCode`,
    `hospitalId`,
    `CorporateID`,
    `PackageID`,
    `PackageName`,
    `registrationFees`,
    `paymentStatus`,
    `paymentDate`,
    `CompanyName`,
    `CompanyID`,
    `maritalStatus`,
    `bloodGroup`,
    `ageOption`,
    `Currency`
  )
VALUES
  (
    35,
    'Mrs',
    'Priya',
    '',
    'Patel',
    9876543211,
    'priya.patel@gmail.com',
    25,
    'Female',
    165,
    55,
    '2023-10-23 07:41:50',
    '2023-10-23 07:41:50',
    '987654321098',
    '9876543210976543',
    'Mumbai',
    'Maharashtra',
    '400001',
    '456',
    '+91',
    0,
    'DEF456',
    NULL,
    NULL,
    NULL,
    NULL,
    '2023-10-23 07:41:50',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    ''
  );
INSERT INTO
  `patientregistrations` (
    `id`,
    `mr`,
    `firstName`,
    `middleName`,
    `lastName`,
    `phoneNumberP`,
    `email`,
    `age`,
    `gender`,
    `height`,
    `weight`,
    `createdAt`,
    `updatedAt`,
    `PatientAadharID`,
    `HealthNationalID`,
    `city`,
    `state`,
    `pincode`,
    `address`,
    `countryCode`,
    `hospitalId`,
    `CorporateID`,
    `PackageID`,
    `PackageName`,
    `registrationFees`,
    `paymentStatus`,
    `paymentDate`,
    `CompanyName`,
    `CompanyID`,
    `maritalStatus`,
    `bloodGroup`,
    `ageOption`,
    `Currency`
  )
VALUES
  (
    36,
    'Mr',
    'Deepak',
    '',
    'Singh',
    9876543212,
    'deepak.singh@gmail.com',
    35,
    'Male',
    175,
    80,
    '2023-10-23 07:41:50',
    '2023-10-23 07:41:50',
    '555555555555',
    '5555555555555555',
    'Kolkata',
    'West Bengal',
    '700001',
    '789',
    '+91',
    0,
    'GHI789',
    NULL,
    NULL,
    NULL,
    NULL,
    '2023-10-23 07:41:50',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    ''
  );
INSERT INTO
  `patientregistrations` (
    `id`,
    `mr`,
    `firstName`,
    `middleName`,
    `lastName`,
    `phoneNumberP`,
    `email`,
    `age`,
    `gender`,
    `height`,
    `weight`,
    `createdAt`,
    `updatedAt`,
    `PatientAadharID`,
    `HealthNationalID`,
    `city`,
    `state`,
    `pincode`,
    `address`,
    `countryCode`,
    `hospitalId`,
    `CorporateID`,
    `PackageID`,
    `PackageName`,
    `registrationFees`,
    `paymentStatus`,
    `paymentDate`,
    `CompanyName`,
    `CompanyID`,
    `maritalStatus`,
    `bloodGroup`,
    `ageOption`,
    `Currency`
  )
VALUES
  (
    37,
    'Mrs',
    'Asha',
    'Kumari',
    'Yadav',
    9876543213,
    'asha.yadav@gmail.com',
    40,
    'Female',
    160,
    60,
    '2023-10-23 07:41:50',
    '2023-10-23 07:41:50',
    '777777777777',
    '7777777777777777',
    'Bangalore',
    'Karnataka',
    '560001',
    '234',
    '+91',
    0,
    'ABC123',
    NULL,
    NULL,
    NULL,
    NULL,
    '2023-10-23 07:41:50',
    'TechGenius Solutions Pvt. Ltd.',
    3,
    NULL,
    NULL,
    NULL,
    ''
  );
INSERT INTO
  `patientregistrations` (
    `id`,
    `mr`,
    `firstName`,
    `middleName`,
    `lastName`,
    `phoneNumberP`,
    `email`,
    `age`,
    `gender`,
    `height`,
    `weight`,
    `createdAt`,
    `updatedAt`,
    `PatientAadharID`,
    `HealthNationalID`,
    `city`,
    `state`,
    `pincode`,
    `address`,
    `countryCode`,
    `hospitalId`,
    `CorporateID`,
    `PackageID`,
    `PackageName`,
    `registrationFees`,
    `paymentStatus`,
    `paymentDate`,
    `CompanyName`,
    `CompanyID`,
    `maritalStatus`,
    `bloodGroup`,
    `ageOption`,
    `Currency`
  )
VALUES
  (
    38,
    'Mrs',
    'Nitesh',
    'D',
    'Giri',
    9394687467,
    'dhjbkuhjd@kujshd.com',
    10,
    'male',
    100,
    100,
    '2023-11-23 05:45:13',
    '2023-11-23 05:45:13',
    '432112334123',
    '3232344458845888',
    '',
    '',
    '',
    'NA',
    '+91',
    0,
    NULL,
    NULL,
    NULL,
    100,
    'Paid',
    '2023-11-23 00:00:00',
    NULL,
    NULL,
    'Single',
    'B+',
    NULL,
    ''
  );
INSERT INTO
  `patientregistrations` (
    `id`,
    `mr`,
    `firstName`,
    `middleName`,
    `lastName`,
    `phoneNumberP`,
    `email`,
    `age`,
    `gender`,
    `height`,
    `weight`,
    `createdAt`,
    `updatedAt`,
    `PatientAadharID`,
    `HealthNationalID`,
    `city`,
    `state`,
    `pincode`,
    `address`,
    `countryCode`,
    `hospitalId`,
    `CorporateID`,
    `PackageID`,
    `PackageName`,
    `registrationFees`,
    `paymentStatus`,
    `paymentDate`,
    `CompanyName`,
    `CompanyID`,
    `maritalStatus`,
    `bloodGroup`,
    `ageOption`,
    `Currency`
  )
VALUES
  (
    39,
    'Mrs',
    'Jai',
    'D',
    'Kumar',
    9394687462,
    'dhj2wesbkuhjd@kujshd.com',
    10,
    'male',
    100,
    100,
    '2023-11-23 05:48:21',
    '2023-11-23 05:48:21',
    '432112334123',
    '3232344458845888',
    '',
    '',
    '',
    'NA',
    '+91',
    0,
    NULL,
    NULL,
    NULL,
    100,
    'Paid',
    '2023-11-23 00:00:00',
    NULL,
    NULL,
    'Single',
    'B+',
    'Month',
    ''
  );
INSERT INTO
  `patientregistrations` (
    `id`,
    `mr`,
    `firstName`,
    `middleName`,
    `lastName`,
    `phoneNumberP`,
    `email`,
    `age`,
    `gender`,
    `height`,
    `weight`,
    `createdAt`,
    `updatedAt`,
    `PatientAadharID`,
    `HealthNationalID`,
    `city`,
    `state`,
    `pincode`,
    `address`,
    `countryCode`,
    `hospitalId`,
    `CorporateID`,
    `PackageID`,
    `PackageName`,
    `registrationFees`,
    `paymentStatus`,
    `paymentDate`,
    `CompanyName`,
    `CompanyID`,
    `maritalStatus`,
    `bloodGroup`,
    `ageOption`,
    `Currency`
  )
VALUES
  (
    40,
    'Mr',
    'Nitesh',
    'D',
    'Giri',
    7876598397,
    'patient@gmail.com',
    38,
    'male',
    10,
    10,
    '2024-01-08 14:01:30',
    '2024-01-08 14:01:30',
    '',
    '',
    'Nanded',
    '',
    '',
    '',
    '+91',
    0,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    'Single',
    'NA',
    'Month',
    ''
  );
INSERT INTO
  `patientregistrations` (
    `id`,
    `mr`,
    `firstName`,
    `middleName`,
    `lastName`,
    `phoneNumberP`,
    `email`,
    `age`,
    `gender`,
    `height`,
    `weight`,
    `createdAt`,
    `updatedAt`,
    `PatientAadharID`,
    `HealthNationalID`,
    `city`,
    `state`,
    `pincode`,
    `address`,
    `countryCode`,
    `hospitalId`,
    `CorporateID`,
    `PackageID`,
    `PackageName`,
    `registrationFees`,
    `paymentStatus`,
    `paymentDate`,
    `CompanyName`,
    `CompanyID`,
    `maritalStatus`,
    `bloodGroup`,
    `ageOption`,
    `Currency`
  )
VALUES
  (
    41,
    'Mrs',
    'Vijaya',
    '',
    'Kumari',
    7684659836,
    '',
    20,
    'male',
    50,
    20,
    '2024-01-14 09:30:55',
    '2024-01-14 09:30:55',
    '',
    '',
    '',
    '',
    '',
    'India',
    '+91',
    0,
    NULL,
    NULL,
    NULL,
    100,
    'Paid',
    '2024-01-14 00:00:00',
    NULL,
    NULL,
    'Single',
    'B+',
    'Month',
    'USD'
  );
INSERT INTO
  `patientregistrations` (
    `id`,
    `mr`,
    `firstName`,
    `middleName`,
    `lastName`,
    `phoneNumberP`,
    `email`,
    `age`,
    `gender`,
    `height`,
    `weight`,
    `createdAt`,
    `updatedAt`,
    `PatientAadharID`,
    `HealthNationalID`,
    `city`,
    `state`,
    `pincode`,
    `address`,
    `countryCode`,
    `hospitalId`,
    `CorporateID`,
    `PackageID`,
    `PackageName`,
    `registrationFees`,
    `paymentStatus`,
    `paymentDate`,
    `CompanyName`,
    `CompanyID`,
    `maritalStatus`,
    `bloodGroup`,
    `ageOption`,
    `Currency`
  )
VALUES
  (
    42,
    'Mr',
    'hhgg',
    'gvjhgjhg',
    'mjhgjh',
    8765677565,
    '',
    65,
    'male',
    56,
    7,
    '2024-01-28 13:15:15',
    '2024-01-28 13:15:15',
    '',
    '',
    '',
    '',
    '',
    'kjhhgjghfhgjh',
    '+91',
    0,
    NULL,
    NULL,
    NULL,
    10,
    'Paid',
    '2024-01-28 00:00:00',
    NULL,
    NULL,
    'Single',
    '',
    'Month',
    'INR'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: pharmacists
# ------------------------------------------------------------

INSERT INTO
  `pharmacists` (
    `id`,
    `username`,
    `FirstName`,
    `MiddleName`,
    `LastName`,
    `Address`,
    `phoneNo`,
    `email`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    1,
    'Datta02',
    'Datta',
    'R',
    'Kumar',
    'Pune',
    7656767765,
    'datta@gmail.com',
    '2023-09-25 17:06:08',
    '2023-09-25 17:06:08'
  );
INSERT INTO
  `pharmacists` (
    `id`,
    `username`,
    `FirstName`,
    `MiddleName`,
    `LastName`,
    `Address`,
    `phoneNo`,
    `email`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    2,
    'Vijay023',
    'Vijay',
    '',
    'Kumar',
    'kytrtfyghjk',
    7475684675,
    'vija98y@gmail.com',
    '2024-01-27 09:24:57',
    '2024-01-27 09:24:55'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: phosphorousresultmodeldiagnostics
# ------------------------------------------------------------

INSERT INTO
  `phosphorousresultmodeldiagnostics` (
    `id`,
    `PatientID`,
    `TestManagementID`,
    `PatientTestBookingID`,
    `hjb`,
    `kujyhku`,
    `createdAt`,
    `updatedAt`,
    `kjhbskq_hjbdkwdhdbowqbjhdboquhbdqhdwbquwdbqdwbqw`,
    `Comment`
  )
VALUES
  (
    1,
    18,
    4,
    1,
    'j,n',
    NULL,
    '2023-10-09 17:01:55',
    '2023-10-09 17:01:55',
    'j,n ljygbdewyugb wukgbdywdhb udlghboqudghb gbdhuwyghdowI\nOUWQILGDHOWEIGDH WEDHBWEGHDIW WIODHWIEEHDW\nCWAUDHBWUIHDBX WDEUHXWEOIDHBXWAHE\nSDXWEUSDHBOIWUHDIWABS WAELIUSDHWIOIUHDSXIWA\nXWAUIHDNIQU2LWHJDIWS XUISHDBIUHSDBIUWS XUISBDUWHSDIWSA\nXKUHJBDUYWYHDWEB D UWE ECKHEAJHCBKUEAJHBCSAHJC WE\nDKHAWJBDDKUHWEBKUHE DKJHJBCKHEABCKHJEADBCDSCLJBS\nCDJHBDHWEJBSCJHDSBCJKHABCJKHBAJKSC E KJJEDBSCKHD C E\nWEKSJDBKUHWUBSDKHBES\nDFKUHEJSEBSKUHBDKUHUQWHEWBKUHHWBDKUHWE EA BQKUEBDWAE\nj,n ljygbdewyugb wukgbdywdhb udlghboqudghb gbdhuwyghdowI\nOUWQILGDHOWEIGDH WEDHBWEGHDIW WIODHWIEEHDW\nCWAUDHBWUIHDBX WDEUHXWEOIDHBXWAHE\nSDXWEUSDHBOIWUHDIWABS WAELIUSDHWIOIUHDSXIWA\nXWAUIHDNIQU2LWHJDIWS XUISHDBIUHSDBIUWS XUISBDUWHSDIWSA\nXKUHJBDUYWYHDWEB D UWE ECKHEAJHCBKUEAJHBCSAHJC WE\nDKHAWJBDDKUHWEBKUHE DKJHJBCKHEABCKHJEADBCDSCLJBS\nCDJHBDHWEJBSCJHDSBCJKHABCJKHj,n ljygbdewyugb wukgbdywdhb udlghboqudghb gbdhuwyghdowI\nOUWQILGDHOWEIGDH WEDHBWEGHDIW WIODHWIEEHDW\nCWAUDHBWUIHDBX WDEUHXWEOIDHBXWAHE\nSDXWEUSDHBOIWUHDIWABS WAELIUSDHWIOIUHDSXIWA\nXWAUIHDNIQU2LWHJDIWS XUISHDBIUHSDBIUWS XUISBDUWHSDIWSA\nXKUHJBDUYWYHDWEB D UWE ECKHEAJHCBKUEAJHBCSAHJC WE\nDKHAWJBDDKUHWEBKUHE DKJHJBCKHEABCKHJEADBCDSCLJBS\nCDJHBDHWEJBSCJHDSBCJKHABCJKHBAJKSC E KJJEDBSCKHD C E\nWEKSJDBKUHWUBSDKHBES\nDFKUHEJSEBSKUHBDKUHUQWHEWBKUHHWBDKUHWE EA BQKUEBDWAE\nj,n ljygbdewyugb wukgbdywdhb udlghboqudghb gbdhuwyghdowI\nOUWQILGDHOWEIGDH WEDHBWEGHDIW WIODHWIEEHDW\nCWAUDHBWUIHDBX WDEUHXWEOIDHBXWAHE\nSDXWEUSDHBOIWUHDIWABS WAELIUSDHWIOIUHDSXIWA\nXWAUIHDNIQU2LWHJDIWS XUISHDBIUHSDBIUWS XUISBDUWHSDIWSA\nXKUHJBDUYWYHDWEB D UWE ECKHEAJHCBKUEAJHBCSAHJC WE\nDKHAWJBDDKUHWEBKUHE DKJHJBCKHEABCKHJEADBCDSCLJBS\nCDJHBDHWEJBSCJHDSBCJKHABCJKH\n\nj,n ljygbdewyugb wukgbdywdhb udlghboqudghb gbdhuwyghdowI\nOUWQILGDHOWEIGDH WEDHBWEGHDIW WIODHWIEEHDW\nCWAUDHBWUIHDBX WDEUHXWEOIDHBXWAHE\nSDXWEUSDHBOIWUHDIWABS WAELIUSDHWIOIUHDSXIWA\nXWAUIHDNIQU2LWHJDIWS XUISHDBIUHSDBIUWS XUISBDUWHSDIWSA\nXKUHJBDUYWYHDWEB D UWE ECKHEAJHCBKUEAJHBCSAHJC WE\nDKHAWJBDDKUHWEBKUHE DKJHJBCKHEABCKHJEADBCDSCLJBS\nCDJHBDHWEJBSCJHDSBCJKHABCJKHBAJKSC E KJJEDBSCKHD C E\nWEKSJDBKUHWUBSDKHBES\nDFKUHEJSEBSKUHBDKUHUQWHEWBKUHHWBDKUHWE EA BQKUEBDWAE\nj,n ljygbdewyugb wukgbdywdhb udlghboqudghb gbdhuwyghdowI\nOUWQILGDHOWEIGDH WEDHBWEGHDIW WIODHWIEEHDW\nCWAUDHBWUIHDBX WDEUHXWEOIDHBXWAHE\nSDXWEUSDHBOIWUHDIWABS WAELIUSDHWIOIUHDSXIWA\nXWAUIHDNIQU2LWHJDIWS XUISHDBIUHSDBIUWS XUISBDUWHSDIWSA\nXKUHJBDUYWYHDWEB D UWE ECKHEAJHCBKUEAJHBCSAHJC WE\nDKHAWJBDDKUHWEBKUHE DKJHJBCKHEABCKHJEADBCDSCLJBS\nCDJHBDHWEJBSCJHDSBCJKHABCJKH',
    NULL
  );
INSERT INTO
  `phosphorousresultmodeldiagnostics` (
    `id`,
    `PatientID`,
    `TestManagementID`,
    `PatientTestBookingID`,
    `hjb`,
    `kujyhku`,
    `createdAt`,
    `updatedAt`,
    `kjhbskq_hjbdkwdhdbowqbjhdboquhbdqhdwbquwdbqdwbqw`,
    `Comment`
  )
VALUES
  (
    2,
    29,
    4,
    6,
    'NA',
    'na',
    '2023-10-18 17:52:38',
    '2023-10-18 17:52:38',
    NULL,
    NULL
  );
INSERT INTO
  `phosphorousresultmodeldiagnostics` (
    `id`,
    `PatientID`,
    `TestManagementID`,
    `PatientTestBookingID`,
    `hjb`,
    `kujyhku`,
    `createdAt`,
    `updatedAt`,
    `kjhbskq_hjbdkwdhdbowqbjhdboquhbdqhdwbquwdbqdwbqw`,
    `Comment`
  )
VALUES
  (
    3,
    39,
    4,
    26,
    'jhbjhb',
    'jhb',
    '2024-01-14 17:33:21',
    '2024-01-14 17:33:21',
    'jhb',
    'jhbjj'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: plateletcountresultmodels
# ------------------------------------------------------------

INSERT INTO
  `plateletcountresultmodels` (
    `id`,
    `PatientID`,
    `TestManagementID`,
    `PatientTestBookingID`,
    `Platelet_Count`,
    `Smear_Examination`,
    `createdAt`,
    `updatedAt`,
    `Blood`,
    `Comment`
  )
VALUES
  (
    1,
    1,
    10,
    12,
    '155000',
    'Adequate On Smear',
    '2023-09-05 08:27:55',
    '2023-09-05 08:27:55',
    NULL,
    NULL
  );
INSERT INTO
  `plateletcountresultmodels` (
    `id`,
    `PatientID`,
    `TestManagementID`,
    `PatientTestBookingID`,
    `Platelet_Count`,
    `Smear_Examination`,
    `createdAt`,
    `updatedAt`,
    `Blood`,
    `Comment`
  )
VALUES
  (
    2,
    1,
    10,
    12,
    '14000',
    '0',
    '2023-09-06 15:09:38',
    '2023-09-06 15:09:38',
    NULL,
    NULL
  );
INSERT INTO
  `plateletcountresultmodels` (
    `id`,
    `PatientID`,
    `TestManagementID`,
    `PatientTestBookingID`,
    `Platelet_Count`,
    `Smear_Examination`,
    `createdAt`,
    `updatedAt`,
    `Blood`,
    `Comment`
  )
VALUES
  (
    3,
    1,
    10,
    12,
    '14000',
    '0',
    '2023-09-06 15:13:09',
    '2023-09-06 15:13:09',
    NULL,
    NULL
  );
INSERT INTO
  `plateletcountresultmodels` (
    `id`,
    `PatientID`,
    `TestManagementID`,
    `PatientTestBookingID`,
    `Platelet_Count`,
    `Smear_Examination`,
    `createdAt`,
    `updatedAt`,
    `Blood`,
    `Comment`
  )
VALUES
  (
    4,
    1,
    10,
    12,
    '1000',
    '0',
    '2023-09-06 15:13:30',
    '2023-09-06 15:13:30',
    NULL,
    NULL
  );
INSERT INTO
  `plateletcountresultmodels` (
    `id`,
    `PatientID`,
    `TestManagementID`,
    `PatientTestBookingID`,
    `Platelet_Count`,
    `Smear_Examination`,
    `createdAt`,
    `updatedAt`,
    `Blood`,
    `Comment`
  )
VALUES
  (
    5,
    1,
    10,
    12,
    '100',
    'NA',
    '2023-09-07 16:09:36',
    '2023-09-07 16:09:36',
    NULL,
    NULL
  );
INSERT INTO
  `plateletcountresultmodels` (
    `id`,
    `PatientID`,
    `TestManagementID`,
    `PatientTestBookingID`,
    `Platelet_Count`,
    `Smear_Examination`,
    `createdAt`,
    `updatedAt`,
    `Blood`,
    `Comment`
  )
VALUES
  (
    6,
    2,
    10,
    22,
    '10',
    '1000',
    '2023-09-07 18:03:42',
    '2023-09-07 18:03:42',
    NULL,
    NULL
  );
INSERT INTO
  `plateletcountresultmodels` (
    `id`,
    `PatientID`,
    `TestManagementID`,
    `PatientTestBookingID`,
    `Platelet_Count`,
    `Smear_Examination`,
    `createdAt`,
    `updatedAt`,
    `Blood`,
    `Comment`
  )
VALUES
  (
    7,
    15,
    9,
    37,
    '11',
    '1111111',
    '2023-09-18 10:39:10',
    '2023-09-18 10:39:10',
    NULL,
    NULL
  );
INSERT INTO
  `plateletcountresultmodels` (
    `id`,
    `PatientID`,
    `TestManagementID`,
    `PatientTestBookingID`,
    `Platelet_Count`,
    `Smear_Examination`,
    `createdAt`,
    `updatedAt`,
    `Blood`,
    `Comment`
  )
VALUES
  (
    8,
    14,
    8,
    36,
    '11122222222',
    '22222222222222',
    '2023-09-18 10:41:02',
    '2023-09-18 10:41:02',
    NULL,
    NULL
  );
INSERT INTO
  `plateletcountresultmodels` (
    `id`,
    `PatientID`,
    `TestManagementID`,
    `PatientTestBookingID`,
    `Platelet_Count`,
    `Smear_Examination`,
    `createdAt`,
    `updatedAt`,
    `Blood`,
    `Comment`
  )
VALUES
  (
    9,
    15,
    11,
    39,
    '10',
    '100',
    '2023-09-18 15:45:14',
    '2023-09-18 15:45:14',
    NULL,
    NULL
  );
INSERT INTO
  `plateletcountresultmodels` (
    `id`,
    `PatientID`,
    `TestManagementID`,
    `PatientTestBookingID`,
    `Platelet_Count`,
    `Smear_Examination`,
    `createdAt`,
    `updatedAt`,
    `Blood`,
    `Comment`
  )
VALUES
  (
    10,
    16,
    10,
    40,
    '111',
    '11111',
    '2023-10-09 18:19:40',
    '2023-10-09 18:19:40',
    NULL,
    NULL
  );
INSERT INTO
  `plateletcountresultmodels` (
    `id`,
    `PatientID`,
    `TestManagementID`,
    `PatientTestBookingID`,
    `Platelet_Count`,
    `Smear_Examination`,
    `createdAt`,
    `updatedAt`,
    `Blood`,
    `Comment`
  )
VALUES
  (
    11,
    18,
    10,
    41,
    '',
    '',
    '2023-09-22 23:57:00',
    '2023-09-22 23:57:00',
    NULL,
    NULL
  );
INSERT INTO
  `plateletcountresultmodels` (
    `id`,
    `PatientID`,
    `TestManagementID`,
    `PatientTestBookingID`,
    `Platelet_Count`,
    `Smear_Examination`,
    `createdAt`,
    `updatedAt`,
    `Blood`,
    `Comment`
  )
VALUES
  (
    12,
    10,
    10,
    27,
    '11',
    NULL,
    '2023-09-21 22:38:38',
    '2023-09-21 22:38:38',
    NULL,
    NULL
  );
INSERT INTO
  `plateletcountresultmodels` (
    `id`,
    `PatientID`,
    `TestManagementID`,
    `PatientTestBookingID`,
    `Platelet_Count`,
    `Smear_Examination`,
    `createdAt`,
    `updatedAt`,
    `Blood`,
    `Comment`
  )
VALUES
  (
    13,
    14,
    10,
    43,
    '21',
    '34',
    '2023-09-23 08:47:50',
    '2023-09-23 08:47:50',
    NULL,
    NULL
  );
INSERT INTO
  `plateletcountresultmodels` (
    `id`,
    `PatientID`,
    `TestManagementID`,
    `PatientTestBookingID`,
    `Platelet_Count`,
    `Smear_Examination`,
    `createdAt`,
    `updatedAt`,
    `Blood`,
    `Comment`
  )
VALUES
  (
    14,
    18,
    10,
    46,
    '23',
    '56',
    '2023-09-28 08:19:21',
    '2023-09-28 08:19:21',
    NULL,
    NULL
  );
INSERT INTO
  `plateletcountresultmodels` (
    `id`,
    `PatientID`,
    `TestManagementID`,
    `PatientTestBookingID`,
    `Platelet_Count`,
    `Smear_Examination`,
    `createdAt`,
    `updatedAt`,
    `Blood`,
    `Comment`
  )
VALUES
  (
    15,
    32,
    10,
    75,
    'jhmn',
    'jnm',
    '2023-10-20 18:45:41',
    '2023-10-20 18:45:41',
    '23jh',
    NULL
  );
INSERT INTO
  `plateletcountresultmodels` (
    `id`,
    `PatientID`,
    `TestManagementID`,
    `PatientTestBookingID`,
    `Platelet_Count`,
    `Smear_Examination`,
    `createdAt`,
    `updatedAt`,
    `Blood`,
    `Comment`
  )
VALUES
  (
    16,
    36,
    10,
    83,
    '150',
    '150000',
    '2023-10-24 15:57:20',
    '2023-10-24 15:57:20',
    '200',
    'NA'
  );
INSERT INTO
  `plateletcountresultmodels` (
    `id`,
    `PatientID`,
    `TestManagementID`,
    `PatientTestBookingID`,
    `Platelet_Count`,
    `Smear_Examination`,
    `createdAt`,
    `updatedAt`,
    `Blood`,
    `Comment`
  )
VALUES
  (
    17,
    36,
    10,
    84,
    '200000',
    '110',
    '2023-10-24 15:56:56',
    '2023-10-24 15:56:56',
    '220',
    '23'
  );
INSERT INTO
  `plateletcountresultmodels` (
    `id`,
    `PatientID`,
    `TestManagementID`,
    `PatientTestBookingID`,
    `Platelet_Count`,
    `Smear_Examination`,
    `createdAt`,
    `updatedAt`,
    `Blood`,
    `Comment`
  )
VALUES
  (
    18,
    36,
    10,
    96,
    '150000',
    '210',
    '2023-10-25 17:26:33',
    '2023-10-25 17:26:33',
    '110',
    'NA'
  );
INSERT INTO
  `plateletcountresultmodels` (
    `id`,
    `PatientID`,
    `TestManagementID`,
    `PatientTestBookingID`,
    `Platelet_Count`,
    `Smear_Examination`,
    `createdAt`,
    `updatedAt`,
    `Blood`,
    `Comment`
  )
VALUES
  (
    19,
    36,
    10,
    95,
    '150000',
    '190',
    '2023-10-25 12:00:00',
    '2023-10-25 12:00:00',
    '130',
    'NA'
  );
INSERT INTO
  `plateletcountresultmodels` (
    `id`,
    `PatientID`,
    `TestManagementID`,
    `PatientTestBookingID`,
    `Platelet_Count`,
    `Smear_Examination`,
    `createdAt`,
    `updatedAt`,
    `Blood`,
    `Comment`
  )
VALUES
  (
    20,
    37,
    10,
    97,
    '11',
    NULL,
    '2023-10-25 17:31:34',
    '2023-10-25 17:31:34',
    NULL,
    NULL
  );
INSERT INTO
  `plateletcountresultmodels` (
    `id`,
    `PatientID`,
    `TestManagementID`,
    `PatientTestBookingID`,
    `Platelet_Count`,
    `Smear_Examination`,
    `createdAt`,
    `updatedAt`,
    `Blood`,
    `Comment`
  )
VALUES
  (
    21,
    37,
    10,
    98,
    '12',
    '321',
    '2023-10-25 17:35:45',
    '2023-10-25 17:35:45',
    NULL,
    NULL
  );
INSERT INTO
  `plateletcountresultmodels` (
    `id`,
    `PatientID`,
    `TestManagementID`,
    `PatientTestBookingID`,
    `Platelet_Count`,
    `Smear_Examination`,
    `createdAt`,
    `updatedAt`,
    `Blood`,
    `Comment`
  )
VALUES
  (
    22,
    36,
    10,
    118,
    '10',
    '100',
    '2024-01-27 13:25:20',
    '2024-01-27 13:25:20',
    '100000',
    'NA'
  );
INSERT INTO
  `plateletcountresultmodels` (
    `id`,
    `PatientID`,
    `TestManagementID`,
    `PatientTestBookingID`,
    `Platelet_Count`,
    `Smear_Examination`,
    `createdAt`,
    `updatedAt`,
    `Blood`,
    `Comment`
  )
VALUES
  (
    23,
    40,
    10,
    119,
    '100',
    '1000',
    '2024-01-27 13:45:01',
    '2024-01-27 13:45:01',
    '12',
    'NA'
  );
INSERT INTO
  `plateletcountresultmodels` (
    `id`,
    `PatientID`,
    `TestManagementID`,
    `PatientTestBookingID`,
    `Platelet_Count`,
    `Smear_Examination`,
    `createdAt`,
    `updatedAt`,
    `Blood`,
    `Comment`
  )
VALUES
  (
    24,
    40,
    10,
    120,
    '120',
    '202',
    '2024-01-27 13:47:37',
    '2024-01-27 13:47:37',
    '2030',
    'NA'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: plateletcounttestmodels
# ------------------------------------------------------------

INSERT INTO
  `plateletcounttestmodels` (
    `id`,
    `PatientID`,
    `TestManagementID`,
    `PatientTestBookingID`,
    `Platelet_Count`,
    `Smear_Examination`,
    `resultDate`,
    `Remarks`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    1,
    1,
    10,
    12,
    '155000',
    'Adequate On Smear',
    '2023-09-03T11:07:31.866Z',
    'NA',
    '2023-09-03 11:09:00',
    '2023-09-03 11:09:00'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: quantityoutreports
# ------------------------------------------------------------

INSERT INTO
  `quantityoutreports` (
    `id`,
    `ItemName`,
    `BatchNumber`,
    `ExpiryDate`,
    `UnitPrice`,
    `Quantity`,
    `dateOut`,
    `AverageMonthlyQuantityOut`,
    `AverageWeeklyQuantityOut`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    1,
    'sumo cold',
    'Batch01',
    '2024-10-10 00:00:00',
    NULL,
    5,
    '2023-08-26',
    0,
    1,
    '2023-08-26 14:15:16',
    '2023-08-26 14:16:01'
  );
INSERT INTO
  `quantityoutreports` (
    `id`,
    `ItemName`,
    `BatchNumber`,
    `ExpiryDate`,
    `UnitPrice`,
    `Quantity`,
    `dateOut`,
    `AverageMonthlyQuantityOut`,
    `AverageWeeklyQuantityOut`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    2,
    'sumo cold',
    'Batch01',
    '2024-10-10 00:00:00',
    NULL,
    20,
    '2023-08-30',
    1,
    4,
    '2023-08-30 13:47:55',
    '2023-08-30 13:47:55'
  );
INSERT INTO
  `quantityoutreports` (
    `id`,
    `ItemName`,
    `BatchNumber`,
    `ExpiryDate`,
    `UnitPrice`,
    `Quantity`,
    `dateOut`,
    `AverageMonthlyQuantityOut`,
    `AverageWeeklyQuantityOut`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    3,
    'sumo cold',
    'Batch01',
    '2024-10-10 00:00:00',
    NULL,
    15,
    '2023-09-10',
    1,
    2,
    '2023-09-10 04:21:11',
    '2023-09-10 04:21:38'
  );
INSERT INTO
  `quantityoutreports` (
    `id`,
    `ItemName`,
    `BatchNumber`,
    `ExpiryDate`,
    `UnitPrice`,
    `Quantity`,
    `dateOut`,
    `AverageMonthlyQuantityOut`,
    `AverageWeeklyQuantityOut`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    4,
    'sumo cold',
    'Batch01',
    '2024-10-10 00:00:00',
    NULL,
    23,
    '2023-09-12',
    2,
    5,
    '2023-09-12 08:08:27',
    '2023-09-12 09:50:43'
  );
INSERT INTO
  `quantityoutreports` (
    `id`,
    `ItemName`,
    `BatchNumber`,
    `ExpiryDate`,
    `UnitPrice`,
    `Quantity`,
    `dateOut`,
    `AverageMonthlyQuantityOut`,
    `AverageWeeklyQuantityOut`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    5,
    'Insulin',
    'BT01',
    '2023-10-08 00:00:00',
    NULL,
    15,
    '2023-09-12',
    1,
    2,
    '2023-09-12 08:08:27',
    '2023-09-12 08:15:07'
  );
INSERT INTO
  `quantityoutreports` (
    `id`,
    `ItemName`,
    `BatchNumber`,
    `ExpiryDate`,
    `UnitPrice`,
    `Quantity`,
    `dateOut`,
    `AverageMonthlyQuantityOut`,
    `AverageWeeklyQuantityOut`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    6,
    'Ibuprofen',
    'BT789',
    '2023-12-31 00:00:00',
    NULL,
    1,
    '2023-10-17',
    0,
    0,
    '2023-10-17 08:52:54',
    '2023-10-17 08:52:54'
  );
INSERT INTO
  `quantityoutreports` (
    `id`,
    `ItemName`,
    `BatchNumber`,
    `ExpiryDate`,
    `UnitPrice`,
    `Quantity`,
    `dateOut`,
    `AverageMonthlyQuantityOut`,
    `AverageWeeklyQuantityOut`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    7,
    'Sumo Cold',
    'B754653485',
    '2024-03-01 00:00:00',
    NULL,
    16,
    '2024-01-10',
    1,
    2,
    '2024-01-10 10:44:25',
    '2024-01-10 10:45:07'
  );
INSERT INTO
  `quantityoutreports` (
    `id`,
    `ItemName`,
    `BatchNumber`,
    `ExpiryDate`,
    `UnitPrice`,
    `Quantity`,
    `dateOut`,
    `AverageMonthlyQuantityOut`,
    `AverageWeeklyQuantityOut`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    8,
    'Tramadol',
    'BT010',
    '2024-06-30 00:00:00',
    NULL,
    3,
    '2024-01-14',
    0,
    0,
    '2024-01-14 06:03:01',
    '2024-01-14 06:50:42'
  );
INSERT INTO
  `quantityoutreports` (
    `id`,
    `ItemName`,
    `BatchNumber`,
    `ExpiryDate`,
    `UnitPrice`,
    `Quantity`,
    `dateOut`,
    `AverageMonthlyQuantityOut`,
    `AverageWeeklyQuantityOut`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    9,
    'Escitalopram',
    'BT232',
    '2024-03-31 00:00:00',
    NULL,
    1,
    '2024-01-14',
    0,
    0,
    '2024-01-14 06:50:42',
    '2024-01-14 06:50:42'
  );
INSERT INTO
  `quantityoutreports` (
    `id`,
    `ItemName`,
    `BatchNumber`,
    `ExpiryDate`,
    `UnitPrice`,
    `Quantity`,
    `dateOut`,
    `AverageMonthlyQuantityOut`,
    `AverageWeeklyQuantityOut`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    10,
    'Tylenol',
    'BT0101',
    '2024-05-18 00:00:00',
    NULL,
    2,
    '2024-01-28',
    0,
    0,
    '2024-01-28 11:21:48',
    '2024-01-28 11:34:15'
  );
INSERT INTO
  `quantityoutreports` (
    `id`,
    `ItemName`,
    `BatchNumber`,
    `ExpiryDate`,
    `UnitPrice`,
    `Quantity`,
    `dateOut`,
    `AverageMonthlyQuantityOut`,
    `AverageWeeklyQuantityOut`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    11,
    'Zinetac 150mg Tablet',
    'BT01',
    '2025-10-21 00:00:00',
    NULL,
    2,
    '2024-01-28',
    0,
    0,
    '2024-01-28 11:21:49',
    '2024-01-28 11:34:15'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: roles
# ------------------------------------------------------------

INSERT INTO
  `roles` (`id`, `role`, `createdAt`, `updatedAt`)
VALUES
  (
    1,
    'user',
    '2023-08-25 05:17:33',
    '2023-08-25 05:17:33'
  );
INSERT INTO
  `roles` (`id`, `role`, `createdAt`, `updatedAt`)
VALUES
  (
    2,
    'doctor',
    '2023-08-25 05:17:33',
    '2023-08-25 05:17:33'
  );
INSERT INTO
  `roles` (`id`, `role`, `createdAt`, `updatedAt`)
VALUES
  (
    3,
    'pharmacist',
    '2023-08-25 05:17:33',
    '2023-08-25 05:17:33'
  );
INSERT INTO
  `roles` (`id`, `role`, `createdAt`, `updatedAt`)
VALUES
  (
    4,
    'patient',
    '2023-08-25 05:17:33',
    '2023-08-25 05:17:33'
  );
INSERT INTO
  `roles` (`id`, `role`, `createdAt`, `updatedAt`)
VALUES
  (
    5,
    'nurse',
    '2023-08-25 05:17:33',
    '2023-08-25 05:17:33'
  );
INSERT INTO
  `roles` (`id`, `role`, `createdAt`, `updatedAt`)
VALUES
  (
    6,
    'admin',
    '2023-08-25 05:17:33',
    '2023-08-25 05:17:33'
  );
INSERT INTO
  `roles` (`id`, `role`, `createdAt`, `updatedAt`)
VALUES
  (
    9,
    'superAdmin',
    '2023-09-06 12:59:13',
    '2023-09-06 12:59:13'
  );
INSERT INTO
  `roles` (`id`, `role`, `createdAt`, `updatedAt`)
VALUES
  (
    10,
    'collectionTechnician',
    '2023-09-12 10:16:51',
    '2023-09-12 10:16:51'
  );
INSERT INTO
  `roles` (`id`, `role`, `createdAt`, `updatedAt`)
VALUES
  (
    11,
    'pathologistAdmin',
    '2023-09-20 09:23:36',
    '2023-09-20 09:23:36'
  );
INSERT INTO
  `roles` (`id`, `role`, `createdAt`, `updatedAt`)
VALUES
  (
    12,
    'diagnosticTechnician',
    '2023-09-28 16:18:24',
    '2023-09-28 16:18:24'
  );
INSERT INTO
  `roles` (`id`, `role`, `createdAt`, `updatedAt`)
VALUES
  (
    13,
    'Receptionist',
    '2023-09-28 16:37:55',
    '2023-09-28 16:37:55'
  );
INSERT INTO
  `roles` (`id`, `role`, `createdAt`, `updatedAt`)
VALUES
  (
    14,
    'OTTechnician',
    '2023-09-29 04:54:26',
    '2023-09-29 04:54:26'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: samplecollections
# ------------------------------------------------------------

INSERT INTO
  `samplecollections` (
    `id`,
    `PatientName`,
    `PatientID`,
    `Address`,
    `PatientPhoneNo`,
    `BarcodeValuesAllSelectedTest`,
    `sampleName`,
    `sampleDate`,
    `sampleTime`,
    `sampleLocation`,
    `reCollection`,
    `reCollectionDate`,
    `reCollectionTime`,
    `sampleTakerName`,
    `testType`,
    `remarks`,
    `createdAt`,
    `updatedAt`,
    `PathologyTestBookingId`
  )
VALUES
  (
    1,
    'Amrut  B.',
    10,
    'Null',
    8765456789,
    'T320231023PID10, Platelet20231023PID10, Lipid20231023PID10',
    'T3 T4 TSH,Platelet Count,Lipid Profile',
    '2023-11-04',
    '22:25',
    'Home Sample',
    'yes',
    '2023-10-21',
    '10:00',
    'Vijay Kumar',
    'fast',
    'NA',
    '2023-09-12 16:52:30',
    '2023-10-23 12:57:17',
    0
  );
INSERT INTO
  `samplecollections` (
    `id`,
    `PatientName`,
    `PatientID`,
    `Address`,
    `PatientPhoneNo`,
    `BarcodeValuesAllSelectedTest`,
    `sampleName`,
    `sampleDate`,
    `sampleTime`,
    `sampleLocation`,
    `reCollection`,
    `reCollectionDate`,
    `reCollectionTime`,
    `sampleTakerName`,
    `testType`,
    `remarks`,
    `createdAt`,
    `updatedAt`,
    `PathologyTestBookingId`
  )
VALUES
  (
    3,
    'Gangesh  Kumar',
    15,
    'Null',
    6543245675,
    'Lipid20230926PID15',
    'Lipid Profile',
    '2023-09-27',
    '22:58',
    'Lab Sample',
    'No',
    NULL,
    NULL,
    'Vijay',
    'fast',
    'NA',
    '2023-09-26 17:22:53',
    '2023-09-26 17:23:38',
    0
  );
INSERT INTO
  `samplecollections` (
    `id`,
    `PatientName`,
    `PatientID`,
    `Address`,
    `PatientPhoneNo`,
    `BarcodeValuesAllSelectedTest`,
    `sampleName`,
    `sampleDate`,
    `sampleTime`,
    `sampleLocation`,
    `reCollection`,
    `reCollectionDate`,
    `reCollectionTime`,
    `sampleTakerName`,
    `testType`,
    `remarks`,
    `createdAt`,
    `updatedAt`,
    `PathologyTestBookingId`
  )
VALUES
  (
    4,
    'Nitesh  Giri',
    32,
    'Null',
    9876633333,
    'T320231020PID62',
    'T3 T4 TSH',
    '2023-10-20',
    '15:55',
    'Lab Sample',
    'No',
    NULL,
    NULL,
    'NA',
    'fast',
    'NA',
    '2023-10-20 10:37:19',
    '2023-10-20 10:37:19',
    62
  );
INSERT INTO
  `samplecollections` (
    `id`,
    `PatientName`,
    `PatientID`,
    `Address`,
    `PatientPhoneNo`,
    `BarcodeValuesAllSelectedTest`,
    `sampleName`,
    `sampleDate`,
    `sampleTime`,
    `sampleLocation`,
    `reCollection`,
    `reCollectionDate`,
    `reCollectionTime`,
    `sampleTakerName`,
    `testType`,
    `remarks`,
    `createdAt`,
    `updatedAt`,
    `PathologyTestBookingId`
  )
VALUES
  (
    24,
    'Vaibhav  Pande',
    6,
    'Null',
    8976545678,
    'Lipid20231020PID73',
    'Lipid Profile',
    '2023-10-20',
    '16:59',
    'Lab Sample',
    'No',
    NULL,
    NULL,
    'NA',
    'fast',
    'NA',
    '2023-10-20 11:25:19',
    '2023-10-20 11:25:19',
    73
  );
INSERT INTO
  `samplecollections` (
    `id`,
    `PatientName`,
    `PatientID`,
    `Address`,
    `PatientPhoneNo`,
    `BarcodeValuesAllSelectedTest`,
    `sampleName`,
    `sampleDate`,
    `sampleTime`,
    `sampleLocation`,
    `reCollection`,
    `reCollectionDate`,
    `reCollectionTime`,
    `sampleTakerName`,
    `testType`,
    `remarks`,
    `createdAt`,
    `updatedAt`,
    `PathologyTestBookingId`
  )
VALUES
  (
    25,
    'Vaibhav  Pande',
    6,
    'Null',
    8976545678,
    'Platelet20231025PID6',
    'Platelet Count',
    '2023-10-20',
    '10:10',
    'Lab Sample',
    'No',
    NULL,
    NULL,
    'NA',
    'fast',
    'NA',
    '2023-10-20 11:27:05',
    '2023-10-25 12:11:13',
    73
  );
INSERT INTO
  `samplecollections` (
    `id`,
    `PatientName`,
    `PatientID`,
    `Address`,
    `PatientPhoneNo`,
    `BarcodeValuesAllSelectedTest`,
    `sampleName`,
    `sampleDate`,
    `sampleTime`,
    `sampleLocation`,
    `reCollection`,
    `reCollectionDate`,
    `reCollectionTime`,
    `sampleTakerName`,
    `testType`,
    `remarks`,
    `createdAt`,
    `updatedAt`,
    `PathologyTestBookingId`
  )
VALUES
  (
    26,
    'Vaibhav  Pande',
    6,
    'Null',
    8976545678,
    'Blood20231025PID6',
    'Blood Sugar For PP',
    '2023-10-20',
    '10:10',
    'Lab Sample',
    'No',
    NULL,
    NULL,
    '101',
    'fast',
    '10',
    '2023-10-20 11:30:40',
    '2023-10-25 12:37:48',
    73
  );
INSERT INTO
  `samplecollections` (
    `id`,
    `PatientName`,
    `PatientID`,
    `Address`,
    `PatientPhoneNo`,
    `BarcodeValuesAllSelectedTest`,
    `sampleName`,
    `sampleDate`,
    `sampleTime`,
    `sampleLocation`,
    `reCollection`,
    `reCollectionDate`,
    `reCollectionTime`,
    `sampleTakerName`,
    `testType`,
    `remarks`,
    `createdAt`,
    `updatedAt`,
    `PathologyTestBookingId`
  )
VALUES
  (
    30,
    'Nitesh  Giri',
    32,
    'Null',
    9876633333,
    'Lipid20231025PID32',
    'Lipid Profile',
    '2023-10-20',
    '10:10',
    'Lab Sample',
    'No',
    NULL,
    NULL,
    'NA',
    'fast',
    'NA',
    '2023-10-20 12:14:36',
    '2023-10-25 12:36:45',
    74
  );
INSERT INTO
  `samplecollections` (
    `id`,
    `PatientName`,
    `PatientID`,
    `Address`,
    `PatientPhoneNo`,
    `BarcodeValuesAllSelectedTest`,
    `sampleName`,
    `sampleDate`,
    `sampleTime`,
    `sampleLocation`,
    `reCollection`,
    `reCollectionDate`,
    `reCollectionTime`,
    `sampleTakerName`,
    `testType`,
    `remarks`,
    `createdAt`,
    `updatedAt`,
    `PathologyTestBookingId`
  )
VALUES
  (
    31,
    'Nitesh  Giri',
    32,
    'Null',
    9876633333,
    'Blood20231020PID74',
    'Blood Sugar For Fasting',
    '2023-10-20',
    '10:00',
    'Lab Sample',
    'No',
    NULL,
    NULL,
    'NA',
    'fast',
    'NA',
    '2023-10-20 12:17:11',
    '2023-10-20 12:17:11',
    74
  );
INSERT INTO
  `samplecollections` (
    `id`,
    `PatientName`,
    `PatientID`,
    `Address`,
    `PatientPhoneNo`,
    `BarcodeValuesAllSelectedTest`,
    `sampleName`,
    `sampleDate`,
    `sampleTime`,
    `sampleLocation`,
    `reCollection`,
    `reCollectionDate`,
    `reCollectionTime`,
    `sampleTakerName`,
    `testType`,
    `remarks`,
    `createdAt`,
    `updatedAt`,
    `PathologyTestBookingId`
  )
VALUES
  (
    32,
    'Nitesh  Giri',
    32,
    'Null',
    9876633333,
    'Platelet20231020PID75',
    'Platelet Count',
    '2023-10-20',
    '10:10',
    'Lab Sample',
    'No',
    NULL,
    NULL,
    'NA',
    'fast',
    'NA',
    '2023-10-20 12:28:08',
    '2023-10-20 12:28:08',
    75
  );
INSERT INTO
  `samplecollections` (
    `id`,
    `PatientName`,
    `PatientID`,
    `Address`,
    `PatientPhoneNo`,
    `BarcodeValuesAllSelectedTest`,
    `sampleName`,
    `sampleDate`,
    `sampleTime`,
    `sampleLocation`,
    `reCollection`,
    `reCollectionDate`,
    `reCollectionTime`,
    `sampleTakerName`,
    `testType`,
    `remarks`,
    `createdAt`,
    `updatedAt`,
    `PathologyTestBookingId`
  )
VALUES
  (
    33,
    'Rajesh Kumar Sharma',
    34,
    'Null',
    9876543210,
    'Lipid20231024PID80',
    'Lipid Profile',
    '2023-10-24',
    '10:10',
    'Lab Sample',
    'No',
    NULL,
    NULL,
    'NA',
    'fast',
    'NA',
    '2023-10-24 05:48:41',
    '2023-10-24 05:48:41',
    80
  );
INSERT INTO
  `samplecollections` (
    `id`,
    `PatientName`,
    `PatientID`,
    `Address`,
    `PatientPhoneNo`,
    `BarcodeValuesAllSelectedTest`,
    `sampleName`,
    `sampleDate`,
    `sampleTime`,
    `sampleLocation`,
    `reCollection`,
    `reCollectionDate`,
    `reCollectionTime`,
    `sampleTakerName`,
    `testType`,
    `remarks`,
    `createdAt`,
    `updatedAt`,
    `PathologyTestBookingId`
  )
VALUES
  (
    34,
    'Deepak  Singh',
    36,
    'Null',
    9876543212,
    'Platelet20231024PID83',
    'Platelet Count',
    '2023-10-24',
    '10:10',
    'Lab Sample',
    'No',
    NULL,
    NULL,
    'NA',
    'fast',
    'NA',
    '2023-10-24 05:49:23',
    '2023-10-24 05:49:23',
    83
  );
INSERT INTO
  `samplecollections` (
    `id`,
    `PatientName`,
    `PatientID`,
    `Address`,
    `PatientPhoneNo`,
    `BarcodeValuesAllSelectedTest`,
    `sampleName`,
    `sampleDate`,
    `sampleTime`,
    `sampleLocation`,
    `reCollection`,
    `reCollectionDate`,
    `reCollectionTime`,
    `sampleTakerName`,
    `testType`,
    `remarks`,
    `createdAt`,
    `updatedAt`,
    `PathologyTestBookingId`
  )
VALUES
  (
    35,
    'Deepak  Singh',
    36,
    'Null',
    9876543212,
    'Platelet20231024PID84',
    'Platelet Count',
    '2023-10-24',
    '10:01',
    'Lab Sample',
    'No',
    NULL,
    NULL,
    'NA',
    'fast',
    'NA',
    '2023-10-24 05:55:41',
    '2023-10-24 05:55:41',
    84
  );
INSERT INTO
  `samplecollections` (
    `id`,
    `PatientName`,
    `PatientID`,
    `Address`,
    `PatientPhoneNo`,
    `BarcodeValuesAllSelectedTest`,
    `sampleName`,
    `sampleDate`,
    `sampleTime`,
    `sampleLocation`,
    `reCollection`,
    `reCollectionDate`,
    `reCollectionTime`,
    `sampleTakerName`,
    `testType`,
    `remarks`,
    `createdAt`,
    `updatedAt`,
    `PathologyTestBookingId`
  )
VALUES
  (
    36,
    'Priya  Patel',
    35,
    'Null',
    9876543211,
    'Platelet20231025PID94',
    'Platelet Count',
    '2023-10-25',
    '10:10',
    'Lab Sample',
    'No',
    NULL,
    NULL,
    'NA',
    'fast',
    'NA',
    '2023-10-25 04:47:49',
    '2023-10-25 04:47:49',
    94
  );
INSERT INTO
  `samplecollections` (
    `id`,
    `PatientName`,
    `PatientID`,
    `Address`,
    `PatientPhoneNo`,
    `BarcodeValuesAllSelectedTest`,
    `sampleName`,
    `sampleDate`,
    `sampleTime`,
    `sampleLocation`,
    `reCollection`,
    `reCollectionDate`,
    `reCollectionTime`,
    `sampleTakerName`,
    `testType`,
    `remarks`,
    `createdAt`,
    `updatedAt`,
    `PathologyTestBookingId`
  )
VALUES
  (
    40,
    'Asha Kumari Yadav',
    37,
    'Null',
    9876543213,
    'Platelet20231025PID97',
    'Platelet Count,Lipid Profile',
    '2023-10-26',
    '10:10',
    'Lab Sample',
    'No',
    NULL,
    NULL,
    'Vijay Lumar',
    'fast',
    'NA',
    '2023-10-25 11:59:30',
    '2023-10-25 12:10:50',
    97
  );
INSERT INTO
  `samplecollections` (
    `id`,
    `PatientName`,
    `PatientID`,
    `Address`,
    `PatientPhoneNo`,
    `BarcodeValuesAllSelectedTest`,
    `sampleName`,
    `sampleDate`,
    `sampleTime`,
    `sampleLocation`,
    `reCollection`,
    `reCollectionDate`,
    `reCollectionTime`,
    `sampleTakerName`,
    `testType`,
    `remarks`,
    `createdAt`,
    `updatedAt`,
    `PathologyTestBookingId`
  )
VALUES
  (
    43,
    'Priya  Patel',
    35,
    'Null',
    9876543211,
    'T320231025PID99',
    'T3 T4 TSH',
    '2023-10-25',
    '10:10',
    'Home Sample',
    'No',
    NULL,
    NULL,
    'NA',
    'fast',
    'NA',
    '2023-10-25 12:34:00',
    '2023-10-25 12:34:00',
    99
  );
INSERT INTO
  `samplecollections` (
    `id`,
    `PatientName`,
    `PatientID`,
    `Address`,
    `PatientPhoneNo`,
    `BarcodeValuesAllSelectedTest`,
    `sampleName`,
    `sampleDate`,
    `sampleTime`,
    `sampleLocation`,
    `reCollection`,
    `reCollectionDate`,
    `reCollectionTime`,
    `sampleTakerName`,
    `testType`,
    `remarks`,
    `createdAt`,
    `updatedAt`,
    `PathologyTestBookingId`
  )
VALUES
  (
    44,
    'Priya  Patel',
    35,
    'Null',
    9876543211,
    'Lipid20231025PID99,T320231025PID99',
    'Lipid Profile,T3 T4 TSH',
    '2023-10-25',
    '10:10',
    'Lab Sample',
    'No',
    NULL,
    NULL,
    'NA',
    'fast',
    'NA',
    '2023-10-25 12:35:06',
    '2023-10-25 12:45:41',
    99
  );
INSERT INTO
  `samplecollections` (
    `id`,
    `PatientName`,
    `PatientID`,
    `Address`,
    `PatientPhoneNo`,
    `BarcodeValuesAllSelectedTest`,
    `sampleName`,
    `sampleDate`,
    `sampleTime`,
    `sampleLocation`,
    `reCollection`,
    `reCollectionDate`,
    `reCollectionTime`,
    `sampleTakerName`,
    `testType`,
    `remarks`,
    `createdAt`,
    `updatedAt`,
    `PathologyTestBookingId`
  )
VALUES
  (
    47,
    'Priya  Patel',
    35,
    'Null',
    9876543211,
    'Lipid20231025PID101',
    'Lipid Profile',
    '2023-10-25',
    '19:10',
    'Lab Sample',
    'No',
    NULL,
    NULL,
    'NA',
    'fast',
    'NA',
    '2023-10-25 12:57:07',
    '2023-10-25 12:57:07',
    101
  );
INSERT INTO
  `samplecollections` (
    `id`,
    `PatientName`,
    `PatientID`,
    `Address`,
    `PatientPhoneNo`,
    `BarcodeValuesAllSelectedTest`,
    `sampleName`,
    `sampleDate`,
    `sampleTime`,
    `sampleLocation`,
    `reCollection`,
    `reCollectionDate`,
    `reCollectionTime`,
    `sampleTakerName`,
    `testType`,
    `remarks`,
    `createdAt`,
    `updatedAt`,
    `PathologyTestBookingId`
  )
VALUES
  (
    48,
    'Asha Kumari Yadav',
    37,
    'Null',
    9876543213,
    'Blood20231025PID102',
    'Blood Sugar For Fasting',
    '2023-10-25',
    '10:10',
    'Lab Sample',
    'No',
    NULL,
    NULL,
    'NA',
    'fast',
    'NA',
    '2023-10-25 13:03:48',
    '2023-10-25 13:03:48',
    102
  );
INSERT INTO
  `samplecollections` (
    `id`,
    `PatientName`,
    `PatientID`,
    `Address`,
    `PatientPhoneNo`,
    `BarcodeValuesAllSelectedTest`,
    `sampleName`,
    `sampleDate`,
    `sampleTime`,
    `sampleLocation`,
    `reCollection`,
    `reCollectionDate`,
    `reCollectionTime`,
    `sampleTakerName`,
    `testType`,
    `remarks`,
    `createdAt`,
    `updatedAt`,
    `PathologyTestBookingId`
  )
VALUES
  (
    49,
    'Asha Kumari Yadav',
    37,
    'Null',
    9876543213,
    'Lipid20231025PID102',
    'Lipid Profile',
    '2023-10-26',
    '10:00',
    'Lab Sample',
    'No',
    NULL,
    NULL,
    'NA',
    'fast',
    'NA',
    '2023-10-25 13:05:17',
    '2023-10-25 13:05:17',
    102
  );
INSERT INTO
  `samplecollections` (
    `id`,
    `PatientName`,
    `PatientID`,
    `Address`,
    `PatientPhoneNo`,
    `BarcodeValuesAllSelectedTest`,
    `sampleName`,
    `sampleDate`,
    `sampleTime`,
    `sampleLocation`,
    `reCollection`,
    `reCollectionDate`,
    `reCollectionTime`,
    `sampleTakerName`,
    `testType`,
    `remarks`,
    `createdAt`,
    `updatedAt`,
    `PathologyTestBookingId`
  )
VALUES
  (
    50,
    'Asha Kumari Yadav',
    37,
    'Null',
    9876543213,
    'T320231025PID102',
    'T3 T4 TSH',
    '2023-10-25',
    '10:10',
    'Lab Sample',
    'No',
    NULL,
    NULL,
    'NA',
    'fast',
    'NA',
    '2023-10-25 13:05:51',
    '2023-10-25 13:05:51',
    102
  );
INSERT INTO
  `samplecollections` (
    `id`,
    `PatientName`,
    `PatientID`,
    `Address`,
    `PatientPhoneNo`,
    `BarcodeValuesAllSelectedTest`,
    `sampleName`,
    `sampleDate`,
    `sampleTime`,
    `sampleLocation`,
    `reCollection`,
    `reCollectionDate`,
    `reCollectionTime`,
    `sampleTakerName`,
    `testType`,
    `remarks`,
    `createdAt`,
    `updatedAt`,
    `PathologyTestBookingId`
  )
VALUES
  (
    51,
    'Asha Kumari Yadav',
    37,
    'Null',
    9876543213,
    'Lipid20240110PID114,Platelet20240110PID114',
    'Lipid Profile,Platelet Count',
    '2024-01-11',
    '10:10',
    'Lab Sample',
    'No',
    NULL,
    NULL,
    'NA`',
    'fast',
    'NA',
    '2024-01-10 14:13:19',
    '2024-01-10 14:13:19',
    114
  );
INSERT INTO
  `samplecollections` (
    `id`,
    `PatientName`,
    `PatientID`,
    `Address`,
    `PatientPhoneNo`,
    `BarcodeValuesAllSelectedTest`,
    `sampleName`,
    `sampleDate`,
    `sampleTime`,
    `sampleLocation`,
    `reCollection`,
    `reCollectionDate`,
    `reCollectionTime`,
    `sampleTakerName`,
    `testType`,
    `remarks`,
    `createdAt`,
    `updatedAt`,
    `PathologyTestBookingId`
  )
VALUES
  (
    52,
    'Deepak  Singh',
    36,
    'Null',
    9876543212,
    'Platelet20240114PID118',
    'Platelet Count',
    '2024-01-26',
    '10:10',
    'Lab Sample',
    'No',
    NULL,
    NULL,
    'NA',
    'fast',
    'NA',
    '2024-01-14 14:27:25',
    '2024-01-14 14:27:25',
    118
  );
INSERT INTO
  `samplecollections` (
    `id`,
    `PatientName`,
    `PatientID`,
    `Address`,
    `PatientPhoneNo`,
    `BarcodeValuesAllSelectedTest`,
    `sampleName`,
    `sampleDate`,
    `sampleTime`,
    `sampleLocation`,
    `reCollection`,
    `reCollectionDate`,
    `reCollectionTime`,
    `sampleTakerName`,
    `testType`,
    `remarks`,
    `createdAt`,
    `updatedAt`,
    `PathologyTestBookingId`
  )
VALUES
  (
    53,
    'Nitesh D Giri',
    40,
    'Null',
    7876598397,
    'Platelet20240127PID119',
    'Platelet Count',
    '2024-01-27',
    '10:10',
    'Lab Sample',
    'No',
    NULL,
    NULL,
    'NA',
    'fast',
    'NA',
    '2024-01-27 07:59:34',
    '2024-01-27 07:59:34',
    119
  );
INSERT INTO
  `samplecollections` (
    `id`,
    `PatientName`,
    `PatientID`,
    `Address`,
    `PatientPhoneNo`,
    `BarcodeValuesAllSelectedTest`,
    `sampleName`,
    `sampleDate`,
    `sampleTime`,
    `sampleLocation`,
    `reCollection`,
    `reCollectionDate`,
    `reCollectionTime`,
    `sampleTakerName`,
    `testType`,
    `remarks`,
    `createdAt`,
    `updatedAt`,
    `PathologyTestBookingId`
  )
VALUES
  (
    54,
    'Nitesh D Giri',
    40,
    'Null',
    7876598397,
    'Platelet20240127PID120',
    'Platelet Count',
    '2024-01-27',
    '10:10',
    'Lab Sample',
    'No',
    NULL,
    NULL,
    'NA',
    'fast',
    'NA',
    '2024-01-27 08:17:12',
    '2024-01-27 08:17:12',
    120
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: samplehomecollections
# ------------------------------------------------------------

INSERT INTO
  `samplehomecollections` (
    `id`,
    `PatientName`,
    `PatientID`,
    `Address`,
    `PatientPhoneNo`,
    `sampleName`,
    `sampleDate`,
    `sampleTime`,
    `reCollection`,
    `reCollectionDate`,
    `reCollectionTime`,
    `sampleTakerName`,
    `testType`,
    `remarks`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    1,
    'Vaibhav A Pande',
    1,
    'Null',
    9796877568,
    'Blood Sample',
    '2023-08-29',
    '19:19',
    'yes',
    '2023-08-31',
    '15:11',
    'Vijay Kumar',
    'fast',
    'NAA',
    '2023-08-29 09:52:19',
    '2023-08-30 07:49:43'
  );
INSERT INTO
  `samplehomecollections` (
    `id`,
    `PatientName`,
    `PatientID`,
    `Address`,
    `PatientPhoneNo`,
    `sampleName`,
    `sampleDate`,
    `sampleTime`,
    `reCollection`,
    `reCollectionDate`,
    `reCollectionTime`,
    `sampleTakerName`,
    `testType`,
    `remarks`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    2,
    'Vaibhav A Pande',
    1,
    'Null',
    9796877568,
    'Blood sample',
    '2023-08-31',
    '10:10',
    'yes',
    '2023-08-31',
    '15:11',
    'Vijay Kumar',
    'fast',
    'NA',
    '2023-08-30 07:38:53',
    '2023-08-30 07:49:55'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: selectedtestforhealthpackagemodels
# ------------------------------------------------------------

INSERT INTO
  `selectedtestforhealthpackagemodels` (
    `id`,
    `TestName`,
    `testType`,
    `category`,
    `TestId`,
    `TestPackageID`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    21,
    'Creatinine',
    'Pathology',
    'Kidney',
    6,
    1,
    '2024-01-15 15:13:37',
    '2024-01-15 15:13:37'
  );
INSERT INTO
  `selectedtestforhealthpackagemodels` (
    `id`,
    `TestName`,
    `testType`,
    `category`,
    `TestId`,
    `TestPackageID`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    22,
    'Tests',
    'Pathology',
    'Bone',
    2,
    2,
    '2024-01-15 15:16:13',
    '2024-01-15 15:16:13'
  );
INSERT INTO
  `selectedtestforhealthpackagemodels` (
    `id`,
    `TestName`,
    `testType`,
    `category`,
    `TestId`,
    `TestPackageID`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    23,
    'Calcium',
    'Pathology',
    'Bone',
    3,
    2,
    '2024-01-15 15:16:13',
    '2024-01-15 15:16:13'
  );
INSERT INTO
  `selectedtestforhealthpackagemodels` (
    `id`,
    `TestName`,
    `testType`,
    `category`,
    `TestId`,
    `TestPackageID`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    24,
    'Phosphorous',
    'Pathology',
    'Bone',
    4,
    2,
    '2024-01-15 15:16:13',
    '2024-01-15 15:16:13'
  );
INSERT INTO
  `selectedtestforhealthpackagemodels` (
    `id`,
    `TestName`,
    `testType`,
    `category`,
    `TestId`,
    `TestPackageID`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    25,
    'Vitamin D',
    'Pathology',
    'Vitamin',
    5,
    2,
    '2024-01-15 15:16:13',
    '2024-01-15 15:16:13'
  );
INSERT INTO
  `selectedtestforhealthpackagemodels` (
    `id`,
    `TestName`,
    `testType`,
    `category`,
    `TestId`,
    `TestPackageID`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    26,
    'Creatinine',
    'Pathology',
    'Kidney',
    6,
    2,
    '2024-01-15 15:16:13',
    '2024-01-15 15:16:13'
  );
INSERT INTO
  `selectedtestforhealthpackagemodels` (
    `id`,
    `TestName`,
    `testType`,
    `category`,
    `TestId`,
    `TestPackageID`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    27,
    'Uric Acid',
    'Pathology',
    'Kidney',
    7,
    2,
    '2024-01-15 15:16:13',
    '2024-01-15 15:16:13'
  );
INSERT INTO
  `selectedtestforhealthpackagemodels` (
    `id`,
    `TestName`,
    `testType`,
    `category`,
    `TestId`,
    `TestPackageID`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    28,
    'Urea',
    'Pathology',
    'Vitals',
    8,
    2,
    '2024-01-15 15:16:13',
    '2024-01-15 15:16:13'
  );
INSERT INTO
  `selectedtestforhealthpackagemodels` (
    `id`,
    `TestName`,
    `testType`,
    `category`,
    `TestId`,
    `TestPackageID`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    29,
    'Brain MRI Scan',
    'Pathology',
    'Scan',
    9,
    2,
    '2024-01-15 15:16:13',
    '2024-01-15 15:16:13'
  );
INSERT INTO
  `selectedtestforhealthpackagemodels` (
    `id`,
    `TestName`,
    `testType`,
    `category`,
    `TestId`,
    `TestPackageID`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    30,
    'Brain CT Scan',
    'Pathology',
    'Scan',
    10,
    2,
    '2024-01-15 15:16:13',
    '2024-01-15 15:16:13'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: selectedtestforpackagemodels
# ------------------------------------------------------------

INSERT INTO
  `selectedtestforpackagemodels` (
    `id`,
    `TestName`,
    `TestId`,
    `TestPackageID`,
    `createdAt`,
    `updatedAt`,
    `testType`,
    `category`
  )
VALUES
  (
    413,
    'Lipid Profile',
    1,
    4,
    '2024-01-15 15:58:59',
    '2024-01-15 15:58:59',
    'Pathology',
    'Heart'
  );
INSERT INTO
  `selectedtestforpackagemodels` (
    `id`,
    `TestName`,
    `TestId`,
    `TestPackageID`,
    `createdAt`,
    `updatedAt`,
    `testType`,
    `category`
  )
VALUES
  (
    414,
    'Platelet Count',
    10,
    4,
    '2024-01-15 15:58:59',
    '2024-01-15 15:58:59',
    'Pathology',
    'Platelet Count'
  );
INSERT INTO
  `selectedtestforpackagemodels` (
    `id`,
    `TestName`,
    `TestId`,
    `TestPackageID`,
    `createdAt`,
    `updatedAt`,
    `testType`,
    `category`
  )
VALUES
  (
    415,
    'T3 T4 TSH',
    2,
    12,
    '2024-02-03 17:00:43',
    '2024-02-03 17:00:43',
    'Pathology',
    'Thyroid'
  );
INSERT INTO
  `selectedtestforpackagemodels` (
    `id`,
    `TestName`,
    `TestId`,
    `TestPackageID`,
    `createdAt`,
    `updatedAt`,
    `testType`,
    `category`
  )
VALUES
  (
    416,
    'Blood Sugar For Fasting',
    11,
    12,
    '2024-02-03 17:00:43',
    '2024-02-03 17:00:43',
    'Pathology',
    'Blood Sugar'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: specimenlists
# ------------------------------------------------------------

INSERT INTO
  `specimenlists` (
    `id`,
    `SpecimenName`,
    `SpecimenCode`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    1,
    'Blood',
    'BP01',
    '2023-11-07 10:11:40',
    '2023-11-07 10:13:23'
  );
INSERT INTO
  `specimenlists` (
    `id`,
    `SpecimenName`,
    `SpecimenCode`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    3,
    'Biopsy',
    'BY01',
    '2023-11-09 07:36:05',
    '2023-11-10 07:28:39'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: statusofdiagnostictestsfortestbookings
# ------------------------------------------------------------

INSERT INTO
  `statusofdiagnostictestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `DiagnosticTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    1,
    'Calcium',
    'Test Completed',
    35,
    19,
    3,
    '2023-10-24 16:19:03',
    '2023-10-24 16:52:44',
    '2023-10-24 16:19:03',
    '2023-10-24 16:52:44',
    0
  );
INSERT INTO
  `statusofdiagnostictestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `DiagnosticTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    2,
    'Vitamin D',
    'Registered',
    35,
    19,
    5,
    '2023-10-24 16:19:03',
    NULL,
    '2023-10-24 16:19:03',
    '2023-10-24 16:19:03',
    0
  );
INSERT INTO
  `statusofdiagnostictestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `DiagnosticTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    3,
    'Calcium',
    'Registered',
    36,
    20,
    3,
    '2023-10-30 09:04:16',
    NULL,
    '2023-10-30 09:04:16',
    '2023-10-30 09:04:16',
    0
  );
INSERT INTO
  `statusofdiagnostictestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `DiagnosticTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    4,
    'Vitamin D',
    'Registered',
    36,
    21,
    5,
    '2023-11-06 12:45:22',
    NULL,
    '2023-11-06 12:45:22',
    '2023-11-06 12:45:22',
    0
  );
INSERT INTO
  `statusofdiagnostictestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `DiagnosticTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    5,
    'Creatinine',
    'Registered',
    36,
    21,
    6,
    '2023-11-06 12:45:22',
    NULL,
    '2023-11-06 12:45:22',
    '2023-11-06 12:45:22',
    0
  );
INSERT INTO
  `statusofdiagnostictestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `DiagnosticTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    6,
    'Brain MRI Scan',
    'Registered',
    36,
    21,
    9,
    '2023-11-06 12:45:22',
    NULL,
    '2023-11-06 12:45:22',
    '2023-11-06 12:45:22',
    0
  );
INSERT INTO
  `statusofdiagnostictestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `DiagnosticTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    7,
    'Brain CT Scan',
    'Registered',
    36,
    21,
    10,
    '2023-11-06 12:45:22',
    NULL,
    '2023-11-06 12:45:22',
    '2023-11-06 12:45:22',
    0
  );
INSERT INTO
  `statusofdiagnostictestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `DiagnosticTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    8,
    'Chest CT Scan',
    'Registered',
    36,
    21,
    15,
    '2023-11-06 12:45:22',
    NULL,
    '2023-11-06 12:45:22',
    '2023-11-06 12:45:22',
    0
  );
INSERT INTO
  `statusofdiagnostictestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `DiagnosticTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    9,
    'Ultrasound Abdomen',
    'Registered',
    36,
    21,
    16,
    '2023-11-06 12:45:22',
    NULL,
    '2023-11-06 12:45:22',
    '2023-11-06 12:45:22',
    0
  );
INSERT INTO
  `statusofdiagnostictestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `DiagnosticTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    10,
    'Vitamin D',
    'Registered',
    35,
    22,
    5,
    '2023-11-06 12:46:10',
    NULL,
    '2023-11-06 12:46:10',
    '2023-11-06 12:46:10',
    0
  );
INSERT INTO
  `statusofdiagnostictestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `DiagnosticTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    11,
    'Creatinine',
    'Registered',
    35,
    22,
    6,
    '2023-11-06 12:46:10',
    NULL,
    '2023-11-06 12:46:10',
    '2023-11-06 12:46:10',
    0
  );
INSERT INTO
  `statusofdiagnostictestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `DiagnosticTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    12,
    'Brain MRI Scan',
    'Registered',
    35,
    22,
    9,
    '2023-11-06 12:46:10',
    NULL,
    '2023-11-06 12:46:10',
    '2023-11-06 12:46:10',
    0
  );
INSERT INTO
  `statusofdiagnostictestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `DiagnosticTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    13,
    'Brain CT Scan',
    'Registered',
    35,
    22,
    10,
    '2023-11-06 12:46:10',
    NULL,
    '2023-11-06 12:46:10',
    '2023-11-06 12:46:10',
    0
  );
INSERT INTO
  `statusofdiagnostictestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `DiagnosticTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    14,
    'Chest CT Scan',
    'Registered',
    35,
    22,
    15,
    '2023-11-06 12:46:10',
    NULL,
    '2023-11-06 12:46:10',
    '2023-11-06 12:46:10',
    0
  );
INSERT INTO
  `statusofdiagnostictestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `DiagnosticTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    15,
    'Ultrasound Abdomen',
    'Registered',
    35,
    22,
    16,
    '2023-11-06 12:46:10',
    NULL,
    '2023-11-06 12:46:10',
    '2023-11-06 12:46:10',
    0
  );
INSERT INTO
  `statusofdiagnostictestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `DiagnosticTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    16,
    'Phosphorous',
    'Registered',
    36,
    23,
    4,
    '2023-11-06 13:07:20',
    NULL,
    '2023-11-06 13:07:20',
    '2023-11-06 13:07:20',
    0
  );
INSERT INTO
  `statusofdiagnostictestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `DiagnosticTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    17,
    'Calcium',
    'Registered',
    36,
    24,
    3,
    '2023-11-07 06:18:23',
    NULL,
    '2023-11-07 06:18:23',
    '2023-11-07 06:18:23',
    0
  );
INSERT INTO
  `statusofdiagnostictestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `DiagnosticTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    18,
    'Creatinine',
    'Registered',
    36,
    24,
    6,
    '2023-11-07 06:18:23',
    NULL,
    '2023-11-07 06:18:23',
    '2023-11-07 06:18:23',
    0
  );
INSERT INTO
  `statusofdiagnostictestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `DiagnosticTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    19,
    'Brain MRI Scan',
    'Registered',
    36,
    24,
    9,
    '2023-11-07 06:18:23',
    NULL,
    '2023-11-07 06:18:23',
    '2023-11-07 06:18:23',
    0
  );
INSERT INTO
  `statusofdiagnostictestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `DiagnosticTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    20,
    'Brain CT Scan',
    'Registered',
    36,
    24,
    10,
    '2023-11-07 06:18:23',
    NULL,
    '2023-11-07 06:18:23',
    '2023-11-07 06:18:23',
    0
  );
INSERT INTO
  `statusofdiagnostictestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `DiagnosticTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    21,
    'Chest CT Scan',
    'Registered',
    36,
    24,
    15,
    '2023-11-07 06:18:23',
    NULL,
    '2023-11-07 06:18:23',
    '2023-11-07 06:18:23',
    0
  );
INSERT INTO
  `statusofdiagnostictestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `DiagnosticTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    22,
    'Ultrasound Abdomen',
    'Registered',
    36,
    24,
    16,
    '2023-11-07 06:18:23',
    NULL,
    '2023-11-07 06:18:23',
    '2023-11-07 06:18:23',
    0
  );
INSERT INTO
  `statusofdiagnostictestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `DiagnosticTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    23,
    'Phosphorous',
    'Registered',
    40,
    25,
    4,
    '2024-01-10 16:59:33',
    NULL,
    '2024-01-10 16:59:33',
    '2024-01-10 16:59:33',
    0
  );
INSERT INTO
  `statusofdiagnostictestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `DiagnosticTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    24,
    'Urea',
    'Registered',
    40,
    25,
    8,
    '2024-01-10 16:59:33',
    NULL,
    '2024-01-10 16:59:33',
    '2024-01-10 16:59:33',
    0
  );
INSERT INTO
  `statusofdiagnostictestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `DiagnosticTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    25,
    'Phosphorous',
    'Test Completed',
    39,
    26,
    4,
    '2024-01-13 10:18:39',
    '2024-01-14 12:03:21',
    '2024-01-13 10:18:39',
    '2024-01-14 12:03:21',
    0
  );
INSERT INTO
  `statusofdiagnostictestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `DiagnosticTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    26,
    'Vitamin D',
    'Registered',
    40,
    27,
    5,
    '2024-01-13 10:19:23',
    NULL,
    '2024-01-13 10:19:23',
    '2024-01-13 10:19:23',
    0
  );
INSERT INTO
  `statusofdiagnostictestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `DiagnosticTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    27,
    'Creatinine',
    'Registered',
    36,
    28,
    6,
    '2024-01-13 10:21:09',
    NULL,
    '2024-01-13 10:21:09',
    '2024-01-13 10:21:09',
    0
  );
INSERT INTO
  `statusofdiagnostictestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `DiagnosticTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    28,
    'Phosphorous',
    'Registered',
    39,
    29,
    4,
    '2024-01-13 10:22:58',
    NULL,
    '2024-01-13 10:22:58',
    '2024-01-13 10:22:58',
    0
  );
INSERT INTO
  `statusofdiagnostictestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `DiagnosticTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    29,
    'Vitamin D',
    'Registered',
    38,
    30,
    5,
    '2024-01-13 10:24:05',
    NULL,
    '2024-01-13 10:24:05',
    '2024-01-13 10:24:05',
    0
  );
INSERT INTO
  `statusofdiagnostictestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `DiagnosticTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    30,
    'Vitamin D',
    'Test Completed',
    36,
    31,
    5,
    '2024-01-14 18:33:54',
    '2024-01-28 13:18:05',
    '2024-01-14 18:33:54',
    '2024-01-28 13:18:05',
    0
  );
INSERT INTO
  `statusofdiagnostictestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `DiagnosticTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    31,
    'Phosphorous',
    'Registered',
    36,
    32,
    4,
    '2024-01-15 03:25:17',
    NULL,
    '2024-01-15 03:25:17',
    '2024-01-15 03:25:17',
    0
  );
INSERT INTO
  `statusofdiagnostictestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `DiagnosticTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    32,
    'Vitamin D',
    'Registered',
    41,
    33,
    5,
    '2024-01-28 04:36:17',
    NULL,
    '2024-01-28 04:36:17',
    '2024-01-28 04:36:17',
    3
  );
INSERT INTO
  `statusofdiagnostictestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `DiagnosticTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    33,
    'Phosphorous',
    'Registered',
    39,
    34,
    4,
    '2024-02-03 17:27:20',
    NULL,
    '2024-02-03 17:27:20',
    '2024-02-03 17:27:20',
    0
  );
INSERT INTO
  `statusofdiagnostictestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `DiagnosticTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    34,
    'Creatinine',
    'Registered',
    39,
    34,
    6,
    '2024-02-03 17:27:21',
    NULL,
    '2024-02-03 17:27:21',
    '2024-02-03 17:27:21',
    0
  );
INSERT INTO
  `statusofdiagnostictestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `DiagnosticTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    35,
    'Brain MRI Scan',
    'Registered',
    39,
    34,
    9,
    '2024-02-03 17:27:22',
    NULL,
    '2024-02-03 17:27:22',
    '2024-02-03 17:27:22',
    0
  );
INSERT INTO
  `statusofdiagnostictestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `DiagnosticTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    36,
    'Phosphorous',
    'Registered',
    39,
    35,
    4,
    '2024-02-03 17:30:31',
    NULL,
    '2024-02-03 17:30:31',
    '2024-02-03 17:30:31',
    0
  );
INSERT INTO
  `statusofdiagnostictestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `DiagnosticTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    37,
    'Creatinine',
    'Registered',
    39,
    35,
    6,
    '2024-02-03 17:30:32',
    NULL,
    '2024-02-03 17:30:32',
    '2024-02-03 17:30:32',
    0
  );
INSERT INTO
  `statusofdiagnostictestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `DiagnosticTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    38,
    'Brain MRI Scan',
    'Registered',
    39,
    35,
    9,
    '2024-02-03 17:30:32',
    NULL,
    '2024-02-03 17:30:32',
    '2024-02-03 17:30:32',
    0
  );
INSERT INTO
  `statusofdiagnostictestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `DiagnosticTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    39,
    'Creatinine',
    'Registered',
    39,
    36,
    6,
    '2024-02-03 17:30:42',
    NULL,
    '2024-02-03 17:30:42',
    '2024-02-03 17:30:42',
    0
  );
INSERT INTO
  `statusofdiagnostictestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `DiagnosticTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    40,
    'Brain MRI Scan',
    'Registered',
    39,
    36,
    9,
    '2024-02-03 17:30:42',
    NULL,
    '2024-02-03 17:30:42',
    '2024-02-03 17:30:42',
    0
  );
INSERT INTO
  `statusofdiagnostictestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `DiagnosticTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    41,
    'Creatinine',
    'Registered',
    39,
    37,
    6,
    '2024-02-03 17:31:14',
    NULL,
    '2024-02-03 17:31:14',
    '2024-02-03 17:31:14',
    0
  );
INSERT INTO
  `statusofdiagnostictestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `DiagnosticTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    42,
    'Brain MRI Scan',
    'Registered',
    39,
    37,
    9,
    '2024-02-03 17:31:14',
    NULL,
    '2024-02-03 17:31:14',
    '2024-02-03 17:31:14',
    0
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: statusofpathologytestsfortestbookings
# ------------------------------------------------------------

INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    1,
    'Lipid Profile',
    'Registered',
    32,
    67,
    1,
    '2023-10-20 09:58:09',
    NULL,
    NULL,
    '2023-10-20 09:58:09',
    '2023-10-20 09:58:09',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    2,
    'T3 T4 TSH',
    'Registered',
    32,
    67,
    2,
    '2023-10-20 09:58:09',
    NULL,
    NULL,
    '2023-10-20 09:58:09',
    '2023-10-20 09:58:09',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    3,
    'Blood Sugar For Fasting',
    'Registered',
    32,
    67,
    11,
    '2023-10-20 09:58:09',
    NULL,
    NULL,
    '2023-10-20 09:58:09',
    '2023-10-20 09:58:09',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    4,
    'Lipid Profile',
    'Sample Collected',
    32,
    68,
    1,
    '2023-10-20 04:30:55',
    '2023-10-20 11:07:07',
    NULL,
    '2023-10-20 10:00:56',
    '2023-10-20 11:07:07',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    5,
    'Platelet Count',
    'Sample Collected',
    32,
    68,
    10,
    '2023-10-20 04:30:56',
    '2023-10-20 11:14:51',
    NULL,
    '2023-10-20 10:00:56',
    '2023-10-20 11:14:51',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    6,
    'Lipid Profile',
    'Registered',
    32,
    72,
    1,
    '2023-10-20 10:03:20',
    NULL,
    NULL,
    '2023-10-20 10:03:20',
    '2023-10-20 10:03:20',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    7,
    'T3 T4 TSH',
    'Registered',
    32,
    72,
    2,
    '2023-10-20 10:03:20',
    NULL,
    NULL,
    '2023-10-20 10:03:20',
    '2023-10-20 10:03:20',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    8,
    'Blood Sugar For Fasting',
    'Registered',
    32,
    72,
    11,
    '2023-10-20 10:03:20',
    NULL,
    NULL,
    '2023-10-20 10:03:20',
    '2023-10-20 10:03:20',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    9,
    'Platelet Count',
    'Sample Collected',
    6,
    73,
    10,
    '2023-10-20 11:24:02',
    '2023-10-20 11:27:05',
    NULL,
    '2023-10-20 11:24:02',
    '2023-10-20 11:27:05',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    10,
    'Lipid Profile',
    'Sample Collected',
    6,
    73,
    1,
    '2023-10-20 11:24:02',
    '2023-10-20 11:25:19',
    NULL,
    '2023-10-20 11:24:02',
    '2023-10-20 11:25:19',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    11,
    'Lipid Profile',
    'Sample Collected',
    32,
    74,
    1,
    '2023-10-20 12:06:09',
    '2023-10-20 12:14:36',
    NULL,
    '2023-10-20 12:06:09',
    '2023-10-20 12:14:36',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    12,
    'Blood Sugar For Fasting',
    'Sample Collected',
    32,
    74,
    11,
    '2023-10-20 12:06:09',
    '2023-10-20 12:17:11',
    NULL,
    '2023-10-20 12:06:09',
    '2023-10-20 12:17:11',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    13,
    'Lipid Profile',
    'Registered',
    32,
    75,
    1,
    '2023-10-20 12:26:09',
    NULL,
    NULL,
    '2023-10-20 12:26:09',
    '2023-10-20 12:26:09',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    14,
    'Platelet Count',
    'Test Completed',
    32,
    75,
    10,
    '2023-10-20 12:26:09',
    '2023-10-20 12:58:12',
    '2023-10-20 13:15:41',
    '2023-10-20 12:26:09',
    '2023-10-20 13:15:41',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    15,
    'T3 T4 TSH',
    'Registered',
    35,
    76,
    2,
    '2023-10-23 08:53:05',
    NULL,
    NULL,
    '2023-10-23 08:53:05',
    '2023-10-23 08:53:05',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    16,
    'Lipid Profile',
    'Registered',
    35,
    76,
    1,
    '2023-10-23 08:53:05',
    NULL,
    NULL,
    '2023-10-23 08:53:05',
    '2023-10-23 08:53:05',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    17,
    'Blood Sugar For Fasting',
    'Registered',
    35,
    76,
    11,
    '2023-10-23 08:53:05',
    NULL,
    NULL,
    '2023-10-23 08:53:05',
    '2023-10-23 08:53:05',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    18,
    'T3 T4 TSH',
    'Pending',
    36,
    77,
    2,
    '2023-10-23 08:53:31',
    NULL,
    NULL,
    '2023-10-23 08:53:31',
    '2023-10-23 08:53:31',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    19,
    'Lipid Profile',
    'Pending',
    36,
    77,
    1,
    '2023-10-23 08:53:31',
    NULL,
    NULL,
    '2023-10-23 08:53:31',
    '2023-10-23 08:53:31',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    20,
    'Platelet Count',
    'Pending',
    36,
    77,
    10,
    '2023-10-23 08:53:31',
    NULL,
    NULL,
    '2023-10-23 08:53:31',
    '2023-10-23 08:53:31',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    21,
    'T3 T4 TSH',
    'Pending',
    34,
    78,
    2,
    '2023-10-23 09:01:51',
    NULL,
    NULL,
    '2023-10-23 09:01:51',
    '2023-10-23 09:01:51',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    22,
    'Blood Sugar For Fasting',
    'Pending',
    34,
    78,
    11,
    '2023-10-23 09:01:51',
    NULL,
    NULL,
    '2023-10-23 09:01:51',
    '2023-10-23 09:01:51',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    23,
    'Lipid Profile',
    'Pending',
    34,
    79,
    1,
    '2023-10-23 09:10:19',
    NULL,
    NULL,
    '2023-10-23 09:10:19',
    '2023-10-23 09:10:19',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    24,
    'T3 T4 TSH',
    'Pending',
    34,
    79,
    2,
    '2023-10-23 09:10:19',
    NULL,
    NULL,
    '2023-10-23 09:10:19',
    '2023-10-23 09:10:19',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    25,
    'Blood Sugar For Fasting',
    'Pending',
    34,
    79,
    11,
    '2023-10-23 09:10:19',
    NULL,
    NULL,
    '2023-10-23 09:10:19',
    '2023-10-23 09:10:19',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    26,
    'Lipid Profile',
    'Sample Collected',
    34,
    80,
    1,
    '2023-10-23 09:41:54',
    '2023-10-24 05:48:41',
    NULL,
    '2023-10-23 09:41:54',
    '2023-10-24 05:48:41',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    27,
    'Lipid Profile',
    'Registered',
    37,
    81,
    1,
    '2023-10-23 10:00:46',
    NULL,
    NULL,
    '2023-10-23 10:00:46',
    '2023-10-23 10:00:46',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    28,
    'Platelet Count',
    'Registered',
    37,
    81,
    10,
    '2023-10-23 10:00:46',
    NULL,
    NULL,
    '2023-10-23 10:00:46',
    '2023-10-23 10:00:46',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    29,
    'Lipid Profile',
    'Registered',
    32,
    82,
    1,
    '2023-10-23 11:34:48',
    NULL,
    NULL,
    '2023-10-23 11:34:48',
    '2023-10-23 11:34:48',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    30,
    'Platelet Count',
    'Registered',
    32,
    82,
    10,
    '2023-10-23 11:34:48',
    NULL,
    NULL,
    '2023-10-23 11:34:48',
    '2023-10-23 11:34:48',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    31,
    'Platelet Count',
    'Test Completed',
    36,
    83,
    10,
    '2023-10-24 05:47:36',
    '2023-10-24 05:49:23',
    '2023-10-24 10:27:19',
    '2023-10-24 05:47:36',
    '2023-10-24 10:27:19',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    32,
    'Platelet Count',
    'Sample Collected',
    36,
    84,
    10,
    '2023-10-24 05:53:30',
    '2023-10-25 08:19:12',
    '2023-10-24 10:26:56',
    '2023-10-24 05:53:30',
    '2023-10-25 08:19:12',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    33,
    'T3 T4 TSH',
    'Registered',
    35,
    85,
    2,
    '2023-10-24 15:05:43',
    NULL,
    NULL,
    '2023-10-24 15:05:43',
    '2023-10-24 15:05:43',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    34,
    'Blood Sugar For Fasting',
    'Registered',
    35,
    85,
    11,
    '2023-10-24 15:05:43',
    NULL,
    NULL,
    '2023-10-24 15:05:43',
    '2023-10-24 15:05:43',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    35,
    'Lipid Profile',
    'Registered',
    35,
    92,
    1,
    '2023-10-24 17:08:19',
    NULL,
    NULL,
    '2023-10-24 17:08:19',
    '2023-10-24 17:08:19',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    36,
    'Platelet Count',
    'Registered',
    35,
    92,
    10,
    '2023-10-24 17:08:19',
    NULL,
    NULL,
    '2023-10-24 17:08:19',
    '2023-10-24 17:08:19',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    37,
    'Platelet Count',
    'Registered',
    35,
    93,
    10,
    '2023-10-25 04:45:57',
    NULL,
    NULL,
    '2023-10-25 04:45:57',
    '2023-10-25 04:45:57',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    38,
    'Platelet Count',
    'Sample Collected',
    35,
    94,
    10,
    '2023-10-25 04:46:25',
    '2023-10-25 04:47:49',
    NULL,
    '2023-10-25 04:46:25',
    '2023-10-25 04:47:49',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    39,
    'Platelet Count',
    'Test Completed',
    36,
    95,
    10,
    '2023-10-25 04:46:47',
    '2023-10-25 06:28:30',
    '2023-10-25 06:29:59',
    '2023-10-25 04:46:47',
    '2023-10-25 06:29:59',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    40,
    'Platelet Count',
    'Test Completed',
    36,
    96,
    10,
    '2023-10-25 06:27:38',
    '2023-10-25 06:28:58',
    '2023-10-25 11:56:33',
    '2023-10-25 06:27:38',
    '2023-10-25 11:56:33',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    41,
    'Lipid Profile',
    'Test Completed',
    37,
    97,
    1,
    '2023-10-25 11:57:07',
    '2023-10-25 11:59:02',
    '2023-10-25 12:00:15',
    '2023-10-25 11:57:07',
    '2023-10-25 12:00:15',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    42,
    'Platelet Count',
    'Test Completed',
    37,
    97,
    10,
    '2023-10-25 11:57:07',
    '2023-10-25 11:59:30',
    '2023-10-25 12:01:33',
    '2023-10-25 11:57:07',
    '2023-10-25 12:01:33',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    43,
    'Lipid Profile',
    'Test Completed',
    37,
    98,
    1,
    '2023-10-25 12:02:11',
    '2023-10-25 12:03:45',
    '2023-10-25 12:05:28',
    '2023-10-25 12:02:11',
    '2023-10-25 12:05:28',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    44,
    'Platelet Count',
    'Test Completed',
    37,
    98,
    10,
    '2023-10-25 12:02:11',
    '2023-10-25 12:04:10',
    '2023-10-25 12:05:44',
    '2023-10-25 12:02:11',
    '2023-10-25 12:05:44',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    45,
    'Lipid Profile',
    'Sample Collected',
    35,
    99,
    1,
    '2023-10-25 12:17:20',
    '2023-10-25 12:35:06',
    NULL,
    '2023-10-25 12:17:20',
    '2023-10-25 12:35:06',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    46,
    'T3 T4 TSH',
    'Sample Collected',
    35,
    99,
    2,
    '2023-10-25 12:17:20',
    '2023-10-25 12:35:06',
    NULL,
    '2023-10-25 12:17:20',
    '2023-10-25 12:35:06',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    47,
    'Lipid Profile',
    'Sample Collected',
    35,
    100,
    1,
    '2023-10-25 12:52:11',
    '2023-10-25 12:53:17',
    NULL,
    '2023-10-25 12:52:11',
    '2023-10-25 12:53:17',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    48,
    'T3 T4 TSH',
    'Sample Collected',
    35,
    100,
    2,
    '2023-10-25 12:52:11',
    '2023-10-25 12:53:17',
    NULL,
    '2023-10-25 12:52:11',
    '2023-10-25 12:53:17',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    49,
    'Blood Sugar For Fasting',
    'Sample Collected',
    35,
    100,
    11,
    '2023-10-25 12:52:11',
    '2023-10-25 12:54:02',
    NULL,
    '2023-10-25 12:52:11',
    '2023-10-25 12:54:02',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    50,
    'Platelet Count',
    'Sample Collected',
    35,
    101,
    10,
    '2023-10-25 12:55:35',
    '2023-10-25 12:58:16',
    NULL,
    '2023-10-25 12:55:35',
    '2023-10-25 12:58:16',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    51,
    'Lipid Profile',
    'Sample Collected',
    35,
    101,
    1,
    '2023-10-25 12:55:35',
    '2023-10-25 12:57:07',
    NULL,
    '2023-10-25 12:55:35',
    '2023-10-25 12:57:07',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    52,
    'Lipid Profile',
    'Test Completed',
    37,
    102,
    1,
    '2023-10-25 13:03:08',
    '2023-10-25 13:05:17',
    '2023-10-25 13:06:20',
    '2023-10-25 13:03:08',
    '2023-10-25 13:06:20',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    53,
    'T3 T4 TSH',
    'Test Completed',
    37,
    102,
    2,
    '2023-10-25 13:03:08',
    '2023-10-25 13:05:51',
    '2023-10-25 13:06:43',
    '2023-10-25 13:03:08',
    '2023-10-25 13:06:43',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    54,
    'Blood Sugar For Fasting',
    'Test Completed',
    37,
    102,
    11,
    '2023-10-25 13:03:08',
    '2023-10-25 13:03:48',
    '2023-10-25 13:07:28',
    '2023-10-25 13:03:08',
    '2023-10-25 13:07:28',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    55,
    'Lipid Profile',
    'Registered',
    16,
    103,
    1,
    '2023-10-29 14:52:01',
    NULL,
    NULL,
    '2023-10-29 14:52:01',
    '2023-10-29 14:52:01',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    56,
    'T3 T4 TSH',
    'Registered',
    16,
    103,
    2,
    '2023-10-29 14:52:01',
    NULL,
    NULL,
    '2023-10-29 14:52:01',
    '2023-10-29 14:52:01',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    57,
    'Lipid Profile',
    'Registered',
    36,
    104,
    1,
    '2023-10-30 02:58:26',
    NULL,
    NULL,
    '2023-10-30 02:58:26',
    '2023-10-30 02:58:26',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    58,
    'Platelet Count',
    'Registered',
    36,
    104,
    10,
    '2023-10-30 02:58:26',
    NULL,
    NULL,
    '2023-10-30 02:58:26',
    '2023-10-30 02:58:26',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    59,
    'Lipid Profile',
    'Registered',
    35,
    105,
    1,
    '2023-10-30 03:00:56',
    NULL,
    NULL,
    '2023-10-30 03:00:56',
    '2023-10-30 03:00:56',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    60,
    'Platelet Count',
    'Registered',
    35,
    105,
    10,
    '2023-10-30 03:00:56',
    NULL,
    NULL,
    '2023-10-30 03:00:56',
    '2023-10-30 03:00:56',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    61,
    'Blood Sugar For PP',
    'Registered',
    35,
    106,
    12,
    '2023-10-30 10:41:49',
    NULL,
    NULL,
    '2023-10-30 10:41:49',
    '2023-10-30 10:41:49',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    62,
    'Lipid Profile',
    'Registered',
    34,
    107,
    1,
    '2023-10-30 15:09:39',
    NULL,
    NULL,
    '2023-10-30 15:09:39',
    '2023-10-30 15:09:39',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    63,
    'Lipid Profile',
    'Registered',
    34,
    108,
    1,
    '2023-10-30 15:23:39',
    NULL,
    NULL,
    '2023-10-30 15:23:39',
    '2023-10-30 15:23:39',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    64,
    'T3 T4 TSH',
    'Registered',
    34,
    109,
    2,
    '2023-10-31 02:09:13',
    NULL,
    NULL,
    '2023-10-31 02:09:13',
    '2023-10-31 02:09:13',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    65,
    'Lipid Profile',
    'Registered',
    35,
    110,
    1,
    '2023-11-06 09:12:51',
    NULL,
    NULL,
    '2023-11-06 09:12:51',
    '2023-11-06 09:12:51',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    66,
    'Platelet Count',
    'Registered',
    35,
    110,
    10,
    '2023-11-06 09:12:51',
    NULL,
    NULL,
    '2023-11-06 09:12:51',
    '2023-11-06 09:12:51',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    67,
    'Lipid Profile',
    'Registered',
    35,
    111,
    1,
    '2023-11-06 09:16:52',
    NULL,
    NULL,
    '2023-11-06 09:16:52',
    '2023-11-06 09:16:52',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    68,
    'Lipid Profile',
    'Registered',
    35,
    112,
    1,
    '2023-11-06 10:18:08',
    NULL,
    NULL,
    '2023-11-06 10:18:08',
    '2023-11-06 10:18:08',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    69,
    'Platelet Count',
    'Registered',
    35,
    112,
    10,
    '2023-11-06 10:18:08',
    NULL,
    NULL,
    '2023-11-06 10:18:08',
    '2023-11-06 10:18:08',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    70,
    'Lipid Profile',
    'Registered',
    35,
    113,
    1,
    '2023-11-06 10:21:25',
    NULL,
    NULL,
    '2023-11-06 10:21:25',
    '2023-11-06 10:21:25',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    71,
    'Platelet Count',
    'Registered',
    35,
    113,
    10,
    '2023-11-06 10:21:25',
    NULL,
    NULL,
    '2023-11-06 10:21:25',
    '2023-11-06 10:21:25',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    72,
    'T3 T4 TSH',
    'Registered',
    35,
    113,
    2,
    '2023-11-06 10:21:25',
    NULL,
    NULL,
    '2023-11-06 10:21:25',
    '2023-11-06 10:21:25',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    73,
    'Lipid Profile',
    'Sample Collected',
    37,
    114,
    1,
    '2023-11-07 05:37:55',
    '2024-01-10 14:13:19',
    NULL,
    '2023-11-07 05:37:55',
    '2024-01-10 14:13:19',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    74,
    'Platelet Count',
    'Sample Collected',
    37,
    114,
    10,
    '2023-11-07 05:37:55',
    '2024-01-10 14:13:20',
    NULL,
    '2023-11-07 05:37:55',
    '2024-01-10 14:13:20',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    75,
    'T3 T4 TSH',
    'Registered',
    35,
    115,
    2,
    '2023-11-07 06:15:21',
    NULL,
    NULL,
    '2023-11-07 06:15:21',
    '2023-11-07 06:15:21',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    76,
    'Lipid Profile',
    'Registered',
    35,
    115,
    1,
    '2023-11-07 06:15:21',
    NULL,
    NULL,
    '2023-11-07 06:15:21',
    '2023-11-07 06:15:21',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    77,
    'Platelet Count',
    'Registered',
    35,
    115,
    10,
    '2023-11-07 06:15:21',
    NULL,
    NULL,
    '2023-11-07 06:15:21',
    '2023-11-07 06:15:21',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    78,
    'Lipid Profile',
    'Registered',
    35,
    116,
    1,
    '2023-11-08 11:10:09',
    NULL,
    NULL,
    '2023-11-08 11:10:09',
    '2023-11-08 11:10:09',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    79,
    'Platelet Count',
    'Registered',
    35,
    116,
    10,
    '2023-11-08 11:10:09',
    NULL,
    NULL,
    '2023-11-08 11:10:09',
    '2023-11-08 11:10:09',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    80,
    'Platelet Count',
    'Registered',
    40,
    117,
    10,
    '2024-01-10 12:58:44',
    NULL,
    NULL,
    '2024-01-10 12:58:44',
    '2024-01-10 12:58:44',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    81,
    'Blood Sugar For Fasting',
    'Registered',
    40,
    117,
    11,
    '2024-01-10 12:58:44',
    NULL,
    NULL,
    '2024-01-10 12:58:44',
    '2024-01-10 12:58:44',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    82,
    'Platelet Count',
    'Test Completed',
    36,
    118,
    10,
    '2024-01-13 12:05:04',
    '2024-01-14 14:27:25',
    '2024-01-27 07:55:19',
    '2024-01-13 12:05:04',
    '2024-01-27 07:55:19',
    0
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    83,
    'Platelet Count',
    'Test Completed',
    40,
    119,
    10,
    '2024-01-27 07:58:48',
    '2024-01-27 07:59:34',
    '2024-01-27 08:15:00',
    '2024-01-27 07:58:48',
    '2024-01-27 08:15:00',
    1
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    84,
    'Platelet Count',
    'Test Completed',
    40,
    120,
    10,
    '2024-01-27 08:16:39',
    '2024-01-27 08:17:12',
    '2024-01-27 08:17:36',
    '2024-01-27 08:16:39',
    '2024-01-27 08:17:36',
    1
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    85,
    'T3 T4 TSH',
    'Registered',
    37,
    121,
    2,
    '2024-02-03 17:00:04',
    NULL,
    NULL,
    '2024-02-03 17:00:04',
    '2024-02-03 17:00:04',
    3
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    86,
    'Lipid Profile',
    'Registered',
    37,
    121,
    23,
    '2024-02-03 17:00:04',
    NULL,
    NULL,
    '2024-02-03 17:00:04',
    '2024-02-03 17:00:04',
    3
  );
INSERT INTO
  `statusofpathologytestsfortestbookings` (
    `id`,
    `testName`,
    `TestStatus`,
    `PatientID`,
    `PathologyTestBookingId`,
    `TestID`,
    `TestRegisteredDateTime`,
    `TestSamplecollectedDateTime`,
    `TestCompletedDateTime`,
    `createdAt`,
    `updatedAt`,
    `admissionID`
  )
VALUES
  (
    87,
    'Platelet Count',
    'Registered',
    37,
    121,
    10,
    '2024-02-03 17:00:04',
    NULL,
    NULL,
    '2024-02-03 17:00:04',
    '2024-02-03 17:00:04',
    3
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: t3t4tshpathologytests
# ------------------------------------------------------------

INSERT INTO
  `t3t4tshpathologytests` (
    `id`,
    `PatientID`,
    `TestManagementID`,
    `PatientTestBookingID`,
    `T3_Tri_iodothyronine`,
    `T4_Thyroxine`,
    `TSH_Thyroid_Stimulating_Hormone`,
    `Remarks`,
    `createdAt`,
    `updatedAt`,
    `resultDate`
  )
VALUES
  (
    2,
    2,
    0,
    11,
    '84',
    '11',
    '4',
    'remark',
    '2023-09-01 09:00:12',
    '2023-09-01 09:00:12',
    NULL
  );
INSERT INTO
  `t3t4tshpathologytests` (
    `id`,
    `PatientID`,
    `TestManagementID`,
    `PatientTestBookingID`,
    `T3_Tri_iodothyronine`,
    `T4_Thyroxine`,
    `TSH_Thyroid_Stimulating_Hormone`,
    `Remarks`,
    `createdAt`,
    `updatedAt`,
    `resultDate`
  )
VALUES
  (
    3,
    2,
    0,
    11,
    '85.4',
    '12.8',
    '5.4',
    'NA',
    '2023-09-01 09:54:19',
    '2023-09-01 09:54:19',
    '2023-09-01T09:32:26.266Z'
  );
INSERT INTO
  `t3t4tshpathologytests` (
    `id`,
    `PatientID`,
    `TestManagementID`,
    `PatientTestBookingID`,
    `T3_Tri_iodothyronine`,
    `T4_Thyroxine`,
    `TSH_Thyroid_Stimulating_Hormone`,
    `Remarks`,
    `createdAt`,
    `updatedAt`,
    `resultDate`
  )
VALUES
  (
    4,
    2,
    0,
    11,
    '',
    '',
    '',
    '',
    '2023-09-01 12:11:23',
    '2023-09-01 12:11:23',
    '2023-09-01T12:11:03.559Z'
  );
INSERT INTO
  `t3t4tshpathologytests` (
    `id`,
    `PatientID`,
    `TestManagementID`,
    `PatientTestBookingID`,
    `T3_Tri_iodothyronine`,
    `T4_Thyroxine`,
    `TSH_Thyroid_Stimulating_Hormone`,
    `Remarks`,
    `createdAt`,
    `updatedAt`,
    `resultDate`
  )
VALUES
  (
    5,
    2,
    0,
    11,
    '84',
    '12',
    '4',
    '',
    '2023-09-01 12:16:41',
    '2023-09-01 12:16:41',
    '2023-09-01T12:16:23.504Z'
  );
INSERT INTO
  `t3t4tshpathologytests` (
    `id`,
    `PatientID`,
    `TestManagementID`,
    `PatientTestBookingID`,
    `T3_Tri_iodothyronine`,
    `T4_Thyroxine`,
    `TSH_Thyroid_Stimulating_Hormone`,
    `Remarks`,
    `createdAt`,
    `updatedAt`,
    `resultDate`
  )
VALUES
  (
    6,
    2,
    8,
    11,
    '85.4',
    '12.5',
    '5.4',
    'NA',
    '2023-09-01 12:17:33',
    '2023-09-01 12:17:33',
    '2023-09-01T12:16:41.190Z'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: t3t4tshresultmodels
# ------------------------------------------------------------

INSERT INTO
  `t3t4tshresultmodels` (
    `id`,
    `PatientID`,
    `TestManagementID`,
    `PatientTestBookingID`,
    `T4_Thyroxine`,
    `TSH_Thyroid_Stimulating_Hormone`,
    `createdAt`,
    `updatedAt`,
    `T3_Tri_iodothyronine`
  )
VALUES
  (
    1,
    2,
    8,
    11,
    '12.4',
    '5.4',
    '2023-09-05 08:18:38',
    '2023-09-05 08:18:38',
    NULL
  );
INSERT INTO
  `t3t4tshresultmodels` (
    `id`,
    `PatientID`,
    `TestManagementID`,
    `PatientTestBookingID`,
    `T4_Thyroxine`,
    `TSH_Thyroid_Stimulating_Hormone`,
    `createdAt`,
    `updatedAt`,
    `T3_Tri_iodothyronine`
  )
VALUES
  (
    2,
    2,
    8,
    11,
    NULL,
    NULL,
    '2023-09-05 18:36:40',
    '2023-09-05 18:36:40',
    '80'
  );
INSERT INTO
  `t3t4tshresultmodels` (
    `id`,
    `PatientID`,
    `TestManagementID`,
    `PatientTestBookingID`,
    `T4_Thyroxine`,
    `TSH_Thyroid_Stimulating_Hormone`,
    `createdAt`,
    `updatedAt`,
    `T3_Tri_iodothyronine`
  )
VALUES
  (
    3,
    2,
    8,
    11,
    '10',
    '5.0',
    '2023-09-05 18:37:25',
    '2023-09-05 18:37:25',
    '80'
  );
INSERT INTO
  `t3t4tshresultmodels` (
    `id`,
    `PatientID`,
    `TestManagementID`,
    `PatientTestBookingID`,
    `T4_Thyroxine`,
    `TSH_Thyroid_Stimulating_Hormone`,
    `createdAt`,
    `updatedAt`,
    `T3_Tri_iodothyronine`
  )
VALUES
  (
    4,
    14,
    8,
    36,
    '11',
    '1111',
    '2023-09-18 09:57:55',
    '2023-09-18 09:57:55',
    '11111111111111'
  );
INSERT INTO
  `t3t4tshresultmodels` (
    `id`,
    `PatientID`,
    `TestManagementID`,
    `PatientTestBookingID`,
    `T4_Thyroxine`,
    `TSH_Thyroid_Stimulating_Hormone`,
    `createdAt`,
    `updatedAt`,
    `T3_Tri_iodothyronine`
  )
VALUES
  (
    5,
    14,
    8,
    36,
    '11t76587',
    '9768765789',
    '2023-09-18 10:40:46',
    '2023-09-18 10:40:46',
    '111111'
  );
INSERT INTO
  `t3t4tshresultmodels` (
    `id`,
    `PatientID`,
    `TestManagementID`,
    `PatientTestBookingID`,
    `T4_Thyroxine`,
    `TSH_Thyroid_Stimulating_Hormone`,
    `createdAt`,
    `updatedAt`,
    `T3_Tri_iodothyronine`
  )
VALUES
  (
    6,
    15,
    12,
    38,
    '10',
    '100',
    '2023-09-18 15:28:10',
    '2023-09-18 15:28:10',
    '1hg2f'
  );
INSERT INTO
  `t3t4tshresultmodels` (
    `id`,
    `PatientID`,
    `TestManagementID`,
    `PatientTestBookingID`,
    `T4_Thyroxine`,
    `TSH_Thyroid_Stimulating_Hormone`,
    `createdAt`,
    `updatedAt`,
    `T3_Tri_iodothyronine`
  )
VALUES
  (
    7,
    18,
    8,
    41,
    '12',
    '12',
    '2023-09-21 20:19:09',
    '2023-09-21 20:19:09',
    '12323'
  );
INSERT INTO
  `t3t4tshresultmodels` (
    `id`,
    `PatientID`,
    `TestManagementID`,
    `PatientTestBookingID`,
    `T4_Thyroxine`,
    `TSH_Thyroid_Stimulating_Hormone`,
    `createdAt`,
    `updatedAt`,
    `T3_Tri_iodothyronine`
  )
VALUES
  (
    8,
    14,
    2,
    43,
    '78',
    '88',
    '2023-10-09 18:20:39',
    '2023-10-09 18:20:39',
    '10'
  );
INSERT INTO
  `t3t4tshresultmodels` (
    `id`,
    `PatientID`,
    `TestManagementID`,
    `PatientTestBookingID`,
    `T4_Thyroxine`,
    `TSH_Thyroid_Stimulating_Hormone`,
    `createdAt`,
    `updatedAt`,
    `T3_Tri_iodothyronine`
  )
VALUES
  (
    9,
    28,
    2,
    54,
    'bjb',
    'jbj,b',
    '2023-10-17 20:40:30',
    '2023-10-17 20:40:30',
    'j,bj,n'
  );
INSERT INTO
  `t3t4tshresultmodels` (
    `id`,
    `PatientID`,
    `TestManagementID`,
    `PatientTestBookingID`,
    `T4_Thyroxine`,
    `TSH_Thyroid_Stimulating_Hormone`,
    `createdAt`,
    `updatedAt`,
    `T3_Tri_iodothyronine`
  )
VALUES
  (
    10,
    37,
    2,
    102,
    '11',
    '123',
    '2023-10-25 18:36:43',
    '2023-10-25 18:36:43',
    NULL
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: testdemoresultmodels
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: testmanagementnormalvalues
# ------------------------------------------------------------

INSERT INTO
  `testmanagementnormalvalues` (
    `id`,
    `testManagementID`,
    `fieldName`,
    `minimumRange`,
    `maximumRange`,
    `unitOfMeasurements`
  )
VALUES
  (12, 9, 'Sr_Cholesterol', '0', '< 200 ', 'mg / dl');
INSERT INTO
  `testmanagementnormalvalues` (
    `id`,
    `testManagementID`,
    `fieldName`,
    `minimumRange`,
    `maximumRange`,
    `unitOfMeasurements`
  )
VALUES
  (15, 8, 'T3_Tri_iodothyronine', '70', '200', 'ng/ml');
INSERT INTO
  `testmanagementnormalvalues` (
    `id`,
    `testManagementID`,
    `fieldName`,
    `minimumRange`,
    `maximumRange`,
    `unitOfMeasurements`
  )
VALUES
  (16, 8, 'T4_Thyroxine', '5', '13.0', 'ug/dl');
INSERT INTO
  `testmanagementnormalvalues` (
    `id`,
    `testManagementID`,
    `fieldName`,
    `minimumRange`,
    `maximumRange`,
    `unitOfMeasurements`
  )
VALUES
  (
    17,
    8,
    'TSH_Thyroid_Stimulating_Hormone',
    '0.2',
    '6.0',
    'uIU / ml'
  );
INSERT INTO
  `testmanagementnormalvalues` (
    `id`,
    `testManagementID`,
    `fieldName`,
    `minimumRange`,
    `maximumRange`,
    `unitOfMeasurements`
  )
VALUES
  (19, 9, 'HDL_Cholesterol', '30', '70', ' mg / dl');
INSERT INTO
  `testmanagementnormalvalues` (
    `id`,
    `testManagementID`,
    `fieldName`,
    `minimumRange`,
    `maximumRange`,
    `unitOfMeasurements`
  )
VALUES
  (20, 9, 'Sr_Triglycerides', '0', 'Up to 170 ', 'mg/dl');
INSERT INTO
  `testmanagementnormalvalues` (
    `id`,
    `testManagementID`,
    `fieldName`,
    `minimumRange`,
    `maximumRange`,
    `unitOfMeasurements`
  )
VALUES
  (21, 9, 'LDL_Cholesterol', '0', 'Upto 150 ', 'mg / dl');
INSERT INTO
  `testmanagementnormalvalues` (
    `id`,
    `testManagementID`,
    `fieldName`,
    `minimumRange`,
    `maximumRange`,
    `unitOfMeasurements`
  )
VALUES
  (22, 9, 'VLDL', '0', 'Upto 35 ', 'mg / dl');
INSERT INTO
  `testmanagementnormalvalues` (
    `id`,
    `testManagementID`,
    `fieldName`,
    `minimumRange`,
    `maximumRange`,
    `unitOfMeasurements`
  )
VALUES
  (23, 9, 'Cholesterol_HDL', '0', '< 5', 'NA');
INSERT INTO
  `testmanagementnormalvalues` (
    `id`,
    `testManagementID`,
    `fieldName`,
    `minimumRange`,
    `maximumRange`,
    `unitOfMeasurements`
  )
VALUES
  (24, 9, 'LDL_HDL', '0', '< 4.3', 'NA');
INSERT INTO
  `testmanagementnormalvalues` (
    `id`,
    `testManagementID`,
    `fieldName`,
    `minimumRange`,
    `maximumRange`,
    `unitOfMeasurements`
  )
VALUES
  (
    26,
    10,
    'Platelet_Count',
    '150000',
    '450000',
    '/ cu.mm'
  );
INSERT INTO
  `testmanagementnormalvalues` (
    `id`,
    `testManagementID`,
    `fieldName`,
    `minimumRange`,
    `maximumRange`,
    `unitOfMeasurements`
  )
VALUES
  (
    27,
    11,
    'Post_Lunch_Blood_Sugar',
    '60',
    '145 ',
    'mg %'
  );
INSERT INTO
  `testmanagementnormalvalues` (
    `id`,
    `testManagementID`,
    `fieldName`,
    `minimumRange`,
    `maximumRange`,
    `unitOfMeasurements`
  )
VALUES
  (28, 11, 'Urine_Sugar', '0', '25', 'mg/dl');
INSERT INTO
  `testmanagementnormalvalues` (
    `id`,
    `testManagementID`,
    `fieldName`,
    `minimumRange`,
    `maximumRange`,
    `unitOfMeasurements`
  )
VALUES
  (30, 12, 'Chloride', '98', '107', 'mg/dl');
INSERT INTO
  `testmanagementnormalvalues` (
    `id`,
    `testManagementID`,
    `fieldName`,
    `minimumRange`,
    `maximumRange`,
    `unitOfMeasurements`
  )
VALUES
  (31, 12, 'Sugar', '20', '45', ' mg / d');
INSERT INTO
  `testmanagementnormalvalues` (
    `id`,
    `testManagementID`,
    `fieldName`,
    `minimumRange`,
    `maximumRange`,
    `unitOfMeasurements`
  )
VALUES
  (32, 12, 'Proteins', '40', '80', 'mg/dl');
INSERT INTO
  `testmanagementnormalvalues` (
    `id`,
    `testManagementID`,
    `fieldName`,
    `minimumRange`,
    `maximumRange`,
    `unitOfMeasurements`
  )
VALUES
  (44, 13, 'newone', '10', '100', 'mg/dl');
INSERT INTO
  `testmanagementnormalvalues` (
    `id`,
    `testManagementID`,
    `fieldName`,
    `minimumRange`,
    `maximumRange`,
    `unitOfMeasurements`
  )
VALUES
  (69, 12, 'Sugar_Level', '', '<100', 'mg/dl');
INSERT INTO
  `testmanagementnormalvalues` (
    `id`,
    `testManagementID`,
    `fieldName`,
    `minimumRange`,
    `maximumRange`,
    `unitOfMeasurements`
  )
VALUES
  (74, 14, 'Sugar_Level', '', '<100', 'mg/dl');
INSERT INTO
  `testmanagementnormalvalues` (
    `id`,
    `testManagementID`,
    `fieldName`,
    `minimumRange`,
    `maximumRange`,
    `unitOfMeasurements`
  )
VALUES
  (77, 15, 'Sugar_Level', '', '<100', 'mg/dl');
INSERT INTO
  `testmanagementnormalvalues` (
    `id`,
    `testManagementID`,
    `fieldName`,
    `minimumRange`,
    `maximumRange`,
    `unitOfMeasurements`
  )
VALUES
  (80, 1, 'Comment', NULL, NULL, NULL);
INSERT INTO
  `testmanagementnormalvalues` (
    `id`,
    `testManagementID`,
    `fieldName`,
    `minimumRange`,
    `maximumRange`,
    `unitOfMeasurements`
  )
VALUES
  (81, 10, 'Comment', NULL, NULL, NULL);
INSERT INTO
  `testmanagementnormalvalues` (
    `id`,
    `testManagementID`,
    `fieldName`,
    `minimumRange`,
    `maximumRange`,
    `unitOfMeasurements`
  )
VALUES
  (82, 10, 'Smear_Examination', '100', '200', 'mg/dl');
INSERT INTO
  `testmanagementnormalvalues` (
    `id`,
    `testManagementID`,
    `fieldName`,
    `minimumRange`,
    `maximumRange`,
    `unitOfMeasurements`
  )
VALUES
  (89, 25, 'test26', '10', '120', 'mg/dl');
INSERT INTO
  `testmanagementnormalvalues` (
    `id`,
    `testManagementID`,
    `fieldName`,
    `minimumRange`,
    `maximumRange`,
    `unitOfMeasurements`
  )
VALUES
  (90, 26, 'new26', '10', '110', 'mgdl');
INSERT INTO
  `testmanagementnormalvalues` (
    `id`,
    `testManagementID`,
    `fieldName`,
    `minimumRange`,
    `maximumRange`,
    `unitOfMeasurements`
  )
VALUES
  (91, 26, 'jn', NULL, NULL, NULL);
INSERT INTO
  `testmanagementnormalvalues` (
    `id`,
    `testManagementID`,
    `fieldName`,
    `minimumRange`,
    `maximumRange`,
    `unitOfMeasurements`
  )
VALUES
  (92, 26, 'jh', '10', '10000', 'jn');
INSERT INTO
  `testmanagementnormalvalues` (
    `id`,
    `testManagementID`,
    `fieldName`,
    `minimumRange`,
    `maximumRange`,
    `unitOfMeasurements`
  )
VALUES
  (93, 27, 'NA27', '20', '200', 'mgdl');
INSERT INTO
  `testmanagementnormalvalues` (
    `id`,
    `testManagementID`,
    `fieldName`,
    `minimumRange`,
    `maximumRange`,
    `unitOfMeasurements`
  )
VALUES
  (94, 27, 'jj', NULL, NULL, NULL);
INSERT INTO
  `testmanagementnormalvalues` (
    `id`,
    `testManagementID`,
    `fieldName`,
    `minimumRange`,
    `maximumRange`,
    `unitOfMeasurements`
  )
VALUES
  (95, 28, 'jb', '10', '100', 'jn');
INSERT INTO
  `testmanagementnormalvalues` (
    `id`,
    `testManagementID`,
    `fieldName`,
    `minimumRange`,
    `maximumRange`,
    `unitOfMeasurements`
  )
VALUES
  (96, 29, 'new100', '12', '1212', 'nk');
INSERT INTO
  `testmanagementnormalvalues` (
    `id`,
    `testManagementID`,
    `fieldName`,
    `minimumRange`,
    `maximumRange`,
    `unitOfMeasurements`
  )
VALUES
  (97, 30, 'new', '10', '1000', 'ml');
INSERT INTO
  `testmanagementnormalvalues` (
    `id`,
    `testManagementID`,
    `fieldName`,
    `minimumRange`,
    `maximumRange`,
    `unitOfMeasurements`
  )
VALUES
  (98, 31, 'newOne', '10', '100', 'mg/dl');
INSERT INTO
  `testmanagementnormalvalues` (
    `id`,
    `testManagementID`,
    `fieldName`,
    `minimumRange`,
    `maximumRange`,
    `unitOfMeasurements`
  )
VALUES
  (99, 31, 'two', '20', '200', 'mg/dl');

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: testpackagemodels
# ------------------------------------------------------------

INSERT INTO
  `testpackagemodels` (
    `id`,
    `packageName`,
    `MRPOfPackage`,
    `discount`,
    `finalPrice`,
    `createdAt`,
    `updatedAt`,
    `Currency`
  )
VALUES
  (
    4,
    'Pathology All Test',
    1500,
    10,
    1350.00,
    '2023-09-26 16:09:29',
    '2024-01-15 15:58:59',
    'USD'
  );
INSERT INTO
  `testpackagemodels` (
    `id`,
    `packageName`,
    `MRPOfPackage`,
    `discount`,
    `finalPrice`,
    `createdAt`,
    `updatedAt`,
    `Currency`
  )
VALUES
  (
    12,
    'Health Premium',
    5500,
    30,
    3850.00,
    '2023-10-03 10:26:52',
    '2024-02-03 17:00:42',
    'USD'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: testsresultmodeldiagnostics
# ------------------------------------------------------------

INSERT INTO
  `testsresultmodeldiagnostics` (
    `id`,
    `PatientID`,
    `TestManagementID`,
    `PatientTestBookingID`,
    `newfield`,
    `createdAt`,
    `updatedAt`,
    `newOne`
  )
VALUES
  (
    1,
    18,
    2,
    1,
    'kuyjbh',
    '2023-10-09 23:00:15',
    '2023-10-09 23:00:15',
    'j,n ljygbdewyugb wukgbdywdhb udlghboqudghb gbdhuwyghdowI OUWQILGDHOWEIGDH WEDHBWEGHDIW WIODHWIEEHDW CWAUDHBWUIHDBX WDEUHXWEOIDHBXWAHE SDXWEUSDHBOIWUHDIWABS WAELIUSDHWIOIUHDSXIWA XWAUIHDNIQU2LWHJDIWS XUISHDBIUHSDBIUWS XUISBDUWHSDIWSA XKUHJBDUYWYHDWEB D UWE ECKHEAJHCBKUEAJHBCSAHJC WE DKHAWJBDDKUHWEBKUHE  DKJHJBCKHEABCKHJEADBCDSCLJBS CDJHBDHWEJBSCJHDSBCJKHABCJKHBAJKSC E KJJEDBSCKHD C E   WEKSJDBKUHWUBSDKHBES DFKUHEJSEBSKUHBDKUHUQWHEWBKUHHWBDKUHWE EA BQKUEBDWAE\n\nj,n ljygbdewyugb wukgbdywdhb udlghboqudghb gbdhuwyghdowI\nOUWQILGDHOWEIGDH WEDHBWEGHDIW WIODHWIEEHDW\nCWAUDHBWUIHDBX WDEUHXWEOIDHBXWAHE\nSDXWEUSDHBOIWUHDIWABS WAELIUSDHWIOIUHDSXIWA\nXWAUIHDNIQU2LWHJDIWS XUISHDBIUHSDBIUWS XUISBDUWHSDIWSA\nXKUHJBDUYWYHDWEB D UWE ECKHEAJHCBKUEAJHBCSAHJC WE\nDKHAWJBDDKUHWEBKUHE DKJHJBCKHEABCKHJEADBCDSCLJBS\nCDJHBDHWEJBSCJHDSBCJKHABCJKHBAJKSC E KJJEDBSCKHD C E\nWEKSJDBKUHWUBSDKHBES\nDFKUHEJSEBSKUHBDKUHUQWHEWB\n\n\n\nj,n ljygbdewyugb wukgbdywdhb udlghboqudghb gbdhuwyghdowI\nOUWQILGDHOWEIGDH WEDHBWEGHDIW WIODHWIEEHDW\nCWAUDHBWUIHDBX WDEUHXWEOIDHBXWAHE\nSDXWEUSDHBOIWUHDIWABS WAELIUSDHWIOIUHDSXIWA\nXWAUIHDNIQU2LWHJDIWS XUISHDBIUHSDBIUWS XUISBDUWHSDIWSA\nXKUHJBDUYWYHDWEB D UWE ECKHEAJHCBKUEAJHBCSAHJC WE\nDKHAWJBDDKUHWEBKUHE DKJHJBCKHEABCKHJEADBCDSCLJBS\nCDJHBDHWEJBSCJHDSBCJKHABCJKHBAJKSC E KJJEDBSCKHD C E\nWEKSJDBKUHWUBSDKHBES\nDFKUHEJSEBSKUHBDKUHUQWHEWB\n\nj,n ljygbdewyugb wukgbdywdhb udlghboqudghb gbdhuwyghdowI\nOUWQILGDHOWEIGDH WEDHBWEGHDIW WIODHWIEEHDW\nCWAUDHBWUIHDBX WDEUHXWEOIDHBXWAHE\nSDXWEUSDHBOIWUHDIWABS WAELIUSDHWIOIUHDSXIWA\nXWAUIHDNIQU2LWHJDIWS XUISHDBIUHSDBIUWS XUISBDUWHSDIWSA\nXKUHJBDUYWYHDWEB D UWE ECKHEAJHCBKUEAJHBCSAHJC WE\nDKHAWJBDDKUHWEBKUHE DKJHJBCKHEABCKHJEADBCDSCLJBS\nCDJHBDHWEJBSCJHDSBCJKHABCJKHBAJKSC E KJJEDBSCKHD C E\nWEKSJDBKUHWUBSDKHBES\nDFKUHEJSEBSKUHBDKUHUQWHEWB'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: ultrasoundabdomenresultmodeldiagnostics
# ------------------------------------------------------------

INSERT INTO
  `ultrasoundabdomenresultmodeldiagnostics` (
    `id`,
    `PatientID`,
    `TestManagementID`,
    `Comment`,
    `PatientTestBookingID`,
    `LIVER`,
    `GALL_BLADDER`,
    `createdAt`,
    `updatedAt`,
    `PANCREAS`,
    `RIGHT_KIDNEY`,
    `LEFT_KIDNEY`,
    `BLADDER`,
    `PROSTATE`
  )
VALUES
  (
    1,
    18,
    16,
    'NAA',
    1,
    'Is mildly enlarged in size (~ 16.1 cms) and shows increased echotexture.\nNo obvious focal lesion seen. No intra ΓÇô Hepatic billiary radical dilatation seen.',
    'Is adequately distended. No calculus or internal echoes are seen.Wall thickness is normal. The CBD is not dilated.',
    '2023-10-17 22:58:22',
    '2023-10-17 22:58:22',
    'Appears normal in size and shows uniform echotexture.',
    'Right kidney measures ~ 10 .3 x 4.3 cms.\nThe shape, size and contour of the right kidney appear normal.Cortico medullary differentiation is within normal.\nNo evidence of pelvicalyceal dilatation. No calculi seen.',
    'Left kidney measures ~ 9.2 x 4.6 cms.\nThe shape, size and contour of the left kidney appear normal.Cortico medullary differentiation is within normal.\nNo evidence of pelvicalyceal dilatation. No calculi seen.',
    'Is normal contour. No intra luminal echoes are seen. Wall thickness is normal.',
    'Measures ~ 3.4x 3.3 x 3.3 cms (Volume: 19 .8 cc)\nProstate is normal in size and shows normal echoes.No free fluid in abdomen.'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: urearesultmodeldiagnostics
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: user_roles
# ------------------------------------------------------------

INSERT INTO
  `user_roles` (`createdAt`, `updatedAt`, `roleId`, `userId`)
VALUES
  ('2024-01-27 09:58:22', '2024-01-27 09:58:22', 1, 85);
INSERT INTO
  `user_roles` (`createdAt`, `updatedAt`, `roleId`, `userId`)
VALUES
  ('2023-09-15 05:32:52', '2023-09-15 05:32:52', 2, 20);
INSERT INTO
  `user_roles` (`createdAt`, `updatedAt`, `roleId`, `userId`)
VALUES
  ('2023-09-15 05:32:52', '2023-09-15 05:32:52', 2, 21);
INSERT INTO
  `user_roles` (`createdAt`, `updatedAt`, `roleId`, `userId`)
VALUES
  ('2023-09-15 05:32:52', '2023-09-15 05:32:52', 2, 22);
INSERT INTO
  `user_roles` (`createdAt`, `updatedAt`, `roleId`, `userId`)
VALUES
  ('2023-10-09 17:09:54', '2023-10-09 17:09:54', 2, 74);
INSERT INTO
  `user_roles` (`createdAt`, `updatedAt`, `roleId`, `userId`)
VALUES
  ('2023-10-09 18:07:21', '2023-10-09 18:07:21', 2, 75);
INSERT INTO
  `user_roles` (`createdAt`, `updatedAt`, `roleId`, `userId`)
VALUES
  ('2023-10-10 03:17:02', '2023-10-10 03:17:02', 2, 76);
INSERT INTO
  `user_roles` (`createdAt`, `updatedAt`, `roleId`, `userId`)
VALUES
  ('2023-10-10 03:17:48', '2023-10-10 03:17:48', 2, 77);
INSERT INTO
  `user_roles` (`createdAt`, `updatedAt`, `roleId`, `userId`)
VALUES
  ('2023-10-12 08:17:31', '2023-10-12 08:17:31', 2, 78);
INSERT INTO
  `user_roles` (`createdAt`, `updatedAt`, `roleId`, `userId`)
VALUES
  ('2023-11-08 10:56:21', '2023-11-08 10:56:21', 2, 81);
INSERT INTO
  `user_roles` (`createdAt`, `updatedAt`, `roleId`, `userId`)
VALUES
  ('2024-02-01 07:41:59', '2024-02-01 07:41:59', 2, 86);
INSERT INTO
  `user_roles` (`createdAt`, `updatedAt`, `roleId`, `userId`)
VALUES
  ('2024-02-01 08:04:53', '2024-02-01 08:04:53', 2, 87);
INSERT INTO
  `user_roles` (`createdAt`, `updatedAt`, `roleId`, `userId`)
VALUES
  ('2024-02-01 08:06:38', '2024-02-01 08:06:38', 2, 88);
INSERT INTO
  `user_roles` (`createdAt`, `updatedAt`, `roleId`, `userId`)
VALUES
  ('2024-02-01 08:09:10', '2024-02-01 08:09:10', 2, 89);
INSERT INTO
  `user_roles` (`createdAt`, `updatedAt`, `roleId`, `userId`)
VALUES
  ('2023-09-25 17:06:08', '2023-09-25 17:06:08', 3, 70);
INSERT INTO
  `user_roles` (`createdAt`, `updatedAt`, `roleId`, `userId`)
VALUES
  ('2024-01-27 09:24:55', '2024-01-27 09:24:55', 3, 84);
INSERT INTO
  `user_roles` (`createdAt`, `updatedAt`, `roleId`, `userId`)
VALUES
  ('2023-09-07 10:23:16', '2023-09-07 10:23:16', 4, 6);
INSERT INTO
  `user_roles` (`createdAt`, `updatedAt`, `roleId`, `userId`)
VALUES
  ('2023-09-07 10:30:15', '2023-09-07 10:30:15', 4, 7);
INSERT INTO
  `user_roles` (`createdAt`, `updatedAt`, `roleId`, `userId`)
VALUES
  ('2023-09-14 02:36:16', '2023-09-14 02:36:16', 4, 18);
INSERT INTO
  `user_roles` (`createdAt`, `updatedAt`, `roleId`, `userId`)
VALUES
  ('2023-09-15 08:56:48', '2023-09-15 08:56:48', 4, 23);
INSERT INTO
  `user_roles` (`createdAt`, `updatedAt`, `roleId`, `userId`)
VALUES
  ('2023-09-18 16:45:00', '2023-09-18 16:45:00', 4, 24);
INSERT INTO
  `user_roles` (`createdAt`, `updatedAt`, `roleId`, `userId`)
VALUES
  ('2023-10-26 14:53:27', '2023-10-26 14:53:27', 4, 79);
INSERT INTO
  `user_roles` (`createdAt`, `updatedAt`, `roleId`, `userId`)
VALUES
  ('2023-10-27 07:36:21', '2023-10-27 07:36:21', 4, 80);
INSERT INTO
  `user_roles` (`createdAt`, `updatedAt`, `roleId`, `userId`)
VALUES
  ('2024-02-05 08:04:42', '2024-02-05 08:04:42', 4, 90);
INSERT INTO
  `user_roles` (`createdAt`, `updatedAt`, `roleId`, `userId`)
VALUES
  ('2024-02-05 08:10:04', '2024-02-05 08:10:04', 4, 91);
INSERT INTO
  `user_roles` (`createdAt`, `updatedAt`, `roleId`, `userId`)
VALUES
  ('2024-01-14 04:41:12', '2024-01-14 04:41:12', 6, 17);
INSERT INTO
  `user_roles` (`createdAt`, `updatedAt`, `roleId`, `userId`)
VALUES
  ('2023-09-19 06:14:54', '2023-09-19 06:14:54', 6, 25);
INSERT INTO
  `user_roles` (`createdAt`, `updatedAt`, `roleId`, `userId`)
VALUES
  ('2023-09-19 13:03:09', '2023-09-19 13:03:09', 6, 63);
INSERT INTO
  `user_roles` (`createdAt`, `updatedAt`, `roleId`, `userId`)
VALUES
  ('2023-09-19 17:07:27', '2023-09-19 17:07:27', 6, 64);
INSERT INTO
  `user_roles` (`createdAt`, `updatedAt`, `roleId`, `userId`)
VALUES
  ('2023-09-19 17:08:23', '2023-09-19 17:08:23', 6, 65);
INSERT INTO
  `user_roles` (`createdAt`, `updatedAt`, `roleId`, `userId`)
VALUES
  ('2024-01-15 06:02:30', '2024-01-15 06:02:30', 6, 82);
INSERT INTO
  `user_roles` (`createdAt`, `updatedAt`, `roleId`, `userId`)
VALUES
  ('2023-09-19 12:55:25', '2023-09-19 12:55:25', 9, 13);
INSERT INTO
  `user_roles` (`createdAt`, `updatedAt`, `roleId`, `userId`)
VALUES
  ('2023-09-21 09:33:31', '2023-09-21 09:33:31', 9, 69);
INSERT INTO
  `user_roles` (`createdAt`, `updatedAt`, `roleId`, `userId`)
VALUES
  ('2024-01-27 06:37:28', '2024-01-27 06:37:28', 9, 83);
INSERT INTO
  `user_roles` (`createdAt`, `updatedAt`, `roleId`, `userId`)
VALUES
  (
    '2023-09-12 10:24:05',
    '2023-09-12 10:24:05',
    10,
    14
  );
INSERT INTO
  `user_roles` (`createdAt`, `updatedAt`, `roleId`, `userId`)
VALUES
  (
    '2023-09-20 09:27:43',
    '2023-09-20 09:27:43',
    11,
    66
  );
INSERT INTO
  `user_roles` (`createdAt`, `updatedAt`, `roleId`, `userId`)
VALUES
  (
    '2023-09-28 16:19:31',
    '2023-09-28 16:19:31',
    12,
    71
  );
INSERT INTO
  `user_roles` (`createdAt`, `updatedAt`, `roleId`, `userId`)
VALUES
  (
    '2024-01-28 03:32:12',
    '2024-01-28 03:32:12',
    13,
    11
  );
INSERT INTO
  `user_roles` (`createdAt`, `updatedAt`, `roleId`, `userId`)
VALUES
  (
    '2023-09-28 16:40:39',
    '2023-09-28 16:40:39',
    13,
    72
  );
INSERT INTO
  `user_roles` (`createdAt`, `updatedAt`, `roleId`, `userId`)
VALUES
  (
    '2023-09-29 04:59:10',
    '2023-09-29 04:59:10',
    14,
    73
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: users
# ------------------------------------------------------------

INSERT INTO
  `users` (
    `id`,
    `name`,
    `username`,
    `email`,
    `phoneNumber`,
    `password`,
    `createdAt`,
    `updatedAt`,
    `hospitalId`,
    `language`,
    `status`,
    `loggedInStatus`
  )
VALUES
  (
    6,
    'Vaibhav Pande',
    'Vaibhav02',
    'vaibhav@gmail.com',
    8976545678,
    '$2a$08$ZY9kj5RR7hyTxnkwHbzvsepmgvrCPIBikkcWWDiHH12w/Y/uFujvm',
    '2023-09-07 10:23:16',
    '2024-02-04 13:50:49',
    0,
    'en',
    'active',
    'LoggedOut'
  );
INSERT INTO
  `users` (
    `id`,
    `name`,
    `username`,
    `email`,
    `phoneNumber`,
    `password`,
    `createdAt`,
    `updatedAt`,
    `hospitalId`,
    `language`,
    `status`,
    `loggedInStatus`
  )
VALUES
  (
    7,
    'Gangesh Kale',
    'Gangesh02',
    'gangesh02@gmail.com',
    6543245675,
    '$2a$08$.QmJp/S6PCV6FgAmrNlPq.YZCpuMFCMQpOSArJ7kESXTn3cqDwt2e',
    '2023-09-07 10:30:15',
    '2024-02-04 13:50:49',
    0,
    'en',
    'active',
    'LoggedOut'
  );
INSERT INTO
  `users` (
    `id`,
    `name`,
    `username`,
    `email`,
    `phoneNumber`,
    `password`,
    `createdAt`,
    `updatedAt`,
    `hospitalId`,
    `language`,
    `status`,
    `loggedInStatus`
  )
VALUES
  (
    11,
    'Asha  Kumari',
    'Asha02',
    'asha02@gmail.com',
    8766587656,
    '$2a$08$BTENjIaZYz6qrRoIiwe1TuZ0hBHHyd2zT1RCKlA6jIHyKvnd4goP.',
    '2023-09-10 03:16:51',
    '2024-02-04 13:50:49',
    0,
    'en',
    'active',
    'LoggedOut'
  );
INSERT INTO
  `users` (
    `id`,
    `name`,
    `username`,
    `email`,
    `phoneNumber`,
    `password`,
    `createdAt`,
    `updatedAt`,
    `hospitalId`,
    `language`,
    `status`,
    `loggedInStatus`
  )
VALUES
  (
    13,
    'Nitesh Giri',
    'Nitesh02',
    'nitugiri02+1@gmail.com',
    7841039834,
    '$2a$08$8g/oXCA7gFj5on.RyZK7FOsnqxUaeryuFeNfV5uK9Q6J.KQzBdE.q',
    '2023-09-10 03:19:18',
    '2024-02-04 13:50:49',
    0,
    'en',
    'active',
    'LoggedOut'
  );
INSERT INTO
  `users` (
    `id`,
    `name`,
    `username`,
    `email`,
    `phoneNumber`,
    `password`,
    `createdAt`,
    `updatedAt`,
    `hospitalId`,
    `language`,
    `status`,
    `loggedInStatus`
  )
VALUES
  (
    14,
    'Vishnu  D Wad',
    'Vishnu02',
    'vishnu@gmail.com',
    8765678765,
    '$2a$08$2/.cnpnFliH3Zqp8FMOqdu9MhmQ/hmv02BFFCYmf.NFbdvjn0KID2',
    '2023-09-12 10:23:38',
    '2024-02-04 13:50:49',
    0,
    'en',
    'active',
    'LoggedOut'
  );
INSERT INTO
  `users` (
    `id`,
    `name`,
    `username`,
    `email`,
    `phoneNumber`,
    `password`,
    `createdAt`,
    `updatedAt`,
    `hospitalId`,
    `language`,
    `status`,
    `loggedInStatus`
  )
VALUES
  (
    17,
    'Anand R Kumar',
    'Anand02',
    'anand@gmail.com',
    7654678998,
    '$2a$10$ut.NQNY1CDMQjllsEvORdOoYUxucILLdqEq9/emHeu2mWXHmCCozq',
    '2023-09-13 02:33:01',
    '2024-02-04 13:50:49',
    0,
    'en',
    'active',
    'LoggedOut'
  );
INSERT INTO
  `users` (
    `id`,
    `name`,
    `username`,
    `email`,
    `phoneNumber`,
    `password`,
    `createdAt`,
    `updatedAt`,
    `hospitalId`,
    `language`,
    `status`,
    `loggedInStatus`
  )
VALUES
  (
    18,
    'swddswde',
    'Nitesh',
    'kjjhbuh@hjbk',
    3456754356,
    '$2a$08$kJtpCWTR865Q8UkXatvg1uVomOb9pYmxJ8LmSm.gkUD8bX/f6PzTC',
    '2023-09-14 02:36:16',
    '2024-02-04 13:50:49',
    0,
    'en',
    'active',
    'LoggedOut'
  );
INSERT INTO
  `users` (
    `id`,
    `name`,
    `username`,
    `email`,
    `phoneNumber`,
    `password`,
    `createdAt`,
    `updatedAt`,
    `hospitalId`,
    `language`,
    `status`,
    `loggedInStatus`
  )
VALUES
  (
    20,
    'Sanjay A Sachdeva',
    'Sanjay02',
    'sanjay987@gmail.com',
    7698567856,
    '$2a$08$tXYAmKCgs3HL9.kuu3sQL.J1TDCjwAC9IKroo.vIU6KWyBpq7zZ9y',
    '2023-09-15 05:32:52',
    '2024-02-04 13:50:49',
    0,
    'en',
    'active',
    'LoggedOut'
  );
INSERT INTO
  `users` (
    `id`,
    `name`,
    `username`,
    `email`,
    `phoneNumber`,
    `password`,
    `createdAt`,
    `updatedAt`,
    `hospitalId`,
    `language`,
    `status`,
    `loggedInStatus`
  )
VALUES
  (
    21,
    'Mohit K Chourasia',
    'Mohit02',
    'mohit@gmail.com',
    9749926784,
    '$2a$08$wXwbSylIxk6hWOFtD2TzkemMrVcrPh6R1q9GU9e32ngX/4PHhx1/G',
    '2023-09-15 05:32:52',
    '2024-02-04 13:50:49',
    0,
    'en',
    'active',
    'LoggedOut'
  );
INSERT INTO
  `users` (
    `id`,
    `name`,
    `username`,
    `email`,
    `phoneNumber`,
    `password`,
    `createdAt`,
    `updatedAt`,
    `hospitalId`,
    `language`,
    `status`,
    `loggedInStatus`
  )
VALUES
  (
    22,
    'Lakshman  Kumar',
    'Lakshman02',
    'lucky@gmail.com',
    8565255671,
    '$2a$08$dJYIg4h.i3iYDiLlf9l8Y.tJf7Mgf1H9qRdChsg/4RxA7AOjzIEw.',
    '2023-09-15 05:32:52',
    '2024-02-04 13:50:49',
    0,
    'en',
    'active',
    'LoggedOut'
  );
INSERT INTO
  `users` (
    `id`,
    `name`,
    `username`,
    `email`,
    `phoneNumber`,
    `password`,
    `createdAt`,
    `updatedAt`,
    `hospitalId`,
    `language`,
    `status`,
    `loggedInStatus`
  )
VALUES
  (
    23,
    'Gangesh',
    'Gangesh03',
    'gangesh11@gmail.com',
    8176545378,
    '$2a$08$8yL8FSylCV0HKUfHWrl0nO60WNayePSfS1VEs2Qmn/Nd8vdm7LBZq',
    '2023-09-15 08:56:47',
    '2024-02-04 13:50:49',
    0,
    'en',
    'active',
    'LoggedOut'
  );
INSERT INTO
  `users` (
    `id`,
    `name`,
    `username`,
    `email`,
    `phoneNumber`,
    `password`,
    `createdAt`,
    `updatedAt`,
    `hospitalId`,
    `language`,
    `status`,
    `loggedInStatus`
  )
VALUES
  (
    24,
    'Vijay Kumar',
    'Vijay02',
    'vijay@gmail.com',
    7896785674,
    '$2a$08$53VlhYVwXySfPV39KNcgVuUsGHxp.0eH5oO5JKPoCDbbE5MQyuvvO',
    '2023-09-18 16:45:00',
    '2024-02-04 13:50:49',
    0,
    'en',
    'active',
    'LoggedOut'
  );
INSERT INTO
  `users` (
    `id`,
    `name`,
    `username`,
    `email`,
    `phoneNumber`,
    `password`,
    `createdAt`,
    `updatedAt`,
    `hospitalId`,
    `language`,
    `status`,
    `loggedInStatus`
  )
VALUES
  (
    25,
    'Nitesh Giri',
    'Hospital_Admin',
    'nitugiri02@gmail.com',
    7841039832,
    '$2a$10$QTJL/xrSbD.g.DPtY90HkOwtk0CYmQtPYKGEwCfW7XW2QFDoNg4LC',
    '2023-09-19 06:14:54',
    '2024-02-05 08:10:26',
    0,
    'en',
    'active',
    'LoggedIn'
  );
INSERT INTO
  `users` (
    `id`,
    `name`,
    `username`,
    `email`,
    `phoneNumber`,
    `password`,
    `createdAt`,
    `updatedAt`,
    `hospitalId`,
    `language`,
    `status`,
    `loggedInStatus`
  )
VALUES
  (
    63,
    'gfhj kjgfhj kjhghjk',
    'Pass123',
    'jnbvfdewdfgb@dfgb.jhg',
    9876345678,
    '$2a$08$6WsMfeuelvoNYeCaAHMOOeIDh1AGKoINy.tvwmgOnfL51kPtPP6ZC',
    '2023-09-19 13:03:09',
    '2024-02-04 13:50:49',
    8,
    'en',
    'active',
    'LoggedOut'
  );
INSERT INTO
  `users` (
    `id`,
    `name`,
    `username`,
    `email`,
    `phoneNumber`,
    `password`,
    `createdAt`,
    `updatedAt`,
    `hospitalId`,
    `language`,
    `status`,
    `loggedInStatus`
  )
VALUES
  (
    64,
    'Admin  One',
    'Admin01',
    'admin01@gmail.com',
    9456787654,
    '$2a$08$g7LEshgciL3707sNTpRvw./wDlgAq/bbvhDKvHLqe.4CJ/FPLrsES',
    '2023-09-19 17:07:27',
    '2024-02-04 13:50:49',
    8,
    'en',
    'active',
    'LoggedOut'
  );
INSERT INTO
  `users` (
    `id`,
    `name`,
    `username`,
    `email`,
    `phoneNumber`,
    `password`,
    `createdAt`,
    `updatedAt`,
    `hospitalId`,
    `language`,
    `status`,
    `loggedInStatus`
  )
VALUES
  (
    65,
    'Admin  two',
    'Admin02',
    'admin02@gmail.com',
    8765467888,
    '$2a$08$SATlSBUuD3CaaRcAfYkk1uPmKv2EH10selpVNDri9A2o4kgw8Z1o.',
    '2023-09-19 17:08:23',
    '2024-02-04 13:50:49',
    9,
    'en',
    'active',
    'LoggedOut'
  );
INSERT INTO
  `users` (
    `id`,
    `name`,
    `username`,
    `email`,
    `phoneNumber`,
    `password`,
    `createdAt`,
    `updatedAt`,
    `hospitalId`,
    `language`,
    `status`,
    `loggedInStatus`
  )
VALUES
  (
    66,
    'Pathologist Admin',
    'Pathologist02',
    'pathologistadmin@gmail.com',
    8765434345,
    '$2a$08$ySdvAA91r7h3dGmpQE5gUuMPD2JWUM5N5PJch0WRHq3EiZ9j35Imy',
    '2023-09-20 09:26:39',
    '2024-02-04 13:50:49',
    0,
    'en',
    'active',
    'LoggedOut'
  );
INSERT INTO
  `users` (
    `id`,
    `name`,
    `username`,
    `email`,
    `phoneNumber`,
    `password`,
    `createdAt`,
    `updatedAt`,
    `hospitalId`,
    `language`,
    `status`,
    `loggedInStatus`
  )
VALUES
  (
    69,
    'Hospital Administrator',
    'Application_Admin',
    'superadmin@example.com',
    1234567899,
    '$2a$08$KpXOCASTHu5aNYmYFjvkW.BoudRzfyWP/7mV3HWbLzxg7cGCPdFvq',
    '2023-09-21 09:33:31',
    '2024-02-04 13:50:49',
    0,
    'en',
    'active',
    'LoggedOut'
  );
INSERT INTO
  `users` (
    `id`,
    `name`,
    `username`,
    `email`,
    `phoneNumber`,
    `password`,
    `createdAt`,
    `updatedAt`,
    `hospitalId`,
    `language`,
    `status`,
    `loggedInStatus`
  )
VALUES
  (
    70,
    'Datta R Kumar',
    'Datta02',
    'datta@gmail.com',
    7656767765,
    '$2a$08$SGFBBL0CxvvN03BJXwZZcuAMSXgeRtdmZsnm/M2/OCKIUn6Iy4P0u',
    '2023-09-25 17:06:08',
    '2024-02-04 13:50:49',
    0,
    'en',
    'active',
    'LoggedOut'
  );
INSERT INTO
  `users` (
    `id`,
    `name`,
    `username`,
    `email`,
    `phoneNumber`,
    `password`,
    `createdAt`,
    `updatedAt`,
    `hospitalId`,
    `language`,
    `status`,
    `loggedInStatus`
  )
VALUES
  (
    71,
    'Diagnostics User',
    'Diagnostics',
    'Diagnostics@gmail.com',
    8765768765,
    '$2a$08$oIEcT9Kj48VQNlWHFMQz7.FqMb4Wm3lchbpXwi16RcS8YzN/rLfDa',
    '2023-09-28 16:16:42',
    '2024-02-04 13:50:49',
    0,
    'en',
    'active',
    'LoggedOut'
  );
INSERT INTO
  `users` (
    `id`,
    `name`,
    `username`,
    `email`,
    `phoneNumber`,
    `password`,
    `createdAt`,
    `updatedAt`,
    `hospitalId`,
    `language`,
    `status`,
    `loggedInStatus`
  )
VALUES
  (
    72,
    'Receptionist',
    'Receptionist',
    'Receptionist@gmail.com',
    8765456767,
    '$2a$08$gtYvdRlrEGc43wAhe4lSpOFq4S/axjvnkibc8v766zl8qz4Po9IJ2',
    '2023-09-28 16:38:51',
    '2024-02-04 13:50:49',
    0,
    'en',
    'active',
    'LoggedOut'
  );
INSERT INTO
  `users` (
    `id`,
    `name`,
    `username`,
    `email`,
    `phoneNumber`,
    `password`,
    `createdAt`,
    `updatedAt`,
    `hospitalId`,
    `language`,
    `status`,
    `loggedInStatus`
  )
VALUES
  (
    73,
    'OTTechnician',
    'OTTechnician',
    'OTTechnician@gmail.com',
    9876543345,
    '$2a$08$0t3.sSRgIFBVx2oXfhA6ZOHZk/3jxKKt7jnTGYD2MpgNO4txczVNu',
    '2023-09-29 04:55:54',
    '2024-02-04 13:50:49',
    0,
    'en',
    'active',
    'LoggedOut'
  );
INSERT INTO
  `users` (
    `id`,
    `name`,
    `username`,
    `email`,
    `phoneNumber`,
    `password`,
    `createdAt`,
    `updatedAt`,
    `hospitalId`,
    `language`,
    `status`,
    `loggedInStatus`
  )
VALUES
  (
    74,
    'vkjvb kv kjvk',
    'Doctor',
    'ghfyjghf@jfhg.fhg',
    7657865876,
    '$2a$08$X31w4GIXnBtNdA/88Z9qtuo9hWe3gwkO7snRsc9O1ZjsFbL1UE7ke',
    '2023-10-09 17:09:54',
    '2024-02-04 13:50:49',
    0,
    'en',
    'active',
    'LoggedOut'
  );
INSERT INTO
  `users` (
    `id`,
    `name`,
    `username`,
    `email`,
    `phoneNumber`,
    `password`,
    `createdAt`,
    `updatedAt`,
    `hospitalId`,
    `language`,
    `status`,
    `loggedInStatus`
  )
VALUES
  (
    75,
    'jhbjh jhb jhb',
    'Doctor02',
    'fghvhb@ghvhb.kjs',
    7654567865,
    '$2a$08$0XqiTXWVL8eW4syBfuO0xeNSdFPCTtqUQ6n0b3A5dLCGn2WRtD6X2',
    '2023-10-09 18:07:21',
    '2024-02-04 13:50:49',
    0,
    'en',
    'active',
    'LoggedOut'
  );
INSERT INTO
  `users` (
    `id`,
    `name`,
    `username`,
    `email`,
    `phoneNumber`,
    `password`,
    `createdAt`,
    `updatedAt`,
    `hospitalId`,
    `language`,
    `status`,
    `loggedInStatus`
  )
VALUES
  (
    76,
    'jhb kjhb kjh',
    'Doctor12',
    'kjhbkuhj@Kug.jhs',
    7865432456,
    '$2a$08$pZBwEpqBElmwkqW0HOJTx.Sc0GtEZRx/pee2o1YnFEMXGuZ4EDiZG',
    '2023-10-10 03:17:02',
    '2024-02-04 13:50:49',
    0,
    'en',
    'active',
    'LoggedOut'
  );
INSERT INTO
  `users` (
    `id`,
    `name`,
    `username`,
    `email`,
    `phoneNumber`,
    `password`,
    `createdAt`,
    `updatedAt`,
    `hospitalId`,
    `language`,
    `status`,
    `loggedInStatus`
  )
VALUES
  (
    77,
    'hgjvgj vjghv jyghv',
    'Doctor03',
    'gfuygh@jhg.ghgh',
    7654365675,
    '$2a$08$9Lr8KVk2bcExCJ6gKMs8OeJUWyS2CEeZxPb4T.deFgjkLKund3/ii',
    '2023-10-10 03:17:48',
    '2024-02-04 13:50:49',
    0,
    'en',
    'active',
    'LoggedOut'
  );
INSERT INTO
  `users` (
    `id`,
    `name`,
    `username`,
    `email`,
    `phoneNumber`,
    `password`,
    `createdAt`,
    `updatedAt`,
    `hospitalId`,
    `language`,
    `status`,
    `loggedInStatus`
  )
VALUES
  (
    78,
    'Rajesh  Kumar',
    'Rajesh02',
    'rajesh@gmail.com',
    8765678976,
    '$2a$08$XiJ/0WE8KjcHbDQPl21ruuFupFNmh890IWklU0XpNXRqwtAily6a2',
    '2023-10-12 08:17:31',
    '2024-02-04 13:50:49',
    0,
    'en',
    'active',
    'LoggedOut'
  );
INSERT INTO
  `users` (
    `id`,
    `name`,
    `username`,
    `email`,
    `phoneNumber`,
    `password`,
    `createdAt`,
    `updatedAt`,
    `hospitalId`,
    `language`,
    `status`,
    `loggedInStatus`
  )
VALUES
  (
    79,
    'Deepak Sign',
    'Deepak02',
    'deepak@gmail.com',
    9876543212,
    '$2a$08$bcAov8DDowZ0mM/kevQUf.w8rEHbmoK4Le/FC/uk9zzgxM86qbgk.',
    '2023-10-26 14:53:26',
    '2024-02-04 13:50:49',
    0,
    'en',
    'active',
    'LoggedOut'
  );
INSERT INTO
  `users` (
    `id`,
    `name`,
    `username`,
    `email`,
    `phoneNumber`,
    `password`,
    `createdAt`,
    `updatedAt`,
    `hospitalId`,
    `language`,
    `status`,
    `loggedInStatus`
  )
VALUES
  (
    80,
    'Asha',
    'Asha05',
    'asha05@gmail.com',
    9876543213,
    '$2a$08$IXp/d.HEEVjzf2PxcB9cUuvuUn1RwlIgUKFQ972CT8dIjQTW3/2Ru',
    '2023-10-27 07:36:19',
    '2024-02-04 13:50:49',
    0,
    'en',
    'active',
    'LoggedOut'
  );
INSERT INTO
  `users` (
    `id`,
    `name`,
    `username`,
    `email`,
    `phoneNumber`,
    `password`,
    `createdAt`,
    `updatedAt`,
    `hospitalId`,
    `language`,
    `status`,
    `loggedInStatus`
  )
VALUES
  (
    81,
    'Sandeep  Sharma',
    'Sandeep02',
    'sandeep02@gmail.com',
    8774447568,
    '$2a$08$FQ1DU7Jjlmf1XMmRDUY1Q.XDtyjPX/QteNArfCBIr8oy8f1XhrmZC',
    '2023-11-08 10:56:21',
    '2024-02-04 13:50:49',
    0,
    'en',
    'active',
    'LoggedOut'
  );
INSERT INTO
  `users` (
    `id`,
    `name`,
    `username`,
    `email`,
    `phoneNumber`,
    `password`,
    `createdAt`,
    `updatedAt`,
    `hospitalId`,
    `language`,
    `status`,
    `loggedInStatus`
  )
VALUES
  (
    82,
    'Dr   Nowa',
    'DrNowa',
    'drnowam@gmail.com',
    3842014150,
    '$2a$08$lbqNTD1Yi8H2BSt1pGbtneNV5CeD5684cEmAoYMQUAmy20nLCOR2S',
    '2024-01-15 06:02:29',
    '2024-02-04 13:50:49',
    1,
    'en',
    'active',
    'LoggedOut'
  );
INSERT INTO
  `users` (
    `id`,
    `name`,
    `username`,
    `email`,
    `phoneNumber`,
    `password`,
    `createdAt`,
    `updatedAt`,
    `hospitalId`,
    `language`,
    `status`,
    `loggedInStatus`
  )
VALUES
  (
    83,
    'Hospital Administrator',
    'Hospital_SuperAdmin',
    'superadmin@silfratech.com',
    5675679999,
    '$2a$08$ZcpTh.6wr6LKCFrpjDDQGOGfjEg4zHleioxmmi3/yrtANTfHwnjYi',
    '2024-01-27 06:37:28',
    '2024-02-04 13:50:49',
    0,
    'en',
    'active',
    'LoggedOut'
  );
INSERT INTO
  `users` (
    `id`,
    `name`,
    `username`,
    `email`,
    `phoneNumber`,
    `password`,
    `createdAt`,
    `updatedAt`,
    `hospitalId`,
    `language`,
    `status`,
    `loggedInStatus`
  )
VALUES
  (
    84,
    'Vijay  Kumar',
    'Vijay023',
    'vija98y@gmail.com',
    7475684675,
    '$2a$08$ovAAPu9ekp1CXrRqDMk3ZO59qVnaX8xqMXuXgHPhiEbe17OyAfPoe',
    '2024-01-27 09:24:54',
    '2024-02-04 13:50:49',
    0,
    'en',
    'active',
    'LoggedOut'
  );
INSERT INTO
  `users` (
    `id`,
    `name`,
    `username`,
    `email`,
    `phoneNumber`,
    `password`,
    `createdAt`,
    `updatedAt`,
    `hospitalId`,
    `language`,
    `status`,
    `loggedInStatus`
  )
VALUES
  (
    85,
    'kbhkjhb',
    'bhkjhblhhB',
    'kjhbkjhb@uh.com',
    6546565567,
    '$2a$08$B48siO1sqFdsyIrwOVQYCuk5MytWy9cjO7oDNHib/bnEFb47XMJR.',
    '2024-01-27 09:58:22',
    '2024-02-04 13:50:49',
    0,
    'en',
    'inactive',
    'LoggedOut'
  );
INSERT INTO
  `users` (
    `id`,
    `name`,
    `username`,
    `email`,
    `phoneNumber`,
    `password`,
    `createdAt`,
    `updatedAt`,
    `hospitalId`,
    `language`,
    `status`,
    `loggedInStatus`
  )
VALUES
  (
    86,
    'Mahesh  Kumar',
    'Mahesh02',
    'mahesh02@gmail.com',
    8645862756,
    '$2a$08$PzbE7BzT9HVLCbEOjuaZsez4DZlD1ExLF//MZz8Il6NnY4zV48hVq',
    '2024-02-01 07:41:58',
    '2024-02-04 13:50:49',
    0,
    'en',
    'active',
    'LoggedOut'
  );
INSERT INTO
  `users` (
    `id`,
    `name`,
    `username`,
    `email`,
    `phoneNumber`,
    `password`,
    `createdAt`,
    `updatedAt`,
    `hospitalId`,
    `language`,
    `status`,
    `loggedInStatus`
  )
VALUES
  (
    87,
    'khgkv kg vkug',
    'Pjhgfd',
    'jgffghj@gmail.com',
    6544565644,
    '$2a$08$ttkNKdM93tewTBwojTAuqO9LzNWUgHBzn.Obz6lEKMYSOdnFuyGL.',
    '2024-02-01 08:04:53',
    '2024-02-04 13:50:49',
    0,
    'en',
    'active',
    'LoggedOut'
  );
INSERT INTO
  `users` (
    `id`,
    `name`,
    `username`,
    `email`,
    `phoneNumber`,
    `password`,
    `createdAt`,
    `updatedAt`,
    `hospitalId`,
    `language`,
    `status`,
    `loggedInStatus`
  )
VALUES
  (
    88,
    'liuyjgh hghjk hkhj',
    'jhgcfGHV',
    'gjhbjh@ghb.com',
    6546554656,
    '$2a$08$DpBd2KRK/35NqFw6sWUt..G6J3a.j0wT7fset5qTV2brEWtC0VPaW',
    '2024-02-01 08:06:38',
    '2024-02-04 13:50:49',
    0,
    'en',
    'active',
    'LoggedOut'
  );
INSERT INTO
  `users` (
    `id`,
    `name`,
    `username`,
    `email`,
    `phoneNumber`,
    `password`,
    `createdAt`,
    `updatedAt`,
    `hospitalId`,
    `language`,
    `status`,
    `loggedInStatus`
  )
VALUES
  (
    89,
    'jbhkub hbuh bkhjb',
    'Pass@123',
    '8rtdfj@jdfg.com',
    7565575675,
    '$2a$08$eiglFNb./mdYwYU2IxJUnO0x.cp0votNDYebmqiI8uTCZcMP2q26G',
    '2024-02-01 08:09:10',
    '2024-02-04 13:50:49',
    0,
    'en',
    'active',
    'LoggedOut'
  );
INSERT INTO
  `users` (
    `id`,
    `name`,
    `username`,
    `email`,
    `phoneNumber`,
    `password`,
    `createdAt`,
    `updatedAt`,
    `hospitalId`,
    `language`,
    `status`,
    `loggedInStatus`
  )
VALUES
  (
    90,
    'jai kumar',
    'Jai123',
    'jai123@gmail.com',
    7654556879,
    '$2a$08$YmyKOddy2FtmlSliyvZWD.oHTfSYyIn3AOzRm7/UFRR4.vYtfaX1W',
    '2024-02-05 08:04:40',
    '2024-02-05 08:04:40',
    0,
    'en',
    'active',
    NULL
  );
INSERT INTO
  `users` (
    `id`,
    `name`,
    `username`,
    `email`,
    `phoneNumber`,
    `password`,
    `createdAt`,
    `updatedAt`,
    `hospitalId`,
    `language`,
    `status`,
    `loggedInStatus`
  )
VALUES
  (
    91,
    'Mahesh',
    'Mahesh03',
    'mahesh01@gmail.com',
    6547785876,
    '$2a$08$VdWh46LZUqHHQ.qayzv64.pF5Z/2sy4dwLWQcdzfL1llP70HxTNlG',
    '2024-02-05 08:10:03',
    '2024-02-05 08:10:03',
    0,
    'en',
    'active',
    NULL
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: userstb
# ------------------------------------------------------------

INSERT INTO
  `userstb` (`userid`, `username`, `password`, `lname`, `fname`)
VALUES
  (1, 'admin', 'admin', 'admin', 'Admin Kel');
INSERT INTO
  `userstb` (`userid`, `username`, `password`, `lname`, `fname`)
VALUES
  (2, 'kel', 'kel', 'Kel', 'Kel');
INSERT INTO
  `userstb` (`userid`, `username`, `password`, `lname`, `fname`)
VALUES
  (3, 'bot', 'bot', 'bot', 'Bot');
INSERT INTO
  `userstb` (`userid`, `username`, `password`, `lname`, `fname`)
VALUES
  (9, 'yokai', 'yokai', 'yokai', 'yokai');
INSERT INTO
  `userstb` (`userid`, `username`, `password`, `lname`, `fname`)
VALUES
  (11, 'jsmith', 'jsmith123', 'Smith', 'John');

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: vendors
# ------------------------------------------------------------

INSERT INTO
  `vendors` (
    `id`,
    `vendorName`,
    `contactAddress`,
    `contactNumber`,
    `panNumber`,
    `bankDetails`,
    `contactPerson`,
    `email`,
    `govtRegDate`,
    `isActive`,
    `receiveDonation`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    3,
    'Jai Kumar',
    'Pune Maharashtra',
    8765435654,
    'NHGRH4566U',
    'Ajay Kumar',
    'Vijay Kumar',
    'ajay@gmail.com',
    '2023-11-29 00:00:00',
    1,
    0,
    '2023-12-01 11:40:14',
    '2023-12-01 11:40:14'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: vitamindresultmodeldiagnostics
# ------------------------------------------------------------

INSERT INTO
  `vitamindresultmodeldiagnostics` (
    `id`,
    `PatientID`,
    `TestManagementID`,
    `Comment`,
    `PatientTestBookingID`,
    `VitaminD`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    1,
    6,
    5,
    'NA',
    2,
    'NA D',
    '2023-10-13 09:46:05',
    '2023-10-13 09:46:05'
  );
INSERT INTO
  `vitamindresultmodeldiagnostics` (
    `id`,
    `PatientID`,
    `TestManagementID`,
    `Comment`,
    `PatientTestBookingID`,
    `VitaminD`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    2,
    36,
    5,
    'NA',
    31,
    'hgfjugkgejy efgukf fkuyfgfilfb gfiuuf fgekgrfie ,h,wgfeli',
    '2024-01-28 18:48:05',
    '2024-01-28 18:48:05'
  );

/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
