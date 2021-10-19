window.onload = async function(){

		
		
		
		
			
	
	var punctuation = '!"#$%&\()*+,-./:;<=>?@[\\]^_`{|}~“”‘–';
	var regex = new RegExp('[' + punctuation + ']', 'g');
	const doc=document.getElementsByClassName("post typography")[0];
	var test;
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
	if(test){
		article=doc.innerText;
	}else{
		return
	}

	var pStr = document.getElementsByTagName("h1")[0].innerText
	if (document.getElementsByTagName("h3")[0]!=null){
		pStr = pStr+" "+document.getElementsByTagName("h3")[0].innerText;
		
		
	
	}
	
	
	for(let i=0;i<doc.getElementsByTagName("p").length;i++){
		
		if (doc.getElementsByTagName("p")[i].innerText.trim()!=""){
			pStr=pStr+" "+doc.getElementsByTagName("p")[i].innerText;
			if(i<doc.getElementsByTagName("p").length-1){
				pStr=pStr+" "+doc.getElementsByTagName("p")[i+1].innerText;
			}
			break;
		}
	};
	for(let i=doc.getElementsByTagName("p").length-1;i>0;i--){
		
		if (doc.getElementsByTagName("p")[i].innerText.trim()!=""){
			pStr=pStr+" "+doc.getElementsByTagName("p")[i].innerText;
			
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
			textTable.slice(0,10).forEach(textget);
			
			chrome.runtime.sendMessage(
				{contentScriptQuery: "query", q: textlist},function(response){
					
					response=response.slice(0,-1);
					var suggestion=document.createElement("div");
					suggestion.style.marginBottom="500px";
					suggestion.style.marginLeft="5%";
					suggestion.style.display="grid";
					suggestion.style.gridColumnGap= "50px";
					suggestion.style.gridRowGap= "50px";

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
					const qwindex=response.findIndex(function(item){return item.desc.length>200})
					const qsugg=response.slice(qwindex,response.length);
					const ssugg=response.slice(0,qwindex-1);
					var sugg=response.slice(0,5).concat(response.slice(response.length>15? 10:4,response.length>15? 15:response.length));
					
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
							a.className="links"
							
							a.href=ssugg[i].link;
							a.innerHTML="<h3>"+ssugg[i].title+"</h3> <p>"+ssugg[i].desc+"</p>";
							
							
							
							
							
							div.appendChild(a);
							suggestion.appendChild(div);
							var div;
							div=document.createElement("div");
							div.className="card";
							
							
							div.style.gridColumn=2
							var a=document.createElement("a");
							a.className="links"
							
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
								a.className="links"
								
								a.href=ssugg[i].link;
								a.innerHTML="<h3>"+ssugg[i].title+"</h3> <p>"+ssugg[i].desc+"</p>";
								
								
								
								
								
								div.appendChild(a);
								suggestion.appendChild(div);
								var div;
								div=document.createElement("div");
								div.className="card";
								
								
								div.style.gridColumn=2
								var a=document.createElement("a");
								a.className="links"
								
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
								a.className="links"
								
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
								a.className="links"
								
								a.href=ssugg[i].link;
								a.innerHTML="<h3>"+ssugg[i].title+"</h3> <p>"+ssugg[i].desc+"</p>";
								
								
								
								
								
								div.appendChild(a);
								suggestion.appendChild(div);
								var div;
								div=document.createElement("div");
								div.className="card";
								
								
								div.style.gridColumn=2
								var a=document.createElement("a");
								a.className="links"
								
								a.href=qsugg[i].link;
								a.innerHTML="<h3>"+qsugg[i].title+"</h3> <p>"+qsugg[i].desc+"</p>";
								
								
								
								
								
								div.appendChild(a);
								suggestion.appendChild(div);
	
							}
							for(let i=qsugg.length;i<ssugg.length && i+qsugg.length<10;i++){
								var div;
								div=document.createElement("div");
								div.className="card";
								
								
								if(i%2==0){
									div.style.gridColumn=1
								}else{
									div.style.gridColumn=2
								}
								var a=document.createElement("a");
								a.className="links"
								
								a.href=ssugg[i].link;
								a.innerHTML="<h3>"+ssugg[i].title+"</h3> <p>"+ssugg[i].desc+"</p>";
								
								
								
								
								
								div.appendChild(a);
								suggestion.appendChild(div);
							}
						}
						
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
	
		
