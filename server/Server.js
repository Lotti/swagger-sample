'use strict';

const log4js = require('log4js');
const log = log4js.getLogger('server');

const fs = require('fs');
const http = require('http');
const path = require('path');
const express = require("express");
const bodyParser = require('body-parser');
const compression = require('compression');
const oasTools = require('oas-tools');
const jsyaml = require('js-yaml');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.app.set('port', this.port);
    this.app.use(bodyParser.json({strict: false, limit:'10mb'}));
    this.app.use(compression());

    this.httpServer = http.createServer(this.app);
    // this.httpsServer = https.createServer(options, this.app);

    // SWAGGER
    const spec = fs.readFileSync(path.join(process.cwd(), 'api', 'openapi.yaml'), 'utf8');
    this.oasDoc = jsyaml.safeLoad(spec);

    const swaggerLogger = log4js.getLogger('swagger');
    swaggerLogger.warning = swaggerLogger.warn;

    this.options_object = {
      controllers: path.join(__dirname, 'controllers'),
      customLogger: swaggerLogger,
      // loglevel: 'info',
      // logfile: path.join(process.cwd(), 'logs', 'swagger'),
      strict: false,
      router: true,
      validator: true,
      docs: {
        apiDocs: '/api-docs',
        apiDocsPrefix: '',
        swaggerUi: '/docs',
        swaggerUiPrefix: '',
      },
    };

    oasTools.configure(this.options_object);
    oasTools.initialize(this.oasDoc, this.app, () => {});
    // END SWAGGER
  }

  /**
   * Static method to return the same instance
   */
  static INSTANCE() {
    if (!Server.instance) {
      Server.instance = new Server();
    }

    return Server.instance;
  }

  run() {
    this.httpServer.listen(this.port, () => {
      log.info(`App running at localhost:${this.port}`);
      if (this.options_object.docs !== false) {
        log.info(`API docs (Swagger UI) available on localhost:${this.port}/docs`);
      }
    });
  }

  getHttpServer() {
    return this.httpServer;
  }

  getApp() {
    return this.app;
  }
}

module.exports = Server;
