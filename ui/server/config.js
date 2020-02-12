module.exports = {
  apiBaseUrl: `http://${process.env.API_URL || ''}/api/v1/kubernetes`,
  gelfUrl: process.env.GELF_ADDRESS || 'http://localhost:12201',
  logLevel: process.env.LOG_LEVEL || 'error',
  nodeEnv: process.env.NODE_ENV || 'development'
}