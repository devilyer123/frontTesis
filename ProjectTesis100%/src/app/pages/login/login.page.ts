import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuController, NavController } from '@ionic/angular';
import { UiServiceService } from 'src/app/services/ui-service.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginUser = {
    username: '',
    password: ''
  }

  constructor(private router: Router,
    private menuCtrl: MenuController,
    private usuarioService: UsuarioService,
    private navCtrl: NavController,
    private uiService: UiServiceService) { }

  ngOnInit() {
    this.menuCtrl.enable(false);
  }

  async login( fLogin: NgForm ){

    if (fLogin.invalid){return;}

    const valido = await this.usuarioService.login(this.loginUser.username, this.loginUser.password);

    if(valido) {
      // Ingresar al sistema
      this.navCtrl.navigateRoot('/products', { animated: true });
      this.menuCtrl.enable(true);
    } else {
      // Muestra de alerta de usuario y constraseña incorrectos
      this.uiService.alertaInformativa('Usuario y contraseña no son correctos.');
    }

  }

}
