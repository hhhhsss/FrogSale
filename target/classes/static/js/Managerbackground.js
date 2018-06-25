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
$(function () {
    //    //引用vedio.js文件
    // new_element=document.createElement("script");
    // new_element.setAttribute("type","text/javascript");
    // new_element.setAttribute("src","vedio.js");
    // document.body.appendChild(new_element);

    var page = 0;//页码
    var CustomerEvaluationPage = 0;
    layui.use('element', function () {
        var element = layui.element;
    });
    var content_array = ["about", "container", "Basedisplay", "Frog_seedling", "AdultFrog", "Frog", "CompanyDynamics", "CompanyDynamics_content"
        , "CommonProblem", "CommonProblem_content", "contact", "CustomerInstance", "CustomerEvaluation", "ProductCenter",
        "Customerservice_account_management", "index_video"];

    //图片全屏

    //得到大图片地址
    function get_big_image(path){
        var index=path.lastIndexOf("/");
        var pre=path.substring(0,index-5);
        var file=path.substring(index+1,path.length);
        var src=pre+file;
        return src;
    }

    //获取一个文件夹下的所有文件相对路径,并显示到某个ul中
    function get_filepath(type, ul) {
        $.ajax({
            url: "get_filepath",
            type: "post",
            dataType: "json",
            data: {"path": type},
            success: function (data) {
                if (data.code == "0") {
                    ul.empty();
                    var array = data.data;
                    var load;
                    layui.use('layer', function () {
                        var layer = layui.layer;
                        load = layer.load(0, {shade: false});
                    });
                    function addImage(i) {
                        if (i == array.length) {
                            //将删除按钮显示或隐藏起来
                            ul.find("> li").hover(function () {
                                $(this).find("span").show();
                            }, function () {
                                $(this).find("span").hide();
                            });

                            layer.ready(function () {
                                layer.photos({
                                    photos:'#'+ul.parent().attr("id"),
                                    shift:5
                                });
                            })
                             $('#'+ul.parent().attr("id")).find("img").click(function () {
                                 if($("div[id^='layui-layer-shade']").next().find("div").attr("id")=="")
                                 $("div[id^='layui-layer-shade']").click(function () {
                                     layer.closeAll();
                                 })
                             })

                            //点击了删除按钮
                            ul.find(">li span").click(function () {
                                var img_src = $(this).prev().attr("src");
                                layui.use('layer', function () {
                                    var layer = layui.layer;
                                    layer.confirm('确认删除?', {btn: ['确定', '取消'], title: '提示', icon: 2}, function (index) {
                                        $.ajax({
                                            url: "delete_one_file",
                                            type: 'post',
                                            dataType: 'json',
                                            data: {"path": img_src},
                                            success: function (data) {
                                                if (data.code == "0") {
                                                    layui.use("layer", function () {
                                                        var layer = layui.layer;

                                                        get_filepath(type, ul);
                                                        layer.msg("删除图片成功", {time: 1000, icon: 1}, function () {

                                                        });
                                                        $("div[id^='layui-layer']").css({
                                                            "width": "",
                                                            "z-index": "99999999999"
                                                        });
                                                    });

                                                }
                                                else if (data.code == "1") {
                                                    layui.use("layer", function () {
                                                        var layer = layui.layer;
                                                        layer.msg("type的值对应的类型不存在", {time: 1000, icon: 2}, function () {

                                                        });
                                                        $("div[id^='layui-layer']").css({
                                                            "width": "",
                                                            "z-index": "99999999999"
                                                        });
                                                    });
                                                }
                                                else if (data.code == "-2") {
                                                    //没有访问权限
                                                    layui.use("layer", function () {
                                                        var layer = layui.layer;
                                                        layer.msg("访问权限已失效,请重新登录", {time: 1000, icon: 2}, function () {
                                                            window.location.href = "/Managerbackground.html";
                                                        });
                                                        $("div[id^='layui-layer']").css({
                                                            "width": "",
                                                            "z-index": "99999999999"
                                                        });
                                                    });

                                                }
                                                else {
                                                    //空的数据
                                                    layer.msg("图片删除失败", {time: 1000, icon: 2}, function () {

                                                    });
                                                    $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                                                }
                                            },
                                            error: function (XMLHttpRequest) {
                                                layui.use("layer", function () {
                                                    var layer = layui.layer;
                                                    layer.msg("删除图片失败", {time: 1000, icon: 2}, function () {

                                                    });
                                                    $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                                                });
                                                console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);
                                            }
                                        });

                                        layer.close(index);
                                    });


                                });
                            });
                            layer.close(load);
                            return;
                        }
                        var img1 = new Image();
                        img1.src = array[i];
                        if (img1.complete) {
                            var img = $('<li></li>');
                            $(img1).attr("layer-src",get_big_image(array[i]));
                            img.append($(img1));
                            img.append($("<span class=\"glyphicon glyphicon-remove\"></span>"));
                            ul.append(img);
                            addImage(i + 1);
                        } else {
                            img1.onload = function () {
                                var img = $('<li></li>');
                                $(img1).attr("layer-src",get_big_image(array[i]));
                                img.append($(img1));
                                img.append($("<span class=\"glyphicon glyphicon-remove\"></span>"));
                                ul.append(img);
                                addImage(i + 1);
                            }
                        }
                    }

                    addImage(0);

                }
                else if (data.code == "1") {
                    layui.use("layer", function () {
                        var layer = layui.layer;
                        layer.msg("获取图片失败", {time: 1000, icon: 2}, function () {

                        });
                        $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                    });
                } else if (data.code == "-2") {
                    //没有访问权限
                    layui.use("layer", function () {
                        var layer = layui.layer;
                        layer.msg("访问权限已失效,请重新登录", {time: 1000, icon: 2}, function () {
                            window.location.href = "/Managerbackground.html";
                        });
                        $("div[id^='layui-layer']").css({
                            "width": "",
                            "z-index": "99999999999"
                        });
                    });

                }
                else {
                    //空的数据
                }
            },
            error: function (XMLHttpRequest) {
                layui.use("layer", function () {
                    var layer = layui.layer;
                    layer.msg("获取图片失败", {time: 1000, icon: 2}, function () {

                    });
                    $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                });
                console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);
            }
        });
    };
    //显示底部的字
    $(".layui-side .layui-nav-item").click(function () {
        var array = [1, 4, 5];
        var index = $(this).index();
        if (array.indexOf(index) != -1) {
            var text = $(this).find("a:first").text();
            $(".layui-footer").text(text);
        }
        switch (index) {
            case 1:
                show_4();
                break;
            case 4:
                show_3();
                break;
            case 5:
                show_5();
                break;
            case 6:
                show_6();
                break;
        }
    });
    $(".layui-side .layui-nav-item > dl dd").click(function () {
        var array = ["关于我们", "产品中心", "企业资讯"];
        var parent_text = $(this).parent().prev().text();
        var text = $(this).find("a").text();
        var index = $(this).index();
        $(".layui-footer").text(parent_text + "/" + text);
        var parent_index = array.indexOf(parent_text);
        switch (parent_index) {
            case 0:
                switch (index) {
                    case 0:
                        show_about();
                        break;
                    case 1:
                        show_0_1();
                        break;
                    case 2:
                        show_0_2();
                        break;
                }
                ;
                break;
            case 1:
                switch (index) {
                    case 0:
                        show_1_0();
                        break;
                    case 1:
                        show_1_1();
                        break;
                    case 2:
                        show_1_2();
                        break;
                }
                ;
                break;
            case 2:
                switch (index) {
                    case 0:
                        show_2_0();
                        break;
                    case 1:
                        show_2_1();
                        break;
                }
                ;
                break;
        }
    });

//显示某个id
    function show_id(id) {
        $("#" + id).show();
        for (var i in content_array) {
            if (content_array[i] != id) {
                $("#" + content_array[i]).hide();
            }

        }
    };
    //初始化textarea(在线编辑)
    // $("#textarea").Editor();
    //关于我们(点击提交）
    $("#about").find("button:last").click(function () {
        layui.use('layer', function () {
            var layer = layui.layer;
            layer.confirm('确定提交?', {
                btn: ['确认', '取消'], title: '提示', icon: 3
            }, function () {
                var text = $("#textarea").Editor("getText").trim();
                if (text == "") {
                    layui.use('layer', function () {
                        var layer = layui.layer;
                        layer.msg("内容不能为空", {time: 1000, icon: 2});
                        $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                        // $("div[class='layui-layer-content']").css({"width": "", "z-index": "99999999999"});
                    });
                    return;
                }
                $.ajax({
                    url: "save_about_first",
                    type: "post",
                    dataType: "json",
                    data: {"content": text},
                    success: function (data) {
                        if (data.code == "0") {
                            layui.use("layer", function () {
                                var layer = layui.layer;
                                layer.msg("提交成功", {time: 1000, icon: 1}, function () {

                                });
                                $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                            });
                        }
                        else if (data.code == "-2") {
                            //没有访问权限
                            layui.use("layer", function () {
                                var layer = layui.layer;
                                layer.msg("访问权限已失效,请重新登录", {time: 1000, icon: 2}, function () {
                                    window.location.href = "/Managerbackground.html";
                                });
                                $("div[id^='layui-layer']").css({
                                    "width": "",
                                    "z-index": "99999999999"
                                });
                            });

                        }
                        else {
                            layui.use("layer", function () {
                                var layer = layui.layer;
                                layer.msg("提交失败", {time: 1000, icon: 2}, function () {

                                });
                                $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                            });
                        }
                    },
                    error: function (XMLHttpRequest) {
                        layui.use("layer", function () {
                            var layer = layui.layer;
                            layer.msg("提交失败", {time: 1000, icon: 2}, function () {

                            });
                            $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                        });
                        console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);
                    }
                });
            }, function () {

            });
        });
    });

    //上传图片的初始化
    function init_upload_file(id, path) {
        // alert($('#'+id+' .js-uploader__box').parent().parent().attr("id"));
        $('#' + id + ' .js-uploader__box').uploader({
            'selectButtonCopy': '请选择或拖拽图片',
            'instructionsCopy': '上传图片',
            'submitButtonCopy': '上传选择的图片',
            'furtherInstructionsCopy': '你可以选择或拖拽更多的图片',
            'secondarySelectButtonCopy': '选择更多的图片',
            'dropZone': $('body'),
            'fileTypeWhiteList': ['jpg', 'png', 'jpeg', 'gif', 'pdf'],
            'badFileTypeMessage': '无法识别此图片',
            'ajaxUrl': path//上传图片的ajax路径
        })
    };
    //资格许可证上传图片的初始化
    init_upload_file("container", "save_about_second");
    //基地上传图片的初始化
    init_upload_file("Basedisplay", "save_about_third");
    //蛙苗上传图片的初始化
    init_upload_file("Frog_seedling", "save_ProductCenter_one");
    //成蛙上传图片初始化
    init_upload_file("AdultFrog", "save_ProductCenter_second");
    //种蛙上传图片初始化
    init_upload_file("Frog", "save_ProductCenter_third");

    //删除编辑框
    function deleteEditor(id) {
        $("#" + id + " .row-fluid").remove();
        $("#InsertLink").remove();
        $("#InsertImage").remove();
        $("#InsertTable").remove();
    }

    //显示关于我们
    function show_about() {
        // $(".row-fluid").remove();
       layer.closeAll();
        deleteEditor("about");
        $("#textarea").Editor();
        //获取关于我们数据
        $.ajax({
            url: "get_about_first",
            type: "post",
            dataType: "json",
            success: function (data) {
                if (data.code == "0") {
                    // layui.use("layer", function () {
                    //     var layer = layui.layer;
                    //     layer.msg("获取数据成功", {time: 1000, icon: 1}, function () {
                    //
                    //     });
                    //     $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                    // });
                    $("#textarea").Editor("setText", data.data);
                }
                else if (data.code == "2") {
                    layui.use("layer", function () {
                        var layer = layui.layer;
                        layer.msg("获取数据失败", {time: 1000, icon: 2}, function () {

                        });
                        $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                    });
                } else if (data.code == "-2") {
                    //没有访问权限
                    layui.use("layer", function () {
                        var layer = layui.layer;
                        layer.msg("访问权限已失效,请重新登录", {time: 1000, icon: 2}, function () {
                            window.location.href = "/Managerbackground.html";
                        });
                        $("div[id^='layui-layer']").css({
                            "width": "",
                            "z-index": "99999999999"
                        });
                    });

                }
                else {
                    $("#textarea").Editor("setText", "");
                    //空的数据
                }
            },
            error: function (XMLHttpRequest) {
                layui.use("layer", function () {
                    var layer = layui.layer;
                    layer.msg("获取数据失败", {time: 1000, icon: 2}, function () {

                    });
                    $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                });
                console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);
            }
        });
        show_id("about");
    };


    //显示资源许可证
    function show_0_1() {
        layer.closeAll();
        get_filepath(0, $("#container >ul:first"));
        show_id("container");

    };

    //显示基地图片
    function show_0_2() {
        layer.closeAll();
        get_filepath(1, $("#Basedisplay > ul:first"));
        show_id("Basedisplay");
    }

    //显示蛙苗
    function show_1_0() {
        layer.closeAll();
        get_filepath(2, $("#Frog_seedling > ul:first"));
        show_id("Frog_seedling");
    }

    //显示成蛙
    function show_1_1() {
        layer.closeAll();
        get_filepath(3, $("#AdultFrog > ul:first"));
        show_id("AdultFrog");
    }

    //显示种蛙
    function show_1_2() {
        layer.closeAll();
        get_filepath(4, $("#Frog > ul:first"));
        show_id("Frog");
    }

    //显示公司动态
    function show_2_0() {
        layer.closeAll();
        //获取数据
        get_company_Enterprises(0);
        show_id("CompanyDynamics");
    }


    //显示常见问题
    function show_2_1() {
        layer.closeAll();
        get_company_Enterprises(1);
        show_id("CommonProblem");
    }

//显示联系我们
    function show_3() {
        layer.closeAll();
        get_contact();
        show_id("contact");
    }

//显示客户实例
    function show_4() {
        layer.closeAll();
        getNumberCustomerInstances();
        show_id("CustomerInstance");
    }

//显示客户评价
    function show_5() {
        layer.closeAll();
        getNumberCustomerEvaluations();
        show_id("CustomerEvaluation");
    }

    //获取上传的视频
    function get_videopath() {
        $("#index_video >ul:first").empty();
        $.ajax({
            url: "get_upload_video",
            type: "post",
            dataType: "json",
            success: function (data) {
                if (data.code == 0) {
                    var result = data.data;
                    for (var i in result) {
                        var $li = $('<li>\n' +
                            '                        <div class="wrapper">\n' +
                            '                            <div class="js-video">\n' +
                            '                                <video class="js-media" preload="none">\n' +
                            '                                    <source src="' + result[i] + '" type="video/mp4"/>\n' +
                            '                                    <p>你的浏览器不支持 HTML5 Video。</p>\n' +
                            '                                </video>\n' +
                            '                                <i data-playPause class="playPause fa fa-play ui-icon"><span></span></i>\n' +
                            '                                <div class="ui">\n' +
                            '                                    <div>\n' +
                            '                                        <div data-progress class="progress">\n' +
                            '                                            <div data-buffer class="progress-buffer"></div>\n' +
                            '                                            <div data-time class="progress-time"></div>\n' +
                            '                                        </div>\n' +
                            '                                    </div>\n' +
                            '                                    <div>\n' +
                            '                                        <span class="timeDisplay"><i data-currentTime>0:00</i> / <i\n' +
                            '                                                data-duration>0:00</i></span>\n' +
                            '                                    </div>\n' +
                            '                                    <div>\n' +
                            '                                        <i data-mute class="fa fa-volume-up ui-icon"></i>\n' +
                            '                                    </div>\n' +
                            '                                    <div>\n' +
                            '                                        <div data-volume="100" class="volumeControl"><span\n' +
                            '                                                class="ui-slider-handle"></span></div>\n' +
                            '                                    </div>\n' +
                            '                                </div>\n' +
                            '                                <i data-fullscreen class="fullscreen iconicfill-fullscreen" title="fullscreen"></i><span class="glyphicon glyphicon-remove"></span>\n' +
                            '                            </div>\n' +
                            '                        </div>\n' +
                            '                    </li>');
                        $("#index_video >ul:first").append($li);
                    }
                    //添加删除函数
                    $("#index_video >ul:first >li .glyphicon").each(function () {
                        $(this).click(function () {
                            var $this=$(this);
                            var src=$this.closest(".js-video").find(".js-media source").attr("src");
                            layer.confirm('确认删除?', {btn: ['确定', '取消'], title: '提示', icon: 2}, function (index) {
                                $.ajax({
                                    url: "delete_one_file",
                                    type: 'post',
                                    dataType: 'json',
                                    data: {"path": src},
                                    success: function (data) {
                                        if (data.code == "0") {
                                            layui.use("layer", function () {
                                                var layer = layui.layer;
                                                get_videopath();
                                                layer.msg("删除视频成功", {time: 1000, icon: 1}, function () {

                                                });
                                                $("div[id^='layui-layer']").css({
                                                    "width": "",
                                                    "z-index": "99999999999"
                                                });
                                            });

                                        }
                                        else if (data.code == "-2") {
                                            //没有访问权限
                                            layui.use("layer", function () {
                                                var layer = layui.layer;
                                                layer.msg("访问权限已失效,请重新登录", {time: 1000, icon: 2}, function () {
                                                    window.location.href = "/Managerbackground.html";
                                                });
                                                $("div[id^='layui-layer']").css({
                                                    "width": "",
                                                    "z-index": "99999999999"
                                                });
                                            });

                                        }
                                        else {
                                            //空的数据
                                            layer.msg("视频删除失败", {time: 1000, icon: 2}, function () {

                                            });
                                            $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                                        }
                                    },
                                    error: function (XMLHttpRequest) {
                                        layui.use("layer", function () {
                                            var layer = layui.layer;
                                            layer.msg("删除视频失败", {time: 1000, icon: 2}, function () {

                                            });
                                            $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                                        });
                                        console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);
                                    }
                                });

                                layer.close(index);
                            });
                        });
                    });


                    // use jQuery UI slider for volume control
                    if ($.fn.slider) {

                        $('.volumeControl').slider({
                            min: 0,
                            max: 100,
                            value: 100,
                            slide: function (event, ui) {
                                $(this).data('volume', ui.value).trigger('volumeChange');
                            }
                        });
                    }

// Initialize the Video instance
                    $('.js-video').video();

                } else if (data.code == 1) {
                    //空的数据
                } else if (data.code == -2) {
                    //没有访问权限
                    layui.use("layer", function () {
                        var layer = layui.layer;
                        layer.msg("访问权限已失效,请重新登录", {time: 1000, icon: 2}, function () {
                            window.location.href = "/Managerbackground.html";
                        });
                        $("div[id^='layui-layer']").css({
                            "width": "",
                            "z-index": "99999999999"
                        });
                    });
                }
            }, error: function (XMLHttpRequest) {
                layui.use("layer", function () {
                    var layer = layui.layer;
                    layer.msg("获取视频失败", {time: 1000, icon: 2}, function () {

                    });
                    $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                });
                console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);
            }
        })
    };

    function get_index_video() {
        $('#index_video .js-uploader__box').videouploader({
            'selectButtonCopy': '请选择或拖拽视频',
            'instructionsCopy': '上传视频',
            'submitButtonCopy': '上传选择的视频',
            'furtherInstructionsCopy': '你可以选择或拖拽更多的视频',
            'secondarySelectButtonCopy': '选择更多的视频',
            'dropZone': $('body'),
            'badFileTypeMessage': '无法识别此视频',
            'ajaxUrl': "save_upload_video"//上传图片的ajax路径
        })
    }

//显示主页视频
    function show_6() {
        layer.closeAll();
        get_videopath();
        get_index_video();
        show_id("index_video");
    }

    //获取公司动态(type=0)或常见问题(type=1)的所有标题id
    function get_company_Enterprises(type) {
        if (type == 0) {
            $.ajax({
                url: "get_all_CompanyDynamics_title",
                type: "post",
                dataType: "json",
                success: function (da) {
                    $("#CompanyDynamics >ul:first").empty();
                    if (da.code == "0") {
                        var data = da.data;
                        for (var i in data) {
                            var $li = $("<li title=\"公司动态\"><input type=\"checkbox\"><span>" + data[i].title + "</span><span class=\"sr-only\">" + data[i].id + "</span>\n" +
                                "                        <input type=\"button\" class=\"btn btn-info\" value=\"编辑\"><input type=\"button\" class=\"btn btn-danger\"\n" +
                                "                                                                                    value=\"删除\"></li>");
                            $("#CompanyDynamics >ul:first").append($li);
                        }
                        init_CompanyDynamics();
                    } else if (da.code == "-2") {
                        //没有访问权限
                        layui.use("layer", function () {
                            var layer = layui.layer;
                            layer.msg("访问权限已失效,请重新登录", {time: 1000, icon: 2}, function () {
                                window.location.href = "/Managerbackground.html";
                            });
                            $("div[id^='layui-layer']").css({
                                "width": "",
                                "z-index": "99999999999"
                            });
                        });

                    }

                },
                error: function (XMLHttpRequest) {
                    layui.use("layer", function () {
                        var layer = layui.layer;
                        layer.msg("公司动态获取失败", {time: 1000, icon: 2}, function () {

                        });
                        $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                    });
                    console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);
                }
            });
        } else if (type == 1) {
            $.ajax({
                url: "get_all_CommonProblem_title",
                type: "post",
                dataType: "json",
                success: function (da) {
                    $("#CommonProblem >ul:first").empty();
                    if (da.code == 0) {
                        var data = da.data;
                        for (var i in data) {
                            var $li = $("<li title=\"公司动态\"><input type=\"checkbox\"><span>" + data[i].title + "</span><span class=\"sr-only\">" + data[i].id + "</span>\n" +
                                "                        <input type=\"button\" class=\"btn btn-info\" value=\"编辑\"><input type=\"button\" class=\"btn btn-danger\"\n" +
                                "                                                                                    value=\"删除\"></li>");
                            $("#CommonProblem >ul:first").append($li);
                        }
                        init_CommonProblem();
                    } else if (da.code == "-2") {
                        //没有访问权限
                        layui.use("layer", function () {
                            var layer = layui.layer;
                            layer.msg("访问权限已失效,请重新登录", {time: 1000, icon: 2}, function () {
                                window.location.href = "/Managerbackground.html";
                            });
                            $("div[id^='layui-layer']").css({
                                "width": "",
                                "z-index": "99999999999"
                            });
                        });

                    }

                },
                error: function (XMLHttpRequest) {
                    layui.use("layer", function () {
                        var layer = layui.layer;
                        layer.msg("常见问题获取失败", {time: 1000, icon: 2}, function () {

                        });
                        $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                    });
                    console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);
                }
            });
        }
        else {
            alert("type=0|1,不能为其他");
        }

    }

    //存放公司动态点击对应的文章初始内容
    var CompanyDynamics_content = "";
    var CompanyDynamics_sign = true;//用来判断是修改还是添加文章
    //公司动态的初始化

    //公司动态中确认按钮绑定函数
    $("#CompanyDynamics > p:first #btn3").click(function () {
        layui.use("layer", function () {
            var layer = layui.layer;
            var type = 0;//判断是否选选中
            $("#CompanyDynamics >ul:first >li").each(function () {
                if ($(this).find("input:first").is(":checked") == true)
                    type = 1;
            });
            if (type == 0) {
                layer.msg("未选中", {time: 1000, icon: 2});
                $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                return;
            }


            layer.confirm('确认将选中的删除吗?', {btn: ['确认', '取消'], title: '提示', icon: 2}, function (id) {
                var index_array = [];
                var $array = [];
                var index;
                $("#CompanyDynamics >ul >li").each(function () {
                    var $parent = $(this);
                    var $this = $(this).find(">input:first");
                    if ($this.is(":checked")) {
                        index = $this.next().next().text();
                        index_array[index_array.length] = index;
                        $array[$array.length] = $parent;
                    }
                });
                //通过数据库删除所选项
                $.ajax({
                    url: "delete_many_companyDynamicsById",
                    type: "post",
                    dataType: "json",
                    data: {id: index_array.toString()},
                    success: function (data) {
                        if (data.code == 0) {
                            //在页面中删除选中的数据
                            for (var i in $array) {
                                $array[i].remove();

                            }
                            layer.msg("批量删除成功！", {time: 1000, icon: 1});
                            $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                        } else if (data.code == "-2") {
                            //没有访问权限
                            layui.use("layer", function () {
                                var layer = layui.layer;
                                layer.msg("访问权限已失效,请重新登录", {time: 1000, icon: 2}, function () {
                                    window.location.href = "/Managerbackground.html";
                                });
                                $("div[id^='layui-layer']").css({
                                    "width": "",
                                    "z-index": "99999999999"
                                });
                            });

                        }
                        else {
                            layui.use("layer", function () {
                                var layer = layui.layer;
                                layer.msg(data.message, {time: 1000, icon: 2}, function () {

                                });
                                $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                            });
                        }
                    }, error: function (XMLHttpRequest) {

                        layui.use("layer", function () {
                            var layer = layui.layer;
                            layer.msg("批量删除失败", {time: 1000, icon: 2}, function () {

                            });
                            $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                        });
                        console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);
                    }
                });


                layer.close(id);
            });
        });
    });

    //公司动态中添加按钮绑定函数
    $("#CompanyDynamics > p:first #btn4").click(function () {
        layui.use("layer", function () {
            var layer = layui.layer;
            layer.prompt({title: '添加一篇文章,请输入标题', formType: 2, value: '', maxlength: 30}, function (value, id) {
                value = value.trim();
                var all_arry = get_all_title();//获取公司动态所有的文章
                if (all_arry.indexOf(value) != -1) {
                    layer.msg("标题已经存在！", {time: 1000, icon: 2});
                    $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                } else {
                    deleteEditor("CompanyDynamics_content");
                    $("#textarea1").Editor();
                    CompanyDynamics_sign = true;
                    $("#CompanyDynamics_content > h1").text(value);
                    $("#textarea1").Editor("setText", "");
                    show_id("CompanyDynamics_content");
                }
                layer.close(id);
            })
        });
    });


//把文章的id和标题存起来
    function get_all_array() {
        var all_arry = [];//把文章的id和标题存起来
        var id;
        $("#CompanyDynamics >ul >li").each(function () {
            var $parent = $(this);
            id = $(this).find("span:last").text();
            var text = $(this).find("span:first").text();
            var content = {"text": text, "dom": $parent};
            all_arry[id] = content;
        });
        return all_arry;
    }

    //把文章的标题存起来
    function get_all_title() {
        var all_arry = [];
        $("#CompanyDynamics >ul >li").each(function () {
            var text = $(this).find("span:first").text();
            all_arry[all_arry.length] = text;
        });
        return all_arry;
    }

    //公司动态中查找确定按钮绑定函数
    $("#CompanyDynamics > p:first #btn6").click(function () {
        var value = $(this).prev().val().trim();
        if (value == "") {
            layui.use("layer", function () {

                var layer = layui.layer;
                layer.msg("查找内容不能为空！", {time: 1000, icon: 2});
                $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
            })
        } else {
            var all_arry = get_all_array();
            for (var i in all_arry) {
                if ((all_arry[i].text).indexOf(value) >= 0) {
                    all_arry[i].dom.show("3000");
                }
                else {
                    all_arry[i].dom.hide("3000");
                }
            }

        }
    });


    function init_CompanyDynamics() {
        //点击标题
        $("#CompanyDynamics > ul >li").each(function () {
            $(this).find("span:first").click(function () {
                deleteEditor("CompanyDynamics_content");
                $("#textarea1").Editor();
                var text = $(this).text();
                var id = $(this).next().text().trim();
                var content = "";//从数据库中获取
                $.ajax({
                    url: "get_CompanyDynamics_contentByID",
                    type: "post",
                    dataType: "json",
                    data: {id: id},
                    success: function (data) {
                        if (data.code == 0) {
                            CompanyDynamics_sign = false;
                            content = data.data;
                            $("#CompanyDynamics_content > h1").text(text);
                            $("#CompanyDynamics_content > span").text(id);
                            CompanyDynamics_content = content.trim();
                            $("#textarea1").Editor("setText", content);
                            show_id("CompanyDynamics_content");
                        } else if (data.code == "-2") {
                            //没有访问权限
                            layui.use("layer", function () {
                                var layer = layui.layer;
                                layer.msg("访问权限已失效,请重新登录", {time: 1000, icon: 2}, function () {
                                    window.location.href = "/Managerbackground.html";
                                });
                                $("div[id^='layui-layer']").css({
                                    "width": "",
                                    "z-index": "99999999999"
                                });
                            });

                        } else {
                            layui.use("layer", function () {
                                var layer = layui.layer;
                                layer.msg(data.message, {time: 1000, icon: 2}, function () {

                                });
                                $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                            });
                        }
                    },
                    error: function (XMLHttpRequest) {
                        layui.use("layer", function () {
                            var layer = layui.layer;
                            layer.msg("文章内容获取失败", {time: 1000, icon: 2}, function () {

                            });
                            $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                        });
                        console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);

                    }
                });
            });
        });
        //公司动态中全选按钮绑定函数
        $("#CompanyDynamics > p:first #btn1").click(function () {
            $("#CompanyDynamics >ul >li").each(function () {
                var $this = $(this).find(">input:first");
                $this.prop("checked", "checked");
            });
        });
        //公司动态中取消按钮绑定函数
        $("#CompanyDynamics > p:first #btn2").click(function () {
            $("#CompanyDynamics >ul >li").each(function () {
                var $this = $(this).find(">input:first");
                $this.removeAttr("checked");
            });
        });

        //公司动态中刷新按钮绑定函数
        $("#CompanyDynamics >p span:last-child").click(function () {
            $("#CompanyDynamics >ul >li").each(function () {
                $(this).show("3000");
            });
        });

        //公司动态中编辑按钮绑定函数
        $("#CompanyDynamics > ul >li").each(function () {
            $(this).find("> input:nth-last-child(2)").click(function (e) {
                e.preventDefault();
                e.stopPropagation();
                var $id = $(this).prev();
                var $text = $id.prev();
                layui.use('layer', function () {
                    var layer = layui.layer;
                    layer.prompt({
                        title: '修改ID为 [' + $id.text() + '] 的标题',
                        formType: 2,
                        value: $text.text()
                    }, function (value, index) {
                        value = value.trim();
                        var all_arry = get_all_title();//获取公司动态所有的文章
                        if (all_arry.indexOf(value) != -1) {
                            if ($text.text().trim() == value) {
                                layer.close(index);
                            } else {
                                layer.msg("标题已经存在！", {time: 1000, icon: 2});
                                $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                            }
                        } else {
                            //修改数据库中的数据
                            $.ajax({
                                url: "update_CompanyDynamics_tilteById",
                                type: "put",
                                dataType: "json",
                                data: {id: $id.text(), title: value},
                                success: function (data) {
                                    if (data.code == 0) {
                                        //修改页面的数据
                                        $text.text(value);
                                        layer.msg('修改成功', {time: 1000, icon: 1});
                                        $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});

                                    } else if (data.code == "-2") {
                                        //没有访问权限
                                        layui.use("layer", function () {
                                            var layer = layui.layer;
                                            layer.msg("访问权限已失效,请重新登录", {time: 1000, icon: 2}, function () {
                                                window.location.href = "/Managerbackground.html";
                                            });
                                            $("div[id^='layui-layer']").css({
                                                "width": "",
                                                "z-index": "99999999999"
                                            });
                                        });

                                    } else {
                                        layui.use("layer", function () {
                                            var layer = layui.layer;
                                            layer.msg(data.message, {time: 1000, icon: 2}, function () {

                                            });
                                            $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                                        });
                                    }
                                },
                                error: function (XMLHttpRequest) {
                                    layui.use("layer", function () {
                                        var layer = layui.layer;
                                        layer.msg("文章内容修改失败", {time: 1000, icon: 2}, function () {

                                        });
                                        $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                                    });
                                    console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);

                                }
                            })
                            layer.close(index);
                        }

                    })
                });
            })

        });

        //公司动态中删除按钮绑定函数

        $("#CompanyDynamics > ul >li").each(function () {
            var $parent = $(this);
            $(this).find("> input:last").click(function (e) {
                e.preventDefault();
                e.stopPropagation();
                var $id = $(this).prev().prev();
                var $text = $id.prev();
                layui.use("layer", function () {
                    var layer = layui.layer;
                    layer.confirm('确定删除标题为 [' + $text.text() + '] 的文章吗？', {
                        btn: ['确定', '取消'],
                        title: '提示',
                        icon: 2
                    }, function (index) {
                        var id = $id.text().trim();
                        $.ajax({
                            url: "delete_one_companyDynamicsById/" + id,
                            type: "delete",
                            dataType: "json",
                            success: function (data) {
                                if (data.code == 0) {
                                    $parent.remove();
                                    layer.msg('删除成功', {time: 1000, icon: 1});
                                    $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                                } else if (data.code == "-2") {
                                    //没有访问权限
                                    layui.use("layer", function () {
                                        var layer = layui.layer;
                                        layer.msg("访问权限已失效,请重新登录", {time: 1000, icon: 2}, function () {
                                            window.location.href = "/Managerbackground.html";
                                        });
                                        $("div[id^='layui-layer']").css({
                                            "width": "",
                                            "z-index": "99999999999"
                                        });
                                    });

                                } else {
                                    layui.use("layer", function () {
                                        var layer = layui.layer;
                                        layer.msg(data.message, {time: 1000, icon: 2}, function () {

                                        });
                                        $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                                    });
                                }

                            },
                            error: function (XMLHttpRequest) {
                                layui.use("layer", function () {
                                    var layer = layui.layer;
                                    layer.msg("删除失败", {time: 1000, icon: 2}, function () {

                                    });
                                    $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                                });
                                console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);

                            }
                        });

                        layer.close(index);
                    });
                })
            })
        });
    }

//公司动态对应标题的文章内容
    //初始化textarea1(在线编辑)
    // $("#textarea1").Editor();
    //点击提交
    $("#CompanyDynamics_content").find("button:nth-last-child(2)").click(function () {
        layui.use('layer', function () {
            var layer = layui.layer;
            layer.confirm('确定提交?', {
                btn: ['确认', '取消'], title: '提示', icon: 3
            }, function (index) {
                var text = $("#textarea1").Editor("getText").trim();
                if (text == "") {
                    layui.use('layer', function () {
                        var layer = layui.layer;
                        layer.msg("内容不能为空", {time: 1000, icon: 2});
                        $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                    });
                } else {
                    var title = $("#CompanyDynamics_content >h1:first").text();
                    if (CompanyDynamics_sign == true)//添加文章
                    {
                        $.ajax({
                            url: "add_one_CompanyDynamics",
                            type: "post",
                            dataType: "json",
                            data: {"title": title, "content": text},
                            success: function (data) {
                                if (data.code == "0") {
                                    layui.use("layer", function () {
                                        var layer = layui.layer;
                                        layer.msg("添加成功", {time: 1000, icon: 1}, function () {
                                            get_company_Enterprises(0);
                                            show_id("CompanyDynamics");
                                        });
                                        $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                                    });
                                } else if (data.code == "-2") {
                                    //没有访问权限
                                    layui.use("layer", function () {
                                        var layer = layui.layer;
                                        layer.msg("访问权限已失效,请重新登录", {time: 1000, icon: 2}, function () {
                                            window.location.href = "/Managerbackground.html";
                                        });
                                        $("div[id^='layui-layer']").css({
                                            "width": "",
                                            "z-index": "99999999999"
                                        });
                                    });

                                }
                                else {
                                    layui.use("layer", function () {
                                        var layer = layui.layer;
                                        layer.msg(data.message, {time: 1000, icon: 2}, function () {

                                        });
                                        $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                                    });
                                }
                            },
                            error: function (XMLHttpRequest) {
                                layui.use("layer", function () {
                                    var layer = layui.layer;
                                    layer.msg("添加失败", {time: 1000, icon: 2}, function () {

                                    });
                                    $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                                });
                                console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);
                            }
                        });
                    } else {//修改文章内容
                        var id = $("#CompanyDynamics_content >span:first").text().trim();
                        $.ajax({
                            url: "update_one_companyDynamics_contentByID",
                            type: "put",
                            dataType: "json",
                            data: {id: id, content: text},
                            success: function (data) {
                                if (data.code == 0) {
                                    layui.use("layer", function () {
                                        var layer = layui.layer;
                                        layer.msg("修改成功", {time: 1000, icon: 1}, function () {
                                            get_company_Enterprises(0);
                                            show_id("CompanyDynamics");
                                        });
                                        $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                                    });
                                } else if (data.code == "-2") {
                                    //没有访问权限
                                    layui.use("layer", function () {
                                        var layer = layui.layer;
                                        layer.msg("访问权限已失效,请重新登录", {time: 1000, icon: 2}, function () {
                                            window.location.href = "/Managerbackground.html";
                                        });
                                        $("div[id^='layui-layer']").css({
                                            "width": "",
                                            "z-index": "99999999999"
                                        });
                                    });

                                } else {
                                    layui.use("layer", function () {
                                        var layer = layui.layer;
                                        layer.msg(data.message, {time: 1000, icon: 2}, function () {

                                        });
                                        $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                                    });
                                }

                            }, error: function (XMLHttpRequest) {
                                layui.use("layer", function () {
                                    var layer = layui.layer;
                                    layer.msg("修改失败", {time: 1000, icon: 2}, function () {

                                    });
                                    $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                                });
                                console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);

                            }
                        })
                    }
                }


                layer.close(index);
            }, function () {

            });
        });
    });
    //点击返回
    $("#CompanyDynamics_content").find("button:last").click(function () {
        var current_content = $("#textarea1").Editor("getText").trim();
        if (current_content == CompanyDynamics_content) {
            show_id("CompanyDynamics");
        }
        else {
            layui.use("layer", function () {
                var layer = layui.layer;
                layer.confirm("没保存，继续编辑吗？", {btn: ['继续', '返回'], icon: 3, title: "提示"}, function (index) {
                    layer.close(index);
                }, function (index) {
                    show_id("CompanyDynamics");
                    layer.close(index);

                });
            });
        }
    })


    //存放常见问题点击对应的文章初始内容
    var CommonProblem_content = "";
    var CommonProblem_sign = true;//用来判断是修改还是添加文章
    //常见问题的初始化

    //常见问题 中确认按钮绑定函数
    $("#CommonProblem > p:first #btn31").click(function () {
        layui.use("layer", function () {
            var layer = layui.layer;
            var type = 0;//判断是否选选中
            $("#CommonProblem >ul:first >li").each(function () {
                if ($(this).find("input:first").is(":checked") == true)
                    type = 1;
            });
            if (type == 0) {
                layer.msg("未选中", {time: 1000, icon: 2});
                $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                return;
            }


            layer.confirm('确认将选中的删除吗?', {btn: ['确认', '取消'], title: '提示', icon: 2}, function (id) {
                var index_array = [];
                var $array = [];
                var index;
                $("#CommonProblem >ul >li").each(function () {
                    var $parent = $(this);
                    var $this = $(this).find(">input:first");
                    if ($this.is(":checked")) {
                        index = $this.next().next().text();
                        index_array[index_array.length] = index;
                        $array[$array.length] = $parent;
                    }
                });
                //通过数据库删除所选项
                $.ajax({
                    url: "delete_many_CommonProblemById",
                    type: "post",
                    dataType: "json",
                    data: {id: index_array.toString()},
                    success: function (data) {
                        if (data.code == 0) {
                            //在页面中删除选中的数据
                            for (var i in $array) {
                                $array[i].remove();

                            }
                            layer.msg("批量删除成功！", {time: 1000, icon: 1});
                            $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                        } else if (data.code == "-2") {
                            //没有访问权限
                            layui.use("layer", function () {
                                var layer = layui.layer;
                                layer.msg("访问权限已失效,请重新登录", {time: 1000, icon: 2}, function () {
                                    window.location.href = "/Managerbackground.html";
                                });
                                $("div[id^='layui-layer']").css({
                                    "width": "",
                                    "z-index": "99999999999"
                                });
                            });

                        } else {
                            layui.use("layer", function () {
                                var layer = layui.layer;
                                layer.msg(data.message, {time: 1000, icon: 2}, function () {

                                });
                                $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                            });
                        }
                    }, error: function (XMLHttpRequest) {

                        layui.use("layer", function () {
                            var layer = layui.layer;
                            layer.msg("批量删除失败", {time: 1000, icon: 2}, function () {

                            });
                            $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                        });
                        console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);
                    }
                });


                layer.close(id);
            });
        });
    });

    //常见问题中添加按钮绑定函数
    $("#CommonProblem > p:first #btn41").click(function () {
        layui.use("layer", function () {
            var layer = layui.layer;
            layer.prompt({title: '添加一篇文章,请输入标题', formType: 2, value: '', maxlength: 30}, function (value, id) {
                value = value.trim();
                var all_arry = get_all_title1();//获取公司动态所有的文章
                if (all_arry.indexOf(value) != -1) {
                    layer.msg("标题已经存在！", {time: 1000, icon: 2});
                    $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                } else {
                    deleteEditor("CommonProblem_content");
                    $("#textarea2").Editor();
                    CommonProblem_sign = true;
                    $("#CommonProblem_content > h1").text(value);
                    $("#textarea2").Editor("setText", "");
                    show_id("CommonProblem_content");
                }
                layer.close(id);
            })
        });
    });


//把文章的id和标题存起来
    function get_all_array1() {
        var all_arry = {};//把文章的id和标题存起来
        var id;
        $("#CommonProblem >ul >li").each(function () {
            var $parent = $(this);
            id = $(this).find("span:last").text();
            var text = $(this).find("span:first").text();
            var content = {"text": text, "dom": $parent};
            all_arry[id] = content;
        });
        return all_arry;
    }

    //把文章的标题存起来
    function get_all_title1() {
        var all_arry = [];
        $("#CommonProblem >ul >li").each(function () {
            var text = $(this).find("span:first").text();
            all_arry[all_arry.length] = text;
        });
        return all_arry;
    }

    //常见问题中查找确定按钮绑定函数
    $("#CommonProblem > p:first #btn61").click(function () {
        var value = $(this).prev().val().trim();
        if (value == "") {
            layui.use("layer", function () {

                var layer = layui.layer;
                layer.msg("查找内容不能为空！", {time: 1000, icon: 2});
                $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
            })
        } else {
            var all_arry = get_all_array1();
            for (var i in all_arry) {
                if ((all_arry[i].text).indexOf(value) >= 0) {
                    all_arry[i].dom.show("3000");
                }
                else {
                    all_arry[i].dom.hide("3000");
                }
            }

        }
    });


    function init_CommonProblem() {
        //点击标题
        $("#CommonProblem > ul >li").each(function () {
            $(this).find("span:first").click(function () {
                deleteEditor("CommonProblem_content");
                $("#textarea2").Editor();
                var text = $(this).text();
                var id = $(this).next().text().trim();
                var content = "";//从数据库中获取
                $.ajax({
                    url: "get_CommonProblem_contentByID",
                    type: "post",
                    dataType: "json",
                    data: {id: id},
                    success: function (data) {
                        if (data.code == 0) {
                            CommonProblem_sign = false;
                            content = data.data;
                            $("#CommonProblem_content > h1").text(text);
                            $("#CommonProblem_content > span").text(id);
                            CommonProblem_content = content.trim();
                            $("#textarea2").Editor("setText", content);
                            show_id("CommonProblem_content");
                        } else if (data.code == "-2") {
                            //没有访问权限
                            layui.use("layer", function () {
                                var layer = layui.layer;
                                layer.msg("访问权限已失效,请重新登录", {time: 1000, icon: 2}, function () {
                                    window.location.href = "/Managerbackground.html";
                                });
                                $("div[id^='layui-layer']").css({
                                    "width": "",
                                    "z-index": "99999999999"
                                });
                            });

                        } else {
                            layui.use("layer", function () {
                                var layer = layui.layer;
                                layer.msg(data.message, {time: 1000, icon: 2}, function () {

                                });
                                $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                            });
                        }
                    },
                    error: function (XMLHttpRequest) {
                        layui.use("layer", function () {
                            var layer = layui.layer;
                            layer.msg("文章内容获取失败", {time: 1000, icon: 2}, function () {

                            });
                            $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                        });
                        console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);

                    }
                });
            });
        });
        //常见问题中全选按钮绑定函数
        $("#CommonProblem > p:first #btn11").click(function () {
            $("#CommonProblem >ul >li").each(function () {
                var $this = $(this).find(">input:first");
                $this.prop("checked", "checked");
            });
        });
        //常见问题中取消按钮绑定函数
        $("#CommonProblem > p:first #btn21").click(function () {
            $("#CommonProblem >ul >li").each(function () {
                var $this = $(this).find(">input:first");
                $this.removeAttr("checked");
            });
        });

        //常见问题中刷新按钮绑定函数
        $("#CommonProblem >p span:last-child").click(function () {
            $("#CommonProblem >ul >li").each(function () {
                $(this).show("3000");
            });
        });

        //常见问题中编辑按钮绑定函数
        $("#CommonProblem > ul >li").each(function () {
            $(this).find("> input:nth-last-child(2)").click(function (e) {
                e.preventDefault();
                e.stopPropagation();
                var $id = $(this).prev();
                var $text = $id.prev();
                layui.use('layer', function () {
                    var layer = layui.layer;
                    layer.prompt({
                        title: '修改ID为 [' + $id.text() + '] 的标题',
                        formType: 2,
                        value: $text.text()
                    }, function (value, index) {
                        value = value.trim();
                        var all_arry = get_all_title1();//获取公司动态所有的文章
                        if (all_arry.indexOf(value) != -1) {
                            if ($text.text().trim() == value) {
                                layer.close(index);
                            } else {
                                layer.msg("标题已经存在！", {time: 1000, icon: 2});
                                $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                            }
                        } else {
                            //修改数据库中的数据
                            $.ajax({
                                url: "update_CommonProblem_tilteById",
                                type: "put",
                                dataType: "json",
                                data: {id: $id.text(), title: value},
                                success: function (data) {
                                    if (data.code == 0) {
                                        //修改页面的数据
                                        $text.text(value);
                                        layer.msg('修改成功', {time: 1000, icon: 1});
                                        $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});

                                    } else if (data.code == "-2") {
                                        //没有访问权限
                                        layui.use("layer", function () {
                                            var layer = layui.layer;
                                            layer.msg("访问权限已失效,请重新登录", {time: 1000, icon: 2}, function () {
                                                window.location.href = "/Managerbackground.html";
                                            });
                                            $("div[id^='layui-layer']").css({
                                                "width": "",
                                                "z-index": "99999999999"
                                            });
                                        });

                                    } else {
                                        layui.use("layer", function () {
                                            var layer = layui.layer;
                                            layer.msg(data.message, {time: 1000, icon: 2}, function () {

                                            });
                                            $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                                        });
                                    }
                                },
                                error: function (XMLHttpRequest) {
                                    layui.use("layer", function () {
                                        var layer = layui.layer;
                                        layer.msg("文章内容修改失败", {time: 1000, icon: 2}, function () {

                                        });
                                        $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                                    });
                                    console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);

                                }
                            })
                            layer.close(index);
                        }

                    })
                });
            })

        });

        //常见问题中删除按钮绑定函数

        $("#CommonProblem > ul >li").each(function () {
            var $parent = $(this);
            $(this).find("> input:last").click(function (e) {
                e.preventDefault();
                e.stopPropagation();
                var $id = $(this).prev().prev();
                var $text = $id.prev();
                layui.use("layer", function () {
                    var layer = layui.layer;
                    layer.confirm('确定删除标题为 [' + $text.text() + '] 的文章吗？', {
                        btn: ['确定', '取消'],
                        title: '提示',
                        icon: 2
                    }, function (index) {
                        var id = $id.text().trim();
                        $.ajax({
                            url: "delete_one_CommonProblemById/" + id,
                            type: "delete",
                            dataype: "json",
                            success: function (data) {
                                if (data.code == 0) {
                                    $parent.remove();
                                    layer.msg('删除成功', {time: 1000, icon: 1});
                                    $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                                } else if (data.code == "-2") {
                                    //没有访问权限
                                    layui.use("layer", function () {
                                        var layer = layui.layer;
                                        layer.msg("访问权限已失效,请重新登录", {time: 1000, icon: 2}, function () {
                                            window.location.href = "/Managerbackground.html";
                                        });
                                        $("div[id^='layui-layer']").css({
                                            "width": "",
                                            "z-index": "99999999999"
                                        });
                                    });

                                } else {
                                    layui.use("layer", function () {
                                        var layer = layui.layer;
                                        layer.msg(data.message, {time: 1000, icon: 2}, function () {

                                        });
                                        $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                                    });
                                }

                            },
                            error: function (XMLHttpRequest) {
                                layui.use("layer", function () {
                                    var layer = layui.layer;
                                    layer.msg("删除失败", {time: 1000, icon: 2}, function () {

                                    });
                                    $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                                });
                                console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);

                            }
                        });

                        layer.close(index);
                    });
                })
            })
        });
    }

//常见问题对应标题的文章内容
    //初始化textarea2(在线编辑)
    // $("#textarea2").Editor();
    //点击提交
    $("#CommonProblem_content").find("button:nth-last-child(2)").click(function () {
        layui.use('layer', function () {
            var layer = layui.layer;
            layer.confirm('确定提交?', {
                btn: ['确认', '取消'], title: '提示', icon: 3
            }, function (index) {
                var text = $("#textarea2").Editor("getText").trim();
                if (text == "") {
                    layui.use('layer', function () {
                        var layer = layui.layer;
                        layer.msg("内容不能为空", {time: 1000, icon: 2});
                        $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                    });
                } else {
                    var title = $("#CommonProblem_content >h1:first").text();
                    if (CommonProblem_sign == true)//添加文章
                    {
                        $.ajax({
                            url: "add_one_CommonProblem",
                            type: "post",
                            dataType: "json",
                            data: {"title": title, "content": text},
                            success: function (data) {
                                if (data.code == "0") {
                                    layui.use("layer", function () {
                                        var layer = layui.layer;
                                        layer.msg("添加成功", {time: 1000, icon: 1}, function () {
                                            get_company_Enterprises(1);
                                            show_id("CommonProblem");
                                        });
                                        $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                                    });
                                } else if (data.code == "-2") {
                                    //没有访问权限
                                    layui.use("layer", function () {
                                        var layer = layui.layer;
                                        layer.msg("访问权限已失效,请重新登录", {time: 1000, icon: 2}, function () {
                                            window.location.href = "/Managerbackground.html";
                                        });
                                        $("div[id^='layui-layer']").css({
                                            "width": "",
                                            "z-index": "99999999999"
                                        });
                                    });

                                }
                                else {
                                    layui.use("layer", function () {
                                        var layer = layui.layer;
                                        layer.msg(data.message, {time: 1000, icon: 2}, function () {

                                        });
                                        $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                                    });
                                }
                            },
                            error: function (XMLHttpRequest) {
                                layui.use("layer", function () {
                                    var layer = layui.layer;
                                    layer.msg("添加失败", {time: 1000, icon: 2}, function () {

                                    });
                                    $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                                });
                                console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);
                            }
                        });
                    } else {//修改文章内容
                        var id = $("#CommonProblem_content >span:first").text().trim();
                        $.ajax({
                            url: "update_one_CommonProblem_contentByID",
                            type: "put",
                            dataType: "json",
                            data: {id: id, content: text},
                            success: function (data) {
                                if (data.code == 0) {
                                    layui.use("layer", function () {
                                        var layer = layui.layer;
                                        layer.msg("修改成功", {time: 1000, icon: 1}, function () {
                                            get_company_Enterprises(1);
                                            show_id("CommonProblem");
                                        });
                                        $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                                    });
                                } else if (data.code == "-2") {
                                    //没有访问权限
                                    layui.use("layer", function () {
                                        var layer = layui.layer;
                                        layer.msg("访问权限已失效,请重新登录", {time: 1000, icon: 2}, function () {
                                            window.location.href = "/Managerbackground.html";
                                        });
                                        $("div[id^='layui-layer']").css({
                                            "width": "",
                                            "z-index": "99999999999"
                                        });
                                    });

                                } else {
                                    layui.use("layer", function () {
                                        var layer = layui.layer;
                                        layer.msg(data.message, {time: 1000, icon: 2}, function () {

                                        });
                                        $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                                    });
                                }

                            }, error: function (XMLHttpRequest) {
                                layui.use("layer", function () {
                                    var layer = layui.layer;
                                    layer.msg("修改失败", {time: 1000, icon: 2}, function () {

                                    });
                                    $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                                });
                                console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);

                            }
                        })
                    }
                }


                layer.close(index);
            }, function () {

            });
        });
    });
    //点击返回
    $("#CommonProblem_content").find("button:last").click(function () {
        var current_content = $("#textarea2").Editor("getText").trim();
        if (current_content == CommonProblem_content) {
            show_id("CommonProblem");
        }
        else {
            layui.use("layer", function () {
                var layer = layui.layer;
                layer.confirm("没保存，继续编辑吗？", {btn: ['继续', '返回'], icon: 3, title: "提示"}, function (index) {
                    layer.close(index);
                }, function (index) {
                    show_id("CommonProblem");
                    layer.close(index);

                });
            });
        }
    })

    $("#contact .form-group div input").focusin(function () {
        $(this).prev().css("color", "rgb(102, 175, 233)");
    });
    $("#contact .form-group div input").focusout(function () {
        $(this).prev().css("color", "#555");
    });
//自定义手机号码验证
    $.validator.addMethod("IsTelNumber", function () {
        var value = arguments[0];
        var element = arguments[1];
        var length = value.length;
        var mobile = /^1[0-9]{10}$/;
        return this.optional(element) || (length == 11 && mobile.test(value));
    }, "请正确填写您的手机号码,开头为1,位数为11位");

//联系我们验证表单
    $("#contact").validate({
        rules: {
            "bussiness_name": {
                required: true,
                rangelength: [1, 40]
            },
            "address": {
                required: true,
                rangelength: [1, 100]
            },
            "business_tel": {
                required: true,
                IsTelNumber: $("#business_tel").val().trim()
            },
            "business_tel1": {
                IsTelNumber: $("#business_tel1").val().trim()
            }, "business_boss": {
                required: true,
                rangelength: [2, 40]
            }
        }, messages: {
            "bussiness_name": {
                required: "企业名称不能为空",
                rangelength: "企业名称的长度最大为40"
            },
            "address": {
                required: "详细地址不能为空",
                rangelength: "详细地址的长度最大为100"
            },
            "business_tel": {
                required: "手机号码必须填写",
            },
            "business_boss": {
                required: "联系人姓名必须填写",
                rangelength: "联系人姓名长度最小为1最大为40"
            }
        }

    });

    //获取联系我们的信息
    function get_contact() {
        $.ajax({
            url: "getContact",
            type: "post",
            dataType: "json",
            success: function (data) {
                layui.use("layer", function () {

                    var layer = layui.layer;
                    if (data.code == 0) {
                        var contact = data.data;
                        $('#distpicker').distpicker("destroy");
                        if (contact == null)
                            $('#distpicker').distpicker({
                                placeholder: false
                            });
                        if (contact != null) {
                            $("#bussiness_name").val(contact.bussinessName);
                            // $("#distpicker >select:nth-child(1)").val(contact.provine);
                            // $("#distpicker >select:nth-child(2)").val(contact.city);
                            // $("#distpicker >select:nth-child(3)").val(contact.area);

                            //初始化地址
                            $("#distpicker").distpicker({
                                placeholder: false,//是否显示占位符
                                province: contact.provine,
                                city: contact.city,
                                district: contact.area
                            });
                            $("#Detailed_address").val(contact.detailedAddress);
                            $("#business_tel").val(contact.telPhone);
                            $("#business_tel1").val(contact.spareTelPhone);
                            $("#business_boss").val(contact.businessBoss);

                        }
                    } else if (data.code == "-2") {
                        //没有访问权限
                        layui.use("layer", function () {
                            var layer = layui.layer;
                            layer.msg("访问权限已失效,请重新登录", {time: 1000, icon: 2}, function () {
                                window.location.href = "/Managerbackground.html";
                            });
                            $("div[id^='layui-layer']").css({
                                "width": "",
                                "z-index": "99999999999"
                            });
                        });

                    }
                });
            },
            error: function (XMLHttpRequest) {
                layui.use("layer", function () {
                    var layer = layui.layer;
                    layer.msg("获取数据失败", {time: 1000, icon: 2}, function () {

                    });
                    $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                });
                console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);


            }
        })
    }

//提交表单
    $("#contact").find("input:nth-last-child(2)").click(function (e) {
        if ($("#contact").valid() == false) {
            return false;
        }
        var bussiness_name = $("#bussiness_name").val().trim();
        var province = $("#distpicker >select:nth-child(1)").val().trim();
        var city = $("#distpicker >select:nth-child(2)").val().trim();
        var area = $("#distpicker >select:nth-child(3)").val().trim();
        var Detailed_address = $("#Detailed_address").val().trim();
        var tel_phone = $("#business_tel").val().trim();
        var Spare_tel_phone = $("#business_tel1").val().trim();
        var business_boss = $("#business_boss").val().trim();
        var data;
        if (Spare_tel_phone == "") {
            data = {
                "BussinessName": bussiness_name,
                "provine": province,
                "city": city,
                "area": area,
                "DetailedAddress": Detailed_address,
                "telPhone": tel_phone,
                "BusinessBoss": business_boss
            };
        }
        else {
            data = {
                "BussinessName": bussiness_name,
                "provine": province,
                "city": city,
                "area": area,
                "DetailedAddress": Detailed_address,
                "telPhone": tel_phone,
                "SpareTelPhone": Spare_tel_phone,
                "BusinessBoss": business_boss
            };
        }

        $.ajax({
            url: "addContact",
            type: "post",
            dataType: "json",
            data: data,
            success: function (data) {

                layui.use("layer", function () {
                    var layer = layui.layer;
                    if (data.code == 0) {
                        layer.msg("提交成功", {time: 1000, icon: 1});
                        $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                    } else if (data.code == "-2") {
                        //没有访问权限
                        layui.use("layer", function () {
                            var layer = layui.layer;
                            layer.msg("访问权限已失效,请重新登录", {time: 1000, icon: 2}, function () {
                                window.location.href = "/Managerbackground.html";
                            });
                            $("div[id^='layui-layer']").css({
                                "width": "",
                                "z-index": "99999999999"
                            });
                        });

                    }
                    else {
                        layer.msg(data.message, {time: 1000, icon: 2});
                        $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                    }
                });
            },
            error: function (XMLHttpRequest) {
                layui.use("layer", function () {
                    var layer = layui.layer;
                    layer.msg("提交失败", {time: 1000, icon: 2}, function () {

                    });
                    $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                });
                console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);
            }
        })
        return false;
    });


    //获取客户实例的数量
    function getNumberCustomerInstances() {
        $("#input_page").val("0");
        $("#CustomerInstance .customer").remove();
        $("#ampaginationlg-bootstrap").hide();
        $("#page_skip").hide();
        $.ajax({
            url: "getCountCustomerInstancesByType",
            type: "post",
            dataType: "json",
            success: function (data) {
                layui.use("layer", function () {
                    var layer = layui.layer;
                    if (data.code == 0) {
                        var number = data.data;
                        getCustomerInstances(number);
                    } else if (data.code == "-2") {
                        //没有访问权限
                        layui.use("layer", function () {
                            var layer = layui.layer;
                            layer.msg("访问权限已失效,请重新登录", {time: 1000, icon: 2}, function () {
                                window.location.href = "/Managerbackground.html";
                            });
                            $("div[id^='layui-layer']").css({
                                "width": "",
                                "z-index": "99999999999"
                            });
                        });

                    } else {
                        layer.msg(data.message, {time: 1000, icon: 2}, function () {

                        });
                        $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                    }

                });

            },
            error: function (XMLHttpRequest) {
                layui.use("layer", function () {
                    var layer = layui.layer;
                    layer.msg("获取数据失败", {time: 1000, icon: 2}, function () {

                    });
                    $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                });
                console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);

            }
        })

    }

    function GetShowTime(date) {
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hour = date.getHours();
        var minutes = date.getMinutes();
        var second = date.getSeconds();
        var show_date = year + "-" + month + "-" + day + " " + hour + ":" + minutes + ":" + second;
        return show_date;
    };

    //显示用户实例到页面
    function showCustomerInstances(result1) {
        $("#CustomerInstance .customer").remove();
        for (var i in result1) {
            var result = result1[i];
            var id = result.id;
            var name = result.name;
            var telPhone = result.telPhone;
            var date = GetShowTime(new Date(result.date));
            var image = result.image;
            var path = result.path;
            if (telPhone == "" || telPhone == null)
                telPhone = "无";
            var $li = $("<li class=\"customer\">\n" +
                "                        <div style=\"float: left; margin-left: -17px;padding: 17px;\">\n" +
                "                            <img src=" + image + " href=\"#\" title=\"永泉农庄\" class=\"customer_img\" alt=\"图片\">\n" +
                "                        </div>\n" +
                "                        <div style=\"padding: 17px;line-height: 27px;\">\n" +
                "                            <div><span class=\"sr-only\">" + id + "</span><h4 style=\"font-weight: bold;font-size: 20px;float:left\">" + name + "</h4>\n" +
                "                                <span>联系电话:</span><label>" + telPhone + "</label><span>发布时间:</span>\n" +
                "                                <label style=\"font-family: initial;\">" + date + "</label>\n" +
                "                            </div>\n" +
                "                            <p style=\"max-height: 117px;overflow-y: auto;margin-top: 9px;width: 819px;word-break: break-all;\">客户评价:" + path + "\n" +
                "                        </div>\n" +
                "                        <button class=\"btn btn-warning\">删除</button>\n" +
                "                    </li>");
            $("#ampaginationlg-bootstrap").before($li);
        }
        //点击客户实例的删除按钮
        $("#CustomerInstance .customer button:last-child").click(function () {
            var id = $(this).prev().find("div:first span:first").text().trim();
            var name = $(this).prev().find("div:first h4").text().trim();
            var time = $(this).prev().find("div:first label:last").text().trim();
            layui.use("layer", function () {
                var layer = layui.layer;
                layer.confirm("确认删除 [" + name + "] 在 [" + time + "] 发布的评价吗?", {
                        btn: ['确定', '取消'],
                        title: "删除提示",
                        icon: 3
                    },
                    function (index) {
                        //数据库通过id删除
                        $.ajax({
                            url: "deleteOneCustomerInstance",
                            type: "post",
                            dataType: "json",
                            data: {id: id},
                            success: function (data) {

                                layui.use("layer", function () {
                                    var layer = layui.layer;

                                    if (data.code == 0) {
                                        var page1 = $("#ampaginationlg-bootstrap li[class='active']").find("a").text().trim();
                                        page = page1 - 1;
                                        $(".layui-side > .layui-side-scroll > .layui-nav >li:nth-child(2)").click();

                                        layer.msg("删除成功", {time: 1000, icon: 1}, function () {
                                        });
                                        $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                                    } else if (data.code == "-2") {
                                        //没有访问权限
                                        layui.use("layer", function () {
                                            var layer = layui.layer;
                                            layer.msg("访问权限已失效,请重新登录", {time: 1000, icon: 2}, function () {
                                                window.location.href = "/Managerbackground.html";
                                            });
                                            $("div[id^='layui-layer']").css({
                                                "width": "",
                                                "z-index": "99999999999"
                                            });
                                        });

                                    }


                                });
                            },
                            error: function (XMLHttpRequest) {

                                layui.use("layer", function () {
                                    var layer = layui.layer;
                                    layer.msg("删除失败", {time: 1000, icon: 2}, function () {

                                    });
                                    $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                                });
                                console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);
                            }
                        })
                        layer.close(index);

                    });

            });
        });
    }

//获取客户实例的信息
    function getCustomerInstances(number) {

        var size = 3;//jpa页码从0开始,每页默认展示3个客户实例

        if (page >= (Math.ceil(number / size) - 1)) {
            page = (Math.ceil(number / size) - 1);
        }
        $.ajax({
            url: "GetCustomerInstancesBypage",
            type: "post",
            dataType: "json",
            data: {page: page, size: size},
            success: function (data) {
                layui.use("layer", function () {
                    var layer = layui.layer;
                    if (data.code == 0) {
                        var result1 = data.data;
                        //显示用户实例到页面
                        showCustomerInstances(result1);
                        //分页初始化
                        $("#input_page").val(page + 1);
                        var pagerlg = jQuery('#ampaginationlg-bootstrap').pagination({
                            page: page + 1,
                            totals: number,
                            pageSize: size,//一页显示几个
                            theme: 'bootstrap',
                            btnSize: 'lg'
                        })
                            .onChangePage(function (e) {
                                $("#input_page").val(e.page);
                                //分页跳转
                                $.ajax({
                                    url: "GetCustomerInstancesBypage",
                                    type: "post",
                                    dataType: "json",
                                    data: {page: e.page - 1, size: size},
                                    success: function (data) {

                                        layui.use("layer", function () {
                                            var layer = layui.layer;
                                            if (data.code == 0) {
                                                var result = data.data;
                                                //显示用户实例到页面
                                                showCustomerInstances(result);
                                            } else if (data.code == "-2") {
                                                //没有访问权限
                                                layui.use("layer", function () {
                                                    var layer = layui.layer;
                                                    layer.msg("访问权限已失效,请重新登录", {time: 1000, icon: 2}, function () {
                                                        window.location.href = "/Managerbackground.html";
                                                    });
                                                    $("div[id^='layui-layer']").css({
                                                        "width": "",
                                                        "z-index": "99999999999"
                                                    });
                                                });

                                            } else {
                                                layer.msg(data.message, {time: 1000, icon: 2}, function () {

                                                });
                                                $("div[id^='layui-layer']").css({
                                                    "width": "",
                                                    "z-index": "99999999999"
                                                });
                                            }

                                        });
                                    },
                                    error: function (XMLHttpRquest) {
                                        layui.use("layer", function () {
                                            var layer = layui.layer;
                                            layer.msg("获取数据失败", {time: 1000, icon: 2}, function () {

                                            });
                                            $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                                        });
                                        console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);
                                    }
                                })


                            });
                        //点击分页跳转确认按钮
                        $("#page_btn").click(function () {
                            var page = $("#input_page").val().trim();
                            if (page != "" && page > 0 && page <= Math.ceil(pagerlg.totals / pagerlg.pageSize)) {
                                var opts = {page: page};
                                pagerlg.render(opts);
                            }
                        });

                        //如果按下enter键就直接跳转
                        $("#input_page").keydown(function (event) {
                            var keyNum = (navigator.appName = "Netscape") ? event.which : window.event.keyCode;
                            if (keyNum == 13) {
                                var msg = $(this).val();
                                $("#page_btn").click();
                            }

                        });
                        //输入跳转页数的判断错误函数
                        $("#input_page").keyup(function () {
                            var content = $(this).val().trim();
                            if (isNaN(content)) {
                                var change_content = content.replace(/\D/, "");
                                $(this).val(change_content);
                            }
                            else {

                                if (content != "" && content > 0) {
                                    if (content <= Math.ceil(pagerlg.totals / pagerlg.pageSize)) {

                                    }
                                    else {
                                        var change_text = content.slice(0, content.length - 1);
                                        $(this).val(change_text);
                                    }
                                } else {
                                    $(this).val($("#ampaginationlg-bootstrap li[class='active']").find("a").text().trim());
                                }
                            }
                        });
                        $("#input_page").focusout(function () {
                            if ($(this).val() == "") {
                                $(this).val($("#ampaginationlg-bootstrap li[class='active']").find("a").text().trim());
                                //当前的页数
                            }
                        });
                        $("#ampaginationlg-bootstrap").show();
                        $("#page_skip").show();

                    } else {
                        layer.msg(data.message, {time: 1000, icon: 2}, function () {

                        });
                        $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                    }

                });

            },
            error: function (XMLHttpRequest) {
                layui.use("layer", function () {
                    var layer = layui.layer;
                    layer.msg("获取数据失败", {time: 1000, icon: 2}, function () {

                    });
                    $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                });
                console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);

            }

        })
    }


    //获取客户评价的数量
    function getNumberCustomerEvaluations() {
        $("#input_page1").val("0");
        $("#CustomerEvaluation .customer").remove();
        $("#ampaginationlg-bootstrap1").hide();
        $("#page_skip1").hide();
        $.ajax({
            url: "getCountCustomerEvaluationsByType",
            type: "post",
            dataType: "json",
            success: function (data) {
                layui.use("layer", function () {
                    var layer = layui.layer;
                    if (data.code == 0) {
                        var number = data.data;
                        getCustomerEvaluations(number);
                    } else if (data.code == "-2") {
                        //没有访问权限
                        layui.use("layer", function () {
                            var layer = layui.layer;
                            layer.msg("访问权限已失效,请重新登录", {time: 1000, icon: 2}, function () {
                                window.location.href = "/Managerbackground.html";
                            });
                            $("div[id^='layui-layer']").css({
                                "width": "",
                                "z-index": "99999999999"
                            });
                        });

                    } else {
                        layer.msg(data.message, {time: 1000, icon: 2}, function () {

                        });
                        $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                    }

                });

            },
            error: function (XMLHttpRequest) {
                layui.use("layer", function () {
                    var layer = layui.layer;
                    layer.msg("获取数据失败", {time: 1000, icon: 2}, function () {

                    });
                    $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                });
                console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);

            }
        })

    }

    //显示用户评价到页面
    function showCustomerEvaluations(result1) {
        $("#CustomerEvaluation .customer").remove();
        for (var i in result1) {
            var result = result1[i];
            var id = result.id;
            var name = result.name;
            var telPhone = result.telPhone;
            var date = GetShowTime(new Date(result.date));
            var image = result.image;
            var path = result.path;
            if (telPhone == "" || telPhone == null)
                telPhone = "无";
            var $li = $("<li class=\"customer\">\n" +
                "                        <div style=\"float: left; margin-left: -17px;padding: 17px;\">\n" +
                "                            <img src=" + image + " href=\"#\" title=\"永泉农庄\" class=\"customer_img\" alt=\"图片\">\n" +
                "                        </div>\n" +
                "                        <div style=\"padding: 17px;line-height: 27px;\">\n" +
                "                            <div><span class=\"sr-only\">" + id + "</span><h4 style=\"font-weight: bold;font-size: 20px;float:left\">" + name + "</h4>\n" +
                "                                <span>联系电话:</span><label>" + telPhone + "</label><span>发布时间:</span>\n" +
                "                                <label style=\"font-family: initial;\">" + date + "</label>\n" +
                "                            </div>\n" +
                "                            <p style=\"max-height: 117px;overflow-y: auto;margin-top: 9px;width: 780px;word-break: break-all;\">客户评价:" + path + "\n" +
                "                        </div>\n" +
                "                       <button class='btn btn-info'>通过审核</button> <button class=\"btn btn-warning\">删除</button>\n" +
                "                    </li>");
            $("#ampaginationlg-bootstrap1").before($li);
        }
        //点击客户评价的删除按钮
        $("#CustomerEvaluation .customer button:last-child").click(function () {
            var id = $(this).prev().prev().find("div:first span:first").text().trim();
            var name = $(this).prev().prev().find("div:first h4").text().trim();
            var time = $(this).prev().prev().find("div:first label:last").text().trim();
            layui.use("layer", function () {
                var layer = layui.layer;
                layer.confirm("确认删除 [" + name + "] 在 [" + time + "] 发布的评价吗?", {
                        btn: ['确定', '取消'],
                        title: "删除提示",
                        icon: 3
                    },
                    function (index) {
                        //数据库通过id删除
                        $.ajax({
                            url: "deleteOneCustomerInstance",
                            type: "post",
                            dataType: "json",
                            data: {id: id},
                            success: function (data) {

                                layui.use("layer", function () {
                                    var layer = layui.layer;

                                    if (data.code == 0) {
                                        var page1 = $("#ampaginationlg-bootstrap1 li[class='active']").find("a").text().trim();
                                        CustomerEvaluationPage = page1 - 1;
                                        $(".layui-side > .layui-side-scroll > .layui-nav >li:nth-child(6)").click();

                                        layer.msg("删除成功", {time: 1000, icon: 1}, function () {
                                        });
                                        $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                                    } else if (data.code == "-2") {
                                        //没有访问权限
                                        layui.use("layer", function () {
                                            var layer = layui.layer;
                                            layer.msg("访问权限已失效,请重新登录", {time: 1000, icon: 2}, function () {
                                                window.location.href = "/Managerbackground.html";
                                            });
                                            $("div[id^='layui-layer']").css({
                                                "width": "",
                                                "z-index": "99999999999"
                                            });
                                        });

                                    }


                                });
                            },
                            error: function (XMLHttpRequest) {

                                layui.use("layer", function () {
                                    var layer = layui.layer;
                                    layer.msg("删除失败", {time: 1000, icon: 2}, function () {

                                    });
                                    $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                                });
                                console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);
                            }
                        })
                        layer.close(index);

                    });

            });
        });


        //点击通过审核按钮
        $("#CustomerEvaluation .customer >button:nth-last-child(2)").click(function () {
            var id = $(this).prev().find("div:first span:first").text().trim();
            var name = $(this).prev().find("div:first h4").text().trim();
            var time = $(this).prev().find("div:first label:last").text().trim();
            layui.use("layer", function () {
                var layer = layui.layer;
                layer.confirm("确认 [" + name + "] 在 [" + time + "] 发布的评价通过审核吗?", {
                        btn: ['确定', '取消'],
                        title: "提示",
                        icon: 3
                    },
                    function (index) {
                        //数据库通过id删除
                        $.ajax({
                            url: "setOneCustomerEvaluationType",
                            type: "post",
                            dataType: "json",
                            data: {id: id},
                            success: function (data) {

                                layui.use("layer", function () {
                                    var layer = layui.layer;
                                    if (data.code == 0) {
                                        var page1 = $("#ampaginationlg-bootstrap1 li[class='active']").find("a").text().trim();
                                        CustomerEvaluationPage = page1 - 1;
                                        $(".layui-side > .layui-side-scroll > .layui-nav >li:nth-child(6)").click();

                                        layer.msg("通过审核", {time: 1000, icon: 1}, function () {
                                        });
                                        $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                                    } else if (data.code == "-2") {
                                        //没有访问权限
                                        layui.use("layer", function () {
                                            var layer = layui.layer;
                                            layer.msg("访问权限已失效,请重新登录", {time: 1000, icon: 2}, function () {
                                                window.location.href = "/Managerbackground.html";
                                            });
                                            $("div[id^='layui-layer']").css({
                                                "width": "",
                                                "z-index": "99999999999"
                                            });
                                        });

                                    } else {
                                        layer.msg(data.message, {time: 1000, icon: 2}, function () {

                                        });
                                        $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});

                                    }


                                });
                            },
                            error: function (XMLHttpRequest) {

                                layui.use("layer", function () {
                                    var layer = layui.layer;
                                    layer.msg("审核通过失败", {time: 1000, icon: 2}, function () {

                                    });
                                    $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                                });
                                console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);
                            }
                        })
                        layer.close(index);

                    });

            });
        });
    }

//获取客户实例的信息
    function getCustomerEvaluations(number) {

        var size = 3;//jpa页码从0开始,每页默认展示3个客户实例

        if (CustomerEvaluationPage >= (Math.ceil(number / size) - 1)) {
            CustomerEvaluationPage = (Math.ceil(number / size) - 1);
        }
        $.ajax({
            url: "GetCustomerEvaluationsBypage",
            type: "post",
            dataType: "json",
            data: {page: CustomerEvaluationPage, size: size},
            success: function (data) {
                layui.use("layer", function () {
                    var layer = layui.layer;
                    if (data.code == 0) {
                        var result1 = data.data;
                        //显示用户实例到页面
                        showCustomerEvaluations(result1);
                        //分页初始化
                        $("#input_page1").val(CustomerEvaluationPage + 1);
                        var pagerlg = jQuery('#ampaginationlg-bootstrap1').pagination({
                            page: CustomerEvaluationPage + 1,
                            totals: number,
                            pageSize: size,//一页显示几个
                            theme: 'bootstrap',
                            btnSize: 'lg'
                        })
                            .onChangePage(function (e) {
                                $("#input_page1").val(e.page);
                                //分页跳转
                                $.ajax({
                                    url: "GetCustomerEvaluationsBypage",
                                    type: "post",
                                    dataType: "json",
                                    data: {page: e.page - 1, size: size},
                                    success: function (data) {

                                        layui.use("layer", function () {
                                            var layer = layui.layer;
                                            if (data.code == 0) {
                                                var result = data.data;
                                                //显示用户实例到页面
                                                showCustomerEvaluations(result);
                                            } else if (data.code == "-2") {
                                                //没有访问权限
                                                layui.use("layer", function () {
                                                    var layer = layui.layer;
                                                    layer.msg("访问权限已失效,请重新登录", {time: 1000, icon: 2}, function () {
                                                        window.location.href = "/Managerbackground.html";
                                                    });
                                                    $("div[id^='layui-layer']").css({
                                                        "width": "",
                                                        "z-index": "99999999999"
                                                    });
                                                });

                                            } else {
                                                layer.msg(data.message, {time: 1000, icon: 2}, function () {

                                                });
                                                $("div[id^='layui-layer']").css({
                                                    "width": "",
                                                    "z-index": "99999999999"
                                                });
                                            }

                                        });
                                    },
                                    error: function (XMLHttpRquest) {
                                        layui.use("layer", function () {
                                            var layer = layui.layer;
                                            layer.msg("获取数据失败", {time: 1000, icon: 2}, function () {

                                            });
                                            $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                                        });
                                        console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);
                                    }
                                })


                            });
                        //点击分页跳转确认按钮
                        $("#page_btn1").click(function () {
                            var page = $("#input_page1").val().trim();
                            if (page != "" && page > 0 && page <= Math.ceil(pagerlg.totals / pagerlg.pageSize)) {
                                var opts = {page: page};
                                pagerlg.render(opts);
                            }
                        });

                        //如果按下enter键就直接跳转
                        $("#input_page1").keydown(function (event) {
                            var keyNum = (navigator.appName = "Netscape") ? event.which : window.event.keyCode;
                            if (keyNum == 13) {
                                var msg = $(this).val();
                                $("#page_btn1").click();
                            }

                        });
                        //输入跳转页数的判断错误函数
                        $("#input_page1").keyup(function () {
                            var content = $(this).val().trim();
                            if (isNaN(content)) {
                                var change_content = content.replace(/\D/, "");
                                $(this).val(change_content);
                            }
                            else {

                                if (content != "" && content > 0) {
                                    if (content <= Math.ceil(pagerlg.totals / pagerlg.pageSize)) {

                                    }
                                    else {
                                        var change_text = content.slice(0, content.length - 1);
                                        $(this).val(change_text);
                                    }
                                } else {
                                    $(this).val($("#ampaginationlg-bootstrap1 li[class='active']").find("a").text().trim());
                                }
                            }
                        });
                        $("#input_page1").focusout(function () {
                            if ($(this).val() == "") {
                                $(this).val($("#ampaginationlg-bootstrap1 li[class='active']").find("a").text().trim());
                                //当前的页数
                            }
                        });
                        $("#ampaginationlg-bootstrap1").show();
                        $("#page_skip1").show();

                    } else {
                        layer.msg(data.message, {time: 1000, icon: 2}, function () {

                        });
                        $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                    }

                });

            },
            error: function (XMLHttpRequest) {
                layui.use("layer", function () {
                    var layer = layui.layer;
                    layer.msg("获取数据失败", {time: 1000, icon: 2}, function () {

                    });
                    $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                });
                console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);

            }

        })
    }

//添加产品中心的描述
    //初始化
    var ProductCenterContent = "";
    // $("#textarea3").Editor();
    //点击提交
    $("#ProductCenter >button:nth-last-child(2)").click(function () {
        layui.use("layer", function () {
            var layer = layui.layer;
            var type = $("#ProductCenter >span:first").text().trim();
            if (!isNaN(type) && type < 3) {
                var content = $("#textarea3").Editor("getText").trim();
                if (content == "") {
                    layer.msg("内容不能为空", {time: 1000, icon: 2});
                } else {
                    layer.confirm("确认提交吗", {btn: ['确认', '取消'], title: "提示", icon: 3}, function (index) {
                        $.ajax({
                            url: "save_ProductCenterfile",
                            type: "post",
                            dataType: "json",
                            data: {type: type, content: content},
                            success: function (data) {
                                if (data.code == 0) {
                                    layer.msg("提交成功", {time: 1000, icon: 1});
                                    var type1 = $("#ProductCenter >span:first").text();
                                    var array = ["Frog_seedling", "AdultFrog", "Frog"];
                                    var id = array[type1];
                                    show_id(id);
                                } else if (data.code == "-2") {
                                    //没有访问权限
                                    layui.use("layer", function () {
                                        var layer = layui.layer;
                                        layer.msg("访问权限已失效,请重新登录", {time: 1000, icon: 2}, function () {
                                            window.location.href = "/Managerbackground.html";
                                        });
                                        $("div[id^='layui-layer']").css({
                                            "width": "",
                                            "z-index": "99999999999"
                                        });
                                    });

                                } else {
                                    layer.msg(data.message, {time: 1000, icon: 2});
                                }
                            }, error: function (XMLHttpRequest) {
                                layer.msg("获取数据失败", {time: 1000, icon: 2});
                                console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);
                            }
                        });
                        layer.close(index);

                    })

                }
            } else {
                layer.msg("产品中心的类型不对", {time: 1000, icon: 2}, function () {

                });
            }
            $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
        });

    })
    //点击返回
    $("#ProductCenter >button:last").click(function () {
        var type = $("#ProductCenter >span:first").text();
        var array = ["Frog_seedling", "AdultFrog", "Frog"];
        var content = $("#textarea3").Editor("getText").trim();
        if (content == ProductCenterContent) {
            if (!isNaN(type) && type < array.length) {
                var id = array[type];
                show_id(id);
            }
        } else {
            layui.use("layer", function () {
                var layer = layui.layer;
                layer.confirm("没保存,继续编辑吗?", {btn: ['继续', '返回'], title: "提示", icon: 3}, function (index) {

                    layer.close(index);
                }, function (index) {
                    if (!isNaN(type) && type < array.length) {
                        var id = array[type];
                        show_id(id);
                    }
                    layer.close(index);
                })
                $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
            });
        }

    });

    //获取描述内容
    function getProductCenterContent(type) {
        deleteEditor("ProductCenter");
        $("#textarea3").Editor();
        $.ajax({
            url: "get_ProductCenterfile",
            type: "post",
            dataType: "json",
            data: {type: type},
            success: function (data) {
                layui.use("layer", function () {
                    var layer = layui.layer;
                    if (data.code == 0) {
                        var content = data.data;
                        $("#textarea3").Editor("setText", content);
                        ProductCenterContent = content;
                    } else if (data.code == 2) {//空的数据
                        $("#textarea3").Editor("setText", "");
                    } else if (data.code == "-2") {
                        //没有访问权限
                        layui.use("layer", function () {
                            var layer = layui.layer;
                            layer.msg("访问权限已失效,请重新登录", {time: 1000, icon: 2}, function () {
                                window.location.href = "/Managerbackground.html";
                            });
                            $("div[id^='layui-layer']").css({
                                "width": "",
                                "z-index": "99999999999"
                            });
                        });

                    }
                    else {
                        layer.msg("获取数据失败", {time: 1000, icon: 2}, function () {

                        });
                    }
                    $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                });


            }, error: function (XMLHttpRequest) {
                layui.use("layer", function () {
                    var layer = layui.layer;
                    layer.msg("获取数据失败", {time: 1000, icon: 2}, function () {

                    });
                    $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                });
                console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);
            }
        })
    }

    //添加蛙苗描述
    $("#Frog_seedling >a:first").click(function () {
        $("#ProductCenter >h1").text("蛙苗描述");
        $("#ProductCenter >span:first").text("0");
        getProductCenterContent(0);
        show_id("ProductCenter");
    });
    //添加成蛙描述
    $("#AdultFrog >a:first").click(function () {
        $("#ProductCenter >h1").text("成蛙描述");
        $("#ProductCenter >span:first").text("1");
        getProductCenterContent(1);
        show_id("ProductCenter");
    });
    //添加种蛙描述
    $("#Frog >a:first").click(function () {
        $("#ProductCenter >h1").text("种蛙描述");
        $("#ProductCenter >span:first").text("2");
        getProductCenterContent(2);
        show_id("ProductCenter");
    });
//点击退注销按钮
    $("#quit").click(function () {
        layui.use("layer", function () {
            var layer = layui.layer;
            layer.confirm("你确定要注销登录吗？", {btn: ['确定', '取消'], title: "警告", icon: 3}, function (index) {
                //删除cookie
                delete_cookie();
                //删除session(username和password)
                $.ajax({
                    url: "MangerQuitLogin",
                    type: "post",
                    dataType: "json",
                    success: function (data) {

                        layui.use("layer", function () {
                            var layer = layui.layer;

                            if (data.code == 0) {
                                $("#Shelteringlayer").show();
                                //隐藏管理员的信息导航条
                                $(".layui-header >ul >li:last").hide();
                                //显示登录导航条
                                $(".layui-header >ul >li:first").show();
                                //显示登录界面
                                $("#login_username").focus();
                                $("#login").show();
                                layer.close(index);
                            }

                            $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                        });


                    },
                    error: function (XMLHttpRequest) {
                        layui.use("layer", function () {
                            var layer = layui.layer;
                            layer.msg("删除session失败", {time: 1000, icon: 2}, function () {

                            });
                            $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                        });
                        console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);
                        layer.close(index);
                    }
                })

            })
        })
    });
    //点击退出按钮
    $("#leave").click(function () {
        layui.use("layer", function () {
            var layer = layui.layer;
            layer.confirm("你确定要退出吗？", {btn: ['确定', '取消'], title: "警告", icon: 3}, function (index) {
                //删除session(username和password)
                $.ajax({
                    url: "MangerQuitLogin",
                    type: "post",
                    dataType: "json",
                    success: function (data) {

                        layui.use("layer", function () {
                            var layer = layui.layer;
                            if (data.code == 0) {
                                $("#Shelteringlayer").show();
                                //隐藏管理员的信息导航条
                                $(".layui-header >ul >li:last").hide();
                                //显示登录导航条
                                $(".layui-header >ul >li:first").show();
                                //显示登录界面
                                $("#login_username").focus();
                                $("#login").show();
                                layer.close(index);
                            }

                            $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                        });


                    },
                    error: function (XMLHttpRequest) {
                        layui.use("layer", function () {
                            var layer = layui.layer;
                            layer.msg("删除session失败", {time: 1000, icon: 2}, function () {

                            });
                            $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                        });
                        console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);
                        layer.close(index);
                    }
                })

            })
        })
    });
    //表单验证
    $("#form_login").validate({
        rules: {
            "login_username": {
                required: true,
                rangelength: [4, 8]
            },
            "login_password": {
                required: true,
                rangelength: [6, 18]
            }
        },
        messages: {
            "login_username": {
                required: "用户名必须填写",
                rangelength: "用户名最小4位数，最大8位数"
            },
            "login_password": {
                required: "密码必须填写",
                rangelength: "密码最小为6位数，最大为18位数"
            }

        }
    })


    //删除cookie中的用户名和密码用户的类型
    function delete_cookie() {
        $.cookie("Manger_username", null, {path: "/"});
        $.cookie("Manger_password", null, {path: "/"});
        $.cookie("Manger_login", null, {path: "/"});
    }

//登录成功时把用户名和密码用户的类型存在cookie中
    function save_type_username_password() {
        var username = arguments[0];
        var password = arguments[1];
        if (username != null && password != null) {
            $.cookie("Manger_username", username, {path: "/", expires: 7});
            $.cookie("Manger_password", password, {path: "/", expires: 7});
        }
    }

    //登录成功将表单隐藏起来并且显示用户的名字
    function hide_loginModal() {
        var username = arguments[0];
        $(".layui-header >ul >li:first").hide();
        $("#login_message span:first").text(username);
        $(".layui-header >ul >li:last").show();
        $("#login").hide();
    }

    //从cookie中获取用户名获取用户名，密码，自动登录，如果自动登录存在，然后再访问数据库，如果正确则自动登录
    function get_type_usrname_password() {
        deleteMangerLoginStatus();
        var username, password;
        if ($.cookie("Manger_username")) {
            username = $.cookie("Manger_username");
        } else {
            $("#login_username").focus();
            $("#login_password").val("");
            $("#login").show();
            return;
        }

        if ($.cookie("Manger_password")) {
            password = $.cookie("Manger_password");
        } else {
            $("#login_username").focus();
            $("#login_password").val("");
            $("#login").show();
            return;
        }

        if ($.cookie("Manger_login")) {
            $.ajax({
                url: "MangerLoginValidate",
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
                                    $("#Shelteringlayer").hide();
                                    hide_loginModal(username);
                                    $(".layui-layout").show();
                                    deleteMangerLoginStatus();
                                });
                            }
                        } else {
                            delete_cookie();
                            layer.msg('账号失效,请重新登录', {time: 1000, title: "错误提示", icon: 2});
                            $("#Shelteringlayer").show();
                            $("#login_password").val("");
                            $("#save_password").removeAttr("checked");
                            $("#automatic_login").removeAttr("checked");
                            $("#login_password").focus();
                            $(".layui-layout").hide();
                            $("#login").show();

                        }
                        $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                    });
                },
                error: function () {
                    layui.use("layer", function () {
                        var layer = layui.layer;
                        layer.msg("登录失败", {time: 1000, icon: 2}, function () {

                        });
                        $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                    });
                    console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);
                }
            });
        } else {
            $("#login_username").val(username);
            $("#login_password").val(password);
            $("#save_password").prop("checked", "true");
        }
    }

    get_type_usrname_password();


    //点击记住密码
    $("#save_password").click(function () {
        if ($("#automatic_login").is(":checked") == true && $("#save_password").is(":checked") == false) {
            $("#automatic_login").removeAttr("checked");
        }

    })
    //点击自动登录
    $("#automatic_login").click(function () {

        if ($("#automatic_login").is(":checked") == true && $("#save_password").is(":checked") == false) {
            $("#save_password").prop("checked", "true");
        }
        if ($("#automatic_login").is(":checked") == false) {
            $("#save_password").removeAttr("checked");
        }


    })

    //清除表单的数据
    function deleteMangerLoginStatus() {
        $("#login_username").val("");
        $("#login_password").val("");
        $("#automatic_login").removeAttr("checked");
        $("#save_password").removeAttr("checked");
    }
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
        if ($("#form_login").valid() == false) {
            return false;
        }
        $("#code_input").focusout();
        if(result==false){
            $("#code_input").val("");
            $("#code_input").focus();
            return false;
        }
        var username = $("#login_username").val().trim();
        var password = $("#login_password").val().trim();
        $.ajax({
            url: "MangerLoginValidate",
            type: "post",
            dataType: "json",
            data: {username: username, password: password},
            success: function (data) {

                layui.use("layer", function () {
                    var layer = layui.layer;
                    if (data.code == 0) {

                        layer.msg("登录成功", {time: 1000, icon: 1}, function () {
                            if ($("#save_password").is(":checked") == true && $("#automatic_login").is(":checked") == false)//记住密码
                            {
                                delete_cookie();
                                save_type_username_password(username, password);////登录成功时把用户名和密码用户的类型存在cookie中
                            }
                            if ($("#save_password").is(":checked") == false) {//不记住密码
                                delete_cookie();
                            }
                            if ($("#automatic_login").is(":checked") == true)//自动登录
                            {
                                delete_cookie();
                                save_type_username_password(username, password);////登录成功时把用户名和密码用户的类型存在cookie中
                                $.cookie("Manger_login", 1, {path: "/", expires: 7});
                            }
                            $(".layui-layout").show();
                            $("#Shelteringlayer").hide();
                            $("#btn_login").next().click();
                            hide_loginModal(username);
                        });
                    } else {
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
            }, error: function (XMLHttpRequest) {
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
    //聚焦表表单时
    $("#form_login >div >div >input:last-child").focusin(function () {
        $(this).prev().css("color", "#1abc9c");
    });
    $("#form_login >div >div >input:last-child").focusout(function () {
        $(this).prev().css("color", " #64834a");
    });
    //点击找回密码
    $("#update_password").click(function () {
        window.location.href = "/update_password.html";
    });

    //显示底部的字
    //客服账号管理
    $("#customer_service").click(function () {
        $(".layui-footer").text($(this).find("a").text().trim());
        $.ajax({
            url: "getCustomerService",
            type: "post",
            dataType: "json",
            success: function (data) {
                layui.use("layer", function () {
                    var layer = layui.layer;
                    if (data.code == 0) {
                        var content = data.data;
                        var id = content.id;
                        var username = content.username;
                        var password = content.password;
                        $("#id").text(id);
                        $("#customer_username >div").text(username);
                        $("#customer_password >div").text(password);
                    } else if (data.code == 1) {//空的数据
                        $("#customer_username div").hide();
                        $("#customer_password div").hide();
                        $("#customer_username input").show();
                        $("#customer_password input").show();
                    } else if (data.code == "-2") {
                        //没有访问权限
                        layer.msg("访问权限已失效,请重新登录", {time: 1000, icon: 2}, function () {
                            window.location.href = "/Managerbackground.html";
                        });
                    }
                    $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                });


            }, error: function (XMLHttpRequest) {
                layui.use("layer", function () {
                    var layer = layui.layer;
                    layer.msg("获取数据失败", {time: 1000, icon: 2}, function () {

                    });
                    $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                });
                console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);
            }
        })
        show_id("Customerservice_account_management");
    });
    //点击表格
    $("#Customerservice_account_management >table tr:gt(0) >td:gt(0):lt(2)").click(function () {
        var result = $(this).find("div:first").text().trim();
        $(this).find("div:first").hide();
        var $input = $(this).find("input");
        if (result != "")
            $input.val(result);
        $input.show();
        $input.focus();
    })
    //离开表格
    $("#customer_username input").blur(function () {
        if ($("#id").text().trim() != "") {
            var $this = $(this);
            var result = $(this).val().trim();
            layui.use("layer", function () {
                var layer = layui.layer;
                $this.hide();
                if (result == "") {
                    layer.msg("用户名的不能为空", {time: 1000, icon: 2});
                }
                else if (result.length < 4 || result.length > 8) {
                    layer.msg("用户名的长度最小为4最大为8", {time: 1000, icon: 2});
                } else {
                    if (result == $this.prev().text().trim()) {

                    } else {
                        //存到数据库
                        $.ajax({
                            url: "UpdateOneCustomerService",
                            type: "post",
                            dataType: "json",
                            data: {
                                "id": $("#id").text().trim(),
                                "username": result,
                                "password": $("#customer_password div").text().trim()
                            },
                            success: function (data) {
                                layui.use("layer", function () {
                                    var layer = layui.layer;
                                    if (data.code == 0) {

                                        layer.msg("用户名修改成功", {time: 1000, icon: 1}, function () {
                                            $this.prev().text(result);
                                        });
                                    }
                                    else if (data.code == 1) {
                                        layer.msg(data.message, {time: 1000, icon: 2});
                                    } else if (data.code == 2) {
                                        layer.msg("用户名修改失败", {time: 1000, icon: 2});
                                    } else if (data.code == -2) {
                                        //没有访问权限
                                        layer.msg("访问权限已失效,请重新登录", {time: 1000, icon: 2}, function () {
                                            window.location.href = "/Managerbackground.html";
                                        });
                                    }
                                });

                            }, error: function (XMLHttpRequest) {
                                layui.use("layer", function () {
                                    var layer = layui.layer;
                                    layer.msg("用户名修改失败", {time: 1000, icon: 2}, function () {

                                    });
                                    $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                                });
                                console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);
                            }
                        })

                    }

                }
                $this.prev().show();
                $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
            })
        } else {

            var $this = $(this);
            var result = $(this).val().trim();
            layui.use("layer", function () {
                var layer = layui.layer;

                if (result == "") {
                    layer.msg("用户名的不能为空", {time: 1000, icon: 2});
                }
                else if (result.length < 4 || result.length > 8) {
                    layer.msg("用户名的长度最小为4最大为8", {time: 1000, icon: 2});
                } else {
                    if (result == $this.prev().text().trim()) {

                    } else {

                        $this.prev().text(result);
                        var password = $("#customer_password div").text().trim();
                        if (password != "" && password.length >= 6 && password.length <= 18) {
                            //存到数据库
                            $.ajax({
                                url: "addOneCustomerService",
                                type: "post",
                                dataType: "json",
                                data: {
                                    "username": $("#customer_username div").text().trim(),
                                    "password": $("#customer_password div").text().trim()
                                },
                                success: function (data) {
                                    layui.use("layer", function () {
                                        var layer = layui.layer;
                                        if (data.code == 0) {
                                            layer.msg("添加客服成功", {time: 1000, icon: 1}, function () {
                                                $("#id").text(data.data);
                                            });
                                        }
                                        else if (data.code == 1) {
                                            layer.msg(data.message, {time: 1000, icon: 2});
                                        } else if (data.code == 2) {
                                            layer.msg("添加客服失败", {time: 1000, icon: 2});
                                        } else if (data.code == -2) {
                                            //没有访问权限
                                            layer.msg("访问权限已失效,请重新登录", {time: 1000, icon: 2}, function () {
                                                window.location.href = "/Managerbackground.html";
                                            });
                                        }
                                    });

                                }, error: function (XMLHttpRequest) {
                                    layui.use("layer", function () {
                                        var layer = layui.layer;
                                        layer.msg("添加客服失败", {time: 1000, icon: 2}, function () {

                                        });
                                    });
                                    console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);
                                }
                            })

                        }

                    }
                    $this.hide();
                    $this.prev().show();
                }

                $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
            })
        }


    })
    $("#customer_password input").blur(function () {
        if ($("#id").text().trim() != "") {
            var $this = $(this);
            var result = $(this).val().trim();
            layui.use("layer", function () {
                var layer = layui.layer;

                $this.hide();
                if (result == "") {
                    layer.msg("密码的不能为空", {time: 1000, icon: 2});
                }
                else if (result.length < 6 || result.length > 18) {
                    layer.msg("密码的长度最小为6最大为18", {time: 1000, icon: 2});
                } else {
                    if (result == $this.prev().text().trim()) {

                    } else {
                        //存到数据库
                        $.ajax({
                            url: "UpdateOneCustomerService",
                            type: "post",
                            dataType: "json",
                            data: {
                                "id": $("#id").text().trim(),
                                "username": $("#customer_username div").text().trim(),
                                "password": result
                            },
                            success: function (data) {
                                layui.use("layer", function () {
                                    var layer = layui.layer;
                                    if (data.code == 0) {
                                        layer.msg("密码修改成功", {time: 1000, icon: 1}, function () {
                                            $this.prev().text(result);
                                        });
                                    }
                                    else if (data.code == 1) {
                                        layer.msg(data.message, {time: 1000, icon: 2});
                                    } else if (data.code == 2) {
                                        layer.msg("密码修改失败", {time: 1000, icon: 2});
                                    } else if (data.code == -2) {
                                        //没有访问权限
                                        layer.msg("访问权限已失效,请重新登录", {time: 1000, icon: 2}, function () {
                                            window.location.href = "/Managerbackground.html";
                                        });
                                    }
                                });

                            }, error: function (XMLHttpRequest) {
                                layui.use("layer", function () {
                                    var layer = layui.layer;
                                    layer.msg("密码修改失败", {time: 1000, icon: 2}, function () {

                                    });
                                    $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                                });
                                console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);
                            }
                        })


                    }
                }
                $this.prev().show();
                $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
            })
        }
        else {


            var $this = $(this);
            var result = $(this).val().trim();
            layui.use("layer", function () {
                var layer = layui.layer;


                if (result == "") {
                    layer.msg("密码的不能为空", {time: 1000, icon: 2});
                }
                else if (result.length < 6 || result.length > 18) {
                    layer.msg("密码的长度最小为6最大为18", {time: 1000, icon: 2});
                } else {
                    if (result == $this.prev().text().trim()) {

                    } else {

                        $this.prev().text(result);
                        var username = $("#customer_username div").text().trim();
                        if (username != "" && username.length >= 4 && username.length <= 8) {
                            //存到数据库
                            $.ajax({
                                url: "addOneCustomerService",
                                type: "post",
                                dataType: "json",
                                data: {
                                    "username": $("#customer_username div").text().trim(),
                                    "password": $("#customer_password div").text().trim()
                                },
                                success: function (data) {
                                    layui.use("layer", function () {
                                        var layer = layui.layer;
                                        if (data.code == 0) {
                                            layer.msg("添加客服成功", {time: 1000, icon: 1}, function () {
                                                $("#id").text(data.data);
                                            });
                                        }
                                        else if (data.code == 1) {
                                            layer.msg(data.message, {time: 1000, icon: 2});
                                        } else if (data.code == 2) {
                                            layer.msg("添加客服失败", {time: 1000, icon: 2});
                                        } else if (data.code == -2) {
                                            //没有访问权限
                                            layer.msg("访问权限已失效,请重新登录", {time: 1000, icon: 2}, function () {
                                                window.location.href = "/Managerbackground.html";
                                            });
                                        }
                                    });

                                }, error: function (XMLHttpRequest) {
                                    layui.use("layer", function () {
                                        var layer = layui.layer;
                                        layer.msg("添加客服失败", {time: 1000, icon: 2}, function () {

                                        });
                                    });
                                    console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);
                                }
                            })

                        }
                    }
                    $this.hide();
                    $this.prev().show();
                }

                $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
            })
        }
    })

    //点击删除按钮
    $("#customer_delete").click(function () {
        var id = $("#id").text().trim();
        //删除数据库中的客服账号
        if (id != "") {
            layer.confirm("是否要删除此ID为 " + id + " 的客服？", {btn: ["确定", "取消"], title: "删除提示", icon: 3}, function (index) {
                $.ajax({
                    url: "deleteOneCustomerSerivce",
                    type: "post",
                    dataType: "json",
                    data: {
                        "username": $("#customer_username div").text().trim()
                    },
                    success: function (data) {
                        layui.use("layer", function () {
                            var layer = layui.layer;
                            if (data.code == 0) {
                                layer.msg("删除成功", {time: 1000, icon: 1}, function () {
                                    $("#id").text("");
                                    $("#customer_username div").text("");
                                    $("#customer_password div").text("");
                                    $("#customer_username input").val("");
                                    $("#customer_password input").val("");
                                    $("#customer_username div").hide();
                                    $("#customer_password div").hide();
                                    $("#customer_username input").show();
                                    $("#customer_password input").show();
                                });
                            }
                            else if (data.code == -2) {
                                //没有访问权限
                                layer.msg("访问权限已失效,请重新登录", {time: 1000, icon: 2}, function () {
                                    window.location.href = "/Managerbackground.html";
                                });
                            }
                            $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                        });
                    }, error: function (XMLHttpRequest) {
                        layui.use("layer", function () {
                            var layer = layui.layer;
                            layer.msg("删除失败", {time: 1000, icon: 2}, function () {

                            });
                            $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                        });
                        console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);
                    }
                })
                layer.close(index);
            })

        }
        else {
            $("#customer_username div").text("");
            $("#customer_password div").text("");
            $("#customer_username input").val("");
            $("#customer_password input").val("");
        }

    })

})