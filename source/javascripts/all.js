//= require prettify

var code = document.getElementsByTagName('pre');
for (var i = 0; i < code.length; i++) {
  if (code[i].parentNode.className.indexOf('line-data') === -1) {
    code[i].className = 'prettyprint';
  }
}
prettyPrint();
