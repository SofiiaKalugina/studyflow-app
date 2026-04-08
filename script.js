const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const categorySelect = document.getElementById("categorySelect");
const prioritySelect = document.getElementById("prioritySelect");
const dueDateInput = document.getElementById("dueDateInput");

const searchInput = document.getElementById("searchInput");
const filterSelect = document.getElementById("filterSelect");
const sortSelect = document.getElementById("sortSelect");

const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");
const clearCompletedBtn = document.getElementById("clearCompletedBtn");

const allCount = document.getElementById("allCount");
const completedCount = document.getElementById("completedCount");
const pendingCount = document.getElementById("pendingCount");

const STORAGE_KEY = "studyflowTasks";

let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function updateStats() {
  const completed = tasks.filter((task) => task.done).length;
  const pending = tasks.filter((task) => !task.done).length;

  allCount.textContent = tasks.length;
  completedCount.textContent = completed;
  pendingCount.textContent = pending;
}

function formatDate(dateString) {
  if (!dateString) return "No due date";
  const date = new Date(dateString);
  return date.toLocaleDateString();
}

function priorityValue(priority) {
  if (priority === "High") return 3;
  if (priority === "Medium") return 2;
  return 1;
}

function getFilteredAndSortedTasks() {
  const searchValue = searchInput.value.trim().toLowerCase();
  const filterValue = filterSelect.value;
  const sortValue = sortSelect.value;

  let result = [...tasks];

  if (searchValue) {
    result = result.filter((task) =>
      task.title.toLowerCase().includes(searchValue)
    );
  }

  if (filterValue === "Completed") {
    result = result.filter((task) => task.done);
  } else if (filterValue === "Pending") {
    result = result.filter((task) => !task.done);
  } else if (filterValue !== "All") {
    result = result.filter((task) => task.category === filterValue);
  }

  if (sortValue === "newest") {
    result.sort((a, b) => b.createdAt - a.createdAt);
  }

  if (sortValue === "oldest") {
    result.sort((a, b) => a.createdAt - b.createdAt);
  }

  if (sortValue === "priorityHigh") {
    result.sort((a, b) => priorityValue(b.priority) - priorityValue(a.priority));
  }

  if (sortValue === "priorityLow") {
    result.sort((a, b) => priorityValue(a.priority) - priorityValue(b.priority));
  }

  if (sortValue === "dueSoon") {
    result.sort((a, b) => {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    });
  }

  return result;
}

function renderTasks() {
  const renderedTasks = getFilteredAndSortedTasks();
  taskList.innerHTML = "";

  if (renderedTasks.length === 0) {
    emptyState.classList.add("show");
  } else {
    emptyState.classList.remove("show");
  }

  renderedTasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = "task-item";

    const categoryClass = task.category.toLowerCase();
    const priorityClass = task.priority.toLowerCase();

    li.innerHTML = `
      <div class="task-left">
        <div class="task-title ${task.done ? "done" : ""}">${task.title}</div>

        <div class="badges">
          <span class="badge ${categoryClass}">${task.category}</span>
          <span class="badge ${priorityClass}">${task.priority} priority</span>
        </div>

        <div class="task-meta">
          Due: ${formatDate(task.dueDate)}
        </div>
      </div>

      <div class="task-actions">
        <button class="action-btn" data-action="toggle" data-id="${task.id}">
          ${task.done ? "Undo" : "Done"}
        </button>
        <button class="action-btn" data-action="edit" data-id="${task.id}">
          Edit
        </button>
        <button class="action-btn delete" data-action="delete" data-id="${task.id}">
          Delete
        </button>
      </div>
    `;

    taskList.appendChild(li);
  });

  updateStats();
}

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = taskInput.value.trim();

  if (!title) return;

  const newTask = {
    id: Date.now(),
    title,
    category: categorySelect.value,
    priority: prioritySelect.value,
    dueDate: dueDateInput.value,
    done: false,
    createdAt: Date.now(),
  };

  tasks.unshift(newTask);
  saveTasks();
  renderTasks();
  taskForm.reset();
});

taskList.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const action = button.dataset.action;
  const id = Number(button.dataset.id);

  if (action === "toggle") {
    tasks = tasks.map((task) =>
      task.id === id ? { ...task, done: !task.done } : task
    );
  }

  if (action === "delete") {
    tasks = tasks.filter((task) => task.id !== id);
  }

  if (action === "edit") {
    const taskToEdit = tasks.find((task) => task.id === id);
    if (!taskToEdit) return;

    const newTitle = prompt("Edit your task:", taskToEdit.title);
    if (newTitle === null) return;

    const trimmedTitle = newTitle.trim();
    if (!trimmedTitle) return;

    tasks = tasks.map((task) =>
      task.id === id ? { ...task, title: trimmedTitle } : task
    );
  }

  saveTasks();
  renderTasks();
});

searchInput.addEventListener("input", renderTasks);
filterSelect.addEventListener("change", renderTasks);
sortSelect.addEventListener("change", renderTasks);

clearCompletedBtn.addEventListener("click", () => {
  tasks = tasks.filter((task) => !task.done);
  saveTasks();
  renderTasks();
});

renderTasks();