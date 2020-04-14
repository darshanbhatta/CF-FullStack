
const { MetaRewriter, BodyRewriter, LinkRewriter } = require("./util/rewrites");
const { decrypt, encrypt } = require("./util/encryption");
const { getCookie } = require("./util/cookie");

const variantsEndpoint = "https://cfw-takehome.developers.workers.dev/api/variants";
const variantsTitle = "variant";
const expireDaysFromCurrent = 1;

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
});

/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(req) {
    let savedURL = {
        data: decrypt(getCookie(req, variantsTitle), COOKIE_KEY),
        new: false,
    };
    if (!savedURL.data) {
        const urls = await fetchURLs();
        savedURL = {
            data: getRandomURL(urls),
            new: true,
        };
    }
    return handleResponse(savedURL);
}

/**
 * Handles response from the user
 * @param {Object} savedURL 
 */
async function handleResponse(savedURL) {
    let res = await fetch(savedURL.data);

    // rewrite res.body
    let rewrite = new HTMLRewriter()
        .on('title', new MetaRewriter())
        .on('p#description', new BodyRewriter())
        .on('a#url', new LinkRewriter()).transform(res);

    const clientRes = new Response(rewrite.body, res);

    // if its the user's first time we set a cookie to force them to be on a certain page after
    if (savedURL.new) {
        const encryptUrl = encrypt(savedURL.data, COOKIE_KEY);
        let date = new Date();
        date.setDate(date.getDate() + expireDaysFromCurrent);
        clientRes.headers.append('Set-Cookie', `${variantsTitle}=${encryptUrl}; Expires=${date.toUTCString()};`);
    }
    return clientRes;
}

/**
 * Gets all possible urls from the endpoint
 */
async function fetchURLs() {
    let res = await fetch(variantsEndpoint);
    const parsed = await res.json();
    return parsed.variants;
}

/**
 * Gets a random value in an array
 * @param {String} urls 
 */
function getRandomURL(urls) {
    return urls[Math.floor(Math.random() * urls.length)];
}
