function init_mermaid() {

    console.log('Mermaid: Init');

    var config = {
        startOnLoad:false,
        // https://github.com/knsv/mermaid/tree/master/src/themes
        theme: 'neutral',
        logLevel: 3,
        flowchart: { curve: 'linear' },
        gantt: { axisFormat: '%m/%d/%Y' },
        sequence: { actorMargin: 50 },
    };

    mermaid.initialize(config);
}


function display_mermaid(uml) {

    console.log('Mermaid: Updating ...');

    uml = 'sequenceDiagram\n' + uml;

    $('#mermaid').text(uml);
    $('#mermaid').addClass('mermaid');

    mermaid.init(undefined, $("#mermaid"));

    window.setTimeout(function () {
        $('#mermaid').removeAttr('data-processed');
    }, 1000);

    console.log('Mermaid: Updated');


}