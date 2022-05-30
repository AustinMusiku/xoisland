module.exports = {
	linters: {
		'**/*.+(js|ts|md|json|css|scss|vue)': [
			'eslint --fix',
			'prettier --write',
			'git add',
		],
	},
}
