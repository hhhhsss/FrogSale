/*
 * Â©2016 Quicken Loans Inc. All rights reserved.
 */
/* global jQuery FormData FileReader */
(function ($) {
    var index=0;
    $.fn.uploader = function (options, testMode) {
        return this.each(function () {
            options = $.extend({
                submitButtonCopy: 'Upload Selected Files',
                instructionsCopy: 'Drag and Drop, or',
                furtherInstructionsCopy: 'Your can also drop more files, or',
                selectButtonCopy: 'Select Files',
                secondarySelectButtonCopy: 'Select More Files',
                dropZone: $(this),
                fileTypeWhiteList: ['jpg', 'png', 'jpeg', 'gif', 'pdf'],
                badFileTypeMessage: 'Sorry, we\'re unable to accept this type of file.',
                ajaxUrl: '/ajax/upload',
                testMode: false
            }, options);

            var state = {
                fileBatch: [],
                isUploading: false,
                isOverLimit: false,
                listIndex: 0
            };

            // create DOM elements
            var dom = {
                uploaderBox: $(this),
                submitButton: $('<button class="js-uploader__submit-button uploader__submit-button uploader__hide">' +
                    options.submitButtonCopy + '<i class="js-uploader__icon fa fa-upload uploader__icon"></i></button>'),
                instructions: $('<p class="js-uploader__instructions uploader__instructions">' +
                    options.instructionsCopy + '</p>'),
                selectButton: $('<input style="height: 0; width: 0;" id="fileinput' + index + '" type="file" multiple class="js-uploader__file-input uploader__file-input">' +
                    '<label for="fileinput' + index + '" style="cursor: pointer;" class="js-uploader__file-label uploader__file-label">' +
                    options.selectButtonCopy + '</label>'),
                secondarySelectButton: $('<input style="height: 0; width: 0;" id="secondaryfileinput' + index + '" type="file"' +
                    ' multiple class="js-uploader__file-input uploader__file-input">' +
                    '<label for="secondaryfileinput' + index + '" style="cursor: pointer;" class="js-uploader__file-label uploader__file-label uploader__file-label--secondary">' +
                    options.secondarySelectButtonCopy + '</label>'),
                fileList: $('<ul class="js-uploader__file-list uploader__file-list"></ul>'),
                contentsContainer: $('<div class="js-uploader__contents uploader__contents"></div>'),
                furtherInstructions: $('<p class="js-uploader__further-instructions uploader__further-instructions uploader__hide">' + options.furtherInstructionsCopy + '</p>')
            };

            // empty out whatever is in there
            dom.uploaderBox.empty();

            // create and attach UI elements
            setupDOM(dom);

            // set up event handling
            bindUIEvents();

            function setupDOM (dom) {
                dom.contentsContainer
                    .append(dom.instructions)
                    .append(dom.selectButton);
                dom.furtherInstructions
                    .append(dom.secondarySelectButton);
                dom.uploaderBox
                    .append(dom.fileList)
                    .append(dom.contentsContainer)
                    .append(dom.submitButton)
                    .after(dom.furtherInstructions);
            }

            function bindUIEvents () {
                // handle drag and drop
                options.dropZone.on('dragover dragleave', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                });
                $.event.props.push('dataTransfer'); // jquery bug hack
                options.dropZone.on('drop', selectFilesHandler);

                // hack for being able selecting the same file name twice
                dom.selectButton.on('click', function () { this.value = null; });
                dom.selectButton.on('change', selectFilesHandler);
                dom.secondarySelectButton.on('click', function () { this.value = null; });
                dom.secondarySelectButton.on('change', selectFilesHandler);

                // handle the submit click
                dom.submitButton.on('click', uploadSubmitHandler);

                // remove link handler
                dom.uploaderBox.on('click', '.js-upload-remove-button', removeItemHandler);

                // expose handlers for testing
                if (options.testMode) {
                    options.dropZone.on('uploaderTestEvent', function (e) {
                        switch (e.functionName) {
                        case 'selectFilesHandler':
                            selectFilesHandler(e);
                            break;
                        case 'uploadSubmitHandler':
                            uploadSubmitHandler(e);
                            break;
                        default:
                            break;
                        }
                    });
                }
            }

            function addItem (file) {
                // var fileName = cleanName(file.name);
                var fileName =file.name;
                var fileSize = file.size;
                var id = state.listIndex;
                var sizeWrapper;
                var fileNameWrapper = $('<span class="uploader__file-list__text">' + fileName + '</span>');

                state.listIndex++;

                var listItem = $('<li class="uploader__file-list__item" data-index="' + id + '"></li>');
                var thumbnailContainer = $('<span class="uploader__file-list__thumbnail"></span>');
                var thumbnail = $('<img class="thumbnail"><i class="fa fa-spinner fa-spin uploader__icon--spinner"></i>');
                var removeLink = $('<span class="uploader__file-list__button"><button class="uploader__icon-button js-upload-remove-button fa fa-times" data-index="' + id + '"></button></span>');

                // validate the file
                if (options.fileTypeWhiteList.indexOf(getExtension(file.name).toLowerCase()) !== -1) {
                    // file is ok, add it to the batch
                    state.fileBatch.push({file: file, id: id, fileName: fileName, fileSize: fileSize});
                    sizeWrapper = $('<span class="uploader__file-list__size">' + formatBytes(fileSize) + '</span>');
                } else {
                    // file is not ok, only add it to the dom
                     sizeWrapper = $('<span class="uploader__file-list__size"><span class="uploader__error">' + options.badFileTypeMessage + '</span></span>');
                }

                // create the thumbnail, if you can
                if (window.FileReader && file.type.indexOf('image') !== -1) {
                    var reader = new FileReader();
                    reader.onloadend = function () {
                        thumbnail.attr('src', reader.result);
                        thumbnail.parent().find('i').remove();
                    };
                    reader.onerror = function () {
                        thumbnail.remove();
                    };
                    reader.readAsDataURL(file);
                } else if (file.type.indexOf('image') === -1) {
                   thumbnail = $('<i class="fa fa-file-o uploader__icon">');
                }

                thumbnailContainer.append(thumbnail);
                listItem.append(thumbnailContainer);

                listItem
                    .append(fileNameWrapper)
                    .append(sizeWrapper)
                    .append(removeLink);

                dom.fileList.append(listItem);
            }

            function getExtension (path) {
                var basename = path.split(/[\\/]/).pop();
                var pos = basename.lastIndexOf('.');

                if (basename === '' || pos < 1) {
                    return '';
                }
                return basename.slice(pos + 1);
            }

            function formatBytes (bytes, decimals) {
                if (bytes === 0) return '0 Bytes';
                var k = 1024;
                var dm = decimals + 1 || 3;
                var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
                var i = Math.floor(Math.log(bytes) / Math.log(k));
                return (bytes / Math.pow(k, i)).toPrecision(dm) + ' ' + sizes[i];
            }

            function cleanName (name) {
                name = name.replace(/\s+/gi, '-'); // Replace white space with dash
                return name.replace(/[^a-zA-Z0-9.\-]/gi, ''); // Strip any special characters
            }
            //图片全屏
            //获取一个文件夹下的所有文件相对路径,并显示到某个ul中
            function get_filepath(type,ul){

                $.ajax({
                    url:"get_filepath",
                    type:"post",
                    dataType:"json",
                    data:{"path":type},
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
                                    //点击了删除按钮
                                    ul.find(">li span").click(function () {
                                        var img_src = $(this).prev().attr("src");
                                        layui.use('layer', function () {
                                            var layer = layui.layer;
                                            layer.confirm('确认删除?',{btn:['确定','取消'],title:'提示',icon:2},function (index) {
                                                $.ajax({
                                                    url:"delete_one_file",
                                                    type:'post',
                                                    dataType:'json',
                                                    data:{"path":img_src},
                                                    success:function (data) {
                                                        if (data.code == "0") {
                                                            layui.use("layer", function () {
                                                                var layer = layui.layer;
                                                                get_filepath(type, ul);
                                                                layer.msg("删除图片成功", {time: 1000, icon: 1}, function () {

                                                                });
                                                                $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                                                            });

                                                        } else if(data.code=="-2"){
                                                            //没有访问权限
                                                            layui.use("layer", function () {
                                                                var layer = layui.layer;
                                                                layer.msg("访问权限已失效,请重新登录", {time: 1000, icon: 2}, function () {
                                                                    window.location.href="/Managerbackground.html";
                                                                });
                                                                $("div[id^='layui-layer']").css({
                                                                    "width": "",
                                                                    "z-index": "99999999999"
                                                                });
                                                            });

                                                        }
                                                        else if(data.code=="1"||data.code=="2"){
                                                            layui.use("layer", function () {
                                                                var layer = layui.layer;
                                                                layer.msg("图片不存在", {time: 1000, icon: 2}, function () {

                                                                });
                                                                $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                                                            });
                                                        }
                                                        else{
                                                            layui.use("layer", function () {
                                                                var layer = layui.layer;
                                                                layer.msg("图片删除失败", {time: 1000, icon: 2}, function () {

                                                                });
                                                                $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                                                            });
                                                        }

                                                    },
                                                    error:function (XMLHttpRequest) {
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
                                    img.append($(img1));
                                    img.append($("<span class=\"glyphicon glyphicon-remove\">"));
                                    ul.append(img);
                                    addImage(i + 1);
                                } else {
                                    img1.onload = function () {
                                        var img = $('<li></li>');
                                        img.append($(img1));
                                        img.append($("<span class=\"glyphicon glyphicon-remove\">"));
                                        ul.append(img);
                                        addImage(i + 1);
                                    }
                                }
                            }
                            addImage(0);



                        } else if(data.code=="-2"){
                            //没有访问权限
                            layui.use("layer", function () {
                                var layer = layui.layer;
                                layer.msg("访问权限已失效,请重新登录", {time: 1000, icon: 2}, function () {
                                    window.location.href="/Managerbackground.html";
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
                                layer.msg("获取图片失败", {time: 1000, icon: 2}, function () {

                                });
                                $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                            });
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
                 var id_array=["save_about_second","save_about_third","save_ProductCenter_one","save_ProductCenter_second","save_ProductCenter_third"];

            function uploadSubmitHandler () {
                var $this=$(this);
                var $button= $(this).siblings("ul").find(">li");
                layui.use('layer', function () {
                    var layer = layui.layer;
                    layer.confirm('确定上传图片?', {
                        btn: ['确认', '取消'],title:'提示',icon:3
                    }, function ()
                    {     var load;
                        layui.use("layer", function () {
                        var layer = layui.layer;
                      load=layer.load(1,{shade:[0.1,'#fff']});
                    }
                    )
                        if (state.fileBatch.length !== 0) {
                            var data = new FormData();
                            for (var i = 0; i < state.fileBatch.length; i++) {
                                data.append('files[]', state.fileBatch[i].file,cleanName(state.fileBatch[i].fileName));
                            }
                            $.ajax({
                                type: 'POST',
                                url: options.ajaxUrl,
                                data: data,
                                dataType:"json",
                                cache: false,
                                contentType: false,
                                processData: false,
                                success:function (e) {
                                    if(e.code=="0"){
                                        layui.use("layer", function () {
                                            var layer = layui.layer;

                                            //资格许可证
                                            if(id_array.indexOf(options.ajaxUrl.trim())==0)
                                            get_filepath(0,$this.closest("#container").find(">ul:first"));
                                            else if(id_array.indexOf(options.ajaxUrl.trim())==1)
                                            //基地 展示
                                            get_filepath(1,$this.closest("#Basedisplay").find(">ul:first"));
                                            else if(id_array.indexOf(options.ajaxUrl.trim())==2)
                                            //蛙苗
                                            get_filepath(2,$this.closest("#Frog_seedling").find(">ul:first"));
                                            else if(id_array.indexOf(options.ajaxUrl.trim())==3)
                                            //成蛙
                                            get_filepath(3,$this.closest("#AdultFrog").find(">ul:first"));
                                            else if(id_array.indexOf(options.ajaxUrl.trim())==4)
                                            //种蛙
                                            get_filepath(4,$this.closest("#Frog").find(">ul:first"));

                                            $button.find(" >span:last >button").click();
                                            layer.close(load);
                                            layer.msg("上传图片成功", {time: 1000, icon: 1}, function () {


                                            });
                                            $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                                        });
                                    }
                                    else if(e.code=="-2"){
                                        //没有访问权限
                                        layui.use("layer", function () {
                                            var layer = layui.layer;
                                            layer.close(load);
                                            layer.msg("访问权限已失效,请重新登录", {time: 1000, icon: 2}, function () {
                                                window.location.href="/Managerbackground.html";
                                            });
                                            $("div[id^='layui-layer']").css({
                                                "width": "",
                                                "z-index": "99999999999"
                                            });
                                        });

                                    }else{
                                        layui.use("layer", function () {
                                            var layer = layui.layer;
                                            layer.close(load);
                                            layer.msg("上传图片失败", {time: 1000, icon: 2}, function () {

                                            });
                                            $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                                        });
                                    }
                                },
                                error:function (XMLHttpRequest) {
                                    layui.use("layer", function () {
                                        var layer = layui.layer;
                                        layer.close(load);
                                        layer.msg("上传图片失败", {time: 1000, icon: 2}, function () {

                                        });
                                        $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                                    });
                                    console.log("错误类型:"+XMLHttpRequest.status+",错误内容:"+XMLHttpRequest.statusText);

                                }
                            });
                        }
                    }
                    );
                });

            }

            function selectFilesHandler (e) {
                e.preventDefault();
                e.stopPropagation();
                if (!state.isUploading) {
                    // files come from the input or a drop
                    var files = e.target.files || e.dataTransfer.files || e.dataTransfer.getData;
                    // process each incoming file
                    var all_size=0;
                    for (var i = 0; i < files.length; i++) {
                        //如果不是图片就不上传
                        if (options.fileTypeWhiteList.indexOf(getExtension(files[i].name).toLowerCase()) == -1) {
                           continue;
                        }

                      if(files[i].size>50*1024*1024)
                      {
                          layui.use("layer", function () {
                              var layer = layui.layer;
                              layer.msg("上传图片最大为50mb", {time: 1000, icon: 2});
                              $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                          });
                      }else{
                            all_size+=files[i].size;
                            if(all_size>100*1024*1024){
                                layui.use("layer", function () {
                                    var layer = layui.layer;
                                    layer.msg("一次性上传图片最大为100mb", {time: 1000, icon: 2});
                                    $("div[id^='layui-layer']").css({"width": "", "z-index": "99999999999"});
                                });
                                break;
                            }else
                            {
                                addItem(files[i]);
                            }

                      }
                    }

                }
                renderControls();
            }

            function renderControls () {
                if (dom.fileList.children().size() !== 0) {
                    dom.submitButton.removeClass('uploader__hide');
                    dom.furtherInstructions.removeClass('uploader__hide');
                    dom.contentsContainer.addClass('uploader__hide');
                } else {
                    dom.submitButton.addClass('uploader__hide');
                    dom.furtherInstructions.addClass('uploader__hide');
                    dom.contentsContainer.removeClass('uploader__hide');
                }
            }

            function removeItemHandler (e) {
                e.preventDefault();

                if (!state.isUploading) {
                    var removeIndex = $(e.target).data('index');
                    removeItem(removeIndex);
                    $(e.target).parent().remove();
                }

                renderControls();
            }

            function removeItem (id) {
                // remove from the batch
                for (var i = 0; i < state.fileBatch.length; i++) {
                    if (state.fileBatch[i].id === parseInt(id)) {
                        state.fileBatch.splice(i, 1);
                        break;
                    }
                }
                // remove from the DOM
                // dom.fileList.find('li[data-index="' + id + '"]').find(">span:nth-child(3)")
                dom.fileList.find('li[data-index="' + id + '"]').remove();
            }
            index++;
        });
    };
}(jQuery));