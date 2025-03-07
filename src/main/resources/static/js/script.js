const apiUrl = 'http://localhost:8080/api/tasks';

async function loadTasks() {
    const response = await fetch(apiUrl);
    const tasks = await response.json();
    const list = document.getElementById('tasks');
    list.innerHTML = '';
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.textContent = task.description;
        if (task.completed) li.classList.add('completed');
        li.onclick = () => concludeTask(index);
        const btnRemoving = document.createElement('button');
        btnRemoving.textContent = 'Remove';
        btnRemoving.onclick = (e) =>{
            e.stopPropagation();
            removeTask(index);
        };
        li.appendChild(btnRemoving);
        list.appendChild(li);
    });
}

async function addTask(){
    const description = document.getElementById('description').value;
    if (!description.trim()) { // Verifica se a descrição está vazia
         alert("Please enter a valid task description.");
        return;
    }

    try {
        const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {'Content-Type': 'application/json' },
        body:JSON.stringify({description, completed: false})
    });
    if (response.ok) {
        console.log("Task added succesfully!")
        document.getElementById('description').value = '';
        loadTasks();
    } else {
    console.error("Failed tp add task. Response status:", response.status);
    }
} catch (error){
        console.error("Error adding task:", error);
    }
}

async function removeTask(index) {
    await fetch(`${apiUrl}/${index}`, { method: 'DELETE'})
    loadTasks();
}

async function concludeTask(index) {
    await fetch(`${apiUrl}/${index}`, { method: 'PUT'})
    loadTasks();
}
loadTasks();

let filteredTasks = []; // Variable to storage tasks

async function filterTasks(type) {
    const response = await fetch(apiUrl);
    const tasks = await response.json();

    if (type === 'pending') {
        filteredTasks = tasks.filter(task => !task.completed)
    } else if (type === 'completed') {
        filteredTasks = tasks.filter(task => task.completed)
    } else {
        filteredTasks = tasks // Show all
    }

    showTasks(filteredTasks);
}

function showTasks(tasks) {
    const list = document.getElementById('tasks');
    list.innerHTML = ''; // Clear a list before render
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.textContent = task.description;

        if (task.completed) {
            li.classList.add('completed')
        }
        li.onclick = () => concludeTask(index);

        const btnRemove= document.createElement('button');
        btnRemove.textContent = 'Remove';
        btnRemove.onclick = (e) => {
            e.stopPropagation();
            removeTask(index);
        };
        li.appendChild(btnRemove);
        list.appendChild(li); // Add item on list
    });
}

function orderTasks(criterion) {
    if (criterion === 'alphabetical'){
        filteredTasks.sort((a, b) => a.description.localeCompare(b.description)); // Order A-Z
    } else if (criterion === 'status') {
        filteredTasks.sort((a, b) => a.completed - b.completed); // Pending first
    }

    showTasks(filteredTasks); // Update display
}

function toggleDarkMode(){
    document.body.classList.toggle('dark');
}

document.getElementById('description').addEventListener('keydown', function (event){
    if (event.key === 'Enter'){
        addTask()
    }
});