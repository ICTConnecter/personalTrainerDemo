window.addEventListener('load', () => {
    console.log('画面読み込み！');
});

const test = document.getElementById('check');

test.addEventListener('click', function(){  

// ◆入力値の取得
    // なまえ
    var familyNameElement = document.getElementById('familyName');
    var familyName = familyNameElement.value;
    var nameElement = document.getElementById('name');
    var name = nameElement.value;   
    // 電話番号
    var phoneNumberElement = document.getElementById('phoneNumber');
    var phoneNumber = phoneNumberElement.value;
    // 車の情報：今後項目を増やす予定
    var carTypeElement = document.getElementById('carType');
    var carType = carTypeElement.value;
    var effectivedateElement = document.getElementById('effectivedate');
    var effectivedate = effectivedateElement.value;
    var car = {
        "carType": carType,
        "effectivedate": effectivedate
    };
    // ショップ情報：現状テキストボックスによる入力となっているが、今後裏で持つ値に変更予定
    var shopIDElement = document.getElementById('shopId');
    var shopID = shopIDElement.value;
    // すべてをデータに格納
    var data = {
        "name":{
            "familyName": familyName,
            "name": name,
        },
        "phoneNumber": phoneNumber,
        "car": car,
        "shopID":shopID
    };
    // テキストベースのJSON
    var dataJSON = JSON.stringify(data);
    console.log(dataJSON);

// ◆情報の送信
    fetch('liff/a2',{
        method:'POST',
        body:dataJSON
    })
    .then(response=>{
        console.log('response:',response);
    })
    .catch(e=>{
        throw e;
    });
    console.log('クリックされました！');  
}, false);

