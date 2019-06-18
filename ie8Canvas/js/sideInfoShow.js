function testtest(carID){
	//定义全局域名
	var domain='http://47.111.175.69';
    var domainForEcgWS='ws://47.111.175.69';
	var domainForBloodWS='ws://47.111.175.69'
	
     //定义判断是什么设备的集合
	 const ecgRecongnisingList=['ECG','DEFIBRILLATOR','ECG-MONITOR'];
	 const obdRecongnisingList=['OBD'];
	 const oxygenAndInverterRecongnisingList=['IOT-CARD']
	 const bloodGasRecongnisingList=['BLOOD-GAS']
	
	 
	 //通过carId去获得相应设备
	 var token=sessionStorage.token;
	 $.ajax({
		 url:domain+':8823/devices/search/vehicleNo/projection/summary?vehicleNo='+carID+'&access_token='+token,
		 type:'get',
		 success:function(res){
			 console.log(res)
			 if(res.count>0){
				  //用于延缓清除画布的变量
	  var heartClean=0;
	  var plethClean=0;
	  var artClean=0;
	  var respClean=0;
	  var heartCleanTimer=null;
	  var plethCleanTimer=null;
	  var artCleanTimer=null;
	  var respCleanTimer=null;
	  
	  //调整布局到2.6比例用
	  var fullCanvasHeight1_1=0;
	  
	  
	  //根据车辆返回的数据同设备集合比较设置网络请求所需的相应变量
	  var deviceInfoList=JSON.parse(JSON.stringify(res.data))
	  console.log(deviceInfoList)
	  var vehicle='';
	  var vin='';
	  var vehicleOxygen='';
	  var bloodGasId='';
	  
	  
	  for(var i=0;i<deviceInfoList.length;i++){
		   //检查是否有心电设备
		   for(var j=0;j<ecgRecongnisingList.length;j++){
			   if(deviceInfoList[i].devName==ecgRecongnisingList[j]){
				   vehicle=deviceInfoList[i].netSn
			   }
		   }
		   //检查是否有OBD
		   for(var k=0;k<obdRecongnisingList.length;k++){
			   if(deviceInfoList[i].devName==obdRecongnisingList[k]){
				   vin=deviceInfoList[i].netSn
			   }
		   }
		   //检查是否有氧气逆变器设备
		   for(var m=0;m<oxygenAndInverterRecongnisingList.length;m++){
			   if(deviceInfoList[i].devName==oxygenAndInverterRecongnisingList[m]){
				   vehicleOxygen=deviceInfoList[i].devSn
			   }
		   }
		   //检查是否有血气设备
		   for(var n=0;n<bloodGasRecongnisingList.length;n++){
			   if(deviceInfoList[i].devName==bloodGasRecongnisingList[n]){
				   bloodGasId=deviceInfoList[i].devSn
			   }
		   }
	  }
	  
	  //根据绑定设备情况选择展示的模块 下
	  var  htmlOfRanksB=''
	  //心电
	  
	  if(vehicle!=''){
		$('.heartP').show();
		$('#ecgTitle').show();
		//控制边栏某个模块展示和隐藏按钮ui
		htmlOfRanksB+="<div><span>心电监护</span><img class='subRb' data-arr='.heartP,#ecgTitle' src='images/img2/open.png'></div>"
	  }else{
		 $('.heartP').hide();
		 $('#ecgTitle').hide();  
	  }
	  //氧气和逆变器
	  if(vehicleOxygen!=''){
		$('.oxgen').show()
		$('#oxygenTitle').show()
	    $('#current').show()	 
        //控制边栏某个模块展示和隐藏按钮ui
		htmlOfRanksB+="<div><span>氧气压力</span><img class='subRb' data-arr='.oxgen,#oxygenTitle' src='images/img2/open.png'></div>"		
	  }else{
		 $('.oxgen').hide()
		$('#oxygenTitle').hide()
	    $('#current').hide() 
	  }
	  //OBD和电瓶
	  if(vin!=''){
	    $('.panel').show()
		$('#panelTitle').show()
	    $('#voltage').show()	
        //控制边栏某个模块展示和隐藏按钮ui
		htmlOfRanksB+="<div><span>车辆状态</span><img class='subRb' data-arr='.panel,#panelTitle' src='images/img2/open.png'></div>"	 		
	  }else{
		$('.panel').hide()
		$('#panelTitle').hide()
	    $('#voltage').hide()	 
	  }
	  //处理obd和逆变器均没有的情况
	  if(vin==''&&vehicleOxygen==''){
		  $('.power').hide()
		  $('#powerTitle').hide() 
	  }else{
		  $('.power').show()
		  $('#powerTitle').show()
		  //控制边栏某个模块展示和隐藏按钮ui
		  htmlOfRanksB+="<div><span>车辆电源</span><img class='subRb' data-arr='.power,#powerTitle' src='images/img2/open.png'></div>"	
	  }
	  //血气
	   if(bloodGasId!=''){
		 $('.bloodGas').show()
		 $('#bloodTitle').show()
		 //控制边栏某个模块展示和隐藏按钮ui
		  htmlOfRanksB+="<div><span>血气设备</span><img class='subRb' data-arr='.bloodGas,#bloodTitle' src='images/img2/open.png'></div>"
	  }else{
		$('.bloodGas').hide()
		 $('#bloodTitle').hide()
	  }
	  
	  
	  $('.ranksB').html(htmlOfRanksB)
	  
	  //根据绑定设备情况选择展示的模块 上
	  
	  //对伸缩项目进行修改
	  //var html
	  
	  
	   
	   
	  
	  
	  //var heartStart=0;  //用于延时绘制
	  //var vin='M118180640394';
	  /*
	  var vin='';//'M118180830001';
	  if(carID=='宇通汽车7'||carID=='宇通奔驰OBD'){
		  var vin='M112180620006'
	  }
	  
	  //氧气电源数据绑定
	  var vehicleOxygen='';
	  if(carID=='演示设备'){
		 vehicleOxygen='013800000003' // 张玮
		 
	  }else if(carID=='演示设备2'){
         vehicleOxygen='013800000004';
	  }else if(carID=='展示设备'){ // 宁波急救中心
         vehicleOxygen='013800000005';
	  }else if(carID=='测试设备002'){
         vehicleOxygen='009170454127';
	  }else if(carID=='浙ADP222'){ // 桐庐人民医院
         vehicleOxygen='077023453974';
	  }else if(carID=='浙ADM995'){
		 vehicleOxygen='077023453975';
	  }else if(carID=='浙K105U5'){  // 丽水人民医院
		 vehicleOxygen='000003453977';
	  }else if(carID=='浙K05339'){
		 vehicleOxygen='000003453978';
	  }else if(carID=='浙GL4G77'){  // 苏溪中心卫生院
		 vehicleOxygen='000003453979';
	  }else if(carID=='浙G0LP69'){  // 赤岸中心卫生院
		 vehicleOxygen='000003453980';
	  }
	  */
      
	   var oxygenUrl1=domain+":8804/api/modbus/oxygen/"+vehicleOxygen+"/1";
       var oxygenUrl2=domain+":8804/api/modbus/oxygen/"+vehicleOxygen+"/2";
       // var batteryUrl='http://183.230.198.237:8804/api/modbus/volcurrent/013800000099';
	   
	   var batteryUrl=domain+':8804/api/modbus/volcurrent/'+vehicleOxygen;
	   
	  //0727  下
	    function clearCoverCanvas(ctxx,w,h){
        var cans=document.getElementById(ctxx);

        var ctx=cans.getContext('2d');
        ctx.clearRect(0,0,w,h);
    }


    function clearFullScreenCanvas(pan,pan1,array){
        setTimeout(function () {
            if(pan==1){
            clearCoverCanvas('cN11',fullCanvasW1,fullCanvasHeight1_1);
            clearCoverCanvas('cN22',fullCanvasW1,fullCanvasH1);
            clearCoverCanvas('cN33',fullCanvasW1,fullCanvasHeight2);
            clearCoverCanvas('cN44',fullCanvasW1,fullCanvasH1);
            }else if(pan==2){
                clearCoverCanvas('cN11',fullCanvasW1,fullCanvasHeight1_1);
                clearCoverCanvas('cN1',275,46);
            }else{
				for(var i=0;i<array.length;i++){
                 clearCoverCanvas(array[i],fullCanvasW2,fullCanvasH2);
               } 
			}
			if(pan1==1){
				for(var i=0;i<array.length;i++){
                 clearCoverCanvas(array[i],fullCanvasW2,fullCanvasH2);
			}
            
        }
		},1000)

    }
	  
	  //0727 上
	  
        //显示边栏
        $('.sideInfo').css('width','377px');
		//显示操作边栏的按钮
		$('.BtControlSideBlock').css('display','flex');
		$('.unshowSideInfo').on("click",function(){
			 $('.sideInfo').css('width','0px');
			  $('.leftMedicalInfo').hide();
		});
		
		$('.showSideInfo').on("click",function(){
			 $('.sideInfo').css('width','377px');
			 $('.leftMedicalInfo').show();
		});
		
		$('.sideInfoUnderHeader').removeClass('addBackground');
		/*
		$(".sideInfo").on("click",function(){
			console.log(3333);
			$('.sideInfoUnderHeader').addClass('addBackground');
		});
		*/
        //以下为添加的代码
        //网络请求


        //var vin='M112180620006';
        
/*
	   var oxygenUrl1="http://183.230.198.237:8804/modbus/oxygen/013800000099/1";
        var oxygenUrl2="http://183.230.198.237:8804/modbus/oxygen/013800000099/2";
        var batteryUrl="http://183.230.198.237:8804/modbus/volcurrent/013800000099/3";
*/
   //0727  下
   // 获取屏幕高度 设置为全屏显示时的高 0724
   var rulerLeft=0;//用于心电回放
    window.onresize=function(){
        setFullScreen();
    }
    setFullScreen();
    function setFullScreen(){
        var fullScreenHeight=document.documentElement.clientHeight||document.body.clientHeight||window.innerHeight;
        var fullScreenWidth=document.documentElement.clientWidth||document.body.clientWidth||window.innerWidth;
        var fullCanvasWidth=parseInt(fullScreenWidth*0.4*0.65-10);
		if(fullScreenWidth>1690){
			fullCanvasWidth=parseInt(fullScreenWidth*0.4*0.65-65);
		}else if(fullScreenWidth>1920){
			fullCanvasWidth=parseInt(fullScreenWidth*0.4*0.65-90);
		}
		var wt1=parseInt(fullScreenWidth*0.3-20);
		
		//动态确定回放模块的ruler到x轴走
			var ecgPlayBack=document.getElementById("ecgPlayBack");
			ecgPlayBack.style.right=(fullScreenWidth*0.4-515)/2+"px";
			
			//动态确定回放模块的ruler到x轴坐标
            rulerLeft=parseInt((fullScreenWidth*0.6)+((fullScreenWidth*0.4-515)/2+35))
        
		//动态确定导联画布的宽高
		var ht1=parseInt((fullScreenHeight-108)/6);
		/*
		if(4*ht1>wt1){
			ht1=parseInt(wt1/4);
			var marginB=parseInt((fullScreenHeight-120-6*ht1)/6);
			marginB=marginB+"px";
		}else{
			wt1=4*ht1;
            var marginB=parseInt((fullScreenHeight/4)/6)+"px";
		}
		*/
		
		if(2.6*ht1>wt1){
			ht1=parseInt(wt1/2.6);
			var marginB=parseInt((fullScreenHeight-108-6*ht1)/6);
			
				
			  
			
			marginB=marginB+"px";
		}else{
			wt1=2.6*ht1;
            var marginB=0+"px";
		}
		
		/*
		if(3*ht1>wt1){
			ht1=parseInt(wt1/3);
			var marginB=parseInt((fullScreenHeight-108-6*ht1)/6);
			
				
			  
			
			marginB=marginB+"px";
		}else{
			wt1=3*ht1;
            var marginB=0+"px";
		}
		*/
		
		var fullLeadsWidth=wt1;
		
		
		/*
        if(fullScreenWidth<1620){
            var fullLeadsWidth=parseInt(fullScreenWidth*0.3-70);
        }else if(fullScreenWidth<1678){
            var fullLeadsWidth=parseInt((fullScreenHeight-120)/8*4);
        }else{
			 var fullLeadsWidth=parseInt((fullScreenHeight-300)/8*4);
		}
		*/
        
		

        var fullLeadsHeight=ht1;
        var fullLeadsDivH=fullLeadsHeight+15;
        fullLeadsDivH=fullLeadsDivH+'px';


        //console.log(fullLeadsWidth);
        //console.log(fullLeadsHeight);
        //console.log(fullScreenWidth)

        var coverWidth=fullCanvasWidth*0.85;
        var fullCanvasHeight1=parseInt(fullCanvasWidth*46/275);
		fullCanvasHeight1_1=parseInt(fullCanvasWidth/2.6);
        var fullCanvasHeight22=parseInt(fullCanvasWidth*34/275);

        fullCanvasH1=fullCanvasHeight1;
        fullCanvasW1=fullCanvasWidth;
        fullCanvasH2=fullLeadsHeight;
        fullCanvasW2=fullLeadsWidth;
        fullCanvasHeight2=fullCanvasHeight22;

        //动态设置右边信息显示框的高度
        var h1=fullCanvasHeight1+"px";
		var h11=fullCanvasHeight1_1+'px'
		//console.log(h11);
        var h2=fullCanvasHeight2+"px";
        $('.height1').css("height", h1);
		$('.height11').css("height",h11);
        $('.height2').css("height", h2);
		
		var changableMH=(fullCanvasWidth*26/485).toFixed(0)+"px";

        //动态设置全屏的canvas html

        var html1="<div class='heartWaveIndexL' style='color:#4ef97f'><span id='heartLeadShow'>Ⅰ</span><span id='heartResolutionShow'></span><span>诊断</span><span>陷波关</span></div>\n"+
    "<canvas id='cN11' style='margin-bottom:0;' width='"+fullCanvasWidth+"' height='"+fullCanvasHeight1_1+"'></canvas>\n" +
                "<div class='heartWaveIndexL' style='color:#08f2f5'><span>Pleth</span></div>\n"+
            "<canvas id='cN22' width='"+fullCanvasWidth+"' height='"+fullCanvasHeight1+"'></canvas>";
                
           
			
		var html11= "<div class='heartWaveIndexL' style='color:#f2394f'><span>Art</span></div>\n"+
            "<div style='width:"+fullCanvasWidth+"px;position:relative;height:"+fullCanvasHeight2+"px'><canvas id='cN33' width='"+fullCanvasWidth+"' height='"+fullCanvasHeight2+"'></canvas>\n"+
		"<div class='artDataCover' style='top:-10px;left:10%;'>160</div><div class='artDataCover' style='top:40%;left:10%;'>80</div><div class='artDataCover' style='bottom:-10px;left:10%;'>0</div><div class='artDataCover' style='width:85%;height:50%;top:0;left:15%;border-top:1px dashed #f2394f;border-bottom: 1px dashed #f2394f'></div><div class='artDataCover' style='width:85%;height:50%;bottom:0;left:15%;border-bottom: 1px dashed #f2394f'></div></div>\n"+

                " <div class='heartWaveIndexL' style='color:yellow;margin-top:"+changableMH+"'><span>Resp</span><span></span><span></span></div>\n"+
            "<canvas id='cN44' width='"+fullCanvasWidth+"' height='"+fullCanvasHeight1+"'></canvas>";
        $('.leftNL').html(html1);
		$('.rightNL').html(html11);

        //动态加载心电显示的 html

/*
        var html2="<div style='width:50%;height:"+fullLeadsDivH+";'>\n"+
                " <div style='width:100%;height:15px;line-height: 15px'>Ⅰ</div>\n"+
                "<canvas id='cd11' height='"+fullLeadsHeight+"'width='"+fullLeadsWidth+"'></canvas>\n"+
                "</div>";
        html2+="<div style='width:50%;height:"+fullLeadsDivH+";'>\n"+
            " <div style='width:100%;height:15px;line-height: 15px'>Ⅱ</div>\n"+
            "<canvas id='cd22' height='"+fullLeadsHeight+"'width='"+fullLeadsWidth+"'></canvas>\n"+
            "</div>";
        html2+="<div style='width:50%;height:"+fullLeadsDivH+";'>\n"+
            " <div style='width:100%;height:15px;line-height: 15px'>Ⅲ</div>\n"+
            "<canvas id='cd33' height='"+fullLeadsHeight+"'width='"+fullLeadsWidth+"'></canvas>\n"+
            "</div>";
        html2+="<div style='width:50%;height:"+fullLeadsDivH+";'>\n"+
            " <div style='width:100%;height:15px;line-height: 15px'>aVR</div>\n"+
            "<canvas id='cd44' height='"+fullLeadsHeight+"'width='"+fullLeadsWidth+"'></canvas>\n"+
            "</div>";
			*/
			
			var html2="<div class=\"leadTitle\" id='firstLead' style=''>Ⅰ</div>\n"+
                  " <canvas id='cd11' height='"+fullLeadsHeight+"' width='"+fullLeadsWidth+"' style='margin-bottom:"+marginB+"'></canvas>\n"+
                  " <div class=\"leadTitle\" style=''>Ⅱ</div>\n"+
                  " <canvas id='cd22' height='"+fullLeadsHeight+"' width='"+fullLeadsWidth+"' style='margin-bottom:"+marginB+"'></canvas>\n"+
                  "<div class=\"leadTitle\" style=''>Ⅲ</div>\n"+
                  " <canvas id='cd33' height='"+fullLeadsHeight+"' width='"+fullLeadsWidth+"' style='margin-bottom:"+marginB+"'></canvas>\n"+
                  "<div class=\"leadTitle\" style=''>aVR</div>\n"+
                  " <canvas id='cd44' height='"+fullLeadsHeight+"' width='"+fullLeadsWidth+"' style='margin-bottom:"+marginB+"'></canvas>\n"+
                  "<div class=\"leadTitle\" style=''>aVL</div>\n"+
                  " <canvas id='cd55' height='"+fullLeadsHeight+"' width='"+fullLeadsWidth+"' style='margin-bottom:"+marginB+"'></canvas>\n"+
                  "<div class=\"leadTitle\" style=''>aVF</div>\n"+
                  " <canvas id='cd66' height='"+fullLeadsHeight+"' width='"+fullLeadsWidth+"' style='margin-bottom:"+marginB+"'></canvas>";
        $('.normalLeads').html(html2);


        var html3="<div class=\"leadTitle\" style=''>V1</div>\n"+
                  " <canvas id='cd77' height='"+fullLeadsHeight+"' width='"+fullLeadsWidth+"' style='margin-bottom:"+marginB+"'></canvas>\n"+
                  "<div class=\"leadTitle\" style=''>V2</div>\n"+
                  " <canvas id='cd88' height='"+fullLeadsHeight+"' width='"+fullLeadsWidth+"' style='margin-bottom:"+marginB+"'></canvas>\n"+
                  "<div class=\"leadTitle\" style=''>V3</div>\n"+
                  " <canvas id='cd99' height='"+fullLeadsHeight+"' width='"+fullLeadsWidth+"' style='margin-bottom:"+marginB+"'></canvas>\n"+
                  "<div class=\"leadTitle\" style=''>V4</div>\n"+
                  " <canvas id='cd10' height='"+fullLeadsHeight+"' width='"+fullLeadsWidth+"' style='margin-bottom:"+marginB+"'></canvas>\n"+
                  "<div class=\"leadTitle\" style=''>V5</div>\n"+
                  " <canvas id='cd1011' height='"+fullLeadsHeight+"' width='"+fullLeadsWidth+"' style='margin-bottom:"+marginB+"'></canvas>\n"+
                   "<div class=\"leadTitle\" style=''>V6</div>\n"+
                  " <canvas id='cd1012' height='"+fullLeadsHeight+"' width='"+fullLeadsWidth+"' style='margin-bottom:"+marginB+"'></canvas>";
                
        $('.vLeads').html(html3);
        //绘制出art 的标记线


        
        fullScreenHeight=fullScreenHeight+"px";


         fullSH=fullScreenHeight;
		 
		 $('.N1large').css({

			height:fullSH
        });
		 
		 closeFullScreen()
    }
	
  //双击 查看N系类大图  0724
    $('.Ntop').dblclick(function () {
	
        $('.sideInfo').hide();
		$('.BtControlSideBlock').hide();
		$('.leftMedicalInfo').hide();
        $('.N1large').css({
            display:"flex",
			height:fullSH
        });
        fullScreenOpen=1;
        setTimeout(function(){
            clearCoverCanvas('cN1',275,46);
            clearCoverCanvas('cN2',275,46);
            clearCoverCanvas('cN3',275,34);
            clearCoverCanvas('cN4',275,46);
        },1000)
		//保证切换显示模式后，保证波形精准
		LXN11="切换";
       
		LXN22="切换";
        
		LXN33="切换";
        
		LXN44="切换";
       
	    
		

    })
  //点击关闭按钮退出全屏
  closeFullScreen();
  function closeFullScreen(){
	   $('#closeFullScreen').on("click",function () {
	   //console.log("测试");
	   //关掉回放的timer 如果有
	   clearInterval(ecgPlayBackTimer);
       ecgPlayBackTimer=null;
       $('.N1large').css(
           "display","none"
       );
	   $('.BtControlSideBlock').show();
	   $('.leftMedicalInfo').show();
       $('.sideInfo').show();
       fullScreenOpen=0;
       clearFullScreenCanvas(1,1,array1);
	   //保证切换显示模式后，保证波形精准
	    LXN1="切换";

		LXN2="切换";
       
		LXN3="切换";
     
		LXN4="切换";
      
	   
   });	
  }
  
		 
		 //0727 上


        //双击小心电图任何位置，心电图放大出现 以及单击关闭
		//var heartChartL=false;
        $('.leftBox').on("dblclick",function () {
            $('.heartExpansion').show();
            heartChartL=true;

        })
        $('.closeHeartChart').on("click",function () {
            $('.heartExpansion').hide();
            heartChartL=false;
            //清除所画的内容
            setTimeout(function(){
                clear('c3','c4',456,160,456,160);
            },1000);

        });
        $('#close5Lead').on("click",function () {
            $(".FiveLead").hide();
            heart5L=false;
            //清除五导联的类容
            setTimeout(function(){
                clear('cd1','cd2',360,90,360,90);
                clear('cd3','cd4',360,90,360,90);
                clear('cd5','cd6',360,90,360,90);
                clear('cd6','cd7',360,90,360,90);
            },1000)


        });
        $('.pulses').on("click",function () {
            if($('.TheLead').html()=="5导联"){
                $(".FiveLead").show();
                heart5L=true;
            }
        });
        //关闭右边信息框
        $(".rightDarrow").on("click",function () {
            $(".sideInfo").css('width','0px');
            websocket.close();
            clearInterval(timer16);
            timer16=null;
            clearInterval(timer17);
            timer17=null;
            clearInterval(timer11);
            timer11=null;
            clearInterval(timer10);
            timer10=null;
            clearInterval(timer15);
            timer15=null;
            clearInterval(timer18);
            timer18=null;
            clearInterval(timer19);
            timer19=null;
            clearInterval(timeTicket);
            timeTicket=null;
            clearInterval(timer20);
            timer20=null;
            clearInterval(timer21);
            timer21=null;
			clearInterval(timer30);
            timer30=null;
			clearInterval(timer31);
            timer31=null;
			
        });
        //分栏按钮
        var pan1=0;
        $('.forRanks').on("click",function () {
            if(pan1===0){
                $('.ranksB').show();
                pan1=1;
            }else{
                pan1=0;
                $('.ranksB').hide();
            }
        });
        //显示隐藏下边几个条目  下
		 
        var pan2=0;
        $('.subRb').on("click",function (e) {
            var arr = e.target.dataset.arr
			arr=arr.split(',')
            var target = $(e.target);   //.heartP,.oxgen,.panel,.power
            if (pan2 === 0) {
				/*
                if (id === 1) {
                    $('.heartP').hide();
                    //console.log(333333);
                } else if (id === 2) {
                    $('.oxgen').hide();
                } else if (id === 3) {
                    $('.panel').hide();
                } else {
                    $('.power').hide();
                }
				*/
				for(var i=0;i<arr.length;i++){
					var temp=arr[i];
					$(temp).hide()
				}
                target.attr('src', 'images/img2/close.png');
                pan2 = 1;
            } else {
                 /*
                if (id === 1) {
                    $('.heartP').show()
                } else if (id === 2) {
                    $('.oxgen').show()
                } else if (id === 3) {
                    $('.panel').show()
                } else {
                    $('.power').show()
                }
				*/
			   for(var i=0;i<arr.length;i++){
				   var temp=arr[i]
					$(temp).show()
				}
                target.attr('src', 'images/img2/open.png');
                pan2 = 0;

            }
        });
		
		//显示隐藏下边几个条目  上

        //canvas绘图

        //var c1=document.getElementById("ctx");
        //var ctx=c1.getContext('2d');
        //ctx.fillStyle="#3367D6"
        //ctx.fillRect(35,50,50,150);
        //ctx.fillStyle="#fff"
        //ctx.font="12px sans-serif";
        //ctx.fillText("80%",35,60)

        //氧气瓶板块（向下）
        function getOxygenData(){
            $.ajax({
                url:oxygenUrl1,
                success:function (res) {
                   // console.log(res);
                    if(res){
                        let max=res.max;
                        let pressure=res.pressure;
                        let remaining1=(res.remaining*100).toFixed(0)+"%";
                        let duration=res.duration;
                        let fullVolume=res.fullVolume;
                        let isUsing=res.isUsing;
                        let volume=res.volume;

                        let html="<div style=''>1号氧气瓶</div><div>总量:"+fullVolume+"L ("+max+"MPa)</div><div>剩余:"+volume+"L ("+pressure+"Mpa)</div><div>剩余比例:"+remaining1+"</div><div>可使用分钟数:</div>"+
                            " <div><span style='color:#ffb750;font-size: 18px;'>"+duration+"</span>min</div>";
                        $('#oxygen1').html(html);
                        let y1=80*(1-res.remaining);
                        let height=80*res.remaining;
                        let ctx="ctx";
                        clearInterval(timer10);
                        clearInterval(timer15);
                        timer10=null;
                        timer15=null;
			
                        if(isUsing==1){
                            drawWave1(ctx,40,80,y1,remaining1,1000);
                        }else{
                            drawEven('ctx',0,y1,40,height,remaining1);
                            // drawWave1(ctx,44,92,y1,remaining1,1000);
                        }

                    }

                },
                error:function(){
                   // console.log("氧气数据服务未开!");
                    let html="<div style=''>1号氧气瓶</div><div>总量：-MPa</div><div>剩余：-Mpa</div><div>剩余比例：-%</div><div>可使用分钟数：</div><div><spanstyle='color:#367aec;font-size:18px;'>-</span>min</div>";
                    $('#oxygen1').html(html);
                }
            })

            $.ajax({
                url:oxygenUrl2,
                success:function (res) {
                    //console.log(res);
                    if(res){
                        let max=res.max;
                        let pressure=res.pressure;
                        let remaining2=(res.remaining*100).toFixed(0)+"%";
                        let duration=res.duration;
                        let fullVolume=res.fullVolume;
                        let isUsing=res.isUsing;
                        let volume=res.volume;


                        let html="<div>2号氧气瓶</div><div>总量:"+fullVolume+"L ("+max+"MPa)</div><div>剩余:"+volume+"L ("+pressure+"Mpa)</div><div>剩余比例:"+remaining2+"</div><div>可使用分钟数:</div>"+
                            " <div><span style='color:#ffb750;font-size: 18px;'>"+duration+"</span>min</div>";
                        $('#oxygen2').html(html);
                        let y2=80*(1-res.remaining);
                        let height=80*res.remaining;
                        let ctx1='ctx1';
                        clearInterval(timer20);
                        clearInterval(timer21);
                        timer20=null;
                        timer21=null;
                        if(isUsing==1){
                            //drawEven('ctx1',0,y2,45,height,remaining2);
                            drawWave2(ctx1,40,80,y2,remaining2,1000);
                        }else{
                            drawEven('ctx1',0,y2,40,height,remaining2);
                        }
                    }
                },
                error:function(){
                    //console.log("氧气数据服务未开!");
                    let html=" <div>2号氧气瓶</div> <div>总量：-MPa</div><div>剩余：-MPa</div><div>剩余比例：-%</div><div>可使用分钟数：</div><div><spanstyle='color:#367aec;font-size:18px;'>-</span>min</div>";

                    $('#oxygen2').html(html);
                }
            })
        }
		
		if(vehicleOxygen!=''){   //20181203后添加
			 getOxygenData();
        clearInterval(timer16);
        timer16=null;
        timer16=setInterval(function () {
            getOxygenData();
        },30000)
		}else{//当另外一个有其他设备但无杨祺祺设时候
			 if(timer16){
				 clearInterval(timer16);
                 timer16=null;
			 }
			 //氧气数据重置
			 let max='-';
             let pressure='-';
             let remaining1='-'+"%";
             let duration='-'
             let fullVolume='-';
             let isUsing='-';
             let volume='-';

             let html="<div style=''>1号氧气瓶</div><div>总量:"+fullVolume+"L ("+max+"MPa)</div><div>剩余:"+volume+"L ("+pressure+"Mpa)</div><div>剩余比例:"+remaining1+"</div><div>可使用分钟数:</div>"+
                            " <div><span style='color:#ffb750;font-size: 18px;'>"+duration+"</span>min</div>";
             $('#oxygen1').html(html);
			let htmll="<div style=''>2号氧气瓶</div><div>总量:"+fullVolume+"L ("+max+"MPa)</div><div>剩余:"+volume+"L ("+pressure+"Mpa)</div><div>剩余比例:"+remaining1+"</div><div>可使用分钟数:</div>"+
                            " <div><span style='color:#ffb750;font-size: 18px;'>"+duration+"</span>min</div>";
            $('#oxygen2').html(htmll);	
           
			 if(timer20&&timer21){
				  clearInterval(timer20);
                  clearInterval(timer21);
                  timer20=null;
                  timer21=null;	
			 }
			 if(timer10&&timer15){
				  clearInterval(timer10);
                  clearInterval(timer15);
                  timer10=null;
                  timer15=null;	
			 }
			 
			 setTimeout(function(){
				 clearOxygenBottle('ctx')
				 clearOxygenBottle('ctx1')
			 },500)
                       		
						
		}
		
		function clearOxygenBottle(canv){
			var canvas=document.getElementById(canv);
			var ctx=canvas.getContext('2d');
			ctx.clearRect(0,0,40,80);
		}
        


        //canvas实现水波效果（向下）

        //调用函数

        //封装没有使用的氧气罐函数
        function drawEven(canvasId,x,y,w,h,texts) {
            var remainP=parseInt(texts)
            //console.log(remainP);
            var canvasId=canvasId;
            var c1=document.getElementById(canvasId);
            var ctx=c1.getContext('2d');
            ctx.fillStyle = "#367aec";
            ctx.save();
            ctx.clearRect(0,0,40,80);
            ctx.fillRect(x,y,w,h);
            ctx.font="14px sans-serif";
            if(remainP<=20){
                ctx.fillStyle ='#367AEC';
                ctx.fillText(texts,7,y-5);
            }else{
                ctx.fillStyle ='#fff';
                ctx.fillText(texts,7,y+15);
            }

            ctx.restore();
        }
        //1. 封装绘制水波纹的函数1

        function drawWave1(can,width,height,waveHeight,texts,autoDiff){
            //console.log("波1");
            let canvasId=can;
            var interT=autoDiff;
            function Vertex(x,y,baseY){
                this.baseY = baseY;         //基线
                this.x = x;                 //点的坐标
                this.y = y;
                this.vy = 0;                //竖直方向的速度
                this.targetY = 0;           //目标位置
                this.friction = 0.03;       //摩擦力   //控制波浪波动幅度
                this.deceleration = 0.8;   //减速  //控制波浪波动幅度
            }
//y坐标更新
            Vertex.prototype.updateY = function(diffVal){
                this.targetY = diffVal + this.baseY;   //改变目标位置
                this.vy += (this.targetY - this.y);       //速度
                this.vy *= this.deceleration;
                this.y += this.vy * this.friction;     //改变坐标竖直方向的位置
            }

            // var canvasId=canvasId;
            var c1=document.getElementById(canvasId);
            var ctx=c1.getContext('2d');
            ctx.clearRect(0,0,40,80);


            var W = width;
            var H = height;  //控制波浪高度
            var waveH=waveHeight;

            var color1 = "#6ca0f6",    //矩形1的颜色
                color2 = "#367aec";   //矩形2的颜色

            var vertexes = [];    //顶点坐标
            var verNum = 250;    //顶点数
            var diffPt = [];    //差分值

            for(var i=0; i<verNum; i++){
                vertexes[i] = new Vertex(W/(verNum-1)*i, waveH,waveH);  //每个点的Y坐标是H/2 dao
                diffPt[i] = 0;                                         //初始值都为0
            }
            function draw() {
                //矩形1
                ctx.save()
                //ctx.clearRect(0,0,60,150); //清除掉以前的绘画
                ctx.fillStyle = color1;
                ctx.beginPath();
                ctx.moveTo(0, H);
                ctx.lineTo(vertexes[0].x, vertexes[0].y);
                for(var i=1; i<vertexes.length; i++){
                    ctx.lineTo(vertexes[i].x, vertexes[i].y);
                }
                ctx.lineTo(W,H);
                ctx.lineTo(0,H);
                ctx.fill();
                ctx.restore();

                //矩形2
                ctx.save();
                ctx.fillStyle = color2;
                ctx.beginPath();
                ctx.moveTo(0, H);
                ctx.lineTo(vertexes[0].x, vertexes[0].y+5);
                for(var i=1; i<vertexes.length; i++){
                    ctx.lineTo(vertexes[i].x, vertexes[i].y+5);
                }
                ctx.lineTo(W, H);
                ctx.lineTo(0, H);
                ctx.fill();
                ctx.restore();
                //氧气百分比
                var remainP=parseInt(texts);
                ctx.save();
                ctx.fillStyle ='#fff';
                ctx.font="14px sans-serif";
                if(remainP<=25){
                    ctx.fillStyle ='#367AEC';
                    ctx.fillText(texts,7,waveH-10);
                }else{
                    ctx.fillStyle ='#fff';
                    ctx.fillText(texts,7,waveH+20);
                }

                ctx.restore();
            }
            //draw();
            //2.核心代码
            var vPos = 1;  //震荡点
            var dd = 15;     //缓冲

            //var autoDiff = 1000;  //初始差分值
            function update(){

                //console.log("WAVE1")

                autoDiff -= autoDiff*0.9;        //1

                diffPt[vPos] = autoDiff;

                //左侧
                for(var i=vPos-1; i>0; i--){     //2
                    var d = vPos-i;
                    if(d > dd){
                        d=dd;
                    }
                    diffPt[i]-=(diffPt[i] - diffPt[i+1])*(1-0.01*d);
                }
                //右侧
                for(var i=vPos+1; i<verNum; i++){   //3
                    var d = i-vPos;
                    if(d>dd){
                        d=dd;
                    }
                    diffPt[i] -= (diffPt[i] - diffPt[i-1])*(1-0.01*d);
                }

                //更新Y坐标
                for(var i=0; i<vertexes.length; i++){  //4
                    vertexes[i].updateY(diffPt[i]);
                }


            }

            //(function drawframe(){  //调用波纹的函数
            // ctx.clearRect(0, 0, W, H);
            //window.requestAnimationFrame(drawframe, c1);
            //update()
            // draw();
            //})()

            clearInterval(timer15);
            timer15=null;
            timer15=setInterval(function(){   //调用波纹的函数（因为autoDiff差分需要每次递减（update函数中实现）来实现波浪效果，所以需要使用定时器来完成）
                ctx.clearRect(0, 0, W, H);
                update();
                draw();
            },16)

            //临时调用水波浪

            //临时调用水波浪

            //

            clearInterval(timer10);
            timer10=null;

            timer10=setInterval(function () {  //设置定时器保证autoDiff持续更新，使波浪连续不停

                autoDiff=interT;

            },500)   //每次设置


            //



        }
        //2. 封装绘制水波纹的函数2
        function drawWave2(can,width,height,waveHeight,texts,autoDiff1){
            // console.log("波");
            let canvasId=can;
            var interT=autoDiff1;
            function Vertex(x,y,baseY){
                this.baseY = baseY;         //基线
                this.x = x;                 //点的坐标
                this.y = y;
                this.vy = 0;                //竖直方向的速度
                this.targetY = 0;           //目标位置
                this.friction = 0.03;       //摩擦力   //控制波浪波动幅度
                this.deceleration = 0.8;   //减速  //控制波浪波动幅度
            }
//y坐标更新
            Vertex.prototype.updateY = function(diffVal){
                this.targetY = diffVal + this.baseY;   //改变目标位置
                this.vy += (this.targetY - this.y);       //速度
                this.vy *= this.deceleration;
                this.y += this.vy * this.friction;     //改变坐标竖直方向的位置
            }

            //var canvasId=canvasId;
            var c1=document.getElementById(canvasId);
            var ctx=c1.getContext('2d');
            ctx.clearRect(0,0,40,80);


            var W = width;
            var H = height;  //控制波浪高度
            var waveH=waveHeight;

            var color1 = "#6ca0f6",    //矩形1的颜色
                color2 = "#367aec";   //矩形2的颜色

            var vertexes = [];    //顶点坐标
            var verNum = 250;    //顶点数
            var diffPt = [];    //差分值

            for(var i=0; i<verNum; i++){
                vertexes[i] = new Vertex(W/(verNum-1)*i, waveH,waveH);  //每个点的Y坐标是H/2 dao
                diffPt[i] = 0;                                         //初始值都为0
            }
            function draw() {
                //矩形1
                ctx.save()
                //ctx.clearRect(0,0,60,150); //清除掉以前的绘画
                ctx.fillStyle = color1;
                ctx.beginPath();
                ctx.moveTo(0, H);
                ctx.lineTo(vertexes[0].x, vertexes[0].y);
                for(var i=1; i<vertexes.length; i++){
                    ctx.lineTo(vertexes[i].x, vertexes[i].y);
                }
                ctx.lineTo(W,H);
                ctx.lineTo(0,H);
                ctx.fill();
                ctx.restore();

                //矩形2
                ctx.save();
                ctx.fillStyle = color2;
                ctx.beginPath();
                ctx.moveTo(0, H);
                ctx.lineTo(vertexes[0].x, vertexes[0].y+5);
                for(var i=1; i<vertexes.length; i++){
                    ctx.lineTo(vertexes[i].x, vertexes[i].y+5);
                }
                ctx.lineTo(W, H);
                ctx.lineTo(0, H);
                ctx.fill();
                ctx.restore();
                //氧气百分比
                var remainP=parseInt(texts);
                ctx.save();
                ctx.fillStyle ='#fff';
                ctx.font="14px sans-serif";
                if(remainP<=25){
                    ctx.fillStyle ='#367AEC';
                    ctx.fillText(texts,7,waveH-10);
                }else{
                    ctx.fillStyle ='#fff';
                    ctx.fillText(texts,7,waveH+20);
                }

                ctx.restore();
            }
            //draw();
            //2.核心代码
            var vPos = 1;  //震荡点
            var dd = 15;     //缓冲

            //var autoDiff = 1000;  //初始差分值
            function update(){

                autoDiff1 -= autoDiff1*0.9;        //1

                diffPt[vPos] = autoDiff1;

                //左侧
                for(var i=vPos-1; i>0; i--){     //2
                    var d = vPos-i;
                    if(d > dd){
                        d=dd;
                    }
                    diffPt[i]-=(diffPt[i] - diffPt[i+1])*(1-0.01*d);
                }
                //右侧
                for(var i=vPos+1; i<verNum; i++){   //3
                    var d = i-vPos;
                    if(d>dd){
                        d=dd;
                    }
                    diffPt[i] -= (diffPt[i] - diffPt[i-1])*(1-0.01*d);
                }

                //更新Y坐标
                for(var i=0; i<vertexes.length; i++){  //4
                    vertexes[i].updateY(diffPt[i]);
                }


            }

            //(function drawframe(){  //调用波纹的函数
            //ctx.clearRect(0, 0, W, H);
            //window.requestAnimationFrame(drawframe, c1);
            //update()
            //draw();
            //})()

            clearInterval(timer20);
            timer20=null;
            timer20=setInterval(function(){   //调用波纹的函数（因为autoDiff差分需要每次递减（update函数中实现）来实现波浪效果，所以需要使用定时器来完成）
                ctx.clearRect(0, 0, W, H);
                update();
                draw();
            },16)

            //临时调用水波浪

            //临时调用水波浪

            //

            clearInterval(timer21);
            timer21=null;

            timer21=setInterval(function () {  //设置定时器保证autoDiff持续更新，使波浪连续不停

                autoDiff1=interT;

            },500)   //每次设置


            //



        }

        //实现水波浪的函数（向上）

        //氧气瓶板块页面展示（向上）

        //心电代码
		// 心电回放功能 （下）
		var isFirstPlayBack=0;
		var ecgStep=0;
		var isTiming=1;
		var globalLeftX=0;
		var isTimngPause=0;
		
		//清空心电相关数字数据的函数
		function clearEcgDataNo(){
			                /*
			               $('#heartRate').html('--');
							$('#sp02').html('--');
							$('#respRate').html('--');
							$('#temp1').html('--');
							$('#temp2').html('--');
							$('#artData').html('--');
							*/
							
			                $('#heartRateFS').html('--');
                             $('#artFullScreen1').html('--/--');
							 $('#artFullScreen2').html('--');
                             $('#PlethRateFS').html('--');
							 $('#pRate').html('--');
							 $('#pIndex').html('--');
                             $('#respRateFS').html('--');
							 $('#T1').html('--');
							 $('#T2').html('--');
							
							 $('#ecgTime').html('');
							 
							 $('#NIBPSYS').html('--');
				             $('#NIBPDIA').html('--');
				             $('#NIBPMEAN').html('--');
		}
		function clearEcgDataExceptNibp(){
			                 $('#heartRateFS').html('--');
                             $('#artFullScreen1').html('--/--');
							 $('#artFullScreen2').html('--');
                             $('#PlethRateFS').html('--');
                             $('#respRateFS').html('--');
							 $('#pIndex').html('--');
							 $('#pRate').html('--');
							 $('#T1').html('--');
							 $('#t2').html('--');
							
							 //$('#ecgTime').html('');
		}
		
		    //1. 点击暂停按钮
			var playBackBt=0;
			$('#ecgPlayBt').on("click",function(){
				if(playBackBt==0){
					$('#ecgPlayBt').attr('src','images/img2/playECG.png');
					if(isTiming==1){
						//断开长链接
					    //websocket.close();
						isTimngPause=1;
						alingments1=[];
						alingments2=[];
						alingments3=[];
						alingments4=[];
						
					}else{
						//停止将历史数据推向绘制的timer
						clearInterval(ecgPlayBackTimer);
						ecgPlayBackTimer=null;
					}
			
					playBackBt=1;
				}else{
					$('#ecgPlayBt').attr('src','images/img2/pauseECG.png');
					if(isTiming==1){
						isTimngPause=0;
					
					}else{
						
						ecgPlayBackTimer=setInterval(function(){
							if(ecgStep>=align1.length){
							
							clearInterval(ecgPlayBackTimer);
					        ecgPlayBackTimer=null;
							$('#niddle').css('left','411px')
							
							ecgStep=0;
							clearEcgDataNo();
							return;
						   }
						   //回放暂停后，再次启动指针也重启移动
						   globalLeftX+=20;
						var temLD=globalLeftX+'px';
						$('#niddle').css('left',temLD);
						    alignments1.push(align1[ecgStep])
						    alignments2.push(align2[ecgStep])
							if(align3.length>0){
								alignments3.push(align3[ecgStep])
							}
							if(align4.length>0){
								alignments4.push(align4[ecgStep])
							}
							//锚点3
							
							if(ecgT.length>0){
				
							   ecgTimeShow(ecgT[ecgStep],firstLeadListFPB[ecgStep])
						    }
							if(alignOb.length>0&&alignOb.length>=ecgStep){
								
							     var observStep=align1.length-alignOb.length
								  
								  var hasObserv=false;
                                  var observ='';
                                  alignOb.forEach(function (v) {
                                      if(v.time==ecgT[ecgStep]){
                                          hasObserv=true;
                                          observ=v.observ;
                                     }
                                 })
                               
							   if(hasObserv){
                                   dataTreatmentForObservation(observ);	
                               }else{
								   dataTreatmentForObservation({})
							   }
									
						    }
						    ecgStep++;
						},1000)
						
						
					}
					
					
					//清空储存数组，以便重新向里边推送数据
					
			    
					playBackBt=0;
				}
			})
		    
			 
			 ecgNiddleBlock();  //设定指针的滑动情况函数
		function ecgNiddleBlock(){
			var playBackSecond=0;
		   var fullScreenW=document.documentElement.clientWidth || document.body.clientWidth;
		  
		   var oDiv = document.getElementById("niddle");
		   var oRuler=document.getElementById("ruler");
		   //点击标尺指针移动到相应位置
		   var distanceToLeft=0;
		  
		   oRuler.onmousedown=function(){
			   
			   //确认进入回放功能
			   isTiming=0;
			   $('#backToTimingEcg').css('display','block');
			   var e=e||window.event;
			   //console.log(e.clientX);
			   //console.log(rulerLeft);
			   distanceToLeft=e.clientX-rulerLeft;
			  // console.log(distanceToLeft);
			   if(distanceToLeft<20){distanceToLeft=20}
			   if(distanceToLeft>420){distanceToLeft=420}
			   var xxx=20*parseInt(distanceToLeft/20)-9;
			   //console.log(xxx);
			   globalLeftX=xxx;
			   oDiv.style.left = xxx + "px";
               oDiv.style.top = "26px";
			   //确定位置以便确定播放的秒数
			   playBackSecond=(20-parseInt((xxx-11)/20))*-1;
			  // console.log(playBackSecond);
			   //如果回放秒数超过数组长度时，反向定义指针的位置
			   //---
			   isFirstPlayBack++;  //第一次点击
			 //  console.log(isFirstPlayBack);
					//从记录20秒的数据数组中取出数据
					if(isFirstPlayBack==1){
						window.localStorage.setItem("al1",JSON.stringify(alignments1for20));
						window.localStorage.setItem("al2",JSON.stringify(alignments2for20));
						window.localStorage.setItem("al3",JSON.stringify(alignments3for20));
						window.localStorage.setItem("al4",JSON.stringify(alignments4for20));
						window.localStorage.setItem("aloB",JSON.stringify(alignmentsforObservation));
						window.localStorage.setItem("ecgT",JSON.stringify(ecgTimes));
						window.localStorage.setItem("firstLeadListFPB",JSON.stringify(firstLeadList));
						
						align1=JSON.parse(window.localStorage.getItem("al1"));
					    align2=JSON.parse(window.localStorage.getItem("al2"));
					    align3=JSON.parse(window.localStorage.getItem("al3"));
					    align4=JSON.parse(window.localStorage.getItem("al4"));
					    alignOb=JSON.parse(window.localStorage.getItem("aloB"));
					    ecgT=JSON.parse(window.localStorage.getItem("ecgT"));
						firstLeadListFPB=JSON.parse(window.localStorage.getItem("firstLeadListFPB"));
						/*
						console.log(align1);
						console.log("align1的长度"+align1.length)
						console.log(align2);
						console.log(align3);
						console.log(align4);
						console.log(alignOb);
						console.log(ecgT);
						*/
						isFirstPlayBack++; 
					}
					
					
			   //---
			   if(playBackSecond*-1>align1.length){
				   var temLeft=411-align1.length*20;
				   globalLeftX=temLeft;
				   temLeft=temLeft+"px";
				   //console.log(temLeft);
				   $('#niddle').css('left',temLeft);
				   playBackSecond=align1.length*-1;
			   }
			   
			   //调用模拟数据推送timer
			   backPlay();
			   
		   }
		   function backPlay(){
			   //更改isTimg 让socket的数据不再推送到固有的alignments1等地方
			   
					//if(websocket){
                     //   websocket.close();
                     // }
					 //清空心电相关数字数据
			         clearEcgDataNo();
				
					clearInterval(ecgPlayBackTimer);
					ecgPlayBackTimer=null;
					alignments1=[];
					alignments2=[];
					alignments3=[];
					alignments4=[];
					
					
					
					//console.log("回放秒数是"+playBackSecond);
					ecgStep=align1.length+playBackSecond;
					
					ecgPlayBackTimer=setInterval(function(){
						//console.log("回放开始的节点"+ecgStep);
						//console.log(align1);
						//每推秒数据指针向后移动
				        globalLeftX+=20;
						var temLD=globalLeftX+'px';
						$('#niddle').css('left',temLD);
						//console.log(align1.length);
						if(ecgStep>=align1.length){
							
							clearInterval(ecgPlayBackTimer);
					        ecgPlayBackTimer=null;
							$('#niddle').css('left','411px')
							ecgStep=0;
							//console.log(2222);
							//锚点1
							clearEcgDataNo();
							
							return;
						}
						alignments1.push(align1[ecgStep])
						
						alignments2.push(align2[ecgStep])
						if(align3.length>0){
							alignments3.push(align3[ecgStep]);
						}
						if(align4.length>0){
							alignments4.push(align4[ecgStep]);
						}
						//锚点
						if(ecgT.length>0){
							ecgTimeShow(ecgT[ecgStep],firstLeadListFPB[ecgStep])
						}
						if(alignOb.length>0&&ecgStep>=(align1.length-alignOb.length)){
							     var observStep=align1.length-alignOb.length
								  
								  var hasObserv=false;
                                  var observ='';
                                  alignOb.forEach(function (v) {
                                      if(v.time==ecgT[ecgStep]){
                                          hasObserv=true;
                                          observ=v.observ;
                                     }
                                 })
                               
							   if(hasObserv){
                                   dataTreatmentForObservation(observ);	
                               }else{
								   dataTreatmentForObservation({})
							   }
						}
						ecgStep++;
					},1000)
			   }
		    
		    /*鼠标点击的位置距离DIV左边的距离 */
            var disX = 0;
            /*鼠标点击的位置距离DIV顶部的距离*/
            var disY = 0;
			
			oDiv.onmousedown = function(){
               var e = e || window.event;
               disX = e.clientX - oDiv.offsetLeft;
               disY = e.clientY- oDiv.offsetTop;
               var leftX=0;
			   
			   //每次准备拖动滑块时关闭上一个推数据的timer
			     clearInterval(ecgPlayBackTimer);
					ecgPlayBackTimer=null;
					alignments1=[];
					alignments2=[];

               document.onmousemove = function(e){
				   isTimg=0;
				    //---
			   isFirstPlayBack++;  //第一次点击
					//从记录20秒的数据数组中取出数据
					if(isFirstPlayBack==1){
						window.localStorage.setItem("al1",JSON.stringify(alignments1for20));
						window.localStorage.setItem("al2",JSON.stringify(alignments2for20));
						window.localStorage.setItem("al3",JSON.stringify(alignments3for20));
						window.localStorage.setItem("al4",JSON.stringify(alignments4for20));
						window.localStorage.setItem("aloB",JSON.stringify(alignmentsforObservation));
						window.localStorage.setItem("ecgT",JSON.stringify(ecgTimes));
						
						align1=JSON.parse(window.localStorage.getItem("al1"));
					    align2=JSON.parse(window.localStorage.getItem("al2"));
					    align3=JSON.parse(window.localStorage.getItem("al3"));
					    align4=JSON.parse(window.localStorage.getItem("al4"));
					    alignOb=JSON.parse(window.localStorage.getItem("aloB"));
					    ecgT=JSON.parse(window.localStorage.getItem("ecgT"));
						/*
						console.log(align1);
						console.log("align1的长度"+align1.length)
						console.log(align2);
						console.log(align3);
						console.log(align4);
						console.log(alignOb);
						console.log(ecgT);
						*/
						isFirstPlayBack++; 
					}
			   //---
                   var e = e || window.event;
                   // 横轴坐标
                   leftX = e.clientX - disX;
                   // 纵轴坐标
                   var topY =e.clientY - disY;

                   if( leftX < 11 ){    //在其父元素中的相对位置
                       leftX = 11;
                   }
                   // 获取浏览器视口大小 document.document.documentElement.clientWidth
                   else if(  leftX > 411 ){    //原来  leftX > document.documentElement.clientWidth - oDiv.offsetWidth
                       leftX =411   // 原来 leftX = document.document.documentElement.clientWidth - oDiv.offsetWidth;
                   } 
				   
                   //leftX=parseInt((leftX-6)/100)*100+6;
				  // playBackSecond=-5*(4-((leftX-6)/100));
				  // console.log(playBackSecond);
				   //if(alignments1for20.length<playBackSecond*-1){
					//   if(alignments1for20.length<=5){   //进一步根据储存数据的长短进行判断
					//      leftX=306;
					     // playBackSecond=-5;
				   //    }else if(alignments1for20.length<=10){
					//      leftX=206;
					     // playBackSecond=-10;
				   //    }else if(alignments1for20.length<=15){
					//      leftX=106;
					      //playBackSecond=-15;
				  //     }else if(alignments1for20.length<=20){
					//       leftX=6;
					      // playBackSecond=-20;
				   //    }
					//   playBackSecond=alignments1for20.length*-1;
					   
				   //}
				   //console.log(playBackSecond);
				   
				   
                   if( topY <26 ){   //原来 topY <
                       topY = 26;
                   }
                   else if( topY >26 ){  // 原来 topY > document.documentElement.clientHeight -oDiv.offsetHeight
                       topY = 26; // 原来   topY = document.documentElement.clientHeight - oDiv.offsetHeight;
                   }
				   leftX=20*parseInt(leftX/20)-9;
				   globalLeftX=leftX;
                   oDiv.style.left = leftX + "px";
                   oDiv.style.top = topY+"px";
				   
				  
			   //确定位置以便确定播放的秒数
			   playBackSecond=(20-parseInt((leftX-11)/20))*-1;
			   //如果回放秒数超过数组长度时，反向定义指针的位置
			   if(playBackSecond*-1>align1.length){
				   var temLeft=411-align1.length*20;
				   temLeft=temLeft+"px";
				   //console.log(temLeft);
				   $('#niddle').css('left',temLeft);
				   playBackSecond=align1.length*-1;
			   }
			   //console.log(playBackSecond)
			   //调用模拟数据推送timer
			   
				   
               }
               document.onmouseup = function(){
                   document.onmousemove = null;
                   
				   //切换到回放模式
				   
				   //显示回到正常播放的按钮
				   $('#backToTimingEcg').css('display','block');
                   //将滑动的距离
                   //console.log(leftX);
				 //console.log(playBackSecond);
				 //将存储的波形数据使用timer 模拟推给timer
				 /*
				 console.log(alignments1for20);
					console.log(alignments2for20);
					console.log(alignments3for20);
					console.log(alignments4for20);
					console.log(alignmentsforObservation);
					*/
					//清除长链接
					backPlay();
					
                 document.onmouseup = null;
               }
           }
  }           
           //点击返回按钮回到正常播放  
			$('#backToTimingEcg').on('click',function(){
				//回到正常播放将记录第几次回放数据归0
				isFirstPlayBack=0;
				isTiming=1;
				//终止模拟推送数据的timer
				clearInterval(ecgPlayBackTimer);
				ecgPlayBackTimer=null;
				//清空数组中的数据
				alignments1=[];
				alignments2=[];
				alignments3=[];
				alignments4=[];
				/*
				alignments1for20=[];
				alignments2for20=[];
				alignments3for20=[];
				alignments4for20=[];
				alignmentsforObservation=[];
				*/
				//将niddle回到默认位置
				$('#niddle').css("left","411px");
			
				/*
				if(websocket){
                    websocket.close();
                }
				webSocketFun();
				*/
				$('#backToTimingEcg').css('display','none');
			});
			//展示心电时间的函数
			function ecgTimeShow(ecgTime,firstLead){
			
				$('#ecgTime').html(ecgTime);
				if(firstLead){
					$('#heartLeadShow').html(firstLead); 
				    $('#firstLead').html(firstLead)
				}
			}
			// 心电数据（数字）展示函数
			function dataTreatmentForObservation(observ,ecgTime){ //0929
			  //console.log(observ);
                var heartR="";
                if("heartRate" in observ){
                    heartR=observ.heartRate;
                }else{
                    heartR="--"
                }
                var respR="";
                if("respRate" in observ){
                    respR=observ.respRate;
                }else{
                    respR="--"
                }
				
				//0727  下
			var sp02="";
            if("spo2" in observ){
                sp02=observ.spo2;
            }else{
                sp02="--"
            }

            var artData="";
            var artData1="";
            var artData2="";
            if("artDiastolic" in observ){
                var artD=observ.artDiastolic;
                var artS=observ.artSystolic;
                var artM=observ.artMean;
                artData=artS+"/"+artD+"\n"+
                        "  ("+artM+")"
                 artData1=artS+"/"+artD;
                 artData2="("+artM+")";
            }else{
                artData="--/--"
                artData1="--/--"
                artData2="--";
            }

            var temp1='';
            var temp2='';
            if("temp1" in observ){
				
                 temp1=parseFloat(observ.temp1);
				 temp1=(5/9*(temp1-32)).toFixed(1);
            }else{
                temp1='--';
            }
			
			if("temp2" in observ){
                 
				
                 temp2=parseFloat(observ.temp2);
				 temp2=(5/9*(temp2-32)).toFixed(1);
				  
            }else{
                
                temp2='--';
            }
			
			var pIndex='';
			var pRate='';
			if("spo2PerfusionIndex" in observ){
                 pIndex=observ.spo2PerfusionIndex;
            }else{
                 pIndex='--';
            }
			
			if("spo2PulseRate" in observ){
                 pRate=observ.spo2PulseRate;
            }else{
                 pRate='--';
            }
			
			//1016增加无创血压数据 下
			
			if("nibpSystolic" in observ){
				var sys='';
				sys=observ.nibpSystolic;
				$('#NIBPSYS').html(sys);
				//添加时间
				if(ecgTime){
					var nibpTime=ecgTime.substr(-8,5);
				    $('#nibpTime').html(nibpTime);
				}
			}else{
				//sys='--';
			}
			
			if("nibpDiastolic" in observ){
				var dia='';
				dia=observ.nibpDiastolic;
				$('#NIBPDIA').html(dia);
				
			}else{
				//dia='--';
			}
			
			if("nibpSystolic" in observ){
				var mean='';
				mean=observ.nibpMean;
				$('#NIBPMEAN').html('('+mean+')');
				
			}else{
				//mean='--';
			}
			
			//1016增加无创血压数据 上
			
			
			if(deviceS=='D'){
            $('#heartR').html(heartR);
            $('#respR').html(respR);
            $('#heartRL').html(heartR);
            $('#respRL').html(respR);
            }else{
                $('#heartRate').html(heartR);
                $('#respRate').html(respR);
                $('#sp02').html(sp02);
                $('#artData').html(artData);
                $('#temp1').html(temp1);
                $('#temp2').html(temp2);

                $('#heartRateFS').html(heartR);
                $('#respRateFS').html(respR);
                $('#PlethRateFS').html(sp02);
                $('#artFullScreen1').html(artData1);
                $('#artFullScreen2').html(artData2);
                $('#T1').html(temp1);
                $('#T2').html(temp2);
				$('#pIndex').html(pIndex);
                $('#pRate').html(pRate);
            }
				
			}	//0929
		// 心电回放功能 （上）

        //长连接向下
        var alignments1=[];
        var alignments2=[];  
		var alignments3=[];
        var alignments4=[]; //4个队列数组用于绘制心电、呼吸、血氧、血压
		
		//设置数组用于储存20秒钟的数据
		var alignments1for20=[];
		var alignments2for20=[];
		var alignments3for20=[];
		var alignments4for20=[];
		var alignmentsforObservation=[];
		var ecgTimes=[];
		var firstLeadList=[];
		
		var align1=[];    //用于存放回放那个时段的数据
		var align2=[];
		var align3=[];
		var align4=[];
		var alignOb=[];
		var ecgT=[];
		var firstLeadListFPB=[];


        var url=""; //定义长连接的地址变量
		/*
        // var vehicle='00A037009A0002EE';//每辆车的长连接识别号
        if(carID==='测试设备001'){
			//var vehicle='00A037009A000551';
			//var vehicle='00A0370099000723';
			//var vehicle='00A037009B000634';
			//var vehicle='00A037009A0002EE';
			//url="ws://192.168.1.35:8809/ecg/mdc/"+vehicle;
            //url="ws://183.230.198.237:8809/ecg/mdc/"+vehicle;
        }else if(carID=='演示设备'){ // 张玮
		    var vehicle='00A0370099000929';
		}else if(carID=='演示设备2'){ // 潘总
			var vehicle='00A0370099000D97';
		}else if(carID=='展示设备'){  // 宁波急救中心
			var vehicle='00A037009900032B';
		}else if(carID=='测试设备002'){ // 自己测试
			var vehicle='00A037009A0017E0';
		}else if(carID=='浙ADP222'){
			var vehicle='00A0370099000832';            
		}else if(carID=='浙ADM995'){
			var vehicle='00A0370099000833';
		}else if(carID=='浙K105U5'){
			var vehicle='00A037009A000553';
		}else if(carID=='浙K05339'){
            var vehicle='00A037009A000552';
			//url="ws://183.230.198.237:8809/ecg/mdc/"+vehicle;
        }else if(carID=='浙GL4G77'){
			var vehicle='00A0370099000723';
		}else if(carID=='浙G0LP69'){
			var vehicle='00A0370099000831';
		}else if(carID=='浙GVW307'){
			var vehicle='00A037009900094B';
		}else if(carID=='浙GV1E82'){
			var vehicle='00A0370099000949';
		}else if(carID=='浙GL7G27'){
			var vehicle='00A037009900094A';
		}else if(carID=='浙GL7G10'){
			var vehicle='00A037009900094E';
		}else if(carID=='浙GL6G95'){
			var vehicle='00A0370099000950';
		}else if(carID=='浙GL6G27'){
			var vehicle='00A037009900094F';
		}else if(carID=='浙GV1E87'){
			var vehicle='00A037009900094C';
		}else if(carID=='浙GN2X70'){
			var vehicle='00A037009900094D';
		}else if(carID=='浙E6H310'){
			var vehicle='00A0370099000D82';
		}else if(carID=='浙EFR068'){
			var vehicle='00A0370099000D85';
		}else if(carID=='浙E27E31'){
			var vehicle='00A0370099000D84';
		}else if(carID=='浙ECR969'){
			var vehicle='00A0370099000D83';
		}else if(carID=='演示设备3'){
			var vehicle='00A0370099000D92';
		}else{
			var vehicle='00A037009A001284';
			//url="ws://183.230.198.237:8809/ecg/mdc/"+vehicle;
		}
		*/
		 //url="ws://ecg.120gps.cn:8809/ecg/mdc/"+vehicle;
         //url="ws://183.230.198.237:8809/ecg/mdc/"+vehicle;
         //清除上一次的长连接
		 //url="ws://192.168.1.35:8809/ecg/mdc/"+vehicle;
		 
		 // 移动专线服务器
         // url="ws://183.230.198.237:8809/ecg/mdc/"+vehicle;
		 // aliyun服务器
         url=domainForEcgWS+":8809/ecg/mdc/"+vehicle;
		 /*
		 if(carID=='浙ADP222'||carID=='浙ADM995'){
			url="ws://183.230.198.237:8809/ecg/mdc/"+vehicle; 
		 } */
        //每次点击关掉上一个长链接
        if(websocket!=null){
            websocket.close();
		
        }
        //切换车辆时，清除原有canvas的绘图
        function clearAll(){
            setTimeout(function(){
                clear('c1','c3',228,70,456,160);
                clear('c2','c4',228,70,456,160);
                clear('cd1','cd2',360,90,360,90);
                clear('cd3','cd4',360,90,360,90);
                clear('cd5','cd6',360,90,360,90);
                clear('cd6','cd7',360,90,360,90);
            },1000)
        }

        clearAll();

        var forDaoLianShow=1;
        //判断当前浏览器是否支持WebSocket
		if(vehicle!=''){
			webSocketFun();
		}
		 //用于判断长链接链接还是断开的情况
		 var isWebsocketConnected=0;
function webSocketFun(){
        if ('WebSocket' in window) {
            // TODO 上传设备编号
            // TODO 更改设备编号需要关闭当前连接，并打开新的连接。
            // TODO 用户退出登录时需关闭当前连接。
            // 关闭浏览器窗口websocket会自动关闭连接。
            websocket = new WebSocket(url);
			isWebsocketConnected=1;
        } else {
            alert('Not support websocket')
        }

        //连接发生错误的回调方法
        websocket.onerror = function() {
            //alert('长连接错误');

        };

        //连接成功建立的回调方法
        websocket.onopen = function(event) {
            //setMessageInnerHTML("open");
            //alert('连接成功');
		   

        }

        //接收到消息的回调方法 （在此方法中绘制心电）
        var hasObservatin=0;
		
		// 0727  下
		
		//默认显示N系列的界面
         $('.rightBox').hide();  //临时
         $('.leftBox').hide();   //临时
        //$('.temp_bottom').hide();
       // $('.Ntop').hide();
		
		//0727  上
		
		
        websocket.onmessage = function(event) {
             

            
            var data=JSON.parse(event.data);
			
			//console.log(data);

            if(data==null){return}
			
			deviceNo=data.deviceNo.substr(24,4);   //0910 获取D6的 独有编号
			
			
			deviceS=data.deviceSeries;  //0727
			
			if(deviceNo=='0990'){       //D6 按N系列处理
				deviceS='N';
			}
			//所有的均全屏展示
			if(deviceS='D'){
				deviceS='N'
			    //deviceNo='0990'
			}
			
			
			//0727 根据设备的不同展示不同的布局  （向下）

            //if(deviceS=='D'){
              // $('.temp_bottom').hide();
               // $('.Ntop').hide();
			//	$('.rightBox').show();
             //   $('.leftBox').show();

           // }else{
				$('.rightBox').hide();
                $('.leftBox').hide();

                $('.temp_bottom').show();
                $('.Ntop').show();
			//}

        //0727 根据设备的不同展示不同的布局  （向上）
			

            if("heartWaveformList" in data){  //心率波和呼吸波
                var heartList=[];
                var obj=data.heartWaveformList;
                if(obj.length==1) {        //提示时三导联还是五导联
                    $('.TheLead').html("3导联");
                    if($('.FiveLead').css.display=='block'){
                        $('.FiveLead').hide();
                    }
                    if(forDaoLianShow==1){
                        $('.FiveLead').hide();
                        forDaoLianShow++;
                    }
					
                }else if(obj.length==7){
                    $('.TheLead').html("5导联");
                    if(forDaoLianShow==1){
                        $('.heartExpansion').hide();
                        forDaoLianShow++;
                    }
                }else if(obj.length==8){             //0727 改动
                    $('.TheLead').html("6导联");
                }else if(obj.length==12){
                    $('.TheLead').html("12导联");
                   }       
				
                for(var i=0;i<obj.length;i++){
                    var preStr=obj[i].wave.trim('"');
                    var pointsA=makeArray();
                    heartList.push(pointsA);
                }
				if(isTiming==1&&isTimngPause==0){
					alignments1.push(heartList);
					//console.log("心电实时模式")
				//进行3秒缓存在数据够画3秒以后进行绘制
				/*
				if(alignments1.length>3){
					var tempHeartList1=[];
						tempHeartList1.push(alignments1[alignments1.length-3]);
						tempHeartList1.push(alignments1[alignments1.length-2]);
						tempHeartList1.push(alignments1[alignments1.length-1]);
						alignments1=tempHeartList1;
						heartStart=1;
				}
				*/
					
					//每次只取最新的的一条 下 (应对客户端断网的情况)
					if(alignments1.length>1){
						var tempEcgList=[];
						tempEcgList.push(alignments1[alignments1.length-1]);
						alignments1=tempEcgList;
					}
					
					//console.log(alignments1);
					
					//每次只取最新的的一条 上
					//console.log(alignments1);
				
				}
				
				//记录最近20秒的心电数据
				alignments1for20.push(heartList);
				if(alignments1for20.length>20){
					alignments1for20.shift();
				} 
				
				var ecgTime=data.msgTime.substr(0,4)+'-'+data.msgTime.substr(4,2)+'-'+data.msgTime.substr(6,2)+'&nbsp;&nbsp;'+data.msgTime.substr(8,2)+':'+data.msgTime.substr(10,2)+":"+data.msgTime.substr(12,2);
					
				if(isTiming==1&&isTimngPause==0){
					ecgTimeShow(ecgTime);
				}	
				
				 ecgTimes.push(ecgTime);	
                  if(ecgTimes.length>20){
				    ecgTimes.shift();
			    }	
				
				
				//用于包含3导联时回放时展示的是那个导联
				

                var LeadStatus=obj[0].heartLead;     //此处有状态的改动
				
				firstLeadList.push(LeadStatus)
				if(firstLeadList.length>20){
				     firstLeadList.shift();
			     }
				
				if(isTiming==1&&isTimngPause==0){
					if(alignments1[0].length>1){
					LeadStatus='Ⅰ' //用于全屏展示
				}
				}
				
	
		  //用以记录没有数字数据时 observation 上
				
				
				

                if(LeadStatus){
                    if(LeadStatus=="电极板"){
                        $('#heartL1').html(LeadStatus);
                        $('#heartL').html("");
                        $('.TheLead').html("");
                        $('#leadPlate').attr({src:'images/img2/lead-plate.png'});
                        clear("cd1","cd2",360,90,360,90);
                        clear("cd3","cd4",360,90,360,90);
                        clear("cd5","cd6",360,90,360,90);
                        clear("cd6","cd7",360,90,360,90);
                    }else{
                        if(deviceS=="D"){
                            $('#heartL,#heartL1').html(LeadStatus);
                            $('#leadPlate').attr({src:'images/img2/heartBt.png'});
                        }else{
							
                            //clearCoverCanvas('cN5',278,46);
                           // drawData('cN5','#4ef97f',LeadStatus,'x1','诊断','陷波关',null,null,null,null);

                            //$('.heartWaveIndexL').html();
                            
                        }
                    }


                }

                var heartResolution=obj[0].resolution;
                var times='';
                var marker='1mV';
                var height1='';
                var topD1='0px';
                var topD2='0px';
                if(heartResolution==="0.004884"){
                    times="X0.25";
                    height1=10;
                    topD1="50px";
                    topD2="100px";
                }else if(heartResolution==="0.002442"){
                    times="X0.5";
                    height1=20;
                    topD1="50px";
                    topD2="80px";
                }else if(heartResolution==="0.001221"){
                    times="X1";
                    height1=40;
                    topD1="30px";
                    topD2="70px";
                }else if(heartResolution==="0.000611"){
                    times="X2";
                    height1=70;
                    topD1="30px";
                    topD2="40px";
                }else if(heartResolution==="0.000305"){
                    times="X4";
                    marker='0.5mV';
                    height1=70;
                    topD1="30px";
                    topD2="40px";
                }
                var height2=2*height1;
                $("#times,#times1").html(times);
                $("#smallMarker,#bigMarker").html(marker);
                $(".marker1").css({height:height1+"px",top:topD1});
                $(".marker2").css({height:height2+"px",top:topD2});
				
		  //导联和倍数  0727
           clearCoverCanvas('cN5',278,46);
            drawData('cN5','#4ef97f',LeadStatus,'','诊断','陷波关',null,null,null,null); //之前的drawData('cN5','#4ef97f',LeadStatus,times,'诊断','陷波关',null,null,null,null);

			if(isTiming==1&&isTimngPause==0){
			  $('#heartLeadShow').html(LeadStatus);
			  $('#firstLead').html(LeadStatus);
			}
            
            //$('#heartResolutionShow').html(times);
			$('#heartResolutionShow').html('');

            }

            if("respWaveform" in data){
                var preStr=data.respWaveform.wave.trim('"');
                var pointsA=makeArray();
				if(isTiming==1&&isTimngPause==0){
                alignments2.push(pointsA);   //将数组加入到队列
				
				/*
				if(alignments2.length>2){
					var tempRespList1=[];
						tempRespList1.push(alignments2[alignments2.length-2]);
						tempRespList1.push(alignments2[alignments2.length-1]);
						alignments2=tempRespList1;
				}
				*/
				
				
				//每次只取最新的的一条 下  （针对客户端断网的情况）
				
					if(alignments2.length>1){
						var tempRespList=[];
						tempRespList.push(alignments2[alignments2.length-1]);
						alignments2=tempRespList;
					}
					
					
				//每次只取最新的的一条 上
				//console.log(alignments2);
				}
				//记录最近20秒的呼吸数据
				alignments2for20.push(pointsA);
				if(alignments2for20.length>20){
					alignments2for20.shift();
				} 
            }
			
			//0727  下
			   if("plethWaveform" in data){
				   
                var preStr=data.plethWaveform.wave.trim('"');
				//console.log(preStr);
                var pointsA=makeArray();
               // console.log(pointsA);
			   if(isTiming==1&&isTimngPause==0){
                alignments3.push(pointsA);   //将数组加入到队列
				//每次只取最新的的一条 下  （针对客户端断网的情况）
					if(alignments3.length>1){
						var tempPlethList=[];
						tempPlethList.push(alignments3[alignments3.length-1]);
						alignments3=tempPlethList;
					}
				//每次只取最新的的一条 上
				//console.log(alignments3);
			   }
				//记录最近20秒的血氧数据
				alignments3for20.push(pointsA);
				if(alignments3for20.length>20){
					alignments3for20.shift();
				} 
               }

            if("artWaveformList" in data){

               var preStr=data.artWaveformList[0].wave.trim('"');
               var pointsA=makeArray();
              // console.log(pointsA);
			  if(isTiming==1&&isTimngPause==0){
               alignments4.push(pointsA);   //将数组加入到队列
			   //每次只取最新的的一条 下  （针对客户端断网的情况）
					if(alignments4.length>1){
						var tempArtList=[];
						tempArtList.push(alignments4[alignments4.length-1]);
						alignments4=tempArtList;
					}
				//每次只取最新的的一条 上
				//console.log(alignments4);
			  }
			   //记录最近20秒的ART数据
				alignments4for20.push(pointsA);
				if(alignments4for20.length>20){
					alignments4for20.shift();
				} 
            }
			
			//0727  上
            
            

            if("observation" in data){
				var observ=data.observation;
				var ecgTime=data.msgTime.substr(0,4)+'-'+data.msgTime.substr(4,2)+'-'+data.msgTime.substr(6,2)+'&nbsp;&nbsp;'+data.msgTime.substr(8,2)+':'+data.msgTime.substr(10,2)+":"+data.msgTime.substr(12,2);
				//console.log(ecgTime);
				//console.log(observ)
				if(isTiming==1&&isTimngPause==0){
					//console.log("实时时间");
			     dataTreatmentForObservation(observ);  //已经封装为函数
				}
				//0727  上
			/*	
		    ecgTimes.push(ecgTime);	
            if(ecgTimes.length>20){
				ecgTimes.shift();
			}	
			*/
			//console.log(data.observation)
			
		   var obj={};
           obj.time=ecgTime;
           obj.observ=data.observation
            alignmentsforObservation.push(obj);  //后续需要更改
			
			if(alignmentsforObservation.length>20){
				alignmentsforObservation.shift();
			}

                hasObservatin++;
				
		        
				
            }else{
                hasObservatin-=0.5;
				
				
				
            }
			
            if(hasObservatin>=3){hasObservatin=0}
            if(hasObservatin<=-20){
				
            if(deviceS=='D'){
                $('#heartR').html('--');
                $('#respR').html('--');
                $('#heartRL').html('--');
                $('#respRL').html('--');
            }else{  //N1 和D6
				clearEcgDataExceptNibp();
			}
                hasObservatin=0;
            }
         

            function makeArray() {    //将传过来的数据存入一个新数组当中
                var drawArray=preStr.split('^');
                var newDrawArray=[];
                for(var i=0;i<drawArray.length;i++){
                    if(parseInt(drawArray[i])===32767){
                        newDrawArray.push(0);
                    }else{
                        var firstStr=drawArray[i].substr(0,1);
                        if(firstStr==="-"){
                            var s=drawArray[i].substr(1);
                            numb=parseInt(s)*-1;
                        }else{
                            numb=parseInt(drawArray[i])
                        }
                        newDrawArray.push(numb)
                    }
                }
                return newDrawArray;
            }

         

        }
		//onmessage的结尾

        //连接关闭的回调方法
        websocket.onclose = function() {
            
		    //只有在大屏心电展示时才进行重链接 下
			if(fullScreenOpen==1){
		    isWebsocketConnected=0;
			timerForReconnectWebsocket=setInterval(function(){
				if(isWebsocketConnected==1){
					clearInterval(timerForReconnectWebsocket);
					timerForReconnectWebsocket=null;
					return;
				}
				//console.log("循环重连长链接");
				webSocketFun();
			},2000);
			}
			 //只有在大屏心电展示时才进行重链接 上
        }

        //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
        window.onbeforeunload = function() {
            websocket.close();
        }
        //判定是否上传了具体的心跳和呼吸次数
  }
        //原始绘制函数
        //心电
        var LX1=0;
        var LY1=0;
        var LX2=0;
        var LY2=0;
        var LX3=0;
        var LY3=0;
        var LX4=0;
        var LY4=0;
        var LY4=0;
        var DLX1=0;
        var DLY1=0;
        var DLX2=0;
        var DLY2=0;
        var DLX3=0;
        var DLY3=0;
        var DLX4=0;
        var DLY4=0;
        var DLX5=0;
        var DLY5=0;
        var DLX6=0;
        var DLY6=0;
        var DLX7=0;
        var DLY7=0;
		// 0727 新增向下
		 var LXN1 = 0;
         var LYN1 = 0;
         var LXN2 = 0;
         var LYN2 = 0;
         var LXN3 = 0;
         var LYN3 = 0;
         var LXN4 = 0;
         var LYN4 = 0;
		 var LXN11 = 0;
         var LYN11 = 0;
         var LXN22 = 0;
         var LYN22 = 0;
         var LXN33 = 0;
         var LYN33 = 0;
         var LXN44 = 0;
         var LYN44 = 0;
		 var DLXN1 = 0;
		 var DLYN1 = 0;
		 var DLXN2 = 0;
		 var DLYN2 = 0;
		 var DLXN3 = 0;
		 var DLYN3 = 0;
		 var DLXN4 = 0;
		 var DLYN4 = 0;
		 var DLXN5 = 0;
		 var DLYN5 = 0;
		 var DLXN6 = 0;
		 var DLYN6 = 0;
		 var DLXN7 = 0;
		 var DLYN7 = 0;
		 var DLXN8 = 0;
		 var DLYN8 = 0;
		 var DLXN9 = 0;
		 var DLYN9 = 0;
		 var DLXN10 = 0;
		 var DLYN10 = 0;
		 var DLXN11 = 0;
		 var DLYN11 = 0;
		 var DLXN12 = 0;
		 var DLYN12 = 0;
		
        var heartCheck=0;   //心电数据
        clearInterval(timer18);
        timer18=null;
		
		timer18=setInterval(function () {   //0727 改动
		    if(deviceS=="D"){
				 heartTimer(3);
			}else{
				 
				 if(deviceNo=='0990'){
					 heartTimer(3);
		
				 }else{
					heartTimer(2); 
				 }
			}
            
         },1000);
		 
		  function heartTimer(heartSteps){
 
        if(alignments1.length>0) {                //&&heartStart==1
		
            if (heartCheck > heartSteps) {
                heartCheck = 0;
				
			     LX1 = 0;
                LY1 = 0;
                LX3 = 0;
                LY3 = 0;
                DLX1 = 0;
                DLY1 = 0;
                DLX2 = 0;
                DLY2 = 0;
                DLX3 = 0;
                DLY3 = 0;
                DLX4 = 0;
                DLY4 = 0;
                DLX5 = 0;
                DLY5 = 0;
                DLX6 = 0;
                DLY6 = 0;
                DLX7 = 0;
                DLY7 = 0;
				
				LXN1 = 0; //0727 新增
                LYN1 = 0;
				LXN11 = 0;
				LYN11 = 0;
				DLXN1 = 0;
		  DLYN1 = 0;
		  DLXN2 = 0;
		  DLYN2 = 0;
		  DLXN3 = 0;
		  DLYN3 = 0;
		  DLXN4 = 0;
		  DLYN4 = 0;
		  DLXN5 = 0;
		  DLYN5 = 0;
		  DLXN6 = 0;
		  DLYN6 = 0;
		  DLXN7 = 0;
		  DLYN7 = 0;
		  DLXN8 = 0;
		  DLYN8 = 0;
		  DLXN9 = 0;
		 DLYN9 = 0;
		  DLXN10 = 0;
		  DLYN10 = 0;
		  DLXN11 = 0;
		  DLYN11 = 0;
		  DLXN12 = 0;
		  DLYN12 = 0;
				
				
               
            }
            var aa = alignments1.shift();
          // console.log(aa);

            var heartPoints1 = [];
            var heartPoints2 = [];
            var heartPoints3 = [];
            var heartPoints4 = [];
            var heartPoints5 = [];
            var heartPoints6 = [];
            var heartPoints7 = [];
            var heartPoints8 = [];    //0724 改动
            var heartPoints9 = [];
            var heartPoints10 = [];
            var heartPoints11 = [];
            var heartPoints12 = [];

            if (aa.length == 7) {
                if (deviceS == 'D') {
                    makeLeadPoints(heartPoints1, 0, 1);
                    makeLeadPoints(heartPoints2, 1, 1);
                    makeLeadPoints(heartPoints3, 2, 1);
                    makeLeadPoints(heartPoints4, 3, 1);
                    makeLeadPoints(heartPoints5, 4, 1);
                    makeLeadPoints(heartPoints6, 5, 1);
                    makeLeadPoints(heartPoints7, 6, 1);
                } else {
                    makeLeadPoints(heartPoints1, 0, 1);
                    makeLeadPoints(heartPoints2, 1, 1);
                    makeLeadPoints(heartPoints3, 2, 1);
                    makeLeadPoints(heartPoints4, 3, 1);
                    makeLeadPoints(heartPoints5, 4, 1);
                    makeLeadPoints(heartPoints6, 5, 1);
                    makeLeadPoints(heartPoints7, 6, 1);
                    clearFullScreenCanvas(0,0,['cd88','cd99','cd10','cd1011','cd1012']);
                }

            } else if (aa.length == 1) {
                heartPoints1 = [];
                makeLeadPoints(heartPoints1, 0, 1);
                clearFullScreenCanvas(0,0,['cd22','cd33','cd44','cd55','cd66','cd77','cd88','cd99','cd10','cd1011','cd1012'])

            } else if (aa.length == 8) {
                makeLeadPoints(heartPoints1, 0, 1);
                makeLeadPoints(heartPoints2, 1, 1);
                makeLeadPoints(heartPoints3, 2, 1);
                makeLeadPoints(heartPoints4, 3, 1);
                makeLeadPoints(heartPoints5, 4, 1);
                makeLeadPoints(heartPoints6, 5, 1);
                makeLeadPoints(heartPoints7, 6, 1);
                makeLeadPoints(heartPoints8, 7, 1);
                clearFullScreenCanvas(0,0,['cd99','cd10','cd1011','cd1012'])
            } else if (aa.length == 12) {
                makeLeadPoints(heartPoints1, 0, 1);
                makeLeadPoints(heartPoints2, 1, 1);
                makeLeadPoints(heartPoints3, 2, 1);
                makeLeadPoints(heartPoints4, 3, 1);
                makeLeadPoints(heartPoints5, 4, 1);
                makeLeadPoints(heartPoints6, 5, 1);
                makeLeadPoints(heartPoints7, 6, 1);
                makeLeadPoints(heartPoints8, 7, 1);
                makeLeadPoints(heartPoints9, 8, 1);
                makeLeadPoints(heartPoints10, 9, 1);
                makeLeadPoints(heartPoints11, 10, 1);
                makeLeadPoints(heartPoints12, 11, 1);
            }


            function makeLeadPoints(heartPoints, num, times) {
                heartPoints.push(aa[num][0] * times);
				/*
				if (aa[num].length < 500) {
                    for (var i = 1; i < 50; i++) {
                        heartPoints.push(aa[num][i * 10 - 1] * times);
                    }
                    heartPoints.push(aa[num][aa[num].length - 1] * times);
                } else {
                    for (var i = 1; i <= 50; i++) {
                        heartPoints.push(aa[num][i * 10 - 1] * times);
                    }
                }
				*/
                if (aa[num].length < 500) {
                    for (var i = 1; i < 100; i++) {
                        heartPoints.push(aa[num][i * 5 - 1] * times);
                    }
                    heartPoints.push(aa[num][aa[num].length - 1] * times);
                } else {
                    for (var i = 1; i <= 100; i++) {
                        heartPoints.push(aa[num][i * 5 - 1] * times);
                    }
                }
				
            }
             //console.log(heartPoints1.length);

            var interval = 1000 / ((heartPoints1.length-1)/4 - 1);  
			
			 var avgYlead =''
		     var avgXlead = ''
             var lengthLead = ''
             var leadH = ''
			 
			  var avgY1 = ''
              var avgX1 = '';
              var length5001 = '';
              var H1 = '';

            if (deviceS == 'D') {
                var ySteps = 2200;

                var avgY1 = 28 / ySteps;
                var avgX1 = 225 / 400;
				//var avgX1 = 225 / 200;
                var length5001 = 225 / 4;
                var H1 = 28;

                var avgY2 = 80 / ySteps;
                var avgX2 = 450 / 400;
				//var avgX2 = 450 / 200;
                var length5002 = 450 / 4;
                var H2 = 80;

                var avgY3 = 45 / ySteps;
                var avgX3 = 360 / 400;
			   //var avgX3 = 360 / 200;
                var length5003 = 360 / 4;
                var H3 = 45;
            } else {

                var ySteps = 600;
				if(deviceNo=='0990'){
					ySteps=2048;
				}

                if(fullScreenOpen==1){
                     avgY1 = ((fullCanvasHeight1_1-1)/2) / ySteps;
                    //var avgX1 = fullCanvasW1 / ((heartSteps+1)*50);
					 avgX1 = fullCanvasW1 / ((heartSteps+1)*100);
                     length5001 = fullCanvasW1 / (heartSteps+1);
                     H1 = (fullCanvasHeight1_1-1)/2;
					 

                    avgYlead = ((fullCanvasH2-1)/2) / ySteps;
                   // var avgXlead = fullCanvasW2 / ((heartSteps+1)*50);
				   avgXlead = fullCanvasW2 / ((heartSteps+1)*100);
                   lengthLead = fullCanvasW2 / (heartSteps+1);
                   leadH = (fullCanvasH2-1)/2;

                }else{

                     avgY1 = 22.5 / ySteps;
                    //var avgX1 = 275 / ((heartSteps+1)*50);
					 avgX1 = 275 / ((heartSteps+1)*100);
                     length5001 = 275 / (heartSteps+1);
                     H1 = 22.5;
                }



            }

		

            //当切换到5导联时候(向下)
           if(deviceS == 'D'){
            if (aa.length < 2) {
                draw('c1', '#4ef97f', heartPoints1, interval, avgX1, avgY1, length5001, H1, heartCheck,1);
                if (heartChartL) {
                    draw('c3', '#4ef97f', heartPoints1, interval, avgX2, avgY2, length5002, H2, heartCheck,1);
                }

            } else {
                draw('c1', '#4ef97f', heartPoints1, interval, avgX1, avgY1, length5001, H1, heartCheck,1);
                if (heartChartL) {

                    draw('c3', '#4ef97f', heartPoints1, interval, avgX2, avgY2, length5002, H2, heartCheck,1);
                }

                //多画的5导联的内容
                if (heart5L) {
                    draw('cd1', '#4ef97f', heartPoints1, interval, avgX3, avgY3, length5003, H3, heartCheck,1);
                    draw('cd2', '#4ef97f', heartPoints2, interval, avgX3, avgY3, length5003, H3, heartCheck,1);
                    draw('cd3', '#4ef97f', heartPoints3, interval, avgX3, avgY3, length5003, H3, heartCheck,1);
                    draw('cd4', '#4ef97f', heartPoints4, interval, avgX3, avgY3, length5003, H3, heartCheck,1);
                    draw('cd5', '#4ef97f', heartPoints5, interval, avgX3, avgY3, length5003, H3, heartCheck,1);
                    draw('cd6', '#4ef97f', heartPoints6, interval, avgX3, avgY3, length5003, H3, heartCheck,1);
                    draw('cd7', '#4ef97f', heartPoints7, interval, avgX3, avgY3, length5003, H3, heartCheck,1);
                }

            }
        }else{
                  if(fullScreenOpen==1){
					  
                      draw('cd11', '#4ef97f', heartPoints1, interval, avgXlead, avgYlead, lengthLead , leadH, heartCheck,1);
					  
					  draw('cN11', '#4ef97f', heartPoints1, interval, avgX1, avgY1, length5001, H1, heartCheck,1); 
					  
					 
					  
					  
                      if(aa.length>6){
                          draw('cd22', '#4ef97f', heartPoints2, interval, avgXlead, avgYlead, lengthLead , leadH, heartCheck,1);
                          draw('cd33', '#4ef97f', heartPoints3, interval, avgXlead, avgYlead, lengthLead , leadH, heartCheck,1);
                          draw('cd44', '#4ef97f', heartPoints4, interval, avgXlead, avgYlead, lengthLead , leadH, heartCheck,1);
                          draw('cd55', '#4ef97f', heartPoints5, interval, avgXlead, avgYlead, lengthLead , leadH, heartCheck,1);
                          draw('cd66', '#4ef97f', heartPoints6, interval, avgXlead, avgYlead, lengthLead , leadH, heartCheck,1);
                          draw('cd77', '#4ef97f', heartPoints7, interval, avgXlead, avgYlead, lengthLead , leadH, heartCheck,1);
                      }
                     if(aa.length>7){
                         draw('cd88', '#4ef97f', heartPoints8, interval, avgXlead, avgYlead, lengthLead , leadH, heartCheck,1);
                     }
                     if(aa.length>8){
                         draw('cd99', '#4ef97f', heartPoints9, interval, avgXlead, avgYlead, lengthLead , leadH, heartCheck,1);
                         draw('cd10', '#4ef97f', heartPoints10, interval, avgXlead, avgYlead, lengthLead , leadH, heartCheck,1);
                         draw('cd1011', '#4ef97f', heartPoints11, interval, avgXlead, avgYlead, lengthLead , leadH, heartCheck,1);
                         draw('cd1012', '#4ef97f', heartPoints12, interval, avgXlead, avgYlead, lengthLead , leadH, heartCheck,1);
                     }

                  }else{
                   draw('cN1', '#4ef97f', heartPoints1, interval, avgX1, avgY1, length5001, H1, heartCheck,1);
               }


           }

            //当切换到5导联时候(向上)
            heartCheck++;
			//
			heartClean=0;
        }else{                         //新加的
		
		   if(isTiming==1&&isTimngPause==0){
			       heartClean=1;
		   
		   if(heartCleanTimer==null){
			   //console.log(11111)
			  heartCleanTimer=setTimeout(function(){   //断开超过3秒时清除画布
			if(heartClean==1){
				//console.log('超过3秒 ')
				    if(deviceS=='D'){
            clear('c1','c3',228,70,456,160);
            clear('cd1','cd2',360,90,360,90);
            clear('cd3','cd4',360,90,360,90);
            clear('cd5','cd6',360,90,360,90);
            clear('cd6','cd7',360,90,360,90);
            $('#heartR').html('Null');
            $('#heartRL').html('Null');
            }else{
                clearFullScreenCanvas(2,1,array1);
				$('#heartRateFS').html('--');
				$('#heartRate').html('--');
            }
			   }
			heartCleanTimer=null; 
	           //console.log('重置Null')
			   
		   },3000)
           
		   }
		   }else{
			   	    if(deviceS=='D'){
            clear('c1','c3',228,70,456,160);
            clear('cd1','cd2',360,90,360,90);
            clear('cd3','cd4',360,90,360,90);
            clear('cd5','cd6',360,90,360,90);
            clear('cd6','cd7',360,90,360,90);
            $('#heartR').html('Null');
            $('#heartRL').html('Null');
            }else{
                clearFullScreenCanvas(2,1,array1);
				$('#heartRateFS').html('--');
				$('#heartRate').html('--');
            }
		   }
		
		  
		   
		   
			//heartStart=0;
        }
    }
		 
        //心电
        //6.14新加 （向下）
        function clear(cans1,cans2,w1,h1,w2,h2) {
            var cann1=document.getElementById(cans1);
            var ctx1=cann1.getContext('2d');
            ctx1.save();
            ctx1.clearRect(0,0,w1,h1);
            ctx1.restore();

            var cann2=document.getElementById(cans2);
            var ctx2=cann2.getContext('2d');
            ctx2.save();
            ctx2.clearRect(0,0,w2,h2);
            ctx2.restore();
        }
        //6.14新加 （向上）

        var respCheck=0;   //呼吸数据
		//var respCheck1=0
        clearInterval(timer19);
        timer19=null;
		
	timer19=setInterval(function () {   //0727 改动
        if(deviceS=="D"){
            respTimer(15,150,35,225,'c2')
           
        }else{
			
			
            if(fullScreenOpen==0){
                
				if(deviceNo=='0990'){
					 respTimer(15,128,23,275,'cN4')
				}else{
					respTimer(11,120,23,275,'cN4')
				}
            }else{
                var h=fullCanvasH1/2
				if(deviceNo=='0990'){
					respTimer(15,128,h,fullCanvasW1,'cN44')
				}else{
					respTimer(11,120,h,fullCanvasW1,'cN44')
				}
                
            }

        }

    },1000);

     function respTimer(respStep,ySteps1, halfH1,xLength1,ctx1) {
        if (alignments2.length > 0) {
            if (respCheck > respStep) {
                respCheck = 0;
                LX2 = 0;
                LY2 = 0;
                LX4 = 0;
                LY4 = 0;
				
				
          LXN4 = 0;
          LYN4 = 0;
		 
          LXN44 = 0;
          LYN44 = 0;
				
            }

            var bb = alignments2.shift();
           // console.log(bb);
            var respPoints = [];
            respPoints.push(bb[0]);

            if(deviceS=="D"){                           //0724 改动
                if (bb.length < 500) {
                    for (var i = 1; i < 100; i++) {
                        respPoints.push(bb[i * 5 - 1]);
                    }
                    respPoints.push(bb[bb.length - 1]);
                } else {
                    for (var i = 1; i <= 100; i++) {
                        respPoints.push(bb[i * 5 - 1]);
                    }
                }
                var pointsOneM=100;
            }else{
				
				if(deviceNo=='0990'){
					if (bb.length < 500) {
                    for (var i = 1; i < 100; i++) {
                        respPoints.push(bb[i * 5 - 1]);
                    }
                    respPoints.push(bb[bb.length - 1]);
                } else {
                    for (var i = 1; i <= 100; i++) {
                        respPoints.push(bb[i * 5 - 1]);
                    }
                }
                var pointsOneM=100;
				}else{
					 for(var i=1;i<=85;i++){
                  respPoints.push(bb[i * 3 ]);
              }
                var pointsOneM=85;
				}
				
             
            }

             //console.log(respPoints);

                var interval1 = 1000 / (respPoints.length - 1);

                var ySteps1 = ySteps1;
                var avgY11 = halfH1 / ySteps1;
                var avgX11 = xLength1 / ((respStep + 1) * pointsOneM);
                var length50011 = xLength1 / (respStep + 1);
                var H11 = halfH1;

                var avgY21 = 60 / ySteps1;
                var avgX21 = 450 / 1600;
                var length50021 = 450 / 16;
                var H21 = 60;


                draw(ctx1, 'yellow', respPoints, interval1, avgX11, avgY11, length50011, H11, respCheck,0);
				if(heartChartL){
					draw('c4', 'yellow', respPoints, interval1, avgX21, avgY21, length50021, H21, respCheck,0);
				}

                respCheck++;
				//
				respClean=0;
            } else {
				if(isTiming==1&&isTimngPause==0){
					respClean=1;
				
				if(respCleanTimer==null){
					respCleanTimer=setTimeout(function(){
				if(respClean==1){
						 if(deviceS=="D"){
                  clear('c2', 'c4', 228, 70, 456, 160);
                  //$('#respR').html('Null');
                  //$('#respRL').html('Null');
                }else{
                  clear('cN4', 'cN4', 278, 46, 278, 46);
                  clear('cN44', 'cN44', fullCanvasW1, fullCanvasH1, fullCanvasW1, fullCanvasH1);
				  $('#respRateFS').html('--')
				  $('#respRate').html('--');
                 }
				 }
				respCleanTimer=null
				},3000)
				}
				}else{
					 clear('cN4', 'cN4', 278, 46, 278, 46);
                  clear('cN44', 'cN44', fullCanvasW1, fullCanvasH1, fullCanvasW1, fullCanvasH1);
				  $('#respRateFS').html('--')
				  $('#respRate').html('--');
				}
				
				
				
				
             

            }

    }
	

	
	//pleth 绘制  0727  下
	
	    var plethCheck=0;   //呼吸数据
		//console.log(deviceS);
   

    clearInterval(timer30);
    timer30=null;

    timer30=setInterval(function () {
		if(deviceS=='D'){
	 		clearInterval(timer30);
            timer30=null;
		}else{
		
        if(fullScreenOpen==0){
			if(deviceNo=='0990'){
				plethTimer(3,50,23,275,'cN2')
			}else{
				plethTimer(2,100,23,275,'cN2')
			}
            

        }else{
            var h=fullCanvasH1/2;
			if(deviceNo=='0990'){
				plethTimer(3,50,h,fullCanvasW1,'cN22')
			}else{
				plethTimer(2,100,h,fullCanvasW1,'cN22')
			}
            

        }
		}

    },1000);
    
	
	    function plethTimer(pCheck,ySteps1, halfH1,xLength1,ctx1) {
        if (alignments3.length > 0) {
            if (plethCheck > pCheck) {
                plethCheck = 0;
				
                LXN2 = 0;
                LYN2 = 0;
         
                LXN22 = 0;
                LYN22 = 0;
         
            }

            var bb = alignments3.shift();
			var cc=[];
             for(var i=0;i<bb.length;i++){
				 cc.push(bb[i]-50);
			 }
            var respPoints =cc;



            var pointsOneM=59;


            //console.log(respPoints);

            var interval1 = 1000 / (respPoints.length - 1);

            var ySteps1 = ySteps1;
            var avgY11 = halfH1 / ySteps1;
            var avgX11 = xLength1 / ((pCheck + 1) * pointsOneM);
            var length50011 = xLength1 / (pCheck + 1);
            var H11 = halfH1;

            /*
            var avgY21 = 60 / ySteps1;
            var avgX21 = 450 / 1600;
            var length50021 = 450 / 16;
            var H21 = 60;
            */

            draw(ctx1, '#08f2f5', respPoints, interval1, avgX11, avgY11, length50011, H11, plethCheck,0);

            plethCheck++;
			//
			plethClean=0;
        } else {
			if(isTiming==1&&isTimngPause==0){
				plethClean=1;
			
			if(plethCleanTimer==null){
			plethCleanTimer=setTimeout(function(){
			  if(plethClean==1){
				clear('cN22', 'cN22', fullCanvasW1,fullCanvasH1,fullCanvasW1, fullCanvasH1);
                clear('cN2', 'cN2', 278, 46, 278, 46);
			    $('#sp02').html('--')
		        $('#PlethRateFS').html('--');
		        $('#pIndex').html('--');
			    $('#pRate').html('--');
			  }
			  plethCleanTimer=null;
			},3000)
			
			}
			}else{
				clear('cN22', 'cN22', fullCanvasW1,fullCanvasH1,fullCanvasW1, fullCanvasH1);
                clear('cN2', 'cN2', 278, 46, 278, 46);
			    $('#sp02').html('--')
		        $('#PlethRateFS').html('--');
		        $('#pIndex').html('--');
			    $('#pRate').html('--');
			}
			
			
            
        }

    }
    
  
	
	//pleth 绘制  0727  上
	
	//art 绘制  0727  下
	
	 var artCheck=0;   //呼吸数据
    clearInterval(timer31);
    timer31=null;

    timer31=setInterval(function () {
		if(deviceS=='D'){
	 		clearInterval(timer31);
            timer31=null;
		}
        var hArt=fullCanvasHeight2/2;
        if(fullScreenOpen==0){
            artTimer(2,2500,17,275,'cN3')

        }else{
            artTimer(2,2500,hArt,fullCanvasW1,'cN33')

        }


    },1000);
	
	    function artTimer(aCheck,ySteps1, halfH1,xLength1,ctx1) {
        if (alignments4.length > 0) {
            if (artCheck > aCheck) {
                artCheck = 0;
                
				
               LXN3 = 0;
               LYN3 = 0;
         
               LXN33 = 0;
               LYN33 = 0;
         
            }

            var bb = alignments4.shift();
			var respPoints =[];
			for(var i=0;i<bb.length;i+=2){
				respPoints.push(bb[i]);
			}
           // console.log(bb);
            //var respPoints =[];
			
			//var respPoints =bb;
            //respPoints.push(bb[0]);
			/*
            for(var i=1;i<=64;i++){
                respPoints.push(bb[i*2-1])
            }
			*/
           // console.log(respPoints);
           
		   
            //console.log(respPoints);
			
            //var pointsOneM=127;
			  var pointsOneM=63;


            //console.log(respPoints);

            var interval1 = 1000 / (respPoints.length - 1);

            var ySteps1 = ySteps1;
            var avgY11 = halfH1 / ySteps1;
            var avgX11 = xLength1 / ((aCheck + 1) * pointsOneM);
            var length50011 = xLength1 / (aCheck + 1);
            var H11 = halfH1;

            var avgY21 = 60 / ySteps1;
            var avgX21 = 450 / 1600;
            var length50021 = 450 / 16;
            var H21 = 60;


            draw(ctx1, '#f2394f', respPoints, interval1, avgX11, avgY11, length50011, H11, artCheck,0);

            artCheck++;
			//
			artClean=0;
        } else {
			
			if(isTiming==1&&isTimngPause==0){
				artClean=1;
			
			if(artCleanTimer==null){
				artCleanTimer=setTimeout(function(){
					if(artClean==1){
						clear('cN3', 'cN3', 278, 34, 278, 34);
                        clear('cN33', 'cN33', fullCanvasW1,fullCanvasH2, fullCanvasW1, fullCanvasH2);
				        $('#artFullScreen1').html('--/--');
				        $('#artFullScreen2').html('--');
				        $('#artData').html('--');
						
					}
					artCleanTimer=null;
				},3000)
			}
			}else{
				        clear('cN3', 'cN3', 278, 34, 278, 34);
                        clear('cN33', 'cN33', fullCanvasW1,fullCanvasH2, fullCanvasW1, fullCanvasH2);
				        $('#artFullScreen1').html('--/--');
				        $('#artFullScreen2').html('--');
				        $('#artData').html('--');
			}
			

                

        }

    }
	
	
	
	
	
	//art 绘制  0727  上



        //绘制心电函数
        function draw(canvas,color,pointsA,interval,avgX,avgY,length500,H,pan4,isECG) {
            // 

            var pointsObjA=[];
            for(var i=0;i<pointsA.length;i++){
                var x=avgX*(i+1)+pan4*length500;
                var y=H-(pointsA[i]*avgY);
                pointsObjA.push({x:x,y:y});
            }

            //
            var canss=canvas;

            var canvas=document.getElementById(canvas);
            var ctx=canvas.getContext('2d');
               if(deviceS=='D'){                   //0727 改动
                ctx.lineWidth=2;
               }else{
                  ctx.lineWidth=1;
                }
            ctx.strokeStyle=color;

            var NX=0;
            var NY=0;

            if(canss=="c1"){  //判断是那一个画布
                //console.log(1);
                NX=LX1;
                NY=LY1;
                LX1=pointsObjA[pointsObjA.length-1].x;
                LY1=pointsObjA[pointsObjA.length-1].y;
            }else if(canss=="c2"){
                //console.log(2);
                NX=LX2;
                NY=LY2;
                LX2=pointsObjA[pointsObjA.length-1].x;
                LY2=pointsObjA[pointsObjA.length-1].y;
            }else if(canss=="c3"){
                // console.log(3);
                NX=LX3;
                NY=LY3;
                LX3=pointsObjA[pointsObjA.length-1].x;
                LY3=pointsObjA[pointsObjA.length-1].y;
            }else if(canss=="c4"){
                //console.log(4);
                NX=LX4;
                NY=LY4;
                LX4=pointsObjA[pointsObjA.length-1].x;
                LY4=pointsObjA[pointsObjA.length-1].y;
            }else if(canss=="cd1"){
                NX=DLX1;
                NY=DLY1;
                DLX1=pointsObjA[pointsObjA.length-1].x;
                DLY1=pointsObjA[pointsObjA.length-1].y;
            }else if(canss=="cd2"){
                NX=DLX2;
                NY=DLY2;
                DLX2=pointsObjA[pointsObjA.length-1].x;
                DLY2=pointsObjA[pointsObjA.length-1].y;
            }else if(canss=="cd3"){
                NX=DLX3;
                NY=DLY3;
                DLX3=pointsObjA[pointsObjA.length-1].x;
                DLY3=pointsObjA[pointsObjA.length-1].y;
            }else if(canss=="cd4"){
                NX=DLX4;
                NY=DLY4;
                DLX4=pointsObjA[pointsObjA.length-1].x;
                DLY4=pointsObjA[pointsObjA.length-1].y;
            }else if(canss=="cd5"){
                NX=DLX5;
                NY=DLY5;
                DLX5=pointsObjA[pointsObjA.length-1].x;
                DLY5=pointsObjA[pointsObjA.length-1].y;
            }else if(canss=="cd6"){
                NX=DLX6;
                NY=DLY6;
                DLX6=pointsObjA[pointsObjA.length-1].x;
                DLY6=pointsObjA[pointsObjA.length-1].y;
            }else if(canss=="cd7"){
                NX=DLX7;
                NY=DLY7;
                DLX7=pointsObjA[pointsObjA.length-1].x;
                DLY7=pointsObjA[pointsObjA.length-1].y;
            }else if(canss=='cN1'){
                 NX=LXN1;
                 NY=LYN1;
                 LXN1=pointsObjA[pointsObjA.length-1].x;
                 LYN1=pointsObjA[pointsObjA.length-1].y;
             }else if(canss=='cN2'){
                 NX=LXN2;
                 NY=LYN2;
                 LXN2=pointsObjA[pointsObjA.length-1].x;
                 LYN2=pointsObjA[pointsObjA.length-1].y;
             }else if(canss=='cN3'){
                 NX=LXN3;
                 NY=LYN3;
                 LXN3=pointsObjA[pointsObjA.length-1].x;
                 LYN3=pointsObjA[pointsObjA.length-1].y;
             }else if(canss=='cN4'){
                 NX=LXN4;
                 NY=LYN4;
                 LXN4=pointsObjA[pointsObjA.length-1].x;
                 LYN4=pointsObjA[pointsObjA.length-1].y;
             }else if(canss=='cN11'){
                 NX=LXN11;
                 NY=LYN11;
                 LXN11=pointsObjA[pointsObjA.length-1].x;
                 LYN11=pointsObjA[pointsObjA.length-1].y;
             }else if(canss=='cN22'){
                 NX=LXN22;
                 NY=LYN22;
                 LXN22=pointsObjA[pointsObjA.length-1].x;
                 LYN22=pointsObjA[pointsObjA.length-1].y;
             }else if(canss=='cN33'){
                 NX=LXN33;
                 NY=LYN33;
                 LXN33=pointsObjA[pointsObjA.length-1].x;
                 LYN33=pointsObjA[pointsObjA.length-1].y;
             }else if(canss=='cN44'){
                 NX=LXN44;
                 NY=LYN44;
                 LXN44=pointsObjA[pointsObjA.length-1].x;
                 LYN44=pointsObjA[pointsObjA.length-1].y;
             }else if(canss=='cd11'){
                 NX=DLXN1;
                 NY=DLYN1;
                 DLXN1=pointsObjA[pointsObjA.length-1].x;
                 DLYN1=pointsObjA[pointsObjA.length-1].y;
             }else if(canss=='cd22'){
                 NX=DLXN2;
                 NY=DLYN2;
                 DLXN2=pointsObjA[pointsObjA.length-1].x;
                 DLYN2=pointsObjA[pointsObjA.length-1].y;
             }else if(canss=='cd33'){
                 NX=DLXN3;
                 NY=DLYN3;
                 DLXN3=pointsObjA[pointsObjA.length-1].x;
                 DLYN3=pointsObjA[pointsObjA.length-1].y;
             }else if(canss=='cd44'){
                 NX=DLXN4;
                 NY=DLYN4;
                 DLXN4=pointsObjA[pointsObjA.length-1].x;
                 DLYN4=pointsObjA[pointsObjA.length-1].y;
             }else if(canss=='cd55'){
                 NX=DLXN5;
                 NY=DLYN5;
                 DLXN5=pointsObjA[pointsObjA.length-1].x;
                 DLYN5=pointsObjA[pointsObjA.length-1].y;
             }else if(canss=='cd66'){
                 NX=DLXN6;
                 NY=DLYN6;
                 DLXN6=pointsObjA[pointsObjA.length-1].x;
                 DLYN6=pointsObjA[pointsObjA.length-1].y;
             }else if(canss=='cd77'){
                 NX=DLXN7;
                 NY=DLYN7;
                 DLXN7=pointsObjA[pointsObjA.length-1].x;
                 DLYN7=pointsObjA[pointsObjA.length-1].y;
             }else if(canss=='cd88'){
                 NX=DLXN8;
                 NY=DLYN8;
                 DLXN8=pointsObjA[pointsObjA.length-1].x;
                 DLYN8=pointsObjA[pointsObjA.length-1].y;
             }else if(canss=='cd99'){
                 NX=DLXN9;
                 NY=DLYN9;
                 DLXN9=pointsObjA[pointsObjA.length-1].x;
                 DLYN9=pointsObjA[pointsObjA.length-1].y;
             }else if(canss=='cd10'){
                 NX=DLXN10;
                 NY=DLYN10;
                 DLXN10=pointsObjA[pointsObjA.length-1].x;
                 DLYN10=pointsObjA[pointsObjA.length-1].y;
             }else if(canss=='cd1011'){
                 NX=DLXN11;
                 NY=DLYN11;
                 DLXN11=pointsObjA[pointsObjA.length-1].x;
                 DLYN11=pointsObjA[pointsObjA.length-1].y;
             }else if(canss=='cd1012'){
                 NX=DLXN12;
                 NY=DLYN12;
                 DLXN12=pointsObjA[pointsObjA.length-1].x;
                 DLYN12=pointsObjA[pointsObjA.length-1].y;
             }
			 
			 
			if(isECG){   //将来用
				 
			 

            //在定时器启用之前先调用一次（向上）
            if(NX==0){  //一开始便需要绘制
                ctx.clearRect(0,0,avgX*5,H*2+1); //清除的点个数
                ctx.beginPath();
                ctx.moveTo(pointsObjA[0].x,pointsObjA[0].y);
                ctx.lineTo(pointsObjA[1].x,pointsObjA[1].y);
				//尝 向下
			   ctx.moveTo(pointsObjA[1].x,pointsObjA[1].y);
               ctx.lineTo(pointsObjA[2].x,pointsObjA[2].y);
      
               ctx.clearRect(pointsObjA[2].x,0,avgX*5,H*2+1);
      
               ctx.moveTo(pointsObjA[2].x,pointsObjA[2].y);
               ctx.lineTo(pointsObjA[3].x,pointsObjA[3].y);
		
		       ctx.clearRect(pointsObjA[3].x,0,avgX*5,H*2+1);
      
               ctx.moveTo(pointsObjA[3].x,pointsObjA[3].y);
               ctx.lineTo(pointsObjA[4].x,pointsObjA[4].y);
      
				//尝 向上
                ctx.stroke();
            }else if(NX=="切换"){                                       //切换显示模式时 将 将要显示的数据的位置改为  ”切换“
				ctx.clearRect(pointsObjA[0].x,0,avgX*5,H*2+1); //清除的点个数
                ctx.beginPath();
                ctx.moveTo(pointsObjA[0].x,pointsObjA[0].y);
                ctx.lineTo(pointsObjA[1].x,pointsObjA[1].y);
				//尝 向下
			   ctx.moveTo(pointsObjA[1].x,pointsObjA[1].y);
               ctx.lineTo(pointsObjA[2].x,pointsObjA[2].y);
      
               ctx.clearRect(pointsObjA[2].x,0,avgX*5,H*2+1);
      
               ctx.moveTo(pointsObjA[2].x,pointsObjA[2].y);
               ctx.lineTo(pointsObjA[3].x,pointsObjA[3].y);
		
		       ctx.clearRect(pointsObjA[3].x,0,avgX*5,H*2+1);
      
               ctx.moveTo(pointsObjA[3].x,pointsObjA[3].y);
               ctx.lineTo(pointsObjA[4].x,pointsObjA[4].y);
				//尝 向上
                ctx.stroke();
			}else{
                ctx.clearRect(NX,0,avgX*5,H*2+1); //清除的点个数
			   
                ctx.beginPath();
                ctx.moveTo(NX,NY);
				if(canss=='cN11'){
					
				}
                ctx.lineTo(pointsObjA[0].x,pointsObjA[0].y);
                ctx.lineTo(pointsObjA[1].x,pointsObjA[1].y);
				//尝 向下
				 ctx.clearRect(pointsObjA[1].x,0,avgX*5,H*2+1)
       
                 ctx.moveTo(pointsObjA[1].x,pointsObjA[1].y);
                 ctx.lineTo(pointsObjA[2].x,pointsObjA[2].y);
       
                 ctx.clearRect(pointsObjA[2].x,0,avgX*5,H*2+1)
       
                 ctx.moveTo(pointsObjA[2].x,pointsObjA[2].y);
                 ctx.lineTo(pointsObjA[3].x,pointsObjA[3].y);
		
		         ctx.clearRect(pointsObjA[3].x,0,avgX*5,H*2+1);
      
                 ctx.moveTo(pointsObjA[3].x,pointsObjA[3].y);
                 ctx.lineTo(pointsObjA[4].x,pointsObjA[4].y);
				
                 ctx.stroke();
            }


            var pan5=4;
            var timer1=setInterval(function () {
                
           if(pan5<pointsObjA.length-1){
            
            if(pan5+4<pointsObjA.length-1) {    
                ctx.clearRect(pointsObjA[pan5].x, 0, avgX * 5, H * 2+1);
            }
            ctx.beginPath();
            ctx.moveTo(pointsObjA[pan5].x,pointsObjA[pan5].y);
            ctx.lineTo(pointsObjA[pan5+1].x,pointsObjA[pan5+1].y);
            
            //尝试向下
            if(pan5+4<pointsObjA.length-1) {
                ctx.clearRect(pointsObjA[pan5 + 1].x, 0, avgX * 5, H * 2+1)
            }
            
            ctx.moveTo(pointsObjA[pan5+1].x,pointsObjA[pan5+1].y)
            ctx.lineTo(pointsObjA[pan5+2].x,pointsObjA[pan5+2].y);
            
            if(pan5+4<pointsObjA.length-1) {
                ctx.clearRect(pointsObjA[pan5 + 2].x, 0, avgX * 5, H * 2+1)
            }
           
            ctx.moveTo(pointsObjA[pan5+2].x,pointsObjA[pan5+2].y)
            ctx.lineTo(pointsObjA[pan5+3].x,pointsObjA[pan5+3].y);
            
            if(pan5+4<pointsObjA.length-1) {
                ctx.clearRect(pointsObjA[pan5 + 3].x, 0, avgX * 5, H * 2+1)
            }
            
            ctx.moveTo(pointsObjA[pan5+3].x,pointsObjA[pan5+3].y)
            ctx.lineTo(pointsObjA[pan5+4].x,pointsObjA[pan5+4].y);
            //尝试向上
            ctx.stroke();
        }


                pan5+=4;
                if(pan5>=(pointsObjA.length-1)){

                    clearInterval(timer1);
                    timer1=null;
                    pan5=4;
                }
				},interval)
				
		}else{                //else中为 非心电的波的描绘
			
              if(NX==0){  //一开始便需要绘制
                ctx.clearRect(0,0,avgX*5,H*2); //清除的点个数
                ctx.beginPath();
                ctx.moveTo(pointsObjA[0].x,pointsObjA[0].y);
                ctx.lineTo(pointsObjA[1].x,pointsObjA[1].y);
                ctx.stroke();
            }else if(NX=="切换"){                                       //切换显示模式时 将 将要显示的数据的位置改为  ”切换“
				ctx.clearRect(pointsObjA[0].x,0,avgX*5,H*2); //清除的点个数
                ctx.beginPath();
                ctx.moveTo(pointsObjA[0].x,pointsObjA[0].y);
                ctx.lineTo(pointsObjA[1].x,pointsObjA[1].y);
                ctx.stroke();
			}else{
                ctx.clearRect(NX,0,avgX*5,H*2); //清除的点个数

                ctx.beginPath();
                ctx.moveTo(NX,NY);
				if(canss=='cN11'){

				}
                ctx.lineTo(pointsObjA[0].x,pointsObjA[0].y);
                ctx.lineTo(pointsObjA[1].x,pointsObjA[1].y);
                ctx.stroke();
            }

            var pan5=1;
            var timer1=setInterval(function () {

                if(pan5<pointsObjA.length-1){
					if(pan5<pointsObjA.length-2){
						ctx.clearRect(pointsObjA[pan5].x,0,avgX*5,H*2); //清除的点个数
					}

                    ctx.beginPath();
                    ctx.moveTo(pointsObjA[pan5].x,pointsObjA[pan5].y);
                    ctx.lineTo(pointsObjA[pan5+1].x,pointsObjA[pan5+1].y);
                    ctx.stroke();
                }



                pan5++;
                if(pan5>(pointsObjA.length-1)){

                    clearInterval(timer1);
                    timer1=null;
                    pan5=0;
                }
				},interval) 			
					
		}
				/////===
			 
        }
		
		  //07.27 N系列心电 绘制波形以外的数据 （向下）
     function drawData(ctx,color,text1,text2,text3,text4,text5,text6,text7,dashedLine,y2,y3) {
         var canvas=document.getElementById(ctx);
         var ctx=canvas.getContext('2d');
         ctx.fillStyle=color;
         ctx.strokeStyle=color;
         ctx.lineWidth=0.5;
         ctx.font="12px";
         if(text1!=null){
             ctx.fillText(text1,0,8);
         }
         if(text2!=null){
             ctx.fillText(text2,35,8);
         }
         if(text3!=null){
             ctx.fillText(text3,70,8);
         }
         if(text4!=null){
             ctx.fillText(text4,105,8);
         }
         if(text5!=null){
             ctx.fillText(text5,245,8);
         }
         if(text6!=null){
             ctx.fillText(text6,38,20);
         }
         if(text7!=null){
             ctx.fillText(text7,41,33);
         }

         if(dashedLine!=null){
             for(var i=0;i<63;i++){
                var x1=55+i*3;
                var x11=55+i*3-2;
                var y1=1;
                 ctx.beginPath();
                ctx.moveTo(x1,y1);
                ctx.lineTo(x11,y1)
                 ctx.stroke();
                 ctx.closePath();

             }
             for(var j=0;j<63;j++){
                 var x2=55+j*3;
                 var x22=55+j*3-2;
                 var y2=33;
                 ctx.beginPath();
                 ctx.moveTo(x2,y2);
                 ctx.lineTo(x22,y2)
                 ctx.stroke();
                 ctx.closePath();
             }

             for(var k=0;k<63;k++){
                 var x5=55+k*3;
                 var x55=55+k*3-2;
                 var y5=16;
                 ctx.beginPath();
                 ctx.moveTo(x5,y5);
                 ctx.lineTo(x55,y5)
                 ctx.stroke();
                 ctx.closePath();
             }
         }

     }

	 //主动清除一次数据绘制哉绘制
	 clearCoverCanvas('cN5',278,46);
	  clearCoverCanvas('cN6',278,46);
	   clearCoverCanvas('cN7',275,34);
	    clearCoverCanvas('cN8',278,46);
	 
    drawData('cN5','#4ef97f','Ⅰ','','诊断','陷波关',null,null,null,null);
    drawData('cN6','#08f2f5','Pleth',null,null,null,null,null,null,null);
    drawData('cN8','yellow','Resp','','',null,null,null,null,null);
    drawData('cN7','#f2394f','Art','160',null,null,'Art','80','0',1);
    //07.27 N系列心电 绘制波形以外的数据 （向上）

        //队列函数
        function Queue() {
            // 存储队列元素
            var items = [];

            // 进队，向队列尾部添加一个（或多个）新项。
            this.enqueue = function(element) {
                items.push(element);
            }

            // 移除队列的第一项，并返回被移除的元素。
            this.dequeue = function() {
                return items.shift();
            }

            // 返回队列中第一个元素-最先被添加，也会是最先被移除的元素。（只返回，不移除）。
            this.front = function() {
                return items[0];
            }

            // 如果队列为空，返回true，否则，返回false。
            this.isEmpty = function() {
                return items.length === 0;
            }

            // 返回队列的长度。
            this.size = function() {
                return items.length;
            }

            this.print = function() {
                //console.log(items.toString());
            }
        }


        //长连接向上


        //仪表盘代码
        function panelFun() {
            //绘制水温和油量效果的函数


            function darwBlocks2(num,ctx,x1,y1,x2,y2,x3,y3,x4,y4){
                for(var i=num;i<6;i++){
                    ctx.beginPath();
                    ctx.moveTo(x1+19*i,y1);
                    ctx.lineTo(x2+19*i,y2);
                    ctx.lineTo(x3+19*i,y3);
                    ctx.lineTo(x4+19*i,y4);
                    ctx.fillStyle='#ffffff';
                    ctx.fill();
                }
            }
            function drawBlocks1(ctx,i,color,x1,y1,x2,y2,x3,y3,x4,y4){
                ctx.beginPath();
                ctx.moveTo(x1+19*i,y1);
                ctx.lineTo(x2+19*i,y2);
                ctx.lineTo(x3+19*i,y3);
                ctx.lineTo(x4+19*i,y4);
                ctx.fillStyle=color;
                ctx.fill();
            }
            function drawRate(cc,rate,color1,color2,color3,color4,color5,color6){   //

                var canvas=document.getElementById(cc);
                var ctx=canvas.getContext('2d');
                var x1=0,y1=0;
                var x2=17,y2=0;
                var x3=20,y3=5;
                var x4=3,y4=5;

                ctx.save();

                if(rate<3){

                    darwBlocks2(0,ctx,x1,y1,x2,y2,x3,y3,x4,y4);
                }else if(rate<=16.6){
                    drawBlocks1(ctx,0,color1,x1,y1,x2,y2,x3,y3,x4,y4);
                    darwBlocks2(1,ctx,x1,y1,x2,y2,x3,y3,x4,y4);
                }else if(rate<=33.2){
                    drawBlocks1(ctx,0,color1,x1,y1,x2,y2,x3,y3,x4,y4);
                    drawBlocks1(ctx,1,color2,x1,y1,x2,y2,x3,y3,x4,y4);
                    darwBlocks2(2,ctx,x1,y1,x2,y2,x3,y3,x4,y4);
                }else if(rate<=49.8){
                    drawBlocks1(ctx,0,color1,x1,y1,x2,y2,x3,y3,x4,y4);
                    drawBlocks1(ctx,1,color2,x1,y1,x2,y2,x3,y3,x4,y4);
                    drawBlocks1(ctx,2,color3,x1,y1,x2,y2,x3,y3,x4,y4);
                    darwBlocks2(3,ctx,x1,y1,x2,y2,x3,y3,x4,y4);
                }else if(rate<=66.4){
                    drawBlocks1(ctx,0,color1,x1,y1,x2,y2,x3,y3,x4,y4);
                    drawBlocks1(ctx,1,color2,x1,y1,x2,y2,x3,y3,x4,y4);
                    drawBlocks1(ctx,2,color3,x1,y1,x2,y2,x3,y3,x4,y4);
                    drawBlocks1(ctx,3,color4,x1,y1,x2,y2,x3,y3,x4,y4);
                    darwBlocks2(4,ctx,x1,y1,x2,y2,x3,y3,x4,y4);
                }else if(rate<=83){
                    drawBlocks1(ctx,0,color1,x1,y1,x2,y2,x3,y3,x4,y4);
                    drawBlocks1(ctx,1,color2,x1,y1,x2,y2,x3,y3,x4,y4);
                    drawBlocks1(ctx,2,color3,x1,y1,x2,y2,x3,y3,x4,y4);
                    drawBlocks1(ctx,3,color4,x1,y1,x2,y2,x3,y3,x4,y4);
                    drawBlocks1(ctx,4,color5,x1,y1,x2,y2,x3,y3,x4,y4);
                    darwBlocks2(5,ctx,x1,y1,x2,y2,x3,y3,x4,y4);
                }else{
                    drawBlocks1(ctx,0,color1,x1,y1,x2,y2,x3,y3,x4,y4);
                    drawBlocks1(ctx,1,color2,x1,y1,x2,y2,x3,y3,x4,y4);
                    drawBlocks1(ctx,2,color3,x1,y1,x2,y2,x3,y3,x4,y4);
                    drawBlocks1(ctx,3,color4,x1,y1,x2,y2,x3,y3,x4,y4);
                    drawBlocks1(ctx,4,color5,x1,y1,x2,y2,x3,y3,x4,y4);
                    drawBlocks1(ctx,5,color6,x1,y1,x2,y2,x3,y3,x4,y4);
                   // console.log("测试");
                }

                ctx.restore();
            }

            
			
            
            function forPanelData(){
                $.ajax({
                    url: domain+':8805/getLastOneData.json?deviceNumber=' + vin,
                    success: function (res) {
                        //console.log(res.data);
                        if (res.data == null) {
							$.ajax({
								url:domian+':8805/getRecentlySpeedData.json?deviceNumber='+vin,
								success:function(res){
									//console.log(res.data);
									var data=res.data;
									data=data[data.length-1];
									//console.log(data);
									getAndShowOBDinfo(data)
									
								},
								error:function(){
									var html="<div id='panel' style=''>\n" +
                                "    <div style='color:#fff;font-size:10px;left:11px;top:2px;'>"+0+"℃</div>\n" +
                                "    <div style='color:#fff;font-size:10px;right:11px;top:2px;'>"+"00:00"+"</div>\n" +
                                "    <div class='cost'>\n" +
                                "        <span style='display:inline-block'>总花费:￥"+"00:00"+"</span>\n" +
                                "        <span id='forChromeStyle' style='display:inline-block;margin-left:20px;'>每公里花费:￥"+"00:00"+"</span>\n" +
                                "    </div>\n" +
                                "    <div class='Data-middle'>\n" +
                                "        <div>\n" +
                                "            <span>行驶里程</span>\n" +
                                "            <span style='width:62px;text-align: right;'>"+"00"+"km</span>\n" +
                                "        </div>\n" +
                                "        <div>\n" +
                                "            <span>行驶时间</span>\n" +
                                "            <span style='width:62px;text-align: right;'>"+"00"+"min</span>\n" +
                                "        </div>\n" +
                                "        <div>\n" +
                                "            <span>行驶油耗</span>\n" +
                                "            <span style='width:52px;text-align: center;margin-left:10px;'>"+"0"+"L</span>\n" +
                                "        </div>\n" +
                                "    </div>\n" +
								"<div class='totalMileage'>000km</div>\n"+
                                "    <div class='speed'>"+"0"+"</div>\n" +
                                "    <div class='fuelCost'>"+"0"+"</div>\n" +
                                "    <div class='gear'>"+"P"+"</div>\n" +
                                "    <div class='state' style='left:12px;'>C</div>\n" +
                                "    <div class='state' style='left:142px;'>H</div>\n" +
                                "    <div class='state' style='right:142px;'>E</div>\n" +
                                "    <div class='state' style='right:12px;'>F</div>\n" +
                                "    <canvas id='cc1' width='115' height='5' style='left:23px;'></canvas>\n" +
                                "    <canvas id='cc2' width='115' height='5\"' style='right:23px;'></canvas>\n" +
                                "    <img src='./images/img2/fault.png' class='alarm'>\n" +
                                "</div>";
								
								$('.panelShow').html(html);
                            if(navigator.userAgent.indexOf("Chrome")>-1){
                                $('#forChromeStyle').addClass("forChromeS")
                                if(navigator.userAgent.indexOf("Chrome")==81){
                                    $('#forChromeStyle').addClass("forOther")
                                }
                            }else{
                                if(navigator.userAgent.indexOf("QQ")>-1){
                                    $('#forChromeStyle').addClass("forQQ")
                                }else{
                                    $('#forChromeStyle').addClass("forOther")
                                }
                            }
								}
								
							});

                            //$('.NullCover').show();

                        } else {
                            var data = res.data[0];
							//console.log(data);
							getAndShowOBDinfo(data)   
                        }

                    },
                    error: function () {
                        //$('.NullCover').show();
                        if(navigator.userAgent.indexOf("Chrome")>-1){
                            $('#forChromeStyle').addClass("forChromeS")
                            if(navigator.userAgent.indexOf("Chrome")==81){
                                $('#forChromeStyle').addClass("forOther")
                            }
                        }else{
                            if(navigator.userAgent.indexOf("QQ")>-1){
                                $('#forChromeStyle').addClass("forQQ")
                            }else{
                                $('#forChromeStyle').addClass("forOther")
                            }
                        }
                    }
                })
            }
			
			function getAndShowOBDinfo(data){
								var timePoint=new Date();           //时间戳
                            var hour=timePoint.getHours();
                            if(hour<10){
                                hour="0"+hour;
                            }
                            var min=timePoint.getMinutes();
                            if(min<10){
                                min="0"+min;
                            }

                            var timeShow=hour+':'+min;     //将要显示的数据
                            var temprature=data.coolWaterTemperature/215*100;
                            var Aspeed=data.averageSpeed;
                            if(Aspeed=="Infinity"){
                                Aspeed="--";
                            }else if(Aspeed>300){
                                Aspeed="--";
                            }else if(Aspeed==null){
                                Aspeed="--";
                            }else{
                                Aspeed=Aspeed.toFixed(0);
                            }
                            var totalMileage = data.dashboardTotalMileage.toFixed(1);
							if(data.oneTime100KMGasTotal){
                            if(data.oneTime100KMGasTotal=='Infinity'||data.oneTime100KMGasTotal=='NaN'){
                                                var fuelCost ='--';
												//console.log(data);
                                            }else{
												
                                                var fuelCost = data.oneTime100KMGasTotal.toFixed(1);
                                            }
			                 }
							 if(data.oneTimeDriveDistance){
								var mileage = parseFloat(data.oneTimeDriveDistance.toFixed(1)); 
							 }
                           
                            var runTime = (data.engineRuntime / 60).toFixed(0);
							if(data.oneTimeDirveGasTotal){
								var gasCost = data.oneTimeDirveGasTotal.toFixed(1);
							}
                            var fuelLeft = data.remainingGasValue / 10;
                            if(data.oneTimeDriveMoneyTotal){
                            if(data.oneTimeDriveMoneyTotal=='NaN'){
                                                var totalCost = '--';
                                            }else{
                                                var totalCost = parseFloat(data.oneTimeDriveMoneyTotal.toFixed(2));
                                            }
			                }
							if(data.oneTime1KMMoney){
								if(data.oneTime1KMMoney=='Infinity'||data.oneTime1KMMoney=='NaN'){
                                                var avgCost = '--';
                                            }else{
                                                var avgCost = data.oneTime1KMMoney.toFixed(2);
                                            }
							}
                            
											
                            var gear = data.switchStatusB;
                            var Etemp=data.environmentTemperature;
                            if(Etemp===-40){
                                Etemp='-';
                            }

                            var html="<div id='panel' style=''>\n" +
                                "    <div style='color:#fff;font-size:10px;left:11px;top:2px;'>"+Etemp+"℃</div>\n" +
                                "    <div style='color:#fff;font-size:10px;right:11px;top:2px;'>"+timeShow+"</div>\n" +
                                "    <div class='cost'>\n" +
                                "        <span style='display:inline-block'>总花费:￥"+"--"+"</span>\n" +
                                "        <span id='forChromeStyle' style='display:inline-block;margin-left:20px;'>每公里花费:￥"+'--'+"</span>\n" +
                                "    </div>\n" +
                                "    <div class='Data-middle'>\n" +
                                "        <div>\n" +
                                "            <span>行驶里程</span>\n" +
                                "            <span style='width:62px;text-align: right;'>"+"--"+"km</span>\n" +
                                "        </div>\n" +
                                "        <div>\n" +
                                "            <span>行驶时间</span>\n" +
                                "            <span style='width:62px;text-align: right;'>"+runTime+"min</span>\n" +
                                "        </div>\n" +
                                "        <div>\n" +
                                "            <span>行驶油耗</span>\n" +
                                "            <span style='width:52px;text-align: center;margin-left:10px;'>"+"--"+"L</span>\n" +
                                "        </div>\n" +
                                "    </div>\n" +
								"<div class='totalMileage'>"+totalMileage+"km</div>\n"+
                                "    <div class='speed'>"+Aspeed+"</div>\n" +
                                "    <div class='fuelCost'>"+"--"+"</div>\n" +
                                "    <div class='gear'>"+gear+"</div>\n" +
                                "    <div class='state' style='left:12px;'>C</div>\n" +
                                "    <div class='state' style='left:142px;'>H</div>\n" +
                                "    <div class='state' style='right:142px;'>E</div>\n" +
                                "    <div class='state' style='right:12px;'>F</div>\n" +
                                "    <canvas id='cc1' width='115' height='5' style='left:23px;'></canvas>\n" +
                                "    <canvas id='cc2' width='115' height='5\"' style='right:23px;'></canvas>\n" +
                                "    <img src='./images/img2/fault.png' class='alarm'>\n" +
                                "</div>";
                            $('.panelShow').html(html);
                            //console.log(navigator.userAgent.indexOf("Chrome"));

                            if(navigator.userAgent.indexOf("Chrome")>-1){
                                $('#forChromeStyle').addClass("forChromeS")
                                if(navigator.userAgent.indexOf("Chrome")==81){
                                    $('#forChromeStyle').addClass("forOther")
                                }
                            }else{
                                if(navigator.userAgent.indexOf("QQ")>-1){
                                    $('#forChromeStyle').addClass("forQQ")
                                }else{
                                    $('#forChromeStyle').addClass("forOther")
                                }
                            }

                            drawRate('cc1',temprature,'#f8bdbf','#f2a4a9','#f47b81','#ff4c51','#ff1f23','#ff0000'); //绘制油量和水温
                            drawRate('cc2',fuelLeft,'#fdfacc','#faf4ab','#fff682','#fdf461','#f9ee37','#ffca00');

                            //水温和油量报警
                            if(temprature>120||fuelLeft<17){
                                $('.alarm').attr({
									src:'./images/img2/fault.png'
								});
                            }else{
                                $('.alarm').attr({
									src:'./images/img2/fault2.png'
								});
                            }


                            //$('.NullCover').hide();
                            //电压和容量向下
                            var voltage = 0;
                            if (data.batteryvoltage != null) {
                                voltage = data.batteryvoltage.toFixed(1);
                            }


                            $('.leftVoltage').html(voltage);
							if(voltage>0){
								$('#bartteryStatus').attr({src:'images/img2/fullBattery.png'});
							}
                            voltage = parseFloat(voltage);

                            var ratio = 0;
                            if (voltage < 11.1) {
                                ratio = 5;
                            } else if (voltage >= 11.1 && voltage < 11.3) {
                                ratio = 25;
                            } else if (voltage >= 11.3 && voltage < 11.6) {
                                ratio = 25;
                            } else if (voltage >= 11.6 && voltage < 11.9) {
                                ratio = 37.5;
                            } else if (voltage >= 11.9 && voltage < 12.2) {
                                ratio = 50;
                            } else if (voltage >= 12.2 && voltage < 12.5) {
                                ratio = 62.5;
                            } else if (voltage >= 12.5 && voltage < 12.9) {
                                ratio = 75;
                            } else if (voltage >= 12.9 && voltage < 13.3) {
                                ratio = 87.5;
                            } else if (voltage >= 13.3) {
                                ratio = 100;
                            }


                            ratio = ratio.toString();
                            $('.VoltageRemaining').html(ratio);
                            //电压和容量向上
							}
						
				
				
            if(vin!=''){
				forPanelData();
				if(timeTicket){
					 clearInterval(timeTicket);
                     timeTicket=null;
				}
				timeTicket = setInterval(function (){
			       forPanelData();
                },30000)  //每3秒请求一次仪表数
			}else{
				if(timeTicket){
					 clearInterval(timeTicket);
                     timeTicket=null;
				}
				var html="<div id='panel' style=''>\n" +
                                "    <div style='color:#fff;font-size:10px;left:11px;top:2px;'>"+0+"℃</div>\n" +
                                "    <div style='color:#fff;font-size:10px;right:11px;top:2px;'>"+"00:00"+"</div>\n" +
                                "    <div class='cost'>\n" +
                                "        <span style='display:inline-block'>总花费:￥"+"00:00"+"</span>\n" +
                                "        <span id='forChromeStyle' style='display:inline-block;margin-left:20px;'>每公里花费:￥"+"00:00"+"</span>\n" +
                                "    </div>\n" +
                                "    <div class='Data-middle'>\n" +
                                "        <div>\n" +
                                "            <span>行驶里程</span>\n" +
                                "            <span style='width:62px;text-align: right;'>"+"00"+"km</span>\n" +
                                "        </div>\n" +
                                "        <div>\n" +
                                "            <span>行驶时间</span>\n" +
                                "            <span style='width:62px;text-align: right;'>"+"00"+"min</span>\n" +
                                "        </div>\n" +
                                "        <div>\n" +
                                "            <span>行驶油耗</span>\n" +
                                "            <span style='width:52px;text-align: center;margin-left:10px;'>"+"0"+"L</span>\n" +
                                "        </div>\n" +
                                "    </div>\n" +
								"<div class='totalMileage'>000km</div>\n"+
                                "    <div class='speed'>"+"0"+"</div>\n" +
                                "    <div class='fuelCost'>"+"0"+"</div>\n" +
                                "    <div class='gear'>"+"P"+"</div>\n" +
                                "    <div class='state' style='left:12px;'>C</div>\n" +
                                "    <div class='state' style='left:142px;'>H</div>\n" +
                                "    <div class='state' style='right:142px;'>E</div>\n" +
                                "    <div class='state' style='right:12px;'>F</div>\n" +
                                "    <canvas id='cc1' width='115' height='5' style='left:23px;'></canvas>\n" +
                                "    <canvas id='cc2' width='115' height='5\"' style='right:23px;'></canvas>\n" +
                                "    <img src='./images/img2/fault.png' class='alarm'>\n" +
                                "</div>";
								
								$('.panelShow').html(html);
                            if(navigator.userAgent.indexOf("Chrome")>-1){
                                $('#forChromeStyle').addClass("forChromeS")
                                if(navigator.userAgent.indexOf("Chrome")==81){
                                    $('#forChromeStyle').addClass("forOther")
                                }
                            }else{
                                if(navigator.userAgent.indexOf("QQ")>-1){
                                    $('#forChromeStyle').addClass("forQQ")
                                }else{
                                    $('#forChromeStyle').addClass("forOther")
                                }
                            }
				
			}							
           
            

        }
        panelFun();
        //仪表盘代码（向上）
        //车辆电源代码（向下）
        var current=0;


        //右边数据
        function getBatteryData() {
            $.ajax({
                url:batteryUrl,
                success:function (res) {
                    if(res){
                        var voltage=res.voltage;
                        var current=res.current;
                        var power=res.power.toFixed(1);
						//console.log(power);


                        var html="<div>电流:<span>"+current+" <span>A</span></span></div><div>电压:<span>"+voltage+"<span> V</span></span></div>";
                        $('#rightB').html(html);
                        html=" <span>"+power+"</span><span>w</span>";
                        $('.walt').html(html);
                        if(voltage>0){
                            $('.plugin').attr("src","images/img2/Plugin.png");
                        }else{
                            $('.plugin').attr("src","images/img2/noPlugin.png");
                        }
                    }

                },
                error:function(){
                   // console.log("电池服务未开启!");
                }
            })
        }

		if(vehicleOxygen!=''){ //20181203 添加
			getBatteryData();
        clearInterval(timer17);
        timer17=null;
        timer17=setInterval(function () {
            getBatteryData();
        },30000);
		}else{//处理新点开的车辆无逆变器的情况
			if(timer17){
				clearInterval(timer17);
                timer17=null;
			}
			var html="<div>电流:<span><span>A</span></span></div><div>电压:<span><span> V</span></span></div>";
            $('#rightB').html(html);
            html=" <span></span><span>w</span>";
            $('.walt').html(html);
                       
            $('.plugin').attr("src","images/img2/noPlugin.png");
                        
			
			
		}
        
		
        forClick=0;
		
		 //新的医疗信息栏 下
	 
	$('.leftMedicalInfo').show();
	 
	   $('.closeMedicalInfo').on("click",function () {
        $('.leftMedicalInfo').hide();
    });
	
	var forMecialCrewofATEST1='';
	if(carID=='测试设备001'){
		forMecialCrewofATEST1='宇通测试车';
	}

    $.ajax({
        type: "POST",
        url: domain+":8815/device/getOnlinePerson.json",
        data: {vehicleNo:forMecialCrewofATEST1},
        dataType:'json',
        success: function(data){
			//console.log(data);
			 var html='';
            if(data.data!=null){
            var personData=data.data;
			//console.log(personData);
            for(var i=0;i<personData.length;i++){
				if(i%2!=1){
					 html+="<div class='crewInfo'>\n" +
                    "                    <div>"+personData[i].name+"</div>\n" +
                    "                    <div>"+personData[i].professional+"</div>\n" +
                    "                    <div>"+personData[i].flagId+"</div>\n" +
                    "                    </div>"
				}else{
					 html+="<div class='crewInfo colorChange'>\n" +
                    "                    <div>"+personData[i].name+"</div>\n" +
                    "                    <div>"+personData[i].professional+"</div>\n" +
                    "                    <div>"+personData[i].flagId+"</div>\n" +
                    "                    </div>"
				}
               

					
            }
			}
            $('.crewInfoWindow').html(html);
        }
    });

    $.ajax({
        type: "POST",
        url: domain+":8815/device/getVehicleDeviceShip.json",
        //data: "vehicleNo=宇通测试车",
		data:{vehicleNo:forMecialCrewofATEST1},
        dataType:'json',
        success: function(data){
			//console.log(data);

            var deviceData=data.data;
            var html='';
            for(var i=0;i<deviceData.length;i++){
				if(i%2!=1){
					 html+="<div class='crewInfo'>\n" +
                    "                    <div>"+deviceData[i].name+"</div>\n" +
                    "                    <div>"+deviceData[i].modelType+"</div>\n" +
                    "                    <div>"+deviceData[i].deviceNumber+"</div>\n" +
                    "                    </div>"
				}else{
					 html+="<div class='crewInfo colorChange'>\n" +
                    "                    <div>"+deviceData[i].name+"</div>\n" +
                    "                    <div>"+deviceData[i].modelType+"</div>\n" +
                    "                    <div>"+deviceData[i].deviceNumber+"</div>\n" +
                    "                    </div>"
				}
               

					
            }
            $('.deviceInfoWindow').html(html);
        }
    });
	 //新的医疗信息栏 上
	 //血气数据  下
	 //定义一众变量来接收数据
	         var deviceNo='';
			 var testType=''
			 var testTime=''
			 var patientId=''
			 var testDoctorID=''
			  var gender=''
			 var pH={resultID:"",resultSubId:"",resultValue:"",units:"",referencesRange:"",abnormalFlag:"",accessChecks:""} 
			 var pO2={resultID:"",resultSubId:"",resultValue:"",units:"",referencesRange:"",abnormalFlag:"",accessChecks:""} 
			 var pCO2={resultID:"",resultSubId:"",resultValue:"",units:"",referencesRange:"",abnormalFlag:"",accessChecks:""} 
			 var Na={resultID:"",resultSubId:"",resultValue:"",units:"",referencesRange:"",abnormalFlag:"",accessChecks:""} 
			 var K={resultID:"",resultSubId:"",resultValue:"",units:"",referencesRange:"",abnormalFlag:"",accessChecks:""} 
			 var Ca={resultID:"",resultSubId:"",resultValue:"",units:"",referencesRange:"",abnormalFlag:"",accessChecks:""} 
			 var Cl={resultID:"",resultSubId:"",resultValue:"",units:"",referencesRange:"",abnormalFlag:"",accessChecks:""} 
			 var Glu={resultID:"",resultSubId:"",resultValue:"",units:"",referencesRange:"",abnormalFlag:"",accessChecks:""} 
			 var Lac={resultID:"",resultSubId:"",resultValue:"",units:"",referencesRange:"",abnormalFlag:"",accessChecks:""} 
			 var Hct={resultID:"",resultSubId:"",resultValue:"",units:"",referencesRange:"",abnormalFlag:"",accessChecks:""} 
			 var tHbest={resultID:"",resultSubId:"",resultValue:"",units:"",referencesRange:"",abnormalFlag:"",accessChecks:""} 
			 var cH={resultID:"",resultSubId:"",resultValue:"",units:"",referencesRange:"",abnormalFlag:"",accessChecks:""} 
			 var HCO3_act={resultID:"",resultSubId:"",resultValue:"",units:"",referencesRange:"",abnormalFlag:"",accessChecks:""} 
			 var HCO3_std={resultID:"",resultSubId:"",resultValue:"",units:"",referencesRange:"",abnormalFlag:"",accessChecks:""} 
			 var BEecf={resultID:"",resultSubId:"",resultValue:"",units:"",referencesRange:"",abnormalFlag:"",accessChecks:""} 
			 var BEB={resultID:"",resultSubId:"",resultValue:"",units:"",referencesRange:"",abnormalFlag:"",accessChecks:""} 
			 var BBB={resultID:"",resultSubId:"",resultValue:"",units:"",referencesRange:"",abnormalFlag:"",accessChecks:""} 
			 var ctCO2={resultID:"",resultSubId:"",resultValue:"",units:"",referencesRange:"",abnormalFlag:"",accessChecks:""} 
			 var sO2est={resultID:"",resultSubId:"",resultValue:"",units:"",referencesRange:"",abnormalFlag:"",accessChecks:""} 
			 var pO2A_a={resultID:"",resultSubId:"",resultValue:"",units:"",referencesRange:"",abnormalFlag:"",accessChecks:""} 
			 var pO2aA={resultID:"",resultSubId:"",resultValue:"",units:"",referencesRange:"",abnormalFlag:"",accessChecks:""} 
			 var RI={resultID:"",resultSubId:"",resultValue:"",units:"",referencesRange:"",abnormalFlag:"",accessChecks:""} 
			 var pO2FIO2={resultID:"",resultSubId:"",resultValue:"",units:"",referencesRange:"",abnormalFlag:"",accessChecks:""} 
			 var Ca7={resultID:"",resultSubId:"",resultValue:"",units:"",referencesRange:"",abnormalFlag:"",accessChecks:""} 
			 var AnGap={resultID:"",resultSubId:"",resultValue:"",units:"",referencesRange:"",abnormalFlag:"",accessChecks:""} 
			 var cHT={resultID:"",resultSubId:"",resultValue:"",units:"",referencesRange:"",abnormalFlag:"",accessChecks:""} 
			 var pHT={resultID:"",resultSubId:"",resultValue:"",units:"",referencesRange:"",abnormalFlag:"",accessChecks:""} 
			 var pCO2T={resultID:"",resultSubId:"",resultValue:"",units:"",referencesRange:"",abnormalFlag:"",accessChecks:""} 
			 var pO2T={resultID:"",resultSubId:"",resultValue:"",units:"",referencesRange:"",abnormalFlag:"",accessChecks:""} 
			 var pO2A_aT={resultID:"",resultSubId:"",resultValue:"",units:"",referencesRange:"",abnormalFlag:"",accessChecks:""} 
			 var pO2aAT={resultID:"",resultSubId:"",resultValue:"",units:"",referencesRange:"",abnormalFlag:"",accessChecks:""} 
			 var RIT={resultID:"",resultSubId:"",resultValue:"",units:"",referencesRange:"",abnormalFlag:"",accessChecks:""} 
			 var pO2TFIO2={resultID:"",resultSubId:"",resultValue:"",units:"",referencesRange:"",abnormalFlag:"",accessChecks:""} 
			 var mOsm={resultID:"",resultSubId:"",resultValue:"",units:"",referencesRange:"",abnormalFlag:"",accessChecks:""} 
			 var Temperature={resultID:"",resultSubId:"",resultValue:"",units:"",referencesRange:"",abnormalFlag:"",accessChecks:""} 
			 var FIO2={resultID:"",resultSubId:"",resultValue:"",units:"",referencesRange:"",abnormalFlag:"",accessChecks:""} 
			 var tHb={resultID:"",resultSubId:"",resultValue:"",units:"",referencesRange:"",abnormalFlag:"",accessChecks:""} 
			 var RQ={resultID:"",resultSubId:"",resultValue:"",units:"",referencesRange:"",abnormalFlag:"",accessChecks:""} 
	 //添加信息的函数
			 function fillBloodInfo(){
				 //基本信息
				 $('#bloodGasBasicInfo').html("<p>"+deviceNo+"</p><p>"+testType+"</p><p>"+testTime+"</p><p>"+patientId+"</p><p>"+testDoctorID+"</p>")
				 //病人信息
				 $('#patientInfoValue').html("<p>"+Temperature.resultValue+Temperature.abnormalFlag+"</p><p>"+gender+"</p><p>"+tHb.resultValue+tHb.abnormalFlag+"</p><p>"+FIO2.resultValue+FIO2.abnormalFlag+"</p><p>"+RQ.resultValue+RQ.abnormalFlag+"</p>");
				 $('#patientInfoRange').html("<p>"+Temperature.referencesRange+"</p><p></p><p>"+tHb.referencesRange+"</p><p>"+FIO2.referencesRange+"</p><p>"+RQ.referencesRange+"</p>");
				 //血气值
				 $('#bloodGasInfoValue').html("<p>"+pH.resultValue+pH.abnormalFlag+"</p><p>"+pO2.resultValue+pO2.abnormalFlag+"</p><p>"+pCO2.resultValue+pCO2.abnormalFlag+"</p>")
				 $('#bloodGasDataRange').html("<p>"+pH.referencesRange+"</p><p>"+pO2.referencesRange+"</p><p>"+pCO2.referencesRange+"</p>")
				 $('#bloodGasConclusion').html("<p>"+pH.accessChecks+"</p><p>"+pO2.accessChecks+"</p><p>"+pCO2.accessChecks+"</p>")
				 //血氧值
				 $('#bloodOxygenValue').html("<p>"+Hct.resultValue+Hct.abnormalFlag+"</p><p>"+tHbest.resultValue+tHbest.abnormalFlag+"</p><p>"+sO2est.resultValue+"</p>")
				 $('#bloodOxygenRange').html("<p>"+Hct.referencesRange+"</p><p>"+tHbest.referencesRange+"</p><p>"+sO2est.referencesRange+"</p>")
				 $('#bloodOxygenConclusion').html("<p>"+Hct.accessChecks+"</p><p>"+tHbest.accessChecks+"</p><p>"+sO2est.accessChecks+"</p>")
				 //电解质值
				 $('#electrolyteValue').html("<p>"+Na.resultValue+Na.abnormalFlag+"</p><p>"+K.resultValue+K.abnormalFlag+"</p><p>"+Ca.resultValue+Ca.abnormalFlag+"</p><p>"+Cl.resultValue+Cl.abnormalFlag+"</p><p>"+Ca7.resultValue+Ca7.abnormalFlag+"</p>")
				 $('#electrolyteRange').html("<p>"+Na.referencesRange+"</p><p>"+K.referencesRange+"</p><p>"+Ca.referencesRange+"</p><p>"+Cl.referencesRange+"</p><p>"+Ca7.referencesRange+"</p>")
				 $('#electrolyteConclusion').html("<p>"+Na.accessChecks+"</p><p>"+K.accessChecks+"</p><p>"+Ca.accessChecks+"</p><p>"+Cl.accessChecks+"</p><p>"+Ca7.accessChecks+"</p>")
				 //代谢物值
				 $('#metaboliteValue').html("<p>"+Glu.resultValue+Glu.abnormalFlag+"</p><p>"+Lac.resultValue+Lac.abnormalFlag+"</p>")
				 $('#metaboliteRange').html("<p>"+Glu.referencesRange+"</p><p>"+Lac.referencesRange+"</p>")
				 $('#metaboliteConclusion').html("<p>"+Glu.accessChecks+"</p><p>"+Lac.accessChecks+"</p>")
				 //温度修正值
				 $('#tempCorrectionValue').html("<p>"+cHT.resultValue+cHT.abnormalFlag+"</p><p>"+pHT.resultValue+pHT.abnormalFlag+"</p><p>"+pCO2T.resultValue+pCO2T.abnormalFlag+"</p><p>"+pO2T.resultValue+pO2T.abnormalFlag+
				 "</p><p>"+pO2A_aT.resultValue+pO2A_aT.abnormalFlag+"</p><p>"+pO2aAT.resultValue+pO2aAT.abnormalFlag+"</p><p>"+RIT.resultValue+RIT.abnormalFlag+"</p><p>"+pO2TFIO2.resultValue+pO2TFIO2.abnormalFlag+"</p>")
				 
				 $('#tempCorrectionRange').html("<p>"+cHT.referencesRange+"</p><p>"+pHT.referencesRange+"</p><p>"+pCO2T.referencesRange+"</p><p>"+pO2T.referencesRange+
				 "</p><p>"+pO2A_aT.referencesRange+"</p><p>"+pO2aAT.referencesRange+"</p><p>"+RIT.referencesRange+"</p><p>"+pO2TFIO2.referencesRange+"</p>")
				 
				  $('#tempCorrectionConclusion').html("<p>"+cHT.accessChecks+"</p><p>"+pHT.accessChecks+"</p><p>"+pCO2T.accessChecks+"</p><p>"+pO2T.accessChecks+
				 "</p><p>"+pO2A_aT.accessChecks+"</p><p>"+pO2aAT.accessChecks+"</p><p>"+RIT.accessChecks+"</p><p>"+pO2TFIO2.accessChecks+"</p>")
				 //酸碱状态
				 $('#acidValue').html("<p>"+cH.resultValue+cH.abnormalFlag+"</p><p>"+HCO3_act.resultValue+HCO3_act.abnormalFlag+"</p><p>"+HCO3_std.resultValue+HCO3_std.abnormalFlag+"</p><p>"+BEecf.resultValue+BEecf.abnormalFlag+
				 "</p><p>"+BEB.resultValue+BEB.abnormalFlag+"</p><p>"+BBB.resultValue+BBB.abnormalFlag+"</p><p>"+ctCO2.resultValue+ctCO2.abnormalFlag+"</p><p>"+pO2A_a.resultValue+pO2A_a.abnormalFlag+"</p>"+
				 "<p>"+pO2aA.resultValue+pO2aA.abnormalFlag+"</p><p>"+RI.resultValue+RI.abnormalFlag+"</p><p>"+pO2FIO2.resultValue+pO2FIO2.abnormalFlag+"</p><p>"+AnGap.resultValue+AnGap.abnormalFlag+"</p><p>"+mOsm.resultValue+mOsm.abnormalFlag+"</p>")
				 
				 $('#acidRange').html("<p>"+cH.referencesRange+"</p><p>"+HCO3_act.referencesRange+"</p><p>"+HCO3_std.referencesRange+"</p><p>"+BEecf.referencesRange+
				 "</p><p>"+BEB.referencesRange+"</p><p>"+BBB.referencesRange+"</p><p>"+ctCO2.referencesRange+"</p><p>"+pO2A_a.referencesRange+"</p>"+
				 "<p>"+pO2aA.referencesRange+"</p><p>"+RI.referencesRange+"</p><p>"+pO2FIO2.referencesRange+"</p><p>"+AnGap.referencesRange+"</p><p>"+mOsm.referencesRange+"</p>")
				 
				  $('#acidConclusion').html("<p>"+cH.accessChecks+"</p><p>"+HCO3_act.accessChecks+"</p><p>"+HCO3_std.accessChecks+"</p><p>"+BEecf.accessChecks+
				 "</p><p>"+BEB.accessChecks+"</p><p>"+BBB.accessChecks+"</p><p>"+ctCO2.accessChecks+"</p><p>"+pO2A_a.accessChecks+"</p>"+
				 "<p>"+pO2aA.accessChecks+"</p><p>"+RI.accessChecks+"</p><p>"+pO2FIO2.accessChecks+"</p><p>"+AnGap.accessChecks+"</p><p>"+mOsm.accessChecks+"</p>") 
			 }			 
			 
	 if(webSocketForBloodGas!=null){
		 webSocketForBloodGas.close()
	 }
	  //血氧的长链接函数
	  function webSocketForBloodGasFun(url){
		 if ('WebSocket' in window) {
            // TODO 上传设备编号
            // TODO 更改设备编号需要关闭当前连接，并打开新的连接。
            // TODO 用户退出登录时需关闭当前连接。
            // 关闭浏览器窗口websocket会自动关闭连接。
            webSocketForBloodGas = new WebSocket(url);
        } else {
            alert('Not support websocket')
        } 
		
		//连接发生错误的回调方法
        webSocketForBloodGas.onerror = function() {};
		 //连接成功建立的回调方法
        webSocketForBloodGas.onopen = function(event) {}
		//锚点11
		//链接后数据推送
		 webSocketForBloodGas.onmessage = function(event) {
			 console.log(event.data);
			// return
			 
			 var data=JSON.parse(event.data)
			 if(data.msgType===1){
				 return;
			 }
			 //定义变量承接返回的数据
			 //报告基本信息
			 deviceNo=data.deviceNo;
			 testType=data.sampleTest.testType
			 var specimenSourceList=[
			     {english:'Arterial',chinese:'动脉血'},
				 {english:'Venous',chinese:'静脉血'},
				 {english:'Mixed',chinese:'混合静脉血'},
				 {english:'Capillary',chinese:'毛细血管血'},
				 {english:'Aqueous',chinese:'水溶液'},
				 {english:'CPB',chinese:'CPB'}
			 ]
			 var genderList=[
			    {code:'F',chinese:'女'},
				{code:'M',chinese:'男'},
				{code:'U',chinese:'未知'},
			 ]
			 for(var i=0;i<specimenSourceList.length;i++){//处理样本类型信息
				 if(testType==specimenSourceList[i].english){
					 testType=specimenSourceList[i].chinese;
				 }
			 }
			 testTime=data.sampleTest.testTime.substring(0,4)+'-'+data.msgTime.substring(4,6)+'-'+data.msgTime.substring(6,8)+" "+data.msgTime.substring(8,10)+':'+data.msgTime.substring(10,12)+':'+data.msgTime.substring(12,14)
			 patientId=data.patientIdentifier.id;
			 testDoctorID=data.sampleTest.testDoctorID;
			 //定义变量承接返回的数据
			 gender=data.patientIdentifier.gender;
			 for(var i=0;i<genderList.length;i++){ //处理性别信息
				 if(gender==genderList[i].code){
					 gender=genderList[i].chinese;
				 }
			 }
			 //循环将所有信息取出来
			 var sampleTestData=JSON.parse(JSON.stringify(data.sampleTest.testResultList))
			 for(var i=0;i<sampleTestData.length;i++){
				 var title=sampleTestData[i].resultSubId;
				 var data=JSON.parse(JSON.stringify(sampleTestData[i]))
				 data.referencesRange='['+data.referencesRange.replace(/\^/g,'-')+']'
				 if(data.accessChecks=='Pass'){
					 data.accessChecks='通过'
				 }else if(data.accessChecks=='Fail'){
					 data.accessChecks='失败'
				 }
				 
				 if(title=='pH'){
					 pH=data;
				 }else if(title=='pO2'){
					 pO2=data;
				 }else if(title=='pCO2'){
					 pCO2=data
				 }else if(title=='Na+'){
					 Na=data
				 }else if(title=='K+'){
					 K=data
				 }else if(title=='Ca++'){
					 Ca=data;
				 }else if(title=='Cl-'){
					 Cl=data
				 }else if(title=='Glu'){
					 Glu=data;
				 }else if(title=='Lac'){
					 Lac=data;
				 }else if(title=='Hct'){
					 Hct=data
				 }else if(title=='tHb(est)'){
					 tHbest=data
				 }else if(title=='cH+'){
					 cH=data
				 }else if(title=='HCO3-act'){
					 HCO3_act=data
				 }else if(title=='HCO3-std'){
					HCO3_std=data 
				 }else if(title=='BE(ecf)'){
					 BEecf=data
				 }else if(title=='BE(B)'){
					 BEB=data;
				 }else if(title=='BB(B)'){
					 BBB=data
				 }else if(title=='ctCO2'){
					 ctCO2=data;
				 }else if(title=='sO2(est)'){
					sO2est=data 
				 }else if(title=='pO2(A-a)'){
					 pO2A_a=data;
				 }else if(title=='pO2(a/A)'){
					 pO2aA=data
				 }else if(title=='RI'){
					 RI=data
				 }else if(title=='pO2/FIO2'){
					 pO2FIO2=data
				 }else if(title=='Ca++(7.4)'){
					 Ca7=data
				 }else if(title=='AnGap'){
					 AnGap=data;
				 }else if(title=='cH+(T)'){
					 cHT=data
				 }else if(title=='pH(T)'){
					 pHT=data;
				 }else if(title=='pCO2(T)'){
					 pCO2T=data
				 }else if(title=='pO2(T)'){
					 pO2T=data
				 }else if(title=='pO2(A-a)(T)'){
					 pO2A_aT=data
				 }else if(title=='pO2(a/A)(T)'){
					 pO2aAT=data
				 }else if(title=='RI(T)'){
					 RIT=data
				 }else if(title=='pO2(T)/FIO2'){
					 pO2TFIO2=data
				 }else if(title=='mOsm'){
					 mOsm=data
				 }else if(title=='Temperature'){
					 Temperature=data
				 }else if(title=='FIO2'){
					 FIO2=data
				 }else if(title=='tHb'){
					 tHb=data
				 }else if(title=='RQ'){
					 RQ=data
				 }
				 //for循环结尾
			 }
			 
			 fillBloodInfo()
		 }
		 //连接关闭的回调方法
        webSocketForBloodGas.onclose = function() {}

        //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
        window.onbeforeunload = function() {
            webSocketForBloodGas.close();
        }
		
	  }
		
		if(bloodGasId!=''){
			var url=domainForBloodWS+':8825/blood/edan/'+bloodGasId
		    webSocketForBloodGasFun(url)
		}else{//处理该设备没有血气的情况
			fillBloodInfo()
		}
	 
	 //血气数据  上
				 
			 }else{
				//关闭右边信息框
        //$(".sideInfo").css("display","none");
        $(".sideInfo").css("width","0");
		$('.leftMedicalInfo').hide();
		//不显示控制边栏的按钮
		//$('.BtControlSideBlock').hide();
		$('.BtControlSideBlock').css('display','none');
        if(websocket){
            websocket.close();
        }

        clearInterval(timer16);
        timer16=null;
        clearInterval(timer17);
        timer17=null;
        clearInterval(timer11);
        timer11=null;
        clearInterval(timer10);
        clearInterval(timer10);
        timer10=null;
        clearInterval(timer15);
        timer15=null;
        clearInterval(timer18);
        clearInterval(timer18);
        timer18=null;
        clearInterval(timer19);
        timer19=null;
        clearInterval(timeTicket);
        timeTicket=null;
        clearInterval(timer20);
        timer20=null;
        clearInterval(timer21);
        timer21=null;
		
		clearInterval(timer30);
        timer30=null;
		clearInterval(timer31);
        timer31=null; 
			 }
			 
		 },
		 error:function(error){
			console.log(error) 
		 }
	 })
	 
	

  
	
}	