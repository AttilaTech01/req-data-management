const Bugsnag = require('@bugsnag/js')
const  BugsnagPluginExpress = require('@bugsnag/plugin-express')



Bugsnag.start({
    apiKey: '1365738a1a7d14c024cda7368ae66f83',
    plugins: [BugsnagPluginExpress]
  })

  export default Bugsnag