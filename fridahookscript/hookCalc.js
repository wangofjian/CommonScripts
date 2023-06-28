var allKeys = {};

Java.perform(function () {
    var cipher = Java.use("javax.crypto.Cipher");


    for (let index = 0; index < cipher.init.overloads.length; index++) {
        cipher.init.overloads[index].implementation = function () {
            allKeys[this.toString()] = arguments[1].getEncoded();
            this.init.apply(this, arguments);
        }
    }

    for (let index = 0; index < cipher.doFinal.overloads.length; index++) {
        cipher.doFinal.overloads[index].implementation = function () {
            var dict = {};

            dict["EorD"] = this.opmode.value; //模式 加密解密
            dict["method"] = this.transformation.value; //加密类型
            var iv =  this.spi.value.engineGetIV();
            if (iv){
                dict["iv"] = iv;
            }else{
                dict["iv"] = "";
            }
            if (allKeys[this.toString()]){
                dict["password"] = allKeys[this.toString()]
            }else{
                dict["password"] = "";
            }
            var retVal = this.doFinal.apply(this, arguments);
            dict["receData"] = "";
            dict["resData"] = "";
            if (arguments.length >= 1 && arguments[0].$className != "java.nio.ByteBuffer") {
                dict['receData'] = arguments[0];
                dict["resData"] = retVal;
            }
            send(dict);
            return retVal;
        }
    }
})

