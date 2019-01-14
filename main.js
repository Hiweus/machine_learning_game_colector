function end(value){
    if(value > 0.7){
        return 1;
    }else if(value < 0.3){
        return -1;
    }else{
        return 0;
    }
}


class Neuron{
    constructor(numberOfInputs){
        this.length = numberOfInputs;
        this.weigth = [];

        for(let i=0;i<numberOfInputs;i++){
            let aux = Math.random();
            this.weigth.push(aux);
        }
    }

    ajust(value){
        for(let i=0;i<this.length;i++){
            this.weigth[i] += value;
        }
    }

   
    compute(inputs){
        let out=0;
        for(let i=0;i<this.length;i++){
            out += (this.weigth[i]*inputs[i]);
        }
        return out;
    }
}

class Layer{
    constructor(numberOfNeurons,numberOfInputs){
        this.length = numberOfNeurons;
        this.neurons = []
        for (let i = 0; i < numberOfNeurons; i++) {
            this.neurons.push(new Neuron(numberOfInputs));            
        }
    }

    ajust(value){
        for (let i = 0; i < this.length; i++) {
            this.neurons[i].ajust(value);            
        }
    }

    compute(inputs){
        let out = [];
        for (let i = 0; i < this.length; i++) {
            out.push(this.neurons[i].compute(inputs));            
        }
        return out;
    }
}

class Network{
    constructor(numberOfInputs, modelLayers){
        this.length = modelLayers.length;
        this.layers = [];

        this.first = new Layer(modelLayers[0],numberOfInputs);
        this.layers.push(this.first);
        for (let i = 1; i < modelLayers.length; i++) {
            this.layers.push(new Layer(modelLayers[i],modelLayers[i-1]));
        }       
    }

    ajust(value){
        this.layers.forEach(function(element){
            element.ajust(value);
        });
    }

    compute(inputs){
        let out = inputs;
        for (let i = 0; i < this.length; i++) {
            out = this.layers[i].compute(out);            
        }

        return out;
    }
}



//////////////////////////////////////////////////////////////////////

//movimentos do player
const LEFT= 37;
const RIGHT= 39;
var PXTOMOVE = 10;
const SCREENSIZE = 300;

var player = $("#player");
player[0].style.left = "0px";
const playerSize = 50;



function move(direction){

    let position = parseInt(player[0].style.left.split("px")[0]);
    if(direction == -1){
        // -1 esquerda
        position -= PXTOMOVE;
    }else if(direction == 1){
        // 1 direita
        position += PXTOMOVE;
    }
    if(position+playerSize <= SCREENSIZE && position >= 0){
        player[0].style.left = position+"px";
    }

}

//geracao de blocos
function generate(){
    let aux = Math.random()*1000;
    aux = parseInt(aux);
    aux %= (SCREENSIZE/10);
    aux *= 10

    let obj = document.createElement("div");
    obj.id = "item";
    obj.style.left = aux+"px";
    obj.style.top = "10px";
    $("#screen").append(obj);

}

// gera a queda do obj
function downObj(){
    let obj = $("#item")[0].style;
    let aux = obj.top.split("px")[0];
    aux = parseInt(aux)+speedControl;
    obj.top = aux+"px";
}

function frames(){
    downObj();

    let item = $("#item");
    //verifica se chegou no final da pagina
    let playerPosition = player.position();
    let itemPosition = item.position();

    if (playerPosition.top-itemPosition.top < 5){
        //testa colisao
        let aux = player.position().left-item.position().left;
        aux = aux*-1;
        if(aux >=0 && aux < 50){
            let temp = $("#placar");
            temp.text((capturados+1).toString());
            capturados += 1;
        }else{
            alert(capturados);
            $("#placar").text("-10");
            capturados = -10;
        }

        $("#item").remove();
        generate();
    }


    // rede neural
    if(capturados<0){
        speedControl=1;
        // captura os dados e treina a rede
        for(let i=0;i<3;i++){
            let out = net.compute([playerPosition.left, itemPosition.left]);
            out=out[0];
            let erro = key - end(out);
            erro *= 0.0006; // taxa de aprendizagem da rede
            net.ajust(erro);
        }
    }else{
        speedControl=4;
        //usa a rede para mover o personagem
        let out = net.compute([playerPosition.left, itemPosition.left]);
        out=out[0];
        move(end(out));
        
    }


    time = 6;
    setTimeout(frames,time);
}

var key = 0;
var net = new Network(2,[5,1]);
var capturados = -10;
speedControl = 1;
var firstFrame = true;
var automatic = false;

generate();
$(window).on('keydown',function(event){
    if(firstFrame){
        frames();
        firstFrame = false;
    }
    let keyTemp = event.keyCode;

    if(keyTemp == LEFT){
        move(-1);
        key = -1;
    }
    if(keyTemp == RIGHT){
        move(1);
        key = 1;
    }
});

$(window).on("keyup",function(event){
    key = 0;
});