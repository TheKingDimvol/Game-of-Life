"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var Game = /** @class */ (function () {
    function Game(height, width) {
        var _this = this;
        if (height === void 0) { height = 30; }
        if (width === void 0) { width = 50; }
        var _a, _b;
        this._started = false;
        this._changeState = 0;
        this._interval = 1000;
        this._iterations = 0;
        this.canvas = document.getElementById('field');
        this.canvas.width = width * 10;
        this.canvas.height = height * 10;
        this.canvas.style.width = width * 10 + "px";
        this.canvas.style.height = height * 10 + "px";
        this._context = this.canvas.getContext('2d');
        this._startButton = document.getElementById('start');
        this._startButton.addEventListener('click', this._start.bind(this));
        this._restartButton = document.getElementById('restart');
        this._restartButton.addEventListener('click', this._restart.bind(this));
        this._counter = document.getElementById('counter');
        this._height = height;
        this._width = width;
        this._field = this._createField();
        this._changedField = this._field.map(function (row) { return __spreadArray([], row); });
        (_a = document.getElementById('faster')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () { return _this._changeInterval(-200); });
        (_b = document.getElementById('slower')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', function () { return _this._changeInterval(200); });
    }
    Game.prototype._changeInterval = function (diff) {
        var _this = this;
        if (this._interval <= -diff || this._interval > 3000)
            return;
        this._interval += diff;
        if (this._started) {
            clearInterval(this._changeState);
            this._changeState = setInterval(function () {
                _this._stateOnChange();
                _this._iterations++;
                _this._counter.innerText = "" + _this._iterations;
            }, this._interval);
        }
    };
    Game.prototype._createField = function () {
        var array = [];
        for (var x = 0; x < this._width; x++) {
            array[x] = [];
            for (var y = 0; y < this._height; y++) {
                array[x][y] = false;
            }
        }
        return array;
    };
    Game.prototype.draw = function (x, y) {
        this._changeCellState(x, y);
        this._field[x][y] = !this._field[x][y];
    };
    Game.prototype._changeCellState = function (x, y) {
        if (!this._field[x][y]) {
            this._context.fillStyle = 'rgb(100, 226, 220)';
        }
        else {
            this._context.fillStyle = 'rgba(255, 255, 255, 1)';
        }
        this._context.fillRect(x * 10, y * 10, 10, 10);
    };
    Game.prototype._start = function () {
        var _this = this;
        if (!this._started) {
            this._startButton.innerText = 'Пауза';
            this._started = true;
            this._counter.innerText = "" + this._iterations;
            this._changeState = setInterval(function () {
                _this._stateOnChange();
                _this._iterations++;
                _this._counter.innerText = "" + _this._iterations;
            }, this._interval);
            return;
        }
        else {
            this._startButton.innerText = 'Старт';
            this._started = false;
            clearInterval(this._changeState);
        }
    };
    Game.prototype._restart = function () {
        this._startButton.innerText = 'Старт';
        this._started = false;
        clearInterval(this._changeState);
        this._iterations = 0;
        this._field = this._createField();
        this._changedField = this._field.map(function (row) { return __spreadArray([], row); });
        this._context.clearRect(0, 0, this._width * 10, this._height * 10);
    };
    Game.prototype._stateOnChange = function () {
        this._changedField = this._field.map(function (row) { return __spreadArray([], row); });
        for (var x = 0; x < this._width; x++) {
            for (var y = 0; y < this._height; y++) {
                var neighbours = this._getNeighbours(x, y);
                if (!this._field[x][y]) {
                    if (neighbours !== 3)
                        continue;
                    this._changedField[x][y] = true;
                    this._changeCellState(x, y);
                }
                else {
                    if (neighbours === 2 || neighbours === 3)
                        continue;
                    this._changedField[x][y] = false;
                    this._changeCellState(x, y);
                }
            }
        }
        this._field = this._changedField.map(function (row) { return __spreadArray([], row); });
    };
    Game.prototype._getNeighbours = function (x, y) {
        var neighbours = 0;
        for (var m = x - 1; m < x + 2; m++) {
            if (m === -1 || m === this._width)
                continue;
            for (var n = y - 1; n < y + 2; n++) {
                if (m === -1 || m === this._height || (m === x && n === y))
                    continue;
                if (this._field[m][n])
                    neighbours++;
            }
        }
        return neighbours;
    };
    return Game;
}());
var game = new Game(30, 50);
game.canvas.onclick = function (event) {
    if (isDrawing)
        return;
    var x = event.offsetX;
    var y = event.offsetY;
    game.draw(Math.floor(x / 10), Math.floor(y / 10));
};
var isDrawing = false;
var pointArr = [];
for (var x = 0; x < 50; x++) {
    pointArr[x] = [];
    for (var y = 0; y < 30; y++) {
        pointArr[x][y] = false;
    }
}
game.canvas.onmousemove = function (event) {
    if (!isDrawing) {
        return;
    }
    var x = Math.floor(event.offsetX / 10);
    var y = Math.floor(event.offsetY / 10);
    if (!pointArr[x][y]) {
        game.draw(x, y);
    }
    pointArr[x][y] = true;
};
game.canvas.onmousedown = function () {
    isDrawing = true;
};
game.canvas.onmouseup = function () {
    for (var x = 0; x < 50; x++) {
        pointArr[x] = [];
        for (var y = 0; y < 30; y++) {
            pointArr[x][y] = false;
        }
    }
    isDrawing = false;
};
