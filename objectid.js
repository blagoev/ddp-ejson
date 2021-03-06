// Copyright (C) 2014 Vaughn Iverson
//
// Adapted from:
// https://github.com/meteor/meteor/blob/5a5204e3a468b7b498baefb259c88a63b23699cf/packages/minimongo/objectid.js
// https://github.com/meteor/meteor/blob/cc667a487f0f32cf592df14aae80f45d0b3b6d84/packages/random/random.js
//
// Copyright (C) 2011-2014 Meteor Development Group
//
// All contributions licensed under the MIT license: see LICENSE file in this directory

randomHexString = function(digits) {
  var result = Math.floor(Math.random()*16777215).toString(16);
  
  
  while (result.length < digits)
  {
    result = result + Math.floor(Math.random()*16777215).toString(16);  
  }
  
  return result.substring(0, digits);
}

looksLikeObjectID = function (str) {
  return str.length === 24 && str.match(/^[0-9a-f]*$/);
};

ObjectID = function (hexString) {
  // Make new optional
  if (!(this instanceof ObjectID))
    return new ObjectID(hexString);

  //random-based impl of Mongo ObjectID
  var self = this;
  if (hexString && (typeof hexString === 'string')) {
    hexString = hexString.toLowerCase();
    if (!looksLikeObjectID(hexString)) {
      throw new Error("Invalid hexadecimal string for creating an ObjectID");
    }
    // meant to work with _.isEqual(), which relies on structural equality
    self._str = hexString;
  } else {
    self._str = randomHexString(24);
  }
};

ObjectID.prototype.toString = function () {
  var self = this;
  return "ObjectID(\"" + self._str + "\")";
};

ObjectID.prototype.equals = function (other) {
  var self = this;
  return other instanceof ObjectID &&
    self.valueOf() === other.valueOf();
};

ObjectID.prototype.clone = function () {
  var self = this;
  return new ObjectID(self._str);
};

ObjectID.prototype.typeName = function() {
  return "oid";
};

// Only use this if mongodb made this ID, otherwise this will be nonsense
ObjectID.prototype.getTimestamp = function() {
  var self = this;
  return parseInt(self._str.substr(0, 8), 16);
};

ObjectID.prototype.valueOf =
    ObjectID.prototype.toJSONValue =
    ObjectID.prototype.toHexString =
    function () { return this._str; };

// Export ObjectID
module.exports = ObjectID
