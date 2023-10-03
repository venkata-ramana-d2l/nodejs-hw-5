const http = require('http');

const urls = require('./url-regex');
const users = require('./APIs/users');
const hobbies = require('./APIs/hobbies');


const httpServer = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');
    if (req.url.match(urls.users)) {
        if (req.method === 'GET') {
            // get all users details
            res.statusCode = 200;
            res.end(JSON.stringify(users.getAllUsers(), null, 3));
        } else if (req.method === 'POST') {
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
        }
    } else if (req.url.match(urls.userDetails)) {
        if (req.method === 'GET') {
            // get user details
            const user = users.getUserDetails(req.url);
            if (!user) {
                res.statusCode = 404;
                res.end('Not Found');
            } else {
                res.statusCode = 200;
                res.end(JSON.stringify(user, null, 3));
            }
        } else if (req.method === 'DELETE') {
            // delete user
            const deleteUser = users.deleteUser(req.url);
            if (deleteUser.status) {
                res.statusCode = 204;
                res.end('User not found');
            } else {
                res.statusCode = 404;
                res.end('User not found');
            }
        } else if (req.method === 'PATCH') {
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
    } else if (req.url.match(urls.hobbies) && req.method === 'GET') {
        const userHobbies = hobbies.listHobbies(req.url);
        if (userHobbies.status) {
            res.statusCode = 200;
            res.end(JSON.stringify(userHobbies.hobbies, null, 3));
        } else {
            res.statusCode = 404;
            res.end('User not found');
        }
    } else if (req.url.match(urls.updateHobby)) {
        if (req.method === 'DELETE') {
            const deleteHobby = hobbies.deleteHobby(req.url);
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
        } else if (req.method === 'PATCH') {
            // add hobby
            const addingHobby = hobbies.addHobby(req.url);
            if (addingHobby.status) {
                res.statusCode = 204;
                res.end();
            } else {
                res.statusCode = 404;
                res.end('User not found');
            }
        }
    }
});

httpServer.listen(3000, () => {
    console.log('Server listening on port 3000');
});