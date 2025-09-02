const axios = require("axios");
const fs = require("fs");
const config = require("../../config/db.config");

function baseUrl(useLocal) {
  const url = useLocal ? config.orthancLocal || "" : config.orthancUrl || "";
  return url.replace(/\/$/, "");
}

function authConfig() {
  if (config.orthancUser && config.orthancPass) {
    return {
      auth: { username: config.orthancUser, password: config.orthancPass },
    };
  }
  return {};
}

async function uploadDicom({ filePath, buffer, useLocal = false }) {
  const url = `${baseUrl(useLocal)}/instances`;
  let data;
  if (buffer) data = buffer;
  else if (filePath) data = fs.readFileSync(filePath);
  else throw new Error("filePath or buffer required");
  const headers = { "Content-Type": "application/dicom" };
  const resp = await axios.post(
    url,
    data,
    Object.assign({ headers, timeout: 60000 }, authConfig())
  );
  return resp.data;
}

async function getInstance(instanceId, useLocal = false) {
  const url = `${baseUrl(useLocal)}/instances/${instanceId}`;
  const resp = await axios.get(
    url,
    Object.assign({ timeout: 60000 }, authConfig())
  );
  return resp.data;
}

async function getInstanceTags(instanceId, useLocal = false) {
  const url = `${baseUrl(useLocal)}/instances/${instanceId}/tags`;
  const resp = await axios.get(
    url,
    Object.assign({ timeout: 60000 }, authConfig())
  );
  return resp.data;
}

async function downloadInstanceFileToStream(instanceId, useLocal = false) {
  const url = `${baseUrl(useLocal)}/instances/${instanceId}/file`;
  const resp = await axios.get(
    url,
    Object.assign({ responseType: "stream", timeout: 60000 }, authConfig())
  );
  return resp;
}

async function getStudy(studyId, useLocal = false) {
  const url = `${baseUrl(useLocal)}/studies/${studyId}`;
  const resp = await axios.get(
    url,
    Object.assign({ timeout: 60000 }, authConfig())
  );
  return resp.data;
}

async function searchStudies(q = {}, useLocal = false) {
  const url = `${baseUrl(useLocal)}/tools/find`;
  const resp = await axios.post(
    url,
    q,
    Object.assign({ timeout: 60000 }, authConfig())
  );
  return resp.data;
}

module.exports = {
  uploadDicom,
  getInstance,
  getInstanceTags,
  downloadInstanceFileToStream,
  getStudy,
  searchStudies,
};
