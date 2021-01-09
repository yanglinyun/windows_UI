//--------------------------------------------------------------------
//快捷函数
//批量注册事件函数
function addEvent(objs, event, fn) {
  for (var i = 0; i < objs.length; i++) {
    objs[i].addEventListener(event, fn);
  }
}
//获取class/Id/tag
function getEle() {
  var temp = arguments[0].substr(1);
  var firstChar = arguments[0][0];
  if (firstChar == "#") {
    //id
    return document.getElementById(temp);
  } else if (firstChar == ".") {
    return document.getElementsByClassName(temp);
  } else {
    return document.getElementsByTagName(selectorName);
  }
}
//获取css属性函数
function css(obj, attr) {
  var res = window.getComputedStyle(obj, null)[attr];
  return isNaN(parseFloat(res)) ? res : parseFloat(res);
}
//获取元素属性
function getAttr(obj, attr) {
  return obj.getAttribute(attr);
}
//设置元素属性
function setAttr(obj, attr, value) {
  obj.setAttribute(attr, value);
}
//-------------------------------------------------------
//windowsUI框架函数
(function windows_ui_frame() {
  //菜单逻辑
  var menu = document.getElementsByClassName("menu")[0];
  var menuBtns = menu.getElementsByClassName("menu_btn");
  //菜单按钮绑定点击事件
  addEvent(menuBtns, "click", menuFn);
  //菜单按钮绑定mouseover事件
  addEvent(menuBtns, "mouseover", menuFn);
  function menuFn(e) {
    var curObj = e.target;
    var curObjLeft = curObj.getBoundingClientRect().left;
    var data_menu = curObj.getAttribute("data-menu");
    var curMenu = document.getElementsByClassName(data_menu)[0];
    if (curMenu) {
      var appLeft = document.getElementById("app").getBoundingClientRect().left;
      var allMenu = document.getElementsByClassName("curMenu");
      var curDispaly = css(curMenu, "display");
      setTimeout(() => {
        curMenu.style.display = curDispaly == "block" ? "none" : "block";
      }, 210);
      for (var i = 0; i < allMenu.length; i++) {
        var cur = allMenu[i];
        var fn = (function (cur) {
          cur.style.display = "none";
        })(cur); //闭包
        setTimeout(fn, 210);
      }
      curMenu.style.left = curObjLeft - appLeft + "px";
    }
  }
  //菜單选项点击事件
  var menu_items = document.getElementsByClassName("menu_item");
  var menu_items_span = document.querySelectorAll(".menu_item>span");
  //解决span点击事件不出发父级事件
  addEvent(menu_items_span, "click", (e) => {
    e.target.parentNode.click();
  });
  addEvent(menu_items, "click", (e) => {
    var curObj = e.target;
    var curDialogName = curObj.getAttribute("data-class");
    var dialog = document.getElementsByClassName("dialog")[0];
    var curDialog = dialog.getElementsByClassName(curDialogName)[0];

    if (curDialog) {
      var curDisplay = css(curDialog, "display");
      //关闭其他dialog
      var diaLog = document.getElementsByClassName("dialog")[0];
      var diaLogItems = diaLog.getElementsByClassName("item");
      for (var i = 0; i < diaLogItems.length; i++) {
        diaLogItems[i].style.display = "none";
      }
      setTimeout(() => {
        curDialog.style.display = curDisplay == "block" ? "none" : "block";
      }, 210);
      try {
        eval(curDialogName + "()");
      } catch (e) {}
    } else if (curDialogName) {
      //打勾
      var menu_item_actived = curObj.getElementsByClassName(
        "menu_item_actived"
      )[0];
      if (menu_item_actived) {
        var menu_item_actived_visibility = css(menu_item_actived, "visibility");
        menu_item_actived.style.visibility =
          menu_item_actived_visibility == "visible" ? "hidden" : "visible";
      }
      //无页面显示的功能
      eval(curDialogName + "()");
      
    }
  });
  //为所有title绑定长按一秒拖拽事件
  var titleS = getEle(".title");
  addEvent(titleS, "mousedown", clickDownHandle);
  addEvent(titleS, "touchdown", clickDownHandle);
  function clickDownHandle(e){
    var curObj = e.target;
    var startTime = getCurTime();
    var timer = setInterval(function(){
      if(getCurTime()-startTime>1000){
        clearInterval(timer);
        drag(curObj.parentNode.parentNode.parentNode,curObj.parentNode);
      }
    },100);
  }
  function getCurTime(){
    return new Date().getTime();
  }
  //-------------------------------------------------------
  //对话框关闭按钮点击事件
  var closeBtns = document.getElementsByClassName("closeBtn");
  addEvent(closeBtns, "click", (e) => {
    var curObj =
      e.target.parentNode.parentNode.parentNode.parentNode.parentNode;
    if (curObj) {
      curObj.style.display = "none";
    }
  });
  //对话框取消按钮点击事件
  var cancelFinds = document.getElementsByClassName("cancelFind");
  addEvent(cancelFinds, "click", (e) => {
    // e.stopPropagation();
    e.preventDefault();
    var dialogName = getAttr(e.target, "data-dialog");
    var dialog = document.getElementsByClassName(dialogName)[0];
    if (dialog) {
      dialog.style.display = "none";
    }
  });
  //含有子菜单的选项事件函数
  var has_sub_menu = document.getElementsByClassName("has_sub_menu");
  addEvent(has_sub_menu, "click", has_sub_menu_handle);
  function has_sub_menu_handle(e) {
    e.stopPropagation();
    var cur_sub_menu = e.target.getElementsByClassName("subMenu")[0];

    var cur_sub_menu_dispaly = css(cur_sub_menu, "display");
    console.log(cur_sub_menu_dispaly);
    if (cur_sub_menu_dispaly == "block") {
      cur_sub_menu.style.display = "none";
    } else {
      cur_sub_menu.style.display = "block";
    }
  }
  //点击页面任意地方菜单栏隐藏
  function appHiddenMenu() {
    var app = document.getElementById("app");
    app.addEventListener("click", (e) => {
      var allMenu = document.getElementsByClassName("curMenu");
      for (var i = 0; i < allMenu.length; i++) {
        var cur = allMenu[i];
        var fn = (function (cur) {
          cur.style.display = "none";
        })(cur); //闭包
        setTimeout(fn, 210);
      }
    });
  }
  appHiddenMenu();
})();
//-------------------------------------------------------
//dialog事件处理函数
//无dialog窗事件处理函数
function view_footerInfo() {
  var footerInfo = document.getElementsByClassName("footerInfo")[0];
  var footerInfo_display = css(footerInfo, "display");
  var textarea = document.getElementsByTagName("textarea")[0];
  if (footerInfo_display == "none") {
    footerInfo.style.display = "block";
    textarea.style.height = "87.2909699%";
  } else {
    footerInfo.style.display = "none";
    textarea.style.height = "89%";
  }
}
function file_new() {
 
    if (confirm("是否保存当前文件!")) {
      file_save();
      return;
    }

  content = "";
  textarea.value = "";
}
//-------------------------------------------------------
//功能区func点击事件
//file_new
var func_file_new = document.getElementsByClassName("file_new")[0];
func_file_new.addEventListener("click", file_new);