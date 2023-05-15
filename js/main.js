///////////////////////////////////////////////////////

var default_samples = 'data/samples/data.json';
var api_url = 'https://api.textchart.com';

var server_url = "https://www.plantuml.com/plantuml";
//server_url = "http://127.0.0.1:8080/img/";

var cm = undefined;
var samples_list = undefined;
var default_samples_index = 0;

///////////////////////////////////////////////////////

function get_uml() {
    //$('#code').val();
    return cm.getValue();
}

function set_uml(uml) {
    //$('#code').val(uml);
    cm.setValue(uml);
}

function set_last_saved_uml(id, uml) {
    window.sessionStorage.setItem(id, uml);
    console.log('Session Storage: Saved for ID:' + id);
}

function get_last_saved_uml(id) {
    var data = window.sessionStorage.getItem(id);
    if( data == null || data == undefined) {
        console.log('Session Storage: Not found ID:' + id);
        data = '';
    }
    return data;
}

///////////////////////////////////////////////////////

function loading_show() {
    console.log('Loading Modal: Show');
    $('#loadingModal').modal('show');
}

function loading_hide() {
    console.log('Loading Modal: Hide');
    $('#loadingModal').modal('hide');
}

///////////////////////////////////////////////////////

function load_data() {
    console.log('Loading Data JSON');
    $.get(default_samples, function(response) {
        samples_list = response;

        console.log(samples_list);
        console.log( typeof(response) );

        for( var ea in samples_list) {
            var option = $('<option />');
            option.attr('value', samples_list[ea].path).text(samples_list[ea].label);
            $('#samples_dropdown').append(option);
        }

        $('#samples_dropdown').change(function() {
            display_selected_sample();
        });
        
        load_uml();
    }); 
}

function display_selected_sample() {
    console.log('Display Selected Sample');

    var selected = $('#samples_dropdown').find(':selected');
    load_sample_uml(selected.text(), selected.val());

}

function load_sample_uml(label, path, skipPrompt) {
    console.log('Loading Sample UML', path);

    if(skipPrompt) {
        _load_sample_uml(path);  
    } else {
        bb_confirm('Change UML to Sample \'' + label + '\'?', function (r) {
            if(r) {
                _load_sample_uml(path);  
            }
        });
    }
}

function _load_sample_uml(path) {
    console.log('Loading Sample UML Path', path);

    $.get(path, function(response) {
        set_uml(response);
        refresh_uml();
    });
}


function refresh_uml() {
    console.log('Refresh UML: Changed');

    // Get UML
    var uml = get_uml();

    // Update the Plant UML diagram
    display_plantuml(uml);

    var id = qs('id');

    if(id) {
        // Dont use hash if saved to DB
        console.log('Skip hash, using existing ID', id);
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

///////////////////////////////////////////////////////

function read_from_db(id, callback) {
    console.log('DB: Reading');

    loading_show();

    if(id) {

        //alert('id: ' + id);
        console.log('Read Data: ID: ' + id);

        var jqxhr = $.ajax({
            type: 'GET',
            url: api_url + '/read?id=' + id
        });
        jqxhr.done(function( data ) {
            loading_hide();
            console.log('Read Data.');
            console.log(data);
            var uml = data['data'];
            var status = data['status'];
            //alert('Status for ' + id + ' is ' + status);
            if( callback) {
                console.log('Read Data: Invoking callback.');
                callback(id, uml);
            } else {
                console.log('Read Data: No callback.');
                // keep to check if someone edits behind the scenes.
                set_last_saved_uml(id, uml);
                set_uml(uml);
                refresh_uml();
            }
        });
        jqxhr.fail(function (e) {
            loading_hide();
            refresh_uml();
            console.log('Read Data ERROR');
            console.log(e);
            bb_alert_error('Unfortunately, we could not find saved UML for ID: ' + id);
        });

    } else {
        loading_hide();
        console.log('Read Data: No ID');
    }
}

function save_to_db(newid) {
    console.log('DB: Saving');
    
    var id = qs('id');
    var uml = get_uml();

    if (newid) { 
        //mlert('Force New ID');
        id = uuidv4();
        //alert('New ID: ' + id);
        console.log('Save data: Force new ID', id);
        save_to_db_helper(id, uml);
    } else if(id) { 
        //alert(id);
        console.log('Save data: Using existing ID', id);
        read_from_db(id, save_pre_check);
    } else {
        //alert('Need ID');
        id = uuidv4();
        //alert('New ID: ' + id);
        console.log('Save data: New ID', id);
        save_to_db_helper(id, uml);
    }

}

function save_pre_check(id, uml_server) {
    var uml_last_save = get_last_saved_uml(id);
    console.log('Save Precheck: uml_last_save: ' + typeof(uml_last_save));

    if(uml_last_save.trim() != uml_server.trim()) {
        console.log('Precheck: FAIL');
        bb_confirm('Someone else saved UML while you were editing.\n\nConfirm overwrite?', function (r) {
            if(r) {
                save_to_db_helper(id);
            } else {
                console.log('Precheck: ABORT');
            }
        });
    } else {
        console.log('Precheck: PASS. All clear to save.');
        save_to_db_helper(id);
    }

}

function save_to_db_helper(id, uml) {
    console.log('Save Helper ID: ' + id);

    if(uml == undefined) {
        uml = get_uml();
    }

    //alert(uml);
    loading_show();

    var jqxhr = $.ajax({
        type: 'POST',
        url: api_url + '/save',
        data: {
            'id': id,
            'data': uml
        }
    });
    jqxhr.done(function( data ) {
        loading_hide();
        console.log('Save Data');
        console.log(data);
        var s = data['status'];
        //alert(s);
        bb_alert('UML Saved.');
        // keep to check if someone edits behind the scenes.
        set_last_saved_uml(id, uml);
        // update
        window.location.search = 'id=' + id;
        window.location.hash = '#';
    });
    jqxhr.fail(function (e) {
        loading_hide();
        console.log('Save Data ERROR');
        console.log(e);
        bb_alert_error('Error Saving data: ' + JSON.stringify(e));
    });
}
///////////////////////////////////////////////////////


function load_uml() {
    console.log('Load UML');
    
    var id = qs('id');

    if(id) {
        // read id
        console.log('Loading UML: from DB');
        read_from_db(id);
    } else {
        // Read from hash
        console.log('Loading UML: from hash');
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
            refresh_uml();
        } else {
            load_sample_uml(samples_list[default_samples_index].label, samples_list[default_samples_index].path, true);
        }
    }
}

///////////////////////////////////////////////////////

function clear_share_link() {
    $('#page_link').attr('href', 'javascript:void(0); return false;');
    $('#page_link').text('Updating ...');
}

function update_share_link() {
    console.log('Update share link');
    
    // Create a short URL
    var jqxhr = $.ajax({
        type: 'GET',
        url: 'https://khl.io/?url=' + encodeURIComponent(window.location.href)
    });
    jqxhr.done(function( data ) {
        console.log('Short URL: response_text');
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
        var page_link = location.href;
        // Use the page link if we hit an error
        $('#page_link').attr('href', page_link);
        $('#page_link').text(page_link);

    });
}

///////////////////////////////////////////////////////

function cm_setup_autocomplete() {
    CodeMirror.commands.autocomplete = function(cm) {
        cm.showHint({hint: CodeMirror.hint.anyword});
    };
}

///////////////////////////////////////////////////////

$(function() {
    console.log('Init');
    
    // Setup CodeMirror
    var code_textarea = $('#code')[0];
    cm = CodeMirror.fromTextArea(code_textarea, {
        lineNumbers: true,
        lineWrapping: true,
        showCursorWhenSelecting: true,
        indentUnit: 2,
        tabSize: 2,
        autofocus: true,
        theme: 'material',
        extraKeys: {'Ctrl-Space': 'autocomplete'},
        mode: 'yaml'
    });

    cm_setup_autocomplete();

    // resize
    $( window ).resize(function() {
        cm.refresh();
    });

    // on edit
    cm.on('change', function(cm, change) {
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
        console.log('Window History movement');
        load_uml();
    });

    // Update the share link when the modal is displayed
    $('#linkModal').on('show.bs.modal', function () {
        clear_share_link();
    });
    $('#linkModal').on('shown.bs.modal', function () {
        update_share_link();
    });

    // load data and then uml
    load_data();

    // Enable revert button
    $('#revert-btn').on('click', function () {
        var id = qs('id');
        if(id) {
            bb_confirm('Revert to the last saved version?', function (r) {
                if(r) {
                    load_uml();
                }
            });
        } else {
            bb_alert_warn('No prior saved version exists. Please save first :)');
        }
    });
    // Enable save button
    $('#save-btn').on('click', function () {
        var id = qs('id');
        var msg = 'Save to the server with a new ID?';
        if(id) {
            msg = 'Save to the server with ID: ' + id;
        } 
        bb_confirm(msg, function (r) {
            if(r) {
                save_to_db();
            }
        });
    });
});


///////////////////////////////////////////////////////
