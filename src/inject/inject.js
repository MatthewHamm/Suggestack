
function loadpage(){
		
		
		
		
			
	
	var punctuation = '!"#$%&\()*+,-./:;<=>?@[\\]^_`{|}~“”‘–';
	var regex = new RegExp('[' + punctuation + ']', 'g');
	const doc=document.getElementsByClassName("post typography")[0];
	var test;
	var test2;
	var pro;
	var proarray;
	var proid;
	var url;
	var domain;
	var article;
	try{
		///gets a string of the substack article
		
		article=doc.innerText;
		
		console.log(article);
		test=true
	}
	catch(err){
		test=false
		console.log(err)
		
		return;
	}
	try{
		pro=doc.getElementsByClassName("user-head ")[0].getElementsByTagName("a")[0].getAttribute("href")//.links;
		console.log(pro);
		
		if(pro==null){
			proarray=["","","","",""]
		}else{
			proarray=pro.split('/');
		}
		
		proid=proarray[4]
		url=document.baseURI;
		domain=url.slice(0,url.search("/p/"));
		console.log(domain);
		test2=true;
	}
	catch(err){
		test2=false
		console.log(err)
		
		
	}	 
	if(test&&test2){
		pro=doc.getElementsByClassName("user-head ")[0].getElementsByTagName("a")[0].getAttribute("href")//.links;
		
		
		if(pro==null){
			proarray=["","","","",""]
		}else{
			proarray=pro.split('/');
		}
		
		proid=proarray[4]
		url=document.baseURI;
		domain=url.slice(0,url.search("/p/"));
		
		article=doc.innerText;
	}else if(test){
		proarray=["","","","",""]
		proid=proarray[4]
		url=document.baseURI;
		domain=url.slice(0,url.search("/p/"));
		
		article=doc.innerText;
	}
	else{
		return
	}

	var pStr = document.getElementsByTagName("h1")[0].innerText
	if (document.getElementsByTagName("h3")[0]!=null){
		pStr = pStr+" "+document.getElementsByTagName("h3")[0].innerText;
		
		
	
	}
	
	const posttext=doc.getElementsByClassName("body markup")[0];
	for(let i=0;i<posttext.getElementsByTagName("p").length;i++){
		
		if (posttext.getElementsByTagName("p")[i].innerText.trim()!=""){
			pStr=pStr+" "+posttext.getElementsByTagName("p")[i].innerText;
			pStr=pStr.replace("Subscribe now","");
			if(i<posttext.getElementsByTagName("p").length-1){
				let j=1;
				while(pStr.length<500&&i+j<posttext.getElementsByTagName("p").length-1){
					pStr=pStr+" "+posttext.getElementsByTagName("p")[i+j].innerText;
					pStr=pStr.replace("Subscribe now","");
					j++;
				}
				if(j==1){
					pStr=pStr+" "+posttext.getElementsByTagName("p")[i+j].innerText;
					pStr=pStr.replace("Subscribe now","");
				}
					
			}
			break;
		}
	};
	for(let i=posttext.getElementsByTagName("p").length-1;i>0;i--){
		
		if (posttext.getElementsByTagName("p")[i].innerText.trim()!=""){
			pStr=pStr+" "+posttext.getElementsByTagName("p")[i].innerText;
			pStr=pStr.replace("Subscribe now","");
			let j=1;
			while(pStr.length<750&&i-j>0){
				pStr=pStr+" "+posttext.getElementsByTagName("p")[i-j].innerText;
				pStr=pStr.replace("Subscribe now","");
				j++;
			}
			
			break;
		}
	}; ///this part get strings of titles, substitles and the first and last paragraphs
	var artarr=stringarray(article);
	artarr.forEach(trimarr);
	
	var strarr=stringarray(pStr);
	strarr.forEach(trimarr);
	var uniarr=[...new Set(strarr)]///leaves just unique words in the array
	const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0);
	var wordcount=[];

	
	var textlist=[];

	
	var books=chrome.runtime.sendMessage(
		{contentScriptQuery: "books", q:uniarr.toString()},function(response){
			console.log(response);
			response=response.sort((a,b)=>a.timeseries[0]-b.timeseries[0]);
			response=response.slice(0,50);
			ngrams=[];
			response.forEach(ngramf);
			ngrams.forEach(tdf);
			var textTable = ngrams.map(word => {
				let x=Number.MIN_VALUE;
				if (ngrams.includes(word)){
					x=response[ngrams.indexOf(word)].timeseries[0];
				}
				x= (-Math.log(x))*wordcount[ngrams.indexOf(word)]
				return {
					"Text": word,
					"Count": wordcount[ngrams.indexOf(word)],
					"Common": x
				}
			})
			textTable=textTable.sort((a,b)=>b.Common-a.Common)
			console.log(textTable);
			textTable.filter(function(item){
				let months=["january","febuary","march","april","may","june","july","august","september","october","november","december"]
				return !(months.includes(item))})
			textTable.slice(0,5).forEach(textget);
			function find(needle, haystack) {
				var results = [];
				var idx = haystack.indexOf(needle);
				while (idx != -1) {
					results.push(idx);
					idx = haystack.indexOf(needle, idx + 1);
				}
				return results;
			}
			var textpos=textlist.map(word =>{
				return{
					"Text" :word,
					"Postions" : find(word, strarr)
				}
			})
			var primeInstanceIndex=0;
			var nextInstanceIndex=0;
			var wordindex=0;
			var distanceVal=0;
			for(let i=0;i<textpos[0].Postions.length;i++){
				for(let j=1;j<textpos.length;j++){
					let distance=[];
					textpos[j].Postions.forEach(value=>{distance.push(Math.abs(value-textpos[0].Postions[i]))})
					if(distance.some(value=>(value<8))){
						nextInstanceIndex=distance.findIndex(value=>(value<8));
						primeInstanceIndex=i;
						wordindex=j;
						distanceVal=textpos[j].Postions[nextInstanceIndex]-textpos[0].Postions[i]
						break;
					}
				}
			}
			if(distanceVal>0){
				textlist=strarr.slice(textpos[0].Postions[primeInstanceIndex],textpos[wordindex].Postions[nextInstanceIndex])
			}
			else if(distanceVal<0){
				textlist=strarr.slice(textpos[wordindex].Postions[nextInstanceIndex],textpos[0].Postions[primeInstanceIndex]+1)
			}
			else{
				textlist=strarr.slice(strarr.indexOf(textTable[0].Text)-2,strarr.indexOf(textTable[0].Text)+3);
			}
			
			chrome.runtime.sendMessage(
				{contentScriptQuery: "query", q: textlist,id:proid, subdomain:domain},function(response){
					
					
					var suggestion=document.createElement("div");
					suggestion.style.marginBottom="500px";
					suggestion.style.marginLeft="5%";
					suggestion.style.display="grid";
					suggestion.style.gridColumnGap= "50px";
					suggestion.style.gridRowGap= "50px";
					suggestion.className="suggestion";
					var title=document.createElement("div");
					title.style.gridColumnStart="1";
					title.style.gridColumnStop="3";
					title.style.color="var(--print_on_web_bg_color)"
					img=document.createElement("img");
					img.src=chrome.runtime.getURL("icons/logo128.png");
					img.style.float="left";
					title.appendChild(img);
					title.innerHTML+="<h2>Suggestack</h2>";
					suggestion.appendChild(title);
					console.log(response);
					var urls=[];
					response.forEach(getUrls);
					
					function getUrls(item){
						urls.push(item.link);
					}

					uniresponse=response.filter(function(item,index){
						
						let ans=urls.indexOf(item.link)==index
						if(ans){
							if(url.includes("?") && item.link.includes("?")){
								ans=!(url.slice(0,url.indexOf("?"))==item.link.slice(0,item.link.indexOf("?")))
							}else if(url.includes("?")){
								ans=!(url.slice(0,url.indexOf("?"))==item.link)
							}else if(item.link.includes("?")){
								ans=!(url==item.link.slice(0,item.link.indexOf("?")))
							}else{
								ans=!(url==item.link)
							}
						}
						
						
						
						return ans;
					});
					const qwindex=uniresponse.findIndex(function(item){return item.desc.length>256})
					const qsugg=uniresponse.slice(qwindex,response.length);
					const ssugg=uniresponse.slice(0,qwindex-1);
					

					var css = ".card:hover {box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);} \n .card {box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2); transition: 0.3s;  display:inline-grid; gridColumn:auto;padding: 2px 16px; text-decoration: none;}\n .links {text-decoration: none;    color:var(--print_on_web_bg_color);";
					var style = document.createElement('style');
		
					if (style.styleSheet) {
						style.styleSheet.cssText = css;
					} else {
						style.appendChild(document.createTextNode(css));
					}
		
					document.getElementsByTagName('head')[0].appendChild(style);
					if(qsugg.length>=5 && ssugg.length>=5){
						for(let i=0;i<5;i++){
							var div;
							div=document.createElement("div");
							div.className="card";
							
							
							div.style.gridColumn=1
							var a=document.createElement("a");
							a.className="links";
							a.target="_blank";
							a.href=ssugg[i].link;
							a.innerHTML="<h3>"+ssugg[i].title+"</h3> <p>"+ssugg[i].desc+"</p>";
							
							
							
							
							
							div.appendChild(a);
							suggestion.appendChild(div);
							var div;
							div=document.createElement("div");
							div.className="card";
							
							
							div.style.gridColumn=2
							var a=document.createElement("a");
							a.className="links";
							a.target="_blank";
							a.href=qsugg[i].link;
							a.innerHTML="<h3>"+qsugg[i].title+"</h3> <p>"+qsugg[i].desc+"</p>";
							
							
							
							
							
							div.appendChild(a);
							suggestion.appendChild(div);

						}
					}else{
						if(qsugg.length>ssugg.length){
							for(let i=0;i<ssugg.length;i++){
								var div;
								div=document.createElement("div");
								div.className="card";
								
								
								div.style.gridColumn=1
								var a=document.createElement("a");
								a.className="links";
								a.target="_blank";
								a.href=ssugg[i].link;
								a.innerHTML="<h3>"+ssugg[i].title+"</h3> <p>"+ssugg[i].desc+"</p>";
								
								
								
								
								
								div.appendChild(a);
								suggestion.appendChild(div);
								var div;
								div=document.createElement("div");
								div.className="card";
								
								
								div.style.gridColumn=2
								var a=document.createElement("a");
								a.className="links";
								a.target="_blank";
								a.href=qsugg[i].link;
								a.innerHTML="<h3>"+qsugg[i].title+"</h3> <p>"+qsugg[i].desc+"</p>";
								
								
								
								
								
								div.appendChild(a);
								suggestion.appendChild(div);
	
							}
							for(let i=ssugg.length;i<qsugg.length&&i+ssugg.length<10;i++){
								var div;
								div=document.createElement("div");
								div.className="card";
								
								
								if(i%2==0){
									div.style.gridColumn=1
								}else{
									div.style.gridColumn=2
								}
								var a=document.createElement("a");
								a.className="links";
								a.target="_blank";
								a.href=qsugg[i].link;
								a.innerHTML="<h3>"+qsugg[i].title+"</h3> <p>"+qsugg[i].desc+"</p>";
								
								
								
								
								
								div.appendChild(a);
								suggestion.appendChild(div);
							}
						}else{
							for(let i=0;i<qsugg.length;i++){
								var div;
								div=document.createElement("div");
								div.className="card";
								
								
								div.style.gridColumn=1
								var a=document.createElement("a");
								a.className="links";
								a.target="_blank";
								a.href=ssugg[i].link;
								a.innerHTML="<h3>"+ssugg[i].title+"</h3> <p>"+ssugg[i].desc+"</p>";
								
								
								
								
								
								div.appendChild(a);
								suggestion.appendChild(div);
								var div;
								div=document.createElement("div");
								div.className="card";
								
								
								div.style.gridColumn=2
								var a=document.createElement("a");
								a.className="links";
								a.target="_blank";
								a.href=qsugg[i].link;
								a.innerHTML="<h3>"+qsugg[i].title+"</h3> <p>"+qsugg[i].desc+"</p>";
								
								
								
								
								
								div.appendChild(a);
								suggestion.appendChild(div);
	
							}
							for(let i=qsugg.length;i<ssugg.length && i+qsugg.length<10;i++){
								var div;
								div=document.createElement("div");
								div.className="card";
								
								
								if(i%2==1){
									div.style.gridColumn=1
								}else{
									div.style.gridColumn=2
								}
								var a=document.createElement("a");
								a.className="links";
								a.target="_blank";
								a.href=ssugg[i].link;
								a.innerHTML="<h3>"+ssugg[i].title+"</h3> <p>"+ssugg[i].desc+"</p>";
								
								
								
								
								
								div.appendChild(a);
								suggestion.appendChild(div);
							}
						}
						
					}
					try{
						document.getElementsByClassName("suggestion")[0].remove()
					}catch(err){
						console.log(err);
					}
					
					document.getElementById("entry").appendChild(suggestion);
					
				});
			
				
			function ngramf(resp){
				ngrams.push(resp.ngram);
			}		

		})
	
	function stringarray(str){
		///removes punctuation and splits string up in to an array of words
		let nstr=str.replaceAll("-"," ").replace(regex, '').toLowerCase();
		nstr=nstr.replaceAll("\n"," ");
		nstr=nstr.replaceAll("\u00a0"," ");
		nstr=nstr.replaceAll("’s","");
		nstr=nstr.replaceAll("'s","");
		nstr=nstr.replaceAll("\t"," ");
		nstr=nstr.replaceAll("…"," ");
		nstr=nstr.replaceAll("’","");
		nstr=nstr.replaceAll("'","");
		nstr=nstr.replaceAll("—"," ");
		let arr=nstr.split(" ");
		arr=arr.filter(removenull);

		return arr;
	}
	function tdf(str){
		/// a measure of term frequency
		wordcount.push(Math.log(countOccurrences(artarr,str)+1))
	}
	function trimarr(item, index, arr){
		arr[index]=item.trim();
	}
	function removenull(str){
		///removes empty string form arry cuased by double spacing
		return str!=""
	}

	function textget(table){
		///puts the words into an new array
		textlist.push(table.Text)
	}


	
}
const config = { attributes: true,attributeFilter:["class"], childlist: true, subtree: true };	
var observer= new MutationObserver(loadpage);
observer.observe(document,config);

