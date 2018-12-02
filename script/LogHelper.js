/*
* 日志记录工具帮助类
* */
 class LogHelper {
    /**
     * 输出基本日志
     * @param msg
     */
    log(msg) {
        console.log(msg);
    }

    /**
     * 输出错误日志
     * @param msg
     */
    error(msg) {
        console.log(msg);
    }

    /**
     * 输出警告错误
     * @param msg
     */

    warn(msg) {
        console.log(msg);
    }

    /**
     * 清除日志信息
     */
    clear() {
        console.clear();
    }
}
