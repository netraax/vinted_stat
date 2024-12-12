/**
 * Module de création des graphiques avec Chart.js
 */

// Configuration commune pour tous les graphiques
const chartConfig = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top',
        }
    }
};

/**
 * Crée le graphique d'évolution des ventes
 */
const createSalesChart = (containerId, data) => {
    const ctx = document.getElementById(containerId).getContext('2d');
    
    // Extraction des données de ventes par date à partir des commentaires
    const salesByMonth = {};
    data.comments.forEach(comment => {
        const date = comment.timestamp;
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        salesByMonth[monthKey] = (salesByMonth[monthKey] || 0) + 1;
    });

    const months = Object.keys(salesByMonth).sort();
    const salesData = months.map(month => salesByMonth[month]);

    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: 'Ventes mensuelles',
                data: salesData,
                borderColor: '#6a11cb',
                backgroundColor: 'rgba(106, 17, 203, 0.2)',
                tension: 0.4
            }]
        },
        options: {
            ...chartConfig,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
};

/**
 * Crée le graphique de répartition géographique
 */
const createGeoChart = (containerId, data) => {
    const ctx = document.getElementById(containerId).getContext('2d');
    
    const countryData = data.statistics.geography;
    const countries = Object.keys(countryData);
    const salesCounts = Object.values(countryData);

    return new Chart(ctx, {
        type: 'pie',
        data: {
            labels: countries,
            datasets: [{
                data: salesCounts,
                backgroundColor: [
                    '#6a11cb',
                    '#2575fc',
                    '#42a5f5',
                    '#ff6384',
                    '#ffcd56'
                ]
            }]
        },
        options: chartConfig
    });
};

/**
 * Crée le graphique du taux d'engagement
 */
const createEngagementChart = (containerId, data) => {
    const ctx = document.getElementById(containerId).getContext('2d');
    const engagement = data.statistics.engagement;

    return new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Ventes', 'Vues sans achat'],
            datasets: [{
                data: [
                    data.sales.totalSales,
                    engagement.views - data.sales.totalSales
                ],
                backgroundColor: ['#6a11cb', '#2575fc']
            }]
        },
        options: chartConfig
    });
};

/**
 * Crée le graphique des marques les plus vendues
 */
const createBrandChart = (containerId, data) => {
    const ctx = document.getElementById(containerId).getContext('2d');
    
    // Compter les articles par marque
    const brandCounts = {};
    data.articles.forEach(article => {
        brandCounts[article.brand] = (brandCounts[article.brand] || 0) + 1;
    });

    // Trier les marques par nombre de ventes
    const sortedBrands = Object.entries(brandCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5); // Top 5 marques

    const brands = sortedBrands.map(([brand]) => brand);
    const sales = sortedBrands.map(([, count]) => count);

    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: brands,
            datasets: [{
                label: 'Articles par marque',
                data: sales,
                backgroundColor: '#6a11cb'
            }]
        },
        options: {
            ...chartConfig,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
};

/**
 * Met à jour tous les graphiques
 */
const updateCharts = (stats) => {
    createSalesChart('salesChart', stats);
    createGeoChart('geoChart', stats);
    createEngagementChart('engagementChart', stats);
    createBrandChart('brandChart', stats);
};

// Rendre les fonctions disponibles globalement plutôt qu'utiliser export
window.updateCharts = updateCharts;
window.createSalesChart = createSalesChart;
window.createGeoChart = createGeoChart;
window.createEngagementChart = createEngagementChart;
window.createBrandChart = createBrandChart;
