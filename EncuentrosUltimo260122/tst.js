let dim = Math.min(window.innerWidth, window.innerHeight) * 0.85;

let mil = 0;
let seed = get_seed(tokenData.hash);
let hash_ints = hash_to_ints(tokenData.hash);
let hash_normalized_strings = hash_ints.map((val, idx) => map_v_str(idx, 0.0, 1.0));

let rawParams = setupParametersFromTokenData(tokenData)

let paletas = [
{w: 800, nombre: "alebrije", colores: ["#ce2724", "#f3ec19", "#207c88", "#f53b69","#fff9ea","#008457",],},
{w: 800, nombre: "barragan", colores: ["#fc4d21", "#cf6799", "#ffd900", "#8894ac", "#f0f1eb","#f20072", "#207c88", "#f53b69","#fff9ea"],},
{w: 800, nombre: "bauhaus", colores: ["#fff9ea", "#ed1c24","#d93036","#3a80c9","#2d5de0","#ffd900","#ffcd17","#b1d4e5",],},
{w: 800, nombre: "metro", colores: ["#007ac3", "#ffe01a", "#008457", "#f79239", "#008457","#ed1c24","#fff9ea"],},
{w: 800, nombre: "veracruz", colores: ["#01295c","#fdbd10","#f7d372","#2286e3","#f5d800","#3e8fb5","#7fccf5","#6197e8",],},
{w: 800, nombre: "centroVer",colores: ["#57837B", "#06c4a2","#f29402","#fff9ea","#f2e202",],},
{w: 800, nombre: "puebla", colores: ["#FEDEB8", "#ABDACB","#FDFD00","#FD4126","#2C4743",],},
{w: 800, nombre: "mar", colores: ["#123962","#2754ba","#00aee6","#799eb2","#b1d4e5","#fefefe","#ffb900",],},
{w: 800, nombre: "calor", colores: ["#CA382B","#E4D4B3","#B3A692","#938775","#373634","#ed1b2e","#ff6a00"],},
];

let puntosFlow = [
{
    w: 800, nombre: ["poligono"],
    geometrias: [3,4],
    geometriasCent: [2,3,4],
    intensidad: [0.8,1,1.15],
    tipo: ["curvo","recto"],
    flowVal: ["marea","turbulencia"],
    rotacion: ["iguales","diferentes"],
    esquemaColor: ["color0","color1","color2","color3","color4","color5","color6",],
    valorFlow: ["flow0","flow1"],
    valorCrecimiento: [1.25,1.4,1.5,2,3],
    tipoCrecimiento: ["igual","combinado"],
},

{
    w: 800,
    nombre: ["reticula"],
    retic: [1,2,3],
    geometrias: [3,4],
    geometriasCent: [2,3,4],
    intensidad: [0.8,1,1.15],
    tipo: ["curvo","recto"],
    flowVal: ["marea","turbulencia"],
    orden: ["ordenado","noOrdenado","noOrdenadoX","noOrdenadoY"],
    rotacion: ["iguales","diferentes"],
    esquemaColor: ["color0","color1","color2","color3","color4","color5","color6",],
    valorFlow: ["flow0","flow1"],
    valorCrecimiento: [1.3,1.4,1.5,2,3],
    tipoCrecimiento: ["igual","combinado"],
},
];

let gridPuntos = [
{
    w: 800,
    nombre: "reticula",
    orden: ["ordenado","noOrdenado","noOrdenadoX","noOrdenadoY","noOrdenadoXX","noOrdenadoYY"],
    tamanoElipse: ["iguales","diferentes",],
    gridOrden: ["iguales","diferentes"],
},
{
    w: 800,
    nombre: "aleatorio",
    tamanoElipse: ["iguales","diferentes",],
},
];


//iniciales
var pg;
var pg0;
var listaMarco = [25,50,75];
var gridPts = rand_choice_obj(gridPuntos);
var flow = rand_choice_obj(puntosFlow);
var paletaColor = rand_choice_obj(paletas);
var paletaColor0 = rand_choice_obj(paletas);
var paletaColor1 = rand_choice_obj(paletas);

//gridPts
var gridptx = [];
var gridpty = [];
let circles = [];
var combinacionOjitos = [];
var tamanaoOjitos = [];
var mixOjitos = [];
var mixOjitos0 = [];

//flowPts
var flowptx = [];
var flowpty = [];
var intensidad;
var florGrosorCombinado = [];
var reduccionGrosorCombinado = [];

//generales
var rotGeneral;
var scl;
var sinVal;
var transicionColor;
var intensidadFlow;
var intensidadFlow0;
var turbulencia;
var intensidadEncuentro;
var intensidadEncuentro0;
var cambioColor;
var val0;

//estiloFinal
var grosorLineaIgual;
var grosorLinea = [];
var reduccionGorosor = [];
var blendCol = [];
var blendCol0 = [];
var transparencia = [];
var _valorFlow;
var col = [];
var colorFinal = [];
var colorEsquema0 = [];
var colorEsquema1 = [];
var colorEsquema2;
var colorEsquema3 = [];
var colorEsquema4 = [];
var colorEsquema5 = [];
var colorEsquema6 = [];
var flowSelec;
var combinado;


var hh = dim*1.4;
function setup(){
 createCanvas(dim, hh);
 pixelDensity(2);
 noiseSeed(hash_ints[0]);
 randomSeed(hash_ints[1]);

 combinado = int(rand_between(0,2));

 if(combinado == 0){
    for(var i = 0; i<paletaColor.colores.length; i++){colorFinal = append(colorFinal,paletaColor.colores[i]);}
}
if(combinado == 1){
  for(var i = 0; i<paletaColor.colores.length; i++){colorFinal = append(colorFinal,paletaColor.colores[i]);}
      for(var i = 0; i<paletaColor0.colores.length; i++){colorFinal = append(colorFinal,paletaColor0.colores[i]);}
  }
colorFinal = shuffleArray(colorFinal),colorFondo = rand_choice(colorFinal);
var colorFondoFinal = lerpColor(color(colorFondo),color("#fff9ea"),0.3);

background(colorFondoFinal);

pg = createGraphics(dim,hh);
pg0 = createGraphics(dim,hh);

console.log("hash: " + tokenData.hash);

rotGeneral = rand_between(0,TWO_PI);
scl = rand_between(350,500);
sinVal = rand_between(0.002,0.006);
transicionColor = 70;
intensidadFlow = rand_between(1,1.5);
intensidadFlow0 = int(rand_between(4,6));
turbulencia = rand_between(1.5,3.5);
intensidadEncuentro = rand_between(0.1,0.5);
intensidadEncuentro0 = intensidadFlow/rand_between(1,2);
cambioColor = int(rand_between(4,5));
val0 = int(rand_between(5,15));

var total = int(rand_between(50,100));
var tamanoElipse = rand_choice(gridPts.tamanoElipse);
var tamanaoOjitosIguales = rand_between(8,12);
if(gridPts.nombre == "reticula"){

    console.log("grid estatico: ojitos reticula");

    var orden = rand_choice(gridPts.orden);
    var gridOrden = rand_choice(gridPts.gridOrden); 
    var stepx = int(rand_between(3,5));
    var stepy = int(rand_between(3,5));
    var numb; 
    var numb0; 

    console.log("orden: " + orden);

    if(gridOrden == "iguales"){numb = dim/stepx, numb0 = dim/stepx}
        if(gridOrden == "diferentes"){numb = dim/stepx, numb0 = dim/stepy}

            for(var i = numb/2; i<dim; i+=numb){
                var randx = rand_between(-numb/3,numb/3), randyy = rand_between(-numb0/3,numb0/3);
                for(var j = numb0/2; j<dim; j+=numb0){
                    var x = i;
                    var y = j;
                    if(orden == "ordenado"){gridptx = append(gridptx,i), gridpty = append(gridpty,j+hh/6);}
                    if(orden == "noOrdenado"){gridptx = append(gridptx,i+rand_between(-numb/4,numb/4)), gridpty = append(gridpty,j+rand_between(-numb0/3,numb0/3)+hh/6);}         
                    if(orden == "noOrdenadoX"){gridptx = append(gridptx,i+rand_between(-numb/4,numb/4)), gridpty = append(gridpty,j+hh/6);}         
                    if(orden == "noOrdenadoY"){gridptx = append(gridptx,i), gridpty = append(gridpty,j+rand_between(-numb0/3,numb0/3)+hh/6);}
                    if(orden == "noOrdenadoXX"){gridptx = append(gridptx,i+randx), gridpty = append(gridpty,j+hh/6);}         
                    if(orden == "noOrdenadoYY"){gridptx = append(gridptx,i), gridpty = append(gridpty,j+hh/6+randyy);}                  
                    if(tamanoElipse == "iguales"){tamanaoOjitos = append(tamanaoOjitos,tamanaoOjitosIguales);}
                    if(tamanoElipse == "diferentes"){tamanaoOjitos = append(tamanaoOjitos,rand_between(8,12));}
                    combinacionOjitos = append(combinacionOjitos,rand_dec());
                    mixOjitos = append(mixOjitos,rand_dec());
                    mixOjitos0 = append(mixOjitos0,rand_dec());
                }
            }
        }

        if(gridPts.nombre == "aleatorio"){
            console.log("grid estatico: ojitos aleatorios");
            var yy1 = dim*1.5;
            for (let k = total; k > 0; k -= 1) {
                let circle = {
                  x: rand_between(75,dim-75),
                  y: rand_between(75,dim-75),
                  r: rand_between(15,100),
              };
              let overlapping = false;
              for (let j = 0; j < circles.length; j++) {
                  let other = circles[j];
                  let d = distance(circle.x, circle.y, other.x, other.y);
                  if (d < circle.r + other.r) {
                    overlapping = true;
                    break;
                }
            }
            if (!overlapping) {
              circles.push(circle);
          }
      }
      console.log("total ojitos: "+circles.length);
      for (let i = 0; i < circles.length; i++) {
        gridptx = append(gridptx,circles[i].x);
        gridpty = append(gridpty,circles[i].y+hh/6);
        combinacionOjitos = append(combinacionOjitos,rand_dec());
        if(tamanoElipse == "iguales"){tamanaoOjitos = append(tamanaoOjitos,tamanaoOjitosIguales);}
        if(tamanoElipse == "diferentes"){tamanaoOjitos = append(tamanaoOjitos,rand_between(8,12));}
        mixOjitos = append(mixOjitos,rand_dec());
        mixOjitos0 = append(mixOjitos0,rand_dec());

    }
}

if(flow.nombre == "poligono"){
    var geometriaGrid = rand_choice(flow.geometriasCent);  
    esquemaColor = rand_choice(flow.esquemaColor);

    consolaSalida(esquemaColor,geometriaGrid,0);

    var rotacionPoligonos = rand_between(0,TWO_PI);

    console.log("total de poligonos: " + geometriaGrid)
    var rotacionGrid = rand_between(0,TWO_PI);
    var rotacionGrid0 = rand_between(-PI/4,PI/4);
    lineasOffset = rand_choice(flow.tipoCrecimiento);
    rotacion = rand_choice(flow.rotacion);

    if(lineasOffset == "igual"){valorOffset = rand_choice(flow.valorCrecimiento);}
    if(lineasOffset == "combinado"){valorOffset = rand_choice(flow.valorCrecimiento);}
    if(rotacion == "iguales"){rotacionPoligonos = rand_between(0,TWO_PI);} 

    for(var ii = 0; ii<TWO_PI; ii+=TAU/geometriaGrid){
        if(rotacion == "diferentes"){rotacionPoligonos = rotacionPoligonos+rand_between(-PI/2,PI/2);} 
        var geometria = rand_choice(flow.geometrias); 

        colorEsquema0 = rand_choice(colorFinal);

        var numb1 = dim/1, numb2 = dim/2;
        var centrox, centroy;
        var tamanoGrid;
        var tamanoGeo = numb2/rand_between(rand_between(1,1.1),1.4); //1
        var tamanoGeoFinal;
        _valorFlow = rand_choice(flow.valorFlow);
        tipo = rand_choice(flow.tipo);
        flowVal = rand_choice(flow.flowVal);

        if(geometriaGrid == 2){tamanoGrid = dim/rand_between(3,4);}
        if(geometriaGrid == 3){var rand01 = rand_between(2.4,3.8), tamanoGrid = dim/rand01;}
        if(geometriaGrid == 4){var rand01 = rand_between(2.3,3.5), tamanoGrid = dim/rand01;}
        if(geometriaGrid == 2){centrox = dim/2 + sin(ii+rotacionGrid0) * tamanoGrid, centroy = dim/2 + cos(ii+rotacionGrid0) * tamanoGrid;}
        if(geometriaGrid == 3 || geometriaGrid == 4){centrox = dim/2 + sin(ii+rotacionGrid) * tamanoGrid, centroy = dim/2 + cos(ii+rotacionGrid) * tamanoGrid;}
        if(geometria == 3){tamanoGeoFinal = tamanoGeo*rand_between(0.9,1.1);}
        if(geometria == 4){tamanoGeoFinal = tamanoGeo*rand_between(0.7,1);}
        if(geometriaGrid == 2){numb = tamanoGeoFinal/24;}else{numb = tamanoGeoFinal/18;}
        var colVal0 = rand_choice(paletaColor1.colores);
        var colVal1 = rand_choice(colorFinal);

        var sz2 = [];
        var numb;
        for(var j = tamanoGeoFinal; j>5; j-=numb){
            sz2 = append(sz2,j);
        }

        var numb0 = tamanoGeoFinal/tamanoGeoFinal/3.5;
        var sz001 = [];
        for(var j = 10; j<tamanoGeoFinal*valorOffset; j+=numb0){
            sz001 = append(sz001,j);
        }
        var numb01 = tamanoGeoFinal/25;
        sz001 = reverse(sz001);

        for(var j = 0; j<sz2.length; j++){
            var xpos = [];
            var ypos = [];
            var sz00 = sz2[j];
            for(var i = 0; i<TWO_PI; i+=TAU/geometria){
                var x;
                var y;
                if(geometria == "3"){
                    x = centrox + sin(i+rotacionPoligonos+PI) * sz00;
                    y = centroy + cos(i+rotacionPoligonos+PI) * sz00;
                }else{
                    x = centrox + sin(i+rotacionPoligonos+PI/4) * sz00;
                    y = centroy + cos(i+rotacionPoligonos+PI/4) * sz00;
                }
                xpos = append(xpos,x);
                ypos = append(ypos,y);
            }
            xpos = append(xpos,xpos[0]);
            ypos = append(ypos,ypos[0]);
            colorEsquema2 = rand_choice(paletaColor1.colores);
            makeGridPolygons(xpos,ypos,j,sz2,tamanoGeoFinal,geometria,colorFinal,colVal0,rand_choice(colorFinal),colVal1,colorFondo,rand_choice(paletaColor1.colores));

        }
        makeOutLines(tamanoGeoFinal*valorOffset,numb01,geometria,centrox,centroy,rotacionPoligonos,0,0);
        makeGeoShd(geometria,centrox,centroy,rotacionPoligonos,tamanoGeoFinal,0,0);
    }
}

if(flow.nombre == "reticula"){
    var retic = rand_choice(flow.retic); 
    esquemaColor = rand_choice(flow.esquemaColor);

    consolaSalida(esquemaColor,0,retic);

    var rotacionPoligonos = rand_between(0,TWO_PI);
    var orden = rand_choice(flow.orden); 

    lineasOffset = rand_choice(flow.tipoCrecimiento); 
    rotacion = rand_choice(flow.rotacion); 


    var numb11, numb00;
    if(lineasOffset == "igual"){ valorOffset = rand_choice(flow.valorCrecimiento);}
    if(rotacion == "iguales"){rotacionPoligonos = rand_between(0,TWO_PI);} 
    if(retic == 1){numb11 = dim/1, numb00 = dim/4;}
    if(retic == 2){numb11 = dim/2, numb00 = dim/3;}
    if(retic == 3){numb11 = dim/1, numb00 = dim/3;}

    for(var ii = numb11/2; ii<dim; ii+=numb11){
        if(rotacion == "diferentes"){
            rotacionPoligonos = rotacionPoligonos+rand_between(0,TWO_PI);(-PI/2,PI/2);
        } 
        for(var mm = 0; mm<dim; mm+=numb00){
            var randy = rand_between(-dim/6,dim/6);
            var randx = rand_between(-dim/8,dim/8);
            var geometria = rand_choice(flow.geometrias); 
            colorEsquema0 = rand_choice(colorFinal);
            var centrox, centroy;

            if(lineasOffset == "combinado"){valorOffset = rand_choice(flow.valorCrecimiento);}

            if(retic == 1){
                if(orden == "ordenado"){centrox = ii+randx, centroy = mm+hh/6-numb00/2;}
                if(orden == "noOrdenado"){centrox = ii+rand_between(-numb00/5,numb00/5), centroy = mm+hh/6-numb00/2+rand_between(-numb00/6,numb00/6);}
                if(orden == "noOrdenadoY"){centrox = ii+rand_between(-numb00/5,numb00/5), centroy = mm+hh/6-numb00/2+rand_between(-numb00/6,numb00/6);}
                if(orden == "noOrdenadoX"){centrox = ii+randx, centroy = mm+hh/6-numb00/2;}
            }

            if(retic == 2){
                if(orden == "ordenado"){centrox = ii, centroy = mm+hh/6-numb00/4;}
                if(orden == "noOrdenado"){centrox = ii+rand_between(-numb11/4,numb11/4), centroy = mm+hh/6+rand_between(-numb11/4,numb11/4)-numb00/4;}
                if(orden == "noOrdenadoY"){centrox = ii, centroy = mm+hh/6+randy-numb00/4;}
                if(orden == "noOrdenadoX"){centrox = ii+rand_between(-numb11/4,numb11/4), centroy = mm+hh/6+rand_between(-numb11/4,numb11/4)-numb00/4;}
            }

            if(retic == 3){
                if(orden == "ordenado"){centrox = ii+randx, centroy = mm+hh/6-numb00/2+numb00/6;}
                if(orden == "noOrdenado"){centrox = ii+rand_between(-numb00/5,numb00/5), centroy = mm+hh/6-numb00/2+rand_between(-numb00/6,numb00/6)+numb00/6;}
                if(orden == "noOrdenadoY"){centrox = ii+rand_between(-numb00/6,numb00/6), centroy = mm+hh/6-numb00/2+rand_between(-numb00/6,numb00/6)+numb00/6;}
                if(orden == "noOrdenadoX"){centrox = ii+randx, centroy = mm+hh/6-numb00/2+numb00/6;}
            }
            var numb01 = numb00*2;
            if(retic == 1){numb01 = numb00*1.25;}
            else{numb01 = numb00;}

            var tamanoGeo = numb01/rand_between(rand_between(0.55,0.7),1); 
            var tamanoGeoFinal;

            numb01 = tamanoGeoFinal/28;
            _valorFlow = rand_choice(flow.valorFlow); 
            tipo = rand_choice(flow.tipo); 
            flowVal = rand_choice(flow.flowVal);
            if(geometria == 3){tamanoGeoFinal = tamanoGeo*rand_between(0.8,1);}
            if(geometria == 4){tamanoGeoFinal = tamanoGeo*rand_between(0.6,0.8);}
            if(retic == 1){numb = tamanoGeoFinal/16;}
            if(retic == 2){numb = tamanoGeoFinal/14;}
            if(retic == 3){numb = tamanoGeoFinal/20;}

            var colVal0 = rand_choice(paletaColor1.colores);
            var colVal1 = rand_choice(colorFinal);
            var sz2 = [];
            var numb;
            for(var j = tamanoGeoFinal; j>5; j-=numb){
                sz2 = append(sz2,j);
            }
            var numb0 = tamanoGeoFinal/tamanoGeoFinal/3.5;
            var sz001 = [];
            for(var j = 10; j<tamanoGeoFinal*valorOffset; j+=numb0){
                sz001 = append(sz001,j);
            }
            for(var j = 0; j<sz2.length; j++){
                var xpos = [];
                var ypos = [];
                var sz00 = sz2[j];
                for(var i = 0; i<TWO_PI; i+=TAU/geometria){
                    var x;
                    var y;
                    if(geometria == "3"){
                        x = centrox + sin(i+rotacionPoligonos+PI) * sz00;
                        y = centroy + cos(i+rotacionPoligonos+PI) * sz00;
                    }else{
                        if(retic == 3){
                            x = centrox + sin(i+rotacionPoligonos+PI/4) * sz00;
                            y = centroy + cos(i+rotacionPoligonos+PI/4) * sz00;
                        }else{
                            x = centrox + sin(i+rotacionPoligonos+PI/4) * sz00;
                            y = centroy + cos(i+rotacionPoligonos+PI/4) * sz00; 
                        }
                    }
                    if(retic == 3){
                        xpos = append(xpos,x);
                        ypos = append(ypos,y+numb00/6);
                    }else{
                        xpos = append(xpos,x);
                        ypos = append(ypos,y);
                    }
                }
                xpos = append(xpos,xpos[0]);
                ypos = append(ypos,ypos[0]);
                colorEsquema2 = rand_choice(paletaColor1.colores);
                makeGridPolygons(xpos,ypos,j,sz2,tamanoGeoFinal,geometria,colorFinal,colVal0,rand_choice(colorFinal),colVal1,colorFondo,rand_choice(paletaColor1.colores));
            }
            makeOutLines(tamanoGeoFinal*valorOffset,numb01,geometria,centrox,centroy,rotacionPoligonos,retic,numb00);
            makeGeoShd(geometria,centrox,centroy,rotacionPoligonos,tamanoGeoFinal,retic,numb00);
        }
    }
}
var difuminadoFondo = lerpColor(color(colorFondo),color(0),0.3);
var strw = listaMarco[int(rand_between(0,listaMarco.length))];
strokeWeight(strw);
stroke("#f7f4ed");
noFill();
rect(0,0,dim,hh);
image(pg,0,0);
for(var j = 0; j<gridptx.length; j++){
    var sz = tamanaoOjitos[j];
    var col012 = lerpColor(color(colorFondo),color(250),0.1);
    pg0.strokeWeight(1);
    pg0.stroke(0,25);
    if(combinacionOjitos[j] <= 0.5){
        pg0.push();
        pg0.translate(gridptx[j],gridpty[j]);
        pg0.fill(col012)
        pg0.ellipse(0,0,sz*2,sz*2);
        pg0.fill(250);
        pg0.ellipse(0,0,sz*1.25,sz*1.25);
        pg0.fill(20);
        pg0.ellipse(0,0,sz/1.8,sz/1.8);
        pg0.pop();
    }else{
        pg0.push();
        pg0.translate(gridptx[j],gridpty[j]);
        if(mixOjitos[j] <= mixOjitos0[j]){
            pg0.fill(col012);
            pg0.drawingContext.shadowColor = color(0,25);
            pg0.ellipse(0,0,sz*2,sz*2);
            pg0.fill(0);
            pg0.ellipse(1,1,sz/1.25,sz/1.25);
            pg0.fill(colorFondo);
            pg0.ellipse(0,0,sz/1.25,sz/1.25);
        }else{
         pg0.fill(col012);
         pg0.ellipse(0,0,sz*2,sz*2);
         pg0.fill(0);
         pg0.ellipse(0,0,sz/1.25,sz/1.25);
     }
     pg0.pop();
 }
}
console.log("tipo de flow: " + flowVal);
console.log("intensidad " + flowVal + " %: " +  map_range(intensidadFlow,1,1.5,10,100));
}

function draw() {
    //background(250);
    for(var i = 0; i<flowptx.length; i++){
      var angle = 0;
      for(var j = 0; j<gridptx.length; j++){
          let xdif = gridptx[j] - flowptx[i];
          let ydif = gridpty[j] - flowpty[i];
          let d = Math.sqrt((xdif * xdif) + (ydif * ydif))*intensidadEncuentro;
          var d0 = distance(flowptx[i],flowptx[i],gridptx[i],gridpty[i]);
          angle +=  abs(tamanaoOjitos[j]/2  / d*intensidadEncuentro0);
      }

      var angle0;
      if(flowVal == "marea"){
        angle0 = abs(noise(flowptx[i]/scl,flowpty[i]/scl)*TWO_PI*intensidadFlow);
    }
    if(flowVal == "flow1"){
        angle0 = int(noise(flowptx[i]/scl,flowpty[i]/scl)*val0/2)*PI/intensidad33;  
    }
    if(flowVal == "turbulencia"){
       angle0 = abs(noise(flowptx[i]/scl/2,flowpty[i]/scl/2)*atan(flowptx[i]*sinVal)*TWO_PI*intensidadFlow);
   }

   var sz00 = 2.5;
   var xx,yy,xx1,yy1;
   if(flowSelec == 0){
    xx = flowptx[i] + sin(angle+angle0*turbulencia+rotGeneral) * sz00;
    yy = flowpty[i] + cos(angle+angle0*turbulencia+rotGeneral) * sz00;

}
if(flowSelec == 1){
    xx = flowptx[i] + sin(angle+angle+rotGeneral) * sz00;
    yy = flowpty[i] + cos(angle+angle0*turbulencia+rotGeneral) * sz00;
}

if(blendCol[i] <= blendCol0[i]){
    if(frameCount <= 3){blendMode(BLEND);
    }else{blendMode(MULTIPLY);}
}else{blendMode(BLEND);}

if(tipo == "recto"){strokeCap(PROJECT);}
if(tipo == "curvo"){strokeCap(ROUND);}

if(frameCount <= 3){
    blendMode(BLEND);
    strokeWeight(grosorLinea[i]*2.25);
    strokeCap(ROUND);
    stroke(col[i]);
}else{strokeWeight(grosorLinea[i]);}

var n = map_range(frameCount,0,transicionColor,0,1);

var finalCol;
if(esquemaColor == "color0"){finalCol = color(colorEsquema0);}
if(esquemaColor == "color1"){var col1 = lerpColor(color(col[i]),color(colorEsquema1[i]),n), finalCol = color(col1);}
if(esquemaColor == "color2"){var col1 = lerpColor(color(col[i]),color(colorEsquema2),n), finalCol = color(col1);}
if(esquemaColor == "color3"){var col1 = lerpColor(color(col[i]),color(colorEsquema3[i]),n), finalCol = color(col1);}
if(esquemaColor == "color4"){var col1 = lerpColor(color(col[i]),color(colorEsquema4[i]),n), finalCol = color(col1);}
if(esquemaColor == "color5"){var col1 = lerpColor(color(col[i]),color(colorEsquema5[i]),n), finalCol = color(col1);}
if(esquemaColor == "color6"){var col1 = lerpColor(color(col[i]),color(colorEsquema6[i]),n), finalCol = color(col1);}

var r = red(finalCol), g = green(finalCol), b = blue(finalCol);
stroke(r,g,b,transparencia[i]);
noFill();
line(xx,yy,flowptx[i],flowpty[i]); 

flowptx[i] = xx;
flowpty[i] = yy;

grosorLinea[i]-=reduccionGorosor[i];
if(grosorLinea[i] <= 0){grosorLinea[i] = 0;}
}

blendMode(BLEND);
if(esquemaColor == "color0"){
    if(frameCount % cambioColor == 0){colorEsquema0 = rand_choice(colorFinal);}
}
image(pg0,0,0);
if(frameCount >= 250){
    noLoop();
}
}

function consolaSalida(esquemaColor,geometriaGrid,retic){
    if(geometriaGrid == 2){console.log("grid flow: linea");}
    if(geometriaGrid == 3){console.log("grid flow: triangulo");}
    if(geometriaGrid == 4){console.log("grid flow: cuadrado");}
    if(retic == 1 || retic == 3){console.log("grid flow: totem");}
    if(retic == 2){console.log("grid flow: reticula");}
    if(retic == 1){console.log("total de poligonos: 4");}
    if(retic == 2){console.log("total de poligonos: 6");}
    if(retic == 3){console.log("total de poligonos: 3");}
    if(esquemaColor == "color0"){console.log("esquema color(0): " + "cambios repentinos");}
    if(esquemaColor == "color1"){console.log("esquema color(1): " + "paleta1 a paleta2 (por geometría)");}
    if(esquemaColor == "color2"){console.log("esquema color(2): " + "paleta 1 a 1 color de paleta 2");}
    if(esquemaColor == "color3"){console.log("esquema color(3): " + "paleta 1 a paleta 1 (de geometria a puntos)");}
    if(esquemaColor == "color4"){console.log("esquema color(4): " + "paleta1 a paleta1 (por geometría)");}
    if(esquemaColor == "color5"){console.log("esquema color(5): " + "paleta1 a color de fondo");}
    if(esquemaColor == "color6"){console.log("esquema color(6): " + "paleta 1 a paleta 2 (de geometria a puntos)");}
    if(combinado == 0){console.log("paleta inicial: " + paletaColor.nombre);}
    if(combinado == 1){console.log("paletas iniciales: " + paletaColor.nombre + " + " + paletaColor0.nombre);}
    if(esquemaColor == "color1"){console.log("paleta final: " + paletaColor1.nombre);}
    if(esquemaColor == "color2"){console.log("paleta final: " + paletaColor1.nombre);}
    if(esquemaColor == "color6"){console.log("paleta final: " + paletaColor1.nombre);}
    console.log("intensidad de encuentro %: " + map_range(intensidadEncuentro,0.1,0.5,100,10) );
}

function makeGridPolygons(xpos,ypos,j,sz2,tamanoGeoFinal,geometria,colorEntrada,esquema1,esquema3,esquema4,esquema5,esquema6){
    for(var i = 0; i<xpos.length-1; i++){
        var xref = lerp(xpos[i],xpos[i+1],0.25), yref = lerp(ypos[i],ypos[i+1],0.25);
        var xref0 = lerp(xpos[i],xpos[i+1],0.75), yref0 = lerp(ypos[i],ypos[i+1],0.75);
        var steps = map_range(j,0,sz2.length,tamanoGeoFinal/6,0); 
        for(var jj = 0; jj<steps; jj++){
            var t = jj/steps;
            var xval00 = bezierPoint(xpos[i],xref,xref0,xpos[i+1],t);
            var yval00 = bezierPoint(ypos[i],yref,yref0,ypos[i+1],t);
            flowptx = append(flowptx,xval00);
            flowpty = append(flowpty,yval00+hh/6);

            if(_valorFlow == "flow0"){flowSelec = 0;}
            if(_valorFlow == "flow1"){flowSelec = 1;}

            if(esquemaColor == "color0"){col = append(col,0);}
            else{col = append(col,colorEntrada[i  % colorEntrada.length]);}

            var mixColVal = rand_between(0.3,0.7);
            grosorLineaIgual = rand_between(dim/90,dim/90*0.6);
            reduccionGorosor0 = rand_between(0.025,0.08); 
            blendCol = append(blendCol,rand_between(0.3,0.7));
            blendCol0 = append(blendCol0,mixColVal);
            transparencia = append(transparencia,rand_between(200,300));
            if(geometria == 2){
               grosorLinea = append(grosorLinea,grosorLineaIgual*1.1);
               reduccionGorosor = append(reduccionGorosor,reduccionGorosor0*1.1);
           }else{
            grosorLinea = append(grosorLinea,grosorLineaIgual);
            reduccionGorosor = append(reduccionGorosor,reduccionGorosor0);
        }
        colorEsquema1 = append(colorEsquema1,esquema1); 
        colorEsquema3 = append(colorEsquema3,esquema3);
        colorEsquema4 = append(colorEsquema4,esquema4);
        colorEsquema5 = append(colorEsquema5,esquema5);
        colorEsquema6 = append(colorEsquema6,esquema6);
    }
}
}

function makeGeoShd(geometria,centrox,centroy,rotacionPoligonos,tamanoGeoFinal,retic,numb00){
    pg.beginShape();
    pg.noStroke();
    var r = red(colorFondo), g = green(colorFondo), b = blue(colorFondo);
    pg.fill(colorFondo);
    for(var j = 0; j<TWO_PI; j+=TAU/geometria){
        var piRot;
        if(geometria == "3"){piRot = PI}else{piRot = PI/4;}
        x = centrox + sin(j+rotacionPoligonos+piRot) * tamanoGeoFinal*1.06;
        y = centroy + cos(j+rotacionPoligonos+piRot) * tamanoGeoFinal*1.06;
        if(retic == 3){pg.vertex(x,y+hh/6+numb00/6);}else{pg.vertex(x,y+hh/6);}
    }
    pg.endShape(CLOSE);
}

function makeOutLines(tamano,numb01,geometria,centrox,centroy,rotacionPoligonos,retic,numb00){
    for(var j = 0; j<tamano; j+=numb01){
        beginShape();
        strokeWeight(1);
        stroke(0,50);
        noFill();
        for(var i = 0; i<TWO_PI; i+=TAU/geometria){
            var piRot;
            if(geometria == "3"){piRot = PI}else{piRot = PI/4;}
            x = centrox + sin(i+rotacionPoligonos+piRot) * j;
            y = centroy + cos(i+rotacionPoligonos+piRot) * j;
            if(retic == 3){vertex(x,y+hh/6+numb00/6);}else{vertex(x,y+hh/6);}
        }
        endShape(CLOSE);
    }
}

function windowResized() {
    dim = Math.min(window.innerWidth, window.innerHeight) * 0.85;
    resizeCanvas(dim, dim);
}

function hash_to_ints(token) {
    let hashPairs = [];
    for (let j = 0; j < 32; j++) {  
        hashPairs.push(tokenData.hash.slice(2 + j * 2, 4 + j * 2));
    }
    return hashPairs.map((x) => {
        return parseInt(x, 16);
    });
}

function get_seed(token) {
    return parseInt(tokenData.hash.slice(0, 16), 16);
}

function map_v(index, min = 0, max = 1) {
    return map_range(hash_ints[index], 0, 255, min, max);
}

function map_v_str(index, min = 0, max = 1) {
    return map_v(index, min, max).toFixed(6).toString();
}

function map_range(val, start1, stop1, start2, stop2) {
    return ((val - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
}
function shuffleArray (arr) {
  if (!Array.isArray(arr)) {
    throw new TypeError('Expected Array, got ' + typeof arr);
}

var rand;
var tmp;
var len = arr.length;
var ret = arr.slice();
while (len) {
    rand = Math.floor(rand_dec() * len--);
    tmp = ret[len];
    ret[len] = ret[rand];
    ret[rand] = tmp;
}
return ret;
}
function rand_dec() {
    seed ^= seed << 13;
    seed ^= seed >> 20;
    seed ^= seed << 5;
    return ((seed < 0 ? ~seed + 1 : seed) % 1000) / 1000;
}

function distance (x1, y1, x2, y2) {
  return Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1))
}

function rand_between(a, b) {
    return a + (b - a) * rand_dec();
}

function rand_choice(choices) {
    return choices[Math.floor(rand_between(0, choices.length * 0.99))];
}

function rand_choice_obj(choices) {
    a = [];
    choices.forEach((elem, idx) => {
        for (i = 0; i < elem.w; i++) {
            a.push(elem);
        }
    });
    return rand_choice(a);
}

function hash_choice(val, choices) {
    return choices[Math.max(0, Math.floor((val / 255) * choices.length - 1e-6))];
}

function setupParametersFromTokenData(token) {
  let hashPairs = []
  //parse hash
  for (let j = 0; j < 32; j++) {
    hashPairs.push(token.hash.slice(2 + (j * 2), 4 + (j * 2)))
}
  // map to 0-255
  return hashPairs.map(x => {
    return parseInt(x, 16)
})
}