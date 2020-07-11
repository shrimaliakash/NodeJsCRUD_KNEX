const options = {
    client: 'mysql2',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: '123456',
        database: 'nodejs'
    }
}

const knex = require('knex')(options);

knex.schema.createTable('book', (table) => {
    table.increments('id')
    table.integer('isbn')
    table.string('title')
    table.string('author')
    table.date('publish_date')
    table.string('publisher')
    table.integer('numOfPages')
}).then(() => console.log("table created"))
    .catch((err) => { console.log(err); throw err })
    .finally(() => {
        knex.destroy();
    });