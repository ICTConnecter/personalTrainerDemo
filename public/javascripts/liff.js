window.addEventListener('load', () => {
    console.log('画面読み込み！');
});

const test = document.getElementById('check');

test.addEventListener('click', function(){  

// ◆入力値の取得
    // お名前
    var nameElement = document.getElementById('familyName');
    var name = nameElement.value;  
    // お名前(よみがな)
    var yomiganaElement = document.getElementById('familyName');
    var yomigana = yomiganaElement.value; 
    // 電話番号
    var phoneNumberElement = document.getElementById('phoneNumber');
    var phoneNumber = phoneNumberElement.value;
    // ご希望
    var wishElement = document.getElementById('carType');
    var wish = wishElement.value;
    // すべてをデータに格納
    var data = {
        "name":name,
        "yomigana":yomigana,
        "phoneNumber": phoneNumber,
        "wish": wish
    };
    // テキストベースのJSON
    var dataJSON = JSON.stringify(data);
    console.log(dataJSON);

// ◆情報の送信
    fetch('liff/conf',{
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

