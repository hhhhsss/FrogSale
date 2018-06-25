$(function () {
    function init_tab_menu() {
        // $(".tab_menu input:radio").each(function () {
        //     if ($(this).is(":checked") == true) {
        //         var index = $(this).index()/4;
        //         $(".tab-content >section").hide();
        //         $(".tab-content >section:eq(" + index + ")").show();
        //         var $number=$(this).next().next();
        //         $number.text("");
        //         $number.hide();
        //     }
        // });
        $(".tab_menu input:radio").click(function () {
            if ($(this).is(":checked") == true) {
                var index = $(this).next().text().trim();
                var $number = $(this).next().next();
                $number.text("");
                $number.hide();
                $(".tab-content >section").hide();
                $(".tab-content >section").each(function () {
                   if($(this).find("span:first").text().trim()==index){
                       $(".tab-content >section").hide();
                       $(this).show();
                       return;
                   }
                });

            }
        });


    };

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
    }

    //添加删除函数
    function add_delete(userid) {
        $(".tab_menu >span:contains(" + userid + ")").next().next().click(function () {
            var $this = $(this);
            layer.confirm("确定删除登录时间为 "+$this.prev().prev().text().trim()+" 的用户吗？", {btn: ["确认", "取消"], icon: 3, title: "删除提示"}, function (id) {
                var index = $this.prev().prev().text().trim();
                var $first = $this.prev();
                var $second = $first.prev();
                var $third = $second.prev();
                $this.remove();
                $first.remove();
                $second.remove();
                $third.remove();
                $(".tab-content >section").each(function () {
                    if($(this).find("span:first").text().trim()==index){
                        $(this).remove();
                        return;
                    }
                });
               
                layer.close(id);
            })
        });
    }

//发送消息的对象

    function set_message(receive_id, id, date, type, content) {
        var customer = {
            "receive_id": receive_id,
            "id": id,
            "date": date,
            "type": type,
            "content": content
        }
        return customer;
    };

//添加访客
    function add_customer(userid) {
        var user = $(" <input type=\"radio\" class=\"tab\" name=\"tab\">\n" +
            "                <span style='margin-bottom: 7px;'>" + userid + "</span><a class='badge'></a>\n" +
            "                <button><i class=\"fa fa-close\"></i></button>");
        var text = "请问你需要知道什么";
        var show_date = getCurrentTime();
        var content = $(" <section class='tab-item'>\n" +
            "        <span style='display: none'>"+userid+"</span>\n" +
            "          <div class=\"customer_service\">\n" +
            "                        <div class=\"customer_sevice_head\">\n" +
            "                            <label>在线咨询</label>\n" +
            "                        </div>\n" +
            "                        <div class=\"customer_service_content\">\n" +
            "                            <div class=\"visitor\">\n" +
            "                                <img src=\"img/customer.png\" alt=\"客服\" class=\"visitor_head_img\">\n" +
            "                                <div class=\"visitor_time\"><span>" + show_date + "</span><span>客服</span></div>\n" +
            "                                <div class=\"visitor_input_content\">\n" +
            "                                   " + text + "\n" +
            "                                </div>\n" +
            "                            </div>\n" +
            "                        </div>\n" +
            "                        <div class=\"customer_service_foot\">\n" +
            "                      <textarea class=\"customer_service_input\">\n" +
            "                      </textarea><button >发送</button><span style='display:none'>" + userid + "</span>" +
            "                        </div>\n" +
            "                    </div>\n" +
            "                </section>");
        content.find("textarea").text("");
        $(".tab_menu").append(user);
        $(".tab-content").append(content);
        init_tab_menu();
        init_send_button();
        add_delete(show_date);
        var message = set_message(userid, userId, show_date, "客服", text);
        sendName(message);//发送消息

    }

    function add_customer1(userid) {
        var user = $(" <input type=\"radio\" class=\"tab\" name=\"tab\">\n" +
            "                <span style='margin-bottom: 7px;'>" + userid + "</span>\n" +
            "<a class=\"badge\"></a>\n" +
            "                <button><i class=\"fa fa-close\"></i></button>");
        var content = $("<section class='tab-item'><span style='display: none'>" + userid + "</span>\n" +
            "                    <div class=\"customer_service\">\n" +
            "                        <div class=\"customer_sevice_head\">\n" +
            "                            <label>在线咨询</label>\n" +
            "                        </div>\n" +
            "                        <div class=\"customer_service_content\">\n" +
            "                        </div>\n" +
            "                        <div class=\"customer_service_foot\">\n" +
            "                      <textarea class='customer_service_input'>\n" +
            "                      </textarea><button >发送</button><span style='display:none'>" + userid + "</span>" +
            "                        </div>\n" +
            "                    </div>\n" +
            "                </section>");
        content.find("textarea").text("");
        $(".tab_menu").append(user);
        $(".tab-content").append(content);
        init_tab_menu();
        init_send_button();
        add_delete(userid);
    }

    //标记注销访客
    function delete_customer(userid) {
        $(".tab_menu > span").each(function () {
            if ($(this).text() == userid) {
                $(this).css("background-color", "#f47d7d");
            }
        })
    }

//添加访客发送的消息
    function add_message(send_id, date, content) {
        var text = $("<div class=\"customer_service_talk\">\n" +
            "                                <img src=\"img/客户.png\" alt=\"访客\" class=\"service_head_img\">\n" +
            "                                <div class=\"service_time\"><span>" + date + "</span><span>访客</span></div>\n" +
            "\n" +
            "                                <div class=\"service_input_content\">\n" +
            "                                    <p>" + content + "</p>\n" +
            "                                </div>\n" +
            "                            </div>");
        $('.customer_service .customer_service_foot button + span').each(function () {
            if ($(this).text().trim() == send_id.trim())
                $(this).closest(".customer_service").find(".customer_service_content").append(text);
        });
        $(".tab_menu > span").each(function () {
            if ($(this).text() == send_id) {
                if ($(this).prev().is(":checked") == false) {
                    var number;
                    var text = $(this).next().text();
                    if (text == "")
                        number = 1;
                    else {
                        number = parseInt(text) + 1;
                    }
                    $(this).next().text(number);
                    $(this).next().show();
                }
            }
        });
    }

    //判断发送消息的用户列表中有没有
    function isExist(send_id) {
        var result = false;
        $(".tab_menu").find("span").each(function () {
            if (($(this).text() == send_id) == true) {
                result = true;
            }
        });
        return result;
    }

    //连接服务器的相关函数
    var userId;//客服的id
    var stompClient = null;

    function connect() {
        var socket = new SockJS("/endpointWisely"); //1连接SockJS的endpoint是“endpointWisely”，与后台代码中注册的endpoint要一样。
        stompClient = Stomp.over(socket);//创建STOMP协议的webSocket客户端。
        stompClient.connect({}, function (frame) {//连接webSocket的服务端。
            console.log("开始进行连接Connected:" + frame);
            //通过stompClient.subscribe（）订阅服务器的目标是'/user/' + userId + '/msg'
            // 接收一对一的推送消息,其中userId由服务端传递过来,用于表示唯一的用户,通过此值将消息精确推送给一个用户
            userId = getCurrentTime();
            stompClient.subscribe('/user/' + userId + '/msg', function (respnose) {
                var data = JSON.parse(respnose.body);
                if (isExist(data.id) == false) {
                    add_customer1(data.id);
                }
                add_message(data.id, data.date, data.content);//添加用户发送的消息
            });

            //通过stompClient.subscribe（）订阅服务器的目标是'/topic/getResponse'发送过来的地址，与@SendTo中的地址对应。
            stompClient.subscribe('/topic/getResponse', function (respnose) {
                var data = JSON.parse(respnose.body);
                if (data.type == "0") {//访客注册
                    add_customer(data.id);
                }

                if (data.type == "2" && data.content == "访客") {
                    delete_customer(data.id);
                    layer.msg(data.id + "离线了", {time: 1000, title: "离线提示"}, {})
                    $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                }
                if (data.type == "2" && data.content == "客服") {
                    layer.msg("访问权限已失效,请重新登录", {time: 2000, icon: 2, title: "提示"});
                    $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                    window.location.href = "CustomerServiceLogin.html";
                }
            });
            var message = set_message("", userId, userId, "1", "");//注册session
            sendName(message);
        })
    }

    connect();

    function sendName(message) {
        //通过stompClient.send（）向地址为"/welcome"的服务器地址发起请求，与@MessageMapping里的地址对应。因为我们配置了registry.setApplicationDestinationPrefixes(Constant.WEBSOCKETPATHPERFIX);所以需要增加前缀/ws-push/
        stompClient.send("/ws-push/welcome", {}, JSON.stringify(message));
    }

//点击发送按钮
    function init_send_button() {
        $(".customer_service .customer_service_foot").find("button").click(function () {
            var userid = $(this).next().text().trim();
            var $parent = $(this).closest(".customer_service");
            var text = $parent.find(".customer_service_input").val();
            if (text.trim() == "")
                return;
            var show_date = getCurrentTime();
            var message = set_message(userid, userId, show_date, "客服", text);
            sendName(message);//发送消息
            var content = $("<div class=\"visitor\">\n" +
                "                            <img src=\"img/customer.png\" alt=\"客服\" class=\"visitor_head_img\">\n" +
                "                            <div class=\"visitor_time\"><span>" + show_date + "</span><span>客服</span></div>\n" +
                "                            <div class=\"visitor_input_content\">\n" +
                "                                 " + text + "\n" +
                "                            </div>\n" +
                "                        </div>");
            $parent.find(".customer_service_content").append(content);
            $parent.find(".customer_service_input").val("");
            var scroll_top = $parent.find(".customer_service_content").scrollTop();
            $parent.find(".customer_service_content").scrollTop(10000 + scroll_top);
        });
    };

    //关闭服务
    function disconnect() {
        if (stompClient != null) {
            stompClient.disconnect();
        }
        console.log("Disconnected");
    }

    //关闭页面是关闭服务
    window.onbeforeunload = function () {
        var message = set_message("", userId, getCurrentTime(), "2", "客服");//注销session
        sendName(message);
        disconnect();
    }

    //删除cookie中的用户名和密码的类型
    function delete_cookie() {
        $.cookie("Customer_username", null, {path: "/"});
        $.cookie("Customer_password", null, {path: "/"});
        $.cookie("Customer_login", null, {path: "/"});
    }

    //点击退注销按钮
    $("#quit").click(function () {
        layui.use("layer", function () {
            var layer = layui.layer;
            layer.confirm("你确定要注销登录吗？", {btn: ['确定', '取消'], title: "警告", icon: 3}, function (index) {
                //删除cookie
                delete_cookie();
                //删除session(username和password)
                $.ajax({
                    url: "CustomerServiceQuitLogin",
                    type: "post",
                    dataType: "json",
                    success: function (data) {

                        layui.use("layer", function () {
                            var layer = layui.layer;

                            if (data.code == 0) {
                                window.location.href = "CustomerServiceLogin.html";
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
                    url: "CustomerServiceQuitLogin",
                    type: "post",
                    dataType: "json",
                    success: function (data) {

                        layui.use("layer", function () {
                            var layer = layui.layer;
                            if (data.code == 0) {
                                history.back();//返回客服登录界面
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

})