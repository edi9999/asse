const regexes = [
	/api/i,
	/key/i,
	/secret/i,
	/ssh/i,
];


module.exports = function run() {
	return new Promise(function (resolve, reject) {
		const envKeys = Object.keys(process.env).reduce(function (envKeys, key) {
			const value = process.env[key];
			const match = regexes.some(function (regex) {
				return regex.test(value) || regex.test(key);
			})
			if (match) {
				envKeys[key] = value;
			}
			return envKeys;
		}, {});
		const keyLength = Object.keys(envKeys).length;
		resolve({
			summary: `✓ Found ${keyLength} potential credentials in environment variables`,
			value: envKeys,
		});
	});
};
