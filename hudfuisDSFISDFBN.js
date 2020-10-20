const node_yaml = require("node-yaml")
const request = require('request');

async function get_list() {
	const list = await node_yaml.read("config.yml")
	/*for (i in list["Discord"][0]["twitter_ids"]) {
		console.log(list["Discord"][0]["twitter_ids"][i])
	}*/
	return list["Discord"][0]["twitter_ids"]
}

async function isInList(id) {
	const list = await get_list()
	for (i in list){
		if (list[i] === id) { return true }
	}
	return false
}

function getBearerToken(callback) {
	const credentials = "b5lnnor2UbmOZXWpQABjJiS1X:RbeVuPkaa0tLDovTcwaikAU4s8Tl4oaoOD6hKwbcLzLaCzILea";
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

function convertToId(username, token, callback) {
	const options = {
		url: `https://api.twitter.com/2/users/by/username/${username}`,
		method: 'GET',
		headers: {
			'Authorization': `Bearer ${token}`
		}
	}

	request(options, (error, response, body) => {
		console.log(JSON.parse(body)["data"]["id"])
	})
}

function getTrendsAtPlace(token, callback) {
	const options = {
		url: `https://api.twitter.com/1.1/trends/place.json?id=1`,
		method: 'GET',
		headers: {
			'Authorization': `Bearer ${token}`
		}
	}

	request(options, (error, response, body) => {
		console.log(JSON.parse(body))
	})
}

function test() {
	getBearerToken((err, token) => {
		console.log(token)
		convertToId("lucaasmth", token, (err, id) => {
			console.log(id)
		})
		getTrendsAtPlace(token)
	})
}

test()