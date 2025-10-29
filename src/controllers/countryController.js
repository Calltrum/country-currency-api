const Country = require('../models/Country');
const { fetchCountries, fetchExchangeRates } = require('../services/externalAPI');
const { processCountryData } = require('../services/dataProcessor');
const { generateSummaryImage } = require('../services/imageGenerator');
const path = require('path');

exports.refreshCountries = async (req, res) => {
    try {
        const countries = await fetchCountries();
        const exchangeRates = await fetchExchangeRates();

        const processedData = processCountryData(countries, exchangeRates);

        for (const country of processedData) {
            await Country.upsert(country);
        }

        const totalCountries = await Country.count();
        const topCountries = await Country.getTopByGDP(5);
        const lastRefresh = await Country.getLastRefreshTime();

        await generateSummaryImage(totalCountries, topCountries, lastRefresh);

        res.status(200).json({
            message: 'Countries refreshed successfully',
            total_countries: totalCountries,
            last_refreshed_at: lastRefresh
        });

    } catch (error) {
        console.error('Refresh error:', error);

        if (error.message.includes('Could not fetch')) {
            return res.status(503).json({
                error: 'External data source unavailable',
                details: error.message
            });
        }

        res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
};


exports.getAllCountries = async (req, res) => {
    try {
        const { region, currency, sort } = req.query;

        const countries = await Country.findAll({
            region,
            currency,
            sort
        });

        res.status(200).json(countries);

    } catch (error) {
        console.error('Get all error:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
};


exports.getCountryByName = async (req, res) => {
    try {
        const { name } = req.params;

        const country = await Country.findByName(name);

        if (!country) {
            return res.status(404).json({
                error: 'Country not found'
            });
        }

        res.status(200).json(country);

    } catch (error) {
        console.error('Get country error:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
};


exports.deleteCountry = async (req, res) => {
    try {
        const { name } = req.params;

        const deleted = await Country.deleteByName(name);

        if (!deleted) {
            return res.status(404).json({
                error: 'Country not found'
            });
        }

        res.status(204).send();

    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
};


exports.getStatus = async (req, res) => {
    try {
        const totalCountries = await Country.count();
        const lastRefresh = await Country.getLastRefreshTime();

        res.status(200).json({
            total_countries: totalCountries,
            last_refreshed_at: lastRefresh
        });

    } catch (error) {
        console.error('Status error:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
};


exports.getSummaryImage = (req, res) => {
    try {
        const imagePath = path.join(__dirname, '../../cache/summary.png');

        if (!require('fs').existsSync(imagePath)) {
            return res.status(404).json({
                error: 'Summary image not found'
            });
        }

        res.sendFile(imagePath);

    } catch (error) {
        console.error('Image error:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
};