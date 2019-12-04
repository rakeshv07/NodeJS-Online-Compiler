const express = require('express');
const layout = require('express-layout')
var ejs = require('ejs');
const app = express();
const path = require('path');
const router = express.Router();
const bodyParser = require('body-parser');
var fs = require('fs');
app.use('/css', express.static(__dirname + "/css"));
app.use('/js', express.static(__dirname + "/js"));
const { c, cpp, node, python, java } = require('compile-run');


app.use(bodyParser.urlencoded({ extended: true }));

router.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
    
});

router.get('/editor', function (req, res) {
    res.sendFile(path.join(__dirname + '/editor.html'));

});

router.get('/docs', function (req, res) {
  res.sendFile(path.join(__dirname + '/docs.html'));

});


app.post('/output', function (req, res) {
    let selected_language = req.body.language;
    let inputParameters = req.body.inputArea;
    let codeArea = req.body.codeArea;

    var backButton = `<br><br><style>body{background-color:rebeccapurple;}button{width:200px;height:50px;cursor:pointer;color:white;background-color:blue;font-size:25px;border-radius:25px;}button:hover{background-color:green;}</style><button onClick='back()'>Back</button>
    <script>function back(){history.go(-1);}    </script>`;

    console.log("Language: "+selected_language+"\n"+codeArea);
   
     if (selected_language === "Java") {

    let javaCode = req.body.codeArea;

    fs.writeFile('Main.java', javaCode, function (err) {
      if (err) throw err;
      console.log('Saved!');
      console.log("Inputs Passed:\n"+inputParameters);
    });

    java.runFile('Main.java', {
      compilationPath: 'javac',
      executionPath: 'java',
      stdin:inputParameters,
    }, (err, result) => {
      
      
      res.send('<center><h1 style="color:yellow;">Output:-</h1><b style="color:white;font-size:30px;">'+result['stderr']+"<br>"+result['stdout']+"<br>Memory Usage (Bytes): "+result['memoryUsage']+"<br>CPU Usage(Micro Sec): "+result['cpuUsage']+backButton);
     return console.log(err ? err : result);
    });


  }
  else if (selected_language === "Python") {
    const sourcecode = req.body.codeArea;
    let inputParameters = req.body.inputArea;

    fs.writeFile('Main.py', sourcecode, function (err) {
      if (err) throw err;
      console.log('Saved!');
      console.log("Inputs Passed:\n"+inputParameters);
    });

    python.runFile('Main.py', { stdin:inputParameters}, (err, result) => {
      if(err){
          console.log(err);
      }
      else{
          res.send('<center><h1 style="color:yellow;">Output:-</h1><b style="color:white;font-size:30px;">'+result['stderr']+"<br>"+result['stdout']+"<br>Memory Usage (Bytes): "+result['memoryUsage']+"<br>CPU Usage(Micro Sec): "+result['cpuUsage']+backButton);
          console.log(result);
      }
  });
   

  } else if (selected_language === "C") {
    const sourcecode = req.body.codeArea;
    let inputParameters = req.body.inputArea;

    fs.writeFile('Main.C', sourcecode, function (err) {
      if (err) throw err;
      console.log('Saved!');
      console.log("Inputs Passed:\n"+inputParameters);
    });

    c.runFile('Main.C', { stdin:inputParameters}, (err, result) => {
      if(err){
          console.log(err);
      }
      else{
          res.send('<center><h1 style="color:yellow;">Output:-</h1><b style="color:white;font-size:30px;">'+result['stderr']+"<br>"+result['stdout']+"<br>Memory Usage (Bytes): "+result['memoryUsage']+"<br>CPU Usage(Micro Sec): "+result['cpuUsage']+backButton);
          console.log(result);
      }
  });
  } else if (selected_language === "C++") {
    const sourcecode = req.body.codeArea;
    let inputParameters = req.body.inputArea;

    fs.writeFile('Main.CPP', sourcecode, function (err) {
      if (err) throw err;
      console.log('Saved!');
      console.log("Inputs Passed:\n"+inputParameters);
    });

    cpp.runFile('Main.CPP', { stdin:inputParameters}, (err, result) => {
      if(err){
          console.log(err);
      }
      else{
          res.send('<center><h1 style="color:yellow;">Output:-</h1><b style="color:white;font-size:30px;">'+result['stderr']+"<br>"+result['stdout']+"<br>Memory Usage (Bytes): "+result['memoryUsage']+"<br>CPU Usage(Micro Sec): "+result['cpuUsage']+backButton);
          console.log(result);
      }
  });
  }
  // else if(selected_language === "Node.js"){
  //   const sourcecode = req.body.codeArea;
  //   let resultPromise = node.runSource(sourcecode);
  //   resultPromise
  //     .then(result => {
  //       ans = result;
  //       console.log(result);
  //       if (result['stdout'] === "") {
  //         res.send('<center><h1 style="color:yellow;">Output:-</h1><h1 style="color:white;font-size:50px;">' + result['stderr']);
  //       }
  //       else {
  //         res.send('<center><h1 style="color:yellow;">Output:-</h1><h1 style="color:white;font-size:50px;">' + result['stdout']+"<br>Memory Usage (Bytes): "+result['memoryUsage']+"<br>CPU Usage(Micro Sec): "+result['cpuUsage']+backButton);
  //       }
        
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     });
  // }
  else {
    res.send('<center><h1 style="color:yellow;">Output:-</h1><h1 style="color:white;font-size:50px;">' + "Something Went Wrong / Wrong Language Chosen");
  }

})

//add the router
app.use('/', router);
app.listen(process.env.port || 80);

console.log('Running at Port 80');