/* Minimal renderer for the template dialect the Claude Design export uses.
   Supports exactly what the Project Builder markup needs:
     {{ path }}          interpolation, in text and in attribute values
     <sc-if value="{{ x }}">        conditional block
     <sc-for list="{{ xs }}" as="n"> repeated block, nestable
     onClick / onChange="{{ fn }}"  event handlers bound from the value map
   Values whose key ends in "icon" (case-insensitive) are inserted as raw
   HTML so the inline SVGs render; everything else is escaped. */
(function (global) {
  'use strict';

  function esc(v) {
    return String(v == null ? '' : v)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function lookup(path, scopes) {
    var parts = path.split('.');
    for (var i = scopes.length - 1; i >= 0; i--) {
      var cur = scopes[i], ok = true;
      for (var j = 0; j < parts.length; j++) {
        if (cur != null && typeof cur === 'object' && parts[j] in cur) cur = cur[parts[j]];
        else { ok = false; break; }
      }
      if (ok) return cur;
    }
    return undefined;
  }

  function resolve(expr, scopes) {
    expr = expr.trim();
    if (expr === 'true') return true;
    if (expr === 'false') return false;
    return lookup(expr, scopes);
  }

  // Find the matching close tag for a block element, honouring nesting.
  function matchBlock(src, tag, from) {
    var open = new RegExp('<' + tag + '\\b', 'g'), close = new RegExp('</' + tag + '>', 'g');
    var depth = 1, i = from;
    while (depth > 0) {
      open.lastIndex = close.lastIndex = i;
      var o = open.exec(src), c = close.exec(src);
      if (!c) throw new Error('dc-mini: unbalanced <' + tag + '>');
      if (o && o.index < c.index) { depth++; i = o.index + o[0].length; }
      else { depth--; i = c.index + c[0].length; if (!depth) return { inner: src.slice(from, c.index), end: i }; }
    }
  }

  function render(src, scopes, handlers) {
    var out = '', i = 0;
    var block = /<(sc-if|sc-for)\b([^>]*)>/g;
    block.lastIndex = 0;
    var m;
    while ((m = block.exec(src))) {
      if (m.index < i) continue;
      out += interpolate(src.slice(i, m.index), scopes, handlers);
      var tag = m[1], attrs = m[2];
      var body = matchBlock(src, tag, m.index + m[0].length);
      if (tag === 'sc-if') {
        var cond = /value="\{\{([^}]*)\}\}"/.exec(attrs);
        if (resolve(cond ? cond[1] : 'false', scopes)) out += render(body.inner, scopes, handlers);
      } else {
        var list = /list="\{\{([^}]*)\}\}"/.exec(attrs);
        var as = /as="([^"]*)"/.exec(attrs);
        var items = resolve(list ? list[1] : '', scopes) || [];
        for (var k = 0; k < items.length; k++) {
          var frame = {};
          frame[as ? as[1] : 'item'] = items[k];
          out += render(body.inner, scopes.concat([frame]), handlers);
        }
      }
      i = body.end;
      block.lastIndex = i;
    }
    return out + interpolate(src.slice(i), scopes, handlers);
  }

  function interpolate(src, scopes, handlers) {
    // Event handlers first — they become data-attributes wired up after insertion.
    src = src.replace(/\bon(Click|Change|Input|Submit)="\{\{([^}]*)\}\}"/g, function (_, evt, expr) {
      var fn = resolve(expr, scopes);
      if (typeof fn !== 'function') return '';
      var id = 'h' + handlers.length;
      handlers.push({ id: id, event: evt.toLowerCase(), fn: fn });
      return 'data-dc-on="' + id + '" data-dc-evt="' + evt.toLowerCase() + '"';
    });
    return src.replace(/\{\{([^}]*)\}\}/g, function (_, expr) {
      var v = resolve(expr, scopes);
      if (typeof v === 'function') return '';
      if (/icon$/i.test(expr.trim())) return v == null ? '' : String(v);   // raw SVG
      if (v === true || v === false) return String(v);
      return esc(v);
    });
  }

  function bind(root, handlers) {
    var byId = {};
    handlers.forEach(function (h) { byId[h.id] = h; });
    root.querySelectorAll('[data-dc-on]').forEach(function (el) {
      var h = byId[el.getAttribute('data-dc-on')];
      if (!h) return;
      var evt = h.event === 'change' ? 'input' : h.event;
      el.addEventListener(evt, h.fn);
    });
  }

  /* Mount a template against a value-producing function, re-rendering on demand.
     Focus and caret position are restored across renders so typing in the text
     fields is not interrupted — the thing a naive innerHTML swap gets wrong. */
  global.DCMini = function mount(rootEl, template, getVals) {
    function draw() {
      var active = document.activeElement;
      var key = active && rootEl.contains(active) ? active.getAttribute('data-focus') : null;
      var start = key && 'selectionStart' in active ? active.selectionStart : null;
      var end = key && 'selectionEnd' in active ? active.selectionEnd : null;
      var scrolled = key ? active.scrollTop : null;

      var handlers = [];
      rootEl.innerHTML = render(template, [getVals()], handlers);
      bind(rootEl, handlers);

      if (key) {
        var next = rootEl.querySelector('[data-focus="' + key + '"]');
        if (next) {
          next.focus();
          if (start != null && 'setSelectionRange' in next) {
            try { next.setSelectionRange(start, end); } catch (e) { /* not a text field */ }
          }
          if (scrolled != null) next.scrollTop = scrolled;
        }
      }
    }
    draw();
    return draw;
  };
})(window);
