const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        userId: { type: DataTypes.INTEGER, allowNull: false },
        selectedCurrency: { type: DataTypes.INTEGER, allowNull: false },
        name: { type: DataTypes.STRING, allowNull: false },
        bankAccountName: { type: DataTypes.STRING },
        bankAccountNo: { type: DataTypes.STRING },
        bankBranch: { type: DataTypes.STRING },
        mobileNo: { type: DataTypes.STRING },
        lastName: { type: DataTypes.STRING },
        firstName: { type: DataTypes.STRING },
        middleName: { type: DataTypes.STRING },
        completeAddress: { type: DataTypes.STRING },
    };

    const options = {};

    return sequelize.define('Paymentmethod', attributes, options);
}