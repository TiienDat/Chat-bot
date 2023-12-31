require('dotenv').config();
import request from 'request';
import chatbotServie from "../services/chatbotSevice"

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

let getHomePage = (req, res) => {
    return res.render('homepage.ejs')
};

let postWebhook = (req, res) => {
    let body = req.body;
    if (body.object === "page") {
        body.entry.forEach(function (entry) {

            // Gets the body of the webhook event
            let webhook_event = entry.messaging[0];
            console.log(webhook_event);


            // Get the sender PSID
            let sender_psid = webhook_event.sender.id;
            console.log('Sender PSID: ' + sender_psid);

            // Check if the event is a message or postback and
            // pass the event to the appropriate handler function
            if (webhook_event.message) {
                handleMessage(sender_psid, webhook_event.message);
            } else if (webhook_event.postback) {
                handlePostback(sender_psid, webhook_event.postback);
            }
        });
        // Return a '200 OK' response to all events
        res.status(200).send('EVENT_RECEIVED');
    } else {
        // Return a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }
}
let getWebhook = (req, res) => {


    // Parse the query params
    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];

    // Check if a token and mode is in the query string of the request
    if (mode && token) {
        // Check the mode and token sent is correct
        if (mode === "subscribe" && token === VERIFY_TOKEN) {
            // Respond with the challenge token from the request
            console.log("WEBHOOK_VERIFIED");
            res.status(200).send(challenge);
        } else {
            // Respond with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }
}

let setupProfile = async (req, res) => {
    // call
    // call profile facebook
    let request_body = {
        "get_started": { "payload": "GET_STARTTED" },
        "whitelisted_domains": ["https://chat-bot-services.onrender.com/"]
    }

    // Send the HTTP request to the Messenger Platform
    await request({
        "uri": `https://graph.facebook.com/v18.0/me/messenger_profile?access_token=${PAGE_ACCESS_TOKEN}`,
        "qs": { "access_token": PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        console.log(body)
        if (!err) {
            console.log('Setup user profile succeeds!')
        } else {
            console.error("Unable to send message:" + err);
        }
    });

    return res.send("Setup user profile succeeds !");
}
// Handles messages events
function handleMessage(sender_psid, received_message) {
    let response;

    // Checks if the message contains text
    if (received_message.text) {
        // Create the payload for a basic text message, which
        // will be added to the body of our request to the Send API
        response = {
            "text": `Xin lỗi đây là ChatBot tự động của BookingCare+ ^^`
        }
    } else if (received_message.attachments) {
        // Get the URL of the message attachment
        let attachment_url = received_message.attachments[0].payload.url;
        response = {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [{
                        "title": "Is this the right picture?",
                        "subtitle": "Tap a button to answer.",
                        "image_url": attachment_url,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Yes!",
                                "payload": "yes",
                            },
                            {
                                "type": "postback",
                                "title": "No!",
                                "payload": "no",
                            }
                        ],
                    }]
                }
            }
        }
    }

    // Send the response message
    callSendAPI(sender_psid, response);
}

// Handles messaging_postbacks events
async function handlePostback(sender_psid, received_postback) {
    let response;

    // Get the payload for the postback
    let payload = received_postback.payload;
    switch (payload) {
        case 'yes':
            response = { "text": "Thanks!" }
            break;
        case 'no':
            response = { "text": "Oops, try sending another image." }
            break;
        case 'GET_STARTTED':
        case 'RESTART_BOT':
            await chatbotServie.handleGetStarted(sender_psid);
            break;
        case 'MAIN_MENU':
        case 'BACK_MENU':
            await chatbotServie.handleMainMenuTemplate(sender_psid);
            break;
        case 'DIGEST':
            await chatbotServie.handleSendDigest(sender_psid);
            break;
        case 'HEART':
            await chatbotServie.handleSendHeart(sender_psid);
            break;
        case 'SPINE':
            await chatbotServie.handleSendSpine(sender_psid);
            break;
        case 'VIEW_MORE':
            await chatbotServie.handleSendViewMore(sender_psid);
            break;
        default:
            response = { "text": `Xin lỗi đây là ChatBot tự động của BookingCare+ ^^` }
    }
    // Send the message to acknowledge the postback
    callSendAPI(sender_psid, response);
}


// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
    // Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": response
    }

    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        "qs": { "access_token": PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('message sent!')
        } else {
            console.error("Unable to send message:" + err);
        }
    });
}

let setupPersistentMenu = async (req, res) => {
    let request_body = {
        "persistent_menu": [
            {
                "locale": "default",
                "composer_input_disabled": false,
                "call_to_actions": [
                    {
                        "type": "web_url",
                        "title": "HomePage Booking Care ",
                        "url": "https://www.facebook.com/bookingeric",
                        "webview_height_ratio": "full"
                    },
                    {
                        "type": "web_url",
                        "title": "Trang web của chúng tôi",
                        "url": "https://tiiendat-fe-bookingcare.vercel.app/",
                        "webview_height_ratio": "full"
                    },
                    {
                        "type": "postback",
                        "title": "Khởi động lại Chatbot",
                        "payload": "RESTART_BOT"
                    }
                ]
            }
        ]
    }
    await request({
        "uri": `https://graph.facebook.com/v18.0/me/messenger_profile?access_token=${PAGE_ACCESS_TOKEN}`,
        "qs": { "access_token": PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        console.log(body)
        if (!err) {
            console.log('Setup persistent menu succeeds!')
        } else {
            console.error("Unable persistent menu :" + err);
        }
    });

    return res.send('Setup persistent menu succeeds!');
}
let handleBooking = (req, res) => {
    return res.render('booking.ejs')
}
let handlePostBooking = async (req, res) => {
    try {
        let customerName = "";
        if (req.body.customerName === "") {
            customerName = "Empty";
        } else customerName = req.body.customerName;

        let response = {
            "text": `--- Thông tin đặt lịch khám bệnh ---
            \nHọ và Tên : ${customerName}
            \nEmail : ${req.body.email}
            \nSố Điện Thoại : ${req.body.phoneNumber}
            `
        };
        await chatbotServie.callSendAPI(req.body.psid, response)
        console.log('check req-body-psid and rres :', req.body.psid, req.body.psid)
        return res.status(200).json({
            message: 'Ok'
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error"
        })
    }
}
module.exports = {
    getHomePage: getHomePage,
    postWebhook: postWebhook,
    getWebhook: getWebhook,
    setupProfile: setupProfile,
    setupPersistentMenu: setupPersistentMenu,
    handleBooking: handleBooking,
    handlePostBooking: handlePostBooking
}