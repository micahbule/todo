const Fastify = require("fastify");
const fastifyCors= require ("fastify-cors");
const fastifyPlugin = require('fastify-plugin')

async function dbConnector (fastify, options) {
  fastify.register(require('fastify-postgres'), {
    url: 'postgres://localhost:5000/todos'
  })
}

module.exports = fastifyPlugin(dbConnector)

//middleware
const fastify = require('fastify')({
  logger: true
})

const port =process.env.PORT || '5000'
fastify.register(fastifyCors,{

});
//ROUTES//
async function routes (fastify, options) {

  const collection = fastify.postgres.collection('todos')

//create todo
  fastify.get('/todos', async (request, reply) => {
    try {
      const { description } = request.body;
      const newTodo = await collection.find().toArray(
        "INSERT INTO todo (description) VALUES($1) RETURNING *",
        [description]
      );
  
      return newTodo.rows[0];
    } catch (err) {
      console.error(err.message);
    }
  });

//get all todos
  fastify.get('/todos', async (request, reply) => {
    const result = await collection.find().toArray()
    try {
      const allTodos = await collection.find().toArray("SELECT * FROM todo");
      return allTodos.rows;
    } catch (err) {
      console.error(err.message);
    }
  });

//get a todo
  fastify.get('/todos/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const todo = await collection.findOne("SELECT * FROM todo WHERE todo_id = $1", [
        id
      ]);
  
      return todo.rows[0];
    } catch (err) {
      console.error(err.message);
    }
  });

//update a todo

fastify.put("/todos/:id", async (request, reply) => {
  try {
    const { id } = request.params;
    const { description } = request.body;
    const updateTodo = await collection.find().toArray(
      "UPDATE todo SET description = $1 WHERE todo_id = $2",
      [description, id]
    );

    return "Todo was updated!";
  } catch (err) {
    console.error(err.message);
  }
});

//delete a todo

fastify.delete("/todos/:id", async (request, reply) => {
  try {
    const { id } = request.params;
    const deleteTodo = await collection.find().toArray("DELETE FROM todo WHERE todo_id = $1", [
      id
    ]);
    return "Todo was deleted!";
  } catch (err) {
    console.log(err.message);
  }
});
}
const start = async () => {
  try {
    await fastify.listen(5000)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
routes()
start()