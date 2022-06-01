import { Component, OnInit } from '@angular/core';
import { Client, Order, Product, rolUser } from '../../../interfaces/interfaces';
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

import * as moment from 'moment';
import { UsuarioService } from 'src/app/services/usuario.service';

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

  rol: rolUser = {
    username: '',
    rolUser: ''
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
    private fileOpener: FileOpener,
    private usuarioService: UsuarioService) { }

  ngOnInit() {
    this.searchDataUser();
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
              text: moment(new Date()).format('DD MMMM YYYY, h:mm:ss A [(Hora de Bolivia)]'),
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

  generateInvoice(idped, createdAt, cliId, nomPro, cantSolic, montoTotal) {
    let logo = {};
    if (this.showlogo) {
      logo = { image: this.logoData, width: 75 };
    }
    const docDefinition = {
      //watermark: { text: 'Importadora Rocha', color: 'blue', opacity: 0.2, bold: true/*, italics: false*/ },
      content: [
        {
          columns: [
            logo,
            {
              text: ['\n','FACTURA\n','IMPORTADORA ROCHA'],
              style: 'header',
              alignment: 'left'
            },
            {
              text: ['\n',`${moment(new Date()).format('DD MMMM YYYY, h:mm:ss A')}\n`,'(Hora de Bolivia)'],
              alignment: 'right'
            }
          ]
        },
        
        {
          columns: [
            {
              text: ['Calle Colombia Nº 848\n','Cercado, Cochabamba\n','Teléfono: 75987638 - 4542109'], 
              style: 'subheader',
              alignment: 'left'
            },
            {
              text: ['\n'],
              width: 128,
              style: 'tableExample',
              alignment: 'right',
              table: {
                widths: ['auto'],
                headerRows: 1,
                body: [
                  [{text: 'FACTURAR A:', style: 'tableHeader', colsSpan: 1, alignment: 'left'}],
                  [this.cli.nomPriCli+' '+this.cli.apePatCli+' '+this.cli.apeMatCli]
                ]
              }
            }
          ]
        },
        {
          style: 'tableExample',
          table: {
            widths: ['*','*','*'],
            headerRows: 1,
            body: [
              [{text: 'FACTURA #', style: 'tableHeader', colsSpan: 1, alignment: 'left'},
              {text: 'FECHA DE REGISTRO', style: 'tableHeader', colsSpan: 1, alignment: 'left'},
              {text: 'IDENTIFICACIÓN DEL CLIENTE', style: 'tableHeader', colsSpan: 1, alignment: 'left'}],
              [idped, moment(createdAt).format('DD/MM/YYYY, h:mm:ss A'), cliId]
            ]
          }
        },
        {
          style: 'tableExample',
          table: {
            widths: [225,'*','*','*'],
            headerRows: 1,
            body: [
              [{text: 'NOMBRE DEL PRODUCTO', style: 'tableHeader', colsSpan: 1, alignment: 'left'},
              {text: 'CANTIDAD', style: 'tableHeader', colsSpan: 1, alignment: 'left'},
              {text: 'PRECIO UNITARIO', style: 'tableHeader', colsSpan: 1, alignment: 'left'},
              {text: 'MONTO TOTAL', style: 'tableHeader', colsSpan: 1, alignment: 'left'}],
              [nomPro, cantSolic, this.transform(this.priceUnitary(montoTotal, cantSolic))+' Bs',this.transform(montoTotal)+' Bs']
            ]
          }
        },
        {
          text: ['\n','\n','_______________________\n',`${this.rol.username}\n`,],
          style: 'subheader',
			    alignment: 'center'
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        subheader: {
          fontSize: 14,
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
    this.downloadPdf();
  }

  priceUnitary(total, unitario){
    const price = parseInt(total)/parseInt(unitario);
    return price;
  }

  async searchDataUser(){
    const iduser = await this.usuarioService.obtenerUserByToken();
    this.usuarioService.getOneUser(iduser)
    .subscribe(res => {
      this.rol = res;
      console.log(this.rol);
    })
  }

  transform(value: any) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");;
  }

}
