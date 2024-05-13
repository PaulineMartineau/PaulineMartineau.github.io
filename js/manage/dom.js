const dom = {
    memory: {
        cards: document.querySelectorAll('.card'),
        boxCard: document.querySelectorAll('.box-card'),
    }
}

function getDomToCreateModale(icon) {
    return {
        appName : icon.getAttribute('data-app'),
        id : icon.getAttribute('id'),
        title : icon.getAttribute('data-app') == 'terminal' ? "pauline - pauline-martineau@computer --- zsh" : icon.getAttribute('data-app'),
        modale : '',
    }
}

function getDomHeaderModale(modale, icon){
    return {
        close: modale.querySelector(".close"),
        resize: modale.querySelector(".resize"),
        reduce: modale.querySelector(".reduce"),
        select: icon.querySelector('.state'),
    }
}

function getDomTerminal() {
    return {
        welcome: document.getElementById('welcome'),
        output: document.getElementById('output'),
        input: document.getElementById('input'),
        invit: document.getElementById('invit'),
        terminal: document.getElementById('terminal'),
        prompt: "<i class='fa-solid fa-circle-chevron-right'></i>  Pauline ~ ",
    };
}