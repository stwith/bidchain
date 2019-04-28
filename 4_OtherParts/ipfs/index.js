'use strict'

// var fs = require("fs")

var IPFS = require('ipfs-api')
// var ipfs = IPFS()

var ipfs = IPFS('ipfs.lycoris.work','5002')


// var path = require("path")
var FileSaver = require('file-saver')
// var multer = require('multer')
// var upload = multer({ dest: './uploads/'})
// var cpUpload = upload.fields([
//     {file: 'src', maxCount: 10}  //maxCount为一次传输文件的最大数量
// ])

// router.post("/uploadFile",cpUpload, function(req, res, next){
//     var fileres = req.file
//
//
//     var toStore = document.getElementById('source')
//     var
//     ipfs.files.add(Buffer.from(fileres), function (err, res) {
//       if (err || !res) {
//         return console.error('ipfs add error', err, res)
//       }
//       res.forEach(function (file) {
//         if (file && file.hash) {
//           console.log('successfully stored', file.hash)
//           // display(file.hash)
//           document.getElementById('hash').innerText = file.hash
//         }})})
//
//
//
//   });



function store () {
  // var file = document.getElementById('source').value;
  // console.log(filePath);
  // console.log(fs);
  console.log(toStoreProc);
  console.log(toStore);

    var toStoreProc = document.getElementById('source')
    var toStore = toStoreProc.files[0]
    var reader = new FileReader();
    reader.readAsArrayBuffer(toStore);
    reader.onload = function (e){
    // var b64res = reader.readAsDataURL(toStore);
      ipfs.files.add(Buffer.from(reader.result), function (err, res) {
        if (err || !res) {
          return console.error('ipfs add error', err, res)
        }
        res.forEach(function (file) {
          if (file && file.hash) {
            console.log('successfully stored', file.hash)
            // display(file.hash)
            document.getElementById('hash').innerText = file.hash
          }})})}}

function display () {
  var toExtract = document.getElementById('hashinput').value
  ipfs.files.cat(toExtract, function (err, res) {
    if (err || !res) {
      return console.error('ipfs cat error', err, res)
    }

    document.getElementById('hash').innerText = "Hash命中！"
    // document.getElementById('content').innerText = res.toString()
    // document.getElementById('source').value = res
    var blob = new Blob([res], {type: "application/octet-stream"});
    FileSaver.saveAs(blob, "require.docx");
    })
  }




document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('store').onclick = store
  document.getElementById('extract').onclick = display
})
