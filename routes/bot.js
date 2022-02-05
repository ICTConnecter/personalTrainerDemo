var express = require('express');
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

// var greeting_follow = async (ev) => {
//     var profile = await client.getProfile(ev.source.userId);
//     return client.replyMessage(ev.replyToken,[
//       {
//         "type": "bubble",
//         "hero": {
//           "type": "image",
//           "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/01_1_cafe.png",
//           "size": "full",
//           "aspectRatio": "20:13",
//           "aspectMode": "cover",
//           "action": {
//             "type": "uri",
//             "uri": "http://linecorp.com/"
//           }
//         },
//         "body": {
//           "type": "box",
//           "layout": "vertical",
//           "contents": [
//             {
//               "type": "text",
//               "text": "自己紹介",
//               "weight": "bold",
//               "size": "xl"
//             },
//             {
//               "type": "box",
//               "layout": "vertical",
//               "margin": "lg",
//               "spacing": "sm",
//               "contents": [
//                 {
//                   "type": "box",
//                   "layout": "baseline",
//                   "spacing": "sm",
//                   "contents": [
//                     {
//                       "type": "text",
//                       "text": "フォローありがとうございます。\n JOY FIT 認定トレーナーの野村 修平です。\n ～　自己紹介文　～\n トレーニングについてご不明な点がございましたらご気軽にお声がけください!!",
//                       "wrap": true,
//                       "color": "#666666",
//                       "size": "sm",
//                       "flex": 5
//                     }
//                   ]
//                 }
//               ]
//             }
//           ]
//         }
//       },
//       {
//         "type": "bubble",
//         "hero": {
//           "type": "image",
//           "url": "https://personal-trainer-demo.herokuapp.com/images/beforeAfter.jpg",
//           "size": "full",
//           "aspectRatio": "20:13",
//           "aspectMode": "cover",
//           "action": {
//             "type": "uri",
//             "uri": "http://linecorp.com/"
//           }
//         },
//         "body": {
//           "type": "box",
//           "layout": "vertical",
//           "contents": [
//             {
//               "type": "text",
//               "text": "パーソナルトレーニングの\nご案内",
//               "weight": "bold",
//               "size": "md"
//             },
//             {
//               "type": "box",
//               "layout": "vertical",
//               "margin": "lg",
//               "spacing": "sm",
//               "contents": [
//                 {
//                   "type": "box",
//                   "layout": "baseline",
//                   "spacing": "sm",
//                   "contents": [
//                     {
//                       "type": "text",
//                       "text": "ダイエットやバルクアップのためのトレーニング、食事に関するご相談を承っております。\nパーソナルトレーニングでダイエットを2か月実施したトレーニーのBefore Afterを公開しております。\nご興味のある方は下の「Before After」より詳細をご確認ください。\n初回の無料相談もございますので、ご気軽に下の「パーソナルトレーニング受付」よりご連絡ください。",
//                       "wrap": true,
//                       "color": "#666666",
//                       "size": "sm",
//                       "flex": 5
//                     }
//                   ]
//                 }
//               ]
//             }
//           ]
//         },
//         "footer": {
//           "type": "box",
//           "layout": "vertical",
//           "spacing": "sm",
//           "contents": [
//             {
//               "type": "button",
//               "style": "link",
//               "height": "sm",
//               "action": {
//                 "type": "uri",
//                 "label": "Before After",
//                 "uri": "https://line.me/R/home/public/post?id=483iqyqo&postId=1164408225807023777"
//               }
//             },
//             {
//               "type": "button",
//               "style": "link",
//               "height": "sm",
//               "action": {
//                 "type": "uri",
//                 "label": "パーソナルトレーニング受付",
//                 "uri": "https://personal-trainer-demo.herokuapp.com/liff"
//               }
//             },
//             {
//               "type": "spacer",
//               "size": "sm"
//             }
//           ],
//           "flex": 0
//         }
//       }
//       ]);
// }


var greeting_follow = async (ev) => {
  var profile = await client.getProfile(ev.source.userId);
  return client.replyMessage(ev.replyToken,{
    "type":"text",
    "text":`登録ありがとう`
  });
}


// メッセージ受信時の処理

var handleMessageEvent = async (ev) => {
    var profile = await client.getProfile(ev.source.userId);
    var text = (ev.message.type === 'text') ? ev.message.text : '';
     
    switch(text){
        case '診断開始':
            return client.replyMessage(ev.replyToken,{
              "type":"text",
              "text":`診断機能を実装予定`
            });
        case 'トレーニング解説':
          return client.replyMessage(ev.replyToken,{
            "type":"text",
            "text":`トレーニング解説機能を実装予定`
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