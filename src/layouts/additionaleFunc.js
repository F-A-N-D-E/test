import { nanoid } from 'nanoid'

export function resetLocalStorage () {
  localStorage.setItem('dataForCreate', 
    JSON.stringify([{
      id: nanoid(10),
      type: 'radio',
      text: '',
      answerTrue: [
          [nanoid(3), '']
      ],
      answerFalse: [
          [nanoid(3), '']
      ],
  }]))
  localStorage.setItem('dataForCreateExtraInfo', JSON.stringify({
    nameTest: '',
    privat: false
  }))
}

export function setDefultLocalStorage (key) {
  if (key === 'dataForCreate'){
    localStorage.setItem('dataForCreate', 
      JSON.stringify([{
        id: nanoid(10),
        type: 'radio',
        text: '',
        answerTrue: [
            [nanoid(3), '']
        ],
        answerFalse: [
            [nanoid(3), '']
        ],
    }]))
  } else if (key === 'dataForCreateExtraInfo'){
    localStorage.setItem('dataForCreateExtraInfo', JSON.stringify({
      nameTest: '',
      privat: false
    }))
  }
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