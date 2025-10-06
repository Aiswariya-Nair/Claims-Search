import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError} from 'rxjs/operators';
import { 
  Claim, 
  ClaimsResponse, 
  MyQueueResponse,
  StatusOption,
  StateOption,
  ProgramOption,
  InsuranceTypeOption,
  ExaminerOption,
  OrganizationOption,
  UnderwriterOption,
  EmployerTypeahead
} from '../models/claim';
import { FilterParams } from '../models/filter-params';
import { Api } from './api';

@Injectable({
  providedIn: 'root'
})
export class ClaimsService {

  constructor(private api: Api) {}

  searchClaims(filters: FilterParams): Observable<ClaimsResponse> {
    let params = new HttpParams();
    
    // Add all filter parameters
    Object.keys(filters).forEach(key => {
      const value = (filters as any)[key];
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value) && value.length > 0) {
          params = params.set(key, value.join(','));
        } else if (!Array.isArray(value)) {
          params = params.set(key, value.toString());
        }
      }
    });

    return this.api.get<any>('claims', params).pipe(
      map(response => {
        // Handle the new API response format
        const claims = response.items || response.claims || [];
        
        return {
          claims: claims,
          items: claims,
          totalRecords: response.total || response.totalRecords || 0,
          total: response.total || response.totalRecords || 0,
          totalPages: response.totalPages || 0,
          currentPage: (response.page !== undefined) ? response.page - 1 : (response.currentPage !== undefined ? response.currentPage : 0),
          page: (response.page !== undefined) ? response.page : (response.currentPage !== undefined ? response.currentPage : 1),
          pageSize: response.pageSize || 25
        };
      }),
	  catchError(error => {
	            // Log the error for debugging
	            console.error('Error in map operator:', error);
	            // Re-throw the error or return a fallback observable
	            return throwError(() => new Error('Something went wrong during data processing.'));
	          })
    );
  }

  getMyQueue(filters: FilterParams): Observable<MyQueueResponse> {
    let params = new HttpParams();
    
    Object.keys(filters).forEach(key => {
      const value = (filters as any)[key];
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value) && value.length > 0) {
          params = params.set(key, value.join(','));
        } else if (!Array.isArray(value)) {
          params = params.set(key, value.toString());
        }
      }
    });

    return this.api.get<MyQueueResponse>('fetchMyqueue', params);
  }

  exportClaims(filters: FilterParams, format: 'csv' | 'xlsx' | 'json'): Observable<Blob> {
    let params = new HttpParams();
    
    Object.keys(filters).forEach(key => {
      const value = (filters as any)[key];
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value) && value.length > 0) {
          params = params.set(key, value.join(','));
        } else if (!Array.isArray(value)) {
          params = params.set(key, value.toString());
        }
      }
    });

    params = params.set('format', format);
    return this.api.getBlob('claims/export', params);
  }

  getClaimById(claimId: string): Observable<Claim> {
    return this.api.get<Claim>(`claims/${claimId}`);
  }

  createClaim(claim: Claim): Observable<Claim> {
    return this.api.post<Claim>('claims', claim);
  }

  // Dropdown APIs
  getClaimStatuses(): Observable<StatusOption[]> {
    return this.api.get<StatusOption[]>('claims/statuses');
  }

  getLossStates(): Observable<StateOption[]> {
    return this.api.get<StateOption[]>('claims/loss-states');
  }

  getPrograms(): Observable<ProgramOption[]> {
    return this.api.get<ProgramOption[]>('claims/programs');
  }

  getInsuranceTypes(): Observable<InsuranceTypeOption[]> {
    return this.api.get<InsuranceTypeOption[]>('claims/insurance-types');
  }

  getExaminers(): Observable<ExaminerOption[]> {
    return this.api.get<ExaminerOption[]>('claims/examiners');
  }

  getOrganizations(): Observable<OrganizationOption[]> {
    return this.api.get<OrganizationOption[]>('claims/organizations');
  }

  getUnderwriters(): Observable<UnderwriterOption[]> {
    return this.api.get<UnderwriterOption[]>('claims/underwriters');
  }

  // Typeahead APIs
  getEmployerTypeahead(term: string): Observable<EmployerTypeahead[]> {
    let params = new HttpParams().set('term', term);
    return this.api.get<EmployerTypeahead[]>('claims/typeahead/employer', params);
  }

  getClaimNumberTypeahead(term: string): Observable<string[]> {
    let params = new HttpParams().set('term', term);
    return this.api.get<string[]>('claims/typeahead/claim-number', params);
  }

  getPolicyNumberTypeahead(term: string): Observable<string[]> {
    let params = new HttpParams().set('term', term);
    return this.api.get<string[]>('claims/typeahead/policy-number', params);
  }

  getProgramTypeahead(term: string): Observable<string[]> {
    let params = new HttpParams().set('term', term);
    return this.api.get<string[]>('claims/typeahead/program', params);
  }

  getUnderwriterTypeahead(term: string): Observable<string[]> {
    let params = new HttpParams().set('term', term);
    return this.api.get<string[]>('claims/typeahead/underwriter', params);
  }

  // Legacy support and testing methods
  testApi(): Observable<ClaimsResponse> {
    return this.api.get<any>('claims').pipe(
      map(response => {
        const claims = response.items || response.claims || [];
        
        return {
          claims: claims,
          items: claims,
          totalRecords: response.total || response.totalRecords || 0,
          total: response.total || response.totalRecords || 0,
          totalPages: response.totalPages || 0,
          currentPage: (response.page !== undefined) ? response.page - 1 : (response.currentPage !== undefined ? response.currentPage : 0),
          page: (response.page !== undefined) ? response.page : (response.currentPage !== undefined ? response.currentPage : 1),
          pageSize: response.pageSize || 25
        };
      })
    );
  }

  // Connection test method
  testConnection(): Observable<boolean> {
    return this.api.get<any>('claims?pageSize=1').pipe(
      map(() => true),
      // catchError(() => of(false))
    );
  }
}