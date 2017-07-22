let socket;
socket = io.connect('http://localhost:3000');

let sala = {
    iniciado: false,
    rodada: 0,
    players: {}
}, novoJogo = null;

socket.on('all', function (msg) {
});

socket.on('io-aguarde', function (msg) {
    Object.assign(sala, msg);
    $('#spModal').empty().html('AGUARDANDO');
    $('.divModal').show();
    $('.attack').hide();
});

socket.on('io-start', function (msg) {
    Object.assign(sala, msg);
    $('.divModal').slideUp();
    $('.attack').hide();
});

socket.on('io-attack', function (posicao) {
    receberAtaque(posicao.pos);
});

socket.on('io-res-attack', function (resposta) {
    confirmarAtaque(resposta.pos, resposta.acertoTiro, resposta.pecaName);
});

socket.on('io-iniciar-aguarde', function (resposta) {
    sala = resposta;
});

socket.on('io-modal-aguarde', function () {
    $('#spModal').empty().html('AGUARDANDO OUTRO JOGADOR');
    $('.divModal').slideDown(100);
});

socket.on('io-iniciar-jogo', function (resposta, newGame) {
    sala = resposta;
    novoJogo = newGame;
    $('.attack').slideDown(100);
    $('.divModal').slideUp(100);
    $('.divPainel').slideDown(100);
    $('.pnJogador[data-num=' + novoJogo.jogador + '] .pnHead').html('Você');
    informaJogadorVez();
});

socket.on('io-alterar-jogadorVez', function (jogadorVez) {
    novoJogo.jogadorVez = jogadorVez;
    informaJogadorVez();
});

function informaJogadorVez() {
    $('.pnJogador[data-num=' + novoJogo.jogadorVez + ']').css({
        'border-color': 'red'
    })
    $('.pnJogador[data-num=' + (novoJogo.jogadorVez == 2 ? 1 : 2) + ']').css({
        'border-color': 'rgba(255, 0, 0, 0.12)'
    })
}