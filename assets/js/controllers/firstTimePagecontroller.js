var FirstTimeCtrl=["$scope","$http",function(e,t){t.defaults.headers.common["XSRF_TOKEN"]=$("#csrf").val();e.email=$("#userEmail").val();e.textbox=false;e.showInput=function(){e.textbox=true};e.hideInput=function(){e.textbox=false};e.changeEmail=function(){showLoading("Settings","Please wait while we save your Settings");e.userId=$("#userId").val();var n=baseUrl+"register/changeEmail?userId="+e.userId+"&email="+e.email;t.get(n).success(function(t){if(t.success==true){e.textbox=false}else if(t.success==false&&t.error.msg=="Email same"){$("#email").prop("title","The Email you entered is already your registered Email");$("#email").tooltip("show")}})}}]