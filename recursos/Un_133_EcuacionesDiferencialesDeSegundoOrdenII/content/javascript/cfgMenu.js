var menu ={};

menu.cfg = {
	//Titulo de la Pagina	
	title : 'Ec. Difs. 2o orden II',
	sections : [
		{	
			title: "Motivación",
			sections: {
				'Aplicación de ecuaciones diferenciales' 				: 'escenas/1_Motivacion_1.html',
			}
		},
		
		{
			title: "Inicio",
			sections : {
				'Osciladores y la ecuación de segundo orden'	: 'escenas/2_Inicio_1.html',
				'Tipos de osciladores'	 	: 'escenas/2_Inicio_2.html'	,
			}
		},
		
		{
			title : "Desarrollo",
			sections : {
				'Solución algebraica del oscilador' 	: 'escenas/3_Desarrollo_1.html'	,
				'Solución numérica del oscilador'		: 'escenas/3_Desarrollo_2.html'	,
				'Solución del oscilador amortiguado'	: 'escenas/3_Desarrollo_3.html'	,
			}
		},
	
		{
			title : "Cierre", 
			sections : {
				'Mecánica y electricidad' 				: 'escenas/4_Cierre_1.html'	,
			}
		},
	],
};
