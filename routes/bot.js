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
        "baseUrl": "https://personal-trainer-demo.herokuapp.com/bot/imagemap/chooseSex",
        "altText": "性別選択ボタン",
        "baseSize": {
            "width": 1040,
            "height": 1202
        },
        "actions": [
            {
                "type": "message",
                "text": "性別：男性",
                "area": {
                    "x": 0,
                    "y": 0,
                    "width": 520,
                    "height": 1040
                }
            },
            {
                "type": "message",
                "text": "性別：女性",
                "area": {
                    "x": 520,
                    "y": 0,
                    "width": 520,
                    "height": 1040
                }
            }
        ]
      }]);
    } else if ('トレーニング解説' == text) {
      return client.replyMessage(ev.replyToken,{
        "type":"text",
        "text":`トレーニング解説機能を実装予定`
      });
    } else if (text.indexOf('性別：男性') > 0) {
      if ((text.indexOf('：') == 3) && (text.indexOf('性別') == 1) && (text.indexOf('理想') == 1) && (text.indexOf('現実') == 1)) {
        return client.replyMessage(ev.replyToken,{});    //　計算処理を記載
      } else if ((text.indexOf('：') == 2) && (text.indexOf('性別') == 1) && (text.indexOf('現実') == 1)) {
        return client.replyMessage(ev.replyToken,[{
          "type":"text",
          "text":`理想の体型を選択してください`
        },
        {
          "type": "imagemap",
          "baseUrl": "https://personal-trainer-demo.herokuapp.com/bot/imagemap/chooseMensBody",
          "altText": "理想選択ボタン",
          "baseSize": {
              "width": 1040,
              "height": 1202
          },
          "actions": [
              {
                  "type": "message",
                  "text": "${text}\n理想：3-4％",
                  "area": {
                      "x": 0,
                      "y": 0,
                      "width": 346,
                      "height": 400
                  }
              },
              {
                  "type": "message",
                  "text": "${text}\n理想：6-7％",
                  "area": {
                      "x": 346,
                      "y": 0,
                      "width": 346,
                      "height": 400
                  }
              },
              {
                  "type": "message",
                  "text": "${text}\n理想：10-12％",
                  "area": {
                      "x": 692,
                      "y": 0,
                      "width": 346,
                      "height": 400
                  }
              },
              {
                  "type": "message",
                  "text": "${text}\n理想：15％",
                  "area": {
                      "x": 0,
                      "y": 400,
                      "width": 346,
                      "height": 400
                  }
              },
              {
                  "type": "message",
                  "text": "${text}\n理想：20％",
                  "area": {
                      "x": 346,
                      "y": 400,
                      "width": 346,
                      "height": 400
                  }
              },
              {
                  "type": "message",
                  "text": "${text}\n理想：25％",
                  "area": {
                      "x": 692,
                      "y": 400,
                      "width": 346,
                      "height": 400
                  }
              },
              {
                  "type": "message",
                  "text": "${text}\n理想：30％",
                  "area": {
                      "x": 0,
                      "y": 800,
                      "width": 346,
                      "height": 400
                  }
              },
              {
                  "type": "message",
                  "text": "${text}\n理想：35％",
                  "area": {
                      "x": 346,
                      "y": 800,
                      "width": 346,
                      "height": 400
                  }
              },
              {
                  "type": "message",
                  "text": "${text}\n理想：40％",
                  "area": {
                      "x": 692,
                      "y": 800,
                      "width": 346,
                      "height": 400
                  }
              }
          ]
        }]);
      } else if ((text.indexOf('：') == 1) && (text.indexOf('性別') == 1)) {
        return client.replyMessage(ev.replyToken,[{
          "type":"text",
          "text":`現状の体型を選択してください`
        },
        {
          "type": "imagemap",
          "baseUrl": "https://personal-trainer-demo.herokuapp.com/bot/imagemap/chooseMensBody",
          "altText": "現状選択ボタン",
          "baseSize": {
              "width": 1040,
              "height": 1202
          },
          "actions": [
              {
                  "type": "message",
                  "text": "${text}\n現状：3-4％",
                  "area": {
                      "x": 0,
                      "y": 0,
                      "width": 346,
                      "height": 400
                  }
              },
              {
                  "type": "message",
                  "text": "${text}\n現状：6-7％",
                  "area": {
                      "x": 346,
                      "y": 0,
                      "width": 346,
                      "height": 400
                  }
              },
              {
                  "type": "message",
                  "text": "${text}\n現状：10-12％",
                  "area": {
                      "x": 692,
                      "y": 0,
                      "width": 346,
                      "height": 400
                  }
              },
              {
                  "type": "message",
                  "text": "${text}\n現状：15％",
                  "area": {
                      "x": 0,
                      "y": 400,
                      "width": 346,
                      "height": 400
                  }
              },
              {
                  "type": "message",
                  "text": "${text}\n現状：20％",
                  "area": {
                      "x": 346,
                      "y": 400,
                      "width": 346,
                      "height": 400
                  }
              },
              {
                  "type": "message",
                  "text": "${text}\n現状：25％",
                  "area": {
                      "x": 692,
                      "y": 400,
                      "width": 346,
                      "height": 400
                  }
              },
              {
                  "type": "message",
                  "text": "${text}\n現状：30％",
                  "area": {
                      "x": 0,
                      "y": 800,
                      "width": 346,
                      "height": 400
                  }
              },
              {
                  "type": "message",
                  "text": "${text}\n現状：35％",
                  "area": {
                      "x": 346,
                      "y": 800,
                      "width": 346,
                      "height": 400
                  }
              },
              {
                  "type": "message",
                  "text": "${text}\n現状：40％",
                  "area": {
                      "x": 692,
                      "y": 800,
                      "width": 346,
                      "height": 400
                  }
              }
          ]
        }]);
      }
    } else if (text.indexOf('性別：女性') > 0) {
      if ((text.indexOf('：') == 3) && (text.indexOf('性別') == 1) && (text.indexOf('理想') == 1) && (text.indexOf('現実') == 1)) {
        return client.replyMessage(ev.replyToken,{});    //　計算処理を記載
      } else if ((text.indexOf('：') == 2) && (text.indexOf('性別') == 1) && (text.indexOf('現実') == 1)) {
        return client.replyMessage(ev.replyToken,[{
          "type":"text",
          "text":`理想の体型を選択してください`
        },
        {
          "type": "imagemap",
          "baseUrl": "https://personal-trainer-demo.herokuapp.com/bot/imagemap/chooseWomensBody",
          "altText": "理想選択ボタン",
          "baseSize": {
              "width": 1040,
              "height": 1202
          },
          "actions": [
              {
                  "type": "message",
                  "text": "${text}\n理想：3-4％",
                  "area": {
                      "x": 0,
                      "y": 0,
                      "width": 346,
                      "height": 400
                  }
              },
              {
                  "type": "message",
                  "text": "${text}\n理想：6-7％",
                  "area": {
                      "x": 346,
                      "y": 0,
                      "width": 346,
                      "height": 400
                  }
              },
              {
                  "type": "message",
                  "text": "${text}\n理想：10-12％",
                  "area": {
                      "x": 692,
                      "y": 0,
                      "width": 346,
                      "height": 400
                  }
              },
              {
                  "type": "message",
                  "text": "${text}\n理想：15％",
                  "area": {
                      "x": 0,
                      "y": 400,
                      "width": 346,
                      "height": 400
                  }
              },
              {
                  "type": "message",
                  "text": "${text}\n理想：20％",
                  "area": {
                      "x": 346,
                      "y": 400,
                      "width": 346,
                      "height": 400
                  }
              },
              {
                  "type": "message",
                  "text": "${text}\n理想：25％",
                  "area": {
                      "x": 692,
                      "y": 400,
                      "width": 346,
                      "height": 400
                  }
              },
              {
                  "type": "message",
                  "text": "${text}\n理想：30％",
                  "area": {
                      "x": 0,
                      "y": 800,
                      "width": 346,
                      "height": 400
                  }
              },
              {
                  "type": "message",
                  "text": "${text}\n理想：35％",
                  "area": {
                      "x": 346,
                      "y": 800,
                      "width": 346,
                      "height": 400
                  }
              },
              {
                  "type": "message",
                  "text": "${text}\n理想：40％",
                  "area": {
                      "x": 692,
                      "y": 800,
                      "width": 346,
                      "height": 400
                  }
              }
          ]
        }]);
      } else if ((text.indexOf('：') == 1) && (text.indexOf('性別') == 1)) {
        return client.replyMessage(ev.replyToken,[{
          "type":"text",
          "text":`現状の体型を選択してください`
        },
        {
          "type": "imagemap",
          "baseUrl": "https://personal-trainer-demo.herokuapp.com/bot/imagemap/chooseWomensBody",
          "altText": "現状選択ボタン",
          "baseSize": {
              "width": 1040,
              "height": 1202
          },
          "actions": [
              {
                  "type": "message",
                  "text": "${text}\n現状：3-4％",
                  "area": {
                      "x": 0,
                      "y": 0,
                      "width": 346,
                      "height": 400
                  }
              },
              {
                  "type": "message",
                  "text": "${text}\n現状：6-7％",
                  "area": {
                      "x": 346,
                      "y": 0,
                      "width": 346,
                      "height": 400
                  }
              },
              {
                  "type": "message",
                  "text": "${text}\n現状：10-12％",
                  "area": {
                      "x": 692,
                      "y": 0,
                      "width": 346,
                      "height": 400
                  }
              },
              {
                  "type": "message",
                  "text": "${text}\n現状：15％",
                  "area": {
                      "x": 0,
                      "y": 400,
                      "width": 346,
                      "height": 400
                  }
              },
              {
                  "type": "message",
                  "text": "${text}\n現状：20％",
                  "area": {
                      "x": 346,
                      "y": 400,
                      "width": 346,
                      "height": 400
                  }
              },
              {
                  "type": "message",
                  "text": "${text}\n現状：25％",
                  "area": {
                      "x": 692,
                      "y": 400,
                      "width": 346,
                      "height": 400
                  }
              },
              {
                  "type": "message",
                  "text": "${text}\n現状：30％",
                  "area": {
                      "x": 0,
                      "y": 800,
                      "width": 346,
                      "height": 400
                  }
              },
              {
                  "type": "message",
                  "text": "${text}\n現状：35％",
                  "area": {
                      "x": 346,
                      "y": 800,
                      "width": 346,
                      "height": 400
                  }
              },
              {
                  "type": "message",
                  "text": "${text}\n現状：40％",
                  "area": {
                      "x": 692,
                      "y": 800,
                      "width": 346,
                      "height": 400
                  }
              }
          ]
        }]);
      }
    }
}

// imagemapメッセージ用画像レスポンス
router.get('/imagemap/chooseSex/700', function (req, res, next) {
  console.log("通りました");
  let filepath = path.join(__dirname, '../public/images/imagemap/chooseSex/700.jpg');
  res.sendFile(filepath);
  console.log("とりあえず返したで");
});
router.get('/imagemap/chooseMensBody/:filename', function (req, res) {
  console.log(req.params.filename);
  res.sendFile(path.resolve('../public/images/imagemap/chooseMensBody/'+req.params.filename+'.jpg'));
});
router.get('/imagemap/chooseWomensBody/:filename', function (req, res) {
  console.log(req.params.filename);
  res.sendFile(path.resolve('../public/images/imagemap/chooseWomensBody/'+req.params.filename+'.jpg'));
});

module.exports = router;