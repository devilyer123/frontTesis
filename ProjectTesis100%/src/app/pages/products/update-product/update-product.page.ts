import { Component, OnInit } from '@angular/core';
import { addCantPro, Product } from 'src/app/interfaces/interfaces';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../../services/data.service';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.page.html',
  styleUrls: ['./update-product.page.scss'],
})
export class UpdateProductPage implements OnInit {

  prod: Product = {
    nomProd: '',
    cantDisp: 0,
    precio: 0
  }

  upStockProduct: addCantPro = {
    cantAdd: 0
  }

  constructor(private activatedRoute: ActivatedRoute,
    private dataService: DataService,
    private navCtrl: NavController,
    private alertController: AlertController) { }

  ngOnInit() {
    this.searchProduct();
  }

  searchProduct() {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      if (paramMap.get('idpro')) {
        this.dataService.getOneProduct(parseInt(paramMap.get('idpro')))
        .subscribe(res => {
          this.prod = res;
          console.log(this.prod);
        })
      }
    })
  }

  async upProduct() {
    if (this.upStockProduct.cantAdd < 0 || this.prod.precio <= 0) {
      const alert = await this.alertController.create({
        header: 'Mensaje de Alerta',
        subHeader: 'Solo se aceptan valores numericos mayores 0 para la actualización del producto',
        buttons: ['Aceptar']
      });
      await alert.present();
    } else {
      this.prod.cantDisp = this.sumaProduct(this.prod.cantDisp, this.upStockProduct.cantAdd);
      this.dataService.updateProduct(this.prod.idpro, {
        nomProd: this.prod.nomProd,
        cantDisp: this.prod.cantDisp,
        precio: this.prod.precio
      }).subscribe( res => {
        this.navCtrl.navigateRoot('/products', {animated: true});
      })
    }
  }

  sumaProduct(dis, add){
    const suma =  parseInt(dis) + parseInt(add);
    return suma;
  }

}
