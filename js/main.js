
var api_url = 'https://7rn7ut09wh.execute-api.us-east-1.amazonaws.com/dev/textchart';
var cm = undefined;


function cm_setup_autocomplete() {
  "use strict";

  var WORD = /[\w$]+/g, RANGE = 500;

  CodeMirror.registerHelper("hint", "anyword", function(editor, options) {
    var word = options && options.word || WORD;
    var range = options && options.range || RANGE;
    var cur = editor.getCursor(), curLine = editor.getLine(cur.line);
    var start = cur.ch, end = start;
    while (end < curLine.length && word.test(curLine.charAt(end))) ++end;
    while (start && word.test(curLine.charAt(start - 1))) --start;
    var curWord = start != end && curLine.slice(start, end);

    var list = [], seen = {};
    function scan(dir) {
      var line = cur.line, end = Math.min(Math.max(line + dir * range, editor.firstLine()), editor.lastLine()) + dir;
      for (; line != end; line += dir) {
        var text = editor.getLine(line), m;
        word.lastIndex = 0;
        while (m = word.exec(text)) {
          if ((!curWord || m[0].indexOf(curWord) == 0) && !seen.hasOwnProperty(m[0])) {
            seen[m[0]] = true;
            list.push(m[0]);
          }
        }
      }
    }
    scan(-1);
    scan(1);
    return {list: list, from: CodeMirror.Pos(cur.line, start), to: CodeMirror.Pos(cur.line, end)};
  });
}



function get_uml() {
    //$('#code').val();
    return cm.getValue();
}

function set_uml(uml) {
    //$('#code').val(uml);
    cm.setValue(uml);
}

function refresh_uml() {
    console.log('UML Changed');

    // Get UML
    var uml = get_uml();

    // Update the Plant UML diagram
    display_plantuml(uml);

    var id = qs('id');

    if(id) {
        // Dont use hash if saved to DB
        console.log('Skip hash, existing id', id);
        window.location.hash = '#';
    } else {
        // If not saved to DB, save to link
        // Base64 UML for Linking
        var b64_uml = b64EncodeUnicode(uml);
        console.log('UML Base64: ' + b64_uml);

        // Get the page URL info
        var page_url = window.location.href;
        var hash_index = page_url.indexOf('#');
        if (hash_index > -1) {
            page_url = page_url.slice(0, hash_index);
        }
        // Create the link with UML encoded
        var new_hash = '#' + b64_uml;

        // Update the browser url/location
        if(history.pushState) {
            history.pushState(null, 'null', new_hash);
        } else {
            location.hash = new_hash;
        }
    }
}


function save_to_db(newid) {

    var id = qs('id');
    var uml = get_uml();

    if (newid) { 
        //alert('Force New ID');
        id = UUID.generate();
        //alert('New ID: ' + id);
        console.log('Save data: forced new id', id);
    } else if(id) { 
        //alert(id);
        console.log('Save data: existing id', id);
    } else {
        //alert('Need ID');
        id = UUID.generate();
        //alert('New ID: ' + id);
        console.log('Save data: new id', id);
    }

    //alert(uml);

    var jqxhr = $.ajax({
        type: 'POST',
        url: api_url + '/save',
        data: {
          'id': id,
          'data': uml
        }
    })
    jqxhr.done(function( data ) {
        console.log('Save Data');
        console.log(data);
        var s = data['status'];
        //alert(s);
        alert('UML Saved.');
        window.location.search = 'id=' + id;
        window.location.hash = '#';
    });
    jqxhr.fail(function (e) {
        console.log('Save Data ERROR');
        console.log(e);
        alert('Error Saving data: ' + JSON.stringify(e));
    });
}

function read_from_db(id) {

    if(id) {

      //alert('id: ' + id);
      console.log('Read Data: id: ', id);

      var jqxhr = $.ajax({
          type: 'GET',
          url: api_url + '/read?id=' + id
      })
      jqxhr.done(function( data ) {
          console.log('Read Data');
          console.log(data);
          var uml = data['data'];
          var status = data['status'];
          set_uml(uml);
          refresh_uml();
          //alert('Status for ' + id + ' is ' + status);
      });
      jqxhr.fail(function (e) {
          console.log('Read Data ERROR');
          console.log(e);
          alert('Error loading data: ' + JSON.stringify(e));
      });

    } else {
        console.log('Read Data: No id');
    }
}


function clear_share_link() {
    $('#page_link').attr('href', 'javascript:void(0); return false;');
    $('#page_link').text('Updating ...');
}

function update_share_link() {
    // Create a short URL
    var jqxhr = $.ajax({
        type: 'GET',
        url: "https://khl.io/?url=" + encodeURIComponent(window.location.href)
    })
    jqxhr.done(function( data ) {
        console.log('Short URL: response_text')
        console.log(data);
        var short_url = data['short_url'];
        console.log('Short URL: ' + short_url);
        // Use the short error
        $('#page_link').attr('href', short_url);
        $('#page_link').text(short_url);
    });
    jqxhr.fail(function (e) {
        console.log('Short URL: Ajax ERROR');
        console.log(e);
        // Use the page link if we hit an error
        $('#page_link').attr('href', page_link);
        $('#page_link').text(page_link);

    });
}


function load_uml() {

    var id = qs('id');

    if(id) {
        // read id
        console.log('Loading uml from DB')
        read_from_db(id);
    } else {
        // Read from hash
        console.log('Loading uml from hash')
        if(window.location.hash) {
            var hash = window.location.hash;
            hash = hash.slice(1);
            console.log('Location UML Base64: ' + hash);

            try {
                var uml = b64DecodeUnicode(hash);
                set_uml(uml);
                // Below leads to double updates
                // $('#code').trigger('input');
            }
            catch(e) {
                console.log('WARN');
                console.log('Unable to decode hash: ' + hash);
            }
        }
        
        refresh_uml();
    }
}

$(function() {

    var code_textarea = $('#code')[0];
    cm = CodeMirror.fromTextArea(code_textarea, {
      lineNumbers: true,
      lineWrapping: true,
      showCursorWhenSelecting: true,
      indentUnit: 2,
      tabSize: 2,
      autofocus: true,
      theme: 'material',
      mode: "htmlmixed"
    });

		cm_setup_autocomplete();

    cm.on("change", function(cm, change) {
        var uml = cm.getValue();
        refresh_uml(uml);
    });

    // Enable tooltips
    $('[data-toggle="tooltip"]').tooltip();

    // Monitor the UML TextArea
    $('#code').on('input', function() {
        refresh_uml();
    });

    // Setup forward/back history handling
    $(window).on('popstate', function(event) {
        console.log('Window History movement')
        load_uml();
    });

    // Update the share link when the modal is displayed
    $('#linkModal').on('show.bs.modal', function () {
        clear_share_link();
    });
    $('#linkModal').on('shown.bs.modal', function () {
        update_share_link();
    });

    // Update based on prior state in the URL, or DB
    load_uml();

    // Enable save button
    $('#save-btn').on('click', function () {
        save_to_db();
    });
});
