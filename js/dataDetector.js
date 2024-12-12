// Pré-traitement du texte
function preprocessText(text) {
    return text
        .replace(/[	\r]/g, "") // Supprime les tabulations et retours chariot
        .replace(/\s{2,}/g, " "); // Remplace les espaces multiples par un seul espace
}

// Fonctions d'extraction des données
function extractNumber(text, pattern) {
    const match = text.match(pattern);
    return match ? parseInt(match[1]) : 0;
}

function analyzeData(text) {
    const preprocessedText = preprocessText(text);
    return {
        profile: extractProfileInfo(preprocessedText),
        sales: extractSalesInfo(preprocessedText),
        comments: extractComments(preprocessedText),
        articles: extractArticlesNoRegex(preprocessedText),
        statistics: calculateStatistics(preprocessedText)
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

// Extraction des articles sans Regex
function extractArticlesNoRegex(text) {
    const lines = text.split("\n");
    const articles = [];
    let currentArticle = {};

    lines.forEach(line => {
        if (line.includes("prix :")) {
            const parts = line.split(", ");
            try {
                currentArticle.name = parts[0].split("#")[1].trim();
                currentArticle.price = parseFloat(parts[1].split(" : ")[1].replace(",", "."));
                currentArticle.brand = parts[2].split(" : ")[1].trim();
                currentArticle.size = parts[3].split(" : ")[1].trim();
            } catch (error) {
                console.error("Erreur lors de l'extraction des données de l'article :", error);
            }
        } else if (line.includes("Très bon état")) {
            if (Object.keys(currentArticle).length > 0) {
                articles.push(currentArticle);
                currentArticle = {};
            }
        }
    });

    console.log("Articles extraits :", articles);
    return articles;
}

// Calcul des statistiques
function calculateStatistics(text) {
    const articles = extractArticlesNoRegex(text);

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

    console.log("Total des prix capturés :", totalPrices);
    console.log("Prix moyen calculé :", averagePrice);

    // Calcul du chiffre d'affaires estimé
    const totalSales = Math.floor(articles.length * 0.9); // Exemple d'estimation
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

function extractPattern(text, pattern) {
    const match = text.match(pattern);
    return match ? match[1] : null;
}
