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
    
    const months = Object.keys(data.sales.monthly);
    const salesData = months.map(month => data.sales.monthly[month]);

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
    
    const countries = Object.keys(data.geography.salesByCountry);
    const salesCounts = Object.values(data.geography.salesByCountry);

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

    return new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Ventes', 'Vues sans achat'],
            datasets: [{
                data: [
                    data.sales.total,
                    data.engagement.views - data.sales.total
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
    
    const topBrands = data.brands.topBrands;
    const brands = topBrands.map(([brand]) => brand);
    const sales = topBrands.map(([, count]) => count);

    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: brands,
            datasets: [{
                label: 'Ventes par marque',
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

export {
    updateCharts,
    createSalesChart,
    createGeoChart,
    createEngagementChart,
    createBrandChart
};
