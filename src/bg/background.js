// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });


//example of using a message handler from the inject scripts

  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.contentScriptQuery == "query") {
          console.log("it's alive");
          if(request.id!=""){
            fetch(request.subdomain+"/api/v1/user/"+request.id+"/public_profile")
            .then(response =>response.json())
            .then(function(data){
              var relstacks=[]
              data.subscriptions.forEach(function(item){
                console.log(item);
                if(item.publication.subdomain!="on"){
                  relstacks.push(item.publication.subdomain+".substack.com/p/");
                }
                
                
              })
              if(relstacks.length>0){
                fetch("https://www.startpage.com/sp/search?query="+encodeURIComponent(request.q.join(" OR ")+" site:"+relstacks.slice(0,64).join(" OR site:")))
                .then(response=>response.text())
                .then(function(data){
                  
                  resultsdata=String(data);
                  console.log(resultsdata);
                  resultarr=resultsdata.split("div");
                  var resultlist=resultarr.filter(function(item){
                    return item.includes("w-gl__result-title result-link")
                  });
                  var descrlist=resultarr.filter(function(item){
                    return item.includes("w-gl__description")
                  });
                  
                  var results=[];
                  var links=[]; 
                  var desc=[];
                
                  resultlist.forEach(getText);
                  resultlist.forEach(getlinks);
                  descrlist.splice(1).forEach(getDesc);
                  console.log(desc);
                  if(results.length<5){
                    fetch("https://www.startpage.com/sp/search?query="+encodeURIComponent("site:substack.com/p/ "+request.q.join(" OR ")))
                    .then(response=>response.text())
                    .then(function(data){
                  
                      resultsdata=String(data);
                      console.log(resultsdata);
                      resultarr=resultsdata.split("div");
                      var resultlist=resultarr.filter(function(item){
                        return item.includes("w-gl__result-title result-link")
                      });
                      var descrlist=resultarr.filter(function(item){
                        return item.includes("w-gl__description")
                      });
                      
                      var results=[];
                      var links=[]; 
                      var desc=[];
                    
                      resultlist.forEach(getText);
                      resultlist.forEach(getlinks);
                      descrlist.splice(1).forEach(getDesc);
                      console.log(desc);
                      fetch("https://api.qwant.com/v3/search/web?q="+encodeURIComponent("site:substack.com/p/ "+request.q[0])+"&count=10&locale=en_GB&offset=0&device=desktop&safesearch=0")
                      .then(response=>response.json())
                      .then(function(data){
                        console.log(data.data.result.items.mainline);
                        let webresult=data.data.result.items.mainline.filter(result=>result.type=="web");
                        console.log(webresult);
                        for(i in webresult){
                          console.log(webresult[i].items);
                          webresult[i].items.forEach(getRe);
                        }
                        
                        function getRe(item){
                          results.push(item.title);
                          links.push(item.url);
                          desc.push(item.desc);
                        }
                        var resultTable=results.map(title=>{
                          return{
                            "title":title,
                            "desc":desc[results.indexOf(title)],
                            "link":links[results.indexOf(title)]
                          }
                        })
                        console.log(resultTable);
                        sendResponse(resultTable);
                      })
                      
                    function getText(html){
                
                      results.push(html.split("h3")[1].replace("</","").replace(">","").trim());
                    }
                    function getlinks(html){
                      links.push(html.split("href=")[1].split('"')[1])
                    }
                    function getDesc(html){
                      desc.push(html.replace("<p class=\"w-gl__description\">","").replace("</p","").replace("</","").replace(">","").replace("<b>","").replace("b>","").trim());
                    }
                    })
                  }
                  else{
                    fetch("https://api.qwant.com/v3/search/web?q="+encodeURIComponent("site:substack.com/p/ "+request.q[0])+"&count=10&locale=en_GB&offset=0&device=desktop&safesearch=0")
                    .then(response=>response.json())
                    .then(function(data){
                      console.log(data.data.result.items.mainline);
                      let webresult=data.data.result.items.mainline.filter(result=>result.type=="web");
                      console.log(webresult);
                      for(i in webresult){
                        console.log(webresult[i].items);
                        webresult[i].items.forEach(getRe);
                      }
                      
                      function getRe(item){
                        results.push(item.title);
                        links.push(item.url);
                        desc.push(item.desc);
                      }
                      var resultTable=results.map(title=>{
                        return{
                          "title":title,
                          "desc":desc[results.indexOf(title)],
                          "link":links[results.indexOf(title)]
                        }
                      })
                      console.log(resultTable);
                      sendResponse(resultTable);
                  })
                  }
                  function getText(html){
                  
                    results.push(html.split("h3")[1].replace("</","").replace(">","").trim());
                  }
                  function getlinks(html){
                    links.push(html.split("href=")[1].split('"')[1])
                  }
                  function getDesc(html){
                    desc.push(html.replace("<p class=\"w-gl__description\">","").replace("</p","").replace("</","").replace(">","").replace("<b>","").replace("b>","").trim());
                  }
                })
                
              }else{
                fetch("https://www.startpage.com/sp/search?query="+encodeURIComponent("site:substack.com/p/ "+request.q.join(" OR ")))
                .then(response=>response.text())
                .then(function(data){
                  
                  resultsdata=String(data);
                  console.log(resultsdata);
                  resultarr=resultsdata.split("div");
                  var resultlist=resultarr.filter(function(item){
                    return item.includes("w-gl__result-title result-link")
                  });
                  var descrlist=resultarr.filter(function(item){
                    return item.includes("w-gl__description")
                  });
                  
                  var results=[];
                  var links=[]; 
                  var desc=[];
                
                  resultlist.forEach(getText);
                  resultlist.forEach(getlinks);
                  descrlist.splice(1).forEach(getDesc);
                  console.log(desc);
                  fetch("https://api.qwant.com/v3/search/web?q="+encodeURIComponent("site:substack.com/p/ "+request.q[0])+"&count=10&locale=en_GB&offset=0&device=desktop&safesearch=0")
                  .then(response=>response.json())
                  .then(function(data){
                    console.log(data.data.result.items.mainline);
                    let webresult=data.data.result.items.mainline.filter(result=>result.type=="web");
                    console.log(webresult);
                    for(i in webresult){
                      console.log(webresult[i].items);
                      webresult[i].items.forEach(getRe);
                    }
                    
                    function getRe(item){
                      results.push(item.title);
                      links.push(item.url);
                      desc.push(item.desc);
                    }
                    var resultTable=results.map(title=>{
                      return{
                        "title":title,
                        "desc":desc[results.indexOf(title)],
                        "link":links[results.indexOf(title)]
                      }
                    })
                    console.log(resultTable);
                    sendResponse(resultTable);
                  })
                  
                function getText(html){
                  
                  results.push(html.split("h3")[1].replace("</","").replace(">","").trim());
                }
                function getlinks(html){
                  links.push(html.split("href=")[1].split('"')[1])
                }
                function getDesc(html){
                  desc.push(html.replace("<p class=\"w-gl__description\">","").replace("</p","").replace("</","").replace(">","").replace("<b>","").replace("b>","").trim());
                }
                })

              }
            })

          }
          else{
            fetch("https://www.startpage.com/sp/search?query="+encodeURIComponent("site:substack.com/p/ "+request.q.join(" OR ")))
            .then(response=>response.text())
            .then(function(data){
              
              resultsdata=String(data);
              console.log(resultsdata);
              resultarr=resultsdata.split("div");
              var resultlist=resultarr.filter(function(item){
                return item.includes("w-gl__result-title result-link")
              });
              var descrlist=resultarr.filter(function(item){
                return item.includes("w-gl__description")
              });
              
              var results=[];
              var links=[]; 
              var desc=[];
            
              resultlist.forEach(getText);
              resultlist.forEach(getlinks);
              descrlist.splice(1).forEach(getDesc);
              console.log(desc);
              fetch("https://api.qwant.com/v3/search/web?q="+encodeURIComponent("site:substack.com/p/ "+request.q[0])+"&count=10&locale=en_GB&offset=0&device=desktop&safesearch=0")
              .then(response=>response.json())
              .then(function(data){
                console.log(data.data.result.items.mainline);
                let webresult=data.data.result.items.mainline.filter(result=>result.type=="web");
                console.log(webresult);
                for(i in webresult){
                  console.log(webresult[i].items);
                  webresult[i].items.forEach(getRe);
                }
                
                function getRe(item){
                  results.push(item.title);
                  links.push(item.url);
                  desc.push(item.desc);
                }
                var resultTable=results.map(title=>{
                  return{
                    "title":title,
                    "desc":desc[results.indexOf(title)],
                    "link":links[results.indexOf(title)]
                  }
                })
                console.log(resultTable);
                sendResponse(resultTable);
              })
              
            function getText(html){
                
              results.push(html.split("h3")[1].replace("</","").replace(">","").trim());
            }
            function getlinks(html){
              links.push(html.split("href=")[1].split('"')[1])
            }
            function getDesc(html){
              desc.push(html.replace("<p class=\"w-gl__description\">","").replace("</p","").replace("</","").replace(">","").replace("<b>","").replace("b>","").trim());
            }
            })
            }
          
          
          
          return true;
          
        }
      else if(request.contentScriptQuery=="books"){
        
        fetch("https://books.google.com/ngrams/json?content="+encodeURIComponent(request.q)+"&year_start=2019&year_end=2018&corpus=26&smoothing=0")
        .then(response=>response.json())
        .then(data=>sendResponse(data))
        return true;
      }
  }
);