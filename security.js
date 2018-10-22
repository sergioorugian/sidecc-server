var foreignAgent = require("./foreign-agent.js");

const service = {
    
    login: async () => {
        const response = await foreignAgent.login("08010341000150", "109047");
        if (response.ERROR != null) {
            return null;
        }
        return {};
    }

}

module.exports = service;