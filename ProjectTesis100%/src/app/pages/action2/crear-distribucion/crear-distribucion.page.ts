import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface compListPed {
  name: string,
  cantPed: number,
  amountTotal: number
}

@Component({
  selector: 'app-crear-distribucion',
  templateUrl: './crear-distribucion.page.html',
  styleUrls: ['./crear-distribucion.page.scss'],
})
export class CrearDistribucionPage implements OnInit {

  listPed: compListPed[] = [
    {
      name: 'BARBIJOS QUIRURGICOS PEDIATRICOS',
      cantPed: 15,
      amountTotal: 375
    },
    {
      name: 'VENDAS ELASTICAS 20 CM COLOR PIEL',
      cantPed: 8,
      amountTotal: 200
    },
    {
      name: 'GUANTES DE LATEX TALLA L',
      cantPed: 6,
      amountTotal: 450
    }
  ]

  constructor(private router: Router) { }

  ngOnInit() {
  }

  saveDis() {
    this.router.navigate(['/action2']);
  }

}
