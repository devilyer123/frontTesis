import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { rolUser, upUser, User } from 'src/app/interfaces/interfaces';
import { UsuarioService } from 'src/app/services/usuario.service';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.page.html',
  styleUrls: ['./update-user.page.scss'],
})
export class UpdateUserPage implements OnInit {

  user: upUser = {
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

  rol: rolUser = {
    username: '',
    rolUser: ''
  }

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private usuarioService: UsuarioService,
    private navCtrl: NavController,
    private alertController: AlertController) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      if (paramMap.get('iduser')) {
        this.usuarioService.getOneUser(parseInt(paramMap.get('iduser')))
        .subscribe(res => {
          this.user = res;
          console.log(this.user);
          this.searchRolUser();
        });
      }
    })
  }

  async searchRolUser() {
    const iduser = await this.usuarioService.obtenerUserByToken();
    this.usuarioService.getOneUser(iduser)
    .subscribe(res => {
      this.rol = res;
    })
  }

  updUser(){
    this.usuarioService.updateUser(this.user.iduser, {
      priNombre: this.user.priNombre,
      secNombre: this.user.secNombre,
      apPaterno: this.user.apPaterno,
      apMaterno: this.user.apMaterno,
      nrocelular: this.user.nrocelular,
      rolUser: this.user.rolUser,
      username: this.user.username,
      email: this.user.email,
      //password: this.user.password
    }).subscribe( res => {
      this.navCtrl.navigateRoot('/users', { animated: true });
    });
  }

  async assignRol(){
    if (this.user.rolUser == 'Administrador' && this.user.username == this.rol.username) {
      const alert = await this.alertController.create({
        header: 'Mensaje de Alerta',
        subHeader: 'No se puede autoasignar de manera independiente del rol de Administrador, solicite el cambio a otro Administrador',
        buttons: ['Aceptar']
      });
      await alert.present();
    } else {
      const alert = await this.alertController.create({
        header: 'Seleccione el rol de usuario',
        buttons: [
          {
            text: 'Administrador',
            handler: () => {
              this.user.rolUser = "Administrador"
            }
          },
          {
            text: 'Gerente',
            handler: () => {
              this.user.rolUser = "Gerente"
            }
          },
          {
            text: 'Distribuidor/Vendedor',
            handler: () => {
              this.user.rolUser = "Distribuidor/Vendedor"
            }
          }
        ]
      })
      await alert.present();
    }
  }
}
