const users = [];

// Add users
const addUser = ({id, username, room}) => {
    // Clear the Data
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    // Validating the Data
    if (!username || !room) {
        return {
            error: "Username and room are Required",
        };
    }

    // Name should be unique
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username;
    });

    //Validating username
    if (existingUser) {
        return {
            error: "Username is in Use!!!",
        };
    }

    // User is ready to be stored
    const user = {id, username, room};
    users.push(user);
    return {user};
};

// Remove users
const removeUser = (id) => {
    const index = users.findIndex((user) => {
        return user.id === id;
    });

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
};

// getUser
const getUser = (id) => {
    return users.find((user) => user.id === id);
};

// getUsersInRoom
const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase();

    return users.filter((user) => user.room === room);
};

module.exports = {addUser, removeUser, getUser, getUsersInRoom};
