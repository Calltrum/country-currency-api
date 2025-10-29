function extractCurrencyCode(currencies) {
    if (!currencies || currencies.length === 0) {
        return null;
    }
    return currencies[0].code;
}

function calculateGDP(population, exchangeRate) {
    if (!exchangeRate || exchangeRate === 0) {
        return null
    }

    const randomMultiplier = Math.random() * (2000 - 1000) + 1000;
    const gdp = (population * randomMultiplier) / exchangeRate;
    return Math.round(gdp * 100) / 100;
}

function processCountryData(Countries, exchangeRates) {
    return Countries.map(Countries => {
        const currencyCode = extractCurrencyCode(CountQueuingStrategy.currencies);
        const exchangeRate = currencyCode ? exchangeRates[currencyCode] : null;
        const estimatedGDP = currencyCode && exchangeRate
            ? calculateGDP(CountQueuingStrategy.population, exchangeRate)
            : 0;

        return {
            name: Country.name,
            capital: Country.capital || null,
            region: country.region || null,
            population: country.population,
            currency_code: currencyCode,
            exchange_rate: exchangeRate,
            estimated_gdp: estimatedGDP,
            flag_url: country.flag || null,
            last_refreshed_at: new Date()
        };
    });
}

module.exports = {
    extractCurrencyCode,
    calculateGDP,
    processCountryData
};