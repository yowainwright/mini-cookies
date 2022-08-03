export const lettersOnly = (string = ''): string =>
	string.replace(/[^A-Za-z-\s]/g, '')
