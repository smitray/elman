module.exports = {
  port: 3000,
  mongodb: {
    uri: 'mongodb://localhost',
    db: 'elman',
    port: 27017,
    options: {
      user: '',
      pass: '',
      promiseLibrary: global.Promise,
      useNewUrlParser: true,
      useCreateIndex: true
    }
  },
  secret: [
    'yoursecretkey'
  ],
  baseUrl: 'http://localhost:3000'
};