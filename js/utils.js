///////////////////////////////////////////////////////

function qs(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

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

///////////////////////////////////////////////////////
// http://bootboxjs.com/documentation.html#bb-dialog
///////////////////////////////////////////////////////


function bb_alert(msg) {
    bootbox.dialog({
        message: '<p id="message" class="text-secondary">' + msg + '</p>',
        closeButton: true,
        onEscape: true,
        backdrop: true,
        className: 'bootbox_alert'
    });
}

function bb_alert_warn(msg) {
    bootbox.dialog({
        message: '<p id="message" class="text-warning">' + msg + '</p>',
        closeButton: true,
        onEscape: true,
        backdrop: true,
        className: 'bootbox_alert_warn'
    });
}

function bb_alert_error(msg) {
    bootbox.dialog({
        message: '<p id="message" class="text-danger">' + msg + '</p>',
        closeButton: true,
        onEscape: false,
        backdrop: false,
        className: 'bootbox_alert_error'
    });
}

/* result is a boolean; true = OK, false = Cancel*/
function bb_confirm(msg, callback) {
    bootbox.confirm({ 
        message: '<p>' + msg + '</p>',
        callback: callback,
        className: 'bootbox_confirm'
    });
}

/*
<div id="notificationBanner" class="d-none">
    <div style="padding: 5px;">
      <div id="innerNotificationBanner" class="alert alert-success alert-dismissible fade hide" role="alert">
        <strong><span id="title">Success.</span></strong> 
        <span id="message"></span>
      </div>
    </div>
</div>

*/
function bootstrapBanner(msg) {
  $('#notificationBanner #title').text(msg);
  $('#notificationBanner').removeClass("d-none").addClass("d-block");
  $('#innerNotificationBanner').removeClass("hide").addClass("show");
  setTimeout(function(){ 
    $('#innerNotificationBanner').removeClass("show").addClass("hide");
    setTimeout(function(){ 
      $('#notificationBanner').removeClass("d-block").addClass("d-none");
    }, 500);
  }, 2000);
}
///////////////////////////////////////////////////////
