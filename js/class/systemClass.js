class Settingsystem {
  constructor(type) {
    this.previewImg = document.createElement("div");
    this.previewName = document.createElement("div");
    this.instance = this.createPannel(type);
  }

  createPannel(type) {
    const setting = document.createElement("div");

    //Preview part
    const preview = document.createElement("div");
    preview.classList.add("previewSyst");
    this.previewImg.classList.add("previewImg");
    this.previewName.classList.add("previewName");
    preview.appendChild(this.previewImg);
    preview.appendChild(this.previewName);
    setting.appendChild(preview);

    //Selector Part
    const selector = document.createElement("div");

    const list = document.createElement("div");
    list.classList.add("list");
    this.fillList(list);

    const icon = document.createElement("div");
    icon.classList.add("icon");
    this.fillIcon(icon);

    selector.appendChild(list);
    selector.appendChild(icon);

    selector.classList.add("selectorSyst");

    setting.appendChild(selector);

    return setting;
  }

  fillList(list, type = null) {
    const detailsElement = document.createElement("details");

    const summaryElement = document.createElement("summary");
    summaryElement.textContent = "CarrotComputer";
    summaryElement.style.paddingLeft = "10px";

    const ulElement = document.createElement("ul");
    ulElement.style.listStyleType = "none";

    for (var i = 1; i <= 7; i++) {
      const li = document.createElement("li");
      li.textContent = `Fond d'écran ${i}`;
      ulElement.appendChild(li);
    }

    detailsElement.appendChild(summaryElement);
    detailsElement.appendChild(ulElement);

    list.appendChild(detailsElement);
  }

  fillIcon(icon, type = null) {
    const self = this;
    const screen = document.querySelector(".screen");

    function handleDivClick(url, event) {
        console.log(i);
      //ICI save les changement dans le localstorage
      const target = event.currentTarget;
      const radioInput = target.querySelector('input[type="radio"]');
      if (radioInput) {
        radioInput.checked = true;
      }
      screen.style.backgroundImage = url;
      self.previewImg.style.backgroundImage = url;

      self.previewName.textContent = `Fond d'écran ${parseInt(url.match(/\d/)[0]) + 1}`
    }

    function updateRadioInput(radioInput, url, i){
        const computedStyles = window.getComputedStyle(screen);
        const backgroundImage =
            computedStyles.getPropertyValue("background-image");
        const imageUrl = backgroundImage.replace(/url\(['"]?(.*?)['"]?\)/, "$1");
        const parsedUrl = new URL(imageUrl);
        const path = parsedUrl.pathname;
        if (url.includes(path)){
            radioInput.checked = true;
            self.previewImg.style.backgroundImage = url;
            self.previewName.textContent = `Fond d'écran ${i}`
        }
    }

    for (var i = 1; i <= 7; i++) {
      const bg = document.createElement("div");
      bg.classList.add("bg");

      const bgImg = document.createElement("div");
      bgImg.classList.add("bg-image");
      //Attention choisir la liste des image a partir du type ici !!!
      const url = `url("../src/jpg/bg${i - 1}.jpg")`;
      bgImg.style.backgroundImage = url;

      const radioInput = document.createElement("input");
      radioInput.type = "radio";
      //Attention exclusivité du radio ajouter le type ici !!!
      radioInput.name = "gridRadio";
      //ATTNETION AU TYPE
      updateRadioInput(radioInput, url, i);

      bg.appendChild(bgImg);
      bg.appendChild(radioInput);
      bg.addEventListener("click", (event) => handleDivClick(url, event));

      icon.appendChild(bg);
    }
  }
}

class PreferenceSystem {
  constructor() {
    this.instance = this.createContentPrefSystem();
  }

  createContentPrefSystem() {
    const contentDiv = document.createElement("div");
    contentDiv.classList.add("contentPrefSyst");

    const globalBox = document.createElement("div");
    globalBox.classList.add("globalPrefSyst");

    const btnDiv = document.createElement("div");
    btnDiv.classList.add("btnPrefSyst");
    globalBox.appendChild(btnDiv);

    const btnDesktop = document.createElement("button");
    btnDesktop.classList.add("btnDesktop", "active");
    btnDesktop.innerHTML = "Bureau";
    btnDiv.appendChild(btnDesktop);

    const btnProfil = document.createElement("button");
    btnProfil.classList.add("btnProfil");
    btnProfil.innerHTML = "Profil";
    btnDiv.appendChild(btnProfil);

    const PannelDesktop = new Settingsystem();
    const pannelDesktop = PannelDesktop.instance;
    pannelDesktop.classList.add("pannelSyst", "active");
    globalBox.appendChild(pannelDesktop);

    // const PannelProfile = new Settingsystem();
    // const pannelProfile = PannelProfile.instance;
    // pannelProfile.classList.add("pannelSyst");
    // globalBox.appendChild(pannelProfile);

    contentDiv.appendChild(globalBox);

    return contentDiv;
  }
}
