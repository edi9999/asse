const chromePasswords = require("./chrome-passwords");
const sshFinder = require("./ssh-finder");

Promise.all([
	chromePasswords(),
	sshFinder(),
]).then(function (results) {
	results.forEach(function (result) {
		console.log(result.summary);
	})
}).catch(function (err) {
	console.error(err);
});
