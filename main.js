const API_URL = 'https://api.rr.codes'

function mapValues(object, transformation) {
    return Object.entries(object).reduce((prev, [key, value]) => {
        prev[key] = typeof value === 'object' ? mapValues(value, transformation) : transformation(value);
        return prev;
    }, {})
}

/**
 * Parses the response by formatting the JSON into a prettified HTML tag
 * @param {{email: string, links: Record<string, string>, ...}} response
 * @return string
 */
function parseResponse(response) {
    const links = mapValues(response.links, (value) => `<a href=${value}>${value}</a>`)

    const email = `<a href=mailto:${response.email}?subject=Hey!>${response.email}</a>`

    const parsedString = JSON.stringify({
        ...response,
        links,
        email
    }, null, 4);

    const toHtml = parsedString.replaceAll(/: (".*")/g, ": <span class='json-value'>$1</span>")

    return `<pre><code>${toHtml}</code></pre>`
}


async function onLoad() {
    const aboutResponse = await fetch(`${API_URL}/about`)
    const body = await aboutResponse.json();

    document.getElementById("about-response").innerHTML = parseResponse(body);

    // noinspection JSUnresolvedVariable
    //hljs.highlightAll()
}

(async () => await onLoad())()
