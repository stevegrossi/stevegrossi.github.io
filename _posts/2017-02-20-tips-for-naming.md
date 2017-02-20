---
layout: post
title: Tips for Naming
tags:
  - best practices
  - refactoring
---

Naming things is famously one of the [two hard things](https://martinfowler.com/bliki/TwoHardThings.html) in computer science. The humor in this adage derives from the fact that naming seems like it should be easy. And yet, most of us can relate to the importance and difficulty in coming up with good names for objects and concepts in our code.

<!--more-->

That’s why I really enjoyed [this episode of Software Engineering Radio](http://www.se-radio.net/2016/12/se-radio-episode-278-peter-hilton-on-naming/) interviewing Peter Hilton on the topic of naming. Hilton clarifies why naming is so important:

> Names are about what we mean, not just what the code does.

Names are how we communicate our *intention* to other developers. When we need to change some code to fix a bug or add functionality, it’s essential that we understand what the code was initially trying to do. Good names can have a huge impact on whether or not we’re successful at that.

That’s why Hilton recommends **rename refactoring** before submitting any code: it’s the safest, highest-impact refactor there is for improving the long-term quality and reliability of your code. Quite simply, before submitting your code for review, look at all the names you’ve given classes, modules, functions, and variables and think for a moment if there’s a clearer, more precise name. As Hilton says:

> Don’t give up. If you try *at all* you can improve any name.

Better yet, have someone unfamiliar with your code do the same.

## Don’t Give Code a Bad Name

Hilton gives some clear signs of bad names I’m sure we’ll all recognize:

- **Meaningless** placeholder names like “foo”.
- **Incorrect** names, such as calling a shipment a consignment, or a function “save” that does not actually save something.
- **Inconsistent** names, such as calling the same thing 2 different names in 2 places.
- **Vague** verbs like “get” and “do”—they may be true, but more specific verbs like “fetch”, “calculate”, and “derive” better convey intention. Likewise with vague nouns such as “manager”: opt for more specific terms like “builder” or “calculator”.
- **Single-letter names** are generally bad unless extremely conventional (such as “i” for an iterative index). Even then, they force an additional step between reading and understanding.
- **Too-literal names** like “appointment list”, prefer domain terminology like “calendar”. Likewise, “employee” is a better name than “company person”.

## What’s in a (Good) Name?

These are harder to prescribe than bad names. As Hilton puts it, “Good names are good in a context”. You notice bad names when you trip over them, but good names are transparent. However, one guideline is that good names generally map to what the people using a system would call them. That means go talk to domain experts to find out what are good names. Not only will this produce clearer, ore consistent names within a program, but gives developers a leg up in communicating with the rest of the company, because we’ll be mapping our own mental models to the ones used outside our team.

## More on Naming

For more on this, you can watch Hilton’s talk, [*How to Name Things: the solution to the hardest problem in programming*](https://skillsmatter.com/skillscasts/5747-how-to-name-things-the-solution-to-the-hardest-problem-in-programming)

Henrik Nyh has a good tactic, [“The Pairing Test”](https://thepugautomatic.com/2017/01/the-pairing-test/): he suggests either writing or simply thinking of a list of class or function names on one side and a list of responsibilities on the other. With good names, it should be easy to pair each name with its responsibility. This highlights the fact that names must be judged in the context of other names, not just alone.

And Avdi Grimm has a great [episode of Ruby Tapas](https://www.rubytapas.com/2013/04/22/episode-087-naming-things-headcount/) on naming in which he demonstrates how naming is a process of discovery. Giving a name to a concept or component previously unnamed can bring new clarity to a system:

> In my experience, it’s often the case that as soon as we identify an as-yet unnamed concept that’s implicit in the code, multiple beneficial refactorings seem to cascade naturally from the change.

In light of this, naming may be one of the most important things we can spend our time doing.
