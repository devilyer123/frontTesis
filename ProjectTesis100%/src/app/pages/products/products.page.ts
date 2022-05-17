import { Component, Input, OnInit } from '@angular/core';
import { AlertController, MenuController, NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { MenuCompenente, Product, rolUser } from '../../interfaces/interfaces';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {

  activities: Observable<MenuCompenente[]>

  textoBuscar: string = '';

  products: Product[] = [];

  prod: Product = {
    nomProd: '',
    cantDisp: 0,
    precio: 0
  }

  rol: rolUser = {
    username: '',
    rolUser: ''
  }

  constructor(private router: Router,
    private dataService: DataService,
    public menuCtrl: MenuController,
    private navCtrl: NavController,
    private alertController: AlertController,
    private usuarioService: UsuarioService) { }

  ngOnInit() {
    this.searchRolUser();
    this.loadProducts();    
  }

  onSearchChange( event ) {
    this.textoBuscar = event.detail.value;
  }

  async searchRolUser() {
    const iduser = await this.usuarioService.obtenerUserByToken();
    this.usuarioService.getOneUser(iduser)
    .subscribe(res => {
      this.rol = res;
      console.log(this.rol.rolUser);
      //this.menuRolUser();
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

  menuRolUser() {
    if (this.rol.rolUser == 'Administrador')
    {
      //this.menuCtrl.enable(false, 'rolDist')
      return "rolAdmin";
      //return "rolDist";      
    } else {
      if (this.rol.rolUser == 'Distribuidor/Vendedor')
      {
        return "rolDist";
      }
    }
  }

  loadProducts() {
    this.dataService.getProducts()
    .subscribe( resp => {
      this.products.push(...resp.dataProds);
      console.log(this.products);
      console.log(resp);
    });
  }

  graphProd(){
    this.navCtrl.navigateRoot('/products/graphics-products')
  }

  regisProd(){
    this.navCtrl.navigateRoot('/products/register-product');
  }

  /*ionViewWillEnter() {
    this.activities = this.dataService.getMenuOpts();
    this.loadProducts();
  }*/

  recoverData(id) {
    this.dataService.getOneProduct(id)
    .subscribe(res => {
      this.prod = res;
    })
  }

  async controlDelete(id) {
    this.recoverData(id);
    if (this.prod.cantDisp > 0)
    {
      const alert = await this.alertController.create({
        header: 'Mensaje de Alerta',
        subHeader: 'No se puede eliminar un producto todavia disponible en stock',
        buttons: ['Aceptar']
      });
      await alert.present();
    } else {
      console.log(this.prod.cantDisp);
      console.log('Se puede eliminar el producto');
    }
    
  }

  async delProd(id, cantDisp){
    if (cantDisp == 0) {
      const alert = await this.alertController.create({
        header: 'Mensaje de Alerta',
        subHeader: 'Esta por eliminar este producto',
        message: 'Desea eliminarlo?',
        buttons: [
          {
            text: 'Eliminar',
            handler: () => {
              console.log(id);
              this.dataService.getDelete(id).subscribe(
                (res) => {
                  this.loadProducts();
                  console.log(res);
                },
                (err) => console.log(err)
              );
            }
          },'Cancelar']
      });
      await alert.present();
    } else {
      const alert = await this.alertController.create({
        header: 'Mensaje de Alerta',
        subHeader: 'No se puede eliminar un producto todavia disponible en stock',
        buttons: ['Aceptar']
      });
      await alert.present();
    }
  }

}
