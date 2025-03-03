# 管理员API

#### 管理员登录
* url:      /manager/login
* method:   post
* header :

| 名称 |类型| 是否必须 | 默认值 | 描述 | 
| :------:| :------:| :------: | :------: | :------: |
| lang | string | 否 | en-US | 语言 |

* 参数 :

| 名称 |类型| 是否必须 | 默认值 | 描述 | 
| :------: | :------: | :------: | :------: | :------: |
| managerNo | string | 是 | 无 | 管理员工号或者用户名 |
| password | string | 是 | 无 | 密码 |

* 错误码 :

| code |message| 
| :------:| :------:| 
| 3000 | 管理员不存在 | 
| 3001 | 密码错误 |

* 返回值
  
| key |desc| 
| :------:| :------:| 
| managerId | 管理员ID | 
| managerName | 管理员用户名 |
| managerNo | 管理员工号 |
| phone | 管理员电话 |
| token | token |

---

#### 管理员获取预定列表
* url:      /manager/reservationList
* method:   get
* header :

| 名称 |类型| 是否必须 | 默认值 | 描述 | 
| :------:| :------:| :------: | :------: | :------: |
| lang | string | 否 | en-US | 语言 |
| token | string | 是 | 无 | 登录token |

* 参数 :

| 名称 |类型| 是否必须 | 默认值 | 描述 | 
| :------: | :------: | :------: | :------: | :------: |
| keyword | string | 否 | 无 | 用户名、电话或者email |
| status | int | 否 | 无 | 状态码 -1:已取消 0:已预定 1:已完成 |

* 错误码 :
---
#### 管理员修改预定
* url:      /manager/updateReservation
* method:   post
* header :

| 名称 |类型| 是否必须 | 默认值 | 描述 | 
| :------:| :------:| :------: | :------: | :------: |
| lang | string | 否 | en-US | 语言 |
| token | string | 是 | 无 | 登录token |

* 参数 :

| 名称 |类型| 是否必须 | 默认值 | 描述 | 
| :------: | :------: | :------: | :------: | :------: |
| reservationId | int | 是 | 无 | 预定id |
| arrivalTime | string | 是 | 无 | 到达日期(格式:2025-03-01) |
| tableSize | int | 是 | 无 | 数量 |
| status | int | 是 | 无 | 状态码 -1:已取消 0:已预定 1:已完成 |

* 错误码 :

| code |message| 
| :------:| :------:| 
| 3003 | 预定信息不存在 | 
---

#### 管理员获取用户列表
* url:      /manager/guestList
* method:   get
* header :

| 名称 |类型| 是否必须 | 默认值 | 描述 | 
| :------:| :------:| :------: | :------: | :------: |
| lang | string | 否 | en-US | 语言 |
| token | string | 是 | 无 | 登录token |

* 参数 :

| 名称 |类型| 是否必须 | 默认值 | 描述 | 
| :------: | :------: | :------: | :------: | :------: |
| keyword | string | 否 | 无 | 用户名称、电话或者email |
---
