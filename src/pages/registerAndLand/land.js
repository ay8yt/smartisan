define(["jquery","common"],function($,common){
    return {
        run(){
            //
            var regMm = /(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\w~!@#$%\^&*?]{6,16}$/;
            var regPhone = /^1[34578]\d{9}$/;
            var  regNum = /^\d{6}$/;

            var mm = false;
            var phone = false;
            var num1 = false;
            var num2= false;

            $("#phone").blur(function(){
                yz(this,regPhone);
            })
            $("#messageNum").blur(function(){
                yz(this,regNum);
            })
            $("#password1").blur(function(){
                yz(this,regMm);
            })
            $("#password2").blur(function(){
                yz(this,regMm);
            })
            $(".rem").find(".left").click(function(){
                
                $(this).find("span").toggleClass("span-active");
                if(($(".rem").find(".left").find("span").attr("class")+"").indexOf("span-active") != -1){
                    
                    if($("#phone").get()[0].flag && $("#messageNum").get()[0].flag && $("#password1").get()[0].flag && $("#password2").get()[0].flag ){
                        $("#zc").removeAttr("disabled").css("pointer-events","painted");
                    }else{
                        $("#zc").attr("disabled","disabled").css("pointer-events","none")
                    }
                }
                else{
                    $("#zc").attr("disabled","disabled").css("pointer-events","none")
                }
            })



            function yz(obj,reg){
                obj.flag = false;
                if($(obj).val() == ""){
                    obj.flag = false;
                    $(obj).siblings(".errorMessage").fadeOut(500);
                }
                else if(reg.test($(obj).val())){
                    obj.flag = true;
                    $(obj).siblings(".errorMessage").fadeOut(500);
                }else{
                    obj.flag = false;
                    $(obj).siblings(".errorMessage").fadeIn(500);
                }//&& phone && num1 && num2
                //&& $("#messageNum").flag && $("password1").flag && $("password2").flag
                if(($(".rem").find(".left").find("span").attr("class")+"").indexOf("span-active") != -1){
                    
                    if($("#phone").get()[0].flag && $("#messageNum").get()[0].flag && $("#password1").get()[0].flag && $("#password2").get()[0].flag ){
                        $("#zc").removeAttr("disabled").css("pointer-events","painted");
                    }else{
                        $("#zc").attr("disabled","disabled").css("pointer-events","none")
                    }
                }
            }

            $("input[type='password']").on("focus",function(){
                if($(this).val() == ""){
                    $(this).siblings(".mmgs").fadeIn(500);
                }
            })
            $("input[type='password']").on("blur",function(){
                $(this).siblings(".mmgs").fadeOut(500);
            })

            $("#zc").click(function(){
                var d = new Date();
                d.setDate(d.getDate()+10);
                document.cookie = $("#phone").val()+"=" + $("#password1").val() +"; expires="+d + ";path=/";
                location.href="http://localhost:8080/pages/index/index.html";
            })
        }
    }
})