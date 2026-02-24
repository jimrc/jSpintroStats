'use strict';

// CONSTANTS //

var EPSILON = 1e-20;

// ALIAS //

/**
* FUNCTION: alias( p, F, A )
*	Initialization step of alias method as described by Kronmal & Peterson.
*
*	References:
*		Kronmal, R. A., & Peterson, A. V. (1979).
*		On the Alias Method for Generating Random Variables
*		from a Discrete Distribution.
*		The American Statistician, 33(4), 214.
*		doi:10.2307/2683739
*
* @param {Array} p - probalities of discrete distribution
* @param {Array} F - array to receive cut-off values
* @param {Array} A - array to receive alias values
* @returns {Void} function mutates `F` and `A`, does not return anything
*/
function alias( p, F, A ) {
	var i, ig, is,
		k, j,
		n = p.length,
		G = new Array( n ),
		S = new Array( n - 1 ),
		ig = 0,
		is = 0;

	for ( i = 0; i < n; i++ ) {
		F[ i ] = n * p[ i ];
		if ( F[ i ] < 1 ) {
			S[ is ] = i + 1;
			is += 1;
		} else {
			G[ ig ] = i + 1;
			ig += 1;
		}
	}
	do {
		if ( is == 0 ) {
			return;
		}
		k = G[ ig - 1 ];
		j = S[ is - 1 ];

		is = is - 1;
		A[ j - 1 ] = k;
		F[ k - 1 ] = F[ k - 1 ] - ( 1 - F[ j - 1 ] );
		if ( F[ k - 1 ] < 1 - EPSILON ) {
			ig = ig - 1;
			is = is + 1;
			S[ is - 1 ] = k;
		}
	} while ( true );

} // end FUNCTION alias()


// EXPORTS //

//module.exports = alias;
//'use strict';

// MODULES //

//var partial = require( './partial.js' ),
//	recurse = require( './recurse.js' );


// RANDOM //

/**
* FUNCTION: random( dims, m, n, k[, rand] )
*	Creates a multidimensional array of hypergeometric distributed random numbers.
*
* @param {Number[]} dims - dimensions
* @param {Number} m - number of white balls in urn
* @param {Number} n - number of black balls in urn
* @param {Number} k - number of draws
* @param {Function} [rand=Math.random] - random number generator
* @returns {Array} multidimensional array filled with hypergeometric random numbers
*/
function randomHg( dims, m, n, k, rand ) {
	var draw = partial( m, n, k, rand );
	return recurse( dims, 0, draw );
} // end FUNCTION randomHg()


// EXPORTS //

//module.exports = randomHg;
//'use strict';

// MODULES //

//var partial = require( './partial.js' );


// RANDOM //

/**
* FUNCTION: random( len, m, n, k[, rand] )
*	Creates an array of hyperGeometric distributed random numbers.
*
* @param {Number} len - array length
* @param {Number} m - number of white balls in urn
* @param {Number} n - number of black balls in urn
* @param {Number} k - number of draws
* @param {Function} [rand=Math.random] - random number generator
* @returns {Number[]} array filled with binomial random numbers
*/
function randomHgArray( len, m, n, k, rand ) {
	var out,
		draw,
		i;
	draw = partial( m, n, k, rand );
	// Ensure fast elements...
	if ( len < 64000 ) {
		out = new Array( len );
		for ( i = 0; i < len; i++ ) {
			out[ i ] = draw();
		}
	} else {
		out = [];
		for ( i = 0; i < len; i++ ) {
			out.push( draw() );
		}
	}
	return out;
} // end FUNCTION random()


// EXPORTS //

//module.exports = randomBin;
'use strict';

// MODULES //

//var isPositiveIntegerArray = require( 'validate.io-positive-integer-array' ),
//	isPositiveInteger = require( 'validate.io-positive-integer' ),
//	lcg = require( 'compute-lcg' ),
//	validate = require( './validate.js' );


// FUNCTIONS //

//var array = require( './array.js' ),
//	typedarray = require( './typedarray.js' ),
//	arrayarray = require( './arrayarray.js' ),
//	matrix = require( './matrix.js' ),
//	number = require( './number.js' );


// UNIFORM GENERATOR //

//var RAND = lcg();


// HYPERGEOMETRIC RANDOM VARIATES //

/**
* FUNCTION: random( [dims][, opts] )
*	Creates a matrix or array filled with hypergeometric random numbers.
*
* @param {Number|Number[]} [dims] - dimensions
* @param {Object} [opts] - function options
* @param {Number} [opts.m=1] - number of white balls in urn
* @param {Number} [opts.n=1] - number of black balls in urn
* @param {Number} [opts.k=1] - number of draws
* @param {String} [opts.dtype="generic"] - output data type
* @param {Number} [opts.seed] - integer-valued seed
* @returns {Array|Number[]|Int8Array|Uint8Array|Uint8ClampedArray|Int16Array|Uint16Array|Int32Array|Uint32Array|Float32Array|Float64Array|Matrix} random numbers
*/
function randomHgdims( dims, options ) {
	var opts = {},
		isArray,
		ndims,
		err,
		len,
		m, n, k,
		rand,
		dt;

	if ( arguments.length > 0 ) {
		isArray = isPositiveIntegerArray( dims );
		if ( !isArray && !isPositiveInteger( dims ) ) {
			throw new TypeError( 'random()::invalid input argument. Dimensions argument must be either a positive integer or a positive integer array. Value: `' + dims + '`.' );
		}
	}
	if ( arguments.length > 1 ) {
		err = validate( opts, options );
		if ( err ) {
			throw err;
		}
	}

	if ( opts.seed ) {
		rand = lcg( opts.seed );
	} else {
		rand = RAND;
	}
	dt = opts.dtype || 'generic';

	m = typeof opts.m !== 'undefined' ? opts.m : 1;
	n = typeof opts.n !== 'undefined' ? opts.n : 1;
	k = typeof opts.k !== 'undefined' ? opts.k : 1;

	if ( arguments.length === 0 ) {
		return number( m, n, k, rand );
	}
	if ( isArray ) {
		ndims = dims.length;
		if ( ndims < 2 ) {
			len = dims[ 0 ];
		}
	} else {
		ndims = 1;
		len = dims;
	}
	// 1-dimensional data structures...
	if ( ndims === 1 ) {
		if ( len === 1 ) {
			return number( m, n, k, rand );
		}
		if ( dt === 'generic' ) {
			return array( len, m, n, k, rand );
		}
		return typedarray( len, dt, m, n, k, rand );
	}
	// Multidimensional data structures...
	if ( dt !== 'generic' ) {
		if ( ndims === 2 ) {
			return matrix( dims, dt, m, n, k, rand );
		}
		// TODO: dstructs-ndarray support goes here. Until then, fall through to plain arrays...
	}
	return arrayarray( dims, m, n, k, rand );
} // end FUNCTION random()


// EXPORTS //

//module.exports = random;

//Object.defineProperty( module.exports, 'seed', {
//	set: function ( newVal ) {
//		if ( !isPositiveInteger( newVal ) ) {
//			throw new TypeError( 'random()::invalid value. Seed property must be a positive integer. Option: `' + newVal + '`.' );
//		}
//		RAND = lcg( newVal );
//	}
//});
'use strict';

// MODULES //
//
//var matrix = require( 'dstructs-matrix' ),
//	partial = require( './partial.js' );


// RANDOM //

/**
* FUNCTION: random( dims, dt, m, n, k[, rand] )
*	Creates a matrix of hypergeometric distributed random numbers.
*
* @param {Number[]} dims - dimensions
* @param {String} dt - data type
* @param {Number} m - number of white balls in urn
* @param {Number} n - number of black balls in urn
* @param {Number} k - number of draws
* @param {Function} [rand=Math.random] - random number generator
* @returns {Matrix} matrix filled with hypergeometric random numbers
*/
function randomHgMtrx( dims, dt, m, n, k, rand ) {
	var out,
		draw,
		i;

	draw = partial( m, n, k, rand );
	out = matrix( dims, dt );
	for ( i = 0; i < out.length; i++ ) {
		out.data[ i ] = draw();
	}
	return out;
} // end FUNCTION random()


// EXPORTS //

//module.exports = random;
//'use strict';

// GENERATE HYPERGEOMETRIC RANDOM NUMBERS //

/**
* FUNCTION random( m, n, k[, rand] )
*	Generates a random draw from a hypergeometric distribution with parameters `m`, `n` and `k`.
*	Uses HBU algorithm as HALIAS has large initialization cost. TODO: this is inefficient, revise later.
*	Algorithm described in [1].
*	Reference:
*		[1] Kachitvichyanukul, V., & Schmeiser, B. (2007).
*		Computer generation of hypergeometric random variates.
*		Journal of Statistical Computation and Simulation,
*		22(2), 127–145. doi:10.1080/00949658508810839
*
* @param {Number} m - number of white balls in urn
* @param {Number} n - number of black balls in urn
* @param {Number} k - number of draws
* @param {Function} [rand=Math.random] - random number generator
* @returns {Number} random draw from the specified distribution
*/
function randomHg1( m, n, k, randp ) {
	var rand,
		ntotal,
		t, t1,
		x = 0,
		j, u;

	rand = randp ? randp : Math.random;
	ntotal = m + n;
	t = ntotal;
	t1 = m;
	for ( j = 0; j <= k; j++ ) {
		u = rand();
		if ( u < t1/t ) {
			x += 1;
			if ( x === m ) {
				return x;
			}
			t1 -= 1;
		}
		t -= 1;
	}
	return x;
} // end FUNCTION random()


// EXPORTS //

//module.exports = random;
'use strict';

// MODULES //

//var hyperPMF = require( 'distributions-hypergeometric-pmf/lib/array.js' ),
//	incrspace = require("compute-incrspace");


// FUNCTIONS //

var //alias = require( './alias.js' ),
	floor = Math.floor,
	max = Math.max,
	min = Math.min;

// PARTIAL //

/**
* FUNCTION: partial( m, n, k[, rand] )
*	Partially applies `m`, `n` and `k` and returns a function to generate random variables from a hypergeometric distribution.
*	The function uses the HALIAS algorithm described in [1].
*	Reference:
*		[1] Kachitvichyanukul, V., & Schmeiser, B. (2007).
*		Computer generation of hypergeometric random variates.
*		Journal of Statistical Computation and Simulation,
*		22(2), 127–145. doi:10.1080/00949658508810839
*
* @param {Number} m - number of white balls in urn
* @param {Number} n - number of black balls in urn
* @param {Number} k - number of draws
* @param {Function} [rand=Math.random] - random number generator
* @returns {Function} function which generates random draws from the specified distribution
*/
function partial( m, n, k, rand ) {
	var random,
		probs,
		il = max( 0, k - n ),
		iu = min( m, k ),
		vals,
		out,
		A, F;

	random = rand ? rand : Math.random;

	vals = sequence( 0, iu + 1, 1 );

	probs = new Array( vals.length );
	hyperPMF( probs, vals, m, n, k );

	A = new Array( vals.length );
	F = new Array( vals.length );
	alias( probs, F, A );

	/**
	* FUNCTION: draw()
	*	Generates a random draw for a hypergeometric with parameters `m`, `n` and `k`.
	*
	* @private
	* @returns {Number} random draw from the specified distribution
	*/
	return function draw() {
		var x;
		x = floor( random() * ( iu + 1 ) );
		if ( random() > F[ x ] ) {
			x = A[ x ] - 1;
		}
		return x;
	}; // end FUNCTION draw()

} // end FUNCTION partial()


// EXPORTS //

//module.exports = partial;
'use strict';

/**
* FUNCTION: recurse( dims, d, draw )
*	Recursively create a multidimensional array of hypergeometric distributed random numbers.
*
* @param {Number[]} dims - dimensions
* @param {Number} d - current recursion depth
* @param {Function} draw - function to generate hypergeometric random numbers with given `m`, `n` and `k`
* @returns {Array} output array
*/
function recurse( dims, d, draw ) {
	var out = [],
		len,
		i;

	len = dims[ d ];
	d += 1;
	if ( d < dims.length ) {
		for ( i = 0; i < len; i++ ) {
			out.push( recurse( dims, d, draw ) );
		}
	} else {
		for ( i = 0; i < len; i++ ) {
			out.push( draw() );
		}
	}
	return out;
} // end FUNCTION recurse()


//var isObject = require( 'validate.io-object' ),
//	isNonNegativeInteger = require( 'validate.io-nonnegative-integer' ),
//	isNumber = require( 'validate.io-number-primitive' ),
//	isPositiveInteger = require( 'validate.io-positive-integer' ),
//	isString = require( 'validate.io-string-primitive' );


// VALIDATE //

/**
* FUNCTION: validate( opts, options )
*	Validates function options.
*
* @param {Object} opts - destination for validated options
* @param {Object} options - function options
* @param {Number} [options.m] - number of white balls in urn
* @param {Number} [options.n] - number of black balls in urn
* @param {Number} [options.k] - number of draws
* @param {String} [options.dtype] - output data type
* @param {Number} [options.seed] - integer-valued seed
* @returns {Null|Error} null or an error
*/

function validate( opts, options ) {
	if ( !isObject( options ) ) {
		return new TypeError( 'random()::invalid input argument. Options argument must be an object. Value: `' + options + '`.' );
	}
	if ( options.hasOwnProperty( 'm' ) ) {
		opts.m = options.m;
		if ( !isNonNegativeInteger( opts.m ) ) {
			return new TypeError( 'random()::invalid option. `m` parameter must be a non-negative integer. Option: `' + opts.m + '`.' );
		}
	}
	if ( options.hasOwnProperty( 'n' ) ) {
		opts.n = options.n;
		if ( !isNonNegativeInteger( opts.n ) ) {
			return new TypeError( 'random()::invalid option. `n` parameter must be a non-negative integer. Option: `' + opts.n + '`.' );
		}
	}
	if ( options.hasOwnProperty( 'k' ) ) {
		opts.k = options.k;
		if ( !isNonNegativeInteger( opts.k ) ) {
			return new TypeError( 'random()::invalid option. `k` parameter must be a non-negative integer. Option: `' + opts.k + '`.' );
		}
	}
	if ( options.hasOwnProperty( 'dtype' ) ) {
		opts.dtype = options.dtype;
		if ( !isString( opts.dtype ) ) {
			return new TypeError( 'random()::invalid option. Data type option must be a string primitive. Option: `' + opts.dtype + '`.' );
		}
	}
	if ( options.hasOwnProperty( 'seed' ) ) {
		opts.seed = options.seed;
		if ( !isPositiveInteger( opts.seed ) ) {
			return new TypeError( 'random()::invalid option. Seed option must be a positive integer. Option: `' + opts.seed + '`.' );
		}
	}
	return null;
} // end FUNCTION validate()


// EXPORTS //

//module.exports = validate;
