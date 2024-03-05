const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        email: { type: DataTypes.STRING },
        usdtReserve: { type: DataTypes.STRING },
        profit: { type: DataTypes.STRING },
        exchangeLimit: { type: DataTypes.BOOLEAN },
        exchangeLimitMessage: { type: DataTypes.TEXT },
        usdtAddress: { type: DataTypes.STRING },
        ethAddress: { type: DataTypes.STRING },
        btcAddress: { type: DataTypes.STRING },
        usdcAddress: { type: DataTypes.STRING },
        bnbAddress: { type: DataTypes.STRING },
        busdAddress: { type: DataTypes.STRING },
        unionbankAccountName: { type: DataTypes.STRING },
        unionbankAccountNo: { type: DataTypes.STRING },
        unionbankBranchAdress: { type: DataTypes.STRING },
        unionbankMobileNo: { type: DataTypes.STRING },
        gcashMobileNo: { type: DataTypes.STRING },
        coinsphMobileNo: { type: DataTypes.STRING },
        smtpHostName: { type: DataTypes.STRING },
        smtpUsername: { type: DataTypes.STRING },
        smtpPassword: { type: DataTypes.STRING },
        smtpPort: { type: DataTypes.STRING },
        smtpSSL: { type: DataTypes.BOOLEAN },
        transactionFee: { type: DataTypes.STRING },
    };

    const options = {};

    return sequelize.define('Adminsetting', attributes, options);
}