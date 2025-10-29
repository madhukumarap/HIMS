module.exports = (sequelize, DataTypes) => {
  const LabCategoryList = sequelize.define("labcategorylists", {
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
  },
{
    tablename:'labcategorylists'
});

  return LabCategoryList;
};
