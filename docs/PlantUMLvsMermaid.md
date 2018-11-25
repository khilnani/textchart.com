## PlantUML and Mermaid.js Compatability

For very simple UML, PlantUML and Mermaid. can render the same UML.

A few recommendations are below.

Beyond these, you will need to make a decision to
select either PlantUML or Mermaid.js

For details check

- PlantUML - http://plantuml.com/sitemap-language-specification
- Mermaid https://mermaidjs.github.io/

## Recommendations

Title

> Don't use titles

- Mermaid - Does not support `title TITLE TEXT`
- PlantUML - Supports `title TITLE TEXT`

Alias

> Don't use aliases

- Mermaid - `participant A as Alice`
- PlantUML - `participant Alice as A`

Participants

> Only use `Participant`

- Mermaid - Only `participant`
- PlantUML - Supports `participant`, `actor`, `database` etc.

Actor Message Flow

> Only use `A -> B`
Mermaid - Only supports `A -> B`
PlantUML - Supports `A -> B` and `B <- A`

Arrows

> - Use `->>`

- Mermaid - `->` results in a line with no arrowhead
- PlantUML - `->` results in a line with a filled arrowhead

String Formatting

> (shrug)

- Mermaid - `**text**` displays `**text**`
- PlantUML - `**text**` renders `text` in bold.