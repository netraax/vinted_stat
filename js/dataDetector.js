// Fonctions d'extraction des données
function extractNumber(text, pattern) {
    const match = text.match(pattern);
    return match ? parseInt(match[1]) : 0;
}

function analyzeData(text) {
    // Extraction basique des données
    const evaluations = extractNumber(text, /\((\d+)\)\nÉvaluations/);
    const followers = extractNumber(text, /(\d+)\nAbonnés/);
    const sales = Math.floor(evaluations * 0.9); // Règle des -10%

    return { sales, evaluations, followers };
}
