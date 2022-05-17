import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { collectCredit, Credit } from 'src/app/interfaces/interfaces';
import { ClientService } from 'src/app/services/client.service';
import { CreditService } from 'src/app/services/credit.service';
import { NavController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-cobrar-credito',
  templateUrl: './cobrar-credito.page.html',
  styleUrls: ['./cobrar-credito.page.scss'],
})
export class CobrarCreditoPage implements OnInit {

  cred: Credit = {
    cliId: 0,
    nomPro: '',
    cantVend: 0,
    tipoPago: '',
    montoCred: 0,
    montoCredPend: 0,
    estadoCred: ''
  };

  upCreditCollet: collectCredit = {
    credAdd: 0
  }

  constructor(private activatedRoute: ActivatedRoute,
    private creditService: CreditService,
    private clientService: ClientService,
    private navCtrl: NavController,
    private alertController: AlertController) { }

  ngOnInit() {
    this.searchCredit();
  }

  /*loadCreditByClient() {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      if (paramMap.get('idcli')) {
        this.creditService.getCreditsByClient(parseInt(paramMap.get('idcli')))
        .subscribe(resp => {
          this.credit = resp;
          console.log(this.credit);
        })
      }
    })
  }*/

  searchCredit() {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      console.log(paramMap.get('idsegcre'));
      if (paramMap.get('idsegcre')) {
        this.creditService.getOneCredit(parseInt(paramMap.get('idsegcre')))
        .subscribe(res => {
          this.cred = res;
          console.log(this.cred);
          console.log(this.cred.cliId);
        })
      }
    })
  }

  async upCredit() {
    if(this.upCreditCollet.credAdd > this.cred.montoCredPend)
    {
      const alert = await this.alertController.create({
        header: 'Error de Cobranza',
        subHeader: 'El monto a pagar es excedente a la deuda pendiente',
        buttons: ['Aceptar']
      })
      await alert.present();
    } else {
      if (this.upCreditCollet.credAdd <= 0) {
        const alert = await this.alertController.create({
          header: 'Error de Cobranza',
          subHeader: 'La cantidad de monto a cobrar debe ser mayor a 0',
          buttons: ['Aceptar']
        });
        await alert.present();
      } else {
        if (this.cred.tipoPago == 'Al Contado' && this.upCreditCollet.credAdd != this.cred.montoCredPend) {
          const alert = await this.alertController.create({
            header: 'Error de Cobranza',
            subHeader: 'El tipo de pago es Al Contado se debe cancelar el Monto Total de Deuda Pendiente',
            buttons: ['Aceptar']
          });
          await alert.present();
        } else {
          this.cred.montoCredPend = this.restCredit(this.cred.montoCredPend, this.upCreditCollet.credAdd);
          if (this.cred.montoCredPend == 0) {
            this.cred.estadoCred = 'Cancelado';
          }
          this.creditService.updateCredit(this.cred.idsegcre, {
            nomPro: this.cred.nomPro,
            cantVend: this.cred.cantVend,
            tipoPago: this.cred.tipoPago,
            montoCred: this.cred.montoCred,
            montoCredPend: this.cred.montoCredPend,
            estadoCred: this.cred.estadoCred
          }).subscribe( res => {
            this.navCtrl.navigateRoot(`/action3/credits-client/${this.cred.cliId}`, {animated:true} )
          })
        }        
      }
    }
  }

  restCredit(monT, cobC) {
    const resta = parseInt(monT) - parseInt(cobC);
    return resta;
  }

}
