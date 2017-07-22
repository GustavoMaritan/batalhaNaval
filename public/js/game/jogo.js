function iniciarJogo() {
    $('[data-ativo]').unbind('click');
    //$('.attack').show();
    $('.divPecas').slideUp(100);
    socket.emit('io-iniciar-jogo', sala);
}

function alterarJogadorVez(jogadorVez) {
    socket.emit('io-alterar-jogadorVez', sala, jogadorVez);
}