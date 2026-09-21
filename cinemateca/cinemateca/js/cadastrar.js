/* Página de cadastro: monta o formulário vazio e cria o filme ao enviar. */
(function () {
  'use strict';

  Formulario.montar(document.getElementById('form-raiz'), {
    rotuloEnvio: 'Cadastrar filme',
    aoEnviar: function (dados) {
      var filme = Filmes.criar(dados);
      if (!filme) return false;
      location.href = 'index.html?aviso=cadastrado';
      return true;
    }
  });
})();
