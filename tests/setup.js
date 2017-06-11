var proxyquire =  require('proxyquire');
const path = require('path');
var db = require('../src/models');

module.exports = function() {
    const facebookStub = {
            init: function () {
                return {
                    name: 'Rippley',
                    username: 'ripley005',
                    facebookID: '000',
                    description: 'robot model #5'
                }
            }
        };

        proxyquire(path.join(__dirname, '../', 'routes', 'login.js'), {
            '../src/utils/facebook': facebookStub
        });

        return db.connect({force: true}).then(()=> {
            return populate();
        }).catch((e) => {
            console.log('Error connecting to DB/populating ', e);
            return Promise.reject();
        });

        function populate() {
            return db.sequelize.models.users.bulkCreate([{
                name: 'David',
                username: 'david001',
                facebookID: '001',
                description: 'robot model #1'
            }, {
                name: 'Walter',
                username: 'walter001',
                facebookID: '002',
                description: 'robot model #2'
            }, {
                name: 'Elizabeth',
                username: 'liz',
                facebookID: '003',
                description: 'shes real'
            }])     
        }
    
}