console.log("t.js加载")

require(["../../js/config"],function(){
    require(["jquery", "template","common"],function($,template,common){
        $(function(){
            //页面top ,bottom 初始化
            common.init();
            let homeMap = new Map();
            let p1 = new Promise(function(resolve){
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

            Promise.all([p1,p2]).then(function(){
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

                if(window.localStorage.shopcar){
									$(".car").hide();
									$(".more-shop").show()

									var data = JSON.parse(window.localStorage.shopcar);


									console.log(data);
									$(".more-shop").load("template/con_shops.html",function(){
                        var temp = template("shops",{
                            data:data
                        })
                        data.sumcar = 0;
                        data.moneycar=0;
                        for(var i in data){
                            if( typeof (data[i]) == "object"){
                               data.sumcar += parseInt(data[i].num) ;
                               data.moneycar +=  parseInt(data[i].num) * parseInt(data[i].price);
                            }
                        }
                        
                        console.log(data.sumcar,data.money)
                        $(".more-shop").html(temp);
                        $(".gjjj span").text(data.sumcar);
                        window.localStorage.shopcar = JSON.stringify(data);
                        $(window).scroll(function(){
                       
                            if($(".title-car").offset().top + $(".shopcars").height() > $(window).height() + $(window).scrollTop()) {
                               
                                $(".qx").addClass("scrollT");
                            }else{
                                $(".qx").removeClass("scrollT");
                            }
                        })
    
                        $("#all-ck").bind("click",function(){
                            $("#all-ck").toggleClass("chk-active");
                            $(".chk").attr("class",$("#all-ck").attr("class"))
                            $(".xzjj span").text($(".chk:not(:last)[class='chk chk-active']").length);
                            $(".sumpay span").text($(".gjjj span").text())
                            if($("#all-ck").attr("class").indexOf("chk-active") != -1){
                                $(".sumpay span").text(data.moneycar);
                                $(".xzjj span").text(data.sumcar);
                            }else{
                                $(".sumpay span").text("0");
                                $(".xzjj span").text("0");
                            }
                        })
    
                        $(".chk:not(:last)").bind("click",function(){
                            var id = $(this).parent().parent().attr("localid");
                            $(this).toggleClass("chk-active");
                            $(".xzjj span").text($(".chk:not(:last)[class='chk chk-active']").length);
                            if($(this).attr("class").indexOf("chk-active") == -1){
                                $(".sumpay span").text(parseInt($(".sumpay span").text()) - data[id].num * data[id].price ) 
                                $(".xzjj span").text(parseInt($(".xzjj span").text()) -  data[id].num )
                                $("#all-ck").removeClass("chk-active");
                            }else{
                               
                                
                                $(".sumpay span").text(parseInt($(".sumpay span").text()) + data[id].num * data[id].price ) 
                                $(".xzjj span").text(parseInt($(".xzjj span").text()) +  data[id].num )
                            }
                        })
    
                        $(".del-all").click(function(){
                           
                           
                            $(".chk:not(:last)[class='chk chk-active']").parent().parent().each(function(){
                                data.sumcar -= data[$(this).attr("localid")].num;
                                data.moneycar -= data[$(this).attr("localid")].num * data[$(this).attr("localid")].price;
                                if( $(this).siblings(".chk").attr("class").indexOf("chk-active") != -1){
                                    $(".sumpay span").text(  parseInt($(".sumpay span").text()) - data[$(this).attr("localid")].num *  data[$(this).attr("localid")].price)  
                                    
                                }

                                $(".gjjj span").text(data.sumcar);
                                $(".sumpay span").text("0")
                                delete data[$(this).attr("localid")];
                            })
                            
                            window.localStorage.shopcar = JSON.stringify(data);
                            $(".chk:not(:last)[class='chk chk-active']").parent().parent().remove();
                            $(".xzjj span").text($(".chk:not(:last)[class='chk chk-active']").length);
                            if($(".chk:not(:last)[class='chk']").length ==0){
                                $(".car").show();
                                $(".more-shop").hide()
                                window.localStorage.removeItem("shopcar")
                            }
                        })
                        
                        $(".del").click(function(){
                           var id = $(this).parent().parent().attr("localid")
                           data.sumcar -=data[id].num;
                           data.moneycar -= data[id].num * data[id].price;
                           $(".gjjj span").text(data.sumcar);
                           if( $(this).siblings(".chk").attr("class").indexOf("chk-active") != -1){
                                $(".sumpay span").text(parseInt( $(".sumpay span").text()) - data[id].num * data[id].price) ;
                           }
                            
                            delete data[id];
                            
                            window.localStorage.shopcar = JSON.stringify(data);
                            $(this).parent().parent().remove();
                            $(".xzjj span").text($(".chk:not(:last)[class='chk chk-active']").length);
                            if($(".chk:not(:last)[class='chk']").length ==0 && $(".chk:not(:last)[class='chk chk-active']").length == 0){
                                $(".car").show();
                                $(".more-shop").hide()
                                window.localStorage.removeItem("shopcar")
                            }

                        })

                        $(".jian").click(function(){
                           var id =  $(this).parent().parent().parent().attr("localid");
                           if( data[id].num == 1){
                               console.log(2)
                                return ;
                           } else{
                                data[id].num -=1
                                data.sumcar -=1;
                                data.moneycar -= data[id].price;
                                $(this).siblings("span").text(data[id].num);
                                $(this).parent().siblings(".sum").find("span").text( parseInt($(this).parent().siblings(".sum").find("span").text()) -  data[id].price)
                                console.log($(this).parent().siblings(".chk").hasClass("chk-active"));
                                $(".gjjj span").text( parseInt($(".gjjj span").text()) - 1 )
                                if($(this).parent().siblings(".chk").hasClass("chk-active")){
                                    $(".xzjj span").text( parseInt($(".xzjj span").text()) - 1)
                                    $(".sumpay span").text( parseInt($(".sumpay span").text()) - data[id].price)
                                }
                           }
                           window.localStorage.shopcar = JSON.stringify(data);
                        })

                        $(".jia").click(function(){
                            console.log(123)
                            var id =  $(this).parent().parent().parent().attr("localid");
                            data[id].num +=1;
                            data.sumcar +=1;
                            data.moneycar += data[id].price;
                            $(".gjjj span").text( parseInt($(".gjjj span").text()) + 1 )
                            $(this).siblings("span").text(data[id].num);
                            $(this).parent().siblings(".sum").find("span").text( parseInt($(this).parent().siblings(".sum").find("span").text()) +  data[id].price)
                            if($(this).parent().siblings(".chk").hasClass("chk-active")){
                                $(".xzjj span").text( parseInt($(".xzjj span").text()) + 1)
                                $(".sumpay span").text( parseInt($(".sumpay span").text()) + data[id].price)
                            }
                            window.localStorage.shopcar = JSON.stringify(data);
                         })
                     })
                }
            })
        })
    })
})