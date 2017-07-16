$('.pn-cancel').click(clear);

$('.pn-porta-aviao').click(function () {
    posicionarPecas(objeto['porta-aviao']);
})
$('.pn-fragata').click(function () {
    posicionarPecas(objeto.fragata);
})
$('.pn-destroyer').click(function () {
    posicionarPecas(objeto.destroyer);
})
$('.pn-submarino').click(function () {
    posicionarPecas(objeto.submarino);
})
$('.pn-canoa').click(function () {
    posicionarPecas(objeto.canoa);
})
$('.pn-iniciar').hide().click(function () {
    $('[data-ativo]').unbind('click');
    $('.botoes').slideUp(100)
})

function posicionarPecas(config) {
    clear();
    isVertical = true;
    $('.divQuadrado').addClass(config.classe);
    setEvents(config);
}

function pegarPeca(obj) {
    let classe = $(obj).attr('data-ativo');
    isVertical = ($(obj).attr('data-vertical') == 'true');
    $('.divQuadrado').addClass(classe);
    $('[data-ativo=' + classe + ']')
        .css({ background: 'white' })
        .unbind('click')
        .removeAttr('data-ativo');
    listPecas[classe] = null;
    setEvents(objeto[classe]);
    $(obj).trigger('mouseover');
}

function setEvents(config) {
    $('.' + config.classe).mouseover(function () {
        var result = config.construtor(this, config.pecas);
        result.list.map(x => {
            $('[data-pos=' + x + ']').not('[data-ativo]')
                .css({ background: result.isValid ? config.cor : 'red' });

            if (!result.isValid)
                $('[data-pos=' + x + ']')
                    .not('[data-ativo]')
                    .attr('data-invalido', config.classe);
        });
    })
    $('.' + config.classe).mouseleave(function () {
        var result = config.construtor(this, config.pecas);
        result.list.map(x => {
            $('[data-pos=' + x + ']').not('[data-ativo]')
                .css({ background: 'white' })
                .removeAttr('data-invalido');
        });
    })
    $('.' + config.classe).mousedown(function (e) {
        if (e.button == 2) {
            $('.' + config.classe).trigger('mouseleave');
            isVertical = !isVertical;
            var result = config.construtor(this, config.pecas);
            result.list.map(x => {
                $('[data-pos=' + x + ']').not('[data-ativo]')
                    .css({ background: result.isValid ? config.cor : 'red' });

                if (!result.isValid)
                    $('[data-pos=' + x + ']')
                        .not('[data-ativo]')
                        .attr('data-invalido', config.classe);
            });
            return;
        }
        if ($('[data-invalido]').length)
            return;

        listPecas[config.classe] = [];
        var result = config.construtor(this, config.pecas);
        result.list.map(x => {
            $('[data-pos=' + x + ']')
                .attr('data-ativo', config.classe)
                .attr('data-vertical', isVertical);
            listPecas[config.classe].push(x);
        });
        $('.pn-' + config.classe).attr('disabled', true);
        $('.' + config.classe).unbind('mouseover').unbind('mousedown').unbind('mouseleave');
        $('.divQuadrado').removeClass(config.classe);
        verificarIniciar();

        setTimeout(function () {
            listPecas[config.classe].map(x => {
                $('[data-pos=' + x + ']').click(function () {
                    pegarPeca(this);
                });
            })
        }, 1000)
    })
}

function clear() {
    $('.divQuadrado').trigger('mouseleave');
    $('.divQuadrado')
        .not('[data-ativo]')
        .unbind('mouseover')
        .unbind('mousedown')
        .unbind('mouseleave');
    $('.divQuadrado').removeClass().addClass('divQuadrado');
}

function verificarIniciar() {
    if (Object.keys(listPecas).length == 5) {
        $('.btn-pecas').slideUp(200, function () {
            $('.pn-iniciar').slideDown(200);
        });
    }

}

function createPecas(obj, pecas) {
    let orientacao = isVertical ? getVertical : getHorizontal;
    var list = [];
    var pos = $(obj).attr('data-pos').split('-');
    pecas.map(x => {
        list.push(orientacao(pos, x));
    });
    return {
        isValid: validarMovimento(list),
        list: list
    };
}

function validarMovimento(list) {
    let isValid = true;
    list.map(x => {
        if (!$('[data-pos=' + x + ']').length || $('[data-pos=' + x + '][data-ativo]').length)
            isValid = false;
    });
    return isValid;
}

function getVertical(pos, val) {
    return (+pos[0] + val) + '-' + pos[1];
}

function getHorizontal(pos, val) {
    return pos[0] + '-' + (+pos[1] + val);
}