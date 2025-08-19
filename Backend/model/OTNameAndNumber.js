const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {


    const OTNameAndNumber = sequelize.define('OtNameAndNumber', {

        OTName: {
            type: DataTypes.STRING,
        },
        OTNumber: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

    });

    return OTNameAndNumber;
}