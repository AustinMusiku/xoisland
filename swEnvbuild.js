require('dotenv').config()
const fs = require('fs')

fs.writeFileSync(
	'./static/swenv.js',
	`
const process = {
  env: {
    apiKey: "${process.env.API_KEY}",
    authDomain: "${process.env.AUTH_DOMAIN}",
    databaseURL: "${process.env.DATABASE_URL}",
    projectId: "${process.env.PROJECT_ID}",
    storageBucket: "${process.env.STORAGE_BUCKET}",
    messagingSenderId: "${process.env.MESSAGING_SENDER_ID}",
    appId: "${process.env.APP_ID}",
    measurementId: "${process.env.MEASUREMENT_ID}"
}
}
`
)
