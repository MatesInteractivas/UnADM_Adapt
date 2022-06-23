var menu ={};

menu.cfg = {
	//Titulo de la Pagina	
	title : 'Cambio de base',
	sections : [
		{	
			title: "Motivación",
			sections: {
				'Sistemas binarios y el cerebro'		: 'escenas/1_Motivacion_1.html',
				'Computación y el sistema binario'		: 'escenas/1_Motivacion_2.html',
			}
		},
		
		{
			title: "Inicio",
			sections : {
				'Base binaria, decimal y hexadecimal'	: 'escenas/2_Inicio_1.html',
				'Base binaria vs decimal'	 			: 'escenas/2_Inicio_2.html',
				'Base hexadecimal vs decimal'			: 'escenas/2_Inicio_3.html',
				'Recapitulando'							: 'escenas/2_Inicio_4.html',
			}
		},
		
		{
			title : "Desarrollo",
			sections : {
				'De binario a decimal' 			: 'escenas/3_Desarrollo_1.html'	,
				'De decimal a binario'			: 'escenas/3_Desarrollo_2.html'	,
				'De hexadecimal a decimal'		: 'escenas/3_Desarrollo_3.html'	,
				'De decimal a hexadecimal'		: 'escenas/3_Desarrollo_4.html'	,
			}
		},
	
		{
			title : "Cierre", 
			sections : {
				'Razón de las bases y su utilidad'		: 'escenas/4_Cierre_1.html'	,
			}
		},
	],
};