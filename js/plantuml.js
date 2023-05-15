///////////////////////////////////////////////////////

var default_plantuml_skinparam = undefined;
var deflater = undefined;

var default_skin_path = 'data/skinparam.txt';
var deflate_script = 'vendor/rawdeflate.js';

///////////////////////////////////////////////////////

function encode64(data) {
    r = '';
    for (i=0; i<data.length; i+=3) {
        if (i+2==data.length) {
            r +=append3bytes(data.charCodeAt(i), data.charCodeAt(i+1), 0);
        } else if (i+1==data.length) {
            r += append3bytes(data.charCodeAt(i), 0, 0);
        } else {
            r += append3bytes(data.charCodeAt(i), data.charCodeAt(i+1),
                data.charCodeAt(i+2));
        }
    }
    return r;
}

function append3bytes(b1, b2, b3) {
    c1 = b1 >> 2;
    c2 = ((b1 & 0x3) << 4) | (b2 >> 4);
    c3 = ((b2 & 0xF) << 2) | (b3 >> 6);
    c4 = b3 & 0x3F;
    r = '';
    r += encode6bit(c1 & 0x3F);
    r += encode6bit(c2 & 0x3F);
    r += encode6bit(c3 & 0x3F);
    r += encode6bit(c4 & 0x3F);
    return r;
}

function encode6bit(b) {
    if (b < 10) {
        return String.fromCharCode(48 + b);
    }
    b -= 10;
    if (b < 26) {
        return String.fromCharCode(65 + b);
    }
    b -= 26;
    if (b < 26) {
        return String.fromCharCode(97 + b);
    }
    b -= 26;
    if (b == 0) {
        return '-';
    }
    if (b == 1) {
        return '_';
    }
    return '?';
}

try {
    deflater = window.SharedWorker && new SharedWorker(deflate_script);

    if (deflater) {
        deflater.port.addEventListener('message', done_deflating, false);
        deflater.port.start();
    } else if (window.Worker) {
        deflater = new Worker(deflate_script);
        deflater.onmessage = done_deflating;
    }
} catch(e) {
    console.log('PlantUML: WARN');
    console.log(e);
}

function done_deflating(e) {
    var data = encode64(e.data);

    console.log('PlantUML: Encoded.');


    var img_url = server_url + '/svg/' + data;
    var txt_url = server_url + '/txt/' + data;

    var curr_img_url = $('#uml_img').attr('src');

    if( curr_img_url != img_url) {
        $('#uml_img').attr('src', img_url);
        $('#uml_link').attr('href', txt_url);
        console.log('PlantUML: Images and Text Updated');

    } else {
        console.log('PlantUML: UML Unchanged');
    }

}

function compress(s) {
    console.log('PlantUML: Compressing UML: ' + deflater);
    //UTF8
    s = unescape(encodeURIComponent(s));

    if (deflater) {
        if (deflater.port && deflater.port.postMessage) {
            deflater.port.postMessage(s);
        } else {
            deflater.postMessage(s);
        }
    } else {
        setTimeout(function() {
            done_deflating({ data: deflate(s) });
        }, 100);
    }
}

///////////////////////////////////////////////////////

function display_plantuml_helper(uml, skin) {
    uml = skin + '\n\n' +uml;
    compress(uml);
}

function display_plantuml(uml) {
    console.log('PlantUML: Updating ...');

    uml = uml.trim();

    if(default_plantuml_skinparam) {
        display_plantuml_helper(uml, default_plantuml_skinparam);
    } else {
        console.log('PlantUML: Loading ' + default_skin_path);
        $.get(default_skin_path, function(response) {
            display_plantuml_helper(uml, response);
        });
    }
}


///////////////////////////////////////////////////////
