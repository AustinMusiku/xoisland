module.exports = {
	'**/*.+(js|ts|md|json|css|vue)': [
		'prettier --ignore-path .eslintignore --write',
		'eslint --fix',
	],
}
