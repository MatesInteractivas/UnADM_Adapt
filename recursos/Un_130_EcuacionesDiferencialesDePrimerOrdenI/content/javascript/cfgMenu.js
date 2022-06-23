var menu ={};

menu.cfg = {
	//Titulo de la Pagina	
	title : 'Ecs. Difs. de 1er orden 1',
	sections : [
		{	
			title: "Motivación",
			sections: {
				'Uso de ecuaciones diferenciales' 			: 'escenas/1_Motivacion_1.html',
				'¿Qué son las ecuaciones diferenciales?' 	    : 'escenas/1_Motivacion_2.html',
			}
		},
		
		{
			title: "Inicio",
			sections : {
				'Definición de ecuación diferencial'		: 'escenas/2_Inicio_1.html',
				'Solución de ecuaciones diferenciales'	 	: 'escenas/2_Inicio_2.html'	,
			}
		},
		
		{
			title : "Desarrollo",
			sections : {
				'Representación gráfica' 			: 'escenas/3_Desarrollo_1.html'	,
				'Sistemas dinámicos'				: 'escenas/3_Desarrollo_2.html'	,
				'Solución al modelo poblacional'	: 'escenas/3_Desarrollo_3.html'	,
				}
		},
	
		{
			title : "Cierre", 
			sections : {
				'Decaimiento radiactivo'	: 'escenas/4_Cierre_1.html'	,
			}
		},
	],
};
