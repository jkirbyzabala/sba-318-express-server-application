const axios = require('axios');

const newUser = {
    name: 'Mister Morale',
    email: 'k.dot@aol.com',
};

axios.post('http://localhost:3000/users', newUser)
    .then(response => {
        console.log('User added successfully:', response.data);
    })
    .catch(error => {
        console.error('Error adding user:', error.message);
    });