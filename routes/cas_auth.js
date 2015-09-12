'use strict';

var CAS = require('cas');
var cas = new CAS({
  base_url: 'https://login.liu.se/cas', 
  service: 'http://localhost:3000/login_validation'
});


var sessionLifeTime = 60*1000; // life time

var TicketMap = require('../models/TicketMap.js');
var tm = new TicketMap(sessionLifeTime);


exports.myValidate = function(req, res, next){
  if(req.url === '/login'){
    return next();
  }
  if(req.url.substring(0, 17) === '/login_validation'){
    return next();
  }

  console.log(' *** my validate');
  var liuTicket = req.cookies.liuTicket;

  if(liuTicket && tm.has(liuTicket)){
    console.log("authenticade as:", tm.getLiuId(liuTicket));

    res.cookie('liuTicket', liuTicket, {maxAge: sessionLifeTime});
    tm.extendLifeTime(liuTicket);

    return next();
  }
  else{
    console.log('redirecting to /login');
    res.redirect('/login');
  }
}

exports.cas_login = function(req, res, next) {
  console.log(" *** cas_login");
  var liuTicket = req.url.split('=')[1];
  liuTicket = liuTicket || res.cookies && res.cookies.liuTicket;
  if (liuTicket) {
    cas.validate(liuTicket, function(err, status, username) {
      if (err) {
        // Handle the error
        res.send({error: err});
      } else {

        res.cookie('liuTicket', liuTicket, {maxAge: sessionLifeTime});
        tm.set(liuTicket, username);
        
        res.redirect('/');
      }
    });
  } else {
    res.redirect('https://login.liu.se/cas?service=' + cas.service);
  }
};