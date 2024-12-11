document.addEventListener('DOMContentLoaded', function() {
    const analyzeBtn = document.getElementById('analyzeBtn');
    const inputData = document.getElementById('inputData');
    const dashboard = document.getElementById('dashboard');

    analyzeBtn.addEventListener('click', function() {
        const rawData = inputData.value;
        if (rawData.trim() === '') {
            alert('Veuillez entrer des données à analyser');
            return;
        }

        // Parsing des données
        const parsedData = parseVintedData(rawData);
        
        // Calcul des statistiques
        const stats = calculateStatistics(parsedData);
        
        // Mise à jour du dashboard
        updateDashboard(stats);
        
        // Affichage du dashboard
        dashboard.style.display = 'block';
        setTimeout(() => dashboard.classList.add('visible'), 100);
    });
});
