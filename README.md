# 概述
这是一个对**[juzi8](http://www.juzi8.com/)**网站的爬虫项目,主要的过程就是解析网页，发现新的待解析网页的网址，存储解析结果到**mongodb**数据库。

# 项目启动
## 必需环境
1. nodejs环境
2. 安装mongodb数据库
3. git

## 数据库设置
[Mac]
1. 安装mongodb数据库，`brew install mongodb`
2. 新建数据库文件夹 `mkdir ~/mongodb/db`
3. 启动mongodb服务，`mongod --dbpath ~/mongodb/db`
4. 添加数据库用户，启动`mongo`,新建数据库`switch juzi8`， 然后使用`db.createUser()`方法新建用户，参考地址[db.createUser() &mdash; MongoDB Manual](https://docs.mongodb.com/manual/reference/method/db.createUser/index.html)，新建用户的信息与config/db.json下的信息保持一致。

## 启动
1. `git clone https://github.com/Southhill/spider-juzi8.git && cd spider-juzi8`
2. `npm i --registry=https://registry.npm.taobao.org`
3. `node start`

# 开发遇到的问题
1. 最困扰我的问题是我知道爬虫的入口网址，后面的网址要爬到页面后才能解析并发现，页面爬取是一个异步的过程，所以我要怎样让爬虫解析完网址后自动爬取其他页面，同步代码必然是失败的，异步代码的思路是：先爬取网页，解析网页，存储，发现新的网址，然后开始爬取新网址，直到再没有新发现的网址；一个串联的思路（当然也可以一次爬取所有发现的网址，但整体而言是串联的过程）。因此如果按这个思路是不能用到`for, while`语言功能的。也只能如此，具体思路可查看代码库。

2. 我要如何处理程序状态，也即全局变量，现在的做法是直接将必要的变量挂载到`global`对象上。当然，这个项目的全局变量只有5,6个而已，但总感觉这样写不优雅。

3. 我之前一直以为`class`类在实例化的`constructor`过程中可以使用其原型方法的，结果报错，之后仔细思考过程，感觉我的想法是错误的，个人认为类的实例化应该是：先运行`constructor`函数中的内容，然后返回`this`对象，之后在`this`对象上挂载其原型的方法，因此类在实例化的`constructor`过程中是不能使用其原型方法的。

4. 项目添加了日志记录的功能，使用的是`log4js`模块，在进行配置`log.js`的时候, 发现日志不能记录到相应的文件下，后来发现`appenders`对象下的`filename`属性的值是相对于整个项目目录，而不是配置文件所在目录。

# 其他
考虑到juzi8网站的小众，项目之后的代码没有添加同一时间爬取多个网页的功能，不然就有恶意请求服务的味道了。
