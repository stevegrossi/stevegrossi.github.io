---
title: The Mature Optimization Handbook
date: 2014-02-12 00:00 EST
tags: performance
published: false
---

From Facebook, [The Mature Optimization Handbook](https://www.facebook.com/notes/facebook-engineering/the-mature-optimization-handbook/10151784131623920), a guide to 

READMORE

1. be scientific. Define the problem. formulate a hypothesis about what's wrong and what specific optimization will prove it. test that hypothesis. don't overextend it--just because an optimization is worthwhile is one place doesn't mean it's worth your time in another, where it may be less effective.

2. Trust your instruments, not your hunches. Don't go looking for what you think the problem is; instead, look at what the information at your disposal (logs, analytics, other metrics) tells you it is.

“You want a continuous, layered measurement regime”

“When comparing two points in time, it’s best to compare the same hour and day of the week. ”

1.  Let’s say a new version of the application is rolled out, and the average CPU time per hit improves by 10%. That’s great, right? ...Not if you weren’t expecting it. There are lots of possible reasons for a sudden performance improvement, and very few of them are good.

Crashing is cheap. Some transactions might be fataling early. Check the error rates.
