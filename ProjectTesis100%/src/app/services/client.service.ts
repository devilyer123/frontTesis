import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Client, RespuestaClients } from '../interfaces/interfaces';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor( private http: HttpClient) { }

  getClientsByUser(id: number) {
    return this.http.get<RespuestaClients>(`${ URL }/clients/user/${ id }`);
  }

  getClientByUserForReport(id: number) {
    return this.http.get<Client>(`${ URL }/clients/user/report/${ id }`);
  }

  getClients() {
    return this.http.get<RespuestaClients>(`${ URL }/clients`);
  }

  registerClient(client: Client) {
    return this.http.post(`${ URL }/clients/create`, client);
  }

  getOneClient(id: number) {
    return this.http.get<Client>(`${ URL }/clients/${ id }`);
  }

  updateClient(id: number, cli: Client) {
    return this.http.put(`${ URL }/clients/${ id }`, cli);
  }

  getDelete(id: number) {
    return this.http.delete(`${ URL }/clients/${ id }`);
  }

}
