import express, { request, response } from "express"
import mysql2 from "mysql2"
const app = express()

app.use(express.json())

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


app.get("/active-tasks", (request, response) => {
  const selectCommand = "SELECT * FROM filmes_LeonardoBragadeSouza WHERE status = 0"

  sql.query(selectCommand, (error, data) => {
      if (error) {
          console.log(error)
          return
      }

      response.json(data)
  })
})


app.get("/completed-tasks", (request, response) => {
  const selectCommand = "SELECT * FROM filmes_LeonardoBragadeSouza WHERE status = 1"

  sql.query(selectCommand, (error, data) => {
      if (error) {
          console.log(error)
          return
      }

      response.json(data)
  })
})


app.post("/create-task", (request, response) => {

   const {description, status} = request.body

   const insertCommand = "INSERT INTO filmes_LeonardoBragadeSouza(description, status) VALUES(?, ?)"
   
   sql.query(insertCommand, [description, status], (error) => {

    if (error) {

     console.log(error)
     return
   }

   response.status(201).json({

   message: "Tarefa finalizada com sucesso!"

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

        message:"Tarefa apagada com sucesso!"


       })



     })


})


app.listen(6666, () => {
    console.log("Servidor rodando na porta 6666")
})


const sql = mysql2.createPool ({

host: "benserverplex.ddns.net",
database: "alunos_filmes03TA",
user: "aluno_filmes",
password: "aluno@filmes"


})

 
 




