const express = require('express');
const prihlas = require('./routes/loginroutes');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const qrcode = require('qrcode');
const googlemaps = require('googlemaps');
const QRReader = require('qrcode-reader');
const jimp = require('jimp'); 

const {register, login} = require('./routes/loginroutes');


var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.set('view engine', 'ejs'); // configure template engine
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(express.static(path.join(__dirname, 'public')));
app.post('/register', register);
app.post('/login', login);
/*app.post('/map', function(req, res, next){
 res.render('map', {lat: req.body.lat, lng: req.body.lng });
});*/
var router = express.Router();

router.get('/', function(req, res){
  res.json({message: 'welcome'});
});
app.get('/', function(req, res){
  res.render('index');
});
app.get('/register', function(req, res){
  res.render('register');
})
app.get('/login', function(req, res){
  res.render('login');
})
app.get('/profile', function(req, res){
  res.render('profile');
})
app.get('/map', function(req, res){
  var lat = req.query.lat;
  var lng = req.query.lng;
  var publicConfig = {
    key: 'AIzaSyC_E5CWgv46E4fzLIHOhYY0HbwbseyWjSA',
    stagger_time:       1000, // for elevationPath
    encode_polylines:   false,
    secure:             false, // use https
  };
  var gmAPI = new googlemaps(publicConfig);
  var params = {
  center: `${req.query.lat}, ${req.query.lng}`,
  zoom: 15,
  size: '500x400',
  maptype: 'roadmap',
  markers: [
    {
      location: 'Skladová 4, Trnava, Slovensko',
      label   : 'Som skrytý v bunkry',
      color   : 'green',
      shadow  : true
    }
  ],
  style: [
    {
      feature: 'road',
      element: 'all',
      rules: {
        hue: '0x00ff00'
      }
    }
  ],
  path: [
    {
      color: '0x0000ff',
      weight: '5',
      points: [
        '41.139817,-77.454439',
        '41.138621,-77.451596'
      ]
    }
  ]
};
gmAPI.staticMap(params); // return static map URL
gmAPI.staticMap(params, function(err, binaryImage) {
  // fetch asynchronously the binary image
});
  res.render('map', {lat: JSON.stringify(req.query.lat), lng: req.query.lng });
  console.log(req.query);
});
run().catch(error => console.error(error.stack));

async function run() {
  const res = await qrcode.toDataURL('http://asyncawait.net');

  fs.writeFileSync('./qr.html', `<img src="${res}">`);
  console.log('Wrote to ./qr.html');
}
async function run() {
  const img = await jimp.read(fs.readFileSync('./qr_photo.png'));

  const qr = new QRReader();

  // qrcode-reader's API doesn't support promises, so wrap it
  const value = await new Promise((resolve, reject) => {
    qr.callback = (err, v) => err != null ? reject(err) : resolve(v);
    qr.decode(img.bitmap);
  });
}




app.use('/api', router);
app.listen(5000);
