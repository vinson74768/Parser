# Parser
微信小程序富文本插件
## 功能介绍 ##
- 支持解析`<style>`标签中的全局样式（.和#两种方式）  
	示例：
	``` html
	<style>
	.demo1{
	 text-align:center;
	}
	#demo2{
	 color:blue;
	}
	</style>
	<div class="demo1">
	 <label>Hello </label>
	 <label id="demo2">World!</label>
	</div>
	```
  ![解析style](http://bmob-cdn-17111.b0.upaiyun.com/2019/04/13/770976cd40270fb380ba92d3c81488e8.png)  

- 支持的标签种类丰富，包括`视频`、`表格`等  
  在[`rich-text`组件的基础](https://developers.weixin.qq.com/miniprogram/dev/component/rich-text.html)上增加支持以下标签: 
  
  | 标签 | 属性 |
  |:---:|:---:|
  | video | src, controls, height, width |
  | font | face, color |
  | style |  |
  | section |  |
  | html |  |
  | body |  |
  
  示例：  
  ![解析表格](http://bmob-cdn-17111.b0.upaiyun.com/2019/04/13/855521fe405e606d8028f4c64fc92fdb.png)  
  ![解析图文](http://bmob-cdn-17111.b0.upaiyun.com/2019/04/13/3b4dccdd40c90ab380b6ecdf1b53a0a0.png)  

- 图片支持大小自适应，点击图片可以预览（预览时通过左右滑动可以查看所有图片）
  
- 长按`a`标签可以复制链接（小程序不能直接打开外链，可以复制链接并通过浏览器打开）
  ``` html
  <a href="https://github.com">长按复制链接</a>
  ```
  示例：  
  ![解析a标签](http://bmob-cdn-17111.b0.upaiyun.com/2019/04/13/83deb63b405ee190806d312088cc60b1.png)
 
- 容错性强，稳定性高，不需要网络请求  
  以下情况都可以正常解析：
  ``` html
  <!--冒号不匹配-->
  <div style="font-family:"宋体";text-align:center;">Hello</div>
  <!--标签首尾不匹配-->
  <div> World</label>
  <!--缺少尾标签-->
  <div>!
  ```  
 
- 功能强大，支持无限层级，解析速度快，包大小仅约`40KB`  
## 使用方法 ##
<<<<<<< HEAD
[代码片段](https://developers.weixin.qq.com/s/GqglRBmS7r7O)
=======
[代码片段](https://developers.weixin.qq.com/s/u9pVxBmh7N7H)
>>>>>>> 111d5a3e2042dac3b3a7f31619b5d4ebcd20337e
1. 下载Parser文件夹至小程序目录  
   ![目录结构](http://bmob-cdn-17111.b0.upaiyun.com/2019/04/13/3ba7b37540c9e34c80eb97bbf9d8099b.png)
2. 在需要引用的页面的`json`文件中添加
   ``` json
   {
     "usingComponents": {
       "Parser":"../Parser/index"
     }
   }
   ```
3. 在需要引用的页面的`wxml`文件中添加  
   ``` html
   <Parser html="{{html}}" bindparser="parser" />
   ```
4. 在需要引用的页面的`js`文件中添加  
   ``` javascript
   onLoad:function(){
     this.setData({
       html:'your html'
     })
   },
   parser:function(e){
     console.log(e);
   }
   ```
- 组件属性：  

  | 属性 | 类型 | 默认值 | 必填 | 说明 |
  |:----:|:----:|:----:|:----:|:----:|
  | html | String/Object/Array | | 是 | 要显示的富文本数据，具体格式见下方说明 |
  | space | String/Boolean | false | 否 | 是否显示连续空格，合法输入值见下方说明 |
  | selectable | Boolean | true | 否 | 是否允许长按复制a标签连接 |
  | preview | Boolean | true | 否 | 是否允许预览图片 |
  
  - html格式：
    1. `string`类型：一个`html`字符串，例如：`<div>Hello World!</div>`
    2. `object`类型：一个形如`{ nodes:[Array],imgList:[Array] }`的结构体，其中nodes数组的格式同[rich-text](https://developers.weixin.qq.com/miniprogram/dev/component/rich-text.html), imgList为其中所有图片地址的数组（回调函数`bindparser`的返回值就是这样的结构体）
    3. `array`类型：格式要求同[rich-text](https://developers.weixin.qq.com/miniprogram/dev/component/rich-text.html)（用此格式传入预览图片时，将`不能`通过左右滑动查看所有图片）  
    4. 使用b, c方法可以节省解析的时间，提高性能
  - space格式（同[rich-text](https://developers.weixin.qq.com/miniprogram/dev/component/rich-text.html)）：
    
    | 值 | 说明 |
    |:----:|:----:|
    | ensp | 中文字符空格一半大小 |
    | emsp | 中文字符空格大小 |
    | nbsp | 根据字体设置的空格大小 |  
  - 关于preview  
    &emsp;&emsp;该属性为`true`时，是通过模板的循环解析实现图片的预览，这可能导致在排版较为复杂（如左右排布）等时显示不出正确的效果，此时可以将该属性设置为`{{false}}`，插件会直接用`rich-text`组件渲染，能达到更好的排版效果。
  - 回调函数
  
    | 名称 | 功能 | 说明 |
    |:----:|:----:|:----:|
    | bindparser | 在解析完成时调用（仅当传入的html为`字符串`时会调用） | 返回一个`object`, 其中`nodes`为解析后的节点数组， `imgList`为图片列表，该object可以在下次调用直接作为html属性的值，节省解析的时间  
## 后端解析 ##
为提高页面性能，可以在服务器端提前解析好`html`，该插件同样可以在`node.js`中使用（只需要`DomHandler.js`, `Parser.js`, `Tokenizer.js`即可）  
具有的功能：
1. 删除`script`, `head`, `html`, `body`, 注释等无用的标签
2. 将`style`标签中的样式解析到各标签的`style`中，例如：
``` javascript
const Parser=require('./Parser.js');
var html='<style>.demo{text-align:center}</style><div class="demo">Hello World!</div>';
Parser(html).then(function(e){
  console.log(e)
})

```
``` json
{ 
  "nodes": [{ 
    "name": "div", 
    "attrs": {
      "class": "demo",
      "style": "text-align:center"
    }, 
    "children": [{ 
      "text": "Hello World!", 
      "type": "text" 
    }] 
  }],
  "imgList": [] 
}
```
3. 在`img`标签的`style`中添加`max-width:100%;`，实现宽度自适应
4. 将`section`标签用`div`取代
5. 将`font`标签用`label`取代，并将`face`, `color`属性解析到`style`中
6. 将`a`标签的`style`中添加`text-decoration: underline;color:#0000ff;`
6. 对于该节点下含有`a`, `img`（`preview`为`true`时）, `video`标签的，`continue`的值会被设置为`true`（用于前端显示）
7. 解析完成将返回一个形如`{ nodes:[Array], imgList:[Array] }`结构体,其中`nodes`数组可以直接应用于`rich-text`组件，整个结构体可以直接作为`Parser`组件的参数

## 原理简介 ##
&emsp;&emsp;该插件结合了`WxParse`中模板循环的方式和`rich-text`组件，对于节点下有`img`, `video`, `a`标签的，使用模板循环的方式显示，否则直接通过`rich-text`组件显示，这样既解决了`WxParse`中过多的标签数（`rich-text`可以节省大量的标签），层数容易不够（对于大于20层的直接用`rich-text`解析，理论上可以显示无限层级），无法解析表格，一些组件显示格式不正确（`rich-text`可以解析出更好的效果）等缺点；也弥补了`rich-text`图片无法预览，无法显示视频，无法复制链接，部分标签不支持（在解析过程中进行替换）等缺点，另外该解析脚本还减小了包的大小，提高了解析效率，通过包装成一个自定义组件，简单易用且功能强大。
