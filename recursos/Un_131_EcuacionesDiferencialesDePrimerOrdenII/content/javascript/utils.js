$(function(){
/**
 * Lista de escenas desiponibles
 */
var listaEscenas;

/**
 * Lista de botones para la secciones
 */
var liSecciones;

/**
 *  El indice dentro de la lista de la escena que se esta mostrando
 */
var indexActual;

/**
 * Este objeto se usara como arreglo asosiativo para registar variables y sus
 * valores desde las escenas. Tambien de aqui se sacaran las variables para
 * inyectarlas en el applet que la solicite
 * 
 * Ver metodos submitVarsToApplet(), registraVar(nameVar, valueVar)
 */
var hashVariables;

/**
 * El id del contenedor de la aplicacion de descartes 
 */
var idContenedor = 'containerApplet';
var idTitulo = 'pageTitle';

/**
 * Variable para guardar el titulo de la escena
 */
var pageTitle = document.title;

/*
 * Variables temporales para la precarga
 */
var porCargar = 0;
var yaCargado = false;



var loadedToMobile = false;
var cargando = false;
/*
 * ******************************************************************** 
 * Metodos para el manejo de las escenas
 * ********************************************************************
 */


function initPage() { 
	initPageJSON();
	onResizeListener();



	/**
		Vamos a ocultar el menú
	*/
	var strClass= 'header_oculto';
	var $mainContainer = $('#container');
	var $iframe = $("#containerApplet"); 
	var esperandoScroll = false;


	$iframe.load(function (event){
		var doc;
		try{
			doc = $iframe.contents();	
		} catch(e){
			doc = $iframe;
		}
		
		$(doc).on('click',function(event){ 
			$('.submenu').hide(); 
			if(isMobile()){
				var menu = $('#menuContainer');
				menu.hide({
					effect: 'blind', 
					direction : 'left',
					duration  : 500
				});
			}
		});
		$mainContainer.removeClass(strClass);
		if(!isMobile()) return;

		

		var ocultarHeader = function(){
			$mainContainer.addClass(strClass);
			setTimeout(
				function(){esperandoScroll = false;},
				2000 // POr la animacion de ocultar
			);	
		};

		$(doc).on('scroll mousedown',function(eventScroll){
			
			var originalTarget = $(eventScroll.target);
			var saltar = false;


			if(eventScroll.type == 'scroll'){
				var oEvent = eventScroll.originalEvent;
				var iFBoby = oEvent.target.body;
				var scrollY = oEvent.pageY+iFBoby.parentElement.clientHeight;

				if(scrollY >= (iFBoby.clientHeight-20))
					return;
			}
			
			//Buscamos si es que viene de un botón de descartes,
			//esos eventos no los queremos
			for(var i = 0 ; (i < 3) && (originalTarget.attr); i++){
				var classN = originalTarget.attr('class') || '';			
				if(classN.match(/descartes/ig)){
					saltar = true;
					break;
				}
				originalTarget = originalTarget.parent();
			}

			if(saltar)return;

			if(esperandoScroll !== false){
				clearTimeout(esperandoScroll);
			} 
			$mainContainer.removeClass(strClass);	
			esperandoScroll = setTimeout(ocultarHeader,3000);
		});

		ocultarHeader();
	});
}


function initPageUL_JQuery() {
	var firstSeccion = false;
	listaEscenas = new Array();
	var indexT = 0;
	$("ul#listaSecciones > li > span").each(function (index, element){
		var btn = $(element);
		var $ulSub = btn.next();
		var $liList = $('li',$ulSub);
		var btnCont = $('<span>').insertBefore(btn);
		btn.button().appendTo(btnCont);
		
		var ulSubMenu = $ulSub.menu(); 
		ulSubMenu.hide();

		ulSubMenu.appendTo($('#container'));
		ulSubMenu.css('position','absolute');
		ulSubMenu.zIndex(3000);
		var btnMenu = false;
		if($liList.length <=1){
			btn.addClass('noSubmenu');
		} else {
			//Agregando boton de submenu de escenas	
			btnMenu = $("<span>").button({
				text : false,
				icons : {
					primary : "ui-icon-triangle-1-s"
				}
			});
			btnMenu.insertAfter(btn);
			btn.zIndex(btnMenu.zIndex()+1);
			btn.parent().buttonset();
			var total = btnCont.width();
			var menos = btnMenu.width();
			var anchoBtnP = total-menos; 
			btn.css('width', anchoBtnP);
			ulSubMenu.css('min-width',total-10);
			
			btnMenu.click(function() {
				var jsonPosMenu = {};
				var isMob =  isMobile();
				var animDir = '';
				if(isMob){
					jsonPosMenu = {
						my : "left top",
						at : "right top",
						of : '#menuContainer'
					} ;
					var animDir = 'left';
				} else {
					jsonPosMenu = {
						my : "left bottom",
						at : "left top",
						of : btn
					} ;	
					var animDir = 'down';
				}

				if(ulSubMenu.is(":visible")){ ulSubMenu.hide(); return; } 
				$(document).click(); //Cerramos si hay otro menu abierto
				
				ulSubMenu.show();
				ulSubMenu.position(jsonPosMenu);
				ulSubMenu.hide();
				ulSubMenu.show('blind',{direction:animDir});	
									
				$(document).one("click", function() { ulSubMenu.hide(); });
				return false;
			});
		}		

		
		/*
		 * AGREGAMOS LAS FUNCIONES 
		 */
		var firstAnchor = false;
		
		$('li a', ulSubMenu).each(function(index,html_anchor){
			var i = indexT+0;
			var anchor = $(html_anchor); 
			var href = anchor.attr('href');
			var classActive = "seccion-activa";
			anchor.click(function(){
				
				$('#seccionTitle').text(anchor.text());
				$('#seccionTitle').hide();
				$('#seccionTitle').show('slide',{direction:'up'},1000);
				
				var  iframe = $("#"+idContenedor);
				var contenedor = iframe.parent();
				iframe.attr('src','');
				contenedor.hide();
				
				var dir = ["up", "down", "left", "right"];
				var rnd = Math.floor(Math.random() * dir.length);
				dir = dir[rnd];
				indexActual = i;
				contenedor.show('scale',{direction:dir},500,
					function(){
						document.title = menu.cfg.title + ' | ' +btn.text() + ' - ' + anchor.text();
						anchor.closest('ul').hide();
						
						var isMob =  isMobile();
						var href2 = (!isMob)?href:href.replace(/^escenas/i,'escenas_mobile');
						loadedToMobile = isMob;
						//console.log("Vamos a cargar el url : ",href2);
						if(isMob){
							var menuL = $('#menuContainer');
							var isMenuHide = menuL.is(':hidden') || menuL.css('display') == 'none';
							if(!isMenuHide)
								$('#btnShowMenu').click();
						} else {
							$('#menuContainer').show();
						}
						aux_sendChangeCurrentScene(i,anchor);
						cargando = true;	
						iframe.attr('src',href2);
				});
				
				
				$("ul#listaSecciones .ui-button."+classActive).removeClass(classActive); 
				$("li.ui-menu-item  a."+classActive).removeClass(classActive);
				
				anchor.addClass(classActive);
				btn.addClass(classActive);
				if (btnMenu){
					btnMenu.addClass(classActive);
				}
				return false;
			});
			
			if(firstAnchor == false){
				firstAnchor = anchor;
			}
			listaEscenas.push(anchor);
			indexT++;
		});
		
		
		
		
		btn.click(function() { return (firstAnchor == false)?0:firstAnchor.click(); });
		var jsonPosMenu = {
				my : "left bottom",
				at : "left top",
				of : btn
			} ;
		
		
		/*
		 * Para que quede bien acomodado desde el principio
		 */
		ulSubMenu.position(jsonPosMenu);
		if(firstSeccion == false){
			firstSeccion = btn;
		}
	});

	
	
	var  iframe = $("#"+idContenedor);
	iframe.on('load',function(event){
		setTimeout(function(){
			cargando = false;
			//console.log("ESCENA CARGADA",cargando);	
		},500);
	});
	$('#siguiente').on('click',siguienteEscena);
	$('#anterior').on('click',anteriorEscena);
	$('#menuContainer #info').on('click', verDocumentacion);


	/*
		agregamos la funcionalidad al boton de menu
	*/


	$('#btnShowMenu').on('click',showMobileMenu);
	$('#header #info').on('click',verDocumentacion);
	$('#header #creditos').on('click',function(){
		var dInter = $('#containerApplet')[0].contentWindow.document;
		$('#btCopyright',dInter).click();
	});



	ponEscena(0);
}






/**
*/
function initPageJSON() {
	var idTdSecc = 'secciones';
	var tdSecc = document.getElementById(idTdSecc);
	if(!tdSecc || tdSecc == null){
		alert("No se encontro el elemento con ID ["+idTdSecc+"], para crear el menú");
	}

	pageTitle = menu.cfg.title;
	
	var ulElement = document.createElement('ul');
	ulElement.id = 'listaSecciones';
	var lastIL = false;
	for ( var section in menu.cfg.sections) {
		var sectionObj = menu.cfg.sections[section];
		var ilElement = document.createElement('li');
		ulElement.appendChild(ilElement);
		spElement = document.createElement('span');
		spElement.innerHTML = sectionObj.title;
		
		var ulElement2 = document.createElement('ul');
		$(ulElement2).addClass('submenu');
		ilElement.appendChild(spElement);
		ilElement.appendChild(ulElement2);
		
		for ( var subSec in sectionObj.sections) {
			var subSecUrl = sectionObj.sections[subSec];

			var ilElement2 = document.createElement('li');
			ulElement2.appendChild(ilElement2);

			var anchor = document.createElement('a');
			anchor.href = subSecUrl;
			anchor.innerHTML = subSec;
			ilElement2.appendChild(anchor);
		}
		if(lastIL == false)
			ilElement.className = 'first';
		lastIL = ilElement; 
	}
	lastIL.className = 'last';
	
	tdSecc.innerHTML = "";
	tdSecc.appendChild(ulElement);
	initPageUL_JQuery();
}


/*
 * ********************************************************************
 * Funciones para los botones de herramientas
 * ********************************************************************
 */


function verDocumentacion() {
	var cfgWin = "width=800,height=600,resizable=no,location=no,menubar=no,status=no,titlebar=no,toolbar=no,scrollbars=1";
	newW = window.open('info.html', 'documentacion', cfgWin);
	newW.focus();
}

/*
 * ********************************************************************
 * Funciones para la navegacion
 * ********************************************************************
 */

function anteriorEscena() {
	if (indexActual > 0) {
		var nextIndex = Math.max(indexActual - 1, 0);
		ponEscena(nextIndex);
	}
}

function siguienteEscena() {
//	console.log("Siguiente escena : ",indexActual);
	if (indexActual + 1 < listaEscenas.length) {
		var nextIndex = Math.min(indexActual + 1, listaEscenas.length - 1);
		ponEscena(nextIndex);
	}
}

function ponEscena(indexEscena) {
	indexActual = indexEscena;
	var tmpLi = listaEscenas[indexActual];
	if(tmpLi.click){
		tmpLi.click();
		return;
	}

	alert("No se pudo mostrar la escena : "+indexEscena);
}


function aux_sendChangeCurrentScene(indexActual,liElement){
	var iframeC = document.getElementById(idContenedor);
	if (!iframeC) {
		alert("No se pudo encontrar el iframe : '" + idContenedor + "'");
		return;
	}

	$tmpLi = $(liElement);
	$iframeC = $(iframeC); 
	$iframeC.one('load',function(){
		var event = {
			type  : 'lite.unadm.changeCurrentScene',
			scene : {
				idx         : indexActual,
				label       : $tmpLi.text(),
				htmlElement : $tmpLi[0],
			}
		};
		$iframeC.trigger(event);	
	});
}

/*
 * ******************************************************************** 
 * Registro y volcado al applet de variables
 * ********************************************************************
 */

function registraVar(nameVar, valueVar) {
	var arrayNames = nameVar.split(',');
	var arrayValues = valueVar.split(',');

	if (arrayNames.length != arrayValues.length) {
		alert("El numero de elementos de las listas no coincide");
	}

	for ( var i = 0; i < arrayNames.length; i++) {
		var key = arrayNames[i];
		var val = arrayValues[i];

		hashVariables[key] = val;
	}
}

function submitVarsToApplet() {
	var idContenedor = 'containerApplet';
	var iframeAct = document.getElementById(idContenedor);
	var strDump = '';
	for ( var a in hashVariables) {
		var valueTmp = hashVariables[a];
		if (''.match(/^\d+(\.\d+)?/i)) {
			valueTmp = parseFloat(valueTmp);
		} else {
			valueTmp = "'" + valueTmp + "'";
		}
		strDump += a + "=" + valueTmp + "\n";
	}

	var listaApplets = null;
	if (iframeAct.contentDocument)
		listaApplets = iframeAct.contentDocument.getElementsByTagName('applet');
	else
		listaApplets = iframeAct.contentWindow.document
				.getElementsByTagName('applet');

	if (listaApplets.length > 0) {
		var applet = listaApplets[0];
		try {
			applet.undump(strDump);
			applet.refresh();
		} catch (e) {
			alert(e);
		}
	}
}


/*
 * *****************************************************
 * Utils 
 * *****************************************************
 */

/**
*/
function isMobile(){
	var w = 
		window.innerWidth ||
		document.documentElement.clientWidth ||
		document.body.clientWidth;

	var h = 
		window.innerHeight  ||
		document.documentElement.clientHeight ||
		document.body.clientHeight;

	var isMob = !((w >= 980) && (h >= 640));
//	console.log(isMob," Que tamaños tenemos : ",[w,h]);

	return isMob;


}



/**
*/
function onResizeListener(event){

	if(cargando){ return; }	
	var isMob =  isMobile();
	//console.log("onResizeListener : ",isMob, loadedToMobile, cargando);
	/*
	 (a & !b) | ( !a & b) => a != b
	*/
	if(isMob != loadedToMobile){
		cargando = true;
		// No se desea que se cambie la escena al cambiar el tamaño	
		//ponEscena(indexActual);

		var selectTri =  '#listaSecciones li .ui-buttonset .ui-icon';
		selectTri=$(selectTri);


		if(isMob){
			selectTri.removeClass('ui-icon-triangle-1-s').addClass('ui-icon-triangle-1-e');
			var strClass = 'header_oculto';
			var $mainContainer = $('#container');
			$mainContainer.addClass(strClass);
		} else { 
			selectTri.removeClass('ui-icon-triangle-1-e').addClass('ui-icon-triangle-1-s');
			$('#menuContainer').css('display','');
		}
	}
}


function showMobileMenu(event){
	var menu = $('#menuContainer');
	var submenus = $('#container ul.submenu')
	
	var isHide = menu.is(':hidden') || menu.css('display') == 'none';

	submenus.hide();
	if(isHide){
		$('#btnShowMenu').addClass('active');
		menu.show({
			effect: 'blind', 
			direction : 'left',
			duration  : 500
		});	
	} else {
		menu.hide({
			effect: 'blind', 
			direction : 'left',
			duration  : 500
		});
		$('#btnShowMenu').removeClass('active');

	}
	
}


window.setCurrentScene = $.proxy(ponEscena,this);
window.isMobile = isMobile;


/*
 * *****************************************************
 * Agregamos el evento para que se inicie el menú 
 * *****************************************************
 */

$(window).on('resize',onResizeListener);



initPage();

});
