import test from 'ava';
import EnumClass from './transpiled/enum-class';

/* eslint-disable new-cap */

test('parses correct formats well', t => {
  const hasOwn = Object.hasOwnProperty;

  let E = EnumClass('E', 'X, Y, Z');
  let expected = {X: [0, undefined], Y: [1, undefined], Z: [2, undefined]};
  for (let name in expected) {
    if (hasOwn.call(expected, name)) {
      t.is(E[name].name, name);
      t.is(E[name].ordinal, expected[name][0]);
      t.is(E[name].value, expected[name][1]);
    }
  }

  E = EnumClass('E', 'X Y Z');
  for (let name in expected) {
    if (hasOwn.call(expected, name)) {
      t.is(E[name].name, name);
      t.is(E[name].ordinal, expected[name][0]);
      t.is(E[name].value, expected[name][1]);
    }
  }

  E = EnumClass('E', ['X', 'Y', 'Z']);
  for (let name in expected) {
    if (hasOwn.call(expected, name)) {
      t.is(E[name].name, name);
      t.is(E[name].ordinal, expected[name][0]);
      t.is(E[name].value, expected[name][1]);
    }
  }

  E = EnumClass('E', 'X', 'Y', 'Z');
  for (let name in expected) {
    if (hasOwn.call(expected, name)) {
      t.is(E[name].name, name);
      t.is(E[name].ordinal, expected[name][0]);
      t.is(E[name].value, expected[name][1]);
    }
  }

  const f = function() { };
  E = EnumClass('E', {
    X: f,
    Y: 'foo',
    Z: 123
  });

  expected = {X: [0, f], Y: [1, 'foo'], Z: [2, 123]};

  for (let name in expected) {
    if (hasOwn.call(expected, name)) {
      t.is(E[name].name, name);
      t.is(E[name].ordinal, expected[name][0]);
      t.is(E[name].value, expected[name][1]);
    }
  }
});

test('throws for incorrect formats', t => {
  t.throws(() => { EnumClass(123); });
  t.throws(() => { EnumClass('#$%@$%#$'); });
});

test('throws for duplicate members', t => {
  t.throws(() => EnumClass('E', 'X, X'));

  // t.throws(() => {
  //   const E = EnumClass('E', 'X');
  //   E.create('X');
  // });
});

test('members of different classes compare false', t => {
  const E = EnumClass('E', 'X, Y, Z');
  const F = EnumClass('F', 'X, Y, Z');

  for (let name of E.names) {
    t.not(E[name], F[name]);
  }

  t.is(E.X, E.X);
  t.is(E.X, E.X);
});

test('members are immutable', t => {
  const E = EnumClass('E', 'X');

  t.throws(() => {
    E.X.ordinal = -1;
  });

  t.throws(() => {
    E.X.name = 'asdfasfxasd';
  });

  t.throws(() => {
    E.X.value = function() {};
  });
});

test('classes are immutable', t => {
  const E = EnumClass('E', 'X, Y, Z');

  t.throws(() => {
    E.members.push(1);
  });

  t.throws(() => {
    E.length = -1;
  });
});

test('throws when trying to instantiate directly', t => {
  const E = EnumClass('E');
  t.throws(() => new E('X', 1));
});

test('contains works', t => {
  const members = 'X Y Z'.split(' ');
  const E = EnumClass('E', members);
  t.true(members.every(E.contains.bind(E)));
});

test('members can be added through create', t => {
  const E = EnumClass('E');
  t.is(E.length, 0);

  E.create('X');
  t.is(E.length, 1);
  t.true(E.contains('X'));
  t.is(E.X.name, 'X');
  t.is(E.X.ordinal, 0);
  t.is(E.X.value, undefined);

  E.create('Y', 'foo');
  t.is(E.length, 2);
  t.true(E.contains('Y'));
  t.is(E.Y.name, 'Y');
  t.is(E.Y.ordinal, 1);
  t.is(E.Y.value, 'foo');

  E.create({Z: [1, 2, 3]});
  t.is(E.length, 3);
  t.true(E.contains('Z'));
  t.is(E.Z.name, 'Z');
  t.is(E.Z.ordinal, 2);
  t.deepEqual(E.Z.value, [1, 2, 3]);
});

test('iteration works', t => {
  const E = EnumClass('E', 'X, Y, Z');
  const expected = [E.X, E.Y, E.Z];

  let index = 0;
  for (let member of E) {
    t.is(member, expected[index++]);
  }
});

test('toString prints the name', t => {
  const E = EnumClass('E', 'X');
  t.is(E.X.toString(), 'X');
});

test('length stays up to date', t => {
  const E = EnumClass('E', 'X, Y, Z');
  t.is(E.length, 3);

  for (let i = 1; i <= 100; ++i) {
    E.create(String(i));
    t.is(E.length, 3 + i);
  }
});
