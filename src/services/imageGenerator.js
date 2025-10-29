const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

async function generateSummaryImage(totalCountries, topCountries, lastRefresh) {
    const width = 800;
    const height = 600;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 40px Arial';
    ctx.fillText('Country API Summary', 50, 80);

    ctx.font = '30px Arial';
    ctx.fillText(`Total Countries: ${totalCountries}`, 50, 150);

    ctx.font = 'bold 28px Arial';
    ctx.fillText('Top 5 Countries by GDP:', 50, 220);

    ctx.font = '22px Arial';
    topCountries.forEach((country, index) => {
        const yPos = 270 + (index * 40);
        ctx.fillText(
            `${index + 1}. ${country.name}: $${country.estimated_gdp.toLocaleString()}`,
            70,
            yPos
        );
    });

    ctx.font = '20px Arial';
    ctx.fillStyle = '#888888';
    ctx.fillText(
        `Last Updated: ${new Date(lastRefresh).toLocaleString()}`,
        50,
        height - 50
    );

    const cacheDir = path.join(__dirname, '../../cache');
    if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
    }

    const imagePath = path.join(cacheDir, 'summary.png');
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(imagePath, buffer);

    return imagePath;
}

module.exports = { generateSummaryImage };