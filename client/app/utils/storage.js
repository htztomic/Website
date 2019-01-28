export function getFromStorage(key){
	if(!key){
		return null;
	}
	try{
		const token = localStorage.getItem(key);
		if(token){
			return JSON.parse(token);
		}
		return null
	}catch(err) {
		return null
	}
}

export function setInStorage(key, obj){
	if(!key){
		console.log('Error: key is missing');
	}
	try{
		localStorage.setItem(key, JSON.stringify(obj));
	} catch(err) {
		console.log(err)
	}
}