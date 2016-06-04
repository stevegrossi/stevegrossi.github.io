---
title: "Coders At Work: Reflections on the Craft of Programming"
tags:
  - craft
  - complexity
---

I’ve recently worked my way through [*Coders At Work: Reflections on the Craft of Programming*](http://www.codersatwork.com/), Peter Seibel’s oustanding collection of interviews with some of the industry’s most experienced programmers. Published in 2009 but featuring practitioners who’ve been working for decades, it’s full of wisdom both current and timeless on the craft of building software. Here are some of my favorite ideas from the book.

<!--more-->

## Jamie Zawinski

Comparing programming with writing:

> In some ways, yeah. Programming is obviously much more rigid. But as far as the overall ability to express a thought, they’re very similar. Not rambling, having an idea in your head of what you’re trying to say, and then being concise about it. I think that kind of thinking is the overlap between programming and writing prose.

Some humor on balancing quality with deadlines:

> One of the jokes we made at Netscape a lot was, “We’re absolutely 100 percent committed to quality. We’re going to ship the highest-quality product we can on March 31st.”

## Brad Fitzpatrick

Asked what he thinks is the most important skill for a programmer to have:

> Thinking like a scientist; changing one thing at a time. Patience and trying to understand the root cause of things. Especially when you’re debugging something or designing something that’s not quite working. I’ve seen young programmers say, “Oh, shit, it doesn’t work,” and then rewrite it all. Stop. Try to figure out what’s going on. Learn how to write things incrementally so that at each stage you could verify it.

Something I’ve learned in my years programming is not to ignore “the bullshit multiplier” when planning and estimating work:

> I always forget a factor, like the bullshit multiplier of having to deal with interruptions.

## Douglas Crockford

I really appreciate Crockford’s emphasis on code-reading, by which he means having other programmers read your code and ask you about it (a practice which also goes by the name “code reviews”). He’s found tremendous value in it:

> I think an hour of code reading is worth two weeks of QA.

Naturally then, *readability* is the highest virtue of code, since it’s a prerequisite for effective code reading:

> Readability of code is now my first priority. It’s more important than being fast, almost as important as being correct, but I think being readable is actually the most likely way of making it correct.

And of course, if this something your team does, why not make it part of the interview process?

> When hiring programmers, ask them to present some code they’re really proud of. This makes sense for so many reasons. One, it shows they cared enough to write something they’re proud of in the first place. It shows how they understand and more importantly communicate their thoughts about code. And it shows their level of taste, not just what they can do but what they like.

Switching gears a bit, I’ve been thinking lately about [the perils of optimism](https://twitter.com/SteveGrossi/status/736597809583923201). In Crockford’s words:

> Programmers are optimistic. And we have to be because if we weren’t optimists we couldn’t do this work. Which is why we fall prey to things like second systems, why we can’t schedule our projects, why this stuff is so hard.

We have to be optimistic because so much of programming involves believing we can do things that haven’t been done before (or else you wouldn’t need to build it). But this optimism also tends to hide from us our limits.

## Brendan Eich

I like "foot guns" as a metaphor for things that almost encourage misuse, i.e. “shooting yourself in the foot”:

> Certainly I’ve experienced some toe loss due to C and C++’s foot guns.

But most importantly, I like Eich’s description of the role of “principal engineer” on a team as someone who serves as a mentor and leader but remains primarily an engineer rather than a manager:

> While producing a lot of code is still important, what has interested me—and this is something that we talked about at Netscape when we talked about their track for principal engineer—is somebody who isn’t management but still has enough leadership or influence to cause other programmers to write code like they would write without them having to do it, because you don’t have enough hours in the day or fingers.

This sounds a lot like [the “technical leader” role I’ve written about before](/2015/10/17/the-senior-software-engineer/).

## Joshua Bloch

Bloch puts into his own words an important sentiment echoed in one form or another by nearly all of the interviewees:

> The older I get, the more I realize it isn’t just about making it work; it’s about producing an artifact that is readable, maintainable, and efficient.

“Making it work” is but a small part of the job of programming, and counts for very little if “it” breaks every time another developer has change it because its purpose and method are unclear. And while Bloch mentions efficiency, he mentions a useful adage about optimization being of secondary importance:

> As they say, it’s easier to optimize correct code than to correct optimized code.

Block also echoes a feeling I consider an important marker of experience, a “spidey-sense” around complexity:

> When I’m designing stuff, I pay close attention to my “complexity meter:” when it starts bumping into the red zone, it’s time to redesign stuff.
>
> ...I think that if things start getting complicated, there’s probably something wrong with them and it’s probably time to start looking for an easier way to do it.

As a less-experienced developer, it felt like success when I could finally get a big mud-ball of code or some enormous dependency working. For about 15 minutes. Then, when I inevitably needed to change some behavior or fix an unforseen bug, I’d immediately begin paying interest on that technical debt. Perhaps the most valuable thing I’ve learned now is that when things start getting so complex they’re hard to work with, it’s time to stop, step back, and simplify. Because “making it simple” is actually the only *lasting* way to “make it work”:

> a brilliant quote by Tony Hoare in his Turing Award speech about how there are two ways to design a system: “One way is to make it so simple that there are obviously no deficiencies and the other way is to make it so complicated that there are no obvious deficiencies.”

## Joe Armstrong

Armstrong, one of the creators of Erlang, on beautiful code and how to achieve it:

> I like minimalistic code, very beautifully poised, structured code. If you start removing things, if you get to the point where if you were to remove anything more it would not work any more—at this point it is beautiful. Where every change that you could conceivably make, makes it a worse algorithm, at that point it becomes beautiful.

It reminds me of Antoine de Saint Exupéry on perfection being achieved “not when there is no longer anything to add, but when there is no longer anything to take away.”

## Peter Norvig

As our industry has proliferated (and I’ve gotten older), I can begin to appreciate this quip:

> Seibel: Do you still enjoy programming as much as when you were starting out?
>
> Norvig: Yeah, but it’s frustrating to not know everything.

## Guy Steele

On well-designed APIs:

> Show me your interfaces and I won’t need your code because it’ll be redundant or irrelevant.

## L. Peter Deutsch

On the fundamental tension between detail and abstraction:

> Software is a discipline of detail, and that is a deep, horrendous fundamental problem with software. Until we understand how to conceptualize and organize software in a way that we don’t have to think about how every little piece interacts with every other piece, things are not going to get a whole lot better.

## Ken Thompson

Many of the programmers in *Coders at Work* have been at it for decades. I really enjoyed a taste of the history of our field, for example the idea of installing *hardware* in order to be able to perform multiplication:

> the worst example was the on PDP-11. It didn’t have multiply but you could buy a multiply unit and plug it in, but it was an I/O peripheral. You would store a numerator and a denominator and say go. You’d busy-loop and then pull out the answer, the quotient and the remainder.

## Fran Allen

When asked what makes a program beautiful:

> That it is a simple straightforward solution to a problem; that has some intrinsic structure and obviousness about it that isn’t obvious from the problem itself.

## Bernie Cosell

Notably, the ability to keep a lot of detail in one’s mind can actually be a hindrance to writing well-factored code:

> I’ve observed that often the programmers that write the hairiest, most complicated code are the ones who can keep a ton of details in their mind.

And such complexity is usually unnecessary anyway:

> The first is the idea that there are very few inherently hard programs. If you’re looking at a piece of code and it looks very hard—if you can’t understand what this thing is supposed to be doing—that’s almost always an indication that it was poorly thought through.

In other words, overly complicated solutions are rarely an appropriate response to a complicated problem; rather, they typically reflect some degree of confusion about a simple one.

Finally, Cosell provides another formulation of the idea that the craft of programming is about so much more than just “making it work,” this one in the strongest terms yet:

> They’d be stunned when I tell them, “I don’t care that the program works. The fact that you’re working here at all means that I expect you to be able to write programs that work. Writing programs that work is a skilled craft and you’re good at it. Now, you have to learn how to program.”

For Cosell, like many of the others, “learning how to program” means learning how to write simple, clear, readable, maintainable code. In other words, code written not for the machine, but for people.

* * *

My only criticism of *Coders at Work* is the obvious fact that, except for Frances Allen, all of Siebel’s interviewees are white men. Even given the unfortunate historical demographics of our field, it shouldn’t have been hard to seek out more women and people of color. I’d have loved an interview with, for example, [Margaret Hamilton](https://en.wikipedia.org/wiki/Margaret_Hamilton_%28scientist%29), whose long and distinguished career in as a programmer includes fascinating work at NASA on the Apollo 11 operating system. Or [John Henry Thompson](http://www.j4u2.com/jht/bio.html), programmer, educator, and creator of the Lingo programming language. Both have been “coders at work” as long or longer than the other interviewees, and experience like theirs would have improved the book meaningfully. Thankfully, as our field continues to grow in diversity, such homogeneity of viewpoints grows more glaring. I would eagerly read a sequel (official or in spirit) whose interviewees comprise a broader range of backgrounds.
