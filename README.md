# protocol compiler

Protocol compiler 是一款与语言、平台无关的协议编译器，根据协议描述文件生成文档、测试、各语言代码等，也可以生成 Protocol Buffers/Thrift 等代码。

```
message ScMessage Sc表示server to client, 同理 Cs 表示 Client to server
	required bool	success	1	是否成功
	optional int32	errno	2	=0	错误码，@{ERR_USER_NOT_EXIST, ERR_SYSTEM}
	optional string error	3	错误内容

message Person
	required int32	id		1	用户ID
	required string	name	2	用户名字
	required string email	3	用户的邮箱，必须是邮箱格式，例如：\
		abc@ef.com

message CsPersonGet
	required int32	id	1	用户ID
	
message ScPersonGet:ScMessage	ScPersonGet 继承了 ScMessage
	repeated Person persons	4	用户列表

service person 定义 person 接口
	get	CsPersonGet @ScPersonGet
```

生成后，在客户端的java里这样用：

```java
CsPersonGet in = new CsPersonGet();
in.id = 1;

// 请求 person 接口
PersonService.get(in, new ServiceCallback<ScPersonGet> {
	pulib void onSuccess(ScPersonGet out) {
		if (!out.success) return ;
		
		for (Person p:out.persons) {
			// do something
		}
	}
});
```

在服务端的 PHP 中这样用：
```PHP
$param = CsPersonGet.parse($HTTP_RAW_POST_DATA);
$id = $param->id;
...

$data = new ScPersonGet();
$data->success = true;

$person = new Person(); // 没有这一行也可以，数组也是可以的。field 可以通过数组形式访问，同时数组也可以替代对象
$person['id'] = 1;
$person['name'] = 'Eachcan';
$person['age'] = 3;
$data->persons[] = $person;

output($data);
```

其他语言的应用，请参考文档

## 安装

```shell
$ sudo npm install -g protoc

## 使用

## 语法

## 配置

## 扩展