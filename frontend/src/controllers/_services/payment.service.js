import { authHeader } from '../_helpers';

const serverURL = 'http://localhost:4000';
const getETHURL = 'http://194.233.77.30:8080/v1/generate/eth';
const getBTCURL = 'http://194.233.77.30:8081/v1/account';

const postBTC = 'https://blockchain.info/balance?active=';

export const paymentService = {
    addPaymentmethod,
    getPaymentMethodsById,
    updatePaymentmethod,
    deletePaymentmethod,
    getConversionPrice,
    // Transction
    createTransaction,
    getTransactionById,
    getMyAllTransaction,
    getTransactions,
    getTotalAmountPerDay,

    getETHAddress,
    getBTCAddress,
    postETHDetect,
    postUSDTDetect,
    postOtherDetect,
    getBTCDetect,
    getExchangeLimit,
    /*
    * API for ADMIN
    */
    getAllTransactions,
    getAllTransactionsByDate,
    getPaymentMethodsByIdAndName,
    updateTransaction,
    fileUpload,
    getAdminsetting,
    updateAdminsetting,
    createAdminsetting,
    getDecryptedKey
};

function getETHAddress() {
    const requestOptions = {
        method: 'GET'
    };

    return fetch(`${getETHURL}`, requestOptions).then(handleResponse);
}

function getBTCAddress() {
    const requestOptions = {
        method: 'GET'
    };

    return fetch(`${getBTCURL}`, requestOptions).then(handleResponse);
}

function postETHDetect(content) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(content)
    };

    return fetch(`${serverURL}/payment/postETHDetect`, requestOptions).then(handleResponse);
}

function postOtherDetect(content) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(content)
    };

    return fetch(`${serverURL}/payment/postOtherDetect`, requestOptions).then(handleResponse);
}

function postUSDTDetect(content) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(content)
    };

    return fetch(`${serverURL}/payment/postUSDTDetect`, requestOptions).then(handleResponse);
}

function getBTCDetect(address) {
    const requestOptions = {
        method: 'GET'
    };

    return fetch(`${postBTC}${address}`, requestOptions).then(handleResponse);
}

function addPaymentmethod(payment) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(payment)
    };

    return fetch(`${serverURL}/payment/addPaymentmethod`, requestOptions).then(handleResponse);
}

function updatePaymentmethod(id, payment) {
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(payment)
    };

    return fetch(`${serverURL}/payment/updatePaymentmethod/${id}`, requestOptions).then(handleResponse);
}

function deletePaymentmethod(id) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader()
    };

    return fetch(`${serverURL}/payment/paymentmethod/${id}`, requestOptions).then(handleResponse);
}

function getPaymentMethodsById(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${serverURL}/payment/paymentmethod/${id}`, requestOptions).then(handleResponse);
}

function getPaymentMethodsByIdAndName(id, name) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${serverURL}/payment/getPaymentmethod/${id}/${name}`, requestOptions).then(handleResponse);
}

function getConversionPrice(symbol) {
    const requestOptions = {
        method: 'GET'
    };

    return fetch(`${serverURL}/payment/getConversionPrice?symbol=${symbol}`, requestOptions).then(handleResponse);
}

function getTotalAmountPerDay(id, date) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${serverURL}/payment/getTotalAmountPerDay?user=${id}&date=${date}`, requestOptions).then(handleResponse);
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}

//////////////////////// Transaction /////////////////////////
function createTransaction(transaction) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(transaction)
    };

    return fetch(`${serverURL}/payment/createTransaction`, requestOptions).then(handleResponse);
}

function updateTransaction(id, transaction) {
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(transaction)
    };

    return fetch(`${serverURL}/payment/updateTransaction/${id}`, requestOptions).then(handleResponse);
}

function getMyAllTransaction(userId) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${serverURL}/payment/getAllTransactions/${userId}`, requestOptions).then(handleResponse);
}

function getAllTransactions() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${serverURL}/payment/getAllTransactionsForAdmin`, requestOptions).then(handleResponse);
}

function getExchangeLimit() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${serverURL}/payment/getExchangeLimit`, requestOptions).then(handleResponse);
}

function getAllTransactionsByDate(dateObj) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(dateObj)
    };

    return fetch(`${serverURL}/payment/getAllTransactionsByDate`, requestOptions).then(handleResponse);
}

function getTransactions() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${serverURL}/payment/getTransactions`, requestOptions).then(handleResponse);
}

function getTransactionById(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${serverURL}/payment/getTransaction/${id}`, requestOptions).then(handleResponse);
}

function fileUpload(file) {
    const formData = new FormData();
    formData.append('transactionFile', file);

    const requestOptions = {
        method: 'POST',
        // headers: { ...authHeader(), 'Content-Type': 'multipart/form-data' },
        headers: {  },
        body: formData
    };

    return fetch(`${serverURL}/payment/fileUpload`, requestOptions).then(handleResponse);
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                logout();
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}

function getAdminsetting() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${serverURL}/payment/getAdminsetting`, requestOptions).then(handleResponse);
}

function updateAdminsetting(id, adminSetting) {
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(adminSetting)
    };

    return fetch(`${serverURL}/payment/updateAdminsetting/${id}`, requestOptions).then(handleResponse);
}

function createAdminsetting(adminSetting) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(adminSetting)
    };

    return fetch(`${serverURL}/payment/createAdminsetting`, requestOptions).then(handleResponse);
}

function getDecryptedKey(keyObj) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(keyObj)
    };

    return fetch(`${serverURL}/payment/getDecryptedKey`, requestOptions).then(handleResponse);
}