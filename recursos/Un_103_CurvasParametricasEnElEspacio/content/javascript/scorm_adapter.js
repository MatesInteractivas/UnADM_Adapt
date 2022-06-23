$(function(){

	var scormData = {};

	var currentPage	= 0;
	var txtSection	= "";
	var txtEscene	= "";
	var sessionInitTime = 0;



	/**
	*/
	function getIsAllVisited(){
		scormData.exerciseComplete = true;
		console.log("Checando scormData : ",scormData);

		outerloop: 
		for(var i = 0;i < scormData.sections.length ; i++){
			var section =  scormData.sections[i];
			for(var name in section.sections){
				var subSec = section.sections[name];
				if(!subSec.visited){
					scormData.exerciseComplete = false;
					break outerloop;
				}
				console.log("La sección ya esta visitada : ",subSec);
			}
		}
		return scormData.exerciseComplete
	}

	/**
	*/
	function getPercentComplete(isInit){
		var total = 0;
		var nVisited = 0;
		outerloop: 
		for(var i = 0;i < scormData.sections.length ; i++){
			var section =  scormData.sections[i];
			for(var name in section.sections){
				var subSec = section.sections[name];
				if(subSec.visited){
					nVisited++;
				}
				total++;
			}
		}

		if(isInit)
			scormData.pagesCont = total;

		if(nVisited > 0){
			var per = nVisited/total;
			per = Math.round(per * 100) / 100;
			return per;
		}
		return 0;
	}

	/**
	*/ 
	function Finised (){
		onChangeCurrentScene({scene: { idx : currentPage}});
		var suspData = {
			'current' 	: {
				'pageIdx'	: currentPage,
				'buttons'	: { 
					'section'		: txtSection,
					'subSection'	: txtEscene,
				},
			},
			'buttons'			: $.extend(scormData.sections,true),
			'descartes-state'	: $.extend(scormData.descartes,true),
		};

		var lesson_status = 'incomplete';
		var exit = 'suspend';
		
		var allVisited = getIsAllVisited(); 
		console.log("Saliendo del recurso : ",allVisited,scormData.exerciseComplete);
		
		if(allVisited && scormData.exerciseComplete){
			lesson_status = 'completed';
			exit = 'logout';
		}


		console.log("Estatus de salida : ",lesson_status, exit);
		
	//	if(!scormData.onLMS)
	//		return;


		var currTime = new Date();
		
		var sessionElapsedTime = currTime.getTime() - sessionInitTime;
		suspData.session_time = sessionElapsedTime;


		var fHoras = 1000*60*60;
		var fMin = 1000*60
		
		var tmpH = Math.floor(sessionElapsedTime/fHoras);
		sessionElapsedTime -= tmpH*fHoras
		
		var tmpM = Math.floor(sessionElapsedTime/fMin);
		sessionElapsedTime -= tmpM*fMin

		var tmpS = Math.round(sessionElapsedTime/1000);



		tmpH = "0000"+tmpH;
		tmpH = tmpH.substr(tmpH.length - 4);
		tmpM = "00"+tmpM;
		tmpM = tmpM.substr(tmpM.length - 2);

		tmpS = "00"+tmpS;
		tmpS = tmpS.substr(tmpS.length - 2);
		sessionElapsedTime = tmpH+":"+tmpM+":"+tmpS+".00";


		console.log("TIempo de sesion : \n"+suspData.session_time+"\n"+sessionElapsedTime);

		doLMSSetValue('cmi.core.lesson_location', JSON.stringify(suspData.current));
		doLMSSetValue('cmi.core.lesson_status'	, lesson_status);
		doLMSSetValue('cmi.core.exit'			, exit);
		doLMSSetValue('cmi.suspend_data'		, JSON.stringify(suspData));
		doLMSSetValue('cmi.core.session_time'	, sessionElapsedTime);
		
		doLMSFinish("");

	}
	
	/**
	*/
	function Startup(){
		currentPage = 0;

		scormData.onLMS = doLMSInitialize("") == 'true';
		scormData.exerciseComplete = false;
		scormData.eval = {};
		
		sessionInitTime = (new Date()).getTime();

		getPercentComplete(true); // Init idx and pages count;
		var entryState =  doLMSGetValue("cmi.core.entry");
		if(scormData.onLMS && entryState == 'resume'){
			var current = doLMSGetValue('cmi.core.lesson_location');
			if(current.length > 0 && (current = JSON.parse(current))){
				currentPage = current.pageIdx;
				var suspDataStr = doLMSGetValue('cmi.suspend_data');
				
				//Checamos si hay información de un sección previa 
				suspData = (suspDataStr.length > 0)?JSON.parse(suspDataStr):{sections : []};
				
				console.log("Obtuvimos del LMS : ",suspData,currentPage);
				// Llenamos si ya lo visito en un intento anterior  
				for(var i = 0; i < suspData.buttons.length ; i++){
					var suspendSec = suspData.buttons[i];
					var section =  scormData.sections[i];
					for(var name in suspendSec.sections){
						var suspend_subSec	= suspendSec.sections[name];
						var original_subSec	= section.sections[name];
						original_subSec.visited	= suspend_subSec.visited;
						original_subSec.time = $.extend({},suspend_subSec.time);
					}
				}

				var descartes = suspData['descartes-state'];
				scormData.descartes = $.extend({},descartes);
			}
			// cmi.core.lesson_location
			// cmi.core.lesson_status (passed,completed,failed,	incomplete, browsed,not attempted)
			// cmi.core.entry (ab-initio,"resume", '')
			// cmi.core.score.min
			// cmi.core.score.max
			// cmi.core.score.row
			// cmi.core.exit (time-out,"suspend"****,"logout")
			// cmi.suspend_data (time-out,"suspend"****,"logout")
			console.log("Vamos a checar student_name", doLMSGetValue("cmi.core.student_name"));
			setCurrentScene(currentPage);
			checkObjectives();
		} else {
			console.log('No se pudo contactar o es una sesión nueva con el LMS',scormData.onLMS,entryState);
		}
	}


	/**
	*/
	function onChangeCurrentScene (evt) {

		//console.log("Vamos a cambiar paginas : ",currentPage+'', evt.scene.idx+'')
		var prevCfgObj = getSCORMSceneCfgAt(currentPage);	
		var currentCfg = getSCORMSceneCfgAt(evt.scene.idx);	
		//console.log("Se estableció el final como : \n",currentCfg,'\n',prevCfgObj);

		var currTime =  new Date().getTime();


		currentCfg.page.ref.visited	= true;
		currentCfg.page.ref.time = {init:currTime , end:-1};
		txtEscene		= currentCfg.page.name;
		txtSection		= currentCfg.section.title;

		currentPage = evt.scene.idx;
		prevCfg = prevCfgObj.page.ref; 
		if(!prevCfg.time){
			console.log("No tenia tiempo ",prevCfg);
			prevCfg.time = {init: currTime, end: currTime};
		}
		prevCfg.time.end = currTime;

		
		prevCfg.time.elapsed = prevCfg.time.end - prevCfg.time.init;

	};


	/**
	*/
	function getSCORMSceneCfgAt(idx){
		for(var i = 0;i < scormData.sections.length ; i++){
			var section =  scormData.sections[i];
			for(var name in section.sections){
				var subSec = section.sections[name];
				if(subSec.idx == idx){
					return {
						section : {'title' : section.title},
						page : {'name': name, 'ref' : subSec},
					};
				}	
			}
		}
	}

	/**
	*/
	function initScormAdapter() {
		var count = 0;
		scormData = {sections:[], descartes:{} };
		for(var i = 0;i < menu.cfg.sections.length ; i++){
			var secOrig =  menu.cfg.sections[i];
			var section = {title : secOrig.title, sections : {} };
			for(var name in secOrig.sections){
				var subSec = {};
				subSec.url = secOrig.sections[name];
				subSec.visited = false;
				subSec.time = {};
				subSec.idx = count;

				section.sections[name] = subSec;
				count++;
			}
			scormData.sections[i] = section;
		}
		
		// ATTACH EVENTS TO FUNCTIONS
		var $Window = $(window);
		$Window.on('load', Startup);
		$Window.on('unload', Finised);
		$Window.on('beforeunload', Finised);

		scormData.exerciseComplete = false;
		var eventName	= "lite.unadm.changeCurrentScene";
		var $iframeC	= $('#containerApplet');
		$iframeC.on(eventName,onChangeCurrentScene);

		/**
		$Window.on('beforeunload',function(event) {
		    return 'Are you sure you want to quit?';
		});	
		*/
	}

	/*
	**/
	function checkObjectives(){
		var objectivesList = [];
		var obj_count = parseInt(doLMSGetValue('cmi.objectives._count'), 10);
		for (var i = obj_count - 1; i >= 0; i--) {
			var objectiveId = 'cmi.objectives.'+i+'.';
			var objectiveObj = {}; 
			objectiveObj.score = {};
			
			objectiveObj.id			= doLMSGetValue(objectiveId+'id');
			objectiveObj.score.min	= doLMSGetValue(objectiveId+'score.min');
			objectiveObj.score.max	= doLMSGetValue(objectiveId+'score.max');
			objectiveObj.score.raw	= doLMSGetValue(objectiveId+'score.raw');
			objectivesList.push(objectiveObj);
		}
		console.log("Que tenemos en los objetivos ["+obj_count+"]:\n",objectivesList);
	}


	/**
	*/
	function getCurrentSCORMState(){
		return scormData;
	}

	function getCurrentPage(){
		return currentPage;
	}
	window.getCurrentPage = getCurrentPage;
	window.getCurrentSCORMState = getCurrentSCORMState;
	window.checkObjectives = checkObjectives;
	window.checkFinish = Finised;
/*******************************************************************
*                              INICIALIZAMOS                       *
********************************************************************/
initScormAdapter();	
});