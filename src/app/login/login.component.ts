import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterLink, RouterModule } from "@angular/router";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { LoginModel } from "../models/login.model";
import { AuthService } from "../services/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true,
  imports: [RouterLink,RouterModule,ReactiveFormsModule, CommonModule,ToastrModule]
})
export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private authservice: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [
        Validators.required, 
        Validators.email
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
      ]]
    }, { 
    });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    const loginData: LoginModel = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    this.authservice.login(loginData).subscribe({
      next: () => {
        this.toastr.success('Login successful', 'Success');
        this.router.navigate(['/dashboard']);
      },
      error: (data) => {
        this.toastr.error(data.error?.message || 'Login failed', 'Error');
      }
    });
  }

  // Getter for easy access to form fields
  get f() { return this.loginForm.controls; }
}
