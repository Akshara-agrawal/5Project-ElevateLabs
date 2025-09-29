(function () {
  const sub = document.getElementById("sub");
  const main = document.getElementById("main");
  const keys = document.querySelectorAll(".key");

  let current = "0";
  let formula = "";
  let lastKey = "";

  function updateDisplay() {
    main.textContent = current;
    sub.textContent = formula || "0";
  }

  function inputNumber(n) {
    if (lastKey === "=") {
      formula = "";
      current = "0";
    }
    if (n === "." && current.includes(".")) return;
    if (current === "0" && n !== ".") current = n;
    else current = current + n;
    lastKey = "num";
    updateDisplay();
  }

  function inputOperator(op) {
    if (lastKey === "op") {
      formula = formula.slice(0, -1) + op;
    } else {
      formula += (formula === "" ? current : current) + op;
      current = "0";
    }
    lastKey = "op";
    updateDisplay();
  }

  function clearAll() {
    current = "0";
    formula = "";
    lastKey = "";
    updateDisplay();
  }

  function backspace() {
    if (lastKey === "=") {
      clearAll();
      return;
    }
    if (current.length <= 1) current = "0";
    else current = current.slice(0, -1);
    updateDisplay();
  }

  function percent() {
    let num = parseFloat(current);
    if (isNaN(num)) return;
    num = num / 100;
    current = String(Number(num.toPrecision(12)).toString());
    updateDisplay();
  }

  function evaluateFormula() {
    if (lastKey === "op") return;
    let expr = formula + current;
    if (!expr) return;
    expr = expr.replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-");
    try {
      if (!/^[0-9+\-*/.()%\s]+$/.test(expr))
        throw new Error("Invalid characters");
      let result = Function("return " + expr)();
      if (!isFinite(result)) throw new Error("Math error");
      result = Number(result.toPrecision(12));
      current = String(result);
      formula = "";
      lastKey = "=";
      updateDisplay();
    } catch (e) {
      current = "Error";
      formula = "";
      lastKey = "";
      updateDisplay();
    }
  }

  keys.forEach((k) => {
    k.addEventListener("click", () => {
      const num = k.dataset.num;
      const action = k.dataset.action;
      if (num !== undefined) inputNumber(num);
      else if (action !== undefined) {
        if (action === "clear") clearAll();
        else if (action === "back") backspace();
        else if (action === "percent") percent();
        else if (action === "=") evaluateFormula();
        else inputOperator(action);
      }
    });
  });

  window.addEventListener("keydown", (e) => {
    const key = e.key;
    if (/^[0-9]$/.test(key) || key === ".") {
      inputNumber(key);
      e.preventDefault();
    } else if (key === "Enter" || key === "=") {
      evaluateFormula();
      e.preventDefault();
    } else if (key === "Backspace") {
      backspace();
      e.preventDefault();
    } else if (key === "Escape") {
      clearAll();
      e.preventDefault();
    } else if (key === "%") {
      percent();
      e.preventDefault();
    } else if (["+", "-", "*", "/"].includes(key)) {
      inputOperator(key);
      e.preventDefault();
    }
  });

  updateDisplay();
})();
