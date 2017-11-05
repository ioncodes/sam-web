var keystone = new ks.Keystone(ks.ARCH_X86, ks.MODE_64);
keystone.option(ks.OPT_SYNTAX, ks.OPT_SYNTAX_INTEL);

function toHex(d) {
    return  ("0"+(Number(d).toString(16))).slice(-2).toUpperCase()
}

document.querySelector('#assembly').addEventListener('input', () => {
	let asm = document.querySelector('#assembly').value;
	let bytes = keystone.asm(asm);
	let bytesString = "";
	for(let i = 0; i < bytes.length; i++) {
		bytesString += toHex(parseInt(bytes[i])) + " ";
	}
	document.querySelector('#bytes').value = bytesString;
});

window.onunload = function() {
    keystone.close();
}