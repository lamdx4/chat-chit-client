/* eslint-disable @typescript-eslint/no-explicit-any */
type EventHandler = (data?: any) => void;

class EventBus {
  private events: Record<string, EventHandler[]> = {};

  subscribe(event: string, handler: EventHandler): () => void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(handler);

    // Return unsubscribe function
    return () => {
      this.events[event] = this.events[event].filter(h => h !== handler);
    };
  }

  publish(event: string, data?: any): void {
    if (this.events[event]) {
      this.events[event].forEach(handler => handler(data));
    }
  }
}

export const eventBus = new EventBus();