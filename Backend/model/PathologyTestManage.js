const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const PathologyTestManage = sequelize.define("pathologytestmanage", {
    testName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    LabCategoryName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    LabCategoryNameID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    SpecimenName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    SpecimenNameID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    testPrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Currency: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    createdAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  });

  return PathologyTestManage;
};
