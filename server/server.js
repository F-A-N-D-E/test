import bodyParser from 'body-parser';
import express from 'express'
import querystring from 'node:querystring';
import cookieParser from 'cookie-parser';
import expressSession from 'express-session'
import mysql from 'mysql2/promise'

import {
  setHash,
  encrypt,
  decrypt,
  getCurrentTypeData,
  uniqueID,
  getCurrentDataForEdit,
  setDataToSQLFromCreatePage,
  deleteTestFromDB,
  getTestFormDBtoResolution,
  setRandomSort
} from './additionaleFunc.js'

const app = express(); 

app.use(bodyParser.urlencoded({ extended: true }));

const secret = 'закрыто'
app.use(cookieParser(secret))
  app.use(expressSession({
  secret: secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: false,
  }
}))
const cookieSetting = {
  secuer: false,
  httpOnly: false,
}

export const connection = await mysql.createPool({
  'connectionLimit': 100,
  'host': 'закрыто',
  'database': 'закрыто', 
  'user': 'закрыто',
  'password': 'закрыто'
})


app.get('/api/authorization', (req, res) => {
  if (req.session.regUser == false){
    req.session.regUser = true
    res.send(false)
  } else {
    res.send('')
  }
})

app.post('/api/authorization', async (req, res) => {
  let body = req.body // name, password
  
    try {
      let responFromDB = await connection.query(`
        SELECT name FROM users WHERE name = '${body.name}'
      `)
      if (responFromDB[0][0]){
        req.session.regUser = false
        res.redirect('/authorization')
      } else {
        await connection.query(`
          INSERT INTO users (name, password_hash) VALUES ('${body.name}', '${setHash(body.password)}')
        `)
        delete req.session.regUser
        res.redirect('/login')
      }
    } catch (err){
      console.log(err)
    }
})

app.get('/api/login', async (req,res)=>{
  let q = req.headers.referer.split('?')[1]

  if (q){
    let query = querystring.parse(q)
    let responFromDB = await connection.query(`
      SELECT * FROM users WHERE name='${query.name}' AND password_hash='${setHash(query.password)}'
    `)

    if (responFromDB[0][0]) {
      res.cookie('n', encrypt(query.name))
      res.send({reg: true})
    } else {
      res.send({reg: false})
    }
  } else {
    res.send({})
  }
})

app.get('/api/create/:name/:id?', async (req, res) => {
  const idTest = req.params.id
  if (idTest){
    let responFromDB = await connection.query(`
      SELECT 
      test.id, test.userName, test.nameTest, test.privat,
      questions.text AS textQUE, questions.type, questions.id_organize AS idOrganize,
      answer.type AS answerType, answer.answ AS answer
  
  
      FROM test 
      LEFT JOIN questions 
      ON test.id = questions.id_test
      LEFT JOIN answer 
      ON questions.id_answ = answer.id
      WHERE test.id='${idTest}'
    `)
    res.send({
      data: getCurrentDataForEdit(responFromDB[0]),
      nameTest: responFromDB[0][0].nameTest,
      privat: responFromDB[0][0].privat
    })
  } else {
    res.send({data: ''})
  }
})


app.post('/api/create/:name/:id?', async (req, res)=>{
  const body = req.body
  const idTest = uniqueID(10)

  const idTestFromParams = req.params.id
  
  if (!idTestFromParams){
    await setDataToSQLFromCreatePage(body, idTest, req)
  
    res.redirect('/')
  } else {
    await deleteTestFromDB(idTestFromParams)

    await setDataToSQLFromCreatePage(body, idTest, req)
    res.redirect('/')
  }
  
})



app.get('/api/resolution/:id/', async(req, res) => {
  let responFromDB = await getTestFormDBtoResolution(req)

  let dataProcess = {}
  let dataFromServer = getCurrentTypeData(responFromDB[0])
  
  for (let key in dataFromServer) {
    let split = key.split('_')

    if ((+split[0] || +split[0] === 0) && !split[1].startsWith('answer')) {
      dataProcess[+split[0]] = {
        ...dataProcess[+split[0]],
        [split[1]]: dataFromServer[key]
      }

    } else if (split[0] === 'nameTest') {
      dataProcess.info = dataFromServer[key]

    } else if (split[1]) {
      let valFalse = dataFromServer[split[0] + '_answerFalse']
      let valTrue = dataFromServer[split[0] + '_answerTrue']

      if (typeof valTrue === 'object' && typeof valFalse === 'object') {
        dataProcess[+split[0]].answer = setRandomSort([...valFalse, ...valTrue])
      } else if (typeof valTrue === 'object' && typeof valFalse === 'string') {
        dataProcess[+split[0]].answer = setRandomSort([...valTrue, valFalse])
      } else if (typeof valTrue === 'string' && typeof valFalse === 'object') {
        dataProcess[+split[0]].answer = setRandomSort([...valFalse, valTrue])
      } else if (typeof valTrue === 'string' && typeof valFalse === 'string') {
        dataProcess[+split[0]].answer = setRandomSort([valTrue, valFalse])
      } else if (!valTrue) {
        dataProcess[+split[0]].answer = [valFalse]
      } else if (!valFalse) {
        dataProcess[+split[0]].answer = [] // чтобы в консоле не было ответов при типе 'text'
      }
    }
  }
  dataProcess = Object.values(dataProcess)
  
  res.send({data: dataProcess})
})

app.post('/api/resolution/:id/', async (req, res) => {
  res.clearCookie('resolution')
  
  try {
    let responFromDB = await getTestFormDBtoResolution(req)

    let dataFindId = getCurrentTypeData(responFromDB[0])
    let body = req.body
    
    let responCheck = {}

    for (let key in dataFindId){
      let split = key.split('_')
      
        if (split[1] == 'textQUE'){
          let keyTextNum = split[0]
          let answerTrue

          for (let elem of Object.keys(dataFindId)){
            let splitElem = elem.split('_')
            
            if (keyTextNum == splitElem[0] && splitElem[1] == 'answerTrue'){
              answerTrue = (dataFindId[elem])
            }
          }

          responCheck = {
            ...responCheck,
            [dataFindId[key]]: answerTrue
          }
          
        }
    }
    
    let elem = {
      name: dataFindId.nameTest,
      data: body,
      tureAnswer: responCheck
    }

    req.session.test = elem
    
    res.redirect(`/resolution/${req.params.id}/check`)
  } catch (err) {
    res.status(500).send('Такой тест не найден')
  }
})

app.get('/api/resolution/:id/check', async (req, res) => {
  let responFromDB = await connection.query(`
    SELECT MAX(id_organize) AS length
    FROM questions
    WHERE id_test = '${req.params.id}'
  `)
  
  res.send({
    data: req.session.test,
    length: responFromDB[0][0].length
  })
  delete req.session.test
})





app.get('/api/personal/:name', async (req, res) => {
  try {
      let responFromDB = await connection.query(`
      SELECT test.nameTest, test.id, test.privat,
      MAX(questions.id_organize) AS length
      
      FROM test
      LEFT JOIN questions
      ON test.id = questions.id_test
      WHERE userName = '${decrypt(req.params.name)}'
      GROUP BY test.id, test.nameTest, test.privat
    `)
    res.send({data: responFromDB[0]})
  } catch (err){
    res.status(500).send('Ошибка БД')
  }
})

app.delete('/api/personal/remove/:idTest', async (req, res) => {
  try {
    let idTest = req.params.idTest

    await deleteTestFromDB(idTest)
    res.status(204).send()
  } catch (err){
    res.status(500).send('Ошибка БД')
  }
})

app.get('/api/', async(req, res) => {
  try {
    let responFromDB = await connection.query(`
    SELECT test.id, test.userName, test.nameTest,
    MAX(questions.id_organize) AS length

    FROM test
    LEFT JOIN questions
    ON test.id = questions.id_test
    WHERE test.privat != 1
    GROUP BY test.id, test.userName, test.nameTest
  `) 
  
  res.send({data: responFromDB[0]})
  } catch (err) {
    res.status(500).send('Ошибка БД')
  }
})

app.listen(3000)
