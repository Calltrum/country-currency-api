const { pool } = require('../config/database');

class Country {
    static async upsert(countryData) {
        const query = `
      INSERT INTO countries 
        (name, capital, region, population, currency_code, exchange_rate, 
         estimated_gdp, flag_url, last_refreshed_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (name) 
      DO UPDATE SET
        capital = EXCLUDED.capital,
        region = EXCLUDED.region,
        population = EXCLUDED.population,
        currency_code = EXCLUDED.currency_code,
        exchange_rate = EXCLUDED.exchange_rate,
        estimated_gdp = EXCLUDED.estimated_gdp,
        flag_url = EXCLUDED.flag_url,
        last_refreshed_at = EXCLUDED.last_refreshed_at
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

        const result = await pool.query(query, values);
        return result;
    }

    static async findAll(filters = {}) {
        let query = 'SELECT * FROM countries WHERE 1=1';
        const params = [];
        let paramIndex = 1;

        if (filters.region) {
            query += ` AND region = $${paramIndex}`;
            params.push(filters.region);
            paramIndex++;
        }

        if (filters.currency) {
            query += ` AND currency_code = $${paramIndex}`;
            params.push(filters.currency);
            paramIndex++;
        }

        if (filters.sort === 'gdp_desc') {
            query += ' ORDER BY estimated_gdp DESC';
        } else if (filters.sort === 'gdp_asc') {
            query += ' ORDER BY estimated_gdp ASC';
        } else {
            query += ' ORDER BY name ASC';
        }

        const result = await pool.query(query, params);
        return result.rows;
    }

    static async findByName(name) {
        const query = 'SELECT * FROM countries WHERE LOWER(name) = LOWER($1)';
        const result = await pool.query(query, [name]);
        return result.rows[0];
    }

    static async deleteByName(name) {
        const query = 'DELETE FROM countries WHERE LOWER(name) = LOWER($1)';
        const result = await pool.query(query, [name]);
        return result.rowCount > 0;
    }

    static async count() {
        const query = 'SELECT COUNT(*) as total FROM countries';
        const result = await pool.query(query);
        return parseInt(result.rows[0].total);
    }

    static async getLastRefreshTime() {
        const query = 'SELECT MAX(last_refreshed_at) as last_refresh FROM countries';
        const result = await pool.query(query);
        return result.rows[0].last_refresh;
    }

    static async getTopByGDP(limit = 5) {
        const query = `
      SELECT name, estimated_gdp 
      FROM countries 
      WHERE estimated_gdp IS NOT NULL
      ORDER BY estimated_gdp DESC 
      LIMIT $1
    `;
        const result = await pool.query(query, [limit]);
        return result.rows;
    }
}

module.exports = Country;