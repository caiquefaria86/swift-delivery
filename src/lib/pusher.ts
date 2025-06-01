import Pusher from 'pusher-js';

let pusherInstance: Pusher | null = null;

export const getPusherClient = (): Pusher => {
  if (!pusherInstance) {
    Pusher.logToConsole = true; // Adicione esta linha para depuração
    pusherInstance = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      encrypted: true,
      authEndpoint: '/api/pusher/auth', // se precisar de canais privados
    });
  }
  return pusherInstance;
};

export const disconnectPusher = () => {
  if (pusherInstance) {
    pusherInstance.disconnect();
    pusherInstance = null;
  }
};