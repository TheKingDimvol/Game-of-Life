class Game {
    protected _height: number;
    protected _width: number;
    protected _field: Array<Array<boolean>>;
    protected _changedField: Array<Array<boolean>>;
    canvas: HTMLCanvasElement; 
    protected _context: CanvasRenderingContext2D;
    protected _started: boolean = false;
    protected _changeState: number = 0;
    protected _interval: number = 1000;
    protected _iterations: number = 0;
    protected _startButton: HTMLButtonElement;
    protected _restartButton: HTMLButtonElement;
    protected _counter: HTMLElement;
    
    constructor(height: number = 30, width: number = 50) {
        this.canvas = document.getElementById('field') as HTMLCanvasElement; 
        this.canvas.width = width * 10;
        this.canvas.height = height * 10;
        this.canvas.style.width  = width * 10 + `px`;
        this.canvas.style.height = height * 10 + `px`;  
        this._context = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        this._startButton = document.getElementById('start') as HTMLButtonElement;
        this._startButton.addEventListener('click', this._start.bind(this));
        this._restartButton = document.getElementById('restart') as HTMLButtonElement;
        this._restartButton.addEventListener('click', this._restart.bind(this));
        this._counter = document.getElementById('counter') as HTMLElement;
        this._height = height;
        this._width = width;
        this._field = this._createField();
        this._changedField = this._field.map(row => [...row]);
        document.getElementById('faster')?.addEventListener('click', () => this._changeInterval(-200));
        document.getElementById('slower')?.addEventListener('click', () => this._changeInterval(200));
    }

    protected _changeInterval(diff: number) {
        if (this._interval <= -diff || this._interval > 3000) return;
        this._interval += diff;
        if (this._started) {
            clearInterval(this._changeState);
            this._changeState = setInterval(() => {
                this._stateOnChange();
                this._iterations++;
                this._counter.innerText = `${this._iterations}`
            }, this._interval);
        }
    }
    
    protected _createField(): Array<Array<boolean>> {
        let array: Array<Array<boolean>> = [];
        for (let x = 0; x < this._width; x++) {
            array[x] = [];
            for (let y = 0; y < this._height; y++) {
                array[x][y] = false
            }
        }
        return array;
    }

    draw(x: number, y: number): void {
        this._changeCellState(x, y);
        this._field[x][y] = !this._field[x][y];
    }
    
    protected _changeCellState(x: number, y: number): void {
        if (!this._field[x][y]) {
            this._context.fillStyle = 'rgb(100, 226, 220)';
        } else {
            this._context.fillStyle = 'rgba(255, 255, 255, 1)';
        }
        this._context.fillRect(x*10, y*10, 10, 10);
    }

    protected _start(): void {
        if (!this._started) {
            this._startButton.innerText = 'Пауза';
            this._started = true;
            this._counter.innerText = `${this._iterations}`
            this._changeState = setInterval(() => {
                this._stateOnChange();
                this._iterations++;
                this._counter.innerText = `${this._iterations}`
            }, this._interval);
            return
        } else {
            this._startButton.innerText = 'Старт';
            this._started = false;
            clearInterval(this._changeState);
        }
    }

    protected _restart(): void {
        this._startButton.innerText = 'Старт';
        this._started = false
        clearInterval(this._changeState);
        this._iterations = 0;
        this._field = this._createField();
        this._changedField = this._field.map(row => [...row]);
        this._context.clearRect(0, 0, this._width * 10, this._height * 10);
    }

    protected _stateOnChange(): void {
        this._changedField = this._field.map(row => [...row]);
        for (let x = 0; x < this._width; x++) {
            for (let y = 0; y < this._height; y++) {
                let neighbours: number = this._getNeighbours(x, y);
                if (!this._field[x][y]) {
                    if (neighbours !== 3) continue;

                    this._changedField[x][y] = true;
                    this._changeCellState(x, y);
                } else {
                    if (neighbours === 2 || neighbours === 3) continue;

                    this._changedField[x][y] = false;
                    this._changeCellState(x, y);
                }
            }
        }
        this._field = this._changedField.map(row => [...row]);
    }

    protected _getNeighbours(x: number, y: number): number {
        let neighbours = 0;
        for (let m = x - 1; m < x + 2; m++) {
            if (m === -1 || m === this._width) continue;
            for (let n = y - 1; n < y + 2; n++) {
                if (m === -1 || m === this._height || (m === x && n === y)) continue;
                if (this._field[m][n]) neighbours++;
            }
        }
        return neighbours;
    }
}

const game = new Game(30, 50);

game.canvas.onclick = function(event) {
    if (isDrawing) return;
    const x = event.offsetX; 
    const y = event.offsetY;
   
    game.draw(Math.floor(x/10), Math.floor(y/10));
}


let isDrawing: boolean = false;
let pointArr: Array<Array<boolean>> = [];

for (let x = 0; x < 50; x++) {
    pointArr[x] = [];
    for (let y = 0; y < 30; y++) {
        pointArr[x][y] = false
    }
}

game.canvas.onmousemove = function(event) {
    if (!isDrawing) {
       return;
    }
    const x = Math.floor(event.offsetX / 10); 
    const y = Math.floor(event.offsetY / 10);
    if (!pointArr[x][y]) {
        game.draw(x, y);
    }
    pointArr[x][y] = true;
};

game.canvas.onmousedown = () => {
    isDrawing = true;
};

game.canvas.onmouseup = () => {
    for (let x = 0; x < 50; x++) {
        pointArr[x] = [];
        for (let y = 0; y < 30; y++) {
            pointArr[x][y] = false
        }
    }
    isDrawing = false;
};
