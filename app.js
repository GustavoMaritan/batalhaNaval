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
        tabuleiro: items
    });
});

let server = require('http').createServer(app),
    io = require('socket.io')(server);
/*
{
    path: '/test',
    serveClient: false,
    // below are engine.IO options
    pingInterval: 10000,
    pingTimeout: 5000,
    cookie: false
}
io.to('some room').emit('some event');
*/

let listClients = [],
    salas = [],
    newId = 1;

io.on('connection', (client) => {
    let handshake = client.handshake; // dados client
    io.emit('all', 'FUCY YOU');
    eventosPadrao(client);
    eventosJogo(client);
    entrarSala(client);
});

server.listen(3000, () => {
    console.log('Aplic Rodis');
});

function eventosPadrao(client) {
    client.on('event', (data) => {
        console.log('event: ', data);
    });
    client.on('disconnect', (x) => {
        let id = client.id;
        listClients.splice(listClients.indexOf(client), 1)
        console.log(listClients.length);
        console.log('disconnect:', x);
    });
    client.on('disconnecting', (data) => {
        console.log('disconnecting: ', data);
    });
}

function eventosJogo(client) {
    client.on('io-attack', function (msg) {
        client.emit('io-attack', 'BItch');
    });
}

function entrarSala(client) {
    listClients.push(client);
    let novaSala = null;
    if (!salas.length) {
        newId++;
        novaSala = {
            nome: 'sala-' + newId,
            players: [client.id],
            disponivel: true
        }
        salas.push(novaSala);
    } else {
        salas.map((x, i) => {
            if (x.disponivel) {
                x.players.push(client.id);
                x.disponivel = false;
                novaSala = x;
                return;
            }
        });
    }
    client.join(novaSala.nome);

    if (novaSala.players.length == 1) {
        client.emit('io-aguarde', { id: novaSala.nome });
    } else {
        io.to(novaSala.nome).emit('io-start', { id: novaSala.nome });
    }
}