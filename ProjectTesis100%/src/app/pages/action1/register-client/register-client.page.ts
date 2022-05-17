import { Component, OnInit } from '@angular/core';
import { Client } from 'src/app/interfaces/interfaces';
import { ClientService } from 'src/app/services/client.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-register-client',
  templateUrl: './register-client.page.html',
  styleUrls: ['./register-client.page.scss'],
})
export class RegisterClientPage implements OnInit {

  regisClient: Client = {
    nomPriCli: '',
    apePatCli: '',
    apeMatCli: '',
    userId: 0
  }

  constructor(private usuarioService: UsuarioService,
    private clientService: ClientService,
    private navCtrl: NavController,
    private alertController: AlertController) { }

  ngOnInit() {
  }

  async regCli() {
    if (this.regisClient.nomPriCli == '' || this.regisClient.apePatCli == '' || this.regisClient.apeMatCli == '') {
      const alert = await this.alertController.create({
        header: 'Mensaje de Alerta',
        subHeader: 'No se pueden dejar espacios en blancos para el registro',
        buttons: ['Aceptar']
      });
      await alert.present();
    } else {
      const iduser = await this.usuarioService.obtenerUserByToken();
      this.clientService.registerClient({
        nomPriCli: this.regisClient.nomPriCli,
        apePatCli: this.regisClient.apePatCli,
        apeMatCli: this.regisClient.apeMatCli,
        userId: iduser
      })
      .subscribe(
        (res) => {
          this.navCtrl.navigateRoot('/action1', { animated: true });
          console.log(res)
        },
        (err) => console.log(err)
      )
    }
  }

}
