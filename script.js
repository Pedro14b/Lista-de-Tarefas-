/* ==============================================
   SELEÇÃO DE ELEMENTOS DO DOM
   ============================================== */

/*
   O que: Captura os elementos HTML para usar no JavaScript
   Como: document.getElementById() seleciona elementos por ID
   Por que: Precisamos manipular esses elementos (adicionar eventos, mudar conteúdo, etc)
*/

// Campo de texto onde o usuário digita a nova tarefa
const taskInput = document.getElementById('taskInput');

// Botão "Adicionar" que cria novas tarefas
const addBtn = document.getElementById('addBtn');

// Lista <ul> onde as tarefas serão inseridas
const taskList = document.getElementById('taskList');

// Span que mostra "X tarefas"
const taskCount = document.getElementById('taskCount');

// Botão "Limpar concluídas"
const clearCompleted = document.getElementById('clearCompleted');

// Todos os botões de filtro (retorna uma NodeList com 3 elementos)
const filterBtns = document.querySelectorAll('.filter-btn');

/* ==============================================
   ESTADO DA APLICAÇÃO
   ============================================== */

/*
   O que: Variáveis que armazenam o estado atual da aplicação
   Como: Array de objetos para tarefas, string para filtro atual
   Por que: Centraliza os dados da aplicação em um único lugar
*/

// Array que armazena todas as tarefas
// JSON.parse converte string JSON em objeto JavaScript
// localStorage.getItem('tasks') busca tarefas salvas
// || [] = se não existir nada salvo, cria array vazio
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Filtro atual: 'all' (todas), 'active' (ativas) ou 'completed' (concluídas)
let currentFilter = 'all';

/* ==============================================
   INICIALIZAÇÃO
   ============================================== */

/*
   O que: Código executado quando a página carrega
   Como: Chamada de funções sem eventos
   Por que: Exibe tarefas salvas e atualiza o contador inicial
*/

renderTasks();      // Renderiza tarefas existentes no localStorage
updateTaskCount();  // Atualiza o contador "X tarefas"

/* ==============================================
   EVENT LISTENERS (ESCUTADORES DE EVENTOS)
   ============================================== */

/*
   O que: Adiciona "escutadores" que ficam esperando ações do usuário
   Como: elemento.addEventListener('evento', função)
   Por que: Torna a aplicação interativa, reagindo a cliques e teclas
*/

// Quando clicar no botão "Adicionar", executa a função addTask
addBtn.addEventListener('click', addTask);

// Quando pressionar uma tecla no campo de texto
taskInput.addEventListener('keypress', (e) => {
    /*
       O que: Arrow function (função seta) que recebe o evento 'e'
       Como: (e) => { código } é equivalente a function(e) { código }
       Por que: Sintaxe moderna e mais concisa do JavaScript
    */
    
    // Se a tecla pressionada for Enter
    if (e.key === 'Enter') {
        addTask();  // Adiciona a tarefa (mesmo efeito do botão)
    }
});

// Quando clicar no botão "Limpar concluídas"
clearCompleted.addEventListener('click', () => {
    /*
       O que: Filtra o array removendo tarefas concluídas
       Como: filter() cria novo array apenas com elementos que passam no teste
       Por que: Remove todas as tarefas onde completed === true
    */
    
    // Mantém apenas tarefas onde completed é false (não concluídas)
    tasks = tasks.filter(task => !task.completed);
    
    saveTasks();         // Salva no localStorage
    renderTasks();       // Re-renderiza a lista
    updateTaskCount();   // Atualiza contador
});

// Para cada botão de filtro
filterBtns.forEach(btn => {
    /*
       O que: forEach percorre cada elemento do array
       Como: forEach(função) executa a função para cada item
       Por que: Adiciona evento de clique em todos os 3 botões
    */
    
    btn.addEventListener('click', () => {
        // Remove a classe 'active' de todos os botões
        filterBtns.forEach(b => b.classList.remove('active'));
        
        // Adiciona classe 'active' apenas no botão clicado
        btn.classList.add('active');
        
        // Atualiza o filtro atual com o valor do atributo data-filter
        currentFilter = btn.dataset.filter;
        
        // Re-renderiza a lista com o novo filtro
        renderTasks();
    });
});

/* ==============================================
   FUNÇÕES PRINCIPAIS
   ============================================== */

/* -------------------- ADICIONAR TAREFA -------------------- */
function addTask() {
    /*
       O que: Adiciona uma nova tarefa à lista
       Como: Captura o texto, cria objeto, adiciona ao array, salva e renderiza
       Por que: Função principal para criar tarefas
    */
    
    // .value pega o texto digitado no input
    // .trim() remove espaços em branco no início e fim
    const taskText = taskInput.value.trim();
    
    // Validação: se o campo estiver vazio
    if (taskText === '') {
        alert('Por favor, digite uma tarefa!');
        return;  // Interrompe a execução da função
    }

    // Cria objeto representando a nova tarefa
    const task = {
        id: Date.now(),        
        /*
           O que: Identificador único da tarefa
           Como: Date.now() retorna timestamp (milissegundos desde 1970)
           Por que: Cada tarefa precisa de um ID único
        */
        
        text: taskText,        // Texto da tarefa
        completed: false       // Inicia como não concluída
    };

    // Adiciona a nova tarefa ao final do array
    tasks.push(task);
    
    // Salva o array atualizado no localStorage
    saveTasks();
    
    // Re-renderiza a lista na tela
    renderTasks();
    
    // Atualiza o contador
    updateTaskCount();
    
    // Limpa o campo de texto
    taskInput.value = '';
    
    // Retorna o foco para o input (cursor volta pro campo)
    taskInput.focus();
}

/* -------------------- DELETAR TAREFA -------------------- */
function deleteTask(id) {
    /*
       O que: Remove uma tarefa específica
       Como: Filtra o array removendo a tarefa com o ID correspondente
       Por que: Permite ao usuário apagar tarefas
    */
    
    /*
       filter() cria um novo array
       Mantém apenas tarefas cujo ID é DIFERENTE do ID recebido
       Exemplo: se id = 123, remove a tarefa com id 123
    */
    tasks = tasks.filter(task => task.id !== id);
    
    saveTasks();         // Salva alteração
    renderTasks();       // Re-renderiza
    updateTaskCount();   // Atualiza contador
}

/* -------------------- MARCAR/DESMARCAR TAREFA -------------------- */
function toggleTask(id) {
    /*
       O que: Alterna o estado de conclusão de uma tarefa
       Como: Encontra a tarefa pelo ID e inverte o valor de completed
       Por que: Permite marcar/desmarcar tarefas como concluídas
    */
    
    // find() busca e retorna o primeiro elemento que satisfaz a condição
    const task = tasks.find(task => task.id === id);
    
    // Se a tarefa foi encontrada
    if (task) {
        // ! inverte o valor booleano (true vira false, false vira true)
        task.completed = !task.completed;
        
        saveTasks();
        renderTasks();
        updateTaskCount();
    }
}

/* -------------------- RENDERIZAR TAREFAS -------------------- */
function renderTasks() {
    /*
       O que: Exibe as tarefas na tela
       Como: Limpa a lista, filtra tarefas e cria elementos HTML dinamicamente
       Por que: Atualiza a interface sempre que há mudanças
    */
    
    // Limpa todo o conteúdo da lista
    taskList.innerHTML = '';

    // Obtém apenas as tarefas que correspondem ao filtro atual
    const filteredTasks = getFilteredTasks();

    // Se não houver tarefas para exibir
    if (filteredTasks.length === 0) {
        // Exibe mensagem informativa
        taskList.innerHTML = '<div class="empty-state">Nenhuma tarefa encontrada</div>';
        return;  // Encerra a função
    }

    // Para cada tarefa no array filtrado
    filteredTasks.forEach(task => {
        /*
           O que: Cria um elemento <li> para cada tarefa
           Como: createElement cria elementos e textContent previne XSS
           Por que: Constrói a estrutura HTML dinamicamente de forma segura
        */
        
        // Cria elemento <li>
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        // Cria checkbox de forma segura
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';
        checkbox.checked = task.completed;
        /*
           O que: Adiciona evento de mudança ao checkbox
           Como: addEventListener é mais seguro que onchange inline
           Por que: Evita injeção de código e mantém JavaScript separado do HTML
        */
        checkbox.addEventListener('change', () => toggleTask(task.id));
        
        // Cria span com o texto da tarefa de forma segura
        const span = document.createElement('span');
        span.className = 'task-text';
        /*
           O que: textContent ao invés de innerHTML
           Como: textContent trata tudo como texto puro
           Por que: SEGURANÇA - Previne XSS (Cross-Site Scripting)
           Se usar innerHTML, um usuário poderia inserir código malicioso
        */
        span.textContent = task.text;
        
        // Cria botão de deletar de forma segura
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Deletar';
        /*
           O que: Adiciona evento de clique ao botão
           Como: addEventListener ao invés de onclick inline
           Por que: Mais seguro e mantém código organizado
        */
        deleteBtn.addEventListener('click', () => deleteTask(task.id));
        
        // Adiciona todos os elementos ao <li>
        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteBtn);
        
        // Adiciona o <li> à lista <ul>
        taskList.appendChild(li);
    });
}

/* -------------------- OBTER TAREFAS FILTRADAS -------------------- */
function getFilteredTasks() {
    /*
       O que: Retorna array de tarefas baseado no filtro atual
       Como: Usa filter() para selecionar tarefas específicas
       Por que: Permite mostrar apenas tarefas ativas, concluídas ou todas
    */
    
    if (currentFilter === 'active') {
        // Retorna apenas tarefas não concluídas
        return tasks.filter(task => !task.completed);
        
    } else if (currentFilter === 'completed') {
        // Retorna apenas tarefas concluídas
        return tasks.filter(task => task.completed);
    }
    
    // Se filtro for 'all' ou qualquer outro valor, retorna todas
    return tasks;
}

/* -------------------- ATUALIZAR CONTADOR -------------------- */
function updateTaskCount() {
    /*
       O que: Atualiza o texto do contador de tarefas
       Como: Filtra tarefas ativas e atualiza textContent
       Por que: Mostra quantas tarefas ainda precisam ser feitas
    */
    
    // Conta quantas tarefas NÃO estão concluídas
    const activeTasks = tasks.filter(task => !task.completed).length;
    
    // Atualiza o texto do span
    // Usa singular "tarefa" ou plural "tarefas" conforme a quantidade
    taskCount.textContent = `${activeTasks} ${activeTasks === 1 ? 'tarefa' : 'tarefas'}`;
}

/* -------------------- SALVAR NO LOCALSTORAGE -------------------- */
function saveTasks() {
    /*
       O que: Salva o array de tarefas no navegador
       Como: JSON.stringify converte objeto em string e localStorage.setItem salva
       Por que: Mantém as tarefas mesmo após fechar a página
    */
    
    /*
       localStorage é um armazenamento do navegador que persiste dados
       setItem(chave, valor) salva um par chave-valor
       JSON.stringify() converte o array JavaScript em string JSON
       
       Exemplo: [{id: 1, text: "Estudar", completed: false}]
       Vira: '[{"id":1,"text":"Estudar","completed":false}]'
    */
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
