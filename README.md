# enum-class

[![GitHub license](https://img.shields.io/github/license/mashape/apistatus.svg?style=flat-square)](http://goldsborough.mit-license.org)

[![ESDoc Coverage](https://doc.esdoc.org/github.com/goldsborough/enum-class.js/badge.svg)]

`enum-class` gives JavaScript the power of strongly-typed enums, inspired by modern C++ `enum class`es, Python `namedtuples` and Java `enum`s, with dynamic JavaScript sugar sprinkled on top.

## Usage

Like the flexibility of the `namedtuple` constructor in Python, you can pass the members as ['A', 'B', 'C'], 'A, B, C', 'A B C'
```JS
const Color = EnumClass('Color', 'Red, Green, Blue');
const Favorites = EnumClass('Food', {
    Red: function() { console.log('Every member has a value!'); },
    Spaghetti: [1, 2, 3],
    Google: "I'm immutable after configuration."
});
```

The special thing is that members of enum classes are ... instances of themselves :scream:
```JS
console.log(Color.Red instanceof Color); // true
```

As such, we get maximum type safety:
```JS
console.log(Color.Red === Favorites.Red); // false
```

But also all the good reflection stuff:

```JS
for (let member of Color) {
  console.log(member.name); // Red, Green, Blue
  console.log(member.toString()); // Red, Green, Blue
  console.log(member.value); // undefined, because we didn't pass an object
}
```

And extensibility:

```JS
Color.add('Orange', 'value');

console.log(Color.length === 4); // true
console.log(Color.contains('Orange')); // true
console.log(Color.isMember(Color.Red)); // true
console.log(Color.isMember(Favorites.Google)); // false
```

## Installing

```bash
$ npm install enum-class
```

## Hacketry

Tests with [ava](https://github.com/avajs/ava), docs with [ESDoc](https://esdoc.org/), transpilation with [Babel](https://babeljs.io/) and compilation/compression with [Closure](https://developers.google.com/closure/compiler/). Easy life, smiles and champagne with:

```bash
$ gulp
```

The source is small and modern, so feel free to hack around.

## License

This project is released under the [MIT License](http://goldsborough.mit-license.org). For more information, see the LICENSE file.

## Warning

This is my first ever JavaScript/Node project, so I have absolutely no idea what the hell I'm doing.

## Authors

[Peter Goldsborough](http://goldsborough.me) + [cat](https://goo.gl/IpUmJn) :heart:

<a href="https://gratipay.com/~goldsborough/"><img src="http://img.shields.io/gratipay/goldsborough.png?style=flat-square"></a>
