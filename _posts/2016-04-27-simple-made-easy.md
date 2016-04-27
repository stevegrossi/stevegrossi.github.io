---
title: Simple Made Easy
tags:
  - architecture
  - complexity
---

> We need to build simple systems if we want to build good systems.
> 
> —Rich Hickey

I've been rolling Rich Hickey’s talk, [“Simple Made Easy,”](http://www.infoq.com/presentations/Simple-Made-Easy) around in my head for a while. At heart, it’s about how to write simpler software, which we all want to do, right? But our software and systems somehow end up complicated—buggy, hard to learn, and hard to change. The reason, Hickey suggests, it because we fall into the trap of mistaking *simple* with *easy*. Before his talk, I’d considered them synonyms, but the difference is crucial.

<!--more-->

Hickey begins with some etymology:

  - **Simple** comes from “simplex” meaning “one fold” or “one braid”. Complex means many folds or braids. Simple means each part is separate or distinct.
  - **Easy** comes from French “aise”, itself from the Latin “adjacens” meaning lying nearby or at hand. Easy means you don’t have to work very hard to get or use something.

In software development, simple things have *one* of something: one role, one task, one concern, one concept, one dimension. Object-oriented programmers will recognize this as the “S” in [SOLID](https://en.wikipedia.org/wiki/SOLID_(object-oriented_design)), the single-responsibility principle. Simple is focused. Not necessarily one instance or one operation: simple things can have many details as long as they relate to the one role or concept. It’s fundamentally about a lack of interleaving or braiding. As such, simple is an *objective* measure.

Easy is nearby: near at hand, you don’t have to look far. *Magic* is a great example of easy: I may have no idea where a Rails method comes from, but it’s always right there when I need it. Easy can also mean familiar, recognizeable. The MVC pattern is easy once you’ve done it. Everything I have shortcuts for in my `.zshrc` is easy, once I set them up. But easy is fundamentally *subjective*—easy for *whom?* Rails magic isn’t easy for a beginner who hasn’t yet developed an intuition about what’s available where. And my `.zshrc` shortcuts not only aren’t easy for someone who isn’t me, but could even make shell usage especially *difficult*.

The big trouble is: easy *feels* simple, but it’s often the opposite. We might even call it “simple” if we’re not being careful. Take gem auto-loading (through Rails’ use of `Bundler.require`) for example. Adding a gem and just being able to call its methods is certainly easier than having to `require` the specific files we depend on. And it feels simpler because it’s less code. But consider the tradeoffs:

- Another developer unfamiliar with Rails will have no idea how some new constant is being included.
- Because it’s included behind-the-scenes, it’s harder to tell when you no longer need it, leading it to be left around past the point of its usefulness.
- It’s included *everywhere*, potentially colliding with existing modules and methods.
- It adds cognitive overhead: automatically-included code is one more thing you need to remember is there (or more often, forget until you stub your toe on it).

Examples abound (post your own in the comments), but in general Hickey’s advice boils down to the following:

> Your sensibilities equating simplicity with ease and familiarity are wrong. Develop sensibilities around entanglement.

Heighten your entanglement radar. Hickey reintroduces an archaic term, *complecting*, for the introduction of complexity. It literally means braiding. When you have a few simple, modular components and you see someone starting to braid them together, having them depend on or make assumptions about each other, it should set your Spidey-sense a’tingling in an uncomfortable way. When a co-worker introduces a big, complex new library they just read about on Hacker News that’s going to make your code look a little bit cleaner, consider whether it will make the system as a whole more complex, harder to understand, and thus less reliable.

Of course, Hickey isn’t so naive as to suggest we avoid complexity entirely. Indeed there are two different kinds. *Inherent complexity* is the complexity arising from the problem you’re trying to solve. The world is messy, and when writing software that interacts with it, certain complexity is unavoidable. On the other hand, *incidental complexity* is the inessential complexity we introduce while trying to solve those problems, e.g. pulling in an HTTP gem to make a single API call when Ruby's `Net::HTTP` would do just fine.

And speaking of caveats, Hickey isn’t even suggesting we avoid incidental complexity entirely. But we should be aware of its costs. Rails itself is incidental complexity: there is no problem in software that cannot be solved without Rails. Rails just helps us solve a certain class of problem (building web applications) more quickly, at the cost of introducing incidental complexity. That's fine if we treat it as technical debt that we eventually need to pay down. But we need to be aware that until we do, we'll be paying interest on it in the form of more specific hiring requirements, additional onboarding time for non-Rails developers, more frequent and difficult upgrades every time Rails changes how something works, and increased vulnerability to security issues because of a big library like Rails' massive surface area.

## The Simplicity Toolkit: Compose, Don’t Complect

> Composing simple components is the way we write robust software.

Thankfully, Hickey concludes with a number of suggestions for keeping our code and our systems simple. At the heart of them is the Unix philosophy of breaking up large, complex systems into small, modular components. But the key isn’t just putting them in separate files or classes, but for the components truly not to know about each others’ inner workings, not to be entangled. Hickey warns:

> I would encourage you to be particularly careful not to be fooled by code organization. There are tons of libraries that look, oh, look, there's different classes; there's separate classes. They call each other in sort of these nice ways, right? Then you get out in the field and you're like, oh, my God! This thing presumes that that thing never returns the number 17. 

He goes on the discuss about a number of specific patterns and practices to avoid in order to keep our systems simple. I won’t mention them here (if you’re interested, go [watch](http://www.infoq.com/presentations/Simple-Made-Easy) or [read](https://github.com/matthiasn/talk-transcripts/blob/master/Hickey_Rich/SimpleMadeEasy.md) the talk) because I don't want to suggest that building simple systems is as easy as "Don’t do X" or "Always use Y". Rather, it’s about developing a sense of when things are entangled, when two classes or services or processes depend on each other more than they need to and in unspoken ways, and stepping back and building an explicit interface. That's our job, to paraphrase Dijkstra: to master what complexity we can, and to avoid what complexity we cannot master. In his words:

> Programming, when stripped of all its circumstantial irrelevancies, boils down to no more and no less than very effective thinking so as to avoid unmastered complexity, to very vigorous separation of your many different concerns.
> 
> — Edsger W. Dijkstra
