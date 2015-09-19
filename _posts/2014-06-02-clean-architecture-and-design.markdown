---
title: Clean Architecture and Design
date: 2014-06-02 08:43 EDT
tags: architecture
---

"Uncle" Bob Martin's talk at the 2013 Norwegian Developers Conference, entitled "[Clean Architecture and Design](http://vimeo.com/68215570)," completely changed the way I think about software architecture. In short, good architecture is less about the decisions you make and more about the decisions you *defer making*.

<!--more-->

Martin relates how when he asks his consulting clients to describe their architecture, more often than not they describe a set of tools. I'll admit to this. Ask me about the architecture of a project and I might describe the Rails core, PostgreSQL data store, with memcache for in-memory storage, all served by Puma and fronted by Nginx. Martin argues, and I have to agree now, that this is entirely backwards.

Your architecture, he argues, is the business logic, the use cases, of your program. Not only is it *not the tools* you use to implement those use cases, but the purpose of a good architecture is to *defer choosing those tools* for as long as possible.

> The purpose of a good architecture is to defer decisions, delay decisions. The job of an architect is not to make decisions, the job of an architect is to build a structure that allows decisions to be delayed as long as possible. Why? **Because when you delay a decision, you have more information when it comes time to make it.**

I'll admit to often starting projects like a kid in a toy store: "Ooh, I want Rails, and the latest version! And I bet MongoDB will be a good fit, give me that too. And I'll probably need a persistent key-value store so let's take Redis off the shelf..." All before writing a single line of code. And often the first lines of code I write will have nothing to do with the particulars of the project, but with getting all the moving parts working together and that vaunted "Hello world" up on the screen. Uncle Bob disapproves:

> How many of you have ever had an iteration zero where the purpose of that iteration zero was to get all the framework crap working...paying absolutely no attention to the use cases? That is not the appropriate thing to do in an iteration zero. In an iteration zero the kind of tools you want to get working are the source code control system...what language you're going to use...and you ought to be thinking about how you are going to *defer* all those other decisions. How are you going to construct a system that allows you to *delay*, as long as possible, all those other decisions. **A good architect maximizes the number of decisions not made.**

So we should defer implementation decisions as long as possible to maximize the amount of knowledge we have when we finally do have to make a choice. But there are some other major benefits. Martin shares the telling story of how, when developing [FitNesse](http://en.wikipedia.org/wiki/FitNesse), his team deferred the decision of which database to use for years: so long, in fact, that by the time the project was finished they realized they didn't need one! Consider the time, effort, and complexity saved in such a case.

Bob then goes on to share another impressive benefit of building this way: fast tests. His team's approach to FitNesse was to **do as much as possible with as little as possible**. Since their tests for the first phase of functionality had no database or even saving mechanism to rely on, they're incredibly fast because they operate only in memory. By delaying the addition of more moving parts to the system as long as possible, you ensure that the maximum amount of what you build is as lean as possible, making it easier and faster to test.

I've begun thinking of how to take this sort of approach with Rails apps. Since Rails makes a bunch of architectural decisions for you, I think Uncle Bob would approve of starting *without Rails* and just putting my (non-activerecord, at this point) models in /app/models and writing unit tests for business logic. Only then should I run

    rails new .

(in the current directory) and add persistence tests to the models, then going on to write controller and acceptance tests to drive implementation from there.
