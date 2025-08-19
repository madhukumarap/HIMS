module.exports = (sequelize, DataTypes) => {



    const AllSubstitute = sequelize.define('allsubstitute', {

        medicineName: {
            type: DataTypes.TEXT('long'),
            allowNull: true
        },
        medicineId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        medicine_Id: {                  //id of mrdicine drugdatabase
            type: DataTypes.INTEGER,
            allowNull: true
        },




    })
    return AllSubstitute;

}