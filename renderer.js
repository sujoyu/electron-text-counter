// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const fs = require('fs');
const remote = require('electron').remote;
const args = remote.getGlobal('processArgv');
const dialog = remote.dialog;
const clipboard = remote.clipboard;

let field = document.getElementById("text-field");
let counter = document.getElementById("counter");

console.log(args);

let text;
const path = args[2];
if (path) {
  text = readFile(path);
}

field.addEventListener("change", onFieldChange, false);
field.addEventListener("keyup", onFieldChange, false);
field.addEventListener("click", onFieldChange, false);

field.addEventListener("dragenter", function(e) {
	//e.preventDefault();
	onFieldChange();
}, false);
// field.addEventListener("dragover", function(e) {
// 	e.preventDefault();
// }, false);
//field.addEventListener("drop", onFieldChange, false);

field.value = text ? text : "";
onFieldChange();

document.getElementById("paste").addEventListener("click", function(e) {
  e.preventDefault();
  field.value = clipboard.readText();
  onFieldChange();
});

document.getElementById("clear").addEventListener("click", function(e) {
  e.preventDefault();
  field.value = "";
  onFieldChange();
});

function readFile(path) {
	let data;
	try {
	  //test to see if settings exist
	  fs.openSync(path, 'r+'); //throws error if file doesn't exist
	  data = fs.readFileSync(path, "utf8"); //file exists, get the contents
	} catch (err) {
	  //if error, then there was no settings file (first run).
	  dialog.showMessageBox({
	  	type: "warning",
	  	message: "ファイルを読めませんでした。",
	  	buttons: ["OK"]
	  });
	}

	return data;
}

function onFieldChange() {
	counter.innerText = (field.value ? field.value.length : 0) + " 文字";
}