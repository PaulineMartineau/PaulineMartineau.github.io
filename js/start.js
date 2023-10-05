// Set up et update de la date
const dateDiv = document.querySelector('#date');

function updateDateTime() {
    const daysOfWeek = ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'];
    const months = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];

    const now = new Date();
    const dayOfWeek = daysOfWeek[now.getDay()];
    const dayOfMonth = now.getDate();
    const month = months[now.getMonth()];
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');

    const dateTimeString = `${dayOfWeek} ${dayOfMonth} ${month} à ${hours}:${minutes}`;

    dateDiv.textContent = dateTimeString;
}

updateDateTime();

setInterval(updateDateTime, 1000);


// Unlock sreen
const password = document.querySelector('.password');
const lock = document.querySelector('.lock');
const unlock = document.querySelector('.unlock');
const dockEl = document.querySelector('.dock');
const banner = document.querySelector('.banner');
const screenDiv = document.querySelector('.screen');
const computerImg = document.querySelector('.computer');

function changeScreen(){
    lock.style.display = 'none';

    unlock.style.display = 'flex';
    unlock.style.flexDirection = 'column';
    unlock.style.flexWrap = 'wrap-reverse';
    unlock.style.alignContent = 'flex-start';

    computerImg.style.display = 'none'

    dockEl.style.display = 'flex';

    banner.style.height = '4vh';

    screenDiv.style.width = '100vw';
    screenDiv.style.height = '100vh';
    screenDiv.style.position = 'static';
    screenDiv.style.top = '0';
    screenDiv.style.left = '0';
    screenDiv.style.transform = 'translate(0%, 0%)';
}

password.addEventListener('click', () =>{
    changeScreen();
})

//Listener pour les icons du bureau
manage.modale.addListener();

// Listener pour les icons du dock
const icons = document.querySelectorAll('.btn-desktop');
icons.forEach(icon => {
    icon.addEventListener('click',() => {
        manage.modale.open(icon);
    });
});
