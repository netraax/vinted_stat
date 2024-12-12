// Fonctions de mise à jour du tableau de bord
function updateDashboard(stats) {
    document.getElementById('salesCount').textContent = stats.sales;
    document.getElementById('evaluations').textContent = stats.evaluations;
    document.getElementById('followers').textContent = stats.followers;
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
            console.log("Statistiques:", stats);
            updateDashboard(stats);
            dash.style.display = 'block';
        } else {
            alert('Veuillez entrer des données à analyser');
        }
    };
}
