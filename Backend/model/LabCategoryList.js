module.exports = (sequelize, DataTypes) => {
  const LabCategoryList = sequelize.define("LabCategoryList", {
    CategoryName: {
      type: DataTypes.STRING,
    },
    LabCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return LabCategoryList;
};
