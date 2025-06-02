export default defineWebSocketHandler({
  open(peer) {
    console.log('New peer attempting to connect:', peer.request.url);
    try {
      const url = new URL(peer.request.url);
      const room = url.searchParams.get("room");
      console.log('Extracted room ID:', room);

      if (!room) {
        console.error("Error: Missing room ID for connection:", peer.request.url);
        peer.send("Missing room ID");
        peer.close();
        return;
      }

      if(!/^[\w-]{3,50}$/.test(room.trim())) {
        console.error(`Error: Invalid room ID format: "${room}" for connection:`, peer.request.url);
        peer.send("invalid room ID format");
        peer.close()
        return 
      }

      peer.subscribe(room);
      console.log(`Peer successfully connected to room: ${room}`);
      console.log('Peer subscriptions:', peer.subscriptions);

    } catch(err) {
      console.error('Error during peer open:', err, 'for URL:', peer.request.url);
      peer.close()
    }
  },
  message(peer, message) {
    try {
      const url = new URL(peer.request.url);
      const room = url.searchParams.get("room");
      const text = message.text();
      console.log(`Received message "${text}" in room "${room}" from`, peer.request.url);

      if (text === 'ping') {
        peer.send('pong'); // Send a "pong" response
        console.log(`Sent "pong" in response to "ping" from`, peer.request.url);
      } else {
        peer.publish(room, text);
      }
    } catch(err) {
      console.error('Error during message handling:', err, 'for peer:', peer.request.url);
    }
  },
  close(peer) {
    console.log("Peer Disconnected:", peer.request.url);
  },
  error(peer, error) {
    console.error('Websocket error for peer:', peer.request.url, 'Error:', error);
  }
})