function executeCommand(fullCmd) {
    const commandArgs = fullCmd.split(' ');
    const commandName = commandArgs[0];
    const commandFct = manage.terminal.commands[commandName];

    if (typeof commandFct === 'function') {
        commandFct(...commandArgs.slice(1));
    } else {
        manage.terminal.run.print("",`Commande inconnue : ${commandName}`,config.output);
    }
}

function isFileInPwd(file) {
    const directory = manage.terminal.run.pwd[1].split("/").pop();
    const list = directory == 'pauline' ? computer : computer.elements.find(element => element.name === directory);
    if (list) {
        for (const element of list.elements) {
            if (element.name == file)
                return 1;
        }
    }
    return 0;
}