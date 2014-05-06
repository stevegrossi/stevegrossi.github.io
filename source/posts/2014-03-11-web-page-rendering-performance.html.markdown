---
title: Web Page Rendering Performance
date: 2014-03-11 00:00 EDT
tags: performance
---

Paul Lewis is a Developer Advocate on the Google Chrome team, and he's been on fire lately with a series of excellent articles on the nuances of web page performance from the perspective of the browser. If you do front-end development (like I do), and you don't know what frames, paints, and layers are (like I didn't), then Paul's articles are an excellent introduction to why your site isn't silky-smooth when scrolling or animating.

READMORE

I started with [The Runtime Performance Checklist][1], which introduces the Chrome DevTools Timeline in frame mode. For smooth animation, you want to shoot for 60 frames per second--a *frame* in the browser being the same things as in film: the atomic unit of animation--which gives you just 16.6ms to render each frame. Chrome DevTools in frame mode shows you everything that's happening within in each frame to highlight any bottlenecks that are slowing you down. Often, these will be *paints*, rendering actions in which the browser has to re-calculate where things should appear. The article introduced me to a setting in Chrome, Rendering > Show Paint Rectangles, which will highlight the affected area of the page whenever a paint happens. In general, you want to keep paints as few and as small as possible, so if your entire screen is flashing red, you may want to take steps to reduce and isolate paints.

Next, Paul Lewis teams up with Paul Irish on [High-Performance Animations][2]. The article is rich with information, but the simplest takeaway is that at the moment, browsers can animate four things cheaply: opacity, and position, scale, and rotation transforms. So whenever possible, you want to animate elements using these properties (e.g. `transform: translateY(100px)` on hover instead of `top: 40px`).

Paul puts these guidelines into practice in [Parallaxin'][3], in which he tries to optimize an example parallax site. Parallax is such a challenge to make smooth because, with things changing position on scroll, it guarantees that each frame will be packed with animation work. Paul starts with the slowest example, using absolute positioning, and then walks us through the improvements to be had by using 3D transforms and ultimately canvas and WebGL to optimize this particular use case.

Finally, I came across his article, [Avoiding Unnecessary Paints: Animated GIF Edition][4]. It's not as far-reaching as the others, but it's another helpful example of the practicalities of paints, and introduces the concept of *layers*, groups of elements that browsers use for the purpose of painting. The thing is, because of the dynamic nature of animated GIFs, the browser is constantly repainting them, and thus *everything else on the same layer*, which can be very expensive from a rendering perspective, especially on mobile. To avoid this, make sure to hide animated GIFs when they're no longer needed, such as with a loading indicator.

 [1]: http://calendar.perfplanet.com/2013/the-runtime-performance-checklist/
 [2]: http://www.html5rocks.com/en/tutorials/speed/high-performance-animations/
 [3]: http://www.html5rocks.com/en/tutorials/speed/parallax/
 [4]: http://www.html5rocks.com/en/tutorials/speed/animated-gifs/
