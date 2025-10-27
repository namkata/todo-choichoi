/*
 * Class-level comment: Notifications provides helpers to request permission
 * and dispatch in-browser notifications when todos become overdue.
 */

import type { Todo } from '../types';
import { NOTIFY_CHECK_INTERVAL_MS } from '../config';

/**
 * Function-level comment: Ask notification permission from the user.
 */
export async function RequestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false; // Inline comment: not supported
  const result = await Notification.requestPermission();
  return result === 'granted';
}

/**
 * Function-level comment: Start a simple interval to check for overdue items
 * and send notifications. Returns a cleanup function to stop checking.
 */
export function StartOverdueNotifier(getTodos: () => Todo[]): () => void {
  const intervalId = window.setInterval(() => {
    const items = getTodos();
    const now = Date.now();
    items.forEach((t) => {
      // Inline comment: only notify when pending and passed due
      if (t.status !== 'completed' && t.dueAt) {
        const dueMs = new Date(t.dueAt).getTime();
        const overdue = dueMs < now;
        if (overdue) {
          try {
            // Inline comment: display a friendly notification
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('Task overdue', {
                body: `${t.title} is overdue!`,
              });
            }
          } catch { /* Inline comment: no-op if notifications blocked */ }
        }
      }
    });
  }, NOTIFY_CHECK_INTERVAL_MS);

  // Inline comment: return cleanup function
  return () => window.clearInterval(intervalId);
}