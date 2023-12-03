# IdMaster class

## Description

This class is used to generate unique ids in Node.js applications. It uses a file to store the last id generated, so it can be used in multiple processes. 

But what is more important the file is watched, so if the id in it is changed at runtime, the instance will be notified and will update the last id immediately. Or if the file is deleted, the instance will reset the last id to 0 and will continue to work.

Also every instance is named, so you can have multiple instances of this class in your application and they will not interfere with each other.

![image](https://github.com/UniBreakfast/generate-persistent-id/assets/19654456/6dc6fd61-a004-4457-b351-f11789454add)

## Usage

```js
const { IdMaster } = require('./id-master.js');

const mainIdMaster = new IdMaster('main');

const id1 = mainIdMaster.getId(); // 1
const id2 = mainIdMaster.getId(); // 2
const id3 = mainIdMaster.getId(); // 3
// ...

// a file 'data/num-id-main' will be created relative to the current working directory with the content '3' at this point

const userIdMaster = new IdMaster('user');

const id4 = userIdMaster.getId(); // 1
const id5 = userIdMaster.getId(); // 2
// ...

// a file 'data/num-id-user' with '2' in it will be created and so on...
```

## Dependencies

- NumberFile class
- FileHandle class
- advanced custom watchFile function

Descriptions of these classes and function provided below.

## NumberFile class

### Description

This class is used to read and write numbers to a file for persistance on application restart. In this specific repo it is used by the IdMaster class to store the last id generated.

The file is watched, so if the number in it is changed at runtime, the instance will be notified and will update its number accordingly. Or if the file is deleted, the instance will continue to work normally. It will produce NaN if the file is empty or contains something other than a number, until a number is provided.

Also every instance is named, so you can have multiple instances of this class in your application and they will not interfere with each other.

### Usage

```js
const { NumberFile } = require('./number-file.js');

const aNumberFile = new NumberFile('a');

// ...

aNumberFile.setNumber(42); 
// a file 'data/num-a' will be created relative to the current working directory with the content '42' at this point
```

and after restart

```js
const { NumberFile } = require('./number-file.js');

const aNumberFile = new NumberFile('a');

// ...

const number = aNumberFile.getNumber(); // 42
```

### Dependencies

All of the following classes and functions are used by this class.

## FileHandle class

### Description

This class is used to read and write files easily and to watch them for changes. In this repo it is used by the NumberFile class to read and write the file that stores the last id generated.

If the file is deleted, the instance will dispatch 'delete' and 'change' events and continue to work normally. It will produce null if the file does not exist upon reading.

If the file is created, the instance will dispatch 'create' and 'change' events and continue to work normally.

If the file is changed, the instance will dispatch 'change' event with the new content and continue to work normally.

Also every instance remembers its path, so you can have multiple instances of this class in your application each taking care of a different file and they will not interfere with each other.

### Usage

```js
const { FileHandle } = require('./file-handle.js');

const someFile = new FileHandle('path/to/folder/some-file.txt');

someFile.writeSync('some content');
// a file 'path/to/folder/some-file.txt' will be created relative to the current working directory with the content 'some content' at this point

const content = someFile.readSync(); // 'some content'

someFile.write('some other content')
  .then(_ => {
    // same file will be updated with the content 'some other content' asynchronously

    return someFile.read()
  })
  .then(content => {
    // content will be 'some other content'
  });
```

```js
someFile.on('change', content => {
  // content will be passed here every time the file is changed (created, updated or deleted) with this instance methods or from outside of the application (by another process or manually)
});

someFile.on('create', content => {
  // similarly content will be passed here on similar circumstances, but only when the file is created
});

someFile.on('delete', lastContent => {
  // similarly last known content will be passed here on similar circumstances, but only when the file is deleted
});
```

### Dependencies

The following function is used by this class.

## Advanced custom `watchFile` function

### Description

This function is used to watch files for changes. It is specifically designed to persistently watch files that are not necessarily present at any given time, but are created and deleted at runtime, as well as their parent folders. In this repo it is used by the FileHandle class to watch the file that stores the last id generated.

It takes a file path and a callback function as arguments. The callback function will be called with the content of the file every time the file is changed (created, updated or deleted) from within the application or from outside (by another process or manually).

If the file is deleted, the callback function will be called with null and the function will continue to work normally.

If the file is created, the callback function will be called with the content of the file and the function will continue to work normally.

### Usage

```js
const { watchFile } = require('./watch-arbitrary-depth.js');

watchFile('path/to/folder/some-file.txt', content => {
  // content will be passed here every time the file is changed (created, updated or deleted) 
});
```

### Dependencies

`debounce()` function and other functions with more narrow purpose are used by this function. As well as `fs.promises.watch()`, `fs.promises.access()` and `fs.promises.readFile()`.

```js
function debounce(fn, delay) {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      fn(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, delay);
  };
}
```

## License

MIT
