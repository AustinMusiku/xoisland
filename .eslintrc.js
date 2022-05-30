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
				ignores: ['index'],
			},
		],
		// 'vue/first-attribute-linebreak': [
		// 	'error',
		// 	{
		// 		singleline: 'ignore',
		// 		multiline: 'below',
		// 	},
		// ],
	},
}
