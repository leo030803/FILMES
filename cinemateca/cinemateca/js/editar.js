/* Página de edição: lê o id na URL (editar.html?id=...), preenche o formulário e salva. */
(function () {
  'use strict';

  var raiz = document.getElementById('form-raiz');
  var id = new URLSearchParams(location.search).get('id');
  var filme = id ? Filmes.buscar(id) : null;

  if (!filme) {
    var vazio = UI.el('div', 'vazio');
    vazio.appendChild(UI.el('h2', null, 'Filme não encontrado'));
    vazio.appendChild(UI.el('p', 'suave', 'Ele pode ter sido apagado ou o endereço está incompleto.'));
    var voltar = UI.el('a', 'btn', 'Voltar para a lista');
    voltar.href = 'index.html';
    vazio.appendChild(voltar);
    raiz.appendChild(vazio);
    return;
  }

  document.title = 'Editar ' + filme.titulo + ' | Cinemateca';

  Formulario.montar(raiz, {
    filme: filme,
    rotuloEnvio: 'Salvar alterações',
    aoEnviar: function (dados) {
      if (!Filmes.atualizar(id, dados)) return false;
      location.href = 'index.html?aviso=atualizado';
      return true;
    }
  });
})();
