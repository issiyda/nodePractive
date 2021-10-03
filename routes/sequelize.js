//=========================
// sequelize編
//=========================
const router = require("express").Router();
const sequelize = require('../db/db-config');
const User = require("../db/model/user")
const path = require('path')

// constants
const { userType } = require("../utils/constants")


// sequelizeに繋がってるか確かめる
router.get("/", async (req, res) => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
		res.send("Connection OK")
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
})

// sequelizeでユーザ作成フォーム表示
router.get("/list", async (req, res) => {
	const users = await User.findAll()
	res.render('sequelize/index',{users });
})


// sequelizeでユーザ作成フォーム表示
router.get("/create", async (req, res) => {
	User.sync({ alter: true })
	res.sendFile(path.join(__dirname, '../views/sequelize/form.html'))
})

// sequelizeでユーザ作成
router.post("/create", async (req, res) => {
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
router.get("/edit/:userId", async (req, res) => {
	console.log("userId",req.params.userId)
	const user = await User.findByPk(req.params.userId)
	console.log("user",user)
	res.render('sequelize/edit',{ user });
})

// sequelizeでユーザ更新
router.post("/edit/:userId", async (req, res) => {
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
router.get("/delete/:userId", async (req, res) => {
	const user = await User.findByPk(req.params.userId)
	res.render('sequelize/delete',{user});
})

// sequelizeでユーザ削除
router.post("/delete/:userId", async (req, res) => {
	const user = await User.destroy({
		where: { id: req.params.userId }
	})
	res.redirect('/sequelize/list');
})

module.exports = router