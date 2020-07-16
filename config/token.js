
function tokenConfig(){
    this.token = '';
}

tokenConfig.prototype.setToken = (token) => {
    this.token = token;
}


tokenConfig.prototype.getToken = () => {
    return this.token;
}


module.exports = new tokenConfig();
