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
var greeting_follow = async (ev) => {
  var profile = await client.getProfile(ev.source.userId);
  return client.replyMessage(ev.replyToken,[{
    "type": "flex",
    "altText": "flexMessageです",
    "contents": {
    "type": "bubble",
    "hero": {
      "type": "image",
      "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/01_1_cafe.png",
      "size": "full",
      "aspectRatio": "20:13",
      "aspectMode": "cover",
      "action": {
        "type": "uri",
        "uri": "http://linecorp.com/"
      }
    },
    "body": {
      "type": "box",
      "layout": "vertical",
      "contents": [
        {
          "type": "text",
          "text": "自己紹介",
          "weight": "bold",
          "size": "xl"
        },
        {
          "type": "box",
          "layout": "vertical",
          "margin": "lg",
          "spacing": "sm",
          "contents": [
            {
              "type": "box",
              "layout": "baseline",
              "spacing": "sm",
              "contents": [
                {
                  "type": "text",
                  "text": "フォローありがとうございます。\n JOY FIT 認定トレーナーの野村 修平です。\n ～　自己紹介文　～\n トレーニングについてご不明な点がございましたらご気軽にお声がけください!!",
                  "wrap": true,
                  "color": "#666666",
                  "size": "sm",
                  "flex": 5
                }
              ]
            }
          ]
        }
      ]
    }
  }
  },
  {
    "type": "flex",
    "altText": "flexMessageです",
    "contents": {
    "type": "bubble",
    "hero": {
      "type": "image",
      "url": "https://personal-trainer-demo.herokuapp.com/images/beforeAfter.jpg",
      "size": "full",
      "aspectRatio": "20:13",
      "aspectMode": "cover",
      "action": {
        "type": "uri",
        "uri": "http://linecorp.com/"
      }
    },
    "body": {
      "type": "box",
      "layout": "vertical",
      "contents": [
        {
          "type": "text",
          "text": "パーソナルトレーニングの\nご案内",
          "weight": "bold",
          "size": "md"
        },
        {
          "type": "box",
          "layout": "vertical",
          "margin": "lg",
          "spacing": "sm",
          "contents": [
            {
              "type": "box",
              "layout": "baseline",
              "spacing": "sm",
              "contents": [
                {
                  "type": "text",
                  "text": "ダイエットやバルクアップのためのトレーニング、食事に関するご相談を承っております。\nパーソナルトレーニングでダイエットを2か月実施したトレーニーのBefore Afterを公開しております。\nご興味のある方は下の「Before After」より詳細をご確認ください。\n初回の無料相談もございますので、ご気軽に下の「パーソナルトレーニング受付」よりご連絡ください。",
                  "wrap": true,
                  "color": "#666666",
                  "size": "sm",
                  "flex": 5
                }
              ]
            }
          ]
        }
      ]
    },
    "footer": {
      "type": "box",
      "layout": "vertical",
      "spacing": "sm",
      "contents": [
        {
          "type": "button",
          "style": "link",
          "height": "sm",
          "action": {
            "type": "uri",
            "label": "Before After",
            "uri": "https://line.me/R/home/public/post?id=483iqyqo&postId=1164408225807023777"
          }
        },
        {
          "type": "button",
          "style": "link",
          "height": "sm",
          "action": {
            "type": "uri",
            "label": "パーソナルトレーニング受付",
            "uri": "https://personal-trainer-demo.herokuapp.com/liff"
          }
        },
        {
          "type": "spacer",
          "size": "sm"
        }
      ],
      "flex": 0
    }
  }
  }]);
}

// メッセージ受信時の処理
var handleMessageEvent = async (ev) => {
    var profile = await client.getProfile(ev.source.userId);
    var text = (ev.message.type === 'text') ? ev.message.text : '';

    if ('診断開始' == text) {
      return client.replyMessage(ev.replyToken,[{
        "type":"text",
        "text":`性別を選択してください`
      },
      {
        "type": "imagemap",
        "baseUrl": "https://personal-trainer-demo.herokuapp.com/images/imagemap/chooseSex",
        "altText": "性別選択ボタン",
        "baseSize": {"width": 1040, "height": 1202},
        "actions": [
            {
                "type": "message",
                "text": "性別：男性",
                "area": {"x": 0, "y": 0, "width": 520, "height": 1040}
            },
            {
                "type": "message",
                "text": "性別：女性",
                "area": {"x": 520, "y": 0, "width": 520, "height": 1040}
            }
        ]
      }]);
    } else if (text.indexOf('性別：男性') != -1) {
      if ((text.indexOf('理想：') != -1) && (text.indexOf('現状：') != -1)) {
        if(text.indexOf('現状：3-4％') != -1){

        }else if(text.indexOf('現状：6-7％') != -1){

        }else if(text.indexOf('現状：10-12％') != -1){

        }else if(text.indexOf('現状：15％') != -1){

        }else if(text.indexOf('現状：20％') != -1){

        }else if(text.indexOf('現状：25％') != -1){

        }else if(text.indexOf('現状：30％') != -1){
          
        }else if(text.indexOf('現状：35％') != -1){

        }else if(text.indexOf('現状：40％') != -1){

        }else{
          
        }
        if(text.indexOf('理想：3-4％') != -1){

        }else if(text.indexOf('理想：6-7％') != -1){

        }else if(text.indexOf('理想：10-12％') != -1){

        }else if(text.indexOf('理想：15％') != -1){

        }else if(text.indexOf('理想：20％') != -1){

        }else if(text.indexOf('理想：25％') != -1){

        }else if(text.indexOf('理想：30％') != -1){
          
        }else if(text.indexOf('理想：35％') != -1){

        }else if(text.indexOf('理想：40％') != -1){

        }else{
          
        }
      } else if ((text.indexOf('現状：') != -1)) {
        return client.replyMessage(ev.replyToken,[{
          "type":"text",
          "text":`理想の体型を選択してください`
        },
        {
          "type": "imagemap",
          "baseUrl": "https://personal-trainer-demo.herokuapp.com/images/imagemap/chooseMensBody",
          "altText": "理想選択ボタン",
          "baseSize": {
              "width": 1040,
              "height": 1202
          },
          "actions": [
              {
                  "type": "message",
                  "text": `${text}\n理想：3-4％`,
                  "area": {"x": 0, "y": 0, "width": 346, "height": 400}
              },
              {
                  "type": "message",
                  "text": `${text}\n理想：6-7％`,
                  "area": {
                      "x": 346, "y": 0, "width": 346, "height": 400}
              },
              {
                  "type": "message",
                  "text": `${text}\n理想：10-12％`,
                  "area": {"x": 692, "y": 0, "width": 346, "height": 400}
              },
              {
                  "type": "message",
                  "text": `${text}\n理想：15％`,
                  "area": {"x": 0, "y": 400, "width": 346, "height": 400}
              },
              {
                  "type": "message",
                  "text": `${text}\n理想：20％`,
                  "area": {"x": 346, "y": 400, "width": 346, "height": 400}
              },
              {
                  "type": "message",
                  "text": `${text}\n理想：25％`,
                  "area": {"x": 692, "y": 400, "width": 346, "height": 400}
              },
              {
                  "type": "message",
                  "text": `${text}\n理想：30％`,
                  "area": {"x": 0, "y": 800, "width": 346, "height": 400}
              },
              {
                  "type": "message",
                  "text": `${text}\n理想：35％`,
                  "area": {"x": 346, "y": 800, "width": 346, "height": 400}
              },
              {
                  "type": "message",
                  "text": `${text}\n理想：40％`,
                  "area": {"x": 692, "y": 800, "width": 346, "height": 400}
              }
          ]
        }]);
      } else {
        return client.replyMessage(ev.replyToken,[{
          "type":"text",
          "text":`現状の体型を選択してください`
        },
        {
          "type": "imagemap",
          "baseUrl": "https://personal-trainer-demo.herokuapp.com/images/imagemap/chooseMensBody",
          "altText": "現状選択ボタン",
          "baseSize": {
              "width": 1040,
              "height": 1202
          },
          "actions": [
              {
                  "type": "message",
                  "text": `${text}\n現状：3-4％`,
                  "area": {"x": 0, "y": 0, "width": 346, "height": 400}
              },
              {
                  "type": "message",
                  "text": `${text}\n現状：6-7％`,
                  "area": {"x": 346, "y": 0, "width": 346, "height": 400}
              },
              {
                  "type": "message",
                  "text": `${text}\n現状：10-12％`,
                  "area": {"x": 692, "y": 0, "width": 346, "height": 400}
              },
              {
                  "type": "message",
                  "text": `${text}\n現状：15％`,
                  "area": {"x": 0, "y": 400, "width": 346, "height": 400}
              },
              {
                  "type": "message",
                  "text": `${text}\n現状：20％`,
                  "area": {"x": 346, "y": 400, "width": 346, "height": 400}
              },
              {
                  "type": "message",
                  "text": `${text}\n現状：25％`,
                  "area": {"x": 692, "y": 400, "width": 346, "height": 400}
              },
              {
                  "type": "message",
                  "text": `${text}\n現状：30％`,
                  "area": {"x": 0, "y": 800, "width": 346, "height": 400}
              },
              {
                  "type": "message",
                  "text": `${text}\n現状：35％`,
                  "area": {"x": 346, "y": 800, "width": 346, "height": 400}
              },
              {
                  "type": "message",
                  "text": `${text}\n現状：40％`,
                  "area": {"x": 692, "y": 800, "width": 346, "height": 400}
              }
          ]
        }]);
      }
    } else if (text.indexOf('性別：女性') != -1) {
      if ((text.indexOf('理想：') != -1) && (text.indexOf('現状：') != -1)) {
        return client.replyMessage(ev.replyToken,{});    //　計算処理を記載
      } else if ((text.indexOf('現状：') != -1)) {
        return client.replyMessage(ev.replyToken,[{
          "type":"text",
          "text":`理想の体型を選択してください`
        },
        {
          "type": "imagemap",
          "baseUrl": "https://personal-trainer-demo.herokuapp.com/images/imagemap/chooseWomensBody",
          "altText": "理想選択ボタン",
          "baseSize": {"width": 1040, "height": 1202
          },
          "actions": [
              {
                  "type": "message",
                  "text": `${text}\n理想：3-4％`,
                  "area": {"x": 0, "y": 0, "width": 346, "height": 400}
              },
              {
                  "type": "message",
                  "text": `${text}\n理想：6-7％`,
                  "area": {"x": 346, "y": 0, "width": 346, "height": 400}
              },
              {
                  "type": "message",
                  "text": `${text}\n理想：10-12％`,
                  "area": {"x": 692, "y": 0, "width": 346, "height": 400}
              },
              {
                  "type": "message",
                  "text": `${text}\n理想：15％`,
                  "area": {"x": 0, "y": 400, "width": 346, "height": 400}
              },
              {
                  "type": "message",
                  "text": `${text}\n理想：20％`,
                  "area": {"x": 346, "y": 400, "width": 346, "height": 400}
              },
              {
                  "type": "message",
                  "text": `${text}\n理想：25％`,
                  "area": {"x": 692, "y": 400, "width": 346, "height": 400}
              },
              {
                  "type": "message",
                  "text": `${text}\n理想：30％`,
                  "area": {"x": 0, "y": 800, "width": 346, "height": 400}
              },
              {
                  "type": "message",
                  "text": `${text}\n理想：35％`,
                  "area": {"x": 346, "y": 800, "width": 346, "height": 400}
              },
              {
                  "type": "message",
                  "text": `${text}\n理想：40％`,
                  "area": {"x": 692, "y": 800, "width": 346, "height": 400}
              }
          ]
        }]);
      } else {
        return client.replyMessage(ev.replyToken,[{
          "type":"text",
          "text":`現状の体型を選択してください`
        },
        {
          "type": "imagemap",
          "baseUrl": "https://personal-trainer-demo.herokuapp.com/images/imagemap/chooseWomensBody",
          "altText": "現状選択ボタン",
          "baseSize": {"width": 1040, "height": 1202},
          "actions": [
              {
                  "type": "message",
                  "text": `${text}\n現状：3-4％`,
                  "area": {"x": 0, "y": 0, "width": 346, "height": 400}
              },
              {
                  "type": "message",
                  "text": `${text}\n現状：6-7％`,
                  "area": {"x": 346, "y": 0, "width": 346, "height": 400}
              },
              {
                  "type": "message",
                  "text": `${text}\n現状：10-12％`,
                  "area": {"x": 692, "y": 0, "width": 346, "height": 400}
              },
              {
                  "type": "message",
                  "text": `${text}\n現状：15％`,
                  "area": {"x": 0, "y": 400, "width": 346, "height": 400}
              },
              {
                  "type": "message",
                  "text": `${text}\n現状：20％`,
                  "area": {"x": 346, "y": 400, "width": 346, "height": 400}
              },
              {
                  "type": "message",
                  "text": `${text}\n現状：25％`,
                  "area": {"x": 692, "y": 400, "width": 346, "height": 400}
              },
              {
                  "type": "message",
                  "text": `${text}\n現状：30％`,
                  "area": {"x": 0, "y": 800, "width": 346, "height": 400}
              },
              {
                  "type": "message",
                  "text": `${text}\n現状：35％`,
                  "area": {"x": 346, "y": 800, "width": 346, "height": 400}
              },
              {
                  "type": "message",
                  "text": `${text}\n現状：40％`,
                  "area": {"x": 692, "y": 800, "width": 346, "height": 400}
              }
          ]
        }]);
      }
    } else if (text.indexOf('トレーニング解説') != -1) {
      if ('腕トレーニング解説' == text){
        return client.replyMessage(ev.replyToken,{
          "type":"flex",
          "altText":"flexMessageです",
          "contents":{
             "type":"carousel",
             "contents":[
                {
                   "type":"bubble",
                   "size":"micro",
                   "hero":{
                      "type":"image",
                      "url":"https://scdn.line-apps.com/n/channel_devcenter/img/flexsnapshot/clip/clip10.jpg",
                      "size":"full",
                      "aspectMode":"cover",
                      "aspectRatio":"320:213"
                   },
                   "body":{
                      "type":"box",
                      "layout":"vertical",
                      "contents":[
                         {
                            "type":"text",
                            "text":"アームカール",
                            "weight":"bold",
                            "size":"sm",
                            "wrap":true,
                            "color":"#ffffff",
                            "gravity":"center",
                            "align":"center"
                         }
                      ],
                      "spacing":"sm",
                      "paddingAll":"13px"
                   },
                   "footer":{
                      "type":"box",
                      "layout":"vertical",
                      "contents":[
                         {
                            "type":"button",
                            "action":{
                               "type":"uri",
                               "label":"解説動画",
                               "uri":"http://linecorp.com/"
                            },
                            "style":"secondary",
                            "color":"#71ff20"
                         }
                      ]
                   },
                   "styles":{
                      "header":{
                         "backgroundColor":"#1d1f22"
                      },
                      "hero":{
                         "backgroundColor":"#1d1f22"
                      },
                      "body":{
                         "backgroundColor":"#1d1f22"
                      },
                      "footer":{
                         "backgroundColor":"#1d1f22"
                      }
                   }
                },
                {
                   "type":"bubble",
                   "size":"micro",
                   "hero":{
                      "type":"image",
                      "url":"https://scdn.line-apps.com/n/channel_devcenter/img/flexsnapshot/clip/clip10.jpg",
                      "size":"full",
                      "aspectMode":"cover",
                      "aspectRatio":"320:213"
                   },
                   "body":{
                      "type":"box",
                      "layout":"vertical",
                      "contents":[
                         {
                            "type":"text",
                            "text":"バーベルカール",
                            "weight":"bold",
                            "size":"sm",
                            "wrap":true,
                            "color":"#ffffff",
                            "gravity":"center",
                            "align":"center"
                         }
                      ],
                      "spacing":"sm",
                      "paddingAll":"13px"
                   },
                   "footer":{
                      "type":"box",
                      "layout":"vertical",
                      "contents":[
                         {
                            "type":"button",
                            "action":{
                               "type":"uri",
                               "label":"解説動画",
                               "uri":"http://linecorp.com/"
                            },
                            "style":"secondary",
                            "color":"#71ff20"
                         }
                      ]
                   },
                   "styles":{
                      "header":{
                         "backgroundColor":"#1d1f22"
                      },
                      "hero":{
                         "backgroundColor":"#1d1f22"
                      },
                      "body":{
                         "backgroundColor":"#1d1f22"
                      },
                      "footer":{
                         "backgroundColor":"#1d1f22"
                      }
                   }
                },
                {
                   "type":"bubble",
                   "size":"micro",
                   "hero":{
                      "type":"image",
                      "url":"https://scdn.line-apps.com/n/channel_devcenter/img/flexsnapshot/clip/clip10.jpg",
                      "size":"full",
                      "aspectMode":"cover",
                      "aspectRatio":"320:213"
                   },
                   "body":{
                      "type":"box",
                      "layout":"vertical",
                      "contents":[
                         {
                            "type":"text",
                            "text":"ハンマーカール",
                            "weight":"bold",
                            "size":"sm",
                            "wrap":true,
                            "color":"#ffffff",
                            "gravity":"center",
                            "align":"center"
                         }
                      ],
                      "spacing":"sm",
                      "paddingAll":"13px"
                   },
                   "footer":{
                      "type":"box",
                      "layout":"vertical",
                      "contents":[
                         {
                            "type":"button",
                            "action":{
                               "type":"uri",
                               "label":"解説動画",
                               "uri":"http://linecorp.com/"
                            },
                            "style":"secondary",
                            "color":"#71ff20"
                         }
                      ]
                   },
                   "styles":{
                      "header":{
                         "backgroundColor":"#1d1f22"
                      },
                      "hero":{
                         "backgroundColor":"#1d1f22"
                      },
                      "body":{
                         "backgroundColor":"#1d1f22"
                      },
                      "footer":{
                         "backgroundColor":"#1d1f22"
                      }
                   }
                }
             ]
          }
       });
      } else if ('肩トレーニング解説' == text){
        return client.replyMessage(ev.replyToken,{
          "type":"flex",
          "altText":"flexMessageです",
          "contents":{
             "type":"carousel",
             "contents":[
                {
                   "type":"bubble",
                   "size":"micro",
                   "hero":{
                      "type":"image",
                      "url":"https://scdn.line-apps.com/n/channel_devcenter/img/flexsnapshot/clip/clip10.jpg",
                      "size":"full",
                      "aspectMode":"cover",
                      "aspectRatio":"320:213"
                   },
                   "body":{
                      "type":"box",
                      "layout":"vertical",
                      "contents":[
                         {
                            "type":"text",
                            "text":"ダンベルフライ",
                            "weight":"bold",
                            "size":"sm",
                            "wrap":true,
                            "color":"#ffffff",
                            "gravity":"center",
                            "align":"center"
                         }
                      ],
                      "spacing":"sm",
                      "paddingAll":"13px"
                   },
                   "footer":{
                      "type":"box",
                      "layout":"vertical",
                      "contents":[
                         {
                            "type":"button",
                            "action":{
                               "type":"uri",
                               "label":"解説動画",
                               "uri":"http://linecorp.com/"
                            },
                            "style":"secondary",
                            "color":"#71ff20"
                         }
                      ]
                   },
                   "styles":{
                      "header":{
                         "backgroundColor":"#1d1f22"
                      },
                      "hero":{
                         "backgroundColor":"#1d1f22"
                      },
                      "body":{
                         "backgroundColor":"#1d1f22"
                      },
                      "footer":{
                         "backgroundColor":"#1d1f22"
                      }
                   }
                },
                {
                   "type":"bubble",
                   "size":"micro",
                   "hero":{
                      "type":"image",
                      "url":"https://scdn.line-apps.com/n/channel_devcenter/img/flexsnapshot/clip/clip10.jpg",
                      "size":"full",
                      "aspectMode":"cover",
                      "aspectRatio":"320:213"
                   },
                   "body":{
                      "type":"box",
                      "layout":"vertical",
                      "contents":[
                         {
                            "type":"text",
                            "text":"ショルダー\nプレス",
                            "weight":"bold",
                            "size":"sm",
                            "wrap":true,
                            "color":"#ffffff",
                            "gravity":"center",
                            "align":"center"
                         }
                      ],
                      "spacing":"sm",
                      "paddingAll":"13px"
                   },
                   "footer":{
                      "type":"box",
                      "layout":"vertical",
                      "contents":[
                         {
                            "type":"button",
                            "action":{
                               "type":"uri",
                               "label":"解説動画",
                               "uri":"http://linecorp.com/"
                            },
                            "style":"secondary",
                            "color":"#71ff20"
                         }
                      ]
                   },
                   "styles":{
                      "header":{
                         "backgroundColor":"#1d1f22"
                      },
                      "hero":{
                         "backgroundColor":"#1d1f22"
                      },
                      "body":{
                         "backgroundColor":"#1d1f22"
                      },
                      "footer":{
                         "backgroundColor":"#1d1f22"
                      }
                   }
                },
                {
                   "type":"bubble",
                   "size":"micro",
                   "hero":{
                      "type":"image",
                      "url":"https://scdn.line-apps.com/n/channel_devcenter/img/flexsnapshot/clip/clip10.jpg",
                      "size":"full",
                      "aspectMode":"cover",
                      "aspectRatio":"320:213"
                   },
                   "body":{
                      "type":"box",
                      "layout":"vertical",
                      "contents":[
                         {
                            "type":"text",
                            "text":"アップライト\nロウ",
                            "weight":"bold",
                            "size":"sm",
                            "wrap":true,
                            "color":"#ffffff",
                            "gravity":"center",
                            "align":"center"
                         }
                      ],
                      "spacing":"sm",
                      "paddingAll":"13px"
                   },
                   "footer":{
                      "type":"box",
                      "layout":"vertical",
                      "contents":[
                         {
                            "type":"button",
                            "action":{
                               "type":"uri",
                               "label":"解説動画",
                               "uri":"http://linecorp.com/"
                            },
                            "style":"secondary",
                            "color":"#71ff20"
                         }
                      ]
                   },
                   "styles":{
                      "header":{
                         "backgroundColor":"#1d1f22"
                      },
                      "hero":{
                         "backgroundColor":"#1d1f22"
                      },
                      "body":{
                         "backgroundColor":"#1d1f22"
                      },
                      "footer":{
                         "backgroundColor":"#1d1f22"
                      }
                   }
                }
             ]
          }
       });
      } else if ('胸トレーニング解説' == text){
        return client.replyMessage(ev.replyToken,{
          "type":"flex",
          "altText":"flexMessageです",
          "contents":{
             "type":"carousel",
             "contents":[
                {
                   "type":"bubble",
                   "size":"micro",
                   "hero":{
                      "type":"image",
                      "url":"https://scdn.line-apps.com/n/channel_devcenter/img/flexsnapshot/clip/clip10.jpg",
                      "size":"full",
                      "aspectMode":"cover",
                      "aspectRatio":"320:213"
                   },
                   "body":{
                      "type":"box",
                      "layout":"vertical",
                      "contents":[
                         {
                            "type":"text",
                            "text":"ベンチプレス",
                            "weight":"bold",
                            "size":"sm",
                            "wrap":true,
                            "color":"#ffffff",
                            "gravity":"center",
                            "align":"center"
                         }
                      ],
                      "spacing":"sm",
                      "paddingAll":"13px"
                   },
                   "footer":{
                      "type":"box",
                      "layout":"vertical",
                      "contents":[
                         {
                            "type":"button",
                            "action":{
                               "type":"uri",
                               "label":"解説動画",
                               "uri":"http://linecorp.com/"
                            },
                            "style":"secondary",
                            "color":"#71ff20"
                         }
                      ]
                   },
                   "styles":{
                      "header":{
                         "backgroundColor":"#1d1f22"
                      },
                      "hero":{
                         "backgroundColor":"#1d1f22"
                      },
                      "body":{
                         "backgroundColor":"#1d1f22"
                      },
                      "footer":{
                         "backgroundColor":"#1d1f22"
                      }
                   }
                },
                {
                   "type":"bubble",
                   "size":"micro",
                   "hero":{
                      "type":"image",
                      "url":"https://scdn.line-apps.com/n/channel_devcenter/img/flexsnapshot/clip/clip10.jpg",
                      "size":"full",
                      "aspectMode":"cover",
                      "aspectRatio":"320:213"
                   },
                   "body":{
                      "type":"box",
                      "layout":"vertical",
                      "contents":[
                         {
                            "type":"text",
                            "text":"ダンベルフライ",
                            "weight":"bold",
                            "size":"sm",
                            "wrap":true,
                            "color":"#ffffff",
                            "gravity":"center",
                            "align":"center"
                         }
                      ],
                      "spacing":"sm",
                      "paddingAll":"13px"
                   },
                   "footer":{
                      "type":"box",
                      "layout":"vertical",
                      "contents":[
                         {
                            "type":"button",
                            "action":{
                               "type":"uri",
                               "label":"解説動画",
                               "uri":"http://linecorp.com/"
                            },
                            "style":"secondary",
                            "color":"#71ff20"
                         }
                      ]
                   },
                   "styles":{
                      "header":{
                         "backgroundColor":"#1d1f22"
                      },
                      "hero":{
                         "backgroundColor":"#1d1f22"
                      },
                      "body":{
                         "backgroundColor":"#1d1f22"
                      },
                      "footer":{
                         "backgroundColor":"#1d1f22"
                      }
                   }
                },
                {
                   "type":"bubble",
                   "size":"micro",
                   "hero":{
                      "type":"image",
                      "url":"https://scdn.line-apps.com/n/channel_devcenter/img/flexsnapshot/clip/clip10.jpg",
                      "size":"full",
                      "aspectMode":"cover",
                      "aspectRatio":"320:213"
                   },
                   "body":{
                      "type":"box",
                      "layout":"vertical",
                      "contents":[
                         {
                            "type":"text",
                            "text":"チェストプレス\nマシン",
                            "weight":"bold",
                            "size":"sm",
                            "wrap":true,
                            "color":"#ffffff",
                            "gravity":"center",
                            "align":"center"
                         }
                      ],
                      "spacing":"sm",
                      "paddingAll":"13px"
                   },
                   "footer":{
                      "type":"box",
                      "layout":"vertical",
                      "contents":[
                         {
                            "type":"button",
                            "action":{
                               "type":"uri",
                               "label":"解説動画",
                               "uri":"http://linecorp.com/"
                            },
                            "style":"secondary",
                            "color":"#71ff20"
                         }
                      ]
                   },
                   "styles":{
                      "header":{
                         "backgroundColor":"#1d1f22"
                      },
                      "hero":{
                         "backgroundColor":"#1d1f22"
                      },
                      "body":{
                         "backgroundColor":"#1d1f22"
                      },
                      "footer":{
                         "backgroundColor":"#1d1f22"
                      }
                   }
                }
             ]
          }
       });
      } else if ('腹筋トレーニング解説' == text){
        return client.replyMessage(ev.replyToken,{
          "type":"flex",
          "altText":"flexMessageです",
          "contents":{
             "type":"carousel",
             "contents":[
                {
                   "type":"bubble",
                   "size":"micro",
                   "hero":{
                      "type":"image",
                      "url":"https://scdn.line-apps.com/n/channel_devcenter/img/flexsnapshot/clip/clip10.jpg",
                      "size":"full",
                      "aspectMode":"cover",
                      "aspectRatio":"320:213"
                   },
                   "body":{
                      "type":"box",
                      "layout":"vertical",
                      "contents":[
                         {
                            "type":"text",
                            "text":"クランチ",
                            "weight":"bold",
                            "size":"sm",
                            "wrap":true,
                            "color":"#ffffff",
                            "gravity":"center",
                            "align":"center"
                         }
                      ],
                      "spacing":"sm",
                      "paddingAll":"13px"
                   },
                   "footer":{
                      "type":"box",
                      "layout":"vertical",
                      "contents":[
                         {
                            "type":"button",
                            "action":{
                               "type":"uri",
                               "label":"解説動画",
                               "uri":"http://linecorp.com/"
                            },
                            "style":"secondary",
                            "color":"#71ff20"
                         }
                      ]
                   },
                   "styles":{
                      "header":{
                         "backgroundColor":"#1d1f22"
                      },
                      "hero":{
                         "backgroundColor":"#1d1f22"
                      },
                      "body":{
                         "backgroundColor":"#1d1f22"
                      },
                      "footer":{
                         "backgroundColor":"#1d1f22"
                      }
                   }
                },
                {
                   "type":"bubble",
                   "size":"micro",
                   "hero":{
                      "type":"image",
                      "url":"https://scdn.line-apps.com/n/channel_devcenter/img/flexsnapshot/clip/clip10.jpg",
                      "size":"full",
                      "aspectMode":"cover",
                      "aspectRatio":"320:213"
                   },
                   "body":{
                      "type":"box",
                      "layout":"vertical",
                      "contents":[
                         {
                            "type":"text",
                            "text":"ドラゴン\nフラッグ",
                            "weight":"bold",
                            "size":"sm",
                            "wrap":true,
                            "color":"#ffffff",
                            "gravity":"center",
                            "align":"center"
                         }
                      ],
                      "spacing":"sm",
                      "paddingAll":"13px"
                   },
                   "footer":{
                      "type":"box",
                      "layout":"vertical",
                      "contents":[
                         {
                            "type":"button",
                            "action":{
                               "type":"uri",
                               "label":"解説動画",
                               "uri":"http://linecorp.com/"
                            },
                            "style":"secondary",
                            "color":"#71ff20"
                         }
                      ]
                   },
                   "styles":{
                      "header":{
                         "backgroundColor":"#1d1f22"
                      },
                      "hero":{
                         "backgroundColor":"#1d1f22"
                      },
                      "body":{
                         "backgroundColor":"#1d1f22"
                      },
                      "footer":{
                         "backgroundColor":"#1d1f22"
                      }
                   }
                },
                {
                   "type":"bubble",
                   "size":"micro",
                   "hero":{
                      "type":"image",
                      "url":"https://scdn.line-apps.com/n/channel_devcenter/img/flexsnapshot/clip/clip10.jpg",
                      "size":"full",
                      "aspectMode":"cover",
                      "aspectRatio":"320:213"
                   },
                   "body":{
                      "type":"box",
                      "layout":"vertical",
                      "contents":[
                         {
                            "type":"text",
                            "text":"アブローラー",
                            "weight":"bold",
                            "size":"sm",
                            "wrap":true,
                            "color":"#ffffff",
                            "gravity":"center",
                            "align":"center"
                         }
                      ],
                      "spacing":"sm",
                      "paddingAll":"13px"
                   },
                   "footer":{
                      "type":"box",
                      "layout":"vertical",
                      "contents":[
                         {
                            "type":"button",
                            "action":{
                               "type":"uri",
                               "label":"解説動画",
                               "uri":"http://linecorp.com/"
                            },
                            "style":"secondary",
                            "color":"#71ff20"
                         }
                      ]
                   },
                   "styles":{
                      "header":{
                         "backgroundColor":"#1d1f22"
                      },
                      "hero":{
                         "backgroundColor":"#1d1f22"
                      },
                      "body":{
                         "backgroundColor":"#1d1f22"
                      },
                      "footer":{
                         "backgroundColor":"#1d1f22"
                      }
                   }
                }
             ]
          }
       });
      } else if ('脚トレーニング解説' == text){
        return client.replyMessage(ev.replyToken,{
          "type":"flex",
          "altText":"flexMessageです",
          "contents":{
             "type":"carousel",
             "contents":[
                {
                   "type":"bubble",
                   "size":"micro",
                   "hero":{
                      "type":"image",
                      "url":"https://scdn.line-apps.com/n/channel_devcenter/img/flexsnapshot/clip/clip10.jpg",
                      "size":"full",
                      "aspectMode":"cover",
                      "aspectRatio":"320:213"
                   },
                   "body":{
                      "type":"box",
                      "layout":"vertical",
                      "contents":[
                         {
                            "type":"text",
                            "text":"レッグ\nエクステンション",
                            "weight":"bold",
                            "size":"sm",
                            "wrap":true,
                            "color":"#ffffff",
                            "gravity":"center",
                            "align":"center"
                         }
                      ],
                      "spacing":"sm",
                      "paddingAll":"13px"
                   },
                   "footer":{
                      "type":"box",
                      "layout":"vertical",
                      "contents":[
                         {
                            "type":"button",
                            "action":{
                               "type":"uri",
                               "label":"解説動画",
                               "uri":"http://linecorp.com/"
                            },
                            "style":"secondary",
                            "color":"#71ff20"
                         }
                      ]
                   },
                   "styles":{
                      "header":{
                         "backgroundColor":"#1d1f22"
                      },
                      "hero":{
                         "backgroundColor":"#1d1f22"
                      },
                      "body":{
                         "backgroundColor":"#1d1f22"
                      },
                      "footer":{
                         "backgroundColor":"#1d1f22"
                      }
                   }
                },
                {
                   "type":"bubble",
                   "size":"micro",
                   "hero":{
                      "type":"image",
                      "url":"https://scdn.line-apps.com/n/channel_devcenter/img/flexsnapshot/clip/clip10.jpg",
                      "size":"full",
                      "aspectMode":"cover",
                      "aspectRatio":"320:213"
                   },
                   "body":{
                      "type":"box",
                      "layout":"vertical",
                      "contents":[
                         {
                            "type":"text",
                            "text":"レッグカール",
                            "weight":"bold",
                            "size":"sm",
                            "wrap":true,
                            "color":"#ffffff",
                            "gravity":"center",
                            "align":"center"
                         }
                      ],
                      "spacing":"sm",
                      "paddingAll":"13px"
                   },
                   "footer":{
                      "type":"box",
                      "layout":"vertical",
                      "contents":[
                         {
                            "type":"button",
                            "action":{
                               "type":"uri",
                               "label":"解説動画",
                               "uri":"http://linecorp.com/"
                            },
                            "style":"secondary",
                            "color":"#71ff20"
                         }
                      ]
                   },
                   "styles":{
                      "header":{
                         "backgroundColor":"#1d1f22"
                      },
                      "hero":{
                         "backgroundColor":"#1d1f22"
                      },
                      "body":{
                         "backgroundColor":"#1d1f22"
                      },
                      "footer":{
                         "backgroundColor":"#1d1f22"
                      }
                   }
                },
                {
                   "type":"bubble",
                   "size":"micro",
                   "hero":{
                      "type":"image",
                      "url":"https://scdn.line-apps.com/n/channel_devcenter/img/flexsnapshot/clip/clip10.jpg",
                      "size":"full",
                      "aspectMode":"cover",
                      "aspectRatio":"320:213"
                   },
                   "body":{
                      "type":"box",
                      "layout":"vertical",
                      "contents":[
                         {
                            "type":"text",
                            "text":"レッグプレス",
                            "weight":"bold",
                            "size":"sm",
                            "wrap":true,
                            "color":"#ffffff",
                            "gravity":"center",
                            "align":"center"
                         }
                      ],
                      "spacing":"sm",
                      "paddingAll":"13px"
                   },
                   "footer":{
                      "type":"box",
                      "layout":"vertical",
                      "contents":[
                         {
                            "type":"button",
                            "action":{
                               "type":"uri",
                               "label":"解説動画",
                               "uri":"http://linecorp.com/"
                            },
                            "style":"secondary",
                            "color":"#71ff20"
                         }
                      ]
                   },
                   "styles":{
                      "header":{
                         "backgroundColor":"#1d1f22"
                      },
                      "hero":{
                         "backgroundColor":"#1d1f22"
                      },
                      "body":{
                         "backgroundColor":"#1d1f22"
                      },
                      "footer":{
                         "backgroundColor":"#1d1f22"
                      }
                   }
                }
             ]
          }
       });
      } else if ('背中トレーニング解説' == text){
        return client.replyMessage(ev.replyToken,{
          "type":"flex",
          "altText":"flexMessageです",
          "contents":{
             "type":"carousel",
             "contents":[
                {
                   "type":"bubble",
                   "size":"micro",
                   "hero":{
                      "type":"image",
                      "url":"https://scdn.line-apps.com/n/channel_devcenter/img/flexsnapshot/clip/clip10.jpg",
                      "size":"full",
                      "aspectMode":"cover",
                      "aspectRatio":"320:213"
                   },
                   "body":{
                      "type":"box",
                      "layout":"vertical",
                      "contents":[
                         {
                            "type":"text",
                            "text":"チンニング",
                            "weight":"bold",
                            "size":"sm",
                            "wrap":true,
                            "color":"#ffffff",
                            "gravity":"center",
                            "align":"center"
                         }
                      ],
                      "spacing":"sm",
                      "paddingAll":"13px"
                   },
                   "footer":{
                      "type":"box",
                      "layout":"vertical",
                      "contents":[
                         {
                            "type":"button",
                            "action":{
                               "type":"uri",
                               "label":"解説動画",
                               "uri":"http://linecorp.com/"
                            },
                            "style":"secondary",
                            "color":"#71ff20"
                         }
                      ]
                   },
                   "styles":{
                      "header":{
                         "backgroundColor":"#1d1f22"
                      },
                      "hero":{
                         "backgroundColor":"#1d1f22"
                      },
                      "body":{
                         "backgroundColor":"#1d1f22"
                      },
                      "footer":{
                         "backgroundColor":"#1d1f22"
                      }
                   }
                },
                {
                   "type":"bubble",
                   "size":"micro",
                   "hero":{
                      "type":"image",
                      "url":"https://scdn.line-apps.com/n/channel_devcenter/img/flexsnapshot/clip/clip10.jpg",
                      "size":"full",
                      "aspectMode":"cover",
                      "aspectRatio":"320:213"
                   },
                   "body":{
                      "type":"box",
                      "layout":"vertical",
                      "contents":[
                         {
                            "type":"text",
                            "text":"ローロウ",
                            "weight":"bold",
                            "size":"sm",
                            "wrap":true,
                            "color":"#ffffff",
                            "gravity":"center",
                            "align":"center"
                         }
                      ],
                      "spacing":"sm",
                      "paddingAll":"13px"
                   },
                   "footer":{
                      "type":"box",
                      "layout":"vertical",
                      "contents":[
                         {
                            "type":"button",
                            "action":{
                               "type":"uri",
                               "label":"解説動画",
                               "uri":"http://linecorp.com/"
                            },
                            "style":"secondary",
                            "color":"#71ff20"
                         }
                      ]
                   },
                   "styles":{
                      "header":{
                         "backgroundColor":"#1d1f22"
                      },
                      "hero":{
                         "backgroundColor":"#1d1f22"
                      },
                      "body":{
                         "backgroundColor":"#1d1f22"
                      },
                      "footer":{
                         "backgroundColor":"#1d1f22"
                      }
                   }
                },
                {
                   "type":"bubble",
                   "size":"micro",
                   "hero":{
                      "type":"image",
                      "url":"https://scdn.line-apps.com/n/channel_devcenter/img/flexsnapshot/clip/clip10.jpg",
                      "size":"full",
                      "aspectMode":"cover",
                      "aspectRatio":"320:213"
                   },
                   "body":{
                      "type":"box",
                      "layout":"vertical",
                      "contents":[
                         {
                            "type":"text",
                            "text":"デッドリフト",
                            "weight":"bold",
                            "size":"sm",
                            "wrap":true,
                            "color":"#ffffff",
                            "gravity":"center",
                            "align":"center"
                         }
                      ],
                      "spacing":"sm",
                      "paddingAll":"13px"
                   },
                   "footer":{
                      "type":"box",
                      "layout":"vertical",
                      "contents":[
                         {
                            "type":"button",
                            "action":{
                               "type":"uri",
                               "label":"解説動画",
                               "uri":"http://linecorp.com/"
                            },
                            "style":"secondary",
                            "color":"#71ff20"
                         }
                      ]
                   },
                   "styles":{
                      "header":{
                         "backgroundColor":"#1d1f22"
                      },
                      "hero":{
                         "backgroundColor":"#1d1f22"
                      },
                      "body":{
                         "backgroundColor":"#1d1f22"
                      },
                      "footer":{
                         "backgroundColor":"#1d1f22"
                      }
                   }
                }
             ]
          }
       });
      } else if ('尻トレーニング解説' == text){
        return client.replyMessage(ev.replyToken,{
          "type":"flex",
          "altText":"flexMessageです",
          "contents":{
             "type":"carousel",
             "contents":[
                {
                   "type":"bubble",
                   "size":"micro",
                   "hero":{
                      "type":"image",
                      "url":"https://scdn.line-apps.com/n/channel_devcenter/img/flexsnapshot/clip/clip10.jpg",
                      "size":"full",
                      "aspectMode":"cover",
                      "aspectRatio":"320:213"
                   },
                   "body":{
                      "type":"box",
                      "layout":"vertical",
                      "contents":[
                         {
                            "type":"text",
                            "text":"ヒップ\nアブダクター",
                            "weight":"bold",
                            "size":"sm",
                            "wrap":true,
                            "color":"#ffffff",
                            "gravity":"center",
                            "align":"center"
                         }
                      ],
                      "spacing":"sm",
                      "paddingAll":"13px"
                   },
                   "footer":{
                      "type":"box",
                      "layout":"vertical",
                      "contents":[
                         {
                            "type":"button",
                            "action":{
                               "type":"uri",
                               "label":"解説動画",
                               "uri":"http://linecorp.com/"
                            },
                            "style":"secondary",
                            "color":"#71ff20"
                         }
                      ]
                   },
                   "styles":{
                      "header":{
                         "backgroundColor":"#1d1f22"
                      },
                      "hero":{
                         "backgroundColor":"#1d1f22"
                      },
                      "body":{
                         "backgroundColor":"#1d1f22"
                      },
                      "footer":{
                         "backgroundColor":"#1d1f22"
                      }
                   }
                },
                {
                   "type":"bubble",
                   "size":"micro",
                   "hero":{
                      "type":"image",
                      "url":"https://scdn.line-apps.com/n/channel_devcenter/img/flexsnapshot/clip/clip10.jpg",
                      "size":"full",
                      "aspectMode":"cover",
                      "aspectRatio":"320:213"
                   },
                   "body":{
                      "type":"box",
                      "layout":"vertical",
                      "contents":[
                         {
                            "type":"text",
                            "text":"ヒップ\nスラスト",
                            "weight":"bold",
                            "size":"sm",
                            "wrap":true,
                            "color":"#ffffff",
                            "gravity":"center",
                            "align":"center"
                         }
                      ],
                      "spacing":"sm",
                      "paddingAll":"13px"
                   },
                   "footer":{
                      "type":"box",
                      "layout":"vertical",
                      "contents":[
                         {
                            "type":"button",
                            "action":{
                               "type":"uri",
                               "label":"解説動画",
                               "uri":"http://linecorp.com/"
                            },
                            "style":"secondary",
                            "color":"#71ff20"
                         }
                      ]
                   },
                   "styles":{
                      "header":{
                         "backgroundColor":"#1d1f22"
                      },
                      "hero":{
                         "backgroundColor":"#1d1f22"
                      },
                      "body":{
                         "backgroundColor":"#1d1f22"
                      },
                      "footer":{
                         "backgroundColor":"#1d1f22"
                      }
                   }
                },
                {
                   "type":"bubble",
                   "size":"micro",
                   "hero":{
                      "type":"image",
                      "url":"https://scdn.line-apps.com/n/channel_devcenter/img/flexsnapshot/clip/clip10.jpg",
                      "size":"full",
                      "aspectMode":"cover",
                      "aspectRatio":"320:213"
                   },
                   "body":{
                      "type":"box",
                      "layout":"vertical",
                      "contents":[
                         {
                            "type":"text",
                            "text":"ハーフ\nデッドリフト",
                            "weight":"bold",
                            "size":"sm",
                            "wrap":true,
                            "color":"#ffffff",
                            "gravity":"center",
                            "align":"center"
                         }
                      ],
                      "spacing":"sm",
                      "paddingAll":"13px"
                   },
                   "footer":{
                      "type":"box",
                      "layout":"vertical",
                      "contents":[
                         {
                            "type":"button",
                            "action":{
                               "type":"uri",
                               "label":"解説動画",
                               "uri":"http://linecorp.com/"
                            },
                            "style":"secondary",
                            "color":"#71ff20"
                         }
                      ]
                   },
                   "styles":{
                      "header":{
                         "backgroundColor":"#1d1f22"
                      },
                      "hero":{
                         "backgroundColor":"#1d1f22"
                      },
                      "body":{
                         "backgroundColor":"#1d1f22"
                      },
                      "footer":{
                         "backgroundColor":"#1d1f22"
                      }
                   }
                }
             ]
          }
       });
      } else {
        return client.replyMessage(ev.replyToken,{
          "type":"imagemap",
          "baseUrl":"https://personal-trainer-demo.herokuapp.com/images/imagemap/chooseBodyParts",
          "altText":"鍛えたい箇所をタップ!!",
          "baseSize":{
             "width":1040,
             "height":870
          },
          "actions":[
             {
                "type":"message",
                "label":"腕トレーニング解説",
                "text":"腕トレーニング解説",
                "area":{
                   "x":13,
                   "y":301,
                   "width":76,
                   "height":73
                }
             },
             {
                "type":"message",
                "label":"肩トレーニング解説",
                "text":"肩トレーニング解説",
                "area":{
                   "x":325,
                   "y":257,
                   "width":77,
                   "height":70
                }
             },
             {
                "type":"message",
                "label":"胸トレーニング解説",
                "text":"胸トレーニング解説",
                "area":{
                   "x":166,
                   "y":354,
                   "width":168,
                   "height":74
                }
             },
             {
                "type":"message",
                "label":"腹筋トレーニング解説",
                "text":"腹筋トレーニング解説",
                "area":{
                   "x":169,
                   "y":477,
                   "width":162,
                   "height":65
                }
             },
             {
                "type":"message",
                "label":"脚トレーニング解説",
                "text":"脚トレーニング解説",
                "area":{
                   "x":243,
                   "y":688,
                   "width":181,
                   "height":78
                }
             },
             {
                "type":"message",
                "label":"背中トレーニング解説",
                "text":"背中トレーニング解説",
                "area":{
                   "x":691,
                   "y":358,
                   "width":174,
                   "height":70
                }
             },
             {
                "type":"message",
                "label":"尻トレーニング解説",
                "text":"尻トレーニング解説",
                "area":{
                   "x":711,
                   "y":586,
                   "width":179,
                   "height":75
                }
             }
          ]
       });
      }
    }
}

module.exports = router;