// Mise à jour du tableau de bord
function updateDashboard(data) {
    console.log("Données pour le dashboard:", data);
    
    // Mise à jour des statistiques de base
    updateBaseStats(data);
    
    // Mise à jour des stats financières
    updateFinancialStats(data);
    
    // Mise à jour des stats de vente
    updateSalesStats(data);
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
    document.getElementById('location').textContent = 'France';

    // Affichage de la note avec étoiles
    if (data.profile.rating) {
        document.getElementById('rating').innerHTML = displayRating(data.profile.rating);
    }
}

// Mise à jour des stats financières
function updateFinancialStats(data) {
    const stats = data.statistics.financials;
    
    // Prix moyen et chiffre d'affaires actuel
    document.getElementById('averagePrice').textContent = formatCurrency(stats.averagePrice);
    document.getElementById('estimatedRevenue').textContent = formatCurrency(stats.estimatedRevenue);
    
    // Projection annuelle
    document.getElementById('annualProjectedRevenue').textContent = formatCurrency(stats.annualProjectedRevenue);
}

// Mise à jour des stats de vente
function updateSalesStats(data) {
    const stats = data.statistics.salesMetrics;
    
    // Moyennes de ventes
    document.getElementById('monthlyAverageSales').textContent = 
        Math.round(stats.monthlyAverageSales * 10) / 10;
    document.getElementById('dailyAverageSales').textContent = 
        Math.round(stats.dailyAverageSales * 10) / 10;
}

// Fonctions utilitaires de formatage
function formatCurrency(amount) {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
    }).format(amount);
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
