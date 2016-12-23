import * as lambda from 'aws-lambda';
import request from 'superagent';
import * as token from './token';

const endpoint = 'https://api.line.me/v2/bot/message/reply';
const accessToken = token;

// lambda function 'hello' for local test
export function hello(event: any, context: lambda.Context, callback: lambda.Callback) {  
    const response = {
      statusCode: 200,
      body: JSON.stringify({ "message": "Hello from TypeScript!" })
    };
  callback(null,  response);
};

// line webhook
export function webhook(event:any , context: lambda.Context, callback: lambda.Callback){
  var body = JSON.parse(event.body);
  body.events.forEach(function(data) {
    var replyToken = data.replyToken;
    var message = data.message.text

    request.post(endpoint)
            .set('Content-type', 'application/json; charset=UTF-8')
            .set('Authorization',  'Bearer ' + accessToken)
            .send({
              replyToken: replyToken,
              messages: [
                {
                  type: 'text',
                  text: message,
                },
              ],
            })
            .end(function(error){
              if (error) {
                console.log(error);
              }
            });
  });

  callback(null, {statusCode: 200, body: JSON.stringify({})});
};
