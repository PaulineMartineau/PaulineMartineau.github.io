function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;

    script.onload = () => {
      resolve();
    };

    script.onerror = () => {
      reject(new Error(`Impossible de charger le fichier : ${src}`));
    };

    document.head.appendChild(script);
  });
}

// Liste des fichiers JavaScript à charger
const filesToLoad = [
  './js/data/computer.js',
  './js/data/cardMemory.js',
  './js/data/pathSvgIcons.js',
  
  './js/class/dockClass.js',
  './js/class/modalClass.js',
  './js/class/iconClass.js',
  './js/class/finderClass.js',
  './js/class/systemClass.js',
  
  './js/manage/manage.js',
  './js/manage/dom.js',
  './js/manage/utilsIconDock.js',
  './js/manage/utilsTerminal.js',
  './js/manage/utilsResizeModale.js',

  './js/start.js',
];

// Charger les fichiers séquentiellement
async function loadScriptsSequentially(files) {
  for (const file of files) {
    try {
      await loadScript(file);
    } catch (error) {
      console.error(`Une erreur s'est produite lors du chargement du fichier ${file} :`, error);
      throw error; // Arrêter le chargement en cas d'erreur
    }
  }
  console.log('Tous les fichiers JavaScript sont chargés avec succès.');
}

loadScriptsSequentially(filesToLoad).catch(error => {
  console.error('Une erreur s\'est produite lors du chargement des fichiers JavaScript :', error);
});
