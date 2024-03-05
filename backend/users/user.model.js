const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        fullName: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false },
        address: { type: DataTypes.STRING, allowNull: true },
        birthday: { type: DataTypes.STRING, allowNull: true },
        password: { type: DataTypes.STRING, allowNull: false },
        ETH_ADDRESS: { type: DataTypes.STRING, allowNull: false },
        ETH_KEYS: { type: DataTypes.STRING, allowNull: false },
        BTC_ADDRESS: { type: DataTypes.STRING, allowNull: false },
        BTC_KEYS: { type: DataTypes.STRING, allowNull: false },
        emailVerified: { type: DataTypes.BOOLEAN, default: false },
        role: { type: DataTypes.INTEGER, default: 0, allowNull: false },
        verifyCode: { type: DataTypes.STRING, allowNull: true },
        status: { type: DataTypes.ENUM('Block', 'Suspend', 'Active'), allowNull: false  },
        is2FA: { type: DataTypes.BOOLEAN }
    };

    const options = {
        defaultScope: {
            // exclude hash by default
            attributes: { exclude: ['password'] }
        },
        scopes: {
            // include hash with this scope
            withHash: { attributes: {}, }
        }
    };

    return sequelize.define('User', attributes, options);
}