class MetaRewriter {
    element(el) {
        // adds the This is before the title!
        el.before('<meta charset="utf-8">', { html: true })
        el.prepend('This is ')
    }
}

class BodyRewriter {
    element(el) {
        el.setInnerContent("This is Darshan's version of CloudFlare\'s Summer 2020 Internship Full-Stack Project.")
    }
}

class LinkRewriter {
    element(el) {
        el.setAttribute('href', 'https://darshanbhatta.com')
        el.setInnerContent('See my personal site!')
    }
}

module.exports = {MetaRewriter, BodyRewriter, LinkRewriter};