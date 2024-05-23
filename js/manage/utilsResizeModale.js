// Minimum resizable area
const minWidth = 420;
const minHeight = 210;

// valeur de la marge autour des bords de la modale qui va declancher le resize
const MARGINS = 4;

// End of what's configurable.
var clicked = null;
var onRightEdge, onBottomEdge, onLeftEdge, onTopEdge;
var rightScreenEdge, bottomScreenEdge;
var b, x, y, evt;
var redraw = false;
var modale;

//utils
function runListener(modale) {
  modale.addEventListener("mousedown", onMouseDown);
  document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
}

function canMove() {
  return x > 0 && x < b.width && y > 0 && y < b.height && y < 30;
  //30 c'est la height du titre
}

function calc(event) {
  b = modale.getBoundingClientRect();
  x = event.clientX - b.left;
  y = event.clientY - b.top;

  onTopEdge = y < MARGINS;
  onLeftEdge = x < MARGINS;
  onRightEdge = x >= b.width - MARGINS;
  onBottomEdge = y >= b.height - MARGINS;

  rightScreenEdge = window.innerWidth - MARGINS;
  bottomScreenEdge = window.innerHeight - MARGINS;
}

//Listener function
function onMove(e) {
  calc(e);

  evt = e;

  redraw = true;
}

function onMouseDown(e) {
  calc(e);
  var isResizing = onRightEdge || onBottomEdge || onTopEdge || onLeftEdge;

  clicked = {
    x: x,
    y: y,
    cx: e.clientX,
    cy: e.clientY,
    w: b.width,
    h: b.height,
    isResizing: isResizing,
    isMoving: !isResizing && canMove(),
    onTopEdge: onTopEdge,
    onLeftEdge: onLeftEdge,
    onRightEdge: onRightEdge,
    onBottomEdge: onBottomEdge,
  };
  e.preventDefault();
}

function onUp(e) {
  calc(e);


    if (b.y > window.innerHeight - 30){
        modale.style.top =  window.innerHeight - 30 + 'px';
    }


  clicked = null;
}

function resize(){
    requestAnimationFrame(resize);

    if (!redraw) return;

  redraw = false;

  if (clicked && clicked.isResizing) {

    if (clicked.onRightEdge) modale.style.width = Math.max(x, minWidth) + 'px';
    if (clicked.onBottomEdge) modale.style.height = Math.max(y, minHeight) + 'px';

    if (clicked.onLeftEdge) {
      var currentWidth = Math.max(clicked.cx - evt.clientX  + clicked.w, minWidth);
      if (currentWidth > minWidth) {
        modale.style.width = currentWidth + 'px';
        modale.style.left = evt.clientX + 'px';	
      }
    }

    if (clicked.onTopEdge) {
      var currentHeight = Math.max(clicked.cy - evt.clientY  + clicked.h, minHeight);
      if (currentHeight > minHeight) {
        modale.style.height = currentHeight + 'px';
        modale.style.top = evt.clientY + 'px';	
      }
    }
    return;
  }





  if (clicked && clicked.isMoving) {
    if (evt.clientY - clicked.y >= 35)
        modale.style.top = (evt.clientY - clicked.y) + 'px';
    else
        modale.style.top = "35px";

    modale.style.left = (evt.clientX - clicked.x) + 'px';
    return;
  }

  // style cursor
  if (onRightEdge && onBottomEdge || onLeftEdge && onTopEdge) {
    modale.style.cursor = 'nwse-resize';
  } else if (onRightEdge && onTopEdge || onBottomEdge && onLeftEdge) {
    modale.style.cursor = 'nesw-resize';
  } else if (onRightEdge || onLeftEdge) {
    modale.style.cursor = 'ew-resize';
  } else if (onBottomEdge || onTopEdge) {
    modale.style.cursor = 'ns-resize';
  } else {
    modale.style.cursor = 'default';
  }
}


function manageResizeManual(modaleElement) {
  modale = modaleElement;
  runListener(modale);
  resize();
}
