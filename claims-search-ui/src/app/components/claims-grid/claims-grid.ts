import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class Api {
  private baseUrl = environment.apiUrl;
  
  private buildUrl(endpoint: string): string {
    // Handle absolute paths (starting with /) differently
    if (endpoint.startsWith('/')) {
      // For absolute paths, use them directly (they'll go through proxy)
      return endpoint;
    }
    
    // For relative paths, construct URL based on baseUrl
    if (!this.baseUrl) {
      return endpoint;
    }
    
    // Remove trailing slash from baseUrl and leading slash from endpoint to avoid double slashes
    const base = this.baseUrl.endsWith('/') ? this.baseUrl.slice(0, -1) : this.baseUrl;
    const path = endpoint.startsWith('/') ? endpoint : '/' + endpoint;
    
    return base + path;
  }
  
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  get<T>(endpoint: string, params?: any): Observable<T> {
    const url = this.buildUrl(endpoint);
    return this.http.get<T>(url, { params, ...this.httpOptions })
      .pipe(catchError(this.handleError));
  }

  post<T>(endpoint: string, data: any): Observable<T> {
    const url = this.buildUrl(endpoint);
    return this.http.post<T>(url, data, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  put<T>(endpoint: string, data: any): Observable<T> {
    const url = this.buildUrl(endpoint);
    return this.http.put<T>(url, data, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  delete<T>(endpoint: string): Observable<T> {
    const url = this.buildUrl(endpoint);
    return this.http.delete<T>(url, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getBlob(endpoint: string, params?: any): Observable<Blob> {
    const url = this.buildUrl(endpoint);
    return this.http.get(url, { 
      params, 
      responseType: 'blob',
      headers: new HttpHeaders({
        'Accept': 'application/octet-stream'
      })
    }).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      switch (error.status) {
        case 400:
          errorMessage = 'Bad Request: Please check your input';
          break;
        case 401:
          errorMessage = 'Unauthorized: Please login again';
          break;
        case 403:
          errorMessage = 'Forbidden: You do not have permission to access this resource';
          break;
        case 404:
          errorMessage = 'Not Found: The requested resource was not found';
          break;
        case 500:
          errorMessage = 'Internal Server Error: Please try again later';
          break;
        default:
          errorMessage = `Error ${error.status}: ${error.message}`;
      }
    }
    
    console.error('API Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConnectionTestService } from '../../services/connection-test';

@Component({
  selector: 'app-connection-status',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="connection-status" [ngClass]="statusClass">
      <div class="status-indicator">
        <span class="status-dot" [ngClass]="statusClass"></span>
        <span class="status-text">{{ statusMessage }}</span>
      </div>
      <button (click)="testConnection()" [disabled]="testing" class="test-button">
        {{ testing ? 'Testing...' : 'Test Connection' }}
      </button>
    </div>
  `,
  styles: [`
    .connection-status {
      padding: 10px;
      margin: 10px 0;
      border-radius: 5px;
      border: 1px solid #ddd;
    }
    
    .status-indicator {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
    }
    
    .status-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      margin-right: 8px;
    }
    
    .connected .status-dot {
      background-color: #28a745;
    }
    
    .disconnected .status-dot {
      background-color: #dc3545;
    }
    
    .testing .status-dot {
      background-color: #ffc107;
      animation: pulse 1s infinite;
    }
    
    @keyframes pulse {
      0% { opacity: 1; }
      50% { opacity: 0.5; }
      100% { opacity: 1; }
    }
    
    .test-button {
      padding: 5px 15px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 3px;
      cursor: pointer;
    }
    
    .test-button:disabled {
      background-color: #6c757d;
      cursor: not-allowed;
    }
    
    .test-button:hover:not(:disabled) {
      background-color: #0056b3;
    }
  `]
})
export class ConnectionStatusComponent implements OnInit {
  connectionStatus: 'connected' | 'disconnected' | 'testing' = 'testing';
  statusMessage = 'Checking connection...';
  testing = false;

  constructor(private connectionTest: ConnectionTestService) {}

  ngOnInit() {
    this.testConnection();
  }

  get statusClass() {
    return this.connectionStatus;
  }

  testConnection() {
    this.testing = true;
    this.connectionStatus = 'testing';
    this.statusMessage = 'Testing connection...';

    this.connectionTest.testConnection().subscribe({
      next: (response) => {
        this.connectionStatus = 'connected';
        this.statusMessage = 'Backend connected successfully';
        this.testing = false;
        console.log('Connection test successful:', response);
      },
      error: (error) => {
        this.connectionStatus = 'disconnected';
        this.statusMessage = `Connection failed: ${error.message}`;
        this.testing = false;
        console.error('Connection test failed:', error);
      }
    });
  }
}

