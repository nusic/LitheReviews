/**
 *
 * This class is responsible for setting/removing/validating
 * liuTickets locally in the node backend. 
 *
 */


/**
 *   Constructor
 */
function TicketMap(lifetimeInMillis){
  this.map = {};
  this.lifeTime = lifetimeInMillis;
}

TicketMap.prototype.has = function(ticket) {
  return this.map[ticket] !== undefined;
};

TicketMap.prototype.getLiuId = function(ticket) {
  return this.map[ticket].liuId;
};

TicketMap.prototype.assertValid = function(ticket) {
  if(!this.has(ticket)){
    throw new Error('Invalid ticket: ' + ticket);
  }
};

TicketMap.prototype.set = function(ticket, liuId) {
  this.map[ticket] = {
    liuId: liuId,
    timeout: this.getTimeoutObj(ticket),
  };
};

TicketMap.prototype.getTimeoutObj = function(ticket) {
  // Since the setTimeout function will execute at a 
  // later time, we need to create new scope (function) 
  // which we pass the ticketMap into. 
  function createTimeoutObj(ticketMap){
    return setTimeout(function(){
      console.log('ticket expires: ' + ticket);
      ticketMap.removeByTicket(ticket);
    }, ticketMap.lifeTime);
  };

  return createTimeoutObj(this);
};

TicketMap.prototype.extendLifeTime = function(ticket) {
  this.assertValid(ticket);
  clearTimeout(this.map[ticket].timeout);
  //delete this.map[ticket].timeout;
  this.map[ticket].timeout = this.getTimeoutObj(ticket);
};

TicketMap.prototype.removeByTicket = function(ticket) {
  if(!this.has(ticket)) return false;

  clearTimeout(this.map[ticket].timeout);
  delete this.map[ticket];
  this.map[ticket] = undefined;
  return true;
};

TicketMap.prototype.removeByLiuId = function(liuId) {
  for (var ticket in this.map){
    if(this.map.hasOwnProperty(ticket)){
      if(this.map[ticket] === liuId){
        return removeByTicket(ticket);
      }
    }
  }
  return false;
};

module.exports = TicketMap;


