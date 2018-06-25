$(function () {

//forgetPwd4.html
    //表单验证
    $(".forget-pwd").validate({
        rules: {
            password: {
                required: true,
                rangelength: [6, 18]
            },
            "confirm_password":{
                required: true,
                equalTo: "#password"
            }
        },
        messages:{
            password: {
                required: "密码必须填写",
                rangelength: "密码长最短6位最大18位"
            },
            "confirm_password":{
                required: "确认密码必须填写",
                equalTo: "二次密码必须填写一致"
            }
        }
    });
    //提交按钮事件
    $("#submit").click(function () {
        if($(".forget-pwd").valid()==false){
            return false;
        }
        var password=$("#password").val();
       $.ajax({
          url:"setNewPassword",
          type:"put",
           dataType:"json",
           data:{
              password:password
           },
           success:function(data){
               $("#password").val("");
               $("#confirm_password").val("");
             if(data.code==0){
                 layer.msg("密码重置成功",{time:1000,icon: 1},function () {
                     window.location.href="/forgetPwd4.html";
                 });
             }
             else if(data.code==3){
                 layer.msg("密码重置失败",{time:1000,icon: 2},function () {
                 });
             }else if(data.code==2){
                 layer.msg(data.message,{time:2000,icon: 2},function () {
                     window.location.href="/forgetPwd2.html";
                 });
             }
             else if(data.code==4||data.code==1){
                 layer.msg(data.message,{time:2000,icon: 2},function () {
                     window.location.href="/update_password.html";
                 });
             }
               $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
           },
           error: function (XMLHttpRequest) {
               layer.msg("重置密码失败", {time: 1000, icon: 2}, function () {

               });
               $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
            console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);
        }
       });
        return false;
    });
})