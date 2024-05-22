class Header {
  constructor(title) {
    this.title = title;
    this.headerElement = this.createHeaderElement();
  }

  createHeaderElement() {
    const headerDiv = document.createElement("div");
    headerDiv.classList.add("header");

    const navigation = document.createElement("div");
    navigation.classList.add("navigation");

    const closeSpan = document.createElement("span");
    closeSpan.classList.add("close");

    const reduceSpan = document.createElement("span");
    reduceSpan.classList.add("reduce");

    const resizeSpan = document.createElement("span");
    resizeSpan.classList.add("resize");

    const titleH3 = document.createElement("h3");
    titleH3.classList.add("title");
    titleH3.textContent = this.title;

    navigation.appendChild(closeSpan);
    navigation.appendChild(reduceSpan);
    navigation.appendChild(resizeSpan);
    headerDiv.appendChild(navigation);
    headerDiv.appendChild(titleH3);

    managebutton(navigation);

    return headerDiv;
  }
}

function managebutton(navigation){
  navigation.addEventListener("mouseover", () =>{
    navigation.classList.add("active")
  })
  navigation.addEventListener("mouseout", () =>{
    navigation.classList.remove("active")
  })
}

class Modal {
  constructor(appName, title, content, id) {
    this.appName = appName;
    this.title = title;
    this.content = content;
    this.id = id;
    this.instance = this.createModalElement();
    this.instance.setAttribute("data-app", this.appName);
  }

  createModalElement() {
    const modalDiv = document.createElement("div");
    modalDiv.classList.add("modal");

    const modalContainerDiv = document.createElement("div");
    modalContainerDiv.classList.add("modal-container");

    const header = new Header(this.title);
    const headerElement = header.headerElement;

    const modalContentDiv = document.createElement("div");
    modalContentDiv.classList.add("modal-content");

    var appDiv;

    switch (true) {
      case this.appName == "terminal":
        appDiv = terminal();
        break;
      case this.appName == "memory.game":
        appDiv = memory();
        break;
      case this.appName == "cv.pdf":
        appDiv = openPdf("src/pauline_martineau.pdf");
        break;
      case this.appName.endsWith(".txt"):
        appDiv = openTxt(this.appName);
        break;
      case this.id == "directory":
        appDiv = openFinder(this.appName);
        break;
      case this.appName == "finder":
        appDiv = openFinder("Bureau");
        break;
      case this.appName == "Préférences Système":
        appDiv = openSystem("pref");
        break;
      default:
        const contentDiv = document.createElement("div");
        contentDiv.textContent = this.content;
        appDiv = document.createElement("div");
        appDiv.appendChild(contentDiv);
    }

    modalContentDiv.appendChild(appDiv);

    modalContainerDiv.appendChild(headerElement);
    modalContainerDiv.appendChild(modalContentDiv);

    modalDiv.appendChild(modalContainerDiv);
    // addListener();
    return modalDiv;
  }
}

function terminal() {
  const terminalDiv = document.createElement("div");
  terminalDiv.id = "terminal";

  const welcomeDiv = document.createElement("div");
  welcomeDiv.id = "welcome";

  const outputDiv = document.createElement("div");
  outputDiv.id = "output";

  const cmdLineDiv = document.createElement("div");
  cmdLineDiv.classList.add("cmd-line");

  const invitDiv = document.createElement("div");
  invitDiv.id = "invit";

  const inputElement = document.createElement("input");
  inputElement.type = "text";
  inputElement.id = "input";
  inputElement.setAttribute("autofocus", true);

  cmdLineDiv.appendChild(invitDiv);
  cmdLineDiv.appendChild(inputElement);

  terminalDiv.appendChild(welcomeDiv);
  terminalDiv.appendChild(outputDiv);
  terminalDiv.appendChild(cmdLineDiv);

  return terminalDiv;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function memory() {
  const stack = cards.concat(cards);
  shuffleArray(stack);
  const memoryDiv = document.createElement("div");
  memoryDiv.classList.add("memory");

  for (let i = 0; i < 20; i++) {
    const card = document.createElement("div");
    card.classList.add("card");

    const boxCard = document.createElement("div");
    boxCard.classList.add("box-card");
    boxCard.setAttribute("id", stack[i].name);
    card.appendChild(boxCard);

    const front = document.createElement("div");
    front.classList.add("front");
    boxCard.appendChild(front);

    const back = document.createElement("div");
    back.classList.add("back");
    const item = document.createElement("img");
    item.src = stack[i].path;
    item.alt = stack[i].name;
    back.append(item);
    boxCard.appendChild(back);

    memoryDiv.appendChild(card);
  }
  return memoryDiv;
}

function openPdf(src) {
  const pdfDiv = document.createElement("div");
  pdfDiv.classList.add("pdf-container");

  const ifram = document.createElement("iframe");
  ifram.setAttribute("id", "pdf-viewer");
  ifram.setAttribute("src", src);

  pdfDiv.appendChild(ifram);

  return pdfDiv;
}

function zoomInFct() {
  var textViewerList = document.querySelectorAll(".txt-viewer");

  // Parcourez tous les éléments .txt-viewer et appliquez le zoom à chacun
  textViewerList.forEach(function (textViewer) {
    var currentSize = window
      .getComputedStyle(textViewer)
      .getPropertyValue("font-size");
    var newSize = parseFloat(currentSize) * 1.2 + "px"; // Augmentation de 20%
    textViewer.style.fontSize = newSize;
  });
}

// Fonction pour diminuer la taille de police
function zoomOutFct() {
  var textViewerList = document.querySelectorAll(".txt-viewer");

  textViewerList.forEach(function (textViewer) {
    var currentSize = window
      .getComputedStyle(textViewer)
      .getPropertyValue("font-size");
    var newSize = parseFloat(currentSize) / 1.2 + "px"; // Augmentation de 20%
    textViewer.style.fontSize = newSize;
  });
}

function openTxt(src) {
  const txtDiv = document.createElement("div");

  const container = document.createElement("div");
  container.classList.add("txt-container");

  const filePath = `../src/${src}`;
  fetch(filePath)
    .then((response) => response.text())
    .then((content) => {
      const lines = content.split("\n");
      for (const line of lines) {
        const lineDiv = document.createElement("div");
        lineDiv.classList.add("txt-viewer");
        lineDiv.textContent = line;
        container.appendChild(lineDiv);
      }
    })
    .catch((error) => {
      console.error("Une erreur s'est produite : " + error);
    });

  const zoomIn = document.createElement("button");
  zoomIn.classList.add("zoom", "in");
  zoomIn.textContent = "+";
  zoomIn.onclick = zoomInFct;

  const zoomOut = document.createElement("button");
  zoomOut.classList.add("zoom", "out");
  zoomOut.textContent = "-";
  zoomOut.onclick = zoomOutFct;

  txtDiv.appendChild(zoomIn);
  txtDiv.appendChild(zoomOut);
  txtDiv.appendChild(container);

  return txtDiv;
}

function openFinder(name) {
  const finderDiv = new Finder(name);


  return finderDiv.instance;
}

function openSystem(type) {
  const systemDiv = new PreferenceSystem(type);

  return systemDiv.instance;
}
