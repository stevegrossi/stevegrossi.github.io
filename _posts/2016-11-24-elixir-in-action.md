---
layout: post
title: Elixir In Action
tags:
  - elixir
---

I just finished Saša Jurić’s excellent [*Elixir in Action* published by Manning](https://www.manning.com/books/elixir-in-action). I’ve been learning Elixir for about six months now, having learned the basic concepts and syntax from Dave Thomas’s [*Programming Elixir*](https://pragprog.com/book/elixir/programming-elixir), which is a great introduction to *writing* Elixir. But I still lacked an understanding of how to *build* with Elixir, specifically how to create, structure, and deploy [OTP](http://learnyousomeerlang.com/what-is-otp) applications, set up supervision trees, and leverage the power of concurrency and distribution. That’s where *Elixir in Action* was the ideal next step.

<!--more-->

After an opening section introducing Elixir (which you can probably skim if you’re already familiar), *Elixir in Action* is structured around building a to-do list application. That may sound common, but what's exceptional is how Jurić iterates: starting first with an extremely simple version using only Elixir functions like `spawn` and `receive` to send simple messages between processes, then building a generic process abstraction which is eventually replaced by Elixir’s `GenServer` behaviour. We manage these processes manually until there are so many it becomes a hassle, and so Jurić introduces OTP supervision trees. What we end up building is a robust, scalable, fault-tolerant system running on multiple servers with a database, HTTP API, and caching layer. But the incredible thing about *Elixir in Action* is how we get there: through a series of small steps from doing-it-ourselves (so we understand *what* we’re doing) to making it simpler or better with Elixir and OTP tools (so we understand *why*).

Thanks to *Elixir in Action*, I feel like I’m finally beginning to grok the Elixir mindset (which it gets from Erlang). A couple key takeaways:

- **Processes are bottlenecks.** Within a process, it does its work sequentially, moving from one task to the next. So generally, you’ll want to keep core processes lightweight and move slow operations out of the way and into other processes. But you can also use bottlenecks to your advantage, such as directing all operations on a given database record through a single process to ensure those operations happen in order and never conflict.
- **PIDs are impractical. Name your processes.** It’s a fact of life that processes die, and while supervision trees can help with starting new processes to do the same job, they’ll have a brand new PID which you won’t know. I never understood why Elixir and Erlang have so many tools for process registry—`Process.register`, Erlang’s `:pg2`, `:global`, and `:gproc`, and Elixir 1.4’s [new `Registry` module](http://elixir-lang.org/docs/master/elixir/Registry.html)—but once you build an app of any complexity, you very quickly need help keeping track of all your processes. *Elixir In Action* does a great job of explaining what each one does and when you’d want it.

So whether you’re new to Elixir or already familiar, and want want to learn how to build consequential, highly-available, and scalable systems The Elixir/Erlang Way, then I highly recommend *Elixir In Action*.

(You’re also invited to the next [Indy Elixir meetup](https://www.meetup.com/indyelixir/events/234972007/), where I’ll be sharing some of what I’ve learned from the book!)
