'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = EnumClass;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
* @file Defines the `EnumClass` type.
* @author Peter Goldsborough <peter@goldsborough.me>
* @license MIT
*/

/**
 * An error thrown for permission errors.
 */
var EnumClassPermissionError = exports.EnumClassPermissionError = function (_Error) {
  _inherits(EnumClassPermissionError, _Error);

  function EnumClassPermissionError() {
    _classCallCheck(this, EnumClassPermissionError);

    return _possibleConstructorReturn(this, (EnumClassPermissionError.__proto__ || Object.getPrototypeOf(EnumClassPermissionError)).call(this, 'No permission to call enum constructor'));
  }

  return EnumClassPermissionError;
}(Error);

/**
 * An error thrown for definition errors.
 */


var EnumClassDefinitionError = exports.EnumClassDefinitionError = function (_Error2) {
  _inherits(EnumClassDefinitionError, _Error2);

  function EnumClassDefinitionError() {
    _classCallCheck(this, EnumClassDefinitionError);

    return _possibleConstructorReturn(this, (EnumClassDefinitionError.__proto__ || Object.getPrototypeOf(EnumClassDefinitionError)).apply(this, arguments));
  }

  return EnumClassDefinitionError;
}(Error);

/**
 * A symbol for the name enum property.
 * @type {Function}
 */


var _name = Symbol.for('enum.name');

/**
 * A symbol for the ordinal enum property.
 * @type {Function}
 */
var _ordinal = Symbol.for('enum.ordinal');

/**
 * A symbol for the value enum property.
 * @type {Function}
 */
var _value = Symbol.for('enum.value');

/**
 * A permission key symbol available only inside this module.
 * @type {Function}
 */
var _permission = Symbol.for(String(Math.random()));

/**
 * The base class for all user-defined enums.
 * @unrestricted
 */

var BaseEnumClass = function () {

  /**
   * @param {string} name The name of the member.
   * @param {number} ordinal The ordinal of the member.
   * @param {*} value The value of the member.
   * @param {Function} permission The permission symbol.
   * @throws EnumClassPermissionError if the permission symbol
   *                                  is not passed or invalid.
   * @throws EnumClassDefinitionError if the name is not of string type.
   */
  function BaseEnumClass(name, ordinal, value, permission) {
    _classCallCheck(this, BaseEnumClass);

    if (permission !== _permission) {
      throw new EnumClassPermissionError();
    }

    if (typeof name !== 'string') {
      throw new EnumClassDefinitionError('Name member must be a string');
    }

    /**
     * The name of the enum class member.
     * @type {string}
     */
    this[_name] = name;

    /**
     * The unique ordinal of the enum class member.
     * @type {number}
     */
    this[_ordinal] = ordinal;

    /**
     * The value of the enum class member.
     * @type {*}
     */
    this[_value] = value;

    // Immutable forever
    Object.freeze(this);
  }

  /**
   * @return {string} The name property of the enum class member
   */


  _createClass(BaseEnumClass, [{
    key: 'toString',


    /**
     * @return {string} The name of the member.
     */
    value: function toString() {
      return this.name;
    }
  }, {
    key: 'name',
    get: function get() {
      return this[_name];
    }

    /**
     * @return {number} The ordinal property of the enum class member.
     */

  }, {
    key: 'ordinal',
    get: function get() {
      return this[_ordinal];
    }

    /**
     * @return {*} The value property of the enum class member.
     */

  }, {
    key: 'value',
    get: function get() {
      return this[_value];
    }

    /**
     * @return {string} The name of the enum class of
     *                       which this instance is a member.
     */

  }, {
    key: 'type',
    get: function get() {
      return this.constructor.name;
    }
  }]);

  return BaseEnumClass;
}();

/**
 * A symbol for the members property of the `EnumClassIterator`.
 * @type {Function}
 */


var _members = Symbol.for('members');

/**
 * A symbol for the index property of the `EnumClassIterator`.
 * @type {Function}
 */
var _index = Symbol.for('index');

/**
 * An iterator over an enum class.
 * @unrestricted
 */

var EnumClassIterator = function () {
  /**
   * Constructs the `EnumClassIterator` from an `EnumClass`.
   *
   * @param {Function} enumClass An `EnumClass`.
   */
  function EnumClassIterator(enumClass) {
    _classCallCheck(this, EnumClassIterator);

    // eslint-disable-next-line dot-notation
    this[_members] = enumClass['members'];
    this[_index] = 0;
  }

  /**
   * Tests if the iterator is exhausted.
   * @return {boolean} True if the iterator is exhausted, else false.
   */


  _createClass(EnumClassIterator, [{
    key: 'next',


    /**
     * @return {Object} The state of the iterator, as per the iterator protocol.
     */
    value: function next() {
      if (this.done) return { done: true };
      return {
        done: false,
        value: this[_members][this[_index]++]
      };
    }
  }, {
    key: 'done',
    get: function get() {
      return this[_index] === this[_members].length;
    }
  }]);

  return EnumClassIterator;
}();

/**
 * Tests if an array contains only strings.
 * @param  {Arguments|Array} array The array to test.
 * @return {boolean} True if the array contains only strings, else false.
 */


function containsOnlyStrings(array) {
  // So we can also pass `arguments`
  return Array.prototype.every.call(array, function (element) {
    return typeof element === 'string';
  });
}

/**
 * Turns an array into an object suitable for enum creation.
 *
 * The object maps names to values, in this case all `undefined`.
 *
 * @param  {Arguments|Array} array The array to turn into an object.
 * @return {Object} An object with `(string, undefined)` pairs.
 */
function turnIntoObject(array) {
  var object = {};

  // So we can also pass `arguments`
  // eslint-disable-next-line no-return-assign
  Array.prototype.forEach.call(array, function (name) {
    object[name] = undefined;
  });

  return object;
}

/**
 * Tests if an array contains only unique keys.
 * @param  {Arguments|Array} array The array to test.
 * @return {boolean} True if the array is unique, else false.
 */
function allAreUnique(array) {
  var set = {};

  for (var index = 0, stop = array.length; index < stop; ++index) {
    if (array[index] in set) return false;
    set[array[index]] = true;
  }

  return true;
}

/**
 * Attempts to turn an array of members into an object.
 *
 * The array must contain only strings and all must be unique.
 *
 * @param  {Arguments|Array} array An array of strings.
 * @param {boolean=} checkStrings Whether to check if the
 *                                array contains only strings.
 * @return {Object} An object with `(string, undefined)` pairs.
 */
function tryToMakeMemberObject(array, checkStrings) {
  checkStrings = checkStrings === undefined ? true : checkStrings;
  if (checkStrings && !containsOnlyStrings(array)) {
    throw new EnumClassDefinitionError('Invalid format for enum members');
  } else if (!allAreUnique(array)) {
    throw new EnumClassDefinitionError('Enum member names must be unique');
  }

  return turnIntoObject(array);
}

/**
 * Parses the members argument and ensures their correct format.
 *
 * Allowed formats are:
 * // 'A', 'B', 'C'
 * // 'A, B, C'
 * // 'A B C'
 * // ['A', 'B', 'C']
 * // {A: 1, B: 2}
 *
 * @param  {String|Object|Array} members The members.
 * @return {Object} An object of `(name, value)` pairs.
 */
function parseMembers(members) {
  if (arguments.length > 1) {
    // 'A', 'B', 'C'
    return tryToMakeMemberObject(arguments);
  } else if (typeof members === 'string') {
    // 'A, B, C' or 'A B C'
    var match = members.match(/\w+/g);
    return tryToMakeMemberObject(match, false);
  } else if (Array.isArray(members)) {
    // ['A', 'B', 'C']
    return tryToMakeMemberObject( /** @type {!Array} */members);
  } else if ((typeof members === 'undefined' ? 'undefined' : _typeof(members)) === 'object') {
    return members;
  }

  throw new EnumClassDefinitionError('Invalid format for enum members');
}

/**
 * Instantiates enum members from an object with `(name: value)` pairs.
 * @param {Function} enumClass An enum class.
 * @param  {Object} members An object of `(name: value)` pairs.
 * @return {Array} An array of enum instances.
 */
function instantiateMembers(enumClass, members) {
  var instances = [];

  for (var name in members) {
    if (members.hasOwnProperty(name)) {
      instances.push(enumClass.add(name, members[name]));
    }
  }

  return instances;
}

/**
 * Creates a new enum with the given name.
 *
 * Enums all have a name, an ordinal and a value.
 *
 * @param  {string} name The name for the enum to create.
 * @param {Function} Base The base class from which to inherit the enum class.
 * @return {Function} A new enum class object.
 */
function createEnumClass(name, Base) {
  var body = 'return class ' + name + ' extends Base {}';
  // eslint-disable-next-line no-new-func
  return new Function('Base', body)(Base);
}

/**
 * Defines and finalizes the enum class given its members.
 * @param  {string} name The name of the enum class to create.
 * @return {Function} The defined enum class.
 */
function defineEnumClass(name) {
  var enumClass = createEnumClass(name, BaseEnumClass);

  /**
   * An array of the members of the enum class.
   * @type {Array}
   */
  var members = [];

  /**
   * The length (number of members) of the enum class.
   * @type {number}
   */
  var length = 0;

  /**
   * Factory function for new enum class members.
   * @param {string|Object} name  The name of the member.
   * @param {*} value The value of the member.
   * @return {BaseEnumClass} The new member.
   */
  enumClass.add = function (name, value) {
    if (name in enumClass) {
      throw new EnumClassDefinitionError('Attempted to add duplicate ' + ('enum class member \'' + name + '\''));
    }

    // Allow passing { name: value } objects.
    if ((typeof name === 'undefined' ? 'undefined' : _typeof(name)) === 'object') {
      var object = name;
      name = Object.keys( /** @type {!Object} */name)[0];
      value = object[name];
    }

    // eslint-disable-next-line new-cap
    var member = new enumClass(name, length, value, _permission);

    length += 1;
    members.push(member);
    enumClass[member.name] = member;

    return member;
  };

  /**
   * Defines a public, read-only length property mirroring the private length.
   */
  Object.defineProperty(enumClass, 'length', {
    get: function get() {
      return length;
    }
  });

  /**
   * Defines a public, read-only members property mirroring the private length.
   */
  Object.defineProperty(enumClass, 'members', {
    get: function get() {
      return Object.seal(members.slice());
    }
  });

  /**
   * Defines a public, read-only array of the enum class' members' names.
   */
  Object.defineProperty(enumClass, 'names', {
    get: function () {
      var names = null;
      return function () {
        if (!names) {
          names = members.map(function (member) {
            return member.name;
          });
        }
        return names;
      };
    }()
  });

  /**
   * Returns the member with the given ordinal.
   * @param  {number} ordinal The ordinal for which to get the member.
   * @return {BaseEnumClass} The member with that ordinal (if * exists).
   */
  enumClass.at = function (ordinal) {
    // eslint-disable-next-line dot-notation
    return enumClass['members'][ordinal];
  };

  /**
   * Tests if the given argument is a member of this enum class.
   *
   * If the argument is a string, the method tests  if * member has such a
   * name. Else, it performs membership test just like `isMember()`.
   *
   * @param  {string|BaseEnumClass|null} member The member to test for.
   * @return {boolean} True if the argument is a member, else false.
   * @see enumClass.isMember
   */
  enumClass.contains = function (member) {
    if (typeof member === 'string') {
      return member in this;
    } else {
      return enumClass.isMember(member);
    }
  };

  /**
   * Tests if the given object is a member of this enum class.
   *
   * Equialent to `member instanceof <class>`.
   *
   * @param  {Object}  member An object to test membership for.
   * @return {boolean}        [description]
   * @see enumClass.contains
   */
  enumClass.isMember = function (member) {
    return member instanceof this;
  };

  /**
   * Returns an iterator following the iterator protocol.
   *
   * This allows iteration of the enum's members via `for ... of` loops.
   * @see [Iterator Protocol on MDN]{@link https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Iteration_protocols}
   *
   * @return {EnumClassIterator} An iterator over the enum class.
   */
  enumClass[Symbol.iterator] = function () {
    return new EnumClassIterator(this);
  };

  return enumClass;
}

/**
 * creates a new enum class.
 *
 * This will create a class with static members of its own type.
 * The members are derived from the argument(s) after `name`,
 * which can be one of several formats (see `parseMembers`).
 *
 * @param {string} name The name of the enum to create.
 * @return {Function} A new class.
 */
function EnumClass(name) {
  var enumClass = defineEnumClass(name);

  var args = Array.prototype.slice.call(arguments, 1);
  if (args.length > 0) {
    var members = parseMembers.apply(null, args);
    instantiateMembers(enumClass, members);
  }

  return enumClass;
}