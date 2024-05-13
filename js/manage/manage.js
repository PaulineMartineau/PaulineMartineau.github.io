const manage = {
    memory: {
        play() {
            const cards = document.querySelectorAll('.box-card');
            let counter = 0;
            let id = null;
            let firstCard = null;
            let flips = 0;

            cards.forEach(card => {
                card.addEventListener('click',() => {
                    if (!card.classList.contains('find')) {
                        if (counter == 0)
                            firstCard = card;
                        counter++;
                        flips++;
                        card.classList.add('flipped');
                        id = id ? id : card.getAttribute('id');
                        if (counter === 2 && id === card.getAttribute('id')) {
                            id = null;
                            counter = 0;
                            firstCard = null;
                            card.classList.add('find');
                            firstCard.classList.add('find');
                        }
                        else if (counter == 2) {
                            setTimeout(() => {
                                card.classList.remove('flipped');
                                firstCard.classList.remove('flipped');
                                id = null;
                                counter = 0;
                                firstCard = null;
                            },1000);
                        }
                    }
                });
            });
        },
    },
    terminal: {
        commands: {
            help() {
                manage.terminal.run.print("",'Liste des commandes disponibles : ',config.output);
                manage.terminal.run.print("",'&nbsp;&nbsp;- help : Affiche la liste des commandes.',config.output);
                manage.terminal.run.print("",'&nbsp;&nbsp;- clear : Efface le terminal.',config.output);
                manage.terminal.run.print("",'&nbsp;&nbsp;- pwd : Affiche le répertoire courant.',config.output);
                manage.terminal.run.print("",'&nbsp;&nbsp;- ls : Affiche le contenu du répertoire courant.',config.output);
                manage.terminal.run.print("",'&nbsp;&nbsp;- cd [directory] : Change de répertoire.',config.output);
                manage.terminal.run.print("",'&nbsp;&nbsp;- cat [file] : Affiche le fichier sur la sortie standard.',config.output);
            },

            clear() {
                manage.terminal.run.clearTerminal();
            },

            pwd() {
                manage.terminal.run.print("",manage.terminal.run.pwd[1],config.output);
            },

            ls() {
                manage.terminal.run.ls();
            },

            cat(file) {
                manage.terminal.run.cat(file);
            },

            cd(command) {
                const directory = computer.elements.find(element => element.name === command);
                if (directory === undefined && command != '..' && command != undefined) {
                    manage.terminal.run.print("",`Repertoire inconnu : ${command}`,config.output);
                    return;
                }
                manage.terminal.run.cd(command);
                manage.terminal.run.print("",manage.terminal.run.pwd[1],config.output);
            },

            date() {
                const currentDate = new Date();
                manage.terminal.run.print("",`Date actuelle : ${currentDate.toLocaleString()}`,config.output);
            },
        },
        run: {
            pwd: ["/pauline","/pauline"],
            historic: [],

            initTerminal() { },

            fillHistoric(command) {

            },

            clearTerminal() {
                config.output.innerHTML = '';
                config.welcome.innerHTML = '';
            },

            ls() {
                const directory = manage.terminal.run.pwd[1].split("/").pop();
                const list = directory == 'pauline' ? computer : computer.elements.find(element => element.name === directory);
                if (list) {
                    for (const element of list.elements)
                        manage.terminal.run.print("",element.name,config.output);
                }
            },

            cd(command) {
                switch (command) {
                    case '-':
                        manage.terminal.run.pwd = [manage.terminal.run.pwd[1],manage.terminal.run.pwd[0]];
                        break;
                    case (undefined):
                    case ('..'):
                        manage.terminal.run.pwd = [manage.terminal.run.pwd[1],'/pauline'];
                        break;
                    default:
                        manage.terminal.run.pwd = [manage.terminal.run.pwd[1],manage.terminal.run.pwd[1] + '/' + command];
                }
            },

            cat(file) {
                if (!file)
                    return;

                if (!isFileInPwd(file)) {
                    manage.terminal.run.print("","Fichier introuvable",config.output);
                    return;
                }

                const filePath = `../src/${file}`; // Remplacez par le chemin de votre fichier

                fetch(filePath)
                    .then(response => response.text())
                    .then(content => {
                        const lines = content.split('\n');
                        for (const line of lines) {
                            manage.terminal.run.print("",line,config.output);
                        }
                    })
                    .catch(error => {
                        console.error('Une erreur s\'est produite : ' + error);
                    });
            },

            runTerminal() {
                if (!config.welcome.innerHTML)
                    manage.terminal.run.print("","Tapez 'help' pour afficher la liste des commandes.",config.welcome);
                manage.terminal.run.print(config.prompt,"",config.invit);
                config.input.addEventListener('keydown',event => {
                    if (event.key === 'Enter') {
                        event.preventDefault();
                        const command = config.input.value.trim();
                        config.input.value = '';
                        manage.terminal.run.print(config.prompt,command,config.output);
                        executeCommand(command);
                        manage.terminal.run.historic.push(command);
                    }
                });
            },

            print(prompt,message,target) {
                target.innerHTML += `<div><font color="#3f589d">${prompt}</font>${message}</div>`;
            },
        },
    },
    modale: {
        open(icon) {
            const modaleDom = getDomToCreateModale(icon);

            if (manage.modale.isMatch(modaleDom.appName) &&
                manage.modale.getModale(modaleDom.appName)) {
                modaleDom.modale = manage.modale.getModale(modaleDom.appName);
                manage.modale.reOpen(modaleDom.modale);
            }
            else {
                const mod = new Modal(modaleDom.appName,modaleDom.title,"",modaleDom.id);
                const desktop = document.querySelector('.desktop');
                desktop.appendChild(mod.instance);
                modaleDom.modale = mod.instance;
            }

            const headerDom = getDomHeaderModale(modaleDom.modale,icon);

            if (modaleDom.modale.style.display == 'block') {
                // minimizeToDock(modale,icon);
                return;
            }
            modaleDom.modale.style.display = 'block';

            manage.modale.go(modaleDom);
            manage.modale.dragModale(modaleDom.modale);
            manage.modale.header(modaleDom,headerDom,icon);
            manage.modale.zIndex(modaleDom.modale);
        },
        reOpen(modal) {
            modal.style.transition = '';
            modal.classList.remove('minimized');
            modal.style.transform = '';
            modal.style.opacity = '1';
            modal.style.display = 'block';
        },
        go(modaleDom) {
            switch (true) {
                case (modaleDom.appName == 'terminal'):
                    config = getDomTerminal();
                    manage.terminal.run.runTerminal();
                    break;
                case (modaleDom.appName == 'memory.game'):
                    manage.memory.play();
                    break;
                case (modaleDom.id == 'directory'):
                case (modaleDom.appName == 'finder'):
                    directory.manageDirectory(modaleDom.modale);
                    manage.modale.addListener();
                    break;
                default:
                    break;
            }
        },
        addListener() {
            const btn = document.querySelectorAll('.btn');
            const prefSystem = document.querySelectorAll('.pref');

            btn.forEach(bouton => {
                bouton.addEventListener('dblclick',() => {
                    const appName = bouton.getAttribute('data-app');
                    const id = bouton.getAttribute('id');
                    const icon = getIcon(appName,id);
                    manage.modale.open(icon);
                })
            });
            prefSystem.forEach(bouton => {
                bouton.addEventListener('click',() => {
                    const appName = bouton.getAttribute('data-app');
                    const id = bouton.getAttribute('id');
                    const icon = getIcon(appName,id, "system");
                    manage.modale.open(icon);
                })
            });
        },
        dragModale(modale) {
            let isDragging = false;
            let offsetX,offsetY;

            modale.querySelector('.modal-container .header').addEventListener('mousedown',(e) => {
                isDragging = true;
                
                offsetX = e.clientX - modale.getBoundingClientRect().left;
                offsetY = e.clientY - modale.getBoundingClientRect().top;
                
            });

            document.addEventListener('mousemove',(e) => {
                if (isDragging) {
                    // TEST DE L'AUTRE CON
                    modale.style.left = e.clientX - offsetX + 'px';
                    if (e.clientY - offsetY >= (window.innerHeight / 25))
                        modale.style.top = e.clientY - offsetY + 'px';
                    else
                        modale.style.top = window.innerHeight / 25 + 'px';
                    // ME FRAPPE PAS STP !!!
                }
            });

            document.addEventListener('mouseup',() => {
                isDragging = false;
            });
        },
        header(modaleDom,headerDom,icon) {
            manage.modale.close(headerDom.close,headerDom.select,modaleDom.modale,icon);
            manage.modale.resize(headerDom.resize,modaleDom.modale);
            manage.modale.reduce(headerDom.reduce, icon, modaleDom.modale);
            manage.modale.select(headerDom.select,modaleDom.appName);
        },
        close(closeButton,select,modale,icon) {
            closeButton.addEventListener("click",() => {
                modale.remove();
                mod = null;
                if (!icon.className.includes('permanent'))
                    icon.remove();
                else
                    select.classList.remove('open');
            });
        },
        resize(resizeButton,modale) {
            resizeButton.addEventListener("click",() => {
                const isLittle = resizeButton.className.includes('little');
                modale.style.width = isLittle ? '80%' : '50%';
                modale.style.height = isLittle ? '83%' : '53%';
                resizeButton.classList.toggle('little');
            });
        },
        reduce(reduceButton,icon, modale) {
            reduceButton.addEventListener("click",() => {
                icon.addEventListener('click',() => {
                    manage.modale.reOpen(modale);
                });
            
                modale.style.transition = 'transform 0.5s ease-in-out, opacity 0.5s ease-in-out';
                modale.style.transform = 'translate(0, 100%) scale(0.1)';
                modale.style.opacity = '0';
                modale.classList.add('minimized');
            });
        },
        select(select,appName) {
            if (!select.className.includes('open')) {
                if (manage.modale.isMatch(appName)) {
                    select.classList.add('open');
                }
            }
        },
        isMatch(appName) {
            const elements = document.querySelectorAll('.btn-desktop, .dock__icons');

            for (const element of elements) {
                const dataApp = element.getAttribute('data-app');
                if (dataApp === appName) {
                    return true;
                }
            }
            return false;
        },
        getModale(appName) {
            const modales = document.querySelectorAll('.modal');

            for (const modal of modales) {
                if (modal.getAttribute('data-app') === appName) {
                    return modal;
                }
            }
            return null;
        },
        zIndex(modale) {
            modale.addEventListener("click",() => {
                const modals = document.querySelectorAll(".modal");

                modals.forEach((modal) => {
                    modal.style.zIndex = 2;
                });
                modale.style.zIndex = 3;
            });
        }
    }
}


