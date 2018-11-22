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

    uml = uml.trim();

    if(uml.indexOf('sequenceDiagram') != 0 && 
            uml.indexOf('graph') != 0 && 
           uml.indexOf('gantt') != 0) {
        uml = 'sequenceDiagram\n' + uml;
    }

    $('#mermaid').removeAttr('data-processed');
    $('#mermaid').text(uml);
    $('#mermaid').addClass('mermaid');

    mermaid.init(undefined, $("#mermaid"));
    console.log('Mermaid: Updated');
}
