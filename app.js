// module
const express = require('express')
require('dotenv').config();
const bodyParser = require('body-parser')
const path = require('path')

const app = express()
// エンコーディングするための処理
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
const ejs = require('ejs') //追加

const port = 3000

const mysql = require('mysql');


// TODO　環境に応じて接続先を変更する処理
db = mysql.createConnection({
  host: 'localhost',
  user: process.env.LOCAL_DB_USER,
  password: process.env.LOCAL_DB_PASSWORD,
  database: process.env.LOCAL_DB_NAME,
  port: process.env.LOCAL_DB_PORT,
})

db.connect((err) => {
    if(err) throw err
    console.log("Mysqlに接続しました。")
})

app.get('/', (req, res) => {
  const sql = "select * from users";
	db.query(sql, function (err, result, fields) {  
	if (err) throw err;
	res.render('index',{users : result});
	});
})

app.post('/', (req, res) => {
  const sql = "INSERT INTO users SET ?"

  db.query(sql, req.body, function (err, result) {  
    if (err) throw err;
    console.log(result)
    res.send("登録完了")
})
})


app.get('/users', (req, res) => {
	const sql = "select * from users"
	db.query(sql, function (err, result) {  
	if (err) throw err;
	res.send(result)
	});
});

app.get('/edit/:id',(req,res)=>{
	const sql = "SELECT * FROM users WHERE id = ?";
	db.query(sql,[req.params.id],function (err, result, fields) {  
		if (err) throw err;
		res.render('edit',{user : result});
		});
});

app.post('/edit/:id', (req, res) => {
	const sql = "update users set ? where id = " + req.params.id
	db.query(sql, req.body, function (err, result) {  
	if (err) throw err;
  console.log(result)
	res.redirect('/')
	});
});

app.get('/delete/:id', (req, res) => {
	const sql = "delete from users where id = ?"
	db.query(sql, [req.params.id], function (err, result) {  
	if (err) throw err;
	res.redirect('/')
	});
});

//　ユーザ作成
// const sql = "INSERT INTO users(name,email,type, password) VALUES('ishida2','ishida2@test.com', 1, 'aaaaaaaa')"

// db.query(sql,function(err, result, fields){
// 	if (err) throw err;
// 	console.log(result)
// })


app.listen(port, () => console.log(`Example app listening on port ${port}!`))