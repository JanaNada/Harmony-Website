const https = require('https');

https.get('https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=1600&q=80', (res) => {
  console.log('Status Code:', res.statusCode);
  console.log('Headers:', res.headers['content-type']);
}).on('error', (e) => {
  console.error(e);
});
