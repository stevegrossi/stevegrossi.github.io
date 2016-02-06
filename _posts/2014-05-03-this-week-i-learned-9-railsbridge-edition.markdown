---
title: 'This Week I Learned #9: Railsbridge Edition'
date: 2014-05-03 17:22 EDT
tags:
  - ruby
  - rails
---

This weekend I had the great pleasure of helping out at [Railsbridge Indy](http://www.railsbridgeindy.org/), an event aimed at introducing women to Ruby and Rails. It's the local chapter of [RailsBridge](http://railsbridge.org/), a really cool organization that open-sources all of the curriculum and helps people set up local chapters. Having myself learned Ruby and Rails from others who've generously shared their knowledge online, I was excited for an opportunity to give back and happily learned a few things, too.

<!--more-->

The event really started Friday night with Installfest, where we invite Saturday's participants to stop by [the space](http://speakeasyindy.com/) for pizza and any help they might need getting Git, Ruby, Rails, a text editor, and accounts on Github and Heroku set up. I heard that last year's was a challenge when someone brought a Chromebook, but this year's went off without too many issues. The fact that [Railsinstaller](http://railsinstaller.org/) supports Windows now was a big help. We did discover a few places where [the curriculum](http://docs.railsbridge.org/installfest/) could have been clearer, but the great thing about open source is that we can just submit a pull request with an update.

Kudos to the Railsbridge folks (and its many contributors) for keeping the curriculum up-to-date. I was excited to see that it's geared toward the latest version of Rails, thanks to which I learned that with routes, **`root` now takes a 'controller#action' string** as well as a hash, so that:

```ruby
# config/routes.rb
root to: 'pages#home'

# can now just be
root 'pages#home'
```

Sure, you're saving only 4 characters, but they add up.

After opening remarks by our tireless organizer, [Anna](https://twitter.com/Annamul), we broke into small groups based roughly around familiarity with programming. Another volunteer, Becky, and I led the group with the most familiarity: two database administrators and a mainframe programmer, all of whom I learned a thing or two from. The first thing I learned right away as we went over Ruby's data types and operators in the irb console. Having covered strings and integer multiplication, Anuja tried **multiplying a string by an integer**, which I was surprised to learn works:

```ruby
'hello' * 4
#=> 'hellohellohellohello'
```

It doesn't work the other way around, though (i.e. no `4 * 'hello'`) which led us to an interesting discussion of how most operators are methods in Ruby (`'hello' * 4` is basically `'hello'.*(4)`) and classes like Integer and String can define that method in different ways. String#* accepts an integer, whereas Integer#* does not accept a string.

It didn't take long for our group of coders to get familiar with Ruby's syntax, after which we dove right in to building and deploying a Rails app. This year's app was Suggestotron, an app for suggesting and voting on topics. Development took only a few hours, which gave me a deeper appreciation for Rails. Sure, it makes sense to and empowers me with the years of experience I have using it, but it definitely did the same for our group members who'd just learned Ruby only an hour before. That really impressed me.

One final thing I learned I owe to David, another of the volunteers. It's definitely a best practice to run migrations forward and backward in development, since the absolute worst time to learn your migration doesn't work in reverse is when you need to do an emergency rollback in production. Thankfully, Rails has a shortcut to make this a little easier: **`rake db:migrate:redo`, which just does a rollback and a migrate**.

    # So instead of this in the command line
    $ rake db:migrate
    $ rake db:rollback
    $ rake db:migrate

    # You can just do this:
    $ rake db:migrate
    $ rake db:migrate:redo

Thanks, David! And thanks to Anna for organizing RailsBridge Indy, to the event sponsors, and to all of the intrepid folks who came out to learn what Ruby and Rails are all about.
