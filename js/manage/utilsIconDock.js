const dock_appli = document.querySelector('.appli');

function getIcon(appName,id) {
    const iconsList = document.querySelectorAll('.btn-desktop');
    var icon;
    for (icon of iconsList) {
        if (icon.getAttribute('data-app') == appName) {
            return icon;
        }
    }
    icon = new IconDock(appName,id);
    dock_appli.appendChild(icon.instance);
    return icon.instance;
}