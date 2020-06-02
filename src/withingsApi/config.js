const oauthConfig = {
    baseURL: 'https://cors-anywhere.herokuapp.com/https://account.withings.com',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
};

const dataConfig = {
    baseURL: 'https://cors-anywhere.herokuapp.com/https://wbsapi.withings.net'
};

export {
    oauthConfig,
    dataConfig
};