// Fonctions de test
function parseVintedData(text) {
    return {
        username: text.match(/([A-Za-z0-9_]+)\nÀ propos/)?.[1] || 'Inconnu',
        evaluations: text.match(/\((\d+)\)\nÉvaluations/)?.[1] || '0',
        location: 'France'
    };
}

// Gestionnaire principal
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM chargé"); // Debug

    const analyzeBtn = document.getElementById('analyzeBtn');
    const inputData = document.getElementById('inputData');
    const dashboard = document.getElementById('dashboard');

    if (!analyzeBtn || !inputData || !dashboard) {
        console.error("Éléments manquants dans le DOM");
        return;
    }

    analyzeBtn.addEventListener('click', () => {
        console.log("Bouton cliqué"); // Debug
        const rawData = inputData.value.trim();
        
        if (!rawData) {
            alert('Veuillez entrer des données à analyser');
            return;
        }

        try {
            const parsedData = parseVintedData(rawData);
            console.log("Données analysées:", parsedData); // Debug
            
            // Afficher le dashboard
            dashboard.style.display = 'block';
            
        } catch (error) {
            console.error("Erreur d'analyse:", error);
            alert("Une erreur est survenue lors de l'analyse");
        }
    });
});
