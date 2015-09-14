'use strict';

var os = require('os');

var interfaces = os.networkInterfaces();
var addresses = [];
for (var k in interfaces) {
  for (var k2 in interfaces[k]) {
    var address = interfaces[k][k2];
    if (address.family === 'IPv4' && !address.internal) {
        addresses.push(address.address);
    }
  }
}

var myIp = addresses[0];
console.log('Local ip-address:', myIp)

var CAS = require('cas');
var cas = new CAS({
  base_url: 'https://login.liu.se/cas', 
  service: 'http://' + myIp +':3000/login',
});

// Used as middleware on all routes
exports.myValidate = function(req, res, next){
  var liuTicket = req.session.liuTicket;
  var liuId = req.session.liuId;

  console.log('liuId:', liuId, ' liuTicket:', liuTicket);

  // Allow next handler if liuId and liuTicket is provided
  // in the cookie, or if the /login endpoint is requested
  if((liuTicket && liuId) || req.url.substring(0, 6) === '/login'){
    return next();
  }
  else {
    return res.redirect('/login');    
  }
}

exports.cas_login = function(req, res, next){

  //Get ticket from params
  var liuTicket = req.url.split('=')[1];

  if (liuTicket) {
    cas.validate(liuTicket, function(err, status, username) {
      if (err) {
        res.send({error: err});
      } else {
        req.session.liuTicket = liuTicket;
        req.session.liuId = username;
        res.redirect('/');
      }
    });
  } else {
    res.redirect('http://login.liu.se/cas?service=' + cas.service);
  }
};