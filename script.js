const input = document.querySelector("#input-tarefa");
const inputData = document.querySelector("#data-tarefa");
const botaoAdicionar = document.querySelector("#btn-adicionar");
const lista = document.querySelector("#lista-tarefas");
const botoesFiltro = document.querySelectorAll(".filtro");

let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];

let filtroAtual = "todas";


// Adicionar tarefa
botaoAdicionar.addEventListener("click", adicionarTarefa);


// Adicionar usando Enter
input.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        adicionarTarefa();
    }

});


// Filtros
botoesFiltro.forEach(function(botao) {

    botao.addEventListener("click", function() {

        filtroAtual = botao.dataset.filtro;

        botoesFiltro.forEach(function(item) {
            item.classList.remove("ativo");
        });

        botao.classList.add("ativo");

        mostrarTarefas();

    });

});


function adicionarTarefa() {

    const texto = input.value.trim();

    const data = inputData.value;


    if (texto === "") {

        alert("Digite uma tarefa!");

        return;
    }


    const novaTarefa = {

        id: Date.now(),

        texto: texto,

        data: data,

        concluida: false

    };


    tarefas.push(novaTarefa);


    salvarTarefas();

    mostrarTarefas();


    input.value = "";

    inputData.value = "";

    input.focus();
}


function mostrarTarefas() {

    lista.innerHTML = "";


    const tarefasFiltradas = tarefas.filter(function(tarefa) {

        if (filtroAtual === "pendentes") {
            return !tarefa.concluida;
        }

        if (filtroAtual === "concluidas") {
            return tarefa.concluida;
        }

        return true;

    });


    if (tarefasFiltradas.length === 0) {

        const mensagem = document.createElement("li");

        mensagem.classList.add("vazio");

        mensagem.textContent = "Nenhuma tarefa encontrada.";

        lista.appendChild(mensagem);

        return;
    }


    tarefasFiltradas.forEach(function(tarefa) {

        const li = document.createElement("li");


        if (tarefa.concluida) {

            li.classList.add("concluida");

        }


        const conteudo = document.createElement("div");

        conteudo.classList.add("conteudo-tarefa");


        const texto = document.createElement("span");

        texto.classList.add("texto-tarefa");

        texto.textContent = tarefa.texto;


        conteudo.appendChild(texto);


        if (tarefa.data) {

            const data = document.createElement("span");

            data.classList.add("data-tarefa");

            data.textContent = formatarData(tarefa.data);

            conteudo.appendChild(data);

        }


        conteudo.addEventListener("click", function() {

            alternarConclusao(tarefa.id);

        });


        const acoes = document.createElement("div");

        acoes.classList.add("acoes");


        const botaoEditar = document.createElement("button");

        botaoEditar.textContent = "Editar";


        botaoEditar.addEventListener("click", function() {

            editarTarefa(tarefa.id);

        });


        const botaoExcluir = document.createElement("button");

        botaoExcluir.textContent = "Excluir";


        botaoExcluir.addEventListener("click", function() {

            excluirTarefa(tarefa.id);

        });


        acoes.appendChild(botaoEditar);

        acoes.appendChild(botaoExcluir);


        li.appendChild(conteudo);

        li.appendChild(acoes);


        lista.appendChild(li);

    });

}


function alternarConclusao(id) {

    const tarefa = tarefas.find(function(item) {

        return item.id === id;

    });


    if (tarefa) {

        tarefa.concluida = !tarefa.concluida;

        salvarTarefas();

        mostrarTarefas();

    }
}


function editarTarefa(id) {

    const tarefa = tarefas.find(function(item) {

        return item.id === id;

    });


    if (!tarefa) {
        return;
    }


    const novoTexto = prompt(
        "Edite sua tarefa:",
        tarefa.texto
    );


    if (novoTexto === null) {
        return;
    }


    if (novoTexto.trim() === "") {

        alert("A tarefa não pode ficar vazia.");

        return;
    }


    tarefa.texto = novoTexto.trim();


    salvarTarefas();

    mostrarTarefas();

}


function excluirTarefa(id) {

    const confirmar = confirm(
        "Tem certeza que deseja excluir esta tarefa?"
    );


    if (!confirmar) {
        return;
    }


    tarefas = tarefas.filter(function(tarefa) {

        return tarefa.id !== id;

    });


    salvarTarefas();

    mostrarTarefas();

}


function salvarTarefas() {

    localStorage.setItem(
        "tarefas",
        JSON.stringify(tarefas)
    );

}


function formatarData(data) {

    const objetoData = new Date(data);


    return objetoData.toLocaleString(
        "pt-BR",
        {
            dateStyle: "short",
            timeStyle: "short"
        }
    );

}


// Mostra as tarefas quando abrir a página
mostrarTarefas();