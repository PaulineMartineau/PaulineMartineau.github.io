function getElement(appName) {
    var elem;
    switch (appName.split('.')[1]) {
        case 'txt':
            elem = paths.elements.find(element => element.name === "txt");
            break;
        case 'pdf':
            elem = paths.elements.find(element => element.name === "pdf");
            break;
        case 'game':
            elem = paths.elements.find(element => element.name === "game");
            break;
        case 'sh':
            elem = paths.elements.find(element => element.name === "executable");
            break;
        default:
            elem = paths.elements.find(element => element.name === "folder");
    }
    return elem;
}

class IconDock {
    constructor(appName, id) {
        this.appName = appName;
        this.id = id;
        this.tooltipText = appName;
        this.instance = this.createIcon();
    }

    createIcon() {
        const iconsList = document.querySelectorAll('.btn-desktop');
        const dataAppValues = Array.from(iconsList).map(element => element.getAttribute('data-app'));

        if (dataAppValues.includes(this.appName))
            return;

        const iconDiv = document.createElement('div');
        iconDiv.classList.add('dock__icons','btn-desktop');
        iconDiv.setAttribute('data-app',this.appName);
        iconDiv.setAttribute('id',this.id);

        const element = getElement(this.appName);
        const imgElement = document.createElement('img');
        imgElement.src = element.path;
        imgElement.alt = element.name;

        const stateSpan = document.createElement('span');
        stateSpan.classList.add('state');

        const tooltipSpan = document.createElement('span');
        tooltipSpan.classList.add('tooltip');
        tooltipSpan.textContent = this.tooltipText;

        iconDiv.appendChild(imgElement);
        iconDiv.appendChild(stateSpan);
        iconDiv.appendChild(tooltipSpan);

        return iconDiv;
    }
}

class IconFinderList {
    constructor(element){
        this.data = getElement(element.name)
        this.src = this.data.path;
        this.alt = this.data.name;
        this.type = element.type;
        this.name = element.name;
        this.instance = this.createIconFinderList();
    }

    createIconFinderList(){
        const object = document.createElement('div');
        object.classList.add('elemFinder', 'btn');
        object.setAttribute('data-app', this.name)

        const img = document.createElement('img');
        img.src = this.src;
        img.alt = this.alt;
        img.id ='iconList'
        object.appendChild(img);

        const name = document.createElement('div');
        name.textContent = this.name;
        name.style.fontSize = 'large';
        object.appendChild(name);

        if (this.data.name == 'folder'){
            const btnOpen = document.createElement('button');
            btnOpen.classList.add('btnRedir');
            btnOpen.textContent = '>';
            object.appendChild(btnOpen);
        }
        return object;
    }
}



