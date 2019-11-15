const axios = require('axios');
const instance = axios.create({
  baseURL: 'http://wap.zwjk.cn',
  timeout: 30000
});
const fs = require('fs');
const urlencode = require('urlencode');

const entry = 'zwjk3Baike.htm';

// url收集
let urlSet = new Set();
let i = 0;
async function readHtml(url){
  i++;
  url = urlencode(url);
  console.log(url);
  url = url.replace('%2F', '');
  url = url.replace('%3F', '?');
  url = url.replace(/%3D/g, '=');
  url = url.replace(/%26/g, '&');
  try{
    await function(){
      let p = new Promise((resole,reject)=>{
        setTimeout(()=>{resole()}, 1000 + i*100);
      })
      return p;
    }();
    let rlt = await instance.get(url);
    rlt = rlt.data;
    let p = function(){
      let p = new Promise((resole,reject)=>{
        let t = (new Date()).getTime()
        fs.writeFile('html/' + t + '.html', rlt, (err) => {
          if (err) throw err;
          resole();
          console.log(t + '.html' + '文件已被保存');
        });
      })
      return p;
    }()
    await p;
    let reg = /a href="[^"]{1,}"/g;
    let execRlt = null;
    while ((execRlt = reg.exec(rlt)) != null) {
      let a = execRlt[0];
      let newUrl = a.substring(8, a.length-1);
      if (newUrl.length<10) continue;
      if(!urlSet.has(newUrl)) {
        // console.log(newUrl);
        urlSet.add(newUrl);
        readHtml(newUrl);
      }
    }
  } catch(e) {
    console.log(e)
  }
}

readHtml(entry)