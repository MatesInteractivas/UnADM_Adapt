var menu ={};

menu.cfg = {
	//Titulo de la Pagina	
	title : 'Árboles y algoritmos',
	sections : [
		{	
			title: "Motivación",
			sections: {
				'Algo de historia' 	: 'escenas/1_Motivacion_1.html',
			}
		},
		
		{
			title: "Inicio",
			sections : {
				'Introducción'	: 'escenas/2_Inicio_1.html',
			}
		},
		
		{
			title : "Desarrollo",
			sections : {
				'Árboles' 			: 'escenas/3_Desarrollo_1.html'	,
				'Árboles con raíz' 		: 'escenas/3_Desarrollo_2.html'	,
				'Árboles recubridores' 		: 'escenas/3_Desarrollo_3.html'	,
			}
		},
	
		{
			title : "Cierre", 
			sections : {
				'Algoritmo de Kruskal' 		: 'escenas/4_Cierre_1.html'	,
				'Algoritmo de Prim' 		: 'escenas/4_Cierre_2.html'	,
			}
		},
	],
};
