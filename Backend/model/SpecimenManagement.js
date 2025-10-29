module.exports = (sequelize, DataTypes) => {
  const SpecimenList = sequelize.define("specimenlists", {
    SpecimenName: {
      type: DataTypes.STRING,
    },
    SpecimenCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },{
    tablename :'specimenlists'
  });

  return SpecimenList;
};
