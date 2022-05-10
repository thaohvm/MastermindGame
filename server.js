const config = require('./config');
const app = require('./app')

app.listen(config.PORT, function () {
    console.log(`Server running on port ${config.PORT}`)
})
