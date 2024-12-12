// Mise à jour du tableau de bord
function updateDashboard(data) {
    console.log("Données pour le dashboard:", data);
    
    // Mise à jour des statistiques de base
    updateBaseStats(data);
    
    // Mise à jour des stats financières
    updateFinancialStats(data);
    
    // Mise à jour des stats d'engagement
    updateEngagementStats(data);
}

// Mise à jour des statistiques de base
function updateBaseStats(data) {
    document.getElementById('salesCount').textContent = data.sales.totalSales;
    document.getElementById('evaluations').textContent = data.profile.evaluations;
    document.getElementById('followers').textContent = data.profile.followers;
    
    // Ajout du username et de la localisation
    if (data.profile.username) {
        document.getElementById('username').textContent = data.profile.username;
    }
    if (data.profile.location) {
        document.getElementById('location').textContent = data.profile.location;
    }
}

// Mise à jour des stats financières
function updateFinancialStats(data) {
    const stats = data.statistics.financials;
    
    // Prix moyen
    document.getElementById('averagePrice').textContent = 
        formatCurrency(stats.averagePrice);
    
    // Chiffre d'affaires estimé
    document.getElementById('estimatedRevenue').textContent = 
        formatCurrency(stats.estimatedRevenue);
}

// Mise à jour des stats d'engagement
function updateEngagementStats(data) {
    const stats = data.statistics.engagement;
    
    document.getElementById('totalViews').textContent = stats.views;
    document.getElementById('totalFavorites').textContent = stats.favorites;
    document.getElementById('engagementRate').textContent = 
        formatPercent(stats.engagementRate);
}

// Fonctions utilitaires de formatage
function formatCurrency(amount) {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
    }).format(amount);
}

function formatPercent(value) {
    return new Intl.NumberFormat('fr-FR', {
        style: 'percent',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
    }).format(value / 100);
}

// Initialisation du tableau de bord
function initDashboard() {
    const btn = document.getElementById('analyzeBtn');
    const input = document.getElementById('inputData');
    const dash = document.getElementById('dashboard');

    btn.onclick = function() {
        const text = input.value;
        if(text.length > 0) {
            console.log("Analyse des données...");
            const stats = analyzeData(text);
            console.log("Statistiques complètes:", stats);
            updateDashboard(stats);
            dash.style.display = 'block';
        } else {
            alert('Veuillez entrer des données à analyser');
        }
    };
}
