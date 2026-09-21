/*
 * Formulário de filme, usado tanto em "Cadastrar" quanto em "Editar".
 * Formulario.montar(container, { filme, rotuloEnvio, aoEnviar })
 *   - filme: dados iniciais (vazio no cadastro, preenchido na edição)
 *   - aoEnviar(dados): deve devolver true se salvou, false se falhou
 */
(function (global) {
  'use strict';

  var UI = global.UI;
  var ANO_MIN = 1888;
  var ANO_MAX = new Date().getFullYear() + 5;

  var GENEROS = [
    'Ação', 'Animação', 'Aventura', 'Comédia', 'Documentário', 'Drama', 'Fantasia',
    'Ficção científica', 'Musical', 'Romance', 'Suspense', 'Terror', 'Outro'
  ];

  var CAMPOS = [
    { nome: 'titulo', rotulo: 'Título', tipo: 'text', cheio: true, maxlength: 120 },
    { nome: 'diretor', rotulo: 'Direção', tipo: 'text', cheio: true, maxlength: 80 },
    { nome: 'ano', rotulo: 'Ano de lançamento', tipo: 'number', min: ANO_MIN, max: ANO_MAX, step: 1 },
    { nome: 'genero', rotulo: 'Gênero', tipo: 'select' },
    { nome: 'duracao', rotulo: 'Duração em minutos', tipo: 'number', min: 1, max: 600, step: 1 },
    { nome: 'nota', rotulo: 'Sua nota, de 0 a 10', tipo: 'number', min: 0, max: 10, step: 0.1 },
    { nome: 'poster', rotulo: 'Endereço da imagem do pôster (opcional)', tipo: 'url', cheio: true, placeholder: 'https://' },
    { nome: 'sinopse', rotulo: 'Sinopse (opcional)', tipo: 'textarea', cheio: true, maxlength: 600 }
  ];

  function validar(v) {
    var e = {};
    var ano = Number(v.ano);
    var duracao = Number(v.duracao);
    var nota = Number(v.nota);
    var poster = v.poster.trim();

    if (!v.titulo.trim()) e.titulo = 'Informe o título do filme.';
    if (!v.diretor.trim()) e.diretor = 'Informe quem dirigiu o filme.';
    if (v.ano.trim() === '' || !Number.isInteger(ano) || ano < ANO_MIN || ano > ANO_MAX) {
      e.ano = 'Informe um ano entre ' + ANO_MIN + ' e ' + ANO_MAX + '.';
    }
    if (!v.genero) e.genero = 'Escolha um gênero.';
    if (v.duracao.trim() === '' || !Number.isInteger(duracao) || duracao < 1 || duracao > 600) {
      e.duracao = 'Informe a duração em minutos, de 1 a 600.';
    }
    if (v.nota.trim() === '' || isNaN(nota) || nota < 0 || nota > 10) {
      e.nota = 'Informe uma nota entre 0 e 10.';
    }
    if (poster && !/^https?:\/\/\S+$/i.test(poster)) {
      e.poster = 'Use um endereço que comece com http:// ou https://.';
    }
    return e;
  }

  function criarCampo(def, valor) {
    var id = 'campo-' + def.nome;
    var caixa = UI.el('div', 'campo' + (def.cheio ? ' cheio' : ''));
    var rotulo = UI.el('label', null, def.rotulo);
    rotulo.htmlFor = id;

    var entrada;
    if (def.tipo === 'select') {
      entrada = document.createElement('select');
      entrada.appendChild(new Option('Selecione', ''));
      GENEROS.forEach(function (g) { entrada.appendChild(new Option(g, g)); });
    } else if (def.tipo === 'textarea') {
      entrada = document.createElement('textarea');
      entrada.rows = 4;
    } else {
      entrada = document.createElement('input');
      entrada.type = def.tipo;
    }

    entrada.id = id;
    entrada.name = def.nome;
    ['min', 'max', 'step', 'maxlength', 'placeholder'].forEach(function (attr) {
      if (def[attr] !== undefined) entrada.setAttribute(attr, def[attr]);
    });
    entrada.value = valor === undefined || valor === null ? '' : String(valor);

    var erro = UI.el('p', 'erro');
    erro.id = id + '-erro';
    entrada.setAttribute('aria-describedby', erro.id);

    caixa.appendChild(rotulo);
    caixa.appendChild(entrada);
    caixa.appendChild(erro);
    return { caixa: caixa, entrada: entrada, erro: erro };
  }

  function montar(container, opcoes) {
    var filme = opcoes.filme || {};
    container.textContent = '';

    var layout = UI.el('div', 'form-layout');

    var lado = UI.el('aside', 'previa');
    lado.setAttribute('aria-label', 'Prévia do pôster');
    var previa = UI.el('div', 'previa-poster');
    lado.appendChild(previa);
    lado.appendChild(UI.el('p', 'suave dica', 'Assim o filme aparece na lista. Sem imagem, o pôster é gerado a partir do título.'));

    var form = document.createElement('form');
    form.noValidate = true;
    var grade = UI.el('div', 'campos');
    form.appendChild(grade);

    var campos = {};
    CAMPOS.forEach(function (def) {
      var c = criarCampo(def, filme[def.nome]);
      campos[def.nome] = c;
      grade.appendChild(c.caixa);
      c.entrada.addEventListener('input', function () { limparErro(def.nome); });
    });

    var erroGeral = UI.el('p', 'erro erro-geral');
    erroGeral.setAttribute('role', 'alert');
    var acoes = UI.el('div', 'form-acoes');
    var enviar = UI.el('button', 'btn', opcoes.rotuloEnvio);
    enviar.type = 'submit';
    var cancelar = UI.el('a', 'btn btn-contorno', 'Cancelar');
    cancelar.href = 'index.html';
    acoes.appendChild(enviar);
    acoes.appendChild(cancelar);
    form.appendChild(erroGeral);
    form.appendChild(acoes);

    layout.appendChild(lado);
    layout.appendChild(form);
    container.appendChild(layout);

    // Prévia do pôster (atualiza ao digitar o título ou o endereço da imagem)
    var timer;
    function desenharPrevia() {
      previa.textContent = '';
      previa.appendChild(UI.criarPoster({
        titulo: campos.titulo.entrada.value.trim() || 'Título do filme',
        poster: campos.poster.entrada.value.trim()
      }));
    }
    function agendarPrevia() {
      clearTimeout(timer);
      timer = setTimeout(desenharPrevia, 300);
    }
    campos.titulo.entrada.addEventListener('input', agendarPrevia);
    campos.poster.entrada.addEventListener('input', agendarPrevia);
    desenharPrevia();

    function limparErro(nome) {
      var c = campos[nome];
      c.erro.textContent = '';
      c.caixa.removeAttribute('data-invalido');
      c.entrada.removeAttribute('aria-invalid');
    }

    function mostrarErros(erros) {
      CAMPOS.forEach(function (def) {
        var c = campos[def.nome];
        var msg = erros[def.nome];
        c.erro.textContent = msg || '';
        if (msg) {
          c.caixa.setAttribute('data-invalido', '');
          c.entrada.setAttribute('aria-invalid', 'true');
        } else {
          c.caixa.removeAttribute('data-invalido');
          c.entrada.removeAttribute('aria-invalid');
        }
      });
    }

    function lerValores() {
      var v = {};
      CAMPOS.forEach(function (def) { v[def.nome] = campos[def.nome].entrada.value; });
      return v;
    }

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      erroGeral.textContent = '';

      var v = lerValores();
      var erros = validar(v);
      mostrarErros(erros);

      var primeiro = CAMPOS.filter(function (def) { return erros[def.nome]; })[0];
      if (primeiro) {
        campos[primeiro.nome].entrada.focus();
        return;
      }

      var dados = {
        titulo: v.titulo.trim(),
        diretor: v.diretor.trim(),
        ano: parseInt(v.ano, 10),
        genero: v.genero,
        duracao: parseInt(v.duracao, 10),
        nota: parseFloat(v.nota),
        poster: v.poster.trim(),
        sinopse: v.sinopse.trim()
      };

      enviar.disabled = true;
      if (!opcoes.aoEnviar(dados)) {
        enviar.disabled = false;
        erroGeral.textContent = 'Não foi possível salvar. Verifique se o navegador permite guardar dados neste site e tente de novo.';
      }
    });
  }

  global.Formulario = { montar: montar };
})(window);
