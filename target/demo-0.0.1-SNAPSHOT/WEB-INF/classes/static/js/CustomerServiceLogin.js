!(function(window, document) {
    function GVerify(options) { //创建一个图形验证码对象，接收options对象为参数
        this.options = { //默认options参数值
            id: "", //容器Id
            canvasId: "verifyCanvas", //canvas的ID
            width: "50", //默认canvas宽度
            height: "25", //默认canvas高度
            type: "letter", //图形验证码默认类型blend:数字字母混合类型、number:纯数字、letter:纯字母
            code: ""
        }

        if(Object.prototype.toString.call(options) == "[object Object]"){//判断传入参数类型
            for(var i in options) { //根据传入的参数，修改默认参数值
                this.options[i] = options[i];
            }
        }else{
            this.options.id = options;
        }

        this.options.numArr = "0,1,2,3,4,5,6,7,8,9".split(",");
        this.options.letterArr = getAllLetter();

        this._init();
        this.refresh();
    }

    GVerify.prototype = {
        /**版本号**/
        version: '1.0.0',

        /**初始化方法**/
        _init: function() {
            var con = document.getElementById(this.options.id);
            var canvas = document.createElement("canvas");
            this.options.width = con.offsetWidth > 0 ? con.offsetWidth : "50";
            this.options.height = con.offsetHeight > 0 ? con.offsetHeight : "25";
            canvas.id = this.options.canvasId;
            canvas.width = this.options.width;
            canvas.height = this.options.height;
            canvas.style.cursor = "pointer";
            canvas.innerHTML = "您的浏览器版本不支持canvas";
            con.appendChild(canvas);
            var parent = this;
            canvas.onclick = function(){
                parent.refresh();
            }
        },

        /**生成验证码**/
        refresh: function() {
            this.options.code = "";
            var canvas = document.getElementById(this.options.canvasId);
            if(canvas.getContext) {
                var ctx = canvas.getContext('2d');
            }else{
                return;
            }

            ctx.textBaseline = "middle";

            ctx.fillStyle = randomColor(180, 240);
            ctx.fillRect(0, 0, this.options.width, this.options.height);

            if(this.options.type == "blend") { //判断验证码类型
                var txtArr = this.options.numArr.concat(this.options.letterArr);
            } else if(this.options.type == "number") {
                var txtArr = this.options.numArr;
            } else {
                var txtArr = this.options.letterArr;
            }

            for(var i = 1; i <= 4; i++) {
                var txt = txtArr[randomNum(0, txtArr.length)];
                this.options.code += txt;
                ctx.font = randomNum(this.options.height/2, this.options.height) + 'px SimHei'; //随机生成字体大小
                ctx.fillStyle = randomColor(50, 160); //随机生成字体颜色
                ctx.shadowOffsetX = randomNum(-3, 3);
                ctx.shadowOffsetY = randomNum(-3, 3);
                ctx.shadowBlur = randomNum(-3, 3);
                ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
                var x = this.options.width / 5 * i;
                var y = this.options.height / 2;
                var deg = randomNum(-30, 30);
                /**设置旋转角度和坐标原点**/
                ctx.translate(x, y);
                ctx.rotate(deg * Math.PI / 180);
                ctx.fillText(txt, 0, 0);
                /**恢复旋转角度和坐标原点**/
                ctx.rotate(-deg * Math.PI / 180);
                ctx.translate(-x, -y);
            }
            /**绘制干扰线**/
            for(var i = 0; i < 4; i++) {
                ctx.strokeStyle = randomColor(40, 180);
                ctx.beginPath();
                ctx.moveTo(randomNum(0, this.options.width), randomNum(0, this.options.height));
                ctx.lineTo(randomNum(0, this.options.width), randomNum(0, this.options.height));
                ctx.stroke();
            }
            /**绘制干扰点**/
            for(var i = 0; i < this.options.width/4; i++) {
                ctx.fillStyle = randomColor(0, 255);
                ctx.beginPath();
                ctx.arc(randomNum(0, this.options.width), randomNum(0, this.options.height), 1, 0, 2 * Math.PI);
                ctx.fill();
            }
        },

        /**验证验证码**/
        validate: function(code){
            var code = code.toLowerCase();
            var v_code = this.options.code.toLowerCase();
            //console.log(v_code);//输入验证码
            if(code == v_code){
                return true;
            }else{
                this.refresh();
                return false;
            }
        }
    }
    /**生成字母数组**/
    function getAllLetter() {
        var letterStr = "a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z";
        return letterStr.split(",");
    }
    /**生成一个随机数**/
    function randomNum(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }
    /**生成一个随机色**/
    function randomColor(min, max) {
        var r = randomNum(min, max);
        var g = randomNum(min, max);
        var b = randomNum(min, max);
        return "rgb(" + r + "," + g + "," + b + ")";
    }
    window.GVerify = GVerify;
})(window, document);
$(function(){
    //聚焦表表单时
    $("#form_login >div >div >input:last-child").focusin(function () {
        $(this).prev().css("color", "#1abc9c");

    });
    $("#form_login >div >div >input:last-child").focusout(function () {
        $(this).prev().css("color", " #64834a");
    });


    //表单验证
    $("#form_login").validate({
        rules: {
            "login_username": {
                required: true,
                rangelength:[4,8]
            },
            "login_password": {
                required: true,
                rangelength:[6,18]
            }
        },
        messages: {
            "login_username": {
                required: "用户名必须填写",
                rangelength:"用户名最小4位数，最大8位数"
            },
            "login_password": {
                required: "密码必须填写",
                rangelength:"密码最小为6位数，最大为18位数"
            }

        }
    })


    //删除cookie中的用户名和密码用户的类型
    function delete_cookie() {
        $.cookie("Customer_username", null, {path: "/"});
        $.cookie("Customer_password", null, {path: "/"});
        $.cookie("Customer_login", null, {path: "/"});
    }

//登录成功时把用户名和密码用户的类型存在cookie中
    function save_type_username_password() {
        var username = arguments[0];
        var password = arguments[1];
        if (username != null && password != null) {
            $.cookie("Customer_username", username, {path: "/", expires: 7});
            $.cookie("Customer_password", password, {path: "/", expires: 7});
        }
    }

    //点击记住密码
    $("#save_password").click(function () {
        if($("#automatic_login").is(":checked")==true&&$("#save_password").is(":checked")==false)
        {
            $("#automatic_login").removeAttr("checked");
        }

    })
    //点击自动登录
    $("#automatic_login").click(function () {

        if($("#automatic_login").is(":checked")==true&&$("#save_password").is(":checked")==false)
        {
            $("#save_password").prop("checked","true");
        }
        if($("#automatic_login").is(":checked")==false){
            $("#save_password").removeAttr("checked");
        }


    })
    //清除表单的数据
    function deleteMangerLoginStatus(){
        $("#login_username").val("");
        $("#login_password").val("");
        $("#automatic_login").removeAttr("checked");
        $("#save_password").removeAttr("checked");
    }
    deleteMangerLoginStatus();
    //从cookie中获取用户名获取用户名，密码，类型，如果存在，然后再访问数据库，如果正确则自动登录
    function get_type_usrname_password() {
        var username, password;
        if ($.cookie("Customer_username")) {
            username = $.cookie("Customer_username");
        } else
        {
            $("#login_username").focus();
            $("#login_password").val("");
            return;
        }

        if ($.cookie("Customer_password")) {
            password = $.cookie("Customer_password");
        } else
        {
            $("#login_username").focus();
            $("#login_password").val("");
            return;
        }
        if($.cookie("Customer_login")) {
            $.ajax({
                url: "CustomerServiceLoginValidate",
                type: "post",
                dataType: "json",
                data: {
                    username: username,
                    password: password
                },
                success: function (data) {
                    layui.use("layer", function () {
                        var layer = layui.layer;
                        if (data.code == 0) {
                            {
                                layer.msg("自动登录成功", {time: 1000, icon: 1}, function () {
                                    deleteMangerLoginStatus();
                                    window.location.href = "/CustomerService.html";
                                });
                            }
                        } else {
                            delete_cookie();
                            layer.alert('账号失效,请重新登录', {icon: 2});
                            $("#login_username").focus();
                            $("#login_password").val("");
                        }
                        $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                    });
                },
                error: function () {
                    layui.use("layer", function () {
                        var layer = layui.layer;
                        layer.msg("自动登录失败", {time: 1000, icon: 2}, function () {

                        });
                        $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                    });
                    console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);
                }
            });
        }
        else{
            $("#login_username").val(username);
            $("#login_password").val(password);
            $("#save_password").prop("checked","true");
        }
    }
    get_type_usrname_password();
     //验证码
    var verifyCode=new GVerify({id:"v_container",type:"number"});//初始化验证码
    var result;
    $("#code_input").focusout(function() {
        var code_input = $("#code_input").val().trim();
        if (code_input== "") {
            $("#code-error").text("请输入验证码");
            $("#code-error").css("display", "block");
            $("#code_input").focus();
            result=false;
        }
        else {
            $("#code-error").text("验证码错误");
            var res = verifyCode.validate(code_input);
            if (res) {
                $("#code-error").css("display", "none");
                result=true;
            }
            else {
                $("#code-error").css("display", "block");
                $("#code_input").focus();
                $("#code_input").val("");
                result=false;
            }
        }
    });
    $("#code_input").keyup(function () {
        var code_input = $("#code_input").val().trim();
        if(code_input.length=="4"){
            if (code_input== "") {
                $("#code-error").text("请输入验证码");
                $("#code-error").css("display", "block");
                $("#code_input").focus();
                result=false;
            }
            else {
                $("#code-error").text("验证码错误");
                var res = verifyCode.validate(code_input);
                if (res) {
                    $("#code-error").css("display", "none");
                    result=true;
                }
                else {
                    $("#code-error").css("display", "block");
                    $("#code_input").focus();
                    $("#code_input").val("");
                    result=false;
                }
            }
        }

    });



    //点击登录按钮
    $("#btn_login").click(function () {
        if($("#form_login").valid()==false){
            return false;
        }
        $("#code_input").focusout();
        if(result==false){
            $("#code_input").val("");
            $("#code_input").focus();
            return false;
        }
        var username=$("#login_username").val().trim();
        var password=$("#login_password").val().trim();
        $.ajax({
            url:"CustomerServiceLoginValidate",
            type:"post",
            dataType:"json",
            data:{username:username,password:password},
            success:function(data){

                layui.use("layer", function () {
                    var layer = layui.layer;
                    if(data.code==0){
                        if($("#save_password").is(":checked")==true&&$("#automatic_login").is(":checked")==false)//记住密码
                        {
                            delete_cookie();
                            save_type_username_password(username, password);////登录成功时把用户名和密码用户的类型存在cookie中

                        }
                        if($("#save_password").is(":checked")==false){
                            delete_cookie();
                        }
                        if($("#automatic_login").is(":checked")==true){
                            delete_cookie();
                            save_type_username_password(username,password);
                            $.cookie("Customer_login", 1, {path: "/", expires: 7});
                        }


                       layer.msg("登录成功",{time:1000,icon:1},function(){
                           $("#btn_login").next().click();
                           window.location.href="/CustomerService.html";
                       });
                    }else{
                        $("#login_username").focus();
                        layer.alert(data.message, {
                            icon: 2,
                            skin: 'layui-layer-lan',
                            'closeBtn': 0,
                            'anim': 6
                        });
                    }
                    $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                });
            },error:function (XMLHttpRequest) {
                layui.use("layer", function () {
                    var layer = layui.layer;
                    layer.msg("登录失败", {time: 1000, icon: 2}, function () {

                    });
                    $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                });
                console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);
            }
        })

        return false;
    });

    //点击重置按钮
    $("#btn_login").next().click(function () {
    });
})