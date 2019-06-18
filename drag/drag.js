+(function(w) {
  var drag = new Function();
  drag.prototype.init = function(id) {
    var dragContainer = document.getElementById(id);
    if (!dragContainer) throw new Error('通过id' + id + '获取元素失败');
    dragContainer.style.position = 'relative';

    var drag = dragContainer.children;
    var dragArray = Array.prototype.slice.call(drag);
    dragArray.forEach(function(item) {
      item.setAttribute('draggable', 'true');
    });
    this.dragContainer = dragContainer;
    this.dragArray = dragArray;
    this.bindListener();
    return this;
  };
  drag.prototype.bindListener = function() {
    var _self = this;
    this.dragContainer.addEventListener('dragenter', function(event) {
      var offsetPool = [];
      _self.dragArray.forEach(function(item) {
        offsetPool.push(item.offsetTop);
      });
      const targetIndex = offsetPool.indexOf(event.target.offsetTop);
      _self.targetIndex = targetIndex;
    });
    this.dragContainer.addEventListener('dragend', function(event) {
      event.preventDefault();
      // console.log(_self.targetIndex, 'targetIndex', _self.dragIndex);
      this.innerHTML = '';
      // 交换位置
      var arr = _self.dragArray;
      var temp = arr[_self.targetIndex];
      arr[_self.targetIndex] = arr[_self.dragIndex];
      arr[_self.dragIndex] = temp;
      // 重新生成
      arr.forEach(function(item) {
        _self.dragContainer.appendChild(item);
      });
      // 重新绑定事件
      _self.bindListListener();
    });
    _self.bindListListener();
  };
  drag.prototype.bindListListener = function() {
    var _self = this;
    _self.dragArray &&
      _self.dragArray.forEach(function(dragItem, index) {
        _self.registerEvent(dragItem, 'dragstart', function() {
          _self.dragIndex = index;
        });
      });
  };
  /*
   * 事件注册 Event registration
   * @param Element     ele
   * @param String      eventType
   * @param Function    fn
   * @param Boolean     isRepeat
   * @param Boolean     isCaptureCatch
   * @return undefined
   */
  drag.prototype.registerEvent = function(
    ele,
    eventType,
    fn,
    isRepeat,
    isCaptureCatch
  ) {
    if (ele == undefined || eventType === undefined || fn === undefined) {
      throw new Error('传入的参数错误！');
    }

    if (typeof ele !== 'object') {
      throw new TypeError('不是对象！');
    }

    if (typeof eventType !== 'string') {
      throw new TypeError('事件类型错误！');
    }

    if (typeof fn !== 'function') {
      throw new TypeError('fn 不是函数！');
    }

    if (isCaptureCatch === undefined || typeof isCaptureCatch !== 'boolean') {
      isCaptureCatch = false;
    }

    if (isRepeat === undefined || typeof isRepeat !== 'boolean') {
      isRepeat = true;
    }

    if (ele.eventList === undefined) {
      ele.eventList = {};
    }

    if (isRepeat === false) {
      for (var key in ele.eventList) {
        if (key === eventType) {
          return '已绑定过同类事件';
        }
      }
    }
    // 添加事件监听
    if (ele.addEventListener) {
      ele.addEventListener(eventType, fn, isCaptureCatch);
    } else if (ele.attachEvent) {
      ele.attachEvent('on' + eventType, fn);
    } else {
      return false;
    }
    ele.eventList[eventType] = true;
  };
  w.Drag = drag;
})(window);
