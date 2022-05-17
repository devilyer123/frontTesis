import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { environment } from 'src/environments/environment';
import { RespuestaUsers, upUser, User } from '../interfaces/interfaces';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  token: string = null;
  //dataUsuario = {};

  constructor( private http: HttpClient,
    private storage: Storage) { }

  getUsers() {
    return this.http.get<RespuestaUsers>(`${ URL }/users`);
  }

  getOneUser(id: number){
    return this.http.get<upUser>(`${ URL }/users/${ id }`);
  }

  getDelete(id: number){
    return this.http.delete(`${ URL }/users/${ id }`);
  }

  updateUser(id: number, user: upUser) {
    return this.http.put(`${ URL }/users/${ id }`, user);
  }

  login( username: string, password: string){
    const data = { username, password };

    return new Promise( resolve => {
      this.http.post(`${ URL }/users/login`, data)
      .subscribe( resp => {
        console.log(resp);
        if( resp['ok'] ){
          this.guardarToken( resp['token'] );
          resolve(true);
        } else {
          this.token = null;
          this.storage.clear();
          resolve(false);
        }
      })
    });
    
  }

  registro(user: User){

    return new Promise( resolve => {

      this.http.post(`${ URL }/user/create`, user)
      .subscribe( resp =>{
        console.log(resp);

        if( resp['ok'] ){
          this.guardarToken( resp['token'] );
          resolve(true);
        } else {
          this.token = null;
          this.storage.clear();
          resolve(false);
        }

      })

    })

  }

  async guardarToken( token: string ){
    this.token = token;
    this.storage.set('token', token);
  }

  /*validarToken() {

    return new Promise( resolve => {

      const headers = new HttpHeaders({
        'x-token': this.token
      });

      this.http.get(`${ URL }/profile`, { headers });
      /*.subscribe(resp => {
        if( resp['ok'] ) {
          this.usuario = resp['user'];
          console.log(this.usuario);
        } else {
          console.log('Token no Encontrado');
        }
      });

    })

  }*/

  /*async cargarToken() {
    this.token = await this.storage.get('token') || null; 
  }*/

  async obtenerUserByToken() : Promise<number> {

    this.token = await this.storage.get('token') || null;

    return new Promise(resolve => {

      const headers = new HttpHeaders({
        'x-token': this.token
      });
      this.http.get<User>(`${ URL }/profile`, { headers })
      .subscribe(resp => {
        resp;
        resolve(resp.iduser);
      });
    })

    
  }


}
