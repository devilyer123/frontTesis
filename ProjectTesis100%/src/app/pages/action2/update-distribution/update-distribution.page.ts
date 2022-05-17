import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { Distribution, selecTypPage } from 'src/app/interfaces/interfaces';
import { CreditService } from 'src/app/services/credit.service';
import { DistributionService } from 'src/app/services/distribution.service';

@Component({
  selector: 'app-update-distribution',
  templateUrl: './update-distribution.page.html',
  styleUrls: ['./update-distribution.page.scss'],
})
export class UpdateDistributionPage implements OnInit {

  distribution: Distribution = {
    nomPro: '',
    cantSolic: 0,
    montoTotal: 0,
    estadoPedido: ''
  }

  upTypPage: selecTypPage = {
    typPage: ''
  }

  constructor(private activatedRouter: ActivatedRoute,
    private distributionService: DistributionService,
    private creditService: CreditService,
    private alertController: AlertController,
    private navCtrl: NavController) { }

  ngOnInit() {
    this.searchDistribution();
  }

  searchDistribution() {
    this.activatedRouter.paramMap.subscribe((paramMap) => {
      if (paramMap.get('iddis')) {
        this.distributionService.getOneDistribution(parseInt(paramMap.get('iddis')))
        .subscribe(res => {
          this.distribution = res;
        })
      }
    })
  }

  async upDistribution() {
    if (this.distribution.estadoPedido == '' || this.distribution.estadoPedido != 'Entregado'){
      const alert = await this.alertController.create({
        header: 'Error de Actualizacion',
        subHeader: 'No se selecciono el estado de pedido en Entregado',
        buttons: ['Aceptar']
      });
      await alert.present();
    } else {
      if (this.upTypPage.typPage == '') {
        const alert = await this.alertController.create({
          header: 'Error de Actualizacion',
          subHeader: 'No se selecciono ningun tipo de pago disponible para registrar',
          buttons: ['Aceptar']
        });
        await alert.present();
      } else {
        this.distributionService.updateDistribution(this.distribution.iddis, {
          nomPro: this.distribution.nomPro,
          cantSolic: this.distribution.cantSolic,
          montoTotal: this.distribution.montoTotal,
          estadoPedido: this.distribution.estadoPedido
        }).subscribe(res => {
          this.regFollowCredit();
          this.navCtrl.navigateRoot('/action2', {animated: true})
        })
      }
    }    
  }

  regFollowCredit() {
    this.creditService.registerCredit({
      cliId: this.distribution.cliId,
      nomPro: this.distribution.nomPro,
      cantVend: this.distribution.cantSolic,
      tipoPago: this.upTypPage.typPage,
      montoCred: this.distribution.montoTotal,
      montoCredPend: this.distribution.montoTotal,
      estadoCred: 'Pendiente'
    }).subscribe(
      (res) => {
        console.log(res)
      },
      (err) => console.log(err)
    )
  }

  async assignCondOrder() {
    const alert = await this.alertController.create({
      header: 'Seleccione el estado del pedido',
      buttons: [
        {
          text: 'Entregado',
          handler: () => {
            this.distribution.estadoPedido = "Entregado"
          }
        },
        {
          text: 'Pendiente',
          handler: () => {
            this.distribution.estadoPedido = "Pendiente"
          }
        }
      ]
    })
    await alert.present();
  }

  async assignTypPage() {
    const alert = await this.alertController.create({
      header: 'Seleccione el tipo de pago',
      buttons: [
        {
          text: 'A Credito',
          handler: () => {
            this.upTypPage.typPage = "A Credito"
          }
        },
        {
          text: 'Al Contado',
          handler: () => {
            this.upTypPage.typPage = "Al Contado"
          }
        }
      ]
    })
    await alert.present();
  }

}
