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
    var page=0;//页码
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
        $("#customers .customer").remove();
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
                "                            <p style=\"max-height: 117px;overflow-y: auto;margin-top: 9px;word-break: break-all;width: 819px;\">客户评价:" + path + "\n" +
                "                        </div>\n" +
                "                    </li>");
            $("#ampaginationlg-bootstrap").before($li);
        }
    }

    //获取客户实例的信息
    function getCustomerInstances(number) {

        var size = 3;//jpa页码从0开始,每页默认展示3个客户实例

        if(page>=(Math.ceil(number/size)-1)){
            page=(Math.ceil(number/size)-1);
        }
        $.ajax({
            url: "GetCustomerInstancesBypage1",
            type: "post",
            dataType: "json",
            data: {page: page, size: size},
            success: function (data) {
                    if (data.code == 0) {
                        var result1 = data.data;
                        //显示用户实例到页面
                        showCustomerInstances(result1);
                        //分页初始化
                        $("#input_page").val(page+1);
                        var pagerlg = jQuery('#ampaginationlg-bootstrap').pagination({
                            page: page+1,
                            totals: number,
                            pageSize: size,//一页显示几个
                            theme: 'bootstrap',
                            btnSize: 'lg'
                        })
                            .onChangePage(function (e) {
                                $("#input_page").val(e.page);
                                //分页跳转
                                $.ajax({
                                    url: "GetCustomerInstancesBypage1",
                                    type: "post",
                                    dataType: "json",
                                    data: {page: e.page - 1, size: size},
                                    success: function (data) {
                                            if (data.code == 0) {
                                                var result = data.data;
                                                //显示用户实例到页面
                                                showCustomerInstances(result);
                                            } else {
                                                layer.msg(data.message, {time: 1000, icon: 2}, function () {

                                                });
                                                $("div[id^='layui-layer']").css({
                                                    "width": "",
                                                    "z-index": "99999999999"
                                                });
                                            }

                                    },
                                    error: function (XMLHttpRquest) {
                                            layer.msg("获取数据失败", {time: 1000, icon: 2}, function () {

                                            });
                                            $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
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


            },
            error: function (XMLHttpRequest) {
                    layer.msg("获取数据失败", {time: 1000, icon: 2}, function () {

                    });
                    $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);

            }

        })
    }
//获取客户实例的数量
    function getNumberCustomerInstances() {
        $("#input_page").val("0");
        $("#customers .customer").remove();
        $("#ampaginationlg-bootstrap").hide();
        $("#page_skip").hide();
        $.ajax({
            url: "getCountCustomerInstancesByType1",
            type: "post",
            dataType: "json",
            success: function (data) {
                    if (data.code == 0) {
                        var number = data.data;
                        getCustomerInstances(number);
                    } else {
                        layer.msg(data.message, {time: 1000, icon: 2}, function () {

                        });
                        $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                    }
            },
            error: function (XMLHttpRequest) {

                    layer.msg("获取数据失败", {time: 1000, icon: 2}, function () {

                    });
                    $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                console.log("错误类型:" + XMLHttpRequest.status + ",错误内容:" + XMLHttpRequest.statusText);

            }
        })

    }



    $("#nav_extend").removeAttr("style");
    $("#nav_all_extend").removeAttr("style");
    getNumberCustomerInstances();//获取客户实例
    $("#nav_all_extend").css("margin-top", "15px");

})