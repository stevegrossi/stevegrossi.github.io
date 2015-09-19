---
title: 'This Week I Learned #2'
date: 2014-01-11 00:00 EST
tags: git, heroku, ruby
---

How Ruby's `super` really works, DRYing out Heroku toolbelt commands, passing Ruby exceptions to blocks, and one weird tricks for making a robot voice speak my git commits.

<!--more-->

## In Ruby, `super` Acts Like a Method

`super` is one of those things I'd seen in Ruby but never knew quite what it does. I'd seen it used within methods to jump out and call the instance's parent's method of the same name. Indeed, it does that, but I learned this week that it actually *returns* with the result of that method, which opens up some interesting possibilties. This came in handy when I wanted to add a boolean method to a child model (e.g. Dachshund) that also took into account the result of the same method on the parent model (e.g. Dog):

    class Dog
      def cute?
        weight < 20.pounds
      end
    end

    class Dachshund < Dog
      def cute?
        super && length > 2.feet
      end
    end

Here, `Dachshund#cute?` has its own truth conditions, but also respects the truth conditions of `Dog#cute?`.

## With the Heroku Toolbelt You Can Identify Apps by Git Remote Instead of Name

You use the `-r` flag instead of `-a`. So now I type:

    $ heroku config -r staging

Instead of

    $ heroku config -a stevegrossi-blog-staging

Not only does this usually save me a fair bit of typing (I type these commands dozens of times each day), but it helps make my code more modular. I often include a Rake task in my Rails apps that copies the production database to staging. I typically copy-and-paste this rake file into new apps and find-and-replace the relevant hard-coded Heroku app names. Now, I can just include something like:

    task :update_staging => [:backup_staging, :backup_production] do
      system 'heroku pgbackups:restore DATABASE -r staging $(heroku pgbackups:url -r production)'
    end

And it's good-to-go for any app. The only downside is that I can't find a way to include the `--confirm [APP NAME]` flag based on the Git remote, but I don't mind having to manually enter that as a safety-check before wiping that database with an import.

## In Ruby, Access the Exception when Rescuing with a Hashrocket

Here's another one I'd seen but never needed to use until now:

    begin
      so_some_stuff
    rescue DangerHighVoltageError => exception
      notify(exception)
    end

The hashrocket (`=>`) here lets you access the exception instance within the `rescue` block so you can act on it.

## How to Make a Robot Speak Your Git Commits

This one's entirely useless and a lot of fun (or maybe that's just the end-of-day-Friday talking...) I learned this week about Git hooks, scripts that Git will run automatically as you use it. One of which is **post-commit**, which happens, you guessed it, after you commit. By creating an executable file in a Git repository at

    $ touch .git/hooks/post-commit
    $ chmod  +x .git/hooks/post-commit

Git will execute that file after each commit you make. This file doesn't implicitly know anything about the commit, but you can get the text of your last commit message with

    $ git log -1 HEAD --pretty=format:%s

Combine that with Mac's `say` command and you have a Git hook that will read your commit message in a robot voice after each one:

<script src="https://gist.github.com/stevegrossi/8361585.js"></script>
