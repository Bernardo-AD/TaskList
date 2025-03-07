const apiUrl = 'http://localhost:8080/api/tasks';

let tasks = [];
let currentSort = null;

// Carregar tarefas ja existentes
async function loadTasks() {
    const response = await fetch(apiUrl);
    tasks = await response.json();
    showTasks(tasks);
    updateProgress(tasks);

    if (criterion === 'alphabetical'){
        tasks.sort((a, b) => a.description.localeCompare(b.description)); // Ordem A-Z
    } else if (criterion === 'status') {
        tasks.sort((a, b) => a.completed - b.completed); // Pendentes primeiro
    }
    showTasks(tasks); // Atualiza a exibição

    // Botão de remover tarefa
    const btnRemoving = document.createElement('button');
    btnRemoving.textContent = 'Remove';
    btnRemoving.onclick = (e) =>{
        e.stopPropagation();
        removeTask(index);
    };
    li.appendChild(btnRemoving);
    list.appendChild(li);
    }

    // Atualiza barra de progresso
    updateProgress(tasks);

// Adicionar nova Tarefa
async function addTask(){
    const description = document.getElementById('description').value;
    if (!description.trim()) { // Verifica se a descrição está vazia
         alert("Please enter a valid task description."); // Mensagem para validação
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
        document.getElementById('description').value = ''; // Limpa o campo de Texto
        loadTasks();
        showMessage("Task added successfully", "success"); // Mensagem de Sucesso
    } else {
    console.error("Failed tp add task. Response status:", response.status);
    }
} catch (error){
        console.error("Error adding task:", error);
    }
}

// Remover tarefa pelo índice
async function removeTask(index) {
    await fetch(`${apiUrl}/${index}`, { method: 'DELETE'})
    loadTasks(); // Atualiza tarefas
    updateProgress(tasks);
}

// Concluir pelo índice
async function concludeTask(index) {
    await fetch(`${apiUrl}/${index}`, { method: 'PUT'})
    loadTasks(); // Atualiza tarefas
}
loadTasks(); // Inicializa carregamento de tarefas

let filteredTasks = []; // Variable to storage tasks

// Filtro de tarefas por estado (todas, pendentes, concluídas)
async function filterTasks(type) {
    const response = await fetch(apiUrl);
    const tasks = await response.json();

    if (type === 'pending') {
        filteredTasks = tasks.filter(task => !task.completed)
    } else if (type === 'completed') {
        filteredTasks = tasks.filter(task => task.completed)
    } else {
        filteredTasks = tasks // Mostra todas
    }

    showTasks(filteredTasks);
}

// Exibe tarefas filtradas
function showTasks(tasks) {
    const list = document.getElementById('list');
    list.innerHTML = ''; // Limpa a lista

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.textContent = task.description;

        if (task.completed) {
            li.classList.add('completed') // Adiciona estilo "completado"
        }
        li.onclick = () => concludeTask(index);

        const btnRemove= document.createElement('button');
        btnRemove.textContent = 'Remove';
        btnRemove.onclick = (e) => {
            e.stopPropagation();
            removeTask(index);
        };
        li.appendChild(btnRemove);
        list.appendChild(li); // Adiciona item a lista
    });
}

// Ordenação de tarefas por critério
function orderTasks(criterion) {
    currentSort = criterion; // Atualiza o criterio global

    if (criterion === 'alphabetical'){
        tasks.sort((a, b) => a.description.localeCompare(b.description)); // Ordem A-Z
    } else if (criterion === 'status') {
        tasks.sort((a, b) => a.completed - b.completed); // Pendentes primeiro
    }
    showTasks(tasks); // Atualiza a exibição
}

// Alternar modo escuro/claro
function toggleDarkMode(){
    document.body.classList.toggle('dark');
}

// Mostrar mensagens temporárias (ex: sucesso, erro)
function showMessage(text, type) {
    const message = document.getElementById('message'); // Elemento para mensagens
    message.textContent = text;
    message.style.display = 'block';
    message.style.backgroundColor = type === 'success' ? '#4CAF50' : '#f44336'; // Verde ou Vermelho
    setTimeout(() => {
        message.style.display = 'none'; // Oculta após 3 segundos
    }, 3000);
}

// Atualizar barra de progresso
function updateProgress(tasks){
    const completedTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    document.getElementById('progress-bar').style.width = `${progress}%`;
}

// Busca dinâmica de tarefas
function searchTask() {
    const query = document.getElementById('search').value.toLowerCase(); // Texto buscado
    const filteredTasks = tasks.filter(task =>
        task.description.toLowerCase().includes(query)); // Verifica descrição
    showTasks(filteredTasks)
}

// Enter para adicionar tarefa
document.getElementById('description').addEventListener('keydown', function (event){
    if (event.key === 'Enter'){
        addTask()
    }
});

