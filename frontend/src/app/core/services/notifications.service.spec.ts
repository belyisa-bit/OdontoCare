import { TestBed } from '@angular/core/testing';

import type { AppointmentNotification } from '../models/notification.model';

import { NOTIFICATION_GATEWAY, NotificationsService } from './notifications.service';

const notification: AppointmentNotification = {
  id: '1',
  title: 'Consulta confirmada',
  message: 'Consulte seus agendamentos.',
  createdAt: '2026-11-05T12:00:00Z',
  read: false,
};

function setup() {
  const gateway = {
    load: vi.fn<() => Promise<AppointmentNotification[]>>().mockResolvedValue([{ ...notification }]),
    markRead: vi.fn<(ids: string[]) => Promise<void>>().mockResolvedValue(undefined),
  };
  TestBed.configureTestingModule({ providers: [{ provide: NOTIFICATION_GATEWAY, useValue: gateway }] });
  return { service: TestBed.inject(NotificationsService), gateway };
}

describe('NotificationsService', () => {
  it('não consulta dados sem sessão e limpa os avisos ao sair', async () => {
    const { service, gateway } = setup();
    await service.refresh();
    expect(gateway.load).not.toHaveBeenCalled();
    service.setSession('account-a');
    await service.refresh();
    expect(service.unreadCount()).toBe(1);
    service.setSession(null);
    expect(service.notifications()).toEqual([]);
    expect(service.unreadCount()).toBe(0);
  });

  it('ignora uma resposta da conta anterior após troca de sessão', async () => {
    const { service, gateway } = setup();
    let resolve!: (items: AppointmentNotification[]) => void;
    gateway.load.mockReturnValue(
      new Promise((done) => {
        resolve = done;
      }),
    );
    service.setSession('account-a');
    const pending = service.refresh();
    service.setSession('account-b');
    resolve([notification]);
    await pending;
    expect(service.notifications()).toEqual([]);
    expect(service.loading()).toBe(false);
  });

  it('mantém o aviso não lido quando o backend recusa salvar a leitura', async () => {
    const { service, gateway } = setup();
    service.setSession('account-a');
    await service.refresh();
    gateway.markRead.mockRejectedValue(new Error('offline'));
    await service.markAllRead();
    expect(service.unreadCount()).toBe(1);
    expect(service.error()).toBeTruthy();
    expect(service.saving()).toBe(false);
  });

  it('atualiza o contador somente após confirmar a leitura', async () => {
    const { service, gateway } = setup();
    service.setSession('account-a');
    await service.refresh();
    await service.markAllRead();
    expect(gateway.markRead).toHaveBeenCalledWith(['1']);
    expect(service.unreadCount()).toBe(0);
    expect(service.notifications()[0].read).toBe(true);
  });
});
