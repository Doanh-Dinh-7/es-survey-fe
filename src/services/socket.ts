import { io, Socket } from "socket.io-client";

class SocketService {
  private socket: Socket | null = null;
  private static instance: SocketService;

  private constructor() {}

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public async connect(token: string) {
    if (!this.socket) {
      if (!token) {
        throw new Error("token not set");
      }
      
      this.socket = io(import.meta.env.VITE_BACKEND_DOMAIN, {
        auth: { token },
        withCredentials: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });
  
      this.socket.on('connect', () => {
        console.log('Socket connected successfully');
      });
  
      this.socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });
  
      this.socket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
      });
    }
    return this.socket;
  }
  

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    console.log(this.socket);
  }

  public joinSurvey(surveyId: string, onStatisticsUpdate?: (data: any) => void) {
    if (this.socket) {
      this.socket.emit("survey:join", surveyId);
      
      // If a callback is provided, set up the statistics update listener
      if (onStatisticsUpdate) {
        this.onStatisticsUpdate(onStatisticsUpdate);
      }
    }
  }

  public leaveSurvey(surveyId: string) {
    if (this.socket) {
      this.socket.emit("survey:leave", surveyId);
    }
  }

  // Add event listener for statistics updates
  public onStatisticsUpdate(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('survey:statistics:update', callback);
    }
  }

  // Add event listener for new response updates
  public onResponseUpdate(callback: (response: any) => void) {
    if (this.socket) {
      this.socket.on('survey:response:update', callback);
    }
  }

  // Add event listener for response deletion
  public onResponseDelete(callback: (responseId: string) => void) {
    if (this.socket) {
      this.socket.on('survey:response:delete', callback);
    }
  }

  // Remove specific event listener
  public off(event: string, callback?: (...args: any[]) => void) {
    if (this.socket) {
      if (callback) {
        this.socket.off(event, callback);
      } else {
        this.socket.off(event);
      }
    }
  }

  public submitResponse(surveyId: string) {
    if (this.socket) {
      this.socket.emit("survey:response:submit", { surveyId });
    }
  }

  public deleteResponse(surveyId: string, responseId: string) {
    if (this.socket) {
      this.socket.emit("survey:response:delete", { surveyId, responseId });
    }
  }


}

export default SocketService.getInstance(); 