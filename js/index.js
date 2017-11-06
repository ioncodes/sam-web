var arch = ks.ARCH_X86;
var mode = ks.MODE_64;
var syntax = ks.OPT_SYNTAX_INTEL;
var keystone;

var asmInput;
var bytesOutput;

initEditor();
initKeystone();

function initEditor() {
	asmInput = ace.edit('assembly');
	asmInput.$blockScrolling = Infinity;
	asmInput.getSession().setMode('ace/mode/assembly_x86');
	asmInput.setTheme('ace/theme/dawn');
	asmInput.setOption('showPrintMargin', false);
	asmInput.setOption('showInvisibles', false);
	asmInput.setOption('fontSize', 22);

	bytesOutput = ace.edit('bytes');
	bytesOutput.$blockScrolling = Infinity;
	bytesOutput.setTheme('ace/theme/dawn');
	bytesOutput.setOption('showPrintMargin', false);
	bytesOutput.setOption('displayIndentGuides', false);
	bytesOutput.setOption('readOnly', true);
	bytesOutput.setOption('fontSize', 22);
}

function initKeystoneEngine() {
	if(keystone !== undefined) {
		keystone.close();
	}
	keystone = new ks.Keystone(arch, mode);
	keystone.option(ks.OPT_SYNTAX, syntax);
}

function initKeystone() {
	initKeystoneEngine();

	function toHex(d) {
	    return  ('0'+(Number(d).toString(16))).slice(-2).toUpperCase()
	}

	function toArray(hex) {
		hex = hex.replace(/\n/g, ' ');
		return '0x' + hex.replace(/ /g, ', 0x');
	}

	asmInput.on('input', () => {
		let asm = asmInput.getValue().split('\n');
		let bytesString = '';
		for(let j = 0; j < asm.length; j++) {
			let bytes = keystone.asm(asm[j]);
			for(let i = 0; i < bytes.length; i++) {
				bytesString += toHex(parseInt(bytes[i]));
				if(i !== bytes.length - 1) {
					bytesString += ' ';
				}
			}
			if(j !== asm.length - 1) {
				bytesString += '\n';
			}
		}
		bytesOutput.setValue(bytesString, 1);
		let array = toArray(bytesString);
		$('#array').text(
`[ ` + array + ` ]
{ ` + array + ` }`
		);
	});

	window.onunload = function() {
	    keystone.close();
	}
}