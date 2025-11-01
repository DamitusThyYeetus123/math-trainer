import { renderMathInElement } from "https://cdn.jsdelivr.net/npm/mathlive@0.107.1/mathlive.min.mjs";

// Element Constants
const mf = document.getElementById('editor');
const qs = document.getElementById('question');
const rs = document.getElementById('response');
const opts = document.getElementById('options');
const funcs = document.getElementById('functions');

// Options Object

let options = {
  question_type: document.querySelector('input[name="question_type"]:checked').value,
  chain_rule: document.querySelector('input[name="chain_rule"]').checked,
  functions: [],
  product_rule: document.querySelector('input[name="product_rule"]').checked
};

// Lists of implemented functions
let possibleFunctions = [
  "sin(xvalue)",
  "cos(xvalue)",
  "e^(xvalue)",
  "avalue*(xvalue)^(bvalue)",
  "sqrt(xvalue)",
  "log(xvalue)"
];

let possibleIntFunctions = [
  "sin(xvalue)",
  "cos(xvalue)",
  "e^(xvalue)",
  "avalue*(xvalue)^(bvalue)",
  "sqrt(xvalue)",
  "1/(xvalue)"
];

// Helper Variables
let func = null;
let answer = null;

// Ln for log alias
nerdamer.setFunction('ln', ['x'], 'log(x)');

// Helper Functions
function chooseFunction(chainRule, funcList, productRule) {
  let chosenFunc = funcList[Math.floor(Math.random()*funcList.length)];
  if (productRule == true) {
    console.log(funcList);   
    let productFuncList = funcList.filter(item => item !== chosenFunc);
    if (chosenFunc == "sin(xvalue)" || chosenFunc == "cos(xvalue)") {
      productFuncList = productFuncList.filter(item => !["1/(xvalue)", "avalue*(xvalue)^(bvalue)", "sqrt(xvalue)"].includes(item));
    }
    if (chosenFunc == "log(xvalue)" || chosenFunc == "e^(xvalue)") {
      productFuncList = productFuncList.filter(item => !["e^(xvalue)", "log(xvalue)"].includes(item));
    }
    if (chosenFunc == "e^(xvalue)") {
      productFuncList = productFuncList.filter(item => !["avalue*(xvalue)^(bvalue)", "sqrt(xvalue)", "1/(xvalue)"].includes(item))
    }
    if (chosenFunc == "1/(xvalue)") {
      productFuncList = productFuncList.filter(item => !["sin(xvalue)", "cos(xvalue)", "e^(xvalue)"].includes(item));
    }
    if (chosenFunc == "avalue*(xvalue)^(bvalue)") {
      productFuncList = productFuncList.filter(item => !["sin(xvalue)", "cos(xvalue)", "e^(xvalue)"].includes(item));
    }
    if (chosenFunc == "sqrt(xvalue)") {
      productFuncList = productFuncList.filter(item => !["sin(xvalue)", "cos(xvalue)", "e^(xvalue)"].includes(item));
    }
    console.log(productFuncList);
    chosenFunc = chosenFunc + "*" + chooseFunction(false, productFuncList, false)
  }
  if (chainRule == true) {
    let chainFuncList = funcList.filter(item => item !== chosenFunc);
    if (chosenFunc == "log(xvalue)" || "e^(xvalue)") {
      chainFuncList = chainFuncList.filter(item => item !== "e^(xvalue)" && item !== "log(xvalue)");
    }
    chosenFunc = chosenFunc.replaceAll("xvalue", chooseFunction(false, chainFuncList, false));
  } else {
    chosenFunc = chosenFunc.replaceAll("xvalue", "x");
  }


  console.log(chosenFunc);
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

function generateDerivative () {
  func = chooseFunction(options.chain_rule, options.functions, options.product_rule)
  answer = nerdamer('diff('+func+')');
  qs.innerText = "Find the derivative of \\(" + nerdamer.convertToLaTeX(func).toString() + "\\)" 
  renderMathInElement("question");
}

function generateIntegral () {
  func = chooseFunction(options.chain_rule, options.functions, options.product_rule)
  answer = nerdamer('integrate('+func+', x)');
  qs.innerText = "Find the integral of \\(" + nerdamer.convertToLaTeX(func).toString() + "\\)";
  renderMathInElement("question");
}

function switchQuestion() {
  if (options.question_type == "derivative") {
    generateDerivative()
  }
  else if (options.question_type == "integral") {
    generateIntegral()
  }
}

function setFunctions() {
  funcs.replaceChildren();
  for (const element of (options.question_type == "derivative" ? possibleFunctions : possibleIntFunctions)) {
    let box = document.createElement("input");
    box.type = "checkbox";
    box.name = element.replaceAll("value", "");
    box.classList.add("functionbox");
    box.id = element;
    box.checked = true;
    let label = document.createElement("label");
    label.htmlFor = box.id;
    label.appendChild(document.createTextNode(element.replaceAll("value","")));

    funcs.appendChild(box);
    funcs.appendChild(label);
    funcs.appendChild(document.createElement("br"));
  }
  getSelectedFunctions()
}

function getSelectedFunctions() {
  options.functions = [];
  for (const child of funcs.querySelectorAll(".functionbox")) {
    if (child.checked) {
      options.functions.push(child.id);
    }
  }
}

// Event Listeners
opts.addEventListener('click', function(event) {
  if (event.target && event.target.matches("input[name='question_type']:checked")) {
    options.question_type = event.target.value;
    if (event.target.value == "derivative") {
      opts.querySelector("input[name='chain_rule']").disabled = false;
    } else {
      opts.querySelector("input[name='chain_rule']").disabled = true;
      opts.querySelector("input[name='chain_rule']").checked = false;
      options.chain_rule = false;
    }
    setFunctions();
  }
  if (event.target && event.target.matches("input[name='chain_rule']")) {
    options.chain_rule = event.target.checked;
  }
  if (event.target && event.target.matches("input[name='product_rule']")) {
    options.product_rule = event.target.checked;
  }
  if (event.target && event.target.matches(".functionbox")) {
    getSelectedFunctions();
  }
  console.log(options);
  switchQuestion();
})

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

// Initialisation
setFunctions();
opts.querySelector("input[name='chain_rule']").disabled = !(options.question_type == "derivative");
opts.querySelector("input[name='chain_rule']").checked = (options.question_type == "derivative" && options.chain_rule == true);
switchQuestion();
