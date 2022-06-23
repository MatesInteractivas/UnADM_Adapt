var menu ={};

menu.cfg = {
	//Titulo de la Pagina	
	title : 'Introducción a la lógica matemática',
	sections : [
		{	
			title: "Motivación",
			sections: {
				'Lógica' 				: 'escenas/1_Motivacion_1.html',
			}
		},
		
		{
			title: "Inicio",
			sections : {
				'Lógica matemática'				: 'escenas/2_Inicio_1.html',
				'Notaciones y conectivos'	 	: 'escenas/2_Inicio_2.html'	,
			}
		},
		
		{
			title : "Desarrollo",
			sections : {
				'Tablas de verdad'						: 'escenas/3_Desarrollo_1.html'	,
				'Demostración con tablas de verdad'		: 'escenas/3_Desarrollo_2.html'	,
				'Ejercicio, tablas de verdad'			: 'escenas/3_Desarrollo_3.html'	,
				'Proposiciones lógicas'					: 'escenas/3_Desarrollo_4.html'	,

			}
		},
	
		{
			title : "Cierre", 
			sections : {
				'Demostración por contrarrecíproca' 	: 'escenas/4_Cierre_1.html'	,
			}
		},
	],
};
