class HeaderFinder {
    constructor(appName) {
        this.appName = appName;
        this.instance = this.createHeader();
    }

    createHeader() {
        const headerDiv = document.createElement('div');
        headerDiv.classList.add("headerFinder");

        const previous = document.createElement('button');
        previous.textContent = "<";
        const next = document.createElement('button');
        next.textContent = ">";

        const directoryName = document.createElement('div');
        directoryName.textContent = this.appName;

        const listView = document.createElement('button');
        listView.classList.add('modeList');
        listView.textContent = "Liste";

        const iconView = document.createElement('button');
        iconView.classList.add('modeIcon');
        iconView.textContent = "Icon";

        headerDiv.appendChild(previous);
        headerDiv.appendChild(next);
        headerDiv.appendChild(directoryName);
        headerDiv.appendChild(listView);
        headerDiv.appendChild(iconView);

        return headerDiv;
    }
}

class ContentFinder {
    constructor() {
        this.instance = this.createContentFinder();
    }

    createContentFinder() {
        const contentDiv = document.createElement('div');
        contentDiv.classList.add('contentFinder');

        const partDivLeft = document.createElement('div');
        partDivLeft.classList.add('partFinder', 'listView');

        const partDivRight = document.createElement('div');
        partDivRight.classList.add('partFinder');

        contentDiv.appendChild(partDivLeft);
        contentDiv.appendChild(partDivRight);

        contentDiv.style.width = '100%';
        contentDiv.style.height = '100%';

        return contentDiv;
    }
}

class ElementFinder {
    constructor(name,contentDiv) {
        this.name = name;
        this.list = contentDiv.querySelector('.partFinder');
        this.racine = name == 'root' ? computer : computer.elements[0];
        this.instance = this.createListView();
    }

    createListView() {
        console.log(this.racine);
        this.racine.elements.forEach(element => {
            if ((element.type === "directory") && (element.name == this.name)) {
                element.elements?.forEach(file => {
                    const listItem = new IconFinderList(file);
                    this.list.appendChild(listItem.instance);
                });
            }
        });
    }
}

class Finder {
    constructor(appName) {
        this.appName = appName;
        this.instance = this.createFinder();
    }

    createFinder() {
        const finder = document.createElement('div');
        finder.classList.add('finder');

        const header = new HeaderFinder(this.appName);
        finder.appendChild(header.instance);

        const content = new ContentFinder();
        finder.appendChild(content.instance);

        const contentElm = content.instance;
        new ElementFinder(this.appName, contentElm);

        return finder;
    }

}

const directory = {
    manageDirectory(modale) {
        const modeList = modale.querySelector('.modeList');
        const modeIcon = modale.querySelector('.modeIcon');
        const partFinder = modale.querySelector('.partFinder');

        modeList.addEventListener('click',() => {
            console.log('iciiiii')
            if (!partFinder.className.includes('listView')) {
                partFinder.classList.add("listView");
                partFinder.classList.remove("iconView");
            }
        });

        modeIcon.addEventListener('click',() => {
            if (partFinder.className.includes('listView')) {
                partFinder.classList.remove("listView");
                partFinder.classList.add("iconView");
            }
        });
    }
}