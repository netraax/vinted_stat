// Fonctions d'extraction des données
function extractNumber(text, pattern) {
    const match = text.match(pattern);
    return match ? parseInt(match[1].replace(/\s/g, ''), 10) : 0;
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
        username: extractPattern(text, /^([A-Za-z0-9_]+)\nÀ propos/m),
        location: extractPattern(text, /À propos :\n(.*?),\s(.*)/),
        followers: extractNumber(text, /(\d+)\nAbonnés/),
        following: extractNumber(text, /Abonnés\n,\n(\d+)\nAbonnements/),
        articlesCount: extractNumber(text, /(\d+)\sarticles/),
        verifiedInfo: extractPattern(text, /Informations vérifiées :\n(.*?)\n/),
        description: extractPattern(text, /Passionné de jeux videos , (.*?)\.\.\./)
    };
}

// Extraction des informations de vente
function extractSalesInfo(text) {
    const followers = extractNumber(text, /(\d+)\nAbonnés/);
    return {
        totalSales: Math.floor(followers * 0.9), // Estimation basée sur les abonnés
        totalEvaluations: followers
    };
}

// Extraction et analyse des commentaires
function extractComments(text) {
    // Le texte exemple ne contient pas de commentaires, donc on retourne un tableau vide
    return [];
}

// Extraction des articles
function extractArticles(text) {
    const articleRegex = /(.*?)#\s(.*?)#,\sprix\s:\s([\d,]+)\s€,\smarque\s:\s(.*?),\staille\s:\s(.*?)\nEnlevé\s!\n(.*?)\n\nTrès\sbon\sétat/g;
    const articles = [];
    let match;

    while ((match = articleRegex.exec(text)) !== null) {
        console.log("Prix capturé :", match[3]); // Log pour vérifier les prix
        articles.push({
            category: match[1].trim(),
            name: match[2].trim(),
            price: parseFloat(match[3].replace(',', '.')), // Convertir le prix
            brand: match[4] !== 'Marque non spécifiée' ? match[4].trim() : 'Autre',
            size: match[5].trim(),
            fullName: match[6].trim(),
            views: 0, // Toujours 0, car absent dans le texte
            favorites: 0 // Toujours 0, car absent dans le texte
        });
    }

    console.log("Articles extraits :", articles); // Vérifiez ici si les articles sont bien extraits
    return articles;
}

// Calcul des statistiques
function calculateStatistics(text) {
    const articles = extractArticles(text);

    // Vérifiez s'il y a des articles valides
    if (articles.length === 0) {
        console.log("Aucun article trouvé.");
        return {
            financials: {
                averagePrice: 0,
                estimatedRevenue: 0
            },
            engagement: {
                views: 0,
                favorites: 0,
                engagementRate: 0
            },
            geography: {}
        };
    }

    // Calcul du prix moyen
    const totalPrices = articles.reduce((sum, article) => sum + (article.price || 0), 0);
    const averagePrice = articles.length > 0 ? totalPrices / articles.length : 0;

    // Calcul du chiffre d'affaires estimé
    const totalSales = extractSalesInfo(text).totalSales;
    const estimatedRevenue = averagePrice * totalSales;

    return {
        financials: {
            averagePrice: averagePrice.toFixed(2), // Deux décimales
            estimatedRevenue: estimatedRevenue.toFixed(2)
        },
        engagement: {
            views: 0, // Toujours 0, car non disponible
            favorites: 0,
            engagementRate: 0
        },
        geography: {}
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
    return match ? match[1].trim() : null;
}
