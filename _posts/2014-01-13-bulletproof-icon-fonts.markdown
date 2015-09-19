---
title: Bulletproof Icon Fonts
date: 2014-01-13 00:00 EST
tags: front-end, icons
---

In excellent detail, [Filament Group enumerates](http://filamentgroup.com/lab/bulletproof_icon_fonts/) the issues around using `@font-face` to serve up UI icons as a font. It's a powerful technique to which I often turn, but it's not without its caveats. Fortunately, the Filament folks have two best-practice techniques for using icon fonts, one for mission-critical icons and a simpler one for more decorative icons. Both techniques require javascript for feature detection, but it's fairly simple and they've even packaged it up in a library cleverly named [A Font Garde][1].

<!--more-->

It's worth noting that Filament Group themselves recommend SVG icons over icon fonts. For reasons why, they point to a worthy blog post by Lonely Planet's Ian Feather, [Ten Reasons Why We Switched from an Icon Font to SVG][2].

 [1]: https://github.com/filamentgroup/a-font-garde
 [2]: http://ianfeather.co.uk/ten-reasons-we-switched-from-an-icon-font-to-svg/
