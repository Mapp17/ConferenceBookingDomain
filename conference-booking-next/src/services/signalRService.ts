import * as signalR from '@microsoft/signalr';

class SignalRService {
  private connection: signalR.HubConnection | null = null;
private listeners: Map<string, ((...args: any[]) => void)[]> = new Map();

  async startConnection(): Promise<void> {
    if (this.connection) return;

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5151';
    const token = localStorage.getItem('token');

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${API_URL}/hubs/bookings`, {
        accessTokenFactory: () => token || '',
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 20000])
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.connection.onreconnecting((error) => {
      console.log('SignalR reconnecting:', error);
    });

    this.connection.onreconnected((connectionId) => {
      console.log('SignalR reconnected:', connectionId);
    });

    this.connection.onclose((error) => {
      console.log('SignalR closed:', error);
    });

    try {
      await this.connection.start();
      console.log('✅ SignalR connected');
      
      // Re-register all listeners after reconnection
      this.listeners.forEach((callbacks, eventName) => {
        callbacks.forEach(callback => {
          this.connection?.on(eventName, callback);
        });
      });
    } catch (err) {
      console.error('❌ SignalR connection error:', err);
    }
  }

  async stopConnection(): Promise<void> {
    if (this.connection) {
      await this.connection.stop();
      this.connection = null;
      console.log('🔌 SignalR disconnected');
    }
  }

on(eventName: string, callback: (...args: any[]) => void): void {
  if (!this.listeners.has(eventName)) {
    this.listeners.set(eventName, []);
  }

  this.listeners.get(eventName)?.push(callback);

  if (this.connection) {
    this.connection.on(eventName, callback);
  }
}

off(eventName: string, callback?: (...args: any[]) => void): void {
  if (callback) {
    const callbacks = this.listeners.get(eventName) || [];
    const index = callbacks.indexOf(callback);

    if (index > -1) {
      callbacks.splice(index, 1);
    }

    this.connection?.off(eventName, callback);
  } else {
    this.listeners.delete(eventName);
    this.connection?.off(eventName);
  }
}

  async send(eventName: string, ...args: any[]): Promise<void> {
    if (!this.connection) {
      throw new Error('SignalR not connected');
    }
    await this.connection.send(eventName, ...args);
  }

  isConnected(): boolean {
    return this.connection?.state === signalR.HubConnectionState.Connected;
  }
}

// Export a singleton instance
export const signalRService = new SignalRService();