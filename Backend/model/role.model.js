module.exports = (sequelize, Sequelize) => {
    const Role = sequelize.define("roles", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true, // Set auto-increment to true
        },
        role: {
            type: Sequelize.STRING
        }
    });

    return Role;
};