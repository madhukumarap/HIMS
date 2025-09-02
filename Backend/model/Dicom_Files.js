const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Dicom_files = sequelize.define('Dicom_files', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    patientId: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    doctorId: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    consultationId: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    orthancInstanceId: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    orthancStudyId: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'dicom_files', // Change table name if needed
    timestamps: true, // Automatically manages createdAt & updatedAt
    underscored: false,
  });

  return Dicom_files;
};
