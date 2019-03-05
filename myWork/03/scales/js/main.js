var buttonContainerRef = document.querySelector('#buttons');
var reset = () => {
  document.querySelector('#root').innerHTML = '';
}

var buttons = [
  { name: 'scaleLinear', method: () => { reset(); scaleLinear() } },
  { name: 'scaleLog', method: () => { reset(); scaleLog() } },
  { name: 'scaleTime', method: () => { reset(); scaleTime() } },
  { name: 'scaleOrdinal', method: () => { reset(); scaleOrdinal() } },
  { name: 'scaleBands', method: () => { reset(); scaleBands() } },
  { name: 'Reset', method: reset }];

buttons.forEach(button => {
  var element = document.createElement('button');
  element.append(document.createTextNode(button.name));
  element.onclick = button.method;
  buttonContainerRef.append(element);
});
