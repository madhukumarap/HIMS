module.exports = (sequelize, DataTypes) => {
    const MedicationDay = sequelize.define('MedicationDay', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        PatientId: {
            type: DataTypes.INTEGER,

        },
        PrescriptionId: {
            type: DataTypes.INTEGER,

        },
        medicineId: {
            type: DataTypes.INTEGER,

        },
        medicineName: {
            type: DataTypes.STRING,

        },
        dosageAmount: {
            type: DataTypes.STRING,

        },
        food: {
            type: DataTypes.STRING,

        },
        morningTime: {
            type: DataTypes.TIME,
        },
        afternoonTime: {
            type: DataTypes.TIME,
        },
        eveningTime: {
            type: DataTypes.TIME,
        },
        nightTime: {
            type: DataTypes.TIME,
        },
        date: {
            type: DataTypes.DATEONLY,
        },
    });

    return MedicationDay;
};
