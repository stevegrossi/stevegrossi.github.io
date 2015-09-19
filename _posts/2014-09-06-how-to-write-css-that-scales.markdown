---
title: How To Write CSS That Scales
date: 2014-09-06 08:35 EDT
tags:
  - css
  - architecture
---

I've been writing CSS for about eight years now, and every time I do it better than the last time. Which is to say, I've never gotten it right. So of course, what I'm about to share isn't The One Right Way™ to write CSS. But it is, I hope, a valuable collection of practices to avoid the many mistakes I've made and seen. Ultimately, what we want is for our code to scale: to continue to work well as we add more content, more code, and more people to the equation.

<!--more-->

## What I Mean By “CSS That Scales”

CSS—and really, all the code we write—has to scale in three ways:

### Performance, As Web Pages Grow

Github's John Rohan gave [an excellent talk on Vimeo](https://vimeo.com/54990931) about how the CSS on Github's diff view seemed fine on diffs with 1,000 lines, but became a major bottleneck (calculating styles accounted for 80% of page load time) on diffs approaching 10,000 lines. Without practices to avoid it, it's easy to write CSS with latent performance issues that you only discover after the time to easily fix them has passed.

### Organization, As the Project Grows

CSS, like all code, must change. New designs come in; new features must be added. Well-organized CSS means you don't have to hunt for where to make a change, and simple changes don't require complicated execution. Organization saves you time, as you can find and rely on previously-written CSS. And most importantly, well-organized CSS lets you do every developer's favorite thing: *delete code*. If your CSS is organized, it should be clear what code is and is not necessary, and you can delete unneeded code without fear.

Disorganized CSS turns all of these savings into costs. If the archutecture is confusing, it takes longer to figure out how to make a change, and it's more likely that the change will have unintended side-effects, costing further time and aggravation. It leads developers to reinvent the wheel every time they need one, since it isn't clear if your project has a wheel already or how it's supposed to work. And finally, it makes developers afraid to delete obsolete code, leading to page bloat, a degraded user experience, and low morale. After all, who wants to work in a junkyard?

### Maintainability, As the Team Grows

Working at an agency, I've learned that even if you're the only developer on a project, you're not the only developer on the project, since you'll at least have to collaborate with yourself 6 months down the line. Your CSS needs to be transparent enough that when you come back to it to fix a bug or add a feature, you know where to look to make a change, and the consequences of that change should be unsurprising. Likewise, other developers should be able to step into the project without needing to go through the Eleusinian Mysteries. A large part of Rails' success is due to its "convention over configuration" philosophy. Almost any Rails developer can step into almost any Rails project and immediately know how things work or at least where to look to find out. Can you say that about your CSS?

## How to Identify CSS That Doesn't Scale

So that's the ideal. Here are some of the symptoms of CSS that doesn't scale:

- **Too much of it:** as with all code, the best CSS is the CSS you don't write. Excessive CSS costs you both network and mental bandwidth.
- **Poor performance:** time the browser spends "recalculating styles" slows down every page load, as well as animations and user-initiated actions, and can crash the browser in extreme cases.
- To change one thing, you find yourself **having to change code in multiple places** (or even multiple files).
- **Overriding a style doesn't work on the first try**. You have to scope it to an `#id_selector` or add `!important` (which only makes it overriding it harder for the next person)
- You find yourself starting new classes by **overriding a lot of existing styles** with things like `margin: 0` or `border: none`.
- **Magic numbers** like `margin-left: -7px` with no indication of why they exist.
- Rules **copied and pasted** in different places, which is even wore if they have subtle, unexplained differences.
- Simple **style changes require changes to HTML and JavaScript files**.

## Tips for Writing CSS That Scales

### Use a Preprocessor (Wisely)

Tools like [Sass](http://sass-lang.com/) and [Less](http://lesscss.org/) can really help with keeping CSS sane and well-organized. Mixins for common rules can help you avoid repetition; variables help you maintain consistency and simplify changes; and the ability to do simple math can help you avoid magic numbers. But with great power comes great responsibility. Instead of managing complexity, they can add to it. A bit of apparently simple Sass can generate a lot of complicated, poorly-performing CSS. So as a rule, use only the features you absolutely need, and take a look at the generated CSS from time to time.

### Avoid ID Selectors

IDs in HTML are fine as anchors, but ID selectors in CSS have several downsides:

- They're heavily weighted (10x more than classes), and thus very difficult to override their styles. (If you're not familiar with the mechanics of specificity in CSS, Chris Coyier has [a nice explanation](http://css-tricks.com/specifics-on-css-specificity/), as much of what follows will reference the concept.)
- IDs can appear only once in HTML (and bugs with duplicate IDs are notoriously hard to pin down). Even if you think a page will only ever have one `#banner`, eventually someone will ask you to add a second, and switching styles from `#banner` to `.banner` can be hairy for the reasons in the previous bullet.
- IDs are great for linking to sections of a page in HTML. But if you target them with CSS, you limit your ability to use them like that. There have been times when I've wanted to link directly to a contact section of the about page with `/about#contact` by giving that section an ID of "contact", but couldn't because someone had applied CSS to a single-contact listing on another page with `#contact`.

### Avoid Nesting Rules

- According to Mozilla, the descendent selector (i.e. the space in a rule like `.something h3`) is [the least performant selector in CSS](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Writing_efficient_CSS#Avoid_the_descendant_selector.21).
- As with ID selectors, descendent selectors also add specificity to your styles which can make them difficult to override.
- Nesting rules as a practice leads to extra, unnecessary CSS. If all you need is `.header a`, don't use `.header nav ul a` (even if Sass makes it *really* easy to write the latter). And for the same reason and more, adding a class of `.header-link` to the `<a>` is a better choice than selecting it with `.header a`.

### Avoid Qualifying Selectors With Elements

By this I mean `a.link-button` instead of just `.link-button`.

- Again, this leads to specificity issues when you need to override a style and declarations on `.link-button` later in your CSS don't actually override the declarations on `a.link-button`.
- And at some point you'll need a `<button>` that looks like a `.link-button` and your `a.link-button` styles won't work. In general, your class rules should aim to work regardless of the element they're applied to. Those elements *will* change over the life of a project, so save yourself the trouble of having to change the CSS when they do.

### Avoid Location-Specific Styles

We've all done this. You get a new banner design for the about page and so you add the styles with `.about-page-banner` or `.about .banner`. Inevitably, a week later someone will ask you to add the same banner module to the contact page. Now you have three options:

- add another class to your rule (i.e. `.about-page-banner, .contact-page-banner`), which may work for now but will lead to conflict when the styles inevitably diverge
- add something like `<div class="about-page-banner">` to your *contact.html* page, leading to confusion
- come up with a more generic name like `.fancy-banner`, find-and-replace `.about-page-banner`, and use that on the contact page, which adds extra work and can lead to bugs if you miss one.

You can avoid all of these bad options if you just **give the module a generic class name in the first place**. I think we tend to avoid this because [naming things is hard](http://martinfowler.com/bliki/TwoHardThings.html), and it's easier just to name things after where we find them. But that leads to trouble when they move. When it comes to naming, I like to think of the defining feature of a module. Is this new banner taller? Call it something like `.banner-tall`. Does it override the default font with Comic Sans? Call it `.banner-silly`. It's barely any extra work to use a non-location-specific name, and it can *only* save you and your team time and headache in the future.

### Avoid Element Selectors

By this I mean `.listing h2` or `.button-box button`. As with many of the rules above, this makes your CSS inflexible and resistant to change. Eventually, a case will arise where your `.listing h2` styles need to apply to an `h3`, or `.button-box button` to apply to an `input` or `a` element. Or perhaps the `h2` styles for a `.listing h2` will need to be reused outside of a `.listing` container. A better alternative is to give sub-element styles their own class name:

    .listing { ... }
    .listing-heading { ... }

The latter could be an `h2`, an `h4`, or appear outside of a listing. In these cases, your CSS remains flexible and won't need to change just because the HTML does. This has the added benefit of avoiding the performance, specificity, and bloat issues raised in "Avoid Nesting Rules" above.

### Avoid Magic Numbers

Magic numbers are any numbers in your CSS rules the significance of which is not made clear. While declarations like `width: 100%` or `line-height: 1.5` probably don't qualify as magic numbers, things like `left: 13px` or `width: 120px` certainly do. So what's wrong with magic numbers?

- The biggest pitfall is that **it isn't clear to other developers what they mean or why they're there**. This discourages others from changing them when necessary, leading to confusion and duplicated code.
- **They're brittle**. Maybe `left: 13px` makes the page look like it's supposed to on your screen, but what about users with a different default font-size or who browse zoomed in?
- **They never solve the problem, only mask it.** If you need to resort to something like `left: 13px`, there's almost certainly a deeper issue as to why the element is 13px off in the first place, and by ignoring that issue, now you and your team have not one problem but two. Maybe a margin is off somewhere or someone made a typo, and as soon as they fix it, your magic number fix becomes a bug.

So what alternatives are there? First, always try to see the bigger picture. For example, if you want to absolutely position a tooltip above its 40px-tall parent, think about positioning it "all the way above" instead of "40px above" its parent. In this case, don't use `bottom: 40px`, since now if the parent's size changes, your magic number is off. Instead use `bottom: 100%`, which will work no matter the height of the parent. Instead of relatively positioning something or hacking its margins in order to align it, take full advantage of the many ways to [horizontally and vertically center](http://css-tricks.com/centering-css-complete-guide/) things automatically with CSS.

If for whatever reason you still need a magic number, use a comment in vanilla CSS or some math or a variable in Sass to make it clear. For example, if you're working with an experimental 13-column grid and need something to span 3 columns:

    // Huh?
    width: 23.07692308%;

    // Better with CSS
    width: 23.07692308%; // 3/13 columns

    // Better with Sass
    width: (3/13) * 100%; // 3/13 columns

    // Much better with Sass (no need for a comment)
    $totalColumns: 13;
    $columnWidth: (100% / $totalColumns);
    width: 3 * columnWidth;

A common source of magic numbers is with media queries. Chances are, you've seen CSS with `@media screen and (min-width: 769px)` all over the place. To unclutter the CSS and make it clearer what this means, I find it helpful to use simple Sass mixins:

    @mixin large-screens {
      @media screen and (min-width: 769px) {
        @content;
      }
    }

With this, `769px` only has to be declared once, is easy to change as requirements or technology does, and helps declutter your style declarations:

    .box {
      font-size: 2em;
      @include big-screens { font-size: 4em; }
    }

### Keep All Style Declarations for a Selector in One Place

If you need to change the styling for a class, you should only ever have to look in a single place. With CSS structured like this:

    // style.css
    .profile { ... }

    // style.css (at the bottom)
    .js-enabled .profile { ... }

    // media_queries.css
    @media screen and (min-width: 769px) {
      .profile { ... }
    }

You have three different places to look if you need to change a style, which only slows you down and leads to mistakes. If you're using a preprocessor like Sass, you can have everything within a single rule for `.profile`:

    // profile.css
    .profile {
      // ...
      .js-enabled & { ... }
      @include big-screens { ... }
    }

This takes advatage of two awesome features of Sass: [referencing parents with the ampersand selector](http://thesassway.com/intermediate/referencing-parent-selectors-using-ampersand) and [nested media queries](http://thesassway.com/intermediate/responsive-web-design-in-sass-using-media-queries-in-sass-32).

The only exception to this rule is with legacy browser support. If you need to style elements differently for IE7, for example, it's a good idea to put those styles into a separate stylesheet, ie7.css, and only load it for IE7 users with a conditional comment. This avoids wasting bandwidth for users with modern browsers, and makes dropping IE7 support (if necessary) as trivial as deleting a file.

### Use Relative Units For Sizing and Positioning

`px` don't scale, literally. Most websites are or should be responsive these days, which means your CSS measurements are going to change based on screen size. What `em` (or `rem`) do is let you describe things in terms of ratios that work across screen sizes, as opposed to `px` which don't. This can save you a bunch of duplication, time, and inconsistency. Consider the following, styled with `px` measurements:

    body {
      font-size: 12px;
    }
    .headline {
      font-size: 36px;
      margin-bottom: 36px;
    }
    @media screen and (min-width: 769px) {
      body {
        font-size: 16px;
      }
      .headline {
        font-size: 48px;
        margin-bottom: 48px;
      }
    }

Had `.headline` been styled with `em`s, nothing about it would need to change on larger screens:

    body {
      font-size: 12px;
    }
    .headline {
      font-size: 3em;
      margin-bottom: 3em;
    }
    @media screen and (min-width: 769px) {
      body {
        font-size: 16px;
      }
    }

And really, with the wide range of display-densities out there, a pixel isn't even a pixel anymore. The only thing you really know about something `48px` is that it's 3x bigger than something `16px`. So why not just use `3em`?

### Have Naming and Architectural Conventions in Place and Stick to Them

The biggest, easiest win for organization and maintainability is to have a set of conventions in place that you and your team all follow. There are some smart ones out there—[OOCSS](http://oocss.org/), [SMACSS](https://smacss.com/), [BEM](http://bem.info/method/definitions/)—or your own custom CSS Style Guide. The important thing is that all of your CSS follows the conventions: that way, new (or forgetful) developers don't need to learn the entire CSS codebase, only the conventions, to be able to contribute.

My personal favorite is a variation on BEM, or "Block Element Modifier," while I'll write about in more detail soon. BEM encourages you to think about CSS in terms of "blocks" or what you might call modules or components. (In an object-oriented language, these would be classes.) Blocks have elements (the parts within them) as well as modifiers, or variations. You might have a block identified by `.Search`, which contains an input classed with `.Search__input` and a button classed with `.Search__button`. A similar search box with the colors reversed might also have the class `.Search--reversed`. It should be clear that underscores and hyphens have significance in these cases, which immediately helps with organization and coordination. `.about .banner .title` tells you very little, but any developer familiar with BEM conventions can look at something classed `.Banner__title--centered` and know what this element is, what its parent is, and what kind of variation it is. Ultimately, you have to name your classes *something*: it can only help to make them significant with a system like BEM.

## <a name="tldr">TL;DR</a>

1. Have conventions and stick to them rigorously.
2. Keep selector specificity as low as possible.
2. Flexibility is gold: don't give it up for nothing.
4. Describe relationships, not pixels.

## Further Reading

- CSS Wizardry on [Code Smells in CSS](http://csswizardry.com/2012/11/code-smells-in-css/), including some of those I've mentioned here
- The Mozilla Developer Guide on [“Writing Efficient CSS”](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Writing_efficient_CSS).
- One of Medium's front-end devs on the long road to ending up with up with [CSS That's Pretty Effing Good](https://medium.com/@fat/mediums-css-is-actually-pretty-fucking-good-b8e2a6c78b06).
- A nice example of a team CSS style guide from the fine folks at [Github](https://github.com/styleguide/css)
