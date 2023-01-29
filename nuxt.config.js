export default {
	// Global page headers: https://go.nuxtjs.dev/config-head
	head: {
		title: 'tictactoe',
		htmlAttrs: {
			lang: 'en',
		},
		meta: [
			{ charset: 'utf-8' },
			{
				name: 'viewport',
				content: 'width=device-width, initial-scale=1',
			},
			{
				hid: 'description',
				name: 'description',
				content: 'An online multiplayer tic-tac-toe game',
			},
			{ name: 'format-detection', content: 'telephone=no' },
		],
		link: [
			{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
			{ rel: 'stylesheet', href: 'https://fonts.cdnfonts.com/css/bidan' },
			{ rel: 'stylesheet', href: 'https://fonts.cdnfonts.com/css/inter' },
		],
	},

	// Global CSS: https://go.nuxtjs.dev/config-css
	css: ['@/assets/scss/style.scss'],

	// Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
	plugins: ['@/plugins/firebase'],

	// Auto import components: https://go.nuxtjs.dev/config-components
	components: true,

	// Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
	buildModules: [
		// https://go.nuxtjs.dev/typescript
		'@nuxt/typescript-build',
		'@nuxtjs/composition-api/module',
		['@pinia/nuxt', { disableVuex: false }],
		'@nuxtjs/pwa',
	],

	// Modules: https://go.nuxtjs.dev/config-modules
	modules: [
		// https://go.nuxtjs.dev/axios
		'@nuxtjs/axios',
		'@nuxtjs/style-resources',
		'@/modules/ws',
	],

	styleResources: {
		scss: [
			'@/assets/scss/_variables.scss',
			'@/assets/scss/_typography.scss',
			'@/assets/scss/_layouts.scss',
			'@/assets/scss/_base.scss',
		],
	},

	// Axios module configuration: https://go.nuxtjs.dev/config-axios
	axios: {},

	// Build Configuration: https://go.nuxtjs.dev/config-build
	build: {
		build: {
			loaders: {
				scss: {
					implementation: require('sass'),
				},
			},
		},
	},
	server: {
		host: '0.0.0.0',
		port: process.env.PORT || 3000,
	},
	env: {
		apiKey: process.env.API_KEY,
		authDomain: process.env.AUTH_DOMAIN,
		databaseURL: process.env.DATABASE_URL,
		projectId: process.env.PROJECT_ID,
		storageBucket: process.env.STORAGE_BUCKET,
		messagingSenderId: process.env.MESSAGING_SENDER_ID,
		appId: process.env.APP_ID,
		measurementId: process.env.MEASUREMENT_ID,
		vapidKey: process.env.VAPID_KEY,
	},
	pwa: {
		icon: {
			source: 'static/maskable_icon.png',
			purpose: ['maskable', 'any'],
			sizes: [192, 512],
		},
		manifest: {
			name: 'XOIsland',
			short_name: 'XO',
			lang: 'en',
			display: 'standalone',
			theme_color: '#00DC82',
			background_color: '#00DC82',
		},
	},
}
