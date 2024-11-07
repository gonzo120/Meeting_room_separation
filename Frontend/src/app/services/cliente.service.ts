import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserAuthService } from './user-auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  //private baseUrl = 'http://localhost:3000/auth/';
  //private baseUrl = 'https://meeting-room-separation.onrender.com/auth/';
  private baseUrl = environment.baseUrl;
  requestHeader = new HttpHeaders({ 'No-Auth': 'True' });
  headers = new HttpHeaders({
    'Authorization': 'Bearer ', // Reemplaza con tu token de autenticación
    'Content-Type': 'application/json'
  });
  constructor(private http: HttpClient, private userAuthService: UserAuthService) { }

  onSignin(LoginData: any): Observable<any> {
    console.log(LoginData);
    return this.http.post(this.baseUrl + 'login', LoginData, {
      headers: this.requestHeader,
    });
  }
  onSignUp(LoginData: any): Observable<any> {
    console.log(LoginData);
    return this.http.post(this.baseUrl + 'signup', LoginData, {
      headers: this.requestHeader,
    });
  }
  public forUser() {
    return this.http.get(this.baseUrl + 'forUser', {
      responseType: 'text',
    });
  }


  public forAdmin() {
    return this.http.get(this.baseUrl + 'forAdmin', {
      responseType: 'text',
    });
  }

  public roleMatch(allowedRoles:any): boolean {
    let isMatch = false;
    const userRoles: any = this.userAuthService.getRoles();
    //console.log(userRoles);

    if (userRoles != null && userRoles) {
      if (allowedRoles.includes('Admin') === userRoles.includes('Admin')) {
          
            isMatch = true;
            return isMatch;
        }
      
    } return isMatch;
  }
}
