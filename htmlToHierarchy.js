define([], function(){

	return function (html){
		// key method
		// Converts an HTML string into one node object
		// with a hierarchy of children.
		// The result is still in string form but broken into
		// the proper structure
		var
			tags,
			lastType,
			limit = 10,
			startTagRegExp,
			endTagRegExp,
			nodes = [],
			nodeObject = {},
			current,
			id = 0,
			//commentRegExp = /(<!--(.|\s){1,}?-->)/gi,
			startTagRegExp = /<\/?\w+\s+[^>]*>/g,
			endTagRegExp = /<\/\w*>/,
			newlineRegExp = /[\n\t]/g;
			
		function uid(){
			return 'n-' + (id++);
		}
		
		function getChild(){
			var o = {
				id: uid()	
			};
			nodes.push(o);
			if(current){
				if(!current.children){ current.children = []; }
				current.children.push(o);
				o.parentId = current.id;
			}
			current = o;
			return current;
		}
		
		function getParent(){
			if(current.parentId){
				for(var i = 0; i < nodes.length; i++){
					if(nodes[i].id === current.parentId){
						current = nodes[i];
						break;
					}
				}
			}
			return current;
		}
		
		function indexes(){
			return {
				open: html.search(startTagRegExp),
				end: html.search(endTagRegExp)
			};
		}
		
		
		while(html.length){
			if(limit-- < 0){console.log('LIMIT!!');break;}
			
			// clear RegExp index
			startTagRegExp.lastIndex = 0;
			endTagRegExp.lastIndex = 0;
				
			html = html.trim().replace(newlineRegExp, '');
			
			tags = indexes();
			
			if(tags.open === 0){
				nodeObject = getChild();
				nodeObject.opentag = startTagRegExp.exec(html);
				//console.log('openttage', nodeObject.opentag[0]);
				nodeObject.opentag = nodeObject.opentag[0];
				html = html.substring(nodeObject.opentag.length, html.length);
				lastType = 'open';
			}
				
			tags = indexes();
			
			if(tags.open === 0){
				// next node
				continue;
			}
			
			if(tags.end > 0){
				// inner text
				nodeObject.innerText = html.substring(0, tags.end);
				//console.log('  text', nodeObject.innerText);
				html = html.replace(nodeObject.innerText, '');
				lastType = 'text';
			}
			
			tags = indexes();
			
			if(tags.end === 0){
				// starting with a closing tag
				if(lastType === 'close'){
					nodeObject = getParent();
				}
				nodeObject.closetag = endTagRegExp.exec(html);
				nodeObject.closetag = nodeObject.closetag[0];
				html = html.substring(nodeObject.closetag.length, html.length);
				lastType = 'close';
				
				nodeObject = getParent();
			}
			
		
		}
		//console.log('\n\n\n TREE PARSED', nodes.length);
		//nodes.forEach(function(n){
		//	console.log(n);
		//});
		//console.log('\n\n\n');
		return nodes[0];
	};
	
});