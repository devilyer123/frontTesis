import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { rolUser, upUser, User } from 'src/app/interfaces/interfaces';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {

  users: User[] = [];

  textoBuscar: string = '';

  rol: rolUser = {
    username: '',
    rolUser: ''
  }

  us: upUser = {
    priNombre: '',
    secNombre: '',
    apPaterno: '',
    apMaterno: '',
    nrocelular: 0,
    rolUser: '',
    username: '',
    email: '',
    //password: ''
  }

  constructor(private navCtrl: NavController,
    private usuarioService: UsuarioService,
    private alertController: AlertController) { }

  ngOnInit() {
    this.searchRolUser();
    this.searchDataUser();
    this.loadUsers();
  }

  onSearchChange( event ) {
    this.textoBuscar = event.detail.value;
  }

  async searchRolUser() {
    const iduser = await this.usuarioService.obtenerUserByToken();
    this.usuarioService.getOneUser(iduser)
    .subscribe(res => {
      this.rol = res;
    })
  }

  async searchDataUser() {
    const iduser = await this.usuarioService.obtenerUserByToken();
    this.usuarioService.getOneUser(iduser)
    .subscribe(res => {
      this.us = res;
    })
  }

  compareRolUser() {
    if (this.rol.rolUser == 'Administrador')
    {
      return true;
    } else {
      if (this.rol.rolUser == 'Distribuidor/Vendedor')
      {
        return false;
      }
    }
  }

  compareUser(user: string) {
    if (user == this.rol.username) {
      return false;
    } else {
      return true;
    }
  }

  loadUsers(){
    this.usuarioService.getUsers()
    .subscribe(resp => {
      this.users.push(...resp.dataUsers);
      console.log(resp);
    })
  }

  regisUser(){
    this.navCtrl.navigateRoot('/users/register-user');
  }

  async delUser(id){
    const alert = await this.alertController.create({
      header: 'Mensaje de Alerta',
      subHeader: 'Esta por eliminar este usuario',
      message: 'Desea eliminarlo?',
      buttons: [
        {
          text: 'Eliminar',
          handler: () => {
            console.log(id);
            this.usuarioService.getDelete(id).subscribe(
              (res) => {
                this.loadUsers();
                console.log(res);
              },
              (err) => console.log(err)
            );
          }
        },'Cancelar']
    });

    await alert.present();
    
  }

}
