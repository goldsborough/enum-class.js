/**
* @file Defines the `EnumClass` type.
* @author Peter Goldsborough <peter@goldsborough.me>
* @license MIT
*/

/**
 * An error thrown for permission errors.
 */
class EnumClassPermissionError extends Error {
  constructor() {
    super('No permission to call enum constructor');
  }
}

/**
 * An error thrown for definition errors.
 */
class EnumClassDefinitionError extends Error { }

/**
 * A symbol for the name enum property.
 * @type {Function}
 */
const _name = Symbol.for('enum.name');

/**
 * A symbol for the ordinal enum property.
 * @type {Function}
 */
const _ordinal = Symbol.for('enum.ordinal');

/**
 * A symbol for the value enum property.
 * @type {Function}
 */
const _value = Symbol.for('enum.value');

/**
 * A permission key symbol available only inside this module.
 * @type {Function}
 */
const _permission = Symbol.for(String(Math.random()));

/**
 * The base class for all user-defined enums.
 * @unrestricted
 */
class BaseEnumClass {

  /**
   * @param {string} name The name of the member.
   * @param {number} ordinal The ordinal of the member.
   * @param {*} value The value of the member.
   * @param {Function} permission The permission symbol.
   * @throws EnumClassPermissionError if the permission symbol
   *                                  is not passed or invalid.
   * @throws EnumClassDefinitionError if the name is not of string type.
   */
  constructor(name, ordinal, value, permission) {
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
  get name() {
    return this[_name];
  }

  /**
   * @return {number} The ordinal property of the enum class member.
   */
  get ordinal() {
    return this[_ordinal];
  }

  /**
   * @return {*} The value property of the enum class member.
   */
  get value() {
    return this[_value];
  }

  /**
   * @return {string} The name of the enum class of
   *                       which this instance is a member.
   */
  get type() {
    return this.constructor.name;
  }

  /**
   * @return {string} The name of the member.
   */
  toString() {
    return this.name;
  }
}

/**
 * A symbol for the members property of the `EnumClassIterator`.
 * @type {Function}
 */
const _members = Symbol.for('members');

/**
 * A symbol for the index property of the `EnumClassIterator`.
 * @type {Function}
 */
const _index = Symbol.for('index');

/**
 * An iterator over an enum class.
 * @unrestricted
 */
class EnumClassIterator {
  /**
   * Constructs the `EnumClassIterator` from an `EnumClass`.
   *
   * @param {Function} enumClass An `EnumClass`.
   */
  constructor(enumClass) {
    // eslint-disable-next-line dot-notation
    this[_members] = enumClass['members'];
    this[_index] = 0;
  }

  /**
   * Tests if the iterator is exhausted.
   * @return {boolean} True if the iterator is exhausted, else false.
   */
  get done() {
    return this[_index] === this[_members].length;
  }

  /**
   * @return {Object} The state of the iterator, as per the iterator protocol.
   */
  next() {
    if (this.done) return {done: true};
    return {
      done: false,
      value: this[_members][this[_index]++]
    };
  }
}

/**
 * Tests if an array contains only strings.
 * @param  {Arguments|Array} array The array to test.
 * @return {boolean} True if the array contains only strings, else false.
 */
function containsOnlyStrings(array) {
  // So we can also pass `arguments`
  return Array.prototype.every.call(array, element => {
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
  const object = {};

  // So we can also pass `arguments`
  // eslint-disable-next-line no-return-assign
  Array.prototype.forEach.call(array, name => {
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
  const set = {};

  for (let index = 0, stop = array.length; index < stop; ++index) {
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
 * @return {Object} An object with `(string, undefined)` pairs.
 */
function tryToMakeMemberObject(array) {
  if (containsOnlyStrings(array) && allAreUnique(array)) {
    return turnIntoObject(array);
  } else {
    throw new TypeError('Invalid format for enum members');
  }
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
    let match = members.match(/\w+/g);
    if (match && allAreUnique(match)) {
      return turnIntoObject(match);
    }
  } else if (Array.isArray(members)) {
    // ['A', 'B', 'C']
    return tryToMakeMemberObject(/** @type{!Array} */(members));
  } else if (typeof members === 'object') {
    return members;
  }

  throw new TypeError('Invalid format for enum members');
}

/**
 * Instantiates enum members from an object with `(name: value)` pairs.
 * @param {Function} enumClass An enum class.
 * @param  {Object} members An object of `(name: value)` pairs.
 * @return {Array} An array of enum instances.
 */
function instantiateMembers(enumClass, members) {
  const instances = [];

  for (let name in members) {
    if (members.hasOwnProperty(name)) {
      instances.push(enumClass.create(name, members[name]));
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
  const body = `return class ${name} extends Base {}`;
  // eslint-disable-next-line no-new-func
  return (new Function('Base', body))(Base);
}

/**
 * Defines and finalizes the enum class given its members.
 * @param  {string} name The name of the enum class to create.
 * @return {Function} The defined enum class.
 */
function defineEnumClass(name) {
  const enumClass = createEnumClass(name, BaseEnumClass);

  /**
   * An array of the members of the enum class.
   * @type {Array}
   */
  let members = [];

  /**
   * The length (number of members) of the enum class.
   * @type {number}
   */
  let length = 0;

  /**
   * Factory function for new enum class members.
   * @param {string|Object} name  The name of the member.
   * @param {*} value The value of the member.
   * @return {BaseEnumClass} The new member.
   */
  enumClass.create = function(name, value) {
    if (name in enumClass) {
      throw new EnumClassDefinitionError(
        'Attempted to create duplicate' +
        `enum class member '${name}'`
      );
    }

    // Allow passing { name: value } objects.
    if (typeof name === 'object') {
      const object = name;
      name = Object.keys(/** @type {!Object} */ (name))[0];
      value = object[name];
    }

    // eslint-disable-next-line new-cap
    const member = new enumClass(name, length, value, _permission);

    length += 1;
    members.push(member);
    enumClass[member.name] = member;

    return member;
  };

  /**
   * Defines a public, read-only length property mirroring the private length.
   */
  Object.defineProperty(enumClass, 'length', {
    get: function() { return length; }
  });

  /**
   * Defines a public, read-only members property mirroring the private length.
   */
  Object.defineProperty(enumClass, 'members', {
    get: function() { return Object.seal(members.slice()); }
  });

  /**
   * Defines a public, read-only array of the enum class' members' names.
   */
  Object.defineProperty(enumClass, 'names', {
    get: (function() {
      let names = null;
      return function() {
        if (!names) {
          names = members.map(member => member.name);
        }
        return names;
      };
    })()
  });

  /**
   * Returns the member with the given ordinal.
   * @param  {number} ordinal The ordinal for which to get the member.
   * @return {BaseEnumClass} The member with that ordinal (if * exists).
   */
  enumClass.at = function(ordinal) {
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
  enumClass.contains = function(member) {
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
  enumClass.isMember = function(member) {
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
  enumClass[Symbol.iterator] = function() {
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
export default function EnumClass(name) {
  const enumClass = defineEnumClass(name);

  const args = Array.prototype.slice.call(arguments, 1);
  if (args.length > 0) {
    const members = parseMembers.apply(null, args);
    instantiateMembers(enumClass, members);
  }

  return enumClass;
}
