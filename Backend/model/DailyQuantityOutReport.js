module.exports = (sequelize, DataTypes) => {



    const DailyQuantityOutReport = sequelize.define('QuantityOutReport', {

        ItemName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        BatchNumber: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        ExpiryDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        UnitPrice: {
            type: DataTypes.FLOAT(5, 2), // 5 total digits with 2 decimal places
            allowNull: true
        },
        Quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        dateOut: {
            type: DataTypes.DATEONLY,
        },
        AverageMonthlyQuantityOut: {
            type: DataTypes.INTEGER
        },
        AverageWeeklyQuantityOut: {
            type: DataTypes.INTEGER
        },


    })
    return DailyQuantityOutReport;

}