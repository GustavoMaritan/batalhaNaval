var socket;
socket = io.connect('http://localhost:3000');

socket.on('all', function (msg) {
    console.log('all', msg)
});

socket.on('io-aguarde', function (msg) {
    console.log('aguarde', msg);
});

socket.on('io-start', function (msg) {
    console.log('start', msg);
});

socket.on('io-attack', function (msg) {
    console.log('start', msg);
});

function attack(peca) {
    socket.emit('io-attack', peca);
}