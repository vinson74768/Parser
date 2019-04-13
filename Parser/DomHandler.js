function DomHandler(style,options) {
  this._style = ParseClass(style);
  this.imgList = [];
  this.dom = [];
  this._preview = options ? options.preview : true;
  this._selectable = options ? options.selectable : true;
  this._done = false;
  this._tagStack = [];
  this._parser = this._parser || null;
}

function ParseClass(style) {
  var res = [];
  if (style) {
    var classes = style.match(/[\.\#].+?[\.\#]*.*?\{.*?\}/g);
    if (classes) {
      for (var item of classes) {
        var id = item.match(/\#(\S+?)[\.\#\{]/);
        if (id) id = id[1];
        var Class = item.match(/\.(\S+?)[\.\#\{]/);
        if (Class) Class = Class[1];
        var styles = item.match(/\{([\s\S]*?)\}/)[1].replace(/\s/, '');
        res.push({
          'id': id,
          'class': Class,
          'content': styles
        });
      }
    }
  }
  return res;
}

DomHandler.prototype.onparserinit = function(parser) {
  this._parser = parser;
};

DomHandler.prototype.onreset = function() {
  DomHandler.call(this, this._callback, this._options, this._elementCB);
};

DomHandler.prototype.onend = function() {
  if (this._done) return;
  this._done = true;
  this._parser = null;
};

DomHandler.prototype.onclosetag = function(name) {
  if ((name == 'img'&&this._preview) || name == 'video' || (name == 'a'&&this._selectable)) {
    for (var item of this._tagStack) {
      item.continue = true;
    }
  }
  if (name != 'html' && name != 'body') {
    this._tagStack.pop();
  }
};

DomHandler.prototype._addDomElement = function(element) {
  var parent = this._tagStack[this._tagStack.length - 1];
  var siblings = parent ? parent.children : this.dom;
  siblings.push(element);
};

DomHandler.prototype.onopentag = function(name, attrs) {
  var properties = {
    name: name,
    attrs: attrs,
    children: []
  };
  if (this._style && (properties.attrs.id || properties.attrs.class)) {
    for (var item of this._style) {
      if (properties.attrs.id === item.id || properties.attrs.class === item.class) {
        if (!properties.attrs.style) properties.attrs.style = '';
        properties.attrs.style += item.content;
      }
    }
  }
  if (name === 'img') {
    this.imgList.push(properties.attrs.src);
    if (!properties.attrs.style) properties.attrs.style = '';
    properties.attrs.style += ';max-width:100%;';
  } else if (name == 'section') properties.name = 'div';
  else if (name == 'font') {
    properties.name = 'label';
    if (!properties.attrs.style) properties.attrs.style = '';
    if (properties.attrs.color) properties.attrs.style += (';color:' + properties.attrs.color);
    if (properties.attrs.face) properties.attrs.style += (';font-family:' + properties.attrs.falce);
  }else if(name=='a'){
    if (!properties.attrs.style) properties.attrs.style = '';
    properties.attrs.style +=';text-decoration: underline;color:#0000ff';
  }
  if (name != 'html' && name != 'body') {
    var element = properties;
    this._addDomElement(element);
    this._tagStack.push(element);
  }
};

DomHandler.prototype.ontext = function(data) {
  var lastTag;
  if (!this._tagStack.length && this.dom.length && (lastTag = this.dom[this.dom.length - 1]).type === 'text') {
    lastTag.data += data;
  } else {
    if (
      this._tagStack.length &&
      (lastTag = this._tagStack[this._tagStack.length - 1]) &&
      (lastTag = lastTag.children[lastTag.children.length - 1]) &&
      lastTag.type === 'text'
    ) {
      lastTag.data += data;
    } else {
      var element = {
        text: data,
        type: 'text'
      };
      this._addDomElement(element);
    }
  }
};

module.exports = DomHandler;