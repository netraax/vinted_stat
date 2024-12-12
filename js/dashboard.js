// Mise à jour du tableau de bord
function updateDashboard(data) {
    console.log("Données pour le dashboard:", data);

    // Vérifiez que les données sont valides avant de les utiliser
    if (!data || !data.statistics || !data.profile || !data.sales) {
        console.error("Données invalides pour le dashboard:", data);
        return;
    }

    // Mise à jour des statistiques de base
    updateBaseStats(data);

    // Mise à jour des stats financières
    updateFinancialStats(data);

    // Mise à jour des stats d'engagement
    updateEngagementStats(data);

    // Mise à jour des graphiques
    if (window.updateCharts) {
        try {
            window.updateCharts(data);
        } catch (error) {
            console.error("Erreur mise à jour graphiques:", error);
        }
    }
}

// Mise à jour des statistiques de base
function updateBaseStats(data) {
    try {
        document.getElementById('salesCount').textContent = data.sales?.totalSales || 0;
        document.getElementById('evaluations').textContent = data.profile?.evaluations || 0;
        document.getElementById('followers').textContent = data.profile?.followers || 0;

        // Ajout du username et de la localisation
        document.getElementById('username').textContent = data.profile?.username || "-";
        document.getElementById('location').textContent = data.profile?.location || "-";
    } catch (error) {
        console.error("Erreur mise à jour des stats de base:", error);
    }
}

// Mise à jour des stats financières
function updateFinancialStats(data) {
    try {
        const stats = data.statistics?.financials || {};

        // Prix moyen
        document.getElementById('averagePrice').textContent = 
            formatCurrency(stats.averagePrice || 0);

        // Chiffre d'affaires estimé
        document.getElementById('estimatedRevenue').textContent = 
            formatCurrency(stats.estimatedRevenue || 0);
    } catch (error) {
        console.error("Erreur mise à jour des stats financières:", error);
    }
}

// Mise à jour des stats d'engagement
function updateEngagementStats(data) {
    try {
        const stats = data.statistics?.engagement || {};

        document.getElementById('totalViews').textContent = stats.views || 0;
        document.getElementById('totalFavorites').textContent = stats.favorites || 0;
        document.getElementById('engagementRate').textContent = 
            formatPercent(stats.engagementRate || 0);
    } catch (error) {
        console.error("Erreur mise à jour des stats d'engagement:", error);
    }
}

// Fonctions utilitaires de formatage
function formatCurrency(amount) {
    if (isNaN(amount)) return "€ 0,00";
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
    }).format(amount);
}

function formatPercent(value) {
    if (isNaN(value)) return "0%";
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
        if (text.length > 0) {
            console.log("Analyse des données...");
            try {
                const stats = analyzeData(text);
                console.log("Statistiques complètes:", stats);
                updateDashboard(stats);
                dash.style.display = 'block';
            } catch (error) {
                console.error("Erreur lors de l'analyse:", error);
                alert("Une erreur s'est produite lors de l'analyse des données. Veuillez vérifier le format des données.");
            }
        } else {
            alert('Veuillez entrer des données à analyser');
        }
    };
}
