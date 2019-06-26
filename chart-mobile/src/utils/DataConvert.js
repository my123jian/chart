export default {
    name: 'DataConvert',

    /**
     *
     * @param datas
     * @param keyname
     * @param valuename
     * @param keyMap
     * @returns {{x: Array, y: Array}}
     */
    convertData(datas, keyname, valuename, keyMap) {
        var theX = [];
        var theY = [];
        if (datas) {
            datas.forEach(m => {
                if (keyMap) {
                    theX.push(keyMap[m[keyname]]);
                }
                else {
                    theX.push(m[keyname]);
                }

                theY.push(m[valuename]);
            });
        }
        return {
            x: theX,
            y: theY
        }

    }
};