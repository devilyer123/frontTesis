import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/interfaces/interfaces';
import { DataService } from 'src/app/services/data.service';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-register-product',
  templateUrl: './register-product.page.html',
  styleUrls: ['./register-product.page.scss'],
})
export class RegisterProductPage implements OnInit {

  regisProduct: Product = {
    nomProd: '',
    cantDisp: 0,
    precio: 0
  }

  constructor(private dataService: DataService,
    private navCtrl: NavController,
    private alertController: AlertController) { }

  ngOnInit() {
  }

  async regProduct() {
    if (this.regisProduct.nomProd == '')
    {
      const alert = await this.alertController.create({
        header: 'Mensaje de Alerta',
        subHeader: 'No se pueden dejar espacios en blancos para el registro',
        buttons: ['Aceptar']
      });
      await alert.present();
    } else {
      if (this.regisProduct.cantDisp <= 0 || this.regisProduct.precio <= 0) {
        const alert = await this.alertController.create({
          header: 'Mensaje de Alerta',
          subHeader: 'Solo se aceptan valores numericos mayores 0 para el registro',
          buttons: ['Aceptar']
        });
        await alert.present();
      } else {
        this.dataService.registerProduct(this.regisProduct)
        .subscribe(
          (res) => {
            this.navCtrl.navigateRoot('/products', { animated: true });
            console.log(res)
          },
          (err) => console.log(err)
        )
      }
    }
  }

}
