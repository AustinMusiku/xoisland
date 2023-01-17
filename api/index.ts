import http from 'http'
import app from './app'

const server = http.createServer(app)

module.exports = {
	path: '/api/',
	handler: server,
}
