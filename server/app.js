const express = require('express');
const morgan = require('morgan');
const fs = require("fs");
const bodyParser = require("body-parser").json();
var responseTime = require("response-time");

const app = express();
var fileName = "./server/data.json";
var start = new Date();

app.use(morgan("dev"));

app.use(function (err, req, res, next) {
    res.status(500).send("Error Code 500: Somethings Wrong");
    next();
});


app.use(function (err, req, res, next) {
    res.status(404).send("Error Code 404: File Not Found");
    next();
});

app.use(responseTime());


app.get("/", function (req, res) {

    // res.status(200).write("");
    resTime = res.get("X-response-Time");
    console.log(resTime);
    code = {
        status: "ok",
        time: resTime
    }
    res.status(200).send(code);
    console.log(typeof code);
    // res.status(200).write(JSON.stringify(code));
    // res.status(200).end(code, "utf8");
});


app.route("/api/TodoItems")
    .get(function (req, res) {
        var data = read();
        var json = JSON.parse(data);
        res.status(200).send(json);

    })
    .post(bodyParser, function (req, res) {
        var newData = req.body;
        var indexNum = newData.todoItemId;
        var arr = createArr();
        arr[indexNum] = newData;
        var json = JSON.stringify(arr, null, "\t");
        write(json);
        res.status(201).send(newData);
    });

app.get("/api/ToDoItems/complete", function (req, res) {
    var data = read();
    var par = JSON.parse(data);
    var arr = [];
    
        for (var i = 0; i < par.length; i ++) {
            if (par[i].completed === true) {
                arr.push(par[i]);
            }
        }
    console.log(arr);
    res.send(arr);
})

app.get("/api/ToDoItems/incomplete", function (req, res) {
    var data = read();
    var par = JSON.parse(data);
    var arr = [];
    
        for (var i = 0; i < par.length; i ++) {
            if (par[i].completed === false) {
                arr.push(par[i]);
            }
        }
    console.log(arr);
    res.send(arr);
    })

    
app.route("/api/ToDoItems/:number")
    .get(function (req, res) {
        var search = req.params.number;
        var data = read();
        var par = JSON.parse(data);
        res.send(par[search]);
    })
    .delete(function (req, res) {
        var search = req.params.number;
        var data = read();
        var par = JSON.parse(data);
        var arr = createArr();
        arr[search] = {};
        var json = JSON.stringify(arr, null, "\t");
        write(json);
        res.status(200).send(par[search]);
    })
    .put(bodyParser, function( req, res){
        var search = req.params.number;
        var changes = req.body;
        var propsName = changes.name;
        var propsPrior = changes.priority;
        var propsComplete = changes.completed;
        var arr = createArr();
        if (search < arr.length && search === changes.todoItemId) {
            if (changes.name === undefined) {
                propsName = arr[search].name;
            }
            if (changes.priority === undefined) {
                propsPrior = arr[search].priority;
            }
            if (changes.completed === undefined) {
                propsComplete = arr[search].name;
            }
            var update = {first, "name": propsName,
            "priority": propsPrior, "completed": propsComplete};
            arr[search] = update;
            var json = JSON.stringify(arr, null, "\t");
            write(json);
        } else {
            if (parseInt(search) === changes.todoItemId) {
                arr[search] = changes;
                var json = JSON.stringify(arr, null, "\t");
                write(json);
                res.send(changes);
            } else {
                res.send("Please Enter Correct ID #");
                }
        }
        res.send(update);
    })
    .patch(bodyParser, function( req, res){
        var search = req.params.number;
        var changes = req.body;
        var propsName = changes.name;
        var propsPrior = changes.priority;
        var propsComplete = changes.completed;
        var arr = createArr();
        if (search < arr.length && search === changes.todoItemId) {
            if (changes.name === undefined) {
                propsName = arr[search].name;
            }
            if (changes.priority === undefined) {
                propsPrior = arr[search].priority;
            }
            if (changes.completed === undefined) {
                propsComplete = arr[search].name;
            }
            var update = {"todoItemId": search, "name": propsName,
            "priority": propsPrior, "completed": propsComplete};
            arr[search] = update;
            var json = JSON.stringify(arr, null, "\t");
            write(json);
        } else {
            res.send("Please Enter Correct ID #");
        }
        res.send(update);
    });



function read() {
    var data = fs.readFileSync(fileName, "utf8");
    return data;
}

function createArr() {
    var data = read();
    var par = JSON.parse(data);
    var arr = [];

    for (var i = 0; i < par.length; i++) {
        var item = par[i];
        arr.push(item);
    }
return arr;
}

function write(json) {
    fs.writeFile(fileName, json, function (err) {
        if (err) {
            throw err;
        }
    });
}

// [
// 	{
// 		"todoItemId": 0,
// 		"name": "an item",
// 		"priority": 3,
// 		"completed": false
// 	},
// 	{
// 		"todoItemId": 1,
// 		"name": "another item",
// 		"priority": 2,
// 		"completed": false
// 	},
// 	{
// 		"todoItemId": 2,
// 		"name": "a done item",
// 		"priority": 1,
// 		"completed": true
// 	}
// ]


module.exports = app;


