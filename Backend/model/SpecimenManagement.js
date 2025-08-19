module.exports = (sequelize, DataTypes) => {
  const SpecimenList = sequelize.define("SpecimenList", {
    SpecimenName: {
      type: DataTypes.STRING,
    },
    SpecimenCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return SpecimenList;
};
