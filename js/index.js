var asmInput = ace.edit("assembly");
asmInput.$blockScrolling = Infinity;
asmInput.getSession().setMode("ace/mode/assembly_x86");
asmInput.setTheme("ace/theme/dawn");
asmInput.setOption("showPrintMargin", false);
asmInput.setOption("showInvisibles", false);

var bytesOutput = ace.edit("bytes");
bytesOutput.$blockScrolling = Infinity;
bytesOutput.setTheme("ace/theme/dawn");
bytesOutput.setOption("showPrintMargin", false);
bytesOutput.setOption("displayIndentGuides", false);
bytesOutput.setOption("readOnly", true);

initKeystone();

function initKeystone() {
	var keystone = new ks.Keystone(ks.ARCH_X86, ks.MODE_64);
	keystone.option(ks.OPT_SYNTAX, ks.OPT_SYNTAX_INTEL);

	function toHex(d) {
	    return  ("0"+(Number(d).toString(16))).slice(-2).toUpperCase()
	}

	document.querySelector('#assembly').addEventListener('input', () => {
		let asm = asmInput.getValue();
		let bytes = keystone.asm(asm);
		let bytesString = "";
		for(let i = 0; i < bytes.length; i++) {
			bytesString += toHex(parseInt(bytes[i])) + " ";
		}
		bytesOutput.setValue(bytesString);
	});

	window.onunload = function() {
	    keystone.close();
	}
}