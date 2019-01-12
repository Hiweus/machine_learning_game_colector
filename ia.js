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
        let out=1;
        for(let i=0;i<this.length;i++){

            out *= (this.weigth[i]-inputs[i]);

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
    constructor(numberOfNeurons,numberOfInputs, numberOfLayers){
        this.length = numberOfLayers;
        this.layers = [];
        this.end = new Neuron(numberOfNeurons);
        this.first = new Layer(numberOfNeurons,numberOfInputs);
        for (let i = 0; i < numberOfLayers; i++) {
            this.layers.push(new Layer(numberOfNeurons,numberOfNeurons));
        }
    }

    ajust(value){
        this.first.ajust(value);
        this.layers.forEach(function(element){
            element.ajust(value);
        });
        this.end.ajust(value);
    }

    compute(inputs){
        let out = this.first.compute(inputs);

        for (let i = 0; i < this.length; i++) {
            out = this.layers[i].compute(out);            
        }

        return this.end.compute(out);
    }
}

function end(value){
    return (value > 0.5)?1:0;
}
