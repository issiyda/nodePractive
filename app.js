// constants
const { userType } = require("./utils/constants")

// module
const express = require('express')
require('dotenv').config();
const bodyParser = require('body-parser')
const path = require('path')

// Cookieを読み込むために必要な記述
const cookieParser = require('cookie-parser')

// Sessionを読み込むために必要な記述
const session = require('express-session');

const sequelize = require('./db/db-config');
const DbClient = require("./db/client")
const User = require("./db/model/user")

const sessionInfo = {
	secret: 'nodePractice',
	cookie: { maxAge: 300000 },
	resave: false,
	saveUninitialized: false,
  }


const app = express()
app.use(cookieParser())
app.use(session(sessionInfo))
// エンコーディングするための処理
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
const ejs = require('ejs')

const port = 3000

const mysql = require('mysql');
// 静的画像ファイル表示
app.use(express.static('static'));



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

// app.get('/', (req, res) => {
// 	res.send('Hello Express!!');
// })


app.get("/login", (req, res) => {
	res.sendFile(__dirname + '/views/login.html');
})

app.post('/login', (req, res) => {
	const username = req.body.username;
	const password = req.body.password;
	if (username === 'node' && password === 'password') {
	  req.session.regenerate((err) => {
		req.session.username = 'node';
		res.redirect('/');
	  });
	} else {
	  res.redirect('/login');
	}
});

app.get('/logout', (req, res) => {
	req.session.destroy((err) => {
	  res.redirect('/');
	});
  });

// app.use((req, res, next) => {
// 	console.log(req.session)
// 	if (req.session.username) {
// 	  next();
// 	} else {
// 	  res.redirect('/login');
// 	}
// });


app.get('/', (req, res) => {
	console.log(req.session)
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

app.get('/create', (req, res) => res.sendFile(path.join(__dirname, 'views/form.html')))


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

//=========================
// cookie編
//=========================

app.get('/cookie', (req, res) => {
	const answer = req.cookies.answer
	res.render('cookie', { answer });
});

app.post('/cookie', (req, res) => {
	console.log("req", req.body)
	let answer = ""
	if(req.body.question === "買う"){
		answer = "買う"
	}else if(req.body.question === "買わない"){
		answer = "買わない"
	}
	res.cookie("answer", answer).redirect('/cookie')
});


//=========================
// sequelize編
//=========================


// sequelizeに繋がってるか確かめる
app.get("/connection", async (req, res) => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
		res.send("Connection OK")
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
})

// sequelizeでユーザ作成フォーム表示
app.get("/sequelize/list", async (req, res) => {
	const users = await User.findAll()
	res.render('sequelize/index',{users });
})


// sequelizeでユーザ作成フォーム表示
app.get("/sequelize/create", async (req, res) => {
	User.sync({ alter: true })
	res.sendFile(path.join(__dirname, 'views/sequelize/form.html'))
})

// sequelizeでユーザ作成
app.post("/sequelize/create", async (req, res) => {
	const params = req.body
	const user = await User.create({
		type: userType.USER,
		email: params.email,
		name: params.name,
		password: params.password
	})
	res.redirect('/sequelize/list');
})

// sequelizeでユーザ更新フォーム
app.get("/sequelize/edit/:userId", async (req, res) => {
	console.log("userId",req.params.userId)
	const user = await User.findByPk(req.params.userId)
	console.log("user",user)
	res.render('sequelize/edit',{ user });
})

// sequelizeでユーザ更新
app.post("/sequelize/edit/:userId", async (req, res) => {
	const params = req.body
	console.log(req.params.userId)
	const user = await User.update({
		email: params.email,
		name: params.name,
	},{
	where: { id: req.params.userId }
	})
	const targetUser = await User.findByPk(user[0])
	res.redirect('/sequelize/list');
})

// sequelizeでユーザ削除フォーム
app.get("/sequelize/delete/:userId", async (req, res) => {
	const user = await User.findByPk(req.params.userId)
	res.render('sequelize/delete',{user});
})

// sequelizeでユーザ削除
app.post("/sequelize/delete/:userId", async (req, res) => {
	const user = await User.destroy({
		where: { id: req.params.userId }
	})
	res.redirect('/sequelize/list');
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))