module.exports = {
  servers: {
    one: {
      // TODO: set host address, username, and authentication method
      host: '162.243.174.218',
      username: 'root',
      pem: '~/.ssh/id_rsa'
      // password: 'server-password'
      // or neither for authenticate from ssh-agent
    }
  },

  app: {
    // TODO: change app name and path
    name: 'ntavigwa',
    path: '../',

    servers: {
      one: {},
    },

    buildOptions: {
      serverOnly: true,
    },

    env: {
      // TODO: Change to your app's url
      // If you are using ssl, it needs to start with https://
      ROOT_URL: 'https://ntavigwa.com',
      MONGO_URL: 'mongodb://admin:zSX3lAKMHOdZdXe2@SG-ntavigwaProject1997-26409.servers.mongodirector.com:27017/admin?ssl=true',
      // MONGO_OPLOG_URL: 'mongodb://mongodb/local',
    },

    docker: {
      // change to 'abernix/meteord:base' if your app is using Meteor 1.4 - 1.5
      image: 'abernix/meteord:node-8.4.0-base',
    },

    // Show progress bar while uploading bundle to server
    // You might need to disable it on CI servers
    enableUploadProgressBar: true
  },

  // mongo: {
  //   version: '4.0.6',
  //   servers: {
  //     one: {}
  //   }
  // },

  // (Optional)
  // Use the proxy to setup ssl or to route requests to the correct
  // app when there are several apps

  // proxy: {
  //   domains: 'ntavigwa.com,www.ntavigwa.com',

  //   ssl: {
  //     // Enable Let's Encrypt
  //     letsEncryptEmail: 'ntavigwabashombe@gmail.com'
  //   }
  // }
};
