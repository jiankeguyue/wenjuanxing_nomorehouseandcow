// ==UserScript==
// @name         问卷星不再牛马地刷！！！
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  批量问卷星刷题，支持多种题型
// @author       yueji0j1anke
// @match        https://www.wjx.cn/*
// @icon         https://gitee.com/yuejinjianke/tuchuang/raw/master/image/image-20240212215352949.png
// @license      MIT
// @grant        none
// @homepageURL  https://github.com/jiankeguyue/wenjuanxing_nomorehouseandcow
// ==/UserScript==

(function() {
    'use strict';

    // --------------------------------初始化cookie-------------------------------------
    window.localStorage.clear()
    window.sessionStorage.clear()
    clearCookies()

    // 翻页并重定向逻辑
    const url = 'https://www.wjx.cn/vm/YtNiOAB.aspx'

    //转交到提交成功页面时跳回问卷页面
    if (window.location.href.indexOf('https://www.wjx.cn/wjx/join') !== -1 ) {
        setTimeout(() => {
            window.location.href = url
        }, 100)
    }

    window.scrollTo({
        top: document.body.scrollHeight, left: 0, behavior: 'smooth'
    })


    // --------------------------------网页逻辑-------------------------------------
    // 获取网页基本元素
    let questionList = document.getElementsByClassName('field ui-field-contain')
    let clickList = []
    for (let i =0; i < questionList.length; i++){
        clickList.push(questionList[i].children[1])
    }



    // --------------------------------回答逻辑-------------------------------------
    // 定义回答列表
    let answerList = [
        {id: 1, type: '单选', ratio: [10, 20, 20, 30, 20]},
        {id: 2, type: '多选', ratio: [10, 30, 60]},
        {id: 3, type: '量表', ratio: [20, 20, 20, 20, 20]},
        {id: 4, type: '矩阵量表', ratio: [[20, 20, 20, 20, 20], [10, 20, 40, 20, 10]]},
        {id: 5, type: '下拉', ratio: [50, 50]},
        {id: 6, type: '填空', ratio: [50, 50], content: ['哈哈哈', '嘿嘿嘿']},
    ]

    // 问卷答题逻辑
    for (let i = 0; i < clickList.length ; i++) {
        let type = answerList[i].type
        switch (type) {

            case '单选': {
                clickList[i].children[single(answerList[i].ratio)].click()
                break
            }

            case '多选': {
                 for (let j = 0; j < 3; j++) {
                    clickList[i].children[multi(answerList[i].ratio)].click()
                    num++
                 }
            }

            case '下拉': {
                clickList[i].children[0].children[0].value = String(1 + single(answerList[i].ratio))
                break
            }

            case '量表': {
                clickList[i].children[0].children[1].children[single(answerList[i].ratio)].click()
                break
            }

            case '矩阵量表': {
                for (let j = 0; j < answerList[i].ratio.length; j++) {
                    clickList[i].children[0].children[1].children[(j+1)*2].children[1 + single(answerList[i].ratio[j])].click()
                }
                break
            }

            case '填空': {
                clickList[i].children[0].value = answerList[i].content[single(answerList[i].ratio)]
                break
            }


            default: {
                break
            }


        }
    }







    // --------------------------------问题逻辑-------------------------------------

    // 单选题逻辑
    function single(ratio) {
        // 生成一个随机数
        console.log(ratio)
        let randomNum = getRandom()
        // 遍历概率分布数组，找到符合随机数的选项索引
        return isInRange(ratio,randomNum)
      }

    // 多选题逻辑
    function multi(ratio) {
        // 生成一个随机数
        let randomNum = getRandom()
        // 遍历概率分布数组，找到符合随机数的选项索引
        return isInRange(ratio,randomNum)
    }


    // --------------------------------提交逻辑-------------------------------------
    // 提交并滑动验证
    setTimeout(() => {
        console.log('navigator:', window.navigator)
        document.getElementById('ctlNext').click()
        setTimeout(() => {
            document.getElementById('SM_BTN_1').click()
            setTimeout(() => {
                slidingSlider();
            }, 3000)
        }, 1000)
    }, 1000)

    function slidingSlider() {
        const slider = document.querySelector("#nc_1_n1z");
        const startX = slider.getBoundingClientRect().left + window.pageXOffset;
        const startY = slider.getBoundingClientRect().top + window.pageYOffset;
        const endX = startX + 270;
        const endY = startY;
        const options = {bubbles: true, cancelable: true};
        slider.dispatchEvent(new MouseEvent('mousedown', options));
        slider.dispatchEvent(new MouseEvent('mousemove', Object.assign(options, {clientX: startX, clientY: startY})));
        slider.dispatchEvent(new MouseEvent('mousemove', Object.assign(options, {clientX: endX, clientY: endY})));
        slider.dispatchEvent(new MouseEvent('mouseup', options));
        setTimeout(()=>{
            // 出现哎呀出错啦，点击刷新再来一次错误 需要重新点击
           var nc_1_refresh1_reject = document.getElementById('nc_1_refresh1')
           if(nc_1_refresh1_reject!=='undefined' || nc_1_refresh1_reject!==null){
               nc_1_refresh1_reject.click()
               setTimeout(()=>{
                    slidingSlider()
               },1000)
           }
           },1000)
    }



    // --------------------------------辅助函数-------------------------------------

    // 生成一个1-100之内的随机数
    function getRandom() {
        return Math.floor(Math.random() * 100) + 1
    }

    // 判断是否在概率区间内
    function isInRange(ratio,randomNum) {
        console.log("孩子你无敌了")
        console.log("ratio:", ratio)
        let sum = 0
        for (let i = 0; i < ratio.length; i++) {
          sum += ratio[i]
          if (randomNum < sum) {
            return i
          }
        }
    }

    // 把所有的cookie都变过期
    function clearCookies() {
        document.cookie.split(';').forEach(cookie => {
            const [name, ...parts] = cookie.split(/=(.*)/);
            const value = parts.join('=');
            const decodedName = decodeURIComponent(name.trim());
            const decodedValue = decodeURIComponent(value.trim());
            document.cookie = `${decodedName}=${decodedValue}; expires=Thu, 01 Jan 1949 00:00:00 UTC;`;
        });
    }


})();
