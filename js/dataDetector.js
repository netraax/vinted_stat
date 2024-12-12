// Fonctions d'extraction des données
function extractNumber(text, pattern) {
    const match = text.match(pattern);
    return match ? parseInt(match[1]) : 0;
}

function analyzeData(text) {
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
        username: extractPattern(text, /([A-Za-z0-9_]+)\nÀ propos/),
        location: extractPattern(text, /À propos :\n(.*?),\sFrance/),
        followers: extractNumber(text, /(\d+)\nAbonnés/),
        evaluations: extractNumber(text, /\((\d+)\)\nÉvaluations/)
    };
}

// Extraction des informations de vente
function extractSalesInfo(text) {
    const evaluations = extractNumber(text, /\((\d+)\)\nÉvaluations/);
    return {
        totalSales: Math.floor(evaluations * 0.9), // Règle des -10%
        totalEvaluations: evaluations
    };
}

// Extraction et analyse des commentaires
function extractComments(text) {
    const commentRegex = /([a-zA-Z0-9_]+)\nil y a (.*?)\n(.*?)\n/g;
    const comments = [];
    let match;

    while ((match = commentRegex.exec(text)) !== null) {
        comments.push({
            username: match[1],
            date: match[2],
            content: match[3],
            language: detectLanguage(match[3]),
            timestamp: parseDate(match[2])
        });
    }

    return comments;
}

// Extraction des articles
function extractArticles(text) {
    // Modification du pattern pour matcher le format exact
    const articleRegex = /.*?, prix : (\d+,\d+) €, marque : (.*?)(?:, taille|\n)/g;
    const articles = [];
    let match;

    while ((match = articleRegex.exec(text)) !== null) {
        articles.push({
            price: parseFloat(match[1].replace(',', '.')),
            brand: match[2].trim()
        });
    }

    console.log("Articles extraits:", articles); // Debug
    return articles;
}

// Calcul des statistiques
function calculateStatistics(text) {
    const articles = extractArticles(text);
    const evaluations = extractNumber(text, /\((\d+)\)\nÉvaluations/);
    const sales = Math.floor(evaluations * 0.9);

    let averagePrice = 0;
    if (articles.length > 0) {
        const totalPrice = articles.reduce((sum, article) => sum + article.price, 0);
        averagePrice = totalPrice / articles.length;
    }

    const estimatedRevenue = averagePrice * sales;

    return {
        financials: {
            averagePrice: averagePrice || 0,
            estimatedRevenue: estimatedRevenue || 0
        }
    };
}

// Fonctions utilitaires
function parseDate(timeAgo) {
    const now = new Date();
    if (timeAgo.includes('minute')) return new Date(now - parseInt(timeAgo) * 60000);
    if (timeAgo.includes('heure')) return new Date(now - parseInt(timeAgo) * 3600000);
    if (timeAgo.includes('jour')) return new Date(now - parseInt(timeAgo) * 86400000);
    if (timeAgo.includes('semaine')) return new Date(now - parseInt(timeAgo) * 604800000);
    if (timeAgo.includes('mois')) return new Date(now - parseInt(timeAgo) * 2592000000);
    return now;
}

function detectLanguage(text) {
    const languages = {
        fr: ['merci', 'bonjour', 'parfait', 'rapide'],
        it: ['perfetto', 'grazie', 'tutto'],
        en: ['perfect', 'thank', 'good'],
        es: ['gracias', 'perfecto', 'bien']
    };

    text = text.toLowerCase();
    for (const [lang, words] of Object.entries(languages)) {
        if (words.some(word => text.includes(word))) return lang;
    }
    return 'fr'; // par défaut
}

function getCountryFromLanguage(language) {
    const mapping = {
        fr: 'France',
        it: 'Italie',
        en: 'Royaume-Uni',
        es: 'Espagne'
    };
    return mapping[language] || 'France';
}

function extractPattern(text, pattern) {
    const match = text.match(pattern);
    return match ? match[1] : null;
}
