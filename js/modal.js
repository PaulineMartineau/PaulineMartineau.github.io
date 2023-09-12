const openModalBtn = document.getElementById("openModalBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const modal = document.getElementById("myModal");
const container = document.getElementsByClassName("container");
const title = document.getElementById('title');


function openModal(type) {
    modal.style.display = "block";
    container[0].style.filter = "blur(5px)";

    switch (type) {
        case 'terminal':
            title.innerHTML = "pauline - pauline@computer -- zsh";
            break;
        default:
            title.innerHTML = type;
            break;
    }


    // Fermer la modal
    closeModalBtn.addEventListener("click",() => {
        modal.style.display = "none";
        container[0].style.filter = "none";

    });

    // Fermer la modal si l'utilisateur clique en dehors de la modal
    window.addEventListener("click",(event) => {
        if (event.target === modal) {
            modal.style.display = "none";
            container[0].style.filter = "none";
        }
    });
}