
// function to map the session id to the logged in user 

const sessionIdToUserMap = new Map();

function setUser(id,user){
    sessionIdToUserMap.set(id,user)
}

function getUser(id){
    return sessionIdToUserMap.get(id);
}

module.exports  = {
    getUser,
    setUser
};
