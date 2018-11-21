function b64EncodeUnicode(str) {
    // first we use encodeURIComponent to get percent-encoded UTF-8,
    // then we convert the percent encodings into raw bytes which
    // can be fed into btoa.
    return window.btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
            return String.fromCharCode('0x' + p1);
    }));
}

function b64DecodeUnicode(str) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(window.atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}

function refresh_uml() {
    console.log('UML Changed');

    // Get UML
    var uml = $('#code').val();

    // Update the Plant UML diagram
    update_plantuml_diagram(uml);

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

function clear_share_link() {
        $('#page_link').attr('href', 'javascript:void(0); return false;');
        $('#page_link').text('Updating ...');
}

function update_share_link() {
    // Create a short URL
    var jqxhr = $.ajax({
        type: 'POST',
        url: "https://khl.io/",
        data: {
            url: window.location.href
        }
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


function read_window_hash() {
    if(window.location.hash) {
        var hash = window.location.hash;
        hash = hash.slice(1);
        console.log('Location UML Base64: ' + hash);

        try {
            var uml = b64DecodeUnicode(hash);
            $('#code').val(uml);
            $('#code').trigger('input');
        }
        catch(e) {
            console.log('WARN');
            console.log('Unable to decode hash: ' + hash);
        }
    }
}


$(function() {

    // Enable tooltips
    $('[data-toggle="tooltip"]').tooltip();

    // Monitor the UML TextArea
    $('#code').on('input', function() {
        refresh_uml();
    });

    // Setup forward/back history handling
    $(window).on('popstate', function(event) {
        console.log('Window History movement')
        read_window_hash();
    });

    // Update the share link when the modal is displayed
    $('#linkModal').on('show.bs.modal', function () {
        clear_share_link();
    });
    $('#linkModal').on('shown.bs.modal', function () {
        update_share_link();
    });

    // Update based on prior state in the URL
    read_window_hash();

    // Update the UML Image/ASCII link
    refresh_uml();
});
