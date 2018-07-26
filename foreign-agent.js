var querystring = require('querystring');
var http = require('http');

const postData = querystring.stringify({
    'usr': '08010341000150',
    'pass': '109047'
});

const options = {
    hostname: 'www.daeebmt.sp.gov.br',
    port: 80,
    path: '/sidecc/logar.php',
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
    }
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    // res.setEncoding('utf8');

    console.log("set-cookie", res.headers['set-cookie']);

    res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
    });
    res.on('end', () => {
        console.log('No more data in response.');
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

// write data to request body
req.write(postData);
req.end();
