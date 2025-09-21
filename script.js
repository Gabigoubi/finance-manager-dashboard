import { v4 as uuidv4 } from "uuid";

const main = document.getElementById("main-html");
const form = document.getElementById("form");
const expenseNameInput = document.getElementById("expense-name");
const expenseAmountInput = document.getElementById("amount");
const categorySelect = document.getElementById("expense-category");

const expensesSection = document.createElement("section");
const expenseListUl = document.createElement("ul");
expensesSection.appendChild(expenseListUl);
main.appendChild(expensesSection);

let expenses = [];

const validationRules = {
  expenseName: {
    element: expenseNameInput,
    rule: () => expenseNameInput.value.length >= 3,
    error: "Sua despesa precisa ter mais de 3 caracteres...",
  },
  expenseAmount: {
    element: expenseAmountInput,
    rule: () =>
      expenseAmountInput.value > 0 && !expenseAmountInput.value.startsWith("0"),
    error: "O valor precisa ser maior que 0...",
  },
  category: {
    element: categorySelect,
    rule: () => categorySelect.value !== "",
    error: "Selecione a categoria....",
  },
};

function renderExpenses(expensesArray) {
  expenseListUl.innerHTML = "";
  expensesArray.forEach(({ name, amount, category, id }) => {
    const li = document.createElement("li");
    const textSpan = document.createElement("span");
    textSpan.textContent = `${name} - $${amount} - ${category}`;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.setAttribute("data-id", id);

    li.appendChild(textSpan);
    li.appendChild(deleteBtn);
    expenseListUl.appendChild(li);
  });
}

function saveToLocalStorage(expensesArray) {
  const expensesJSON = JSON.stringify(expensesArray);
  localStorage.setItem("expenses", expensesJSON);
}

const savedExpensesJSON = localStorage.getItem("expenses");

if (savedExpensesJSON !== null) {
  expenses = JSON.parse(savedExpensesJSON);
  renderExpenses(expenses);
}
const paragraph = document.createElement("p");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (paragraph.parentElement) {
    paragraph.remove();
  }
  let isFormStillValid = true;
  const validationEntries = Object.values(validationRules);
  for (const entry of validationEntries) {
    const isRuleValid = entry.rule();
    const inputElement = entry.element;
    if (isRuleValid === false) {
      inputElement.classList.add("input-error");
      isFormStillValid = false;
      paragraph.textContent = entry.error;
      form.appendChild(paragraph);
    }
  }
  if (isFormStillValid === false) {
    return;
  }
  const newExpense = {
    id: uuidv4(),
    description: "",
    name: expenseNameInput.value,
    amount: Number(expenseAmountInput.value),
    category: categorySelect.value,
  };

  expenses.push(newExpense);
  renderExpenses(expenses);
  saveToLocalStorage(expenses);

  form.reset();
  expenseNameInput.focus();
});
function handleValidationFeedback(ruleEntry) {
  const isValid = ruleEntry.rule();
  const element = ruleEntry.element;
  if (!isValid) {
    element.classList.add("input-error");
  } else {
    element.classList.remove("input-error");
  }
}
expenseNameInput.addEventListener("input", () => {
  handleValidationFeedback(validationRules.expenseName);
});

expenseAmountInput.addEventListener("input", () => {
  handleValidationFeedback(validationRules.expenseAmount);
});

categorySelect.addEventListener("change", () => {
  handleValidationFeedback(validationRules.category);
});
expenseListUl.addEventListener("click", (event) => {
  if (event.target.matches("button")) {
    const expenseId = event.target.dataset.id;

    expenses = expenses.filter((expense) => {
      return expense.id !== expenseId;
    });
    renderExpenses(expenses);
    saveToLocalStorage(expenses);
  }
});
