const fs = require("fs");
const path = require("path");
const passwordStore = path.resolve(process.env.HOME, ".password-store")
const {spawn} = require("child_process");
const passwords = {};
function nonHiddenFiles(file) {
	return file.indexOf(".") !== 0;
}

function spawnAsync(cmd, args) {
	return new Promise((resolve, reject) => {
		const ls = spawn(cmd, args);
		let stdout = "";
		let stderr = "";
		ls.stdout.on('data', (data) => {
			stdout+=data;
		});

		ls.stderr.on('data', (data) => {
			stderr+=data;
		});

		ls.on('close', (code) => {
			if (code === 0) {
				return resolve({stdout, stderr});
			}
			return reject({stdout, stderr});
		});
	});
}

function readFileRecursive(dir) {
	files = fs.readdirSync(dir);
	const subDirs = [];
	files = files.filter(nonHiddenFiles).map(function (file) {
		return path.resolve(dir, file);
	});
	files = files.filter(function (file) {
		const stat  = fs.statSync(file);
		if (stat.isDirectory()) {
			subDirs.push(file);
			return false;
		}
		return stat.isFile();
	});
	return files.concat(subDirs.reduce(function (files, dir) {
		return files.concat(readFileRecursive(dir));
	}, []));
}

module.exports = function () {
	return new Promise(function (resolve, reject) {
		let dirs;
		try {
			dirs = readFileRecursive(passwordStore)
		} catch (e) {
			return reject(e);
		}

		return dirs.reduce(function (promise, dir, index) {
			return promise.then(function (passwords) {
				const entry = dir.replace(".gpg", "").replace(/.*.password-store\/(.*)$/, "$1");
				const args = ['show', entry];
				return spawnAsync('pass', args).then(function ({stdout, stderr}) {
					passwords[entry] = stdout;
					return passwords;
				});
			});
		}, Promise.resolve({})).then(function (passwords) {
			resolve({
				summary: `✓ Decrypted ${Object.keys(passwords).length} passwords from \`pass\` password-store`,
				value: passwords,
			});
		}).catch(reject);
	});
};
