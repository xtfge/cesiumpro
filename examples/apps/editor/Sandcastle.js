const tools = {};

tools.addButton = function (text, callback, parentId = "toolbar") {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = "ele-cls button-cls";
  button.onclick = callback;
  button.textContent = text;
  document.getElementById(parentId).appendChild(button);
  return button;
}
tools.addCheckButton = function (text, callback, parentId = "toolbar") {
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = "ele-cls button-cls";
  checkbox.onclick = function () {
    callback(checkbox.checked)
  };
  checkbox.innerText = text;
  document.getElementById(parentId).appendChild(checkbox);
  return checkbox
}
tools.addLabel = function (text = '', parentId = "toolbar") {
  const label = document.createElement('label');
  label.type = 'label';
  label.className = "label-cls";
  label.innerText = text;
  if (parentId instanceof Element) {
    parentId.appendChild(label)
  } else {
    document.getElementById(parentId).appendChild(label);
  }
  return label
}
tools.addSlider = function (text, value, min, max, step, callback, parentId = "toolbar") {
  tools.addLabel(text, parentId)
  const slider = document.createElement('input');
  slider.type = 'range';
  slider.className = "ele-cls";
  slider.setAttribute('min', min);
  slider.setAttribute('max', max);
  slider.setAttribute('value', value);
  slider.setAttribute('step', step);
  slider.oninput = function () {
    callback && callback(slider.value)
  }
  document.getElementById(parentId).appendChild(slider);

  return slider
}
tools.addCheckbox = function (text, checked, callback, parentId = "toolbar") {
  const labelContainer = document.createElement('div');
  tools.addLabel(text, labelContainer)
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = "ele-cls";
  checkbox.checked = checked;
  checkbox.onclick = function () {
    callback && callback(checkbox.checked)
  }
  labelContainer.appendChild(checkbox)
  document.getElementById(parentId).appendChild(labelContainer);

  return checkbox
}
tools.addBr = function (parentId = "toolbar") {
  const ele = document.createElement('br');
  document.getElementById(parentId).appendChild(ele);
}
tools.addRadio = function (text, selected, name, callback, parentId = "toolbar") {
  const labelContainer = document.createElement('div');
  for (let t of text) {
    const label = tools.addLabel(t, labelContainer)
    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = name
    radio.className = "ele-cls";
    radio.value = t;
    if(t === selected) {
      radio.checked = true;
    }
    label.appendChild(radio)
    labelContainer.appendChild(label);
    radio.onchange = callback
  }

  document.getElementById(parentId).appendChild(labelContainer);
}
tools.randomPoint = function (minx = -180, miny = -90, maxx = 180, maxy = 90, count = 100) {

  const pts = [];
  for (let i = 0; i < count; i++) {
    const randomX = Math.random() * (maxx - minx) + minx;
    const randomY = Math.random() * (maxy - miny) + miny;
    pts.push(Cesium.Cartesian3.fromDegrees(randomX, randomY));
  }
  return pts;
}