
function encodeMyPayMessage(obj){
    return `[${obj.title}] ${obj.message}`
//     `[May Dinner] you owe me for dinner`
    
}

function decodeMyPayMessage(input){
    let re = /^\[(.*?)\] (.*)$/
    let matches = re.exec(input)
    if(matches && matches.length === 3){
        return {
            title: matches[1],
            message: matches[2]
        }
    }
    return null
}

module.exports = {
    encodeMyPayMessage,
    decodeMyPayMessage,
}
  