import { renderMathInElement } from "https://cdn.jsdelivr.net/npm/mathlive@0.107.1/mathlive.min.mjs";


let possibleFunctions = [
  "sin(xvalue)",
  "cos(xvalue)",
  "e^(xvalue)",
  "avalue*(xvalue)^(bvalue)",
  "sqrt(xvalue)",
  "log(xvalue)"
]


let possibleIntFunctions = [
  "sin(xvalue)",
  "cos(xvalue)",
  "e^(xvalue)",
  "avalue*(xvalue)^(bvalue)",
  "sqrt(xvalue)",
  "1/(xvalue)"
]


function chooseFunction(chainRule, funcList) {
  let chosenFunc = funcList[Math.floor(Math.random()*funcList.length)];
  if (chainRule == true) {
    chosenFunc = chosenFunc.replaceAll("xvalue", chooseFunction(false, funcList));
  } else {
    chosenFunc = chosenFunc.replaceAll("xvalue", "x");
  }
  let aval = Math.floor(Math.random()*10)+1;
  while (aval > 10) {
    aval = Math.floor(Math.random()*10)+1;
  };
  let bval = Math.floor(Math.random()*10)+1;
  while (bval > 10) {
    bval = Math.floor(Math.random()*10)+1;
  };
  chosenFunc = chosenFunc.replaceAll("avalue", aval);
  chosenFunc = chosenFunc.replaceAll("bvalue", bval);
  return chosenFunc
}


const mf = document.getElementById('editor');
const qs = document.getElementById('question');
const rs = document.getElementById('response');

let func = null;
let answer = null;

nerdamer.setFunction('ln', ['x'], 'log(x)');

function generateDerivative () {
  func = chooseFunction(true, possibleFunctions)
  answer = nerdamer('diff('+func+')');
  qs.innerText = "Find the derivative of \\(" + nerdamer.convertToLaTeX(func).toString() + "\\)" 
  renderMathInElement("question");
}

function generateIntegral () {
  func = chooseFunction(false, possibleIntFunctions)
  answer = nerdamer('integrate('+func+', x)');
  qs.innerText = "Find the integral of \\(" + nerdamer.convertToLaTeX(func).toString() + "\\)";
  renderMathInElement("question");
}

function switchQuestion() {
  let type = document.querySelector('input[name="question_type"]:checked').value;
  if (type == "derivative") {
    generateDerivative()
  }
  else if (type == "integral") {
    generateIntegral()
  }
}

mf.addEventListener('change', (ev) => {
  let resp = nerdamer(ev.target.getValue("ascii-math"));
  if (resp.eq(answer.toString())) {
    rs.innerText = "Correct";
  } else {
    rs.innerText = "Incorrect, answer was \\(" + nerdamer.convertToLaTeX(answer.toString()).toString() + "\\)";
    renderMathInElement("response");
  }
  switchQuestion()
});

switchQuestion()
