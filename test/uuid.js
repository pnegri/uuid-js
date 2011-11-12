var UUID = require('../lib/uuid');
var assert = require('assert');
var util = require('util');

exports['Check UUID methods'] = function() {
  var methods = [
    'maxFromBits',
    'limitUI04',
    'limitUI06',
    'limitUI08',
    'limitUI12',
    'limitUI14',
    'limitUI16',
    'limitUI32',
    'randomUI04',
    'randomUI06',
    'randomUI08',
    'randomUI12',
    'randomUI14',
    'randomUI16',
    'randomUI32',
    'randomUI40',
    'randomUI48',
    'paddedString',
    'new',
    'getTimeFieldValues',
    'newTS',
    'fromTime',
    'firstUUIDForTime',
    'lastUUIDForTime',
    'fromURN',
    'fromBytes',
    'fromBinary'
  ];
  var found = 0;
  for (var key in UUID) {
    if (methods.indexOf(key) !== -1) {
      found++;
      continue;
    }
    assert.ok(false, 'Found unexpected method: ' + key);
  }
  assert.equal(found, methods.length, 'Unexpected number of defined methods: ' + found + ' != ' + methods.length);
};

exports['Check UUID prototypes'] = function() {
  var methods = [
    'fromParts',
    'toString',
    'toURN',
    'toBytes',
    'equals'
  ];
  var found = 0;
  for (var key in UUID.prototype) {
    if (methods.indexOf(key) !== -1) {
      found++;
      continue;
    }
    assert.ok(false, 'Found unexpected prototype: ' + key);
  }
  assert.equal(found, methods.length, 'Unexpected number of defined prototypes: ' + found + ' != ' + methods.length);
};


exports['v4 UUID: uuid = UUID.new() -> test properties'] = function() {
  var uuid = UUID.new();

  var properties = [
    'version',
    'hex'
  ];
  var found = 0;
  for (var key in uuid) {
    // Filter prototypes
    if (!uuid.hasOwnProperty(key)) {
      continue;
    }
    if (properties.indexOf(key) !== -1) {
      found++;
      continue;
    }
    console.log(key);
    assert.ok(false, 'Found unexpected property in uuid instance: ' + key);
  }
  assert.equal(found, properties.length);

  assert.equal(uuid.version, 4, 'Unexpected version: ' + uuid.version);
  assert.ok(uuid.hex.match(/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/), 'UUID semantically incorrect');
};


exports['v4 UUID: uuid.toString()'] = function() {
  var uuid = UUID.new();
  assert.equal(uuid.toString(), uuid.hex);
};


exports['v4 UUID: uuid.toURN()'] = function() {
  var uuid = UUID.new();
  assert.equal(uuid.toURN(), 'urn:uuid:' + uuid.hex);
};


exports['v4 UUID: uuid.toBytes()'] = function() {
  var uuid = UUID.new();
  var bytes = uuid.toBytes();

  // Reassemble the bytes and check if they fit the string representation
  var hex = [];
  for (var i = 0; i < bytes.length; i++) {
    hex.push(bytes[i].toString(16));
  }
  var index = 0;
  var parts = [];
  [4, 2, 2, 2, 6].forEach(function(len) {
    var part = [];
    for (var j = 0; j < len; j++) {
      var val = hex[index]+"";
      if (val.length < 2) {
        val = "0" + val;
      }
      part.push(val);
      index++;
    }
    parts.push(part.join(''));
  });
  assert.equal(uuid.hex, parts.join('-'));
};

exports['v4 UUID: check that they are not time-ordered'] = function() {
  var unsorted = [];
  var sorted = [];
  for (var i = 0; i < 100; i++) {
    var uuid = UUID.new().toString();
    unsorted.push(uuid);
    sorted.push(uuid);
  }
  sorted.sort();
  assert.notDeepEqual(sorted, unsorted, 'v4 UUIDs appear to be sorted!');
};


exports['v1 UUID: uuid = UUID.newTS() -> test properties'] = function() {
  var uuid = UUID.newTS();

  var properties = [
    'version',
    'hex'
  ];
  var found = 0;
  for (var key in uuid) {
    // Filter prototypes
    if (!uuid.hasOwnProperty(key)) {
      continue;
    }
    if (properties.indexOf(key) !== -1) {
      found++;
      continue;
    }
    console.log(key);
    assert.ok(false, 'Found unexpected property in uuid instance: ' + key);
  }
  assert.equal(found, properties.length);

  assert.equal(uuid.version, 1, 'Unexpected version: ' + uuid.version);
  assert.ok(uuid.hex.match(/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/), 'UUID semantically incorrect');
};


exports['v1 UUID: uuid.toString()'] = function() {
  var uuid = UUID.newTS();
  assert.equal(uuid.toString(), uuid.hex);
};


exports['v1 UUID: uuid.toURN()'] = function() {
  var uuid = UUID.newTS();
  assert.equal(uuid.toURN(), 'urn:uuid:' + uuid.hex);
};


exports['v1 UUID: uuid.toBytes()'] = function() {
  var uuid = UUID.newTS();
  var bytes = uuid.toBytes();

  // Reassemble the bytes and check if they fit the string representation
  var hex = [];
  for (var i = 0; i < bytes.length; i++) {
    hex.push(bytes[i].toString(16));
  }
  var index = 0;
  var parts = [];
  [4, 2, 2, 2, 6].forEach(function(len) {
    var part = [];
    for (var j = 0; j < len; j++) {
      var val = hex[index]+"";
      if (val.length < 2) {
        val = "0" + val;
      }
      part.push(val);
      index++;
    }
    parts.push(part.join(''));
  });
  assert.equal(uuid.hex, parts.join('-'));
};


exports['v1 UUID: check that they are time-ordered'] = function() {
  var unsorted = [];
  var sorted = [];
  var check = function() {
    sorted.sort();
    assert.deepEqual(sorted, unsorted, 'v1 UUIDs appear not to be sorted!');
  };
  var i = 0;
  // We have to wait a tiny bit between generating two UUIDs to assure time
  // order since times are based on milliseconds and two UUIDs generated in
  // the same millisecond need not be different.
  var next = function() {
    var uuid = UUID.newTS().toString();
    unsorted.push(uuid);
    sorted.push(uuid);
    i++;
    if (i < 100) {
      return setTimeout(next, 5);
    }
    check();
  };
  next();
};

for (var key in exports) {
  exports[key]();
  console.log('✔ ' + key);
}
