module.exports = {
	'**/*.+(js|ts|json|css|vue)': [
		'prettier --ignore-path .eslintignore --write',
		'eslint --fix',
	],
}
