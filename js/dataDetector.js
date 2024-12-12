// Pré-traitement du texte
function preprocessText(text) {
    return text
        .replace(/[\t\r]/g, "") // Supprime les tabulations et retours chariot
        .replace(/\s{2,}/g, " "); // Remplace les espaces multiples par un seul espace
}

// Extraction des articles sans Regex
function extractArticlesNoRegex(text) {
    const lines = text.split("\n");
    const articles = [];
    let currentArticle = {};

    lines.forEach(line => {
        if (line.includes("prix :")) {
            // Exemple : Nintendo Wii # Mario Kart #, prix : 24,90 €, marque : Marque non spécifiée, taille : Taille non spécifiée
            const parts = line.split(", ");
            currentArticle.name = parts[0].split("#")[1].trim();
            currentArticle.price = parseFloat(parts[1].split(" : ")[1].replace(",", "."));
            currentArticle.brand = parts[2].split(" : ")[1].trim();
            currentArticle.size = parts[3].split(" : ")[1].trim();
        } else if (line.includes("Très bon état")) {
            // Ajout de l'article uniquement lorsqu'on atteint la fin de sa description
            articles.push(currentArticle);
            currentArticle = {};
        }
    });

    console.log("Articles extraits :", articles);
    return articles;
}

// Extraction des articles avec NLP (compromise.js)
const nlp = require("compromise");

function extractArticlesWithNLP(text) {
    const doc = nlp(text);
    const articles = [];

    // Trouver toutes les phrases contenant "prix"
    doc.sentences().forEach(sentence => {
        if (sentence.has("prix")) {
            const parts = sentence.text().split(", ");
            articles.push({
                name: parts[0].split("#")[1].trim(),
                price: parseFloat(parts[1].split(" : ")[1].replace(",", ".")),
                brand: parts[2].split(" : ")[1].trim(),
                size: parts[3].split(" : ")[1].trim(),
            });
        }
    });

    console.log("Articles extraits :", articles);
    return articles;
}

// Extraction des articles à partir de données JSON
function extractArticlesFromJSON(text) {
    try {
        const jsonData = JSON.parse(text);
        return jsonData.map(item => ({
            category: item.category,
            name: item.name,
            price: parseFloat(item.price.replace(",", ".")),
            brand: item.brand,
            size: item.size
        }));
    } catch (error) {
        console.error("Erreur de parsing JSON :", error);
        return [];
    }
}

// Calcul des statistiques
function calculateStatistics(text) {
    const articles = extractArticlesNoRegex(text);

    // Vérifiez s'il y a des articles valides
    if (articles.length === 0) {
        console.log("Aucun article trouvé.");
        return {
            financials: {
                averagePrice: 0,
                estimatedRevenue: 0
            },
            engagement: {
                views: 0,
                favorites: 0,
                engagementRate: 0
            },
            geography: {}
        };
    }

    // Calcul du prix moyen
    const totalPrices = articles.reduce((sum, article) => sum + (article.price || 0), 0);
    const averagePrice = articles.length > 0 ? totalPrices / articles.length : 0;

    console.log("Total des prix capturés :", totalPrices);
    console.log("Prix moyen calculé :", averagePrice);

    // Calcul du chiffre d'affaires estimé
    const totalSales = Math.floor(articles.length * 0.9); // Exemple d'estimation
    const estimatedRevenue = averagePrice * totalSales;

    return {
        financials: {
            averagePrice: averagePrice.toFixed(2), // Deux décimales
            estimatedRevenue: estimatedRevenue.toFixed(2)
        },
        engagement: {
            views: 0, // Toujours 0, car non disponible
            favorites: 0,
            engagementRate: 0
        },
        geography: {}
    };
}

// Exemple d'analyse des données
function analyzeData(text) {
    const preprocessedText = preprocessText(text);
    return {
        articles: extractArticlesNoRegex(preprocessedText),
        statistics: calculateStatistics(preprocessedText)
    };
}
