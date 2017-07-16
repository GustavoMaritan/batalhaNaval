const express = require('express'),
    app = express(),
    path = require('path'),
    bodyParser = require('body-parser'),
    fs = require('fs');

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'vash');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
    var items = [];
    for (let i = 1; i <= 15; i++) {
        for (let j = 1; j <= 15; j++) {
            items.push({ linha: i, coluna: j });
        }
    }
    res.render('index', {
        buffer: items
    });
});

app.listen(3000, () => {
    console.log('Aplic Rodis');
})