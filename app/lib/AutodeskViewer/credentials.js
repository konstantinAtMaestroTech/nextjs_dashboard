var credentials = {
    client: {
        client_id: process.env.APS_CLIENT_ID, // i think i might be passing it to the client in use client which is bad. That's why it was done on the server previously. 
        client_secret: process.env.APS_CLIENT_SECRET,
    },

    body: {
        grant_type: 'client_credentials',
        scope: 'code:all data:write data:read'
    },

    //Autodesk Platform Service base url
    BaseUrl: 'https://developer.api.autodesk.com',
    Version: 'v2',

    // JS class !!!
    get Authentication() {
        return this.BaseUrl + '/authentication/' + this.Version + '/token';
    },

    get clientAuthKeys() {
        return btoa(this.client.client_id + ":" + this.client.client_secret);
    }
};

export default credentials