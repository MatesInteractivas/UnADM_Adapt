var menu ={};

menu.cfg = {
	//Titulo de la Pagina	
	title : 'Ecs. Difs. de 2o Orden I',
	sections : [
		{	
			title: "Motivación",
			sections: {
				'Ec. Diferenciales Segundo Orden' 				: 'escenas/1_Motivacion_1.html',
			}
		},
		
		{
			title: "Inicio",
			sections : {
				'Definición y características 1'	: 'escenas/2_Inicio_1.html',
				'Definición y características 2'	: 'escenas/2_Inicio_2.html'	,
			}
		},
		
		{
			title : "Desarrollo",
			sections : {
				'Método de Euler 1' 			: 'escenas/3_Desarrollo_1.html'	,
				'Método de Euler 2'				: 'escenas/3_Desarrollo_2.html'	,
				'Aplicación del método de Euler'	: 'escenas/3_Desarrollo_3.html'
			}
		},
	
		{
			title : "Cierre", 
			sections : {
				'Aproximación de soluciones' 						: 'escenas/4_Cierre_1.html'
			}
		},
	],
};
