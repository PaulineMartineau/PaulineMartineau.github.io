let headerInstance = null;

function updateHeaderName(finder) {
  const activesElements = finder.querySelectorAll(".elemFinder.active");
  var newName = null;
  for (let i = activesElements.length - 1; i >= 0; i--) {
    if (activesElements[i].id == "directory") {
      newName = activesElements[i].dataset.app;
      break;
    }
  }
  newName = newName ? newName : headerInstance.appName;
  headerInstance.setDirectoryName(newName);
}

class HeaderFinder {
  constructor(appName, finder) {
    this.appName = appName;
    this.directoryName = null;
    this.instance = this.createHeader(finder);
  }

  createHeader(finder) {
    const headerDiv = document.createElement("div");
    headerDiv.classList.add("headerFinder");

    //Navigation
    const navigation = document.createElement("div");
    navigation.classList.add("navigation");

    const previous = document.createElement("button");
    previous.classList.add("previous");
    previous.textContent = String.fromCodePoint(0xfe64);
    const next = document.createElement("button");
    next.classList.add("next");
    next.textContent = String.fromCodePoint(0xfe65);

    navigation.appendChild(previous);
    navigation.appendChild(next);

    this.directoryName = document.createElement("div");
    this.directoryName.textContent = this.appName;

    //Selction de la vue
    const viewSection = document.createElement("div");
    viewSection.classList.add("viewSection");

    const listView = document.createElement("button");
    const iconView = document.createElement("button");

    listView.classList.add("modeList", "active");
    listView.addEventListener("click", () => {
      const partsFinder = finder.querySelectorAll(".partFinder");
      partsFinder.forEach((partFinder) => {
        if (!partFinder.className.includes("listView")) {
          partFinder.classList.add("listView");
          partFinder.classList.remove("iconView");
        }
        if (!listView.classList.contains("active")) {
          listView.classList.add("active");
          iconView.classList.remove("active");
        }
      });
    });
    const iconListView = document.createElement("div");
    iconListView.style.backgroundImage = 'url("../src/png/list.png")';
    listView.appendChild(iconListView);

    iconView.classList.add("modeIcon");
    iconView.addEventListener("click", () => {
      const partsFinder = finder.querySelectorAll(".partFinder");
      partsFinder.forEach((partFinder) => {
        if (partFinder.className.includes("listView")) {
          partFinder.classList.remove("listView");
          partFinder.classList.add("iconView");
        }
        if (!iconView.classList.contains("active")) {
          iconView.classList.add("active");
          listView.classList.remove("active");
        }
      });
    });

    const iconIconView = document.createElement("div");
    iconIconView.style.backgroundImage = 'url("../src/png/grid.png")';
    iconView.appendChild(iconIconView);

    viewSection.appendChild(listView);
    viewSection.appendChild(iconView);

    //AppendChild dans la div principale
    headerDiv.appendChild(navigation);
    headerDiv.appendChild(this.directoryName);
    headerDiv.appendChild(viewSection);

    return headerDiv;
  }

  setDirectoryName(newName) {
    if (this.directoryName) this.directoryName.textContent = newName;
  }
}

class PartFinder {
  constructor(name, finder, contentDiv) {
    this.name = name;
    this.instance = this.createPartFinder(finder, contentDiv);
  }

  createPartFinder(finder, contentDiv) {
    const partFinder = finder.querySelector(".partFinder");
    const modeView = partFinder
      ? Array.from(partFinder.classList).filter(
          (className) => className !== "partFinder"
        )[0]
      : "listView";

    const partDivLeft = document.createElement("div");
    partDivLeft.classList.add("partFinder", modeView);
    partDivLeft.style.width = "40%";

    initializeResize(partDivLeft);
    new ElementFinder(this.name, partDivLeft, finder, contentDiv);

    partDivLeft.addEventListener("mousedown", (event) => {
      if (
        document.body.style.userSelect != "none" &&
        event.target === partDivLeft
      ) {
        partDivLeft.id = "active";
        const partsFinder = finder.querySelectorAll(".partFinder");
        const indexPart = Array.from(partsFinder).findIndex(
          (partFinder) => partFinder.id === "active"
        );
        partDivLeft.removeAttribute("id");
        for (let i = indexPart + 1; i < partsFinder.length; i++) {
          partsFinder[i].remove();
        }
        const elements = partDivLeft.querySelectorAll(".elemFinder");
        elements.forEach((element) => {
          element.classList.remove("active");
        });

        updateHeaderName(finder);
      }
    });

    return partDivLeft;
  }
}

class ElementFinder {
  constructor(name, partFinder, finder, contentDiv) {
    this.name = name;
    this.list = partFinder;
    this.racine = name == "Bureau" ? computer : computer.elements[0];
    this.finderContent = contentDiv;
    this.instance = this.createListView(finder);
  }

  createListView(finder) {
    this.racine.elements.forEach((element) => {
      if (element.type === "directory" && element.name == this.name) {
        element.elements?.forEach((file) => {
          const listItem = new IconFinderList(file);
          this.list.appendChild(listItem.instance);
        });
      }

      const elements = this.list.querySelectorAll(".elemFinder");
      elements.forEach((element, index) => {
        element.addEventListener("click", () => {
          const activeElement = Array.from(elements).find((element) =>
            element.classList.contains("active")
          );
          const activeIndex = Array.from(elements).indexOf(activeElement);

          //   if (activeIndex == index) return;
          if (activeIndex == -1) element.classList.add("active");
          else {
            activeElement.classList.remove("active");
            element.classList.add("active");
            //changer le nom du finder
          }

          this.list.id = "active";
          const partsFinder = finder.querySelectorAll(".partFinder");
          const indexPart = Array.from(partsFinder).findIndex(
            (partFinder) => partFinder.id === "active"
          );
          this.list.removeAttribute("id");

          if (partsFinder[indexPart + 1]) partsFinder[indexPart + 1].remove();
          for (let i = indexPart + 2; i < partsFinder.length; i++) {
            partsFinder[i].remove();
          }

          const newPart = new PartFinder(
            element.dataset.app,
            finder,
            this.finderContent
          );
          this.finderContent.appendChild(newPart.instance);

          const name = element.dataset.app;
          const icon = getElement(name).path;
          if (element.id != "directory") {
            const preview = document.createElement("div");
            preview.classList.add("previewFinder");
            const img = document.createElement("img");
            img.src = icon;
            const nameFile = document.createElement("div");
            nameFile.textContent = name;

            preview.appendChild(img);
            preview.appendChild(nameFile);

            newPart.instance.appendChild(preview);
            updateHeaderName(finder);
          } else headerInstance.setDirectoryName(element.dataset.app);
        });
      });
    });
  }
}

class Finder {
  constructor(appName) {
    this.appName = appName;
    this.instance = this.createFinder();
  }

  createFinder() {
    const finder = document.createElement("div");
    finder.classList.add("finder");

    const header = new HeaderFinder(this.appName, finder);
    finder.appendChild(header.instance);
    headerInstance = header;

    const contentDiv = document.createElement("div");
    contentDiv.classList.add("contentFinder");
    contentDiv.style.width = "100%";
    contentDiv.style.height = "100%";
    finder.appendChild(contentDiv);

    const partFinder = new PartFinder(this.appName, finder, contentDiv);
    contentDiv.appendChild(partFinder.instance);

    return finder;
  }
}

function initializeResize(partFinder) {
  let isResizing = false;
  let startX = 0;
  let startWidth = 0;

  partFinder.addEventListener("mousedown", (event) => {
    const computedStyle = window.getComputedStyle(partFinder, "::after");
    const afterWidth = parseInt(computedStyle.width);
    const afterRight = parseInt(computedStyle.right);
    const parentWidth = partFinder.clientWidth;
    const clickX = event.clientX - partFinder.getBoundingClientRect().left;

    if (clickX >= parentWidth - afterWidth - afterRight) {
      isResizing = true;
      startX = event.clientX;
      startWidth = parseFloat(getComputedStyle(partFinder).width);
      partFinder.classList.add("resizing");
      document.body.style.userSelect = "none";
    }
  });

  window.addEventListener("mousemove", (event) => {
    if (isResizing) {
      const newWidth = startWidth + (event.clientX - startX);
      if (newWidth >= 100) partFinder.style.width = `${newWidth}px`;
    }
  });

  window.addEventListener("mouseup", () => {
    if (isResizing) {
      partFinder.classList.remove("resizing");
      document.body.style.userSelect = "auto";
      isResizing = false;
    }
  });
}
