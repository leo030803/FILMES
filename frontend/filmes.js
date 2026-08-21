async function buscarFilmes() {
    // acessar a rota GET do backend, trazer os filmes e inserir os filmes no HTML
    const resposta = await fetch("http://localhost:8000/all-movies") // JSON
    const filmes = await resposta.json() // converter o JSON em objeto javascript
    const sectionFilmes = document.querySelector(".filmes")

    filmes.forEach((filme) => {
        sectionFilmes.innerHTML += `    
                    <div>
                        <h2>${filme.title}</h2>
                        <p><strong>Gênero:</strong> ${filme.gender}</p>
                        <p><strong>Duração:</strong> ${filme.duration} minutos</p>
                        <p><strong>Classificação indicativa:</strong> ${filme.ageLimit > 0 ? filme.ageLimit + ' anos' : 'Livre'}</p>
                    </div>
                `
    })
}

buscarFilmes()