// Fonctions d'extraction des données
function extractNumber(text, pattern) {
    const match = text.match(pattern);
    return match ? parseInt(match[1]) : 0;
}

function analyzeData(text) {
    // Extraction basique des données qui fonctionne
    const evaluations = extractNumber(text, /\((\d+)\)\nÉvaluations/);
    const followers = extractNumber(text, /(\d+)\nAbonnés/);
    const sales = Math.floor(evaluations * 0.9); // Règle des -10%

    // Nouvelle extraction des articles avec prix, vues, favoris
    const articles = extractArticles(text);
    const stats = calculateArticleStats(articles, sales);

    return {
        basic: { sales, evaluations, followers },
        articles: articles,
        statistics: stats
    };
}

function extractArticles(text) {
    const articles = [];
    // Pattern pour matcher le format exact de vos données
    const pattern = /.*?, prix : (\d+,\d+) €, marque : (.*?), taille/g;
    let match;

    while ((match = pattern.exec(text)) !== null) {
        articles.push({
            price: parseFloat(match[1].replace(',', '.')),
            brand: match[2].trim(),
        });
    }

    return articles;
}

function calculateArticleStats(articles, totalSales) {
    // Calcul du prix moyen
    let totalPrice = 0;
    articles.forEach(article => {
        totalPrice += article.price;
    });

    const averagePrice = articles.length > 0 ? totalPrice / articles.length : 0;
    const estimatedRevenue = averagePrice * totalSales;

    return {
        averagePrice: averagePrice,
        totalRevenue: estimatedRevenue,
        totalArticles: articles.length
    };
}
