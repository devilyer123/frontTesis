import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { Product, Client, Order, Distribution } from 'src/app/interfaces/interfaces';
import { ClientService } from 'src/app/services/client.service';
import { DataService } from 'src/app/services/data.service';
import { DistributionService } from 'src/app/services/distribution.service';
import { OrderService } from 'src/app/services/order.service';
import { UsuarioService } from '../../../services/usuario.service';

interface compInfProd {
  id: number,
  name: string,
  priceUnit: number
}

@Component({
  selector: 'app-crear-pedido',
  templateUrl: './crear-pedido.page.html',
  styleUrls: ['./crear-pedido.page.scss'],
})
export class CrearPedidoPage implements OnInit {

  /*infProd2: compInfProd[] = [
    {
      id: 1,
      name: 'BOLSA DE COLOSTOMIA PAQUETE 5 UDS',
      priceUnit: 85,
    },
    {
      id: 2,
      name: 'GUANTES DE LATEX TALLA L',
      priceUnit: 75,
    },
    {
      id: 3,
      name: 'CAJA PETRI DE PLASTICO MEDIANAS',
      priceUnit: 3,
    },
    {
      id: 4,
      name: 'GONIOMETRO',
      priceUnit: 50,
    },
    {
      id: 5,
      name: 'PAPEL PARA ELECTROCARDIOGRAMA 12 CANALES',
      priceUnit: 45,
    },
    {
      id: 6,
      name: 'TORNIQUETE  DE LIGA',
      priceUnit: 5,
    },
    {
      id: 7,
      name: 'VENDAS ELASTICAS 20 CM COLOR PIEL',
      priceUnit: 25,
    },
    {
      id: 8,
      name: 'GLUCOMETRO TRUEMETRIX EN ESTUCHE',
      priceUnit: 150,
    },
    {
      id: 9,
      name: 'BARBIJOS QUIRURGICOS PEDIATRICOS',
      priceUnit: 25,
    },
    {
      id: 10,
      name: 'OXIMETRO DE PULSO JUMPER -500D AMERICANO',
      priceUnit: 200,
    }
  ];*/

  cli: Client = {
    nomPriCli: '',
    apePatCli: '',
    apeMatCli: ''
  }

  prod: Product = {
    nomProd: '',
    cantDisp: 0,
    precio: 0
  }

  textoBuscar: string = '';

  regisOrder: Order = {
    cliId: 0,
    proId: 0,
    nomPro: '',
    cantSolic: 0,
    montoTotal: 0
  }

  regisDistribution: Distribution = {
    cliId: 0,
    nomPro: '',
    cantSolic: 0,
    montoTotal: 0,
    estadoPedido: ''
  }

  infProd: Product[] = [];

  constructor(private router: Router,
    private dataService: DataService,
    private clientService: ClientService,
    private navCtrl: NavController,
    private usuarioService: UsuarioService,
    private orderService: OrderService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController,
    private distributionService: DistributionService) { }

  ngOnInit() {
    this.searchClient();
    this.loadInfProd();
  }

  onSearchChange( event ) {
    this.textoBuscar = event.detail.value;
  }

  searchClient() {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      if (paramMap.get('idcli')) {
        this.clientService.getOneClient(parseInt(paramMap.get('idcli')))
        .subscribe(res => {
          this.cli = res;
          console.log(this.cli);
        })
      }
    })
  }

  async upClient() {
    if (this.cli.nomPriCli == '' || this.cli.apePatCli == '' || this.cli.apeMatCli == '') {
      const alert = await this.alertController.create({
        header: 'Mensaje de Alerta',
        subHeader: 'No se pueden dejar espacios en blancos para el registro',
        buttons: ['Aceptar']
      });
      await alert.present();
    } else {
      this.clientService.updateClient(this.cli.idcli, {
        nomPriCli: this.cli.nomPriCli,
        apePatCli: this.cli.apePatCli,
        apeMatCli: this.cli.apeMatCli
      }).subscribe( res => {
        this.navCtrl.navigateRoot('/action1', {animated: true});
      })
    }
  }

  async regOrder() {
    if (this.regisOrder.nomPro == '' || this.regisOrder.cantSolic == 0 || this.regisOrder.montoTotal == 0) {
      const alert = await this.alertController.create({
        header: 'Error de Registro',
        subHeader: 'No se realizo la confirmación del calculo del pedido',
        buttons: ['Aceptar']
      });
      await alert.present();
    } else {
      this.upProduct();
      this.orderService.registerOrder({
        cliId: this.cli.idcli,
        proId: this.regisOrder.proId,
        nomPro: this.regisOrder.nomPro,
        cantSolic: this.regisOrder.cantSolic,
        montoTotal: this.regisOrder.montoTotal
      }). subscribe(
        (res) => {
          this.regDistribution();
          this.navCtrl.navigateRoot('/action1', {animated:true});
          console.log(res)
        },
        (err) => console.log(err)
      )
      /*console.log(this.cli.idcli);
      console.log(this.regisOrder.proId);
      console.log(this.regisOrder.nomPro);
      console.log(this.regisOrder.cantSolic);
      console.log(this.regisOrder.montoTotal);*/
    }
  }

  upProduct() {
    this.dataService.updateProduct(this.prod.idpro, {
      nomProd: this.prod.nomProd,
      cantDisp: this.calculateNewStock(this.prod.cantDisp, this.regisOrder.cantSolic),
      precio: this.prod.precio
    }). subscribe(res => {
      console.log(res);
    })
  }

  regDistribution() {
    this.distributionService.registerDistribution({
      cliId: this.cli.idcli,
      nomPro: this.regisOrder.nomPro,
      cantSolic: this.regisOrder.cantSolic,
      montoTotal: this.regisOrder.montoTotal,
      estadoPedido: 'Pendiente'
    }). subscribe(
      (res) => {
        console.log(res)
      },
      (err) => console.log(err)
    )
  }

  async calculateOrder(id, nameProd, price) {
    if (this.regisOrder.cantSolic <= 0) {
      const alert = await this.alertController.create({
        header: 'Error de Calculo',
        subHeader: 'La cantidad pedida del producto debe ser mayor a 0',
        buttons: ['Aceptar']
      });
      await alert.present();
    } else {
      if (this.regisOrder.cantSolic > this.prod.cantDisp) {
        const alert = await this.alertController.create({
          header: 'Error de Calculo',
          subHeader: 'La cantidad solicitada excede a la cantidad disponible del producto en Stock',
          buttons: ['Aceptar']
        });
        await alert.present();
      } else {
        const alert = await this.alertController.create({
          header: 'Esta por registrar este Pedido',
          inputs: [
            {
              placeholder: nameProd
            },
            {
              placeholder: 'Cantidad: ' + this.regisOrder.cantSolic
            },
            {
              placeholder: 'Monto total: ' + this.calcularMonto(price, this.regisOrder.cantSolic) + ' Bs.'
            }
          ],
          buttons:[
            {
              text: 'Confirmar',
              handler: () => {
                this.regisOrder.proId = id;
                this.regisOrder.nomPro = nameProd;
                this.regisOrder.montoTotal = this.calcularMonto(price, this.regisOrder.cantSolic);
              }
            }, 'Cancelar' ]
        });
        await alert.present();
      }      
    }
  }

  searchProduct(id, nameProd, price) {
    this.dataService.getOneProduct(id)
    .subscribe(res => {
      this.prod = res;
      console.log(this.prod);
      this.calculateOrder(id, nameProd, price);
    })
  }

  calcularMonto(dis, add){
    const total =  parseInt(dis) * parseInt(add);
    return total;
  }

  calculateNewStock(act, sol) {
    const newTotal = parseInt(act) - parseInt(sol);
    return newTotal; 
  }

  loadInfProd() {
    this.dataService.getProducts()
    .subscribe( resp => {
      this.infProd.push(...resp.dataProds);
      console.log(this.infProd);
    });
  }

}
