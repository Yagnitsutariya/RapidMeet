import('./backend/src/controller/socketManager.js')
  .then(()=> console.log('socket module loaded'))
  .catch(e => { console.error(e.stack); process.exit(1); });