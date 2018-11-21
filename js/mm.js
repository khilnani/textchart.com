function init_mermaid() {

    console.log('Init Mermaid');

    var config = {
        startOnLoad:true,
        theme: 'forest',
        // themeCSS: '.node rect { fill: red; }',
        logLevel: 3,
        flowchart: { curve: 'linear' },
        gantt: { axisFormat: '%m/%d/%Y' },
        sequence: { actorMargin: 50 },
    };

    mermaid.initialize(config);
}


function display_mermaid(uml) {

    console.log('Render Mermaid');

    uml = 'sequenceDiagram\n' + uml;

    $('#mermaid').text(uml);
    $('#mermaid').addClass('mermaid');

    mermaid.init(undefined, $("#mermaid"));

}