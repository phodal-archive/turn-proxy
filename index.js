var express = require('express');
var crypto = require('crypto');
var app = express();

var hmac = function(key, content){
    var method = crypto.createHmac('sha1', key);
    method.setEncoding('base64');
    method.write(content);
    method.end();
    return method.read();
};

app.get('/turn', function(req, resp) {

var query = req.query;
var key = '4080218913'; // 这里的 key 是事先设置好的, 我们把他当成一个常亮来看, 所以就不从HTTP请求参数里读取了

if (!query['username']) {
    return resp.send({'error':'AppError', 'message':'Must provide username.'});
} else {
    var time_to_live = 600;
    var timestamp = Math.floor(Date.now() / 1000) + time_to_live;
    var turn_username = timestamp + ':' + query['username'];
    var password = hmac(key, turn_username);

    return resp.send({
        username:turn_username,
        password:password,
        ttl:time_to_live,
        "uris": [
            "turn:turn.server.ip.address:3478?transport=udp",
            "turn:turn.server.ip.address:3478?transport=tcp",
            "turn:turn.server.ip.address:3479?transport=udp",
            "turn:turn.server.ip.address:3479?transport=tcp"
            ]
    });
}

});

app.listen('3033', function(){
    console.log('server started');
});
