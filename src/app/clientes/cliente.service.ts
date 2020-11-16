import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

import { Cliente } from './cliente.model';

import { Subject, Subscriber } from 'rxjs';
import { map } from 'rxjs/operators';
import { stringify } from '@angular/compiler/src/util';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private clientes: Cliente [] = [];
  private listaClientesAtualizada = new Subject<Cliente[]>();

  constructor(private httpClient: HttpClient) {

  }

  removerCliente (id: string): void{
    this.httpClient.delete(`http://localhost:3000/api/clientes/${id}`)
    .subscribe(() => {
      console.log ("Remoção feita com sucesso")
      this.clientes = this.clientes.filter((cli) =>{
        return cli.id !== id
      })
      this.listaClientesAtualizada.next([...this.clientes]);
    });
  }

  getClientes(): void {
    this.httpClient.get<{mensagem : string, clientes: any}>(
      'http://localhost:3000/api/clientes'
    )
    .pipe(map((dados) => {
      return dados.clientes.map(cli => {
        return {
          id: cli._id,
          nome: cli.nome,
          fone: cli.fone,
          email: cli.email
        }
      })
    }))
    .subscribe((clientes) => {
      this.clientes = clientes
      this.listaClientesAtualizada.next([...this.clientes])
    })
    //return [...this.clientes];
  }

  getCliente(idCliente: string){ // Metodo getCliente

   // return {...this.clientes.find((cli)=> cli.id === idCliente)}; // Faz a COMPARAÇÃO do ID que RECEBEU com o ID nosso do OBJ cliente
    return this.httpClient.get<{_id: string, nome: string, fone: string, email: string}>(`http://localhost:3000/api/clientes/${idCliente}`); // Retorna os dados do nosso ID do cliente especificado
  }

  atualizarClientes (id: string, nome: string, fone: string, email: string) { // Metodo PUT para ATUALIZAÇÕES

    const cliente: Cliente = {id, nome, fone, email}; // Valores iniciais do OBJ cliente criado
    this.httpClient.put(`http://localhost:3000/api/clientes/${id}`, cliente). // Passando o ENDEREÇO (URL) com determinado ID (${id}) e qual o NOVO OBJ que sera INSERIDO
    subscribe((res => {
      const copia = [...this.clientes]; // VETOR de OBJ de clientes / Pega o CONTEXTO de um DETERMINADO cliente
      const indice = copia.findIndex(cli => cli.id === cliente.id);
      copia[indice] = cliente;// Verifica a POSIÇÃO
      this.clientes = copia; // Retornando um JSON com os clientes TODOS ATUALIZADOS
      this.listaClientesAtualizada.next([...this.clientes]); //Atualiza o cliente em sua DETERMINADA POSIÇÃO
    })); // Apartir disto tudo ele atualiza a lista do clientes
  }

  adicionarCliente (nome: string, fone: string, email: string): void{
    const cliente: Cliente = {
      id: null,
      nome: nome,
      fone: fone,
      email: email
    };
    this.httpClient.post<{mensagem: string, id: string}>(
      'http://localhost:3000/api/clientes',
      cliente
    ).subscribe((dados) => {
      console.log(dados.mensagem)
      cliente.id = dados.id;
      this.clientes.push(cliente);
      this.listaClientesAtualizada.next([...this.clientes]);
    })
  }

  getListaDeClientesAtualizadaObservable() {
    return this.listaClientesAtualizada.asObservable();
  }



}

// Proximo Passo: Ir lá no "cliente-inserir.component.ts" e fazer a chamada do metodo atualizarClientes
// Proximo Passo: Ir para o "app.js" e implementar para os dados não sumirem
