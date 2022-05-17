import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UiServiceService {

  constructor(private alertController: AlertController) { }

  async alertaInformativa( message: string ) {
    const alert = await this.alertController.create({
      header: 'Mensaje de Alerta',
      /*subHeader: 'Subtitle',*/
      message,
      buttons: ['OK']
    });

    await alert.present();
  }

}
