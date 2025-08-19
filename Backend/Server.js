require("dotenv").config();
const CircularJSON = require("circular-json");
const path = require("path");
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const { CreateDatabaseandTables } = require("./model/index.model2.js");
const multer = require("multer");
const cron = require("node-cron");
const zxing = require("node-zxing");
app.use(bodyParser.json({ limit: "50mb" }));
const db = require("./model/index.model");
const CurrencyRate = db.CurrencyRate;
const { fetchAndSaveExchangeRates } = require("./routes/CurrencyRoute.js");
const qrCodeReader = require("qrcode-reader");
const Jimp = require("jimp");
const upload = multer({ dest: "uploads/" });
app.use(express.static(path.join(__dirname, "public")));
const {
  databasesUnderBackup,
} = require("./Controller/storebackupconfigController.js");

app.use(cors());
app.use(express.json());

app.use("/public/images", express.static("./public/images"));
app.use(express.static("public"));

var corsOptions = {
  origin: "http://localhost:3000",
};

app.use(cors(corsOptions));
const dbConfig = require("./config/db.config.js");

/////////////////// Schedule backup ///////////////////////

app.get("/api/get-hospitalsMain/:extractedPart", async (req, res) => {
  try {
    const { extractedPart } = req.params;
    console.log(extractedPart);
    const hospitals = await db.HospitalMain.findAll({
      where: {
        name: extractedPart,
      },
    });

    res.status(200).send(hospitals);
  } catch (error) {
    console.error("Error fetching hospitals:", error);
    res.status(500).json({ message: "Failed to fetch hospitals" });
  }
});

app.get("/api/GetExchangeRates/:currencies", async (req, res) => {
  try {
    const requestedCurrencies = req.params.currencies.split(",");

    try {
      await fetchAndSaveExchangeRates();
    } catch (error) {
      console.error("Failed to update exchange rates:", error.message);
    }

    const exchangeRatesData = await Promise.all(
      requestedCurrencies.map(async (currency) => {
        const lastSavedRecord = await CurrencyRate.findOne({
          where: { Currency: currency },
          order: [["Date", "DESC"]],
        });

        return {
          currency,
          data: {
            id: lastSavedRecord.id,
            Currency: lastSavedRecord.Currency,
            rates: lastSavedRecord.CurrencyResponse,
            Date: lastSavedRecord.Date,
            createdAt: lastSavedRecord.createdAt,
            updatedAt: lastSavedRecord.updatedAt,
          },
        };
      })
    );
    res.status(200).json({
      exchangeRatesData,
    });
  } catch (error) {
    console.error("Error fetching or sending exchange rates:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching exchange rates.",
    });
  }
});

// Runs at 12 PM & 6 PM
cron.schedule("0 12,18 * * *", () => fetchAndSaveExchangeRates(true));

///////////////////////////////////////////////////

app.get("/api/getexchangerate/:currencie", async (req, res) => {
  try {
    const requestedCurrencies = req.params.currencie;

    const lastSavedRecord = await CurrencyRate.findOne({
      where: { Currency: "USD" },
      order: [["Date", "DESC"]],
    });
    console.log("lastSavedRecord::" + JSON.stringify(lastSavedRecord));

    const currencyResponse = JSON.parse(lastSavedRecord.CurrencyResponse);
    const exchangeRate = currencyResponse["INR"];
    console.log("exchangeRate::" + exchangeRate);
    res.status(200).json({
      exchangeRate,
    });
  } catch (error) {
    console.error("Error fetching or sending exchange rates:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching exchange rates.",
    });
  }
});
//
const authJwt = require("./middleware/authJwt.js");
app.use(async (req, res, next) => {
  // console.log("req.headers.MainDatabase:" + JSON.stringify(req.params));
  // return;
  if (req.body.Client) {
    //for signup
    // req.headers.userDatabase = "healthcare";
    console.log("---Client-----" + req.body.Client);
    // return;
    next();
  } else if (req.headers.maindatabase == "pharmacymanagement") {
    req.headers.userDatabase = "healthcare";
    next();
  } else if (!req.body.username || req.headers.authorization) {
    authJwt.verifyToken(req, res, (err) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized!" });
      }
      console.log("Token verified successfully");
      console.log(req.headers.userDatabase);
      next();
    });
  } else {
    console.log("req body--------------" + req.body);
    next();
  }
});
//routes;

const logRequestInfo = (req, res, next) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log(`Headers: ${JSON.stringify(req.headers)}`);
  console.log(`Body: ${JSON.stringify(req.body)}`);
  console.log("-------------------------------------");

  // Call the next middleware in the stack
  next();
};
//app.use(logRequestInfo);

const checkDatabaseUnderBackup = (req, res, next) => {
  const userDatabase = req.headers.userDatabase;
  console.log("databasesUnderBackup: " + databasesUnderBackup);
  if (databasesUnderBackup.includes(userDatabase)) {
    return res
      .status(403)
      .json({ message: "Database under backup. Try again later." });
  }

  // Proceed to the next middleware
  next();
};
app.use(checkDatabaseUnderBackup);

require("./routes/auth.routes")(app);
require("./routes/user.routes")(app);

//all backend Routes
const routerinventory = require("./routes/InventryRoutes.js");
const DoctorRouter = require("./routes/DoctorRoutes");
const PharmacistRoute = require("./routes/PharmacistRoutes");
const NurseRoute = require("./routes/NurseRoutes");
const DispentionRoute = require("./routes/DispentionRoutes");
const routerPaitentRegistration = require("./routes/PatientRegRoutes.js");
const routerPaitentPr = require("./routes/PatientPrescriptionRoutes.js");
const routerOTSchedulePatient = require("./routes/OTRoutes");
const EmailRoute = require("./routes/EmailRoutes.js");
const adminreport = require("./routes/MedicineReportRoutes.js");
const drugDatabaseRoutes = require("./routes/DrugDataBaseRoutes");
const PathologyTestRoute = require("./routes/PathologyRoutes");
const SampleCollectionroute = require("./routes/SampleCollectionRoute");
const SampleHomeCollectionroute = require("./routes/SampleHomeCollectionRoute");
const PathologyTestReferralRoute = require("./routes/PathologyTestReferralRoute.js"); //reemoved
const PathologyTestManageRoutes = require("./routes/PathalogyTestManage");
const DoctorsAppointmentRoute = require("./routes/DoctorsAppointmentRoute");
const HospitalRoute = require("./routes/HospitalRoute");
const HospitalAdminregRoute = require("./routes/HospitalAdminRegistrationRoute");
const CommisionCodeRoute = require("./routes/CommisionCodeRoute");
//Pathologytest
const PathologyTestAllRoute = require("./routes/PathologyTestRoute/AllCreateResultPathologyTestRoute.js");
const TestPackageModelRoute = require("./routes/TestPackageRoute");
//
const testFieldsManagementRoute = require("./routes/PathologyTestRoute/TestManagementFieldsRoute"); //done
const DiagnosticsBookingRoute = require("./routes/DiagnosticsBookingRoute.js"); //remain
const CompanyRegistration = require("./routes/CompanyRegistrationRoute");
const DiagnosticTestRoute = require("./routes/DiagnosticTestListRoute");
const DiagnosticPackageRoute = require("./routes/DiagonosticsPackageRoute");
const testFieldsManagementRouteDiiagnostic = require("./routes/DiagnosticTestRoute/TestManagementFieldsRoute");
const HealthTestPackageRoute = require("./routes/HealthTestPackage");
const CorporatePackageAssignToPatientRoute = require("./routes/CreatePackageForCorporatePatientRoute");
const CreateVaccinationPatientRoute = require("./routes/CreateVaccinationPatientRoute.js");
const CompanyItemRoute = require("./routes/Inventory/CompanyItemRoute.js");
const VendorRoute = require("./routes/Inventory/VendorRoute.js");
const HospitalRooms = require("./routes/HospitalRoomsRoutes.js");
const HospitalAdmission = require("./routes/HospitalAdmissionRoute.js");
const mainHospitalcreateRoute = require("./routes/MainHospitalCreateRoute.js");
const Backup = require("./routes/backupDatabaseDump.js");
const performDatabaseDump = require("./dump.js");
const BackupConfiguration = require("./routes/storeBackupConfig.js");
const reminderForConsultation = require("./routes/ReminderForConsultation.js");
const userRoleRoutes = require("./routes/userRole.routes");
app.use(
  "/api",
  EmailRoute,
  HospitalAdmission,
  CorporatePackageAssignToPatientRoute,
  HospitalRoute,
  mainHospitalcreateRoute,
  HealthTestPackageRoute,
  testFieldsManagementRouteDiiagnostic,
  CompanyRegistration,
  NurseRoute,
  TestPackageModelRoute,
  PathologyTestReferralRoute,
  DiagnosticTestRoute,
  SampleCollectionroute,
  CommisionCodeRoute,
  PathologyTestAllRoute,
  DiagnosticsBookingRoute,
  HospitalAdminregRoute,
  SampleHomeCollectionroute,
  PathologyTestRoute,
  testFieldsManagementRoute,
  PathologyTestManageRoutes,
  PharmacistRoute,
  DoctorsAppointmentRoute,
  routerOTSchedulePatient,
  routerinventory,
  routerPaitentRegistration,
  routerPaitentPr,
  adminreport,
  DoctorRouter,
  DispentionRoute,
  drugDatabaseRoutes,
  DiagnosticPackageRoute,
  CreateVaccinationPatientRoute,
  CompanyItemRoute,
  VendorRoute,
  HospitalRooms,
  reminderForConsultation,
  BackupConfiguration
);

app.use("/api/user-roles", userRoleRoutes);

/////////////
const hospitalRoutes = require("./routes/user.routes");
app.use("/api/hospitals", hospitalRoutes);

app.listen(7000, () => {
  console.log("Started on port 7000");
});
