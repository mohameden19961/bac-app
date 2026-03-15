# BacPrep MR 🎓

Application web d'aide à la préparation du baccalauréat mauritanien (Séries C & D) avec assistant IA.

**Stack** : React · Node.js · Firebase · Claude API · Docker · Nginx

---

## 🚀 Installation rapide

### 1. Cloner et configurer
```bash
git clone https://github.com/TON_USERNAME/bac-prep-mr.git
cd bac-prep-mr
cp .env.example .env
# Édite .env avec tes clés API
```

### 2. Configurer Firebase
1. Va sur [console.firebase.google.com](https://console.firebase.google.com)
2. Crée un projet "bacprep-mr"
3. Active **Authentication** → Email/Password
4. Active **Firestore Database** (mode test pour commencer)
5. Active **Storage**
6. Copie les clés dans `.env`
7. Génère un compte de service → télécharge le JSON → colle dans `FIREBASE_SERVICE_ACCOUNT`

### 3. Obtenir la clé Anthropic
1. Va sur [platform.anthropic.com](https://platform.anthropic.com)
2. Crée une clé API
3. Colle dans `ANTHROPIC_API_KEY`

### 4. Lancer avec Docker
```bash
docker-compose up --build
```
L'app sera disponible sur **http://localhost**

### 5. Créer le compte démo
```bash
curl -X POST http://localhost/api/auth/setup-demo \
  -H "x-setup-secret: TON_SETUP_SECRET"
```
Compte démo : **user: demo@bacprep.mr / pass: demo**

---

## 🛠️ Développement local (sans Docker)

### Frontend
```bash
cd frontend
npm install
npm run dev
# → http://localhost:3000
```

### Backend
```bash
cd backend
npm install
npm run dev
# → http://localhost:5000
```

---

## 📁 Structure du projet
```
bac-app/
├── frontend/          # React + Vite + Tailwind
│   └── src/
│       ├── pages/     # Login, Dashboard, Cours, Exercices, Assistant, Planning
│       ├── components/# Layout, composants réutilisables
│       ├── hooks/     # useAuth
│       └── utils/     # Firebase config
├── backend/           # Node.js + Express
│   └── src/
│       ├── routes/    # assistant, auth, cours
│       ├── middleware/ # verifyToken
│       └── config/    # firebase admin
├── nginx/             # Reverse proxy config
├── docker-compose.yml
└── .env.example
```

---

## 🏆 Fonctionnalités
- ✅ Authentification Firebase (inscription / connexion / démo)
- ✅ Tableau de bord avec suivi de progression
- ✅ Bibliothèque de cours (Maths, Physique, SVT)
- ✅ Exercices interactifs & QCM avec corrections
- ✅ Assistant IA (Claude) spécialisé programme mauritanien
- ✅ Planning de révision hebdomadaire
- ✅ Rendu LaTeX pour les formules mathématiques
- ✅ Dockerisé (micro-services : frontend + backend + nginx)
- ✅ Compte démo : user=demo / pass=demo

---

## 🌐 Déploiement (Railway)
1. Push sur GitHub
2. Crée un projet sur [railway.app](https://railway.app)
3. Connecte le repo GitHub
4. Configure les variables d'environnement
5. Railway détecte Docker automatiquement ✅
