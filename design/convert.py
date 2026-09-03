# -*- coding: utf-8 -*-
"""Compile Claude Design .dc.html artboards into standalone static pages."""
import io, os, re, json, sys, shutil

SRC = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'Portfolio site redesign')
OUT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # repo root

PAGES = {
    'MarketingPage.dc.html':      ('index.html',            'Aethan House — Home Experience Design, Atlanta'),
    'Projects.dc.html':           ('projects.html',         'Work — Aethan House'),
    'Services.dc.html':           ('services.html',         'Services — Aethan House'),
    'About.dc.html':              ('about.html',            'About — Aethan House'),
    'Contact.dc.html':            ('contact.html',          'Contact — Aethan House'),
    'ProjectBuilder.dc.html':     ('project-builder.html',  'Project Builder — Aethan House'),
    'ProjectBirmingham.dc.html':  ('project-birmingham.html','Craftsman kitchen, rebuilt — Aethan House'),
    'ProjectLanier.dc.html':      ('project-lanier.html',   'Lake house, whole home — Aethan House'),
    'ProjectBath.dc.html':        ('project-bath.html',     "Lisa & Alex's bath — Aethan House"),
    'ProjectNursery.dc.html':     ('project-nursery.html',  'The Delaney nursery — Aethan House'),
    'Journal.dc.html':            ('journal.html',          'Journal — Aethan House'),
}

def esc(t):
    return (t.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;').replace('"', '&quot;'))

# ---------- parse the text/x-dc script's renderVals ----------
def js_array(src, name):
    """Pull `name: [ ... ]` out of a JS object literal and JSON-ify it."""
    m = re.search(r'\b' + name + r'\s*:\s*\[', src)
    if not m:
        return None
    i = m.end() - 1
    d, j = 0, i
    while True:
        if src[j] == '[': d += 1
        elif src[j] == ']': d -= 1
        if d == 0: break
        j += 1
    raw = src[i:j + 1]
    raw = re.sub(r'([{,]\s*)([A-Za-z_$][\w$]*)\s*:', r'\1"\2":', raw)  # quote keys
    raw = re.sub(r',(\s*[\]}])', r'\1', raw)                            # trailing commas
    return json.loads(raw)

# ---------- DS components, rendered statically ----------
def render_footer(links, note):
    lis = ''.join(
        '<li><a href="%s" style="font-family:var(--font-ui);font-size:var(--body-s);'
        'letter-spacing:var(--track-ui);color:var(--text-inverse);text-decoration:none">%s</a></li>'
        % (esc(l['href']), esc(l['label'])) for l in links)
    return (
      '<footer class="on-deep" style="background:var(--surface-deep);color:var(--text-inverse);'
      '-webkit-font-smoothing:antialiased">\n'
      '<div style="max-width:var(--content-max);margin:0 auto;padding:var(--space-8) var(--gutter)">\n'
      '<div style="display:flex;align-items:baseline;justify-content:space-between;gap:var(--space-4);flex-wrap:wrap">\n'
      '<p style="font-family:var(--font-display);font-weight:var(--weight-regular);font-size:var(--display-m);'
      'line-height:1;letter-spacing:var(--track-display);color:var(--text-inverse);margin:0">Aethan House</p>\n'
      '<ul style="list-style:none;display:flex;gap:var(--space-4);margin:0;padding:0;flex-wrap:wrap">%s</ul>\n'
      '</div>\n'
      '<p style="font-family:var(--font-ui);font-size:var(--caption);line-height:var(--caption-lh);'
      'letter-spacing:.08em;color:var(--text-inverse-muted);margin:var(--space-6) 0 0;padding-top:var(--space-3);'
      'border-top:1px solid var(--rule-on-dark)">%s</p>\n'
      '</div>\n</footer>' % (lis, esc(note)))

def render_tiercard(tier, title, price, price_note, body, items, featured):
    chip_bg, chip_fg = (('rgba(200,127,85,.2)', 'var(--accent)') if featured
                        else ('var(--chip-fill)', 'var(--secondary)'))
    border = 'var(--accent)' if featured else 'var(--rule-on-dark)'
    out = ['<article style="background:var(--surface-deep-raised);border-radius:var(--radius);'
           'border:var(--border-hairline) solid %s;padding:var(--card-padding);color:var(--text-inverse);'
           '-webkit-font-smoothing:antialiased;display:flex;flex-direction:column">' % border]
    if tier:
        out.append('<div style="margin-bottom:var(--space-1-5)"><span style="display:inline-block;'
                   'font-family:var(--font-ui);font-weight:var(--weight-medium);font-size:var(--eyebrow);'
                   'line-height:1;letter-spacing:var(--track-chip);text-transform:uppercase;padding:6px 10px;'
                   'border-radius:var(--radius);background:%s;color:%s">%s</span></div>' % (chip_bg, chip_fg, esc(tier)))
    out.append('<h3 style="font-family:var(--font-display);font-weight:var(--weight-regular);'
               'font-size:var(--display-m);line-height:var(--display-m-lh);letter-spacing:var(--track-display);'
               'margin:0 0 var(--space-1)">%s</h3>' % esc(title))
    if price:
        out.append('<div><div style="font-family:var(--font-display);font-weight:var(--weight-regular);'
                   'font-size:var(--display-s);line-height:var(--display-s-lh);font-variant-numeric:oldstyle-nums;'
                   'color:var(--accent)">%s</div>' % esc(price))
        if price_note:
            out.append('<div style="font-family:var(--font-ui);font-size:var(--caption);'
                       'line-height:var(--caption-lh);letter-spacing:.08em;text-transform:uppercase;'
                       'margin-top:var(--space-half);color:var(--text-inverse-muted)">%s</div>' % esc(price_note))
        out.append('</div>')
    if body:
        out.append('<p style="font-family:var(--font-ui);font-size:var(--body-s);line-height:var(--body-s-lh);'
                   'color:var(--text-inverse-muted);margin:var(--space-2) 0 0">%s</p>' % esc(body))
    if items:
        lis = ''.join('<li style="font-family:var(--font-ui);font-size:var(--body-s);'
                      'line-height:var(--body-s-lh);padding:var(--space-1-5) 0;'
                      'border-top:var(--border-hairline) solid var(--rule-on-dark);'
                      'color:var(--text-inverse)">%s</li>' % esc(i) for i in items)
        out.append('<ul style="list-style:none;margin:20px 0 0;margin-top:var(--space-3);padding:0">%s</ul>' % lis)
    out.append('</article>')
    return ''.join(out)

# ---------- sc-if resolution ----------
# Static truth for the conditionals on non-interactive pages. Contact's two
# branches both stay in the DOM and are toggled by a small script instead.
SC_IF = {
    'ProjectBirmingham.dc.html': {'showChips': 'keep', 'showSpecSheet': 'keep'},
    'Contact.dc.html': {'sent': ('wrap', 'contact-sent', True),
                        'notSent': ('wrap', 'contact-form-wrap', False)},
}

def resolve_sc_if(html, rules):
    out, i = [], 0
    while True:
        m = re.search(r'<sc-if\b[^>]*value="\{\{\s*(\w+)\s*\}\}"[^>]*>', html[i:])
        if not m:
            out.append(html[i:]); break
        start = i + m.start()
        out.append(html[i:start])
        name = m.group(1)
        # find the matching </sc-if>, accounting for nesting
        j, depth = i + m.end(), 1
        while depth:
            nxt = re.search(r'<sc-if\b|</sc-if>', html[j:])
            if not nxt:
                raise SystemExit('unbalanced sc-if for %s' % name)
            depth += 1 if nxt.group(0) == '<sc-if' else -1
            j += nxt.end()
        inner = html[i + m.end(): j - len('</sc-if>')]
        rule = rules.get(name)
        if rule is None:
            raise SystemExit('no sc-if rule for %r' % name)
        if rule == 'keep':
            out.append(inner)
        elif rule == 'drop':
            pass
        else:
            _, el_id, hidden = rule
            out.append('<div id="%s"%s>%s</div>' % (el_id, ' hidden' if hidden else '', inner))
        i = j
    return ''.join(out)

# ---------- x-import expansion ----------
def attrs_of(tag):
    return dict((k, v) for k, v in re.findall(r'([a-zA-Z-]+)="([^"]*)"', tag))

def expand(html, vals):
    def one(m):
        tag = m.group(0)
        a = attrs_of(tag)
        comp = a.get('component-from-global-scope', '').split('.')[-1]
        def resolve(v, default=None):
            if v is None: return default
            mm = re.fullmatch(r'\s*\{\{\s*(.+?)\s*\}\}\s*', v or '', re.S)
            if mm:
                expr = mm.group(1)
                if expr == 'true': return True
                if expr == 'false': return False
                return vals.get(expr, default)
            return v
        if comp == 'SiteFooter':
            return render_footer(resolve(a.get('links'), []) or [], a.get('note', ''))
        if comp == 'TierCard':
            return render_tiercard(a.get('tier'), a.get('title', ''), a.get('price'),
                                   a.get('price-note'), a.get('body'),
                                   resolve(a.get('items'), []) or [],
                                   bool(resolve(a.get('featured'), False)))
        raise SystemExit('Unhandled x-import component: %s' % comp)
    return re.sub(r'<x-import\b[^>]*>(?:</x-import>)?', one, html)

CONTACT_SCRIPT = """
<script>
  // Post to Netlify Forms, then swap the form for the confirmation block
  // (the sent / notSent states from the design). If the POST fails - running
  // locally, or Netlify not reachable - say so and offer the mailto instead.
  (function () {
    var form = document.getElementById('contact-form');
    if (!form) return;
    var wrap = document.getElementById('contact-form-wrap');
    var sent = document.getElementById('contact-sent');

    function show() { wrap.hidden = true; sent.hidden = false; }
    function fail() {
      var p = document.getElementById('contact-error');
      if (!p) {
        p = document.createElement('p');
        p.id = 'contact-error';
        p.style.cssText = 'margin:16px 0 0;font:400 14px/1.55 Inter,sans-serif;color:#985633';
        form.appendChild(p);
      }
      p.innerHTML = 'That did not send. Email ' +
        '<a href="mailto:britt@aethanhouse.com">britt@aethanhouse.com</a> and I will pick it up there.';
      btn.disabled = false;
      btn.textContent = label;
    }

    var btn = form.querySelector('button[type=submit]');
    var label = btn ? btn.textContent : '';

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (btn) { btn.disabled = true; btn.textContent = 'Sending\u2026'; }
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form)).toString()
      }).then(function (r) { r.ok ? show() : fail(); }).catch(fail);
    });
  })();
</script>"""


# ---------- post-compile patches ----------
# Edits that live here rather than in the .dc.html sources, so re-running the
# compiler after a design change keeps them. Each entry is (page, old, new) and
# must match exactly once, or the build fails loudly rather than silently
# dropping the change.

HERO_OLD = ('<img src="assets/projects/birmingham/after_full_kitchen.jpg" '
            'alt="Birmingham kitchen \u2014 finished view to the island, beam, glass-front uppers, '
            'and stainless range" style="width:100%;height:560px;object-fit:cover">')
HERO_NEW = ('<img src="assets/hero-triptych.jpg" '
            'alt="Three Aethan House interiors \u2014 the Birmingham dining room and kitchen, '
            'the galley range wall, and the Delaney nursery millwork" '
            'style="width:100%;height:auto;display:block" width="2400" height="1000">')

BUILDER_CTA_ANCHOR = '<div style="display:flex;gap:24px;align-items:center;margin-top:64px;flex-wrap:wrap">'
BUILDER_CTA = ('<div style="margin-top:64px;padding:32px;border:1px solid var(--rule-on-dark);'
               'border-radius:var(--radius);display:flex;gap:32px;align-items:center;'
               'justify-content:space-between;flex-wrap:wrap">\n'
               '<div style="max-width:560px">\n'
               '<p style="font:500 11px/1.2 Inter,sans-serif;letter-spacing:.14em;text-transform:uppercase;'
               'color:#C87F55;margin:0 0 12px">Price It Yourself</p>\n'
               '<h3 style="font:400 32px/1.2 \'Cormorant Garamond\',serif;letter-spacing:-.01em;'
               'color:#F2EBE1;margin:0 0 12px">Not sure which tier fits which room?</h3>\n'
               '<p style="font-size:16px;line-height:1.65;color:#A8A093;margin:0">Build the project room by '
               'room, add what you need, and see a rough range in about two minutes. Nothing is sent to me '
               'until you decide to send it.</p>\n'
               '</div>\n'
               '<a href="project-builder.html" style="background:#C87F55;color:#1C2621;font:500 14px/1 '
               'Inter,sans-serif;letter-spacing:.06em;text-transform:uppercase;padding:16px 32px;'
               'border-radius:2px;text-decoration:none;white-space:nowrap">Open the Project Builder</a>\n'
               '</div>\n')

PATCHES = [
    # A cropped triptych of Britt's own photography reads better as a portfolio
    # hero than one portrait shot squeezed into a 560px band.
    ('index.html', HERO_OLD, HERO_NEW),
    # Give the Project Builder a real entry point on the home page, not just a nav link.
    ('index.html', BUILDER_CTA_ANCHOR, BUILDER_CTA + BUILDER_CTA_ANCHOR),
    # "The Reimagining Day" renamed; the DS allows one italic phrase per heading.
    ('services.html',
     "<h2 style=\"font:400 44px/1.12 'Cormorant Garamond',serif;letter-spacing:-.01em;margin:0;"
     "max-width:20ch\">The Reimagining <em>Day</em>.</h2>",
     "<h2 style=\"font:400 44px/1.12 'Cormorant Garamond',serif;letter-spacing:-.01em;margin:0;"
     "max-width:20ch\">The <em>Second Look</em>.</h2>"),
]

def apply_patches(dst, doc):
    for page, old, new in PATCHES:
        if page != dst:
            continue
        n = doc.count(old)
        if n != 1:
            raise SystemExit('patch for %s matched %d times (expected 1): %.70s...' % (dst, n, old))
        doc = doc.replace(old, new, 1)
    return doc

# ---------- main ----------
def convert(name):
    dst, title = PAGES[name]
    s = io.open(os.path.join(SRC, name), encoding='utf-8').read()

    helmet = re.search(r'<helmet>(.*?)</helmet>', s, re.S).group(1)
    helmet = re.sub(r'<script src="\./ds-base\.js"></script>', '', helmet)

    body = s[s.index('<x-dc>') + len('<x-dc>'): s.index('</x-dc>')]
    body = re.sub(r'<helmet>.*?</helmet>', '', body, flags=re.S).strip()

    script = re.search(r'<script type="text/x-dc"[^>]*>(.*?)</script>', s, re.S)
    vals = {}
    if script:
        js = script.group(1)
        for key in ('footerLinks', 'tier1', 'tier2', 'tier3'):
            v = js_array(js, key)
            if v is not None:
                vals[key] = v

    if name in SC_IF:
        body = resolve_sc_if(body, SC_IF[name])
    body = expand(body, vals)

    if name == 'Contact.dc.html':
        # Wire the form to Netlify Forms so the submit button actually delivers.
        # Netlify detects data-netlify at deploy time by parsing the static HTML.
        body = body.replace(
            '<form onSubmit="{{ onSubmit }}"',
            '<form id="contact-form" name="contact" method="POST" data-netlify="true" '
            'netlify-honeypot="bot-field"')
        # hidden fields Netlify needs, injected just inside the form tag
        i = body.index('<form id="contact-form"')
        i = body.index('>', i) + 1
        body = (body[:i] + '\n<input type="hidden" name="form-name" value="contact">\n'
                '<p hidden><label>Leave this empty: <input name="bot-field" tabindex="-1"></label></p>'
                + body[i:])
        body += CONTACT_SCRIPT

    # .dc.html links -> real page names
    for src_name, (out_name, _t) in PAGES.items():
        body = body.replace('"%s"' % src_name, '"%s"' % out_name)

    doc = ('<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
           '<meta name="viewport" content="width=device-width, initial-scale=1">\n'
           '<title>%s</title>\n<link rel="stylesheet" href="assets/ds.css">\n<link rel="stylesheet" href="assets/site.css">\n%s\n</head>\n'
           '<body>\n%s\n</body>\n</html>\n' % (esc(title), helmet.strip(), body))
    doc = apply_patches(dst, doc)
    io.open(os.path.join(OUT, dst), 'w', encoding='utf-8').write(doc)
    left = re.findall(r'<x-[a-z-]+|\{\{', doc)
    return dst, len(doc), left

if __name__ == '__main__':
    for n in sys.argv[1:]:
        dst, size, left = convert(n)
        print('%-26s -> %-24s %6d bytes  leftovers: %s' % (n, dst, size, left or 'none'))
