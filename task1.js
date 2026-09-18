// ---mode toggle button--
const modeBtn = document.getElementById('mode');
const modeIcon = document.getElementById('mode-icon');

modeBtn.addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    modeIcon.textContent = isDarkMode ? '☀️' : '🌙';
});


// --progress bar update function--
function updateProgress(totalTasks, completedTasks) {
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-percent');

    if (totalTasks === 0) {
        progressFill.style.width = '0%';
        progressText.textContent = 'No tasks yet';
        return;
    }

    const percentage = (completedTasks / totalTasks) * 100;

    progressFill.style.width = percentage + '%';
    progressText.textContent = Math.round(percentage) + '%';
}


// --date--
const dateElement = document.getElementById('date');
const today = new Date();
dateElement.textContent = today.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
});


// --data & elements--
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let editIndex = null;

const taskForm = document.getElementById('task-form');
const taskListSection = document.querySelector('.task-list-section');
const addBtn = document.getElementById('add-btn');
const totalCount = document.getElementById('total-count');
const completedCount = document.getElementById('completed-count');
const pendingCount = document.getElementById('pending-count');


// --show tasks(task list)--
function renderTasks() {
    taskListSection.innerHTML = 
    `
        <div class="task-list-header">
            <h2>Task List</h2>
            <button id="clear-btn" class="task-button">Clear All</button>
        </div>
        ${tasks.map((task, index) =>
            `
            <div class="task-item">
                <div class="task-item-left">
                    <input type="checkbox" ${task.completed ? 'checked' : ''} onclick="toggleTask(${index})">
                    <span style="${task.completed ? 'text-decoration:line-through; opacity:0.5;' : ''}">
                        <strong>${task.name}</strong> (${task.subject}) - ${task.priority} [${task.date || 'No Date'}]
                    </span>
                </div>
                <div>
                    <button class="task-action-btn" onclick="editTask(${index})">✏️</button>
                    <button class="task-action-btn" onclick="deleteTask(${index})">🗑️</button>
                </div>
            </div>
        `).join('')}
    `;

    document.getElementById('clear-btn').onclick = function() {
        tasks = [];
        renderTasks();
    };

    localStorage.setItem('tasks', JSON.stringify(tasks));

    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;

    totalCount.textContent = total;
    completedCount.textContent = completed;
    pendingCount.textContent = total - completed;

    updateProgress(total, completed);
}


// --add or update task--
taskForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const taskData = {
        name: document.getElementById('task-name').value,
        subject: document.getElementById('task-subject').value,
        priority: document.getElementById('task-priority').value,
        date: document.getElementById('task-date').value,
        completed: editIndex !== null ? tasks[editIndex].completed : false
    };

    if (editIndex !== null) {
        tasks[editIndex] = taskData;
        editIndex = null;
        addBtn.textContent = '+ Add Task';
    } else {
        tasks.push(taskData);
    }

    taskForm.reset();
    renderTasks();
});


// --task actions--
window.toggleTask = function(index) {
    tasks[index].completed = !tasks[index].completed;
    renderTasks();
};

window.editTask = function(index) {
    const task = tasks[index];
    document.getElementById('task-name').value = task.name;
    document.getElementById('task-subject').value = task.subject;
    document.getElementById('task-priority').value = task.priority;
    document.getElementById('task-date').value = task.date;

    editIndex = index;
    addBtn.textContent = '💾 Update Task';
};

window.deleteTask = function(index) {
    tasks.splice(index, 1);
    if (editIndex === index) {
        editIndex = null;
        taskForm.reset();
        addBtn.textContent = '+ Add Task';
    }
    renderTasks();
};

renderTasks();