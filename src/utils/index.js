export function getRatio() {
  var ratio = 0;
  var screen = window.screen;
  var ua = navigator.userAgent.toLowerCase();

  if (window.devicePixelRatio !== undefined) {
    ratio = window.devicePixelRatio;
  } else if (~ua.indexOf("msie")) {
    if (screen.deviceXDPI && screen.logicalXDPI) {
      ratio = screen.deviceXDPI / screen.logicalXDPI;
    }
  } else if (
    window.outerWidth !== undefined &&
    window.innerWidth !== undefined
  ) {
    ratio = window.outerWidth / window.innerWidth;
  }

  return ratio;
}
