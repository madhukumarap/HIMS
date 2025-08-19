module.exports = (sequelize, DataTypes) => {
  const BackupData = sequelize.define("BackupData", {
    filename: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    path: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    user: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    restoredBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "not-restored",
    },
  });
  return BackupData;
};
