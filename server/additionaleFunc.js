import crypto from 'crypto';

import { connection } from './server.js';
const key = Buffer.from('33332456457913456893993585749583');

export function encrypt(text) {
    const iv = crypto.randomBytes(16); 
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
}

export function decrypt(encryptedText) {
    const parts = encryptedText.split(':');
    const iv = Buffer.from(parts.shift(), 'hex'); 
    const encryptedTextBuffer = Buffer.from(parts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedTextBuffer, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

export function setHash (str){
    return crypto.createHash('sha256').update(str).digest('hex')
}

export function uniqueID (length, type = 'hex') {
    return crypto.randomBytes(length).toString(type)
}

export function getCurrentTypeData (respone = []) {
  let arr = []
  respone.map(elem => arr.push(getCurrentElemObj(elem)))

  return Object.assign(...arr)
  /* 
    id: 'Lq7fX5',
    userName: 'name',
    nameTest: 'Новый тест',
    '0_textQUE': 'wwwwwwwwwwwwwwwwwwww',
    '0_type': 'radio',
    '0_answerTrue': 't',
    '0_answerFalse': 'f',
    ...

    переделывает в такой тип
  */
}

function getCurrentElemObj (obj){
  const idOrganize = obj.idOrganize

  return {
    id: obj.id,
    userName: obj.userName,
    nameTest: obj.nameTest,

    [idOrganize + '_textQUE']: obj.textQUE,
    [idOrganize + '_type']: obj.type,
    [idOrganize + '_' + obj.answerType]: obj.answer.split('(.Y.)')
  }
}

export function getCurrentDataForEdit (param=[]) {
  let arr = []
  param.map((elem) => {
    let tempArr = []

    elem.answer.split('(.Y.)').map(elem => {
      tempArr.push([uniqueID(5), elem])
    })
    
    return arr = [...arr,
      {
        id: uniqueID(5),
        type: elem.type,
        text: elem.textQUE,
        [elem.answerType]: tempArr
      }
    ]
  })

  for (let i = 0; i < arr.length; i++) {
    if (arr[i + 1] && arr[i].text === arr[i + 1].text) {
        Object.assign(arr[i], arr[i + 1]);
        arr.splice(i + 1, 1);
        i--;
    }
  }
  
  return arr
}

export async function setDataToSQLFromCreatePage(body, idTest, req){
  await connection.query(`
    INSERT INTO test (id, userName, nameTest, privat) VALUES ('${idTest}', '${decrypt(req.cookies.n)}', '${body.nameTest}', ${body.privat ? 1 : 0})
  `)
  
  for (let key in body){
    let x = key.split('_')
    let id = x[0]
    
    let idAnswer 
    
    if (body[id + '_answerTrue']){
      idAnswer = uniqueID(10)
      await connection.query(`
        INSERT INTO answer (id, type, answ) 
        VALUES ('${idAnswer}', 'answerTrue',
          '${typeof body[id + '_answerTrue'] === 'object' ? body[id + '_answerTrue'].join('(.Y.)') : body[id + '_answerTrue']}')
      `)

      if (body[id + '_answerFalse']){
        await connection.query(`
          INSERT INTO answer (id, type, answ) 
          VALUES ('${idAnswer}', 'answerFalse',
          '${typeof body[id + '_answerFalse'] === 'object' ? body[id + '_answerFalse'].join('(.Y.)') : body[id + '_answerFalse']}')
        `)
      }
    }
    
    
    if (idAnswer){
      
      await connection.query(`
        INSERT INTO questions (id_organize, id_test, type, id_answ, text) 
        VALUES (${+id}, '${idTest}', '${body[id + '_' + 'type']}', '${idAnswer}', '${body[id + '_textQUE']}')
      `)
    }
  }
}

export async function  deleteTestFromDB(idTestFromParams) {
  await connection.query(`
    DELETE FROM answer
    WHERE id IN (
      SELECT questions.id_answ
      FROM questions
      WHERE questions.id_test = '${idTestFromParams}'
    );
  `)
  await connection.query(`
    DELETE FROM questions
    WHERE id_test = '${idTestFromParams}';
  `)
  await connection.query(`
    DELETE FROM test
    WHERE id = '${idTestFromParams}';
  `)
}

export async function getTestFormDBtoResolution (req) {
  return await connection.query(`
    SELECT 
    test.id, test.userName, test.nameTest, 
    questions.text AS textQUE, questions.type, questions.id_organize AS idOrganize,
    answer.type AS answerType, answer.answ AS answer


    FROM test 
    LEFT JOIN questions 
    ON test.id = questions.id_test
    LEFT JOIN answer 
    ON questions.id_answ = answer.id
    WHERE test.id='${req.params.id}'
  `)
}

export function setRandomSort (arr) {
  let tempArr = []
  
  do{
    let randomNum = Math.floor(Math.random() * arr.length)
    
    tempArr.push(arr[randomNum])
    arr.splice(randomNum, 1)
  } while (arr.length)
  
  return tempArr  
}
