import { Server, Socket } from 'socket.io';

const setupSockets = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('join_deal', (dealId: string) => {
      socket.join(dealId);
      console.log(`Socket ${socket.id} joined deal: ${dealId}`);
    });

    socket.on('leave_deal', (dealId: string) => {
      socket.leave(dealId);
      console.log(`Socket ${socket.id} left deal: ${dealId}`);
    });

    socket.on('send_message', (data: { dealId: string, message: any }) => {
      socket.to(data.dealId).emit('receive_message', data.message);
    });

    socket.on('send_offer', (data: { dealId: string, offer: any }) => {
      socket.to(data.dealId).emit('offer_received', data.offer);
    });

    socket.on('update_offer_status', (data: { dealId: string, offerId: string, status: string }) => {
      socket.to(data.dealId).emit('offer_status_updated', data);
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};

export default setupSockets;
