let tasksData = {};
const todo = document.querySelector("#todo");
const progress = document.querySelector("#progress");
const done = document.querySelector("#done");
const columns = [todo, progress, done];
let dragElement = null;

function updateCounts() {
  columns.forEach((col) => {
    const tasks = col.querySelectorAll(".task");
    const count = col.querySelector(".right");
    count.innerText = tasks.length;
  });
}

function saveToLocalStorage() {
  columns.forEach((col) => {
    const tasks = col.querySelectorAll(".task");
    tasksData[col.id] = Array.from(tasks).map((t) => {
      return {
        title: t.querySelector("h2").innerText,
        desc: t.querySelector("p").innerText,
      };
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasksData));
}

function setDragHandlersOnTask(taskEl) {
  taskEl.addEventListener("dragstart", () => {
    dragElement = taskEl;
  });

  const deleteBtn = taskEl.querySelector("button");
  if (deleteBtn) {
    deleteBtn.addEventListener("click", () => {
      taskEl.remove();
      saveToLocalStorage();
      updateCounts();
    });
  }
}


// Render tasks from localStorage (and prevent auto-adding duplicate Task 1 on refresh)
if (localStorage.getItem("tasks")) {
  const data = JSON.parse(localStorage.getItem("tasks"));

  // remove existing task elements from columns (keep only headings)
  columns.forEach((col) => {
    col.querySelectorAll(".task").forEach((t) => t.remove());
  });

  for (const colId in data) {
    const column = document.querySelector(`#${colId}`);
    data[colId].forEach((task) => {
      const div = document.createElement("div");
      div.classList.add("task");
      div.setAttribute("draggable", "true");

      div.innerHTML = `
        <h2>${task.title}</h2>
        <p>${task.desc}</p>
        <button>Delete</button>
      `;

      column.appendChild(div);
      setDragHandlersOnTask(div);
    });
  }

  updateCounts();
}

console.log(todo, progress, done);

// Set drag handler for any tasks that exist initially (e.g., when no localStorage is set)
document.querySelectorAll(".task").forEach((task) => setDragHandlersOnTask(task));

function addDragEventsOnColumn(column) {
  column.addEventListener("dragenter", (e) => {
    e.preventDefault();
    column.classList.add("hover-over");
  });

  column.addEventListener("dragleave", (e) => {
    e.preventDefault();
    column.classList.remove("hover-over");
  });

  column.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  column.addEventListener("drop", (e) => {
    e.preventDefault();

    if (!dragElement) {
      console.error("No element is being dragged");
      return;
    }

    column.appendChild(dragElement);
    column.classList.remove("hover-over");

    saveToLocalStorage();
    updateCounts();
  });
}

addDragEventsOnColumn(todo);
addDragEventsOnColumn(progress);
addDragEventsOnColumn(done);

const toggleModalButton = document.querySelector("#toggle-modal");
const modalBg = document.querySelector(".modal .bg");
const modal = document.querySelector(".modal");
const addTaskButton = document.querySelector("#add-new-task");

toggleModalButton.addEventListener("click", () => {
  modal.classList.toggle("active");
});

modalBg.addEventListener("click", () => {
  modal.classList.remove("active");
});

addTaskButton.addEventListener("click", () => {
  const taskTitle = document.querySelector("#task-title-input").value;
  const taskDesc = document.querySelector("#task-desc-input").value;

  const div = document.createElement("div");
  div.classList.add("task");
  div.setAttribute("draggable", "true");

  div.innerHTML = `
     <h2>${taskTitle}</h2>
     <p>${taskDesc}</p>
     <button>Delete</button>
  `;

  todo.appendChild(div);
  setDragHandlersOnTask(div);

  saveToLocalStorage();
  updateCounts();

  modal.classList.remove("active");
});

