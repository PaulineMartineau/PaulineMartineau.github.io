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

function managebutton(navigation) {
  navigation.addEventListener("mouseover", () => {
    navigation.classList.add("active");
  });
  navigation.addEventListener("mouseout", () => {
    navigation.classList.remove("active");
  });
}

class Modal {
  constructor(appName, title, content, id) {
    this.appName = appName;
    this.title = title;
    this.content = content;
    this.id = id;
    this.clicked = null;
    this.onRightEdge = false;
    this.onBottomEdge = false;
    this.onLeftEdge = false;
    this.onTopEdge = false;
    this.rightScreenEdge = false;
    this.bottomScreenEdge = false;
    this.b = null;
    this.x = null;
    this.y = null;
    this.evt = null;
    this.redraw = false;
    this.instance = this.createModalElement();
    this.instance.setAttribute("data-app", this.appName);

    // Bind methods to the instance
    this.calc = this.calc.bind(this);
    this.runListener = this.runListener.bind(this);
    this.canMove = this.canMove.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onUp = this.onUp.bind(this);
    this.resize = this.resize.bind(this);

    this.manageResizeManual(this.instance);
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
      case this.appName == "launchpad":
        appDiv = wip();
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
    return modalDiv;
  }

  calc(event) {
    this.b = this.instance.getBoundingClientRect();
    this.x = event.clientX - this.b.left;
    this.y = event.clientY - this.b.top;

    const MARGINS = 10;
    this.onTopEdge = Math.abs(this.y) < MARGINS;
    this.onLeftEdge = Math.abs(this.x) < MARGINS;
    this.onRightEdge = this.x >= this.b.width - MARGINS && this.x < this.b.width + MARGINS;
    this.onBottomEdge = Math.abs(this.y) >= this.b.height - MARGINS;

    this.rightScreenEdge = window.innerWidth - MARGINS;
    this.bottomScreenEdge = window.innerHeight - MARGINS;
    return;
  }

  runListener() {
    this.instance.addEventListener("mousedown", this.onMouseDown);
    document.addEventListener("mousemove", this.onMove);
    document.addEventListener("mouseup", this.onUp);
  }

  canMove() {
    return this.x > 0 && this.x < this.b.width && this.y > 0 && this.y < this.b.height && this.y < 30;
  }

  onMove(e) {
    this.calc(e);
    this.evt = e;
    this.redraw = true;
    requestAnimationFrame(this.resize);
  }

  onMouseDown(e) {
    this.calc(e);
    var isResizing = this.onRightEdge || this.onBottomEdge || this.onTopEdge || this.onLeftEdge;

    this.clicked = {
      x: this.x,
      y: this.y,
      cx: e.clientX,
      cy: e.clientY,
      w: this.b.width,
      h: this.b.height,
      isResizing: isResizing,
      isMoving: !isResizing && this.canMove(),
      onTopEdge: this.onTopEdge,
      onLeftEdge: this.onLeftEdge,
      onRightEdge: this.onRightEdge,
      onBottomEdge: this.onBottomEdge,
    };
    e.preventDefault();
  }

  onUp(e) {
    this.calc(e);
    if (this.b.y > window.innerHeight - 30 && this.b.y < 35) {
      this.instance.style.top = window.innerHeight - 30 + 'px';
    }
    this.clicked = null;
  }

  resize() {
    if (!this.redraw) return;
    this.redraw = false;

    const minWidth = 420;
    const minHeight = 210;

    if (this.clicked && this.clicked.isResizing) {
      if (this.clicked.onRightEdge) this.instance.style.width = Math.max(this.x, minWidth) + 'px';
      if (this.clicked.onBottomEdge) this.instance.style.height = Math.max(this.y, minHeight) + 'px';

      if (this.clicked.onLeftEdge) {
        var currentWidth = Math.max(this.clicked.cx - this.evt.clientX + this.clicked.w, minWidth);
        if (currentWidth > minWidth) {
          this.instance.style.width = currentWidth + 'px';
          this.instance.style.left = this.evt.clientX + 'px';
        }
      }

      if (this.clicked.onTopEdge) {
        var currentHeight = Math.max(this.clicked.cy - this.evt.clientY + this.clicked.h, minHeight);
        if (currentHeight > minHeight) {
          this.instance.style.height = currentHeight + 'px';
          this.instance.style.top = this.evt.clientY + 'px';
        }
      }
      return;
    }

    if (this.clicked && this.clicked.isMoving) {
      if (this.evt.clientY - this.clicked.y >= 35)
        this.instance.style.top = (this.evt.clientY - this.clicked.y) + 'px';
      else
        this.instance.style.top = "35px";

      this.instance.style.left = (this.evt.clientX - this.clicked.x) + 'px';
      return;
    }

    if (this.onRightEdge && this.onBottomEdge || this.onLeftEdge && this.onTopEdge) {
      this.instance.style.cursor = 'nwse-resize';
    } else if (this.onRightEdge && this.onTopEdge || this.onBottomEdge && this.onLeftEdge) {
      this.instance.style.cursor = 'nesw-resize';
    } else if (this.onRightEdge || this.onLeftEdge) {
      this.instance.style.cursor = 'ew-resize';
    } else if (this.onBottomEdge || this.onTopEdge) {
      this.instance.style.cursor = 'ns-resize';
    } else {
      this.instance.style.cursor = 'default';
    }
  }

  manageResizeManual() {
    this.runListener();
    requestAnimationFrame(this.resize);
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

function wip() {
  const wipdiv = document.createElement("div");
  wipdiv.classList.add("wip");

  const wipContent = document.createElement("div");
  wipContent.classList.add("wip-content");
  wipContent.innerHTML = "Work in progress";
  wipContent.innerHTML +=
    '<iframe src="https://giphy.com/embed/d8d7kW0JUCUDwHpDsk" width="100%" height="100%"  frameBorder="0"></iframe>';

  wipdiv.appendChild(wipContent);
  return wipdiv;
}
