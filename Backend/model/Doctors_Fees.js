const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const DoctorFee = sequelize.define("DoctorFee", {
    doctor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Doctors", // Table name of Doctor model
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    consultationFee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
      validate: { min: 0 },
    },
    consultationCurrency: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: "INR",
    },
    referralFee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.0,
      validate: { min: 0 },
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"),
    },
  });

  // Associations
  DoctorFee.associate = (models) => {
    DoctorFee.belongsTo(models.Doctor, {
      foreignKey: "doctor_id",
      as: "doctor",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  };

  return DoctorFee;
};
