# The ____ Pitch on Webflow

`node webflow/export.mjs` (after `npm run build`) writes three files in
`webflow/the-pitch/`, to paste into one Webflow page:

| File | Where in Webflow |
|------|------------------|
| `head.html` | Page settings → Custom code → **Inside `<head>` tag** |
| `embed.html` | A **Code Embed** element, the only thing on the page |
| `footer.html` | Page settings → Custom code → **Before `</body>` tag** |

Each file also comes as `.txt` with the same code: `head.html` holds only
fonts and styles, so opened in a browser it looks empty; copy from the
`.txt` if that is easier.

Use an empty page without the site's navbar and footer (the page brings
its own header with the three logos and its own footer). Custom code runs
on the published site only, not in the Designer. After any change to the
page here, run the export again and paste the files again.

The booking (time slots, A0018) still needs its service; until
`bookingApi` is set, sending says requests are not sent yet. When the page
lives on Webflow, its address goes into the service's allowed origins.
