/**
* @file `EnumClass` tests.
* @author Peter Goldsborough <peter@goldsborough.me>
* @license MIT
*/

'use strict';

var _ava = require('ava');

var _ava2 = _interopRequireDefault(_ava);

var _enumClass = require('./enum-class');

var _enumClass2 = _interopRequireDefault(_enumClass);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable new-cap */

(0, _ava2.default)('parses correct formats well', function (t) {
  var hasOwn = Object.hasOwnProperty;

  var E = (0, _enumClass2.default)('E', 'X, Y, Z');
  var expected = { X: [0, undefined], Y: [1, undefined], Z: [2, undefined] };
  for (var name in expected) {
    if (hasOwn.call(expected, name)) {
      t.is(E[name].name, name);
      t.is(E[name].ordinal, expected[name][0]);
      t.is(E[name].value, expected[name][1]);
    }
  }

  E = (0, _enumClass2.default)('E', 'X Y Z');
  for (var _name in expected) {
    if (hasOwn.call(expected, _name)) {
      t.is(E[_name].name, _name);
      t.is(E[_name].ordinal, expected[_name][0]);
      t.is(E[_name].value, expected[_name][1]);
    }
  }

  E = (0, _enumClass2.default)('E', ['X', 'Y', 'Z']);
  for (var _name2 in expected) {
    if (hasOwn.call(expected, _name2)) {
      t.is(E[_name2].name, _name2);
      t.is(E[_name2].ordinal, expected[_name2][0]);
      t.is(E[_name2].value, expected[_name2][1]);
    }
  }

  E = (0, _enumClass2.default)('E', 'X', 'Y', 'Z');
  for (var _name3 in expected) {
    if (hasOwn.call(expected, _name3)) {
      t.is(E[_name3].name, _name3);
      t.is(E[_name3].ordinal, expected[_name3][0]);
      t.is(E[_name3].value, expected[_name3][1]);
    }
  }

  var f = function f() {};
  E = (0, _enumClass2.default)('E', {
    X: f,
    Y: 'foo',
    Z: 123
  });

  expected = { X: [0, f], Y: [1, 'foo'], Z: [2, 123] };

  for (var _name4 in expected) {
    if (hasOwn.call(expected, _name4)) {
      t.is(E[_name4].name, _name4);
      t.is(E[_name4].ordinal, expected[_name4][0]);
      t.is(E[_name4].value, expected[_name4][1]);
    }
  }
});

(0, _ava2.default)('throws for incorrect formats', function (t) {
  t.throws(function () {
    (0, _enumClass2.default)(123);
  });
  t.throws(function () {
    (0, _enumClass2.default)('#$%@$%#$');
  });
});

(0, _ava2.default)('throws for duplicate members', function (t) {
  t.throws(function () {
    return (0, _enumClass2.default)('E', 'X, X');
  }, /unique/);

  t.throws(function () {
    var E = (0, _enumClass2.default)('E', 'X');
    E.add('X');
  }, /duplicate/);
});

(0, _ava2.default)('members of different classes compare false', function (t) {
  var E = (0, _enumClass2.default)('E', 'X, Y, Z');
  var F = (0, _enumClass2.default)('F', 'X, Y, Z');

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = E.names[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var name = _step.value;

      t.not(E[name], F[name]);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  t.is(E.X, E.X);
  t.is(E.X, E.X);
});

(0, _ava2.default)('members are immutable', function (t) {
  var E = (0, _enumClass2.default)('E', 'X');

  t.throws(function () {
    E.X.ordinal = -1;
  });

  t.throws(function () {
    E.X.name = 'asdfasfxasd';
  });

  t.throws(function () {
    E.X.value = function () {};
  });
});

(0, _ava2.default)('classes are immutable', function (t) {
  var E = (0, _enumClass2.default)('E', 'X, Y, Z');

  t.throws(function () {
    E.members.push(1);
  });

  t.throws(function () {
    E.length = -1;
  });
});

(0, _ava2.default)('throws when trying to instantiate directly', function (t) {
  var E = (0, _enumClass2.default)('E');
  t.throws(function () {
    return new E('X', '?');
  });
}, /permission/);

(0, _ava2.default)('contains works', function (t) {
  var members = 'X Y Z'.split(' ');
  var E = (0, _enumClass2.default)('E', members);

  t.true(members.every(E.contains.bind(E)));
  t.true(members.every(function (member) {
    return E.contains(E[member]);
  }));
  t.false(E.contains((0, _enumClass2.default)('A', 'A').A));
});

(0, _ava2.default)('members can be added through add', function (t) {
  var E = (0, _enumClass2.default)('E');
  t.is(E.length, 0);

  E.add('X');
  t.is(E.length, 1);
  t.true(E.contains('X'));
  t.is(E.X.name, 'X');
  t.is(E.X.ordinal, 0);
  t.is(E.X.value, undefined);

  E.add('Y', 'foo');
  t.is(E.length, 2);
  t.true(E.contains('Y'));
  t.is(E.Y.name, 'Y');
  t.is(E.Y.ordinal, 1);
  t.is(E.Y.value, 'foo');

  E.add({ Z: [1, 2, 3] });
  t.is(E.length, 3);
  t.true(E.contains('Z'));
  t.is(E.Z.name, 'Z');
  t.is(E.Z.ordinal, 2);
  t.deepEqual(E.Z.value, [1, 2, 3]);
});

(0, _ava2.default)('iteration works', function (t) {
  var E = (0, _enumClass2.default)('E', 'X, Y, Z');
  var expected = [E.X, E.Y, E.Z];

  var index = 0;
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = E[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var member = _step2.value;

      t.is(member, expected[index++]);
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }
});

(0, _ava2.default)('toString prints the name', function (t) {
  var E = (0, _enumClass2.default)('E', 'X');
  t.is(E.X.toString(), 'X');
});

(0, _ava2.default)('length stays up to date', function (t) {
  var E = (0, _enumClass2.default)('E', 'X, Y, Z');
  t.is(E.length, 3);

  for (var i = 1; i <= 100; ++i) {
    E.add(String(i));
    t.is(E.length, 3 + i);
  }
});