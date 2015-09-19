---
title: Architecture Without an End State
date: 2015-08-16 11:17 EDT
tags:
  - architecture
  - ruby
---

After he appeared on [Ruby Rogues](http://devchat.tv/ruby-rogues/217-rr-architecture-without-an-end-state-with-michael-nygard), I watched Michael Nygard's recent talk [Architecture Without an End State](https://vimeo.com/41763228) and found it fascinating. Nygard argues patiently and convincingly against the "One System To Rule Them All" approach to architecture, through which companies embark on multi-year plans to consolidate all of their data into a single system of record—projects which Nygard says dramatically that he has never seen reach completion. The turnover rate for CTOs is shorter than the time to complete such projects, so more commonly a new CTO will come in with a new plan (only to leave before its completion), relegating the existing plan to the dustbin of "legacy" projects.

Instead, argues Nygard, what we need are a constellation of smaller efforts which can start returning value in the short term. Though he doesn't use the word, Nygard seems in favor of a more agile approach to enterprise architecture: ship early and often in order to validate the utility of what you're producing.

But the idea I found most interesting—and which ran counter to my instincts—is embodied by Nygard's first two points: "Embrace plurality" and "contextualize downstream". In practice, words mean different things in different contexts. For example, to Marketing, a "customer" might be anyone who visits the website, but to Fulfillment, a "customer" is the recipient of a shipment, and to Engineering, a "customer" is someone with a web account. Different business units don't just have different conceptions of a "customer," but often conflicting ones. This is why the "One System To Rule Them All" approach rarely works. You either have to reduce your data model to only the aspects shared by all business units (in which case it's insufficient for *any* of them) or to make it so complex as to make maintenance and even completion of the system an impossibility.

By "Embrace plurality," Nygard means to give up on the utopian idea that a "customer" will be represented one way as one thing in the entire system. Instead, allow different, contextually appropriate representations where it's useful. This reminds me a bit of [the decorator pattern in Ruby](https://robots.thoughtbot.com/tidy-views-and-beyond-with-decorators): instead of defining view-specific logic in the model, wrap model objects in a local "decorator" object which gives it the context-specific behavior it needs without cluttering up the higher-level object's API. I think Nygard means something like this by "contextualize downstream." Going back to my example from the previous paragraph, instead of pushing all (and potentially conflicting) customer-related behavior into one "Customer" model for the entire system, allow different parts of the system to add only the behavior they need at their own level.

This reminds me as well of [another Ruby Rogues episode with Jim Gay on "domain context interaction" (DCI)](http://devchat.tv/ruby-rogues/211-rr-dci-with-jim-gay). Whereas the decorator pattern is about localizing presentation logic, DCI is about localizing behavioral logic in the service of the Single Responsibility Principle. I think a common example is to move authentication logic out of your `User` model and into a separate object dedicated to the task, because being "logged in" isn't a primary concern of the `User`.

Thanks to the Rogues for continuing to expand my mind as a developer. Check them out and especially the two episodes I've linked to if these ideas sound interesting to you.

- [Architecture Without an End State with Michael Nygard](http://devchat.tv/ruby-rogues/217-rr-architecture-without-an-end-state-with-michael-nygard)
- [DCI with Jim Gay](http://devchat.tv/ruby-rogues/211-rr-dci-with-jim-gay)
