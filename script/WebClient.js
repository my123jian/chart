/**
 * 客户端数据访问类
 */

class WebClient {
    constructor() {
        this.log = new LogHelper();
    }

    async load(url, argument) {
        this.log.log(url);
        return await  fetch(url);
    }
}