import { v4 as uuidv4 } from "uuid";

/*=============================================
=            1. SELETORES DO DOM              =
=============================================*/
const main = document.querySelector("app-layout__main-content");
const form = document.getElementById("form");
const expenseNameInput = document.getElementById("expense-name");
const expenseAmountInput = document.getElementById("amount");
const categorySelect = document.getElementById("expense-category");
const expenseListUl = document.getElementById("expense-list");
const dateInput = document.getElementById("expense-date");
const paymentMethodInput = document.getElementById("payment-method");
const supplierInput = document.getElementById("supplier");
const paragraph = document.createElement("p");

/*=============================================
=     2. ESTADO E CONFIGURAÇÕES GLOBAIS       =
=============================================*/
let expenses = [];
let editingExpenseId = null;
let myPieChart = null;
let barChart = null;
let supplierBarChart = null;
let paymentMethodChart = null;
let dateLineChart = null;
const selectOptions = [
  "Food",
  "Energy",
  "Cleaning",
  "Water",
  "Maintenance",
  "Rent",
];

const paymentMethods = ["Pix", "Debit Card", "Credit Card", "Cash"];

const validationRules = {
  expenseName: {
    element: expenseNameInput,
    rule: () => expenseNameInput.value.length >= 3,
    error: "Your expense must be more than 3 characters...",
  },
  expenseAmount: {
    element: expenseAmountInput,
    rule: () =>
      expenseAmountInput.value > 0 && !expenseAmountInput.value.startsWith("0"),
    error: "The value must be greater than 0...",
  },
  category: {
    element: categorySelect,
    rule: () => categorySelect.value !== "",
    error: "Select category...",
  },
  date: {
    element: dateInput,
    rule: () => dateInput.value !== "",
    error: "Select date...",
  },
  paymentMethod: {
    element: paymentMethodInput,
    rule: () => paymentMethodInput.value !== "",
    error: "Select payment method...",
  },
  supplier: {
    element: supplierInput,
    rule: () => supplierInput.value.length >= 3,
    error: "Your supplier must be more than 3 characters...",
  },
};
const FMD_COLOR_PALETTE = [
  "#7F0000", // vermelho sangue escuro
  "#B22222", // vermelho fogo
  "#E25822", // laranja queimado
  "#FF7F50", // coral forte
  "#8B4513", // marrom escuro
  "#A0522D", // marrom médio
  "#6A0DAD", // roxo púrpura profundo
  "#4B0082", // índigo escuro
];
const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});
/*=============================================
=      3. FUNÇÕES (A CAIXA DE FERRAMENTAS)    =
=============================================*/

// --- Funções de Renderização (UI) ---

function renderExpenses(expensesArray) {
  expenseListUl.innerHTML = "";
  expensesArray.forEach(
    ({ name, amount, category, id, date, paymentMethod, supplier }) => {
      const li = document.createElement("li");

      if (editingExpenseId === id) {
        li.classList.add("editing");

        const inputName = document.createElement("input");
        const inputAmount = document.createElement("input");
        const inputCategory = document.createElement("select");
        const editPaymentMethodSelect = document.createElement("select");
        const editDateInput = document.createElement("input");
        const editSupplierInput = document.createElement("input");
        const saveBtn = document.createElement("button");
        const cancelBtn = document.createElement("button");

        selectOptions.forEach((option) => {
          const optionElement = document.createElement("option");
          optionElement.value = option;
          optionElement.textContent = option;
          inputCategory.appendChild(optionElement);
        });

        paymentMethods.forEach((method) => {
          const optionElement = document.createElement("option");
          optionElement.value = method;
          optionElement.textContent = method;
          editPaymentMethodSelect.appendChild(optionElement);
        });

        inputName.value = name;
        inputAmount.value = amount;
        inputCategory.value = category;
        editDateInput.value = date;
        editPaymentMethodSelect.value = paymentMethod;
        editSupplierInput.value = supplier;

        editDateInput.type = "date";
        editSupplierInput.type = "text";
        inputAmount.type = "number";

        inputName.setAttribute("name", "edit-name");
        inputAmount.setAttribute("name", "edit-amount");
        inputCategory.setAttribute("name", "edit-category");
        editDateInput.setAttribute("name", "edit-date");
        editPaymentMethodSelect.setAttribute("name", "edit-payment-method");
        editSupplierInput.setAttribute("name", "edit-supplier");

        saveBtn.setAttribute("data-id", id);
        cancelBtn.setAttribute("data-id", id);
        saveBtn.classList.add("btn-save");
        cancelBtn.classList.add("btn-cancel");
        saveBtn.textContent = "Save";
        cancelBtn.textContent = "Cancel";

        li.appendChild(inputName);
        li.appendChild(inputAmount);
        li.appendChild(inputCategory);
        li.appendChild(editDateInput);
        li.appendChild(editPaymentMethodSelect);
        li.appendChild(editSupplierInput);
        li.appendChild(saveBtn);
        li.appendChild(cancelBtn);
      } else {
        const textSpan = document.createElement("span");
        textSpan.textContent = `${name} - ${formatCurrency(
          amount
        )} - ${category} - ${date} - ${paymentMethod} - ${supplier}`;

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.setAttribute("data-id", id);
        deleteBtn.classList.add("btn-delete");

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.setAttribute("data-id", id);
        editBtn.classList.add("btn-edit");

        li.appendChild(textSpan);
        li.appendChild(deleteBtn);
        li.appendChild(editBtn);
      }
      expenseListUl.appendChild(li);
    }
  );
}
function renderPizzaDashboard() {
  const totals = calculateTotalPerCategory(expenses);
  const labels = Object.keys(totals);
  const data = Object.values(totals);

  const canvas = document.getElementById("category-pie-chart");
  if (!canvas) return;
  if (myPieChart) {
    myPieChart.destroy();
  }
  myPieChart = new Chart(canvas, {
    type: "pie",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Expenses by Category",
          data: data,
          backgroundColor: FMD_COLOR_PALETTE, // PREENCHER COM A PALETA DE CORES
          borderColor: "#1e1e1e",
          hoverOffset: 10,
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          labels: {
            color: "white",
          },
        },
      },
    },
  });
}
function renderBarChart() {
  const descToAsceArray = calcDescendingAmount(expenses);
  const labels = descToAsceArray.map((expense) => expense.name);
  const data = descToAsceArray.map((expense) => expense.amount);
  const canvas = document.getElementById("expense-bar-chart");
  if (!canvas) return;
  if (barChart) {
    barChart.destroy();
  }
  barChart = new Chart(canvas, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Descending Expenses",
          data: data,
          backgroundColor: FMD_COLOR_PALETTE, // PREENCHER COM A PALETA DE CORES
          borderColor: "#1e1e1e",
          hoverOffset: 10,
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          labels: {
            color: "white",
          },
        },
      },
    },
  });
}

function renderSupplierBarChart() {
  const totalSupplier = calcDescendingSupplier(expenses);
  const labels = totalSupplier.map((supplierAmount) => supplierAmount[0]);
  const data = totalSupplier.map((supplierData) => supplierData[1]);
  const canvas = document.getElementById("supplier-bar-chart");
  if (!canvas) return;
  if (supplierBarChart) {
    supplierBarChart.destroy();
  }
  supplierBarChart = new Chart(canvas, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Descending Suppliers",
          data: data,
          backgroundColor: FMD_COLOR_PALETTE, // PREENCHER COM A PALETA DE CORES
          borderColor: "#1e1e1e",
          hoverOffset: 10,
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          labels: {
            color: "white",
          },
        },
      },
    },
  });
}

function renderPaymentMethodDoughnutChart() {
  const totalPaymentMethod = calculateTotalPerPaymentMethod(expenses);
  const labels = Object.keys(totalPaymentMethod);
  const data = Object.values(totalPaymentMethod);
  const canvas = document.getElementById("payment-method-doughnut-chart");
  if (!canvas) return;
  if (paymentMethodChart) {
    paymentMethodChart.destroy();
  }
  paymentMethodChart = new Chart(canvas, {
    type: "doughnut",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Formas de pagamentos mais utilizadas",
          data: data,
          backgroundColor: FMD_COLOR_PALETTE, // PREENCHER COM A PALETA DE CORES
          borderColor: "#1e1e1e",
          hoverOffset: 10,
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          labels: {
            color: "white",
          },
        },
      },
    },
  });
}

function renderDateLineChart() {
  const totals = calculateTotalByDate(expenses);
  const dates = generateDateRange(2025, 10);
  const labels = dates.map((date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    return `${day}/${month}`;
  });

  const data = dates.map((dateString) => {
    const key = dateString.toISOString().slice(0, 10);

    const value = totals[key] || 0;
    return value;
  });
  const canvas = document.getElementById("date-line-chart");
  if (!canvas) return;
  if (dateLineChart) {
    dateLineChart.destroy();
  }
  dateLineChart = new Chart(canvas, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Gastos ao longo do tempo",
          data: data,
          backgroundColor: FMD_COLOR_PALETTE, // PREENCHER COM A PALETA DE CORES
          borderColor: "#1e1e1e",
          hoverOffset: 10,
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          labels: {
            color: "white",
          },
        },
      },
    },
  });
}

function renderInsightCards() {
  const topExpense = getTopExpense(expenses);
  const expenseCount = getTotalExpensesCount(expenses);
  const topCategory = getTopCategory(calculateTotalPerCategory(expenses));
  const expenseCountElement = document.getElementById("total-expense-count");
  const topExpenseElement = document.getElementById("top-expense-name");
  const topCategoryElement = document.getElementById("top-category-name");
  expenseCountElement.textContent = expenseCount;
  topExpenseElement.textContent = `${topExpense.name} - ${formatCurrency(
    topExpense.amount
  )}`;
  topCategoryElement.textContent = topCategory;
}
// --- Funções de Cálculo (Motores) ---

function calcDescendingAmount(originArray) {
  const originArrayCopy = [...originArray];
  const descToAsce = originArrayCopy.sort((a, b) => b.amount - a.amount);
  return descToAsce;
}

function calculateTotalPerCategory(originArray) {
  const totals = originArray.reduce((acc, currentExpense) => {
    acc[currentExpense.category] =
      (acc[currentExpense.category] || 0) + currentExpense.amount;
    return acc;
  }, {});
  return totals;
}

function calculateTotalPerSupplier(originArray) {
  const totals = originArray.reduce((acc, currentExpense) => {
    acc[currentExpense.supplier] =
      (acc[currentExpense.supplier] || 0) + currentExpense.amount;
    return acc;
  }, {});
  return totals;
}

function calculateTotalPerPaymentMethod(originArray) {
  const totals = originArray.reduce((acc, currentExpense) => {
    acc[currentExpense.paymentMethod] =
      (acc[currentExpense.paymentMethod] || 0) + currentExpense.amount;
    return acc;
  }, {});
  return totals;
}

function calcDescendingSupplier(originArray) {
  const originArrayCopy = [...originArray];
  const supplierArray = Object.entries(
    calculateTotalPerSupplier(originArrayCopy)
  );
  const descToAsce = supplierArray.sort((a, b) => b[1] - a[1]);
  return descToAsce;
}

function calculateTotalByDate(originArray) {
  const totals = originArray.reduce((acc, currentExpense) => {
    acc[currentExpense.date] =
      (acc[currentExpense.date] || 0) + currentExpense.amount;
    return acc;
  }, {});
  return totals;
}

function getTotalExpensesCount(expensesArray) {
  return expensesArray.length;
}

function getTopExpense(expensesArray) {
  if (expensesArray.length === 0) return null;
  const ordenedArray = calcDescendingAmount(expensesArray);
  return ordenedArray[0];
}

function getTopCategory(totalsObject) {
  const entries = Object.entries(totalsObject);
  if (entries.length === 0) return null;

  let topCategoryName = "";
  let highestAmount = -Infinity;

  entries.forEach(([category, amount]) => {
    if (amount > highestAmount) {
      highestAmount = amount;
      topCategoryName = category;
    }
  });
  return topCategoryName;
}

// --- Funções Utilitárias (Helpers) ---

function saveToLocalStorage(expensesArray) {
  const expensesJSON = JSON.stringify(expensesArray);
  localStorage.setItem("expenses", expensesJSON);
}

function handleValidationFeedback(ruleEntry) {
  const isValid = ruleEntry.rule();
  const element = ruleEntry.element;
  if (!isValid) {
    element.classList.add("input-error");
  } else {
    element.classList.remove("input-error");
  }
}

function updateUI() {
  renderExpenses(expenses);
  renderPizzaDashboard();
  renderBarChart();
  renderSupplierBarChart();
  renderPaymentMethodDoughnutChart();
  renderDateLineChart();
  renderInsightCards();
}
function formatCurrency(number) {
  return currencyFormatter.format(number);
}

function generateDateRange(year, month) {
  let currentDate = new Date(year, month - 1, 1);
  let dates = [];
  while (currentDate.getMonth() === month - 1) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
}

/*=============================================
=            4. EVENT LISTENERS               =
=============================================*/

form.addEventListener("submit", (event) => {
  event.preventDefault();

  let isFormStillValid = true;
  Object.values(validationRules).forEach((entry) => {
    if (!entry.rule()) {
      isFormStillValid = false;
      entry.element.classList.add("input-error");
      paragraph.textContent = entry.error;
      form.appendChild(paragraph);
    } else {
      entry.element.classList.remove("input-error");
    }
  });

  if (!isFormStillValid) return;

  const newExpense = {
    id: uuidv4(),
    name: expenseNameInput.value,
    amount: Number(expenseAmountInput.value),
    category: categorySelect.value,
    date: dateInput.value,
    paymentMethod: paymentMethodInput.value,
    supplier: supplierInput.value,
  };

  expenses.push(newExpense);
  saveToLocalStorage(expenses);
  updateUI();

  form.reset();
  expenseNameInput.focus();
});

expenseListUl.addEventListener("click", (event) => {
  const target = event.target;

  if (target.classList.contains("btn-delete")) {
    const expenseId = target.dataset.id;
    expenses = expenses.filter((expense) => expense.id !== expenseId);
    updateUI();
  }

  if (target.classList.contains("btn-edit")) {
    editingExpenseId = target.dataset.id;
    updateUI();
  }

  if (target.classList.contains("btn-cancel")) {
    editingExpenseId = null;
    updateUI();
  }

  if (target.classList.contains("btn-save")) {
    const expenseId = target.dataset.id;
    const expenseToUpdate = expenses.find(
      (expense) => expense.id === expenseId
    );

    const li = target.closest("li");
    const name = li.querySelector('input[name="edit-name"]').value;
    const amount = Number(li.querySelector('input[name="edit-amount"]').value);
    const category = li.querySelector('select[name="edit-category"]').value;
    const date = li.querySelector('input[name="edit-date"]').value;
    const paymentMethod = li.querySelector(
      'select[name="edit-payment-method"]'
    ).value;
    const supplier = li.querySelector('input[name="edit-supplier"]').value;

    expenseToUpdate.name = name;
    expenseToUpdate.amount = amount;
    expenseToUpdate.category = category;
    expenseToUpdate.date = date;
    expenseToUpdate.paymentMethod = paymentMethod;
    expenseToUpdate.supplier = supplier;

    editingExpenseId = null;
    updateUI();
  }

  saveToLocalStorage(expenses);
});

/*=============================================
=            5. INICIALIZAÇÃO                 =
=============================================*/
function init() {
  const savedExpensesJSON = localStorage.getItem("expenses");
  if (savedExpensesJSON) {
    expenses = JSON.parse(savedExpensesJSON);
  }
  updateUI();
}

init(); // Roda a aplicação pela primeira vez
