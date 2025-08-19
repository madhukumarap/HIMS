const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const SelectedTestForHealthPackageModel = sequelize.define(
    "SelectedTestForhealthPackageModel",
    {
      TestName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      testType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      TestId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      TestPackageID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    }
  );

  return SelectedTestForHealthPackageModel;
};
