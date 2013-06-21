/**
 * Node cache module.
 * 
 */ 

function init(options) {
	var cache = {};
	
	function _addToCache(key, callback) {
		options.addFunc(key, function (err, value) {
			cache[key] = {
					value: value,
					ttl: Date.now() + options.ttl
				};
			callback(null, value);
		});
	}
	
	function fetch(key, callback) {
		if (cache[key] === undefined) {
			_addToCache(key, callback);
		} else {
			callback(null, cache[key].value);
		}
	}

	// init cache
	if (!options) {
		return null;
	}
	if (!options.addFunc) {
		return null;
	}
	options.ttl = options.ttl || 600000;
	
	setInterval(function () {
		var now = Date.now();
		for (var key in cache) {
			if (cache.hasOwnProperty(key)) {
				if (cache[key].ttl < now) {
					delete cache[key];
				}
			}
		}
	}, options.ttl);
	
	return {
		fetch: fetch
	};
}

exports.init = init;