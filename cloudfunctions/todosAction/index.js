// 云函数入口文件
const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
    // API 调用都保持和云函数当前所在环境一致
    env: cloud.DYNAMIC_CURRENT_ENV
})
// 创建实例
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
    const _type = event._type;

    if (_type === 'getAll') {
        return db.collection('todos').get();
    } else if (_type === 'getSome') {
        return db.collection('todos').where({
            done: event.done
        }).get();
    } else if (_type === 'addTodo'){
        return db.collection('todos').add({
            data: {
                name: event.name,
                done: event.done
            }
        })
    }else if(_type === 'removeTodo'){
        return db.collection('todos').doc(event.id).remove()
    } else if (_type === 'editTodo'){
        return db.collection('todos').doc(event.id).update({
            data:{
                done: event.done
            }
        })
    }
}