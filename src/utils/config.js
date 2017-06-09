module.exports = {
    database: getDatabase(),
    jwt: {
        secret: 'tempSecret'
    }
}

function getDatabase() {
    switch(process.env.NODE_ENV) {
        case 'test':
        return {
            dbname: 'stories_test',
            username: 'qasimf01',
            password: '',
            host: 'localhost'
        };

        case 'production':
        return {
            dbname: 'stories',
            username: 'xxx',
            password: 'xxx',
            host: 'xxx'
        };

        default:
        return {
            dbname: 'stories',
            username: 'qasimf01',
            password: '',
            host: 'localhost'
        };             
    }
}