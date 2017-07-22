const express = require('express'),
    app = express(),
    path = require('path'),
    bodyParser = require('body-parser'),
    fs = require('fs');

require('devbox-linq');
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

let listClients = {},
    salas = [],
    newId = 0;

io.on('connection', (client) => {
    let handshake = client.handshake; // dados client
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
        delete listClients[client.id]
    });
    client.on('disconnecting', (data) => {
        console.log('disconnecting: ', data);
    });
}

function eventosJogo(client) {
    client.on('io-attack', (sala, posicao) => {
        let idOutro = getJogador(client.id, sala);
        listClients[idOutro].emit('io-attack', { pos: posicao.pos });
    });
    client.on('io-res-attack', (sala, infos) => { // {pos, acertoTiro, pecaName}
        let idOutro = getJogador(client.id, sala);
        listClients[idOutro].emit('io-res-attack', infos);
    });
    client.on('io-iniciar-jogo', (sala) => {
        sala.players[client.id].pronto = true;
        let outroId = getJogador(client.id, sala);

        if (sala.players[client.id].pronto && sala.players[outroId].pronto)
            sala.iniciado = true;

        if (!sala.iniciado) {
            io.to(sala.id).emit('io-iniciar-aguarde', sala);
            return client.emit('io-modal-aguarde');
        }

        sala.rodada++;
        let novoJogo = {
            jogadorVez: jogadorVez(sala.rodada),
            jogador: 0
        };

        getIds(sala).map(x => {
            novoJogo.jogador = x.jogador;
            listClients[x.id].emit('io-iniciar-jogo', sala, novoJogo);
        });
    });
    client.on('io-alterar-jogadorVez', (sala, jogadorVez) => {
        io.to(sala.id).emit('io-alterar-jogadorVez', jogadorVez);
    });
}

function getJogador(id, sala) {
    for (let i in sala.players) {
        if (sala.players[i].id != sala.players[id].id)
            return i;
    }
}

function getIds(sala) {
    let ids = [];
    for (let i in sala.players) {
        ids.push({
            id: i,
            jogador: sala.players[i].id,
        });
    }
    return ids;
}

function jogadorVez(rodada) {
    return rodada % 2 == 0 ? 2 : 1;
}

function entrarSala(client) {
    listClients[client.id] = client;
    let novaSala = null;
    if (!salas.length || salas.filter(x => !!x.disponivel).length % 2 == 0) {
        newId++;
        novaSala = {
            nome: 'sala-' + newId,
            players: {
                [client.id]: {
                    id: 1,
                    pronto: false
                }
            },
            disponivel: true
        }
        salas.push(novaSala);
    } else {
        salas.map((x, i) => {
            if (x.disponivel) {
                x.players[client.id] = {
                    id: 2,
                    pronto: false
                };
                x.disponivel = false;
                novaSala = x;
                return;
            }
        });
    }
    client.join(novaSala.nome);

    if (Object.keys(novaSala.players).length == 1) {
        client.emit('io-aguarde', { id: novaSala.nome });
    } else {
        io.to(novaSala.nome).emit('io-start', {
            id: novaSala.nome,
            players: novaSala.players
        });
    }
}