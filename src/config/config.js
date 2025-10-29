require('dotenv').config();

module.exports = {
    port: process.env.PORT || 3000,

    database: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        name: process.env.DB_NAME || 'country_api',
        connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 10
    },

    externalAPIs: {
        countries: 'https://restcountries.com/v2/all?fields=name,capital,region,population,flag,currencies',
        exchangeRates: 'https://open.er-api.com/v6/latest/USD'
    },

    apiTimeout: 15000,

    image: {
        width: 800,
        height: 600,
        outputPath: 'cache/summary.png'
    },

    gdp: {
        minMultiplier: 1000,
        maxMultiplier: 2000
    }
};