const Discord = require('discord.js');
const bot = new Discord.Client();
const request = require('request');

var millisecondsToWait = 1000;
var d;
var oldHour = -1;
var hour = -1;
var year = new Date().getFullYear();
var dateToIngeButitIsFix = new Date(2024, 6, 1)
var dateToInge = new Date(year+5, 6, 1);

bot.on('ready', function(){
    bot.user.setActivity("Top 1 sur l'actu").catch(console.error);
    timer()
})

bot.on('message', function (message){

})

bot.login('NzY4MTEyMzMyNzYwMjg1MjE1.X47uWg.9hkjwMjcygxyKBK2gv50xppB1Ec')
    .catch(console.error);


function timer(){
    setTimeout(function() {
        d = new Date();
        hour = d.getHours();
        if(oldHour != hour){
            getBearerToken((err, token) => {
                getTrendsAtPlace(token);
            })
        }
        oldHour = hour;
        timer();
        return
    }, millisecondsToWait)
}

function getBearerToken(callback) {
	const credentials = "sJErGHIEZ3J7pX5wuIBUFXeGH:cZYXecVPiLCa0v2Edd8UCI5SkUVSvyMenzMWbh9o8HMr3eJDk2";
	const credentialsBase64Encoded = new Buffer.from(credentials).toString('base64');

	const options = {
		url: 'https://api.twitter.com/oauth2/token',
		method:'POST',
		headers: {
			'Authorization': `Basic ${credentialsBase64Encoded}`,
			'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'
		},
		body: 'grant_type=client_credentials'
	}

	request(options, (error, response, body) => {
		if (!error && response.statusCode == 200) { callback(null, JSON.parse(body).access_token) }
		else { callback(error, null) }
	});
}

function getTrendsAtPlace(token, callback) {
	const options = {
		url: `https://api.twitter.com/1.1/trends/place.json?id=615702`,
		method: 'GET',
		headers: {
			'Authorization': `Bearer ${token}`
		}
	}

	request(options, (error, response, body) => {
        var data = JSON.parse(body);
        var name = data[0]["trends"][0]['name']
        bot.guilds.fetch("626684559345451010").then(guild => {
            guild.members.fetch("256054054260572161").then(member =>{
                member.setNickname(name)
            })
        })
	})
}