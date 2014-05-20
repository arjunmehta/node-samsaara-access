var core;


function initialize(samsaaraCore){

  core = samsaaraCore;


  if(samsaaraCore.capability.identity === true){

    AccessList.prototype.addUser = function(userID){
      this.users[userID] = true;
    };
    AccessList.prototype.removeUser = function(userID){
      delete this.users[userID];
    };

    AccessList.prototype.addUsers = function(userIDArray){
      for (var i = 0; i < userIDArray.length; i++) {
        this.users[userIDArray[i]] = true;
      }
    };
    AccessList.prototype.removeUsers = function(userIDArray){
      for (var i = 0; i < userIDArray.length; i++) {
        delete this.users[userIDArray[i]];
      }
    };
  }


  if(samsaaraCore.capability.groups === true){

    AccessList.prototype.addGroup = function(groupName){
      this.groups[groupName] = true;
    };
    AccessList.prototype.removeGroup = function(groupName){
      delete this.groups[groupName];
    };

    AccessList.prototype.addGroups = function(groupNameArray){
      for (var i = 0; i < groupNameArray.length; i++) {
        this.groups[groupNameArray[i]] = true;
      }
    };
    AccessList.prototype.removeGroups = function(groupNameArray){
      for (var i = 0; i < groupNameArray.length; i++) {
        delete this.groups[groupNameArray[i]];
      }
    };
  }
}



function AccessList(accessObject){
  if(samsaaraCore.capability.identity === true && accessObject.users){
    this.users = arrayToObject(accessObject.users || []);
  }
  if(samsaaraCore.capability.groups === true && accessObject.groups){
    this.groups = arrayToObject(accessObject.groups || []);
  }
}



function arrayToObject(array){
  var object = {};
  for (var i = 0; i < array.length; i++) {
    object[array[i]] = true;
  }
  return object;
}


module.exports = exports = {
  initialize: initialize,
  AccessList: AccessList
};