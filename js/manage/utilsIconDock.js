const dock_appli = document.querySelector('.appli');

function getIcon(appName,id, system = null) {
    const iconsList = document.querySelectorAll('.btn-desktop');
    var icon;
    for (icon of iconsList) {
        if (icon.getAttribute('data-app') == appName) {
            return icon;
        }
    }
    icon = new IconDock(appName,id, system);
    dock_appli.appendChild(icon.instance);
    icon.instance.classList.add("bounce")
    docker.updateIcons();
    return icon.instance;
}
