//Function to test if result and expected are equal
const toBe = (res, exp) =>{

    console.log(`Expected: ${exp}\nResult: ${res}`)
    if(res === exp){
        console.log('\x1b[32m')
        console.log('Sucess!')
    }else{
        console.log('\x1b[31m')
        console.log('Fail!')
    }
    console.log('\x1b[0m')

}

//Function to test if result and expected aren't equal
const notToBe = (res, exp) => {

    console.log(`Expected: ${exp}\n Result: ${res}`)
    if(res !== exp){
        console.log('\x1b[32m')
        console.log('Sucess!')
    }else{
        console.log('\x1b[31m')
        console.log("Fail!")
    }
    console.log('\x1b[0m')

}

//Special function to prevent the console.log of a image stream
const notToBeStream = (res, exp) => {

    if(res !== exp){
        console.log('\x1b[32m')
        console.log('Sucess!')
    }else{
        console.log('\x1b[31m')
        console.log("Fail!")
    }
    console.log('\x1b[0m')

}

//Object expect which handles the functions above
const expect = {

    toBe: toBe,
    notToBe: notToBe,
    notToBeStream: notToBeStream

}

//Function which receives a message and a callback function as params
//Logs the message to start the test results then callback a method to show the results
const it = (msg, cb) => {

    console.log(`---> ${msg}\n`)
    cb()

}

module.exports = {

    expect: expect,
    it: it,

}