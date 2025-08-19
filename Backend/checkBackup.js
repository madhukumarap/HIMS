const { verifyToken, checkDatabase } = require("./middleware/authJwt");
const db = require("./model/index.model");
const { getConnectionList } = require("./model/index.model3");

const blockRequestsDuringBackup = (req, res, next) => {
     
    // const database = checkDatabase(req)
    // const connectionList = await getConnectionList(database);
    // const db = connectionList[database];

    // getConnectionList(database).then((connectionList)=>{
    //     const db = connectionList[database];

    // })

    // const BackupState = db.

    // if (isBackupInProgress) {
    //   res.status(503).json({ message: 'Service Unavailable during backup' });
    // } else {
    //   next();
    // }
  };

  module.exports = blockRequestsDuringBackup