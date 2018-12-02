/**
 * 关于时间的一些函数
 */
class ThreadHelper {

    static async sleep(time) {
       return await  new Promise((a, r) => {
            if (time && time > 0) {
                setTimeout(() => a('ok'), time);
            }
            else{
                a('ok');
            }
        })
    }
}