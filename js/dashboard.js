document.addEventListener("DOMContentLoaded", () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (!isLoggedIn) {
        // redirect back to login page
        window.location.href = "../pages/index.html"; // login page path
    }
});

function logout() {
    localStorage.removeItem("isLoggedIn");
    window.location.href = "../html/index.html";
}
    // ═══════════════ UNIT DEFINITIONS ═══════════════
    // factor = multiplier to convert TO base unit
    const UNITS = {
    Length: {
    Feet:        { factor: 12.0 },
    Inches:      { factor: 1.0 },           // base = inches
    Yards:       { factor: 36.0 },
    Centimeters: { factor: 0.393701 },
    Meters:      { factor: 39.3701 },
    Kilometers:  { factor: 39370.1 },
},
    Weight: {
    Milligram: { factor: 0.001 },
    Gram:      { factor: 1.0 },             // base = grams
    Kilogram:  { factor: 1000.0 },
    Pound:     { factor: 453.592 },
    Tonne:     { factor: 1_000_000.0 },
},
    Temperature: {
    Celsius:    {},
    Fahrenheit: {},
    Kelvin:     {},
},
    Volume: {
    Litre:      { factor: 1.0 },            // base = litres
    Millilitre: { factor: 0.001 },
    Gallon:     { factor: 3.78541 },
},
};

    // ═══════════════ STATE ═══════════════
    let currentType   = "Length";
    let currentAction = "Arithmetic";
    let currentOp     = "add"; // add | subtract | divide

    // ═══════════════ CONVERSION HELPERS ═══════════════
    function toBase(value, unit) {
    if (currentType === "Temperature") {
    if (unit === "Celsius")    return value;
    if (unit === "Fahrenheit") return (value - 32) * 5 / 9;
    if (unit === "Kelvin")     return value - 273.15;
}
    return value * UNITS[currentType][unit].factor;
}

    function fromBase(baseValue, unit) {
    if (currentType === "Temperature") {
    if (unit === "Celsius")    return baseValue;
    if (unit === "Fahrenheit") return (baseValue * 9 / 5) + 32;
    if (unit === "Kelvin")     return baseValue + 273.15;
}
    return baseValue / UNITS[currentType][unit].factor;
}

    function fmt(n) {
    // up to 6 significant digits, no trailing zeros
    if (!isFinite(n)) return "∞";
    const abs = Math.abs(n);
    if (abs === 0) return "0";
    if (abs >= 0.001 && abs < 1e7) return parseFloat(n.toPrecision(6)).toString();
    return n.toExponential(4);
}

    // ═══════════════ POPULATE SELECTS ═══════════════
    function loadUnits() {
    const keys = Object.keys(UNITS[currentType]);
    ["unit1","unit2","resultUnit"].forEach(id => {
    const sel = document.getElementById(id);
    const prev = sel.value;
    sel.innerHTML = "";
    keys.forEach(k => {
    const o = document.createElement("option");
    o.value = k; o.textContent = k;
    sel.appendChild(o);
});
    if (keys.includes(prev)) sel.value = prev;
});
    // default unit2 to second option
    const u2 = document.getElementById("unit2");
    if (u2.options.length > 1 && u2.selectedIndex === 0) u2.selectedIndex = 1;
}

    // ═══════════════ MODE RENDERING ═══════════════
    function applyMode() {
    const row       = document.getElementById("inputsRow");
    const val2Wrap  = document.getElementById("val2Wrap");
    const opBadge   = document.getElementById("opBadge");
    const label1    = document.getElementById("label1");
    const label2    = document.getElementById("label2");
    const resultBox = document.getElementById("resultBox");
    const resUnit   = document.getElementById("resultUnit");

    row.className = "inputs-row";

    if (currentAction === "Arithmetic") {
    row.classList.add("mode-arithmetic");
    val2Wrap.classList.remove("d-none");
    opBadge.classList.remove("d-none");
    label1.textContent = "Value 1";
    label2.textContent = "Value 2";
    resUnit.classList.remove("d-none");
    opBadge.textContent = "";  // clear first
    const sym = document.createElement("span");
    sym.id = "opSymbol";
    sym.textContent = opSymbols[currentOp];
    const hint = document.createElement("span");
    hint.className = "op-hint";
    hint.textContent = "tap";
    opBadge.appendChild(sym);
    opBadge.appendChild(hint);

} else if (currentAction === "Comparison") {
    row.classList.add("mode-comparison");
    val2Wrap.classList.remove("d-none");
    opBadge.classList.add("d-none");
    label1.textContent = "From";
    label2.textContent = "To";
    resUnit.classList.add("d-none");

} else { // Conversion
    row.classList.add("mode-conversion");
    val2Wrap.classList.add("d-none");
    opBadge.classList.add("d-none");
    label1.textContent = "Value";
    resUnit.classList.remove("d-none");
}

    resultBox.classList.add("d-none"); // hide until user triggers calc
}

    // ═══════════════ CALCULATE ═══════════════
    function calculate() {
    const v1str = document.getElementById("val1").value;
    const v2str = document.getElementById("val2").value;
    const v1 = parseFloat(v1str);
    const v2 = parseFloat(v2str);
    const u1 = document.getElementById("unit1").value;
    const u2 = document.getElementById("unit2").value;
    const ur = document.getElementById("resultUnit").value;

    const resultBox = document.getElementById("resultBox");
    const resultEl  = document.getElementById("result");
    const resUnit   = document.getElementById("resultUnit");

    if (v1str === "" || isNaN(v1)) return;
    if (currentAction !== "Conversion" && (v2str === "" || isNaN(v2))) return;

    let display, isText = false, isWarn = false;

    // ── Arithmetic ──
    if (currentAction === "Arithmetic") {
    if (currentType === "Temperature") {
    display = "⚠ Temperature doesn't support arithmetic";
    isWarn = true;
} else {
    const b1 = toBase(v1, u1);
    const b2 = toBase(v2, u2);
    if (currentOp === "divide") {
    if (b2 === 0) { display = "⚠ Cannot divide by zero"; isWarn = true; }
    else {
    display = fmt(b1 / b2);
    resUnit.classList.add("d-none");
    resultEl.className = "";
    resultEl.textContent = display;
    resultBox.classList.remove("d-none");
    return;
}
} else {
    const baseResult = currentOp === "add" ? b1 + b2 : b1 - b2;
    display = fmt(fromBase(baseResult, ur));
    resUnit.classList.remove("d-none");
}
}

    // ── Comparison ──
} else if (currentAction === "Comparison") {
    const b1 = toBase(v1, u1);
    const b2 = toBase(v2, u2);
    const diff = Math.abs(b1 - b2);
    if (diff < 1e-9)       display = "Value 1  =  Value 2";
    else if (b1 > b2)      display = "Value 1  >  Value 2";
    else                   display = "Value 1  <  Value 2";
    isText = true;
    resUnit.classList.add("d-none");

    // ── Conversion ──
} else {
    display = fmt(fromBase(toBase(v1, u1), ur));
    resUnit.classList.remove("d-none");
}

    resultEl.className = isWarn ? "warn" : isText ? "text-result" : "";
    resultEl.textContent = display;
    resultBox.classList.remove("d-none");
}

    const opSymbols = { add: "+", subtract: "−", divide: "÷" };
    const opCycle   = ["add", "subtract", "divide"];

    function updateOpBadge() {
    const sym = document.getElementById("opSymbol");
    if (sym) sym.textContent = opSymbols[currentOp];
}

    // ═══════════════ EVENT WIRING ═══════════════
    document.querySelectorAll(".type-card").forEach(card => {
    card.addEventListener("click", () => {
        document.querySelectorAll(".type-card").forEach(c => c.classList.remove("active"));
        card.classList.add("active");
        currentType = card.dataset.type;
        loadUnits();
        applyMode();
    });
});

    document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentAction = btn.dataset.action;
        applyMode();
    });
});

    document.getElementById("opBadge").addEventListener("click", () => {
    if (currentAction !== "Arithmetic") return;
    const idx = opCycle.indexOf(currentOp);
    currentOp = opCycle[(idx + 1) % opCycle.length];
    updateOpBadge();
    calculate();
});

    document.querySelectorAll("input, select").forEach(el => {
    el.addEventListener("input", calculate);
});

    // ═══════════════ INIT ═══════════════
    loadUnits();
    applyMode();