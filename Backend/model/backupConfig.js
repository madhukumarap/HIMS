module.exports = (sequelize, DataTypes) => {
    const BackupConfig = sequelize.define("BackupConfig", {
      period: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      day: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      time: {
        type: DataTypes.STRING,
        allowNull: true,
      }
    });
    return BackupConfig;
  };
  