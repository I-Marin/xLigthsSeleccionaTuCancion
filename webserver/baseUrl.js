const ENVS = { LOCAL: '127.0.0.1', PRO: 'micasasevedelejos.tudelanicos.com' }
const DEFAULT_PORT = '31500'

const ACTUAL_ENV = ENVS.PRO

const BASE_URL = (port) => {
    if (!port) {
        port = DEFAULT_PORT
    }

    return !port ? ACTUAL_ENV : `${ACTUAL_ENV}:${port}`
}

module.exports = BASE_URL