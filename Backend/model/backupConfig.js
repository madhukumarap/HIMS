module.exports = (sequelize, DataTypes) => {
    const BackupConfig = sequelize.define("backupconfigs", {
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
    },{
      tablename :'backupconfigs'
    });
    return BackupConfig;
  };
  