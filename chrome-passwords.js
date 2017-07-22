const fs = require("fs");
const path = require("path");
const sqlite3 = require('sqlite3').verbose();

function copyFile(source, target, cb) {
	let cbCalled = false;
	const rd = fs.createReadStream(source);
	rd.on("error", function(err) {
		done(err);
	});
	const wr = fs.createWriteStream(target);
	wr.on("error", function(err) {
		done(err);
	});
	wr.on("close", function(ex) {
		done();
	});
	rd.pipe(wr);

	function done(err) {
		if (!cbCalled) {
			cb(err);
			cbCalled = true;
		}
	}
}

module.exports = function run() {
	return new Promise(function (resolve, reject) {
		const sqlitepath = '/tmp/sqlite';
		const chromePasswords = [];

		copyFile(path.resolve(process.env.HOME, ".config/google-chrome/Default/Login Data"), sqlitepath, function (err) {
			if (err) {
				return reject(err);
			}
			const db = new sqlite3.Database(sqlitepath);

			db.serialize(function() {
				db.each("select * from logins", function(err, row) {
					if (err) {
						return reject(err);
					}
					if (!row) {
						return reject(new Error("Row not found"));
					}
					chromePasswords.push({url: row.origin_url, login: row.username_value, pass: row.password_value.toString()});
				}, function (f) {
					resolve({
						summary: `✓ Found ${chromePasswords.length} cleartext passwords in Google Chrome`,
						value: chromePasswords
					});
				});
			});

			db.close();
		});
	});
};
