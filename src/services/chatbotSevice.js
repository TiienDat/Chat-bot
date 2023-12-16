import request from "request"
require('dotenv').config();

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN
const IMAGE_GET_STARTED = 'https://bit.ly/bookingcareplus'
const IMAGE_GET_OPEN = 'https://bit.ly/openTime'
const IMAGE_GET_CLINIC = 'https://bit.ly/clinicEric'
const IMAGE_GET_SPECIALTY = 'https://bit.ly/specialtyEric'
const IMAGE_OPEN = 'https://bit.ly/gifEric1'


const IMAGE_DIGEST1 = 'https://bcare.vn/upload/2019/09/28/20190927_200926_832533_viem-loet-da-day.max-800x800.jpg'
const IMAGE_DIGEST2 = 'https://suckhoehangngay.mediacdn.vn/zoom/680_425/2019/4/24/trieu-chung-nong-rat-1556094097361809199958-crop-1556094106344706596091.png'
const IMAGE_DIGEST3 = 'https://png.pngtree.com/element_our/20190603/ourlarge/pngtree-human-body-stomach-illustration-image_1458844.jpg'

const IMAGE_HEART1 = 'https://tobacare.com/wp-content/uploads/2021/08/c482n-gc3ac-c491e1bb83-tim-khe1bb8fe-me1baa1nh-vc3a0-cc3a1ch-phc3b2ng-nge1bbaba-be1bb87nh.jpg'
const IMAGE_HEART2 = 'https://vinmec-prod.s3.amazonaws.com/images/20190607_143008_003789_cda4a01dc65c2f02764.max-1800x1800.jpg'
const IMAGE_HEART3 = 'https://i.dailymail.co.uk/1s/2022/07/02/13/59784117-0-image-a-14_1656763817533.jpg'

const IMAGE_SPINE1 = 'https://media.istockphoto.com/id/1440480206/photo/spinal-cord-vertebral-column-of-human-skeleton-system-anatomy.jpg?s=612x612&w=0&k=20&c=o5WDKYjNaAH5bitkmWdtmUXrp6L8cwUT-bGRIj5tcWA='
const IMAGE_SPINE2 = 'https://hips.hearstapps.com/hmg-prod/images/281/maingettyimages-122373921-1518562427.jpg'
const IMAGE_SPINE3 = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTM-HnOo2TctBIG_RurF0RDC_oEt_OjMwjLqrfQ3VEu0w2y4TgqmA-E2Aalc8BVxkDLAkc&usqp=CAU'

let callSendAPI = async (sender_psid, response) => {
    // Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": response
    }
    await sendTypingOn(sender_psid);
    await sendMarkReadMessage(sender_psid)

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
let sendTypingOn = (sender_psid) => {
    // Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "sender_action": "typing_on"
    }

    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v9.0/me/messages",
        "qs": { "access_token": PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('sendTypingOn send!')
        } else {
            console.error("Unable to send message:" + err);
        }
    });
}
let sendMarkReadMessage = (sender_psid) => {
    // Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "sender_action": "mark_seen"
    }

    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v9.0/me/messages",
        "qs": { "access_token": PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('sendTypingOn send!')
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
                            "title": "Hồ Chí Minh",
                            "payload": "HCM",
                        },
                        {
                            "type": "postback",
                            "title": "Hà Nội",
                            "payload": "HN",
                        },
                        {
                            "type": "postback",
                            "title": "Đà Nẵng",
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
                    "image_url": IMAGE_DIGEST3,
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Tư vấn trực tiếp",
                            "payload": "VIEW_MORE",
                        }
                    ],
                },
                {
                    "title": "Ăn uống kém, không ngon",
                    "subtitle": "Các giáo sư, phó giáo sư là giảng viên Đại học Y khoa HCM",
                    "image_url": IMAGE_DIGEST2,
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Tư vấn trực tiếp",
                            "payload": "VIEW_MORE",
                        }
                    ],
                },
                {
                    "title": "Co thắt thực quản",
                    "subtitle": "Các giáo sư, phó giáo sư là giảng viên Đại học Y khoa HCM",
                    "image_url": IMAGE_DIGEST1,
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Tư vấn trực tiếp",
                            "payload": "VIEW_MORE",
                        }
                    ],
                },
                {
                    "title": "Gửi lại chuyên khoa",
                    "subtitle": "Quay lại menu chính",
                    "image_url": IMAGE_GET_STARTED,
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Quay lại với chuyên khoa",
                            "payload": "BACK_MENU",
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
                    "image_url": IMAGE_HEART1,
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Tư vấn trực tiếp",
                            "payload": "VIEW_MORE",
                        }
                    ],
                },
                {
                    "title": "Cảm giác hồi hộp, tim đập nhanh",
                    "subtitle": "Các giáo sư, phó giáo sư là giảng viên Đại học Y khoa HCM",
                    "image_url": IMAGE_HEART2,
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Tư vấn trực tiếp",
                            "payload": "VIEW_MORE",
                        }
                    ],
                },
                {
                    "title": "Giãn tĩnh mạch chân",
                    "subtitle": "Các giáo sư, phó giáo sư là giảng viên Đại học Y khoa HCM",
                    "image_url": IMAGE_HEART3,
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Tư vấn trực tiếp",
                            "payload": "VIEW_MORE",
                        }
                    ],
                },
                {
                    "title": "Gửi lại chuyên khoa",
                    "subtitle": "Quay lại menu chính",
                    "image_url": IMAGE_GET_STARTED,
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Quay lại với chuyên khoa",
                            "payload": "BACK_MENU",
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
                    "image_url": IMAGE_SPINE1,
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Tư vấn trực tiếp",
                            "payload": "VIEW_MORE",
                        }
                    ],
                },
                {
                    "title": "Chấn thương cột sống",
                    "subtitle": "Các giáo sư, phó giáo sư là giảng viên Đại học Y khoa HCM",
                    "image_url": IMAGE_SPINE2,
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Tư vấn trực tiếp",
                            "payload": "VIEW_MORE",
                        }
                    ],
                },
                {
                    "title": "Đau mỏi cổ vai gáy, bả vai",
                    "subtitle": "Các giáo sư, phó giáo sư là giảng viên Đại học Y khoa HCM",
                    "image_url": IMAGE_SPINE3,
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Tư vấn trực tiếp",
                            "payload": "VIEW_MORE",
                        }
                    ],
                },
                {
                    "title": "Gửi lại chuyên khoa",
                    "subtitle": "Quay lại menu chính",
                    "image_url": IMAGE_GET_STARTED,
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Quay lại với chuyên khoa",
                            "payload": "BACK_MENU",
                        },
                    ],
                },
                ]
            }
        }
    }
    return response;
}
let handleSendViewMore = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let res = getSendViewMore();
            let res2 = getSendMore()
            await callSendAPI(sender_psid, res)
            await callSendAPI(sender_psid, res2)
            resolve('done')
        } catch (error) {
            reject(error)
        }
    })
}
let getSendViewMore = () => {
    let response1 = {
        "attachment": {
            "type": "image",
            "payload": {
                "url": IMAGE_OPEN,
                "is_reusable": true
            }
        }
    }
    return response1;
}
let getSendMore = () => {
    let response2 = { "text": `Chúng tôi đã nhận được yêu cầu của bạn vui lòng đợi trong giây lát chúng tôi sẽ phản hồi sớm nhất có thể` };
    return response2
}
module.exports = {
    handleGetStarted,
    handleMainMenuTemplate, handleSendDigest,
    handleSendSpine, handleSendHeart,
    handleSendViewMore
}