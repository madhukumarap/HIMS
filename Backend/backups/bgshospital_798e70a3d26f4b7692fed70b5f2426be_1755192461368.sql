-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: bgshospital_798e70a3d26f4b7692fed70b5f2426be
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `allsubstitutes`
--

DROP TABLE IF EXISTS `allsubstitutes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `allsubstitutes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `medicineName` longtext,
  `medicineId` int DEFAULT NULL,
  `medicine_Id` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `allsubstitutes`
--

LOCK TABLES `allsubstitutes` WRITE;
/*!40000 ALTER TABLE `allsubstitutes` DISABLE KEYS */;
/*!40000 ALTER TABLE `allsubstitutes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `backupconfigs`
--

DROP TABLE IF EXISTS `backupconfigs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `backupconfigs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `period` varchar(255) DEFAULT NULL,
  `day` varchar(255) DEFAULT NULL,
  `time` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `backupconfigs`
--

LOCK TABLES `backupconfigs` WRITE;
/*!40000 ALTER TABLE `backupconfigs` DISABLE KEYS */;
/*!40000 ALTER TABLE `backupconfigs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `backupdata`
--

DROP TABLE IF EXISTS `backupdata`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `backupdata` (
  `id` int NOT NULL AUTO_INCREMENT,
  `filename` varchar(255) DEFAULT NULL,
  `path` varchar(255) DEFAULT NULL,
  `user` varchar(255) DEFAULT NULL,
  `restoredBy` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT 'not-restored',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `backupdata`
--

LOCK TABLES `backupdata` WRITE;
/*!40000 ALTER TABLE `backupdata` DISABLE KEYS */;
/*!40000 ALTER TABLE `backupdata` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bedshospitalrooms`
--

DROP TABLE IF EXISTS `bedshospitalrooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bedshospitalrooms` (
  `id` int NOT NULL AUTO_INCREMENT,
  `BedNumber` varchar(255) DEFAULT NULL,
  `BedType` varchar(255) DEFAULT NULL,
  `BedPrice` int DEFAULT NULL,
  `BedStatus` varchar(255) DEFAULT NULL,
  `HospitalRoomID` int NOT NULL,
  `HospitalRoomNumber` int DEFAULT NULL,
  `Currency` varchar(255) NOT NULL,
  `OccupiedCheckInTime` varchar(255) DEFAULT NULL,
  `OccupiedCheckOutTime` varchar(255) DEFAULT NULL,
  `OccupiedAdmissionID` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bedshospitalrooms`
--

LOCK TABLES `bedshospitalrooms` WRITE;
/*!40000 ALTER TABLE `bedshospitalrooms` DISABLE KEYS */;
/*!40000 ALTER TABLE `bedshospitalrooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bloodsugarforfastingmodels`
--

DROP TABLE IF EXISTS `bloodsugarforfastingmodels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bloodsugarforfastingmodels` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bloodsugarforfastingmodels`
--

LOCK TABLES `bloodsugarforfastingmodels` WRITE;
/*!40000 ALTER TABLE `bloodsugarforfastingmodels` DISABLE KEYS */;
/*!40000 ALTER TABLE `bloodsugarforfastingmodels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bloodsugerforpps`
--

DROP TABLE IF EXISTS `bloodsugerforpps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bloodsugerforpps` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bloodsugerforpps`
--

LOCK TABLES `bloodsugerforpps` WRITE;
/*!40000 ALTER TABLE `bloodsugerforpps` DISABLE KEYS */;
/*!40000 ALTER TABLE `bloodsugerforpps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `commissioncodedata`
--

DROP TABLE IF EXISTS `commissioncodedata`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `commissioncodedata` (
  `id` int NOT NULL AUTO_INCREMENT,
  `codeType` varchar(255) NOT NULL,
  `value` varchar(255) NOT NULL,
  `description` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `commissioncodedata`
--

LOCK TABLES `commissioncodedata` WRITE;
/*!40000 ALTER TABLE `commissioncodedata` DISABLE KEYS */;
/*!40000 ALTER TABLE `commissioncodedata` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `companyitems`
--

DROP TABLE IF EXISTS `companyitems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `companyitems` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `companyitems`
--

LOCK TABLES `companyitems` WRITE;
/*!40000 ALTER TABLE `companyitems` DISABLE KEYS */;
/*!40000 ALTER TABLE `companyitems` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `companyregistrations`
--

DROP TABLE IF EXISTS `companyregistrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `companyregistrations` (
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
  `countryCode` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `companyregistrations`
--

LOCK TABLES `companyregistrations` WRITE;
/*!40000 ALTER TABLE `companyregistrations` DISABLE KEYS */;
/*!40000 ALTER TABLE `companyregistrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `corporatepatientlistpackages`
--

DROP TABLE IF EXISTS `corporatepatientlistpackages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `corporatepatientlistpackages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `packageName` varchar(255) NOT NULL,
  `MRPOfPackage` int NOT NULL,
  `discount` int DEFAULT NULL,
  `finalPrice` decimal(10,2) NOT NULL,
  `PackageID` int NOT NULL,
  `PatientID` int NOT NULL,
  `PatientPhone` bigint NOT NULL,
  `PatientName` varchar(255) NOT NULL,
  `PatientCorporateID` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `corporatepatientlistpackages`
--

LOCK TABLES `corporatepatientlistpackages` WRITE;
/*!40000 ALTER TABLE `corporatepatientlistpackages` DISABLE KEYS */;
/*!40000 ALTER TABLE `corporatepatientlistpackages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `createvaccinationpatients`
--

DROP TABLE IF EXISTS `createvaccinationpatients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `createvaccinationpatients` (
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
  UNIQUE KEY `vaccinationRegNo` (`vaccinationRegNo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `createvaccinationpatients`
--

LOCK TABLES `createvaccinationpatients` WRITE;
/*!40000 ALTER TABLE `createvaccinationpatients` DISABLE KEYS */;
/*!40000 ALTER TABLE `createvaccinationpatients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `diagnostics_packages`
--

DROP TABLE IF EXISTS `diagnostics_packages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `diagnostics_packages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `packageName` varchar(255) NOT NULL,
  `Currency` varchar(255) DEFAULT NULL,
  `MRPOfPackage` int NOT NULL,
  `discount` int DEFAULT NULL,
  `finalPrice` decimal(10,2) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `diagnostics_packages`
--

LOCK TABLES `diagnostics_packages` WRITE;
/*!40000 ALTER TABLE `diagnostics_packages` DISABLE KEYS */;
/*!40000 ALTER TABLE `diagnostics_packages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `diagnosticsbookings`
--

DROP TABLE IF EXISTS `diagnosticsbookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `diagnosticsbookings` (
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
  `CorporateID` varchar(255) DEFAULT NULL,
  `status` varchar(255) NOT NULL,
  `lapName` varchar(255) DEFAULT NULL,
  `selectedTests` varchar(255) NOT NULL,
  `remarks` text,
  `instrumentsUsed` text,
  `testFees` decimal(10,2) NOT NULL,
  `PaidAmount` decimal(10,2) NOT NULL,
  `TotalFees` decimal(10,2) DEFAULT NULL,
  `Currency` varchar(255) DEFAULT NULL,
  `results` longtext,
  `Authorization` varchar(255) DEFAULT 'Pending',
  `feedback` longtext,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `selectedPackageID` int DEFAULT NULL,
  `admissionID` int DEFAULT '0',
  `procedure` varchar(255) DEFAULT 'Diagnostic',
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `diagnosticsbookings`
--

LOCK TABLES `diagnosticsbookings` WRITE;
/*!40000 ALTER TABLE `diagnosticsbookings` DISABLE KEYS */;
/*!40000 ALTER TABLE `diagnosticsbookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `diagnostictestlists`
--

DROP TABLE IF EXISTS `diagnostictestlists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `diagnostictestlists` (
  `id` int NOT NULL AUTO_INCREMENT,
  `testName` varchar(255) NOT NULL,
  `LabCategoryName` varchar(255) NOT NULL,
  `LabCategoryNameID` int NOT NULL,
  `SpecimenName` varchar(255) NOT NULL,
  `SpecimenNameID` int NOT NULL,
  `code` varchar(255) NOT NULL,
  `description` text,
  `category` varchar(255) NOT NULL,
  `testPrice` int NOT NULL,
  `Currency` varchar(255) NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `testName` (`testName`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `diagnostictestlists`
--

LOCK TABLES `diagnostictestlists` WRITE;
/*!40000 ALTER TABLE `diagnostictestlists` DISABLE KEYS */;
/*!40000 ALTER TABLE `diagnostictestlists` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `diagnostictestresultimages`
--

DROP TABLE IF EXISTS `diagnostictestresultimages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `diagnostictestresultimages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `testBookingID` varchar(255) NOT NULL,
  `testName` varchar(255) NOT NULL,
  `testType` varchar(255) NOT NULL,
  `imagePath` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `diagnostictestresultimages`
--

LOCK TABLES `diagnostictestresultimages` WRITE;
/*!40000 ALTER TABLE `diagnostictestresultimages` DISABLE KEYS */;
/*!40000 ALTER TABLE `diagnostictestresultimages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `diagonosticselectedtestforpackagemodels`
--

DROP TABLE IF EXISTS `diagonosticselectedtestforpackagemodels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `diagonosticselectedtestforpackagemodels` (
  `id` int NOT NULL AUTO_INCREMENT,
  `TestName` varchar(255) NOT NULL,
  `testType` varchar(255) NOT NULL,
  `category` varchar(255) NOT NULL,
  `TestId` int NOT NULL,
  `TestPackageID` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `diagonosticselectedtestforpackagemodels`
--

LOCK TABLES `diagonosticselectedtestforpackagemodels` WRITE;
/*!40000 ALTER TABLE `diagonosticselectedtestforpackagemodels` DISABLE KEYS */;
/*!40000 ALTER TABLE `diagonosticselectedtestforpackagemodels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dispensedmedicines`
--

DROP TABLE IF EXISTS `dispensedmedicines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dispensedmedicines` (
  `id` int NOT NULL AUTO_INCREMENT,
  `PatientName` varchar(255) NOT NULL,
  `patient_Id` int NOT NULL,
  `prescription_Id` int NOT NULL,
  `DispenseID` varchar(255) NOT NULL,
  `DispenseTableID` int NOT NULL,
  `MedicineName` varchar(255) NOT NULL,
  `BatchNumber` varchar(255) NOT NULL,
  `ExpiryDate` datetime NOT NULL,
  `UnitPrice` float(5,2) DEFAULT NULL,
  `Quantity` int NOT NULL,
  `EachmedicineCost` float(5,2) DEFAULT NULL,
  `EachMedicineCurrency` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `DispenseTableID` (`DispenseTableID`),
  CONSTRAINT `dispensedmedicines_ibfk_1` FOREIGN KEY (`DispenseTableID`) REFERENCES `dispensedreports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dispensedmedicines`
--

LOCK TABLES `dispensedmedicines` WRITE;
/*!40000 ALTER TABLE `dispensedmedicines` DISABLE KEYS */;
/*!40000 ALTER TABLE `dispensedmedicines` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dispensedreports`
--

DROP TABLE IF EXISTS `dispensedreports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dispensedreports` (
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
  `totalMedicineAmount` float(5,2) DEFAULT NULL,
  `TotalFees` decimal(10,2) DEFAULT NULL,
  `Currency` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dispensedreports`
--

LOCK TABLES `dispensedreports` WRITE;
/*!40000 ALTER TABLE `dispensedreports` DISABLE KEYS */;
/*!40000 ALTER TABLE `dispensedreports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doctors`
--

DROP TABLE IF EXISTS `doctors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `doctors` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Dr` varchar(255) DEFAULT 'DR',
  `username` varchar(255) DEFAULT NULL,
  `FirstName` varchar(255) NOT NULL,
  `MiddleName` varchar(255) DEFAULT NULL,
  `LastName` varchar(255) NOT NULL,
  `registrationNo` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `phoneNo` bigint DEFAULT NULL,
  `countryCode` varchar(255) NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `signatureImage` longblob,
  `consultationFee` decimal(10,2) NOT NULL DEFAULT '0.00',
  `consultationCurrency` varchar(255) NOT NULL DEFAULT 'INR',
  `discount` int NOT NULL DEFAULT '0',
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctors`
--

LOCK TABLES `doctors` WRITE;
/*!40000 ALTER TABLE `doctors` DISABLE KEYS */;
/*!40000 ALTER TABLE `doctors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doctorsappointments`
--

DROP TABLE IF EXISTS `doctorsappointments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `doctorsappointments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `doctorId` int NOT NULL,
  `admissionID` int DEFAULT '0',
  `patientId` int NOT NULL,
  `CorporateID` varchar(255) DEFAULT NULL,
  `Currency` varchar(255) DEFAULT NULL,
  `PatientName` varchar(255) NOT NULL,
  `PatientPhone` bigint NOT NULL,
  `DoctorPhone` bigint NOT NULL,
  `DoctorEmail` varchar(255) NOT NULL,
  `DoctorName` varchar(255) NOT NULL,
  `bookingStartDate` varchar(255) NOT NULL,
  `bookingEndDate` varchar(255) NOT NULL,
  `paymentStatus` varchar(255) NOT NULL,
  `paymentDateTime` varchar(255) DEFAULT NULL,
  `BookingStatus` varchar(255) DEFAULT NULL,
  `amount` int DEFAULT '0',
  `remarks` text,
  `image` longtext,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `reason` varchar(255) DEFAULT NULL,
  `visitType` varchar(255) DEFAULT NULL,
  `procedure` varchar(255) DEFAULT 'Doctor Visit',
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctorsappointments`
--

LOCK TABLES `doctorsappointments` WRITE;
/*!40000 ALTER TABLE `doctorsappointments` DISABLE KEYS */;
/*!40000 ALTER TABLE `doctorsappointments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `drugdatabases`
--

DROP TABLE IF EXISTS `drugdatabases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `drugdatabases` (
  `id` int NOT NULL AUTO_INCREMENT,
  `medicineName` longtext,
  `manufacturer` longtext,
  `saltComposition` longtext,
  `packaging` longtext,
  `price` float(5,2) DEFAULT NULL,
  `Currency` varchar(255) DEFAULT NULL,
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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `drugdatabases`
--

LOCK TABLES `drugdatabases` WRITE;
/*!40000 ALTER TABLE `drugdatabases` DISABLE KEYS */;
/*!40000 ALTER TABLE `drugdatabases` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `healthtestpackagemodels`
--

DROP TABLE IF EXISTS `healthtestpackagemodels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `healthtestpackagemodels` (
  `id` int NOT NULL AUTO_INCREMENT,
  `packageName` varchar(255) NOT NULL,
  `MRPOfPackage` int NOT NULL,
  `discount` int DEFAULT NULL,
  `Currency` varchar(255) NOT NULL,
  `finalPrice` decimal(10,2) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `healthtestpackagemodels`
--

LOCK TABLES `healthtestpackagemodels` WRITE;
/*!40000 ALTER TABLE `healthtestpackagemodels` DISABLE KEYS */;
/*!40000 ALTER TABLE `healthtestpackagemodels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hospitaladminregistrations`
--

DROP TABLE IF EXISTS `hospitaladminregistrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hospitaladminregistrations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) DEFAULT NULL,
  `hospitalId` int DEFAULT '0',
  `firstName` varchar(255) NOT NULL,
  `middleName` varchar(255) DEFAULT NULL,
  `lastName` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `phoneNo` bigint NOT NULL,
  `countryCode` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hospitaladminregistrations`
--

LOCK TABLES `hospitaladminregistrations` WRITE;
/*!40000 ALTER TABLE `hospitaladminregistrations` DISABLE KEYS */;
/*!40000 ALTER TABLE `hospitaladminregistrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hospitaladmissions`
--

DROP TABLE IF EXISTS `hospitaladmissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hospitaladmissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `PatientName` varchar(255) NOT NULL,
  `PatientID` int NOT NULL,
  `AdmissionDate` varchar(255) NOT NULL,
  `PatientPhoneNo` bigint NOT NULL,
  `AdmittingPhysician` varchar(255) NOT NULL,
  `AdmittingPhysicianPhone` bigint NOT NULL,
  `AdmittingPhysicianID` varchar(255) NOT NULL,
  `ReferringPhysician` varchar(255) DEFAULT NULL,
  `ReferringPhysicianPhone` bigint DEFAULT NULL,
  `ReferringPhysicianID` int DEFAULT NULL,
  `ReasonForAdmission` varchar(255) NOT NULL,
  `AdvanceAmount` int NOT NULL DEFAULT '0',
  `DueAmount` int NOT NULL DEFAULT '0',
  `TotalAmount` int NOT NULL DEFAULT '0',
  `TotalExpense` int NOT NULL DEFAULT '0',
  `TotalAdvance` int NOT NULL DEFAULT '0',
  `Currency` varchar(255) NOT NULL,
  `PaymentOption` varchar(255) NOT NULL,
  `PaymentStatus` varchar(255) NOT NULL,
  `PaymentDate` varchar(255) NOT NULL,
  `AdmissionType` varchar(255) NOT NULL,
  `PaymentType` varchar(255) DEFAULT NULL,
  `PreviousHospitalizations` varchar(255) NOT NULL,
  `ChronicConditions` varchar(255) NOT NULL,
  `TreatmentPlan` longtext,
  `Medications` varchar(255) NOT NULL,
  `RoomNumber` int NOT NULL,
  `BedNumber` int NOT NULL,
  `BedType` varchar(255) NOT NULL,
  `CheckInTime` varchar(255) NOT NULL,
  `CheckOutTime` varchar(255) NOT NULL,
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
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hospitaladmissions`
--

LOCK TABLES `hospitaladmissions` WRITE;
/*!40000 ALTER TABLE `hospitaladmissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `hospitaladmissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hospitalmains`
--

DROP TABLE IF EXISTS `hospitalmains`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hospitalmains` (
  `id` int NOT NULL AUTO_INCREMENT,
  `hospitalName` varchar(255) DEFAULT NULL,
  `hospitalURL` varchar(255) DEFAULT NULL,
  `HospitalGUID` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `databaseName` varchar(255) DEFAULT NULL,
  `allowed_users` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `hospitalName` (`hospitalName`),
  UNIQUE KEY `HospitalGUID` (`HospitalGUID`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `databaseName` (`databaseName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hospitalmains`
--

LOCK TABLES `hospitalmains` WRITE;
/*!40000 ALTER TABLE `hospitalmains` DISABLE KEYS */;
/*!40000 ALTER TABLE `hospitalmains` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hospitalrooms`
--

DROP TABLE IF EXISTS `hospitalrooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hospitalrooms` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hospitalrooms`
--

LOCK TABLES `hospitalrooms` WRITE;
/*!40000 ALTER TABLE `hospitalrooms` DISABLE KEYS */;
/*!40000 ALTER TABLE `hospitalrooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hospitals`
--

DROP TABLE IF EXISTS `hospitals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hospitals` (
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
  `countryCode` varchar(255) DEFAULT NULL,
  `HospitalUserName` varchar(255) DEFAULT NULL,
  `HospitalID_MainDatabase` int DEFAULT NULL,
  `HospitalGUID` varchar(255) DEFAULT NULL,
  `baseCurrency` varchar(255) DEFAULT 'INR',
  `baseCurrencyStatus` varchar(255) DEFAULT 'default',
  `OptionalCurrency` varchar(255) DEFAULT NULL,
  `securityDeposit` int DEFAULT NULL,
  `patientRegistrationFee` int DEFAULT NULL,
  `patientRegistrationCurrency` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `HospitalUserName` (`HospitalUserName`),
  UNIQUE KEY `HospitalID_MainDatabase` (`HospitalID_MainDatabase`),
  UNIQUE KEY `HospitalGUID` (`HospitalGUID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hospitals`
--

LOCK TABLES `hospitals` WRITE;
/*!40000 ALTER TABLE `hospitals` DISABLE KEYS */;
INSERT INTO `hospitals` VALUES (1,'BGSHospital','NA','NA','0','NA','Madhukumarap@gmail.com','Madhukumarap@gmail.com',8152974486,NULL,NULL,NULL,'Madhukumar',NULL,NULL,'INR','default',NULL,NULL,NULL,NULL,'2025-08-14 14:58:44','2025-08-14 14:58:44');
/*!40000 ALTER TABLE `hospitals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventries`
--

DROP TABLE IF EXISTS `inventries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `inventries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `SKU` varchar(255) DEFAULT NULL,
  `itemName` varchar(255) DEFAULT NULL,
  `composition` longtext,
  `description` longtext,
  `unitPrice` float(5,2) DEFAULT NULL,
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
  `Currency` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventries`
--

LOCK TABLES `inventries` WRITE;
/*!40000 ALTER TABLE `inventries` DISABLE KEYS */;
/*!40000 ALTER TABLE `inventries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `labcategorylists`
--

DROP TABLE IF EXISTS `labcategorylists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `labcategorylists` (
  `id` int NOT NULL AUTO_INCREMENT,
  `CategoryName` varchar(255) DEFAULT NULL,
  `LabCode` varchar(255) NOT NULL,
  `Status` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `labcategorylists`
--

LOCK TABLES `labcategorylists` WRITE;
/*!40000 ALTER TABLE `labcategorylists` DISABLE KEYS */;
/*!40000 ALTER TABLE `labcategorylists` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lipidprofilemodels`
--

DROP TABLE IF EXISTS `lipidprofilemodels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `lipidprofilemodels` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lipidprofilemodels`
--

LOCK TABLES `lipidprofilemodels` WRITE;
/*!40000 ALTER TABLE `lipidprofilemodels` DISABLE KEYS */;
/*!40000 ALTER TABLE `lipidprofilemodels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medicationdays`
--

DROP TABLE IF EXISTS `medicationdays`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `medicationdays` (
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
  CONSTRAINT `medicationdays_ibfk_1` FOREIGN KEY (`PrescriptionId`) REFERENCES `patientprecriptions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medicationdays`
--

LOCK TABLES `medicationdays` WRITE;
/*!40000 ALTER TABLE `medicationdays` DISABLE KEYS */;
/*!40000 ALTER TABLE `medicationdays` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medicineadministrationreports`
--

DROP TABLE IF EXISTS `medicineadministrationreports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `medicineadministrationreports` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medicineadministrationreports`
--

LOCK TABLES `medicineadministrationreports` WRITE;
/*!40000 ALTER TABLE `medicineadministrationreports` DISABLE KEYS */;
/*!40000 ALTER TABLE `medicineadministrationreports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medicines`
--

DROP TABLE IF EXISTS `medicines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `medicines` (
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
  CONSTRAINT `medicines_ibfk_1` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medicines`
--

LOCK TABLES `medicines` WRITE;
/*!40000 ALTER TABLE `medicines` DISABLE KEYS */;
/*!40000 ALTER TABLE `medicines` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nurses`
--

DROP TABLE IF EXISTS `nurses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `nurses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) DEFAULT NULL,
  `FirstName` varchar(255) NOT NULL,
  `MiddleName` varchar(255) DEFAULT NULL,
  `LastName` varchar(255) NOT NULL,
  `Address` varchar(255) NOT NULL,
  `phoneNo` bigint NOT NULL,
  `countryCode` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nurses`
--

LOCK TABLES `nurses` WRITE;
/*!40000 ALTER TABLE `nurses` DISABLE KEYS */;
/*!40000 ALTER TABLE `nurses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `otnameandnumbers`
--

DROP TABLE IF EXISTS `otnameandnumbers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `otnameandnumbers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `OTName` varchar(255) DEFAULT NULL,
  `OTNumber` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `otnameandnumbers`
--

LOCK TABLES `otnameandnumbers` WRITE;
/*!40000 ALTER TABLE `otnameandnumbers` DISABLE KEYS */;
/*!40000 ALTER TABLE `otnameandnumbers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `otschedulepatients`
--

DROP TABLE IF EXISTS `otschedulepatients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `otschedulepatients` (
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
  `admissionID` int DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `otschedulepatients`
--

LOCK TABLES `otschedulepatients` WRITE;
/*!40000 ALTER TABLE `otschedulepatients` DISABLE KEYS */;
/*!40000 ALTER TABLE `otschedulepatients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pathologisttestbookingappointments`
--

DROP TABLE IF EXISTS `pathologisttestbookingappointments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pathologisttestbookingappointments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `patientId` int NOT NULL,
  `PatientName` varchar(255) NOT NULL,
  `PatientPhone` bigint NOT NULL,
  `testManagementID` varchar(255) NOT NULL,
  `remarks` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pathologisttestbookingappointments`
--

LOCK TABLES `pathologisttestbookingappointments` WRITE;
/*!40000 ALTER TABLE `pathologisttestbookingappointments` DISABLE KEYS */;
/*!40000 ALTER TABLE `pathologisttestbookingappointments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pathologytestmanages`
--

DROP TABLE IF EXISTS `pathologytestmanages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pathologytestmanages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `testName` varchar(255) NOT NULL,
  `LabCategoryName` varchar(255) NOT NULL,
  `LabCategoryNameID` int NOT NULL,
  `SpecimenName` varchar(255) NOT NULL,
  `SpecimenNameID` int NOT NULL,
  `code` varchar(255) NOT NULL,
  `description` text,
  `category` varchar(255) NOT NULL,
  `testPrice` int NOT NULL,
  `Currency` varchar(255) NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `testName` (`testName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pathologytestmanages`
--

LOCK TABLES `pathologytestmanages` WRITE;
/*!40000 ALTER TABLE `pathologytestmanages` DISABLE KEYS */;
/*!40000 ALTER TABLE `pathologytestmanages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pathologytestreferrals`
--

DROP TABLE IF EXISTS `pathologytestreferrals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pathologytestreferrals` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pathologytestreferrals`
--

LOCK TABLES `pathologytestreferrals` WRITE;
/*!40000 ALTER TABLE `pathologytestreferrals` DISABLE KEYS */;
/*!40000 ALTER TABLE `pathologytestreferrals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pathologytests`
--

DROP TABLE IF EXISTS `pathologytests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pathologytests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `PatientName` varchar(255) NOT NULL,
  `PatientID` int NOT NULL,
  `PaidAmount` decimal(10,2) NOT NULL,
  `CorporateID` varchar(255) DEFAULT NULL,
  `doctorId` int DEFAULT NULL,
  `PaymentStatus` varchar(255) NOT NULL,
  `PaymentDate` date DEFAULT NULL,
  `DoctorPhone` bigint DEFAULT NULL,
  `DoctorEmail` varchar(255) DEFAULT NULL,
  `TotalFees` decimal(10,2) DEFAULT NULL,
  `Currency` varchar(255) DEFAULT NULL,
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
  `testFees` decimal(10,2) NOT NULL,
  `results` longtext,
  `Authorization` varchar(255) DEFAULT 'Pending',
  `selectedPackageID` int DEFAULT NULL,
  `PackageName` varchar(255) DEFAULT 'NA',
  `PackagePrice` int DEFAULT '0',
  `feedback` longtext,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `admissionID` int DEFAULT '0',
  `procedure` varchar(255) DEFAULT 'Pathology',
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pathologytests`
--

LOCK TABLES `pathologytests` WRITE;
/*!40000 ALTER TABLE `pathologytests` DISABLE KEYS */;
/*!40000 ALTER TABLE `pathologytests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `patientprecriptions`
--

DROP TABLE IF EXISTS `patientprecriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `patientprecriptions` (
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
  `bloodPressure` varchar(255) DEFAULT NULL,
  `respiratoryRate` varchar(255) DEFAULT NULL,
  `heartRate` varchar(255) DEFAULT NULL,
  `temperature` varchar(255) DEFAULT NULL,
  `familyDetails` varchar(255) DEFAULT NULL,
  `revisitDate` varchar(255) DEFAULT NULL,
  `revisit` varchar(255) DEFAULT NULL,
  `emailSentStatus` varchar(255) DEFAULT NULL,
  `emailSentDetails` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `patient_Id` (`patient_Id`),
  CONSTRAINT `patientprecriptions_ibfk_1` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patientprecriptions`
--

LOCK TABLES `patientprecriptions` WRITE;
/*!40000 ALTER TABLE `patientprecriptions` DISABLE KEYS */;
/*!40000 ALTER TABLE `patientprecriptions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `patientregistrations`
--

DROP TABLE IF EXISTS `patientregistrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `patientregistrations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `mr` varchar(255) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `Currency` varchar(255) NOT NULL,
  `middleName` varchar(255) DEFAULT NULL,
  `lastName` varchar(255) NOT NULL,
  `PackageName` varchar(255) DEFAULT NULL,
  `PackageID` int DEFAULT NULL,
  `countryCode` varchar(4) DEFAULT NULL,
  `phoneNumberP` bigint NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `age` int NOT NULL,
  `gender` varchar(255) NOT NULL,
  `height` int DEFAULT NULL,
  `weight` int DEFAULT NULL,
  `hospitalId` int DEFAULT NULL,
  `PatientAadharID` varchar(13) DEFAULT NULL,
  `HealthNationalID` varchar(17) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `pincode` varchar(6) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `CompanyName` varchar(255) DEFAULT NULL,
  `CompanyID` int DEFAULT NULL,
  `CorporateID` varchar(255) DEFAULT NULL,
  `registrationFees` int DEFAULT NULL,
  `paymentStatus` enum('Paid','Not-Paid') DEFAULT NULL,
  `paymentDate` datetime DEFAULT NULL,
  `maritalStatus` varchar(255) DEFAULT NULL,
  `bloodGroup` varchar(255) DEFAULT NULL,
  `ageOption` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patientregistrations`
--

LOCK TABLES `patientregistrations` WRITE;
/*!40000 ALTER TABLE `patientregistrations` DISABLE KEYS */;
/*!40000 ALTER TABLE `patientregistrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `payments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `paymentID` varchar(255) DEFAULT NULL,
  `paymentDate` varchar(255) DEFAULT NULL,
  `admissionID` int DEFAULT NULL,
  `hospitalID` int DEFAULT NULL,
  `amount` int DEFAULT NULL,
  `currency` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pharmacists`
--

DROP TABLE IF EXISTS `pharmacists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pharmacists` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) DEFAULT NULL,
  `FirstName` varchar(255) NOT NULL,
  `MiddleName` varchar(255) DEFAULT NULL,
  `LastName` varchar(255) NOT NULL,
  `Address` varchar(255) NOT NULL,
  `phoneNo` bigint NOT NULL,
  `countryCode` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pharmacists`
--

LOCK TABLES `pharmacists` WRITE;
/*!40000 ALTER TABLE `pharmacists` DISABLE KEYS */;
/*!40000 ALTER TABLE `pharmacists` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plateletcounttestmodels`
--

DROP TABLE IF EXISTS `plateletcounttestmodels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `plateletcounttestmodels` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plateletcounttestmodels`
--

LOCK TABLES `plateletcounttestmodels` WRITE;
/*!40000 ALTER TABLE `plateletcounttestmodels` DISABLE KEYS */;
/*!40000 ALTER TABLE `plateletcounttestmodels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quantityoutreports`
--

DROP TABLE IF EXISTS `quantityoutreports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `quantityoutreports` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ItemName` varchar(255) NOT NULL,
  `BatchNumber` varchar(255) NOT NULL,
  `ExpiryDate` datetime NOT NULL,
  `UnitPrice` float(5,2) DEFAULT NULL,
  `Quantity` int NOT NULL,
  `dateOut` date DEFAULT NULL,
  `AverageMonthlyQuantityOut` int DEFAULT NULL,
  `AverageWeeklyQuantityOut` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quantityoutreports`
--

LOCK TABLES `quantityoutreports` WRITE;
/*!40000 ALTER TABLE `quantityoutreports` DISABLE KEYS */;
/*!40000 ALTER TABLE `quantityoutreports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'user','2025-08-14 14:58:46','2025-08-14 14:58:46'),(2,'doctor','2025-08-14 14:58:46','2025-08-14 14:58:46'),(3,'pharmacist','2025-08-14 14:58:46','2025-08-14 14:58:46'),(4,'patient','2025-08-14 14:58:46','2025-08-14 14:58:46'),(5,'nurse','2025-08-14 14:58:46','2025-08-14 14:58:46'),(6,'admin','2025-08-14 14:58:46','2025-08-14 14:58:46'),(7,'pathologistAdmin','2025-08-14 14:58:46','2025-08-14 14:58:46'),(8,'diagnosticTechnician','2025-08-14 14:58:46','2025-08-14 14:58:46'),(9,'Receptionist','2025-08-14 14:58:46','2025-08-14 14:58:46'),(10,'admin','2025-08-14 14:58:46','2025-08-14 14:58:46');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `samplecollections`
--

DROP TABLE IF EXISTS `samplecollections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `samplecollections` (
  `id` int NOT NULL AUTO_INCREMENT,
  `PatientName` varchar(255) NOT NULL,
  `PatientID` int NOT NULL,
  `PathologyTestBookingId` int NOT NULL,
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
  PRIMARY KEY (`id`),
  UNIQUE KEY `BarcodeValuesAllSelectedTest` (`BarcodeValuesAllSelectedTest`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `samplecollections`
--

LOCK TABLES `samplecollections` WRITE;
/*!40000 ALTER TABLE `samplecollections` DISABLE KEYS */;
/*!40000 ALTER TABLE `samplecollections` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `samplehomecollections`
--

DROP TABLE IF EXISTS `samplehomecollections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `samplehomecollections` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `samplehomecollections`
--

LOCK TABLES `samplehomecollections` WRITE;
/*!40000 ALTER TABLE `samplehomecollections` DISABLE KEYS */;
/*!40000 ALTER TABLE `samplehomecollections` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `selectedtestforhealthpackagemodels`
--

DROP TABLE IF EXISTS `selectedtestforhealthpackagemodels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `selectedtestforhealthpackagemodels` (
  `id` int NOT NULL AUTO_INCREMENT,
  `TestName` varchar(255) NOT NULL,
  `testType` varchar(255) NOT NULL,
  `category` varchar(255) NOT NULL,
  `TestId` int NOT NULL,
  `TestPackageID` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `selectedtestforhealthpackagemodels`
--

LOCK TABLES `selectedtestforhealthpackagemodels` WRITE;
/*!40000 ALTER TABLE `selectedtestforhealthpackagemodels` DISABLE KEYS */;
/*!40000 ALTER TABLE `selectedtestforhealthpackagemodels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `selectedtestforpackagemodels`
--

DROP TABLE IF EXISTS `selectedtestforpackagemodels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `selectedtestforpackagemodels` (
  `id` int NOT NULL AUTO_INCREMENT,
  `TestName` varchar(255) NOT NULL,
  `testType` varchar(255) NOT NULL,
  `category` varchar(255) NOT NULL,
  `TestId` int NOT NULL,
  `TestPackageID` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `TestPackageID` (`TestPackageID`),
  CONSTRAINT `selectedtestforpackagemodels_ibfk_1` FOREIGN KEY (`TestPackageID`) REFERENCES `testpackagemodels` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `selectedtestforpackagemodels`
--

LOCK TABLES `selectedtestforpackagemodels` WRITE;
/*!40000 ALTER TABLE `selectedtestforpackagemodels` DISABLE KEYS */;
/*!40000 ALTER TABLE `selectedtestforpackagemodels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `specimenlists`
--

DROP TABLE IF EXISTS `specimenlists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `specimenlists` (
  `id` int NOT NULL AUTO_INCREMENT,
  `SpecimenName` varchar(255) DEFAULT NULL,
  `SpecimenCode` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `specimenlists`
--

LOCK TABLES `specimenlists` WRITE;
/*!40000 ALTER TABLE `specimenlists` DISABLE KEYS */;
/*!40000 ALTER TABLE `specimenlists` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `statusofdiagnostictestsfortestbookings`
--

DROP TABLE IF EXISTS `statusofdiagnostictestsfortestbookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `statusofdiagnostictestsfortestbookings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `testName` varchar(255) NOT NULL,
  `TestStatus` varchar(255) NOT NULL,
  `PatientID` int NOT NULL,
  `DiagnosticTestBookingId` int NOT NULL,
  `TestID` int NOT NULL,
  `TestRegisteredDateTime` datetime DEFAULT NULL,
  `TestCompletedDateTime` datetime DEFAULT NULL,
  `admissionID` int DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `statusofdiagnostictestsfortestbookings`
--

LOCK TABLES `statusofdiagnostictestsfortestbookings` WRITE;
/*!40000 ALTER TABLE `statusofdiagnostictestsfortestbookings` DISABLE KEYS */;
/*!40000 ALTER TABLE `statusofdiagnostictestsfortestbookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `statusofpathologytestsfortestbookings`
--

DROP TABLE IF EXISTS `statusofpathologytestsfortestbookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `statusofpathologytestsfortestbookings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `testName` varchar(255) NOT NULL,
  `TestStatus` varchar(255) NOT NULL,
  `PatientID` int NOT NULL,
  `PathologyTestBookingId` int NOT NULL,
  `TestID` int NOT NULL,
  `TestRegisteredDateTime` datetime DEFAULT NULL,
  `TestSamplecollectedDateTime` datetime DEFAULT NULL,
  `TestCompletedDateTime` datetime DEFAULT NULL,
  `admissionID` int DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `statusofpathologytestsfortestbookings`
--

LOCK TABLES `statusofpathologytestsfortestbookings` WRITE;
/*!40000 ALTER TABLE `statusofpathologytestsfortestbookings` DISABLE KEYS */;
/*!40000 ALTER TABLE `statusofpathologytestsfortestbookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t3t4tshpathologytests`
--

DROP TABLE IF EXISTS `t3t4tshpathologytests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t3t4tshpathologytests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `PatientID` int NOT NULL,
  `TestManagementID` int NOT NULL,
  `PatientTestBookingID` int NOT NULL,
  `T3_Tri_iodothyronine` varchar(255) NOT NULL,
  `T4_Thyroxine` varchar(255) NOT NULL,
  `TSH_Thyroid_Stimulating_Hormone` varchar(255) NOT NULL,
  `resultDate` varchar(255) DEFAULT NULL,
  `Remarks` longtext,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t3t4tshpathologytests`
--

LOCK TABLES `t3t4tshpathologytests` WRITE;
/*!40000 ALTER TABLE `t3t4tshpathologytests` DISABLE KEYS */;
/*!40000 ALTER TABLE `t3t4tshpathologytests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `testpackagemodels`
--

DROP TABLE IF EXISTS `testpackagemodels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `testpackagemodels` (
  `id` int NOT NULL AUTO_INCREMENT,
  `packageName` varchar(255) NOT NULL,
  `Currency` varchar(255) NOT NULL,
  `MRPOfPackage` int NOT NULL,
  `discount` int DEFAULT NULL,
  `finalPrice` decimal(10,2) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `testpackagemodels`
--

LOCK TABLES `testpackagemodels` WRITE;
/*!40000 ALTER TABLE `testpackagemodels` DISABLE KEYS */;
/*!40000 ALTER TABLE `testpackagemodels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_roles`
--

DROP TABLE IF EXISTS `user_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_roles` (
  `roleId` int NOT NULL,
  `userId` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`roleId`,`userId`),
  UNIQUE KEY `user_roles_userId_roleId_unique` (`roleId`,`userId`),
  UNIQUE KEY `user_roles_role_id_user_id` (`roleId`,`userId`),
  KEY `userId` (`userId`),
  CONSTRAINT `user_roles_ibfk_1` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_roles_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_roles`
--

LOCK TABLES `user_roles` WRITE;
/*!40000 ALTER TABLE `user_roles` DISABLE KEYS */;
INSERT INTO `user_roles` VALUES (10,1,'2025-08-14 14:58:47','2025-08-14 14:58:47');
/*!40000 ALTER TABLE `user_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `hospitalId` int DEFAULT '0',
  `phoneNumber` bigint DEFAULT NULL,
  `countryCode` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `language` varchar(255) DEFAULT 'en',
  `status` varchar(255) DEFAULT 'active',
  `loggedInStatus` varchar(255) DEFAULT NULL,
  `overlimit` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `phoneNumber` (`phoneNumber`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Hospital Administrator','BGSHospital','admin@example.com',0,1234567890,NULL,'$2a$08$.VX6b.lWVtAi1545kxQ8rOv1ycigy59wnH.G7M729UiSi8vt0Xnae','en','active','LoggedIn',0,'2025-08-14 14:58:47','2025-08-14 15:00:17');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vendors`
--

DROP TABLE IF EXISTS `vendors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vendors` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendors`
--

LOCK TABLES `vendors` WRITE;
/*!40000 ALTER TABLE `vendors` DISABLE KEYS */;
/*!40000 ALTER TABLE `vendors` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-14 22:57:43
