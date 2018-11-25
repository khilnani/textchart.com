function init_mermaid() {

    console.log('Mermaid: Init');

    var config = {
        startOnLoad:false,
        // https://github.com/knsv/mermaid/tree/master/src/themes
        theme: 'default', //neutral
        logLevel: 3,
        flowchart: { curve: 'linear' },
        gantt: { axisFormat: '%m/%d/%Y' },
        sequence: { actorMargin: 50 },
    };

    mermaid.initialize(config);
}


function display_mermaid(uml) {

    console.log('Mermaid: Updating ...');
    try {
        uml = uml.trim();

        if(uml.toLowerCase().indexOf('@startuml') > -1) {
            console.log('Mermaid: Skipped PlantUML');

            $('#mermaid').removeAttr('data-processed');
            $('#mermaid').removeClass('mermaid');
            $('#mermaid').text('The PlantUML text is not Mermaid compatible');

        } else if (uml.length < 10) {
            console.log('Mermaid: Too short/invalid');

            $('#mermaid').removeAttr('data-processed');
            $('#mermaid').removeClass('mermaid');
            $('#mermaid').text('Is that really Mermaid UML?');

        } else {

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
    }
    catch(e) {
        console.log('ERROR: display_mermaid()');
        console.log(e);
            $('#mermaid').removeAttr('data-processed');
            $('#mermaid').removeClass('mermaid');
            $('#mermaid').html('<pre>' + e + '</pre>');
    }
}
