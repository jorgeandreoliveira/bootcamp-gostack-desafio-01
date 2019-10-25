const express = require('express');

const server = express();

server.use(express.json());

//Lista de projetos
let projects = [];

// Contagem de requisições feitas na aplicação
let totalRequisicoes = 0;

//Middleware global chamado em todas requisições que imprime (console.log)
//uma contagem de quantas requisições foram feitas na aplicação
server.use((req, res, next) => {
  console.log(`Total de requisições: ${++totalRequisicoes}`);
  return next();
});

//Middleware que será utilizado em todas rotas que recebem o ID do projeto 
//nos parâmetros da URL que verifica se o projeto com aquele ID existe. 
//Se não existir retorne um erro, caso contrário permita a requisição 
//continuar normalmente
function verificaProjetoExiste(req, res, next){
  const { id } = req.params;
  
  if (projects.findIndex(x => x.id === id) === -1)
    return res.status(400).json({erro:`Projeto ${id} não encontrado`});
  
  return next();
}

//Rota que lista todos projetos e suas tarefas
server.get('/projects', (req, res)=>{
    return res.json(projects);
})

//A rota deve receber id e title dentro corpo para cadastrar um novo projeto
server.post('/projects', (req, res)=>{

     const {id, title, tasks} = req.body;

    projects.push({id:id, title:title, tasks:tasks}) ;

    return res.json(projects);
})

//A rota deve alterar apenas o título do projeto com o id presente nos 
//parâmetros da rota
server.put('/projects/:id', verificaProjetoExiste, (req, res)=>{

  const { id } = req.params;
  const { title } = req.body;

  const index = projects.findIndex(x => x.id === id);
  projects[index].title = title;

  return res.json(projects);

})

//A rota deve deletar o projeto com o id presente nos parâmetros da rota
server.delete('/projects/:id', verificaProjetoExiste, (req, res)=>{

  const { id } = req.params;
  const index = projects.findIndex(x => x.id === id);
  projects.splice(index,1);

  return res.json(projects);

})

//A rota deve receber um campo title e armazenar uma nova tarefa no 
//array de tarefas de um projeto específico escolhido através do id 
//presente nos parâmetros da rota
server.post('/projects/:id/tasks', verificaProjetoExiste, (req, res)=>{

  const { id } = req.params;
  const { title } = req.body;

  const index = projects.findIndex(x => x.id === id);

  if (projects[index].tasks === undefined)
    projects[index].tasks = [title];
  else
    projects[index].tasks.push(title);

  return res.json(projects);
})

server.listen(3333);