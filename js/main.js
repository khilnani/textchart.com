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

function invoke_uml_change() {
    console.log('UML Changed');

    var uml = $('#code').val();
    console.log('UML Length: ' + uml.length);

    var b64_uml = b64EncodeUnicode(uml);
    console.log('UML Base64: ' + b64_uml);

    var page_url = window.location.href;
    var hash_index = page_url.indexOf('#');
    if (hash_index > -1) {
        page_url = page_url.slice(0, hash_index);
    }
    
    var new_hash = '#' + b64_uml;
    $('#page_link').attr('href', page_url + new_hash);
    
    if(history.pushState) {
        history.pushState(null, null, new_hash);
    } else {
        location.hash = new_hash;
    }

    compress(uml);
}


$(function() {
    $('#code').bind('input', function() {
        invoke_uml_change();
    });

    if(window.location.hash) {
        var hash = window.location.hash;
        hash = hash.slice(1);
        console.log('Location UML Base64: ' + hash);

        try {
            var uml = b64DecodeUnicode(hash);
            $('#code').val(uml);
        }
        catch(e) {
            console.log('Unable to decode hash: ' + hash);
        }
    }

    invoke_uml_change();

});
