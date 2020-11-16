//import { Component, EventEmitter, Output } from '@angular/core';
import { Component, OnInit} from '@angular/core';
import { NgForm } from '@angular/forms';
//import { Cliente } from '../cliente.model';
import { ClienteService } from '../cliente.service';
import { ActivatedRoute, ParamMap } from '@angular/router'; // Importe que faz a VERIFICAÇÃO das ROTAS
import { Cliente } from '../cliente.model'; // Importe do modelo de cliente

@Component({
  selector: 'app-cliente-inserir',
  templateUrl: './cliente-inserir.component.html',
  styleUrls: ['./cliente-inserir.component.css'],
})
export class ClienteInserirComponent implements OnInit {

  private modo: string = "criar"; // Criado um VARIAVEL de INSTANCIA para caso RECEBA ela ira trabalhar o criar.

  private idCliente: string; //Armazenando o ID em uma VARIAVEL da CLASSE

  public cliente: Cliente; // Fazemos isso para que possamos ARMAZENAR o OBJ cliente que recebe -> dentro para a VARIAVEL cliente

  ngOnInit(){ // Metodo do ngOnInit que sera USADO para FAZER SOBREPOSIÇÃO

    this.route.paramMap.subscribe((ParamMap: ParamMap)=>{ // Fazendo um MAPA DE PARAMETROS

      if(ParamMap.has("idCliente")){ // Fazendo a VERIFICAÇÃO para ver se o PARAMETRO é IGUAL ao idCliente desejado
        this.modo = "editar"; // Se o "ParamMap" RECEBER CERTINHO o "idCliente" ele EXECUTA o EDITAR
        this.idCliente = ParamMap.get("idCliente"); // Passando o CONTEXTO do idCliente
        this.clienteService.getCliente(this.idCliente).subscribe(dadosCli => {

          this.cliente = { id: dadosCli._id, nome: dadosCli.nome, fone: dadosCli.fone, email: dadosCli.email } // Carrega os dados de cliente para o navegador

        }); // Pega o ID ATRIBUIDO e ENVIA para o METODO getCliente / Onde se for verdadeira ele pega o OBJ envia pelo METODO getCliente e INSERE dentro de um OUTRO OBJ (cliente desta classe)
      }
      else {
        this.modo = "criar"; // Caso NÃO tenha RECEBIDO o idCliente correspondente ele ira EXECUTAR o CRIAR
        this.idCliente = "null"; // Caso não tenho um ID, ele n tera nada no id
      }

    });

  }

  constructor (public clienteService: ClienteService, public route: ActivatedRoute){ // Passando para o PARAMETROS do CONSTRUTOR o CONTEXTO da ROTA do que ira fazer (Se vai atualizar ou se vai incluir).

  }


  //@Output() clienteAdicionado = new EventEmitter<Cliente>();
  //nome: string;
  //fone: string;
  //email: string;
  onAdicionarCliente(form: NgForm) {
    if (form.invalid) {return;}

    if(this.modo === "criar"){ // Se o MODO for como "criar" ele APRESENTA os DADOS para CRIAÇÃO
    this.clienteService.adicionarCliente(
      form.value.nome,
      form.value.fone,
      form.value.email
    )}
    else{
      this.clienteService.atualizarClientes( // Se Não ele entra com os DADOS para ATUALIZAÇÃO
        this.idCliente,
        form.value.nome,
        form.value.fone,
        form.value.email
      )};

    form.resetForm();
    // const cliente: Cliente = {
    //   nome: form.value.nome,
    //   fone: form.value.fone,
    //   email: form.value.email,
    // };
    // this.clienteAdicionado.emit(cliente);
  }
}

//Proximo Passo: Ir no "cliente.service.ts" e adicionar o metodo getCliente para receber o ID
//Proximo Passo: Ir no "cliente-lista.component.html" e ajudar o botão de atualização de cliente / Onde ele sera um link para o roteador
//Proximo Passo: Ir até o "app.ts" e fazer a criação do EndPoint, la em: backend -> models -> app.js
