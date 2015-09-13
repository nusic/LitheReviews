/**
 *
 * This class is responsible for setting/removing/validating
 * liuTickets locally in the node backend. 
 *
 */


/**
 *   Constructor
 */
function TicketMap(spec){
  this.map = {};

  this.lifeTime = spec.lifeTimeInMillis || 1000*60* (spec.lifeTimeInMinutes || 1.0);
  this.verbose = spec.verbose || false;
}

TicketMap.prototype.has = function(ticket) {
  this.log('has(' + ticket + ')');

  return this.map[ticket] !== undefined;
};

TicketMap.prototype.getLiuId = function(ticket) {
  this.log('getLiuId(' + ticket + ')');
  return this.map[ticket].liuId;
};

TicketMap.prototype.assertValid = function(ticket) {
  this.log('assertValid(' + ticket + ')');
  if(!this.has(ticket)){
    throw new Error('Invalid ticket: ' + ticket);
  }
};

TicketMap.prototype.set = function(ticket, liuId) {
  this.log('set(' + ticket +', ' + liuId + ')');
  this.map[ticket] = {
    liuId: liuId,
    timeout: this.getTimeoutObj(ticket),
  };
};

TicketMap.prototype.getTimeoutObj = function(ticket) {
  this.log('getTimeoutObj(' + ticket + ')');
  // Since the setTimeout function will execute at a 
  // later time, we need to create new scope (function) 
  // which we pass the ticketMap into. 
  function createTimeoutObj(ticketMap){
    return setTimeout(function(){
      ticketMap.log('ticket expires: ' + ticket);
      ticketMap.removeByTicket(ticket);
    }, ticketMap.lifeTime);
  };

  return createTimeoutObj(this);
};

TicketMap.prototype.extendLifeTime = function(ticket) {
  this.log('extendLifeTime(' + ticket + ')');
  this.assertValid(ticket);
  clearTimeout(this.map[ticket].timeout);
  //delete this.map[ticket].timeout;
  this.map[ticket].timeout = this.getTimeoutObj(ticket);
};

TicketMap.prototype.removeByTicket = function(ticket) {
  this.log('removeByTicket(' + ticket + ')');
  if(!this.has(ticket)) return false;

  clearTimeout(this.map[ticket].timeout);
  delete this.map[ticket];
  this.map[ticket] = undefined;
  return true;
};

TicketMap.prototype.removeByLiuId = function(liuId) {
  this.log('removeByLiuId(' + liuId + ')');
  for (var ticket in this.map){
    if(this.map.hasOwnProperty(ticket)){
      if(this.map[ticket] === liuId){
        return removeByTicket(ticket);
      }
    }
  }
  return false;
};

TicketMap.prototype.log = function(str) {
  if(this.verbose){
    console.log(str);
  }
};

module.exports = TicketMap;


