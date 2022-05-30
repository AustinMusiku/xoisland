module.exports = {
	'**/*.+(js|ts|md|json|css|scss|vue)': [
		'prettier --ignore-path .eslintignore --write',
		'eslint --fix',
	],
}
