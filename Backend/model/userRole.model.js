const { Sequelize } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const UserRole = sequelize.define("user_roles", {
    roleId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    userId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
      onUpdate: Sequelize.NOW
    }
  }, {
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['roleId', 'userId']
      }
    ]
  });

  return UserRole;
};