$(function () {
//设置邮箱显示的格式
    (function () {
        var email = $("#email").val();
        $("#email").removeAttr("value");
        if (email != "") {
            var a = email.split('@');
            var b;
            if (a[0].length > 4) {
                b = a[0].replace(/^([\d\w]{3})([\d\w]+)([\d\w])$/g, "$1****$3");
            }
            $("#email").val(b + '@' + a[1]);
        }
    })()
    //设置定时器
    function set_interval(i){
        var time=setInterval(function () {
            if(i>=1) {
                $("#send_code").find("span").text(i);
                i--;
            }
            else {
                $("#send_code").removeAttr("disabled");
                $("#send_code").find("span").text("发送");
                window.clearInterval(time);
            }

        },1000);
    }
//发送邮箱验证码
    $("#send_code").click(function(){
        $("#send_code").attr("disabled","disabled");
        var i=10;
        $("#send_code").find("span").text(i);
        $.ajax({
           url:"email_code",
            type:"post",
            dataType:"json",
            success:function(data){
                set_interval(i);
               if(data.code=="0"){
                   layer.msg('发送成功',{time:1000,icon: 1},function () {

                   });
               }
               else if(data.code=="1")
               { layer.msg('发送失败',{time:1000,icon: 2},function () {

               });
               }else{
                   layer.msg(data.message,{time:1000,icon: 2},function () {
                       window.location.href="update_password.html";
                   });
               }

                $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
            },
            error:function (XMLHttpRequest) {
                set_interval(i);
                    layer.msg("发送失败", {time: 1000, icon: 2}, function () {

                    });
                    $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});

                console.log("发送邮箱验证码失败,错误类型："+XMLHttpRequest.status+",错误内容:"+XMLHttpRequest.statusText);
            }

        });
        return false;
    });

    $("#code").keyup(function () {
        var code=$("#code").val();
        if(isNaN(code)){
            $(".code-error").text("请输入数字");
            $(".code-error").css("display","block");
        }else
        if(code==""){
            $(".code-error").text("请输入验证码");
            $(".code-error").css("display","block");
        }else
        if(code.length!=6)
        {$(".code-error").text("请输入6位验证码");
            $(".code-error").css("display","block");
        }else
        $(".code-error").css("display","none");
    })
    //表单验证
    //按下提交按钮
    $("#submit").click(function(){
       var code=$("#code").val();
       if(code==""){
           $(".code-error").text("请输入验证码");
           $(".code-error").css("display","block");
           return false;
       }
       if(code.length!=6)
       {$(".code-error").text("请输入6位验证码");
           $(".code-error").css("display","block");
        return false;
       }
        $(".code-error").css("display","none");
       $.ajax({
           url:"validate_code",
           type:"post",
           dataType:"json",
           data:{
               code:code
           },
           success:function(data){
               if(data.code==0){
                   layer.msg("成功",{time:900,icon: 1},function () {
                       $("#code").val("");
                       window.location.href="forgetPwd3.html";
                   });
               }else if(data.code==2||data.code==3){
                   layer.msg(data.message,{time:1000,icon: 2},function () {
                       $("#code").val("");
                       $("#code").focus();
                   });
               }else{
                   layer.msg(data.message,{time:2000,icon: 2},function () {
                       window.location.href="update_password.html";
                   })
               }
               $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
           },
           error:function (XMLHttpRequest) {
               layer.msg("验证码错误", {time: 1000, icon: 2}, function () {

               });
               $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
               console.log("发送邮箱验证码失败,错误类型："+XMLHttpRequest.status+",错误内容:"+XMLHttpRequest.statusText);
           }
       });

        return false;
    });
})