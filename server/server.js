/**
 * Import fastify and enable logger
 * 
 * Logging is basically just printing details of certain events
 * or actions in the terminal
 */
const fastify = require('fastify')({ logger: true })

/**
 * Define database constants
 * 
 * It is important to define it this way as we can extract this
 * to a configuration file. More on this post-demo.
 */
const DATABASE_USER = 'postgres'
const DATABASE_PASSWORD = 'SomeSecurePassword'
const DATABASE_HOST = 'localhost'
const DATABASE_NAME = 'todo-test'

/** Complete DB connection string */
const dbConnectionString = `postgres://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_HOST}/${DATABASE_NAME}`

fastify.log.info(`Connecting to DB ${dbConnectionString}`)

/** Connect to the database */
fastify.register(require('fastify-postgres'), {
    connectionString: dbConnectionString,
})

/** Define GET /todos route */
fastify.get('/todos', async (request, reply) => {
    /** Get a client connection to the database */
    const client = await fastify.pg.connect()

    /** Execute query */
    const { rows } = await client.query('SELECT * FROM todoitems')

    /** Release client -- basically close connection */
    client.release()

    /** Return queried data */
    return rows
})

/**
 * Define an async function called start()
 */
const start = async () => {
    try {
        /**
         * Listen for incoming requests on port 3000
         * 
         * More details to this post-demo
         */
        await fastify.listen(3000)
    } catch (err) {
        /**
         * If server boot up encounters any errors
         * (ex. port taken), log the error
         */
        fastify.log.error(err)

        /** ...then exit the application */
        process.exit(1)
    }
}

/** Call the start() function */
start()
