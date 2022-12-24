const aws = require("aws-sdk")
aws.config.update({region: 'ap-southeast-1'});
const sqs = new aws.SQS({region: 'ap-southeast-1'})

exports.handler = async (event) => {
    let name = event["name"]
    let numberOfOrder = event["num"]
    let orderId = 1000
    const records = []
    console.log("Step 0")
    for(var i=0;i<numberOfOrder;i++){
        const params = {
            MessageBody: JSON.stringify({
                orderId: orderId*i,
                orderMessage: `This is Order Number ${name}`,
                timeStamp: new Date().toISOString()
            }),
            QueueUrl: "https://sqs.ap-southeast-1.amazonaws.com/479263886742/myPizzaShop.fifo ",
            MessageDeduplicationId: orderId.toString(),
            MessageGroupId: `Group`
        }
        orderId++
        records.push(params)
    }
    
    for(var rec of records){
    await sqs.sendMessage(rec).promise().then(res=>{
        console.log(res)
    },err=>{
        console.log(rec)
        console.log(err)
    })  
    }
    
    return true
};
