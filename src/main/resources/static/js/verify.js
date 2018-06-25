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
//verify源文件

//update——password页面的js代码
$(function(){
    $("#username").val("");
    $("#code_input").val("");
    var verifyCode=new GVerify({id:"v_container",type:"number"});//初始化验证码
    //判断输入验证是否正确
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
    //表单验证
    $(".forget-pwd").validate({
     rules:{
         username:{
         	required:true,
             rangelength:[4,8],
             remote:{
                  type:"post",
                 url:"/update_password"
             }
             }
	 },
		messages:{
     	username:{
     		required:"用户名不能为空",
            rangelength:"用户名最小4位数，最大8位数",
            remote:"用户名不存在"

		}
		}
    });


$("#submit").click(function(){
      if($(".forget-pwd").valid()==false){
          $("#username").focus();
          return false;
      }
   $("#code_input").focusout();
      if(result==true){
          $.ajax({
              url:"/forgetPwd",
              type:"post",
              dataType:"json",
              data:{"username": $("#username").val().trim()},
              success:function(data) {
                  if(data.code==0){
                      layer.msg("提交成功",{time:900,icon: 1},function () {
                          $("#username").val("");
                          $("#code_input").val("");
                          window.location.href="/forgetPwd2.html";
                      })

                  }
              },
              error:function (XMLHttpRequest) {

                      layer.msg("提交失败", {time: 1000, icon: 2}, function () {

                      });
                      $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                  console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);
              }
          })

          return false;
      }else{
          $("#code_input").val("");
          $("#code_input").focus();
          return false;
      }

	});
})

