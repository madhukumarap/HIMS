module.exports = (sequelize, DataTypes) => {
  const AddDrugToDB = sequelize.define("drugDataBase", {
    medicineName: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    manufacturer: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    saltComposition: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    packaging: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    price: {
      type: DataTypes.FLOAT(5, 2), // 5 total digits with 2 decimal places
      allowNull: true,
    },
    Currency: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    storage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    overview: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    usesBenefits: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    sideEffects: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    howToUse: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    drugWorks: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    safetyAdvice: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    missedDose: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },

    quickTips: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    interactionDrugs: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    patientConcerns: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    userFeedback: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    faqs: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
  });
  return AddDrugToDB;
};
