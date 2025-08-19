module.exports = (sequelize, DataTypes) => {



    const HospitalRooms = sequelize.define('hospitalRooms', {

        department: {
            type: DataTypes.TEXT('long'),
            allowNull: true
        },
        name: {
            type: DataTypes.TEXT('long'),
            allowNull: true
        },
        type: {
            type: DataTypes.TEXT('long'),
            allowNull: true
        },
        number: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        number_of_beds: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
        ,
        status: {
            type: DataTypes.STRING,
            allowNull: true
        },
        totalCost: {
            type: DataTypes.INTEGER,
            allowNull: true
        },currency: {
            type: DataTypes.STRING,
            allowNull: true
        },bedCost: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    })
    return HospitalRooms;

}