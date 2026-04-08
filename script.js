const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const categorySelect = document.getElementById("categorySelect");
const prioritySelect = document.getElementById("prioritySelect");
const taskList = document.getElementById("taskList");
const filterButtons = document.querySelectorAll(".filter-btn");

let tasks = JSON.parse(localStorage.getItem("studyflowTasks")) || [];
let currentFilter = "All";

function saveTasks() {
  localStorage.setItem("studyflowTasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = "";

  const filteredTasks =
    currentFilter === "All"
      ? tasks
      : tasks.filter((task) => task.category === currentFilter);

  filteredTasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = "task-item";

    li.innerHTML = `
      <div class="task-left">
        <span class="task-title ${task.done ? "done" : ""}">${task.title}</span>
        <span class="task-meta">${task.category} • ${task.priority} priority</span>
      </div>
      <div class="task-actions">
        <button data-id="${task.id}" class="done-btn">
          ${task.done ? "Undo" : "Done"}
        </button>
        <button data-id="${task.id}" class="delete-btn">Delete</button>
      </div>
    `;

    taskList.appendChild(li);
  });
}

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const newTask = {
    id: Date.now(),
    title: taskInput.value.trim(),
    category: categorySelect.value,
    priority: prioritySelect.value,
    done: false,
  };

  if (!newTask.title) return;

  tasks.unshift(newTask);
  saveTasks();
  renderTasks();
  taskForm.reset();
});

taskList.addEventListener("click", (event) => {
  const id = Number(event.target.dataset.id);

  if (event.target.classList.contains("done-btn")) {
    tasks = tasks.map((task) =>
      task.id === id ? { ...task, done: !task.done } : task
    );
  }

  if (event.target.classList.contains("delete-btn")) {
    tasks = tasks.filter((task) => task.id !== id);
  }

  saveTasks();
  renderTasks();
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;

    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    renderTasks();
  });
});

renderTasks();