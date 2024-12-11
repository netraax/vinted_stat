import { parseVintedData } from './parser.js';
import { calculateStatistics } from './statistics.js';
import { updateCharts } from './charts.js';

/**
 * Initialisation de l'application
 */
document.addEventListener('DOMContentLoaded', () => {
    const analyzeBtn = document.getElementById('analyzeBtn');
    const inputData = document.getElementById('inputData');
    const dashboard = document.getElementById('dashboard');

    analyzeBtn.addEventListener('click', handleDataAnalysis);

    // Initialiser les onglets s'ils existent
    const tabs = document.querySelectorAll('.nav-link');
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            activateTab(tab);
        });
    });
});

/**
 * Gère l'analyse des données
 */
const handleDataAnalysis = () => {
    const inputData = document.getElementById('inputData');
    const rawData = inputData.value.trim();

    if (!rawData) {
        alert('Veuillez entrer des données à analyser');
        return;
    }

    try {
        // Parser les données
        const parsedData = parseVintedData(rawData);
        
        // Calculer les statistiques
        const stats = calculateStatistics(parsedData);

        // Mettre à jour l'interface
        updateDashboard(stats);
        
        // Mettre à jour les graphiques
        updateCharts(stats);

        // Afficher le dashboard
        showDashboard();

    } catch (error) {
        console.error('Erreur lors de l'analyse:', error);
        alert('Une erreur est survenue lors de l'analyse des données');
    }
};

/**
 * Met à jour le tableau de bord avec les statistiques
 */
const updateDashboard = (stats) => {
    // Mettre à jour les informations de base
    updateElement('username', stats.profile?.username || 'N/A');
    updateElement('totalSales', stats.sales.total);
    updateElement('totalRevenue', formatCurrency(stats.finance.totalRevenue));
    updateElement('averagePrice', formatCurrency(stats.finance.averagePrice));
    updateElement('engagementRate', formatPercent(stats.engagement.engagementRate));
    updateElement('topCountry', stats.geography.topCountry);

    // Mettre à jour les statistiques détaillées
    updateElement('totalViews', stats.engagement.views);
    updateElement('totalFavorites', stats.engagement.favorites);
    updateElement('conversionRate', formatPercent(stats.engagement.conversionRate));
};

/**
 * Utilitaires d'interface
 */
const showDashboard = () => {
    const dashboard = document.getElementById('dashboard');
    dashboard.style.display = 'block';
    setTimeout(() => dashboard.classList.add('visible'), 100);
};

const updateElement = (id, value) => {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    }
};

const activateTab = (selectedTab) => {
    document.querySelectorAll('.nav-link').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('show', 'active');
    });

    selectedTab.classList.add('active');
    const targetId = selectedTab.getAttribute('href');
    document.querySelector(targetId)?.classList.add('show', 'active');
};

/**
 * Formatage des valeurs
 */
const formatCurrency = (value) => {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
    }).format(value);
};

const formatPercent = (value) => {
    return new Intl.NumberFormat('fr-FR', {
        style: 'percent',
        maximumFractionDigits: 1
    }).format(value / 100);
};
