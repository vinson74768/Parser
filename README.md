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
  在`rich-text`组件的基础上增加支持以下标签: 
  
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
  ``` html
  <img width="50px" src="img1.png" />
  <br />
  <img src="img2.jpg" />
  ```
  
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
    2. `object`类型：一个形如`{ nodes:[],imgList:[] }`的结构体，其中nodes数组的格式同[rich-text](https://developers.weixin.qq.com/miniprogram/dev/component/rich-text.html), imgList为其中所有图片地址的数组（回调函数`bindparser`的返回值就是这样的结构体）
    3. `array`类型：格式要求同[rich-text](https://developers.weixin.qq.com/miniprogram/dev/component/rich-text.html)（用此格式传入预览图片时，将`不能`通过左右滑动查看所有图片）  
    4. 使用b, c方法可以节省解析的时间，提高性能
  - space格式（同[rich-text](https://developers.weixin.qq.com/miniprogram/dev/component/rich-text.html)）：
    
    | 值 | 说明 |
    |:----:|:----:|
    | ensp | 中文字符空格一半大小 |
    | emsp | 中文字符空格大小 |
    | nbsp | 根据字体设置的空格大小 |  
  - 回调函数
  
    | 名称 | 功能 | 说明 |
    |:----:|:----:|:----:|
    | bindparser | 在解析完成时调用（仅当传入的html为`字符串`时会调用） | 返回一个`object`, 其中`nodes`为解析后的节点数组， `imgList`为图片列表，该object可以在下次调用直接作为html属性的值，节省解析的时间  
    
## 原理简介 ##
  该插件结合了`WxParse`中模板循环的方式和`rich-text`组件，对于节点下有`img`, `video`, `a`标签的，使用模板循环的方式显示，否则直接通过`rich-text`组件显示，这样既解决了`WxParse`中过多的标签数（`rich-text`可以节省大量的标签），层数容易不够（对于大于20层的直接用`rich-text`解析，理论上可以显示无限层级），无法解析表格，一些组件显示格式不正确（`rich-text`可以解析出更好的效果）等缺点；也弥补了`rich-text`图片无法预览，无法显示视频，无法复制链接，部分标签不支持（在解析过程中进行替换）等缺点，另外该解析脚本还减小了包的大小，提高了解析效率，通过包装成一个自定义组件，简单易用且功能强大。
