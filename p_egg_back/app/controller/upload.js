'use strict';
const { Controller } = require('egg');
const moment = require('moment');
const mkdirp = require('mkdirp');
const fs = require('fs');
const path = require('path');
class UploadeController extends Controller {
  async upload() {
    console.log('=============');
    const { ctx } = this;
    const file = ctx.request.files[0];
    console.log('FILE:', file);
    let uploadDir = '';
    try {
      const f = fs.readFileSync(file.filepath);
      const day = moment(new Date()).format('YYYYMMDD');
      const dir = path.join(this.config.uploadDir, day);
      const date = Date.now();
      await mkdirp.mkdirpSync(dir);
      uploadDir = path.join(dir, date + path.extname(file.filename));
      console.log(dir, uploadDir);
      fs.writeFileSync(uploadDir, f);
    } finally {
      // 清除临时文件
      ctx.cleanupRequestFiles();
    }


    ctx.body = {
      code: 200,
      msg: '上传成功',
      data: uploadDir.replace(/app/g, ''),
    };
  }
}

module.exports = UploadeController;
