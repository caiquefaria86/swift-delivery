import Pusher from 'pusher';

export default async function handler(req: any, res: any) {
  const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
    secret: process.env.PUSHER_SECRET!,
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    useTLS: true,
  });

  const socketId = req.body.socket_id;
  const channel = req.body.channel_name;
  const data = req.body.data;

  try {
    const authResponse = pusher.authorizeChannel(socketId, channel, data);
    res.send(authResponse);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
}