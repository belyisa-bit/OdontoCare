export interface AppointmentNotification {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}

/** The backend must derive the account from its authenticated session. */
export interface NotificationGateway {
  load(): Promise<AppointmentNotification[]>;
  markRead(ids: string[]): Promise<void>;
}
