import express, { request, response } from "express"
import mysql2 from "mysql2"
import cors from "cors"
const app = express()

app.use(express.json())
app.use(cors())


app.get("/all-tasks", (request, response) => {
  const selectCommand = "SELECT * FROM filmes_LeonardoBragadeSouza"

  sql.query(selectCommand, (error, data) => {
      if (error) {
          console.log(error)
          return
      }

      response.json(data)
  })
})


app.get("/filmes", (request, response) => {
  const selectCommand = "SELECT * FROM filmes_LeonardoBragadeSouza"

  sql.query(selectCommand, (error, data) => {
      if (error) {
          console.log(error)
          return
      }

      response.json(data)
  })
})


app.get("/completed-tasks", (request, response) => {
  const selectCommand = "SELECT * FROM filmes_LeonardoBragadeSouza"

  sql.query(selectCommand, (error, data) => {
      if (error) {
          console.log(error)
          return
      }

      response.json(data)
  })
})


app.post("/create-movie", (request, response) => {

   const {titulo, genero, duracao, ClassificacaoEtaria} = request.body

   const insertCommand = "INSERT INTO filmes_LeonardoBragadeSouza(titulo, genero, duracao, ClassificacaoEtaria) VALUES(?, ?, ?, ?)"
   
   sql.query(insertCommand, [titulo, genero, duracao, ClassificacaoEtaria], (error) => {

    if (error) {

     console.log(error)
     return
   }

   response.status(201).json({

   message: "Filme cadastrado com sucesso!"

   })

   })
})


app.delete("/delete-task/:id", (request, response) => {

     const {id} = request.params

     const deleteCommand = "DELETE FROM filmes_LeonardoBragadeSouza WHERE id=?"


     sql.query(deleteCommand, [id], (error) => {

       if (error) {

         console.log(error)

         return
 

       }


       response.json({

        message:"Filme apagado com sucesso!"


       })



     })


})


app.listen(6666, () => {
    console.log("Servidor rodando na porta 6666")
})


const sql = mysql2.createPool ({

host: "benserverplex.ddns.net",
database: "alunos_filmes03TA",
user: "alunos",
password: "senhaAlunos"


})

 
 




