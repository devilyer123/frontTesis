import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Distribution, RespuestaDistributions } from '../interfaces/interfaces';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class DistributionService {

  constructor(private http: HttpClient) { }

  getDistributionsByClient(id: number) {
    return this.http.get<RespuestaDistributions>(`${ URL }/distributions/client/${ id }`);
  }

  getDistributions() {
    return this.http.get<RespuestaDistributions>(`${ URL }/distributions`);
  }

  registerDistribution(distribution: Distribution) {
    return this.http.post(`${ URL }/distributions/create`, distribution);
  }

  getOneDistribution(id: number) {
    return this.http.get<Distribution>(`${ URL }/distributions/${ id }`);
  }

  updateDistribution(id: number, distr: Distribution) {
    return this.http.put(`${ URL }/distributions/${ id }`, distr);
  }

  getDelete(id: number) {
    return this.http.delete(`${ URL }/distributions/${ id }`);
  }

}
