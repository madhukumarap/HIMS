module.exports = (sequelize, DataTypes) => {
  const Medicines = sequelize.define('medicines', {
    prescriptionId: {
      type: DataTypes.STRING,
      allowNull: true, // Updated to allow null values
    },
    prescription_Id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    patient_Id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }
    ,
    InventoryitemNameID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    medicineName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    dosageAmount: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    food: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    weekly: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    timing: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  return Medicines;
};
