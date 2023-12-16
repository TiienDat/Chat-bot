import express from "express";
import homeController from "../controllers/homeController"

let router = express.Router();

let initWebRoutes = (app) => {
    router.get("/", homeController.getHomePage)

    router.post('/setup-profile', homeController.setupProfile)
    router.post('/setup-persistent_menu', homeController.setupPersistentMenu)
    router.get('/booking', homeController.getBooking)
    router.post('/booking-ajax', homeController.postBookingAjax)

    router.post('/webhook', homeController.postWebhook)
    router.get('/webhook', homeController.getWebhook)
    return app.use('/', router)
}
module.exports = initWebRoutes;