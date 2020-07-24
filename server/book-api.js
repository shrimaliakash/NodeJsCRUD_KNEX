const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3001;

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

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/book', (req, res) => {
    if(req.body.isbn == '' || req.body.isbn == null) {
        res.send(JSON.stringify({success: false, message: 'Please enter isbn'}));
    } else if(req.body.title == '' || req.body.title == null) {
        res.send(JSON.stringify({success: false, message: 'Please enter title'}));
    } else if(req.body.author == '' || req.body.author == null) {
        res.send(JSON.stringify({success: false, message: 'Please enter author'}));
    } else if(req.body.publish_date == '' || req.body.publish_date == null) {
        res.send(JSON.stringify({success: false, message: 'Please enter publish_date'}));
    } else if(req.body.publisher == '' || req.body.publisher == null) {
        res.send(JSON.stringify({success: false, message: 'Please enter publisher'}));
    } else if(req.body.numOfPages == '' || req.body.numOfPages == null) {
        res.send(JSON.stringify({success: false, message: 'Please enter numOfPages'}));
    }
    if(req.body.isbn != '' && req.body.title != '' && req.body.author != '' 
        && req.body.publish_date != '' && req.body.publisher != '' 
        && req.body.numOfPages != '') {
        const book =  [{
            isbn : req.body.isbn,
            title : req.body.title,
            author : req.body.author,
            publish_date : req.body.publish_date,
            publisher : req.body.publisher,
            numOfPages : req.body.numOfPages
        }];
        knex('book').insert(book)
            .then((book) => res.send(JSON.stringify({success: true, message: 'Book Inserted.'})))
            .catch((err) => res.send(JSON.stringify({success: false, message: err})));

    } else {
        res.send(JSON.stringify({success: false, message: 'Book Not Inserted.'}));
    }
});

app.get('/book', (req, res) => {
    knex('book').select("*")
    .then((rows) => {
        if(rows != '') {
            res.send(JSON.stringify({success: true, message: 'Book Found.', data: rows}))
        } else {
            res.send(JSON.stringify({success: true, message: 'Book Not Found.'}))
        }
    })
    .catch((err) => { res.send(JSON.stringify({success: false, message: 'Book Not Found.'})) });
});

app.get('/book/:id', (req, res) => {
    const id = req.params.id;

    knex('book').select("*").where('id', id).first()
    .then((rows) => {
        if(rows != '') {
            res.send(JSON.stringify({success: true, message: 'Book Found.', data: rows}))
        } else {
            res.send(JSON.stringify({success: true, message: 'Book Not Found.'}))
        }
    })
    .catch((err) => { res.send(JSON.stringify({success: false, message: 'Book Not Found.'})) });
});

app.post('/book/:id', (req, res) => {
    const id = req.params.id;
    if(req.body != '') {
	var book_details = knex('book').select("*").where('id', id).first()
	.then((rows) => {
		if(rows != '') {
            const books =  {
                isbn : req.body.isbn != '' ? req.body.isbn : rows.isbn,
                title : req.body.title != '' ? req.body.title : rows.title,
                author : req.body.author != '' ? req.body.author : rows.author,
                publish_date : req.body.publish_date != '' ? req.body.publish_date : rows.publish_date,
                publisher : req.body.publisher != '' ? req.body.publisher : rows.publisher,
                numOfPages : req.body.numOfPages != '' ? req.body.numOfPages : rows.numOfPages
            };
			knex('book').where({ id: id }).update(books)
		    .then((book) => res.send(JSON.stringify({success: true, message: 'Book Updated.'})))
		    .catch((err) => res.send(JSON.stringify({success: false, message: err})));
		} else {
		    res.send(JSON.stringify({success: true, message: 'Book Not Found.'}))
		}
	})
	.catch((err) => { res.send(JSON.stringify({success: false, message: 'Book Not Found.'})) });
    } else {
        res.send(JSON.stringify({success: false, message: 'Book Not Updated.'}));
    }
});

app.delete('/book/:id', (req, res) => {
    const id = req.params.id;
    knex('book').where({ id: id }).del()
        .then((book) => res.send(JSON.stringify({success: true, message: 'Book Deleted.'})))
        .catch((err) => res.send(JSON.stringify({success: false, message: err})));
});

app.listen(port, () => console.log(`Book listing app listening on port ${port}!`));
