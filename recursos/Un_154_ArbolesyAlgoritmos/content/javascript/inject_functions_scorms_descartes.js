function setSCROMPercentage(percentage){
	console.log(" ***** Se va a registrar el porcentaje : "+ percentage+"%");


	if(!parent.doLMSSetValue || !parent.getCurrentSCORMState){
		console.log("No se pudo contactar al LMS");
		return -1;
	}


	var scormData = parent.getCurrentSCORMState();
	var currPageIdx = parent.getCurrentPage();

	var currPage = false;
	var count = 0; 

	exitLoop: 
	for(var i = 0;i < scormData.sections.length ; i++){
		var section =  scormData.sections[i];
		for(var name in section.sections){
			var subSec = section.sections[name];
			if(count == currPageIdx){
				currPage = subSec;
				break exitLoop;
			}
			count++;
		}
	}
	
	if(!currPage){
		console.log("No se pudo determinar el current page");
		return -1;
	}

	var obj_count = parseInt(parent.doLMSGetValue('cmi.objectives._count'), 10);
	var err = parseInt(parent.doLMSGetLastError(), 10);
	var newID = currPage.url.replace(/\//g,'-');

	console.log("Que vamos a procesar : \n\n*****",currPage,'\n\n*** El nuevo ID ',newID,'\n\n***** Cuantos hay : '+obj_count);

	if(err > 0 ){
		var err_str = parent.doLMSGetErrorString();
		console.log('Hubo un error al registrar la actividad : ',err_str);
		return -1;
	}
	
	var idxObj = -1;
	var strDebug = "";
	var yaEsta = false;
	for (var i = obj_count - 1; i >= 0; i--) {
		var id = parent.doLMSGetValue('cmi.objectives.'+i+'.id');
		strDebug += "["+id+"=="+newID+"]\n";
		if(id == newID){
			idxObj = i;
			yaEsta = true;
			break;
		}
	}

	
	
	
	if(!yaEsta){
		idxObj = obj_count;
	}

	var objectiveId = 'cmi.objectives.'+idxObj+'.';
	
	parent.doLMSSetValue(objectiveId+'id', newID);
	//console.log("Vamos a registrar el cambio ",obj_count);
	parent.doLMSSetValue(objectiveId+'score.min', 0);
	parent.doLMSSetValue(objectiveId+'score.max', 100);
	parent.doLMSSetValue(objectiveId+'score.raw', percentage);

	currPage.gradoCompletado = percentage;
	return 1; // procura regresar siempre un valor numerico o de cadena, para evitar errores internos

}

/**
*/
function getSCORMVariable(varName){

	var value = 0;
	try{
		var scormData = parent.getCurrentSCORMState();
		var value = scormData.descartes[varName];
		if(value && value != NaN){
			var valNum = Number(value);
			if(!isNaN(valNum))
				value = valNum;
		} else {
			value = 0 ;
		}
		console.log("Se pide de entrada : ",varName,value);
	}catch(e){
		console.log("No se pudo recuperar la variable: ",varName,e);
	}
	return value;
}

/**
*/
function saveSCORMDescartesState(evt){
	var scormData = parent.getCurrentSCORMState();
	
	if (typeof descartesJS == 'undefined')
		return;

  	for (var i = descartesJS.apps.length - 1; i >= 0; i--) {
  		var descApp = descartesJS.apps[i];
  		console.log(" **** **** ",descApp);

  		if(!descApp.evaluator.functions.getSCORMState)
  			continue;


  		var tmpres = descApp.evaluator.functions.getSCORMState();
		console.log("Que vamos a procesar  : ", tmpres);

  		var expretions = tmpres.split('@');
  		for (var j = expretions.length - 1; j >= 0; j--) {
  			var exprStr = expretions[j];
  			var expr = exprStr.split(':');
			scormData.descartes[expr[0]]=expr[1];
				
  		};
	}
	console.log("////// Que guardamos en el estado : ", scormData);  	
	return 'DONDEODENO ASDIOA KHKAS';
}


/**
*/
function updateSCORMDescartesState(){
	saveSCORMDescartesState({});	
	return 'DONDEODENO ASDIOA KHKAS';
}

/**
*/
function addBtnShowHeader(){
	var descAppsCont = descartesJS.apps[0].container;
	var body = document.body;
	var bodyS = [body.offsetWidth-20, body.offsetHeight-20];
	var descSize = [descAppsCont.offsetWidth,descAppsCont.offsetHeight];
			
	var doAddBtn = 
		(bodyS[0] <= descSize[0]) &&
		(bodyS[1] <= descSize[1]);


		console.log("Checamos los tamaños : ",
			bodyS,
			descSize,
			doAddBtn);
	if(doAddBtn){
		var btn = document.createElement('button');
		btn.setAttribute('id', 'btnShowHeaderMenu');
		body.appendChild(btn);

		//No se necesita llamar nada, se propaga al padre y ya tiene
		//el evento de click para el menu
		btn.addEventListener('click', function(event){});


	}

}



/**
*/
function initDescartesInjection (){
	var doBtn = false;
	try{
		descartesJS.Parser.prototype.registerExternalValues = function() {
			this.functions["goToAnchor"] = function(anchorId) {
				window.location = (""+window.location).replace(/#[A-Za-z0-9_]*$/,'')+"#"+anchorId;
			}

			this.functions["setSCORMPercentage"]	= setSCROMPercentage;
			this.functions['getSCORMStateVar']		= getSCORMVariable;
			this.functions['updateSCORMState']		= updateSCORMDescartesState;	

		}

		if(parent.isMobile()){
			doBtn = true;
			addBtnShowHeader();	
		}


	} catch(e){
		if(doBtn)
			console.log("Que paso : ",e);
		setTimeout(initDescartesInjection,100);
		return;
	}

	/**
	*/
	doBtn = false;
	var hecho = false;
	window.addEventListener("descartesReady", function(evt) {
		// Para que las funciones se carguen en el parser 
		if(hecho) return;
		setTimeout(function(){
			hecho = true;
	      	for (var i = descartesJS.apps.length - 1; i >= 0; i--) {
	      		descartesJS.apps[i].init();
	      	}},100);
   });

	window.addEventListener('load', function(evt){
		console.log("Vamos a agregar eventos ");
		window.addEventListener('unload', saveSCORMDescartesState);
		window.addEventListener('beforeunload', saveSCORMDescartesState);
	});
};


window.addEventListener('beforeunload', function(event) {
	saveSCORMDescartesState(event);
	console.log('I am the 2nd one.');
	
});
window.addEventListener('unload', function(event) {
	saveSCORMDescartesState(event);
	console.log('I am the 4th and last one…');
});


initDescartesInjection();
