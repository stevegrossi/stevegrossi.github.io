---
title: Foreman Lets You Run Things Only When You Need Them
date: 2014-03-15 00:00 EDT
tags: postgresql, rails
---

[Maurício Linhares has a great post](http://mauricio.github.io/2014/02/09/foreman-and-environment-variables.html) espousing the virtues of [Foreman][1], a Ruby gem for process management. I've benefited from Foreman's `.env`-file way of managing environment variables, but aside from adding `web: bundle exec unicorn -p $PORT` to my Procfile I haven't really used Foreman for its primary purpose, managing processes.

READMORE

But I noticed this weekend that my laptop's getting on in years and has been growing sluggish, and when I inspect what's consuming its CPU cycles, I see processes like mysqld, postgres, mongod—things I need when developing specific projects but don't necessarily want running 24/7, but since I've installed them as services that's what they do.

Following Maurício's advice, I set about uninstalling Postgres as a service, so it's not going to be running all the time, and setting up Foreman to only run Postgres when I need it, i.e. when I'm running a local web server with `bundle exec foreman start`.

I already had a Procfile for Heroku's benefit, but since I only want to run Postgres in this way locally, I created a second Procfile.dev for local use. I tell Foreman to use this file by running

    bundle exec foreman start -f Procfile.dev

I also followed Maurício's advice and set up a separate Postgres database (both data and config) within my project directory, inside `vendor/postgresql`. I like the idea of being able to tweak a single project's Postgres config without contaminating that of other apps. To ensure anyone else running my app has this same setup, I've added this line to my app's [setup script][2]:

    pg_ctl init -D vendor/postgresql

Finally, I added the following line to my `Procfile.dev`:

    postgresql: postgres -D vendor/postgresql

Now, I can start up a local development environment, Postgres-and-all, using the `foreman start` line above, and when I'm finished and stop Foreman, Postgres is no longer consuming resources on my system.

 [1]: https://github.com/ddollar/foreman
 [2]: http://robots.thoughtbot.com/post/41439635905/bin-setup
