'use strict'

/**
 * @author Suneet Agera, Christian Warmuth
 * @version 1.0
 */

const request = require('request');
const crypto = require('crypto');

/* Configuration libraries    */
const projectSettingsMir = require('../../../config/vendor/Mir.ProjectSettings');

/* Mir specific variables    */
const hostname = projectSettingsMir.vendor_cloud_hostname;
const port = projectSettingsMir.vendor_cloud_port;
const proxy = projectSettingsMir.vendor_cloud_proxy;
const username = projectSettingsMir.vendor_cloud_username;
const password = projectSettingsMir.vendor_cloud_password;
const endPoint = projectSettingsMir.vendor_cloud_endpoint;

// #region Get Requests

/**
 * Returns the computed hash/base64 combination needed for authorization
 * @param {String} username Username for the MIR
 * @param {String} password Password for the MIR
 * @return {String} authorizationHash
 */
function computeHash(username, password) {
  // required format BASE64( <username>:SHA-256( <password> ))
  let hash = crypto.createHash('sha256').update(password).digest('hex');
  let authorizationHash = Buffer.from(username + ':' + hash).toString('base64');
  return authorizationHash;
}

/**
 * Makes the GET-Request to get all positions
 * @param {String} authorizationHash Username for the MIR
 * @param {callback} callback passed with the body if successfull
 */
function getPositions(authorizationHash, callback) {
  let options = {
    method: 'GET',
    url: hostname + endPoint + 'positions',
    headers: {
      'Cache-Control': 'no-cache',
      Authorization: 'Basic ' + authorizationHash
    }
  };

  request(options, function (error, response, body) {
    if (error) {
      callback(new Error(error), null);
    } else callback(null, JSON.parse(body));
  });
}

/**
 * Makes the GET-Request to get all Maps
 * @param {String} authorizationHash Username for the MIR
 * @param {callback} callback passed with the body if successfull
 */
function getMaps(authorizationHash, callback) {
  let options = {
    method: 'GET',
    url: hostname + endPoint + 'maps',
    headers: {
      'Cache-Control': 'no-cache',
      Authorization: 'Basic ' + authorizationHash
    }
  };

  request(options, function (error, response, body) {
    if (error) {
      callback(new Error(error), null);
    } else callback(null, JSON.parse(body));
  });
}

/**
 * Makes the GET-Request to get the sessions
 * @param {String} authorizationHash Username for the MIR
 * @param {callback} callback passed with the body if successfull
 */
function getSessions(authorizationHash, callback) {
  let options = {
    method: 'GET',
    url: hostname + endPoint + 'sessions',
    headers: {
      'Cache-Control': 'no-cache',
      Authorization: 'Basic ' + authorizationHash
    }
  };

  request(options, function (error, response, body) {
    if (error) {
      callback(new Error(error), null);
    } else callback(null, JSON.parse(body));
  })
}

/**
 * Makes the Get-Request to get all Missions
 * @param {String} authorizationHash Username for the MIR
 * @param {callback} callback passed with the body if successfull
 */
function getMissions(authorizationHash, callback) {
  var options = {
    method: 'GET',
    url: hostname + endPoint + 'missions',
    headers: {
      'Cache-Control': 'no-cache',
      Authorization: 'Basic ' + authorizationHash
    }
  };

  request(options, function (error, response, body) {
    if (error) {
      callback(new Error(error), null);
    } else callback(null, JSON.parse(body));
  })
}

// #endregion

// #region post Requests

/**
 * Makes the Post-Request to set a Mission into the queue
 * @param {String} authorizationHash Username for the MIR
 * @param {String} mission_id Mission that will be asigned to the queue
 * @param {String} paramInputName name of the parameter used for the Mission
 * @param {String} paramInputValue Value of the parameter used for the Mission
 * @param {callback} callback passed with the body if successfull
 */
function postMissionQueue(authorizationHash, mission_id, paramInputName, paramInputValue, callback) {
  let options = {
    method: 'POST',
    url: hostname + endPoint + 'mission_queue',
    headers: {
      Authorization: 'Basic ' + authorizationHash,
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/json'
    },
    body: {
      mission_id: mission_id,
      parameters: [
        {
          input_name: paramInputName,
          value: paramInputValue
        }
      ]
    },
    json: true
  };

  request(options, function (error, response, body) {
    if (error) {
      callback(new Error(error), null);
    } else callback(null, body);
  })
}

/**
 * Makes the POST-Request to set a new mission
 * @param {String} authorizationHash Username for the MIR
 * @param {String} missionName Name for the new Mission
 * @param {String} missionGroupId Group ID of the new Mission
 * @param {boolean} missionHidden Is the Mission hidden
 * @param {function} callback
 */
function postMission(
  authorizationHash,
  missionName,
  missionGroupId,
  missionHidden,
  callback
) {
  let options = {
    method: 'POST',
    url: hostname + endPoint + 'missions',
    headers: {
      'Cache-Control': 'no-cache',
      Authorization: 'Basic ' + authorizationHash,
      'Content-Type': 'application/json'
    },
    body: {
      name: missionName,
      group_id: missionGroupId,
      hidden: missionHidden
    },
    json: true
  };

  request(options, function (error, response, body) {
    if (error) { callback(error, null); }
    callback(null, body);
  });
}

/**
 * Add a new position
 * @param {String} authorizationHash 
 * @param {String} mapID 
 * @param {Number} posX 
 * @param {Number} posY 
 * @param {Number} posOrientation 
 * @param {String} positionName 
 * @param {Number} positionType 
 */
function postPosition(authorizationHash, mapID, posX, posY, posOrientation, positionName, positionType, callback) {
  var options = {
    method: 'POST',
    url: hostname + endPoint + 'positions',
    headers:
      {
        'Cache-Control': 'no-cache',
        Authorization: 'Basic ' + authorizationHash,
        'Accept-Language': 'en_US',
        'Content-Type': 'application/json'
      },
    body:
      {
        name: positionName,
        pos_x: posX,
        pos_y: posY,
        orientation: posOrientation,
        type_id: positionType,
        map_id: mapID,

      },
    json: true
  };

  request(options, function (error, response, body) {
    if (error) callback(error, null)
    callback(null, body)
  });
}

/**
 * Adds an Action to a mission
 * @param {String} authorizationHash 
 * @param {String} missionGuid 
 * @param {Object} parameters (positionInputName, positionValue, retires, distanceThreshold)
 * @param {function} callback
 */
function postMissionAction(authorizationHash, missionGuid, parameters, callback) {
  var options = {
    method: 'POST',
    url: hostname + endPoint + 'missions/' + missionGuid + '/actions',
    headers:
      {
        'Cache-Control': 'no-cache',
        Authorization: 'Basic ' + authorizationHash,
        'Content-Type': 'application/json',
        'Accept-Language': 'en_US'
      },
    body:
      {
        action_type: parameters.actionType,                 //Question: what other action_types are there besides 'Move'
        parameters:
          [{
            id: 'position',
            input_name: parameters.positionInputName, //askVar
            value: parameters.positionValue    //'mir-guid-0000-0000-0001-positions001'
          },
          { id: 'retries', input_name: null, value: parameters.retries },    // 10
          { id: 'distance_threshold', input_name: null, value: parameters.distanceThreshold }],
        priority: 1
      },
    json: true
  };

  request(options, function (error, response, body) {
    if (error) callback(error, null);
    callback(null, body);
  });
}

// #endregion

// #region delete Requests

/**
 * Deletes a given position
 * @param {String} authorizationHash 
 * @param {String} guid 
 */
function deletePosition(authorizationHash, guid) {

  var options = {
    method: 'DELETE',
    url: hostname + endPoint + 'positions' + "/" + guid,
    headers:
      {
        'Cache-Control': 'no-cache',
        Authorization: 'Basic ' + authorizationHash,
        Accept: 'application/json',
        'Accept-Language': 'en_US'
      }
  };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    console.log(body);
  });

}

/**
 * 
 * @param {*} authorizationHash 
 * @param {*} missionGuid 
 * @param {*} callback 
 */
function deleteMission(authorizationHash, missionGuid, callback) {

  var options = {
    method: 'DELETE',
    url: hostname + endPoint + '/missions/' + missionGuid,
    headers:

      {
        'Cache-Control': 'no-cache',
        Authorization: 'Basic ' + authorizationHash,
      }
  };

  request(options, function (error, response, body) {
    if (error) callback(error, null);
    callback(null, body);
  });

}

// #endregion

// #region supportive functions

/**
 * Returns the GUID of the Map that refers the the given Name
 * @param {JSON} JSONbody body of JSON (result of the getPositions method)
 * @param {String} MapName Mapname from which the guid is needed
 * @param {callback} callback passed with the GUID if funciton proceeds successfull
 */

function getMapGuidFromJSONBody(JSONbody, MapName) {
  // Extract the GUIDs from the body
  let allAvailiableMaps = [];
  for (let i = 0; i < JSONbody.length; i++) {
    allAvailiableMaps.push(JSONbody[i].name);
  }

  // search for the position where the GUID is (if it matches at all)
  let arrayElementWithMap;
  for (let x = 0; x < allAvailiableMaps.length; x++) {
    if (MapName == allAvailiableMaps[x]) arrayElementWithMap = x;

  }
  // If the GUID was found -
  if (arrayElementWithMap) {
    return (JSONbody[arrayElementWithMap].guid);
  } else return 'Map Guid not found';
}

/**
 * Returns the GUID of the Position that refers the the given BinId
 * @param {JSON} JSONbody body of JSON (result of the getPositions method)
 * @param {String} BinID BINID from which the guid is needed
 * @param {callback} callback passed with the GUID if funciton proceeds successfull
 */

function getPositionGuidFromJSONBody(JSONbody, BinID) {
  // Extract the GUIDs from the body
  let allAvailiablePositions = [];
  for (let i = 0; i < JSONbody.length; i++) {
    allAvailiablePositions.push(JSONbody[i].name);
  }

  // search for the position where the GUID is (if it matches at all)
  let arrayElementWithPosition;
  for (let x = 0; x < allAvailiablePositions.length; x++) {
    if (BinID == allAvailiablePositions[x]) arrayElementWithPosition = x;

  }
  // If the GUID was found -
  if (arrayElementWithPosition) {
    return (JSONbody[arrayElementWithPosition].guid);
  } else return 'Position Guid not found';
}

/**
 * Returns the Mission-GUID that refers the the given MissionId
 * @param {JSON} JSONbody body of JSON (result of the getMission method)
 * @param {String} MissionID Mission from which the guid is needed
 * @param {callback} callback passed with the GUID if funciton proceeds successfull
 */
function getMissionGuidFromJSONBody(JSONbody, MissionID) {
  // Extract the GUIDs from the body
  let allAvailiableMissions = [];
  for (let i = 0; i < JSONbody.length; i++) {
    allAvailiableMissions.push(JSONbody[i].name);
  }

  // search for the Missions where the GUID is (if it matches at all)
  let arrayElementWithMission;
  for (let x = 0; x < allAvailiableMissions.length; x++) {
    if (MissionID == allAvailiableMissions[x]) {
      arrayElementWithMission = x;
    }
  }
  // If the GUID was found -
  if (arrayElementWithMission) {
    return (JSONbody[arrayElementWithMission].guid);
  } else return "Mission Guid not found";
}

/**
 * returns the missionGuid after it was created
 * @param {String} body 
 */
function getMissionGuid(body) {
  return body.guid;
}


/**
 * Move the robot to special BinId
 * @param {String} BinId binId to move to
 * @param {String} MisisonName MissionName to which this move is assigned to
 * @param {String} RobotName Name of robot to move to this bin
 */
function moveToBin(BinId, MissionName, RobotName) {
  let missionName = typeof MissionName !== 'undefined' ? MissionName : 'Navigate to warehouse bin'; // For the incrementatal development (to be changed afterwards)
  let paramName = 'askVar';
  let passwordHash = computeHash(username, password);

  getPositions(passwordHash, function (err, body) {
    if (err) { return console.error(err); }
    let getPositionGuidResult = getPositionGuidFromJSONBody(body, BinId);
    if (getPositionGuidResult === "Position Guid not found") { return console.error(getPositionGuidResult) }
    getMissions(passwordHash, function (err, missions) {
      if (err) { return console.error(err); }
      let getMissionGuidResult = getMissionGuidFromJSONBody(missions, missionName);
      if (getMissionGuidResult === 'Mission Guid not found') { return console.error(getMissionGuidResult); }
      postMissionQueue(passwordHash, getMissionGuidResult, paramName, getPositionGuidResult, function (err, result) {
        if (err) { return console.error(err); }
        console.log(result);
      });
    });
  });
}

/**
 * 
 * @param {*} robotName 
 * @param {*} position 
 * @param {*} MapName 
 * @param {*} groupMissionName 
 */
function moveToPosition(robotName, position, MapName, groupMissionName) {
  groupMissionName = 'mirconst-guid-0000-0011-missiongroup';        //To be changed (assign it to another MissionGroup)
  let passwordHash = computeHash(username, password);

  getMaps(passwordHash, function (err, maps) {
    if (err) { return console.error(err); }
    let getMapGuidResult = getMapGuidFromJSONBody(maps, MapName);
    if (getMapGuidResult === 'Mission Guid not found') { return console.error(getMissionGuidResult); }
    postPosition(passwordHash, getMapGuidResult, position.x, position.y, position.orientation, position.name, position.type, function (err, result) {
      if (err) { return console.error(err); }
      console.log(result);
      postMission(passwordHash, "Auto-Generated Mission", groupMissionName, false, function (err, body) {
        if (err) { console.error(err); }
        let missionGuid = getMissionGuid(body);
        postMissionAction(passwordHash, missionGuid, { actionType: "move", positionInputName: "askVar", positionValue: "0de4ae9d-31fc-11e8-832d-94c691159cd4", retries: 10, distanceThreshold: 0.1 }, function (err, result) {
          if (err) { return console.error(err); }
          postMissionQueue(passwordHash, missionGuid, "askVar", "0de4ae9d-31fc-11e8-832d-94c691159cd4", function (err, result) {
            if (err) { return console.error(err); }
            console.log(result);
            deleteMission(passwordHash, missionGuid, function (err, result) {
              if (err) { return console.error(err); }
              console.log(result);
              console.log(" ------ Function finished ------------------");
            });
          });

        });   //    (if the MissionGroup does not exist yet - create it, to be changed - but what is the icon of mission)

        //Postion missionAction (zu dem vorhin erstellten Punkt fahren)
        //Mission in Queue
        //Warten bis mission abgebrochen wurde
      });
    });


  });
}
// #endregion

// #region functions to export


moveToPosition("Mir", { x: 10, y: 10, orientation: 0, name: "Test Position", type: 0 }, "Team Area", "mirconst-guid-0000-0005-users0000000");


module.exports = {
  moveRobotToBin: function (BinID, MissionName, RobotName) {
    moveToBin(BinID, MissionName, RobotName);
  },
  moveRobotToPosition: function (RobotName, Position) {
    moveToPosition(RobotName, Position);
  }
}
//#endregion
