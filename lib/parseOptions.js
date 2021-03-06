var merge = require('deepmerge');

var defaults = {
		defaultCDNBase: '',
		defaultCDN: '<%= defaultCDNBase %>/<%= filepathRel %>',
		relativeRoot: '',
		allowRev: true,
		allowMin: true,
		bowerComponents: null,
		// escaped to prevent IntelliJ from being too smart
		fallbackScript: '<scr'+'ipt>function cdnizerLoad(u) {document.write(\'<scr\'+\'ipt src="\'+encodeURIComponent(u)+\'"></scr\'+\'ipt>\');}</script>',
		fallbackTest: '<scr'+'ipt>if(!(${ test })) cdnizerLoad("${ filepath }");</script>',
		shouldAddFallback: false
	};

function parseOptions(opts) {
	if(!opts || (typeof opts !== 'object' && !Array.isArray(opts))) {
		throw new Error("No options or invalid options supplied");
	}
	if(Array.isArray(opts)) {
		opts = {files: opts};
	}
	if(!Array.isArray(opts.files) || opts.files.length === 0) {
		throw new Error("Invalid or empty files list supplied");
	}
	opts = merge(defaults, opts);
	
	opts.files = opts.files.map(function(fileInfo) {
		if(typeof fileInfo === 'string' && fileInfo.length > 0) {
			fileInfo = { file: fileInfo };
		}
		if(!fileInfo.file || typeof fileInfo.file !== 'string') {
			throw new Error('File declaration is invalid');
		}
		if(fileInfo.test) {
			opts.shouldAddFallback = true;
		}
		if(opts.allowMin && fileInfo.file.indexOf('.min') === -1) {
			fileInfo.file = fileInfo.file.replace(/\.(.*)$/, '.?(min.)$1');
		}
		if(opts.allowRev) {
			fileInfo.file = fileInfo.file.replace(/(\..*)$/, '?(-????????)$1');
		}
		return fileInfo;
	});
	
	opts.defaultCDNBase = opts.defaultCDNBase.replace(/\/$/, '');
	return opts;
}

module.exports = parseOptions;