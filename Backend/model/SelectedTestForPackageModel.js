const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const SelectedTestForPackageModel = sequelize.define(
    "SelectedTestForPackageModels",
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
    },
    {
      tablename :'SelectedTestForPackageModels'
    }
  );

  return SelectedTestForPackageModel;
};
