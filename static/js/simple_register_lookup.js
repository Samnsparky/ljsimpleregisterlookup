/**
 * Javascript client-side controller for Simple Register Lookup.
 *
 * Client-side controller for the Simple Register Lookup, a web-based modbus
 * map lookup utility.
 *
 * @author Sam Pottinger
 * @license GNU GPL v2
**/

// Thanks http://www.tutorialspoint.com/javascript/array_map.htm
if (!Array.prototype.map)
{
  Array.prototype.map = function(fun /*, thisp*/)
  {
    var len = this.length;
    if (typeof fun != "function")
      throw new TypeError();

    var res = new Array(len);
    var thisp = arguments[1];
    for (var i = 0; i < len; i++)
    {
      if (i in this)
        res[i] = fun.call(thisp, this[i], i, this);
    }

    return res;
  };
}


/**
 * Updates the registers data table with the given registers data.
 *
 * Re-initalizes the registers data table with server-provided registers data,
 * hiding the loading indiciator and showing the table in the process.
 *
 * @param {array} data Registers 2D array provided by the server.
**/
var updateRegistersTable = function(data)
{
    // Create bare table
    $('#register-table-container').html(
        '<table cellpadding="0" cellspacing="0" border="0" class="display" id="register-table"></table>'
    );

    // Generate columns
    var columns = data[0].map(function(x) {
        return { "sTitle": x, "sClass": "left"};
    });

    // Initialize data table
    $('#register-table').dataTable( {
        "aaData": data.slice(1),
        "aoColumns": columns,
        "aaSorting": [[ 1, "asc" ]],
        "bJQueryUI": true,
        "sPaginationType": "full_numbers"
    } );

    // Show table
    $('#register-table-container').show();
    $('#loading-image').hide();
}


/**
 * Makes a async request for register data for the user-selected device.
 *
 * Starts an AJAX request for register data for the device selected in the
 * device-dropdown menu. Hides the data table and shows the loading / busy
 * indicator in the process.
**/
var requestRegistersTable = function()
{
    // Show loading indicator
    $('#register-table-container').hide();
    $('#loading-image').show();

    // Execute AJAX request
    // TODO: jQuery does not have an onError event for getJSON. Need workaround.
    $.getJSON(
        'lookup/' + $("#device-dropdown").val() + '.json',
        updateRegistersTable
    );
}


// Register even listener for the device dropdown menu.
$(window).load(function () {
    requestRegistersTable();
    $('#device-dropdown').change(requestRegistersTable);
});
