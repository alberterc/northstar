export function upperCaseFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getContextMenuPos(cursor, menuEl) {
  // get cursor position
  let x = cursor.pageX;
  let y = cursor.pageY;

  // get menu and viewport size
  const menuWidth = menuEl.offsetWidth;
  const menuHeight = menuEl.offsetHeight;
  const winWidth = window.innerWidth;
  const winHeight = window.innerHeight;

  // if menu overflow right edge
  if (x + menuWidth > winWidth) {
    x = x - menuWidth;
    if (x < 0) x = 0;
  }

  // if menu overflow bottom edge
  if (y + menuHeight > winHeight) {
    y = y - menuHeight;
    if (y < 0) y = 0;
  }

  return [x, y];
}

export function clearElementDataset(el) {
  for (const key in el.dataset) {
    delete el.dataset[key];
  }
}

export function formatDateTime(dateTimeStr) {
  // replace " " into "T"
  const isoStr = dateTimeStr.replace(" ", "T");
  const date = new Date(isoStr);

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}
