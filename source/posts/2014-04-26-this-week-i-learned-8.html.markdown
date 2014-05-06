---
title: 'This Week I Learned #8'
date: 2014-04-26 00:00 EDT
tags: security,
---

## How to Password-Protect a Staging Environment

At first I considered making the conditional `if Rails.env.staging?` but by using environment variables, it's easy to enable authentication in any environment (perhaps a production server before launch) without needing to push new code.

    # application_controller.rb
    before_filter :password_protect

    def password_protect
      if ENV['HTTP_USERNAME'] && ENV['HTTP_PASSWORD']
        authenticate_or_request_with_http_basic do |u, p|
          u == ENV['HTTP_USERNAME'] && p == ENV['HTTP_PASSWORD']
        end
      end
    end

## How to Filter Tailed Logs

This is one of those Linux tricks I should have picked up a long time ago, but I'm finally glad I did. When tailing a production log looking for a particular action, I was overwhelmed by the sheer volume of what was being output. Then I realized you can pipe the log output in to `grep` to show only lines matching a string in which you're interested:

    heroku logs -t -r production | grep somethingspecial

Now, I'll only see log lines containing "somethingspecial".

## A Habit for Writing Self-Documenting Code

Extract booleans used in conditionals into variables. This is an idea from Peter Nixey in his excellent post, ["How to be a Great Software Developer"](http://peternixey.com/post/83510597580/how-to-be-a-great-software-developer). This habit not only helps keep line-length manageable when you have long conditionals, but more importantly leads to more readable, intelligble code. What's more, by having to describe what it is you're checking for, you may realize you've missed a case. For example, in transcribing `user.actions.empty?` into the intention-revealing variable `user_is_not_yet_active`, I might realize that there is actually an additional way I had missed in which a user might be considered active.

So instead of

    if (user.created_at < 10.minutes.ago && user.actions.empty?)
      # Do something
    end

consider

    user_is_recently_created = user.created_at < 10.minutes.ago
    user_is_not_yet_active = user.actions.empty?
    
    if user_is_recently_created && user_is_not_yet_active
      # Do something
    end

Of course, if you use these booleans in more than one place, you should consider moving them into the model to keep things DRY:

    # app/models/user.rb
    def recently_created?
      created_at < 10.minutes.ago
    end

    def not_yet_active?
      actions.empty?
    end

So that you can write

    if user.recently_created? && user.not_yet_active?
      # Do something
    end
