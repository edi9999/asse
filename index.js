const chromePasswords = require("./chrome-passwords");

chromePasswords().then(function (result) {
	console.log(result.summary);
}).catch(function (err) {
	console.error(err);
});
