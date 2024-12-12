// Fonctions d'extraction des données
function extractNumber(text, pattern) {
    const match = text.match(pattern);
    return match ? parseInt(match[1]) : 0;
}

function analyzeData(text) {
    console.log("Analyse du texte brut:", text.substring(0, 200)); // Debug
    
    return {
        profile: extractProfileInfo(text),
        sales: extractSalesInfo(text),
        comments: extractComments(text),
        articles: extractArticles(text),
        statistics: calculateStatistics(text)
    };
}

// Extraction des informations du profil
function extractProfileInfo(text) {
    return {
        username: extractPattern(text, /([A-Za-z0-9_]+)\nÀ propos/) || extractPattern(text, /Utilisateur : (.*)/),
        location: extractPattern(text, /Localisation : (.*)/),
        followers: extractNumber(text, /(\d+)\nAbonnés/),
        evaluations: extractNumber(text, /\((\d+)\)\nÉvaluations/)
    };
}

// Extraction des articles
function extractArticles(text) {
    // Modifié pour correspondre au format exact du texte
    const articleRegex = /- (.*?), Prix : (\d+,\d+) €, Marque : (.*?), Vues : (\d+), Favoris : (\d+)/g;
    const articles = [];
    let match;

    while ((match = articleRegex.exec(text)) !== null) {
        articles.push({
            name: match[1].trim(),
            price: parseFloat(match[2].replace(',', '.')),
            brand: match[3].trim(),
            views: parseInt(match[4]),
            favorites: parseInt(match[5])
        });
    }

    console.log("Articles extraits:", articles); // Debug
    return articles;
}

// Calcul des statistiques
function calculateStatistics(text) {
    const articles = extractArticles(text);
    const evaluations = extractNumber(text, /\((\d+)\)\nÉvaluations/);
    const sales = Math.floor(evaluations * 0.9); // Règle des -10%

    // Calcul du prix moyen et du chiffre d'affaires
    let averagePrice = 0;
    let totalViews = 0;
    let totalFavorites = 0;

    if (articles.length > 0) {
        const totalPrice = articles.reduce((sum, article) => sum + article.price, 0);
        averagePrice = totalPrice / articles.length;
        totalViews = articles.reduce((sum, article) => sum + article.views, 0);
        totalFavorites = articles.reduce((sum, article) => sum + article.favorites, 0);
    }

    // Calcul du taux d'engagement
    const engagementRate = totalViews > 0 ? (totalFavorites / totalViews) * 100 : 0;

    return {
        financials: {
            averagePrice: averagePrice || 0,
            estimatedRevenue: (averagePrice * sales) || 0
        },
        engagement: {
            views: totalViews,
            favorites: totalFavorites,
            engagementRate: engagementRate || 0
        }
    };
}

function extractPattern(text, pattern) {
    const match = text.match(pattern);
    return match ? match[1].trim() : null;
}

// Debug helper
function logExtraction(name, value) {
    console.log(`Extraction - ${name}:`, value);
}
