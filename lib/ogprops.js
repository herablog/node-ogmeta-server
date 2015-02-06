var _ = require('lodash');
var request = require('request');
var cheerio = require('cheerio');

/**
 * Get Open Graph Metas
 * @params {string} url
 * @params {object} options request params (optional)
 * @params {function} callback
 * @callback {object|null} err
 * @callback {object|null} Open Graph Props
**/
function getOgProps() {
	var args = Array.prototype.slice.apply(arguments);
	var url = '';
	var options = {};
	var callback = function() {};
	args.forEach(function(a) {
		if (_.isString(a)) {
			url = encodeURI(a);
		} else if (_.isFunction(a)) {
			callback = a;
		} else if (_.isPlainObject(a)) {
			options = a;
		}
	});
	if (!url) {
		callback({
			message: 'URL is required.',
			status: 400
		});
	}
	getHtml(url, options, function(err, html) {
		if (err) {
			callback(err);
		} else {
			var ogProps = parse(html);
			callback(null, ogProps);
		}
	});
}

/**
 * Get Html String
 * @params {string} url
 * @params {object} options request params
 * @params {function} callback
 * @callback {object|null} err
 * @callback {string|null} HTML string
**/
function getHtml(url, options, callback) {
	var params = options || {};
	params.url = url;
	request.get(params, function(err, res, body) {
		if (err) {
			callback(err);
		} else if (res.headers['content-type'].indexOf('text/html') === -1) {
			callback({
				message: 'Content type is invalid.',
				status: 400
			});
		} else {
			callback(null, body);
		}
	});
}

/**
 * Parse Html to OgProps Object
 * @params {string} url
 * @return {object} OgProps object, removed "og:" prefix
**/
function parse(html) {
	var ogPrefix = 'og:';
	var $ = cheerio.load(html);
	var $ogMetas = $('meta[property^="' + ogPrefix + '"]');
	if (!$ogMetas.length) {
		return null;
	}
	var ogProps = {};
	$ogMetas.each(function(i, el) {
		var $el = $(el);
		var prop = $el.attr('property').replace(ogPrefix, '');
		var val = $el.attr('content');
		ogProps[prop] = val;
	});
	return ogProps;
}

module.exports = getOgProps;
