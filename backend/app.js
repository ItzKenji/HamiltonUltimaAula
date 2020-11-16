const express = require ('express');
const app = express();
const bodyParser = require ('body-parser');
const mongoose = require ('mongoose');
const Cliente = require('./models/cliente');
mongoose.connect('mongodb+srv://usjt-ccp1an-bua:usjt-ccp1an-bua@cluster0.ssm0w.mongodb.net/usjt-clientes?retryWrites=true&w=majority')
.then(() =>  console.log ("Conexao OK")).catch(() => console.log ("Conexão NOK"));
app.use(express.json());

const clientes = [
  {
    id: '1',
    nome: 'Jose',
    fone: '11223344',
    email: 'jose@email.com'
  },
  {
    id: '2',
    nome: 'Maria',
    fone: '2119992233',
    email: 'maria@email.com'
  },
  {
    id: '3',
    nome: 'Afonso',
    fone: '11998877',
    email: 'afonso@email.com'
  }
];

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  next()
});



app.get('/api/clientes/:id', (req, res, next) => { // Passando o id dentro do endereço

  Cliente.findById(req.params.id).then(cli => {

    if (cli){ // Se der CERTO

      res.status(200).json(cli);

    } else { // Se NÃO der CERTO

      res.status(404).json({mensagem: "Cliente não encontrado"})

    }

  });

});

app.post('/api/clientes', (req, res, next) => {
  const cliente = new Cliente({
    nome: req.body.nome,
    fone: req.body.fone,
    email: req.body.email
  })
  cliente.save().then(clienteInserido => {
    console.log(clienteInserido);
    res.status(201).json({ mensagem: 'Cliente inserido', id: clienteInserido._id })
  });
});

app.delete ('/api/clientes/:id', (req, res, next) => {
  Cliente.deleteOne({_id: req.params.id}).then((resultado) => {
    console.log(resultado);
    res.status(200).json({mensagem: "Cliente removido"});
  })
})

app.put("/api/clientes/:id", (req, res, next) => { // Contexto do EndPoint

  const cliente = new Cliente({

    _id: req.params.id,
    nome: req.body.nome,
    fone: req.body.fone,
    email: req.body.email
  });

  Cliente.updateOne({_id:req.params.is}, cliente).then((resultado) => {

    console.log(resultado); // Mostrar o resultado no console

  });

  res.status(200).json({ mensagem: 'Atualização realizada com sucesso'}) // Passando um msg e um Codigo para o Postman

})

module.exports = app

// Proximo Passo: Ir ate o "cliente.service.ts" e modificar o metodo atualizarClientes
// Proximo Passo: Ir até o "cliente.service.ts" e implementar para ele retorna os dados do id do cliente especificado no Metodo getCliente
