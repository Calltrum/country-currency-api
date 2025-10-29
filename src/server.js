require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { testConnection } = require('./config/database');
const countryRoutes = require('./routes/countryRoutes');
const countryController = require('./controllers/countryController');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

testConnection();

app.get('/', (req, res) => {
    res.json({
        message: 'Country Currency & Exchange API',
        endpoints: {
            refresh: 'POST /countries/refresh',
            get_all: 'GET /countries',
            get_one: 'GET /countries/:name',
            delete: 'DELETE /countries/:name',
            status: 'GET /status',
            image: 'GET /countries/image'
        }
    });
});

app.use('/countries', countryRoutes);
app.get('/status', countryController.getStatus);

app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`🌐 Local: http://localhost:${PORT}`);
});