---
title: The Mature Optimization Handbook
date: 2014-02-12 00:00 EST
tags: performance
---

From Facebook's Carlos Bueno, [The Mature Optimization Handbook](https://www.facebook.com/notes/facebook-engineering/the-mature-optimization-handbook/10151784131623920) is a short but valuable guide to the strategy behind performance optimization. Instead of tips for improving specfic technologies, the author addresses things like whether you should optimize at all, how to determine what to optimize, and how to validate whether your optimization had the desired effect.

<!--more-->

Bueno counsels a scientific approach:

1. Define the problem.
2. Formulate a hypothesis about what's wrong and what specific optimization will prove it.
3. Test that hypothesis.
4. It's great if your hypothesis proves true, but don't overextend it. Just because an optimization is worthwhile is one place doesn't mean it's worth your time in another, where it may be less effective.

Programmers tend to trust their instincts, but when it comes to optimization, **trust your instruments**. Which means first making sure you have all of the relevant data, not merely the data about what you *think* the problem is. Then, try to listen to what the data is telling you.

And **when comparing two points in time, make sure conditions are comparable.** For example, when measuring performance before an after an optimization make sure to compare the same hour and day of the week, and that things like server load are comparable.

Finally, **call your shots**: make a guess as to how much you expect an optimization to improve performance, and once it's deployed make sure it's having only the intended effect.

> Let’s say a new version of the application is rolled out, and the average CPU time per hit improves by 10%. That’s great, right? ...Not if you weren’t expecting it. There are lots of possible reasons for a sudden performance improvement, and very few of them are good.

Crashing is cheap. Some transactions might be failing early. Check the error rates.
