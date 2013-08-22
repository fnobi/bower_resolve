bower_resolve
==============

search bower javascript path.

## install

### from npm

```
npm install bower_resolve
```

### from github

```
git clone git://github.com/fnobi/bower_resolve.git
```

## usage

### on node.js

```
var bowerResolve = require('./bowerResolve');

bowerResolve({
    component: 'paper'
}, function (err, jspath) {
    if (err) {
        return;
    }

    console.log(jspath); // => path/to/project/bower_component/paper/dist/paper.js
});
```

### on shell

```
bower_resolve --path <project root> <component name>
```
