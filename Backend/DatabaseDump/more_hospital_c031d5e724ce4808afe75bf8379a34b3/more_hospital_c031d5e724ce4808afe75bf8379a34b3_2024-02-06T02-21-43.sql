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
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

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
) ENGINE = InnoDB AUTO_INCREMENT = 55 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

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
) ENGINE = InnoDB AUTO_INCREMENT = 55 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: bedshospitalrooms
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `bedshospitalrooms` (
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
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

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
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

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
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

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
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

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
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

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
  UNIQUE KEY `vaccinationRegNo_7` (`vaccinationRegNo`)
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
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: diagnostics_packages
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `diagnostics_packages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `packageName` varchar(255) NOT NULL,
  `Currency` varchar(255) DEFAULT NULL,
  `MRPOfPackage` int NOT NULL,
  `discount` int DEFAULT NULL,
  `finalPrice` decimal(10, 2) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

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
  `CorporateID` varchar(255) DEFAULT NULL,
  `status` varchar(255) NOT NULL,
  `lapName` varchar(255) DEFAULT NULL,
  `selectedTests` varchar(255) NOT NULL,
  `remarks` text,
  `instrumentsUsed` text,
  `testFees` decimal(10, 2) NOT NULL,
  `TotalFees` decimal(10, 2) DEFAULT NULL,
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
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: diagnostictestlists
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `diagnostictestlists` (
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
  UNIQUE KEY `code` (`code`),
  UNIQUE KEY `code_2` (`code`),
  UNIQUE KEY `code_3` (`code`),
  UNIQUE KEY `code_4` (`code`),
  UNIQUE KEY `code_5` (`code`),
  UNIQUE KEY `code_6` (`code`),
  UNIQUE KEY `code_7` (`code`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

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
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

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
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

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
  `EachMedicineCurrency` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `DispenseTableID` (`DispenseTableID`),
  CONSTRAINT `dispensedmedicines_ibfk_1` FOREIGN KEY (`DispenseTableID`) REFERENCES `dispensedreports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dispensedmedicines_ibfk_2` FOREIGN KEY (`DispenseTableID`) REFERENCES `dispensedreports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dispensedmedicines_ibfk_3` FOREIGN KEY (`DispenseTableID`) REFERENCES `dispensedreports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dispensedmedicines_ibfk_4` FOREIGN KEY (`DispenseTableID`) REFERENCES `dispensedreports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dispensedmedicines_ibfk_5` FOREIGN KEY (`DispenseTableID`) REFERENCES `dispensedreports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dispensedmedicines_ibfk_6` FOREIGN KEY (`DispenseTableID`) REFERENCES `dispensedreports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dispensedmedicines_ibfk_7` FOREIGN KEY (`DispenseTableID`) REFERENCES `dispensedreports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

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
  `TotalFees` decimal(10, 2) DEFAULT NULL,
  `Currency` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

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
  `phoneNo` bigint DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `signatureImage` longblob,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `email_2` (`email`),
  UNIQUE KEY `email_3` (`email`),
  UNIQUE KEY `email_4` (`email`),
  UNIQUE KEY `email_5` (`email`),
  UNIQUE KEY `email_6` (`email`),
  UNIQUE KEY `email_7` (`email`)
) ENGINE = InnoDB AUTO_INCREMENT = 6 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: doctorsappointments
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `doctorsappointments` (
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
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

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
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: healthtestpackagemodels
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `healthtestpackagemodels` (
  `id` int NOT NULL AUTO_INCREMENT,
  `packageName` varchar(255) NOT NULL,
  `MRPOfPackage` int NOT NULL,
  `discount` int DEFAULT NULL,
  `Currency` varchar(255) NOT NULL,
  `finalPrice` decimal(10, 2) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: hospitaladminregistrations
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `hospitaladminregistrations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) DEFAULT NULL,
  `hospitalId` int DEFAULT '0',
  `firstName` varchar(255) NOT NULL,
  `middleName` varchar(255) DEFAULT NULL,
  `lastName` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `phoneNo` bigint NOT NULL,
  `email` varchar(255) NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

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
  `Currency` varchar(255) NOT NULL,
  `PaymentOption` varchar(255) NOT NULL,
  `PaymentStatus` varchar(255) NOT NULL,
  `PaymentDate` varchar(255) NOT NULL,
  `AdmissionType` varchar(255) NOT NULL,
  `PreviousHospitalizations` varchar(255) NOT NULL,
  `ChronicConditions` varchar(255) NOT NULL,
  `TreatmentPlan` longtext NOT NULL,
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
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

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
  UNIQUE KEY `databaseName_7` (`databaseName`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

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
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

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
  `HospitalUserName` varchar(255) DEFAULT NULL,
  `HospitalID_MainDatabase` int DEFAULT NULL,
  `HospitalGUID` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
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
  UNIQUE KEY `HospitalGUID_7` (`HospitalGUID`)
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
  `Currency` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
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
) ENGINE = InnoDB AUTO_INCREMENT = 3 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

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
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

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
  CONSTRAINT `medicationdays_ibfk_2` FOREIGN KEY (`PrescriptionId`) REFERENCES `patientprecriptions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `medicationdays_ibfk_3` FOREIGN KEY (`PrescriptionId`) REFERENCES `patientprecriptions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `medicationdays_ibfk_4` FOREIGN KEY (`PrescriptionId`) REFERENCES `patientprecriptions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `medicationdays_ibfk_5` FOREIGN KEY (`PrescriptionId`) REFERENCES `patientprecriptions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `medicationdays_ibfk_6` FOREIGN KEY (`PrescriptionId`) REFERENCES `patientprecriptions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `medicationdays_ibfk_7` FOREIGN KEY (`PrescriptionId`) REFERENCES `patientprecriptions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

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
  CONSTRAINT `medicines_ibfk_2` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_3` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_4` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_5` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_6` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE,
  CONSTRAINT `medicines_ibfk_7` FOREIGN KEY (`prescription_Id`) REFERENCES `patientprecriptions` (`id`) ON DELETE
  SET
  NULL ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 4 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

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
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

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
  `admissionID` int DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

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
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

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
  `PatientID` int NOT NULL,
  `CorporateID` varchar(255) DEFAULT NULL,
  `doctorId` int DEFAULT NULL,
  `PaymentStatus` varchar(255) NOT NULL,
  `PaymentDate` date DEFAULT NULL,
  `DoctorPhone` bigint DEFAULT NULL,
  `DoctorEmail` varchar(255) DEFAULT NULL,
  `TotalFees` decimal(10, 2) DEFAULT NULL,
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
  `testFees` decimal(10, 2) NOT NULL,
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
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

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
  `bloodPressure` varchar(255) DEFAULT NULL,
  `respiratoryRate` varchar(255) DEFAULT NULL,
  `heartRate` varchar(255) DEFAULT NULL,
  `temperature` varchar(255) DEFAULT NULL,
  `familyDetails` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `revisitDate` varchar(255) DEFAULT NULL,
  `emailSentStatus` varchar(255) DEFAULT NULL,
  `revisit` varchar(255) DEFAULT NULL,
  `emailSentDetails` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `patient_Id` (`patient_Id`),
  CONSTRAINT `patientprecriptions_ibfk_1` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_2` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_3` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_4` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_5` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_6` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `patientprecriptions_ibfk_7` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 4 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: patientregistrations
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `patientregistrations` (
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
  `paymentStatus` enum('Paid', 'Not-Paid') DEFAULT NULL,
  `paymentDate` datetime DEFAULT NULL,
  `maritalStatus` varchar(255) DEFAULT NULL,
  `bloodGroup` varchar(255) DEFAULT NULL,
  `ageOption` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

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
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

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
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

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
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: roles
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 12 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: samplecollections
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `samplecollections` (
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
  UNIQUE KEY `BarcodeValuesAllSelectedTest` (`BarcodeValuesAllSelectedTest`),
  UNIQUE KEY `BarcodeValuesAllSelectedTest_2` (`BarcodeValuesAllSelectedTest`),
  UNIQUE KEY `BarcodeValuesAllSelectedTest_3` (`BarcodeValuesAllSelectedTest`),
  UNIQUE KEY `BarcodeValuesAllSelectedTest_4` (`BarcodeValuesAllSelectedTest`),
  UNIQUE KEY `BarcodeValuesAllSelectedTest_5` (`BarcodeValuesAllSelectedTest`),
  UNIQUE KEY `BarcodeValuesAllSelectedTest_6` (`BarcodeValuesAllSelectedTest`),
  UNIQUE KEY `BarcodeValuesAllSelectedTest_7` (`BarcodeValuesAllSelectedTest`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

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
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

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
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: selectedtestforpackagemodels
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `selectedtestforpackagemodels` (
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
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

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
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

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
  `admissionID` int DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

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
  `admissionID` int DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

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
  `resultDate` varchar(255) DEFAULT NULL,
  `Remarks` longtext,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: testpackagemodels
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `testpackagemodels` (
  `id` int NOT NULL AUTO_INCREMENT,
  `packageName` varchar(255) NOT NULL,
  `Currency` varchar(255) NOT NULL,
  `MRPOfPackage` int NOT NULL,
  `discount` int DEFAULT NULL,
  `finalPrice` decimal(10, 2) NOT NULL,
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
  `hospitalId` int DEFAULT '0',
  `phoneNumber` bigint DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `language` varchar(255) DEFAULT 'en',
  `status` varchar(255) DEFAULT 'active',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `loggedInStatus` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `phoneNumber` (`phoneNumber`),
  UNIQUE KEY `username_2` (`username`),
  UNIQUE KEY `email_2` (`email`),
  UNIQUE KEY `phoneNumber_2` (`phoneNumber`),
  UNIQUE KEY `username_3` (`username`),
  UNIQUE KEY `email_3` (`email`),
  UNIQUE KEY `phoneNumber_3` (`phoneNumber`),
  UNIQUE KEY `username_4` (`username`),
  UNIQUE KEY `email_4` (`email`),
  UNIQUE KEY `phoneNumber_4` (`phoneNumber`),
  UNIQUE KEY `username_5` (`username`),
  UNIQUE KEY `email_5` (`email`),
  UNIQUE KEY `phoneNumber_5` (`phoneNumber`),
  UNIQUE KEY `username_6` (`username`),
  UNIQUE KEY `email_6` (`email`),
  UNIQUE KEY `phoneNumber_6` (`phoneNumber`),
  UNIQUE KEY `username_7` (`username`),
  UNIQUE KEY `email_7` (`email`),
  UNIQUE KEY `phoneNumber_7` (`phoneNumber`)
) ENGINE = InnoDB AUTO_INCREMENT = 290 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

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
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: allsubstitutes
# ------------------------------------------------------------


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
    3,
    'daily',
    '*',
    '10:10',
    '2024-01-29 14:41:20',
    '2024-01-29 14:41:20'
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
    4,
    'weekly',
    '1',
    '10:10',
    '2024-01-29 14:43:19',
    '2024-01-29 14:43:19'
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
    5,
    'daily',
    '*',
    '20:37',
    '2024-01-29 14:56:18',
    '2024-01-29 14:56:18'
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
    6,
    'daily',
    '*',
    '20:49',
    '2024-01-29 15:18:28',
    '2024-01-29 15:18:28'
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
    7,
    'daily',
    '*',
    '20:50',
    '2024-01-29 15:20:23',
    '2024-01-29 15:20:23'
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
    8,
    'daily',
    '*',
    '20:53',
    '2024-01-29 15:23:07',
    '2024-01-29 15:23:07'
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
    'weekly',
    '0',
    '20:53',
    '2024-01-29 15:27:43',
    '2024-01-29 15:27:43'
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
    'weekly',
    '1',
    '20:53',
    '2024-01-29 15:33:29',
    '2024-01-29 15:33:29'
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
    'weekly',
    '2',
    '20:53',
    '2024-01-29 15:33:58',
    '2024-01-29 15:33:58'
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
    'weekly',
    '1',
    '20:53',
    '2024-01-29 15:34:16',
    '2024-01-29 15:34:16'
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
    'weekly',
    '1',
    '21:09',
    '2024-01-29 15:38:57',
    '2024-01-29 15:38:57'
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
    'weekly',
    '1',
    '21:11',
    '2024-01-29 15:40:30',
    '2024-01-29 15:40:30'
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
    'daily',
    '*',
    '22:00',
    '2024-01-29 16:30:51',
    '2024-01-29 16:30:51'
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
    'daily',
    '*',
    '22:01',
    '2024-01-29 16:30:57',
    '2024-01-29 16:30:57'
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
    '*',
    '20:04',
    '2024-01-29 16:33:55',
    '2024-01-29 16:33:55'
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
    '*',
    '20:06',
    '2024-01-29 16:35:33',
    '2024-01-29 16:35:33'
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
    '*',
    '20:07',
    '2024-01-29 16:36:58',
    '2024-01-29 16:36:58'
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
    NULL,
    '*',
    '22:14',
    '2024-01-29 16:43:41',
    '2024-01-29 16:43:41'
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
    '*',
    '20:15',
    '2024-01-29 16:44:36',
    '2024-01-29 16:44:36'
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
    22,
    'daily',
    '*',
    '20:17',
    '2024-01-29 16:45:30',
    '2024-01-29 16:45:30'
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
    23,
    'daily',
    '*',
    '20:20',
    '2024-01-29 16:49:01',
    '2024-01-29 16:49:01'
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
    24,
    NULL,
    '*',
    NULL,
    '2024-01-29 17:04:05',
    '2024-01-29 17:04:05'
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
    25,
    NULL,
    '*',
    NULL,
    '2024-01-29 17:04:24',
    '2024-01-29 17:04:24'
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
    26,
    NULL,
    '*',
    NULL,
    '2024-01-29 17:04:27',
    '2024-01-29 17:04:27'
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
    27,
    NULL,
    '*',
    NULL,
    '2024-01-29 17:04:38',
    '2024-01-29 17:04:38'
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
    28,
    'daily',
    '*',
    '10:10',
    '2024-01-29 17:06:28',
    '2024-01-29 17:06:28'
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
    29,
    'weekly',
    '*',
    '10:10',
    '2024-01-29 17:07:16',
    '2024-01-29 17:07:16'
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
    30,
    'weekly',
    '*',
    '10:10',
    '2024-01-29 17:07:19',
    '2024-01-29 17:07:19'
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
    31,
    'weekly',
    '*',
    '10:10',
    '2024-01-29 17:07:33',
    '2024-01-29 17:07:33'
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
    32,
    'weekly',
    '*',
    '10:10',
    '2024-01-29 17:07:38',
    '2024-01-29 17:07:38'
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
    33,
    'daily',
    '',
    '10:10',
    '2024-01-29 17:08:02',
    '2024-01-29 17:08:02'
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
    34,
    'weekly',
    '',
    '10:10',
    '2024-01-29 17:08:07',
    '2024-01-29 17:08:07'
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
    35,
    'weekly',
    '',
    '10:10',
    '2024-01-29 17:08:11',
    '2024-01-29 17:08:11'
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
    36,
    'daily',
    '',
    '10:10',
    '2024-01-29 17:08:31',
    '2024-01-29 17:08:31'
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
    37,
    'weekly',
    '1',
    '10:10',
    '2024-01-29 17:08:41',
    '2024-01-29 17:08:41'
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
    38,
    'daily',
    '',
    '22:52',
    '2024-01-29 17:21:27',
    '2024-01-29 17:21:27'
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
    39,
    'weekly',
    '1',
    '10:10',
    '2024-01-29 17:24:02',
    '2024-01-29 17:24:02'
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
    40,
    'daily',
    '',
    '21:55',
    '2024-01-31 16:24:40',
    '2024-01-31 16:24:40'
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
    41,
    'daily',
    '',
    '21:56',
    '2024-01-31 16:26:04',
    '2024-01-31 16:26:04'
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
    42,
    'daily',
    '',
    '21:57',
    '2024-01-31 16:26:37',
    '2024-01-31 16:26:37'
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
    43,
    'daily',
    '',
    '22:00',
    '2024-01-31 16:29:23',
    '2024-01-31 16:29:23'
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
    44,
    'daily',
    '',
    '22:02',
    '2024-01-31 16:31:16',
    '2024-01-31 16:31:16'
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
    45,
    'daily',
    '',
    '22:03',
    '2024-01-31 16:33:07',
    '2024-01-31 16:33:07'
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
    46,
    'daily',
    '',
    '22:04',
    '2024-01-31 16:33:31',
    '2024-01-31 16:33:31'
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
    47,
    'daily',
    '',
    '22:10',
    '2024-01-31 16:39:16',
    '2024-01-31 16:39:16'
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
    48,
    'weekly',
    '3',
    '22:11',
    '2024-01-31 16:40:44',
    '2024-01-31 16:40:44'
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
    49,
    'daily',
    '',
    '11:39',
    '2024-02-02 06:09:06',
    '2024-02-02 06:09:06'
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
    50,
    'daily',
    '',
    '11:50',
    '2024-02-02 06:13:17',
    '2024-02-02 06:13:17'
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
    51,
    'daily',
    '',
    '11:44',
    '2024-02-02 06:13:36',
    '2024-02-02 06:13:36'
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
    52,
    'daily',
    '',
    '12:30',
    '2024-02-02 06:38:30',
    '2024-02-02 06:38:30'
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
    53,
    'daily',
    '',
    '08:10',
    '2024-02-02 06:52:11',
    '2024-02-02 06:52:11'
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
    54,
    'daily',
    '',
    '12:45',
    '2024-02-02 07:00:45',
    '2024-02-02 07:00:45'
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
    38,
    'more_hospital_c031d5e724ce4808afe75bf8379a34b3_2024-01-29T16-49-00.sql',
    'C:\\Users\\Asus\\Desktop\\pharmacymanagement\\HIMS\\Backend\\DatabaseDump\\more_hospital_c031d5e724ce4808afe75bf8379a34b3\\more_hospital_c031d5e724ce4808afe75bf8379a34b3_2024-01-29T16-49-00.sql',
    '2024-01-29 16:49:00',
    '2024-01-29 16:49:00',
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
    39,
    'more_hospital_c031d5e724ce4808afe75bf8379a34b3_2024-01-29T17-22-00.sql',
    'C:\\Users\\Asus\\Desktop\\pharmacymanagement\\HIMS\\Backend\\DatabaseDump\\more_hospital_c031d5e724ce4808afe75bf8379a34b3\\more_hospital_c031d5e724ce4808afe75bf8379a34b3_2024-01-29T17-22-00.sql',
    '2024-01-29 17:22:08',
    '2024-01-29 17:22:08',
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
    40,
    'more_hospital_c031d5e724ce4808afe75bf8379a34b3_2024-01-30T03-10-10.sql',
    'C:\\Users\\Asus\\Desktop\\pharmacymanagement\\HIMS\\Backend\\DatabaseDump\\more_hospital_c031d5e724ce4808afe75bf8379a34b3\\more_hospital_c031d5e724ce4808afe75bf8379a34b3_2024-01-30T03-10-10.sql',
    '2024-01-30 03:10:19',
    '2024-01-30 03:10:19',
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
    41,
    'more_hospital_c031d5e724ce4808afe75bf8379a34b3_2024-01-30T03-11-09.sql',
    'C:\\Users\\Asus\\Desktop\\pharmacymanagement\\HIMS\\Backend\\DatabaseDump\\more_hospital_c031d5e724ce4808afe75bf8379a34b3\\more_hospital_c031d5e724ce4808afe75bf8379a34b3_2024-01-30T03-11-09.sql',
    '2024-01-30 03:11:10',
    '2024-01-30 03:11:10',
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
    42,
    'more_hospital_c031d5e724ce4808afe75bf8379a34b3_2024-01-30T05-10-57.sql',
    'C:\\Users\\Asus\\Desktop\\pharmacymanagement\\HIMS\\Backend\\DatabaseDump\\more_hospital_c031d5e724ce4808afe75bf8379a34b3\\more_hospital_c031d5e724ce4808afe75bf8379a34b3_2024-01-30T05-10-57.sql',
    '2024-01-30 05:11:01',
    '2024-01-30 05:11:01',
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
    43,
    'more_hospital_c031d5e724ce4808afe75bf8379a34b3_2024-01-30T05-14-46.sql',
    'C:\\Users\\Asus\\Desktop\\pharmacymanagement\\HIMS\\Backend\\DatabaseDump\\more_hospital_c031d5e724ce4808afe75bf8379a34b3\\more_hospital_c031d5e724ce4808afe75bf8379a34b3_2024-01-30T05-14-46.sql',
    '2024-01-30 05:14:49',
    '2024-01-30 05:14:49',
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
    44,
    'more_hospital_c031d5e724ce4808afe75bf8379a34b3_2024-01-31T16-32-00.sql',
    'C:\\Users\\Asus\\Desktop\\pharmacymanagement\\HIMS\\Backend\\DatabaseDump\\more_hospital_c031d5e724ce4808afe75bf8379a34b3\\more_hospital_c031d5e724ce4808afe75bf8379a34b3_2024-01-31T16-32-00.sql',
    '2024-01-31 16:32:01',
    '2024-01-31 16:32:01',
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
    45,
    'more_hospital_c031d5e724ce4808afe75bf8379a34b3_2024-01-31T16-34-00.sql',
    'C:\\Users\\Asus\\Desktop\\pharmacymanagement\\HIMS\\Backend\\DatabaseDump\\more_hospital_c031d5e724ce4808afe75bf8379a34b3\\more_hospital_c031d5e724ce4808afe75bf8379a34b3_2024-01-31T16-34-00.sql',
    '2024-01-31 16:34:00',
    '2024-01-31 16:34:00',
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
    46,
    'more_hospital_c031d5e724ce4808afe75bf8379a34b3_2024-01-31T16-40-00.sql',
    'C:\\Users\\Asus\\Desktop\\pharmacymanagement\\HIMS\\Backend\\DatabaseDump\\more_hospital_c031d5e724ce4808afe75bf8379a34b3\\more_hospital_c031d5e724ce4808afe75bf8379a34b3_2024-01-31T16-40-00.sql',
    '2024-01-31 16:40:00',
    '2024-01-31 16:40:00',
    'Backup Configuration',
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
    47,
    'more_hospital_c031d5e724ce4808afe75bf8379a34b3_2024-01-31T16-41-00.sql',
    'C:\\Users\\Asus\\Desktop\\pharmacymanagement\\HIMS\\Backend\\DatabaseDump\\more_hospital_c031d5e724ce4808afe75bf8379a34b3\\more_hospital_c031d5e724ce4808afe75bf8379a34b3_2024-01-31T16-41-00.sql',
    '2024-01-31 16:41:00',
    '2024-01-31 16:41:00',
    'Backup Configuration',
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
    48,
    'more_hospital_c031d5e724ce4808afe75bf8379a34b3_2024-02-02T06-36-53.sql',
    'C:\\Users\\Asus\\Desktop\\pharmacymanagement\\HIMS\\Backend\\DatabaseDump\\more_hospital_c031d5e724ce4808afe75bf8379a34b3\\more_hospital_c031d5e724ce4808afe75bf8379a34b3_2024-02-02T06-36-53.sql',
    '2024-02-02 06:37:01',
    '2024-02-02 06:37:01',
    'Hospital Administrator',
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
    49,
    'more_hospital_c031d5e724ce4808afe75bf8379a34b3_2024-02-02T06-55-39.sql',
    'C:\\Users\\Asus\\Desktop\\pharmacymanagement\\HIMS\\Backend\\DatabaseDump\\more_hospital_c031d5e724ce4808afe75bf8379a34b3\\more_hospital_c031d5e724ce4808afe75bf8379a34b3_2024-02-02T06-55-39.sql',
    '2024-02-02 06:55:54',
    '2024-02-02 07:04:55',
    'Hospital Administrator',
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
    50,
    'more_hospital_c031d5e724ce4808afe75bf8379a34b3_2024-02-02T07-15-00.sql',
    'C:\\Users\\Asus\\Desktop\\pharmacymanagement\\HIMS\\Backend\\DatabaseDump\\more_hospital_c031d5e724ce4808afe75bf8379a34b3\\more_hospital_c031d5e724ce4808afe75bf8379a34b3_2024-02-02T07-15-00.sql',
    '2024-02-02 07:15:05',
    '2024-02-02 07:15:05',
    'Backup Configuration',
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
    51,
    'more_hospital_c031d5e724ce4808afe75bf8379a34b3_2024-02-05T17-05-06.sql',
    'C:\\Users\\Asus\\Desktop\\pharmacymanagement\\HIMS\\Backend\\DatabaseDump\\more_hospital_c031d5e724ce4808afe75bf8379a34b3\\more_hospital_c031d5e724ce4808afe75bf8379a34b3_2024-02-05T17-05-06.sql',
    '2024-02-05 17:05:19',
    '2024-02-05 17:05:19',
    'Hospital Administrator',
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
    52,
    'more_hospital_c031d5e724ce4808afe75bf8379a34b3_2024-02-05T17-17-00.sql',
    'C:\\Users\\Asus\\Desktop\\pharmacymanagement\\HIMS\\Backend\\DatabaseDump\\more_hospital_c031d5e724ce4808afe75bf8379a34b3\\more_hospital_c031d5e724ce4808afe75bf8379a34b3_2024-02-05T17-17-00.sql',
    '2024-02-05 17:17:04',
    '2024-02-05 17:17:04',
    'Hospital Administrator',
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
    53,
    'more_hospital_c031d5e724ce4808afe75bf8379a34b3_2024-02-05T17-19-09.sql',
    'C:\\Users\\Asus\\Desktop\\pharmacymanagement\\HIMS\\Backend\\DatabaseDump\\more_hospital_c031d5e724ce4808afe75bf8379a34b3\\more_hospital_c031d5e724ce4808afe75bf8379a34b3_2024-02-05T17-19-09.sql',
    '2024-02-05 17:19:10',
    '2024-02-06 02:21:37',
    'Hospital Administrator',
    'restored',
    'Hospital Administrator'
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
    54,
    'more_hospital_c031d5e724ce4808afe75bf8379a34b3_2024-02-06T02-16-58.sql',
    'C:\\Users\\Asus\\Desktop\\pharmacymanagement\\HIMS\\Backend\\DatabaseDump\\more_hospital_c031d5e724ce4808afe75bf8379a34b3\\more_hospital_c031d5e724ce4808afe75bf8379a34b3_2024-02-06T02-16-58.sql',
    '2024-02-06 02:17:05',
    '2024-02-06 02:17:05',
    'Hospital Administrator',
    'not-restored',
    NULL
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: bedshospitalrooms
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: bloodsugarforfastingmodels
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: bloodsugerforpps
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: commissioncodedata
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: companyitems
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: companyregistrations
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: corporatepatientlistpackages
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: createvaccinationpatients
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: currencyrates
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: diagnostics_packages
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: diagnosticsbookings
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: diagnostictestlists
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: diagnostictestresultimages
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: diagonosticselectedtestforpackagemodels
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: dispensedmedicines
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: dispensedreports
# ------------------------------------------------------------


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
    5,
    'DR',
    'Mahesh03',
    'Mahesh',
    '',
    'Kumar',
    'REG6868',
    'mahesh03@gmail.com',
    'Mumbai',
    7654676765,
    '2024-02-01 08:19:59',
    NULL,
    '2024-02-01 08:19:59'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: doctorsappointments
# ------------------------------------------------------------

INSERT INTO
  `doctorsappointments` (
    `id`,
    `doctorId`,
    `admissionID`,
    `patientId`,
    `CorporateID`,
    `Currency`,
    `PatientName`,
    `PatientPhone`,
    `DoctorPhone`,
    `DoctorEmail`,
    `DoctorName`,
    `bookingStartDate`,
    `bookingEndDate`,
    `paymentStatus`,
    `paymentDateTime`,
    `BookingStatus`,
    `amount`,
    `remarks`,
    `image`,
    `createdAt`,
    `reason`,
    `visitType`,
    `procedure`,
    `updatedAt`
  )
VALUES
  (
    1,
    5,
    0,
    1,
    NULL,
    'INR',
    'Mr Gangesh Kumar',
    6564765677,
    7654676765,
    'mahesh03@gmail.com',
    'Mahesh Kumar',
    '02/01/2024, 02:00 PM',
    '02/01/2024, 02:30 PM',
    'paid',
    '02/01/2024, 02:00 PM',
    'Consultated',
    100,
    NULL,
    '',
    '2024-02-01 08:23:05',
    'fever',
    'New Patient',
    'Doctor Visit',
    '2024-02-01 08:24:45'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: drugdatabases
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: healthtestpackagemodels
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: hospitaladminregistrations
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: hospitaladmissions
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: hospitalmains
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: hospitalrooms
# ------------------------------------------------------------


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
    `HospitalUserName`,
    `HospitalID_MainDatabase`,
    `HospitalGUID`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    1,
    'more hospital',
    'NA',
    'NA',
    '0',
    'NA',
    'NA',
    'NA',
    0,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    '2024-01-29 06:52:23',
    '2024-01-29 06:52:23'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: inventries
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
    'blood',
    'CT01',
    'Active',
    '2024-01-29 16:43:11',
    '2024-01-29 16:43:11'
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
    2,
    'newOne',
    'N01',
    'Active',
    '2024-01-29 16:43:25',
    '2024-01-29 16:43:25'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: lipidprofilemodels
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: medicationdays
# ------------------------------------------------------------


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
    'P1/20240201/135443',
    1,
    1,
    0,
    'Sumo cold',
    11,
    '1M',
    '2024-02-01',
    'After Food',
    '11',
    '',
    '2024-02-01 08:24:45',
    '2024-02-01 08:24:45'
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
    'P1/20240201/152227',
    2,
    1,
    0,
    'SUMO COLD',
    1,
    '1M',
    '2024-02-01',
    'AFTER FOOD',
    '1',
    '',
    '2024-02-01 09:52:27',
    '2024-02-01 09:52:27'
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
    'P1/20240201/155326',
    3,
    1,
    0,
    'sumo cold',
    1,
    '1M',
    '2024-02-01',
    'After Food',
    '1',
    '',
    '2024-02-01 10:23:27',
    '2024-02-01 10:23:27'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: nurses
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: otnameandnumbers
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: otschedulepatients
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: pathologisttestbookingappointments
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: pathologytestmanages
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: pathologytestreferrals
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: pathologytests
# ------------------------------------------------------------


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
    `bloodPressure`,
    `respiratoryRate`,
    `heartRate`,
    `temperature`,
    `familyDetails`,
    `createdAt`,
    `updatedAt`,
    `revisitDate`,
    `emailSentStatus`,
    `revisit`,
    `emailSentDetails`
  )
VALUES
  (
    1,
    'P1/20240201/135443',
    1,
    5,
    'Mr Gangesh  Kumar',
    6564765677,
    NULL,
    'Dr Mahesh  Kumar',
    'REG6868',
    7654676765,
    'mahesh03@gmail.com',
    1,
    'Smoker Non Alcoholic NA',
    'Vegetarian    NA',
    'Diabetes',
    'NA',
    'fever last 3 days',
    11,
    '0',
    0,
    NULL,
    '80',
    '188',
    '80',
    '30',
    'NA',
    '2024-02-01 08:24:44',
    '2024-02-02 11:45:38',
    '2024-02-10',
    'sent',
    'yes',
    'Fri Feb 02 2024 17:11:58 GMT+0530 (India Standard Time),Fri Feb 02 2024 17:15:38 GMT+0530 (India Standard Time)'
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
    `bloodPressure`,
    `respiratoryRate`,
    `heartRate`,
    `temperature`,
    `familyDetails`,
    `createdAt`,
    `updatedAt`,
    `revisitDate`,
    `emailSentStatus`,
    `revisit`,
    `emailSentDetails`
  )
VALUES
  (
    2,
    'P1/20240201/152227',
    1,
    5,
    'Mr Gangesh  Kumar',
    6564765677,
    NULL,
    'Dr Mahesh  Kumar',
    'REG6868',
    7654676765,
    'mahesh03@gmail.com',
    1,
    'Non Smoker Non Alcoholic na',
    'Vegetarian    na',
    'dIABETES',
    'na',
    'FEVER',
    1,
    '0',
    0,
    NULL,
    '76',
    '122',
    '78',
    '30',
    'NA',
    '2024-02-01 09:52:27',
    '2024-02-01 11:13:05',
    '2024-02-03',
    'sent',
    'yes',
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
    `bloodPressure`,
    `respiratoryRate`,
    `heartRate`,
    `temperature`,
    `familyDetails`,
    `createdAt`,
    `updatedAt`,
    `revisitDate`,
    `emailSentStatus`,
    `revisit`,
    `emailSentDetails`
  )
VALUES
  (
    3,
    'P1/20240201/155326',
    1,
    5,
    'Mr Gangesh  Kumar',
    6564765677,
    NULL,
    'Dr Mahesh  Kumar',
    'REG6868',
    7654676765,
    'mahesh03@gmail.com',
    1,
    'Non Smoker Non Alcoholic NA',
    'Vegetarian    NA',
    'NA',
    'NA',
    'NA',
    1,
    '0',
    0,
    NULL,
    '12',
    '123',
    '123',
    '123',
    'NA',
    '2024-02-01 10:23:27',
    '2024-02-02 12:00:59',
    '2024-02-04',
    'sent',
    'yes',
    'Fri Feb 02 2024 17:10:36 GMT+0530 (India Standard Time),,Fri Feb 02 2024 17:30:59 GMT+0530 (India Standard Time)'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: patientregistrations
# ------------------------------------------------------------

INSERT INTO
  `patientregistrations` (
    `id`,
    `mr`,
    `firstName`,
    `Currency`,
    `middleName`,
    `lastName`,
    `PackageName`,
    `PackageID`,
    `countryCode`,
    `phoneNumberP`,
    `email`,
    `age`,
    `gender`,
    `height`,
    `weight`,
    `hospitalId`,
    `PatientAadharID`,
    `HealthNationalID`,
    `city`,
    `state`,
    `pincode`,
    `address`,
    `CompanyName`,
    `CompanyID`,
    `CorporateID`,
    `registrationFees`,
    `paymentStatus`,
    `paymentDate`,
    `maritalStatus`,
    `bloodGroup`,
    `ageOption`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    1,
    'Mr',
    'Gangesh',
    'EUR',
    '',
    'Kumar',
    NULL,
    NULL,
    '+91',
    6564765677,
    'gangesh02@gmail.com',
    12,
    'male',
    155,
    55,
    0,
    '',
    '',
    '',
    '',
    '',
    'Mumbai',
    NULL,
    NULL,
    NULL,
    100,
    'Paid',
    '2024-02-01 00:00:00',
    'Single',
    '',
    'Year',
    '2024-02-01 08:21:17',
    '2024-02-01 08:21:17'
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
    '',
    'Kumar',
    'pune maharashtra',
    7657676575,
    'datta02@gmail.com',
    '2024-02-05 08:26:13',
    '2024-02-05 08:26:13'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: plateletcounttestmodels
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: quantityoutreports
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: roles
# ------------------------------------------------------------

INSERT INTO
  `roles` (`id`, `role`, `createdAt`, `updatedAt`)
VALUES
  (
    1,
    'user',
    '2024-01-29 06:52:28',
    '2024-01-29 06:52:28'
  );
INSERT INTO
  `roles` (`id`, `role`, `createdAt`, `updatedAt`)
VALUES
  (
    2,
    'doctor',
    '2024-01-29 06:52:28',
    '2024-01-29 06:52:28'
  );
INSERT INTO
  `roles` (`id`, `role`, `createdAt`, `updatedAt`)
VALUES
  (
    3,
    'pharmacist',
    '2024-01-29 06:52:28',
    '2024-01-29 06:52:28'
  );
INSERT INTO
  `roles` (`id`, `role`, `createdAt`, `updatedAt`)
VALUES
  (
    4,
    'patient',
    '2024-01-29 06:52:28',
    '2024-01-29 06:52:28'
  );
INSERT INTO
  `roles` (`id`, `role`, `createdAt`, `updatedAt`)
VALUES
  (
    5,
    'nurse',
    '2024-01-29 06:52:28',
    '2024-01-29 06:52:28'
  );
INSERT INTO
  `roles` (`id`, `role`, `createdAt`, `updatedAt`)
VALUES
  (
    6,
    'admin',
    '2024-01-29 06:52:28',
    '2024-01-29 06:52:28'
  );
INSERT INTO
  `roles` (`id`, `role`, `createdAt`, `updatedAt`)
VALUES
  (
    7,
    'pathologistAdmin',
    '2024-01-29 06:52:28',
    '2024-01-29 06:52:28'
  );
INSERT INTO
  `roles` (`id`, `role`, `createdAt`, `updatedAt`)
VALUES
  (
    8,
    'diagnosticTechnician',
    '2024-01-29 06:52:28',
    '2024-01-29 06:52:28'
  );
INSERT INTO
  `roles` (`id`, `role`, `createdAt`, `updatedAt`)
VALUES
  (
    9,
    'Receptionist',
    '2024-01-29 06:52:28',
    '2024-01-29 06:52:28'
  );
INSERT INTO
  `roles` (`id`, `role`, `createdAt`, `updatedAt`)
VALUES
  (
    10,
    'admin',
    '2024-01-29 06:52:28',
    '2024-01-29 06:52:28'
  );
INSERT INTO
  `roles` (`id`, `role`, `createdAt`, `updatedAt`)
VALUES
  (
    11,
    'superAdmin',
    '2024-01-29 12:52:20',
    '2024-01-29 12:52:20'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: samplecollections
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: samplehomecollections
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: selectedtestforhealthpackagemodels
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: selectedtestforpackagemodels
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: specimenlists
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: statusofdiagnostictestsfortestbookings
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: statusofpathologytestsfortestbookings
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: t3t4tshpathologytests
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: testpackagemodels
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: user_roles
# ------------------------------------------------------------

INSERT INTO
  `user_roles` (`createdAt`, `updatedAt`, `roleId`, `userId`)
VALUES
  ('2024-02-01 08:19:59', '2024-02-01 08:19:59', 2, 94);
INSERT INTO
  `user_roles` (`createdAt`, `updatedAt`, `roleId`, `userId`)
VALUES
  (
    '2024-02-05 08:26:13',
    '2024-02-05 08:26:13',
    3,
    268
  );
INSERT INTO
  `user_roles` (`createdAt`, `updatedAt`, `roleId`, `userId`)
VALUES
  (
    '2024-02-05 08:08:51',
    '2024-02-05 08:08:51',
    4,
    264
  );
INSERT INTO
  `user_roles` (`createdAt`, `updatedAt`, `roleId`, `userId`)
VALUES
  ('2024-01-29 06:52:29', '2024-01-29 06:52:29', 10, 1);

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: users
# ------------------------------------------------------------

INSERT INTO
  `users` (
    `id`,
    `name`,
    `username`,
    `email`,
    `hospitalId`,
    `phoneNumber`,
    `password`,
    `language`,
    `status`,
    `createdAt`,
    `updatedAt`,
    `loggedInStatus`
  )
VALUES
  (
    1,
    'Hospital Administrator',
    'more.hospital',
    'admin@example.com',
    0,
    1234567890,
    '$2a$08$759hw5NJXvANhMn4tDC8keY0k7uAtSMB.e2GAhgWvUs3ojDdXKA/G',
    'en',
    'active',
    '2024-01-29 06:52:29',
    '2024-02-02 06:08:29',
    'LoggedIn'
  );
INSERT INTO
  `users` (
    `id`,
    `name`,
    `username`,
    `email`,
    `hospitalId`,
    `phoneNumber`,
    `password`,
    `language`,
    `status`,
    `createdAt`,
    `updatedAt`,
    `loggedInStatus`
  )
VALUES
  (
    94,
    'Mahesh  Kumar',
    'Mahesh03',
    'mahesh03@gmail.com',
    0,
    7654676765,
    '$2a$08$BA83DNrTn2pNdtUYUPfiWOTMv0JVX9PF1hr8MbUgUF80TQDFXXELS',
    'en',
    'active',
    '2024-02-01 08:19:59',
    '2024-02-03 17:27:39',
    'LoggedOut'
  );
INSERT INTO
  `users` (
    `id`,
    `name`,
    `username`,
    `email`,
    `hospitalId`,
    `phoneNumber`,
    `password`,
    `language`,
    `status`,
    `createdAt`,
    `updatedAt`,
    `loggedInStatus`
  )
VALUES
  (
    264,
    'Jai Kumar',
    'Jai123',
    'jai123@gmail.com',
    0,
    9654567654,
    '$2a$08$i1wEblNKHojXh3We.zO4Pu0q/UtRfmLmKRJHJMJz8RI.IfE/dcmw2',
    'en',
    'active',
    '2024-02-05 08:08:50',
    '2024-02-05 08:08:50',
    NULL
  );
INSERT INTO
  `users` (
    `id`,
    `name`,
    `username`,
    `email`,
    `hospitalId`,
    `phoneNumber`,
    `password`,
    `language`,
    `status`,
    `createdAt`,
    `updatedAt`,
    `loggedInStatus`
  )
VALUES
  (
    268,
    'Datta  Kumar',
    'Datta02',
    'datta02@gmail.com',
    0,
    7657676575,
    '$2a$08$jztnmrK6SiH3ZJGrXOdk/egASIdfh3mubVjWD0UHq741KWmH2/3Ny',
    'en',
    'active',
    '2024-02-05 08:26:12',
    '2024-02-05 08:26:12',
    NULL
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: vendors
# ------------------------------------------------------------


/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
