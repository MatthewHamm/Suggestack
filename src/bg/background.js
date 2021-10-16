// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });


//example of using a message handler from the inject scripts

  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.contentScriptQuery == "query") {
          console.log("it's alive");
          
          
          fetch("https://www.startpage.com/sp/search?query="+encodeURIComponent("site:substack.com/p/ "+request.q.join(" OR ")))
          .then(response=>response.text())
          .then(function(data){
            
            resultsdata=String(data);
            console.log(resultsdata);
            var docstart=new DOMParser().parseFromString(resultsdata, "text/html");
            var resultlist=[...docstart.getElementsByClassName("w-gl__result-title result-link")];
            var descrlist=[...docstart.getElementsByClassName("w-gl__description")];
            var results=[];
            var links=[]; 
            var desc=[];
           
            resultlist.forEach(getText);
            resultlist.forEach(getlinks);
            descrlist.forEach(getDesc);
            
            fetch("https://api.qwant.com/v3/search/web?q="+encodeURIComponent("site:substack.com/p/ "+request.q[0])+"&count=10&locale=en_GB&offset=0&device=desktop&safesearch=0")
            .then(response=>response.json())
            .then(function(data){
              console.log(data.data.result.items.mainline);
              let webresult=data.data.result.items.mainline.filter(result=>result.type=="web");
              for(i in webresult){
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
              }
              )
              sendResponse(resultTable);
            })
            
          function getText(html){
            
            results.push(html.innerText.trim());
          }
          function getlinks(html){
            links.push(html.href)
          }
          function getDesc(html){
            desc.push(html.innerText.trim())
          }
          }
          )
          
          
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