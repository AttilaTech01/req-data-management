const Bugsnag = require('@bugsnag/js')
const  BugsnagPluginExpress = require('@bugsnag/plugin-express')
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

Bugsnag.start({
    apiKey: process.env.BUGSNAG_KEY,
    plugins: [BugsnagPluginExpress]
  })

  export default Bugsnag