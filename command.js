
const fs = require("fs");

//write out data
function done(output) {
  process.stdout.write(output);
  process.stdout.write('\nprompt > ');
}

//where we will store our commands
function evaluateCmd(userInput) {
  //parses the user input to understand which command was typed
  const userInputArray = userInput.split(" ");
  const command = userInputArray[0];
  const command2 = userInputArray.slice(1,2).join(' ').split('').slice(0,2).join('');

  if (command === "echo" && command2 !== "-n") {
    commandLibrary.echo(userInputArray.slice(1).join(" "));
  }
  if (command === "cat" && command2 !== "-n") {
    commandLibrary.cat(userInputArray.slice(1));
  }
  if (command === "sort" && command2 !== "-n") {
    commandLibrary.sort(userInputArray.slice(1));
  }
  if (command === "wc" && command2 !== "-n") {
    commandLibrary.wc(userInputArray.slice(1));
  }
  if (command === "uniq" && command2 !== "-n") {
    commandLibrary.uniq(userInputArray.slice(1));
  }
  if (command === "head" && command2 === "-n") {
    commandLibrary.head2(userInputArray.slice(2), parseInt(userInputArray.slice(1,2).join(' ').split('').slice(2).join('')));
  }
  if (command === "head" && command2 !== "-n") { //for when -n is not provided and the head command pulls the first 10 elements from file//
    commandLibrary.head(userInputArray.slice(1));
  }
  if (command === "tail" && command2 === "-n") {
    commandLibrary.tail2(userInputArray.slice(2), parseInt(userInputArray.slice(1,2).join(' ').split('').slice(2).join('')));
  }
  if (command === "tail" && command2 !== "-n") { //for when -n is not provided and the tail command pulls the first 10 elements from file//
    commandLibrary.tail(userInputArray.slice(1));
  }
    else {
      done("Error. Please review command");
    }
};
//where we will store the logic of our commands
const commandLibrary = {
  "echo": function(userInput) {
    done(userInput);
  },
  //the cat command
  "cat": function(fullPath) {
    const fileName = fullPath[0];
    fs.readFile(fileName, (err, data) => {
      if (err) throw err;
      done(data);
    });
  },
  //the sort command
  "sort": function(fullPath) {
    const fileName = fullPath[0];
    fs.readFile(fileName, (err, data) => {
      if (err) throw err;
      var dataArr = data.toString().split('\n').sort();
      data = dataArr.join('\n');
      done(data);
    });
  },

  //the wc command
  "wc": function(fullPath) {
    const fileName = fullPath[0];
    fs.readFile(fileName, (err, data) => {
      if (err) throw err;
      var dataArr = data.toString().split('\n').length-1;
      var dataArr2 = data.toString().split('\n').map(s => s.split(' ')).map(arr =>arr.length).reduce((x,y) => (x+y))-1;
      var dataArr3 = fs.statSync(fileName).size;
      data = [dataArr, dataArr2, dataArr3, fileName];
      done(data.join(' '));
    });
  },
  //the uniq command
  "uniq": function(fullPath) {
    const fileName = fullPath[0];
    fs.readFile(fileName, (err, data) => {
      if (err) throw err;

      function remDups(foo) {
        var tmp =[];
        for (let i =0;  i<foo.length; i++) {
          if(foo[i] !== foo[i+1]) {
            tmp.push(foo[i]);
          }
        }
        return tmp;
      }

      done(remDups(data.toString().split('\n')).join('\n'));
    });
  },
  //the head command
  "head": function(fullPath) {
    const fileName = fullPath[0];
    fs.readFile(fileName, (err, data) => {
      if (err) throw err;

      function numRep(foo) {
        var tmp = [];
        for (let i = 0; i<foo.length && i<=9; i++ ) {
          tmp.push(foo[i]);
        }
        return tmp;
      }
      done(numRep(data.toString().split('\n')).join('\n'));
    });
  },

  //the head2 command
  "head2": function(fullPath, num) {
    const fileName = fullPath[0];
    fs.readFile(fileName, (err, data) => {
      if (err) throw err;

      function numRep(foo, num) {
        var tmp = [];
        for (let i = 0; i<foo.length && i<=num-1; i++ ) {
          tmp.push(foo[i]);
        }
        return tmp;
      }
      done(numRep(data.toString().split('\n'), num).join('\n'));
    });
  },
  //the tail command
  "tail": function(fullPath) {
    const fileName = fullPath[0];
    fs.readFile(fileName, (err, data) => {
      if (err) throw err;

      function numRep(foo) {
        var tmp = [];
        for (let i = foo.length-1; i>0 && i>=foo.length-11; i-- ) {
          tmp.unshift(foo[i]);
        }
        return tmp;
      }
      done(numRep(data.toString().split('\n')).join('\n'));
    });
  },
  //the tail2 command
  "tail2": function(fullPath, num) {
    const fileName = fullPath[0];
    fs.readFile(fileName, (err, data) => {
      if (err) throw err;

      function numRep(foo, num) {
        var tmp = [];
        for (let i = foo.length-1; i>0 && i>=foo.length-(num+1); i-- ) {
          tmp.unshift(foo[i]);
        }
        return tmp;
      }
      done(numRep(data.toString().split('\n'), num).join('\n'));
    });
  }

};

module.exports.commandLibrary = commandLibrary;
module.exports.evaluateCmd = evaluateCmd;
