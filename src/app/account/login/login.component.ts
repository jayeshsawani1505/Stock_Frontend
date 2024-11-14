import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword: boolean = false; // Add this line

  constructor(private fb: FormBuilder,
    private router: Router,
    private AuthService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password_hash: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      console.warn('Form is invalid');
      return;
    }

    const data = this.loginForm.value;
    console.log('Login data:', data);  // Debugging line

    this.AuthService.userLogin(data).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this.router.navigate(['/admin/dashboard']);
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword; // Toggle password visibility
  }
}