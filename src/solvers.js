/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other



window.findNRooksSolution = function (n) {
  var solution = [];
  var board = new Board({ n: n });

  // if (n === 0 || n === 1) { return board.rows(); }
  var iterateRow = function (row) {
    if (row === n) {
      return solution = _.map(board.rows(), function (row) {
        return row.slice();
      });
    }
    for (let col = 0; col < n; col++) {
      board.togglePiece(row, col);
      if (!board.hasAnyRooksConflicts()) {
        iterateRow(row + 1);
      }
      board.togglePiece(row, col);
    }
  };
  iterateRow(0);

  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function (n) {
  var solutionCount = 0;
  var board = new Board({ n: n });
  if (n < 2) { return 1; }
  var iterateRow = function (row) {
    if (row === n) {
      solutionCount++;
      return;
    }
    for (let col = 0; col < n; col++) {
      board.togglePiece(row, col);
      if (!board.hasAnyRooksConflicts()) {
        iterateRow(row + 1);
      }
      board.togglePiece(row, col);
    }
  };
  iterateRow(0);

  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function (n) {
  var solution = []; //fixme
  var board = new Board({ n: n });

  if (n === 0 || n === 2 || n === 3) { return board.rows(); }
  var iterateRow = function (row) {


    if (row === n) {
      return solution = _.map(board.rows(), function (row) {
        return row.slice();
      });
    }
    for (let col = 0; col < n; col++) {
      board.togglePiece(row, col);
      if (!board.hasAnyQueensConflicts()) {
        iterateRow(row + 1);
      }
      board.togglePiece(row, col);
    }
  };
  iterateRow(0);

  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function (n) {
  var board = new Board({ n: n });
  var solutionCount = 0;

  // if (n === 0 || n === 1) { return 1; }
  if (n === 2 || n === 3) { return 0; }
  var iterateRow = function (row) {
    var test = _.map(board.rows(), function (row) {
      return row.slice();
    });

    if (row === n) {
      console.log('test ', test);
      return solutionCount++;
    }
    for (let col = 0; col < n; col++) {
      board.togglePiece(row, col);
      if (!board.hasAnyQueensConflicts()) {
        iterateRow(row + 1);
      }
      board.togglePiece(row, col);
    }
  };
  iterateRow(0);

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};