---
title: Architecture, Performance, and Games
date: 2014-05-28 18:17 EDT
tags:
  - architecture
  - performance
---

The [Ruby Rogues](http://rubyrogues.com/157-rr-book-club-object-design-book-club-with-rebecca-wirfs-brock/) pointed me to a chapter from Robert Nystrom's e-book *Game Programming Patterns* entitled [Architecture, Performance, and Games](http://gameprogrammingpatterns.com/architecture-performance-and-games.html). While ostensibly about game development, Nystrom's piece is full of excellent perspective and advice for developers of all stripes. 

<!--more-->

He identifies three oft-opposing forces at play in software development:

> 1. We want nice architecture so the code is easier to understand over the lifetime of the project.
> 2. We want fast runtime performance.
> 3. We want to get today’s features done quickly.

Nystrom is frank about there being "no simple answer here, just trade-offs," though he does suggest a strategy that helps in all of these cases: *simplicity*. Simple solutions are often easier to understand, usually faster, and typically require less work than more complex solutions. Of course, I intentionally used a lot of qualifiers there—"often", "usually", "typically"—since in my experience certain kinds of simplicity can actually be more opaque, slower, or take longer to write than their more complex alternatives. Fortunately, Nystrom is illustrative about the kind of simplicity he's talking about:

> In my code today, I try very hard to write the cleanest, most direct solution to the problem. The kind of code where after you read it, you understand exactly what it does and can’t imagine any other possible solution.

## Architecting for Change

One of my favorite things about this chapter is Nystrom's definition of well-designed code in terms of how it feels to work with, not just how it looks:

> For me, good design means that when I make a change, it’s as if the entire program was crafted in anticipation of it. I can solve a task with just a few choice function calls that slot in perfectly, leaving not the slightest ripple on the placid surface of the code.
> 
> ...**The measure of a design is how easily it accommodates changes.** (emphasis mine)

I feel the same way. Sure, there's code that *looks* good—typically with short, well-named methods—but that gets you only so far. It's also about how code *feels to work with*, and in my experience the best code is the code that makes you feel powerful, that helps rather than hinders you in extending or changing it.
