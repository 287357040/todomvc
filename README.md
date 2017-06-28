参考了[todomvc]https://github.com/tastejs/todomvc 对于使用不同的库和框架来实现有了比较好的理解，自己也按照思路重新实现了遍

针对不同的框架的实现，谈谈理解个人理解

## jQuery库

浏览器文档加载完成后，引入app.js 开始自执行函数，先看看 app.js内容：
 
首先看到了使用的全局对象jQuery, Handlebars, Router，这里Handlebars, director(Router函数对象)两个库没有用到过，顺手查了下：Handlebars是前端的模板引擎，之前用过Juicer，功能也是类似；director是一个额路由框架，这个在angularjs和vue中都有类似的使用，不做过多描述。
        
整个文件封装了两个对象util, App; util没有什么好讲的，主要提供了两个工具方法uuid(生成todo的唯一标识符），store 提供了 localStrorage的读写api, 这边值得一提是的这个接口的设计，通过对arguments的个数判断来区分了读和写的逻辑，巧妙的实现了方法的重载。App：主要有以下几个函数initi、bindEvents和render。
        
1、 init
初始化todos变量，header和footer的模板compile变量用于加载数据后渲染，减少对dom节点的操作；通过Router来设置filter，默认显示所有的todo；最后调用bindEvents
       
2、bindEvents
说白了就是通过jQuery给dom元素绑定事件，所有的用户操作都是事件的触发原点，在这里定义好对应的响应事件进行处理，事件处理上可能要注意两个地方：事件冒泡的情况，对于事件的机制在此不做展开描述，还有就是没看到对事件做解绑动作，在实际项目里面可能会引发内存泄漏和重复触发的问题。
      
3、render
根据todos的数据来做做dom节点操作，有模板引擎的存在确实少了不少事。

在一些刚入门的同学在编码的时，如果没有封装的概念，往往会把所有的逻辑都写在一块，这样整体的代码结构会比较混乱，修改起来也麻烦。针对这个项目：先梳理功能需求，能较容易的抽离出来todo的模型，编码展开思路是做实现app初始化，绑定好用户需要的事件响应函数。再逐步的去完成具体细节编码，一些与视图操作无关的直接提取出来作为工具方法封装起来。
     
使用jQuery实现理解起来相对简单，但是还是从中学到了很多。


