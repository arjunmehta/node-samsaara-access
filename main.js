

var accesses = {}; // holds sessions associated with userID ie: sessions[sessionID] = userID;

var accesslist = require("./accesslist");
var AccessList = accesslist.AccessList;

var options = {};


var access = {

  name: "access",

  clientScript: __dirname + '/client/samsaara-access.js', 

  main: {
    createAccess: createAccess,
    access: accessList,
    restrict: restrict
  },

  connectionPreInitialization: {
    access: connectionPreInitialization
  },

  constructors: {
    AccessList: AccessList
  },

  finalize: function finalizeAccess(){

    samsaaraCore.constructors.NameSpace.prototype.hasAccess = hasAccess;

    if(samsaaraCore.capability.groups){
      samsaaraCore.constructors.LocalGroup.prototype.hasAccess = hasAccess;
      samsaaraCore.constructors.GlobalGroup.prototype.hasAccess = hasAccess;
    }
    if(samsaaraCore.capability.contexts){
      samsaaraCore.constructors.Context.prototype.hasAccess = hasAccess;
    }
  }
};


// the root interface loaded by require. Options are pass in as options here.

function main(opts){
  if(opts){
    options = opts;
  }

  return initialize;
}


// samsaara will call this method when it's ready to load it into its middleware stack
// return your module's definition object. 

function initialize(samsaaraCore){
  accesslist.initialize(samsaaraCore);
  samsaaraCore.addClientFileRoute("samsaara-access.js", __dirname + '/client/samsaara-access.js');

  return access;
}


// main methods

function createAccess(accessName, accessSet){
  accesses[accessName] = new AccessList(accessSet);
}

function accessList(accessName){
  return accesses[accessName];
}


function restrict(object, methodArray, access){
  object.hasAccess = hasAccess;
  var samsaaraAccess = object.samsaaraAccess = {};
  for (var i = 0; i < methodArray.length; i++) {
    samsaaraAccess[methodArray[i]] = access;
  }
}


// this method does not exist on an object unless it has been explicitly restricted.
// We need a way of adding .hasAccess() to all new objects. yikes.
// currently supports groups, contexts, namespaces.


function hasAccess(connection, methodName){

  var connectionAccess = connection.access[this.id + methodName];

  // if access is cached on this connection

  if(connectionAccess === true){
    return this;
  }
  if(connectionAccess === false){
    return createDud(methodName);
  }


  var methodAccess = this.samsaaraAccess[methodName];

  if(methodAccess === undefined){ // if the method has not been restricted
    connection.access[this.id + methodName] = true; // cache access
    return this;
  }
  else{
    if(methodAccess.users){ // if the method has been restricted to certain users
      if(methodAccess.users[connection.getAttribute("userID")]){
        connection.access[this.id + methodName] = true; // cache access
        return this;
      }
    }
    if(methodAccess.groups){ // if the method has been restricted to certain groups
      for (var i = 0; i < connection.groups.length; i++) {        
        if(methodAccess.groups[connection.groups[i]]){
          connection.access[this.id + methodName] = true; // cache access
          return this;
        }
      }
    }
  }

  connection.access[this.id + methodName] = false;
  return createDud(methodName, {});   
  
}

function createDud(methodName, dud){
  dud[methodName] = function(){};
  return dud;
}

function connectionPreInitialization(connection){
  connection.access = {};
}



module.exports = exports = access;