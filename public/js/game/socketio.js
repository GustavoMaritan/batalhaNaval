let socket;
socket = io.connect('http://localhost:3000');

let sala;

socket.on('all', function (msg) {
    console.log('all', msg)
});

socket.on('io-aguarde', function (msg) {
    console.log('aguarde', msg);
});

socket.on('io-start', function (msg) {
    console.log('inicio sala:' + msg.id);
    sala = msg;
});