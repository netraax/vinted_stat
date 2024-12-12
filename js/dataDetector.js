// Pré-traitement du texte
function preprocessText(text) {
    return text
        .replace(/[\t\r]/g, "") // Supprime les tabulations et retours chariot
        .replace(/\s{2,}/g, " "); // Remplace les espaces multiples par un seul espace
}

// Extraction des articles sans Regex avec vérifications
function extractArticlesNoRegex(text) {
    const lines = text.split("\n");
    const articles = [];
    let currentArticle = {};

    lines.forEach(line => {
        if (line.includes("prix :")) {
            const parts = line.split(", ");
            try {
                currentArticle.name = parts[0].split("#")[1]?.trim();
                currentArticle.price = parseFloat(parts[1].split(" : ")[1]?.replace(",", "."));
                currentArticle.brand = parts[2].split(" : ")[1]?.trim() || "Marque non spécifiée";
                currentArticle.size = parts[3].split(" : ")[1]?.trim() || "Taille non spécifiée";

                // Vérifiez si les champs sont valides avant d'ajouter l'article
                if (!isNaN(currentArticle.price)) {
                    articles.push(currentArticle);
                }
                currentArticle = {};
            } catch (error) {
                console.error("Erreur lors de l'extraction des données de l'article :", error);
            }
        }
    });

    console.log("Articles extraits :", articles);
    return articles;
}

// Calcul des statistiques avec validations
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
    const articles = extractArticlesNoRegex(preprocessedText);
    const statistics = calculateStatistics(preprocessedText);

    console.log("Statistiques calculées :", statistics);
    return {
        articles,
        statistics
    };
}

// Exemple d'utilisation
const exampleText = `
Nintendo Wii # Mario Kart #, prix : 24,90 €, marque : Nintendo, taille : Standard
Très bon état

Nintendo Wii # Zelda #, prix : 19,90 €, marque : Nintendo, taille : Standard
Très bon état
`;

const analysis = analyzeData(exampleText);
console.log("Résultats de l'analyse :", analysis);
