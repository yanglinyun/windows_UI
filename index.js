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
      //无页面显示的功能
      eval(curDialogName + "()");
      //打勾
      var menu_item_actived = curObj.getElementsByClassName(
        "menu_item_actived"
      )[0];
      if (menu_item_actived) {
        var menu_item_actived_visibility = css(menu_item_actived, "visibility");
        menu_item_actived.style.visibility =
          menu_item_actived_visibility == "visible" ? "hidden" : "visible";
      }
    }
  });
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
//游戏逻辑
var historyScore = [];
var mineCount = 10; //炸弹个数==旗数
var flagCount = mineCount; //旗数
var gameTime = 0; //游戏时间
var cols = 10; //列
var rows = 10; //行
var total = cols * rows;
var mineMap = []; //{row:行,col:列};炸弹位置信息
var checkBorad = getEle(".checkBoard")[0];
var curFindMines = 0;
var color = [
  "black",
  "blue",
  "yellow",
  "red",
  "skyblue",
  "blue",
  "red",
  "orange",
  "red",
  "red",
  "red",
];
var timer = "";
function init() {
  setMine();
  setBlocks();
  update_Rest_Flag();
  //为方块绑定鼠标 左 点击事件
  addEvent(getEle(".block"), "click", clickHandle);
  document.oncontextmenu = rightClickHandle;
  getEle(".smile")[0].innerHTML = `<span class="iconfont">&#xe627;</span>`; //笑脸变哭脸
  timer = setInterval(() => {
    gameTime++;
    update_game_time();
  }, 1000);
}
function success_or_failed() {
  clearInterval(timer);
}
function replay() {
  success_or_failed();
  mineCount = 10; //炸弹个数==旗数
  flagCount = mineCount; //旗数
  gameTime = 0; //游戏时间
  cols = 10; //列
  rows = 10; //行
  total = cols * rows;
  mineMap = []; //{row:行,col:列};炸弹位置信息
  checkBorad.innerHTML = "";
  curFindMines = 0;
  timer = "";
  update_game_time();
  update_Rest_Flag();
  init();
}
function clickHandle(e) {
  if (e.button == 0) {
    leftClickHandle(e);
  }
}
//左点击事件
function leftClickHandle(e) {
  var curObj = e.target;
  var isChecked = curObj.classList.contains("checked");
  var isMine = curObj.classList.contains("isMine");
  if (isChecked) {
    //已经被点击退出
    return;
  }
  var hasFlag = curObj.classList.contains("flag");
  if (hasFlag) {
    //有旗帜
    curObj.classList.remove("flag");
    curObj.innerHTML = ``;
    flagCount++;
    if (isMine) {
      curFindMines--; //已找到炸弹数-1
    }
  }
  //加checked
  if (isMine) {
    var allMinesBlock = getEle(".isMine");
    for (var i = 0; i < allMinesBlock.length; i++) {
      allMinesBlock[i].innerHTML = `<span class="iconfont">&#xe705;</span>`;
    }
    getEle(".smile")[0].innerHTML = `<span class="iconfont">&#xe758;</span>`; //笑脸变哭脸
    success_or_failed();
    alert("gameover!");
    if (confirm("重新开始吗?")) {
      replay();
    }
    return;
  } else {
    curObj.classList.add("checked");
    getNearMinesCount(curObj);
  }
}
function getNearMinesCount(obj) {
  var posArr = getAttr(obj, "data-pos").split("-");
  var row = parseInt(posArr[0]);
  var col = parseInt(posArr[1]);

  var nearMinesCount = 0;
  for (var i = row - 1; i <= row + 1; i++) {
    for (var j = col - 1; j <= col + 1; j++) {
      var curNearObj = getEle(`#id${i}-${j}`);
      if (curNearObj) {
        if (curNearObj.classList.contains("isMine")) {
          nearMinesCount++;
        }
      }
    }
  }
  //写入附近雷个数
  obj.innerText = nearMinesCount;
  obj.style.color = color[nearMinesCount];
  if (nearMinesCount == 0) {
    for (var i = row - 1; i <= row + 1; i++) {
      for (var j = col - 1; j <= col + 1; j++) {
        var curNearBlock = getEle(`#id${i}-${j}`);
        if (curNearBlock) {
          curNearBlock.click(); //递归
        }
      }
    }
  }
}
//右点击事件
function rightClickHandle(e) {
  e.returnValue = false; //禁用右键菜单
  var curObj = e.target;
  //如果已经被左击选中checked就退出
  if (curObj.classList.contains("checked")) {
    return;
  }
  var isMine = curObj.classList.contains("isMine");
  if (curObj.classList.contains("flag")) {
    curObj.classList.remove("flag");
    curObj.innerHTML = ``;
    update_Rest_Flag("+");
    if (isMine) {
      curFindMines--; //已找到炸弹数-1
    }
  } else {
    if (!update_Rest_Flag("-")) {
      return;
    }
    curObj.classList.add("flag");
    curObj.innerHTML = `<span class="iconfont">&#xe732;</span>`;

    if (isMine) {
      curFindMines++; //已找到炸弹数-1
    }
    if (curFindMines == mineCount) {
      //所有雷找到
      success_or_failed();
      var successDialog = document.getElementsByClassName("success")[0];
      successDialog.style.display = "block";
      historyScore.push(gameTime);
      if (confirm("重新开始吗?")) {
        successDialog.style.display = "none";
        replay();
      }
      return;
    }
  }
}
//依据炸弹位置生成方块
function setBlocks() {
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
      var block =
        `<div class="block ` +
        (isMine(i, j) ? "isMine" : "") +
        `" id="id${i}-${j}" data-pos="${i}-${j}"></div>`;
      checkBorad.innerHTML += block;
    }
  }
}
//是否为炸弹
function isMine(row, col) {
  for (var i = 0; i < mineMap.length; i++) {
    var curMine = mineMap[i];
    if (row == curMine.row && col == curMine.col) {
      return true;
    }
  }
  return false;
}
//随机设置炸弹位置
function setMine() {
  var tempMines = [];
  while (mineCount) {
    var tempRand = Math.round(Math.random() * total); //[0-100]
    if (tempMines.indexOf(tempRand) == -1) {
      tempMines.push(tempRand);
      mineCount--;
    }
  }
  mineCount = tempMines.length;
  for (var i = 0; i < mineCount; i++) {
    mineMap.push({ row: parseInt(tempMines[i] / 10), col: tempMines[i] % 10 });
  }
}
function update_Rest_Flag(direction) {
  //+/-
  if (direction == "-") {
    if (flagCount - 1 < 0) {
      alert("沒有旗帜了!");
      return false;
    } else {
      flagCount--;
    }
  } else if (direction == "+") {
    flagCount++;
  }
  getEle(".rest_flag")[0].innerText =
    flagCount < 10 ? "0" + flagCount : flagCount;
  return true;
}
function update_game_time() {
  getEle(".game_time")[0].innerText = gameTime < 10 ? "0" + gameTime : gameTime;
}

//-------------------------------------------------------
//dialog事件处理函数
function game_history_score() {
  historyScore = bubbleSort(historyScore);
  var list = getEle(".scoreList")[0];
  list.innerHTML = `<ol>`;
  for (var i = 0; i < historyScore.length; i++) {
    list.innerHTML += `<li>${historyScore[i]}</li>`;
  }
  list.innerHTML += `<ol>`;
}
function bubbleSort(arr) {
  for (var i = 0; i < arr.length - 1; i++) {
    var isSwap = false;
    for (var j = 0; j < arr.length - 1 - i; j++) {
      if (arr[j] < arr[j + 1]) {
        var temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        isSwap = true;
      }
    }
    if (!isSwap) {
      break;
    }
  }
  return arr;
}
//-------------------------------------------------------
//功能区func点击事件
function game_new() {
  if (timer != "") {
    replay();
  } else {
    init();
  }
}
function game_close() {
  if (confirm("是否离开")) {
    window.opener = null;
    window.open("", "_self");
    window.close();
  }
}
function game_pause() {
  if (timer != "") {
    clearInterval(timer);
    timer = "";
    alert("暂停,休息一下!");
  } else if (getEle(".block").length > 0) {
    alert("继续扫雷!");
    timer = setInterval(() => {
      gameTime++;
      update_game_time();
    }, 1000);
  }
}
