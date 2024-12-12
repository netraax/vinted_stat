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

// Palette de couleurs Vinted
const vintedColors = {
    primary: '#09B1BA',      // Bleu-vert Vinted
    secondary: '#007782',    // Bleu-vert foncé
    accent: '#FFBA49',       // Orange/Jaune
    light: '#CCF2F6',       // Bleu-vert clair
    neutral: '#999999'       // Gris
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
                borderColor: vintedColors.primary,
                backgroundColor: vintedColors.light,
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
    const total = salesCounts.reduce((a, b) => a + b, 0);

    return new Chart(ctx, {
        type: 'pie',
        data: {
            labels: countries,
            datasets: [{
                data: salesCounts,
                backgroundColor: [
                    vintedColors.primary,
                    vintedColors.secondary,
                    vintedColors.accent,
                    vintedColors.light
                ]
            }]
        },
        options: {
            ...chartConfig,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        generateLabels: (chart) => {
                            const data = chart.data;
                            return data.labels.map((label, i) => ({
                                text: `${label} (${((data.datasets[0].data[i] / total) * 100).toFixed(1)}%)`,
                                fillStyle: data.datasets[0].backgroundColor[i]
                            }));
                        }
                    }
                }
            }
        }
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
            labels: ['Favoris', 'Vues'],
            datasets: [{
                data: [
                    engagement.favorites,
                    engagement.views
                ],
                backgroundColor: [vintedColors.primary, vintedColors.light]
            }]
        },
        options: {
            ...chartConfig,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        generateLabels: (chart) => {
                            const data = chart.data;
                            const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
                            return data.labels.map((label, i) => ({
                                text: `${label} (${((data.datasets[0].data[i] / total) * 100).toFixed(1)}%)`,
                                fillStyle: data.datasets[0].backgroundColor[i]
                            }));
                        }
                    }
                }
            }
        }
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
        .slice(0, 5);

    const brands = sortedBrands.map(([brand]) => brand);
    const sales = sortedBrands.map(([, count]) => count);

    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: brands,
            datasets: [{
                label: 'Articles par marque',
                data: sales,
                backgroundColor: vintedColors.primary,
                hoverBackgroundColor: vintedColors.secondary
            }]
        },
        options: {
            ...chartConfig,
            scales: {
                x: {
                    display: true,
                    ticks: {
                        autoSkip: false,
                        maxRotation: 45,
                        minRotation: 45
                    }
                },
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

// Rendre les fonctions disponibles globalement
window.updateCharts = updateCharts;
window.createSalesChart = createSalesChart;
window.createGeoChart = createGeoChart;
window.createEngagementChart = createEngagementChart;
window.createBrandChart = createBrandChart;
