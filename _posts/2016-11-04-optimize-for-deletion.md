---
layout: post
title: Optimize for Deletion
tags:
  - principles
  - process
---

I just watched Greg Young’s talk [The Art of Destroying Software](https://vimeo.com/108441214). It’s a compelling, unconventional argument for changing the way we write code to maximize our ability to delete it. Young’s rule of thumb is 1 week: *don’t write any self-contained part of your system that would take more than a week for someone unfamiliar with it to rewrite from scratch.*

The maxim to prefer lots of small components to fewer large ones isn’t new. Young acknowledges that this idea goes back decades to [the Unix philosophy](https://en.wikipedia.org/wiki/Unix_philosophy) and the intent behind Erlang’s lots-of-tiny-processes actor model. (Marvin Minsky’s 1988 *The Society of Mind* suggests our minds are even structured thus.) And yet we don’t.

> Teams inherently want to build programs that are too big and too complex.

I wish Young’s talk went into the reasons why we so often fall into the trap of writing programs that are too complex to manage—or, more typically, why we let our small programs grow into unmanageable beasts.

Young gives a compelling summary  of the benefits of structuring large systems as many smaller programs:

- Smaller units lets your team **work faster**: you’ll spend less time trying to figure out a unit’s responsibilities.
- **Fewer bugs**, as you can fit the entire unit in your head and be reasonably sure of what it will and will not do.
- New hires can be **more productive sooner**, as familiarity with the entire system and all it’s dependencies is no longer a prerequisite for productivity.
- **Easier deploys**, as you can be more confident of the new behavior of a 1000-line change than you can of a 10,000-line change.

Of course, optimizing your code for deletion brings additional benefits when you actually start deleting code:

- **Technical debt becomes less of a problem.** It matters less how great a piece of code is or how ideal an abstraction if you can just burn it down and rewrite it within a week.
- **You no longer need to predict the future.** Developers aren’t psychics. No matter how good you are you can’t know where your business will be and thus what your codebase will need to do 6 months from now. Deletability means you don’t need to build a model that meets your needs 6 months from now. You can delete it then and build a new model once you know what it needs to be.
- **Deleting code pays off.** If deleting code is easy, your team won’t be afraid to do it. That means you won’t get stuck maintaining, waiting on tests for, and ultimately paying for code you no longer need. A friend of mine joined a project for a big company and discovered they were hosting an entire data service for $25k/mo that literally no one used. Deleting code pays off.

Again, Young’s advice is deceptively simple:

> Write small manageable programs that coordinate to get a job done instead of writing one big lump of crap.

That we don’t suggests this is easier said than done. But something that’s personally helped me is to develop a visceral distaste for complexity and coupling. Some of this comes from pain felt working on horribly complex systems, and some from the pleasure of building small, simple side projects.

Most programs don’t start out as colossuses. We get into trouble when we don’t realize something is too big until it’s too late to easily split up. So here, guidelines like [Sandi Metz’s rules](https://robots.thoughtbot.com/sandi-metz-rules-for-developers) can be the canaries in your coal mines. Sure, 100 lines is an arbitrary limit for the length of a Ruby class, and you should feel free to break it when you have a good reason. But if you at least get in the habit of stopping and thinking about your reasons for growing a class past 100 lines, I’m willing to bet you’ll have very few 3,000 line classes to manage.
