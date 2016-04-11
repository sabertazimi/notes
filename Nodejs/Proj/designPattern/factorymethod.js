module.exports = (function () {
	function VehicleFactory() {
		var publicVehicle = new Object();

	    // specific factory
	    function Car( options ) {
		  this.type = 'car';
	      this.doors = options.doors || 4;
	      this.state = options.state || "brand new";
	      this.color = options.color || "silver";
	      this.speed = options.speed || 10;
	    }
	    function Truck( options){
		  this.type = 'truck';
	      this.state = options.state || "used";
	      this.wheelSize = options.wheelSize || "large";
	      this.color = options.color || "blue";
	      this.speed = options.speed || 8;
	    }

		// public features of vehicle , added to __proto__
		function _run() {
			var args = [].slice.call(arguments);

			if (args.length === 0) {
				console.log(this.type + ' - run with: ' + this.speed + 'km/s');
			} else if (toString.apply(args[0]) === '[object Number]') {
				this.speed = args[0];
			}
		}
		function _withColor() {
			var args = [].slice.call(arguments);

			if (args.length === 0) {
				console.log('The color of this ' + this.type + ' product is : ' + this.color);
			} else if (toString.apply(args[0]) === '[object String]') {
				this.color = args[0];
			}
		}
		// provide a function to change other public features
		// decorator pattern
		function _reform(funcName, newFunc) {
			if (typeof this[funcName] === 'function' || typeof this.prototype[funcName] === 'function') {
				delete this[funcName];
				this.prototype[funcName] = newFunc;
			}
		}
		// provide a function to add new public features
		function _addFeature(funcName, newFunc) {
			if (typeof this[funcName] === 'undefined') {
				this[funcName] = newFunc;
				this.prototype[funcName] = newFunc;
			}
		}

		// private features, added to obj

	    // core: create method
		this.create = function (options) {
			var vehicleClass = '',
				newVehicle = {};

			if (options.type === 'car') {
				vehicleClass = Car;
			} else {
				vehicleClass = Truck;
			}

			// create new vehicle with options, by pre-defined specific constructor
			newVehicle =  new vehicleClass(options);
			// set up prototype
			newVehicle.__proto__ = publicVehicle;
			newVehicle.prototype = publicVehicle;

			// add public feature
			newVehicle.prototype.run = _run;
			newVehicle.prototype.withColor = _withColor;
			newVehicle.prototype.reform = _reform;
			newVehicle.prototype.addFeature = _addFeature;

			// add private(seperately) feature

			// return new obj
			return newVehicle;
		};
	}

	// define more factory

	return {
		vehicleFactory: VehicleFactory
	};
}());
