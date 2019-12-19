// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      return (this.rows()[rowIndex].reduce( (accumulator, currentValue, currentIndex, array) => accumulator + currentValue) > 1);
      // return false; // fixme
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      // board values  .attributes[0][0]   or .attributes.n (gives our board size)
      // this.rows() returns the board in array format
      for(var i = 0; i < this.rows().length; i++) {
        if(this.hasRowConflictAt(i)) {
          return true;
        }
      }
      return false; // fixme
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      var playArea = this.rows();
      var tempArray = [];
      for(let i = 0; i < playArea.length; i++) {
        tempArray.push(playArea[i][colIndex]);
      }
      return (tempArray.reduce( (accumulator, currentValue, currentIndex, array) => accumulator + currentValue) > 1);
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      for(var i = 0; i < this.rows().length; i++) {
        if(this.hasColConflictAt(i)) {
          return true;
        }
      }
      return false; // fixme
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {

      // _getFirstRowColumnIndexForMajorDiagonalOn(row, column)  // returns column - row
      //     0  1  2  (column index)
      //0:  [1, 2, 3]
      //1:  [4, 5, 6]
      //2:  [7, 8, 9]

      // diagonal:
      // [1][0], [2][2]
      // [0][0], [1][1], [2][2]
      // [0][2], [1][2]


      //     0  1  2  3  (column index)
      //0:  [1, 2, 3, 4]
      //1:  [5, 6, 7, 8]
      //2:  [9, 0, 1, 2]
      //3:  [3, 4, 5, 6]
      //4       x
      // diagonal:
      //
      // [0][2], [1][3]                   => [i][i+2]     loop (n-2)  <--- 2
      // [0][1], [1][2], [2][3]           => [i][i+1]     loop  (n-1) <--- 1
      // [0][0], [1][1], [2][2], [3][3] , => [i][i]       loop (n)    <--- 0
      // [1][0], [2][1], [3][2]           => [i+1][i]     loop (n-1)  <--- -1
      // [2][0], [3][1],                  => [i+2][i]    loop (n-2)   <--- -2
      //

      // n=1, 0 diagonals - 0
      // n=2, 0 diagonals - 0

      // n=3, 3 diagonals - 0
      // n=4, 5 diagonals - 1
      // n=5, 7 diagonals - 2
      // n=6, 9 diagonals  - 3
      // n=7, 11 diagonals - 4
      // n=8, 13 diagonals - 5
      // n=9, 15 diagonals - 6
      // n=10, 17 diagonals - 7
      // diagonalCount = n + (n-3);

      var playArea = this.rows();
      // console.log('play ', playArea);
      var num = majorDiagonalColumnIndexAtFirstRow;
      if(num < 0) {
        num += 1;
      } else if(num > 0) {
        num -= 1;
      }
      console.log('num ',num);
      var count = 0;
      for (var i = 0; i < (this.get('n') - Math.abs(num)); i++) {
        console.log('i ',i);
        if(num > 0) {
          count += playArea[i][i + num];
          return;
        } else if (num === 0) {
          count += playArea[i][i];
        } else {
          console.log('[', i + Math.abs(num), '][', i,']');
          count += playArea[i + Math.abs(num)][i];
        }
        if (count > 1) { return true; }
      }
      return false;
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {

      var n = this.get('n');
      for (i = -(n - 1); i < n; i++) {
        if (this.hasMajorDiagonalConflictAt(i)) {
          return true;
        }
      }
      return false; // fixme
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      return false; // fixme
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      return false; // fixme
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
