
/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */

const fetch = require('node-fetch');
// Imports the Google Cloud client library

// Creates a client

exports.helloWorld = (req, res) => {
 console.log('req:', req.body);

 const message = req.body.text || "";
 const response_url = req.body.response_url;
  _requestCompletion(res, message,response_url);
    res.status(200).send("");
};


function _requestCompletion(res, message, response_url) {
  const apiKey = APIKEY
  const apiUrl = 'https://api.openai.com/v1/completions';
  const prompt = message;
  let headers = {
    'Authorization':'Bearer '+ apiKey,
    'Content-type': 'application/json',
  };

  const body = {
      'model': 'text-davinci-003',
      'max_tokens' : 1024,
      'temperature' : 0.9,
      'prompt': prompt
      };
  const options = {
    method: 'POST',
    body:    JSON.stringify(body),
    headers: headers,
  }
  fetch(apiUrl, options)
    .then(res => res.json())
    .then((result) => {
      let resultText = "";
      result.choices.forEach(element => {
        resultText += element.text
      });
      console.log('Success:', resultText);
      _slackMessage(response_url,resultText) 
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  //OpenAIのAPIレスポンスをログ出力
}



async function _slackMessage(url,text) {
  
    let headers = {
      'Content-type': 'application/json',
    };
    const body = {
      "text": text,
      "response_type": "in_channel",
     };
    const options = {
      method: 'POST',
      body:    JSON.stringify(body),
      headers: headers,
    }
  fetch(url, options)
    .then(res => res.json())
    .then((result) => {

      console.log('Success:', result);

    })
    .catch((error) => {
      console.error('Error:', error);
    });
}
