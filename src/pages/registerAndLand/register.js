define(["jquery","common"],function($,common){
    return {
        run(){
                $(".rem").find(".left").click(function(){
                    console.log(0);
                    $(this).find("span").toggleClass("span-active");
                })
                var textFlag = false;
                var passWrodFlag = false;


                $("input[type='text']").on("blur",function(){
                    textFlag = false;
                    var reg = /^1[34578][0-9]{9}/;
                    var reg1 = /[a-zA-Z0-9]{1,10}@[a-zA-Z0-9]{1,5}\.[a-zA-Z0-9]{1,5}/;
                    if( $(this).val()==""){
                        textFlag = false;
                        $(this).siblings(".errorMessage").fadeOut(500);
                    } 
                    else if( !reg.test( $(this).val()) && !reg1.test( $(this).val())){
                        $(this).siblings(".errorMessage").fadeIn(500);
                        textFlag = false;
                    }else{
                        textFlag = true;
                        $(this).siblings(".errorMessage").fadeOut(500);
                    }
                    if(textFlag && passWrodFlag){
                        $(".btn").removeAttr("disabled").css("pointer-events","painted");
                    }else{
                        $(".btn").attr("disabled","disabled").css("pointer-events","none")
                    }
                })
                $("input[type='text']").get()[0].addEventListener("input",function(){
                    $("input[type='password']").siblings(".errorMessage").fadeOut(500);
                })


                $("input[type='password']").get()[0].addEventListener("input",function(){
                
                    passWrodFlag = false;
                    $("input[type='password']").siblings(".errorMessage").fadeOut(500);
                    if($(this).val() != ""){
                        passWrodFlag = true;
                    }else{
                        passWrodFlag = false;
                    }
                    if(textFlag && passWrodFlag){
                        $(".btn").removeAttr("disabled").css("pointer-events","painted");
                    
                    }else{
                        $(".btn").attr("disabled","disabled").css("pointer-events","none")
                    }
                })

                $(".btn").click(function(){
                    var str = common.getCookie($("input[type='text']").val())
                    if(str == null || str != $("input[type='password']").val()){
                        $("input[type='password']").siblings(".errorMessage").fadeIn(500);
                    }else{
                        /**
                         * 免登陆checkbox实现
                         * 
                         * 登陆成功后 判断是否勾选
                         * 
                         * 如果勾选。存入登陆时间
                         * 
                         * 每次打开登陆界面，查找cookie里的值，中 登陆时间最小的， 用作登陆的用户
                         * 
                         */
                        location.href="http://localhost:8080/pages/index/index.html";
                    }
                })
        }
    }
})