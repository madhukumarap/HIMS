import mssql from "mssql";
import axios from "axios";
import { Request, Response } from "express";
// import config from "../db/dbConfig";
import { query } from "../db/db";
import asyncHandler from "../middleware/asyncHandler";
import fs from "fs";
import {
  findMatchingECGFile,
  readPatIDFromECGFile,
  rootDirPath,
} from "../utils/index";
import { logger } from "../logger";
import { toUSVString } from "util";
import path from "path";
// import convertToDicom from "../utils/dicomConversionUtils";
import generateImage from "../utils/generateGIF";
import {
  deviceInfoAPI,
  loginAPI,
  readFromECGFile,
} from "../utils/createGifUtlis";
import { fetchStudy } from "../services/studyService";

const ECG_STORAGE_PATH = process.env.ECG_STORAGE_PATH;

interface CustomRequest extends Request {
  user?: {
    userGuid: string;
    userName: string;
  };
}

const getECGData = asyncHandler(async (req: Request, res: Response) => {
  const { strFileName } = req.params;

  try {
    console.log("strFileName ", strFileName);

    const NO_OF_LEADS = 12;
    const SAMPLING_FREQ = 250;
    const SIZE_OF_ECG_DATA_IN_SEC = 10;
    const NAME_SIZE = 35;
    const MAX_FILE_LENGTH = 60161;
    const MAX_INTER_CONDITIONS = 18;
    const ecgData = {} as {
      siHR: number;
      siQRSdInterval: number;
      siPRdInterval: number;
      siQTcInterval: number;
      siPAxis: number;
      siQRSAxis: number;
      siTAxis: number;
    };

    if (!strFileName) {
      res.status(400);
      throw new Error("Please provide file name");
    }

    // Check if file exist
    const ECGFilePath = findMatchingECGFile(ECG_STORAGE_PATH!, strFileName);

    if (!ECGFilePath) {
      res.status(404);
      throw new Error("File doesnt exist");
    }

    const buffer = fs.readFileSync(ECGFilePath);
    const dataView = new DataView(buffer.buffer);
    let offset = 0;

    let bSuccess = true;
    const nSize = dataView.getInt32(offset, true);
    console.log("Filename: ", strFileName);

    console.log("FileSize: " + nSize);
    offset += 4;

    let nPatID = dataView.getInt32(offset, true);
    offset += 4;
    console.log("PatientID " + nPatID);
    /////////////////////////////////////

    const bAllLeadFlag = dataView.getUint8(offset) !== 0;
    offset += 1;

    const bRestingECgFlag = dataView.getUint8(offset) !== 0;
    offset += 1;

    const byLongLead = dataView.getUint8(offset);
    offset += 1;

    const byQRSLead = dataView.getUint8(offset);
    offset += 1;

    const byAmpliVerI = dataView.getUint8(offset);
    offset += 1;

    const byAmpliVerF = dataView.getUint8(offset);
    offset += 1;

    const byHWVerI = dataView.getUint8(offset);
    offset += 1;

    const byHWVerF = dataView.getUint8(offset);
    offset += 1;

    const bDemoFlag = dataView.getUint8(offset) !== 0;
    offset += 1;

    const byPriority = dataView.getUint8(offset);
    offset += 1;

    const bEmergencyFlag = dataView.getUint8(offset) !== 0;
    offset += 1;

    const bConfigFlag = dataView.getUint8(offset) !== 0;
    offset += 1;

    const bDummy2Flag = dataView.getUint8(offset);
    offset += 1;

    const strTechnicianNameBuffer = Buffer.from(
      dataView.buffer,
      offset,
      NAME_SIZE
    );
    offset += NAME_SIZE;
    const strTechnicianName = strTechnicianNameBuffer.toString("utf8").trim();

    const strInstrumentNameBuffer = Buffer.from(
      dataView.buffer,
      offset,
      NAME_SIZE
    );
    offset += NAME_SIZE;
    const strInstrumentName = strInstrumentNameBuffer.toString("utf8").trim();

    const byInterpretationData = new Uint8Array(
      dataView.buffer.slice(offset, offset + MAX_INTER_CONDITIONS)
    );
    offset += MAX_INTER_CONDITIONS;

    console.log("byInterpretationData: " + byInterpretationData);

    let bOldFile = false;
    if (nSize === MAX_FILE_LENGTH) {
      bOldFile = false;

      const siPAamplitude = dataView.getInt16(offset, true);
      offset += 2;

      const siQAamplitude = dataView.getInt16(offset, true);
      offset += 2;

      const siRAamplitude = dataView.getInt16(offset, true);
      offset += 2;

      const siSAamplitude = dataView.getInt16(offset, true);
      offset += 2;

      const sirdashAamplitude = dataView.getInt16(offset, true);
      offset += 2;

      const sisdashAamplitude = dataView.getInt16(offset, true);
      offset += 2;

      const siTAamplitude = dataView.getInt16(offset, true);
      offset += 2;

      const siUAamplitude = dataView.getInt16(offset, true);
      offset += 2;

      const siQRSAamplitude = dataView.getInt16(offset, true);
      offset += 2;

      const siPduration = dataView.getInt16(offset, true);
      offset += 2;

      const siQduration = dataView.getInt16(offset, true);
      offset += 2;

      const siRduration = dataView.getInt16(offset, true);
      offset += 2;

      const siSduration = dataView.getInt16(offset, true);
      offset += 2;

      const sirdashduration = dataView.getInt16(offset, true);
      offset += 2;

      const sisdashduration = dataView.getInt16(offset, true);
      offset += 2;

      const siTduration = dataView.getInt16(offset, true);
      offset += 2;

      const siUduration = dataView.getInt16(offset, true);
      offset += 2;

      const siPQdInterval = dataView.getInt16(offset, true);
      offset += 2;

      const siPRdInterval = dataView.getInt16(offset, true);
      offset += 2;

      const siQRSdInterval = dataView.getInt16(offset, true);
      offset += 2;

      const siQTcInterval = dataView.getInt16(offset, true);
      offset += 2;

      const siPAxis = dataView.getInt16(offset, true);
      offset += 2;

      const siQRSAxis = dataView.getInt16(offset, true);
      offset += 2;

      const siTAxis = dataView.getInt16(offset, true);
      offset += 2;

      const siHR = dataView.getInt16(offset, true);
      offset += 2;

      const siRRInterval = dataView.getInt16(offset, true);
      offset += 2;
      console.log(
        "/////////////" +
          siHR +
          " " +
          siQRSdInterval +
          " " +
          siPRdInterval +
          " " +
          siQTcInterval +
          " " +
          siPAxis +
          " " +
          siQRSAxis +
          " " +
          siTAxis
      );

      ecgData.siHR = siHR;
      ecgData.siQRSdInterval = siQRSdInterval;
      ecgData.siPRdInterval = siPRdInterval;
      ecgData.siPRdInterval = siPRdInterval;
      ecgData.siQTcInterval = siQTcInterval;
      ecgData.siPAxis = siPAxis;
      ecgData.siQRSAxis = siQRSAxis;
      ecgData.siTAxis = siTAxis;
    } else {
      bOldFile = true;
    }

    console.log(" ecgData,: ", ecgData);

    res.status(200).json({ ecgData: ecgData });
  } catch (error) {
    const err = error as Error;
    logger.error(`Error: ${err.message}\nStack: ${err.stack}`);
    throw new Error("Internal Server Error");
  }
});

const getReports = asyncHandler(async (req: CustomRequest, res: Response) => {
  const page = Number(req.query.page) || 1;
  const pageSize = Number(req.query.pageSize) || 10;
  const offset = (page - 1) * pageSize;

  const { startDate, endDate, category } = req.query;

  console.log(
    `startDate: ${startDate}, endDate: ${endDate}, category: ${category}, page: ${page}, pageSize: ${pageSize}, User: ${req?.user}`
  );

  try {
    if (!req.user || typeof req.user === "string" || !req.user.userGuid) {
      res.status(400);
      throw new Error("Failed to get reports");
    }

    const { userGuid } = req.user;
   
    const getUserInstQuery = `SELECT userinst.Inst_Id_n as instID 
                             FROM cmr_user_master usermaster 
                             INNER JOIN cmr_user_institutes userinst 
                             ON usermaster.User_Unique_Id_n = userinst.User_Unique_Id_n 
                             WHERE usermaster.User_GUID_nvc = ?`;

    const instResult = await query(getUserInstQuery, [userGuid]); 
    const instID = instResult[0].instID;

    let query1 = `SELECT 
      RTRIM(LTRIM(si.Study_Id_nc)) AS studyID, 
      pi.Patient_Unique_id_n AS patientID,
      CONCAT_WS(' ', 
        RTRIM(LTRIM(pi.Ext_FirstName_vc)), 
        RTRIM(LTRIM(pi.Ext_MiddleName_vc)), 
        RTRIM(LTRIM(pi.Ext_LastName_vc))
      ) AS patientName,
      pi.Patient_Date_Of_Birth_dt AS patientDOB,
      RTRIM(IFNULL(pi.Patient_Gender_c, '')) AS gender,
      pi.Ext_Patient_Mobile1 AS mobileNumber,
      sr.Report_Id_n AS ReportId,
      (CASE WHEN si.study_status_n >= 20 THEN 1 ELSE 0 END) AS IsReported,
      sr.Report_CreatedDate_dt AS ReportCreatedDate,
      sr.Report_Status_n AS ReportStatus,
      IFNULL(wr.Findings_nt,'') AS impressionAndAdvice,
      si.study_date_dt AS studyDate,
      si.Study_Time_dt AS studyTime,
      IFNULL(ci.Inst_Img_Archive_Top_Path_vc, '') AS ImagePath,
      IFNULL(patCondition.historyCondition_id_n,'') as historyCondition
    FROM 
      cmr_study_info_mst si
      LEFT JOIN cmr_patient_info_mst pi ON pi.Patient_Unique_id_n = si.Patient_Id_n
      LEFT JOIN cmr_study_reportdetails sr ON sr.Study_Id_n = si.Study_Unique_Id_n
      LEFT JOIN cmr_study_webreport wr ON wr.Report_id_n = sr.Report_Id_n
      LEFT JOIN cmr_inst_config_info ci ON ci.Inst_Id_n = si.Inst_Id_n
      LEFT JOIN ecg_patienthistory_conditions patCondition ON patCondition.Patient_Unique_id_n = pi.Patient_Unique_id_n  
    WHERE 
      si.Study_Deleted_YN_c = 'N'
      AND sr.Report_Status_n >= 20
      AND si.Inst_Id_n = ?`;

    const queryParams: any[] = [instID];

    // Date filters
    if (startDate && endDate) {
      query1 += ` AND CAST(si.Study_Date_dt AS DATE) BETWEEN ? AND ?`;
      queryParams.push(startDate, endDate);
    }

    // Category filter
    switch (category) {
      case "Abnormal":
        query1 += ` AND wr.Findings_nt LIKE '%Abnormal%'`;
        break;
      case "Normal":
        query1 += ` AND wr.Findings_nt LIKE '%Normal%'`;
        break;
      case "Abnormal/Critical":
        query1 += ` AND wr.Findings_nt LIKE '%Abnormal/Critical%'`;
        break;
      case "Abnormal/Non-Critical":
        query1 += ` AND wr.Findings_nt LIKE '%Abnormal/Non-Critical%'`;
        break;
      default:
        break;
    }

    query1 += ` 
      ORDER BY si.Study_Date_dt DESC
      LIMIT ?, ?;
    `;

    // Add pagination parameters (offset first, then pageSize)
    queryParams.push(offset, pageSize);

    const result = await query(query1, queryParams);
     
    const IMAGE_ROOT_URL = process.env.IMAGE_ROOT_URL;
    const modifiedResults = result.map((x) => {
      const instituteName = x.ImagePath.replace("C:\\", "").split("\\").pop();
      const imageURL = `${IMAGE_ROOT_URL}/${instituteName}/ECGImages/${x.studyID.trim()}.gif`;

      return {
        ...x,
        ImageUrl: imageURL,
      };
    });

    // Get total count for pagination info
    let countQuery = `SELECT COUNT(*) as total
                      FROM cmr_study_info_mst si
                      LEFT JOIN cmr_study_reportdetails sr ON sr.Study_Id_n = si.Study_Unique_Id_n
                      WHERE si.Study_Deleted_YN_c = 'N'
                      AND sr.Report_Status_n >= 20
                      AND si.Inst_Id_n = ?`;
    
    const countParams: any[] = [instID];
    
    if (startDate && endDate) {
      countQuery += ` AND CAST(si.Study_Date_dt AS DATE) BETWEEN ? AND ?`;
      countParams.push(startDate, endDate);
    }
    
    const countResult = await query(countQuery, countParams);
    const totalRecords = countResult[0].total;

    res.status(200).json({
      page,
      pageSize,
      totalRecords,
      reports: modifiedResults,
    });
  } catch (error) {
    const err = error as Error;
    logger.error(`Error: ${err.message}\nStack: ${err.stack}`);
    throw new Error("Internal server error");
  }
});
const getScans = asyncHandler(async (req: Request, res: Response) => {
  const {
    userUniqueId,
    numberOfRows,
    isReported,
    searchPatientName = "",
  } = req.query;

  console.log("userUniqueId:", userUniqueId);
  console.log("numberOfRows:", numberOfRows);
  console.log("isReported:", isReported);
  console.log("searchPatientName:", searchPatientName);

  try {
    // Function to get scans from the database
    async function fetchScans() {
      try {
        // const pool = await mssql.connect(config);

        let patientNameFilter = "";
        const filter = getPatientNameSearchFilter(searchPatientName as string);

        if (filter) {
          patientNameFilter = " AND " + filter;
        }

        const query1 = `
          SELECT TOP (${numberOfRows}) * 
          FROM (
            SELECT 
              p.Patient_Unique_id_n,
              s.Study_Unique_Id_n,
              s.Study_Date_dt,
              s.Study_Id_nc,
              s.User_Unique_id_n AS UploadUserUniqueId,
              p.Patient_Name_nvc,
              p.Patient_Id_nvc,
              a.User_Unique_Id_n AS AssigneeId,
              CAST((CASE WHEN s.Study_Status_n = 20 THEN 1 ELSE 0 END) AS BIT) AS IsReported,
              i.Inst_name_vc
            FROM cmr_study_info_mst s
            INNER JOIN cmr_inst_master i ON s.Inst_Id_n = i.Inst_Id_n
            INNER JOIN cmr_patient_info_mst p ON p.Patient_Unique_id_n = s.Patient_Id_n
            INNER JOIN cmr_assign_study_dr a ON s.Study_Unique_Id_n = a.Study_Unique_Id_n
            INNER JOIN cmr_user_roles ur ON a.User_Unique_Id_n = ur.User_Unique_Id_n
            INNER JOIN cmr_role_master rm ON rm.Role_Id_n = ur.Role_Id_n
            WHERE a.User_Unique_id_n = ? 
              AND Study_Deleted_YN_c = 'N' 
              AND (rm.Role_name_vc = 'Radiologist' OR rm.Role_name_vc = 'Consultant')
              ${patientNameFilter}
          ) AS sl 
          WHERE sl.IsReported = ? 
          ORDER BY sl.Study_Unique_Id_n DESC
        `;

        const result = await query(query1, [
          userUniqueId, // User Unique ID
          isReported === "True" ? 1 : 0, // Convert isReported to numeric
        ])

        const scans = [];

        for (const row of result) {
          const userQuery = `
            SELECT 
              User_Fname_vc, 
              User_Phone_nvc 
            FROM cmr_user_master 
            WHERE User_Unique_Id_n = ?
          `;
          const user = await query(userQuery, [row.UploadUserUniqueId])
            

          const scanId = row.Study_Id_nc?.trim();
          const autoInterpretation = getAutoInterpretation(scanId);

          row.ScanId = scanId;
          row.UploadUserName = user[0]?.User_Fname_vc;
          row.UploadUserMobileNum = user[0]?.User_Phone_nvc;
          row.Interpretation = autoInterpretation.Interpretation;
          row.EcgPatientHistory = getECGPatientHistory(
            parseInt(row.Patient_Unique_id_n)
          );

          const ecgImageFolderName = process.env.ECG_IMG_FOLDER_NAME!;
          const imageFolderRootUrl = process.env.IMAGE_ROOT_URL!;
          row.ImageUrl = getECGImageUrl(
            scanId,
            imageFolderRootUrl,
            ecgImageFolderName,
            ".gif"
          );

          // scans.push(mapScanInfo(row));
          scans.push(row);
        }

        return scans;
      } catch (error) {
        console.error("Error fetching scans:", error);
        throw new Error("Database query failed");
      }
    }

    const scans = await fetchScans();
    res.send(scans.map((scan) => scan.Patient_Id_nvc)); // Assuming you want to return Patient_Id_nvc
  } catch (error) {
    const err = error as Error;
    logger.error(`Error: ${err.message}\nStack: ${err.stack}`);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Helper functions that you need to implement
function getPatientNameSearchFilter(patientName: string): string {
  if (patientName) {
    const filter =
      "(Ext_FirstName_vc like " +
      getLikeQueryString(patientName) +
      " OR " +
      "Ext_MiddleName_vc like " +
      getLikeQueryString(patientName) +
      " OR " +
      "Ext_LastName_vc like " +
      getLikeQueryString(patientName) +
      ")";

    return filter;
  }
  return "";
}
function getLikeQueryString(queryParam: string) {
  return "'%" + queryParam + "%'";
}

function getAutoInterpretation(scanId: string) {
  return { Interpretation: "" };
}

function getECGPatientHistory(patientUniqueId: number) {
  return {};
}

function getECGImageUrl(
  scanId: string,
  rootUrl: string,
  folderName: string,
  extension: string
): string {
  return `${rootUrl}/${folderName}/${scanId}${extension}`;
}

const updateECGPatientTestsRecord = asyncHandler(
  async (req: Request, res: Response) => {
    const { PatientID, ReferralDoctor } = req.body;

    if (!PatientID) {
      res.status(400);
      throw new Error("PatientId is required");
    }

    console.log(
      `UpdateECGPatientTestsRecord: patientID: ${PatientID} ref: ${ReferralDoctor}`
    );

    res.status(200);
    res.json({
      Response: "Process of updating has been initiated",
      IsSuccess: true,
      UserID: 0,
    });

    try {
      setTimeout(async () => {
        try {
          // const pool = await mssql.connect(config);

          // Check if there's a record for the given PatientId within the last 10 minutes
          // Assuming that after 30 seconds ECG TEST Record table for the scan will be created
          const checkRecordQuery = `
  SELECT ID
  FROM ecg_patient_tests_record
  WHERE PatientId = ?
  ORDER BY CreatedTime DESC
  LIMIT 1
`;
const record = await query(checkRecordQuery, [PatientID]);


          if (record.length === 0) {
            logger.error(
              `No recent record found for this PatientId: ${PatientID}`
            );
            return;
          }

          const latestRecordId = record[0].ID;

          // Construct the update query with only provided fields
const updateQuery = `
  UPDATE ecg_patient_tests_record
  SET referralDoctor = ?
  WHERE ID = ?
`;

const request = await query(updateQuery, [ReferralDoctor, latestRecordId]);


          logger.info(
            `referralDoctor field has been updated ${ReferralDoctor} for ${PatientID}`
          );
        } catch (error) {
          logger.error(`Error while updating record: ${error}`);
        }
      }, 30 * 1000); // 30 seconds

      return;
    } catch (error) {
      const err = error as Error;
      logger.error(`Error: ${err.message}\n Stack: ${err.stack}`);
    }
  }
);

const getScanLegacyCode = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const {
      numberOfRows,
      isReported,
      searchPatientName,
      showAllRecords,
      pageSize,
      pageNumber,
    } = req.query;

    console.log(req.query);
    console.log("pageSize, pageNumber: ", pageSize, pageNumber);
    const numericIsReported = isReported === "True" ? 1 : 0;
    console.log(numericIsReported, "numericIsReported");
    
    try {
      // First check if we should use the numberOfRows path
      if (numberOfRows && !pageSize && !pageNumber) {
        console.log("going to execute without pagination");
        
        type scanType = {
          StudyUniqueId: number;
          ScanId: string;
          PatientName: string;
          PatientID: string | null;
          StudyDate: Date;
          IsReported: Boolean;
          AssigneeId: number;
          UploadUserName: string;
          UploadUserMobileNum: string | null;
          PatientHistory: string | null;
          ImageUrl: string;
          Interpretation: string | null;
          InstitutionName: string;
          IsAbnormal: Boolean;
        };

        const startTime = performance.now();
        const userGuid = req?.user?.userGuid;
        const userName = req?.user?.userName;
        console.log("username: ", userName);

        async function fetchScans() {
          try {
            const queryToGetRole = `
              SELECT crm.Role_name_vc, userM.User_Unique_Id_n 
              FROM cmr_user_master userM 
              INNER JOIN cmr_user_roles cur ON cur.User_Unique_Id_n = userM.User_Unique_Id_n 
              INNER JOIN cmr_role_master crm ON crm.Role_Id_n = cur.Role_Id_n   
              WHERE User_GUID_nvc = ?;
            `;

            const resultsQueryToGetRole = await query(queryToGetRole, [userGuid]);

            if (resultsQueryToGetRole.length === 0) {
              res.status(500);
              throw new Error("Can't find cardiologist");
            }

            const role = resultsQueryToGetRole[0].Role_name_vc;
            const uniqueUserID: number = resultsQueryToGetRole[0].User_Unique_Id_n;

            const queryToFindUserId = `SELECT * FROM cmr_user_master WHERE User_name_vc = ?`;
            const userStartTime = performance.now();
            const user = await query(queryToFindUserId, [userName]);
            console.log("user query time: ", performance.now() - userStartTime);

            let patientNameFilter = "";
            const filter = getPatientNameSearchFilter(searchPatientName as string);
            if (filter) {
              patientNameFilter = " AND " + filter;
            }

            const ImageRootUrl = process.env.ECG_IMG_FOLDER_NAME!;
            const ecgImageFolderName = process.env.IMAGE_ROOT_URL!;

            const newQueryToFindScans = `
  WITH ScanData AS (
    SELECT 
      s.Study_Unique_Id_n AS StudyUniqueId, 
      DATE_FORMAT(s.Study_Date_dt, '%Y-%m-%dT%H:%i:%s') AS StudyDate,
      LTRIM(RTRIM(s.Study_Id_nc)) AS ScanId,
      p.Patient_Name_nvc AS PatientName,
      p.Patient_Id_nvc AS PatientID,
      a.User_Unique_Id_n AS AssigneeId,
      IFNULL(interpretation.Interpretation, '') AS Interpretation,
      CASE WHEN s.Study_Status_n = 20 THEN 1 ELSE 0 END AS IsReported,
      i.Inst_name_vc AS InstitutionName,
      cmr.User_Fname_vc AS UploadUserName,
      cmr.User_Phone_nvc AS UploadUserMobileNum,
      IFNULL(epc.HistoryCondition_id_n, '\\n') AS PatientHistory,
      interpretation.IsAbnormal,
      rm.Role_name_vc AS Role,
      CONCAT(
        '${ecgImageFolderName}', 
        '/', 
        '${ImageRootUrl}', 
        '/',
        SUBSTRING_INDEX(Inst_Img_Archive_Top_Path_vc, '/', -1),
        '/ECGImages/', 
        LTRIM(RTRIM(s.Study_Id_nc)), 
        '.gif'
      ) AS ImageUrl,
      ROW_NUMBER() OVER (PARTITION BY s.Study_Unique_Id_n ORDER BY ur.User_Unique_Id_n) AS rn
    FROM cmr_study_info_mst s
    LEFT JOIN cmr_inst_master i ON s.Inst_Id_n = i.Inst_Id_n
    LEFT JOIN cmr_patient_info_mst p ON p.Patient_Unique_id_n = s.Patient_Id_n
    LEFT JOIN cmr_assign_study_dr a ON s.Study_Unique_Id_n = a.Study_Unique_Id_n
    LEFT JOIN cmr_user_roles ur ON a.User_Unique_Id_n = ur.User_Unique_Id_n
    LEFT JOIN cmr_role_master rm ON rm.Role_Id_n = ur.Role_Id_n
    LEFT JOIN ecg_autointerpretation interpretation ON s.Study_Id_nc = interpretation.ScanId
    LEFT JOIN cmr_inst_config_info instConfig ON instConfig.Inst_Id_n = i.Inst_Id_n
    LEFT JOIN cmr_user_master cmr ON cmr.User_Unique_Id_n = s.User_Unique_Id_n
    LEFT JOIN ecg_patienthistory_conditions epc ON epc.Patient_Unique_id_n = s.Patient_Id_n
    WHERE 
      s.Inst_Id_n IN (
        SELECT Inst_Id_n 
        FROM cmr_user_institutes 
        WHERE 
          User_Unique_Id_n = ? AND 
          User_Inst_deleted_YN_c = 'N'
      )
      AND s.Study_Deleted_YN_c = 'N'
  )
  SELECT *
  FROM ScanData
  WHERE rn = 1 AND IsReported = ?
  ORDER BY StudyUniqueId DESC
  LIMIT ?;
`;
const limitValue = parseInt(numberOfRows as string, 10) || 10;

            const scanResults = await query(newQueryToFindScans, [
              uniqueUserID,
              numericIsReported,
              limitValue
            ]);

            return scanResults;
          } catch (error) {
            console.error("Error fetching scans:", error);
            throw new Error("Database query failed");
          }
        }

        const scans = await fetchScans();
        console.log("TOTAL TIME ", performance.now() - startTime);

        res.json({
          Response: JSON.stringify(scans),
          IsSuccess: true,
          UserID: 0,
        });
        return;
      }

      // Pagination path
      if (!isReported || !showAllRecords) {
        res.status(400).json({ error: "Supply the required url parameters correctly!" });
        return;
      }

      const pageSizeNum = parseInt(pageSize as string) || 10;
      const pageNumberNum = parseInt(pageNumber as string) || 1;
      const offset = (pageNumberNum - 1) * pageSizeNum;

      const userGuid = req?.user?.userGuid;
      const userName = req?.user?.userName;
      console.log("username: ", userName);

      const queryToFindUserId = `SELECT * FROM cmr_user_master WHERE User_name_vc = ?`;
      const user = await query(queryToFindUserId, [userName]);

      if (user.length === 0) {
        res.status(404).json({ error: "Cannot find cardiologist" });
        return;
      }

      let patientNameFilter = "";
      const filter = getPatientNameSearchFilter(searchPatientName as string);
      if (filter) {
        patientNameFilter = " AND " + filter;
      }

      // Count query
      const countQuery = `
        SELECT COUNT(*) as TotalCount
        FROM cmr_study_info_mst s
        INNER JOIN cmr_inst_master i ON s.Inst_Id_n = i.Inst_Id_n
        INNER JOIN cmr_patient_info_mst p ON p.Patient_Unique_id_n = s.Patient_Id_n
        LEFT JOIN cmr_assign_study_dr a ON s.Study_Unique_Id_n = a.Study_Unique_Id_n
        INNER JOIN cmr_user_roles ur ON a.User_Unique_Id_n = ur.User_Unique_Id_n
        INNER JOIN cmr_role_master rm ON rm.Role_Id_n = ur.Role_Id_n
        INNER JOIN ecg_autointerpretation interpretation ON s.Study_Id_nc = interpretation.ScanId
        INNER JOIN cmr_inst_config_info instConfig ON instConfig.Inst_Id_n = i.Inst_Id_n
        LEFT JOIN cmr_user_master cmr ON cmr.User_Unique_Id_n = s.User_Unique_Id_n
        LEFT JOIN ecg_patienthistory_conditions epc ON epc.Patient_Unique_id_n = s.Patient_Id_n
        WHERE a.User_Unique_id_n = ? 
          AND Study_Deleted_YN_c = 'N'
          AND (rm.Role_name_vc = 'Radiologist' OR rm.Role_name_vc = 'Consultant')
          ${patientNameFilter}
          AND (CASE WHEN s.Study_Status_n = 20 THEN 1 ELSE 0 END) = ?
      `;

      const countResult = await query(countQuery, [
        user[0].User_Unique_Id_n,
        numericIsReported,
      ]);
       
      console.log(user[0].User_Unique_Id_n);
      const totalCount = countResult[0].TotalCount;
      const totalPages = Math.ceil(totalCount / pageSizeNum);

      const queryToFindScans = `
        WITH ScanData AS (
          SELECT 
            s.Study_Unique_Id_n AS StudyUniqueId, 
            DATE_FORMAT(s.Study_Date_dt, '%Y-%m-%dT%H:%i:%s') AS StudyDate,
            LTRIM(RTRIM(s.Study_Id_nc)) AS ScanId,
            p.Patient_Name_nvc AS PatientName,
            p.Patient_Id_nvc AS PatientID,
            a.User_Unique_Id_n AS AssigneeId,
            IFNULL(interpretation.Interpretation, '') AS Interpretation,
            CASE WHEN s.Study_Status_n = 20 THEN 1 ELSE 0 END AS IsReported,
            i.Inst_name_vc AS InstitutionName,
            cmr.User_Fname_vc AS UploadUserName,
            cmr.User_Phone_nvc AS UploadUserMobileNum,
            IFNULL(epc.HistoryCondition_id_n, '\\n') AS PatientHistory,
            interpretation.IsAbnormal,
            CONCAT(
              '${process.env.IMAGE_ROOT_URL}', '/', '${process.env.ECG_IMG_FOLDER_NAME}', '/', 
              SUBSTRING_INDEX(Inst_Img_Archive_Top_Path_vc, '/', -1),
              '/ECGImages/', LTRIM(RTRIM(s.Study_Id_nc)), '.gif'
            ) AS ImageUrl,
            ROW_NUMBER() OVER (PARTITION BY s.Study_Unique_Id_n ORDER BY ur.User_Unique_Id_n) AS rn,
            ROW_NUMBER() OVER (ORDER BY s.Study_Unique_Id_n DESC) AS RowNum
          FROM cmr_study_info_mst s
          LEFT JOIN cmr_inst_master i ON s.Inst_Id_n = i.Inst_Id_n
          LEFT JOIN cmr_patient_info_mst p ON p.Patient_Unique_id_n = s.Patient_Id_n
          LEFT JOIN cmr_assign_study_dr a ON s.Study_Unique_Id_n = a.Study_Unique_Id_n
          LEFT JOIN cmr_user_roles ur ON a.User_Unique_Id_n = ur.User_Unique_Id_n
          LEFT JOIN cmr_role_master rm ON rm.Role_Id_n = ur.Role_Id_n
          LEFT JOIN ecg_autointerpretation interpretation ON s.Study_Id_nc = interpretation.ScanId
          LEFT JOIN cmr_inst_config_info instConfig ON instConfig.Inst_Id_n = i.Inst_Id_n
          LEFT JOIN cmr_user_master cmr ON cmr.User_Unique_Id_n = s.User_Unique_Id_n
          LEFT JOIN ecg_patienthistory_conditions epc ON epc.Patient_Unique_id_n = s.Patient_Id_n
          WHERE 
            s.Inst_Id_n IN (
              SELECT Inst_Id_n 
              FROM cmr_user_institutes 
              WHERE 
                User_Unique_Id_n = ? AND 
                User_Inst_deleted_YN_c = 'N'
            )
            AND s.Study_Deleted_YN_c = 'N'
        )
        SELECT *
        FROM ScanData
        WHERE rn = 1 AND IsReported = ?
        ORDER BY RowNum
        LIMIT ? OFFSET ?;
      `;

      const scanResults = await query(queryToFindScans, [
        user[0].User_Unique_Id_n,
        numericIsReported,
        pageSizeNum,
        offset
      ]);

      res.json({
        Response: JSON.stringify(scanResults),
        Pagination: {
          totalCount,
          totalPages,
          currentPage: pageNumberNum,
          pageSize: pageSizeNum,
          hasNextPage: pageNumberNum < totalPages,
          hasPreviousPage: pageNumberNum > 1,
        },
        IsSuccess: true,
        UserID: 0,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(`Error: ${err.message}\n Stack: ${err.stack}`);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);


const uploadscanforpatientget = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const { scanid, patientid, instGUID, userid, filename } = req.query;
    console.log(scanid, patientid, instGUID, userid, filename);
    console.log("req.user: ", req.query);
    if (!scanid || !patientid || !instGUID || !userid || !filename) {
      res.status(400).json({
        Response: "Please supply scanid, patientid, instGUID, userid, filename",
        IsSuccess: false,
        UserID: 0,
      });
      return;
    }

    try {
      const fileExtensionRegex = /\.(jpg|jpeg|png|tiff|pdf|bmp|gif)$/i;

      if (
        !filename ||
        typeof filename !== "string" ||
        !fileExtensionRegex.test(filename)
      ) {
        res.status(400).json({
          Response: "File type not supported",
          IsSuccess: false,
          UserID: 0,
        });
        return;
      }

      // const pool = await mssql.connect(config);
      const study = await fetchStudy(String(scanid));
      if (study) {
        res.status(400).json({
          Response: `Duplicate ScanId, ScanId ${scanid} already exists`,
          IsSuccess: false,
          UserID: 0,
        });
        return;
      }

      const DCIM_CONVERSION_API_URL = "http://dev2.heartnetnetindiademo.in/ecgapiAdvance/python-dicom";

      const outfileName = process.env.GATEWAY_SCAN_FOLDER
      console.log("outfileName: ", outfileName);
      const patientDetailsQuery = `select * from cmr_patient_info_mst where Patient_Unique_id_n = ?`;

      const patientDetailRecord = await query(patientDetailsQuery, [patientid])
      console.log("patientDetailRecord: ", patientDetailRecord);
      if (patientDetailRecord.length === 0) {
        console.log("patent details not found");
      }
const patientRow = patientDetailRecord[0]; // safe as you've checked length

const patientDetails = {
  Age: "", // You can calculate from DOB if needed
  Alerts: "",
  BloodGroup: patientRow.Patient_BloodGroup_vc,
  CurrentSeriesInstanceUID: "SERIESUID",
  STudyInstanceUID: "STUDYUID",
  DOB: patientRow.Patient_Date_Of_Birth_dt || new Date(),
  IsImage: true,
  Gender: patientRow.Patient_Gender_c || "Unknown",
  InstitutionName: "", // Not present in patientRow, default to blank
  Modality: "PDF",
  MotherName: patientRow.mother_name_nvc || "",
  PatientID: patientRow.Patient_Id_nvc || "",
  PatientName: patientRow.Patient_Name_nvc || "",
  PrevHistory: patientRow.Ext_Patient_MedicalHistory || "",
  ReferringPhysician: "",
  StudyDate: new Date(),
  StudyTime: new Date(),
  StudyID: scanid,
  DocType: "",
  StudyComments: "ECG",
};

       const currentTime = new Date().toISOString();

      console.log("patientDetails:  going to call pydicom api",patientDetails,currentTime);
      // need userid to calculate userGUID
      // await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("call dicom api",new Date().toISOString())
await axios.get(DCIM_CONVERSION_API_URL, {
  params: {
    ScanId: scanid,
    PatientId: patientid,
    InstGUID: instGUID,
    UserId: userid, // ✅ Add this
    FileName: filename,
    OutputFilePath: outfileName,
    PatientDetails: JSON.stringify(patientDetails),
    
  },
});


      res.send("Ok");
    } catch (error) {
      const err = error as Error;
      logger.error(`Error: ${err.message}\n Stack: ${err.stack}`);
      throw new Error("Internal server error");
    }
  }
);

const scanwithoutGrid = asyncHandler(async (req: Request, res: Response) => {
  try {
    // Look in the directory gif_files_without_grids if not found then create the gif files
    const { scanId } = req.params;

    if (!scanId) {
      res.status(400).json({
        Response: "Please supply scanId",
        IsSuccess: false,
        UserID: 0,
      });
      return;
    }

    console.log("scanID: ", scanId);

    // filename format = "0000000302-18-09-2024-12-49-45_nasanappphysician.ecg";
    const files = fs.readdirSync(process.env.ECG_STORAGE_PATH!);

    const filename = files.find(
      (file) => file.startsWith(scanId) && file.endsWith(".ecg")
    );

    console.log("matchedFile: ", filename);
    if (!filename) {
      res.status(404).json({
        Response: ".ecg file not found on server",
        IsSuccess: false,
        UserID: 0,
      });
      return;
    }

    console.log("root dir:", rootDirPath);
    // creating the gifFileName from ecg filename
    const gifFileName = `${filename.split(".ecg")[0]}.gif`;

    const gifFilesWithoutGridsPath = path.join(
      rootDirPath,
      "ecg_gif_files_without_grids"
    );

    if (!fs.existsSync(gifFilesWithoutGridsPath)) {
      // Create the folder 'gif_files_without_grids' in root
      fs.mkdirSync(gifFilesWithoutGridsPath);
    }

    if (
      fs.existsSync(
        path.join(rootDirPath, "ecg_gif_files_without_grids", gifFileName)
      )
    ) {
      console.log("gif file exist");
      // return the path or else

      const gifUrl = `${process.env.APP_BASE_URL}/ecgapiAdvance/public/${gifFileName}`;
      res.status(200).json({
        Response: gifUrl,
        IsSuccess: true,
        UserID: 0,
      });
      return;
    }

    const ECG_DIR_PATH = path.join(process.env.ECG_STORAGE_PATH!);
    console.log(ECG_DIR_PATH);

    console.log("file read?");
    // const ecgData = readPatIDFromECGFile(ecgPath);
    const amplifierID = filename.slice(0, filename.indexOf("-"));
    // try {

    deviceInfoAPI(amplifierID)
      .then((deviceInfoResponse: any) => {
        if (deviceInfoResponse.status !== 200) {
          logger.error(deviceInfoResponse);
          res.status(500);
          res.json({
            Resonse: deviceInfoResponse,
            IsSuccess: false,
            UserID: 0,
          });
          return;
          // return Promise.reject(deviceInfoResponse);
        }

        const deviceInfo = JSON.parse(deviceInfoResponse.data.Response);
        if (!deviceInfoResponse.data.IsSuccess) {
          logger.error(deviceInfo);
          res.status(500);
          res.json({
            Resonse: deviceInfo,
            IsSuccess: false,
            UserID: 0,
          });
          return;
          // return Promise.reject(deviceInfo);
        }

        const username = deviceInfo.PhysicianName;
        const password = deviceInfo.PhysicianPassword;

        loginAPI(username, password)
          .then((loginCredentials: any) => {
            logger.info("Login Successful for user: " + username);

            const ecgFileFullPath = path.join(
              process.env.ECG_STORAGE_PATH!,
              filename
            );
            const ecgData = readFromECGFile(ecgFileFullPath);
            generateImage(
              loginCredentials.token,
              ECG_DIR_PATH,
              ecgData,
              username,
              gifFileName
            )
              .then(() => {
                console.log("Generation of image complete");

                const gifUrl3 = `${req.protocol}://${req.get(
                  "host"
                )}/public/${gifFileName}`;

                const gifUrl = `${process.env.APP_BASE_URL}/ecgapiAdvance/public/${gifFileName}`;
                res.status(200).json({
                  Response: gifUrl,
                  IsSuccess: true,
                  UserID: 0,
                });
              })
              .catch((err) => {
                logger.error("Upload failed: " + err);
                return Promise.reject(err);
              });
          })
          .catch((err) => {
            logger.error("Login failed: " + err);
            return Promise.reject(err);
          });
      })
      .catch((err) => {
        logger.error("Failed to retrieve Device Info. \n" + err);
        logger.error(`Error: ${err.message}\n Stack: ${err.stack}`);
        // return Promise.reject(err);
        res.status(500);
        res.json({
          Resonse: err.message,
          IsSuccess: false,
          UserID: 0,
        });
        return;
      });
  } catch (error) {
    console.log("Error: ", error);
  }
});

export {
  getECGData,
  getScans,
  getReports,
  updateECGPatientTestsRecord,
  getScanLegacyCode,
  uploadscanforpatientget,
  scanwithoutGrid,
};



// Data query
      // const queryToFindScansOLD = `
      //   SELECT 
      //     s.Study_Unique_Id_n as StudyUniqueId, 
      //     s.Study_Date_dt as StudyDate,
      //     LTRIM(RTRIM(s.Study_Id_nc)) as ScanId,
      //     p.Patient_Name_nvc as PatientName,
      //     p.Patient_Id_nvc as PatientID,
      //     a.User_Unique_Id_n AS AssigneeId,
      //     ISNULL(interpretation.Interpretation,'') as Interpretation,
      //     CAST((CASE WHEN s.Study_Status_n = 20 THEN 1 ELSE 0 END) AS BIT) AS IsReported,
      //     i.Inst_name_vc as InstitutionName,
      //     cmr.User_Fname_vc as UploadUserName,
      //     cmr.User_Phone_nvc as UploadUserMobileNum,
      //     ISNULL(epc.HistoryCondition_id_n,'\n') as PatientHistory,
      //     interpretation.IsAbnormal,
      //     '${process.env.IMAGE_ROOT_URL}' + '/' + '${process.env.ECG_IMG_FOLDER_NAME}' + '/' +
      //     SUBSTRING(
      //       Inst_Img_Archive_Top_Path_vc, 
      //       LEN(Inst_Img_Archive_Top_Path_vc) 
      //       - CHARINDEX('\', REVERSE(Inst_Img_Archive_Top_Path_vc)) + 2, 
      //       LEN(Inst_Img_Archive_Top_Path_vc)
      //     ) + '/ECGImages/' + LTRIM(RTRIM(s.Study_Id_nc)) + '.gif' AS ImageUrl
      //   FROM cmr_study_info_mst s
      //   INNER JOIN cmr_inst_master i ON s.Inst_Id_n = i.Inst_Id_n
      //   INNER JOIN cmr_patient_info_mst p ON p.Patient_Unique_id_n = s.Patient_Id_n
      //   INNER JOIN cmr_assign_study_dr a ON s.Study_Unique_Id_n = a.Study_Unique_Id_n
      //   INNER JOIN cmr_user_roles ur ON a.User_Unique_Id_n = ur.User_Unique_Id_n
      //   INNER JOIN cmr_role_master rm ON rm.Role_Id_n = ur.Role_Id_n
      //   INNER JOIN ecg_autointerpretation interpretation ON s.Study_Id_nc = interpretation.ScanId
      //   INNER JOIN cmr_inst_config_info instConfig ON instConfig.Inst_Id_n = i.Inst_Id_n
      //   LEFT JOIN cmr_user_master cmr ON cmr.User_Unique_Id_n = s.User_Unique_Id_n
      //   LEFT JOIN ecg_patienthistory_conditions epc ON epc.Patient_Unique_id_n = s.Patient_Id_n
      //   WHERE a.User_Unique_id_n = ? 
      //     AND Study_Deleted_YN_c = 'N'
      //     AND (rm.Role_name_vc = 'Radiologist' OR rm.Role_name_vc = 'Consultant')
      //     ${patientNameFilter}
      //     AND (CASE WHEN s.Study_Status_n = 20 THEN 1 ELSE 0 END) = ?
      //   ORDER BY s.Study_Unique_Id_n DESC
      //   OFFSET ? ROWS
      //   FETCH NEXT ? ROWS ONLY;
      // `;