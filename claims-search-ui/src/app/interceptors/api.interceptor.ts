import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Clone the request and add headers if needed
    let apiReq = req;
    
    // Add common headers for API requests
    if (req.url.startsWith(environment.apiUrl) || req.url.startsWith('/api')) {
      apiReq = req.clone({
        setHeaders: {
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'application/json'
        }
      });
      
      // Add authentication token if available
      const token = localStorage.getItem('auth_token');
      if (token) {
        apiReq = apiReq.clone({
          setHeaders: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
    }
    
    return next.handle(apiReq);
  }
}