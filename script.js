const STORAGE_KEY = "studyflowTasks";
const LANG_KEY = "studyflowLanguage";

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const categorySelect = document.getElementById("categorySelect");
const prioritySelect = document.getElementById("prioritySelect");
const dueDateInput = document.getElementById("dueDateInput");
const submitTaskBtn = document.getElementById("submitTaskBtn");

const searchInput = document.getElementById("searchInput");
const filterSelect = document.getElementById("filterSelect");
const sortSelect = document.getElementById("sortSelect");

const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");
const clearCompletedBtn = document.getElementById("clearCompletedBtn");
const resetAllBtn = document.getElementById("resetAllBtn");

const allCount = document.getElementById("allCount");
const completedCount = document.getElementById("completedCount");
const pendingCount = document.getElementById("pendingCount");
const highCount = document.getElementById("highCount");

const categoryStats = document.getElementById("categoryStats");
const completionRate = document.getElementById("completionRate");

const calendarList = document.getElementById("calendarList");
const calendarEmpty = document.getElementById("calendarEmpty");

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
const tabButtons = document.querySelectorAll(".tab-btn");
const tabPanels = {
  tasks: document.getElementById("tasksPanel"),
  calendar: document.getElementById("calendarPanel"),
  stats: document.getElementById("statsPanel"),
  settings: document.getElementById("settingsPanel"),
};

const langButtons = document.querySelectorAll(".lang-btn");

let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let currentLanguage = localStorage.getItem(LANG_KEY) || "en";
let editingTaskId = null;

const translations = {
  en: {
    app_kicker: "Smart planner",
    tab_tasks: "Tasks",
    tab_calendar: "Calendar",
    tab_stats: "Stats",
    tab_settings: "Settings",
    hero_text:
      "Organize study, work, and personal tasks in one place with a clean and focused workflow.",

    tasks_kicker: "Planner",
    tasks_title: "My Tasks",
    clear_completed: "Clear completed",
    label_task: "Task",
    label_category: "Category",
    label_priority: "Priority",
    label_due_date: "Due date",
    add_task: "Add Task",
    update_task: "Update Task",
    filter_all: "All categories",
    filter_completed: "Completed",
    filter_pending: "Pending",
    sort_newest: "Newest first",
    sort_oldest: "Oldest first",
    sort_priority_high: "Priority: high to low",
    sort_priority_low: "Priority: low to high",
    sort_due_soon: "Due date: soonest",
    empty_title: "No tasks yet",
    empty_text: "Start by adding your first task.",

    calendar_kicker: "Overview",
    calendar_title: "Calendar View",
    calendar_empty_title: "No dated tasks",
    calendar_empty_text: "Add tasks with due dates to see them here.",

    stats_kicker: "Progress",
    stats_title: "Statistics",
    stat_all: "All tasks",
    stat_completed: "Completed",
    stat_pending: "Pending",
    stat_high: "High priority",
    insight_categories: "Tasks by category",
    insight_completion: "Completion rate",

    settings_kicker: "Preferences",
    settings_title: "Settings",
    setting_language_title: "Language",
    setting_language_text: "Choose the language you want to use in the app.",
    setting_storage_title: "Storage",
    setting_storage_text: "Your tasks are currently saved in your browser.",
    setting_future_title: "Future upgrade",
    setting_future_text:
      "Later, this app can be connected to Supabase for sign up, sign in, and cloud sync.",
    setting_reset_title: "Reset",
    setting_reset_text: "Remove all saved tasks from this browser.",
    reset_button: "Delete all tasks",

    cat_study: "Study",
    cat_work: "Work",
    cat_personal: "Personal",
    prio_low: "Low",
    prio_medium: "Medium",
    prio_high: "High",

    search_placeholder: "Search tasks...",
    task_placeholder: "Enter your task...",
    due_none: "No due date",
    due_label: "Due",
    btn_done: "Done",
    btn_undo: "Undo",
    btn_edit: "Edit",
    btn_delete: "Delete",
    confirm_reset: "Delete all tasks?",
    confirm_clear_completed: "Delete all completed tasks?",
    stats_category_text: "Study: {study} • Work: {work} • Personal: {personal}",
  },

  pl: {
    app_kicker: "Smart planner",
    tab_tasks: "Zadania",
    tab_calendar: "Kalendarz",
    tab_stats: "Statystyki",
    tab_settings: "Ustawienia",
    hero_text:
      "Organizuj naukę, pracę i sprawy prywatne w jednym miejscu dzięki przejrzystemu i wygodnemu workflow.",

    tasks_kicker: "Planner",
    tasks_title: "Moje zadania",
    clear_completed: "Usuń ukończone",
    label_task: "Zadanie",
    label_category: "Kategoria",
    label_priority: "Priorytet",
    label_due_date: "Termin",
    add_task: "Dodaj zadanie",
    update_task: "Zapisz zmiany",
    filter_all: "Wszystkie kategorie",
    filter_completed: "Ukończone",
    filter_pending: "Do zrobienia",
    sort_newest: "Najnowsze",
    sort_oldest: "Najstarsze",
    sort_priority_high: "Priorytet: wysoki do niskiego",
    sort_priority_low: "Priorytet: niski do wysokiego",
    sort_due_soon: "Termin: najszybciej",
    empty_title: "Brak zadań",
    empty_text: "Dodaj pierwsze zadanie, aby zacząć.",

    calendar_kicker: "Przegląd",
    calendar_title: "Widok kalendarza",
    calendar_empty_title: "Brak zadań z terminem",
    calendar_empty_text: "Dodaj termin do zadania, aby zobaczyć je tutaj.",

    stats_kicker: "Postęp",
    stats_title: "Statystyki",
    stat_all: "Wszystkie zadania",
    stat_completed: "Ukończone",
    stat_pending: "Do zrobienia",
    stat_high: "Wysoki priorytet",
    insight_categories: "Zadania według kategorii",
    insight_completion: "Poziom ukończenia",

    settings_kicker: "Preferencje",
    settings_title: "Ustawienia",
    setting_language_title: "Język",
    setting_language_text: "Wybierz język aplikacji.",
    setting_storage_title: "Zapisywanie",
    setting_storage_text: "Twoje zadania są obecnie zapisywane w przeglądarce.",
    setting_future_title: "Przyszła rozbudowa",
    setting_future_text:
      "Później aplikację można połączyć z Supabase, aby dodać logowanie i synchronizację w chmurze.",
    setting_reset_title: "Reset",
    setting_reset_text: "Usuń wszystkie zapisane zadania z tej przeglądarki.",
    reset_button: "Usuń wszystkie zadania",

    cat_study: "Nauka",
    cat_work: "Praca",
    cat_personal: "Prywatne",
    prio_low: "Niski",
    prio_medium: "Średni",
    prio_high: "Wysoki",

    search_placeholder: "Szukaj zadań...",
    task_placeholder: "Wpisz zadanie...",
    due_none: "Brak terminu",
    due_label: "Termin",
    btn_done: "Zrobione",
    btn_undo: "Cofnij",
    btn_edit: "Edytuj",
    btn_delete: "Usuń",
    confirm_reset: "Usunąć wszystkie zadania?",
    confirm_clear_completed: "Usunąć wszystkie ukończone zadania?",
    stats_category_text: "Nauka: {study} • Praca: {work} • Prywatne: {personal}",
  },

  ru: {
    app_kicker: "Умный планер",
    tab_tasks: "Задачи",
    tab_calendar: "Календарь",
    tab_stats: "Статистика",
    tab_settings: "Настройки",
    hero_text:
      "Организуй учёбу, работу и личные дела в одном месте с чистым и удобным интерфейсом.",

    tasks_kicker: "Планер",
    tasks_title: "Мои задачи",
    clear_completed: "Удалить выполненные",
    label_task: "Задача",
    label_category: "Категория",
    label_priority: "Приоритет",
    label_due_date: "Срок",
    add_task: "Добавить задачу",
    update_task: "Сохранить изменения",
    filter_all: "Все категории",
    filter_completed: "Выполненные",
    filter_pending: "Невыполненные",
    sort_newest: "Сначала новые",
    sort_oldest: "Сначала старые",
    sort_priority_high: "Приоритет: высокий к низкому",
    sort_priority_low: "Приоритет: низкий к высокому",
    sort_due_soon: "Срок: ближайшие",
    empty_title: "Пока нет задач",
    empty_text: "Добавь первую задачу, чтобы начать.",

    calendar_kicker: "Обзор",
    calendar_title: "Вид календаря",
    calendar_empty_title: "Нет задач с датой",
    calendar_empty_text: "Добавь срок выполнения, чтобы задачи появились здесь.",

    stats_kicker: "Прогресс",
    stats_title: "Статистика",
    stat_all: "Все задачи",
    stat_completed: "Выполненные",
    stat_pending: "Невыполненные",
    stat_high: "Высокий приоритет",
    insight_categories: "Задачи по категориям",
    insight_completion: "Процент выполнения",

    settings_kicker: "Параметры",
    settings_title: "Настройки",
    setting_language_title: "Язык",
    setting_language_text: "Выбери язык приложения.",
    setting_storage_title: "Хранение",
    setting_storage_text: "Сейчас задачи сохраняются в браузере.",
    setting_future_title: "Будущее улучшение",
    setting_future_text:
      "Позже это приложение можно подключить к Supabase для регистрации, входа и облачной синхронизации.",
    setting_reset_title: "Сброс",
    setting_reset_text: "Удалить все сохранённые задачи из этого браузера.",
    reset_button: "Удалить все задачи",

    cat_study: "Учёба",
    cat_work: "Работа",
    cat_personal: "Личное",
    prio_low: "Низкий",
    prio_medium: "Средний",
    prio_high: "Высокий",

    search_placeholder: "Поиск задач...",
    task_placeholder: "Введите задачу...",
    due_none: "Без срока",
    due_label: "Срок",
    btn_done: "Готово",
    btn_undo: "Отменить",
    btn_edit: "Изменить",
    btn_delete: "Удалить",
    confirm_reset: "Удалить все задачи?",
    confirm_clear_completed: "Удалить все выполненные задачи?",
    stats_category_text: "Учёба: {study} • Работа: {work} • Личное: {personal}",
  },

  uk: {
    app_kicker: "Розумний планер",
    tab_tasks: "Завдання",
    tab_calendar: "Календар",
    tab_stats: "Статистика",
    tab_settings: "Налаштування",
    hero_text:
      "Організовуй навчання, роботу та особисті справи в одному місці завдяки чистому й зручному інтерфейсу.",

    tasks_kicker: "Планер",
    tasks_title: "Мої завдання",
    clear_completed: "Видалити виконані",
    label_task: "Завдання",
    label_category: "Категорія",
    label_priority: "Пріоритет",
    label_due_date: "Термін",
    add_task: "Додати завдання",
    update_task: "Зберегти зміни",
    filter_all: "Усі категорії",
    filter_completed: "Виконані",
    filter_pending: "Невиконані",
    sort_newest: "Спочатку нові",
    sort_oldest: "Спочатку старі",
    sort_priority_high: "Пріоритет: високий до низького",
    sort_priority_low: "Пріоритет: низький до високого",
    sort_due_soon: "Термін: найближчі",
    empty_title: "Поки немає завдань",
    empty_text: "Додай перше завдання, щоб почати.",

    calendar_kicker: "Огляд",
    calendar_title: "Календарний вигляд",
    calendar_empty_title: "Немає завдань із датою",
    calendar_empty_text: "Додай термін виконання, щоб побачити завдання тут.",

    stats_kicker: "Прогрес",
    stats_title: "Статистика",
    stat_all: "Усі завдання",
    stat_completed: "Виконані",
    stat_pending: "Невиконані",
    stat_high: "Високий пріоритет",
    insight_categories: "Завдання за категоріями",
    insight_completion: "Рівень виконання",

    settings_kicker: "Параметри",
    settings_title: "Налаштування",
    setting_language_title: "Мова",
    setting_language_text: "Оберіть мову застосунку.",
    setting_storage_title: "Збереження",
    setting_storage_text: "Зараз завдання зберігаються в браузері.",
    setting_future_title: "Майбутнє покращення",
    setting_future_text:
      "Пізніше цей застосунок можна підключити до Supabase для реєстрації, входу та хмарної синхронізації.",
    setting_reset_title: "Скидання",
    setting_reset_text: "Видалити всі збережені завдання з цього браузера.",
    reset_button: "Видалити всі завдання",

    cat_study: "Навчання",
    cat_work: "Робота",
    cat_personal: "Особисте",
    prio_low: "Низький",
    prio_medium: "Середній",
    prio_high: "Високий",

    search_placeholder: "Пошук завдань...",
    task_placeholder: "Введіть завдання...",
    due_none: "Без терміну",
    due_label: "Термін",
    btn_done: "Готово",
    btn_undo: "Скасувати",
    btn_edit: "Редагувати",
    btn_delete: "Видалити",
    confirm_reset: "Видалити всі завдання?",
    confirm_clear_completed: "Видалити всі виконані завдання?",
    stats_category_text: "Навчання: {study} • Робота: {work} • Особисте: {personal}",
  },
};

function t(key) {
  return translations[currentLanguage][key] || key;
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function saveLanguage() {
  localStorage.setItem(LANG_KEY, currentLanguage);
}

function priorityValue(priority) {
  if (priority === "High") return 3;
  if (priority === "Medium") return 2;
  return 1;
}

function formatDate(dateString) {
  if (!dateString) return t("due_none");
  const date = new Date(dateString);
  return date.toLocaleDateString(currentLanguage);
}

function updateSelectOptionLabels() {
  categorySelect.options[0].text = t("cat_study");
  categorySelect.options[1].text = t("cat_work");
  categorySelect.options[2].text = t("cat_personal");

  prioritySelect.options[0].text = t("prio_low");
  prioritySelect.options[1].text = t("prio_medium");
  prioritySelect.options[2].text = t("prio_high");

  filterSelect.options[0].text = t("filter_all");
  filterSelect.options[1].text = t("cat_study");
  filterSelect.options[2].text = t("cat_work");
  filterSelect.options[3].text = t("cat_personal");
  filterSelect.options[4].text = t("filter_completed");
  filterSelect.options[5].text = t("filter_pending");

  sortSelect.options[0].text = t("sort_newest");
  sortSelect.options[1].text = t("sort_oldest");
  sortSelect.options[2].text = t("sort_priority_high");
  sortSelect.options[3].text = t("sort_priority_low");
  sortSelect.options[4].text = t("sort_due_soon");
}

function setLanguage(lang) {
  currentLanguage = lang;
  document.documentElement.lang = lang;

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");
    if (translations[lang][key]) {
      element.innerHTML = translations[lang][key];
    }
  });

  taskInput.placeholder = t("task_placeholder");
  searchInput.placeholder = t("search_placeholder");
  updateSelectOptionLabels();

  langButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });

  saveLanguage();
  renderAll();
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

function categoryLabel(category) {
  if (category === "Study") return t("cat_study");
  if (category === "Work") return t("cat_work");
  return t("cat_personal");
}

function priorityLabel(priority) {
  if (priority === "Low") return t("prio_low");
  if (priority === "Medium") return t("prio_medium");
  return t("prio_high");
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
          <span class="badge ${categoryClass}">${categoryLabel(task.category)}</span>
          <span class="badge ${priorityClass}">${priorityLabel(task.priority)}</span>
        </div>

        <div class="task-meta">
          ${t("due_label")}: ${formatDate(task.dueDate)}
        </div>
      </div>

      <div class="task-actions">
        <button class="action-btn" data-action="toggle" data-id="${task.id}">
          ${task.done ? t("btn_undo") : t("btn_done")}
        </button>
        <button class="action-btn" data-action="edit" data-id="${task.id}">
          ${t("btn_edit")}
        </button>
        <button class="action-btn" data-action="delete" data-id="${task.id}">
          ${t("btn_delete")}
        </button>
      </div>
    `;

    taskList.appendChild(li);
  });
}

function renderCalendar() {
  calendarList.innerHTML = "";

  const datedTasks = [...tasks]
    .filter((task) => task.dueDate)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  if (datedTasks.length === 0) {
    calendarEmpty.classList.add("show");
    return;
  }

  calendarEmpty.classList.remove("show");

  const grouped = {};

  datedTasks.forEach((task) => {
    if (!grouped[task.dueDate]) grouped[task.dueDate] = [];
    grouped[task.dueDate].push(task);
  });

  Object.keys(grouped).forEach((dateKey) => {
    const day = document.createElement("div");
    day.className = "calendar-day";

    const heading = document.createElement("h3");
    heading.textContent = new Date(dateKey).toLocaleDateString(currentLanguage);
    day.appendChild(heading);

    grouped[dateKey].forEach((task) => {
      const item = document.createElement("div");
      item.className = "calendar-task";
      item.innerHTML = `
        <div class="calendar-task-title">${task.title}</div>
        <div class="calendar-task-meta">${categoryLabel(task.category)} • ${priorityLabel(task.priority)}</div>
      `;
      day.appendChild(item);
    });

    calendarList.appendChild(day);
  });
}

function updateStats() {
  const completed = tasks.filter((task) => task.done).length;
  const pending = tasks.filter((task) => !task.done).length;
  const high = tasks.filter((task) => task.priority === "High").length;

  const study = tasks.filter((task) => task.category === "Study").length;
  const work = tasks.filter((task) => task.category === "Work").length;
  const personal = tasks.filter((task) => task.category === "Personal").length;

  const rate = tasks.length === 0 ? 0 : Math.round((completed / tasks.length) * 100);

  allCount.textContent = tasks.length;
  completedCount.textContent = completed;
  pendingCount.textContent = pending;
  highCount.textContent = high;

  categoryStats.textContent = t("stats_category_text")
    .replace("{study}", study)
    .replace("{work}", work)
    .replace("{personal}", personal);

  completionRate.textContent = `${rate}%`;
}

function renderAll() {
  renderTasks();
  renderCalendar();
  updateStats();
}

function resetFormToAddMode() {
  editingTaskId = null;
  taskForm.reset();
  submitTaskBtn.textContent = t("add_task");
  prioritySelect.value = "Medium";
}

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = taskInput.value.trim();
  if (!title) return;

  if (editingTaskId) {
    tasks = tasks.map((task) =>
      task.id === editingTaskId
        ? {
            ...task,
            title,
            category: categorySelect.value,
            priority: prioritySelect.value,
            dueDate: dueDateInput.value,
          }
        : task
    );
  } else {
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
  }

  saveTasks();
  renderAll();
  resetFormToAddMode();
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

    editingTaskId = id;
    taskInput.value = taskToEdit.title;
    categorySelect.value = taskToEdit.category;
    prioritySelect.value = taskToEdit.priority;
    dueDateInput.value = taskToEdit.dueDate;
    submitTaskBtn.textContent = t("update_task");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  saveTasks();
  renderAll();
});

searchInput.addEventListener("input", renderTasks);
filterSelect.addEventListener("change", renderTasks);
sortSelect.addEventListener("change", renderTasks);

clearCompletedBtn.addEventListener("click", () => {
  if (!confirm(t("confirm_clear_completed"))) return;
  tasks = tasks.filter((task) => !task.done);
  saveTasks();
  renderAll();
});

resetAllBtn.addEventListener("click", () => {
  if (!confirm(t("confirm_reset"))) return;
  tasks = [];
  saveTasks();
  renderAll();
  resetFormToAddMode();
});

langButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setLanguage(button.dataset.lang);
  });
});

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const tab = button.dataset.tab;

    tabButtons.forEach((btn) => btn.classList.remove("active"));
    Object.values(tabPanels).forEach((panel) => panel.classList.remove("active"));

    button.classList.add("active");
    tabPanels[tab].classList.add("active");

    if (window.innerWidth <= 760) {
      mainNav.classList.remove("show");
    }
  });
});

menuToggle.addEventListener("click", () => {
  mainNav.classList.toggle("show");
});

setLanguage(currentLanguage);
renderAll();
resetFormToAddMode();