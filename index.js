#!/usr/bin/env node

const chromePasswords = require("./chrome-passwords");
const sshFinder = require("./ssh-finder");
const passCli = require("./pass-cli");
const envCheck = require("./env-check");
const credentialsInFiles = require("./credentials-in-files");

let showValues = process.argv.indexOf("--values") !== -1 || process.argv.indexOf("-v") !== -1;
let showErrors = process.argv.indexOf("--errors") !== -1 || process.argv.indexOf("-e") !== -1;

if (!showValues) {
	console.log("To show the values of the leaks found, run the same command and append --values");
}

function handlePromises(promises) {
	Object.keys(promises).forEach(function (promiseName) {
		promises[promiseName]().then(function (result) {
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
			if (showErrors) {
				console.error(err);
			}
			else {
				console.log(`Error while running ${promiseName}, run the same command and append --errors to see the stacktrace`);
			}
		});
	});
}

const promises = {
	chromePasswords,
	sshFinder,
	passCli,
	envCheck,
	credentialsInFiles,
}

handlePromises(promises);
