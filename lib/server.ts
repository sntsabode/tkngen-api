import { app as server } from './app'

const PORT = process.env.PORT || 9000

server.listen(<number>PORT, '0.0.0.0', async () => {
  console.log('Server listening on PORT: %s', PORT)
})