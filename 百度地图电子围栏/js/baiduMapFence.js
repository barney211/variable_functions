
var map = new BMap.Map("map");
var point = new BMap.Point(116.331398, 39.897445); //设置地图的中心
map.centerAndZoom(point, 12);//设置地图的层级
map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放

//定位到当前城市 根据用户的ip来进行定位的
var myCity = new BMap.LocalCity();
myCity.get(myfun);
function myfun(result)
{ var cityName = result.name;
    map.setCenter(cityName);  }

//鼠标绘制功能实现的代码如下：
var overlays = [];
var overlaycomplete = function (e) {
    overlays.push(e.overlay);
};
var styleOptions = {
    strokeColor: "red",    //边线颜色。
    fillColor: "red",      //填充颜色。当参数为空时，圆形将没有填充效果。
    strokeWeight: 3,       //边线的宽度，以像素为单位。
    strokeOpacity: 0.8,   //边线透明度，取值范围0 - 1。
    fillOpacity: 0.6,      //填充的透明度，取值范围0 - 1。
    strokeStyle: 'solid' //边线的样式，solid或dashed。
}
//实例化鼠标绘制工具

var drawingManager = new BMapLib.DrawingManager(map, {
    isOpen: true, //是否开启绘制模式
    enableDrawingTool: false, //是否显示工具栏
    drawingToolOptions: {
        anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
        offset: new BMap.Size(5, 5), //偏离值
    },
    circleOptions: styleOptions, //圆的样式
    polylineOptions: styleOptions, //线的样式
    polygonOptions: styleOptions, //多边形的样式
    rectangleOptions: styleOptions //矩形的样式
});
//添加鼠标绘制工具监听事件，用于获取绘制结果
drawingManager.addEventListener('overlaycomplete', overlaycomplete);
/*当鼠标点击地图的时候，就可以在地图上添加标注点，同时获取该标注点的经纬度，依据这些点来绘制电子围栏（即根据所取的点来生成多边形），
因此鼠标所取的点应该都存储在一个数组中，这样就需要给地图添加事件监听来存储鼠标取的点，js代码实现如下：*/
//地图点击事件的监听
var points = [];
var count = 0;
var geoPs = [];
map.addEventListener("click", function (e) {
    var poin = [];
    var p;
    poin.push(e.point.lng);
    poin.push(e.point.lat);
    p = e.point.lng + ":" + e.point.lat;
    points.push(poin);
    geoPs.push(p);
    count++;
    //addRow(e.point.lng, e.point.lat, count);
    addPolyLine(points); //绘制围栏
   // console.log(points)
});
/*获取到所取到所有点就可以形成多边形，其实现的js代码如下：*/
var polyLine; //这个设置的是一个全局变量，便于在以后实现重置的时候清除地图上显示的覆盖物
function addPolyLine(ppoints)
{
    if (ppoints != "sss")
    {
        if (polyLine != null & polyLine != "")
        {
            map.removeOverlay(polyLine);
        }


        var linePoints = [];
        for(var i=0;i<ppoints.length;i++)
            {
                var s = new BMap.Point(ppoints[i][0], ppoints[i][1]);
                linePoints.push(s);
    }



        polyLine = new BMap.Polygon(linePoints,
            {
                strokeColor: "blue", strokeWeight: 5, strokeOpacity: 0.5
            });
        map.addOverlay(polyLine);
    }
    else
    {
        if (points.length <= 1)
        { alert("顶点数过少！");
            return;
        }
        else
        {
            var polyLinePoints = [];
            for (var i = 0; i < points.length; i++)
            {
                var po = new BMap.Point(points[i][0], points[i][1]);
                polyLinePoints.push(po);
            }
            polyLine = new BMap.Polygon(polyLinePoints, { strokeColor: "blue", strokeWeight: 5, strokeOpacity: 0.5 });
            map.addOverlay(polyLine); }
    }
}
//删除围栏的函数
function deleteFence() {
    for (var i = 0; i < overlays.length; i++) {
        map.removeOverlay(overlays[i]);

    }
    map.removeOverlay(polyLine)
    overlays.length = 0
    points.length=0;
}

/*要想在web端实现出入栏的判断需要引入百度地图中的GeoUtils这个类库，获取要判断点的经纬度坐标，js实现代码如下：*/
var pp = new BMap.Point(114.420418, 30.51474);//判断点的坐标，可以动态的获取到
var result = BMapLib.GeoUtils.isPointInPolygon(pp, polyLine); //判断一个点是否在多边形区域内，返回的结果是一个布尔值
alert("result=" + result);

//新增函数用于绘制以有的多边形
function addExistPolyon(pointsList) {
    var existLine=[];
    for(var i=0;i<pointsList.length;i++){
        var t = new BMap.Point(pointsList[i][0], pointsList[i][1]);
        existLine.push(t);
    }

    var polyOn = new BMap.Polygon(existLine,
        {
            strokeColor: "blue", strokeWeight: 5, strokeOpacity: 0.5
        });
    map.addOverlay(polyOn);

}
//模拟操作 （请求服务器看是否 已有围栏）
var ployLinesList=[
    [
        {lng:106.52165,lat:29.597994},
        {lng:106.523088,lat:29.600506},
        {lng:106.519818,lat:29.601951},
        {lng:106.517806,lat:29.600004}
    ],
    [
        {lng:106.513781,lat:29.612439},
        {lng:106.525854,lat:29.614699},
        {lng:106.524992,lat:29.605154}
    ]
]

for(var i=0;i<ployLinesList.length;i++){
    var existPoints=[];
    for(var j=0;j<ployLinesList[i].length;j++){
        var tempArray=[];
        tempArray.push(ployLinesList[i][j].lng);
        tempArray.push(ployLinesList[i][j].lat);
        existPoints.push(tempArray)
    }
    addExistPolyon(existPoints)
}

