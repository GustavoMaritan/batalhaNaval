function atacar(posicao) {
    socket.emit('io-attack', sala, { pos: posicao });
}

function receberAtaque(posicao) {
    let pecaName = $('.jogador1 [data-pos=' + posicao + ']').attr('data-ativo');
    let acertoTiro = !!$('.jogador1 [data-pos=' + posicao + '][data-ativo]').length;

    respostaAtaque(posicao, acertoTiro, pecaName);

    let cor = 'black';
    if (!acertoTiro)
        cor = 'blue';
    else {
        listPecasDestruidas[pecaName] = listPecasDestruidas[pecaName] || [];
        listPecasDestruidas[pecaName].push(posicao);
    }

    $('.jogador1 [data-pos=' + posicao + ']')
        .css({ background: cor });
}

function respostaAtaque(posicao, acertoTiro, pecaName) {
    socket.emit('io-res-attack', sala, {
        pos: posicao,
        acertoTiro: acertoTiro,
        pecaName: pecaName
    });
}

function confirmarAtaque(posicao, acertoTiro, pecaName) {
    let cor = 'black';
    if (!acertoTiro)
        cor = 'blue'
    else {
        listPecasInimigoDestruidas[pecaName] = listPecasInimigoDestruidas[pecaName] || [];
        listPecasInimigoDestruidas[pecaName].push(posicao);
    }
    $('[data-pos-atk=' + posicao + ']')
        .attr('data-ativo', 'tiro')
        .css({ background: cor })
        .unbind('click');

    if (acertoTiro && verificarVitoria()) {
        $('.divModal').show();
    }
}

function verificaAtirar(obj) {
    if ($(obj).attr('data-ativo'))
        return false;
    return true;
}

function verificarVitoria() {
    let vencedor = [];
    for (let i in listPecasInimigoDestruidas) {

        if (listPecasInimigoDestruidas[i].length == objeto[i].pecas.length)
            vencedor.push(i);
    }
    return vencedor.length == 5;
}
