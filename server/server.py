import websockets
import asyncio


class Server:
    def __init__(self, port):
        self.port = port
        self.connections = set()
        self.start_server = websockets.serve(self.handler, 'localhost', self.port)
        self.loop = asyncio.get_event_loop()
        self.loop.run_until_complete(self.start_server)
        self.loop.run_forever()

    async def handler(self, websocket, path):
        self.connections.add(websocket)
        try:
            while True:
                data = await websocket.recv()
                await self.broadcast(data)
        except websockets.exceptions.ConnectionClosed:
            self.connections.remove(websocket)

    async def broadcast(self, data):
        for connection in self.connections:
            await connection.send(data)


if __name__ == '__main__':
    server = Server(4444)
