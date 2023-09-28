const http = require('http');

const urls = require('./url-regex');
const users = require('./APIs/users');
const hobbies = require('./APIs/hobbies');


const httpServer = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');
    
    if (req.url.match(urls.allUsers) && req.method === 'GET') {
        // get all users details
        res.statusCode = 200;
        res.end(JSON.stringify(users.getAllUsers(), null, 3));
    }  else if(req.url.match(urls.addHobby) && req.method === 'PATCH') {
        // add hobby
        let data = '';
        req.on('data', (chunk) => {
            data += chunk;
        });

        req.on('end', () => {
           const jsonData = JSON.parse(data);
            const addingHobby = hobbies.addHobby(jsonData);
            if (addingHobby.status) {
                res.statusCode = 204;
                res.end();
            } else {
                res.statusCode = 404;
                res.end('User not found');
            }

          });
    } else if(req.url.match(urls.deleteHobby) && req.method === 'DELETE') {
        // delete hobby
        let data = '';
        req.on('data', (chunk) => {
            data += chunk;
        });

        req.on('end', () => {
            const jsonData = JSON.parse(data);
            const deleteHobby = hobbies.deleteHobby(jsonData);
            if (deleteHobby.status) {
                res.statusCode = 204;
                res.end();
            } else {
                res.statusCode = 404;
                if (deleteHobby.message.includes('User')) {
                    res.end('User not found');
                } else {
                    res.end('Hobby not found');
                }
            }

        });
    } else if(req.url.match(urls.listHobbies) && req.method === 'GET') {
        const userHobbies = hobbies.listHobbies(req.url);
        if (userHobbies.status) {
            res.statusCode = 200;
            res.end(JSON.stringify(userHobbies.hobbies, null, 3));
        } else {
            res.statusCode = 404;
            res.end('User not found');
        }

    } else if (req.url.match(urls.singleUser) && req.method === 'GET') {
        // get user details
        const user = users.getUserDetails(req.url);
        if (!user) {
            res.statusCode = 404;
            res.end('Not Found');
        } else {
            res.statusCode = 200;
            res.end(JSON.stringify(user, null, 3));
        }
    } else if (req.url.match(urls.createUser) && req.method === 'POST') {
        // create user
        let data = '';
        req.on('data', (chunk) => data += chunk);
        req.on('end', () => {
            const jsonData = JSON.parse(data);
            const createUser = users.createUser(jsonData);

            if (createUser.status) {
                res.statusCode = 201;
                res.end(JSON.stringify(createUser.userDetails));
            } else {
                res.statusCode = 409;
                res.end('Username already exists');
            }
        })
    } else if (req.url.match(urls.deleteUser) && req.method === 'DELETE') {
        // delete user
        const deleteUser = users.deleteUser(req.url);
        if (deleteUser.status) {
            res.statusCode = 204;
            res.end('User not found');
        } else {
            res.statusCode = 404;
            res.end('User not found');
        }
    } else if (req.url.match(urls.updateUser) && req.method === 'PATCH') {
        // update user details
        let data = '';
        req.on('data', (chunk) => data += chunk);
        req.on('end', () => {
            const jsonData = JSON.parse(data);
            const updateUser = users.updateUser(req.url, jsonData);
            if (updateUser.status) {
                res.statusCode = 200;
                res.end(JSON.stringify(updateUser.userDetails));
            } else {
                res.statusCode = 404;
                res.end('User not found')
            }
        })
    }
});

httpServer.listen(3000, () => {
    console.log('Server listening on port 3000');
});