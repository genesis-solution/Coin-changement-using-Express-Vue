const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        fromCurrency: { type: DataTypes.STRING, allowNull: false },
        toCurrency: { type: DataTypes.STRING, allowNull: false },
        rate: { type: DataTypes.STRING, allowNull: false }
    };

    const options = {};

    return sequelize.define('Conversion', attributes, options);
}