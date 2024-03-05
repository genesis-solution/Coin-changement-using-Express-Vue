const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        userId: { type: DataTypes.INTEGER, allowNull: false },
        from: { type: DataTypes.STRING, allowNull: false },
        to: { type: DataTypes.STRING, allowNull: false },
        sendAmount: { type: DataTypes.STRING, allowNull: false },
        pricePerUnit: { type: DataTypes.STRING, allowNull: false },
        conversionBetweenUSDPHP: { type: DataTypes.STRING, allowNull: false },
        amount: { type: DataTypes.STRING, allowNull: false },
        orderId: { type: DataTypes.STRING, allowNull: false },
        status: { type: DataTypes.ENUM('Completed', 'Canceled', 'Refunded', 'Processing') },
        image: { type: DataTypes.STRING }
    };

    const options = {};

    return sequelize.define('Transaction', attributes, options);
}