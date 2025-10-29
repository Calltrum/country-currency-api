const Country = require('../models/Country');


exports.getStatus = async (req, res) => {
    try {
        const totalCountries = await Country.count();
        const lastRefresh = await Country.getLastRefreshTime();

        res.status(200).json({
            total_countries: totalCountries,
            last_refreshed_at: lastRefresh || null
        });

    } catch (error) {
        console.error('Status error:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
};