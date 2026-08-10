export const XmlParser = function () {
  var _version = '0.0.2';
  var ParsedAttributeSection;
  var ParsedCgiSection;

  var AttributeSectionXML;
  var CgiSectionXML;

  const version = () => {
    return _version;
  };

  const stringToJsonCGIs = (result) => {
    var dataType, oValue;

    var dataTypeNode = result.find('dataType')[0].childNodes[0];
    if (dataTypeNode !== undefined) {
      dataType = dataTypeNode.nodeName;
    }
    if (dataType === 'string') {
      oValue = {};

      if (dataTypeNode.getAttribute('minlen') !== null) {
        oValue.minLength = dataTypeNode.getAttribute('minlen');
      }

      if (dataTypeNode.getAttribute('maxlen') !== null) {
        oValue.maxLength = dataTypeNode.getAttribute('maxlen');
      }

      if (dataTypeNode.getAttribute('formatInfo')) {
        oValue.formatInfo = dataTypeNode.getAttribute('formatInfo');
      }

      if (dataTypeNode.getAttribute('format')) {
        oValue.format = dataTypeNode.getAttribute('format');
      }
    } else if (dataType === 'int' || dataType === 'float') {
      oValue = {};

      if (dataTypeNode.getAttribute('min') !== null) {
        if (dataType === 'float') {
          oValue.minValue = parseFloat(dataTypeNode.getAttribute('min'));
        } else {
          oValue.minValue = parseInt(dataTypeNode.getAttribute('min'), 10);
        }
      }

      if (dataTypeNode.getAttribute('max') !== null) {
        if (dataType === 'float') {
          oValue.maxValue = parseFloat(dataTypeNode.getAttribute('max'));
        } else {
          oValue.maxValue = parseInt(dataTypeNode.getAttribute('max'), 10);
        }
      }
    } else if (dataType === 'enum' || dataType === 'csv') {
      oValue = [];

      var entries = result.find('entry');
      entries.each(function () {
        var currEntry = $(this);
        oValue.push(currEntry.attr('value'));
      });
    } else if (dataType === 'bool') {
      oValue = true;
    }

    return oValue || {};
  };

  const stringToJsonAttributes = (result) => {
    var oValue;

    var dataType = result.attr('type');
    var iValue = result.attr('value');

    if (dataType === 'bool') {
      if (iValue === 'True') {
        oValue = true;
      } else {
        oValue = false;
      }
    } else if (dataType === 'int') {
      oValue = parseInt(iValue, 10);
    } else if (dataType === 'enum' || dataType === 'csv') {
      var toSplit = iValue.split(',');

      oValue = [];
      for (var i = 0; i < toSplit.length; i = i + 1) {
        oValue.push(toSplit[i]);
      }
    }

    return oValue;
  };

  function Constructor() {
    Constructor.prototype.version = version();
  }

  /**********************************************************/
  Constructor.prototype = {
    /*
      iXML : Output From http://<ip>/stw-cgi/attributes.cgi/cgis
      inputStr : cginame/submenu/parameter/datatype
      Usage: XMLParser.parseCgiSection(iXML,inputStr);
      */
    parseCgiSection: (iXML, inputStr, options) => {
      if (typeof CgiSectionXML === 'undefined' || CgiSectionXML !== iXML) {
        CgiSectionXML = iXML;
        ParsedCgiSection = $($.parseXML(iXML));
      }

      var xmlData = ParsedCgiSection;
      var token = inputStr.split('/');

      var cgiName = null,
        submenu = null,
        action = null,
        parameter = null,
        datatype = null;

      if (token.length === 5) {
        // cginame/submenu/action/parameter/datatype
        (cgiName = token[0]),
          (submenu = token[1]),
          (action = token[2]),
          (parameter = token[3]),
          (datatype = token[4]);
      } else if (token.length === 4) {
        // cginame/submenu/parameter/datatype
        (cgiName = token[0]),
          (submenu = token[1]),
          (parameter = token[2]),
          (datatype = token[3]);
      } else if (token.length === 3) {
        // submenu/parameter/datatype
        (submenu = token[0]), (parameter = token[1]), (datatype = token[2]);
      } else if (token.length === 2) {
        // parameter/datatype
        (parameter = token[0]), (datatype = token[1]);
      } else {
        // cannot Found: return 'undefined'
        return;
      }

      if (cgiName) {
        xmlData = xmlData.find("cgi[name='" + cgiName + "']").first();
      }
      if (submenu) {
        xmlData = xmlData.find("submenu[name='" + submenu + "']").first();
      }
      if (action) {
        xmlData = xmlData.find("action[name='" + action + "']").first();
      }
      if (parameter) {
        xmlData = xmlData.find("parameter[name='" + parameter + "']").first();
      }

      if (xmlData.length > 0) {
        var json = stringToJsonCGIs(xmlData);
        if (options && options.parseRequest && xmlData[0]) {
          json.isRequest = xmlData[0].getAttribute('request') === 'true';
        }
        return json;
      } else {
        // Not Found: return 'undefined'
        return;
      }
    },
    parseAttributeSectionByChannel: (iXML, inputStr, maxChannel) => {
      var xmlData = null;
      var result = Array(maxChannel);
      if (
        typeof AttributeSectionXML === 'undefined' ||
        AttributeSectionXML !== iXML
      ) {
        AttributeSectionXML = iXML;
        xmlData = $($.parseXML(iXML));
        ParsedAttributeSection = xmlData;
      } else {
        xmlData = ParsedAttributeSection;
      }

      if (!xmlData) {
        return result;
      }

      var array = inputStr.split('/');
      var targetIndex = array.length - 1;
      var groupName = array[0],
        categoryName = array[1],
        attrName = array[targetIndex];

      var setAttributeByChannel = function (channelId, attributes, attrName) {
        var attribute = attributes.filter("[name='" + attrName + "']").first();
        result[channelId] = stringToJsonAttributes(attribute);
      };

      var category = xmlData
        .find('group')
        .filter("[name='" + groupName + "']")
        .first()
        .find('category')
        .filter("[name='" + categoryName + "']")
        .first();

      var channels = category.find('channel');
      if (channels.length === 0) {
        setAttributeByChannel(0, category.find('attribute'), attrName);
      } else {
        channels.each(function () {
          var channelId = parseInt($(this).attr('number'), 10);
          setAttributeByChannel(channelId, $(this).find('attribute'), attrName);
        });
      }

      return result;
    },
    /*
      iXML : http://<ip>/stw-cgi/attributes.cgi/attributes
      inputStr : groupName/categoryName/attributeName
      Usage: XMLParser.parseAttributeSection(iXML,inputStr)
      */
    parseAttributeSection: (iXML, inputStr) => {
      var xmlData = null;
      if (
        typeof AttributeSectionXML === 'undefined' ||
        AttributeSectionXML !== iXML
      ) {
        AttributeSectionXML = iXML;
        xmlData = $($.parseXML(iXML));
        ParsedAttributeSection = xmlData;
      } else {
        xmlData = ParsedAttributeSection;
      }

      var token = inputStr.split('/');
      let groupName = null,
        categoryName = null,
        attributeName = null;

      if (token.length === 3) {
        (groupName = token[0]),
          (categoryName = token[1]),
          (attributeName = token[2]);
      } else if (token.length === 2) {
        (categoryName = token[0]), (attributeName = token[1]);
      } else if (token.length === 1) {
        attributeName = token[0];
      }

      if (groupName) {
        xmlData = xmlData.find("group[name='" + groupName + "']").first();
      }
      if (categoryName) {
        xmlData = xmlData.find("category[name='" + categoryName + "']").first();
      }
      if (attributeName) {
        var notChannels = xmlData.children().not('channel');
        if (notChannels.length > 0) {
          // has "attribute" node
          xmlData = xmlData
            .find("attribute[name='" + attributeName + "']")
            .last();
        } else {
          // has "channel" node only, no "attributes" node
          xmlData = xmlData
            .find("attribute[name='" + attributeName + "']")
            .first();
        }
      }

      if (xmlData.length > 0) {
        return stringToJsonAttributes(xmlData);
      } else {
        // Not Found: return 'undefined'
        return;
      }
    },
  };

  return new Constructor();
};
