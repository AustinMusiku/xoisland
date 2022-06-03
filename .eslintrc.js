module.exports = {
	root: true,
	env: {
		browser: true,
		node: true,
	},
	extends: [
		'@nuxtjs/eslint-config-typescript',
		'plugin:nuxt/recommended',
		'plugin:vue/recommended',
		'prettier',
	],
	plugins: [],
	// add your custom rules here
	rules: {
		'vue/multi-word-component-names': [
			'error',
			{
				ignores: ['default', 'index', 'Loading'],
			},
		],
		'vue/first-attribute-linebreak': [
			'error',
			{
				singleline: 'ignore',
				multiline: 'below',
			},
		],
		'vue/max-attributes-per-line': [
			'error',
			{
				singleline: {
					max: 1,
				},
				multiline: {
					max: 1,
				},
			},
		],
		'vue/html-indent': [
			'error',
			'tab',
			{
				attribute: 1,
				baseIndent: 1,
				closeBracket: 0,
				alignAttributesVertically: true,
				ignores: [],
			},
		],
		'vue/html-closing-bracket-newline': [
			'error',
			{
				singleline: 'never',
				multiline: 'always',
			},
		],
	},
}
