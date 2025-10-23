import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';
import { Api } from './api';

@Injectable({
  providedIn: 'root'
})
export class ConnectionTestService {

  constructor(private api: Api) {}

  // Test the connection to the backend with timeout
  testConnection(): Observable<boolean> {
    // Health endpoint is at /api/health
    return this.api.get('/api/health').pipe(
      timeout(5000), // 5 second timeout
      map((response: any) => {
        console.log('Health check response:', response);
        return response && response.status === 'UP';
      }),
      catchError((error) => {
        console.error('Health check failed:', error);
        return of(false);
      })
    );
  }

  // Get API information
  getApiInfo(): Observable<any> {
    // Info endpoint is at /api/info
    return this.api.get('/api/info').pipe(
      timeout(5000),
      catchError((error) => {
        console.error('API info failed:', error);
        return of(null);
      })
    );
  }

  // Test simple claims API
  testClaimsApi(): Observable<boolean> {
    return this.api.get('claims?pageSize=1').pipe(
      timeout(5000),
      map((response: any) => {
        console.log('Claims API test response:', response);
        return response !== null;
      }),
      catchError((error) => {
        console.error('Claims API test failed:', error);
        return of(false);
      })
    );
  }

  // Comprehensive connection test
  performFullConnectionTest(): Observable<{connected: boolean, details: any}> {
    return this.api.get('/api/health').pipe(
      timeout(5000),
      map((rootResponse: any) => {
        return {
          connected: true,
          details: {
            health: rootResponse,
            timestamp: new Date().toISOString(),
            frontend: 'Angular 17+',
            backend: 'Node.js Express',
            database: 'In-Memory'
          }
        };
      }),
      catchError((error) => {
        return of({
          connected: false,
          details: {
            error: error.message,
            timestamp: new Date().toISOString(),
            suggestion: 'Please ensure the backend server is running on http://localhost:8080'
          }
        });
      })
    );
  }
}