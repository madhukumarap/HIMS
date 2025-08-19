module.exports = (sequelize, DataTypes) => {
  const BedsHospitalRoom = sequelize.define("BedsHospitalRoom", {
    BedNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    BedType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    BedPrice: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    BedStatus: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    HospitalRoomID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    HospitalRoomNumber: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Currency: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    OccupiedCheckInTime: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    OccupiedCheckOutTime: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    OccupiedAdmissionID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
  });
  return BedsHospitalRoom;
};
