/**
 * Parser principal pour les données Vinted
 */

const parseVintedData = (rawText) => {
    return {
        profile: extractProfileInfo(rawText),
        sales: extractSalesInfo(rawText),
        comments: extractComments(rawText),
        articles: extractArticles(rawText)
    };
};

/**
 * Extrait les informations du profil
 */
const extractProfileInfo = (text) => {
    return {
        username: extractPattern(text, /([A-Za-z0-9_]+)\nÀ propos/),
        location: extractPattern(text, /À propos :\n(.*?),\sFrance/),
        followers: parseInt(extractPattern(text, /(\d+)\nAbonnés/) || '0'),
        rating: parseFloat(extractPattern(text, /(\d+\.\d+)\n\(\d+\)/) || '0'),
        evaluations: parseInt(extractPattern(text, /\((\d+)\)\nÉvaluations/) || '0')
    };
};

/**
 * Extrait les informations des ventes
 */
const extractSalesInfo = (text) => {
    const totalEvaluations = parseInt(extractPattern(text, /\((\d+)\)\nÉvaluations/) || '0');
    const actualSales = Math.floor(totalEvaluations * 0.9); // Règle des -10%

    return {
        totalSales: actualSales,
        evaluations: {
            total: totalEvaluations,
            members: parseInt(extractPattern(text, /Évaluations des membres \((\d+)\)/) || '0'),
            automatic: parseInt(extractPattern(text, /Évaluations automatiques \((\d+)\)/) || '0')
        }
    };
};

/**
 * Extrait et analyse les commentaires
 */
const extractComments = (text) => {
    const commentRegex = /([a-zA-Z0-9_]+)\nil y a (.*?)\n(.*?)\n/g;
    const comments = [];
    let match;

    while ((match = commentRegex.exec(text)) !== null) {
        comments.push({
            username: match[1],
            timestamp: match[2],
            content: match[3],
            language: detectLanguage(match[3])
        });
    }

    return comments;
};

/**
 * Extrait les informations des articles
 */
const extractArticles = (text) => {
    const articleRegex = /(.*?), prix : (\d+,\d+) €, marque : (.*?), taille/g;
    const articles = [];
    let match;

    while ((match = articleRegex.exec(text)) !== null) {
        articles.push({
            name: match[1].trim(),
            price: parseFloat(match[2].replace(',', '.')),
            brand: match[3] !== 'Marque non spécifiée' ? match[3] : 'Autre'
        });
    }

    return articles;
};

/**
 * Détecte la langue d'un texte (simplifié)
 */
const detectLanguage = (text) => {
    const languages = {
        fr: ['merci', 'bonjour', 'parfait', 'rapide', 'bien'],
        it: ['perfetto', 'grazie', 'tutto', 'bene', 'ottimo'],
        en: ['perfect', 'thank', 'good', 'great', 'nice'],
        es: ['gracias', 'perfecto', 'bien', 'muy', 'todo']
    };

    text = text.toLowerCase();
    for (const [lang, words] of Object.entries(languages)) {
        if (words.some(word => text.includes(word))) {
            return lang;
        }
    }
    return 'fr'; // Par défaut
};

/**
 * Utilitaire pour extraire avec regex
 */
const extractPattern = (text, pattern) => {
    const match = text.match(pattern);
    return match ? match[1] : null;
};

export {
    parseVintedData,
    extractProfileInfo,
    extractSalesInfo,
    extractComments,
    extractArticles
};
