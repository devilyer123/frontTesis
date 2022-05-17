import { Component, OnInit } from '@angular/core';
import { Client, Order, Product } from '../../../interfaces/interfaces';
import { DataService } from '../../../services/data.service';
import { OrderService } from '../../../services/order.service';
import { ActivatedRoute } from '@angular/router';
import { AlertController, Platform } from '@ionic/angular';

import pdfMake from "pdfmake/build/pdfMake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { HttpClient } from '@angular/common/http';
import { Filesystem, FilesystemDirectory } from '@capacitor/core';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { ClientService } from 'src/app/services/client.service';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-orders-client',
  templateUrl: './orders-client.page.html',
  styleUrls: ['./orders-client.page.scss'],
})
export class OrdersClientPage implements OnInit {
  
  order: Order[] = [];

  textoBuscar: string = '';

  prod: Product = {
    nomProd: '',
    cantDisp: 0,
    precio: 0
  }

  cli: Client = {
    nomPriCli: '',
    apePatCli: '',
    apeMatCli: ''
  }

  pdfObj: any;
  logoData = null;
  showlogo = true;

  constructor(private activatedRoute: ActivatedRoute,
    private dataService: DataService,
    private orderService: OrderService,
    private alertController: AlertController,
    private clientService: ClientService,
    private http: HttpClient,
    private plt: Platform,
    private fileOpener: FileOpener) { }

  ngOnInit() {
    this.searchClient();
    this.loadOrderByCliente();
    this.loadLocalAssetToBase64();
  }

  onSearchChange( event ) {
    this.textoBuscar = event.detail.value;
  }


  loadOrderByCliente() {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      if (paramMap.get('idcli')) {
        this.orderService.getOrdersByClient(parseInt(paramMap.get('idcli')))
        .subscribe(resp => {
          this.order.push(...resp.dataOrders);
          console.log(this.order);
        })
      }
    })
  }

  searchClient() {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      if (paramMap.get('idcli')) {
        this.clientService.getOneClient(parseInt(paramMap.get('idcli')))
        .subscribe(res => {
          this.cli = res;
          //console.log(this.cli);
        })
      }
    })
  }

  async delPed(id, proId, cantCan) {
    const alert = await this.alertController.create({
      header: 'Mensaje de Alerta',
      subHeader: 'Esta por eliminar este pedido',
      message: 'Desea eliminarlo?',
      buttons: [
        {
          text: 'Eliminar',
          handler: () => {
            console.log(id);
            this.upProduct(proId, cantCan);
            this.orderService.getDelete(id).subscribe(
              (res) => {
                this.loadOrderByCliente();
                console.log(res);
              },
              (err) => console.log(err)
            );
          }
        },'Cancelar']
    });

    await alert.present();
  }

  upProduct(proId, cantCan) {
    this.dataService.updateProduct(proId, {
      nomProd: this.prod.nomProd,
      cantDisp: this.sumaProduct(this.prod.cantDisp, cantCan),
      precio: this.prod.precio
    }).subscribe(res => {
      console.log(res);
    })
  }

  searchProduct(id, proId, cantCan) {
    this.dataService.getOneProduct(proId)
    .subscribe(res => {
      this.prod = res;
      console.log(this.prod);
      this.delPed(id, proId, cantCan);
    })
  }

  sumaProduct(dis, add){
    const suma =  parseInt(dis) + parseInt(add);
    return suma;
  }

  loadLocalAssetToBase64() {
    this.http.get('./assets/img/logo.jpg', { responseType: 'blob' })
    .subscribe(res => {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.logoData = reader.result;
      }
      reader.readAsDataURL(res);
    })
  }



  createPdf() {
    let logo = {};
    if (this.showlogo) {
      logo = { image: this.logoData, width: 75 };
    }
    var body2 = [];
    body2.push(['Nombre del Producto',
    'Cantidad Solicitada',
    'Monto Total del Pedido',
    'Fecha de Registro del Pedido'])
    for(let i=0; i< this.order.length; i++) {
      body2.push([this.order[i].nomPro, 
        this.order[i].cantSolic, 
        this.order[i].montoTotal, 
        this.order[i].createdAt]);
    }
    console.log(body2);
    const docDefinition = {
      watermark: { text: 'Importadora Rocha', color: 'blue', opacity: 0.2, bold: true/*, italics: false*/ },
      content: [
        {
          columns: [
            logo,
            {
              text: new Date().toTimeString(),
              alignment: 'right'
            }
          ]
        },
        { text: 'SEGUIMIENTO DE PEDIDOS', style: 'header', alignment: 'center' },
        { text: 'Lista de Seguimiento de Pedidos del Cliente', style: 'subheader', alignment: 'center' },
        'Listado actual de todos los Pedidos del cliente: '+ this.cli.nomPriCli+' '+this.cli.apePatCli+' '+this.cli.apeMatCli,
        {
          style: 'tableExample',
          table: {
            widths: ['auto', 'auto', 'auto', 'auto'],
            headerRows: 1,
            body: body2
          }
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5]
        },
        tableExample: {
          margin: [0, 5, 0, 15]
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'black'
        }
      }
    }
    this.pdfObj = pdfMake.createPdf(docDefinition);
    this.alertGenPDF();
    console.log(this.pdfObj);
  }

  downloadPdf() {
    if (this.plt.is('cordova')) {
      this.pdfObj.getBase64(async (data) => {
        try {
          let path = `pdf/myletter_${Date.now}.pdf`;
          const result = await Filesystem.writeFile({
            path,
            data,
            directory: FilesystemDirectory.Documents,
            recursive: true
          });
          this.fileOpener.open(`${result.uri}`, 'application/pdf');
        } catch (e) {
          console.error('Unable to write file', e);
        }
      });
    } else {
      this.pdfObj.download();
    }
  }

  async alertGenPDF() {
    const alert = await this.alertController.create({
      header: 'Se genero el reporte de manera satisfactoria',
      subHeader: 'Esta disponible para la descarga',
      buttons: ['Aceptar']
    });

    await alert.present();
  }

  generateInvoice() {
    let logo = {};
    if (this.showlogo) {
      logo = { image: this.logoData, width: 75 };
    }
    var body2 = [];
    body2.push(['Nombre del Producto',
    'Cantidad Solicitada',
    'Monto Total del Pedido',
    'Fecha de Registro del Pedido'])
    console.log(body2);
    const docDefinition = {
      watermark: { text: 'Importadora Rocha', color: 'blue', opacity: 0.2, bold: true/*, italics: false*/ },
      content: [
        {
          columns: [
            logo,
            {
              text: `${new Date().toTimeString()}\n`,
              alignment: 'right'
            }
          ]
        },
        { text: 'SEGUIMIENTO DE PEDIDOS', style: 'header', alignment: 'center' },
        { text: 'Lista de Seguimiento de Pedidos del Cliente', style: 'subheader', alignment: 'center' },
        'Listado actual de todos los Pedidos del cliente: '+ this.cli.nomPriCli+' '+this.cli.apePatCli+' '+this.cli.apeMatCli,
        {
          style: 'tableExample',
          table: {
            widths: ['auto', 'auto', 'auto', 'auto'],
            headerRows: 1,
            body: body2
          }
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5]
        },
        tableExample: {
          margin: [0, 5, 0, 15]
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'black'
        }
      }
    }
    this.pdfObj = pdfMake.createPdf(docDefinition);
    this.alertGenPDF();
    console.log(this.pdfObj);
  }

}
