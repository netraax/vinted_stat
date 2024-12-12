// Code de base qui fonctionnait
function extractNumber(text, pattern) {
    const match = text.match(pattern);
    return match ? parseInt(match[1]) : 0;
}

function analyzeData(text) {
    // On garde la structure de base qui fonctionnait
    const evaluations = extractNumber(text, /\((\d+)\)\nÉvaluations/);
    const followers = extractNumber(text, /(\d+)\nAbonnés/);
    const sales = Math.floor(evaluations * 0.9); // Règle des -10%

    // On ajoute les nouvelles extractions
    const averagePrice = calculateAveragePrice(text);
    const engagement = calculateEngagement(text);
    const countries = analyzeCountries(text);

    return {
        basic: {
            sales,
            evaluations,
            followers
        },
        financial: {
            averagePrice: averagePrice,
            estimatedRevenue: averagePrice * sales
        },
        engagement: engagement,
        geography: countries
    };
}

// Nouvelles fonctions d'analyse
function calculateAveragePrice(text) {
    const pricePattern = /prix : (\d+,\d+) €/g;
    let match;
    let total = 0;
    let count = 0;

    while ((match = pricePattern.exec(text)) !== null) {
        total += parseFloat(match[1].replace(',', '.'));
        count++;
    }

    return count > 0 ? total / count : 0;
}

function calculateEngagement(text) {
    let totalViews = 0;
    let totalFavorites = 0;
    
    const articlePattern = /Vues : (\d+), Favoris : (\d+)/g;
    let match;

    while ((match = articlePattern.exec(text)) !== null) {
        totalViews += parseInt(match[1]);
        totalFavorites += parseInt(match[2]);
    }

    return {
        views: totalViews,
        favorites: totalFavorites,
        rate: totalViews > 0 ? (totalFavorites / totalViews) * 100 : 0
    };
}

function analyzeCountries(text) {
    const commentPattern = /\nil y a.*?\n(.*?)\n/g;
    const countries = { France: 0, Espagne: 0, Italie: 0 };
    let match;

    while ((match = commentPattern.exec(text)) !== null) {
        const comment = match[1].toLowerCase();
        if (comment.match(/gracias|perfecto|muy/)) countries.Espagne++;
        else if (comment.match(/perfetto|tutto|bellissima/)) countries.Italie++;
        else countries.France++;
    }

    return countries;
}
