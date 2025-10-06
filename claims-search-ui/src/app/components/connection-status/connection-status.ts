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