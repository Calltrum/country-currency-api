const { pool } = require('../config/database');

class Country {
    static async upsert(countryData) {
        const query = `
      INSERT INTO countries 
        (name, capital, region, population, currency_code, exchange_rate, 
         estimated_gdp, flag_url, last_refreshed_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        capital = VALUES(capital),
        region = VALUES(region),
        population = VALUES(population),
        currency_code = VALUES(currency_code),
        exchange_rate = VALUES(exchange_rate),
        estimated_gdp = VALUES(estimated_gdp),
        flag_url = VALUES(flag_url),
        last_refreshed_at = VALUES(last_refreshed_at)
    `;

        const values = [
            countryData.name,
            countryData.capital,
            countryData.region,
            countryData.population,
            countryData.currency_code,
            countryData.exchange_rate,
            countryData.estimated_gdp,
            countryData.flag_url,
            countryData.last_refreshed_at
        ];

        const [result] = await pool.execute(query, values);
        return result;
    }

    static async findAll(filters = {}) {
        let query = 'SELECT * FROM countries WHERE 1=1';
        const params = [];

        if (filters.region) {
            query += ' AND region = ?';
            params.push(filters.region);
        }

        if (filters.currency) {
            query += ' AND currency_code = ?';
            params.push(filters.currency);
        }


        if (filters.sort === 'gdp_desc') {
            query += ' ORDER BY estimated_gdp DESC';
        } else if (filters.sort === 'gdp_asc') {
            query += ' ORDER BY estimated_gdp ASC';
        } else {
            query += ' ORDER BY name ASC';
        }

        const [rows] = await pool.execute(query, params);
        return rows;
    }

    static async findByName(name) {
        const query = 'SELECT * FROM countries WHERE LOWER(name) = LOWER(?)';
        const [rows] = await pool.execute(query, [name]);
        return rows[0];
    }

    static async deleteByName(name) {
        const query = 'DELETE FROM countries WHERE LOWER(name) = LOWER(?)';
        const [result] = await pool.execute(query, [name]);
        return result.affectedRows > 0;
    }

    static async count() {
        const query = 'SELECT COUNT(*) as total FROM countries';
        const [rows] = await pool.execute(query);
        return rows[0].total;
    }

    static async getLastRefreshTime() {
        const query = 'SELECT MAX(last_refreshed_at) as last_refresh FROM countries';
        const [rows] = await pool.execute(query);
        return rows[0].last_refresh;
    }

    static async getTopByGDP(limit = 5) {
        const query = `
      SELECT name, estimated_gdp 
      FROM countries 
      WHERE estimated_gdp IS NOT NULL
      ORDER BY estimated_gdp DESC 
      LIMIT ?
    `;
        const [rows] = await pool.execute(query, [limit]);
        return rows;
    }
}

module.exports = Country;