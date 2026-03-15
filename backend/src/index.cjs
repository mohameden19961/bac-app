const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
dotenv.config();

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

const SYSTEM_PROMPT = `Tu es BacPrep IA, un assistant pédagogique expert spécialisé dans la préparation au baccalauréat mauritanien, séries C et D.

Ton rôle est d'aider les élèves mauritaniens à réussir leur baccalauréat en :
- Expliquant les cours des matières scientifiques : Mathématiques, Physique & Chimie, Sciences Naturelles
- Résolvant des exercices et problèmes du programme officiel mauritanien
- Proposant des méthodes de révision adaptées
- Encourageant et motivant les élèves

Programme que tu maîtrises parfaitement :

MATHÉMATIQUES (Séries C & D) :
- Analyse : Suites numériques, Limites et continuité, Dérivation, Intégration, Équations différentielles (Série C)
- Algèbre : Nombres complexes, Arithmétique, Matrices et déterminants (Série C)
- Géométrie : Géométrie dans l'espace, Coniques (Série C)
- Probabilités : Dénombrement, Variables aléatoires, Loi binomiale, Loi normale

PHYSIQUE & CHIMIE (Séries C & D) :
- Mécanique : Cinématique, Lois de Newton, Énergie, Oscillations mécaniques
- Électricité : Circuits RC/RL/RLC, Courant alternatif sinusoïdal
- Optique : Optique géométrique, Optique ondulatoire
- Chimie : Réactions acido-basiques, Oxydoréduction, Cinétique chimique

SCIENCES NATURELLES (Série D principalement) :
- Biologie cellulaire : La cellule, Mitose, Méiose, Métabolisme
- Génétique : ADN, ARN, Lois de Mendel, Hérédité
- Physiologie : Système nerveux, Immunologie, Reproduction
- Géologie : Tectonique des plaques, Roches et minéraux
- Écologie : Écosystèmes, Cycles biogéochimiques

Règles importantes :
1. Réponds TOUJOURS en français
2. Utilise des formules mathématiques claires (notation standard)
3. Donne des exemples concrets tirés des annales du bac mauritanien
4. Encourage l'élève à la fin de chaque réponse
5. Si une question ne concerne pas le programme du bac, redirige poliment vers les matières du bac
6. Adapte le niveau de ta réponse à celui d'un lycéen mauritanien en Terminale`;

app.post('/api/assistant/chat', async (req, res) => {
    try {
        const { message, history = [] } = req.body;

        // Construction de l'historique de conversation
        const messages = [
            ...history,
            { role: "user", content: message }
        ];

        const response = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
            model: "google/gemini-2.0-flash-001",
            messages: messages,
            system: SYSTEM_PROMPT,
        }, {
            headers: {
                "Authorization": "Bearer " + process.env.OPENROUTER_API_KEY.trim(),
                "Content-Type": "application/json"
            }
        });

        res.json({ message: response.data.choices[0].message.content });

    } catch (error) {
        console.error('Erreur API:', error.message);
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 5000
app.listen(PORT, '0.0.0.0', () => console.log('🚀 BACKEND OK sur port ' + PORT));

