/**
 * Import fastify and enable logger
 * 
 * Logging is basically just printing details of certain events
 * or actions in the terminal
 */
const fastify = require('fastify')({ logger: true })

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
