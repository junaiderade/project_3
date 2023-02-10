// const express = require ('express')
// const fs = require('fs')
// const path = require('path')

// const https = require('https')
// const key = fs.readFileSync('private.key')
// const cert = fs.readFileSync('certificate.crt')

// const app = express()
// const port = 443
// const httpsOptions = {
//     cert: fs.readFileSync(path.join(__dirname,'certificate.crt')),
//     key: fs.readFileSync(path.join(__dirname,'private.key'))
// }

// //the .use is how you add extensions/features
// //cors is a security feature




// //app.listen(3000, () => console.log(`listening on port ${port}`))

// // const httpsServer = https.createServer(cred,app)
// // httpsServer.listen(443) //redirect to 443 when running docker

// https.createServer(httpsOptions, app)
//     .listen(port, () => {
//         console.log('yup')
//     })


const express = require('express');
const cors = require('cors')

const https = require('https');
const fs = require('fs');

const app = express();

app.use(cors())


app.get('/',(req,res) => {
    res.send('Hello World Again!')
})

// //you needed this for verification
// // app.get('/.well-known/pki-validation/EF9ECE1194E95DC0A4AE86F9613F4B05.txt', (req,res) => {
// //     res.sendFile(path.join(__dirname, 'EF9ECE1194E95DC0A4AE86F9613F4B05.txt')); //you have to do this because docker
// // })

const options = {
  key: fs.readFileSync(process.env.SSL_PRIVATE_KEY_FILE),
  cert: fs.readFileSync(process.env.SSL_CERTIFICATE_FILE),
  ca: fs.readFileSync(process.env.SSL_CA_BUNDLE_FILE),
};

https.createServer(options, app).listen(443, () => {
  console.log('HTTPS server listening on port 443');
});