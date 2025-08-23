const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const noTodos = document.querySelector(".no-todos");
const listDiv = document.getElementById("listt");
// Load tasks from storage

let tasks = []
function updateUI() {
  if (tasks.length === 0) {
    noTodos.classList.remove("hidden");
    listDiv.classList.add("hidden");
  } else {
    noTodos.classList.add("hidden");
    listDiv.classList.remove("hidden");
    
    
  }

  const uncompletedCount = tasks.filter(t => !t.completed).length;
    
    chrome.action.setBadgeText({
      text: uncompletedCount > 0 ? uncompletedCount.toString() : ''
    });

    chrome.action.setBadgeTextColor({ color: '#FFFFFF' });

    chrome.action.setBadgeBackgroundColor({ color: "#FF0000" });
}
// console.log(tasks)
chrome.storage.sync.get(["tasks"], (result) => {
  if (result.tasks) {
    tasks = result.tasks;
    tasks.forEach(addTaskToDOM);
  }
  updateUI();
});

taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const taskText = taskInput.value.trim();
  if (taskText) {
    const newTask = { text: taskText, completed: false };
    tasks.push(newTask);
    chrome.storage.sync.set({ tasks });
    addTaskToDOM(newTask);
    updateUI();
    taskInput.value = "";
  }
  }
});

addBtn.addEventListener("click", () => {
  const taskText = taskInput.value.trim();
  if (taskText) {
    const newTask = { text: taskText, completed: false };
    tasks.push(newTask);
    chrome.storage.sync.set({ tasks });
    addTaskToDOM(newTask);
    updateUI();
    taskInput.value = "";
  }
});

function addTask(task) {
  // tasks.push(task);          // add to array
  addTaskToDOM(task);        // render in UI
  chrome.storage.sync.set({ tasks });
  updateUI(); 
}

function addTaskToDOM(task) {
  const taskDiv = document.createElement("div");
  taskDiv.classList.add("task-item");

  const checkbox = document.createElement("input")
  checkbox.type = 'checkbox';
  checkbox.classList.add('task-checkbox');

  const span = document.createElement('span');
  span.classList.add("task-text")
  span.textContent = task.text;

  const delBtn = document.createElement('button');  
  delBtn.classList.add('delete-btn');
  delBtn.innerHTML = `
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" 
       stroke="#666666" stroke-width="1.5">
    <path d="M3 4h10v9.5c0 .28-.22.5-.5.5h-9a.5.5 0 01-.5-.5V4z"></path>
    <path d="M6.5 2.5h3L10 4H6l.5-1.5z"></path>
    <line x1="2" y1="4" x2="14" y2="4"></line>
    <line x1="6" y1="6" x2="6" y2="12"></line>
    <line x1="10" y1="6" x2="10" y2="12"></line>
  </svg>
  `;
  
  delBtn.addEventListener('click' , (e) => {
    e.stopPropagation();
    removeTask(task ,taskDiv);
  })

  checkbox.addEventListener('change' , () => {
    if(checkbox.checked){
      span.classList.add('checked');
    }else{
      span.classList.remove('checked');
    }
  })

  taskDiv.appendChild(checkbox);
  taskDiv.appendChild(span);
  taskDiv.appendChild(delBtn);

  listDiv.appendChild(taskDiv);
}

function removeTask(task, taskDiv) {
  // remove from array
  tasks = tasks.filter((t) => t !== task);

  // update storage
  chrome.storage.sync.set({ tasks });

  // remove from UI
  taskDiv.remove();
  updateUI();
}