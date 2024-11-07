import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ClienteService } from '../../services/cliente.service';
import Swal from 'sweetalert2';
import { UserAuthService } from '../../services/user-auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  isSignDivVisiable: boolean  = false;

  signUpObj: SignUpModel  = new SignUpModel();
  loginObj: LoginModel  = new LoginModel();

  constructor(private router: Router, private clienteService: ClienteService, 
    private userAuthService: UserAuthService,){}

    public showSuccessAlert(form: NgForm) {
      Swal.fire({
        title: 'Success',
        text: 'User created successfully.',
        icon: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Ok'
      }).then((result) => {
        if (result.isConfirmed) {
          this.login(form)
        }
      });
    }
    signup(form: NgForm) {
      console.log(form.value); // Muestra los valores del formulario
      this.clienteService.onSignUp(form.value).subscribe(
        (response)=>{
          this.showSuccessAlert(form);
          //this.login(form)
        },
        (error)=>{
  
          this.warningAlert2();
          console.log(error.errors[0].msg);
        }
      );
    }
  warningAlert() {
    Swal.fire({
      title: 'User not found',
      text: 'Username or password is incorrect',
      icon: 'warning',
      confirmButtonColor: '#512da8',
      confirmButtonText: 'Ok!'
    });
    
  }
  warningAlert2() {
    Swal.fire({
      title: 'User not found',
      text: 'Username or email is duplicated',
      icon: 'warning',
      confirmButtonColor: '#512da8',
      confirmButtonText: 'Ok!'
    });
    
  }
  login(form: NgForm) {
    console.log(form.value); // Muestra los valores del formulario
    // O puedes acceder a campos específicos como:
    console.log('Username:', form.value.email);
    console.log('Password:', form.value.password);
    this.clienteService.onSignin(form.value).subscribe(
      (response)=>{
        console.log(response)
        this.userAuthService.setRoles(response.userType);
        this.userAuthService.setToken(response.token);
        this.userAuthService.setUserId(response.userId);

        const role = response.userType;
        console.log(role);
        if (role === 'Admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/user']);
        }
      },
      (error)=>{

        this.warningAlert();
        console.log(error);
      }
    );
  }
}

export class SignUpModel  {
  username: string;
  email: string;
  password: string;

  constructor() {
    this.email = "";
    this.username = "";
    this.password= ""
  }
}

export class LoginModel  { 
  userName: string;
  userPassword: string;

  constructor() {
    this.userName = ""; 
    this.userPassword= ""
  }
}
