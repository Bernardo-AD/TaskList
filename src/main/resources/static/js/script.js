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
    await fetch(apiUrl, {
        method: 'POST',
        headers: {'Content-Type': 'application/json' },
        body:JSON.stringify({description, completed: false})
    });
    document.getElementById('description').value = '';
    loadTasks();
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