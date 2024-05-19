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
    // if (type != 'bg') {
    //     this.previewImg.style.width = "100px";
    //     this.previewImg.style.height = "100px";
    //     this.previewImg.style.borderRadius = "50px";
    // }
    this.previewName.classList.add("previewName");

    preview.appendChild(this.previewImg);
    preview.appendChild(this.previewName);
    setting.appendChild(preview);

    //Selector Part
    const selector = document.createElement("div");
    selector.classList.add("selectorSyst");

    const list = document.createElement("div");
    list.classList.add("list");
    this.fillList(list, type);
    const icon = document.createElement("div");
    icon.classList.add("icon");
    this.fillIcon(icon, type);

    selector.appendChild(list);
    selector.appendChild(icon);

    setting.appendChild(selector);

    return setting;
  }

  fillList(list, type) {
    const detailsElement = document.createElement("details");

    const summaryElement = document.createElement("summary");
    summaryElement.textContent = "CarrotComputer";
    summaryElement.style.paddingLeft = "10px";

    const ulElement = document.createElement("ul");
    ulElement.style.listStyleType = "none";

    for (var i = 1; i <= 7; i++) {
      const li = document.createElement("li");
      li.textContent =
        type == "bg" ? `Fond d'écran ${i}` : `Image de profil ${i}`;
      ulElement.appendChild(li);
    }

    detailsElement.appendChild(summaryElement);
    detailsElement.appendChild(ulElement);

    list.appendChild(detailsElement);
  }

  fillIcon(icon, type) {
    const self = this;
    const screen = document.querySelector(".screen");
    const profil = document.querySelector(".profile");

    function handleDivClick(url, event, type) {
      //ICI save les changement dans le localstorage
      const target = event.currentTarget;
      const radioInput = target.querySelector('input[type="radio"]');
      if (radioInput) {
        radioInput.checked = true;
      }
      const element = type == "bg" ? screen : profil;
      element.style.backgroundImage = url;
      self.previewImg.style.backgroundImage = url;
      const textContentName =
        type == "bg"
          ? `Fond d'écran ${parseInt(url.match(/\d/)[0]) + 1}`
          : `Image de profil ${parseInt(url.match(/\d/)[0]) + 1}`;
      self.previewName.textContent = textContentName;
    }

    function updateRadioInput(radioInput, url, i, type) {
      const computedStyles =
        type == "bg"
          ? window.getComputedStyle(screen)
          : window.getComputedStyle(profil);
      const backgroundImage =
        computedStyles.getPropertyValue("background-image");
      const imageUrl = backgroundImage.replace(/url\(['"]?(.*?)['"]?\)/, "$1");
      const parsedUrl = new URL(imageUrl);
      const path = parsedUrl.pathname;
      if (url.includes(path)) {
        radioInput.checked = true;
        self.previewImg.style.backgroundImage = url;
        self.previewName.textContent =
          type == "bg" ? `Fond d'écran ${i}` : `Image de profil ${i}`;
      }
    }

    for (var i = 1; i <= 7; i++) {
      const bg = document.createElement("div");
      bg.classList.add("bg");

      const bgImg = document.createElement("div");
      bgImg.classList.add("bg-image");
      const url =
        type == "bg"
          ? `url("../src/jpg/bg${i - 1}.jpg")`
          : `url("../src/jpg/profil${i - 1}.jpg")`;
      bgImg.style.backgroundImage = url;

      const radioInput = document.createElement("input");
      radioInput.type = "radio";
      radioInput.name = type == "bg" ? "bgRadio" : "profilRadio";
      updateRadioInput(radioInput, url, i, type);

      bg.appendChild(bgImg);
      bg.appendChild(radioInput);
      bg.addEventListener("click", (event) => handleDivClick(url, event, type));

      icon.appendChild(bg);
    }
  }
}

class PreferenceSystem {
  constructor() {
    this.instance = this.createContentPrefSystem();
  }

  createContentPrefSystem() {
    function handlePannelDiv(event) {
      const target = event.currentTarget;
      const pannels = document.querySelectorAll(".pannelSyst");
      const buttons = [
        document.querySelector(".btnDesktop"),
        document.querySelector(".btnProfil"),
      ];

      if (target.className.includes("active")) return;

      pannels.forEach((pannel) => {
        pannel.classList.toggle("active");
      });
      buttons.forEach((button) => {
        button.classList.toggle("active");
      });
    }

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
    btnDesktop.addEventListener("click", handlePannelDiv);
    btnDiv.appendChild(btnDesktop);

    const btnProfil = document.createElement("button");
    btnProfil.classList.add("btnProfil");
    btnProfil.innerHTML = "Profil";
    btnProfil.addEventListener("click", handlePannelDiv);
    btnDiv.appendChild(btnProfil);

    const PannelDesktop = new Settingsystem("bg");
    const pannelDesktop = PannelDesktop.instance;
    pannelDesktop.classList.add("pannelSyst", "active");
    globalBox.appendChild(pannelDesktop);

    const PannelProfile = new Settingsystem("profile");
    const pannelProfile = PannelProfile.instance;
    pannelProfile.classList.add("pannelSyst");
    globalBox.appendChild(pannelProfile);


    contentDiv.appendChild(globalBox);

    return contentDiv;
  }
}
