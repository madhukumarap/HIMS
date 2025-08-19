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
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: backupdata
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `backupdata` (
  `id` int NOT NULL AUTO_INCREMENT,
  `filename` varchar(255) DEFAULT NULL,
  `path` varchar(255) DEFAULT NULL,
  `user` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

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
  UNIQUE KEY `vaccinationRegNo` (`vaccinationRegNo`)
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
  UNIQUE KEY `code` (`code`)
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
  CONSTRAINT `dispensedmedicines_ibfk_1` FOREIGN KEY (`DispenseTableID`) REFERENCES `dispensedreports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
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
  UNIQUE KEY `email` (`email`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

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
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

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
  UNIQUE KEY `databaseName` (`databaseName`)
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
  UNIQUE KEY `HospitalGUID` (`HospitalGUID`)
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
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

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
  CONSTRAINT `medicationdays_ibfk_1` FOREIGN KEY (`PrescriptionId`) REFERENCES `patientprecriptions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
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
  NULL ON UPDATE CASCADE
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
  PRIMARY KEY (`id`),
  KEY `patient_Id` (`patient_Id`),
  CONSTRAINT `patientprecriptions_ibfk_1` FOREIGN KEY (`patient_Id`) REFERENCES `patientregistrations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

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
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

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
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

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
) ENGINE = InnoDB AUTO_INCREMENT = 11 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

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
  UNIQUE KEY `BarcodeValuesAllSelectedTest` (`BarcodeValuesAllSelectedTest`)
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
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `phoneNumber` (`phoneNumber`)
) ENGINE = InnoDB AUTO_INCREMENT = 3 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

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
    1,
    'weekly',
    '1',
    '01:00',
    '2024-01-30 07:11:53',
    '2024-01-30 07:11:53'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: backupdata
# ------------------------------------------------------------

INSERT INTO
  `backupdata` (
    `id`,
    `filename`,
    `path`,
    `user`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    1,
    'imax_ad39e922c21349fdbfde277ddb65ca88_2024-01-30T07-12-00.sql',
    'C:\\Users\\dhira\\OneDrive\\Desktop\\INTERNSHIP TASKS\\mediAI\\pharmacymanagement\\HIMS\\Backend\\DatabaseDump\\imax_ad39e922c21349fdbfde277ddb65ca88\\imax_ad39e922c21349fdbfde277ddb65ca88_2024-01-30T07-12-00.sql',
    NULL,
    '2024-01-30 07:12:00',
    '2024-01-30 07:12:00'
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


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: doctorsappointments
# ------------------------------------------------------------


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
    'Imax',
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
    '2024-01-30 07:10:30',
    '2024-01-30 07:10:30'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: inventries
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: labcategorylists
# ------------------------------------------------------------


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


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: patientregistrations
# ------------------------------------------------------------


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: pharmacists
# ------------------------------------------------------------


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
    '2024-01-30 07:10:28',
    '2024-01-30 07:10:28'
  );
INSERT INTO
  `roles` (`id`, `role`, `createdAt`, `updatedAt`)
VALUES
  (
    2,
    'doctor',
    '2024-01-30 07:10:28',
    '2024-01-30 07:10:28'
  );
INSERT INTO
  `roles` (`id`, `role`, `createdAt`, `updatedAt`)
VALUES
  (
    3,
    'pharmacist',
    '2024-01-30 07:10:28',
    '2024-01-30 07:10:28'
  );
INSERT INTO
  `roles` (`id`, `role`, `createdAt`, `updatedAt`)
VALUES
  (
    4,
    'patient',
    '2024-01-30 07:10:28',
    '2024-01-30 07:10:28'
  );
INSERT INTO
  `roles` (`id`, `role`, `createdAt`, `updatedAt`)
VALUES
  (
    5,
    'nurse',
    '2024-01-30 07:10:28',
    '2024-01-30 07:10:28'
  );
INSERT INTO
  `roles` (`id`, `role`, `createdAt`, `updatedAt`)
VALUES
  (
    6,
    'admin',
    '2024-01-30 07:10:28',
    '2024-01-30 07:10:28'
  );
INSERT INTO
  `roles` (`id`, `role`, `createdAt`, `updatedAt`)
VALUES
  (
    7,
    'pathologistAdmin',
    '2024-01-30 07:10:28',
    '2024-01-30 07:10:28'
  );
INSERT INTO
  `roles` (`id`, `role`, `createdAt`, `updatedAt`)
VALUES
  (
    8,
    'diagnosticTechnician',
    '2024-01-30 07:10:28',
    '2024-01-30 07:10:28'
  );
INSERT INTO
  `roles` (`id`, `role`, `createdAt`, `updatedAt`)
VALUES
  (
    9,
    'Receptionist',
    '2024-01-30 07:10:28',
    '2024-01-30 07:10:28'
  );
INSERT INTO
  `roles` (`id`, `role`, `createdAt`, `updatedAt`)
VALUES
  (
    10,
    'admin',
    '2024-01-30 07:10:28',
    '2024-01-30 07:10:28'
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
  ('2024-01-30 07:10:29', '2024-01-30 07:10:29', 10, 1);

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
    `updatedAt`
  )
VALUES
  (
    1,
    'Hospital Administrator',
    'Imax',
    'admin@example.com',
    0,
    1234567890,
    '$2a$08$Cf.gKMhn8XJTitdDOIYj3uVKnkMvQkEXgZZDp5Jmbrc6IKyp5faw2',
    'en',
    'active',
    '2024-01-30 07:10:29',
    '2024-01-30 07:10:29'
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
