(function() {
  var CDN = 'https://cdn.jsdelivr.net/npm/reveal.js@5.1.0';

  function injectCSS(href) {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }

  function loadScript(src) {
    return new Promise(function(resolve, reject) {
      var script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  var HLJS_LN = 'https://cdn.jsdelivr.net/npm/highlightjs-line-numbers.js@2.8.0/dist/highlightjs-line-numbers.min.js';

  // highlightjs-line-numbers.js registers on window.hljs
  window.hljs = window.hljs || {};

  window.Slides = {
    init: function(config) {
      // 1. Inject Reveal.js CSS
      injectCSS(CDN + '/dist/reset.css');
      injectCSS(CDN + '/dist/reveal.css');
      injectCSS(CDN + '/dist/theme/night.css');
      injectCSS(CDN + '/plugin/highlight/monokai.css');

      // 2. i18n: parse ?lang=, set document lang
      var langs = config.langs || {};
      var langKeys = Object.keys(langs);
      var lang = new URLSearchParams(location.search).get('lang') || langKeys[0] || 'en';
      document.documentElement.lang = lang;

      // 3. Create lang toggle (if multilingual)
      if (langKeys.length > 1) {
        var currentIndex = langKeys.indexOf(lang);
        var nextIndex = (currentIndex + 1) % langKeys.length;
        var nextLang = langKeys[nextIndex];

        var toggle = document.createElement('a');
        toggle.id = 'lang-toggle';
        toggle.href = '#';
        toggle.textContent = langs[nextLang];
        toggle.addEventListener('click', function(e) {
          e.preventDefault();
          var params = new URLSearchParams(location.search);
          params.set('lang', nextLang);
          location.href = location.pathname + '?' + params.toString() + location.hash;
        });
        document.body.appendChild(toggle);
      }

      // 4. Create slide DOM
      var reveal = document.createElement('div');
      reveal.className = 'reveal';
      var slides = document.createElement('div');
      slides.className = 'slides';
      config.chapters.forEach(function(ch) {
        var section = document.createElement('section');
        section.setAttribute('data-markdown', 'src/' + lang + '/' + ch + '.md');
        section.setAttribute('data-separator', '^\n---\n$');
        section.setAttribute('data-separator-vertical', '^\n----\n$');
        section.setAttribute('data-charset', 'utf-8');
        slides.appendChild(section);
      });
      reveal.appendChild(slides);
      document.body.appendChild(reveal);

      // 5. Load Reveal.js core first, then plugins
      var title = config.title || document.title;
      loadScript(CDN + '/dist/reveal.js').then(function() {
        return Promise.all([
          loadScript(CDN + '/plugin/markdown/markdown.js'),
          loadScript(CDN + '/plugin/highlight/highlight.js'),
          loadScript(CDN + '/plugin/notes/notes.js'),
          loadScript(CDN + '/plugin/search/search.js'),
          loadScript(HLJS_LN)
        ]);
      }).then(function() {
        var defaults = {
          width: 1920,
          height: 1080,
          center: false,
          margin: 0.05,
          hash: true,
          slideNumber: true,
          scrollActivationWidth: 0,
          plugins: [RevealMarkdown, RevealHighlight, RevealNotes, RevealSearch]
        };
        // Merge user overrides (but always keep required plugins)
        var opts = Object.assign({}, defaults, config.reveal || {});
        opts.plugins = defaults.plugins;

        Reveal.initialize(opts);

        // 6. Line numbers, auto-layout and MathJax on ready
        Reveal.on('ready', function() {
          // Apply line numbers to all non-text code blocks
          if (window.hljs && window.hljs.lineNumbersBlock) {
            document.querySelectorAll('.reveal pre code.hljs:not(.text)').forEach(function(block) {
              window.hljs.lineNumbersBlock(block, { singleLine: true });
            });
          }
          // Load MathJax for LaTeX formulas
          window.MathJax = {
            tex: { inlineMath: [['$', '$'], ['\\(', '\\)']] },
            options: { skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'] },
            startup: { typeset: false }
          };
          loadScript('https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js').then(function() {
            MathJax.startup.promise.then(function() {
              MathJax.typeset();
            });
          });

          document.querySelectorAll('.reveal .slides > section > section').forEach(function(slide) {
            if (slide.classList.contains('center')) return;
            var children = Array.prototype.slice.call(slide.children);
            var headings = children.filter(function(c) { return /^H[1-6]$/.test(c.tagName); });
            var blocks = children.filter(function(c) { return !(/^H[1-6]$/.test(c.tagName)); });

            // Heading + at most 1 line (no list/table/img) → center
            if (blocks.length <= 1 && !slide.querySelector('ul, ol, table, img')) {
              slide.classList.add('center');
              return;
            }

            // Heading + single list → stretch or auto-columns
            if (headings.length > 0 && blocks.length === 1 && /^(UL|OL)$/.test(blocks[0].tagName)) {
              var list = blocks[0];
              var cols = Math.ceil(list.children.length / 8);
              if (cols > 1) {
                list.classList.add('auto-columns');
                list.style.setProperty('--auto-columns', cols);
              } else {
                list.classList.add('stretch-list');
              }
            } else if (blocks.length > 1) {
              for (var i = 1; i < blocks.length; i++) {
                blocks[i].classList.add('spaced-block');
              }
            }
          });
        });

        // 7. Remove spaced-block on overflow
        function checkOverflow(slide) {
          var spaced = slide.querySelectorAll('.spaced-block');
          if (!spaced.length) return;
          var slideRect = slide.getBoundingClientRect();
          var lastChild = slide.children[slide.children.length - 1];
          if (lastChild.getBoundingClientRect().bottom > slideRect.bottom) {
            spaced.forEach(function(el) { el.classList.remove('spaced-block'); });
          }
        }

        checkOverflow(Reveal.getCurrentSlide());

        // 8. Dynamic title on slide change
        Reveal.on('slidechanged', function(event) {
          checkOverflow(event.currentSlide);
          var t = title;
          var h = event.currentSlide.querySelector('h1, h2, h3');
          if (h) {
            t = h.textContent + ' - ' + title;
          }
          document.title = t;
        });
      });
    }
  };
})();
