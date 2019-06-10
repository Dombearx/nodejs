const express = require('express');
const app = express();


const fs = require('fs');
var bodyParser = require('body-parser')


app.set('view engine', 'pug');
var urlencodedParser = app.use(bodyParser.urlencoded({ extended: false }));
var jsonParser = app.use(bodyParser.json());

var userName = "";

//Logowanie
app.all('/', (request, response) => {
    response.render('main/index', { 'nazwa': request.query.nazwa });
});

app.get('/notatki', (request, response) => {
    if (request.query.nazwa !== "" && userName === "") {
        userName = request.query.nazwa;
    }
    response.render('notatki/index', { 'nazwa': userName });
});

//Główna strona dodawaniem notatki
app.post('/notatki', (request, response) => {
    var today = new Date();
    console.log(userName)

    filename = "files/" + userName + '.json';

    if (fs.existsSync(filename)) {
        fs.readFile(filename, function (err, data) {
            obj = JSON.parse(data); //now it an object
            obj.notatki.push({ data: today, tekst: request.body.tekst });
            json = JSON.stringify(obj); //convert it back to json
            fs.writeFile(filename, json, function (err) {
                if (err) throw err;
                console.log('Saved!');
            });
        });
    } else {
        var obj = {
            notatki: []
        };

        obj.notatki.push({ data: today, tekst: request.body.tekst });
        var json = JSON.stringify(obj);
        fs.appendFile(filename, json, function (err) {
            if (err) throw err;
            console.log('Saved!');
        });
    }

    response.render('notatki/index', { 'tekst': request.body.tekst, 'nazwa': userName, 'data': today });
});

//Wyświetlanie notatek
app.get('/notatki/pokaz', (request, response) => {
    console.log('pokaz notatki');
    console.log(userName)
    filename = "files/" + userName + '.json';
    console.log('filename: ' + filename);
    fs.readFile(filename, function (err, data) {
        obj = JSON.parse(data); //now it an object
        response.render('notatki/index', { 'notatki': obj.notatki, 'nazwa': userName });
    });
});


app.get('/book', (request, response) => {
    response.render('books/index', { 'nazwa': request.query.nazwa });
});

app.get('/book/:id', (request, response) => {
    response.send(`Sending book with id ${request.params.id}`)
});

app.post('/book', (request, response) => {
    response.send('New book created.')
});

app.listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
});