module.exports = ({ env }) => ({
  defaultConnection: 'default',
  "connections": {
    "default": {
      "connector": "mongoose",
      "settings": {
        "uri": "mongodb+srv://meridukan:zakaria@cluster0-z8uyz.mongodb.net/test?retryWrites=true&w=majority"
      },
      "options": {
        "ssl": true
      }
    }
  }
});
