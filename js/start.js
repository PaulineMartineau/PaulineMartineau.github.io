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

// Intervalle pour mettrea jour la date et l'heure
setInterval(updateDateTime, 1000);

// Unlock sreen
const password = document.querySelector('.password');
const lock = document.querySelector('.lock');
const unlock = document.querySelector('.unlock');
const dockEl = document.querySelector('.dock');
const screenDiv = document.querySelector('.screen');
const computerImg = document.querySelector('.computer');
const capsLockImage = document.querySelector('.caps-lock');
const enter = document.querySelector(".enter")

function changeScreen(){
    lock.style.display = 'none';
    unlock.style.display = 'flex';
    unlock.style.flexDirection = 'column';
    unlock.style.flexWrap = 'wrap-reverse';
    unlock.style.alignContent = 'flex-start';
    dockEl.style.display = 'flex';
}



password.addEventListener('keyup', function(event) {
    const capsLockEnabled = event.getModifierState && event.getModifierState('CapsLock');

    capsLockImage.style.right = password.value ? "30px" : "10px";
    enter.style.display = password.value ? 'block' : 'none';

    if (!capsLockEnabled)
        capsLockImage.style.display = 'none';

});


password.addEventListener('keydown', function(event) {
    const capsLockEnabled = event.getModifierState && event.getModifierState('CapsLock');

    if (capsLockEnabled)
        capsLockImage.style.display = 'block';
    
    if (event.key === 'Enter')
        checkPassword(password);
});

enter.addEventListener("click", () => {
    checkPassword(password);
})

function checkPassword(password){
    if (password.value == "PaulineM")
        setTimeout(changeScreen, 1000);
    else{
        password.select()
        password.classList.add("vibrating");
        setTimeout(function() {
            password.classList.remove('vibrating');
        }, 500);
    }
}

//Listener pour les icons du bureau
manage.modale.addListener();

// Listener pour les icons du dock
const icons = document.querySelectorAll('.btn-desktop');
icons.forEach(icon => {
    icon.addEventListener('click',() => {
        manage.modale.open(icon);
    });
});


