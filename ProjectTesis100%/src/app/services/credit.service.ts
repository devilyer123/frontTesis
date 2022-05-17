import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Credit, RespuestaCredits } from '../interfaces/interfaces';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class CreditService {

  constructor(private http: HttpClient) { }

  getCreditsByClient(id: number) {
    return this.http.get<RespuestaCredits>(`${ URL }/credits/client/${ id }`);
  }

  getCredits() {
    return this.http.get<RespuestaCredits>(`${ URL }/credits`);
  }

  registerCredit(credit: Credit) {
    return this.http.post(`${ URL }/credits/create`, credit);
  }

  getOneCredit(id: number) {
    return this.http.get<Credit>(`${ URL }/credits/${ id }`);
  }

  updateCredit(id: number, cred: Credit) {
    return this.http.put(`${ URL }/credits/${ id }`, cred);
  }

  getDelete(id: number) {
    return this.http.delete(`${ URL }/credits/${ id }`);
  }

}
