var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var app = express();
//https://www.npmjs.com/package/mongoose
mongoose.connect('mongodb://finance:Fin12#@ds027155.mongolab.com:27155/financez');
//http://mongoosejs.com/docs/models.html
var schema = new mongoose.Schema({ name: 'string', money: 'number', account: 'string', type: 'string', date: 'string' });
var accountz = mongoose.model('accountz', schema);

// parse application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    /*  http://stackoverflow.com/questions/19867775/cors-trouble-with-nodejs-and-angularjs  */
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
    next();
});

//http://expressjs.com/starter/hello-world.html
//http://expressjs.com/starter/basic-routing.html
app.post('/setter', function (req, res) {
    console.log("samzS");
    var small = new accountz({
        name: req.param("name"),
        money: req.param("money"),
        account: req.param("acc"),
        type: req.param("type"),
        date: req.param("date")
    });
    small.save(function (err) {
        if (err){
            res.status(500).send(err);
        }else{
            res.send(small);
        }
    });
});

app.get('/getter', function (req, res) {
    console.log("samzG");
    accountz.find().exec(function(err, data){
        if (err){
            res.status(500).send(err);
        }else{
            res.send(data);
        }
    });
});

app.post('/deleter', function (req, res) {
    console.log("samzD");
    var deleteId = req.param("id");
//    res.send(req.params);
    accountz.remove({ "_id":deleteId }).exec(function(err, data){
        if (err){
            res.status(500).send(err);
        }else{
            res.send(data);
        }
    });
});

app.post('/editor', function (req, res) {
    console.log("samzE");
    var editObj = {
        id: req.param("id"),
        name: req.param("name"),
        money: req.param("money"),
        account: req.param("acc"),
        type: req.param("type"),
        date: req.param("date")
    };
//    res.send(req.params);
    accountz.findOne({ "_id": editObj.id }, function (err, doc){
        doc.name = editObj.name;
        doc.money = editObj.money;
        doc.account = editObj.account;
        doc.type = editObj.type;
        doc.date = editObj.date;
//        doc.visits.$inc();
        doc.save(function (err) {
            if (err){
                res.status(500).send(err);
            }else{
                res.send({ "error":false, "message":"Saved Sucessfully"});
            }
        });
    });
});

var server = app.listen(8888, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});