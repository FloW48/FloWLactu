const Discord = require('discord.js');
const bot = new Discord.Client();
const request = require('request');

var millisecondsToWait = 1000*60*5;
var timerTime = 65

bot.on('ready', function(){
    bot.user.setActivity("Top 1 sur l'actu -> "+(timerTime-5).toString()+" minutes").catch(console.error);
    timer()
})

bot.login('token')
    .catch(console.error);

bot.on('message', message => {
	if(message.content.startsWith("flowtop1surlactu refresh") && message.author.id == '256054054260572161'){
		message.channel.send("Refresh");
	}
})

function timer(){
    setTimeout(function() {
		timerTime -= 5
		bot.user.setActivity("Top 1 sur l'actu -> "+timerTime.toString()+" minutes").catch(console.error);
		if(timerTime == 0){
			getBearerToken((err, token) => {
				getTrendsAtPlace(token);
			})
			timerTime = 65
		}
        timer();
        return
    }, millisecondsToWait)
}

function getBearerToken(callback) {
	const credentials = "tauken";
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
