$(function(){
    var captcha = new $.Captcha({ //initialize captcha
        selector: "#captcha",
        text: null,
        randomText: true,
        randomColours: true,
        width: 244,
        height: 163,
        colour1: null,
        colour2: null,
        font: 'normal 40px "Comic Sans MS", cursive, sans-serif',
        onFailure: function() {
            alert("Failure!");
        },
        onSuccess: function() {
            alert("验证码输入成功！");
        }
    });
    captcha.generate(); //Generate or refresh captcha
    captcha.validate(); //validate filled captcha
})
