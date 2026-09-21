/* Lista de filmes: busca, botão Editar e botão Apagar (com confirmação). */
(function () {
  'use strict';

  var lista = document.getElementById('lista');
  var vazio = document.getElementById('vazio');
  var vazioTitulo = document.getElementById('vazio-titulo');
  var vazioTexto = document.getElementById('vazio-texto');
  var vazioAcao = document.getElementById('vazio-acao');
  var contagem = document.getElementById('contagem');
  var campoBusca = document.getElementById('busca');
  var dialogo = document.getElementById('dialogo-apagar');
  var dialogoTexto = document.getElementById('dialogo-texto');

  var filmeParaApagar = null;
  var botaoQueAbriu = null;

  function normalizar(texto) {
    return String(texto || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }

  function criarCartao(filme) {
    var item = UI.el('li', 'filme');

    var capa = UI.el('div', 'capa');
    capa.appendChild(UI.criarPoster(filme));
    var nota = UI.el('span', 'nota', UI.formatarNota(filme.nota));
    nota.setAttribute('aria-label', 'Nota ' + UI.formatarNota(filme.nota));
    capa.appendChild(nota);
    item.appendChild(capa);

    item.appendChild(UI.el('h2', null, filme.titulo));
    item.appendChild(UI.el('p', 'diretor', filme.diretor));

    var detalhes = UI.el('p', 'detalhes');
    detalhes.appendChild(UI.el('span', null, String(filme.ano)));
    detalhes.appendChild(UI.el('span', null, filme.duracao + ' min'));
    detalhes.appendChild(UI.el('span', null, filme.genero));
    item.appendChild(detalhes);

    if (filme.sinopse) item.appendChild(UI.el('p', 'sinopse', filme.sinopse));

    var acoes = UI.el('div', 'acoes');

    var editar = UI.el('a', 'btn btn-contorno', 'Editar');
    editar.href = 'editar.html?id=' + encodeURIComponent(filme.id);
    editar.setAttribute('aria-label', 'Editar ' + filme.titulo);

    var apagar = UI.el('button', 'btn btn-perigo-contorno', 'Apagar');
    apagar.type = 'button';
    apagar.setAttribute('aria-label', 'Apagar ' + filme.titulo);
    apagar.addEventListener('click', function () { pedirConfirmacao(filme, apagar); });

    acoes.appendChild(editar);
    acoes.appendChild(apagar);
    item.appendChild(acoes);
    return item;
  }

  function desenhar() {
    var todos = Filmes.listar();
    var termo = normalizar(campoBusca.value.trim());
    var filtrados = todos.filter(function (f) {
      return !termo || normalizar([f.titulo, f.diretor, f.genero].join(' ')).indexOf(termo) !== -1;
    });

    lista.textContent = '';
    filtrados.forEach(function (f) { lista.appendChild(criarCartao(f)); });

    contagem.textContent = todos.length === 1 ? '1 filme cadastrado' : todos.length + ' filmes cadastrados';

    var semResultado = filtrados.length === 0;
    vazio.hidden = !semResultado;
    if (semResultado) {
      if (todos.length === 0) {
        vazioTitulo.textContent = 'Nenhum filme cadastrado';
        vazioTexto.textContent = 'Comece cadastrando o primeiro filme da sua lista.';
        vazioAcao.hidden = false;
      } else {
        vazioTitulo.textContent = 'Nenhum filme encontrado';
        vazioTexto.textContent = 'Tente buscar por outro título, diretor ou gênero.';
        vazioAcao.hidden = true;
      }
    }
  }

  // --- Apagar ---------------------------------------------------------------

  function pedirConfirmacao(filme, botao) {
    filmeParaApagar = filme;
    botaoQueAbriu = botao;
    dialogoTexto.textContent = '“' + filme.titulo + '” será removido da lista. Essa ação não pode ser desfeita.';

    if (typeof dialogo.showModal === 'function') {
      dialogo.showModal();
    } else if (window.confirm('Apagar “' + filme.titulo + '”? Essa ação não pode ser desfeita.')) {
      apagarFilme();
    }
  }

  function apagarFilme() {
    if (!filmeParaApagar) return;
    var titulo = filmeParaApagar.titulo;
    var ok = Filmes.remover(filmeParaApagar.id);
    filmeParaApagar = null;
    desenhar();
    UI.aviso(ok ? 'Filme apagado.' : 'Não foi possível apagar “' + titulo + '”. Tente de novo.');
    if (campoBusca) campoBusca.focus();
  }

  dialogo.addEventListener('close', function () {
    var confirmou = dialogo.returnValue === 'apagar';
    dialogo.returnValue = '';
    if (confirmou) {
      apagarFilme();
    } else {
      filmeParaApagar = null;
      if (botaoQueAbriu && document.body.contains(botaoQueAbriu)) botaoQueAbriu.focus();
    }
  });

  campoBusca.addEventListener('input', desenhar);

  // --- Aviso vindo de outra página (?aviso=cadastrado / atualizado) ----------

  var AVISOS = { cadastrado: 'Filme cadastrado.', atualizado: 'Alterações salvas.' };
  var aviso = new URLSearchParams(location.search).get('aviso');
  if (aviso && AVISOS[aviso]) {
    UI.aviso(AVISOS[aviso]);
    history.replaceState(null, '', location.pathname);
  }

  desenhar();
})();
