/*
 * Funções de interface usadas em todas as páginas.
 * Tudo é montado com textContent (nunca innerHTML) para evitar injeção de HTML.
 */
(function (global) {
  'use strict';

  function el(tag, classe, texto) {
    var e = document.createElement(tag);
    if (classe) e.className = classe;
    if (texto !== undefined && texto !== null) e.textContent = texto;
    return e;
  }

  function formatarNota(n) {
    return Number(n).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  }

  // Gera uma cor estável a partir do título, para pôsteres sem imagem.
  function matiz(texto) {
    var h = 0;
    for (var i = 0; i < texto.length; i++) h = (h * 31 + texto.charCodeAt(i)) % 360;
    return h;
  }

  function criarPoster(filme) {
    var titulo = filme.titulo || 'Sem título';
    var poster = el('div', 'poster');
    poster.style.setProperty('--h', matiz(titulo));

    if (/^https?:\/\/\S+$/i.test(filme.poster || '')) {
      var img = new Image();
      img.alt = '';
      img.loading = 'lazy';
      img.onerror = function () {
        poster.classList.remove('tem-imagem');
        img.remove();
      };
      img.src = filme.poster;
      poster.classList.add('tem-imagem');
      poster.appendChild(img);
    }

    poster.appendChild(el('span', 'poster-titulo', titulo));
    return poster;
  }

  // Aviso curto no rodapé (ex.: "Filme apagado.").
  var regiaoAviso = el('div', 'aviso');
  regiaoAviso.setAttribute('role', 'status');
  document.body.appendChild(regiaoAviso);
  var timerAviso;

  function aviso(texto) {
    regiaoAviso.textContent = texto;
    regiaoAviso.classList.add('visivel');
    clearTimeout(timerAviso);
    timerAviso = setTimeout(function () { regiaoAviso.classList.remove('visivel'); }, 3500);
  }

  global.UI = { el: el, formatarNota: formatarNota, criarPoster: criarPoster, aviso: aviso };
})(window);
