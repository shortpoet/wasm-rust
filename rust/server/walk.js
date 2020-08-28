const fs = require('fs')
const path = require('path')
const FUNC_PATH = path.join(__dirname, '')
console.log(FUNC_PATH)
console.log(__dirname)
console.log(__filename)
fs.readdir(FUNC_PATH, (err, files) => {
  files.forEach(file => {
    console.log(file);
  });
});
// https://stackoverflow.com/questions/5827612/node-js-fs-readdir-recursive-directory-search
var walk = function(dir, done) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          results.push(file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
};