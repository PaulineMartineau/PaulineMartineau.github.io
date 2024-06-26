// Set up et update de la date
const dateDiv = document.querySelector("#date");

function updateDateTime() {
  const daysOfWeek = ["Dim.", "Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam."];
  const months = [
    "janv.",
    "févr.",
    "mars",
    "avr.",
    "mai",
    "juin",
    "juil.",
    "août",
    "sept.",
    "oct.",
    "nov.",
    "déc.",
  ];

  const now = new Date();
  const dayOfWeek = daysOfWeek[now.getDay()];
  const dayOfMonth = now.getDate();
  const month = months[now.getMonth()];
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");

  const dateTimeString = `${dayOfWeek} ${dayOfMonth} ${month} à ${hours}:${minutes}`;

  dateDiv.textContent = dateTimeString;
}

updateDateTime();

const battery = document.querySelector("#battery");
const tooltipBattery = document.querySelector(".batteryInfo");
const batteryPercent = tooltipBattery.querySelector('.percent');
const batteryCharge = tooltipBattery.querySelector('.charge');

navigator.getBattery().then(function(battery) {
  const batteryImg = document.querySelector("#battery");

  function updateBatteryStatus() {
    batteryPercent.textContent = `${battery.level * 100}%`;
    const msg = battery.charging ? "Source d'alimentation : adaptateur secteur" : "Source d'alimentation : batterie";
    batteryCharge.textContent = msg;
    if (battery.charging) {
      batteryImg.src = "../src/svg/battery-bolt.svg";
      return;
    }
    if (battery.level * 100 <= 10)
      batteryImg.src = "../src/svg/battery-empty.svg";
    else if (battery.level * 100 <= 35)
      batteryImg.src = "../src/svg/battery-low.svg";
    else if (battery.level * 100 <= 80)
      batteryImg.src = "../src/svg/battery-mid.svg";
    else
      batteryImg.src = "../src/svg/battery-full.svg";
  }

  updateBatteryStatus();

  battery.addEventListener('levelchange', updateBatteryStatus);
  battery.addEventListener('chargingchange', updateBatteryStatus);
});

// Intervalle pour mettrea jour la date et l'heure
setInterval(updateDateTime, 1000);


// Unlock sreen
const password = document.querySelector(".password");
const lock = document.querySelector(".lock");
const unlock = document.querySelector(".unlock");
const dockEl = document.querySelector(".dock");
const screenDiv = document.querySelector(".screen");
const computerImg = document.querySelector(".computer");
const capsLockImage = document.querySelector(".caps-lock");
const enter = document.querySelector(".enter");
const postIt = document.querySelector(".post-it");
const cancel = document.querySelector(".bottom");
const docker = new Dock(document.querySelector(".dock"));

//DEV MODE
// changeScreen()
// const finderPage = document.querySelector("[data-app='finder']");
// const appName = finderPage.getAttribute('data-app');
// const id = finderPage.getAttribute('id');
// const icon = getIcon(appName,id);
// manage.modale.open(icon);
//DEV MODE

function changeScreen() {
  password.value = "";
  lock.style.display = "none";
  unlock.style.display = "flex";
  unlock.style.flexDirection = "column";
  unlock.style.flexWrap = "wrap-reverse";
  unlock.style.alignContent = "flex-start";
  dockEl.style.display = "flex";
  setTimeout(() => {
    postIt.classList.add("removePostIt");
    setTimeout(() => {
      postIt.style.display = "none";
    }, 1000);
  }, 2000);
}

password.addEventListener("keyup", function (event) {
  const capsLockEnabled =
    event.getModifierState && event.getModifierState("CapsLock");

  capsLockImage.style.right = password.value ? "30px" : "10px";
  enter.style.display = password.value ? "block" : "none";

  if (!capsLockEnabled) capsLockImage.style.display = "none";
});

password.addEventListener("keydown", function (event) {
  const capsLockEnabled =
    event.getModifierState && event.getModifierState("CapsLock");

  if (capsLockEnabled) capsLockImage.style.display = "block";

  if (event.key === "Enter") checkPassword(password);
});

enter.addEventListener("click", () => {
  checkPassword(password);
});

function checkPassword(password) {
  if (password.value == "Pauline_M") setTimeout(changeScreen, 1000);
  else {
    password.select();
    password.classList.add("vibrating");
    setTimeout(function () {
      password.classList.remove("vibrating");
    }, 500);
  }
}

cancel.addEventListener("click", () => {
  password.value = "";
  password.focus();
});

//Listener pour les icons du bureau
manage.modale.addListener();

// Listener pour les icons du dock
const icons = document.querySelectorAll(".btn-desktop");
icons.forEach((icon) => {
  icon.addEventListener("click", () => {
    manage.modale.open(icon);
  });
});

//Gestion du menu carrot + infos batterie 
const menu = document.querySelector(".menu");
const carrot = document.querySelector("#carrot");

const elements = [carrot, battery];
const details = [menu, tooltipBattery];

elements.forEach((element, index) => {
  element.addEventListener("click", () => {
    element.classList.toggle("active");
    if (unlock.style.display == "flex") {
      if (element.className.includes('active')) {
        element.style.backgroundColor = " rgba(142, 128, 128, 0.8)";
        details[index].style.display = "flex";
      } else {
        details[index].style.display = "none";
        element.style.backgroundColor = "";
      }
    }
  });
});


function lockScreen() {
  lock.style.display = "flex";
  unlock.style.display = "none";
  dockEl.style.display = "none";
}

