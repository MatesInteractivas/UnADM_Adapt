var menu ={};

menu.cfg = {
	//Titulo de la Pagina	
	title : 'Operaciones aritméticas en otras bases',
	sections : [
		{	
			title: "Motivación",
			sections: {
				'Sumando y restando en otras bases'		: 'escenas/1_Motivacion_1.html',
				'Ejemplos de sumas en otra base'		: 'escenas/1_Motivacion_2.html',
			}
		},
		
		{
			title: "Inicio",
			sections : {
				'Sumas y restas en binario'				: 'escenas/2_Inicio_1.html',
				'Sumas y restas en hexadecimal'	 		: 'escenas/2_Inicio_2.html',
			}
		},
		
		{
			title : "Desarrollo",
			sections : {
				'Cálculos en binario' 			: 'escenas/3_Desarrollo_1.html'	,
				'Cálculos en hex'				: 'escenas/3_Desarrollo_2.html'	,
				'Productos en hex (un ejemplo)'	: 'escenas/3_Desarrollo_3.html'	,
			}
		},
	
		{
			title : "Cierre", 
			sections : {
				'Reaprendiendo a operar'		: 'escenas/4_Cierre_1.html'	,
			}
		},
	],
};