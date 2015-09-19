---
title: Unwrapping Rails 4.1 a Little Early
date: 2013-12-22 00:00 EST
tags:
  - rails
---

I know it's not Christmas yet, but I can's help opening one of my presents early: [Rails 4.1 beta][1] from Rails core! There are some cool new features I want to try out, and since 37 Signals is apparently running the beta in production for Basecamp, it has to be pretty darn stable. So let's get to it.

<!--more-->

    # Gemfile
    gem 'rails', '4.1.0.beta1'

But `$ bundle update rails` notifies me that my version of [friendly_id][2] isn't compatible, so

    $ bundle update friendly_id
    $ bundle update rails

And success! But it's short-lived, since after restarting my app server I see

    NameError: undefined method `construct_association' for class `ActiveRecord::Associations::JoinDependency'

The stack trace says it's an issue with Bullet, a handy gem for ActiveRecord query optimization. I see [it's a known issue][3], and since I don't depend on this gem in development, I'll remove it from my Gemfile until they have a fix.

After another `$ bundle install` and server restart, my app loads and the test suite passes in the green without even a deprecation warning (I was pretty dilligent about addressing those when upgrading to Rails 4.0). So that was easy! Let's check out some of those new features.

## Spring: an App Preloader That Just Works

I'd been using [Zeus][4] to preload Rails and cut out the 5-7 seconds of boot time every time I run a test. I've been phenominally impressed with Zeus, but it is a bit hard to explain to other developers I work with who haven't used it:

* you install it as a gem, but for performance reasons you need to keep it out of your Gemfile
* you start and keep it running in a seperate terminal window

I usually explain this in the app's README, but of course people don't always read it. Spring, on the other hand, does the same thing as Zeus, except

* you keep it in your Gemfile like any other gem
* it runs automatically and in the background, so you don't have to manually start and stop it

I'm grateful to Zeus for what are likely hours of waiting it's saved me, but I think I'll be switching over to Spring.

After installing Rails 4.1, I looked in my Gemfile.lock and see Spring isn't included. Apparently, Rails 4.1's inclusion of Spring just means that it's added to the Gemfile for new Rails apps. So I'll be following Spring's [guide for adding it to an existing app][5].

Fortunately, that's as easy as adding `gem 'spring'` to my Gemfile in development (but not the test environment, surprisingly). But after

    $ bundle install
    $ spring rake

Spring says:

> You're using Rubygems 2.0.14 with Spring. Upgrade to at least Rubygems 2.1.0 and run `gem pristine --all` for better startup performance.

Sure, Spring, I'll try that:

    $ gem update --system
    $ gem pristine --all
    $ spring rake

And Spring starts up and runs my test suite without any warnings. Yay! But to test the change in boot time I want to run a single spec file, where a 5-or-so-second difference will be more dramatic than with running my entire suite. So, I try

    $ spring rspec spec/models/post_spec.rb

but Spring doesn't recognize this command. Googling, I see I need another gem, [spring-commands-rspec][6], so I install that, and we're in business. So I time that spec file without Spring

    $ time rspec spec/models/post_spec.rb
    rspec spec/models/post_spec.rb  6.95s user 1.35s system 95% cpu 8.697 total

8\.7 seconds. And now with Spring:

    $ time spring rspec spec/models/post_spec.rb
    spring rspec spec/models/post_spec.rb  0.14s user 0.09s system 2% cpu 8.245 total

8\.2 seconds. The initial run with spring isn't any faster, but Spring's README explains that the first time you invoke Spring, it has to load your application. And sure enough, re-running that last command, I get :

    $ spring rspec spec/models/post_spec.rb
    spring rspec spec/models/post_spec.rb  0.13s user 0.08s system 9% cpu 2.383 total

2\.4 seconds. Could be less, but Spring's definitely doing its job.

Integration with [guard][7] couldn't have been easier for me coming from zeus. I just replaced `cmd: "zeus rspec"` with `cmd: "spring rspec"` in my Guardfile.

## config/secrets.yml

Managing secret tokens in Rails is a bit of a pain because there are so many ways to do it. I was hopeful that Rails 4.1's `secrets.yml` file would show us *The Rails Way* so that there could be some consistency in how this is done, but while it has the virtue making your tokens available anywhere your app runs (unlike Foreman's `.env`, which requires you to `foreman run rake` any tasks that depend on environment variables), `secrets.yml` hasn't solved the problem of deploying secret tokens without commiting `secrets.yml` to source control, especially on platforms like Heroku.

The ideal solution seems to be something like [Figaro][8], which lets you keep secrets in application.yml but, crucially,

1. makes them available as ENV vars in your application (in addition to through Figaro itself with Figaro.env), and
2. on Heroku, has a handy rake task, `rake figaro:heroku` which pushes your app's secrets (according to the Heroku environment) to Heroku as ENV variables.

For now, I'll just switch from the `secret_token.rb` initializer to using `secrets.yml` to keep up with the times, but secrets.yml will just be reading from an ENV var that I'm setting elsewhere.

Alas, simply creating this file didn't do the trick:

    # config/secrets.yml
    secret_key_base: <%= ENV['SECRET TOKEN'] %>

It turns out that keys in `secrets.yml` *must be set by environment*, so this is what ended up working for me:

    # config/secrets.yml
    development:
      secret_key_base: <%= ENV['SECRET TOKEN'] %>
    test:
      secret_key_base: shhhhhhhhhh

Finally, I've added `config/secrets.yml` to my `.gitignore`. While it's not strictly necessary in this case, since there's no sensitive information, if someone clones this repo and adds sensitive information to this file, I don't want them to accidentally commit it.

## ActiveRecord Enums

That's it for what I'll be using in Rails 4.1, but it's packed with lots more features worth checking out in [the release notes][9] or this nice [walkthrough by Coherence.io][10].

While I don't yet have a use for it, Enums in ActiveRecord are very exciting. In the past, I've been frustrated by saving a "status" attribute in the database with values like "pending", "approved", "rejected", etc. If the name of a value needs to change, you're in for a complicated migration, and you have to manually define methods to approve and unaprove content.

With ActiveRecord enums, I could simply do this:

    # app/models/submission.rb
    class Submission < ActiveRecord::Base
      # having migrated the following:
      #   add_column :submissions, :status, :integer, default: 0

      enum status: [:unmoderated, :approved, :rejected]
    end

Integer lookups are faster than strings, so there's a speed boost here, and I can also rename, say, `:rejected` to `:banished` and everything will just work as long as it occupies the same index in the array. But best of all, I automatically get a bunch of handy methods to work with these values like:

    Submission.approved           # => get all by status
    submission.rejected?          # => test a status
    submission.approved!          # => set a status
    submission.status             # => get a status
    submission.status = :rejected # => set a status by name

Several times, I've been bitten by a project requirement that something have two approval states ("approved" and "not approved"), only to later have those requirements change to allow some third state. Moving forward, I think I'll just use an enum with two options from the start, since adding a third option is as simple as adding a value to the end of the enum's array.

 [1]: http://weblog.rubyonrails.org/2013/12/18/Rails-4-1-beta1/
 [2]: https://github.com/norman/friendly_id
 [3]: https://github.com/flyerhzm/bullet/issues/133
 [4]: https://github.com/burke/zeus
 [5]: https://github.com/jonleighton/spring#readme
 [6]: https://github.com/jonleighton/spring-commands-rspec
 [7]: https://github.com/guard/guard
 [8]: https://github.com/laserlemon/figaro
 [9]: http://edgeguides.rubyonrails.org/4_1_release_notes.html
 [10]: http://coherence.io/blog/2013/12/17/whats-new-in-rails-4-1.html
