# TutoHub - Plateforme de Tutoriels Autonome

TutoHub est un site web personnel conçu pour publier des tutoriels sur l'intelligence artificielle, la cryptomonnaie, le streaming et le business en ligne.

Le site est entièrement contenu dans un seul fichier `index.html`, ce qui facilite son hébergement sur des plateformes gratuites comme GitHub Pages ou Netlify.

## Fonctionnalités
- **Navigation Rapide** : Menu fluide et filtrage instantané.
- **Recherche en Temps Réel** : Trouvez des tutoriels par mot-clé.
- **Design Moderne** : Thème sombre ("Dark Mode") professionnel et responsive (mobile, tablette, desktop).
- **Zéro Dépendance** : Pas besoin de serveur, de base de données ou de frameworks externes.

## Comment ajouter un tutoriel ?
Pour ajouter un nouvel article, suivez ces étapes :

1. Ouvrez le fichier `index.html` dans un éditeur de texte (VS Code, Notepad++, etc.).
2. Recherchez la ligne commençant par `const articles = [`.
3. Copiez et collez un bloc d'article existant en haut du tableau.
4. Remplissez les champs suivants :
   - `id` : Un identifiant unique.
   - `titre` : Le titre de votre tutoriel.
   - `categorie` : 'ia', 'crypto', 'streaming' ou 'business'.
   - `date` : Format "AAAA-MM-JJ".
   - `resume` : Une courte description pour la carte.
   - `image` : URL d'une image d'illustration.
   - `contenu` : Le corps de l'article en HTML (utilisez `<h2>`, `<p>`, `<ul>`, `<pre><code>`, etc.).
5. Sauvegardez le fichier et mettez-le en ligne.

## Installation / Hébergement
Il suffit de déposer le fichier `index.html` sur votre hébergeur.
Pour GitHub Pages :
1. Créez un dépôt.
2. Téléversez `index.html`.
3. Activez GitHub Pages dans les paramètres du dépôt.
