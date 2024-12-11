/**
 * Module de calcul des statistiques
 */

/**
 * Calcule toutes les statistiques à partir des données parsées
 */
const calculateStatistics = (parsedData) => {
    return {
        sales: calculateSalesStats(parsedData),
        engagement: calculateEngagementStats(parsedData),
        geography: calculateGeographyStats(parsedData),
        finance: calculateFinancialStats(parsedData),
        brands: calculateBrandStats(parsedData)
    };
};

/**
 * Calcule les statistiques de ventes
 */
const calculateSalesStats = (data) => {
    const monthlySales = {};
    data.comments.forEach(comment => {
        const date = parseDate(comment.timestamp);
        const month = `${date.getFullYear()}-${date.getMonth() + 1}`;
        monthlySales[month] = (monthlySales[month] || 0) + 1;
    });

    return {
        total: data.sales.totalSales,
        monthly: monthlySales,
        average: data.sales.totalSales / Object.keys(monthlySales).length || 0
    };
};

/**
 * Calcule les statistiques d'engagement
 */
const calculateEngagementStats = (data) => {
    const totalViews = data.articles.reduce((sum, article) => sum + (article.views || 0), 0);
    const totalFavorites = data.articles.reduce((sum, article) => sum + (article.favorites || 0), 0);

    return {
        views: totalViews,
        favorites: totalFavorites,
        engagementRate: (data.sales.totalSales / totalViews) * 100 || 0,
        conversionRate: (data.sales.totalSales / totalFavorites) * 100 || 0
    };
};

/**
 * Calcule les statistiques géographiques
 */
const calculateGeographyStats = (data) => {
    const salesByCountry = data.comments.reduce((acc, comment) => {
        const country = getCountryFromLanguage(comment.language);
        acc[country] = (acc[country] || 0) + 1;
        return acc;
    }, {});

    return {
        salesByCountry,
        topCountry: Object.entries(salesByCountry)
            .sort(([,a], [,b]) => b - a)[0]?.[0] || 'France'
    };
};

/**
 * Calcule les statistiques financières
 */
const calculateFinancialStats = (data) => {
    const prices = data.articles.map(article => article.price).filter(Boolean);
    
    return {
        totalRevenue: prices.reduce((sum, price) => sum + price, 0),
        averagePrice: prices.reduce((sum, price) => sum + price, 0) / prices.length || 0,
        minPrice: Math.min(...prices),
        maxPrice: Math.max(...prices)
    };
};

/**
 * Calcule les statistiques par marque
 */
const calculateBrandStats = (data) => {
    const salesByBrand = data.articles.reduce((acc, article) => {
        acc[article.brand] = (acc[article.brand] || 0) + 1;
        return acc;
    }, {});

    const topBrands = Object.entries(salesByBrand)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5);

    return {
        salesByBrand,
        topBrands
    };
};

/**
 * Utilitaires
 */
const parseDate = (timeAgo) => {
    const now = new Date();
    const units = {
        'minute': 1,
        'heure': 60,
        'jour': 1440,
        'semaine': 10080,
        'mois': 43200
    };

    for (const [unit, minutes] of Object.entries(units)) {
        const match = timeAgo.match(new RegExp(`(\\d+) ${unit}`));
        if (match) {
            const value = parseInt(match[1]);
            return new Date(now - value * minutes * 60000);
        }
    }
    return now;
};

const getCountryFromLanguage = (language) => {
    const languageToCountry = {
        'fr': 'France',
        'en': 'Royaume-Uni',
        'it': 'Italie',
        'es': 'Espagne',
        'de': 'Allemagne'
    };
    return languageToCountry[language] || 'France';
};

export {
    calculateStatistics,
    calculateSalesStats,
    calculateEngagementStats,
    calculateGeographyStats,
    calculateFinancialStats,
    calculateBrandStats
};
