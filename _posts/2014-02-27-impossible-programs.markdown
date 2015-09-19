---
title: Impossible Programs
date: 2014-02-27 00:00 EST
tags: ruby, computer science
---

Here is [a fascinating talk](http://vimeo.com/66849976)—from Tom Stuart at last year's Scottish Ruby Conference—on the subject of programs that are impossible to write in Ruby. Computers are logic machines, and Stuart takes us on a tour of many of the underlying problems with logic and how they manifest themselves in computer science, touching on things like undecideability, the halting problem, and Rice's theorem.

<!--more-->

He begins by enumerating the kinds of things that computers simply can't do. They are things that are:

* **vague**: problems we humans can't well formulate, since computers depend on specific instructions
* **dfficult**: for example hard-AI problems, which are problems that require computers at least as intelligent as people. We may someday crack this, but not today.
* **expensive**: things like cracking passwords, which are often simple, but that take near-infinite time.
* **impossible things**: the subject of the talk: problems which even if well-defined, and with infinite time, you can't make computers do because of a fundamental constraint on computation.

## How Can a Program Be Impossible?

1.  Universal systems (e.g. many program languages) are systems which can run software, which is to say you can run things that you've never seen before provided they follow certain rules.
2.  Software is just data: strings of text.

From these two facts arises the possibility of infinite loops: you can always feed a program back into itself. But if you can do that, then you can feed it a paradox: this program returns true if and only if it returns false. Such a program will never finish.

In Ruby, we can write programs that may or may not run forever (for another example, one which loops through all prime numbers until it finds one that isn't the sum of 2 other primes). We don't know if this program will ever finish, so it's probably impossible to write a Ruby programs that determines whether or not that program will run forever.

But if this were possible—if we could write a program that reads another program and tells whether it will ever finish—then this second program, something like

    def halts?(input)
      // determine if the input program will ever finish
    end

would itself need to always finish to return the result. So we could write a program loops forever *if and only if its input program will finish*. Something like

    def runforever(input)
      while halts?(input)
        // keep running
      end
    end

But what if we give this program as input to itself? It finishes only if it never finishes, and it never finishes only if it finishes. Another paradox. This is known as **the halting problem** in computer science.

Furthermore, any program that we can write to answer the question "does this program do what I want it to do?" can be used to write a halts?() method, which we know is impossible. Thus, not only can we not ask "does this program halt?" but we can't even ask "does this program do what I want it to do?"

This is Rice's theorem: **any interesting property of program behavior is undecideable.**

In other words, it is impossible to look into the future and predict what a computer program is going to do. The only way to know what a program will do is to run it, but in that case you don't know how long you'll need to wait for it to finish (and sometimes it never will, but we can *never* know whether it's one of those, or just one that takes a trillion years to run.)

In other words, **any system powerful enough to be self-referential cannot correct answer every question about itself.** This is prety much [Gödel's Incompleteness theorem][1] applied to computers.

The good news for us is that for this reason, the world will probably always need programmers. Programs themselves cannot determine their own interesting propetrties—properties they may or may not have that we'd want to check for. But how can *we* do that? Stuart ends with some strategies:

* Ask undecideable questions, but set a time limit at which we give up. We may learn things, but avoid getting caught in those nasty infinite loops.
* Ask several smaller questions whose answers suggest the answer to a larger, fundamentally unanswerable question.
* Ask decideable questions by being conservative.
* Approximate a program by converting it to something simpler, then ask questions about that approximation.

 [1]: http://en.wikipedia.org/wiki/G%C3%B6del%27s_incompleteness_theorems
