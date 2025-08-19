module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    "users",
    {
      name: {
        type: Sequelize.STRING,
      },
      username: {
        type: Sequelize.STRING,
        unique: true,
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
      },
      hospitalId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      phoneNumber: {
        type: Sequelize.BIGINT,
        unique: true,
      },
      countryCode: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      password: {
        type: Sequelize.STRING,
      },
      language: {
        type: Sequelize.STRING,
        defaultValue: "en",
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: "active",
      },
      loggedInStatus: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      overlimit: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      timestamps: true, // Ensure createdAt and updatedAt are automatically managed
    }
  );
  return User;
};
