$(function(){
//设置返回顶部的函数
    $(window).scroll(function () {
        if ($(window).scrollTop() > 200) {
            $("#top").fadeIn(1000);
        }
        else {
            $("#top").fadeOut(1000);

        }
    });
    //鼠标在导航条上时触发
    $("nav div:first > ul:first >li:lt(6)").hover(function () {
        $(this).find("ul").toggle();
    }, function () {
        $(this).find("ul").toggle();
    });
    //设置导航栏的动画效果
    (function () {
        var $thisnav = $(".current-menu-item").offset().left;
        $(".menu_item").hover(function () {
            var $left = $(this).offset().left - $thisnav;
            var $width = $(this).outerWidth();
            $(".wee").css({
                'left': $left,
                'width': $width
            })
        }, function () {
            var $initwidth = $('.current-menu-item').width();
            $('.wee').css({'left': '0', 'width': $initwidth});
        });
    })();

    //页面底部显示联系
    $("#footer >div:first >p:first >span").text("");
    $("#footer >div:first >p:nth-child(2) >span").text("");
    $("#footer >div:first >p:nth-child(3) >span:first").text("");
    $("#footer >div:first >p:nth-child(3) >span:nth-child(2)").text("");
    $.ajax({
        url:"getContact1",
        type:"post",
        dataType:"json",
        success:function(data){
            if(data.code==0){
                if(data.data==null){
                }else{

                    var content=data.data;
                    var businessBoss=content.businessBoss.trim();
                    var bussinessName=content.bussinessName.trim();
                    var telPhone=content.telPhone.trim();
                    var spareTelPhone=content.spareTelPhone;
                    var address=content.provine.trim()+content.city.trim()+content.area.trim()+content.detailedAddress.trim();
                    var phone;
                    if(spareTelPhone==null)
                        phone=telPhone;
                    else{
                        phone=telPhone+"、"+spareTelPhone;
                    }
                    $("#footer >div:first >p:first >span").text(bussinessName);
                    $("#footer >div:first >p:nth-child(2) >span").text(address);
                    $("#footer >div:first >p:nth-child(3) >span:first").text(phone);
                    $("#footer >div:first >p:nth-child(3) >span:last").text(businessBoss);
                }

            }
        },error:function (XMLHttpRequest) {
                layer.msg("获取数据失败", {time: 1000, icon: 2}, function () {

                });
                $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
            console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);
        }
    })

    //鼠标在导航条上时触发
    $("#forg_message").find("li:first").find("span:odd").hover(function () {
        $(this).css("color", "red");
    }, function () {
        $(this).css("color", "#555");
    });
    //初始化左边的导航栏
    var ProductImgs={};
    function init_left_nav(){
        //1 公司动态
        $("#nav_all_extend >div:nth-child(2) li").remove();
        $("#nav_all_extend >div:nth-child(3) >div:gt(0)").remove();
        $.ajax({
            url: "get_all_CompanyDynamics_title1",
            type: "post",
            dataType: "json",
            success: function (da) {
                if(da.code=="0")
                { var data=da.data;
                    for (var i in data) {
                        if(i>3)
                            break;
                        var $li = $("<li title=\"公司动态\"><span>" + data[i].title + "</span><span class=\"sr-only\">" + data[i].id + "</span></li>");
                        $("#nav_all_extend >div:nth-child(2)").append($li);
                    }

                    $("#nav_all_extend >div:nth-child(2) >li").click(function () {
                        window.scrollTo(0, 0);
                        var title = $(this).find("span:first").text().trim();
                        var id = $(this).find("span:last").text().trim();
                        window.location.href="EnterpriseInformationContent.html?type=0&title="+title+"&id="+id;
                    });

                }

            },
            error: function (XMLHttpRequest) {
                    layer.msg("公司动态获取失败", {time: 1000, icon: 2}, function () {
                        //$("#nav_all_extend >div:nth-child(2)").hide();
                    });
                    $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);
            }
        });
        //推荐产品
        ProductImgs={};
        getOneKindproductImg(2);
    }
    init_left_nav();
    function addImgIntoLeftNav(){
        if(JSON.stringify(ProductImgs)=="{}"){
            return;
        }
        for(var i in ProductImgs){
            if(i==2){
                if(ProductImgs[i]!=undefined)
                    $("#nav_all_extend >div:nth-child(3)").append($("<div><img src="+ProductImgs[i]+" alt=\"蛙苗\"><a>蛙苗</a></div>"));
            }else if(i==3){
                if(ProductImgs[i]!=undefined)
                    $("#nav_all_extend >div:nth-child(3)").append($("<div><img src="+ProductImgs[i]+" alt=\"成蛙\"><a>成蛙</a></div>"));
            }else{
                if(ProductImgs[i]!=undefined)
                    $("#nav_all_extend >div:nth-child(3)").append($("<div><img src="+ProductImgs[i]+" alt=\"种蛙\"><a>种蛙</a></div>"));
            }
        }

//点击图片或下标
        var Imgtype=['蛙苗','成蛙','种蛙'];

        $("#nav_all_extend >div:nth-child(3) >div:gt(0) img:first-child").click(function () {

            var type=$(this).next().text().trim();
            if(Imgtype.indexOf(type)!=-1){
                window.location.href="ProductContent.html?type="+Imgtype.indexOf(type);
            }

        });
        $("#nav_all_extend >div:nth-child(3) >div:gt(0) img:first-child+a").click(function () {
            var type=$(this).text().trim();
            if(Imgtype.indexOf(type)!=-1){
                window.location.href="ProductContent.html?type="+Imgtype.indexOf(type);
            }
        });
    }
    function getOneKindproductImg(type){
        $.ajax({
            url:"get_filepath1",
            type:"post",
            data:{path:type},
            dataType:"json",
            success:function(data){
                if (data.code == "0") {
                    ProductImgs[type]=data.data[0];
                    if(type==2){
                        getOneKindproductImg(3);
                    }
                    else if(type==3){
                        getOneKindproductImg(4);
                    }else if(type==4){//已经获取完了
                        addImgIntoLeftNav();
                    }
                }
                else if (data.code == "1") {
                        layer.msg("type的值对应的类型不存在", {time: 1000, icon: 2}, function () {

                        });
                        $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                }
                else {
                    //空的数据
                    if(type==2){
                        getOneKindproductImg(3);
                    }
                    else if(type==3){
                        getOneKindproductImg(4);
                    }else if(type==4) {//已经获取完了
                        addImgIntoLeftNav();
                    }
                }
            }, error: function (XMLHttpRequest) {
                    layer.msg("获取图片失败", {time: 1000, icon: 2}, function () {

                    });
                    $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);
            }

        })
    }


    //点击在线咨询显示客服对话框
    $("#customer_service_small").click(function () {
        number = 0;
        $(this).find("span").text("");
        if ($("#customer_service").css("display") == "none") {
            $(this).find("span").empty();
            $("#customer_service").fadeIn();
        }
        else {
            $("#customer_service").fadeOut();
        }
    });
    $("#customer_sevice_head span img").click(function () {
        $("#customer_service").fadeOut();
    });

    function getCurrentTime() {
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hour = date.getHours();
        var minutes = date.getMinutes();
        var second = date.getSeconds();
        var show_date = year + "-" + month + "-" + day + " " + hour + ":" + minutes + ":" + second;
        return show_date;
    };

//发送消息的对象

    function set_message(id, date, type, content) {
        var customer = {
            "receive_id": "",
            "id": id,
            "date": date,
            "type": type,
            "content": content
        }
        return customer;
    };

//添加客服发送的消息
    function add_message(date, content) {
        var text = $("<div class=\"customer_service\">\n" +
            "                            <img src=\"img/customer.png\" alt=\"客服\" class=\"service_head_img\">\n" +
            "                            <div class=\"service_time\"><span>" + date + "</span><span>客服</span></div>\n" +
            "\n" +
            "                            <div class=\"service_input_content\">\n" +
            "                                <p>" + content + "</p>\n" +
            "                            </div>\n" +
            "                        </div>");
        $("#customer_service_content").append(text);
    }

    //连接服务器的相关函数
    var userId;//用户的id
    var stompClient = null;
    var service = false;
    var number = 0;//客户未看的信息条数
    function connect() {
        var socket = new SockJS("/endpointWisely"); //1连接SockJS的endpoint是“endpointWisely”，与后台代码中注册的endpoint要一样。
        stompClient = Stomp.over(socket);//创建STOMP协议的webSocket客户端。
        stompClient.connect({}, function (frame) {//连接webSocket的服务端。
            console.log("开始进行连接Connected:" + frame);

            //通过stompClient.subscribe（）订阅服务器的目标是'/user/' + userId + '/msg'
            // 接收一对一的推送消息,其中userId由服务端传递过来,用于表示唯一的用户,通过此值将消息精确推送给一个用户
            userId = getCurrentTime();
            stompClient.subscribe('/user/' + userId + '/msg', function (respnose) {
                service = true;
                var data = JSON.parse(respnose.body);
                add_message(data.date, data.content);//添加客服发送的消息
                if ($("#customer_service").css("display") == "none") {
                    number = number + 1;
                } else
                    number = 0;
                if (number > 0)
                    $("#customer_service_small span").text(number);
                else
                    $("#customer_service_small span").text("");

            });
            //通过stompClient.subscribe（）订阅服务器的目标是'/topic/getResponse'发送过来的地址，与@SendTo中的地址对应。
            stompClient.subscribe('/topic/getResponse', function (respnose) {
                var data = JSON.parse(respnose.body);
                var type = data.type;
                if (type == "1" && service == false) {
                    service = true;
                    layer.msg('客服上线了', {time: 1000, icon: 1}, function () {
                        var online = $("<div class=\"online\">\n" +
                            "                            <span>客服在线</span>\n" +
                            "                        </div>");
                        $("#customer_service_content").append(online);

                    });
                    $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});

                }
                if (type == "2" && data.content == "客服" && service == true) {
                    service = false;
                    layer.msg('客服下线了', {time: 1000, icon: 1}, function () {
                        var unonline = $("<div class='tip'><span>当前客服不在线，请电话联系</span></div>");
                        $("#customer_service_content").append(unonline);

                    });
                    $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});

                }
            });
            var message = set_message(userId, userId, "0", "");//注册session
            sendName(message);
        })

    }

    connect();

    function sendName(message) {
        //通过stompClient.send（）向地址为"/welcome"的服务器地址发起请求，与@MessageMapping里的地址对应。因为我们配置了registry.setApplicationDestinationPrefixes(Constant.WEBSOCKETPATHPERFIX);所以需要增加前缀/ws-push/
        stompClient.send("/ws-push/welcome", {}, JSON.stringify(message));
    }

//点击发送按钮
    $("#customer_service_foot").find("button:last").click(function () {
        if (service == false) {
            var unonline = $("<div class='tip'><span>当前客服不在线，请电话联系</span></div>");
            $("#customer_service_content").append(unonline);
            return;
        }
        var text = $("#customer_service_input").val();
        if (text.trim() == "")
            return;
        var show_date = getCurrentTime();
        var message = set_message(userId, show_date, "访客", text);
        sendName(message);//发送消息
        var content = $("<div class=\"visitor\">\n" +
            "                            <img src=\"img/客户.png\" alt=\"访客\" class=\"visitor_head_img\">\n" +
            "                            <div class=\"visitor_time\"><span>" + show_date + "</span><span>访客</span></div>\n" +
            "                            <div class=\"visitor_input_content\">\n" +
            "                                 " + text + "\n" +
            "                            </div>\n" +
            "                        </div>");
        $("#customer_service_content").append(content);
        $("#customer_service_input").val("");
        var scroll_top = $("#customer_service_content").scrollTop();
        $("#customer_service_content").scrollTop(10000 + scroll_top);

    });

    //关闭服务
    function disconnect() {
        if (stompClient != null) {
            stompClient.disconnect();
        }
        console.log("Disconnected");
    }

    //关闭页面是关闭服务
    window.onbeforeunload = function () {
        var message = set_message(userId, getCurrentTime(), "2", "访客");//注销session
        sendName(message);
        disconnect();
    }
    //设置基地图片轮播
    function initjssor_1() {


        var jssor_1_SlideshowTransitions = [
            {$Duration: 1200, $Zoom: 1, $Easing: {$Zoom: $Jease$.$InCubic, $Opacity: $Jease$.$OutQuad}, $Opacity: 2},
            {
                $Duration: 1000,
                $Zoom: 11,
                $SlideOut: true,
                $Easing: {$Zoom: $Jease$.$InExpo, $Opacity: $Jease$.$Linear},
                $Opacity: 2
            },
            {
                $Duration: 1200,
                $Zoom: 1,
                $Rotate: 1,
                $During: {$Zoom: [0.2, 0.8], $Rotate: [0.2, 0.8]},
                $Easing: {$Zoom: $Jease$.$Swing, $Opacity: $Jease$.$Linear, $Rotate: $Jease$.$Swing},
                $Opacity: 2,
                $Round: {$Rotate: 0.5}
            },
            {
                $Duration: 1000,
                $Zoom: 11,
                $Rotate: 1,
                $SlideOut: true,
                $Easing: {$Zoom: $Jease$.$InExpo, $Opacity: $Jease$.$Linear, $Rotate: $Jease$.$InExpo},
                $Opacity: 2,
                $Round: {$Rotate: 0.8}
            },
            {
                $Duration: 1200,
                x: 0.5,
                $Cols: 2,
                $Zoom: 1,
                $Assembly: 2049,
                $ChessMode: {$Column: 15},
                $Easing: {$Left: $Jease$.$InCubic, $Zoom: $Jease$.$InCubic, $Opacity: $Jease$.$Linear},
                $Opacity: 2
            },
            {
                $Duration: 1200,
                x: 4,
                $Cols: 2,
                $Zoom: 11,
                $SlideOut: true,
                $Assembly: 2049,
                $ChessMode: {$Column: 15},
                $Easing: {$Left: $Jease$.$InExpo, $Zoom: $Jease$.$InExpo, $Opacity: $Jease$.$Linear},
                $Opacity: 2
            },
            {
                $Duration: 1200,
                x: 0.6,
                $Zoom: 1,
                $Rotate: 1,
                $During: {$Left: [0.2, 0.8], $Zoom: [0.2, 0.8], $Rotate: [0.2, 0.8]},
                $Easing: {$Left: $Jease$.$Swing, $Zoom: $Jease$.$Swing, $Opacity: $Jease$.$Linear, $Rotate: $Jease$.$Swing},
                $Opacity: 2,
                $Round: {$Rotate: 0.5}
            },
            {
                $Duration: 1000,
                x: -4,
                $Zoom: 11,
                $Rotate: 1,
                $SlideOut: true,
                $Easing: {
                    $Left: $Jease$.$InExpo,
                    $Zoom: $Jease$.$InExpo,
                    $Opacity: $Jease$.$Linear,
                    $Rotate: $Jease$.$InExpo
                },
                $Opacity: 2,
                $Round: {$Rotate: 0.8}
            },
            {
                $Duration: 1200,
                x: -0.6,
                $Zoom: 1,
                $Rotate: 1,
                $During: {$Left: [0.2, 0.8], $Zoom: [0.2, 0.8], $Rotate: [0.2, 0.8]},
                $Easing: {$Left: $Jease$.$Swing, $Zoom: $Jease$.$Swing, $Opacity: $Jease$.$Linear, $Rotate: $Jease$.$Swing},
                $Opacity: 2,
                $Round: {$Rotate: 0.5}
            },
            {
                $Duration: 1000,
                x: 4,
                $Zoom: 11,
                $Rotate: 1,
                $SlideOut: true,
                $Easing: {
                    $Left: $Jease$.$InExpo,
                    $Zoom: $Jease$.$InExpo,
                    $Opacity: $Jease$.$Linear,
                    $Rotate: $Jease$.$InExpo
                },
                $Opacity: 2,
                $Round: {$Rotate: 0.8}
            },
            {
                $Duration: 1200,
                x: 0.5,
                y: 0.3,
                $Cols: 2,
                $Zoom: 1,
                $Rotate: 1,
                $Assembly: 2049,
                $ChessMode: {$Column: 15},
                $Easing: {
                    $Left: $Jease$.$InCubic,
                    $Top: $Jease$.$InCubic,
                    $Zoom: $Jease$.$InCubic,
                    $Opacity: $Jease$.$OutQuad,
                    $Rotate: $Jease$.$InCubic
                },
                $Opacity: 2,
                $Round: {$Rotate: 0.7}
            },
            {
                $Duration: 1000,
                x: 0.5,
                y: 0.3,
                $Cols: 2,
                $Zoom: 1,
                $Rotate: 1,
                $SlideOut: true,
                $Assembly: 2049,
                $ChessMode: {$Column: 15},
                $Easing: {
                    $Left: $Jease$.$InExpo,
                    $Top: $Jease$.$InExpo,
                    $Zoom: $Jease$.$InExpo,
                    $Opacity: $Jease$.$Linear,
                    $Rotate: $Jease$.$InExpo
                },
                $Opacity: 2,
                $Round: {$Rotate: 0.7}
            },
            {
                $Duration: 1200,
                x: -4,
                y: 2,
                $Rows: 2,
                $Zoom: 11,
                $Rotate: 1,
                $Assembly: 2049,
                $ChessMode: {$Row: 28},
                $Easing: {
                    $Left: $Jease$.$InCubic,
                    $Top: $Jease$.$InCubic,
                    $Zoom: $Jease$.$InCubic,
                    $Opacity: $Jease$.$OutQuad,
                    $Rotate: $Jease$.$InCubic
                },
                $Opacity: 2,
                $Round: {$Rotate: 0.7}
            },
            {
                $Duration: 1200,
                x: 1,
                y: 2,
                $Cols: 2,
                $Zoom: 11,
                $Rotate: 1,
                $Assembly: 2049,
                $ChessMode: {$Column: 19},
                $Easing: {
                    $Left: $Jease$.$InCubic,
                    $Top: $Jease$.$InCubic,
                    $Zoom: $Jease$.$InCubic,
                    $Opacity: $Jease$.$OutQuad,
                    $Rotate: $Jease$.$InCubic
                },
                $Opacity: 2,
                $Round: {$Rotate: 0.8}
            }
        ];

        var jssor_1_options = {
            $AutoPlay: true,
            $SlideshowOptions: {
                $Class: $JssorSlideshowRunner$,
                $Transitions: jssor_1_SlideshowTransitions,
                $TransitionsOrder: 1
            },
            $ArrowNavigatorOptions: {
                $Class: $JssorArrowNavigator$
            },
            $ThumbnailNavigatorOptions: {
                $Class: $JssorThumbnailNavigator$,
                $Rows: 2,
                $Cols: 6,
                $SpacingX: 14,
                $SpacingY: 12,
                $Orientation: 2,
                $Align: 156
            }
        };

        var jssor_1_slider = new $JssorSlider$("jssor_1", jssor_1_options);

        /*responsive code begin*/

        /*you can remove responsive code if you don't want the slider scales while window resizing*/
        function ScaleSlider() {
            var refSize = jssor_1_slider.$Elmt.parentNode.clientWidth;
            if (refSize) {
                refSize = Math.min(refSize, 960);
                refSize = Math.max(refSize, 300);
                jssor_1_slider.$ScaleWidth(refSize);
            }
            else {
                window.setTimeout(ScaleSlider, 30);
            }
        }

        ScaleSlider();
        $(window).bind("load", ScaleSlider);
        $(window).bind("resize", ScaleSlider);
        $(window).bind("orientationchange", ScaleSlider);
    };
    //得到大图片地址
    function get_big_image(path){
        var index=path.lastIndexOf("/");
        var pre=path.substring(0,index-5);
        var file=path.substring(index+1,path.length);
        var src=pre+file;
        return src;
    }
    //显示基地展示
    $("#nav_extend").removeAttr("style");
    $("#nav_all_extend").removeAttr("style");
    $("#jssor_1").empty();
    var path="../../img/loading1.gif";
    var $imgcontent=$("<div data-u=\"loading\" style=\"position: absolute; top: 0px; left: 0px;\">\n" +
        "                        <div style=\"filter: alpha(opacity=70); opacity: 0.7; position: absolute; display: block; top: 0px; left: 0px; width: 100%; height: 100%;\"></div>\n" +
        "                        <div style=\"position:absolute;display:block;background:url("+path+") no-repeat center center;top:0px;left:0px;width:100%;height:100%;\"></div>\n" +
        "                    </div>\n" +
        "                    <div data-u=\"slides\"\n" +
        "                         style=\"cursor: default; position: relative; top: 0px; left: 240px; width: 720px; height: 480px; overflow: hidden;\"\n" +
        "                        id=\"jssor_1_img\">\n" +
        "                    </div>\n" +
        "                    <!-- Thumbnail Navigator -->\n" +
        "                    <div data-u=\"thumbnavigator\" class=\"jssort01-99-66\"\n" +
        "                         style=\"position:absolute;left:0px;top:0px;width:240px;height:480px;\" data-autocenter=\"2\">\n" +
        "                        <!-- Thumbnail Item Skin Begin -->\n" +
        "                        <div data-u=\"slides\" style=\"cursor: default;\">\n" +
        "                            <div data-u=\"prototype\" class=\"p\">\n" +
        "                                <div class=\"w\">\n" +
        "                                    <div data-u=\"thumbnailtemplate\" class=\"t\"></div>\n" +
        "                                </div>\n" +
        "                                <div class=\"c\"></div>\n" +
        "                            </div>\n" +
        "                        </div>\n" +
        "                        <!-- Thumbnail Item Skin End -->\n" +
        "                    </div>\n" +
        "                    <!-- Arrow Navigator -->\n" +
        "                    <span data-u=\"arrowleft\" class=\"jssora05l\" style=\"top:0px;left:248px;width:40px;height:40px;\"\n" +
        "                          data-autocenter=\"2\"></span>\n" +
        "                    <span data-u=\"arrowright\" class=\"jssora05r\" style=\"top:0px;right:8px;width:40px;height:40px;\"\n" +
        "                          data-autocenter=\"2\"></span>");
    $.ajax({
        url:"get_filepath1",
        type:"post",
        data:{path:1},
        dataType:"json",
        success:function(data){
            if (data.code == "0") {
                $("#jssor_1").append($imgcontent);
                var files=data.data;
                for(var i in files)
                {  var j=parseInt(i);
                    var src=get_big_image(files[i]);
                    var $img=$("<div data-p=\"150.00\">\n" +
                        "                            <img data-u=\"image\" layer-src="+src+" src="+files[i]+"/>\n" +
                        "                            <img data-u=\"thumb\" src="+files[i]+"/>\n" +
                        "                        </div>");
                    if(j!=0)
                    {$img.css("display","none");
                    }
                    $("#jssor_1_img").append($img);
                }
                $("#jssor_1").append($imgcontent);
                initjssor_1();//初始化基地展示轮播图
                layer.ready(function () {
                    layer.photos({
                        photos:"#jssor_1",
                        shift:5
                    });
                })

                $("#jssor_1").find("img").click(function () {
                    if($("div[id^='layui-layer-shade']").next().find("div").attr("id")=="")
                        $("div[id^='layui-layer-shade']").click(function () {
                            layer.closeAll();
                        })
                })


            }
            else if (data.code == "1") {
                    layer.msg("type的值对应的类型不存在", {time: 1000, icon: 2}, function () {

                    });
                    $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
            }
            else {
                //空的数据

            }
        }, error: function (XMLHttpRequest) {
                layer.msg("获取数据失败", {time: 1000, icon: 2}, function () {

                });
                $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
            console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);
        }

    })

    $("#nav_extend").css("margin-top", "13px");
})