import express from "express";
import homeController from "../controllers/homeController"

let router = express.Router();

let initWebRoutes = (app) => {
    router.get("/", homeController.getHomePage)

    router.post('/post-webhook', homeController.postWebhook);
    router.get('/get-webhook', homeController.getWebhook)
    return app.use('/', router)
}
module.exports = initWebRoutes