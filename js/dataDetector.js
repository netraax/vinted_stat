function extractArticles(text) {
    const articleRegex = /(.*?)#\s(.*?)#,\sprix\s:\s([\d,]+)\s€.*?marque\s:\s(.*?),\staille\s:\s(.*?)\n/g;
    const articles = [];
    let match;

    while ((match = articleRegex.exec(text)) !== null) {
        console.log("Match trouvé :", match);
        articles.push({
            category: match[1].trim(),
            name: match[2].trim(),
            price: parseFloat(match[3].replace(',', '.')), // Convertir le prix
            brand: match[4] !== 'Marque non spécifiée' ? match[4].trim() : 'Autre',
            size: match[5].trim(),
        });
    }

    console.log("Articles extraits :", articles.length);
    return articles;
}

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

    console.log("Total des prix capturés :", totalPrices);
    console.log("Prix moyen calculé :", averagePrice);

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
