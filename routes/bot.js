var express = require('express');
var sexChose = require('../const/sexChose');
var router = express.Router();
// LINEトークのモジュールを読み込み
var line = require('@line/bot-sdk');

var config = {
    // アクセストークンの設定(環境変数としてherokuに設定)
    channelAccessToken:process.env.ACCESS_TOKEN,
    // チャンネルセレクトの設定(環境変数としてherokuに設定)
    channelSecret:process.env.CHANNEL_SECRET
};

var client = new line.Client(config);
router.post('/hook',line.middleware(config),(req,res)=> lineBot(req,res));

// トークの処理　ココから
var lineBot = (req,res) => {
    res.status(200).end();
    var events = req.body.events;
    var promises = [];
    for(let i=0;i<events.length;i++){
        var ev = events[i];
        switch(ev.type){
            case 'follow':
                promises.push(greeting_follow(ev));
                break;
            case 'message':
                promises.push(handleMessageEvent(ev));
                break;
        }
    }
    Promise
        .all(promises)
        .then(console.log('all promises passed'))
        .catch(e=>console.error(e.stack));
}

// フォロー時の処理

var greeting_follow = async (ev) => {
    var profile = await client.getProfile(ev.source.userId);
    return client.replyMessage(ev.replyToken,{
        "type":"text",
        "text":`${profile.displayName}さん、フォローありがとうございます\uDBC0\uDC04`
    });
}

// メッセージ受信時の処理

var handleMessageEvent = async (ev) => {
    var profile = await client.getProfile(ev.source.userId);
    var text = (ev.message.type === 'text') ? ev.message.text : '';
     
    switch(text){
        case '診断開始':
            console.log(sexChose);
            return client.replyMessage(ev.replyToken,{
                "type":"flex",
   "altText":"menuSelect",
   "contents":{
    "type": "carousel",
    "contents": [
      {
        "type": "bubble",
        "size": "micro",
        "hero": {
          "type": "image",
          "url": "https://scdn.line-apps.com/n/channel_devcenter/img/flexsnapshot/clip/clip10.jpg",
          "size": "full",
          "aspectMode": "cover",
          "aspectRatio": "320:213"
        },
        "body": {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "button",
              "action": {
                "type": "postback",
                "label": "男性",
                "data": "m"
              },
              "style": "primary",
              "gravity": "center",
              "color": "#1360a6"
            }
          ],
          "spacing": "sm",
          "paddingAll": "13px"
        }
      },
      {
        "type": "bubble",
        "size": "micro",
        "hero": {
          "type": "image",
          "url": "https://scdn.line-apps.com/n/channel_devcenter/img/flexsnapshot/clip/clip11.jpg",
          "size": "full",
          "aspectMode": "cover",
          "aspectRatio": "320:213"
        },
        "body": {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "button",
              "action": {
                "type": "postback",
                "label": "女性",
                "data": "w"
              },
              "style": "primary",
              "gravity": "center",
              "color": "#e7141a"
            }
          ]
        }
      }
    ]
  }
            });
        case 'noman':
          return client.replyMessage(ev.replyToken,{
            "type":"text",
            "text":`${profile.displayName}さんは${text}なんですね!!`
          });
        default:
          return client.replyMessage(ev.replyToken,{
            "type":"text",
            "text":`${profile.displayName}さん、今${text}って言いました!？`
          });
    }
}
// ココまで



module.exports = router;