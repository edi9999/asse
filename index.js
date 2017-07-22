const chromePasswords = require("./chrome-passwords");
const sshFinder = require("./ssh-finder");
const passCli = require("./pass-cli");
const envCheck = require("./env-check");
const credentialsInFiles = require("./credentials-in-files");

let showValues = process.argv.indexOf("--values") !== -1 || process.argv.indexOf("-v") !== -1;

if (!showValues) {
	console.log("To show the values of the leaks found, run the same command and append --values");
}

function handlePromises(promises) {
	promises.forEach(function (promise) {
		promise.then(function (result) {
			if (!result) {
				return;
			}
			if (!result.value) {
				console.log('No value set');
			}
			console.log(result.summary);
			if (showValues) {
				console.log(result.value);
			}
		}).catch(function (err) {
			console.error(err);
		});
	});
}

handlePromises([
	chromePasswords(),
	sshFinder(),
	passCli(),
	envCheck(),
	credentialsInFiles(),
]);
