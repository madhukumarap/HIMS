module.exports = (sequelize, DataTypes) => {
  const OTSchedule = sequelize.define("OTSchedulePatient", {
    otDateTime: {
      type: DataTypes.STRING,
      unique: false,
    },
    UpToOtTime: {
      type: DataTypes.STRING,
    },
    patientName: {
      type: DataTypes.STRING,
    },
    patientId: {
      type: DataTypes.INTEGER,
    },
    patientContactNumber: {
      type: DataTypes.BIGINT,
    },
    guardianName: {
      type: DataTypes.STRING,
    },
    guardianContactNo: {
      type: DataTypes.BIGINT,
    },

    diagnosis: {
      type: DataTypes.TEXT("long"),
    },
    typeOfSurgery: {
      type: DataTypes.TEXT("long"),
    },
    surgeonName: {
      type: DataTypes.STRING,
    },
    surgeonEmail: {
      type: DataTypes.STRING,
    },
    external: {
      type: DataTypes.STRING,
    },
    OTName: {
      type: DataTypes.STRING,
    },
    anesthetistAssistantName: {
      type: DataTypes.STRING,
    },
    anesthesia: {
      type: DataTypes.STRING,
    },
    scrubNurseName: {
      type: DataTypes.STRING,
    },
    remarks: {
      type: DataTypes.TEXT("long"),
    },
    otAssistantName: {
      type: DataTypes.STRING,
    },

    procedure: {
      type: DataTypes.TEXT("long"),
    },
    anesthetistDoctorName: {
      type: DataTypes.STRING,
    },
    admissionID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
  });
  return OTSchedule;
};
