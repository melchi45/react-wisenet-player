/**
 * AttributeException
 * @class AttributeException
 * @author by Youngho Kim
 */
// Create an object type UserException
// Creates user-defined exceptions
export var AttributeException = (function () {
  'use strict';
  var version = '1.0.0';

  //constructor
  function AttributeException() {
    //enforces 'new' instance
    if (!(this instanceof AttributeException)) {
      return new AttributeException(arguments);
    }
    var error,
      //handles the arguments object when is passed by enforcing a 'new' instance
      args = Array.apply(
        null,
        typeof arguments[0] === 'object' ? arguments[0] : arguments
      ),
      message;

    if (args.length !== 0) {
      message = args.shift() || 'An exception has occurred';
    } else {
      message = arguments[0].message;
    }
    //channel = arguments[0] === 'object' ? arguments[0].channelId: 0;
    var channel = arguments[0] !== 'object' ? arguments[0].channelId : 0;
    var element = arguments[0] !== 'object' ? arguments[0].elementId : '';
    var errCode = arguments[0] !== 'object' ? arguments[0].errorCode : 0;
    var place = arguments[0] !== 'object' ? arguments[0].place : '';

    //builds the message with multiple arguments
    if (~message.indexOf('}')) {
      args.forEach(function (arg, i) {
        message = message.replace(RegExp('\\{' + i + '}', 'g'), arg);
      });
    }

    //gets the exception stack
    error = new Error(message);
    //access to AttributeException.prototype.name
    error.name = this.name;

    //set the properties of the instance
    //in order to resemble an Error instance
    Object.defineProperties(this, {
      stack: {
        enumerable: false,
        get: function () {
          return error.stack;
        },
      },
      message: {
        enumerable: false,
        value: message,
      },
      channel: {
        enumerable: false,
        value: channel,
      },
      element: {
        enumerable: false,
        value: element,
      },
      errorCode: {
        enumerable: false,
        value: errCode,
      },
      place: {
        enumerable: false,
        value: place,
      },
    });
  }

  // Creates the prototype and prevents the direct reference to Error.prototype;
  // Not used new Error() here because an exception would be raised here,
  // but we need to raise the exception when AttributeException instance is created.
  AttributeException.prototype = Object.create(Error.prototype, {
    //fixes the link to the constructor (ES5)
    constructor: setDescriptor(AttributeException),
    name: setDescriptor('UMP Error'),
  });

  function setDescriptor(value) {
    return {
      configurable: false,
      enumerable: false,
      writable: false,
      value: value,
    };
  }
  //returns the constructor
  return AttributeException;
})();
