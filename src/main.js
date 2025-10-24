import { ComputeEngine } from "https://cdn.jsdelivr.net/npm/@cortex-js/compute-engine@0.30.2/dist/compute-engine.min.esm.js";
import { renderMathInElement } from "https://cdn.jsdelivr.net/npm/mathlive@0.107.1/mathlive.min.mjs";

const ce = new ComputeEngine();

let possibleFunctions = [
  ["Sin", "xvalue"],
  ["Cos", "xvalue"],
  ["Power", "e", "xvalue"],
  ["Multiply", "avalue", ["Power", "xvalue", "bvalue"]],
  ["Sqrt", "xvalue"],
  ["Ln", "xvalue"]
]
function replaceInList(list, target, replacement) {
    return list.map(item => Array.isArray(item) ? replaceInList(item, target, replacement) : (item === target ? replacement : item));
}

function chooseFunction(chainRule) {
  let chosenFunc = possibleFunctions[Math.floor(Math.random()*possibleFunctions.length)]
  if (chainRule == true) {
    chosenFunc = replaceInList(chosenFunc, "xvalue", chooseFunction(false));
  } else {
    chosenFunc = replaceInList(chosenFunc, "xvalue", "x");
  }
  let aval = Math.floor(Math.random()*10)+1;
  while (aval > 10) {
    aval = Math.floor(Math.random()*10)+1;
  };
  let bval = Math.floor(Math.random()*10)+1;
  while (bval > 10) {
    bval = Math.floor(Math.random()*10)+1;
  };
  chosenFunc = replaceInList(chosenFunc, "avalue", aval);
  chosenFunc = replaceInList(chosenFunc, "bvalue", bval);
  return chosenFunc
}
let func = chooseFunction(true)

let question = ce.box(func, {canonical: false});
let answer = ce.box(["D",func,"x"]);
const mf = document.getElementById('editor');
const qs = document.getElementById('question');
const rs = document.getElementById('response');
qs.innerText = "Find the derivative of \\(" + question.toLatex({prettify: true}) + "\\)" 
renderMathInElement("question");
function switchQuestion() {
  func = chooseFunction(true);
  question = ce.box(func, {canonical: false});
  answer = ce.box(["D",func,"x"]);
  qs.innerText = "Find the derivative of \\(" + question.toLatex({prettify: true}) + "\\)" 
  renderMathInElement("question");
}

mf.addEventListener('change', (ev) => {
  let resp = ce.parse(ev.target.value);
  resp.evaluate().print();
  answer.evaluate().print();
  if (resp.evaluate().toString() == answer.evaluate().toString()) {
    rs.innerText = "Correct";
  } else {
    rs.innerText = "Incorrect, answer was \\(" + answer.evaluate().toLatex() + "\\)";
    renderMathInElement("response");
  }
  switchQuestion()
});
