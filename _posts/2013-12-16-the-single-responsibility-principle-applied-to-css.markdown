---
title: The Single-Responsibility Principle Applied to CSS
date: 2013-12-16 00:00 EST
tags:
  - css
  - maintainability
---

Here's some [sound advice from Harry](http://csswizardry.com/2012/04/the-single-responsibility-principle-applied-to-css/) over at CSS Wizardry. When I first started writing CSS, I mistakenly made a religion of "clean markup," which I took to mean HTML with the fewest number of classes and IDs possible. But after years of building—and more importantly here, *maintaining*—websites, I'm beginning to see the virtues of this (and its accompanying CSS):

<!--more-->

```html
<nav class="wrapper menu fixed branded">...</nav>
```

over this:

```html
<nav class="global-nav">...</nav>
```

While I'd once have derided the former as unnecessarily complicated (under the mistaken assumption that one class name is simpler than four), when it comes to maintaining HTML and CSS like this, it's actually much simpler. Requirements change, and when the client decides they want a second menu fixed to the bottom of the page, all it may take is adding your existing `wrapper`, `menu`, and `fixed` classes to the new menu (and maybe a new `fixed-bottom` class) and you're off. Compare that with either duplicating code from your `.global-nav` style block, or extracting some common classes as we've already done in the above example here. Or, say the client requests a new content block with the same branding style as the navigation. You only have to add the `branded` class to that.

Something I've learned in writing Ruby code is that smaller is better when it comes to methods: smaller methods are easier to understand, more likely to be reused, and easier to test. To me, extracting CSS rules into smaller, more easily reused classes is just applying to the front-end a lesson I've already learned in the back-end.

And if you still think HTML like another of Harry's examples,

```html
<a href=/login/ class="btn btn-rev btn-lrg giga go brand-face">Log in</a>
```

is unsightly, tools like Sass have features like [mixins][1] and [@extend-Only selectors][2] that give you all the benefits of single-responsibility CSS without having to include a bunch of classes in your markup.

 [1]: http://sass-lang.com/documentation/file.SASS_REFERENCE.html#mixins
 [2]: http://sass-lang.com/documentation/file.SASS_REFERENCE.html#placeholders
