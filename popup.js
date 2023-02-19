// Step 1: Authenticate with gmail API (Can be hardcoded in exclusively for one user)
// Step 2: Get the last 24 hours of emails in a digestible form

// var moduleName = 'base64url';
// require([moduleName], function(Module) {
//   // 
//   console.log("hi");
// });
// const base64url = require('base64url');
var base64Reference = require('base64url');
global.window.base64url = base64Reference;

let emailArray = [];

function displayResponse(summary){
    console.log(summary);
    var ul = document.getElementById("summary");
    var li = document.createElement('li');
    li.innerHTML = summary;
    ul.appendChild(li);
}

async function getResponse(text){
    console.log("Calling... ");
    const url = "https://api.openai.com/v1/completions";
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${gptkey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "model": "text-davinci-003",
            "prompt": `Summarize the following email in a single sentence: ${text}`,
            "temperature": 0,
            "max_tokens": 64,
            "top_p": 1.0,
            "frequency_penalty": 0.0,
            "presence_penalty": 0.0
        }),
    }).then(response=>{
        return response.clone().json()
    }).then(data=>{
        displayResponse(data['choices'][0].text);
    });
    console.log("Success");
}

function machineLearning() {
  for(let i = 0; i < emailArray.length; i++){
      getResponse(emailArray[i]);
  }
  console.log("Machine learning!");
  console.log(emailArray);
}

function getGmailData(token) {
  fetch('https://www.googleapis.com/oauth2/v1/userinfo?alt=json', {json: true, headers: {'Authorization': 'Bearer ' + token}})
  .then((userInfoResponse) => userInfoResponse.json()).then((userInfoResponse) => {
    // console.log(userInfoResponse);
    fetch(`https://content-gmail.googleapis.com/gmail/v1/users/${userInfoResponse.id}/messages?maxResults=10`, {json: true, headers: {'Authorization': 'Bearer ' + token}})
    .then((messageListResponse) => messageListResponse.json()).then(async (messageListResponse) => {
      // Now get the data for each email
      // console.log(messageListResponse)
      for (let index = 0; index < 10; index++) {
        let emailId = messageListResponse.messages[index].id;
        fetch(`https://gmail.googleapis.com/gmail/v1/users/${userInfoResponse.id}/messages/${emailId}`, {json: true, headers: {'Authorization': 'Bearer ' + token}})
        .then((individualEmailResponse) => individualEmailResponse.json()).then((individualEmailResponse) => {
          // console.log(individualEmailResponse);
          const base64Encoded = individualEmailResponse.payload.parts[0].body.data;
          let advancedDecoded = base64url.decode(base64Encoded);
          emailArray.push(advancedDecoded);
        });
        if (index === 9) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          machineLearning();
        }
      }
    });
  })

}

window.onload = function() {
  document.querySelector('button').addEventListener('click', function() {
    chrome.identity.getAuthToken({interactive: true}, function(token) {
      console.log("User Token: " + token);
      getGmailData(token);
    });
  });
};
