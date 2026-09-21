/*
 * Camada de dados do sistema de filmes.
 * Guarda tudo no localStorage do navegador (chave "cinemateca:filmes").
 * Operações: listar, buscar, criar, atualizar e remover.
 */
(function (global) {
  'use strict';

  var CHAVE = 'cinemateca:filmes';
  var agora = Date.now();

  // Filmes de exemplo, mostrados só na primeira visita.
  var EXEMPLOS = [
    {
      id: 'ex-cidade-de-deus', titulo: 'Cidade de Deus', diretor: 'Fernando Meirelles',
      ano: 2002, genero: 'Drama', duracao: 130, nota: 8.6, poster: '',
      sinopse: 'Dois jovens crescem em lados opostos da violência numa favela do Rio de Janeiro, entre os anos 1960 e 1980.',
      criadoEm: agora - 4000
    },
    {
      id: 'ex-central-do-brasil', titulo: 'Central do Brasil', diretor: 'Walter Salles',
      ano: 1998, genero: 'Drama', duracao: 110, nota: 8.0, poster: '',
      sinopse: 'Uma ex-professora que escreve cartas numa estação do Rio embarca numa viagem pelo sertão com um menino que perdeu a mãe.',
      criadoEm: agora - 3000
    },
    {
      id: 'ex-auto-da-compadecida', titulo: 'O Auto da Compadecida', diretor: 'Guel Arraes',
      ano: 2000, genero: 'Comédia', duracao: 104, nota: 8.5, poster: '',
      sinopse: 'João Grilo e Chicó, dois amigos espertos do sertão nordestino, vivem de pequenos golpes até chegarem ao julgamento final.',
      criadoEm: agora - 2000
    },
    {
      id: 'ex-tropa-de-elite', titulo: 'Tropa de Elite', diretor: 'José Padilha',
      ano: 2007, genero: 'Ação', duracao: 115, nota: 7.9, poster: '',
      sinopse: 'Um capitão do BOPE precisa encontrar um sucessor enquanto enfrenta o tráfico no Rio de Janeiro dos anos 1990.',
      criadoEm: agora - 1000
    }
  ];

  function gerarId() {
    return 'f' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function gravar(lista) {
    try {
      localStorage.setItem(CHAVE, JSON.stringify(lista));
      return true;
    } catch (e) {
      return false;
    }
  }

  function ler() {
    try {
      var bruto = localStorage.getItem(CHAVE);
      if (bruto === null) {
        gravar(EXEMPLOS);
        return EXEMPLOS.slice();
      }
      var lista = JSON.parse(bruto);
      return Array.isArray(lista) ? lista : [];
    } catch (e) {
      return [];
    }
  }

  function listar() {
    return ler().sort(function (a, b) { return (b.criadoEm || 0) - (a.criadoEm || 0); });
  }

  function buscar(id) {
    var lista = ler();
    for (var i = 0; i < lista.length; i++) {
      if (lista[i].id === id) return lista[i];
    }
    return null;
  }

  // Devolve o filme criado, ou null se não foi possível gravar.
  function criar(dados) {
    var lista = ler();
    var filme = Object.assign({}, dados, { id: gerarId(), criadoEm: Date.now() });
    lista.push(filme);
    return gravar(lista) ? filme : null;
  }

  // Devolve o filme atualizado, ou null se não existe / não foi possível gravar.
  function atualizar(id, dados) {
    var lista = ler();
    for (var i = 0; i < lista.length; i++) {
      if (lista[i].id === id) {
        lista[i] = Object.assign({}, lista[i], dados, { id: id });
        return gravar(lista) ? lista[i] : null;
      }
    }
    return null;
  }

  // Devolve true se o filme foi apagado.
  function remover(id) {
    var lista = ler();
    var restantes = lista.filter(function (f) { return f.id !== id; });
    if (restantes.length === lista.length) return false;
    return gravar(restantes);
  }

  global.Filmes = { listar: listar, buscar: buscar, criar: criar, atualizar: atualizar, remover: remover };
})(window);
