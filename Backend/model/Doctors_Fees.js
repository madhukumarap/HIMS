const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const DoctorFee = sequelize.define("DoctorFee", {
    doctor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "doctor_id", // Explicitly map to the database column
      references: {
        model: "doctors", // Use lowercase to match actual table name
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
      defaultValue: Sequelize.literal(
        "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
      ),
    },
  }, {
    // THESE OPTIONS GO IN THE THIRD PARAMETER, NOT IN FIELD DEFINITIONS
    tableName: "doctor_fees",
    timestamps: true,
  });

  // Associations - use lowercase 'doctor' to match your available models
  DoctorFee.associate = (models) => {
    DoctorFee.belongsTo(models.doctor, { // Changed from models.Doctor to models.doctor
      foreignKey: "doctor_id",
      as: "doctor",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  };

  return DoctorFee;
};