
'use client';

import { useState, useEffect } from 'react';
import { db } from '@/firebase/init';
import { collection, query, where, onSnapshot, orderBy, doc, updateDoc, writeBatch } from 'firebase/firestore';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Bell, CheckCheck } from 'lucide-react';
import { type Notification } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';

export function Notifications({ userId }: { userId: string }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!userId) return;

    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const notifs: Notification[] = [];
      let unread = 0;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (!data.read) {
          unread++;
        }
        notifs.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate()?.toISOString() || new Date().toISOString(),
        } as Notification);
      });
      setNotifications(notifs);
      setUnreadCount(unread);
    });

    return () => unsubscribe();
  }, [userId]);

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) return;
    
    const batch = writeBatch(db);
    notifications.forEach(n => {
        if (!n.read) {
            const notifRef = doc(db, 'notifications', n.id);
            batch.update(notifRef, { read: true });
        }
    });
    await batch.commit();
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full p-0"
            >
              {unreadCount}
            </Badge>
          )}
          <span className="sr-only">Abrir notificações</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <div className="flex items-center justify-between p-4 border-b">
          <h4 className="font-medium">Notificações</h4>
           {unreadCount > 0 && (
            <Button variant="link" size="sm" onClick={handleMarkAllAsRead} className="p-0 h-auto">
              <CheckCheck className="mr-2 h-4 w-4" />
              Marcar todas como lidas
            </Button>
          )}
        </div>
        <ScrollArea className="h-96">
            <div className="p-4 space-y-4">
                {notifications.length > 0 ? (
                    notifications.map((notif) => (
                    <div key={notif.id} className={`p-3 rounded-lg ${!notif.read ? 'bg-primary/10' : ''}`}>
                        <p className="font-semibold">{notif.title}</p>
                        <p className="text-sm text-muted-foreground">{notif.message}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                           {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true, locale: ptBR })}
                        </p>
                    </div>
                    ))
                ) : (
                    <p className="text-center text-muted-foreground py-8">Nenhuma notificação encontrada.</p>
                )}
            </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
