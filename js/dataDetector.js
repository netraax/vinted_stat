// Fonctions d'extraction des données
function extractNumber(text, pattern) {
    const match = text.match(pattern);
    return match ? parseInt(match[1]) : 0;
}

function analyzeData(text) {
    // Base qui fonctionne
    const evaluations = extractNumber(text, /\((\d+)\)\nÉvaluations/);
    const followers = extractNumber(text, /(\d+)\nAbonnés/);
    const sales = Math.floor(evaluations * 0.9); // Règle des -10%

    // Nouvelles extractions
    const prices = extractPrices(text);
    const averagePrice = prices.length > 0 
        ? prices.reduce((a, b) => a + b, 0) / prices.length 
        : 0;

    return {
        // Données de base qui fonctionnent
        sales: sales,
        evaluations: evaluations,
        followers: followers,
        
        // Nouvelles données
        financials: {
            averagePrice: averagePrice,
            estimatedRevenue: averagePrice * sales
        }
    };
}

// Extraction des prix
function extractPrices(text) {
    const prices = [];
    const priceRegex = /prix : (\d+,\d+) €/g;
    let match;

    while ((match = priceRegex.exec(text)) !== null) {
        const price = parseFloat(match[1].replace(',', '.'));
        if (!isNaN(price)) {
            prices.push(price);
        }
    }

    return prices;
}
