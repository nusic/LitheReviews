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
  service: 'http://' + myIp +':3000/login'
});


//var sessionLifeTimeMillis = 5*60*1000;
var sessionLifeTimeMillis = 60*1000; // 10 seconds

var TicketMap = require('../models/TicketMap.js');
var tm = new TicketMap({lifeTimeInMillis: sessionLifeTimeMillis});


exports.myValidate = function(req, res, next){
  console.log(' *** my validate');

  if(req.url.substring(0, 6) === '/login'){
    console.log(' *** granting access to /login');
    return next();
  }

  var liuTicket = req.cookies.liuTicket;
  if(liuTicket && tm.has(liuTicket)){
    console.log(" *** authenticade as:", tm.getLiuId(liuTicket), '(' + liuTicket + ')');
    console.log(" *** res.session.liuTicket:", req.session.liuTicket);

    res.cookie('liuTicket', liuTicket, {maxAge: sessionLifeTimeMillis});
    tm.extendLifeTime(liuTicket);

    return next();
  }
  else{
    console.log(' *** no ticket -> redirecting to /login');
    res.redirect('/login');
  }
}

exports.cas_login = function(req, res, next) {
  console.log(' *** cas_login');
  var liuTicket = req.url.split('=')[1];
  liuTicket = liuTicket || req.session.liuTicket;
  console.log(' *** liuTicket:', liuTicket);
  if (liuTicket) {
    cas.validate(liuTicket, function(err, status, username) {
      if (err) {
        // Handle the error
        console.log(' *** validation error');
        res.send({error: err});
      } else {

        console.log(' *** setting ticket in local ticketMap and as client cookie');
        res.cookie('liuTicket', liuTicket, {maxAge: sessionLifeTimeMillis});
        tm.set(liuTicket, username);


        req.session.liuTicket = liuTicket;
        console.log(req.session);
        
        res.redirect('/');
      }
    });
  } else {
    console.log(' *** no ticket in url -> redirecting to CAS service');
    res.redirect('https://login.liu.se/cas?service=' + cas.service);
  }
};