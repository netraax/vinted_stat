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
    const rating = extractPattern(text, /\n(\d\.\d)\n/); // Extraction de la note
    return {
        username: extractPattern(text, /([A-Za-z0-9_]+)\nÀ propos/),
        location: 'France', // Toujours afficher France
        followers: extractNumber(text, /(\d+)\nAbonnés/),
        evaluations: extractNumber(text, /\((\d+)\)\nÉvaluations/),
        rating: rating ? parseFloat(rating) : null
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
    // Capture prix, marque, vues et favoris
    const articlePattern = /prix : (\d+,\d+) €, marque : (.*?), taille[\s\S]*?(\d+) vues[\s\S]*?(\d+) favoris/g;
    const articles = [];
    let match;

    while ((match = articlePattern.exec(text)) !== null) {
        const price = parseFloat(match[1].replace(',', '.'));
        const brand = match[2].trim();
        const views = parseInt(match[3]);
        const favorites = parseInt(match[4]);
        
        // Vérification des valeurs avant ajout
        if (!isNaN(price) && brand && !isNaN(views) && !isNaN(favorites)) {
            articles.push({
                price: price,
                brand: brand,
                views: views,
                favorites: favorites
            });
        }
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
    let totalViews = 0;
    let totalFavorites = 0;

    if (articles.length > 0) {
        const totalPrice = articles.reduce((sum, article) => sum + article.price, 0);
        averagePrice = totalPrice / articles.length;
        totalViews = articles.reduce((sum, article) => sum + article.views, 0);
        totalFavorites = articles.reduce((sum, article) => sum + article.favorites, 0);
    }

    const engagementRate = totalViews > 0 ? (totalFavorites / totalViews) * 100 : 0;

    const salesByCountry = comments.reduce((acc, comment) => {
        const country = getCountryFromLanguage(comment.language);
        acc[country] = (acc[country] || 0) + 1;
        return acc;
    }, {});

    return {
        financials: {
            averagePrice: averagePrice || 0,
            estimatedRevenue: (averagePrice * sales) || 0
        },
        engagement: {
            views: totalViews,
            favorites: totalFavorites,
            engagementRate: engagementRate
        },
        geography: salesByCountry
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
        fr: ['merci', 'bonjour', 'parfait', 'rapide', 'bien', 'reçu', 'conforme', 'nickel', 'super', 
             'génial', 'recommande', 'impeccable', 'top', 'très', 'envoi', 'colis', 'vraiment'],
        it: ['perfetto', 'grazie', 'tutto', 'bellissima', 'ottimo', 'bello', 'molto', 'piacere', 
             'bella', 'benissimo', 'ottima', 'grazie mille'],
        en: ['perfect', 'thank', 'good', 'great', 'received', 'amazing', 'nice', 'well', 'excellent',
             'awesome', 'brilliant', 'wonderful', 'thanks'],
        es: ['gracias', 'perfecto', 'bien', 'muy', 'todo', 'mejor', 'excelente', 'bueno', 'genial',
             'encantado', 'estupendo', 'muchas gracias', 'hola']
    };

    text = text.toLowerCase();
    let maxScore = 0;
    let detectedLang = 'fr';

    for (const [lang, words] of Object.entries(languages)) {
        const score = words.filter(word => text.includes(word)).length;
        if (score > maxScore) {
            maxScore = score;
            detectedLang = lang;
        }
    }

    return detectedLang;
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

// Fonction d'affichage des étoiles
function displayRating(rating) {
    const fullStar = '★';
    const emptyStar = '☆';
    const stars = Math.round(rating);
    return `${fullStar.repeat(stars)}${emptyStar.repeat(5-stars)} (${rating})`;
}
