function drag(parentObj,sonObj){
    console.log(parentObj,sonObj);
    //拖拽3:结合DOM,带框的拖拽
    var oDragDiv1=parentObj;
    var oDrag1=sonObj;
    oDrag1.onmousedown=function(ev){
      var oEvent=ev||event;
      var pos=getMousePosition(oEvent);
      var disX=pos.x-oDrag1.offsetLeft;
      var disY=pos.y-oDrag1.offsetTop;
      //定义拖出来的框
      var oBox=document.createElement('div');
      oBox.className='dragBox';
      oBox.style.width=oDrag1.offsetWidth-2+'px';
      oBox.style.height=oDrag1.offsetHeight-2+'px';
      //每次拖动时,给虚框div的初始位置和红色实体初始位置相同,防止虚框闪动
      oBox.style.left=oDrag1.offsetLeft+'px';
      oBox.style.top=oDrag1.offsetTop+'px';
      oDragDiv1.appendChild(oBox);
      if(oBox.setCapture){
        //兼容IE7-11
        oBox.onmousemove=Mousemove;
        oBox.onmouseup=mouseUp;
        oBox.setCapture();
      }else{
        //兼容FF,Chrome
        document.onmousemove=Mousemove;
        document.onmouseup=mouseUp;
      }

      function getMousePosition(ev){
        var scrollTop=document.documentElement.scrollTop||document.body.scrollTop;
        var scrollLeft=document.documentElement.scrollLeft||document.body.scrollLeft;
        return {x:ev.clientX+scrollLeft,y:ev.clientY+scrollTop};
      };
      //合并代码
      function Mousemove(ev){
        var oEvent=ev||event
        var pis=getMousePosition(oEvent);
        var l=pis.x-disX;
        var t=pis.y-disY;

        //3.限制范围,磁性吸附,快接近父级时,自动吸附上去
        if (l<30) {
          l=0;
        }else if(l>oDragDiv1.offsetWidth-oBox.offsetWidth){
          l=oDragDiv1.offsetWidth-oBox.offsetWidth;
        }
        if (t<30) {
          t=0;
        }else if(t>oDragDiv1.offsetHeight-oBox.offsetHeight){
          t=oDragDiv1.offsetHeight-oBox.offsetHeight;
        }
        oBox.style.left=l+'px';
        oBox.style.top=t+'px';
      };
      function mouseUp(){
        //当鼠标抬起时,mousemove/up清空
        this.onmousemove=null;
        this.onmouseup=null;
        oDrag1.style.left=oBox.offsetLeft+'px';
        oDrag1.style.top=oBox.offsetTop+'px';
        oDragDiv1.removeChild(oBox);
        if (oBox.releaseCapture) {
          oBox.releaseCapture();
        }
      };
      return false;    //FF中阻止默认行为
    };
  }