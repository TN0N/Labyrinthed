

export class Binary {
    constructor(scene, loader) {
        this.scene = scene;
        this.loader = loader;
        this.numArray = [];
        this.eqArray = [];
        this.platformArray = [];
        this.is0 = [];
        this.pointer = 0;
        this.value = 0;
        this.goalValue = 0;
        this.platforms = [];
        this.platforPointer = 0;
    }
    display0() {
        this.numArray.push(this.loader.loadNode('bin00'));
        this.numArray.push(this.loader.loadNode('bin10'));
        this.numArray.push(this.loader.loadNode('bin20'));
        this.numArray.push(this.loader.loadNode('bin30'));
        this.numArray.push(this.loader.loadNode('bin40'));
        this.numArray.push(this.loader.loadNode('bin50'));
        this.numArray.push(this.loader.loadNode('bin01'));
        this.numArray.push(this.loader.loadNode('bin11'));
        this.numArray.push(this.loader.loadNode('bin21'));
        this.numArray.push(this.loader.loadNode('bin31'));
        this.numArray.push(this.loader.loadNode('bin41'));
        this.numArray.push(this.loader.loadNode('bin51'));
        for (let i = 6; i < this.numArray.length; i++) {
            this.scene.removeChild(this.numArray[i]);
        }
        return this.numArray;
    }
    reset0() {
        for (let i = 0; i < this.is0.length; i++) {
            if (this.is0[i] == false) {
                this.scene.removeChild(this.numArray[i + 6]);
                this.scene.addChild(this.numArray[i]);
            }
        }
        this.is0 = [];
    }
    getEquasion() {
        this.eqArray.push(this.loader.loadNode('Text.15m'));
        this.eqArray.push(this.loader.loadNode('Text.21m'));
        const equasion = Math.round(Math.random() * 1);
        if (equasion == 1) {
            this.scene.removeChild(this.eqArray[1]);
            this.goalValue = 15;
        } else {
            this.scene.removeChild(this.eqArray[0]);
            this.goalValue = 21;
        }
    }
    changeNumber(number) {
        this.value += Math.pow(2, this.pointer) * number;
        if (this.value == this.goalValue) this.openDoor();
        if (number == 1) {
            this.scene.removeChild(this.numArray[this.pointer]);
            this.scene.addChild(this.numArray[this.pointer + 6]);
            this.is0.push(false);
        } else this.is0.push(true);
        this.pointer++;
        if (this.pointer > 5) {
            this.value = 0;
            this.pointer = 0;
            this.reset0();
        }
    }
    pickRandom() {
        for (let i = 0; i < 10; i++) {
            const random = Math.round(Math.random() * 1);
            if (random == 1) {
                this.platforms[i] = true;
                this.platforms[i + 1] = false;
            } else {
                this.platforms[i] = false;
                this.platforms[i + 1] = true;
            }
            i++;
        }
    }
    checkPlatform() {
        return this.platforms[this.pointer];
    }
    fillPlatforms() {
        //todo nared to za usak platform in porbi če dela ne pozab physics in update
        this.loader.loadNode('pad01').isPlatform = true;
        this.loader.loadNode('pad02').isPlatform = true;
        this.loader.loadNode('pad11').isPlatform = true;
        this.loader.loadNode('pad12').isPlatform = true;
        this.loader.loadNode('pad21').isPlatform = true;
        this.loader.loadNode('pad22').isPlatform = true;
        this.loader.loadNode('pad31').isPlatform = true;
        this.loader.loadNode('pad32').isPlatform = true;
        this.loader.loadNode('pad41').isPlatform = true;
        this.loader.loadNode('pad42').isPlatform = true;
        this.platformArray[0] = this.loader.loadNode('pad01');
        this.platformArray[1] = this.loader.loadNode('pad02');
        this.platformArray[2] = this.loader.loadNode('pad11');
        this.platformArray[3] = this.loader.loadNode('pad12');
        this.platformArray[4] = this.loader.loadNode('pad21');
        this.platformArray[5] = this.loader.loadNode('pad22');
        this.platformArray[6] = this.loader.loadNode('pad31');
        this.platformArray[7] = this.loader.loadNode('pad32');

    }
    destroyPlatform(node) {
        for (let i = 0; i < this.platforms.length; i++) {
            if (this.platformArray[i] == node) {
                if (this.platforms[i])
                    this.scene.removeChild(this.platformArray[i]);
            }
        }
    }
    openDoor(){
        this.scene.removeChild(this.loader.loadNode('door1'));
        this.scene.removeChild(this.loader.loadNode('doorT1'));
    }
}