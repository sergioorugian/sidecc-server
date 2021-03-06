/**
 * Every interaction with sidecc server is exposed here
 * 
 * get html page
 * post action
 * 
 */


var querystring = require('querystring');
var http = require('http');

var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const JSDOM2 = jsdom.JSDOM;

console.log("jsdom", jsdom);
console.log("{ JSDOM }", { JSDOM });
console.log("{ JSDOM2 }", { JSDOM2 });

let session_cookie;

function setCookie(res) {
    let cookie = res.headers['set-cookie']
      , requestCookies = "";

    for (let i = 0; i < cookie.length; i++) {
        requestCookies = requestCookies + cookie[i].split(';')[0]+';';
    }
    session_cookie = requestCookies;
    console.log("cookie: ", session_cookie);
}

function getCookie() {
    return session_cookie;
}

function send(options, data) {

    return new Promise((resolve, reject) => {

        const req = http.request(options, (res) => {
            console.log(`STATUS: ${res.statusCode}`);
            console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
            let body = [];

            // res.setEncoding('utf8');
            res.setEncoding('binary');
            setCookie(res);

            res.on('data', (chunk) => {
                body.push(chunk);
                console.log(`BODY: ${chunk}`);
            });

            res.on('end', () => {
                console.log('No more data in response.');
                // try {
                //     body = JSON.parse(Buffer.concat(body).toString());
                // } catch(e) {
                //     reject(e);
                // }
                resolve(body);
            });
        });

        req.on('error', (e) => {
            console.error(`problem with request: ${e.message}`);
            reject(e);
        });
        // write data to request body
        req.write(data);
        req.end();
    });
}

function getPage(options) {

    return new Promise((resolve, reject) => {

        const req = http.request(options, (res) => {
            console.log(`STATUS 2: ${res.statusCode}`);
            console.log(`HEADERS 2: ${JSON.stringify(res.headers)}`);

            // let body = [];
            let data = "";

            // res.setEncoding('utf8');
            res.setEncoding('binary');

            res.on('data', (chunk) => {
                // body.push(chunk);
                // console.log(`BODY 2: ${chunk}`);
                data += chunk;
            });

            // var tags = [];
            // var tagsCount = {};
            // var tagsWithCount = [];

            res.on('end', (chunk) => {
                console.log('No more data in response.');
                console.log("data", data);
                const page = new JSDOM(data);
                console.log("first button: ", page.window.document.querySelectorAll("button")[0].getAttribute("onclick"));
                // resolve(body);
            });
        });

        req.on('error', (e) => {
            console.error(`problem with request: ${e.message}`);
            reject(e);
        });

        req.end();
    });
}

const service = {

    login: (username, password) => {

        const postData = querystring.stringify({
            'usr': username
            , 'pass': password
        });

        const options = {
            hostname: 'www.daeebmt.sp.gov.br',
            port: 80,
            path: '/sidecc/logar.php',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
                , 'Content-Length': Buffer.byteLength(postData)
            }
        }

        return send(options, postData).then(function(response) {
            if (response.length == 1 && response[0] != "") {
                return {
                    ERROR: response[0]
                };
            }
            return {};
        });
    }

    , get: (pPath) => {

        const options = {
            hostname: 'www.daeebmt.sp.gov.br',
            port: 80,
            path: pPath,
            method: 'GET',
            headers: {
                'Cookie': getCookie()
                // 'Content-Type': 'application/x-www-form-urlencoded'
                // , 'Content-Length': Buffer.byteLength(postData)
            }
        }

        return getPage(options).then(function(response) {
            // console.log("selUso", response[0].search('selUso'));

            console.log("getPage: ", response);

            // let parser = new DOMParser();
            // let htmlDocument = parser.parseFromString(response[0]);

            // console.log(htmlDocument.querySelector("input[onclick=selUso]"));

            // console.log("selUso", response[0].sea);
            return response;
        });

        // return sendGetRequest(options);
    }
}

module.exports = service;
