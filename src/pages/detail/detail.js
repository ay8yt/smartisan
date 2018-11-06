require(["../../js/config.js"],function(){
    require(["jquery","common","template"],function($,common,template){
       
        $(function(){
            common.init();
            // common.__myOff();
           
           
            //商品信息
            var dbId = location.href.split("=")[1];
            
            
            let shop = null;
            let p1 = new Promise(function(resolve){
                $.ajax({
                    url:"http://localhost:8080/api/more/skus?ids="+ dbId +"&with_stock=true&with_spu=true",
                    dataType:"json",
                    success : function(json){
                        shop = json.data.list[0];
                        resolve();
                    }
                })
            })

            //tag数据
            let jList = null;
            let contTag = [];

            let p2 = new Promise(function(resolve){
                $.ajax({
                    url:"http://localhost:8080/api/tag",
                    dataType:"json",
                    success : function(json){
                        jList = json.data.list;
                        resolve();
                    }
                })
            })

            //页面详细信息
            let shopDetail = null;
            let p3 = new Promise(function(resolve){
                $.ajax({
                    url:"http://localhost:8080/api/more/spus?ids=" + dbId.substr(0,dbId.length-2),
                    dataType:"json",
                    success : function(json){
                        shopDetail = json.data.list[0];
                        resolve();
                    }
                })
            })


            let homeMap = new Map();
            let p4 = new Promise(function(resolve){
                $.ajax({
                    url : "http://localhost:8080/api/home",
                    dataType : "json",
                    timeout:10000,
                    success : function(json){
                        for(var i in json.data){
                            homeMap.set(i,json.data[i])
                        }
                        resolve();
                    }
                })
            })


            var conTag = {};
            Promise.all([p1,p2,p3,p4]).then(function(){
                
              
                
                //数据处理
                 var flag = true;
                // var temp = shop.spu_id;
                 for(var i in jList){
                    if(jList[i].rule.condition.main_skus.indexOf(Number(shop.id)) != -1){
                        conTag.temp = [shopDetail,shop,jList[i]];
                        flag = false;
                        break;
                    }
                 }
                if(flag){
                    conTag.temp = [shopDetail,shop];
                }
               

                //加载模板
                $(".center").load("template/template_detail.html",function(){
                    console.log(conTag)

                    var _html = template("detail",{
                        data : conTag
                    })

                    $(".center").html(_html)

                   
                    $(".ul-color ul li").hover(function(){
                        $(this).addClass(".rl-hover");
                    })

                    $(".bx ul li .item").hover(function(){
                        $(this).addClass("item-hover")
                    })

                    if($(".fixed-bottom").offset().top > $(window).height()){
                        $(".fixed-bottom").css({
                            position:"fixed",
                            bottom:0
                        })
                    }
                    $(window).scroll(function(){
                       if($(window).scrollTop() + $(window).height() >= $(document).height()-366){
                        $(".fixed-bottom").css({
                            position:"absolute",
                            bottom: 366
                        })
                       }else{
                        $(".fixed-bottom").css({
                            position:"fixed",
                            bottom:0
                        })
                       }
                    })
                    
                    var choose = shopDetail.sku_info;
                    
                    //添加商品属性，便于查找属性
                    for(var i in choose){
                        if(choose[i].spec_json.length > 1 ){
                            choose[i].rl_id = choose[i].spec_json[1].spec_value_id;
                            choose[i].rl_name = choose[i].spec_json[1].show_name;
                        }
                        
                        choose[i].color_name = choose[i].spec_json[0].show_name;
                    }

                    function swap(color_id,rl_id){
                        if(rl_id != ""){
                            var temp = true;
                            for(var i in choose){
                                if(color_id == choose[i].color_id && rl_id == choose[i].rl_id){
                                    temp = false;
                                    break;
                                }
                            }
                            if(temp){
                                rl_id = "";
                            }
                        }
                        console.log(choose)
                        for(var i in choose){
                            if(choose[i].rl_id != undefined){
                                
                                if(rl_id == ""){
                                    if(color_id == choose[i].color_id){
                                        $(".head_img img").attr("src",choose[i].ali_image+"?x-oss-process=image/resize,w_527/format,webp");
                                        $("my1").text(choose[i].color_name);
                                        $("my2").text(choose[i].rl_name);
                                        $(".pname").text(choose[i].title);
                                        $(".pprice").text("¥"+choose[i].price);
                                        $(".price-b").text(choose[i].price);
                                        $("#buy").attr("color_id",choose[i].color_id);
                                        $("#buy").attr("rl_id",choose[i].rl_id);
                                        $(".title-name").attr("sku_id",choose[i].sku_id)
                                        
                                        return;
                                    }
                                 }else if(color_id == choose[i].color_id && rl_id == choose[i].rl_id){
                                    $(".head_img img").attr("src",choose[i].ali_image+"?x-oss-process=image/resize,w_527/format,webp");
                                    $("my1").text(choose[i].color_name);
                                    $("my2").text(choose[i].rl_name);
                                    $(".pname").text(choose[i].title);
                                    $(".pprice").text("¥"+choose[i].price);
                                    $(".price-b").text(choose[i].price);
                                    $("#buy").attr("color_id",color_id);
                                    $("#buy").attr("rl_id",rl_id);
                                    $(".title-name").attr("sku_id",choose[i].sku_id)
                                   
                                    return;
                                } 
                            }else{
                               
                                if(color_id == choose[i].color_id ){
                                    $(".head_img img").attr("src",choose[i].ali_image+"?x-oss-process=image/resize,w_527/format,webp");
                                    $("my1").text(choose[i].color_name);
                                    $("my2").text(choose[i].rl_name);
                                    $(".pname").text(choose[i].title);
                                    $(".pprice").text("¥"+choose[i].price);
                                    $(".price-b").text(choose[i].price);
                                    $("#buy").attr("color_id",color_id);
                                    $("#buy").attr("rl_id",rl_id);
                                    $(".title-name").attr("sku_id",choose[i].sku_id)
                                   
                                    return;
                                }
                            }
                                
                        }
                    }



                    
                    if(conTag.temp.length > 1 ){
                        $(".ul-color ul li").click(function(e){
                            console.log(color_id,rl_id)
                            $(".ul-color ul li").removeClass("li-active");
                            $(this).addClass("li-active");
                            var color_id = $(this).attr("color_id");
                            var rl_id = $("#buy").attr("rl_id");
                            console.log(color_id,rl_id)
                            swap(color_id,rl_id);
                            $(".rl ul li").addClass("disabled").removeClass("rl-li");
                            $(".rl ul li").off("click",rlClick);
                            
                            let colorFlag = true;
                            for(var i in choose){
                                
                               if(choose[i].color_id == color_id){
                                   //console.log(choose[i].rl_id,color_id)
                                    $(".rl ul li[rl_id=" + choose[i].rl_id +"]").removeClass("disabled").on("click",rlClick);
                                    
                                    if(colorFlag){
                                        $(".rl ul li[rl_id=" + choose[i].rl_id +"]").click();
                                        colorFlag = false;
                                    }
                               } 
                            }
                        })

                        $(".rl ul li").bind("click",rlClick);
                        function rlClick(){
                            $(".rl ul li").removeClass("rl-li");
                            $(this).addClass("rl-li");
                            var color_id = $("#buy").attr("color_id");
                            var rl_id = $(this).attr("rl_id");
                            swap(color_id,rl_id);
                            
                        }

                      
                        $(".bx ul li .item").click(function(){
                            $(this).toggleClass("item-active")
                        })
                        var obj = conTag.temp[1];
                        $(".ul-color ul li").removeClass("li-active");
                        //$(".ul-color ul li[color_id='"+ obj.attr_info[1].spec_value_id+"']").addClass("li-active")
                        if(obj.attr_info[1]){
                            
                            $(".ul-color ul li[color_id='"+ obj.attr_info[1].spec_value_id+"']").click();
                        }
                       
                    }

                    //热卖商品数据整理
                    let homeHot = homeMap.get("home_hot");
                    for(var i in homeHot){
                        var flag = true;
                        for(var j in jList ){
                            if(jList[j].rule.condition.main_skus.indexOf(Number(homeHot[i].sku_id)) != -1 ){
                                var temp = homeHot.sku_id;
                                flag = false;
                                contTag.push({
                                    temp : [homeHot[i],jList[j]]
                                })
                                break;
                            }
                        }
                        if(flag){
                            contTag.push({
                                temp : [homeHot[i]]
                            })
                        }
                    }

                     //热卖商品
                    $(".home-hot-shop").load("template/home_hot_shop.html",function(){
                        var temp = template("home-hot-shop",{
                            data : contTag
                        });
                        $(".home-hot-shop").html(temp);

                        if($(".home-hot-shop").find(".con-ul").children("ul").css("left") == "0px"){
                            $(".for-left").addClass("a-disabled");
                        }
                        //图片按钮切换 li_hover_hot_shop li_hover
                        $(".li_hover_hot_shop").hover(function() {
                            $(this).find('h6').eq(0).hide().end().eq(1).show();
                            $(this).find(".money").hide();
                            $(this).find("button").css("display","block");
                        },function() {
                            $(this).find('h6').eq(0).show().end().eq(1).hide();
                            $(this).find(".money").show();
                            $(this).find("button").hide();
                        })
                        //切换图片 e.stoppropagation
                        $(".li_hover_hot_shop").on("click",".ck_li",function(e){
                        
                            e.stopPropagation();
                            $(this).siblings().removeClass("li-active");
                            $(this).addClass("li-active");
                            var _j = $(this).attr("id");
                            var _i = $(this).attr("dataI");
                            var _image = contTag[_i].temp[0].spu.sku_info[_j].ali_image;
                            var _price = contTag[_i].temp[0].spu.sku_info[_j].price;
                            $(this).parent().parent().parent().parent().attr("href","http://localhost:8080/pages/detail/detail.html?spu="+contTag[_i].temp[0].spu.sku_info[_j].sku_id)
                            $(this).parent().parent().parent().find(".money").find("span").eq(1).text(_price)
                            $(this).parent().parent().parent().find(".com-img").find("img").attr("src",_image+"?x-oss-process=image/resize,w_216/format,webp");
                        })
                        $(".li_hover_hot_shop").click(function(e){
                            window.open($(this).attr("href"));
                        })
                        
                    }) 

                    $("#buy").bind("click",function(){
                        var storage = window.localStorage;
                        var newObj = null;
                        if(storage.shopcar){
                            newObj = JSON.parse(storage.shopcar);
                        }else{
                            newObj = {};
                        }
                        var sku_id = $(".title-name").attr("sku_id")
                        console.log($(".title-name").attr("sku_id"))
                        if(newObj[sku_id]){
                            newObj[sku_id].num+=1;
                            storage.setItem("shopcar",JSON.stringify(newObj));
                        } else {
                           console.log( parseInt($(".price-b").text()))
                            var obj = {
                                imgurl : $(".head_img img").attr("src").trim(),
                                name : $(".pname").text().trim(),
                                color : $("my1").text().trim(),
                                price : parseInt($(".price-b").text()),
                                num : 1
                            }
                            if ($(".hdtag").length > 0){
                                
                                obj.tag = $(".hdtag").text().trim();
                                obj.title = $(".hdtat-me").text().trim();
                            } 
                            if($("my2").length > 0){
                                obj.rl = $("my2").text().trim();
                            }
                            newObj[sku_id] = obj;
                            storage.setItem("shopcar",JSON.stringify(newObj));
                        }
                           
                        

                        
                       
                       $(".shopTips").fadeIn(1000).delay(1000).fadeOut(1000);
                       $(this).blur();
                    })



                })


            })



        })
    })
})