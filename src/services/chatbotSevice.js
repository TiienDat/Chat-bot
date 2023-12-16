import request from "request"
require('dotenv').config();

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN
const IMAGE_GET_STARTED = 'https://bit.ly/bookingcareplus'
const IMAGE_GET_OPEN = 'https://bit.ly/openTime'
const IMAGE_GET_CLINIC = 'https://bit.ly/clinicEric'
const IMAGE_GET_SPECIALTY = 'https://bit.ly/specialtyEric'


let callSendAPI = (sender_psid, response) => {
    // Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": response
    }

    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v9.0/me/messages",
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
let getUserName = (sender_psid) => {
    return new Promise((resolve, reject) => {
        request({
            "uri": `https://graph.facebook.com/${sender_psid}?fields=first_name,last_name,profile_pic&access_token=${PAGE_ACCESS_TOKEN}`,
            "method": "GET",
        }, (err, res, body) => {
            console.log(body)
            if (!err) {
                body = JSON.parse(body)
                let username = `${body.last_name} ${body.first_name}`
                resolve(username)
            } else {
                console.error("Unable to send message:" + err);
                reject(err)
            }
        });
    })
    // Send the HTTP request to the Messenger Platform
}
let handleGetStarted = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let username = await getUserName(sender_psid)
            let response1 = { "text": `Xin chào bạn ${username} đến với trang fanpage của chúng tôi` }
            let response2 = sendGetStartedTemplate()
            // send text messenger
            await callSendAPI(sender_psid, response1);

            //send generic template
            await callSendAPI(sender_psid, response2);

            resolve('done')
        } catch (error) {
            reject(error)
        }
    })
}
let sendGetStartedTemplate = () => {
    let response2 = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Xin chào bạn đã đến với BookingCare+ ?",
                    "subtitle": "Dưới đây là các lựa chọn của phòng khám.",
                    "image_url": IMAGE_GET_STARTED,
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Bạn cần giúp đỡ ?",
                            "payload": "MAIN_MENU",
                        },
                        {
                            "type": "postback",
                            "title": "Làm bài test",
                            "payload": "TEST",
                        },
                        {
                            "type": "postback",
                            "title": "Đặt lịch khám",
                            "payload": "BOOKING",
                        }
                    ],
                }]
            }
        }
    }
    return response2;
}
let handleMainMenuTemplate = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response1 = getMainMenuTemplate()
            await callSendAPI(sender_psid, response1)
            resolve('done')
        } catch (error) {
            reject(error)
        }
    })
}
let getMainMenuTemplate = () => {
    let response3 = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Đa dạng các chuyên khoa",
                    "subtitle": "Các chuyên khoa nổi bật.",
                    "image_url": IMAGE_GET_SPECIALTY,
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Tiêu hóa",
                            "payload": "DIGEST",
                        },
                        {
                            "type": "postback",
                            "title": "Tim mạch",
                            "payload": "HEART",
                        },
                        {
                            "type": "postback",
                            "title": "Cột sống",
                            "payload": "SPINE",
                        }
                    ],
                },
                {
                    "title": "Các cơ sở y tế thuộc hệ thống BookingCare",
                    "subtitle": "BookingCare có hệ thống cơ sở y tế trải rộng khắp cả nước",
                    "image_url": IMAGE_GET_CLINIC,
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "TP.Hồ Chí Minh",
                            "payload": "HCM",
                        },
                        {
                            "type": "postback",
                            "title": "TP.Hà Nội",
                            "payload": "HN",
                        },
                        {
                            "type": "postback",
                            "title": "TP.Đà Nẵn",
                            "payload": "DN",
                        }
                    ],
                },
                {
                    "title": "Giờ làm việc",
                    "subtitle": "T2-T6 8AM-20PM | T7-CN 7AM-20PM",
                    "image_url": IMAGE_GET_OPEN,
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Đặt lịch khám ngay",
                            "payload": "BOOK-NOW",
                        },
                    ],
                },
                ]
            }
        }
    }
    return response3;
}
let handleSendHeart = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response1 = getHeartMenuTemplate()
            await callSendAPI(sender_psid, response1)
            resolve('done')
        } catch (error) {
            reject(error)
        }
    })
}
let handleSendDigest = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response1 = getDigestMenuTemplate()
            await callSendAPI(sender_psid, response1)
            resolve('done')
        } catch (error) {
            reject(error)
        }
    })
}
let handleSendSpine = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response1 = getSpineMenuTemplate()
            await callSendAPI(sender_psid, response1)
            resolve('done')
        } catch (error) {
            reject(error)
        }
    })
}
let getDigestMenuTemplate = () => {
    let response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Đau bụng, dạ dày",
                    "subtitle": "Các giáo sư, phó giáo sư là giảng viên Đại học Y khoa HCM",
                    "image_url": IMAGE_GET_SPECIALTY,
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Xem chi tiết",
                            "payload": "VIEW_MORE",
                        }
                    ],
                },
                {
                    "title": "Ăn uống kém, không ngon",
                    "subtitle": "Các giáo sư, phó giáo sư là giảng viên Đại học Y khoa HCM",
                    "image_url": IMAGE_GET_CLINIC,
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Xem chi tiết",
                            "payload": "VIEW_MORE_1",
                        }
                    ],
                },
                {
                    "title": "Co thắt thực quản",
                    "subtitle": "Các giáo sư, phó giáo sư là giảng viên Đại học Y khoa HCM",
                    "image_url": IMAGE_GET_STARTED,
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Xem chi tiết",
                            "payload": "VIEW_MORE_2",
                        }
                    ],
                },
                {
                    "title": "Gửi lại chuyên khoa",
                    "subtitle": "Quay lại menu chính",
                    "image_url": IMAGE_GET_OPEN,
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Quay lại với chuyên khoa",
                            "payload": "BACK_MENU_DIGEST",
                        },
                    ],
                },
                ]
            }
        }
    }
    return response;
}
let getHeartMenuTemplate = () => {
    let response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Tăng huyết áp, hạ huyết áp",
                    "subtitle": "Các giáo sư, phó giáo sư là giảng viên Đại học Y khoa HCM",
                    "image_url": IMAGE_GET_SPECIALTY,
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Xem chi tiết",
                            "payload": "VIEW_MORE_3",
                        }
                    ],
                },
                {
                    "title": "Cảm giác hồi hộp, tim đập nhanh",
                    "subtitle": "Các giáo sư, phó giáo sư là giảng viên Đại học Y khoa HCM",
                    "image_url": IMAGE_GET_CLINIC,
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Xem chi tiết",
                            "payload": "VIEW_MORE_4",
                        }
                    ],
                },
                {
                    "title": "Giãn tĩnh mạch chân",
                    "subtitle": "Các giáo sư, phó giáo sư là giảng viên Đại học Y khoa HCM",
                    "image_url": IMAGE_GET_STARTED,
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Xem chi tiết",
                            "payload": "VIEW_MORE_5",
                        }
                    ],
                },
                {
                    "title": "Gửi lại chuyên khoa",
                    "subtitle": "Quay lại menu chính",
                    "image_url": IMAGE_GET_OPEN,
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Quay lại với chuyên khoa",
                            "payload": "BACK_MENU_HEART",
                        },
                    ],
                },
                ]
            }
        }
    }
    return response;
}
let getSpineMenuTemplate = () => {
    let response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Đau cột sống, đau thắt lưng",
                    "subtitle": "Các giáo sư, phó giáo sư là giảng viên Đại học Y khoa HCM",
                    "image_url": IMAGE_GET_SPECIALTY,
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Xem chi tiết",
                            "payload": "VIEW_MORE_6",
                        }
                    ],
                },
                {
                    "title": "Chấn thương cột sống",
                    "subtitle": "Các giáo sư, phó giáo sư là giảng viên Đại học Y khoa HCM",
                    "image_url": IMAGE_GET_CLINIC,
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Xem chi tiết",
                            "payload": "VIEW_MORE_7",
                        }
                    ],
                },
                {
                    "title": "Đau mỏi cổ vai gáy, bả vai",
                    "subtitle": "Các giáo sư, phó giáo sư là giảng viên Đại học Y khoa HCM",
                    "image_url": IMAGE_GET_STARTED,
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Xem chi tiết",
                            "payload": "VIEW_MORE_8",
                        }
                    ],
                },
                {
                    "title": "Gửi lại chuyên khoa",
                    "subtitle": "Quay lại menu chính",
                    "image_url": IMAGE_GET_OPEN,
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Quay lại với chuyên khoa",
                            "payload": "BACK_MENU_SPINE",
                        },
                    ],
                },
                ]
            }
        }
    }
    return response;
}
module.exports = {
    handleGetStarted,
    handleMainMenuTemplate, handleSendDigest,
    handleSendSpine, handleSendHeart
}