---
title: MySQL基本语句必知必会
date: 2022-10-18 19:37:59
tags: MySql
categories: MySql
index_img: 
---

### 前言

> 此内容为笔者自己总结的，最初的MySql语句的用法和细节
>
> 部分简单语句可能会无语法说明

#### 全局解释

 `[]`表示该部分内容是可选的

### 1.表的创建

----------

#### 创建新表

```mysql
CREATE [TEMPORARY] TABLE [IF NOT EXISTS] table_name
[([column_definition], [index_definition])]
[table_option][select_statement]
```

#### 语法说明

+ `TEMPORARY`表示创建临时表
+ `IF NOT EXISTS`表示不存在则创建新表
+ `table_name`表示表的名字
+ `column_definition`字段定义，包括数据类型，字段名，是否允许为空等

----------

#### 显示表

```mysql
SHOW TABLES #显示数据库中的所有表
DESCRIBE table_name #显示某一个表的结构
```

---------

#### 修改表

```mysql
ALTER TABLE <旧表名> RENAME [TO] <新表名> #修改表名
ALTER TABLE <表名> MODIFY <字段名><数据类型> #修改某字段的数据类型
ALTER TABLE <表名> CHANGE <旧字段名><新字段名><新数据类型> #修改字段名
ALTER TABLE <表名> ADD <新字段名><数据类型> [约束条件] #添加字段
ALTER TABLE <表名> DROP <字段名> #删除字段
ALTER TABLE <表名> DROP FOREIGN KEY <外键约束名> #删除外键约束
```

---------

#### 复制表

```mysql
CREATE [TEMPORARY] TABLE [IF NOT EXISTS] table_name
[LIKE old_table_name[]]
[AS (selece_statement)]
```

--------------

#### 删除表

```mysql
DROP TABLE [IF EXISTS] table_name
```

------

### 2.数据管理
