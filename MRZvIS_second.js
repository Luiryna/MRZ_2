/////////////////////////////////////////////////////////////////////////////////////////
// Лабораторная работа №2 по дисциплине МРЗвИС
// Выполнена студенткой группы 721702
// БГУИР Лукашевич Ирина Александровна
//
// Вариант 6
//
// 06.06.2019
//
// Подсчёт Lavg, Lsum взят из книги Карцев М.А., Брик В.А. Вычислительные системы и синхронная арифметика. – М: Радио и связь, 1981. – 360с. на странице 19.
// Реализация подсчёта Lavg взята из лабораторной работы №2 студента Каленика П.
// Основные методы для создания таблицы взяты из ресурса: http://www.w3schools.com/js/

var timeOfSum = 0;
var timeOfDifference = 0;
var timeOfMultiplicity = 0;
var timeOfComparing = 0;
var timeOfDivision = 0;

var counterOfSum = 0;
var counterOfDifference = 0;
var counterOfMultiplicity = 0;
var counterOfComparing = 0;
var counterOfDivision = 0;

var counterOfnotAndF = 0;
var counterOfnotOrD = 0;
var counterOfimplicationAandB = 0;
var counterOfimplicationBandA = 0;
var counterOfmaxFandD = 0;

var r = 0;
var T1 = 0;
var Tn = 0;
var Ky = 0;
var e = 0;
var D = 0;
var Lsum = 0;
var Lavg = 0;


var matrixA;
var matrixB;
var matrixE;
var matrixG;
var matrixC;

var m;
var p;
var q;
var n;

var f;
var d;



function main(){
    m = +document.getElementById("m").value;
    p = +document.getElementById("p").value;
    q = +document.getElementById("q").value;

    timeOfSum = +document.getElementById("sum").value;
    timeOfDifference = +document.getElementById("dif").value;
    timeOfMultiplicity = +document.getElementById("mul").value;
    timeOfComparing = +document.getElementById("com").value;
    timeOfDivision = +document.getElementById("div").value;

    n = +document.getElementById("n").value;

    r = p * q * m;

    matrixA = generateMatrix(p, m);
    drawTable(matrixA, p, m, "a");

    matrixB = generateMatrix(m, q);
    drawTable(matrixB, m, q, "b");

    matrixE = generateMatrix(1, m);
    drawTable(matrixE, 1, m, "e");

    matrixG = generateMatrix(p, q);
    drawTable(matrixG, p, q, "g");

    d = calculateDijk();
    f = calculateFijk();

    matrixC = calculateCij();
    drawTable(matrixC, p, q, "c");

    T1 = timeOfSum * counterOfSum + timeOfDifference * counterOfDifference + timeOfMultiplicity * counterOfMultiplicity + timeOfComparing * counterOfComparing + timeOfDivision * counterOfDivision;

    Lsum = Tn;

    Ky = T1 / Tn;

    e = Ky / n;

    Lavg += (7 * timeOfMultiplicity + 2 * timeOfSum + 3 * timeOfDifference) * p * q;
    Lavg += (7 * timeOfMultiplicity + 2 * timeOfSum + 3 * timeOfDifference) * r;
    Lavg += timeOfMultiplicity * r;
    Lavg += timeOfMultiplicity * (m - 1) * counterOfnotAndF;
    Lavg += (timeOfDifference * (m + 1) + timeOfMultiplicity * (m - 1)) * counterOfnotOrD;
    Lavg += (timeOfDifference + timeOfMultiplicity + timeOfComparing) * counterOfmaxFandD;
    Lavg += (timeOfDivision + timeOfDifference) * counterOfimplicationAandB;
    Lavg += (timeOfDivision + timeOfDifference) * counterOfimplicationBandA;   
    Lavg /= r;

    D = Lsum / Lavg;

    var timeTable = [["Операция", "Сумма", "Разность", "Произведение", "Сравнение", "Деление"], ["Суммарное время операций", timeOfSum * counterOfSum, timeOfDifference * counterOfDifference, timeOfMultiplicity * counterOfMultiplicity, timeOfComparing * counterOfComparing, timeOfDivision * counterOfDivision]];
    drawTable(timeTable, 2, 6, "timeTable");

    var dataTable = [["n", "r", "T1", "Tn", "Ky", "e", "Lsum", "Lavg", "D"], [n, r, T1, Tn, Ky, e, Lsum, Lavg, D]];
    drawTable(dataTable, 2, 9, "dataTable");
}

function generateMatrix(rows, columns) {
    var matrix = [];
    for (var row = 0; row < rows; row++) {
        matrix[row] = [];
        for (var column = 0; column < columns; column++) {
            matrix[row][column] = Math.random() * (1 + 1) - 1;
        }
    }
    return matrix;
}

function drawTable(information, rows, columns, tableName) {
    var table = document.getElementById(tableName);
    for (var row = 0; row < rows; row++) {
        table.insertRow(-1);
    	for (var column = 0; column < columns; column++) {
            table.rows[row].insertCell(-1);
            table.rows[row].cells[column].innerText = information[row][column];
        }
    }
}

function calculateCij() {
    var cij = [];
    var operationTime = 0;
    for (var i = 0; i < p; i++) {
        cij[i] = [];
        for (var j = 0; j < q; j++) {
            cij[i][j] = notAndF(i, j) * (3 * matrixG[i][j] - 2) * matrixG[i][j] + (notOrD(i, j) + (4 * maxFandD(i, j) - 3 * notOrD(i, j)) * matrixG[i][j]) * (1 - matrixG[i][j]);
            counterOfMultiplicity += 7;
            counterOfDifference += 3;
            counterOfSum += 2;
        }
    }
    operationTime = (7 * timeOfMultiplicity + 2 * timeOfSum + 3 * timeOfDifference) * Math.ceil(p * q / n);
    Tn += operationTime;
    return cij;
}

function calculateFijk() {
    var fijk = [];
    var operationTime = 0;
    for (var i = 0; i < p; i++) {
        fijk[i] = [];
        for (var j = 0; j < q; j++) {
            fijk[i][j] = [];
            for (var k = 0; k < m; k++) {
                fijk[i][j][k] = implicationAandB(matrixA[i][k], matrixB[k][j]) * (2 * matrixE[0][k] - 1) * matrixE[0][k] + implicationBandA(matrixB[k][j], matrixA[i][k]) * (1 + (4 * implicationAandB(matrixA[i][k], matrixB[k][j]) - 2) * matrixE[0][k]) * (1 - matrixE[0][k]);
                counterOfMultiplicity += 7;
                counterOfDifference += 3;
                counterOfSum +=2;
            }
        }
    }
    operationTime = (7 * timeOfMultiplicity + 2 * timeOfSum + 3 * timeOfDifference) * Math.ceil(p * q * m / n);
    Tn += operationTime;
    return fijk;
}

function calculateDijk() {
    var dijk = [];
    var operationTime = 0;
    for (var i = 0; i < p; i++) {
        dijk[i] = [];
        for (var j = 0; j < q; j++) {
            dijk[i][j] = [];
            for (var k = 0; k < m; k++) {
                dijk[i][j][k] = matrixA[i][k] * matrixB[k][j];
                counterOfMultiplicity++;//тут внимательно
            }
        }
    }
    operationTime = timeOfMultiplicity * Math.ceil(p * q * m / n);
    Tn += operationTime;
    return dijk;
}

function notAndF(i, j) {
    var result = 1;
    var operationTime = 0;
    for (var k = 0; k < m; k++) {
        result *= f[i][j][k];
    }
    operationTime = timeOfMultiplicity * (m - 1);
    Tn += operationTime;
    counterOfnotAndF++;
    counterOfMultiplicity += m - 1;
    return result;
}

function notOrD(i, j) {
    var result = 1;
    var operationTime = 0;
    for (var k = 0; k < m; k++) {
        result *= 1 - d[i][j][k];
    }
    operationTime = timeOfDifference * (m + 1) + timeOfMultiplicity * (m - 2); //
    Tn += operationTime;
    counterOfnotOrD++;
    counterOfMultiplicity += m - 2;//m-1
    counterOfDifference += m + 1; // было m+1
    return 1 - result;
}

function maxFandD(i, j) {
    var result = 0;
    var operationTime = 0;
    result = notAndF(i, j) + notOrD(i, j) - 1;
    operationTime = timeOfDifference + timeOfMultiplicity + timeOfComparing; 
    Tn += operationTime;
    counterOfDifference++; //внимательно
    counterOfSum++;
    counterOfComparing++;
    counterOfmaxFandD++;
    if (result >= 0) return result;
    else return 0;
}

function implicationAandB(a, b) {
    var operationTime = 0;
    operationTime = timeOfDifference + timeOfDivision + timeOfComparing;
    Tn += operationTime; 
    counterOfDifference++;
    counterOfDivision++;
    counterOfComparing++;
    counterOfimplicationAandB++;
    var result = b / (1 - a);
    return result > 1 ? 1 : result;
}

function implicationBandA(b, a) {
    var operationTime = 0;
    operationTime = timeOfDifference + timeOfDivision + timeOfComparing;
    Tn += operationTime; 
    counterOfDifference++;
    counterOfDivision++;
    counterOfComparing++;
    counterOfimplicationBandA++;
    var result = a / (1 - b);
    return result > 1 ? 1 : result;
}