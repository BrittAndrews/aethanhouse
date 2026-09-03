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
  // Swap the form for the confirmation block on submit, matching the design's
  // sent / notSent states. No backend yet - see the note in the README.
  (function () {
    var form = document.getElementById('contact-form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      document.getElementById('contact-form-wrap').hidden = true;
      document.getElementById('contact-sent').hidden = false;
    });
  })();
</script>"""

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
        body = body.replace('<form onSubmit="{{ onSubmit }}"', '<form id="contact-form"')
        body += CONTACT_SCRIPT

    # .dc.html links -> real page names
    for src_name, (out_name, _t) in PAGES.items():
        body = body.replace('"%s"' % src_name, '"%s"' % out_name)

    doc = ('<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
           '<meta name="viewport" content="width=device-width, initial-scale=1">\n'
           '<title>%s</title>\n<link rel="stylesheet" href="assets/ds.css">\n<link rel="stylesheet" href="assets/site.css">\n%s\n</head>\n'
           '<body>\n%s\n</body>\n</html>\n' % (esc(title), helmet.strip(), body))
    io.open(os.path.join(OUT, dst), 'w', encoding='utf-8').write(doc)
    left = re.findall(r'<x-[a-z-]+|\{\{', doc)
    return dst, len(doc), left

if __name__ == '__main__':
    for n in sys.argv[1:]:
        dst, size, left = convert(n)
        print('%-26s -> %-24s %6d bytes  leftovers: %s' % (n, dst, size, left or 'none'))
